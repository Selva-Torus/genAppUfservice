import * as dns from 'dns';
import * as net from 'net';
import * as http from 'http';
import * as https from 'https';
import { CustomException } from '../customException';

// Shared SSRF guard for every outbound call this server makes to a
// caller/tenant-configurable URL. Mandatory, fail-closed: OUTBOUND_HOST_ALLOWLIST
// must be set, or every outbound call is rejected. There is no opt-out — an
// operator must explicitly enumerate the hosts this server is allowed to reach
// outbound. Kept as one copy (common.Service.ts and the scheduler's HttpHandler
// both call it) so the two call sites can't drift out of sync.
export function assertAllowedOutboundHost(url: string): void {
  const allowlist = (process.env.OUTBOUND_HOST_ALLOWLIST || '')
    .split(',')
    .map(h => h.trim().toLowerCase())
    .filter(Boolean);
  if (!allowlist.length) {
    throw new CustomException('OUTBOUND_HOST_ALLOWLIST is not configured; outbound requests are denied by default', 500);
  }
  let hostname: string;
  try {
    hostname = new URL(url).hostname.toLowerCase();
  } catch (e) {
    throw new CustomException(`Invalid outbound URL: ${url}`, 400);
  }
  const isAllowed = allowlist.some(h => hostname === h || hostname.endsWith(`.${h}`));
  if (!isAllowed) {
    throw new CustomException(`Outbound host not allow-listed: ${hostname}`, 400);
  }
}

// ---------------------------------------------------------------------------
// Defense-in-depth private/reserved address blocking. This runs unconditionally
// (no allowlist opt-out) because it protects against SSRF to internal
// infrastructure (cloud metadata, RFC1918 ranges, etc.) regardless of whether
// an operator has configured OUTBOUND_HOST_ALLOWLIST. It covers:
//   - RFC1918 private ranges + loopback/link-local/CGNAT/multicast/reserved IPv4
//   - IPv6 loopback/link-local/unique-local/multicast + IPv4-mapped/NAT64/6to4/
//     Teredo embedded-IPv4 addresses, decoded and re-checked against the IPv4
//     rules (Teredo's client address is XOR-obfuscated per RFC 4380 and is
//     un-obfuscated before checking)
//   - alternate IPv4 literal encodings (decimal/octal/hex/short form) — these
//     are normalized to dotted-decimal by the WHATWG URL parser before this
//     ever runs, so `new URL(x).hostname` is always the canonical form
// It is intentionally IP-based, not hostname-based, so it can validate both
// literal IPs supplied directly and the addresses a DNS name resolves to.
// ---------------------------------------------------------------------------

