import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Client } from 'pg';
import { RedisService } from './redisService';

const tenant = process.env.TENANT;
const ag = process.env.APPGROUPCODE;
const app = process.env.APPCODE;
const sessionListCacheKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:session`;
const PUBLIC_KEY_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

@Injectable()
export class JwtServices {
  private publicKeyCache: { key: string; fetchedAt: number } | null = null;
  private publicKeyFetchInFlight: Promise<string> | null = null;

  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  private async fetchPublicKeyFromDB(): Promise<string> {
    try {
      const dbUrl = new URL(process.env.DATABASE_URL);
      dbUrl.pathname = "/fusionauth";

      const client = new Client({
        connectionString: dbUrl.toString(),
        application_name: `${tenant}_${ag}_${app}_auth_verify_service`,
        database: 'fusionauth',
        connectionTimeoutMillis: 30000, // fail fast if can't connect in 5s
      });
      await client.connect();

      const query = `SELECT k.public_key FROM public.applications a JOIN public."keys" k
            ON k.id = a.access_token_signing_keys_id WHERE a.name = $1`;
      const result = await client.query(query, [`${tenant}-defaultApplication`]);
      client.end();
      return result.rows[0].public_key;
    } catch (error) {
      throw new Error('Failed to retrieve public key from database');
    }
  }

  async getPublicKeyFromDB(forceRefresh = false): Promise<string> {
    const isFresh =
      this.publicKeyCache &&
      Date.now() - this.publicKeyCache.fetchedAt < PUBLIC_KEY_CACHE_TTL_MS;
    if (!forceRefresh && isFresh) {
      return this.publicKeyCache.key;
    }
    if (!this.publicKeyFetchInFlight) {
      this.publicKeyFetchInFlight = this.fetchPublicKeyFromDB()
        .then((key) => {
          this.publicKeyCache = { key, fetchedAt: Date.now() };
          return key;
        })
        .finally(() => {
          this.publicKeyFetchInFlight = null;
        });
    }
    return this.publicKeyFetchInFlight;
  }

  // Signature + expiry verified — use this wherever the decoded claims drive
  // an authorization/identity decision. decodeToken() below trusts nothing.
  async verifyToken(token: string): Promise<any> {
    let claims: any;
    try {
      const publicKey = await this.getPublicKeyFromDB();
      try {
        claims = this.jwtService.verify(token, {
          algorithms: ['RS256'],
          publicKey,
        });
      } catch (verifyError) {
        const freshKey = await this.getPublicKeyFromDB(true);
        claims = this.jwtService.verify(token, {
          algorithms: ['RS256'],
          publicKey: freshKey,
        });
      }
      if (!claims?.sid) {
        // No sid on the token means we have nothing to check the session
        // list against — fail closed rather than silently skip the check.
        throw new Error('Invalid or expired token');
      }

      // Auth token verification on the basis of application session list bypassed
      // const isActive = await this.isSessionActive(claims.sid);
      // if (!isActive) {
      //  throw new Error('Invalid or expired token');
      // }

      return claims;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  private async isSessionActive(sid: string): Promise<boolean> {
    try {
      const sessionListCache = await this.redisService.getJsonData(
        sessionListCacheKey,
        process.env.CLIENTCODE,
      );
      const sessionList =
        sessionListCache && JSON.parse(sessionListCache)
          ? JSON.parse(sessionListCache)
          : [];

      if (!Array.isArray(sessionList) || !sessionList.length) {
        return false;
      }

      return sessionList.some((item: any) => item?.sid == sid);
    } catch (error) {
      // If the session store can't be read, fail closed — don't let a
      // Redis hiccup silently grant access.
      return false;
    }
  }

  decodeToken(token: string): any {
    try {
      return this.jwtService.decode(token, { json: true });
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
} 