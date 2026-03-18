
import { BadGatewayException, BadRequestException, HttpStatus, Injectable,Logger } from "@nestjs/common";
import axios, { AxiosRequestConfig } from 'axios';
import * as FormData from 'form-data';
import { readAPIDTO,errorObj } from "./dto";
import { RuleService } from "./ruleService";
import { CodeService } from "./codeService";
import { CustomException } from "./customException";
import { JwtService } from "@nestjs/jwt";
import { RedisService } from "./redisService";
import { MongoService } from "./mongoService";
import { format } from 'date-fns';
import jsonata from "jsonata";
const vault = require('node-vault');
import * as crypto from 'crypto';
import { publicEncrypt,privateDecrypt,generateKeyPairSync  } from 'crypto';
import * as fs from 'fs';
import * as stream from 'stream';
import { Readable } from "stream";
import path from "path";
import Redis from 'ioredis';
import * as pg from "pg";
import { GridFSBucket } from "mongodb";
import { MongoClient, ObjectId , Db} from "mongodb";
import { ConfigService } from "@nestjs/config";
const NodeRSA = require('node-rsa')
import { Cron, CronExpression } from "@nestjs/schedule";
import { readdir, readFile } from 'fs/promises';
import { connectToMongo, getDb } from "./mongoClient";
import { EnvData } from "src/envData/envData.service";
import { decrypt } from "src/decrypt";
const _ = require("lodash")

let db:Db

// export const client = new MongoClient(process.env.MONGODB_URL);
//   client.connect()
//     .then(() => {
//     console.log('Connected to the database successfully!');
//     })
//     .catch((err) => {
//     console.error('Error connecting to the database:', err);
//     });
//   var db= client.db(process.env.MONGODB_NAME)

connectToMongo().then(async () => { 
    db = await getDb();
    console.log('Database initialized'); 
  }).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  }); 
 
  type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
  type JsonObject = { [key: string]: JsonValue };
  type JsonArray = JsonValue[];

@Injectable()
export class CommonService{

  private readonly ftpOutputPath: string;
  private readonly seaweedOutPutPath:string;
  private vaultClient: ReturnType<typeof vault>;
  private client: MongoClient;
  private readonly encryptionKey =  process.env.VAULT_KEY;
  private vaultAddr: string;
  private vaultToken: string;
  private vaultKey: string;
  private bucket: GridFSBucket;
  constructor(private readonly ruleEngine:RuleService,
    private readonly codeService:CodeService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly mongoService: MongoService,
    private readonly configService: ConfigService,
    private readonly envData:EnvData
  ) {  
    //this.ftpOutputPath = process.env.FTP_OUTPUT_HOST; 
    //this.seaweedOutPutPath = process.env.SEAWEED_OUTPUT_HOST;
    this.vaultAddr = this.configService.get<string>('VAULT_URL',process.env.VAULT_URL);
    this.vaultToken = this.configService.get<string>('VAULT_TOKEN',process.env.VAULT_TOKEN); // Store this in .env
    this.vaultKey = this.configService.get<string>('VAULT_KEY',process.env.VAULT_KEY);
    this.vaultClient = vault({
          apiVersion: 'v1',
          endpoint: process.env.VAULT_URL,
          token: process.env.VAULT_TOKEN, //Use a service token with limited permissions
        });
  }

  async  getLatestMigrationSql(isLocal?: string ): Promise<string> {
    // Determine the base migrations directory based on isLocal
    const migrationsDir = isLocal === 'dev'
      ? './dist/erd/prisma/migrations'
      : './dist/prisma/migrations';

    // Read all entries in the migrations directory
    //const migrationEntries = await readdir(migrationsDir, { withFileTypes: true });

    // Filter only directories and sort them
    //const migrationFolders = migrationEntries
    //  .filter(entry => entry.isDirectory())
    //  .map(entry => entry.name)
    //  .sort();

    // Get the latest migration folder
    //const latestMigrationFolder = migrationFolders.at(-1);
    // if (!latestMigrationFolder) {
    //   throw new Error(`No migration folders found in ${migrationsDir}`);
    // }

    //console.log('Latest migration folder:', latestMigrationFolder);

    // Read the SQL file inside the latest migration folder
    //const migrationSqlPath = `${migrationsDir}/${latestMigrationFolder}/migration.sql`;
    const migrationSql = await readFile(`${migrationsDir}/ddlChanges.sql`, 'utf-8');

    console.log('Migration SQL content:', migrationSql);

    return migrationSql;
  }

