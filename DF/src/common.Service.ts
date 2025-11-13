
import { BadGatewayException, BadRequestException, HttpStatus, Injectable,Logger } from "@nestjs/common";
import axios from 'axios';
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
import { GridFSBucket } from "mongodb";
import { MongoClient, ObjectId } from "mongodb";
import { ConfigService } from "@nestjs/config";
const NodeRSA = require('node-rsa')
import { Cron, CronExpression } from "@nestjs/schedule";

export const client = new MongoClient(process.env.MONGODB_URL);
 client.connect()
            .then(() => {
            console.log('Connected to the database successfully!');
            })
            .catch((err) => {
            console.error('Error connecting to the database:', err);
            });
         var db= client.db(process.env.MONGODB_NAME)

@Injectable()
export class CommonService{

  private readonly ftpOutputPath: string;
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
    private readonly configService: ConfigService
  ) {  
    this.ftpOutputPath = process.env.FTP_OUTPUT_HOST; 
    this.vaultAddr = this.configService.get<string>('VAULT_URL',process.env.VAULT_URL);
    this.vaultToken = this.configService.get<string>('VAULT_TOKEN',process.env.VAULT_TOKEN); // Store this in .env
    this.vaultKey = this.configService.get<string>('VAULT_KEY',process.env.VAULT_KEY);
    this.vaultClient = vault({
          apiVersion: 'v1',
          endpoint: process.env.VAULT_URL,
          token: process.env.VAULT_TOKEN, //Use a service token with limited permissions
        });
  }
  async onModuleInit() {
    const collection = client.db("UploadFile")
    this.bucket = new GridFSBucket(collection, { bucketName: 'CT003/AG001/oprmatrix/v1' });
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

    async findFileById(id: string) {
      const files = await this.bucket.find({ _id: new ObjectId(id) }).toArray();
      return files[0];
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
   
    async getFile(id: string, context: string,enableEncryption: Boolean) {
      let decrypted:Buffer
      const chunks: Buffer[] = [];
      const downloadStream = this.bucket.openDownloadStream(new ObjectId(id));
      return new Promise<Buffer>((resolve, reject) => {
        downloadStream.on('data', (chunk) => chunks.push(chunk));
        downloadStream.on('end', async () => {
          const ciphertext = Buffer.concat(chunks)
          try {
            //const decrypted = await this.decryptFile(ciphertext,context);
            if(enableEncryption){
             decrypted = await this.aes256ctrDecrypt(ciphertext);
            }else{
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
        var rule = currentNode.rule
        var customCode = currentNode.code   

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
            for(let i=0;i < fieldarr.length;i++){  
              let connectedNodeName = fieldarr[i].split('.')[0]
              let connectedField = fieldarr[i].split('.')[1]
              //console.log(processedKey + ':NPV:'+connectedNodeName+'.PRO');
              
              let afpVal = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + ':NPV:'+connectedNodeName+'.PRO','.response',process.env.CLIENTCODE))
              connectedField = connectedField.toLowerCase()     
              //console.log('connectedField',connectedField); 
               if(afpVal && Array.isArray(afpVal) && afpVal.length > 1 || typeof afpVal == 'string'){               
                var codeVal = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + ':NPV:'+connectedNodeName+'.PRO','.code',process.env.CLIENTCODE))
                var ifoVal = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + ':NPV:'+connectedNodeName+'.PRO','.ifo',process.env.CLIENTCODE))
               if(codeVal[connectedField])
                var data = await this.getNestedValue(codeVal, connectedField) 
              else if(ifoVal[connectedField])
                 var data = await this.getNestedValue(ifoVal, connectedField) 
              else
               throw 'Array of records found in Decision Node'
              }else
                var data = await this.getNestedValue(afpVal, connectedField)   
                console.log('data',data);
                if(data){                
                  await this.setNestedValue(gparamreq, fieldarr[i], data) 
                }
                // else{
                //   throw `${fieldarr[i]} not found in given request to take decision`                    
                // }  
              // }
            }    
           
              var goruleres = await this.ruleEngine.goRule(rule, gparamreq)                  
              if(Object.keys(goruleres.result).length > 0){                   
                zenresult = goruleres.result.output
              }else{
                throw `Rule doesn't matched with this value ${data}`
              }                         
          }     
        }   
      
        if (customCode ) {
          var customcoderesult = await this.codeService.customCode(processedKey, customCode, inputparam,fabric,SessionInfo)
          //console.log('customcoderesult',customcoderesult);        
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

    getNestedValue(obj: any, path: string): any {           

      let zenresultArr = []               
      if (obj) {          
        if(obj && Array.isArray(obj) && obj.length > 1)
          throw 'Array of records found in Decision Node'
      
        if(obj && Array.isArray(obj) && obj.length == 1){            
        return obj[0][path]

        }else if(typeof obj == 'object' && Object.keys(obj).length>0){
          if (obj[path]) {             
            return obj[path]
          }
        }
      }
      return zenresultArr
    }

    //RollBack Check
    async checkRollBack(Ndp,client,action,currentNode?){
      try {       
        for (let item in Ndp) {         
          if(Ndp[item]?.rollback == "true"){          
            if(action == 'check'){           
              if(Ndp[item]?.savePoint){
                if (!Ndp[item].data?.pro?.primaryKey) throw new CustomException(`PrimaryKey not found in ${Ndp[item].nodeName}`,404)
                if(Ndp[item].nodeType == 'apinode') {        
                  let apiKey = Ndp[item]?.apiKey
                  if (!apiKey) throw new CustomException(`Reference not found in ${Ndp[item].nodeName}`,404)
                  let apiNdp = JSON.parse(await this.redisService.getJsonData(apiKey, client))
                  if (!apiNdp) throw new CustomException( `${apiKey} not found `,404)        
                  let serverUrl: any = Object.values(apiNdp)[0]['data']['serverUrl']        
                  let endPoint = Object.values(apiNdp)[0]['data']['apiEndpoint']        
                  if (!serverUrl || !endPoint) throw new CustomException(`serverUrl/endPoint not found in ${apiKey}`,404)                    
                }
                else if(Ndp[item].nodeType == 'dbnode'){
                  let tablename = Ndp[item].data?.pro?.tableName
                  if(!tablename) throw new CustomException(`TableName not found in ${Ndp[item].nodeName}`,404)
                }
              }else{
                throw new CustomException(`Savepoint not found in ${Ndp[item].nodeName}`,404)
              }            
            }else if(action == 'rollback'){                              
              if(Ndp[item]?.savePoint == currentNode.savepoint){  
                if (Ndp[item].nodeType == 'apinode') {                       
                  let primaryKey = Ndp[item]?.data?.pro?.primaryKey
                  let insertedData = JSON.parse(await this.redisService.getJsonDataWithPath(currentNode.key + ':NPV:' + Ndp[item].nodeName + '.PRO', '.response', client));
                  if(!insertedData || (Object.keys(insertedData).length == 0) || insertedData.length == 0){
                    insertedData = currentNode.data
                  } 
                  let apiKey = Ndp[item]?.apiKey                
                  let apiNdp = JSON.parse(await this.redisService.getJsonData(apiKey, client))                     
                  let serverUrl: any = Object.values(apiNdp)[0]['data']['serverUrl']        
                  let endPoint = Object.values(apiNdp)[0]['data']['apiEndpoint']                 
                  if(insertedData){                                   
                    if(Array.isArray(insertedData) && insertedData.length > 0){
                      for(let i=0;i< insertedData.length;i++){
                        if(insertedData[i][primaryKey]){
                          let rollBackurl = serverUrl + endPoint + '/' + insertedData[i][primaryKey]
                          var deleteRes = await this.deleteCall(rollBackurl)
                          console.log('deleteRes', deleteRes);
                          if(deleteRes?.status == 'Success' && (deleteRes?.statusCode == 200 || deleteRes?.statusCode == 201) && deleteRes?.result){
                            await this.redisService.deleteKey(currentNode.key + ':NPV:' + Ndp[item].nodeName + '.PRO',client)
                            // let nodeRes = JSON.parse(await this.redisService.getJsonData(currentNode.key + ':nodeResponse', client));
                            // if(nodeRes?.length > 0){
                            //   nodeRes = nodeRes.filter(item => item.nodeId !== Ndp[item].nodeId);
                            //   await this.redisService.setJsonData(currentNode.key + ':nodeResponse', JSON.stringify(nodeRes), client);
                            // }
                          }
                        }
                      }
                    }else if(Object.keys(insertedData).length > 0){
                      for(let item of insertedData){
                        if(item[primaryKey]){
                          let rollBackurl = serverUrl + endPoint + '/' + item[primaryKey]
                          var deleteRes = await this.deleteCall(rollBackurl)
                          console.log('deleteRes', deleteRes);
                          if(deleteRes?.status == 'Success' && (deleteRes?.statusCode == 200 || deleteRes?.statusCode == 201) && deleteRes?.result){
                            await this.redisService.deleteKey(currentNode.key + ':NPV:' + Ndp[item].nodeName + '.PRO',client)
                            // let nodeRes = JSON.parse(await this.redisService.getJsonData(currentNode.key + ':nodeResponse', client));
                            // if(nodeRes?.length > 0){
                            //   nodeRes = nodeRes.filter(item => item.nodeId !== Ndp[item].nodeId);
                            //   await this.redisService.setJsonData(currentNode.key + ':nodeResponse', JSON.stringify(nodeRes), client);
                            // }
                          }
                        }
                      }
                    }
                  }      
                }   
                // rollBackArr.push({
                //   nodeName: Ndp[item].nodeName,
                //   nodeId: Ndp[item].nodeId,
                //   primaryKey: Ndp[item].data.pro.primaryKey,
                //   savePoint:Ndp[item]?.savepoint
                // })                                     
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

    async getTPL(key: any, upId: any,pfjson:any,status:string,stoken:any,fabric:string,sourceStatus?:string,request?:any,response?:any){
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
          processInfo['sourceStatus'] = sourceStatus;
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
          key = `CK:${tenant}:FNGK:AF:FNK:UF-UFW:CATK:${ag}:AFGK:${app}:AFK:${artifact}:AFVK:${afvk}:`        
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
          if (idx === -1 || !parts[idx + 1] || parts[idx + 1] === "undefined" || parts.length <= 14) {
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
          if(fabric == 'PF-PFD' || fabric == 'DF-DFD' || fabric == 'PF-SFD' )
            logs['processInfo'] = prcdet
          }
        logs['errorDetails'] = errorDetails   
        
        if(typeof key != 'string')
        key = 'commonError'
        tenant=tenant || "CT003"
        app=app ||  "oprmatrix"
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


  async prcLog(streamName): Promise<any> {
      try {
        var structuredData = await this.structuredPrcLogs(streamName)
      if(streamName.endsWith('-TPL')){
          if(structuredData?.length >0){
          for(let i = 0; i < structuredData.length; i++){  
            let upid = Object.keys(structuredData[i].AFSK)[0]
            let path = `${streamName}/${structuredData[i].USER}/${structuredData[i].DATE}/${structuredData[i].CK}/${structuredData[i].FNGK}/${structuredData[i].FNK}/${structuredData[i].CATK}/${structuredData[i].AFGK}/${structuredData[i].AFK}/${structuredData[i].AFVK}`        
           await this.seaWeeduploadFile(JSON.stringify(structuredData), 'PrcLog', path, (upid))
          }
       
        } 
      }
        else if(streamName.endsWith('-TSL')){
           if (structuredData && structuredData.length > 0) {
        for (let i = 0; i < structuredData.length; i++) {
          const { USER, DATE: date, CK, FNGK, FNK, CATK, AFGK, AFK, AFVK, AFSK }: any = structuredData[i];
          
          if (AFK == 'GENERALERRORS') {
            if (USER && date && AFK) {
             let upid = Object.keys(structuredData[i].AFSK)[0]
            let path = `${streamName}/${structuredData[i].USER}/${structuredData[i].DATE}/${structuredData[i].CK}/${structuredData[i].FNGK}/${structuredData[i].FNK}/${structuredData[i].CATK}/${structuredData[i].AFGK}/${structuredData[i].AFK}/${structuredData[i].AFVK}`   
             await this.seaWeeduploadFile(JSON.stringify(structuredData[i]), 'ExpLog', path, (upid))
          }
          }
          else if (AFK == 'Logs Screen') {
            let upid = Object.keys(structuredData[i].AFSK)[0]
            let path = `${streamName}/${structuredData[i].USER}/${structuredData[i].DATE}/${structuredData[i].CK}/${structuredData[i].FNGK}/${structuredData[i].FNK}/${structuredData[i].CATK}/${structuredData[i].AFGK}/${structuredData[i].AFK}/${structuredData[i].AFVK}`   
             await this.seaWeeduploadFile(JSON.stringify(structuredData[i]), 'ExpLog', path, (upid))
        
          }
          else if (AFK == 'TORUS') {
            if (date && AFK) {
           let upid = Object.keys(structuredData[i].AFSK)[0]
            let path = `${streamName}/${structuredData[i].USER}/${structuredData[i].DATE}/${structuredData[i].CK}/${structuredData[i].FNGK}/${structuredData[i].FNK}/${structuredData[i].CATK}/${structuredData[i].AFGK}/${structuredData[i].AFK}/${structuredData[i].AFVK}`   
             await this.seaWeeduploadFile(JSON.stringify(structuredData[i]), 'ExpLog', path, (upid))              
          
              }
          }
          else {
            if (USER && date && CK && FNGK && FNK && CATK && AFGK && AFK && AFVK) {
           let upid = Object.keys(structuredData[i].AFSK)[0]
            let path = `${streamName}/${structuredData[i].USER}/${structuredData[i].DATE}/${structuredData[i].CK}/${structuredData[i].FNGK}/${structuredData[i].FNK}/${structuredData[i].CATK}/${structuredData[i].AFGK}/${structuredData[i].AFK}`   
             await this.seaWeeduploadFile(JSON.stringify(structuredData[i]), 'ExpLog', path, structuredData[i].AFVK)
            }
          }
        }
        return 'success'
      }  
        }
  
      } catch (error) {
        throw error;
      }
    }

  async seaWeeduploadFile(
  data: any,
  bucketName: string,
  folderPath: string,
  filename: string
  
) {
  try {
    
    const fileUrl = `${this.ftpOutputPath}/${bucketName}/${folderPath}/${filename.endsWith('.json') ? filename : `${filename}.json`}`;
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
          const existing = await axios.get(fileUrl, {
        auth: {
        username: process.env.SEAWEED_USERNAME,
        password: process.env.SEAWEED_PASSWORD
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

  const response = await axios.post(fileUrl, form, {
      headers: {
        ...form.getHeaders(),
      },
       auth: {
    username: process.env.SEAWEED_USERNAME,
    password: process.env.SEAWEED_PASSWORD
  },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    return {
      status: response.status,
      fileName: filename
    };
  } catch (error) {
    console.error('Upload error:', error?.response?.data || error.message);
    throw error;
  }
    }

    async getseaWeedProcessLogs(input,type): Promise<any> {
      try {        
        this.logger.log('Seaweed started');

        let {tenant, user, FromDate, ToDate, fabric, appgroup, app, searchParam, page, limit } = input;
        if(!tenant) throw 'Invalid Payload'      
         const getDateRange = (start, end) => {
          const dateArray = [];
          if (start && end) {
            var currentDate = new Date(start);
            var endDate = new Date(end);
          } else if (start) {
            var currentDate = new Date(start);
            var endDate = new Date();
          } else if (end) {
            var currentDate = new Date();
            var endDate = new Date(end);
          }
     
          while (currentDate <= endDate) {
            dateArray.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
          }
          return dateArray;
        };
  
        if (FromDate && ToDate) {
          var dateRange = getDateRange(FromDate, ToDate);
        } else if (FromDate) {
          var dateRange = getDateRange(FromDate, '');
        } else if (ToDate) {
          var dateRange = getDateRange('', ToDate);
        }else{
          var dateRange = []
        }
     
        if(app && app.code){
  
         var fileName = `${tenant}-${app.code}${type}`   
        }

       
        page = page ? page : 1
        limit = limit ? limit : 10
        const start = (page - 1) * limit;
        const end = start + limit;
     let subFolder = `${fileName}/${user}`


        let data = await this.listFiles('PrcLog',subFolder)
   
       var finalarr = []
       var tenarr = []

       if (dateRange?.length > 0) { 
           var filtereddata = await this.getlogFormat(data, dateRange)
          }else{
            filtereddata = data
          }
  
        if (user?.length>0) {
          var usearr = await this.getlogFormat(filtereddata, user)
         
        }else{
          usearr = filtereddata
        }
     
     
        if (tenant) {
          for (var i = 0; i < usearr.length; i++) {
            if (usearr[i].includes(tenant)) {
              tenarr.push(usearr[i])
             
            }
          }
        }
    
        if (fabric && fabric.length > 0) {
          var fabarr = await this.getlogFormat(tenarr, fabric)
         
        } else {
          fabarr = tenarr
        }
     
     
        if (appgroup && appgroup.code) {
          var appgrparr = await this.getlogFormat(fabarr, [appgroup.code])      
         
        } else {
          appgrparr = fabarr
        }
     
        if (app && app.code) {
          var apparr = await this.getlogFormat(appgrparr, [app.code])
         
        } else {
          apparr = appgrparr
        }
    
        var arr = apparr.flat()
    
        for (var m = 0; m < arr.length; m++) {
 
          var getdata =  await this.downloadAndParseFile(arr[m]) 
  
          finalarr.push(getdata)
         }
        if(finalarr.length == 0){
          throw 'Given User data is empty'
        }
        if (searchParam) {
          finalarr = finalarr.filter(item =>
            item.CK.includes(searchParam) ||
            item.FNGK.includes(searchParam) ||
            item.FNK.includes(searchParam) ||
            item.CATK.includes(searchParam) ||
            item.AFGK.includes(searchParam) ||
            item.AFK.includes(searchParam) ||
            item.AFVK.includes(searchParam) ||
            item.USER.includes(searchParam) ||
            item.DATE.includes(searchParam)
          );
        }
     
        if(!page){
          page = 1
        }
        if(!limit){
          limit = 10
        }
     
        if(Array.isArray(finalarr) && finalarr?.length >0){    
          if (page && limit) {
            var finalArr = [];
            for (var i = start; i < end; i++) {
              if (finalarr[i]) 
                finalArr.push(finalarr[i]);
            }
          }         
          const totalDocuments = finalarr.length;
          const totalPages = Math.ceil(totalDocuments / limit);       
          this.logger.log('get MongoProcess completed');   
          return {
            data: finalArr.flat(),
             page,
             limit,
             totalPages,
             totalDocuments,
          };
        }else{
          throw `Data not found in ${fileName}`
        } 
          
        // return ciphertext
       
      } catch (error) {
        //console.log('ERROR', error);
        if(error.message) error = error.message    
        throw new BadRequestException(error)
      }
    }
   
    streamToString = async (readableStream: stream.Readable): Promise<string> => {
      const chunks: Uint8Array[] = [];
      for await (const chunk of readableStream) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }
      return Buffer.concat(chunks).toString('utf-8');
    };

  async downloadAndParseFile(fileName: string): Promise<any> {
    try {
      const streamUrl = `${this.ftpOutputPath}${fileName}`;
      const response = await axios.get(streamUrl, { responseType: 'stream',  auth: {
    username: process.env.SEAWEED_USERNAME,
    password: process.env.SEAWEED_PASSWORD
  } });
      const fileContent = await this.streamToString(response.data);
      const jsonData = JSON.parse(fileContent);
      return jsonData;
    } catch (error) {
      console.error('Download error:', error?.response?.status, error?.response?.data || error.message);
      throw new Error('Failed to download and parse file');
    }
  }

  async listFiles(bucketName: string, prefixPath: string): Promise<string[]> {
      const basePath = `/${bucketName}/${prefixPath}`;
      const allFiles: string[] = [];
      const traverse = async (path: string) => {
        try {
         const res = await axios.get(`${this.ftpOutputPath}${path}?recursive=true&pretty=y`,{
          headers: {
          Accept: 'application/json',
        }, auth: {
            username: process.env.SEAWEED_USERNAME,
            password: process.env.SEAWEED_PASSWORD
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

        } catch (err) {
          console.error(`Failed to traverse ${path}:`, err?.response?.data || err.message);
        }
      };

      await traverse(basePath);
      return allFiles;
    }

   

  async getseaWeedExpLogs(input,type): Promise<any> {
      try {        
        this.logger.log('Seaweed started');

        let {tenant, user, FromDate, ToDate, fabric, appgroup, app, searchParam, page, limit } = input;
        if(!tenant) throw 'Invalid Payload'      
         const getDateRange = (start, end) => {
          const dateArray = [];
          if (start && end) {
            var currentDate = new Date(start);
            var endDate = new Date(end);
          } else if (start) {
            var currentDate = new Date(start);
            var endDate = new Date();
          } else if (end) {
            var currentDate = new Date();
            var endDate = new Date(end);
          }
     
          while (currentDate <= endDate) {
            dateArray.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
          }
          return dateArray;
        };
  
        if (FromDate && ToDate) {
          var dateRange = getDateRange(FromDate, ToDate);
        } else if (FromDate) {
          var dateRange = getDateRange(FromDate, '');
        } else if (ToDate) {
          var dateRange = getDateRange('', ToDate);
        }else{
          var dateRange = []
        }
     
        if(app && app.code){
  
         var fileName = `${tenant}-${app.code}${type}`   
        }

       
        page = page ? page : 1
        limit = limit ? limit : 10
        const start = (page - 1) * limit;
        const end = start + limit;
       let subFolder = `${fileName}/${user}`


        let data = await this.listFiles('ExpLog',subFolder)
   
       var finalarr = []
       var tenarr = []

       if (dateRange?.length > 0) { 
           var filtereddata = await this.getlogFormat(data, dateRange)
          }else{
            filtereddata = data
          }
  
        if (user?.length>0) {
          var usearr = await this.getlogFormat(filtereddata, user)
         
        }else{
          usearr = filtereddata
        }
     
     
        if (tenant) {
          for (var i = 0; i < usearr.length; i++) {
            if (usearr[i].includes(tenant)) {
              tenarr.push(usearr[i])
             
            }
          }
        }
    
        if (fabric && fabric.length > 0) {
          var fabarr = await this.getlogFormat(tenarr, fabric)
         
        } else {
          fabarr = tenarr
        }
     
     
        if (appgroup && appgroup.code) {
          var appgrparr = await this.getlogFormat(fabarr, [appgroup.code])      
         
        } else {
          appgrparr = fabarr
        }
     
        if (app && app.code) {
          var apparr = await this.getlogFormat(appgrparr, [app.code])
         
        } else {
          apparr = appgrparr
        }
    
        var arr = apparr.flat()
    
        for (var m = 0; m < arr.length; m++) {
 
          var getdata =  await this.downloadAndParseFile(arr[m]) 
  
          finalarr.push(getdata)
         }
        if(finalarr.length == 0){
          throw 'Given User data is empty'
        }
        if (searchParam) {
          finalarr = finalarr.filter(item =>
            item.CK.includes(searchParam) ||
            item.FNGK.includes(searchParam) ||
            item.FNK.includes(searchParam) ||
            item.CATK.includes(searchParam) ||
            item.AFGK.includes(searchParam) ||
            item.AFK.includes(searchParam) ||
            item.AFVK.includes(searchParam) ||
            item.USER.includes(searchParam) ||
            item.DATE.includes(searchParam)
          );
        }
     
        if(!page){
          page = 1
        }
        if(!limit){
          limit = 10
        }
     
        if(Array.isArray(finalarr) && finalarr?.length >0){    
          if (page && limit) {
            var finalArr = [];
            for (var i = start; i < end; i++) {
              if (finalarr[i]) 
                finalArr.push(finalarr[i]);
            }
          }         
          const totalDocuments = finalarr.length;
          const totalPages = Math.ceil(totalDocuments / limit);       
          this.logger.log('get seaweed completed');   
          return {
           data: finalArr.flat(),
             page,
             limit,
             totalPages,
             totalDocuments,
          };
        }else{
          throw `Data not found in ${fileName}`
        } 
       
      } catch (error) {
        //console.log('ERROR', error);
        if(error.message) error = error.message       
        throw new BadRequestException(error)
      }
    }

    async structuredPrcLogs(streamName) {
      try {
                   
        var msgid = []
        var strmarr = []
        const result = [];       

        //if(!await this.redisService.exist(streamName)) throw `Stream ${streamName} does not exist`
        var messages = await this.redisService.getStreamRange(streamName)
       
        if (messages?.length > 0) {
          messages.forEach(([msgId, value]) => {
            msgid.push(msgId)
            strmarr.push(value)
          });
        }
        //else{
          //throw `Stream ${streamName} does not exist`
        //}
  
        if (msgid?.length > 0) {
          var AfskValue = "logInfo"
          for (var s = 0; s < msgid.length; s++) {
  
            if(streamName.endsWith('-TPL')){              
              var upidsplit = strmarr[s][0].split(':');
              if (upidsplit.length > 14) {
                var upid = upidsplit[upidsplit.length - 1]
                AfskValue = upid
              }
            }
  
            var date = new Date(Number(msgid[s].split("-")[0]));
            var entryId = format(date, 'yyyy-MM-dd')
  
            var afskvalue: any = JSON.parse(strmarr[s][1])
            afskvalue['DateAndTime'] = format(date, 'yyyy-MM-dd HH:mm:ss:SSS')
  
            var user
            if (afskvalue?.sessionInfo && Object.keys(afskvalue.sessionInfo).length > 0) {
              user = afskvalue.sessionInfo.user
            } else {
              user = 'user'
            }

            let CK = await this.splitcommonkey(strmarr[s][0], 'CK')
            let FNGK = await this.splitcommonkey(strmarr[s][0], 'FNGK')
            let FNK = await this.splitcommonkey(strmarr[s][0], 'FNK')
            let CATK = await this.splitcommonkey(strmarr[s][0], 'CATK')
            let AFGK = await this.splitcommonkey(strmarr[s][0], 'AFGK')
            let AFK = await this.splitcommonkey(strmarr[s][0], 'AFK')
            let AFVK = await this.splitcommonkey(strmarr[s][0], 'AFVK')             
  
            let existingEntry = result.find(
              (item) => item.CK === CK && item.FNGK === FNGK && item.FNK === FNK && item.CATK === CATK && item.AFGK === AFGK && item.AFK === AFK && item.AFVK === AFVK && item.USER === user && item.DATE === entryId  && Object.keys(item.AFSK).includes(upid)
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
                METADATA: {
                  CK,
                  FNGK,
                  FNK,
                  CATK,
                  AFGK,
                  AFK,
                  AFVK,
                  DATE: entryId,
                  USER: user,
                  AFSK: AfskValue,
                },
              };
              result.push(existingEntry);
            }
  
            if (!existingEntry.AFSK[AfskValue]) {
              existingEntry.AFSK[AfskValue] = [];
            }
            existingEntry.AFSK[AfskValue].push(afskvalue);
          }
        }
       
        return result;
      } catch (error) {
        throw error
      }
    }

    async getlogFormat(array1, array2) {

      let len
      if (array1.length > array2.length) {
        len = array1.length
      } else if (array2.length > array1.length) {
        len = array2.length
      } else {
        len = array1.length
      }
   
      const filteredArr = []
      for (let i = 0; i < len; i++) {
        for (let item of array1) {
          if (item.includes(array2[i])) {
            filteredArr.push(item)
          }
        }
      }
      return filteredArr
    }

    
}
