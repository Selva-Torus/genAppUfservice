"use server";
const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.NEXT_PUBLIC_REDIS_HOST,
  port: process.env.NEXT_PUBLIC_REDIS_PORT,
});

module.exports = redis;
