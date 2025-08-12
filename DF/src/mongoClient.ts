import { MongoClient, Db } from 'mongodb';
const Redis = require('ioredis');

const client = new MongoClient(process.env.MONGODB_URL);
let db: Db;
let redis //: Redis

export const connectToMongo = async () => {
  if (!db) {
    await client.connect();
    db = client.db(process.env.MONGODB_NAME);
    console.log('✅ MongoDB connected');
    // return 'MongoDB connected'
  }
};

export const connectToRedis = async () => {
  console.log('REDIS',redis);
  
  if (!redis) {
    redis = new Redis({
      host: process.env.HOST,
      port: parseInt(process.env.PORT),      
    }).on('error', (err) => {
      console.log('Redis Client Error', err);
      throw err;
    });
  }
};

export const getDb = (): Db => {
  if (!db) throw new Error('MongoDB not initialized. Call connectToMongo() first.');
  return db;
};

export const getRedis = (): any => {
  if (!redis) throw new Error('Redis not initialized. Call connectToRedis() first.');
  return redis;
};