import { Injectable } from '@nestjs/common';
import Redlock from 'redlock';
import { getRedisClient } from "./redis.config";

@Injectable()
export class LockService {
  private redlock: Redlock;

  constructor() {
    // Shared across every module that registers LockService as a provider —
    // see redis.config.ts.
    this.redlock = new Redlock([getRedisClient()], {
      retryCount:  parseInt(process.env.RETRYCOUNT || '3'),
      retryDelay:  parseInt(process.env.RETRYDELAY || '200'), // time in ms
      retryJitter:  parseInt(process.env.RETRYJITTER || '100'), // time in ms
    });

    this.redlock.on('clientError', (err) => {
      console.error('A Redis error has occurred:', err);
    });
  }

  async acquireLock(resource: string[], ttl: number) {
    return await this.redlock.acquire(resource, ttl);
  }
  async releaseLock(lock) {
    return await lock.release();
  }

}