  replaceKeysWithDollar(
    obj: JsonValue,
    replacement: string = ''
  ): JsonValue {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.replaceKeysWithDollar(item, replacement));
    }

    const result: JsonObject = {};
    
    for (const key of Object.keys(obj)) {
      const newKey = key.includes('$') ? key.replace(/\$/g, replacement) : key;
      result[newKey] = this.replaceKeysWithDollar((obj as JsonObject)[key], replacement);
    }

    return result;
  }

  async onModuleInit() {
   //const collection = client.db("UploadFile")
    const collection = await getDb()
    this.bucket = new GridFSBucket(collection, { bucketName: 'CI001/AG001/A001/v1' });
  }
  private readonly logger = new Logger(CommonService.name) 

    async encrypt(value: string,context:string): Promise<string> {
        const result = await this.vaultClient.write(`transit/encrypt/${this.encryptionKey}`, {
          plaintext: Buffer.from(value).toString('base64'),
          context:Buffer.from(context).toString('base64')
        });
        return result.data.ciphertext;
    }

    async decrypt(ciphertext: string,context:string): Promise<string> {
        const result = await this.vaultClient.write(`transit/decrypt/${this.encryptionKey}`, {
          ciphertext,
          context:Buffer.from(context).toString('base64')
        });
        return Buffer.from(result.data.plaintext, 'base64').toString('utf-8');
    }    

      async getEncryptionInfo(dpdKey,encMethod){
      try {
        if (dpdKey && await this.redisService.exist(dpdKey + ':NDP',process.env.CLIENTCODE)) {
          let dpdData = JSON.parse(await this.redisService.getJsonData(dpdKey + ':NDP',process.env.CLIENTCODE))
          if (!dpdData || Object.keys(dpdData).length == 0) throw `${dpdKey}:NDP value was empty`
          let dpdNodeId = Object.keys(dpdData)[0]
          let encryptData = dpdData[dpdNodeId]?.data?.encryption
          if (encryptData && Object.keys(encryptData).length > 0) {
            let encryptionInfo = encryptData?.encryptionInfo?.items
            if(encryptionInfo && encryptionInfo.length > 0){
              for(let e=0;e< encryptionInfo.length;e++){
                if(encryptionInfo[e].type == encMethod){
                  return {encMethod,encCredentials:encryptionInfo[e]}
                }
              }
            }
          }
        } else {
          throw `Key not found ${dpdKey}`
        }

      } catch (error) {
        //console.log('ERROR',error);
        throw error
      }
    }

     async commonEncryption(dpdKey,Method,value,context:string): Promise<any> {
      try {        
        let getCredentials = await this.getEncryptionInfo(dpdKey,Method)
        if(getCredentials){
          let encryptCredentials = getCredentials?.encCredentials
          let encMethod = getCredentials?.encMethod
          
          //console.log('encryptCredentials',encryptCredentials);

          if(encMethod && encryptCredentials){
            if(encMethod == 'vault'){
              const vaultClient = vault({
                apiVersion: 'v1',
                endpoint: encryptCredentials.url,
                token: encryptCredentials.token,
              });
              value = JSON.stringify(value)
               const result = await vaultClient.write(`transit/encrypt/${encryptCredentials.key}`, {
                plaintext: Buffer.from(value).toString('base64'),
                context:Buffer.from(context).toString('base64')
              });
              return result.data.ciphertext;
            }else if(encMethod == 'AESCTR'){
             
              const iv = Buffer.from(encryptCredentials.IVlength, 'base64')
              const key = Buffer.from(encryptCredentials.Key, 'base64');        
              const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);        
              let encrypted = cipher.update(JSON.stringify(value), 'utf8', 'base64');        
              encrypted += cipher.final('base64');        
             
              return encrypted;
    
            }else if(encMethod == 'AESGCM'){    
 
              const key = Buffer.from(encryptCredentials.Key, 'base64');
              const iv = Buffer.from(encryptCredentials.IVlength, 'base64')
 
              const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
              let encrypted = cipher.update(JSON.stringify(value), 'utf8', 'base64');
              encrypted += cipher.final('base64');
 
              const authTag = cipher.getAuthTag();
             
             return {encrypted,authTag:authTag.toString('base64')};
            }else if (encMethod == 'RSA') {
              const publicKey = encryptCredentials.publicKey
              const encryptData = async (data: string) => {
                const key = new NodeRSA(publicKey)
                return key.encrypt(data, 'base64') // Encrypted data in base64
              }

              const sensitiveData = value
              const encryptedData = await encryptData(
                JSON.stringify(sensitiveData)
              )
              return encryptedData
            }else{
              throw 'Invalied Encryption Method'
            }
          }
            
        }
      } catch (error) {
        throw new BadGatewayException(error);
      }
    }

    async commondecryption(dpdKey,Method,encryptedData: any,context): Promise<any> {
      try {      
        let getCredentials = await this.getEncryptionInfo(dpdKey,Method)
        if(getCredentials){
          let encryptCredentials = getCredentials.encCredentials
          let encMethod = getCredentials.encMethod
  
         // console.log('encryptCredentials',encryptCredentials);  
          if(encMethod && encryptCredentials){
            if(encMethod == 'vault'){
              const vaultClient = vault({
                apiVersion: 'v1',
                endpoint: encryptCredentials.url,
                token: encryptCredentials.token,
              });
             
               const result = await vaultClient.write(`transit/decrypt/${encryptCredentials.key}`, {
                ciphertext:encryptedData.ciphertext,
                context:Buffer.from(context).toString('base64')
              });
              return Buffer.from(result.data.plaintext, 'base64').toString('utf-8');
            }else if(encMethod == 'AESCTR'){
              
              let key = Buffer.from(encryptCredentials.Key, 'base64'); 
              let iv = Buffer.from(encryptCredentials.IVlength , 'base64');

              const decipher = crypto.createDecipheriv('aes-256-ctr',key ,iv );
              let decrypted = decipher.update(encryptedData.ciphertext, 'base64', 'utf8');
              decrypted += decipher.final('utf8');
              return decrypted;
    
            }else if(encMethod == 'AESGCM'){
              let key = Buffer.from(encryptCredentials.Key, 'base64');
              let iv = Buffer.from(encryptCredentials.IVlength, 'base64');
 
              const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
              decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'base64'));
             
              let decrypted = decipher.update(encryptedData.ciphertext, 'base64', 'utf8');
              decrypted += decipher.final('utf8');
 
              return decrypted;
             
            }else if (encMethod == 'RSA') {
              try{
              const key = new NodeRSA(encryptCredentials.privateKey);
              const decrypted = key.decrypt(encryptedData.ciphertext, 'utf8');

              return decrypted
              }catch (error) {
              console.error('Decryption error:', error);
              throw error
              }
            }else{
              throw 'Invalied Encryption Method'
            }
          }
        }
      } catch (error) {
        throw new BadGatewayException(error);
      }
    }

    async aes256ctrEncrypt(buffer: Buffer): Promise<Buffer> {
      try {
        const key = Buffer.from(process.env.AES_KEY, 'base64');
        const iv = Buffer.from(process.env.AES_IV, 'base64');

        const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
        const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
        return encrypted;
      } catch (error) {
        throw error
      }
    }

    async aes256ctrDecrypt(encryptedBuffer: Buffer): Promise<Buffer> {
      try {
      const key = Buffer.from(process.env.AES_KEY!, 'base64');
      const iv = Buffer.from(process.env.AES_IV!, 'base64');

      const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv);
      const decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);

      return decrypted
      } catch (error) {
        throw error
      }
    }

    async encryptFile(buffer: Buffer,context:string): Promise<string> {
      const base64Plaintext = buffer.toString('base64');
      interface VaultEncryptResponse {
        data: {
          ciphertext: string,
        };
      }
      const res = await axios.post<VaultEncryptResponse>(
        `${this.vaultAddr}/v1/transit/encrypt/${this.vaultKey}`,
        { plaintext: base64Plaintext,
          context:Buffer.from(context).toString('base64')
         },
        {
          headers: {
            'X-Vault-Token': this.vaultToken,
          },
        }, 
      );
      return res.data.data.ciphertext;
    }
 
    async decryptFile(ciphertext: string,context:string): Promise<Buffer> {
      interface VaultDecryptResponse {
        data: {
          plaintext: string;
        };
      }
      const res = await axios.post<VaultDecryptResponse>(
        `${this.vaultAddr}/v1/transit/decrypt/${this.vaultKey}`,
        { ciphertext,context:Buffer.from(context).toString('base64') },
        {
          headers: {
            'X-Vault-Token': this.vaultToken,
          },
        },
      );
      return Buffer.from(res.data.data.plaintext, 'base64');
    }

    async findFileById(id: string | string[]) {
      // Handle single ID or array of IDs
      if (Array.isArray(id)) {
        const objectIds = id.map(fileId => new ObjectId(fileId));
        const files = await this.bucket.find({ _id: { $in: objectIds } }).toArray();
        return files;
      } else {
        const files = await this.bucket.find({ _id: new ObjectId(id) }).toArray();
        return files[0];
      }
    }

    async uploadFile(file: { buffer: Buffer; filename: string; mimetype: string; size: number },context: string, enableEncryption: string): Promise<any> {
      //const encrypted = await this.encryptFile(file.buffer, context);
      let encrypted:Buffer 
      if(enableEncryption === "true" ){
       encrypted = await this.aes256ctrEncrypt(file.buffer);
      }else{
         encrypted = file.buffer;
      }
      const uploadStream = this.bucket.openUploadStream(file.filename, {
        metadata: { isEncrypted: enableEncryption },
        contentType: file.mimetype,
      });
      uploadStream.end(encrypted);
      return { message: 'Encrypted file uploaded successfully', fileId: uploadStream.id.toString() };
    }
   
    async getFile(id: string | string[], context: string,enableEncryption: Boolean): Promise<Buffer | Buffer[]> {
      // Handle array of IDs
      if (Array.isArray(id)) {
        const buffers: Buffer[] = [];
        for (const fileId of id) {
          const buffer = await this.getSingleFile(fileId, context, enableEncryption);
          buffers.push(buffer);
        }
        return buffers;
      } else {
        return this.getSingleFile(id, context, enableEncryption);
      }
    }

    private async getSingleFile(id: string, context: string, enableEncryption: Boolean): Promise<Buffer> {
      let decrypted: Buffer;
      const chunks: Buffer[] = [];
      const downloadStream = this.bucket.openDownloadStream(new ObjectId(id));
      return new Promise<Buffer>((resolve, reject) => {
        downloadStream.on('data', (chunk) => chunks.push(chunk));
        downloadStream.on('end', async () => {
          const ciphertext = Buffer.concat(chunks);
          try {
            if (enableEncryption) {
              decrypted = await this.aes256ctrDecrypt(ciphertext);
            } else {
              decrypted = ciphertext;
            }
            resolve(decrypted);
          } catch (err) {
            reject(err);
          }
        });
        downloadStream.on('error', reject);
      });
    }
    async eventFunction(eventProperty: any) {
        let eventsDetails: any = [];
        const eventDetailsArray: any[] = [];
        let eventDetailsObj: any = {};
        function addEventDetailsArray(data) {
          if (data.length > 0) {
            data.forEach((item) => {
              eventDetailsArray.push({
                id: item.id,
                name: item.name,
                type: item.type,
                eventContext: item?.eventContext,
                targetKey: item.targetKey,
                sequence: item.sequence,
                key: item.key,
                url: item?.hlr?.params?.url,
                status: item?.hlr?.params?.status,
                primaryKey: item?.hlr?.params?.primaryKey,
                tableName: item?.hlr?.params?.tableName,
                hlr: item?.hlr,
              });
              if (item.children?.length > 0) {
                addEventDetailsArray(item.children);
              }
            });
          }
        }
        function addeventDetailsObj(data) {
          if (data.length > 0) {
            data.forEach((item) => {
              eventDetailsObj = {
                ...eventDetailsObj,
                [`${item.id}`]: {
                  id: item.id,
                  name: item.name,
                  type: item.type,
                  sequence: item.sequence,
                },
              };
              if (item.children?.length > 0) {
                addeventDetailsObj(item.children);
              }
            });
          }
        }
        addEventDetailsArray([{ ...eventProperty }]);
        addeventDetailsObj([{ ...eventProperty }]);
        eventsDetails.push(eventDetailsArray);
        eventsDetails.push(eventDetailsObj);
        return eventsDetails;
      }

      async errorLog(errGrp: string, fabric: string, errType: string, errCode: string,errorMessage: string,key: string, token: string, optnlParams?) {
        let errorObj: errorObj = {
          tname: 'TG',
          errGrp: errGrp,
          fabric: fabric,
          errType: errType,
          errCode: errCode,
        };
        const statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
        let errObj: any = await this.commonErrorLogs(
          errorObj,
          token,
          key,
          errorMessage,
          statusCode,
          optnlParams
        );
        return errObj
        //throw errObj;
      }

      async readMDK(readMDdto: any) {
        try {
          if (readMDdto.AFSK)
            var key: any =
              'CK:' +
              readMDdto.CK +
              ':FNGK:' +
              readMDdto.FNGK +
              ':FNK:' +
              readMDdto.FNK +
              ':CATK:' +
              readMDdto.CATK +
              ':AFGK:' +
              readMDdto.AFGK +
              ':AFK:' +
              readMDdto.AFK +
              ':AFVK:' +
              readMDdto.AFVK +
              ':' +
              readMDdto.AFSK;
          //var request: any = await redis.call('JSON.GET', key);
          var request:any = await this.redisService.getJsonData(key,process.env.CLIENTCODE)
          return request;
        } catch (error) {
          throw new BadGatewayException(error);
        }
      }
    

      async getFormat(finalArr, input): Promise<any> {
        const output = { CKList: [] };
    
        finalArr.forEach((item) => {
          const ck = item[1];
          const fngk = item[3];
          const fnk = item[5];
          const catk = item[7];
          const afgk = item[9];
          const afk = item[11];
          const afvk = item[13];
          const afsk = item[14];
    
          let ckObj = output.CKList.find((obj) => obj.CK === ck);
          if (!ckObj) {
            ckObj = { CK: ck, FNGKList: [] };
            output.CKList.push(ckObj);
          }
    
          let fngkObj = ckObj.FNGKList.find((obj) => obj.FNGK === fngk);
          if (!fngkObj) {
            fngkObj = { FNGK: fngk, FNKList: [] };
            ckObj.FNGKList.push(fngkObj);
          }
    
          let fnkObj = fngkObj.FNKList.find((obj) => obj.FNK === fnk);
          if (!fnkObj) {
            fnkObj = { FNK: fnk, CATKList: [] };
            fngkObj.FNKList.push(fnkObj);
          }
    
          let catkObj = fnkObj.CATKList.find((obj) => obj.CATK === catk);
          if (!catkObj) {
            catkObj = { CATK: catk, AFGKList: [] };
            fnkObj.CATKList.push(catkObj);
          }
    
          let afgkObj = catkObj.AFGKList.find((obj) => obj.AFGK === afgk);
          if (!afgkObj) {
            afgkObj = { AFGK: afgk, AFKList: [] };
            catkObj.AFGKList.push(afgkObj);
          }
    
          let afkObj = afgkObj.AFKList.find((obj) => obj.AFK === afk);
          if (!afkObj) {
            afkObj = { AFK: afk, AFVKList: [] };
            afgkObj.AFKList.push(afkObj);
          }
    
          let afvkObj = afkObj.AFVKList.find((obj) => obj.AFVK === afvk);
          if (!afvkObj) {
            afvkObj = { AFVK: afvk, AFSKList: [] };
            afkObj.AFVKList.push(afvkObj);
          }
          let afskObj = afvkObj.AFSKList.find((obj) => obj.AFSK === afsk);
          if (!afskObj) {
            afskObj = afsk;
            afvkObj.AFSKList.push(afskObj);
          }
        });
    
        var jsonPath;
        if (input.AFVK.length > 0) {
          jsonPath = 'CKList.FNGKList.FNKList.CATKList.AFGKList.AFKList.AFVKList';
        } else if (input.AFK.length > 0) {
          jsonPath = 'CKList.FNGKList.FNKList.CATKList.AFGKList.AFKList';
        } else if (input.AFGK.length > 0) {
          jsonPath = 'CKList.FNGKList.FNKList.CATKList.AFGKList';
        } else if (input.CATK.length > 0) {
          jsonPath = 'CKList.FNGKList.FNKList.CATKList';
        } else {
          jsonPath = 'CKList.FNGKList.FNKList.CATKList';
        }
        const expression = jsonata(jsonPath);
        var customresult = await expression.evaluate(output);
        const removeKeys = (obj: any, keys: string[]): any => {
          if (Array.isArray(obj)) return obj.map((item) => removeKeys(item, keys));
          if (typeof obj === 'object' && obj !== null) {
            return Object.keys(obj).reduce((previousValue: any, key: string) => {
              return keys.includes(key)
                ? previousValue
                : { ...previousValue, [key]: removeKeys(obj[key], keys) };
            }, {});
          }
          return obj;
        };
        var finalResponse;
        if (input.stopsAt) {
          if (input.stopsAt == 'AFVK') {
            finalResponse = await removeKeys(customresult, ['AFSKList']);
          } else if (input.stopsAt == 'AFK') {
            finalResponse = await removeKeys(customresult, ['AFVKList']);
          } else if (input.stopsAt == 'AFGK') {
            finalResponse = await removeKeys(customresult, ['AFKList']);
          } else if (input.stopsAt == 'CATK') {
            finalResponse = await removeKeys(customresult, ['AFGKList']);
          } else {
            return customresult;
          }
          return finalResponse;
        } else {
          return customresult;
        }
      }

  async readKeys(input) {
      var response = [];
      var keyArray = [];
      var spiltArray = [];
      var finalArr = [];
  
      if (input.AFSK && input.AFSK.length > 0) {
        var res = await this.readMDK(input);
        return res;
      }
      for (const catk of input.CATK.length ? input.CATK : ['*']) {
        for (const afgk of input.AFGK.length ? input.AFGK : ['*']) {
          for (const afk of input.AFK.length ? input.AFK : ['*']) {
            for (const afvk of input.AFVK.length ? input.AFVK : ['*']) {
              const key = `CK:${input.CK}:FNGK:${input.FNGK}:FNK:${input.FNK}:CATK:${catk}:AFGK:${afgk}:AFK:${afk}:AFVK:${afvk}`;
              response.push(key);
            }
          }
        }
      }
      const trimTrailingStars = (str: string): string => {
        const parts = str.split(':');
        while (parts.length > 0 && parts[parts.length - 1] === '*') {
          parts.pop();
        }
        return parts.join(':');
      };
  
      var finalkey = response.map(trimTrailingStars);
      for (var i = 0; i < finalkey.length; i++) {
        var getkeys = await this.redisService.getKeys(finalkey[i],process.env.CLIENTCODE);
        keyArray.push(getkeys);
      }
      for (var j = 0; j < keyArray.length; j++) {
        for (var k = 0; k < keyArray[j].length; k++) {
          spiltArray.push(keyArray[j][k].split(':'));
        }
      }
      for (let i = 0; i < spiltArray.length; i++) {
        if (input.CATK.includes(spiltArray[i][7]) || input.CATK.length == 0) {
          if (input.AFGK.includes(spiltArray[i][9]) || input.AFGK.length == 0) {
            if (input.AFK.includes(spiltArray[i][11]) || input.AFK.length == 0) {
              if (
                input.AFVK.includes(spiltArray[i][13]) ||
                input.AFVK.length == 0
              ) {
                finalArr.push(spiltArray[i]);
              }
            }
          }
        }
      }
  
      var finalres: any = await this.getFormat(finalArr, input);
    
      return finalres;
    }
  async readAPI(keys: string, clientCode: string, token:string): Promise<any> {
      try {      
        let result:any = structuredClone(JSON.parse(await this.redisService.getJsonData(keys,clientCode)));
        return result
      } catch (error) {
        await this.errorLog(
            'Technical',
            'AK',
            'Fatal',
            'TG002',
            'Invalid assembler key',
            keys,
            token,
          );
      }
    //   const keyParts = keys.split(':');
    //   const catk: string[] = [];
    //   const afgk: string[] = [];
    //   const ak: string[] = [];
    //   const afvk: string[] = [];
    //   const afsk: string = keyParts[14];
    //   const ck = keyParts[1];
    //   const fngk = keyParts[3];
    //   const fnk = keyParts[5];
    //   catk.push(keyParts[7]);
    //   afgk.push(keyParts[9]);
    //   ak.push(keyParts[11]);
    //   afvk.push(keyParts[13]);

    //   let readAPIBody: readAPIDTO = {
    //     SOURCE: source,
    //     TARGET: target,
    //     CK: ck,
    //     FNGK: fngk,
    //     FNK: fnk,
    //     CATK: catk,
    //     AFGK: afgk,
    //     AFK: ak,
    //     AFVK: afvk,
    //     AFSK: afsk,
    //   };

    //   // const readKey = await axios.post(
    //   //   process.env.TORUS_URL + '/api/readkey',
    //   //   readAPIBody,
    //   // );
    //   let URL = process.env.TORUS_URL +'/readkey'
    //   const readKey = await axios.post(
    //    URL,
    //      readAPIBody,
    //      {
    //   headers: {
    //     Authorization: `Bearer ${token}`
    //   }
    // }
    //    );

    //   return readKey.data;
    }
    
    async postCall(url,body,headers?){ 
      return await axios.post(url,body,headers)
      .then((res) => this.responseData(res.status, res.data).then((res) => res))
      .catch((err) => {throw err});  
    }

    async axiosPostCall(url,body,headers?){ 
      let response = await axios.post(url,body,headers)
      return response.data;
    }  

    
    async responseData(statuscode:any, data: any,): Promise<any> {
      try{
         if(!statuscode)
          statuscode = 201
        var resobj = {} 
      if(statuscode == 201 || statuscode == 200)   
        resobj['status'] = 'Success'
      else
      resobj['status'] = 'Failure'
      resobj['statusCode'] = statuscode,
      resobj['result'] = data     
      return resobj
    }catch(err){
      throw err
    }
    } 

    async getCall(url,headers?){   
      return await axios.get(url,headers)
      .then((res) => this.responseData(res.status, res.data).then((res) => res))
      .catch((err) => {throw err});  
    } 
    
    
    async getRuleCodeMapper(currentNode, inputparam,processedKey,fabric ,SessionInfo ){
      try {       
        let zenresult
        var ResultObj = {}
        let fieldarr = []
        let rule = currentNode?.rule
        let customCode = currentNode?.code   
        //console.log("SessionInfo",SessionInfo);        
        if(rule && Object.keys(rule).length > 0){
          var nodes = rule.nodes     
          if(nodes && nodes.length > 0){
            for(var c=0;c < nodes.length;c++){
              var content = nodes[c].content
              if(content){
                let inputs = content.inputs
                if(inputs?.length > 0){
                  for(let i=0;i < inputs.length;i++){
                    fieldarr.push(content.inputs[i].field)
                  }
                }                
                if(fieldarr?.length == 0)
                  throw 'Field not found in rule'
              }            
            }           
            var gparamreq = {}; 
             let afpVal,data,sarr = []
            for(let i=0;i < fieldarr.length;i++){ 
              // let connectedNodeName = fieldarr[i].split('.')[0]
              // let connectedField = fieldarr[i].split('.')[1]
              let field = fieldarr[i].split('.')
              let connectedNodeName = field[0]
              field.shift()            
              let connectedField = field.join('.')
              
              if(!connectedField || !connectedNodeName)
                throw 'connectedField/ connectedNodeName not found in rule'

              if(connectedNodeName == 'session'){
                if(SessionInfo[connectedField]){
                  afpVal = SessionInfo                  
                }
                data = await this.getNestedValue(afpVal, connectedField)
              } else {
                afpVal = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + ':NPV:'+connectedNodeName+'.PRO','.response',process.env.CLIENTCODE))
                connectedField = connectedField.toLowerCase()    
                
                afpVal = await this.keysToLowerCaseOnly(afpVal)
               
              if(afpVal && Array.isArray(afpVal) && afpVal.length > 1 || typeof afpVal == 'string'){               
                var codeVal = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + ':NPV:'+connectedNodeName+'.PRO','.code',process.env.CLIENTCODE))
                var ifoVal = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + ':NPV:'+connectedNodeName+'.PRO','.ifo',process.env.CLIENTCODE))
               if(codeVal[connectedField]){
                 data = await this.getNestedValue(codeVal, connectedField) 
              }
              else if(ifoVal[connectedField])
                  data = await this.getNestedValue(ifoVal, connectedField) 
              else
               throw 'Array of records found in Decision Node'
              }else
                data = await this.getNestedValue(afpVal, connectedField)                 
              }
              
                if(data)               
                  await this.setNestedValue(gparamreq, fieldarr[i], data) 
                
                // else{
                //   throw `${fieldarr[i]} not found in given request to take decision`                    
                // }  
              // }
              } 
              console.log('gparamreq',gparamreq);
              
              var goruleres = await this.ruleEngine.goRule(rule, gparamreq)                  
              if(Object.keys(goruleres.result).length > 0){                   
                //zenresult = goruleres.result.output
                 zenresult = goruleres.result
              }else{
                throw `Rule doesn't matched with this value ${data}`
              }                         
          }     
        }   
      
        if (customCode ) {
          var customcoderesult = await this.codeService.customCode(processedKey, customCode, inputparam,fabric,SessionInfo)
          console.log('customcoderesult',customcoderesult);        
        }    
      
      if(zenresult)
        ResultObj['rule'] = zenresult

      if(customcoderesult)
        ResultObj['code'] = customcoderesult

      return ResultObj 
      } catch (error) {
        throw error
      }          
    }

    keysToLowerCaseOnly(obj: any): any {
      if (Array.isArray(obj)) {
          return obj.map((item) => this.keysToLowerCaseOnly(item));
      } else if (obj !== null && typeof obj === 'object') {
          return Object.entries(obj).reduce((acc, [key, value]) => {
              acc[key.toLowerCase()] = this.keysToLowerCaseOnly(value);
              return acc;
          }, {});
      }
      return obj;
    }

    getNestedValue(obj: any, path: string): any {           
      let zenresultArr = []               
      if (obj) {     
        if(obj && Array.isArray(obj) && obj.length > 1)
          throw 'Array of records found in Decision Node'        
        
        if(obj && Array.isArray(obj) && obj.length == 1){ 
          return _.get(obj[0],path) 
        }else if(typeof obj == 'object' && Object.keys(obj).length>0){
          if (_.get(obj,path)) {            
            return _.get(obj,path) 
          }
        }
      }
      return zenresultArr
    }

    //RollBack Check
     async checkRollBack(Ndp,collectionName,action,currentNode?){
      try {  
        let pfs = currentNode?.pfs
        let ifoflg = []
        if (pfs && pfs.length > 0) {
          for (var j = 0; j < pfs.length; j++) {
            if (pfs[j].nodeId != currentNode?.['nodeid']) {
             // ifoflg++;
             ifoflg.push(pfs[j].nodeId)
            } else {
              break;
            }
          }
        } 
       
        for (let item in Ndp) {         
           if(ifoflg.includes(item)){
            if (Ndp[item]?.rollback == "true") {
            if (action == 'check') {
              if (Ndp[item]?.savePoint) {
                if (Ndp[item].nodeType == 'apinode') {
                  if (!Ndp[item].data?.pro?.primaryKey) throw new CustomException(`PrimaryKey not found in ${Ndp[item].nodeName}`, 404)
                  let apiKey = Ndp[item]?.apiKey
                  if (!apiKey) throw new CustomException(`Reference not found in ${Ndp[item].nodeName}`, 404)
                  let apiNdp = JSON.parse(await this.redisService.getJsonData(apiKey, collectionName))
                  if (!apiNdp) throw new CustomException(`${apiKey} not found `, 404)
                  let serverUrl: any = Object.values(apiNdp)[0]['data']['serverUrl']
                  let endPoint = Object.values(apiNdp)[0]['data']['apiEndpoint']
                  if (!serverUrl || !endPoint) throw new CustomException(`serverUrl/endPoint not found in ${apiKey}`, 404)
                }
                else if (Ndp[item].nodeType == 'dbnode') {
                  let primaryKey = Ndp[item].data?.pro?.primaryKey
                  let tablename = Ndp[item].data?.pro?.tableName
                  if (!primaryKey || !tablename) throw new CustomException(`PrimaryKey / TableName not found in ${Ndp[item].nodeName}`, 404)
                }
              } else {
                throw new CustomException(`Savepoint not found in ${Ndp[item].nodeName}`, 404)
              }
            } else if (action == 'rollback') {
              let primaryKey = Ndp[item]?.data?.pro?.primaryKey
              let insertedData = JSON.parse(await this.redisService.getJsonDataWithPath(currentNode.key + ':NPV:' + Ndp[item].nodeName + '.PRO', '.response', collectionName));
              if (!insertedData || (Object.keys(insertedData).length == 0) || insertedData.length == 0) {
                insertedData = currentNode.data
              }
              if (Ndp[item]?.savePoint == currentNode.savepoint) {              
                if (Ndp[item].nodeType == 'apinode') {                  
                  // let insertedData = JSON.parse(await this.redisService.getJsonDataWithPath(currentNode.key + ':NPV:' + Ndp[item].nodeName + '.PRO', '.response', collectionName));
                  if (!insertedData || (Object.keys(insertedData).length == 0) || insertedData.length == 0) {
                    insertedData = currentNode.data
                  }
                  let apiKey = Ndp[item]?.apiKey
                  let apiNdp = JSON.parse(await this.redisService.getJsonData(apiKey, collectionName))
                  let serverUrl: any = Object.values(apiNdp)[0]['data']['serverUrl']
                  let endPoint = Object.values(apiNdp)[0]['data']['apiEndpoint']
                  let method = (Object.values(apiNdp)[0]['data']['method']).toLowerCase()
                  const requestConfig: AxiosRequestConfig = {
                    headers: {
                      Authorization: `Bearer ${currentNode.token}`,
                    },
                  };                 
                   if (insertedData) {
                    let deleteRes;
                    if (method == 'post') { 
                      if (Array.isArray(insertedData) && insertedData.length > 0) {
                        for (let i = 0; i < insertedData.length; i++) {                       
                          
                          if (insertedData[i][primaryKey]) {
                            let rollBackurl = serverUrl + endPoint + '/' + insertedData[i][primaryKey]
                            deleteRes = await this.deleteCall(rollBackurl, requestConfig)
                          }
                        }
                      } else if (Object.keys(insertedData).length > 0) { 
                          if (insertedData[primaryKey]) {
                            let rollBackurl = serverUrl + endPoint + '/' + insertedData[primaryKey]
                            deleteRes = await this.deleteCall(rollBackurl, requestConfig) 
                          }

                      }
                    } else if (method == 'patch') {
                      let rollbackData = JSON.parse(await this.redisService.getJsonDataWithPath(currentNode.key + ':NPV:' + Ndp[item].nodeName + '.PRO', '.rollback', collectionName));
                      for (let item of rollbackData) {
                        if (item[primaryKey]) {
                          let rollBackurl = serverUrl + endPoint + '/' + item[primaryKey]
                          deleteRes = await this.patchCall(rollBackurl, rollbackData, requestConfig)
                        }
                      }
                    }
                  }
                } else if (Ndp[item].nodeType == 'dbnode') {
                  let qryres: any, manualQry, qry
                  let rollback = Ndp[item]['data']['pro']['enableRollback']['value']
                  if (rollback)
                    manualQry = rollback.subSelection._true.manualQuery
                  Object.keys(insertedData).forEach(key => {
                    const regex = new RegExp(`\\$\\$${key}`, 'g');
                    const value = typeof insertedData[key] === 'string' ? `'${insertedData[key]}'` : insertedData[key];
                    qry = manualQry.replace(regex, value);
                  });
                  // let qry = `DELETE FROM ${tablename} WHERE ${primaryKey} = ${insertedData[primaryKey]};`
                  let conectdb = await this.dbconfig(Ndp[item], collectionName)
                  let db = conectdb.client
                  await db.connect();
                  if (qry) qryres = await db.query(qry);
                  await db.end();
                  //}
                } else if (Ndp[item].nodeType == 'mongo-dbnode') {
                  let manualQry, rmanualQry, manualQryType
                  let rollback = Ndp[item]['data']['pro']['enableRollback']['value']
                  if (rollback) {
                    manualQryType = rollback.subSelection._true.manualQueryType.value
                    rmanualQry = rollback.subSelection._true.manualQueryType.manualQuery
                  }
                  let mconfig = await this.mongodbconfig(Ndp[item], collectionName)
                  let mongodbUrl = mconfig.mongodbUrl
                  //let manualQryType = mconfig.manualQryType
                  const client = new MongoClient(mongodbUrl);
                  client.connect()
                    .then(() => {
                      console.log('Connected to the database successfully!');
                    })
                    .catch((err) => {
                      console.error('Error connecting to the database:', err);
                    });
                  let oprname, idarr = [];
                  let db = client.db();
                  if (manualQryType == 'deleteOne' || manualQryType == 'deleteMany') {
                    if (insertedData.length > 0) {
                      if (manualQryType == 'deleteMany') {
                        for (let x = 0; x < insertedData.length; x++)
                          idarr.push(insertedData[x]['_id'])
                        manualQry = manualQry.replace('$$_ids', idarr)
                        // manualQry = `{ _id : { $in: ${idarr}}}`
                        await db.collection(collectionName)[manualQryType](manualQry);
                      }
                      else {
                        let ids = insertedData[0]['_id']
                        manualQry = manualQry.replace('$$_id', ids)
                        //manualQry = {_id : ids}
                        await db.collection(collectionName)[manualQryType](manualQry);
                      }
                    }
                  }
                }
                else if (Ndp[item].nodeType == 'streamnode') {
                  let rollbackData = JSON.parse(await this.redisService.getJsonDataWithPath(currentNode.key + ':NPV:' + Ndp[item].nodeName + '.PRO', '.rollback', collectionName));
                  let reqData: any;
                  let sconf = await this.streamConfig(Ndp[item], collectionName)
                  if (!sconf.streamName)
                    reqData = JSON.parse(await this.redisService.getJsonDataWithPath(currentNode.key + ':NPV:' + Ndp[item].nodename + '.PRO', '.request', collectionName));
                  else
                    reqData = sconf.streamName
                  if (sconf.oprname == 'write') {
                    if (rollbackData) {
                      if (Array.isArray(rollbackData) && rollbackData.length)
                        rollbackData.forEach(async (item) => await sconf.redisconfig.call('JSON.SET', reqData, '$', JSON.stringify(item)))
                      else
                        await sconf.redisconfig.call('JSON.SET', reqData, '$', JSON.stringify(item))
                    } else {
                      if (Array.isArray(insertedData) && insertedData.length)
                        insertedData.forEach(async (item) => await sconf.redisconfig.call('XDEL', reqData, item))
                      else
                        await sconf.redisconfig.call('XDEL', reqData, insertedData)
                    }

                  }
                }
                else if (Ndp[item].nodeType == 'filenode') {
                  let rollbackData = JSON.parse(await this.redisService.getJsonDataWithPath(currentNode.key + ':NPV:' + Ndp[item].nodeName + '.PRO', '.rollback', collectionName));

                  let fconf = await this.fileConfig(Ndp[item], collectionName)
                  if (fconf.oprname == 'write') {
                    let auth = {
                      username: fconf.seaWeedConfig.username,
                      password: fconf.seaWeedConfig.password
                    }
                    let reqData = JSON.parse(await this.redisService.getJsonDataWithPath(currentNode.key + ':NPV:' + Ndp[item].nodename + '.PRO', '.request', collectionName));
                    let url = `${fconf.seaWeedConfig.url}/${reqData}`
                    if (rollbackData) {
                      await axios.patch(url, rollbackData, { auth });
                    } else
                      await axios.delete(url, { auth });
                  }
                }
                else if (Ndp[item].nodeType == 'procedureexecutionnode' || 'function_node') {
                  let pconf = await this.procedureConfig(Ndp[item], collectionName)
                  if (insertedData && Object.keys(insertedData).length > 0) {
                    Object.keys(insertedData).forEach(key => {
                      const regex = new RegExp(`\\$\\$${key}`, 'g');
                      const value = typeof insertedData[key] === 'string' ? `'${insertedData[key]}'` : insertedData[key];
                      pconf.rexecmd = pconf.rexecmd.replace(regex, value);
                    });
                  }
                  await pconf.client.connect();
                  await pconf.client.query(pconf.rqry)
                  const result = await pconf.client.query(`${pconf.rexecmd}`);
                  await pconf.client.end();
                  // await this.qryExec(pconf.dbType,pconf.dbUrl,pconf.rqry,pconf.rexecmd,'PF-PFD')
                }
              }
            }
          }
           }
          
        }
        // return rollBackArr
      } catch (error) {
        throw error
      }    
    }

    async deleteCall(url, headers?) {
      return await axios.delete(url, headers)
      .then((res) => this.responseData(res.status, res.data).then((res) => res))
      .catch((err) => { return err });
    }
    
      setNestedValue(obj: any, path: string, value: any): void {
      const parts = path.split('.');
      let current = obj;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const match = part.match(/(\w+)\[(\d+)\]/);

        if (match) {
          const [, key, indexStr] = match;
          const index = parseInt(indexStr);
          current[key] = current[key] || [];
          current[key][index] = current[key][index] || {};
          if (i === parts.length - 1) {
            current[key][index] = value;
          } else {
            current = current[key][index];
          }
        } else {
          if (i === parts.length - 1) {
            current[part] = value;
          } else {
            current[part] = current[part] || {};
            current = current[part];
          }
        }
      }
    }

    async getTPL(key: any, upId: any,pfjson:any,status:string, targetQueue:string ,stoken:any,fabric:string,sourceStatus?:string,request?:any,response?:any){
      // this.logger.log("TPL Log Started")     
      var sessionInfo = {} 
      var processInfo = {};
      var tenant = await this.splitcommonkey(key,'CK')
      var app = await this.splitcommonkey(key,'AFGK')
      var token:any = this.jwtService.decode(stoken,{ json: true })
      if(token){       
        sessionInfo['user'] =  token.loginId     
        sessionInfo['accessProfile'] =  token.accessProfile     
      }        
    
        processInfo['key'] = key;
        processInfo['upId'] = upId;
        processInfo['status'] = status;
        if(pfjson.nodeName)
          processInfo['nodeName'] = pfjson.nodeName;
        if(pfjson.nodeId)
          processInfo['nodeId'] = pfjson.nodeId;
        if(pfjson.nodeType)
          processInfo['nodeType'] = pfjson.nodeType;  
        if(sourceStatus){
          processInfo['event'] = sourceStatus;
        } 
        if(targetQueue){
          processInfo['queue'] = targetQueue;
        }         
        //processInfo['mode'] = mode;

        if(status == 'Success'){
          if(request)
            processInfo['request'] = request;                     
                 
          if(response){
            let childObj = {}
            
            if(response.upId){
              childObj['subFlowKey'] = response.key
              childObj['subFlowUpId'] = response.upId
              if(response.eventError)
                childObj['subFlowError'] = response.eventError
              if(response.data)
                childObj['subFlowResponse'] = response.data
              processInfo['subFlowInfo'] = childObj;
            }
            processInfo['response'] = response;
          }
        }else{
          var errdata = {}  
          errdata['tname'] = 'TE'
          if(response.status == 403){
            errdata['errGrp'] = 'Security'
          }else
            errdata['errGrp'] = 'Technical'

          errdata['fabric'] = fabric
          errdata['errType'] = 'Fatal'
          errdata['errCode'] = '001'
          var errorDetails = await this.errorobj(errdata,response,status)
        }   
       var prclogdata:any
        if(status == 'Success'){
          prclogdata = {
            sessionInfo,
            processInfo
          }
        }else{
          prclogdata = {
            sessionInfo,
            processInfo,
            errorDetails
          }
        }       
      
        await this.redisService.setStreamData(tenant+'-'+app+'-TPL', key + upId, JSON.stringify(prclogdata));  
        // this.logger.log("TPL Log completed")     
        return prclogdata 
    } 

    async errorobj(errdata:any,error: any,status:any): Promise<any> {    
      if(error.code){
        if(error.code == 'ETIMEDOUT')
          status=408
      }
      var errobj = {}
        errobj['T_ErrorSource'] = errdata.tname
        errobj['T_ErrorGroup'] = errdata.errGrp
        errobj['T_ErrorCategory'] = errdata.fabric || 9999  // General - 9999
        errobj['T_ErrorType'] = errdata.errType
        errobj['T_ErrorCode'] = errdata.errCode
        errobj['errorCode'] = status
        errobj['errorDetail'] = error?error:''  
      return errobj
     }

     async getTSL(skey:string,token:string,error:any,status:any,mode?:string){     
      var errdata = {}             
      let fabric = await this.splitcommonkey(skey,'FNK')
      var tslkey:any = skey.split(':')      
      if(tslkey[tslkey.length - 1] == '')
        tslkey.pop();      
      
      let key = tslkey.join(':')
     
      errdata['tname'] = fabric
      errdata['errGrp'] = 'Setup'
      errdata['fabric'] = fabric
      errdata['errType'] = 'Fatal'
      errdata['errCode'] = '001'
   
      var processInfo = {
        key: key,        
        mode:mode    
      }
    
      if(!status){
        status = 400
      }
      var logs =  await this.commonErrorLogs(errdata,token,key,error,status,processInfo)    
     return logs      
    }   

    async splitcommonkey(key, spliter){ 
      const parts = key.split(':'); 
      const index = parts.findIndex(part => part === spliter);
     
      if (index !== -1) {   
        return parts[index+1]; 
      }      
    }

    async patchCall(url,data,headers){
      return await axios.patch(url,data,headers)
      .then((res) => this.responseData(res.status, res.data).then((res) => res))
      .catch((err) => {throw err}); 
    }

    async postCallwithDB(url,body,headers?){      
      return await axios.post(url,body,headers)
      .then((res) => !res.data.errorCode? this.responseData(res.status, res.data).then((res) => res): res.data)
      .catch((err) => {throw err});  
    }


    async commonErrorLogs(errdata:any,stoken:any,key:any,error:any,status:any,optnlParams?:any){  
      try{
       let sessionInfo:any = {} 
       let prcdet:any;
       
       let tenant,artifact,ag,app,afvk
        tenant = process.env.TENANT
        ag = process.env.APPGROUPCODE;
        app = process.env.APPCODE;
        afvk = process.env.VERSION 
     
        if(optnlParams){
          artifact = optnlParams.artifact
          sessionInfo['user'] =  optnlParams.users 
          
          key = optnlParams.key?optnlParams.key:`CK:${tenant}:FNGK:AF:FNK:UF-UFW:CATK:${ag}:AFGK:${app}:AFK:${artifact}:AFVK:${afvk}:`        
        }        
        else {          
          artifact = key        
        }

       if(key){
        let keyFlag = 0
        const parts = key.split(":");
        const requiredMarkers = ["CK", "FNGK", "FNK", "CATK", "AFGK", "AFK", "AFVK"];
        requiredMarkers.forEach(marker => {
          const idx = parts.indexOf(marker);
          if (idx === -1 || !parts[idx + 1] || parts[idx + 1] === "undefined" || parts.length < 14) {
            keyFlag++
          }
        });
        if(keyFlag) { 
          key = `CK:${tenant}:FNGK:AF:FNK:UF-UFW:CATK:${ag}:AFGK:${app}:AFK:${artifact}:AFVK:${afvk}:`        
        }
        tenant = await this.splitcommonkey(key,'CK')
        app = await this.splitcommonkey(key,'AFGK')
        var fabric = await this.splitcommonkey(key,'FNK')
        sessionInfo['accessDetails'] = key;       
       }
      //  stoken = null
       if(stoken){
        let token:any = this.jwtService.decode(stoken,{ json: true })
        //let token = await this.MyAccountForClient(stoken)
        if(token){
         
        sessionInfo['user'] = token.loginId || 'user'    
        sessionInfo['accessProfile'] = token.accessProfile 
        sessionInfo['client'] = token.client   
        }  
        } 

        let errorDetails = await this.errorobj(errdata,error,status)
        let logs = {}
        logs['sessionInfo'] = sessionInfo
        if(key){
          if(fabric == 'PF-PFD' || fabric == 'DF-DFD' || fabric == 'PF-SFD' || fabric == 'PF-SCDL')
            logs['processInfo'] = prcdet
          }
        logs['errorDetails'] = errorDetails   
        
        if(typeof key != 'string')
        key = 'commonError'
        tenant=tenant || "CI001"
        app=app ||  "A001"
        await this.redisService.setStreamData(tenant+'-'+app+'-TSL',key,JSON.stringify(logs))    
        return logs

      } catch(err){
        throw err;
      }
    }

   async MyAccountForClient(token: string) {
      const ag = process.env.APPGROUPCODE;
      const app = process.env.APPCODE;
      try {
        const payload: any = this.jwtService.decode(token);
        if (!payload) {
          throw new BadRequestException('Please provide valid token');
        } else {
          let userCachekey
          if (payload.type === "c") {
            userCachekey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${payload.client}:AFK:PROFILE:AFVK:v1:users`;
          } else {
            userCachekey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${payload.client}:AFGK:${ag}:AFK:${app}:AFVK:v1:users`;
          }
         const responseFromRedis = await this.redisService.getJsonData(userCachekey,process.env.CLIENTCODE);
          const userList = JSON.parse(responseFromRedis);
          if(userList?.length>0){
            const reqiredUser = userList.find(
              (user) => user.loginId === payload.loginId,
            );
            delete reqiredUser.password;
            return { ...reqiredUser, client: payload.client };
          } 
        }
      } catch (error) {
        throw new BadRequestException(error)
      }
    }



    async getMongoProcessLogs(input, type): Promise<any> {
      try {
        this.logger.log('get MongoProcess started');

        const {
          tenant, user, FromDate, ToDate,
          fabric, appgroup, app,
          searchParam, page = 1, limit = 10,sortOrder
        } = input;

        if(!tenant) throw 'Invalid Payload'   
       
        let fileName = `${tenant}-${app?.code || ''}`;
        const filter: any = {
          'CK': tenant,
        };
        if (user?.length >0 ) {
          filter['USER'] = { $in: user };
        }

        if (fabric?.length >0 ) {
          filter['FNK'] = { $in: fabric };
        }

        if (appgroup?.code) {
          filter['CATK'] = appgroup.code;
        }

        if (app?.code) {
          filter['AFGK'] = app.code;
        }

        if (FromDate || ToDate) {
          filter['DATE'] = {
            ...(FromDate && { $gte: FromDate }),
            ...(ToDate && { $lte: ToDate }),
          };
        }
        // console.log('Filter for MongoDB query:', filter);
        if (searchParam) {
          const regex = { $regex: searchParam, $options: 'i' };
          filter['$or'] = [
            { 'CK': regex },
            { 'FNGK': regex },
            { 'FNK': regex },
            { 'CATK': regex },
            { 'AFGK': regex },
            { 'AFK': regex },
            { 'AFVK': regex },
            { 'USER': regex },
            { 'DATE': regex },
            { 'UPID': regex },
          ];
        }      
        const allCollections:any = await this.redisService.listCollections(fileName);
        if(!allCollections || !(Array.isArray(allCollections)) || allCollections?.length == 0) throw `Data not found in ${fileName}${type}`

        const targetCollections = allCollections.filter(name => name.endsWith(type));
        let sortingNum = (sortOrder === 'newest') ? -1 : (sortOrder === 'oldest') ? 1 : -1;
        
        const countPromises = targetCollections.map(name =>
          this.mongoService.countDocuments(name, filter)
        );
        const counts = await Promise.all(countPromises);
        const totalDocuments = counts.reduce((sum, c) => sum + c, 0);
        const documentPromises = targetCollections.map(name =>
          this.mongoService.findDocument(name, filter, { _id: 0},{skip: (page - 1) * limit, limit, sortOrder:{DateAndTime:sortingNum}})//value: 1 
        );
        const allDocs = (await Promise.all(documentPromises)).flat(); 
        //const paginatedData = allDocs.slice((page - 1) * limit, page * limit)//.map(d => d.value);

        this.logger.log('get MongoProcess completed');

        return {
          data: allDocs,
          page,
          limit,
          totalPages: Math.ceil(totalDocuments / limit),
          totalDocuments,
        };

      } catch (error) {
        console.error('ERROR', error);
        const message = error?.message || error;
        throw new BadRequestException(message);
      }
    }
 
    async getSubFlowLog(SubFlowKey,subFlowUpId){
      try {
        if(!SubFlowKey || !subFlowUpId) throw 'Invalid Payload'

        let tenant = await this.splitcommonkey(SubFlowKey,'CK')
        let fabric = await this.splitcommonkey(SubFlowKey,'FNK')
        let appgroupcode = await this.splitcommonkey(SubFlowKey,'CATK')
        let appcode = await this.splitcommonkey(SubFlowKey,'AFGK')
      
        let subFlowResult:any = await this.getMongoProcessLogs({
          tenant,
          fabric:[fabric],
          appgroup:{
            code:appgroupcode
          },
          app:{
            code:appcode
          },
          page: 1,
          limit: 10,
          searchParam: subFlowUpId
        },'TPL')

        if(subFlowResult?.data && Array.isArray(subFlowResult?.data) && subFlowResult?.data.length > 0){         
          return Object.values(subFlowResult.data[0]['AFSK']).flat()
        }else{
          return []
        }

      } catch (error) {
        //console.log('ERROR', error);        
        throw error
      }
    }
    
    @Cron(process.env.MY_CRON)
    
    async prcLog(): Promise<any> { //Default Mongo
      try {       
        //this.logger.log('ProcessLog start Listening')
       
       let tplstreamName = process.env.TENANT+'-'+ process.env.APPCODE+'-TPL'
       let tslstreamName = process.env.TENANT+'-'+ process.env.APPCODE+'-TSL'
       if (await this.redisService.exist(tplstreamName, process.env.CLIENTCODE)){
         await this.structuredPrcLogs(tplstreamName) 
       } 
        if (await this.redisService.exist(tslstreamName, process.env.CLIENTCODE)){
         await this.structuredPrcLogs(tslstreamName) 
       } 
        return 'success'
      } catch (error) {
        throw error;
      }
    }

    async structuredPrcLogs(streamName) { //Default Mongo
      try {  
        if (await this.redisService.exist(streamName, process.env.CLIENTCODE)) {
          let grpInfo = await this.redisService.getInfoGrp(streamName)
          if (grpInfo.length == 0) {
            await this.redisService.createConsumerGroup(streamName, streamName+'ProcessLog_' + process.pid)
          } else if (!grpInfo[0].includes(streamName+'ProcessLog_' + process.pid)) {
            await this.redisService.createConsumerGroup(streamName, streamName+'ProcessLog_' + process.pid)
          }

          let streamData: any = await this.redisService.readConsumerGroup(streamName, streamName+'ProcessLog_' + process.pid, streamName+'_TPL');
          if (streamData != 'No Data available to read' && streamData.length > 0) {
            var msgid = []
            var strmarr = []
            for (let s = 0; s < streamData.length; s++) {
              msgid.push(streamData[s].msgid)
              strmarr.push(streamData[s].data)
            }
          }
          if (msgid?.length > 0) {
            var AfskValue = "logInfo"
            let resultFlg = 0
            for (var s = 0; s < msgid.length; s++) {
              let streamKey = strmarr[s][0]
              if(streamName.endsWith('-TPL')){              
                var upidsplit = streamKey.split(':');
                if (upidsplit.length > 14) {
                  var upid = upidsplit[upidsplit.length - 1]
                  AfskValue = upid?upid:"logInfo"
                }
              }
    
              var date = new Date(Number(msgid[s].split("-")[0]));
              var entryId = format(date, 'yyyy-MM-dd')
    
              var afskvalue: any = JSON.parse(strmarr[s][1])
              afskvalue['DateAndTime'] = format(date, 'yyyy-MM-dd HH:mm:ss:SSS')
    
              var user
              if (afskvalue?.sessionInfo && Object.keys(afskvalue.sessionInfo).length > 0) {
                user = afskvalue.sessionInfo.user
              } 
              // else {
              //   user = 'user'
              // }

              let CK = await this.splitcommonkey(streamKey, 'CK')
              let FNGK = await this.splitcommonkey(streamKey, 'FNGK')
              let FNK = await this.splitcommonkey(streamKey, 'FNK')
              let CATK = await this.splitcommonkey(streamKey, 'CATK')
              let AFGK = await this.splitcommonkey(streamKey, 'AFGK')
              let AFK = await this.splitcommonkey(streamKey, 'AFK')
              let AFVK = await this.splitcommonkey(streamKey, 'AFVK')
              
              if(streamName.endsWith('-TPL')){
                let isDocExist:any
                let filter = {}               
                filter['CK'] = CK
                filter['FNGK'] = FNGK
                filter['FNK'] = FNK
                filter['CATK'] = CATK
                filter['AFGK'] = AFGK
                filter['AFK'] = AFK
                filter['AFVK'] = AFVK
                filter['DATE'] = entryId
                if(user){
                  filter['USER'] = user
                }
                if(AfskValue !=  "logInfo"){
                  filter['UPID'] = AfskValue
                }
                isDocExist = await this.mongoService.existsDocument(streamName,'',filter) 
                if(isDocExist && Object.keys(isDocExist).length > 0 && isDocExist._id){
                  let appendRes:any = await this.mongoService.appendFileInToDocument(streamName,isDocExist._id,'AFSK.'+AfskValue,afskvalue);
                            
                  resultFlg++ 
                   if(appendRes.modifiedCount){
                      await this.redisService.ackMessage(streamName,streamName+'ProcessLog_' + process.pid,msgid[s])   
                      await this.redisService.deleteWithEntryId(streamName,msgid[s])    
                      let isStreamExist = await this.redisService.getStreamRange(streamName)
                      if(!isStreamExist || isStreamExist.length == 0){
                        await this.redisService.deleteKey(streamName,process.env.CLIENTCODE)
                      }                        
                   }
                }else{
                  await db.collection(streamName).createIndex({ "CK": 1, "FNGK": 1, "FNK": 1, "CATK": 1, "AFGK": 1, "AFK": 1, "AFVK": 1, "DATE": 1, "USER": 1 });
                  let insertRes:any = await this.mongoService.insertDocument(streamName,'',{
                    CK,
                    FNGK,
                    FNK,
                    CATK,
                    AFGK,
                    AFK,
                    AFVK,
                    UPID:AfskValue,
                    DATE: entryId,
                    DateAndTime: format(date, 'yyyy-MM-dd HH:mm:ss:SSS'),
                    USER: user,
                    AFSK: 
                      {[AfskValue]:[afskvalue]}
                    
                  })
                
                  resultFlg++ 
                   if(insertRes.insertedId) {
                      await this.redisService.ackMessage(streamName,streamName+'ProcessLog_' + process.pid,msgid[s])   
                     await this.redisService.deleteWithEntryId(streamName,msgid[s])   
                     let isStreamExist = await this.redisService.getStreamRange(streamName)
                      if(!isStreamExist || isStreamExist.length == 0){
                        await this.redisService.deleteKey(streamName,process.env.CLIENTCODE)
                      }                  
                   }     
                }
              }else if(streamName.endsWith('-TSL')){              
                await db.collection(streamName).createIndex({ "CK": 1, "FNGK": 1, "FNK": 1, "CATK": 1, "AFGK": 1, "AFK": 1, "AFVK": 1, "DATE": 1, "USER": 1 });
                let insertRes:any = await this.mongoService.insertDocument(streamName,'',{
                  CK,
                  FNGK,
                  FNK,
                  CATK,
                  AFGK,
                  AFK,
                  AFVK,
                  // UPID:AfskValue,
                  DATE: entryId,
                  DateAndTime: format(date, 'yyyy-MM-dd HH:mm:ss:SSS'),
                  USER: user,
                  AFSK: afskvalue                                 
                })
              
                resultFlg++ 
                 if(insertRes.insertedId) {
                    await this.redisService.ackMessage(streamName,streamName+'ProcessLog_' + process.pid,msgid[s])    
                   await this.redisService.deleteWithEntryId(streamName,msgid[s])   
                   let isStreamExist = await this.redisService.getStreamRange(streamName)
                  if(!isStreamExist || isStreamExist.length == 0){
                    await this.redisService.deleteKey(streamName,process.env.CLIENTCODE)
                    }                  
                 }   
              }                      
            }
          
            if(resultFlg == msgid.length){ 
              return 'Success'
            }
          }  
        } 
      
      } catch (error) {
        this.logger.log('error',error)
      }
    }

    async deleteLog(input){
      try {
        return await this.mongoService.deleteFileFromGridFs('LOGS',input.filename)
      } catch (error) {
        throw error
      }
    }

   

    async dbconfig(customConfig,collectionName){
    try {
      let client: any;
      let nodeVersion = customConfig?.nodeVersion;
      if (!nodeVersion)
        throw new CustomException('Node version not found', 404);
      let oprname, oprkey, tablename, sessionParams, selcol, filterParams, connectorType, storageType, dpdkey, conncectorName, manualQuery, insertParams,rule;
      if (nodeVersion.toLowerCase() == 'v1') {
        connectorType = customConfig?.data?.pro?.connector?.value;
        storageType = customConfig?.data?.pro?.connector?._selection?._selection?.value;
        dpdkey = customConfig?.data?.pro?.connector?._selection?.value;
        conncectorName = customConfig?.data?.pro?.connector?._selection?.subSelection?.value;
        oprname = customConfig.data?.pro?.operationName?.value;
        oprkey = Object.keys(customConfig.data.pro);
        tablename = customConfig.data?.pro?.tableName;
        sessionParams = customConfig.data?.pro?.filterParams
         rule = customConfig?.rule
         manualQuery = customConfig.data?.pro?.manualQuery;
        if (manualQuery.toLowerCase().includes('insert into'))
          oprname = 'insert'
        else
          oprname = 'select'        
        if (oprname == 'select') {
          filterParams = customConfig.data?.pro[oprname]?.filterParams?.items;
        }else if (oprname == 'insert') {
          insertParams = customConfig.data?.pro[oprname]?.insertParams?.items;
        }
      }
      else if (nodeVersion.toLowerCase() == 'v2') {

      }
      if (!dpdkey) throw new CustomException('DPD key not found', 404);          
       
      let extdata:any =  Object.values(JSON.parse(await this.redisService.getJsonData(dpdkey + 'NDP', collectionName)))[0];
      //let nodedata = Object.keys(extdata)[0];
      let dpdData
       //if(isEncrypted(extdata)){
          dpdData = decrypt(extdata)         
       
      let dbUrl, schemaname, dbConfig, Querystr, dbtype;
      if (customConfig) {
        if (storageType?.toLowerCase() == 'external') {
          let configConnectors = dpdData.data['externalConnectors-DB']?.items;
          if (configConnectors?.length > 0) {
            for (let i = 0; i < configConnectors.length; i++) {
              if (configConnectors[i].connectorName == conncectorName) {
                dbConfig = configConnectors[i]?.credentials;
                dbtype = configConnectors[i]?.type
              }
            }
          }
          if (!dbConfig?.host) {
            throw new CustomException(`Invalid DB credentials`,404);
          }
          if (dbtype == 'postgres'){
            if(dbConfig?.username && dbConfig?.password && dbConfig?.host && dbConfig?.port && dbConfig?.database && dbConfig?.schema)
            dbUrl = `postgresql://${dbConfig?.username}:${dbConfig?.password}@${dbConfig?.host}:${dbConfig?.port}/${dbConfig?.database}?schema=${dbConfig?.schema}`
            else
            dbUrl = dbConfig?.host
          }              
          else if (dbtype == 'mysql'){
            if(dbConfig?.username && dbConfig?.password && dbConfig?.host && dbConfig?.port && dbConfig?.database && dbConfig?.schema)
            dbUrl = `mysql://${dbConfig?.username}:${dbConfig?.password}@${dbConfig?.host}:${dbConfig?.port}/${dbConfig?.database}?schema=${dbConfig?.schema}`
            else
            dbUrl = dbConfig?.host
          }              
          else if (dbtype == 'oracle'){
            if(dbConfig?.username && dbConfig?.password && dbConfig?.host && dbConfig?.port && dbConfig?.serviceName)
            dbUrl = `oracle://${dbConfig?.username}:${dbConfig?.password}@${dbConfig?.host}:${dbConfig?.port}/?serviceName=${dbConfig?.serviceName}`;
            else
            dbUrl = dbConfig?.host
          }              
          schemaname = dbConfig?.schema
        } else {
          // if (nodedata)
            dbtype = dpdData['data']?.applicationDBType.value
          dbUrl = this.envData.getDatabaseUrl()//process.env.DATABASE_URL;
          schemaname = (this.envData.getDatabaseUrl()).split('schema=')[1]; //process.env.DATABASE_URL.split('schema=')[1];
        }      
        
        if (!dbUrl) throw new CustomException('DB url not found', 404);
        if (dbtype && dbtype == 'postgres') {
          const { Client } = pg;
          client = new Client({
            connectionString: dbUrl,
          });
        } else if (dbtype == 'mysql') {
          const mysql = require('mysql2/promise');
          client = await mysql.createConnection({
            connectionString: dbUrl,
          });
        } else if (dbtype == 'oracle') {
          const oracledb = require('oracledb');
          client = await oracledb.createConnection({
            connectionString: dbUrl,
          });
        }
      }
      //console.log("client",client);
      
      return { client, oprname, sessionParams, manualQuery, filterParams,rule}
    } catch (error) {
      throw error
    }
  }

   async mongodbconfig(customConfig,collectionName){
   try {
    let collnName, manualQryType, manualQry, sessionfilterParams, connectorType, storageType, dpdkey, conncectorName, filterParams;
    let nodeVersion = customConfig?.nodeVersion;
    if (!nodeVersion) throw 'Node version not found';
    if (nodeVersion.toLowerCase() == 'v1') {
      connectorType = customConfig?.data?.pro?.connector?.value;
      storageType = customConfig?.data?.pro?.connector?._selection?._selection?.value;
      dpdkey = customConfig?.data?.pro?.connector?._selection?.value;
      conncectorName = customConfig?.data?.pro?.connector?._selection?.subSelection?.value;
      collnName = customConfig?.data?.pro?.collectionName;
      manualQryType = customConfig?.data?.pro?.manualQueryType?.value;
      manualQry = customConfig?.data?.pro?.manualQueryType?.manualQuery;
      sessionfilterParams = customConfig?.data?.pro?.filterParams
      filterParams = customConfig.data?.pro['select']?.filterParams?.items;
    } 
      let mongoQry, mongoDbarr, mongodbConfig, mongodbUrl;
      if (storageType?.toLowerCase() == 'external') {
        if (!dpdkey) throw new CustomException('DPD key not found', 404);
          let extdata:any =  Object.values(JSON.parse(await this.redisService.getJsonData(dpdkey + 'NDP', collectionName)))[0];      
          let dpdData      
          dpdData = decrypt(extdata) 
        if (!dpdData) throw new CustomException('DPD value not found', 404);   
       // let nodedata = Object.keys(extdata)[0];
        let configConnectors = dpdData.data['externalConnectors-DB']?.items;
        if (configConnectors?.length > 0) {
          for (let i = 0; i < configConnectors.length; i++) {
            if (configConnectors[i].connectorName == conncectorName) {
              mongodbConfig = configConnectors[i]?.credentials;
            }
          }
        }
        if (!mongodbConfig?.host) {
          throw new CustomException(`Invalid MongoDB credentials`,404);
        }
        if (mongodbConfig.password.includes('@'))
        mongodbConfig.password = mongodbConfig.password?.replaceAll('@', '%40');
        if(mongodbConfig?.username && mongodbConfig?.password && mongodbConfig?.host && mongodbConfig?.port && mongodbConfig?.database)
        mongodbUrl = `mongodb://${mongodbConfig?.username}:${mongodbConfig?.password}@${mongodbConfig?.host}:${mongodbConfig?.port}/${mongodbConfig?.database}?directConnection=true&authSource=admin`;
        else
        mongodbUrl = mongodbConfig?.host
      } else {
        mongodbUrl = this.envData.getDatabaseUrl() //process.env.DATABASE_URL
      }
      if (!mongodbUrl)
        throw new CustomException('Mongo DB url not found', 404);    

        return {mongodbUrl,manualQryType,manualQry,sessionfilterParams,filterParams,collnName}
      } catch (error) {
        throw error
      }
    
  }

  async streamConfig(customConfig,collectionName){
      let oprname, oprkey, streamName, fromStreamid, toStreamid, connectorType, storageType, dpdkey, conncectorName,apikey,responseNodeName,fieldName,isStatic,useAsConsumer,consumerName,consumerGroupName,rollback,filterParams,ConsumerBasedOnJob;
      let nodeVersion = customConfig?.nodeVersion;
      if (!nodeVersion)
        throw new CustomException('nodeVersion not found', 404);

      if (nodeVersion.toLowerCase() == 'v1') {
        connectorType = customConfig?.data?.props?.connector?.value;
        storageType = customConfig?.data?.props?.connector?._selection?.value;
        dpdkey = customConfig?.data?.props?.connector?.value;
        conncectorName = customConfig?.data?.props?.connector?.subSelection?.value;        
        useAsConsumer = customConfig?.data?.props?.useAsConsumer?.value
        oprname = customConfig?.data?.props?.operation?.value
        rollback =  customConfig?.rollback
        filterParams = customConfig?.data?.filterParams
        ConsumerBasedOnJob = customConfig?.data?.props?.jobBased?.value
          isStatic = customConfig?.data?.props?.operation?.subSelection[oprname]?.isStatic.value
          if (isStatic) {
          if(oprname == 'read'){ 
            streamName = customConfig?.data?.props?.operation?.subSelection[oprname]?.isStatic?.subSelection?._true?.streamName?.value
            fromStreamid = customConfig?.data?.props?.operation?.subSelection[oprname]?.isStatic?.subSelection?._true?.startTime?.value
            toStreamid = customConfig?.data?.props?.operation?.subSelection[oprname]?.isStatic?.subSelection?._true?.endTime?.value
            if (useAsConsumer) {
              consumerName = customConfig?.data?.props?.operation?.subSelection[oprname]?.isStatic?.subSelection?._true?.useAsConsumer?.subSelection?._true?.consumerName?.value
              consumerGroupName = customConfig?.data?.props?.operation?.subSelection[oprname]?.isStatic?.subSelection?._true?.useAsConsumer?.subSelection?._true?.consumerGroupName?.value
              if (!consumerName || !consumerGroupName)
                throw new CustomException('consumerName/consumerGroupName not found', 404)
            }          
          }else if (oprname == 'write'){            
            streamName = customConfig?.data?.props?.operation?.subSelection[oprname]?.isStatic?.subSelection?._true?.streamName?.value
            fieldName = customConfig?.data?.props?.operation?.subSelection[oprname]?.isStatic?.subSelection?._true?.streamName?.value            
          }
        }       
        apikey = customConfig.data?.apiKey
        responseNodeName = customConfig?.outputDataNodes;
      }

      let streamhost
      let streamport
      let redisconfig
      if (storageType?.toLowerCase() == 'external') {
        if (!dpdkey) throw new CustomException('DPD key not found', 404);
          let extdata:any =  Object.values(JSON.parse(await this.redisService.getJsonData(dpdkey + 'NDP', collectionName)))[0];      
          let dpdData      
          dpdData = decrypt(extdata) 
       // let nodedata = Object.keys(extdata)[0];
        let configConnectors = dpdData.data['externalConnectors-STREAM']?.items;
        if (configConnectors?.length > 0) {
          for (let i = 0; i < configConnectors.length; i++) {
            if (configConnectors[i].connectorName == conncectorName) {
              streamhost = configConnectors[i]?.credentials.host;
              streamport = parseInt(configConnectors[i]?.credentials.port);
            }
          }
        }
        redisconfig = new Redis({
          host: streamhost,
          port: streamport,
        });
                    
        
        if (!streamhost || !streamport) {
          throw new CustomException('Invalid stream credentials', 422);
        }
      }
     
      if(oprname == 'read' ){        
        if(isStatic)
         return {ConsumerBasedOnJob,storageType,redisconfig,isStatic,streamName,fromStreamid,toStreamid,consumerName,consumerGroupName,oprname,apikey,responseNodeName,useAsConsumer,filterParams}
       else return {ConsumerBasedOnJob,storageType,redisconfig,isStatic,oprname,apikey,responseNodeName,useAsConsumer,filterParams}
       }     
       else if (oprname == 'write'){
         if(isStatic)
          return {ConsumerBasedOnJob,storageType,redisconfig,isStatic,streamName,fieldName,oprname,apikey,rollback,filterParams}
        else return {ConsumerBasedOnJob,storageType,redisconfig,isStatic,oprname,apikey,responseNodeName,rollback,filterParams}
       }
  }

  async fileConfig(customConfig,collectionName){
    try {
    let nodeVersion = customConfig?.nodeVersion;
    let connectorType, storageType, dpdkey, conncectorName, oprname, oprkey, encryptionFlag, fileFolderPath, fileType, fileName, ndpPro,apikey,responseNodeName,rollback,filterParams,isStatic;

    if (!nodeVersion)
      throw new CustomException('nodeVersion not found', 404);  
    let url, userName, password;
    if (nodeVersion.toLowerCase() == 'v1') {
      connectorType = customConfig?.data?.pro?.connector?.value;
      storageType = customConfig?.data?.pro?.connector?._selection?._selection?.value;
      dpdkey = customConfig?.data?.pro?.connector?._selection?.value;
      conncectorName = customConfig?.data?.pro?.connector?._selection?.subSelection?.value;
      ndpPro = customConfig.data?.pro;
      oprname = ndpPro?.operationName.value;
      oprkey = Object.keys(ndpPro);
      encryptionFlag = ndpPro?.encryptionFlag;
      apikey = customConfig?.data?.apiKey
      responseNodeName = customConfig?.outputDataNodes;
      rollback = customConfig?.rollback     
    }else if (nodeVersion.toLowerCase() == 'v2') {
      dpdkey = customConfig?.data?.connector?.value;
      storageType = customConfig?.data?.connector?._selection?.value;               
      conncectorName = customConfig?.data?.connector?.subSelection?.value;
      oprname = customConfig?.data?.operationName.value
      encryptionFlag = customConfig?.data?.isEncrypted?.value;
      filterParams = customConfig?.data?.filterParams
      apikey = customConfig?.apiKey
      responseNodeName = customConfig?.outputDataNodes;
      isStatic =  customConfig?.data?.operationName.subSelection[oprname]?.isStaticFile.value
      if(isStatic){
        fileName = customConfig?.data?.operationName.subSelection[oprname]?.isStaticFile?.subSelection?._true?.fileName?.value
        fileType = customConfig?.data?.operationName.subSelection[oprname]?.isStaticFile?.subSelection?._true?.fileType?.value
        fileFolderPath = customConfig?.data?.operationName.subSelection[oprname]?.isStaticFile?.subSelection?._true?.pathName?.value
      }
    }
    //else if (nodeVersion.toLowerCase() == 'v3') {

    //}

    if (storageType.toLowerCase() == 'external') {
      if (!dpdkey) throw new CustomException('DPD key not found', 404);
        let extdata:any =  Object.values(JSON.parse(await this.redisService.getJsonData(dpdkey + 'NDP', collectionName)))[0];      
        let dpdData      
          dpdData = decrypt(extdata) 
      //if(extdata && Object.keys(extdata).length > 0) {
       // let nodedata = Object.keys(extdata)[0];
        let configConnectors = dpdData.data['externalConnectors-FILE']?.items;
        if (configConnectors?.length > 0) {
          for (let i = 0; i < configConnectors.length; i++) {
            if (configConnectors[i].connectorName == conncectorName) {
              url = configConnectors[i]?.credentials.host;
              userName = configConnectors[i]?.credentials.username;
              password = configConnectors[i]?.credentials.password;
            }
          }
        }
      //}
    } else {
      url = this.envData.getSeaweedOutputHost() //process.env.SEAWEED_OUTPUT_HOST
      userName = this.envData.getSeaweedUsername()//process.env.SEAWEED_USERNAME
      password = this.envData.getSeaweedPassword()//process.env.SEAWEED_PASSWORD
    }

      if (!url || !userName || !password)                
        throw new CustomException('Invalid File Credentials',404);

      const seaWeedConfig = {
        url: url,
        username: userName,
        password: password,
      };
      if(isStatic)
        return {seaWeedConfig,oprname,responseNodeName,apikey,rollback,fileName,fileType,fileFolderPath,isStatic,filterParams}
      else
      return {seaWeedConfig,oprname,responseNodeName,apikey,rollback,filterParams}
    } catch (error) {
      throw error
    }
  }

  async procedureConfig(customConfig,collectionName){
    try {
      let params, procedurequery, nodeVersion, dbType, connectorType, storageType, dpdkey, conncectorName, dbConfig,executecommand,inMemory,rlbckcnfg,rlbckflg,rexecmd,rqry
      nodeVersion = customConfig.nodeVersion
      inMemory = customConfig.inMemory
      if (!nodeVersion)
        throw new CustomException('nodeVersion not found', 404);

      if (inMemory == 'true')
        throw new CustomException('inMemory is active', 403)

      if (nodeVersion.toLowerCase() == 'v1') {
        dbType = customConfig?.data?.pro?.dbType.value;
        connectorType = customConfig?.data?.pro?.connector?.value;
        storageType = customConfig?.data?.pro?.connector?._selection?._selection?.value;
        dpdkey = customConfig?.data?.pro?.connector?._selection?.value;
        conncectorName = customConfig?.data?.pro?.connector?._selection?.subSelection?.value;
        procedurequery = customConfig?.data?.pro?.code.value;
        params = customConfig?.data?.pro?.params.items;
        executecommand = customConfig?.data?.pro?.executecommand?.value
        rlbckcnfg = customConfig?.data?.pro?.enableRollback
        rlbckflg = rlbckcnfg?.value
        if(rlbckflg){
          rqry = rlbckcnfg?.subSelection.code.value
          rexecmd = rlbckcnfg?.subSelection.executecommand.value
        }
      }
      // else if (nodeVersion.toLowerCase() == 'v2') {

      // }
      let dbUrl: any
      if (storageType?.toLowerCase() == 'external') {
        if (!dpdkey) throw new CustomException('DPD key not found', 404);
          let extdata:any =  Object.values(JSON.parse(await this.redisService.getJsonData(dpdkey + 'NDP', collectionName)))[0];      
          let dpdData      
          dpdData = decrypt(extdata) 
        //let nodedata = Object.keys(extdata)[0];
        let configConnectors = dpdData.data['externalConnectors-DB']?.items;
        if (configConnectors?.length > 0) {
          for (let i = 0; i < configConnectors.length; i++) {
            if (configConnectors[i].connectorName == conncectorName) {
              dbConfig = configConnectors[i]?.credentials;
            }
          }
        }
        if (!dbConfig?.host) {
          throw new CustomException(`Invalid DB credentials`, 404);
        }
        if (dbType == 'postgres') {
          if (dbConfig?.port && dbConfig?.username && dbConfig?.password && dbConfig?.database && dbConfig?.schema)
            dbUrl = `postgresql://${dbConfig?.username}:${dbConfig?.password}@${dbConfig?.host}:${dbConfig?.port}/${dbConfig?.database}?schema=${dbConfig?.schema}`
          else
            dbUrl = dbConfig?.host
        }
        else if (dbType == 'mysql') {
          if (dbConfig?.port && dbConfig?.username && dbConfig?.password && dbConfig?.database && dbConfig?.schema)
            dbUrl = `mysql://${dbConfig?.username}:${dbConfig?.password}@${dbConfig?.host}:${dbConfig?.port}/${dbConfig?.database}?schema=${dbConfig?.schema}`
          else
            dbUrl = dbConfig?.host
        }
        else if (dbType == 'oracle') {
          // dbUrl = `oracle://${dbConfig?.username}:${dbConfig?.password}@${dbConfig?.host}:${dbConfig?.port}/${dbConfig?.sid}`;
          // or
          if (dbConfig?.port && dbConfig?.username && dbConfig?.password && dbConfig?.database && dbConfig?.schema && dbConfig?.serviceName)
            dbUrl = `oracle://${dbConfig?.username}:${dbConfig?.password}@${dbConfig?.host}:${dbConfig?.port}/?serviceName=${dbConfig?.serviceName}`;
          else
            dbUrl = dbConfig?.host
        }

      } else {
        dbUrl = this.envData.getDatabaseUrl()//process.env.DATABASE_URL;
      }
      let client
      if (dbType == 'postgres') {
        const { Client } = pg;
         client = new Client({
          connectionString: dbUrl,
        });

      } else if (dbType == 'mysql') {
        const mysql = require('mysql2/promise');
         client = await mysql.createConnection({
          connectionString: dbUrl,
        });
      } else if (dbType == 'oracle') {
        const oracledb = require('oracledb');
         client = await oracledb.createConnection({
          connectionString: dbUrl,
        });
      }
       if(rlbckflg)
          return {dbType,dbUrl,rqry,rexecmd,client}
      else
         return{procedurequery,params,executecommand,client}
    } catch (error) {
      throw error
    }
  } 

  async appendWhereClause(baseQuery: string, condition: string) {
  const query = baseQuery.trim();
  const lower = query.toLowerCase();

  // ✅ Detect outer query pattern: ") alias"
  const outerMatch = query.match(/\)\s+\w+\s*$/i);

  // 👉 CASE 1: Query has subquery → apply WHERE outside
  if (outerMatch) {
    const insertIndex = outerMatch.index! + outerMatch[0].length;

    // Check if outer already has WHERE
    const outerPart = query.slice(insertIndex).toLowerCase();
    const hasOuterWhere = /\bwhere\b/i.test(outerPart);

    if (hasOuterWhere) {
      return `${query} AND ${condition}`;
    } else {
      return `${query} WHERE ${condition}`;
    }
  }

  // 👉 CASE 2: Simple query (your original logic, cleaned)
  const keywords = [' order by ', ' group by ', ' limit '];
  let firstKeywordIndex = -1;

  for (const keyword of keywords) {
    const index = lower.lastIndexOf(keyword);
    if (index !== -1 && (firstKeywordIndex === -1 || index < firstKeywordIndex)) {
      firstKeywordIndex = index;
    }
  }

  const mainQuery =
    firstKeywordIndex !== -1 ? query.substring(0, firstKeywordIndex) : query;

  const trailingQuery =
    firstKeywordIndex !== -1 ? query.substring(firstKeywordIndex) : '';

  const hasWhere = /\bwhere\b/i.test(mainQuery);

  let modifiedQuery;

  if (hasWhere) {
    modifiedQuery = `${mainQuery} AND ${condition}`;
  } else {
    modifiedQuery = `${mainQuery} WHERE ${condition}`;
  }

  return `${modifiedQuery}${trailingQuery}`;
}

