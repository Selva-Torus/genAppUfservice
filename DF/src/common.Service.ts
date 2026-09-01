

import { BadGatewayException, BadRequestException, HttpStatus, Injectable,Logger } from "@nestjs/common";
import axios, { AxiosRequestConfig } from 'axios';
import * as FormData from 'form-data';
import { readAPIDTO,errorObj } from "./dto";
import { RuleService } from "./ruleService";
import { CodeService } from "./codeService";
import { CustomException } from "./customException";
import { RedisService } from "./redisService";
import { format } from 'date-fns';
import jsonata from "jsonata";
const vault = require('node-vault');
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as stream from 'stream';
import { Readable } from "stream";
import path from "path";
import Redis from 'ioredis';
import * as pg from "pg";
import { MongoClient, ObjectId , Db} from "mongodb";
import { ConfigService } from "@nestjs/config";
import { normalizePem } from "src/utils/normalizePem.util";
import { rsaEncryptChunked, rsaDecryptChunked } from "src/utils/rsaBlockCrypto.util";
import { Cron, CronExpression } from "@nestjs/schedule";
import { readdir, readFile } from 'fs/promises';
import { EnvData } from "src/envData/envData.service";
import { decrypt } from "src/decrypt";
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import { JwtServices } from "src/jwt.services";
import { assertAllowedOutboundHost } from "src/utils/ssrf.util";
import { negotiatePgTls, negotiateMongoTls } from "./db-ssl.util";
dayjs.extend(utc);
dayjs.extend(timezone);
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

 
  type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
  type JsonObject = { [key: string]: JsonValue };
  type JsonArray = JsonValue[];

@Injectable()
export class CommonService{

  private readonly ftpOutputPath: string;
  private readonly seaweedOutPutPath:string;
  private vaultClient: ReturnType<typeof vault>;
  private client: MongoClient;
  private readonly encryptionKey: string;
  private vaultAddr: string;
  private vaultToken: string;
  private vaultKey: string;
  constructor(private readonly ruleEngine:RuleService,
    private readonly codeService:CodeService,
    private readonly jwtService: JwtServices,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    private readonly envData:EnvData
  ) {  
    const vaultConfig = this.envData.getVaultConfig();
    //this.ftpOutputPath = process.env.FTP_OUTPUT_HOST; 
    this.seaweedOutPutPath = this.envData.getSeaweedOutputHost();//process.env.SEAWEED_OUTPUT_HOST;
    this.vaultAddr = this.configService.get<string>('VAULT_URL',vaultConfig?.url);
    this.vaultToken = this.configService.get<string>('VAULT_TOKEN',vaultConfig?.token); // Store this in .env
    this.vaultKey = this.configService.get<string>('VAULT_KEY',vaultConfig?.key);
    this.vaultClient = vault({
          apiVersion: 'v1',
          endpoint: vaultConfig?.url,
          token: vaultConfig?.token, //Use a service token with limited permissions
        });
    this.encryptionKey = this.vaultKey;
  }
  async readTextFileSmart(path: string): Promise<string> {
    const buf = await readFile(path); // read as raw Buffer first, no encoding

    // UTF-16 LE BOM: FF FE
    if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) {
      return buf.toString('utf16le', 2); // skip BOM
    }

    // UTF-16 BE BOM: FE FF (Node doesn't natively decode this, swap bytes)
    if (buf.length >= 2 && buf[0] === 0xfe && buf[1] === 0xff) {
      const swapped = Buffer.alloc(buf.length - 2);
      for (let i = 2; i < buf.length; i += 2) {
        swapped[i - 2] = buf[i + 1];
        swapped[i - 1] = buf[i];
      }
      return swapped.toString('utf16le');
    }

