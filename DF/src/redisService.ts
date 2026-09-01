import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { getRedisConnectionOptions, getRedisClient } from './redis.config';
import 'dotenv/config';
import { Queue, QueueOptions } from 'bullmq';

@Injectable()
export class RedisService implements OnModuleInit {
  private readonly BATCH_SIZE = 10000
  private queues: Map<string, Queue> = new Map();
  private redis: Redis;

  onModuleInit() {
    // Shared across every module that registers RedisService as a provider —
    // see redis.config.ts. Do not call this.redis.quit() from an instance
    // lifecycle hook; other instances still hold the same client.
    this.redis = getRedisClient();
  }


  //Retrieves JSON data from Redis
  /**
  * Retrieves JSON data from Redis.
  * @param key The key used to identify the JSON data in Redis.
  * @returns The JSON data retrieved from Redis.
  * @throws {Error} If there is an error retrieving the JSON data.
  */

  getQueue(queueName: string, key: string, value: any): void {
    const jobId = key?.split(':').join('');

    let queue = this.queues.get(queueName);

    if (!queue) {
      const queueOptions: QueueOptions = {
        connection: getRedisConnectionOptions(),
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        },
      };

      queue = new Queue(queueName, queueOptions);

      this.queues.set(queueName, queue);

      // create only once
      // this.createWorker(queueName);
    }