//  async appendWhereClause(baseQuery: string, condition: string,) {
  //   const query = baseQuery.trim();
  //   const lower = query.toLowerCase();
  //    const closingIndex = query.lastIndexOf(')');

  // // If no subquery, fallback to simple logic
  // if (closingIndex === -1) {
  //   return this.simpleAppend(query, condition);
  // }
  //   const keywords = [' order by ', ' group by ', ' limit '];
  //   let firstKeywordIndex = -1;
  //   let keywordFound = '';
  //   for (const keyword of keywords) {
  //     const index = lower.lastIndexOf(keyword);
  //     if (index !== -1 && (firstKeywordIndex === -1 || index < firstKeywordIndex)) {
  //       firstKeywordIndex = index;
  //       keywordFound = keyword;
  //     }
  //   }
  //   let modifiedQuery
  //   const mainQuery =
  //     firstKeywordIndex !== -1 ? query.substring(0, firstKeywordIndex) : query;
  //   const trailingQuery =
  //     firstKeywordIndex !== -1 ? query.substring(firstKeywordIndex) : '';
  //   if (mainQuery.toLowerCase().includes(' where ')) {
  //     let str = mainQuery.toLowerCase().split('where')
  //     let flg: any = str.includes(')') ? true : false
  //     console.log("flg",flg);
  //     //console.log("mainQuery",mainQuery);
  // flg = true
  //     modifiedQuery = flg == false ? `${mainQuery} AND ${condition}`
  //       : `${mainQuery} WHERE ${condition}`;
  //   } else {
  //     modifiedQuery = `${mainQuery} WHERE ${condition}`;
  //   }

  //   return `${modifiedQuery}${trailingQuery}`;
  // }

  async checkEncryption(nodeInfo) {
    try {
      if (nodeInfo?.action?.encryption) {
        let isEncrypted: any = nodeInfo?.action?.encryption
        if (isEncrypted?.isEnabled) {
          return { selectedDpd: isEncrypted.selectedDpd, encryptionMethod: isEncrypted.encryptionMethod }
        }
      }
    } catch (error) {
      throw error
    }
  }

  async downloadAndDecryptFile(seaWeedConfig, url: string): Promise<any> {
    try {
      const response = await axios.get(
        url,
        {
          responseType: 'arraybuffer',
          auth: {
            username: seaWeedConfig.username, //process.env.SEAWEED_USERNAME,
            password: seaWeedConfig.password //process.env.SEAWEED_PASSWORD,
          }
        }
      );
      const encryptedFile = response.data;
      const decryptedFile = this.DecryptFile(encryptedFile);
      return decryptedFile;

    } catch (error) {
      console.error('Error downloading or decrypting file:', error);
      throw new Error('Failed to download or decrypt file');
    }
  }

  private DecryptFile(encryptedData: Buffer): Buffer {
    const decipher = crypto.createDecipheriv('aes-256-ctr', Buffer.from(process.env.AES_KEY!, 'base64'), Buffer.from(process.env.AES_IV!, 'base64'));
    const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
    // console.log('decrypted',decrypted);      
    return decrypted;
  }

  async setfileKeys(config: any, operationName: string, folderPath: string, fileName: string, fileType?: string, insertData?: any) {
    try {
      let fileUrl, existing
      if (fileType) {
        if (folderPath) fileUrl = `${config.url}/${folderPath}/${fileName}.${fileType}`;
        else fileUrl = `${config.url}/${fileName}.${fileType}`;
      } else {
        if (folderPath) fileUrl = `${config.url}/${folderPath}/${fileName}`;
        else fileUrl = `${config.url}/${fileName}`;
        fileType = fileName.split('.').pop();
      }
      let auth = {
        username: config.username,
        password: config.password
      }
      // console.log("insertData",insertData);

      if (operationName == 'read') {
        if (fileType == 'xlsx' || fileType == 'pfx') {
          existing = await axios.get<ArrayBuffer>(fileUrl, { auth, responseType: 'arraybuffer' });
        } else
          existing = await axios.get(fileUrl, { auth });
        if (existing?.data) return existing?.data
      } else if (operationName == 'write' && insertData) {
        const buffer = Buffer.from(insertData, 'utf-8');
        const form = new FormData();
        form.append('file', Readable.from(buffer), {
          filename: fileName + '.' + fileType,
          contentType: `application/${fileType}`,
        });

        const response = await axios.post(fileUrl, form, {
          headers: { ...form.getHeaders() },
          auth,
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        });
        return {
          status: response.status,
          fileName: fileName
        };

      }


    } catch (error) {
      console.log(error);
      throw error
    }
  }
    
}
