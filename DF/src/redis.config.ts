import Redis from 'ioredis';

export interface RedisConnectionOptions {
  host: string;
  port: number;
  username: string;
  password: string;
}

// Single source of truth for the Redis connection — every ioredis client,
// BullMQ Queue/Worker/QueueEvents connection, and Redlock client in this
// service must build its options from here instead of re-reading
// process.env.HOST/PORT/REDISUSER/REDISPASSWORD independently.
export function getRedisConnectionOptions(): RedisConnectionOptions {
  return {
    host: process.env.HOST,
    port: parseInt(process.env.PORT),
    username: process.env.REDISUSER,
    password: process.env.REDISPASSWORD,
  };
}

let sharedClient: Redis | null = null;

// RedisService and LockService are both registered as providers in dozens
// of feature modules, so Nest constructs a separate instance of each per
// module — without memoizing the client here, every one of those instances
// would open its own TCP connection to Redis instead of sharing one.
export function getRedisClient(): Redis {
  if (!sharedClient) {
    sharedClient = new Redis(getRedisConnectionOptions());
    sharedClient.on('error', (err) => {
      console.error('Redis Client Error', err);
    });
  }
  return sharedClient;
}