    queue.add(
      key,
      { value },
      {
        jobId,
      }
    ).catch(console.error);
  }

  async getJsonData(key: string, collectionName: string) {
    try {
      let returnValue: any;

      if (key && collectionName) {
        const parts = key.split(":");
        const requiredMarkers = ["CK", "FNGK", "FNK", "CATK", "AFGK", "AFK", "AFVK"];
        requiredMarkers.forEach(marker => {
          const idx = parts.indexOf(marker);
          if (idx === -1 || !parts[idx + 1] || parts[idx + 1] === "undefined" || parts.length <= 14) {
            throw new Error(`Invalid Redis key`);
          }
        });
        let redisResult = await this.redis.call('JSON.GET', key);
        if (redisResult) {
          returnValue = redisResult;
        } else {
          if (key.includes(':FNGK:AFP:FNK:PF-PFD:'))
            returnValue = await this.getpgData(key)
        }

      } else {
        throw 'key/client not found'
      }
      return returnValue;
    } catch (error) {
      throw error;
    }
  }


  /**
  * Retrieves JSON data from Redis with a specified path.
  * @param key The key used to identify the JSON data in Redis.
  * @param path The path to the specific JSON value within the JSON data.
  * @returns The JSON value at the specified path.
  * @throws {Error} If there is an error retrieving the JSON value.
+   */
  async getJsonDataWithPath(key: string, path: any, collectionName: string) {
    try {
      let returnValue: any;
      if (collectionName) {
        const parts = key.split(":");
        const requiredMarkers = ["CK", "FNGK", "FNK", "CATK", "AFGK", "AFK", "AFVK"];
        requiredMarkers.forEach(marker => {
          const idx = parts.indexOf(marker);
          if (idx === -1 || !parts[idx + 1] || parts[idx + 1] === "undefined" || parts.length <= 14) {
            throw new Error(`Invalid Redis key`);
          }
        });

        // Use CACHE_MANAGER to get cached data first
        // let cachedResult = await this.cacheManager.get<string>(key);
        // if (cachedResult) {
        //   const parsedCache = JSON.parse(cachedResult);
        //   const cleanPath = path.replace('$.', '').replace('$', '');
        //   const pathValue = cleanPath ? _.get(parsedCache, cleanPath) : parsedCache;
        //   if (pathValue !== undefined) {
        //     returnValue = JSON.stringify(pathValue);
        //   }
        // }

        // if (!returnValue) {
        let redisResult = await this.redis.call('JSON.GET', key, path);
        if (redisResult) {
          returnValue = redisResult;
        }
        // }
      } else {
        throw 'client not found';
      }
      return returnValue;
    } catch (error) {
      throw error;
    }
  }

  async AppendJsonArr(key: string, value: any, collectionName: string, path?: string) {
    try {
      if (path) {
        var request = await this.redis.call('JSON.ARRAPPEND', key, '$.' + path, value)
      } else {
        var request = await this.redis.call('JSON.ARRAPPEND', key, '$', value)
      }

      return request;

    } catch (error) {
      throw error
    }
  }


  //To store JSON data in redis
  /**
   * Stores JSON data in Redis.
   * @param key The key used to identify the JSON data in Redis.
   * @param value The JSON data to be stored.
   * @param path The path to the specific JSON value within the JSON data.
   * @returns A string indicating that the value was stored.
   * @throws {Error} If there is an error storing the JSON data.
   */
  async setJsonData(key: string, value: any, loginId: string, path?: string) {
    try {
      if (!loginId || !key || !value) throw "loginId/key/value not found";

      const parts = key.split(":");
      const requiredMarkers = ["CK", "FNGK", "FNK", "CATK", "AFGK", "AFK", "AFVK"];
      requiredMarkers.forEach(marker => {
        const idx = parts.indexOf(marker);
        if (idx === -1 || !parts[idx + 1] || parts[idx + 1] === "undefined" || parts.length <= 14) {
          throw new Error(`Invalid Redis key`);
        }
      });

      let pg_response
      const defpath = path ? `.${path}` : "$";
      pg_response = await this.redis.call("JSON.SET", key, defpath, value);

      if (pg_response == 'Value Stored' || pg_response == 'OK') {
        let valuejson = await this.redis.call('JSON.GET', key)
        if (key.includes(':FNGK:AFP:FNK:PF-PFD:'))
          this.getQueue(`AFP-PERSISTENCE`, key, valuejson);
      }
      if (pg_response)
        return 'Value Stored'


    } catch (error) {
      console.log('error', error);

      throw error;
    }
  }

  async setIfNotExist(key: string, value: any, ttl: any) {
    try {
      return await this.redis.set(key, value, 'PX', ttl, 'NX');
    } catch (error) {
      throw error;
    }
  }

  async setJsonDataBatch(
    operations: Array<{ key: string; value: any; path?: string }>,
    collectionName: string
  ): Promise<void> {
    try {
      if (!collectionName) throw new Error('client not found');
      if (!operations || operations.length === 0) return;

      // Validate all keys first
      for (const op of operations) {
        const parts = op.key.split(':');
        const requiredMarkers = ['CK', 'FNGK', 'FNK', 'CATK', 'AFGK', 'AFK', 'AFVK'];
        requiredMarkers.forEach(marker => {
          const idx = parts.indexOf(marker);
          if (idx === -1 || !parts[idx + 1] || parts[idx + 1] === 'undefined' || parts.length <= 14) {
            throw new Error(`Invalid Redis key: ${op.key}`);
          }
        });
      }

      // Update CACHE_MANAGER for all operations
      // for (const op of operations) {
      //   if (op.path) {
      //     let existingValue = await this.cacheManager.get<string>(op.key);
      //     let parsedValue = existingValue ? JSON.parse(existingValue) : {};
      //     _.set(parsedValue, op.path, JSON.parse(op.value));
      //     await this.cacheManager.set(op.key, JSON.stringify(parsedValue));
      //   } else {
      //     await this.cacheManager.set(op.key, op.value);
      //   }
      // }

      // Create Redis pipeline
      const pipeline = this.redis.pipeline();

      // Add all operations to pipeline
      for (const op of operations) {
        const defpath = op.path ? `.${op.path}` : '$';
        pipeline.call('JSON.SET', op.key, defpath, op.value);
      }

      // Execute pipeline (single network round-trip)
      const results = await pipeline.exec();

      // Check for errors
      if (results) {
        for (let i = 0; i < results.length; i++) {
          const [error, result] = results[i];
          if (error) {
            throw new Error(`Pipeline command ${i} failed: ${error.message}`);
          }
        }
      }

      // WRITE-BEHIND: Fire-and-forget MongoDB operations
      // Don't await - let them process in background via batched queue
      // Promise.all(
      //   operations.map(op =>
      //     this.writeBehindBuffer.addOperation({
      //       type: 'SET_DOCUMENT',
      //       collectionName,
      //       key: op.key,
      //       value: JSON.parse(op.value),
      //       path: op.path,
      //     })
      //   )
      // ).catch(err => {
      //   console.error('Batch write-behind queue error:', err.message);
      // });

    } catch (error) {
      console.error('Batch setJsonData error:', error);
      throw error;
    }
  }

  //To store Stream data in redis
  /**
    * Stores stream data in Redis.
    * @param streamName The name of the Redis stream.
    * @param key The key used to identify the stream data.
    * @param strValue The stream data to be stored.
    * @returns The ID of the added message.
    * @throws {Error} If there is an error storing the stream data.
    */

  async setStreamData(streamName: string, key: string, strValue: any) {
    try {
      streamName = streamName?.trim()
      if (streamName && streamName != '' && key && strValue) {
        var result = await this.redis.xadd(streamName, '*', key, strValue);
        if (result) {
          await this.redis.call('EXPIRE', key, 86400);
        }
        return result;
      }

    } catch (error) {
      throw error;
    }
  }

  async hset(hashName, field, value) {
    try {
      return await this.redis.hset(hashName, field, value)
    } catch (error) {
      throw error;
    }
  }

  async hget(hashName, field) {
    try {
      return await this.redis.hget(hashName, field);
    } catch (error) {
      throw error
    }
  }

  /**
   * Checks if a key exists in Redis.
   * @param key The key to check in Redis.
   * @returns The result of the EXISTS command (0 or 1).
   * @throws {Error} If there is an error executing the EXISTS command.
   */

  async exist(key, collectionName: string) {
    try {

      if (collectionName) {
        let redisResult = await this.redis.call('EXISTS', key);
        if (redisResult) {
          return redisResult;
        } else {
          // return await this.isExist(key)
        }

      } else {
        throw 'client not found'
      }
    } catch (error) {
      throw error;
    }
  }


  async quit() {
    await this.redis.quit();
  }

  /**
  * Retrieves stream data from Redis.
  * @param streamName The name of the Redis stream.
  * @returns An array of messages in the stream.
  * @throws {Error} If there is an error retrieving the stream data.
  */

  async getStreamData(streamName) {
    try {
      var messages = await this.redis.xread('STREAMS', streamName, 0);     
      return messages;      
    } catch (error) {
      throw error;
    }
  }


  /**
  * Retrieves stream data from Redis using XRANGE command.
  * 
  * @param {string} streamName - The name of the Redis stream.
  * @returns {Promise<string[][]>} - An array of messages in the stream.
  * @throws {Error} - If there is an error retrieving the stream data.
  */

  async getStreamRange(streamName, end?, start?) {
    try {
      let messages;
      if (start && !end)
        end = '+'
      if (end && !start)
        start = '-'
      if (end && start) {
        messages = await this.redis.call('XRANGE', streamName, start, end);
      } else
        messages = await this.redis.call('XRANGE', streamName, '-', '+');
      // if(messages?.length == 0){    
      //   return await this.convertStreamRangeStruct(streamName)
      // }else{
      return messages;
      // }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves stream data from Redis using XREVRANGE command.
   * 
   * @param {string} streamName - The name of the Redis stream.
   * @param {number} count - The number of messages to retrieve.
   * @returns {Promise<string[][]>} - An array of messages in the stream.
   * @throws {Error} - If there is an error retrieving the stream data.
   */
  async getStreamRevRange(streamName, end?, start?, count?) {
    try {
      if (end && start) {
        var messages = await this.redis.xrevrange(streamName, end, start, 'COUNT', count);
      } else {
        var messages = await this.redis.xrevrange(streamName, '+', '-', 'COUNT', count);
      }
      return messages;
    } catch (error) {
      throw error;
    }
  }

  //Retrieves stream data from Redis with count
  /**
   * Retrieves stream data from Redis with count.
   * 
   * @param {number} count - The number of messages to retrieve.
   * @param {string} streamName - The name of the Redis stream.
   * @returns {Promise<string[][]>} - An array of messages in the stream.
   * @throws {Error} - If there is an error retrieving the stream data.
   */
  async getStreamDatawithCount(count, streamName) {
    try {
      var messages = await this.redis.xread(
        'COUNT',
        count,
        'STREAMS',
        streamName,
        0,
      );
      return messages;
    } catch (error) {
      throw error;
    }
  }

  //To create a consumer group for a given stream in Redis
  /**
   * Creates a consumer group for a given stream in Redis.
   *
   * @param {string} streamName - The name of the Redis stream.
   * @param {string} groupName - The name of the consumer group.
   * @returns {Promise<string>} - A promise that resolves to a string indicating the consumer group was created.
   * @throws {Error} - If there is an error creating the consumer group.
  */
  async createConsumerGroup(streamName, groupName) {
    try {
      // Check if the consumer group already exists
      const grpInfo: any[] = await (this.redis.xinfo('GROUPS', streamName) as Promise<any>).catch(() => []);

      // Check if the group name already exists in any of the groups
      const groupExists = grpInfo.some((group, index) => {
        // Group info comes as flat array: [name, value, name, value, ...]
        // 'name' field is at index 1, 5, 9, etc. for each group
        if (Array.isArray(group)) {
          return group.includes(groupName);
        }
        // Check if this is the 'name' field with matching value
        return index % 2 === 1 && group === groupName;
      });

      if (!groupExists) {
        await this.redis.xgroup('CREATE', streamName, groupName, '0', 'MKSTREAM');
        return `consumerGroup was created as ${groupName}`;
      }

      return `consumerGroup ${groupName} already exists`;
    } catch (error: any) {
      // If error is BUSYGROUP, the group already exists - this is okay
      if (error.message && error.message.includes('BUSYGROUP')) {
        return `consumerGroup ${groupName} already exists`;
      }
      throw error;
    }
  }

  //To create a consumer within a consumer group in Redis
  /**
   * Creates a consumer within a consumer group in Redis.
   * @param {string} streamName - The name of the Redis stream.
   * @param {string} groupName - The name of the consumer group.
   * @param {string} consumerName - The name of the consumer.
   * @returns {Promise<string>} - A promise that resolves to a string indicating the consumer was created.
   * @throws {Error} - If there is an error creating the consumer.
   */
  async createConsumer(streamName, groupName, consumerName) {
    try {
      var result = await this.redis.xgroup(
        'CREATECONSUMER',
        streamName,
        groupName,
        consumerName,
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  //To reads messages from a Redis stream for a specific consumer group.
  /**
   * Reads messages from a Redis stream for a specific consumer group.
   * @param {string} streamName - The name of the Redis stream.
   * @param {string} groupName - The name of the consumer group.
   * @param {string} consumerName - The name of the consumer.
   * @returns {Promise<Array>} - A promise that resolves to an array of objects containing the message ID and data.
   * @throws {Error} - If there is an error reading the messages.
   */
  async readConsumerGroup(streamName, groupName, consumerName) {
    try {
      var res = [];
      var result = await this.redis.xreadgroup('GROUP', groupName, consumerName, 'STREAMS', streamName, '>');

      if (result) {
        result.forEach(([key, message]) => {
          message.forEach(([messageId, data]) => {
            var obj = {};
            obj['msgid'] = messageId;
            obj['data'] = data;
            res.push(obj);
          });
        });
        return res;
      } else {
        return 'No Data available to read';
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Acknowledges a message in a Redis stream using the XACK command.
   * @param {string} streamName - The name of the Redis stream.
   * @param {string} groupName - The name of the consumer group.
   * @param {string} msgId - The message ID to acknowledge.
   * @returns {Promise<string>} - A promise that resolves to the result of the XACK command.
   * @throws {Error} - If there is an error acknowledging the message.
   */
  async ackMessage(streamName, groupName, msgId) {
    try {
      let result = await this.redis.xack(streamName, groupName, msgId);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteWithEntryId(streamName, msgId) {
    try {
      return await this.redis.call('XDEL', streamName, msgId)
    } catch (error) {
      throw error;
    }
  }



  /**
  * Retrieves information about a consumer group in Redis.
  * @param {string} groupName - The name of the consumer group.
  * @returns {Promise<Array>} - A promise that resolves to an array of information about the consumer group.
  * @throws {Error} - If there is an error retrieving the information.
  */
  async getInfoGrp(groupName): Promise<any> {
    try {
      let result = await this.redis.xinfo('GROUPS', groupName);
      return result
    } catch (error) {
      throw error;
    }
  }

  //To acknowledge a message in a Redis stream
  /**
   * Retrieves all keys in Redis that match a given pattern.
   * @param {string} key - The pattern to match against Redis keys.
   * @returns {Promise<Array>} - A promise that resolves to an array of keys that match the pattern.
   * @throws {Error} - If there is an error retrieving the keys.
   */

  async getKeys(key: string, collectionName: string, isKeySuffix = false) {
    try {
      let redisKey

      if (key && collectionName) {
        if (key.endsWith(':')) redisKey = isKeySuffix ? '*:' + key : key + '*';
        else redisKey = isKeySuffix ? '*:' + key : key + ':*';

        const parts = key.split(':').map((p) => p.trim());
        const KeyrequiredMarkers = [
          'CK',
          'FNGK',
          'FNK',
          'CATK',
          'AFGK',
          'AFK',
          'AFVK',
        ];
        KeyrequiredMarkers.forEach((marker) => {
          const idx = parts.indexOf(marker);
          if (parts[idx + 1] === 'undefined' || parts[idx + 1] === '') {
            throw new Error(`Invalid Redis key`);
          }
        });

        let keys = await this.redis.keys(redisKey);
        if (keys?.length > 0) {
          return keys;
        } else {
          //return await this.getpgKeys(redisKey);            
        }
      } else {
        throw 'key/client not found';
      }
    } catch (error) {
      throw error;
    }
  }


  async scanKeys(pattern) {
    try {
      let cursor = '0';
      const allKeys = [];

      do {
        const [nextCursor, keys] = await this.redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
        cursor = nextCursor;
        allKeys.push(...keys);
      } while (cursor !== '0');

      return allKeys;
    } catch (error) {
      throw error
    }
  }

  /**
   * Deletes a key in Redis.
   * @param {string} key - The key to delete.
   * @returns {Promise<void>} - A promise that resolves when the key is deleted.
   * @throws {Error} - If there is an error deleting the key.
   */
  async deleteKey(key: any, collectionName: string) {
    try {
      if (key && collectionName) {
        var response = await this.redis.del(key);
        if (response) {
          // await this.deletePgKey(key)
          return response
        }
      } else {
        throw 'client not found'
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sets an expiration time for a Redis key.
   *
   * @param {string} key - The key to set the expiration time for.
   * @param {number} seconds - The number of seconds before the key expires.
   * @returns {Promise<number>} - A promise that resolves to the number of seconds
   * before the key expires, or 0 if the key does not exist.
   * @throws {Error} - If there is an error setting the expiration time.
   */
  async expire(key, seconds) {
    try {
      var result = await this.redis.call('EXPIRE', key, seconds);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async renameKey(oldKey, newKey, client) {
    try {
      // Update CACHE_MANAGER - move cached value from old key to new key
      // let cachedResult = await this.cacheManager.get<string>(oldKey);
      // if (cachedResult) {
      //   await this.cacheManager.set(newKey, cachedResult);
      //   await this.cacheManager.del(oldKey);
      // }

      var result = await this.redis.call('RENAME', oldKey, newKey);
      // Queue MongoDB operations
      // let mongoResult = await queueMongoOperation(
      //   () => this.existsDocument(client, oldKey),
      //   `existsDocument:${oldKey}`
      // );
      // if(mongoResult){
      //   await queueMongoOperation(
      //     () => this.renameDocumentId(client, oldKey, newKey),
      //     `renameDocumentId:${oldKey}`
      //   );
      // }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getstreamKey(key: string) {
    try {
      return await this.redis.keys(key); 
    } catch (error) {
      throw error;
    }
  }


  async sethash(records, key, logicCenter?: boolean) {
    try {
      const totalBatches = Math.ceil(records.length / this.BATCH_SIZE);
      let storedCount = 0;

      for (let batchNum = 0; batchNum < totalBatches; batchNum++) {
        const start = batchNum * this.BATCH_SIZE;
        const end = Math.min(start + this.BATCH_SIZE, records.length);
        const batch = records.slice(start, end);

        const pipeline = this.redis.pipeline();

        batch.forEach((record, index) => {
          const globalIndex = start + index;
          pipeline.hset(
            key + ':' + batchNum,
            globalIndex.toString(),
            JSON.stringify(record)
          );
        });
        await pipeline.exec();
      }

      await this.redis.set(key + ':total', records.length);
      await this.redis.set(key + ':batches', totalBatches);
      if (logicCenter)
        this.getQueue(`AFP-PERSISTENCE`, key, JSON.stringify(records));
    } catch (error) {
      throw error
    }
  }


  async getAllRecordshash(key): Promise<any[]> {
    //const total = parseInt(await this.redis.get('records:total') || '0');
    const totalBatches = parseInt(await this.redis.get(key + ':batches') || '0');
    // if (total === 0) {
    //   return [];
    // }    
    const allRecords: any[] = [];
    for (let batchNum = 0; batchNum < totalBatches; batchNum++) {
      const batchData: Record<string, string> = await this.redis.hgetall(
        key + ':' + batchNum
      );
      const batchRecords = Object.values(batchData).map(value =>
        JSON.parse(value)
      );
      allRecords.push(...batchRecords);
      console.log(`Loaded batch ${batchNum + 1}/${totalBatches}`);
    }

    return allRecords;
  }


  async select(db: number) {
    return this.redis.select(db);
  }

  async scan(cursor: string, ...args: any[]) {
    return this.redis.scan(cursor, ...args);
  }

  async ttl(key: string) {
    return this.redis.ttl(key);
  }

  async type(key: string) {
    return this.redis.type(key);
  }

  async call(command: string, ...args: any[]) {
    return this.redis.call(command, ...args);
  }

  async get(key: string) {
    return this.redis.get(key);
  }

  async set(key: string, value: any) {
    return this.redis.set(key, value);
  }

  async del(key: string) {
    return this.redis.del(key);
  }



  async hgetall(key: string) {
    return this.redis.hgetall(key);
  }

  async lrange(key: string, start: number, stop: number) {
    return this.redis.lrange(key, start, stop);
  }

  async rpush(key: string, ...values: any[]) {
    return this.redis.rpush(key, ...values);
  }

  async smembers(key: string) {
    return this.redis.smembers(key);
  }

  async sadd(key: string, ...members: any[]) {
    return this.redis.sadd(key, ...members);
  }

  async zrange(key: string, start: number, stop: number, ...args: any[]) {
    return this.redis.zrange(key, start, stop, ...args);
  }

  async zadd(key: string, ...args: any[]) {
    return this.redis.zadd(key, ...args);
  }

  async dump(key: string) {
    return this.redis.dump(key);
  }

  async restore(key: string, ttl: number, value: Buffer, ...args: any[]) {
    return this.redis.restore(key, ttl, value, ...args);
  }

  async pexpire(key: string, ms: number) {
    return this.redis.pexpire(key, ms);
  }

  async exists(key: string) {
    return this.redis.exists(key);
  }

  async ping() {
    return this.redis.ping();
  }

  //__________________________PG_______________________________


  async connectPG() {
    try {
      const { Client } = require('pg');
      let pgClient
      if (pgClient && pgClient._connected) {
        return pgClient;
      }
      pgClient = new Client({
        connectionString: process.env.PG_URL,
        application_name: 'AFP-Service',
      });

      await pgClient.connect();
      console.log('PG connected');

      return pgClient;

    } catch (error) {
      throw error
    }
  }

  async setPgData(key: string, value: any, path?): Promise<any> {
    let pgClient
    try {
      pgClient = await this.connectPG();
      const DbSchema = process.env.PG_SCHEMANAME;
      if (!DbSchema || !pgClient) throw ('pgClient/schema not found')
      let tableName
      if (key) {
        if (key.includes(':FNGK:AFR:') || key.includes(':FNGK:AFRS:'))
          tableName = 'amd_node_registry'
        else if (key.includes(':FNGK:AFP:'))
          tableName = 'tam_app_process_dtl'
        else
          tableName = 'amd_registry'
      }
      let query, result;
      const keys = key.split(':');
      if (keys.length <= 14) throw ('Invalid key')

      const values = [
        key,
        keys[1],
        keys[3],
        keys[5],
        keys[7],
        keys[9],
        keys[11],
        keys[13],
        keys[14],
        value
      ]

      let existquery = `
        SELECT EXISTS (
          SELECT 1
          FROM "${DbSchema}".${tableName}
          WHERE full_key = $1
        ) AS exists
      `;
      let existresult = await pgClient.query(existquery, [key]);

      if (existresult.rows[0].exists) {
        query = `
           UPDATE "${DbSchema}".${tableName} SET
            data = $2,
            trs_modified_by = '',
            trs_modified_date = CURRENT_TIMESTAMP where full_key = $1
        `;
        result = await pgClient.query(query, [key, value]);
      } else {
        query = `INSERT INTO "${DbSchema}".${tableName}
          (full_key, ck_code, fngk_code, fnk_code, catk_code, afgk_code, 
          afk_code, afvk_code, afsk_code, data, trs_created_by, trs_created_date, trs_modified_by, trs_modified_date)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, '', CURRENT_TIMESTAMP, '', CURRENT_TIMESTAMP)         
          `
        result = await pgClient.query(query, values);
      }
      let audit_query = `
          INSERT INTO "${DbSchema}".amd_registry_auditlogs
          (full_key, ck_code, fngk_code, fnk_code, catk_code, afgk_code, 
          afk_code, afvk_code, afsk_code, data, trs_created_by, trs_created_date, trs_modified_by, trs_modified_date)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, '', CURRENT_TIMESTAMP, '', CURRENT_TIMESTAMP)        
        `;

      await pgClient.query(audit_query, values);
      await pgClient.end();
      if (result.rowCount > 0)
        return 'OK';
    } catch (error) {
      if (pgClient && pgClient._connected) {
        await pgClient.end();
      }
      throw error;
    }
  }

  async getpgData(key) {
    let pgClient
    try {
      pgClient = await this.connectPG();
      let DbSchema = process.env.PG_SCHEMANAME;
      if (!DbSchema || !pgClient) throw ('pgClient/schema not found')
      let tableName
      if (key) {
        if (key.includes(':FNGK:AFR:') || key.includes(':FNGK:AFRS:'))
          tableName = 'amd_node_registry'
        else if (key.includes(':FNGK:AFP:'))
          tableName = 'tam_app_process_dtl'
        else
          tableName = 'amd_registry'
      }
      const query = `        
        SELECT data
        FROM "${DbSchema}".${tableName}
        WHERE full_key = $1        
      `;

      const result = await pgClient.query(query, [key]);

      await pgClient.end();
      if (!result?.rows[0]?.data) return null
      return result.rows[0].data
    } catch (error) {
      console.log('error', error);

      if (pgClient && pgClient._connected) {
        await pgClient.end();
      }
      throw error
    }
  }

  async getpgKeys(key) {
    let pgClient
    try {
      pgClient = await this.connectPG();
      let DbSchema = process.env.PG_SCHEMANAME;

      if (!DbSchema || !pgClient) throw ('pgClient/schema not found')
      let tableName
      if (key) {
        if (key.includes(':FNGK:AFR:') || key.includes(':FNGK:AFRS:'))
          tableName = 'amd_node_registry'
        else
          tableName = 'amd_registry'
      }

      const conditions = [];
      const mapping = {
        CK: 'ck_code',
        FNGK: 'fngk_code',
        FNK: 'fnk_code',
        CATK: 'catk_code',
        AFGK: 'afgk_code',
        AFK: 'afk_code',
        AFVK: 'afvk_code'
      };
      function parseKey(key) {
        const parts = key.split(':');
        const result = {};

        for (let i = 0; i < parts.length - 1; i += 2) {
          result[parts[i]] = parts[i + 1];
        }

        return result;
      }
      const values = parseKey(key);
      const params = [];

      Object.entries(mapping).forEach(([k, column]) => {
        if (values[k] && values[k] !== '*') {
          params.push(values[k]);
          conditions.push(`${column} = $${params.length}`);
        }
      });

      let result = await pgClient.query(`SELECT full_key from "${DbSchema}".${tableName} where ${conditions.join(' AND ')}`, params)

      await pgClient.end();
      let allApiKeys = result?.rows?.map(row => row.full_key) || []
      return allApiKeys
    } catch (error) {
      if (pgClient && pgClient._connected) {
        await pgClient.end();
      }
      throw error
    }
  }

  async isExist(key) {
    let pgClient
    try {
      pgClient = await this.connectPG();
      let DbSchema = process.env.PG_SCHEMANAME;
      if (!DbSchema || !pgClient) throw ('pgClient/schema not found')
      let tableName
      if (key) {
        if (key.includes(':FNGK:AFR:') || key.includes(':FNGK:AFRS:'))
          tableName = 'amd_node_registry'
        else
          tableName = 'amd_registry'
      }
      // let result = await pgClient.query(`SELECT data from ${DbSchema}.${tableName} where full_key = ${key}`)
      const query = `
        SELECT EXISTS (
          SELECT 1
          FROM "${DbSchema}".${tableName}
          WHERE full_key = $1
        ) AS exists
      `;
      const result = await pgClient.query(query, [key]);
      await pgClient.end();
      if (!result.rows[0].exists) return 0
      return 1
    } catch (error) {
      if (pgClient && pgClient._connected) {
        await pgClient.end();
      }
      throw error
    }
  }

  async deletePgKey(key) {
    let pgClient
    try {
      pgClient = await this.connectPG();
      let DbSchema = process.env.PG_SCHEMANAME;
      if (!DbSchema || !pgClient) throw ('pgClient/schema not found')
      let tableName
      if (key) {
        if (key.includes(':FNGK:AFR:') || key.includes(':FNGK:AFRS:'))
          tableName = 'amd_node_registry'
        else
          tableName = 'amd_registry'
      }
      const query = `
        DELETE FROM "${DbSchema}".${tableName}
        WHERE full_key = $1
      `;

      const result = await pgClient.query(query, [key]);
      await pgClient.end();
      if (!result?.rowCount) return 0
      return 1
    } catch (error) {
      if (pgClient && pgClient._connected) {
        await pgClient.end();
      }
      throw error
    }
  }

}
