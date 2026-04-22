import { Logger } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';
const Redis = require('ioredis');

const logger = new Logger('MongoDB');


const client = new MongoClient(process.env.MONGODB_URL,{
      maxPoolSize: 100,              //  Increased to handle 100 concurrent operations
      minPoolSize: 10,               //  Keep 10 connections ready
      maxIdleTimeMS: 60000,          //  Keep idle connections for 60s
      serverSelectionTimeoutMS: 30000, //  Increased to 30s
      socketTimeoutMS: 60000,        //  Increased to 60s to prevent timeouts
      connectTimeoutMS: 30000,       //  Increased to 30s
      retryWrites: true,
      retryReads: true
    });
let db: Db;
let redis //: Redis


const RECONNECT_INTERVAL = 5000; // 5 seconds
const MAX_RECONNECT_ATTEMPTS = 10;
let isConnecting = false;

export const connectToMongo = async (attemptCount = 0): Promise<Db> => {
  // If already connected, return existing connection
if (db && client) {
    try {
      // Ping the database to check if connection is alive
      await client.db('admin').admin().ping();
      return db;
    } catch (error) {
      logger.warn('Connection check failed, reconnecting...');
    }
  }

  // Prevent multiple simultaneous connection attempts
  if (isConnecting) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return connectToMongo(attemptCount);
  }

  isConnecting = true;

  try {
    // Close existing client if it exists
    if (client) {
      await client.close();
    }

    // Create new client with automatic reconnection options

    await client.connect();
    db = client.db(process.env.MONGODB_NAME);

    //logger.log('MongoDB connected successfully');

    // Setup event listeners for connection monitoring
    setupConnectionListeners();

    isConnecting = false;
    return db;

  } catch (error) {
    isConnecting = false;
    logger.error(`MongoDB connection failed (Attempt ${attemptCount + 1}/${MAX_RECONNECT_ATTEMPTS})`, error.message);

    if (attemptCount < MAX_RECONNECT_ATTEMPTS) {
      logger.warn(`Retrying connection in ${RECONNECT_INTERVAL / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RECONNECT_INTERVAL));
      return connectToMongo(attemptCount + 1);
    } else {
      throw new Error('Max reconnection attempts reached. Unable to connect to MongoDB.');
    }
  }
};

const setupConnectionListeners = () => {
  if (!client) return;

  // Remove existing listeners to prevent duplicates
  client.removeAllListeners();

  // Connection closed
  client.on('close', () => {
    logger.warn('MongoDB connection closed');
    handleReconnection();
  });

  // Connection error
  client.on('error', (error) => {
    logger.error('MongoDB connection error:', error.message);
    handleReconnection();
  });

  // Topology closed
  client.on('topologyClose', () => {
    logger.warn('MongoDB topology closed');
    handleReconnection();
  });

  // Server heartbeat failed
  client.on('serverHeartbeatFailed', (event) => {
    logger.warn('MongoDB heartbeat failed:', event);    
  });
};

const handleReconnection = async () => {
  if (isConnecting) return;

  logger.log('🔄 Attempting to reconnect to MongoDB...');

  try {
    await connectToMongo();
  } catch (error) {
    logger.error('Failed to reconnect to MongoDB:', error.message);
  }
};



export const connectToRedis = async () => {

  if (!redis) {
    redis = new Redis({
      host: process.env.HOST,
      port: parseInt(process.env.PORT),
      // ✅ Connection pool and reliability settings
      maxRetriesPerRequest: 3,        // Retry failed commands 3 times
      enableReadyCheck: true,          // Check connection before commands
      retryStrategy(times) {           // Exponential backoff retry
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      reconnectOnError(err) {          // Reconnect on specific errors
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
          return true; // Reconnect
        }
        return false;
      },
      lazyConnect: false,              // Connect immediately
      enableOfflineQueue: true,        // Queue commands when disconnected
      connectTimeout: 30000,           // 30s connection timeout
      keepAlive: 30000,                // Keep connection alive
      family: 4,                       // Use IPv4
    }).on('error', (err) => {
      console.log('Redis Client Error', err);
      // Don't throw, let retry logic handle it
    }).on('ready', () => {
      console.log('✅ Redis connected successfully');
    }).on('reconnecting', () => {
      console.log('🔄 Redis reconnecting...');
    });
  }
};

let lastHealthCheck = Date.now();
const HEALTH_CHECK_INTERVAL = 30000; // Only ping every 30 seconds

export const getDb = async (): Promise<Db> => {
  if (!db || !client) {
    logger.warn('Database not connected, attempting to connect...');
    return await connectToMongo();
  }

  // Only verify connection periodically to reduce overhead
  const now = Date.now();
  if (now - lastHealthCheck > HEALTH_CHECK_INTERVAL) {
    try {
      await client.db('admin').admin().ping();
      lastHealthCheck = now;
    } catch (error) {
      logger.warn('Connection lost, reconnecting...');
      return await connectToMongo();
    }
  }

  return db;
};

// export const getDb = (): Db => {
//   if (!db) throw new Error('MongoDB not initialized. Call connectToMongo() first.');
//   return db;
// };

export const getRedis = (): any => {
  if (!redis) throw new Error('Redis not initialized. Call connectToRedis() first.');
  return redis;
};