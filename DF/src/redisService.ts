import { Injectable, Logger } from '@nestjs/common';
const Redis = require('ioredis');
import 'dotenv/config';
import { Db, MongoClient } from 'mongodb';
const _ = require("lodash")
import { connectToMongo, connectToRedis, getDb, getRedis } from './mongoClient';

let db: Db;
let redis

  connectToMongo().then(() => { 
    db = getDb();
    console.log('Database initialized'); 
  }).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  }); 

   connectToRedis().then(() => { 
    redis = getRedis();
    console.log('Redis initialized'); 
  }).catch((error) => {
    console.error('Error connecting to Redis:', error);
  });

//export const redis = new Redis({
  //host: process.env.HOST,
  //port: parseInt(process.env.PORT),
//}).on('error', (err) => {
  //Logger.log('Redis Client Error', err);
  //throw err;
//});

//export const client = new MongoClient(process.env.MONGODB_URL);
//client.connect()
  //.then(() => {
    //console.log('Connected to the database successfully!');
  //})
  //.catch((err) => {
    //console.error('Error connecting to the database:', err);
  //});
//var db = client.db(process.env.MONGODB_NAME)

@Injectable()
export class RedisService {
  //Retrieves JSON data from Redis
   /**
   * Retrieves JSON data from Redis.
   * @param key The key used to identify the JSON data in Redis.
   * @returns The JSON data retrieved from Redis.
   * @throws {Error} If there is an error retrieving the JSON data.
   */
  async getJsonData(key: string, collectionName: string) {
    try {
      let returnValue: any;
    
      let redisResult = await redis.call('JSON.GET', key);    
      if (redisResult) {
        returnValue = redisResult;
      } 
      else {
        var mongoResult:any = await this.getDocument(collectionName,key)       
        
        if(mongoResult?.length>0 && mongoResult[0]?.value){          
          
          await redis.call('JSON.SET', key, '$', JSON.stringify(mongoResult[0]?.value));
         
          returnValue = JSON.stringify(mongoResult[0]?.value);
        }else{
          returnValue = null;
        }      
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
    try {    
      return await redis.call('JSON.GET', key, path);    
    } catch (error) {
      console.log('ERROR',error.message); 
      let mongoResult = await this.getDocument(collectionName,key,path)    
      if(mongoResult && mongoResult?.length>0){
        return mongoResult
      }else{
        throw error;
      }      
    }
  }

  async AppendJsonArr(key: string, value: any,collectionName:string, path?: string) {
    try {
      if(path){
        var request = await redis.call('JSON.ARRAPPEND', key, '$.'+path, value)   
      }else{
        var request = await redis.call('JSON.ARRAPPEND', key, '$', value)   
      }            
      
      if(request){
        await this.appendDocumentData(collectionName,key,JSON.parse(value))  
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
   async setJsonData(key: string, value: any, collectionName:string, path?: string) {
    try {      
      if (path) {       
        var defpath = '.' + path
      } else {
        var defpath = '$';
      }
      
      let redisResult = await redis.call('JSON.SET', key, defpath, value);
      // if(redisResult == 'OK')
      //   var mongoResult:any  = await this.setDocument(collectionName,key, JSON.parse(value),path)
      
      // if(mongoResult?.value)
        return 'Value Stored';    


    } catch (error) {
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
      var result = await redis.xadd(streamName, '*', key, strValue);
      // if(result){     
       
        // strValue = {[result]: JSON.parse(strValue)}

        // strValue = Object.assign(JSON.parse(strValue),{EntryId:result})
        
        // await this.appendStreamDocument(streamName,key, strValue)
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
      let redisResult = await redis.call('EXISTS', key);
      if(redisResult){
        return redisResult;
      }else{
        let mongoResult = await this.existsDocument(collectionName,key)
        if(mongoResult){
          let doc = await this.getDocument(collectionName,key)
           if(doc?.length>0 && doc[0]?.value){          
          
          await redis.call('JSON.SET', key, '$', JSON.stringify(doc[0]?.value));}
          //await redis.call('JSON.SET', key, '$', JSON.stringify(doc));
          return 1
        }else{
         return mongoResult
        }
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
        return await this.convertStreamStruct(streamName)
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
  async getStreamRange(streamName){
    try {
      var messages = await redis.call('XRANGE', streamName, '-', '+');
      if(messages?.length == 0){    
        return await this.convertStreamRangeStruct(streamName)
      }else{
        return messages;
      }
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
  async getStreamRevRange(streamName, count) {
    try {
      var messages = await redis.xrevrange(
        streamName,
        '+',
        '-',
        'COUNT',
        count,
      );
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
      var messages = await redis.xread(
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
      await redis.xgroup('CREATE', streamName, groupName, '0', 'MKSTREAM');
      return `consumerGroup was created as ${groupName}`;
    } catch (error) {
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
      var result = await redis.xgroup(
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
      var result = await redis.xreadgroup('GROUP',groupName,consumerName,'STREAMS',streamName,'>');
      

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

  //To acknowledge a message in a Redis stream
  /**
   * Retrieves all keys in Redis that match a given pattern.
   * @param {string} key - The pattern to match against Redis keys.
   * @returns {Promise<Array>} - A promise that resolves to an array of keys that match the pattern.
   * @throws {Error} - If there is an error retrieving the keys.
   */
  
  async getKeys(key: string , collectionName: string, isKeySuffix = false) {
    try {
      var redisKey = isKeySuffix ? '*:'+ key : key + ':*';
      var keys = await redis.keys(redisKey);   
      if(keys?.length == 0){
        return await this.getDocumentKeys(collectionName,key)
      }else{
        return keys;
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
      var response = await redis.del(key); 
      //await this.deleteDocument(collectionName,key)     
      return response
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

  async renameKey(oldKey, newKey,client) {
    try {
      var result = await redis.call('RENAME', oldKey, newKey);
       let mongoResult = await this.existsDocument(client,oldKey)
       if(mongoResult){
        await this.renameDocumentId(client,oldKey,newKey)
       }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async copyData(sourceKey: string, destinationKey: string,collectionName) {
    try {
      const destinationExist = await this.exist(destinationKey,collectionName);
      if(destinationExist){
        await this.deleteKey(destinationKey,collectionName);
      }
      let mongdoc;
       let mongoResult = await this.existsDocument(collectionName,sourceKey)
       if(mongoResult){
         mongdoc = await this.getDocument(collectionName,sourceKey)
       
       }else{
         mongdoc = JSON.parse(await this.getJsonData(sourceKey,collectionName))
       }
      // await this.setDocument(collectionName,destinationKey,mongdoc)
      var result = await redis.call('COPY', sourceKey, destinationKey);  
      return result;
    } catch (error) {
      throw error;
    }
  }  

  async getstreamKey(key: string) {
    try {
      let keys
       keys = await redis.keys(key); 
      if(keys?.length == 0){
        keys = await this.getDocumentKeys(key)
      }
      return keys;
    } catch (error) {
      throw error;
    }
  }

 
  //------------------------ MONGO DB ----------------------------//

  async setDocument(collectionName: string, key: string, value: any,path?:any,filter?:object){
    try {
     
      const collection = db.collection(collectionName+'_AMDKEYS');
 
      let customId:any = { _id:key}
     
      let customVal:any = { $set: { value } }      
     
      if(filter)    
        customId = Object.assign(customId,filter) 

      if(path){
        if(path.includes('[') && path.includes(']')){ 
          path = path.replace(']', '');
          path = path.replace('[', '');
        }
        path = 'value.'+path
        customVal = { $set: { [path]:value } }
      }
     
      var result = await collection.findOneAndUpdate(customId,customVal,{ upsert: true, returnDocument: 'after' })
   
      if (result) {
        return result
      } else {
        return 0
      }
    } catch (error) {
      throw error
    }
  }  

  async getDocumentKeys(collectionName: string, key?: string){
    try {
      let collection;
      let result
      if(key){
         collection = db.collection(collectionName+'_AMDKEYS'); 
         const regex = new RegExp(`${key}`, 'i');
          result = await collection.find({ _id: regex }).toArray();    
        }
      else{
        collection = db.collection(collectionName);
         result = await collection.find().toArray();
        }  
        
       let arrID=[]
      if (result && result.length>0) {
       
        for(let v=0; v<result.length; v++){
          arrID.push(result[v]?._id)
        }
        return arrID
      } else {
        return arrID
      }
    } catch (error) {
      throw error
    }
  }

  async getDocument(collectionName: string, key: string, path?:any,filter?:object){
    try {
     
      const collection = db.collection(collectionName+'_AMDKEYS');   
     
      let customId:any = {
        _id: new RegExp(`${key}`, 'i')
      }    
          
      var result = await collection.find(customId).toArray();  
      console.log(1,JSON.stringify(result));     
      if (result?.length>0) {       
        if(path){   
          return await _.get(result?.[0],'value'+path)         
        }
        return result
      } else {
        return 0
      }
    } catch (error) {
      throw error
    }
  }

  async getCollection(collectionName: string){
    try {     
      const collection = db.collection(collectionName+'_AMDKEYS'); 
      var result = await collection.find().toArray();  
       
      if (result?.length>0) { 
        return result
      } else {
        return 0
      }
    } catch (error) {
      throw error
    }
  }

  async listCollections(collectionName?:string){
    try {
      let collections = []
      let collectionList = await db.listCollections().toArray();
      collectionList.forEach(collection => {
        if(collectionName){
          if(collection.name.includes(collectionName)){
            collections.push(collection.name);
          }
        }else{
          collections.push(collection.name);
        }
      });
      if(collections.length > 0){
        return collections
      }else{
        return 0
      }
    } catch (error) {
      throw error
    }
  }

  async existsDocument(collectionName: string, key: string){
    try {      
      const collection = db.collection(collectionName+'_AMDKEYS'); 
      let customId:any = {_id:key}  
     
      var result = await collection.findOne(customId,{ projection: { _id: 1 } })   
       
      if (result) {
        return result
      } else {
        return 0
      }
    } catch (error) {
      throw error
    }
  }

  async appendDocumentData(collectionName: string, key: string,AppendValue:any){
    try {
      const collection:any = db.collection(collectionName+'_AMDKEYS'); 
      let customId:any = {_id:key}

      var result:any = await collection.find(customId).toArray()
     
      if(result?.length>0){                
        let pushQry = { $push: { ['value'] : AppendValue } }
               
        return await collection.updateOne(customId, pushQry);
             
      }else{  
        return await this.setDocument(collectionName,key,[AppendValue])
      }

    } catch (error) {
      throw error
    }
  }

  async appendStreamDocument(collectionName: string, key: string,AppendValue:any){
    try {
      const collection:any = db.collection(collectionName); 
      let customId:any = {_id:key}

      var result:any = await collection.find(customId).toArray()
     
      if(result?.length>0){                
        let pushQry = { $push: { ['value'] : AppendValue } }
               
        return await collection.updateOne(customId, pushQry);
             
      }else{  
        return await this.setStreamDocument(collectionName,key,[AppendValue])
      }

    } catch (error) {
      throw error
    }
  }

  async setStreamDocument(collectionName: string, key: string, value: any,path?:any,filter?:object){
    try {
     
      const collection = db.collection(collectionName);
 
      let customId:any = { _id:key}
     
      let customVal:any = { $set: { value } }      
     
      if(filter)    
        customId = Object.assign(customId,filter) 

      if(path){
        if(path.includes('[') && path.includes(']')){ 
          path = path.replace(']', '');
          path = path.replace('[', '');
        }
        path = 'value.'+path
        customVal = { $set: { [path]:value } }
      }
     
      var result = await collection.findOneAndUpdate(customId,customVal,{ upsert: true, returnDocument: 'after' })
   
      if (result) {
        return result
      } else {
        return 0
      }
    } catch (error) {
      throw error
    }
  }  

  async convertStreamStruct(collectionName){
    try {   
    const collection = db.collection(collectionName); 
    let docs: any =  await collection.find().toArray();  
      
    let FinalArr = [];  
    
    if (docs?.length > 0) {
      let EntryIdArr = []
      for (let d = 0; d < docs.length; d++) {
        let singleDoc = docs[d];
        let singleDocId = singleDoc._id;
        let singleDocValArr = singleDoc.value;

       
        for(let v = 0; v < singleDocValArr.length; v++){
          let fieldKeyArr = [];
          let EntryId = singleDocValArr[v].EntryId
          delete singleDocValArr[v].EntryId
      
          await redis.xadd(collectionName, EntryId, singleDocId, JSON.stringify(singleDocValArr[v]));

          fieldKeyArr.push(EntryId,[singleDocId,JSON.stringify(singleDocValArr[v])]);
        
          EntryIdArr.push(fieldKeyArr);
        }      

      }
      FinalArr.push([collectionName,EntryIdArr]);
      return FinalArr
     
    }

    } catch (error) {
      throw error
    }
  }

   async convertStreamRangeStruct(collectionName){
    try {   
    const collection = db.collection(collectionName); 
    let docs: any =  await collection.find().toArray(); 
    
    if (docs?.length > 0) {
      let EntryIdArr = []
      for (let d = 0; d < docs.length; d++) {
        let singleDoc = docs[d];
        let singleDocId = singleDoc._id;
        let singleDocValArr = singleDoc.value;

       
        for(let v = 0; v < singleDocValArr.length; v++){
          let fieldKeyArr = [];
          let EntryId = singleDocValArr[v].EntryId
          delete singleDocValArr[v].EntryId
      
          await redis.xadd(collectionName, EntryId, singleDocId, JSON.stringify(singleDocValArr[v]));

          fieldKeyArr.push(EntryId,[singleDocId,JSON.stringify(singleDocValArr[v])]);
        
          EntryIdArr.push(fieldKeyArr);
        }      
       
      }     
      return EntryIdArr
     
    }

    } catch (error) {
      throw error
    }
  }
   

 async renameDocumentId(collectionName: string,oldId: string,newId: string): Promise<string> {
  try {    
    const collection = db.collection<any>(collectionName +'_AMDKEYS');    
    const doc = await collection.findOne({ _id: oldId });
    if (!doc) {
      throw (`_id "${oldId}" not found`);
    }    
    doc._id = newId;
    await collection.insertOne(doc);  
    return newId;
  } catch (error) {
    throw error
  }
}


async deleteDocument(collectionName:string,key:any){
  try{
    const collection = db.collection(collectionName+'_AMDKEYS');
      let res = await collection.deleteOne({_id:key} )
      return res;
  }catch(err){
    throw err;
  }
}
  
}