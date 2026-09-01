import * as net from 'net';
import * as tls from 'tls';

/**
 * Applies a Postgres `sslmode` to a Prisma connection URL if — and only if
 * — the URL doesn't already specify one. Used by prisma.service.ts /
 * cdc_prisma.service.ts.
 *
 * Default mode is `prefer`: per the Postgres/Prisma sslmode contract this
 * negotiates TLS when the server offers it and transparently falls back to
 * a plaintext connection when it doesn't — Prisma's query engine
 * implements this fallback itself, so setting it is always safe here.
 * Set the mode env var to `require`, `verify-ca`, or `verify-full` once the
 * target database is known to be TLS-capable, to enforce it end to end.
 */
export function applyPgSslMode(url: URL, modeEnvVar: string, defaultMode: string = 'prefer'): void {
  if (url.searchParams.has('sslmode') || url.searchParams.has('ssl')) return;
  const mode = process.env[modeEnvVar] || defaultMode;
  url.searchParams.set('sslmode', mode);
}

// ---------------------------------------------------------------------------
// Flow-engine connectors (dbconfig()/mongodbconfig()/procedureConfig() in
// common.Service.ts) — dynamically-resolved, per-tenant external
// connectors whose TLS-readiness isn't known ahead of time.
//
// Neither the raw `pg` driver nor the `mongodb` driver implement Postgres's
// `sslmode=prefer` fallback themselves: once TLS is requested, both hard-
// fail the connection if the target doesn't speak TLS (pg: "The server
// does not support SSL connections", node_modules/pg/lib/connection.js;
// mongodb: the TLS handshake itself times out/resets). So `prefer`
// semantics have to be implemented here explicitly — probe whether the
// target speaks TLS with a short, cheap, connection-free check, and only
// request TLS on the real connection when the probe says yes. This is the
// same idea as Prisma's built-in fallback, just done by hand for drivers
// that don't do it natively — real default-on encryption, not an opt-in
// knob, with no risk of breaking a target that doesn't support TLS.
// ---------------------------------------------------------------------------

const PROBE_TIMEOUT_MS = 1500;
const PROBE_CACHE_TTL_MS = 5 * 60 * 1000;
const probeCache = new Map<string, { supported: boolean; expiresAt: number }>();

function getCachedProbe(key: string): boolean | undefined {
  const hit = probeCache.get(key);
  if (!hit) return undefined;
  if (hit.expiresAt <= Date.now()) {
    probeCache.delete(key);
    return undefined;
  }
  return hit.supported;
}

function setCachedProbe(key: string, supported: boolean): void {
  probeCache.set(key, { supported, expiresAt: Date.now() + PROBE_CACHE_TTL_MS });
}

// Postgres's SSLRequest packet: 8-byte length prefix + the fixed SSL
// negotiation code (80877103). The server replies with a single byte —
// 'S' (0x53) if it accepts SSL, 'N' (0x4e) if it doesn't — before any
// startup/auth traffic is exchanged, so this never touches credentials.
const PG_SSL_REQUEST = Buffer.from([0x00, 0x00, 0x00, 0x08, 0x04, 0xd2, 0x16, 0x2f]);

/**
 * Cheap, credential-free check for whether a Postgres endpoint accepts
 * SSL. On any ambiguity (timeout, refused, DNS failure) this resolves
 * `false` — i.e. "assume no TLS, connect in plaintext as before" — so a
 * genuinely unreachable host fails exactly the way it does today (via the
 * caller's own real connect() attempt) instead of the probe masking or
 * delaying that failure by more than PROBE_TIMEOUT_MS.
 */
export function probePgTlsSupport(host: string, port: number): Promise<boolean> {
  const cacheKey = `pg:${host}:${port}`;
  const cached = getCachedProbe(cacheKey);
  if (cached !== undefined) return Promise.resolve(cached);

  return new Promise((resolve) => {
    const socket = new net.Socket();
    let settled = false;
    const finish = (supported: boolean) => {
      if (settled) return;
      settled = true;
      setCachedProbe(cacheKey, supported);
      socket.destroy();
      resolve(supported);
    };

    socket.setTimeout(PROBE_TIMEOUT_MS);
    socket.once('timeout', () => finish(false));
    socket.once('error', () => finish(false));
    socket.once('connect', () => socket.write(PG_SSL_REQUEST));
    socket.once('data', (chunk) => finish(chunk.length > 0 && chunk[0] === 0x53 /* 'S' */));
    socket.connect(port, host);
  });
}