    // UTF-8 BOM: EF BB BF
    if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
      return buf.toString('utf-8', 3); // skip BOM
    }

    // plain UTF-8, no BOM
    return buf.toString('utf-8');
  }

  async  getLatestMigrationSql(isLocal?: string ): Promise<{ baseline: string; incremental: string; prismaSchema:string }> {
    // Determine the base migrations directory based on isLocal
    let prismaSchemaPath=''
    let migrationsDir =''
    if(isLocal === 'dev')
    {
      migrationsDir = './src/erd/prisma/migrations'
      prismaSchemaPath = './src/erd/prisma'
    }
    else {
      migrationsDir = './dist/prisma/migrations'
      prismaSchemaPath = './dist/prisma'
    }

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
    let migrationSql_baseline = await this.readTextFileSmart(`${migrationsDir}/ddl_changes_baseline.sql`);
    let migrationSql_incremental = await this.readTextFileSmart(`${migrationsDir}/ddl_changes_incremental.sql`);
    let migrationSql_allTrigger = await this.readTextFileSmart(`${migrationsDir}/allTriggers.sql`);
    let migrationSql_triggerChanges = await this.readTextFileSmart(`${migrationsDir}/triggerChanges.sql`);
    let overallPrismaSchema = await this.readTextFileSmart(`${prismaSchemaPath}/schema.prisma`);
    migrationSql_baseline = migrationSql_baseline + migrationSql_allTrigger;
    if (!migrationSql_incremental?.includes('-- This is an empty migration.')&&!migrationSql_incremental?.includes("No DDL changes available")) 
    {
      migrationSql_incremental = migrationSql_incremental + migrationSql_triggerChanges;
    }
    return { baseline: migrationSql_baseline, incremental: migrationSql_incremental, prismaSchema: overallPrismaSchema };
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

    async getEncryptionInfo(dpdKey:string,encMethod:string){
      try {
        if (dpdKey && await this.redisService.exist(dpdKey + ':NDP',process.env.CLIENTCODE)) {
          let dpdData = await this.redisService.getJsonData(dpdKey + ':NDP',process.env.CLIENTCODE)
          const parsed = JSON.parse(dpdData);
          const rootKey = Object.keys(parsed)[0];
          const encryptedPayload = parsed[rootKey];
          dpdData = decrypt<{ data: any }>(encryptedPayload);
          if (!dpdData || Object.keys(dpdData).length == 0) throw `${dpdKey}:NDP value was empty`
          let dpdNodeId = Object.keys(dpdData)[0]
          let encryptData = dpdData?.data?.encryption
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
              // Fresh random IV per call (not the static per-tenant config
              // value) — CTR mode with a reused IV/key pair leaks plaintext
              // via ciphertext XOR. Embedded as a fixed 24-char base64 prefix
              // so commondecryption can recover it; see there for the
              // legacy (pre-fix, static-IV) fallback path.
              const iv = crypto.randomBytes(16);
              const key = Buffer.from(encryptCredentials.Key, 'base64');
              const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
              let encrypted = cipher.update(JSON.stringify(value), 'utf8', 'base64');
              encrypted += cipher.final('base64');

              return `${iv.toString('base64')}:${encrypted}`;

            }else if(encMethod == 'AESGCM'){

              const key = Buffer.from(encryptCredentials.Key, 'base64');
              // Fresh random IV per call — see AESCTR branch above. For GCM,
              // IV reuse is worse: it also makes ciphertexts forgeable.
              const iv = crypto.randomBytes(16);

              const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
              let encrypted = cipher.update(JSON.stringify(value), 'utf8', 'base64');
              encrypted += cipher.final('base64');

              const authTag = cipher.getAuthTag();

             return {encrypted,authTag:authTag.toString('base64'),iv:iv.toString('base64')};
            }else if (encMethod == 'RSA') {
              const publicKey = encryptCredentials.publicKey
              const encryptData = async (data: string) => {
                return rsaEncryptChunked(
                  normalizePem(publicKey),
                  Buffer.from(data, 'utf8')
                ).toString('base64') // Encrypted data in base64
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
              const raw: string = encryptedData.ciphertext;
              let iv: Buffer;
              let cipherB64: string;
              // New format embeds a fresh per-call IV as a 24-char base64
              // prefix before ':' (see commonEncryption). A value encrypted
              // before this fix has no ':' and used the static config IV —
              // keep decrypting those with the legacy IV so old data isn't
              // stranded.
              if (raw && raw.length > 24 && raw[24] === ':') {
                iv = Buffer.from(raw.slice(0, 24), 'base64');
                cipherB64 = raw.slice(25);
              } else {
                iv = Buffer.from(encryptCredentials.IVlength, 'base64');
                cipherB64 = raw;
              }

              const decipher = crypto.createDecipheriv('aes-256-ctr',key ,iv );
              let decrypted = decipher.update(cipherB64, 'base64', 'utf8');
              decrypted += decipher.final('utf8');
              return decrypted;

            }else if(encMethod == 'AESGCM'){
              let key = Buffer.from(encryptCredentials.Key, 'base64');
              // encryptedData.iv is only present for ciphertexts produced
              // after this fix; fall back to the legacy static config IV
              // for anything encrypted before it.
              let iv = encryptedData.iv
                ? Buffer.from(encryptedData.iv, 'base64')
                : Buffer.from(encryptCredentials.IVlength, 'base64');

              const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
              decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'base64'));

              let decrypted = decipher.update(encryptedData.ciphertext, 'base64', 'utf8');
              decrypted += decipher.final('utf8');

              return decrypted;

            }else if (encMethod == 'RSA') {
              try{
              const decrypted = rsaDecryptChunked(
                normalizePem(encryptCredentials.privateKey),
                Buffer.from(encryptedData.ciphertext, 'base64')
              ).toString('utf8');

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

        // Marks buffers produced by the fixed aes256ctrEncrypt below (fresh
    // random IV per call, embedded) so aes256ctrDecrypt/DecryptFile can tell
    // them apart from legacy buffers encrypted with the old static
    // process.env.AES_IV, and decrypt each with the right IV.
    private readonly AES_CTR_IV_MARKER = Buffer.from('AESCTRV2:', 'utf8');

   async aes256ctrEncrypt(buffer: Buffer): Promise<Buffer> {
      try {
        const key = Buffer.from(process.env.AES_KEY, 'base64');
        const iv = crypto.randomBytes(16);

        const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
        const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
        return Buffer.concat([this.AES_CTR_IV_MARKER, iv, encrypted]);
      } catch (error) {
        throw error
      }
    }

    async aes256ctrDecrypt(encryptedBuffer: Buffer): Promise<Buffer> {
      try {
      const key = Buffer.from(process.env.AES_KEY!, 'base64');
      const markerLen = this.AES_CTR_IV_MARKER.length;

      let iv: Buffer;
      let ciphertext: Buffer;
      if (
        encryptedBuffer.length >= markerLen + 16 &&
        encryptedBuffer.subarray(0, markerLen).equals(this.AES_CTR_IV_MARKER)
      ) {
        iv = encryptedBuffer.subarray(markerLen, markerLen + 16);
        ciphertext = encryptedBuffer.subarray(markerLen + 16);
      } else {
        // Legacy buffer, encrypted before the per-call random IV fix.
        iv = Buffer.from(process.env.AES_IV!, 'base64');
        ciphertext = encryptedBuffer;
      }

      const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv);
      const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);

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
        const deploymentTenant = process.env.CLIENTCODE;
        if (token && clientCode && clientCode !== deploymentTenant && clientCode !== 'redis') {
          let verifiedPayload: any;
          try {
            verifiedPayload = await this.jwtService.verifyToken(token);;
          } catch (e) {
            throw new CustomException('Invalid or expired token', 401);
          }
          const tokenTenant = verifiedPayload?.tenant || deploymentTenant;
          if (tokenTenant !== clientCode) {
            throw new CustomException('Requested tenant does not match the authenticated session', 403);
          }
        }    
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
    
    }
    
    async postCall(url,body,headers?){ 
      assertAllowedOutboundHost(url);
      return await axios.post(url,body,headers)
      .then((res) => this.responseData(res.status, res.data).then((res) => res))
      .catch((err) => {throw err});  
    }

    async axiosPostCall(url,body,headers?){ 
      assertAllowedOutboundHost(url);
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
      assertAllowedOutboundHost(url);  
      return await axios.get(url,headers)
      .then((res) => this.responseData(res.status, res.data).then((res) => res))
      .catch((err) => {throw err});  
    } 

   async extractInputFields(rule) {
      let fieldarr = [];

      if (rule?.nodes?.length) {
      for (let node of rule.nodes) {
        let inputs = node?.content?.inputs;

        if (inputs?.length) {
        for (let input of inputs) {
          if (input.field) {
            fieldarr.push(input.field);
            }
           }
         }
       }
      }

     return fieldarr;
     }
    
    
    async getRuleCodeMapper(currentNode, inputparam,processedKey,fabric ,SessionInfo,controlName? ){       
      try {       
        let zenresult
        var ResultObj = {}
        let fieldarr = []
        let rule = currentNode?.rule
        let customCode = currentNode?.code   
      inputparam = JSON.parse(await this.redisService.getJsonData(processedKey+':rule',process.env.CLIENTCODE))
        if (customCode ) {
          var customcoderesult = await this.codeService.customCode(processedKey, customCode, inputparam,fabric,SessionInfo)        
          
         if(customcoderesult){
            if(inputparam[currentNode.nodeName]) 
              inputparam[currentNode.nodeName] = Object.assign(inputparam[currentNode.nodeName],customcoderesult)
            else
            inputparam = Object.assign(inputparam,{[currentNode.nodeName]:customcoderesult})
            
            await this.redisService.setJsonData(processedKey + ':NPV:' +currentNode.nodeName + '.PRO', JSON.stringify(customcoderesult), process.env.CLIENTCODE, 'response',);       
            await this.redisService.setJsonData(processedKey+':rule', JSON.stringify(inputparam), process.env.CLIENTCODE);
          }        
        }    

         if(rule && Object.keys(rule).length > 0){
          var nodes = rule.nodes             
          if(nodes && nodes.length > 0){
            var gparamreq = {}; 
             let afpVal,data,sarr = []
             if(controlName){
                inputparam = Object.assign(inputparam,{controlName:controlName})
              } 
                gparamreq = { session: SessionInfo, ...inputparam }
              gparamreq = JSON.parse(JSON.stringify(gparamreq, (_, value) => {
                  if (typeof value === 'number' && !Number.isFinite(value)) {
                    return null;
                  }
                  return value;
                }));               
              var goruleres = await this.ruleEngine.goRule(rule,gparamreq)
              if(Object.keys(goruleres.result).length > 0){
                //zenresult = goruleres.result.output
                 zenresult = goruleres.result
              }else{
                throw `Rule doesn't matched with this value ${data}`
              }                         
          }     
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

  async ruleCheck(ruleJson,input){
      try {       
    // Find the decision table node
     const decisionNode = ruleJson.nodes.find(
    (node) => node.type === 'decisionTableNode',
  );

  if (!decisionNode) {
    throw new Error('Decision table node not found');
  }

  const table = decisionNode.content;

  const results = table.rules
    .filter((rule) => {
      // Check all input conditions dynamically
      return table.inputs.every((inputDef) => {
        const actualValue = this.getValue(input, inputDef.field);
        const expectedValue = JSON.parse(rule[inputDef.id]);

        return actualValue === expectedValue;
      });
    })
    .map((rule) => {
      const output: Record< string, any> = {};

      // Build outputs dynamically
      table.outputs.forEach((outputDef) => {
        output[outputDef.field] = JSON.parse(rule[outputDef.id]);
      });

      return output;
    });

  return results;
      } catch (error) {
        throw error
      }
    }

  private getValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  }

  async PfRuleExtract(rule:any,SessionInfo,HtInputParam,controlName){
      let gparamreq = {}  
       if(rule && Object.keys(rule).length > 0){
          var nodes = rule.nodes     
          if(nodes && nodes.length > 0){
            if(controlName){
              HtInputParam = Object.assign(HtInputParam,{controlName:controlName})
            } 
            for(var c=0;c < nodes.length;c++){
              var content = nodes[c]?.content
              if(content){
                let inputs = content.inputs
                if(inputs?.length > 0){
                  for(let i=0;i < inputs.length;i++){                    
                    if(inputs[i]?.field){
                      gparamreq = { session: SessionInfo, ...HtInputParam }
                    }else{
                      gparamreq = HtInputParam
                    }                   
                  }
                }      
              }            
            }  
            var goruleres = await this.ruleEngine.goRule(rule, gparamreq) 
            if(Object.keys(goruleres.result).length > 0){  
              return goruleres.result
            }                                   
          }     
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

    
    sqlLiteral(value: any): any {
      if (value === null || value === undefined) return 'NULL';
      if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
      if (Array.isArray(value)) return value.map(v => this.sqlLiteral(v)).join(',');
      return value;
    }

   
    isSafeSqlIdentifier(name: any): boolean {
      return typeof name === 'string' && /^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)*$/.test(name);
    }

     isAuthorizedOutputTable(tenant: string | undefined, tableName: any): boolean {
      if (!this.isSafeSqlIdentifier(tableName)) return false;
      const raw = process.env.OUTPUTNODE_WRITE_ALLOWLIST;
      if (!raw) return false;
      try {
        const allowlist = JSON.parse(raw);
        const tenantList: string[] = (tenant && allowlist[tenant]) || [];
        const globalList: string[] = allowlist['*'] || [];
        return tenantList.includes(tableName) || globalList.includes(tableName);
      } catch (e) {
        this.logger?.error?.('OUTPUTNODE_WRITE_ALLOWLIST is not valid JSON — denying output-node write by default', e);
        return false;
      }
    }
    
   applyDollarDollarDollarFilters(
      executecommand: string,
      filterData: any,
      nodeId: string,
      statickeyword: string[],
      ): string {
      if (!(filterData && Array.isArray(filterData) && filterData.length > 0)) {
        return executecommand;
      }
      filterData.forEach((filterObj) => {
        if (filterObj?.nodeId != nodeId) return;
        const entries = Object.entries(filterObj).filter(([key]) => key !== 'nodeId');
        entries.forEach(([key, value]) => {
          let removedVal: string;
          if (key.includes('.')) {
            const s_item = key.split('.');
            removedVal = s_item.filter((item) => !statickeyword.includes(item)).join('.');
            if (removedVal.includes('.') && removedVal.startsWith('items.')) {
              removedVal = removedVal.replace('items.', '');
            }
          } else {
            removedVal = key;
          }
          if (!this.isSafeSqlIdentifier(removedVal)) return;
          const regex = new RegExp(`\\$\\$\\$${removedVal}`, 'g');
          if (typeof value == 'number') executecommand = executecommand.replace(regex, `${value}`);
          else if (typeof value == 'string') executecommand = executecommand.replace(regex, this.sqlLiteral(value));
        });
      });
      return executecommand;
    }


      
    sanitizePagination(page: any, count: any): { page: any; count: any } {
      if ((page === undefined || page === null) && (count === undefined || count === null)) {
        return { page, count };
      }
      const p = Number(page);
      const c = Number(count);
       // const MAX_PAGE_SIZE = 10000;
      // if (!Number.isInteger(p) || !Number.isInteger(c) || p < 1 || c < 1 || c > MAX_PAGE_SIZE) {
      //   throw new CustomException('Invalid pagination parameters: page and count must be positive integers', 400);
      // }
      return { page: p, count: c };
    } 
    
   
    //RollBack Check
     async checkRollBack(Ndp,collectionName,action,currentNode?,tenant?){
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
                    const value = this.sqlLiteral(insertedData[key]);
                    qry = manualQry.replace(regex, value);
                  });
                  // let qry = `DELETE FROM ${tablename} WHERE ${primaryKey} = ${insertedData[primaryKey]};`
                  let conectdb = await this.dbconfig(Ndp[item], collectionName, tenant)
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
                  let mconfig = await this.mongodbconfig(Ndp[item], collectionName, tenant)
                  let mongodbUrl = mconfig.mongodbUrl
                  //let manualQryType = mconfig.manualQryType
                  const client = new MongoClient(mongodbUrl);
                  await client.connect();
                  let oprname, idarr = [];
                  const db = client.db();
                  try {
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
                  } finally {
                    try { await client.close(); } catch {}
                  }
                }
                else if (Ndp[item].nodeType == 'streamnode') {
                  let rollbackData = JSON.parse(await this.redisService.getJsonDataWithPath(currentNode.key + ':NPV:' + Ndp[item].nodeName + '.PRO', '.rollback', collectionName));
                  let reqData: any;
                  let sconf = await this.streamConfig(Ndp[item], collectionName, tenant)
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

                  let fconf = await this.fileConfig(Ndp[item], collectionName, tenant)
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
                else if (Ndp[item].nodeType == 'procedureexecutionnode' || Ndp[item].nodeType == 'function_node') {
                  let pconf = await this.procedureConfig(Ndp[item], collectionName, tenant)
                  if (insertedData && Object.keys(insertedData).length > 0) {
                    Object.keys(insertedData).forEach(key => {
                      const regex = new RegExp(`\\$\\$${key}`, 'g');
                      const value = this.sqlLiteral(insertedData[key]);
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
     assertAllowedOutboundHost(url);
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

    private static readonly SENSITIVE_LOG_KEY_PATTERN = /^(authorization|cookie|set-cookie|token|accesstoken|access_token|refreshtoken|refresh_token|password|secret|apikey|api_key|x-api-key)$/i;

    redactSensitiveFields(value: any, seen: WeakSet<object> = new WeakSet()): any {
      if (value === null || value === undefined) return value;
      if (Array.isArray(value)) {
        return value.map((item) => this.redactSensitiveFields(item, seen));
      }
      if (typeof value === 'object') {
        if (seen.has(value)) return '[Circular]';
        seen.add(value);
        const result: any = {};
        for (const [k, v] of Object.entries(value)) {
          result[k] = CommonService.SENSITIVE_LOG_KEY_PATTERN.test(k)
            ? '[REDACTED]'
            : this.redactSensitiveFields(v, seen);
        }
        return result;
      }
      return value;
    }

    async getTPL(key: any, upId: any,pfjson:any,status:string, targetQueue:string ,stoken:any,fabric:string,sourceStatus?:string,request?:any,response?:any){
      // this.logger.log("TPL Log Started")     
      var sessionInfo = {} 
      var processInfo = {};
      var tenant = await this.splitcommonkey(key,'CK')
      var app = await this.splitcommonkey(key,'AFGK')
      var token:any
      try {
          token = await this.jwtService.verifyToken(stoken);
      } catch (e) {
        token = null;
      }
      if(token){ 
        sessionInfo['user'] =  token.loginId     
        sessionInfo['accessProfile'] =  token.accessProfile     
      }        
    
        processInfo['key'] = key;
        processInfo['upId'] = upId;
        processInfo['status'] = status;
        if(pfjson?.nodeName)
          processInfo['nodeName'] = pfjson.nodeName;
        if(pfjson?.nodeId)
          processInfo['nodeId'] = pfjson.nodeId;
        if(pfjson?.nodeType)
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
            processInfo['request'] = this.redactSensitiveFields(request);

          if(response){
            let childObj = {}
            const redactedResponse = this.redactSensitiveFields(response);
            if(response.upId){
              childObj['subFlowKey'] = response.key
              childObj['subFlowUpId'] = response.upId
              if(response.eventError)
                childObj['subFlowError'] = response.eventError
              if(response.data)
                childObj['subFlowResponse'] = redactedResponse.data
              processInfo['subFlowInfo'] = childObj;
            }
            processInfo['response'] = redactedResponse;
          }
        }else{
          var errdata = {}
          errdata['tname'] = 'TE'
           processInfo['request'] = this.redactSensitiveFields(request);
          if(response.status == 403){
            errdata['errGrp'] = 'Security'
          }else
            errdata['errGrp'] = 'Technical'

          errdata['fabric'] = fabric
          errdata['errType'] = 'Fatal'
          errdata['errCode'] = '001'
          var errorDetails = await this.errorobj(errdata,this.redactSensitiveFields(response),status)
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
     assertAllowedOutboundHost(url);   
      return await axios.patch(url,data,headers)
      .then((res) => this.responseData(res.status, res.data).then((res) => res))
      .catch((err) => {throw err}); 
    }

    async postCallwithDB(url,body,headers?){ 
       assertAllowedOutboundHost(url);     
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
        let token:any
        try {
            token = await this.jwtService.verifyToken(stoken);
        } catch (e) {
          token = null;
        }
        //let token = await this.MyAccountForClient(stoken)
        if(token){
         
        sessionInfo['user'] = token.loginId || 'user'    
        sessionInfo['accessProfile'] = token.accessProfile 
        sessionInfo['client'] = token.tenant //token.client   
        }  
        } 

        let errorDetails = await this.errorobj(errdata,this.redactSensitiveFields(error),status)
        let logs = {}
        logs['sessionInfo'] = sessionInfo
        if(key){
          if(fabric == 'PF-PFD' || fabric == 'DF-DFD' || fabric == 'PF-SFD' || fabric == 'PF-SCDL')
            logs['processInfo'] = this.redactSensitiveFields(prcdet)
          }
        logs['errorDetails'] = errorDetails
        
        if(typeof key != 'string')
        key = 'commonError'
         tenant=tenant || "CT010"
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
         let payload: any;
        try {
          payload = await this.jwtService.verifyToken(token);;
        } catch (e) {
          throw new BadRequestException('Invalid or expired token');
        }
        if (!payload) {
          throw new BadRequestException('Please provide valid token');
        } else {
          let userCachekey
          if (payload.type === "c") {
            userCachekey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${payload.tenant}:AFK:PROFILE:AFVK:v1:users`;
          } else {
            userCachekey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${payload.tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:users`;
          }
         const responseFromRedis = await this.redisService.getJsonData(userCachekey,process.env.CLIENTCODE);
          const userList = JSON.parse(responseFromRedis);
          if(userList?.length>0){
            const reqiredUser = userList.find(
              (user) => user.loginId === payload.loginId,
            );
            delete reqiredUser.password;
            return { ...reqiredUser, client: payload.tenant };
          } 
        }
      } catch (error) {
        throw new BadRequestException(error)
      }
    }



  async seaWeeduploadFile(
  data: any,
  bucketName: string,
  folderPath: string,
  filename: string
  
) {
  try {
     let client = folderPath.split('-')[0]
    const fileUrl = `${this.seaweedOutPutPath}/buckets/torus/9.1/${client}/${bucketName}/${folderPath}/${filename.endsWith('.json') ? filename : `${filename}.json`}`;
    // Helper to check if JSON
    const isJSONString = (str: string): boolean => {
      try {
        JSON.parse(str);
        return true;
      } catch {
        return false;
      }
    };

    // Format incoming data
    const newJsonData = typeof data === 'string' && isJSONString(data)
      ? JSON.parse(data)
      : data;

    let combinedData: any[] = [];

    // Try to fetch existing file
        try {
          assertAllowedOutboundHost(fileUrl);
          const existing = await axios.get(fileUrl, {
        auth: {
        username: this.envData.getSeaweedUsername(),//process.env.SEAWEED_USERNAME,
        password: this.envData.getSeaweedPassword()//process.env.SEAWEED_PASSWORD
      }
    });
      const existingJson = existing.data;
      if(existingJson){
      if (Array.isArray(existingJson)) {
        combinedData = existingJson;
      } else {
        combinedData = [existingJson];
      }
      }
      
    } catch (e) {
      console.warn('No existing file found. Creating new one.');
    }

    // Append new data
    if (Array.isArray(newJsonData)) {
      for(let d=0; d< newJsonData.length; d++){
        combinedData.push(newJsonData[d]);
      }
      
    } else {
       combinedData.push(newJsonData)
    }

    // if (Array.isArray(newJsonData)) {
    //   combinedData = newJsonData;
    // } else {
    //   combinedData = [newJsonData];
    // }

    // Convert to buffer
    const buffer = Buffer.from(JSON.stringify(combinedData, null, 2), 'utf-8');

    // Upload
    const form = new FormData();
    form.append('file', Readable.from(buffer), {
      filename: filename.endsWith('.json') ? filename : `${filename}.json`,
      contentType: 'application/json',
    });

  assertAllowedOutboundHost(fileUrl);
  const response = await axios.post(fileUrl, form, {
      headers: {
        ...form.getHeaders(),
      },
       auth: {
      username: this.envData.getSeaweedUsername(),//process.env.SEAWEED_USERNAME,
      password: this.envData.getSeaweedPassword()//process.env.SEAWEED_PASSWORD
  },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    return {
      status: response.status,
      fileName: filename
    };
  } catch (error: any) {
    console.error('Upload error:', error?.response?.data || error.message);
    throw error?.response?.data || error.message || 'some error occured in seaWeeduploadFile';
  }
  }  
   
  streamToString = async (readableStream: stream.Readable): Promise<string> => {
      const chunks: Uint8Array[] = [];
      for await (const chunk of readableStream) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }
      return Buffer.concat(chunks).toString('utf-8');
    };

  async downloadAndParseFile(client:string,fileName: string): Promise<any> {
    try {
      const streamUrl = `${this.seaweedOutPutPath}/buckets/torus/9.1/${client}${fileName}`;    
      assertAllowedOutboundHost(streamUrl);
      const response = await axios.get(streamUrl, { responseType: 'stream',  auth: {
    username: this.envData.getSeaweedUsername(),//process.env.SEAWEED_USERNAME,
    password: this.envData.getSeaweedPassword(),//process.env.SEAWEED_PASSWORD
  } });
      const fileContent = await this.streamToString(response.data);
      const jsonData = JSON.parse(fileContent);
      return jsonData;
    } catch (error: any) {
      console.error('Download error:', error?.response?.status, error?.response?.data || error.message);
      throw new Error('Failed to download and parse file');
    }
  }

  async listFiles(bucketName: string, prefixPath: string): Promise<string[]> {
    let client = prefixPath.split('-')[0]
       let basePath = `/buckets/torus/9.1/${client}/${bucketName}/${prefixPath}`
      const allFiles: string[] = [];
      const traverse = async (path: string) => {
        try {
         assertAllowedOutboundHost(`${this.seaweedOutPutPath}${path}`);
         const res = await axios.get(`${this.seaweedOutPutPath}${path}?recursive=true&pretty=y`,{
          headers: {
          Accept: 'application/json',
        }, auth: {
            username: this.envData.getSeaweedUsername(),//process.env.SEAWEED_USERNAME,
            password: this.envData.getSeaweedPassword(),//process.env.SEAWEED_PASSWORD
          }
        });
          const entries = res.data.Entries || [];

          for (const entry of entries) {
            const fullPath = entry.FullPath;
            const name = fullPath.split('/').pop(); // derive name manually

            const isDirectory = entry.FileSize === 0 && !entry.Mime;

            if (isDirectory) {
              await traverse(fullPath); // go deeper
            } else {
              allFiles.push(fullPath); // file found
            }
          }

        } catch (err:any) {
          console.error(`Failed to traverse ${path}:`, err?.response?.data || err.message);
        }
      };

      await traverse(basePath);
      return allFiles;
    }  


  async SetPrcExpLogs(streamName,inputData) {
    try {
      const result = []; 
      if(!streamName || streamName != `${process.env.TENANT}-${process.env.APPCODE}-TPL`) throw new CustomException('Invalid Bucket Name',400);
      //console.log('inputData',inputData);
      
      if (!inputData) throw new CustomException('Input Data is required',400);   
        
      if(!Array.isArray(inputData) && typeof inputData == 'object' && Object.keys(inputData).length > 0){
        inputData = [inputData]
      }
      if(inputData?.length>0){
        for (let i = 0; i < inputData.length; i++) {
          const item = inputData[i];   
  
          if(!item?.currentDate) throw new CustomException('currentDate is required',400);
  
          const date = new Date(item.currentDate);
          const entryId = format(date, 'yyyy-MM-dd');
          
          let user, upid = 'logInfo';
  
          if (streamName.endsWith('-TPL')) {
            if(!item?.field) throw new CustomException('Field is required',400);
            const requiredKeys = [
              'CK:',
              ':FNGK:',
              ':FNK:',
              ':CATK:',
              ':AFGK:',
              ':AFK:',
              ':AFVK:',
            ];
            if (!(requiredKeys.every((key) => item.field.includes(key)))) throw new CustomException('Invalid Key Structure',400);

            
            const upidsplit = item.field.split(':');
            if (upidsplit.length > 14) {
              upid = upidsplit[upidsplit.length - 1];              
            }
          }
  
          const afskvalue: any = typeof item.value == "string"?JSON.parse(item.value):item.value;
          if(typeof afskvalue == 'object')
            afskvalue['DateAndTime'] = format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"); //format(date, 'yyyy-MM-dd HH:mm:ss:SSS');
  
          if (!afskvalue?.sessionInfo?.user) throw new CustomException('user is required',400);
          user = afskvalue.sessionInfo.user;          
          
          const CK = await this.splitcommonkey(item.field, 'CK');
          const FNGK = await this.splitcommonkey(item.field, 'FNGK');
          const FNK = await this.splitcommonkey(item.field, 'FNK');
          const CATK = await this.splitcommonkey(item.field, 'CATK');
          const AFGK = await this.splitcommonkey(item.field, 'AFGK');
          const AFK = await this.splitcommonkey(item.field, 'AFK');
          const AFVK = await this.splitcommonkey(item.field, 'AFVK');
          
          if(CATK != process.env.APPGROUPCODE) throw new CustomException('Invalid AppGroup Code found in Key',400);
          if(AFGK != process.env.APPCODE) throw new CustomException('Invalid App Code found in Key',400);

          let existingEntry = result.find(
            (item) =>
              item.CK === CK &&
              item.FNGK === FNGK &&
              item.FNK === FNK &&
              item.CATK === CATK &&
              item.AFGK === AFGK &&
              item.AFK === AFK &&
              item.AFVK === AFVK &&
              item.USER === user &&
              item.DATE === entryId
          );
  
          if (!existingEntry) {
            existingEntry = {
              CK,
              FNGK,
              FNK,
              CATK,
              AFGK,
              AFK,
              AFVK,
              DATE: entryId,
              USER: user,
              AFSK: {},
            };
            result.push(existingEntry);
          }
  
          if (!existingEntry.AFSK[upid]) {
            existingEntry.AFSK[upid] = [];
          }
          existingEntry.AFSK[upid].push(afskvalue);
  
        }             
      }      
      
     
      if (result && result.length > 0) {
        let successCount = 0;
        for (let i = 0; i < result.length; i++) {
          const { USER, DATE: date, CK, FNGK, FNK, CATK, AFGK, AFK, AFVK } = result[i];
          const upid = Object.keys(result[i].AFSK)[0];
          let res;
          if (USER && date && CK && FNGK && FNK && CATK && AFGK && AFK && AFVK) {
            if (streamName.endsWith('-TPL')) {
              const path = `${streamName}/${USER}/${date}/${CK}/${FNGK}/${FNK}/${CATK}/${AFGK}/${AFK}/${AFVK}`;           
              res = await this.seaWeeduploadFile(JSON.stringify(result[i]), 'PrcLog', path, upid);
            } else if (streamName.endsWith('-TSL')) {
              const basePath = `${streamName}/${USER}/${date}/${CK}/${FNGK}/${FNK}/${CATK}/${AFGK}/${AFK}`;                       
              res = await this.seaWeeduploadFile(JSON.stringify(result[i]), 'ExpLog', basePath, AFVK);              
            }         
            if(res?.status == 201){
              successCount++;
            }
          }
        }
        if(successCount == result.length)
        return { status: 'success' }; //'success';
      }
      
      return { status: 'failed' };
    
    } catch (error:any) {
      // console.log('ERROR',error);      
      throw new CustomException(error?.message || 'Something went wrong',error?.statusCode || error?.status || 500);
    }
  }

    async getlogFormat(array1, array2) {
    
      const len = array1.length > array2.length ? array1.length : array2.length

      const matchCache = new Map()
      const matchesFor = (key) => {
        if (matchCache.has(key)) return matchCache.get(key)
        const group = []
        for (const item of array1) {
          if (item.includes(key)) group.push(item)
        }
        matchCache.set(key, group)
        return group
      }

      const filteredArr = []
      for (let i = 0; i < len; i++) {
        const group = matchesFor(array2[i])
        for (let j = 0; j < group.length; j++) {
          filteredArr.push(group[j])
        }
      }
      return filteredArr
    }

     async deleteLog(fileName: string) {
    try {
      if (!fileName) {
        throw new Error('FileName is required');
      }

      // volumeUrl example: http://localhost:8080
      const traverse = async (path: string) => {
        try {
         assertAllowedOutboundHost(`${this.seaweedOutPutPath}${fileName}`);
         const res = await axios.delete(`${this.seaweedOutPutPath}${fileName}?recursive=true&pretty=y`,{
          headers: {
          Accept: 'application/json',
        }, auth: {
            username: this.envData.getSeaweedUsername(),//process.env.SEAWEED_USERNAME,
            password: this.envData.getSeaweedPassword(),//process.env.SEAWEED_PASSWORD
          }
        });
          

        } catch (err:any) {
          console.error(`Failed to traverse ${path}:`, err?.response?.data || err.message);
        }
      };

      // const deleteUrl = `${this.seaweedOutPutPath}/${fileName}`;
      // console.log("deleteUrl", deleteUrl);

      // const response = await axios.delete(deleteUrl);
      // console.log("response", response);

      return {
        success: true,
        message: 'File deleted successfully',
        // data: response.data,
      };

    } catch (error: any) {
      throw new CustomException('Seaweed file delete failed',
          
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  async assertConnectorTenant(dpdkey: string, tenant?: string): Promise<void> {
    const keyTenant = await this.splitcommonkey(dpdkey, 'CK');
    if (!tenant)
      throw new CustomException('Tenant identity missing from request context', 403);
    if (!keyTenant || keyTenant !== tenant)
      throw new CustomException('Connector tenant ownership check failed', 403);
  }

  async dbconfig(customConfig,collectionName,tenant?){
    try {
      let client: any;
      let nodeVersion = customConfig?.nodeVersion;
      if (!nodeVersion)
        throw new CustomException('Node version not found', 404);
      let storageType, dpdkey, conncectorName, rule,qrydata;
      
      if (nodeVersion.toLowerCase() == 'v1') {
        let connector = customConfig?.data?.pro?.value?.connector
        dpdkey = connector?.value;
        storageType = connector?._selection?.value;       
        conncectorName = connector?.subSelection?.value;            
        rule = customConfig?.rule     
        qrydata = customConfig?.data?.pro?.value?.manualQuery?.items      
      }      
      if (!dpdkey) throw new CustomException('DPD key not found', 404);          
       
      await this.assertConnectorTenant(dpdkey, tenant);
      let extdata:any =  Object.values(JSON.parse(await this.redisService.getJsonData(dpdkey + 'NDP', collectionName)))[0];
      
      let dpdData:any = decrypt(extdata)         
       
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
           const { Client ,types } = pg;
          const bigintParser = { getTypeParser: (oid: number, format: string) => {
          if (oid === 20) return (val: string) => parseInt(val, 10);
          return types.getTypeParser(oid, format);
      }};
          // M11: this connects to a per-tenant external connector whose
          // TLS-readiness isn't known in advance, and node-postgres has no
          // "prefer" fallback of its own — so negotiatePgTls() probes the
          // target first and only requests TLS if the probe confirms it
          // supports SSL. See db-ssl.util.ts for the full precedence
          // (explicit sslmode in the URL, then PG_CONNECTOR_SSL_MODE, then
          // the probe).
          dbUrl = await negotiatePgTls(dbUrl, 'PG_CONNECTOR_SSL_MODE');
          client = new Client({
            connectionString: dbUrl,  
           // options: `-c search_path=${schemaname}`,
            application_name: `${process.env.TENANT}_${process.env.APPGROUPCODE}_${process.env.APPCODE}_PFservice`,
             types: bigintParser,
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
      
      return { client, rule,qrydata}
    } catch (error) {
      throw error
    }
  }

   async mongodbconfig(customConfig,collectionName,tenant?){
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
        await this.assertConnectorTenant(dpdkey, tenant);
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
        // M11: same reasoning as the Postgres connector path above —
        // negotiateMongoTls() probes the target and only requests tls=true
        // if the probe confirms it. See db-ssl.util.ts.
        mongodbUrl = await negotiateMongoTls(mongodbUrl, 'MONGO_CONNECTOR_TLS');
        return {mongodbUrl,manualQryType,manualQry,sessionfilterParams,filterParams,collnName}
      } catch (error) {
        throw error
      }
    
  }

  async streamConfig(customConfig,collectionName,tenant?){
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
      let streamusername
      let streampassword
      let redisconfig
      if (storageType?.toLowerCase() == 'external') {
        if (!dpdkey) throw new CustomException('DPD key not found', 404);
        await this.assertConnectorTenant(dpdkey, tenant);
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
              streamusername = configConnectors[i]?.credentials.username;
              streampassword = configConnectors[i]?.credentials.password;
            }
          }
        }
        redisconfig = new Redis({
          host: streamhost,
          port: streamport,
          username: streamusername,
          password: streampassword,
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

  async fileConfig(customConfig,collectionName,tenant?){
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
      await this.assertConnectorTenant(dpdkey, tenant);
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
         assertAllowedOutboundHost(url);
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

  async procedureConfig(customConfig,collectionName,tenant?){
    try {
      let params, procedurequery, nodeVersion, dbType, connectorType, storageType, dpdkey, conncectorName, dbConfig,executecommand,inMemory,rlbckcnfg,rlbckflg,rexecmd,rqry
      nodeVersion = customConfig.nodeVersion
      inMemory = customConfig.inMemory
      if (!nodeVersion)
        throw new CustomException('nodeVersion not found', 404);

      if (inMemory == 'true')
        throw new CustomException('inMemory is active', 403)

      if (nodeVersion.toLowerCase() == 'v1') {
        dbType = customConfig?.data?.pro?.value?.dbType.value;
        connectorType = customConfig?.data?.pro?.value?.connector?.value;
        storageType = customConfig?.data?.pro?.value?.connector?._selection?.value;
        dpdkey = customConfig?.data?.pro?.value?.connector?.value;
        conncectorName = customConfig?.data?.pro?.value?.connector?.subSelection?.value;
        procedurequery = customConfig?.data?.pro?.value?.code.value;
        params = customConfig?.data?.pro?.value?.params.items;
        executecommand = customConfig?.data?.pro?.value?.executeCommand?.value
        rlbckcnfg = customConfig?.data?.pro?.value?.enableRollback
        rlbckflg = rlbckcnfg?.value
        if(rlbckflg){
          rqry = rlbckcnfg?.subSelection.code.value
          rexecmd = rlbckcnfg?.subSelection.executeCommand.value
        }
      }
      // else if (nodeVersion.toLowerCase() == 'v2') {

      // }
      let dbUrl: any
      if (storageType?.toLowerCase() == 'external') {
        if (!dpdkey) throw new CustomException('DPD key not found', 404);
        await this.assertConnectorTenant(dpdkey, tenant);
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
        // M11: same probe-and-negotiate as dbconfig() — see negotiatePgTls()
        // in db-ssl.util.ts.
        dbUrl = await negotiatePgTls(dbUrl, 'PG_CONNECTOR_SSL_MODE');
         client = new Client({
          connectionString: dbUrl,
          application_name: `${process.env.TENANT}_${process.env.APPGROUPCODE}_${process.env.APPCODE}_PFservice`
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

  async sessionDecode(token,upId){
    try {
        let sobj = {},SessionInfo = {}
        let SessionToken: any;
        try {
          SessionToken = await this.jwtService.verifyToken(token);;
        } catch (e) {
          throw new BadRequestException('Invalid or expired token');
        }
        //sobj['session.client'] = SessionToken.client || process.env?.CLIENTCODE
        sobj['session.tenant'] = SessionToken.tenant || process.env?.CLIENTCODE
        sobj['session.orgGrpCode'] = SessionToken.orgGrpCode || process.env?.ORGGRPCODE
        sobj['session.orgCode'] = SessionToken.orgCode || process.env?.ORGCODE
        sobj['session.roleGrpCode'] = SessionToken.roleGrpCode || process.env?.ROLEGRPCODE
        sobj['session.roleCode'] = SessionToken.roleCode || process.env?.ROLECODE
        sobj['session.psGrpCode'] = SessionToken.psGrpCode || process.env?.PSGRPCODE
        sobj['session.psCode'] = SessionToken.psCode || process.env?.PSCODE
        sobj['session.selectedAccessProfile'] = SessionToken.selectedAccessProfile || process.env?.ACCESSPROFILE
        sobj['session.loginId'] = SessionToken.loginId || process.env?.LOGINID
        sobj['session.orgGrpName'] = SessionToken?.orgGrpName || process.env?.ORGGRPNAME
        sobj['session.orgName'] = SessionToken?.orgName || process.env?.ORGNAME
        sobj['session.roleGrpName'] = SessionToken?.roleGrpName || process.env?.ROLEGRPNAME
        sobj['session.roleName'] = SessionToken?.roleName || process.env?.ROLENAME
        sobj['session.psGrpName'] = SessionToken?.psGrpName || process.env?.PSGRPNAME
        sobj['session.psName'] = SessionToken?.psName || process.env?.PSNAME
        sobj['session.trs_process_id'] = upId
        sobj['session.userCode'] = SessionToken?.userCode
        sobj['session.subOrgGrpCode'] = SessionToken?.subOrgGrpCode || process.env?.SUBORGGRPCODE
        sobj['session.subOrgGrpName'] = SessionToken?.subOrgGrpName || process.env?.SUBORGGRPNAME
        sobj['session.subOrgCode'] = SessionToken?.subOrgCode || process.env?.SUBORGCODE
        sobj['session.subOrgName'] = SessionToken?.subOrgName || process.env?.SUBORGNAME

        //SessionInfo['client'] = SessionToken?.client || process.env?.CLIENTCODE || '';
        SessionInfo['tenant'] = SessionToken?.tenant || process.env?.CLIENTCODE || '';
        SessionInfo['loginId'] = SessionToken?.loginId || process.env?.LOGINID || '';
        SessionInfo['accessProfile'] = SessionToken?.selectedAccessProfile || process.env?.ACCESSPROFILE || '';
        SessionInfo['orgGrpName'] = SessionToken?.orgGrpName || process.env?.ORGGRPNAME || '';
        SessionInfo['orgName'] = SessionToken?.orgName || process.env?.ORGNAME || '';
        SessionInfo['roleGrpName'] = SessionToken?.roleGrpName || process.env?.ROLEGRPNAME || '';
        SessionInfo['roleName'] = SessionToken?.roleName || process.env?.ROLENAME || '';
        SessionInfo['psGrpName'] = SessionToken?.psGrpName || process.env?.PSGRPNAME || '';
        SessionInfo['psName'] = SessionToken?.psName || process.env?.PSNAME || '';
        SessionInfo['userCode'] = SessionToken?.userCode || ''
        SessionInfo['subOrgGrpName'] = SessionToken?.subOrgGrpName || process.env?.SUBORGGRPNAME || '';
        SessionInfo['subOrgName'] = SessionToken?.subOrgName || process.env?.SUBORGNAME || '';
        SessionInfo['orgGrpCode'] = SessionToken.orgGrpCode || process.env?.ORGGRPCODE || '';
        SessionInfo['orgCode'] = SessionToken.orgCode || process.env?.ORGCODE || '';
        SessionInfo['roleGrpCode'] = SessionToken.roleGrpCode || process.env?.ROLEGRPCODE || '';
        SessionInfo['roleCode'] = SessionToken.roleCode || process.env?.ROLECODE || '';
        SessionInfo['psGrpCode'] = SessionToken.psGrpCode || process.env?.PSGRPCODE || '';
        SessionInfo['psCode'] = SessionToken.psCode || process.env?.PSCODE || '';
        
        return {sobj,SessionInfo,SessionToken}
    } catch (error) {
    throw error
    }
  }

  convertTimeZone(utcDate) {
    try {  
      return dayjs.utc(utcDate).tz(process.env.TIMEZONE).format(process.env.DATEFORMAT?.replace(/\[:ss\]/g, ''))
    } catch (error) {
    throw error
    }
  }

 async appendWhereClause(baseQuery: string, condition: string,) {
    const query = baseQuery.trim();
    const lower = query.toLowerCase();
    const keywords = [' order by ', ' group by ', ' limit '];
    let firstKeywordIndex = -1;
    let keywordFound = '';
    for (const keyword of keywords) {
      const index = lower.lastIndexOf(keyword);
      if (index !== -1 && (firstKeywordIndex === -1 || index < firstKeywordIndex)) {
        firstKeywordIndex = index;
        keywordFound = keyword;
      }
    }
    let modifiedQuery
    const mainQuery =
      firstKeywordIndex !== -1 ? query.substring(0, firstKeywordIndex) : query;
    const trailingQuery =
      firstKeywordIndex !== -1 ? query.substring(firstKeywordIndex) : '';
    if (mainQuery.toLowerCase().includes(' where ')) {
      let str = mainQuery.toLowerCase().split('where')
      let flg: any = str.some(item => item.includes(')'))? true : false ;//str.includes(')') ? true : false 
      modifiedQuery = flg == false ? `${mainQuery} AND ${condition}`
        : `${mainQuery} WHERE ${condition}`;
    } else {
      modifiedQuery = `${mainQuery} WHERE ${condition}`;
    }

    return `${modifiedQuery}${trailingQuery}`;
  }



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
      const decryptedFile = await this.DecryptFile(encryptedFile);
      return decryptedFile;

    } catch (error) {
      console.error('Error downloading or decrypting file:', error);
      throw new Error('Failed to download or decrypt file');
    }
  }

  private async DecryptFile(encryptedData: Buffer): Promise<Buffer> {
    // Delegates to aes256ctrDecrypt so both the new random-IV format and
    // legacy static-IV files decrypt correctly through one code path.
    return this.aes256ctrDecrypt(encryptedData);
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
      throw error
    }
  }

   async transform(rawInput: any){
    const result: any[] = [];

    const documents: any[] = rawInput?.data ?? [];

    for (const document of documents) {
      const afsk: Record<string, any[]> = document?.AFSK ?? {};

      for (const upId of Object.keys(afsk)) {
        const logEntries: any[] = afsk[upId] ?? [];

        for (const entry of logEntries) {
          const processInfo = entry?.processInfo;

          // Skip entries that have no processInfo or no nodeName
          if (!processInfo?.nodeName) continue;

          // Skip the generic "Start" node that carries no business event
          // Remove the line below if you want to include it
          if (processInfo.nodeName === 'Start') continue;

          result.push({
            nodeName: processInfo.nodeName,
            event: processInfo.event ?? processInfo.status ?? '',
            status: processInfo.status ?? '',
            DateAndTime: entry.DateAndTime ?? '',
          });
        }
      }
    }

    return  result ;
  }

  async getLogicCenterValue(key){
    try {
      if(key){
        let afiValue = JSON.parse(await this.redisService.getJsonData(key+'AFI',process.env.CLIENTCODE))        
        if(!afiValue) throw new CustomException('key not found', 404);
        if(afiValue?.logicCenter)
          return afiValue?.logicCenter
        else
          throw new CustomException('logic center not found', 404);
      }
    } catch (error) {
      throw error
    }
  }
    
}