function ipv4ToInt(ip: string): number {
  const parts = ip.split('.').map(Number);
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function isPrivateOrReservedIPv4(ip: string): boolean {
  if (!net.isIPv4(ip)) return false;
  const n = ipv4ToInt(ip);
  const inRange = (base: string, maskBits: number) => {
    const baseInt = ipv4ToInt(base);
    const mask = maskBits === 0 ? 0 : (0xffffffff << (32 - maskBits)) >>> 0;
    return (n & mask) === (baseInt & mask);
  };
  return (
    inRange('0.0.0.0', 8) ||       // "this" network
    inRange('10.0.0.0', 8) ||      // RFC1918
    inRange('100.64.0.0', 10) ||   // shared address space / CGNAT
    inRange('127.0.0.0', 8) ||     // loopback
    inRange('169.254.0.0', 16) ||  // link-local (incl. cloud metadata 169.254.169.254)
    inRange('172.16.0.0', 12) ||   // RFC1918
    inRange('192.0.0.0', 24) ||    // IETF protocol assignments
    inRange('192.0.2.0', 24) ||    // documentation (TEST-NET-1)
    inRange('192.88.99.0', 24) ||  // 6to4 relay anycast
    inRange('192.168.0.0', 16) ||  // RFC1918
    inRange('198.18.0.0', 15) ||   // benchmarking
    inRange('198.51.100.0', 24) || // documentation (TEST-NET-2)
    inRange('203.0.113.0', 24) ||  // documentation (TEST-NET-3)
    inRange('224.0.0.0', 4) ||     // multicast
    inRange('240.0.0.0', 4)        // reserved incl. broadcast
  );
}

// Expands a literal IPv6 address (any valid textual form, including one with
// a trailing embedded IPv4 dotted-quad) into its 128-bit integer value.
function ipv6ToBigInt(ip: string): bigint {
  let hostname = ip;
  const lastColon = hostname.lastIndexOf(':');
  const maybeV4 = lastColon !== -1 ? hostname.slice(lastColon + 1) : '';
  if (net.isIPv4(maybeV4)) {
    const v4Int = ipv4ToInt(maybeV4);
    const hex = v4Int.toString(16).padStart(8, '0');
    hostname = hostname.slice(0, lastColon + 1) + hex.slice(0, 4) + ':' + hex.slice(4);
  }
  let left: string, right: string | undefined;
  if (hostname.includes('::')) {
    const idx = hostname.indexOf('::');
    left = hostname.slice(0, idx);
    right = hostname.slice(idx + 2);
  } else {
    left = hostname;
    right = undefined;
  }
  const leftParts = left ? left.split(':').filter(Boolean) : [];
  const rightParts = right ? right.split(':').filter(Boolean) : [];
  const missing = 8 - leftParts.length - rightParts.length;
  const allParts = [...leftParts, ...Array(Math.max(missing, 0)).fill('0'), ...rightParts];
  let result = 0n;
  for (const part of allParts) {
    result = (result << 16n) | BigInt(parseInt(part || '0', 16));
  }
  return result;
}

function isPrivateOrReservedIPv6(ip: string): boolean {
  let hostname = ip;
  if (hostname.startsWith('[') && hostname.endsWith(']')) {
    hostname = hostname.slice(1, -1);
  }
  if (!net.isIPv6(hostname)) return false;
  const val = ipv6ToBigInt(hostname);
  const inRange = (baseHex128: string, prefixBits: number) => {
    const base = BigInt('0x' + baseHex128);
    const shift = BigInt(128 - prefixBits);
    const mask = prefixBits === 0 ? 0n : ((1n << BigInt(prefixBits)) - 1n) << shift;
    return (val & mask) === (base & mask);
  };
  const embeddedIPv4 = () => {
    const v4 = Number(val & 0xffffffffn);
    return [24, 16, 8, 0].map(s => (v4 >>> s) & 0xff).join('.');
  };
  // Extracts a 32-bit IPv4 chunk starting `bitOffset` bits from the MSB,
  // optionally XOR-obfuscated (Teredo obfuscates its embedded addresses).
  const ipv4At = (bitOffset: number, xorObfuscated = false) => {
    const shift = BigInt(128 - bitOffset - 32);
    let chunk = Number((val >> shift) & 0xffffffffn);
    if (xorObfuscated) chunk = (~chunk) >>> 0;
    return [24, 16, 8, 0].map(s => (chunk >>> s) & 0xff).join('.');
  };
  if (val === 0n) return true; // ::  (unspecified)
  if (val === 1n) return true; // ::1 (loopback)
  if (inRange('00000000000000000000ffff00000000', 96)) return isPrivateOrReservedIPv4(embeddedIPv4()); // ::ffff:a.b.c.d
  if (inRange('0064ff9b000000000000000000000000', 96)) return isPrivateOrReservedIPv4(embeddedIPv4()); // 64:ff9b::/96 (NAT64)
  if (inRange('20020000000000000000000000000000', 16)) return isPrivateOrReservedIPv4(ipv4At(16)); // 2002::/16 (6to4), embeds IPv4 in bits 16-47
  if (inRange('20010000000000000000000000000000', 32)) {
    // Teredo (2001::/32): bits 32-63 = server IPv4 (plain), bits 96-127 = client IPv4 (XORed with 0xFFFFFFFF)
    return isPrivateOrReservedIPv4(ipv4At(32)) || isPrivateOrReservedIPv4(ipv4At(96, true));
  }
  if (inRange('fc000000000000000000000000000000', 7)) return true;  // fc00::/7 (unique local)
  if (inRange('fe800000000000000000000000000000', 10)) return true; // fe80::/10 (link-local)
  if (inRange('ff000000000000000000000000000000', 8)) return true;  // ff00::/8 (multicast)
  if (inRange('20010db8000000000000000000000000', 32)) return true; // 2001:db8::/32 (documentation)
  return false;
}

// Accepts an IP literal (v4 or v6, brackets optional) and reports whether it
// falls in a private/reserved/internal range that must never be reachable
// through a caller-controlled outbound fetch.
export function isPrivateOrReservedAddress(ip: string): boolean {
  const unbracketed = ip.startsWith('[') && ip.endsWith(']') ? ip.slice(1, -1) : ip;
  if (net.isIPv4(unbracketed)) return isPrivateOrReservedIPv4(unbracketed);
  if (net.isIPv6(unbracketed)) return isPrivateOrReservedIPv6(unbracketed);
  return false;
}

interface SafeAddress {
  address: string;
  family: 4 | 6;
}

// Resolves `hostname` to a single vetted, non-private address. For literal
// IPs this just validates the literal. For DNS names, every address the name
// resolves to is checked — if any of them is private/reserved the whole
// lookup is rejected (a name that resolves to both a public and an internal
// address is exactly the shape of a DNS-rebinding attempt, so treat it as
// unsafe rather than picking the "good" address).
async function resolveSafeAddress(hostname: string): Promise<SafeAddress> {
  const unbracketed = hostname.startsWith('[') && hostname.endsWith(']') ? hostname.slice(1, -1) : hostname;
  if (net.isIP(unbracketed)) {
    if (isPrivateOrReservedAddress(unbracketed)) {
      throw new CustomException(`Download target not allowed: ${hostname}`, 400);
    }
    return { address: unbracketed, family: net.isIPv6(unbracketed) ? 6 : 4 };
  }
  let records: dns.LookupAddress[];
  try {
    records = await dns.promises.lookup(unbracketed, { all: true, verbatim: true });
  } catch (e) {
    throw new CustomException(`Unable to resolve download host: ${hostname}`, 400);
  }
  if (!records.length) {
    throw new CustomException(`Unable to resolve download host: ${hostname}`, 400);
  }
  if (records.some(r => isPrivateOrReservedAddress(r.address))) {
    throw new CustomException(`Download target not allowed: ${hostname}`, 400);
  }
  const chosen = records[0];
  return { address: chosen.address, family: chosen.family === 6 ? 6 : 4 };
}

export interface SafeFetchResult {
  statusCode: number;
  headers: http.IncomingHttpHeaders;
  body: Buffer;
  finalUrl: string;
}

const MAX_REDIRECTS = 5;
const REQUEST_TIMEOUT_MS = 20000;
const MAX_RESPONSE_BYTES = 100 * 1024 * 1024; // 100MB

// SSRF-hardened GET: resolves DNS itself, rejects private/reserved targets
// (unconditionally — this is the defense-in-depth layer, independent of
// OUTBOUND_HOST_ALLOWLIST), and pins the actual TCP connection to the exact
// address it validated via a custom `lookup`. Without that pin, an attacker
// controlling the DNS name could pass validation with a public address and
// then have the *second*, independent resolution done at connect time
// return an internal address instead (DNS rebinding) — pinning removes that
// race entirely. Redirects are followed manually so each hop is re-validated
// rather than trusted from the Location header.
export async function safeFetchBuffer(targetUrl: string, redirectsLeft = MAX_REDIRECTS): Promise<SafeFetchResult> {
  let parsed: URL;
  try {
    parsed = new URL(targetUrl);
  } catch (e) {
    throw new CustomException(`Invalid download URL: ${targetUrl}`, 400);
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new CustomException(`Unsupported download protocol: ${parsed.protocol}`, 400);
  }
  const hostname = parsed.hostname;
  const safeAddress = await resolveSafeAddress(hostname);
  const transport = parsed.protocol === 'https:' ? https : http;

  const result = await new Promise<SafeFetchResult>((resolve, reject) => {
    const req = transport.request(
      {
        protocol: parsed.protocol,
        hostname,
        host: hostname,
        port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
        path: parsed.pathname + parsed.search,
        method: 'GET',
        servername: parsed.protocol === 'https:' ? hostname : undefined,
        timeout: REQUEST_TIMEOUT_MS,
        // Pin the connection to the exact address validated above instead of
        // letting Node re-resolve `hostname` independently at connect time.
        lookup: (_host, options, callback) => {
          if (options && (options as any).all) {
            callback(null, [{ address: safeAddress.address, family: safeAddress.family }] as any);
          } else {
            callback(null, safeAddress.address, safeAddress.family);
          }
        },
      },
      (res) => {
        const chunks: Buffer[] = [];
        let received = 0;
        res.on('data', (chunk: Buffer) => {
          received += chunk.length;
          if (received > MAX_RESPONSE_BYTES) {
            req.destroy();
            reject(new CustomException('Download response too large', 400));
            return;
          }
          chunks.push(chunk);
        });
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode || 0,
            headers: res.headers,
            body: Buffer.concat(chunks),
            finalUrl: targetUrl,
          });
        });
        res.on('error', reject);
      },
    );
    req.on('timeout', () => {
      req.destroy(new CustomException('Download request timed out', 400));
    });
    req.on('error', (e) => {
      reject(e instanceof CustomException ? e : new CustomException(`Download failed: ${e.message}`, 400));
    });
    req.end();
  });

  const isRedirect = [301, 302, 303, 307, 308].includes(result.statusCode);
  if (isRedirect && result.headers.location) {
    if (redirectsLeft <= 0) {
      throw new CustomException('Too many redirects', 400);
    }
    const nextUrl = new URL(result.headers.location, targetUrl).toString();
    return safeFetchBuffer(nextUrl, redirectsLeft - 1);
  }

  return result;
}