/**
 * Cheap check for whether a MongoDB endpoint accepts a TLS handshake.
 * Postgres-style in-band negotiation doesn't exist for Mongo's wire
 * protocol, so this attempts the TLS handshake itself (no Mongo wire
 * protocol traffic, no auth) and tears the socket down immediately —
 * cheaper than a full MongoClient connection attempt, and never sends
 * credentials. `rejectUnauthorized: false` here only decides whether the
 * *probe* accepts the server's certificate; the real connection below
 * still gets a fresh, normally-configured driver connection.
 *
 * Note: a server that requires mutual TLS (a client certificate) will
 * still fail at the real connection step even though this probe reports
 * `true` — that's a real, surfaced connection error at connect time, same
 * as if `tls=true` had been set by hand; a lightweight probe can't verify
 * full driver-level compatibility, only that the endpoint speaks TLS.
 */
export function probeMongoTlsSupport(host: string, port: number): Promise<boolean> {
  const cacheKey = `mongo:${host}:${port}`;
  const cached = getCachedProbe(cacheKey);
  if (cached !== undefined) return Promise.resolve(cached);

  return new Promise((resolve) => {
    let settled = false;
    let socket: tls.TLSSocket;
    const finish = (supported: boolean) => {
      if (settled) return;
      settled = true;
      setCachedProbe(cacheKey, supported);
      try { socket.destroy(); } catch { /* already gone */ }
      resolve(supported);
    };

    socket = tls.connect({ host, port, rejectUnauthorized: false, timeout: PROBE_TIMEOUT_MS }, () => finish(true));
    socket.once('timeout', () => finish(false));
    socket.once('error', () => finish(false));
  });
}

/**
 * Resolves the sslmode a Postgres connector connection should use.
 *
 * Precedence, highest first:
 *  1. The connection string already specifies sslmode/ssl — never
 *     overridden (an operator or the connector's own config wins).
 *  2. `overrideEnvVar` is set — applied verbatim with no probing, so ops
 *     can force `verify-full` (or force plaintext with `disable`) once a
 *     specific target's TLS posture is known for certain.
 *  3. Otherwise, probe the target and set `sslmode=require` only if the
 *     probe confirms TLS support; leave the URL untouched if not.
 *
 * Never throws on a value that isn't a real URL — dbUrl can legitimately
 * be a bare host string here (see the `dbUrl = dbConfig?.host` fallback
 * branches in common.Service.ts), which is passed through unchanged.
 */
export async function negotiatePgTls(dbUrl: string, overrideEnvVar: string): Promise<string> {
  if (!dbUrl) return dbUrl;
  let url: URL;
  try {
    url = new URL(dbUrl);
  } catch {
    return dbUrl;
  }
  if (url.searchParams.has('sslmode') || url.searchParams.has('ssl')) return dbUrl;

  const port = Number(url.port) || 5432;
  // Same `env var || default` shape as applyPgSslMode()'s Prisma fix: an
  // explicit override always wins (short-circuits `||`, so the probe below
  // never even runs); with nothing set, the right-hand side IS the default
  // that runs on every call — a live TLS probe of the target, defaulting
  // to 'require' whenever it confirms support.
  const mode = process.env[overrideEnvVar] || ((await probePgTlsSupport(url.hostname, port)) ? 'require' : undefined);
  if (mode && mode !== 'disable') url.searchParams.set('sslmode', mode);
  return url.toString();
}

/**
 * Same precedence/negotiation as negotiatePgTls(), for MongoDB connector
 * URLs. `overrideEnvVar` set to `'false'`/`'disable'` forces plaintext
 * (skips probing); any other truthy value forces `tls=true` without
 * probing; unset means "probe and decide".
 */
export async function negotiateMongoTls(mongoUrl: string, overrideEnvVar: string): Promise<string> {
  if (!mongoUrl) return mongoUrl;
  let url: URL;
  try {
    url = new URL(mongoUrl);
  } catch {
    return mongoUrl;
  }
  if (url.searchParams.has('tls') || url.searchParams.has('ssl')) return mongoUrl;

  const port = Number(url.port) || 27017;
  // Same `env var || default` shape as negotiatePgTls() above: an explicit
  // override wins and skips probing entirely; with nothing set, the probe
  // on the right-hand side is what runs by default on every call.
  const mode = process.env[overrideEnvVar] || ((await probeMongoTlsSupport(url.hostname, port)) ? 'true' : undefined);
  if (mode && mode !== 'false' && mode !== 'disable') url.searchParams.set('tls', 'true');
  return url.toString();
}
