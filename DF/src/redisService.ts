import { Inject, Injectable, Logger } from '@nestjs/common';
const Redis = require('ioredis');
import 'dotenv/config';
const _ = require("lodash")
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { Cache } from 'cache-manager';
import axios from 'axios';
import { Readable } from 'stream';
import * as FormData from 'form-data';
import * as stream from 'stream';
import { EnvData } from './envData/envData.service';
//import { connectToRedis, getRedis } from './mongoClient';
 

let redis

  // connectToMongo().then(async () => { 
  //   db = await getDb();
  //   console.log('Database initialized'); 
  // }).catch((error) => {
  //   console.error('Error connecting to MongoDB:', error);    
  //   throw new Error('Error connecting to MongoDB:' + error);
  // }); 

  // connectToRedis().then(() => { 
  //   redis = getRedis();
  //   console.log('Redis initialized'); 
  // }).catch((error) => {
  //   console.error('Error connecting to Redis:', error);
  // });
   if (!redis) {
    redis = new Redis({
      host: process.env.HOST,
      port: parseInt(process.env.PORT),      
    }).on('error', (err) => {
      console.log('Redis Client Error', err);
      throw err;
    });
  }

@Injectable()
export class RedisService {
  private readonly BATCH_SIZE = 10000 
  constructor(private readonly envData: EnvData) {}

  // constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
   /**
   * Retrieves JSON data from Redis.
   * @param key The key used to identify the JSON data in Redis.
   * @returns The JSON data retrieved from Redis.
   * @throws {Error} If there is an error retrieving the JSON data.
   */
  async getJsonData(key: string, collectionName: string) {
    try {
      let returnValue: any;      
      if(collectionName){
        const parts = key.split(":");
        const requiredMarkers = ["CK", "FNGK", "FNK", "CATK", "AFGK", "AFK", "AFVK"];
        requiredMarkers.forEach(marker => {
          const idx = parts.indexOf(marker);
          if (idx === -1 || !parts[idx + 1] || parts[idx + 1] === "undefined" || parts.length <= 14) {
            throw new Error(`Invalid Redis key`);
          }
        });
        // Use CACHE_MANAGER to get cached data
        // let cachedResult = await this.cacheManager.get<string>(key);
       
        // if (cachedResult) {
        //   returnValue = cachedResult;
        // }else{
          let redisResult = await redis.call('JSON.GET', key);    
          if (!redisResult) {
          //   await this.cacheManager.set(key, redisResult);
          //   returnValue = redisResult;
          // } else{
            var dfsResult = await this.getdfsData(key,collectionName)
           if(dfsResult && ((Array.isArray(dfsResult) && dfsResult.length>0) || (typeof dfsResult == 'object' && Object.keys(dfsResult).length>0))){
              await redis.call('JSON.SET', key, '$', JSON.stringify(dfsResult));
              returnValue = JSON.stringify(dfsResult);
            }else{
               returnValue = null
            }
          }else{
            return redisResult
          }
        // }
      }else{
        throw 'client not found'
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
  async getJsonDataWithPath(key: string, path:any,collectionName: string) {   
    if(collectionName){ 
      try { 
        let returnValue
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
        // if(!returnValue){          
          return await redis.call('JSON.GET', key, path);    
        // }else{
        //   return returnValue
        // }
      } catch (error) {
        console.log('ERROR',error.message);        
          return await this.getdfsData(key,collectionName,path)   
        // throw error;
      }
   }else{
      throw 'client not found'
    }
  }

  async AppendJsonArr(key: string, value: any,path?: string) {
    try {
      if(path){
        var request = await redis.call('JSON.ARRAPPEND', key, '$.'+path, value)   
      }else{
        var request = await redis.call('JSON.ARRAPPEND', key, '$', value)   
      }           
      // if(request){
        // Update CACHE_MANAGER - append to cached array
        // let cachedResult = await this.cacheManager.get<string>(key);
        // if (cachedResult) {
        //   let parsedValue = JSON.parse(cachedResult);
        //   if (path) {
        //     let existingArr = _.get(parsedValue, path) || [];
        //     existingArr.push(JSON.parse(value));
        //     _.set(parsedValue, path, existingArr);
        //   } else {
        //     if (Array.isArray(parsedValue)) {
        //       parsedValue.push(JSON.parse(value));
        //     }
        //   }
        //   await this.cacheManager.set(key, JSON.stringify(parsedValue));
        // }        
      // }    
      return request;
    } catch (error) {
      throw error
    }    
  }
  
  /**
   * Stores JSON data in Redis.
   * @param key The key used to identify the JSON data in Redis.
   * @param value The JSON data to be stored.
   * @param path The path to the specific JSON value within the JSON data.
   * @returns A string indicating that the value was stored.
   * @throws {Error} If there is an error storing the JSON data.
   */
 
 async setJsonData(key: string, value: any, collectionName: string, path?: string) {
    try {
     if (!collectionName && !key) throw "client/key not found";
    // validate key segments inline 
      const parts = key.split(":");
      const requiredMarkers = ["CK", "FNGK", "FNK", "CATK", "AFGK", "AFK", "AFVK"];
      requiredMarkers.forEach(marker => {
        const idx = parts.indexOf(marker);
        if (idx === -1 || !parts[idx + 1] || parts[idx + 1] === "undefined" || parts.length <= 14) {
          throw new Error(`Invalid Redis key`);
        }
      });

      // Use CACHE_MANAGER to set cached data
      // if (path) {
      //   // For path-based updates, get existing value, update path, and set back
      //   let existingValue = await this.cacheManager.get<string>(key);
      //   let parsedValue = existingValue ? JSON.parse(existingValue) : {};
      //   _.set(parsedValue, path, JSON.parse(value));
      //   await this.cacheManager.set(key, JSON.stringify(parsedValue));
      // } else {
      //   await this.cacheManager.set(key, value);
      // }
      
      const defpath = path ? `.${path}` : "$";
      let redisResult =    await redis.call("JSON.SET", key, defpath, value);     
       if(redisResult == 'OK'){
        var dfsResult = await this.setdfsData(key,collectionName,JSON.parse(value),path)
        if(dfsResult?.status)
        return 'Value Stored'
      }
           
   } catch (error) {
    throw error;
   }
 }

  async setIfNotExist(key:string,value:any,ttl:any){
    try {
      return await redis.set(key, value, 'PX', ttl, 'NX');
    } catch (error) {
      throw error;
    }
  }

  async quit(){
     await redis.quit();
  }

   async sethash(records,key){
    try {
      const totalBatches = Math.ceil(records.length / this.BATCH_SIZE);
      let storedCount = 0;

      for (let batchNum = 0; batchNum < totalBatches; batchNum++) {
        const start = batchNum * this.BATCH_SIZE;
        const end = Math.min(start + this.BATCH_SIZE, records.length);
        const batch = records.slice(start, end);

        const pipeline = redis.pipeline();

        batch.forEach((record, index) => {
          const globalIndex = start + index;
          pipeline.hset(
            key+':'+batchNum,
            globalIndex.toString(),
            JSON.stringify(record)
          );
        });
        await pipeline.exec();
      }

      await redis.set( key+':total', records.length);
      await redis.set(key+':batches', totalBatches);
    } catch (error) {
      throw error
    }
  }


    async getAllRecordshash(key): Promise<any[]> {
   //const total = parseInt(await redis.get('records:total') || '0');
    const totalBatches = parseInt(await redis.get(key+':batches') || '0'); 
    // if (total === 0) {
    //   return [];
    // }    
    const allRecords: any[] = [];    
    for (let batchNum = 0; batchNum < totalBatches; batchNum++) {
      const batchData: Record<string, string> = await redis.hgetall(
       key+':'+batchNum
      );      
      const batchRecords = Object.values(batchData).map(value => 
        JSON.parse(value)
      );      
      allRecords.push(...batchRecords);
      console.log(`Loaded batch ${batchNum + 1}/${totalBatches}`);
    }
    
    return allRecords;
  }

   async hset(hashName,field, value){
    try {
      return await redis.hset(hashName, field, value)
    } catch (error) {
      throw error;
    }
  }

  async hget(hashName,field){
    try {
      return await redis.hget(hashName,field);
    } catch (error) {
      throw error
    }
  }
 
 /**
   * Stores stream data in Redis.
   * @param streamName The name of the Redis stream.
   * @param key The key used to identify the stream data.
   * @param strValue The stream data to be stored.
   * @returns The ID of the added message.
   * @throws {Error} If there is an error storing the stream data.
   */

  async setStreamData(streamName: string, key: string, strValue: any, type?) {
    try { 
      var result = await redis.xadd(streamName, '*', key, strValue);     
     // if(result){ 
         //result = await this.setdfsData(streamName,streamName,strValue)    
       // result = await this.structuredExcepLogs(streamName,'',key,strValue,result)        
     // }
      return result;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Checks if a key exists in Redis.
   * @param key The key to check in Redis.
   * @returns The result of the EXISTS command (0 or 1).
   * @throws {Error} If there is an error executing the EXISTS command.
   */
  
  async exist(key,collectionName: string) {
    try {     
      if(collectionName){
        // Check CACHE_MANAGER first
        // let cachedResult = await this.cacheManager.get<string>(key);
        // if (cachedResult) {
        //   return 1;
        // }

        let redisResult = await redis.call('EXISTS', key);
        if(redisResult){
          return redisResult;
        }       
        else {
          let dfsResult = await this.getdfsData(key,collectionName)
          if(dfsResult?.length>0){
            await redis.call('JSON.SET', key, '$', JSON.stringify(dfsResult));
            return 1          
          }else{
            return dfsResult
          }
        }
      }else{
        throw 'client not found'
      }
    } catch (error) {
      throw error;
    }
  }
 
 
   /**
   * Retrieves stream data from Redis.
   * @param streamName The name of the Redis stream.
   * @returns An array of messages in the stream.
   * @throws {Error} If there is an error retrieving the stream data.
   */
  
    async getStreamData(streamName) {
    try {
      var messages = await redis.xread('STREAMS', streamName, 0);     
      if(messages && messages != null){
        return messages;        
      }else{
         return await this.getdfsData(streamName,streamName)
       // return await this.convertStreamStruct(streamName)
      }
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
  
   async getStreamRange(streamName,end?,start?){
    try {
      let messages;
      if(start && !end) 
        end = '+'
      if(end && !start)
        start = '-'
       if(end && start){
       messages = await redis.call('XRANGE', streamName, start, end);
       }else
         messages = await redis.call('XRANGE', streamName, '-', '+');
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
   async getStreamRevRange(streamName, end?,start?,count?) {
    try {    
      if(end && start){
        var messages = await redis.xrevrange(streamName,end, start,'COUNT',count);
      }else{
        var messages = await redis.xrevrange(streamName,'+', '-', 'COUNT',count);
      }
      return messages;
    } catch (error) {
      throw error;
    }
  }
   
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
      var messages = await redis.xread('COUNT',count,'STREAMS', streamName, 0);
      return messages;
    } catch (error) {
      throw error;
    }
  }
 
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
      const grpInfo = await redis.xinfo('GROUPS', streamName).catch(() => []);

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
        await redis.xgroup('CREATE', streamName, groupName, '0', 'MKSTREAM');
        return `consumerGroup was created as ${groupName}`;
      }

      return `consumerGroup ${groupName} already exists`;
    } catch (error) {
      // If error is BUSYGROUP, the group already exists - this is okay
      if (error.message && error.message.includes('BUSYGROUP')) {
        return `consumerGroup ${groupName} already exists`;
      }
      throw error;
    }
  }
  
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
      var result = await redis.xgroup('CREATECONSUMER',streamName,groupName,consumerName);
      return result;
    } catch (error) {
      throw error;
    }
  }

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
      var result = await redis.xreadgroup('GROUP',groupName,consumerName,'STREAMS',streamName, '>');      
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
      let result = await redis.xack(streamName, groupName, msgId);
      return result;
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
  async getInfoGrp(groupName){
    try {     
      let result = await redis.xinfo('GROUPS', groupName);   
      return result
    } catch (error) {
      throw error;
    }
  }
 
  /**
   * Retrieves all keys in Redis that match a given pattern.
   * @param {string} key - The pattern to match against Redis keys.
   * @returns {Promise<Array>} - A promise that resolves to an array of keys that match the pattern.
   * @throws {Error} - If there is an error retrieving the keys.
   */
  
  async getKeys(key: string , collectionName: string, isKeySuffix = false) {
    try {
       let redisKey
       let mkeys       
       if(collectionName){
        if(key.endsWith(':'))
          redisKey = isKeySuffix ? '*:'+ key : key + '*';
        else
          redisKey = isKeySuffix ? '*:'+ key : key + ':*';
       
        const parts = key.split(":").map(p => p.trim());
        const KeyrequiredMarkers = ["CK", "FNGK", "FNK", "CATK", "AFGK", "AFK", "AFVK"];
        KeyrequiredMarkers.forEach(marker => {
          const idx = parts.indexOf(marker);
          if (parts[idx + 1] === "undefined" || parts[idx + 1] === '') {
            throw new Error(`Invalid Redis key`);
          }
        });

        // Use CACHE_MANAGER to get cached keys list
        // const cacheKey = `keys:${redisKey}`;
        // let cachedKeys = await this.cacheManager.get<string>(cacheKey);
        // if (cachedKeys) {
        //   return JSON.parse(cachedKeys);
        // }

        let keys = await redis.keys(redisKey);
        const arrID: string[] = [];
        const requiredMarkers = ["CK", "FNGK", "FNK", "CATK", "AFGK", "AFK", "AFVK"];
        for (const item of keys) {
          const _id = item         
          const parts = _id.split(":").map(p => p.trim()); 
            let isValid = true;  
            for (const marker of requiredMarkers) {
              const idx = parts.indexOf(marker);
              
              const next = parts[idx + 1];                
              if (idx === -1 ||next === undefined ||next === null ||next.trim?.() === "" ||next.toLowerCase?.() === "undefined" || parts.length <= 14) {
                isValid = false;
                await this.deleteKey(_id,collectionName)
                break;
              }
            }  
            if (isValid && !arrID.includes(_id)) {
              arrID.push(_id);
            }                 
        }
        if(arrID.length>0)  keys = arrID        
          mkeys = await this.listdfsKeys(key,collectionName)      
       
        if(keys?.length == mkeys?.length){
          return keys
        }else{
         if(mkeys?.length > keys?.length)
          return mkeys;
         else
          return keys;
       }
     }else{
      throw 'client not found'
    }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes a key in Redis.
   * @param {string} key - The key to delete.
   * @returns {Promise<void>} - A promise that resolves when the key is deleted.
   * @throws {Error} - If there is an error deleting the key.
   */
  async deleteKey(key: any,collectionName: string) {
    try {    
      if(collectionName){     
        // Delete from CACHE_MANAGER
        // await this.cacheManager.del(key);

        var response = await redis.del(key);         
        await this.deletedfskey(key,collectionName)    
        return response
      }else{
       throw 'client not found'
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteWithEntryId(streamName, msgId) {
    try {      
      return await redis.call('XDEL',streamName,msgId)
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
      var result = await redis.call('EXPIRE', key, seconds);
      return result;
    } catch (error) {
      throw error;
    }
  }

   async renameKey(oldKey, newKey,collectionName) {
    try {     
      if(collectionName){
      var result = await redis.call('RENAME', oldKey, newKey);     
        let dfsResult = await this.getdfsData(oldKey,collectionName)
        if(dfsResult){
          await this.renamedfskey(oldKey,newKey,collectionName)
        }
            
      return result;
     }else{
      throw 'client not found'
     }
    } catch (error) {
      throw error;
    }
  }

  async copyData(sourceKey: string, destinationKey: string,collectionName) {
    try {
      if(collectionName){
      const destinationExist = await this.exist(destinationKey,collectionName);
      if(destinationExist){
        await this.deleteKey(destinationKey,collectionName);
      } 
      var result = await redis.call('COPY', sourceKey, destinationKey);  
      return result;
      }else{
      throw 'client not found'
     }
    } catch (error) {
      throw error;
    }
  }  

  async getstreamKey(key: string) {
    try {
      let keys
       keys = await redis.keys(key);      
      return keys;
    } catch (error) {
      throw error;
    }
  }

  //  async getLogType(client:string){
  //   let key = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${client}:AFK:PROFILE:AFVK:v1:cpc`  
  //   let redisResult:any = JSON.parse(await redis.call('JSON.GET', key)); 
  //    return redisResult?.logType
  // }


  //------------------------ DFS ----------------------------//

   async getdfsconfig(){
     const seaWeedConfig = {
       url: this.envData.getSeaweedOutputHost(),//process.env.SEAWEED_OUTPUT_HOST,
       username: this.envData.getSeaweedUsername(),//process.env.SEAWEED_USERNAME,
       password: this.envData.getSeaweedPassword()//process.env.SEAWEED_PASSWORD,
     };
      return seaWeedConfig
   }

   async getdfsData(key,collectionName,path?){
    try {
      let existing,fileUrl,fileContent,jsonData
      if(!key || !collectionName)
        throw 'invalid payload'      
      let config = await this.getdfsconfig()
      if(key.includes(':FNGK:AFR:') || key.includes(':FNGK:AFRS:'))
        fileUrl = `${config.url}/TORUS_AMDKEYS/${key}.json` 
      else    
      fileUrl = `${config.url}/${collectionName}_AMDKEYS/${key}.json`      
       let auth = {
          username: config.username,
          password: config.password
        }  

      existing = await axios.get(fileUrl, {responseType: 'stream',auth , validateStatus: () => true,  });
      if(existing?.data){
      fileContent = await this.streamToString(existing.data);
       jsonData = JSON.parse(fileContent);
      }      
      if (jsonData){
        if (path) {
          return await _.get(jsonData, path)
        } 
      } 
      if(jsonData)               
      return jsonData
      else
      return null

    } catch (error) {
      //console.log(`key doesn't exist`)
      return null
     // throw error
    }
   }

   streamToString = async (readableStream: stream.Readable): Promise<string> => {
      const chunks: Uint8Array[] = [];
      for await (const chunk of readableStream) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }
      return Buffer.concat(chunks).toString('utf-8');
    };

   async setdfsData(key,collectionName,value,path?){
    try {
      let fileUrl
      if(!key || !collectionName)
        throw 'invalid payload'      
      let config = await this.getdfsconfig()
      if(key.includes(':FNGK:AFR:') || key.includes(':FNGK:AFRS:'))
        fileUrl = `${config.url}/TORUS_AMDKEYS/${key}.json`
      else
      fileUrl = `${config.url}/${collectionName}_AMDKEYS/${key}.json`      
       let auth = {
          username: config.username,
          password: config.password
        } 
        if (path) {
          let existing = await axios.get(fileUrl, {
            responseType: 'stream',
            auth,
            validateStatus: () => true,
          });
          if (existing?.data) {
            let fileContent = await this.streamToString(existing.data);
            let jsonData = JSON.parse(fileContent);
            if (jsonData) jsonData = _.set(jsonData, path, value);
            value = jsonData;
          }
        }
         const buffer = Buffer.from(JSON.stringify(value, null, 2), 'utf-8');      
          const form = new FormData();
          form.append('file', Readable.from(buffer), {
            filename: key+'.json',
            contentType: `application/json`,
          });

          const response = await axios.post(fileUrl, form, {
            headers: { ...form.getHeaders() },
            auth,
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
          });       
          return {
            status: response.status,
            fileName: key
          };
    } catch (error) {
     // throw error
    }
   }

   async listdfsKeys(key,collectionName): Promise<string[]> { 
    try {
      let config = await this.getdfsconfig()
      let url
     let auth = {
          username: config.username,
          password: config.password
        } 
    if(key.includes(':FNGK:AFR:') || key.includes(':FNGK:AFRS:'))
     url = `${config.url}/TORUS_AMDKEYS/${key}/?prefix=${key}&limit=10000`; 
    else
    url = `${config.url}/${collectionName}_AMDKEYS/${key}/?prefix=${key}&limit=10000`;   
      const response = await axios.get(url,{
        auth,
         headers: {
          'Accept': 'application/json' // This is crucial!
        }
      });
      let resarr = []
      let entries = response.data.Entries
      if(entries?.length>0){
        for(let i=0;i< entries.length;i++){
          resarr.push(entries[i].FullPath)
        }
      }
      return resarr;
    } catch (error) {      
      return []; // Directory not found 
    }
  }

  async deletedfskey(key,collectionName) {
    try {
      let config = await this.getdfsconfig()
      let url
     let auth = {
          username: config.username,
          password: config.password
        } 
    if(key.includes(':FNGK:AFR:') || key.includes(':FNGK:AFRS:'))
     url = `${config.url}/TORUS_AMDKEYS/${key}.json`; 
    else
    url = `${config.url}/${collectionName}_AMDKEYS/${key}.json`; 
    const response = await axios.delete(url, { auth });
    return response.data
    } catch (error) {
      throw error
    }
    
  }

  async renamedfskey(oldkey,newKey,collectionName){
    try {
      let data = await this.getdfsData(oldkey,collectionName)
      if(data?.length>0){
        let res = await this.setdfsData(newKey,collectionName,data) 
        if(res.status)
          await this.deletedfskey(oldkey,collectionName)    
      }
    } catch (error) {
      throw error
    }
  }


  async select(db: number) {
    return redis.select(db);
  }

  async scan(cursor: string, ...args: any[]) {
    return redis.scan(cursor, ...args);
  }

  async ttl(key: string) {
    return redis.ttl(key);
  }

  async type(key: string) {
    return redis.type(key);
  }

  async call(command: string, ...args: any[]) {
    return redis.call(command, ...args);
  }

  async get(key: string) {
    return redis.get(key);
  }

  async set(key: string, value: any) {
    return redis.set(key, value);
  }

  async del(key: string) {
    return redis.del(key);
  }

  

  async hgetall(key: string) {
    return redis.hgetall(key);
  }

  async lrange(key: string, start: number, stop: number) {
    return redis.lrange(key, start, stop);
  }

  async rpush(key: string, ...values: any[]) {
    return redis.rpush(key, ...values);
  }

  async smembers(key: string) {
    return redis.smembers(key);
  }

  async sadd(key: string, ...members: any[]) {
    return redis.sadd(key, ...members);
  }

  async zrange(key: string, start: number, stop: number, ...args: any[]) {
    return redis.zrange(key, start, stop, ...args);
  }

  async zadd(key: string, ...args: any[]) {
    return redis.zadd(key, ...args);
  }

  async dump(key: string) {
    return redis.dump(key);
  }

  async restore(key: string, ttl: number, value: Buffer, ...args: any[]) {
    return redis.restore(key, ttl, value, ...args);
  }

  async pexpire(key: string, ms: number) {
    return redis.pexpire(key, ms);
  }

  async exists(key: string) {
    return redis.exists(key);
  }

  async ping() {
    return redis.ping();
  }
  
}