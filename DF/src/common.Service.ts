
import { BadGatewayException, BadRequestException, HttpStatus, Injectable,Logger } from "@nestjs/common";
import axios from 'axios';
import * as FormData from 'form-data';
import { readAPIDTO,errorObj } from "./dto";
import { RuleService } from "./ruleService";
import { CodeService } from "./codeService";
import { CustomException } from "./customException";
import { JwtService } from "@nestjs/jwt";
import { redis,RedisService } from "./redisService";
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
    this.bucket = new GridFSBucket(collection, { bucketName: 'CT242/TOB001/TOB002/v1' });
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
        if (dpdKey && await this.redisService.exist(dpdKey + ':NDP')) {
          let dpdData = JSON.parse(await this.redisService.getJsonData(dpdKey + ':NDP'))
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
        console.log('ERROR',error);
        throw error
      }
    }

     async commonEncryption(dpdKey,Method,value,context:string): Promise<any> {
      try {        
        let getCredentials = await this.getEncryptionInfo(dpdKey,Method)
        if(getCredentials){
          let encryptCredentials = getCredentials?.encCredentials
          let encMethod = getCredentials?.encMethod
          
          console.log('encryptCredentials',encryptCredentials);

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
            }else if(encMethod == 'RSA'){
              value = JSON.stringify(value)
              const encrypted = publicEncrypt(encryptCredentials.publicKey, Buffer.from(value));
              console.log('Encrypted (base64):', encrypted.toString('base64'));
              return encrypted.toString('base64')        
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
  
          console.log('encryptCredentials',encryptCredentials);  
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
             
            }else if(encMethod == 'RSA'){
             
              console.log('privateKey',encryptCredentials.privateKey);
              
              const decrypted = privateDecrypt(encryptCredentials.privateKey, encryptedData);
              console.log('Decrypted:', decrypted.toString('utf8'));
            }else{
              throw 'Invalied Encryption Method'
            }
          }
        }
      } catch (error) {
        throw new BadGatewayException(error);
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

    async uploadFile(file: Express.Multer.File, context:string) {
      const encrypted = await this.encryptFile(file.buffer, context);
      const uploadStream = this.bucket.openUploadStream(file.originalname, {
        metadata: { isEncrypted: true },
        contentType: file.mimetype,
      });
      uploadStream.end(Buffer.from(encrypted)); 
      return { message: 'Encrypted file uploaded successfully', fileId: uploadStream.id };
    }
   
    async getFile(id: string, context: string) {
      const chunks: Buffer[] = [];
      const downloadStream = this.bucket.openDownloadStream(new ObjectId(id));
      return new Promise<Buffer>((resolve, reject) => {
        downloadStream.on('data', (chunk) => chunks.push(chunk));
        downloadStream.on('end', async () => {
          const ciphertext = Buffer.concat(chunks).toString(); 
          try {
            const decrypted = await this.decryptFile(ciphertext,context);
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

      async errorLog(errGrp: string, fabric: string, errType: string, errCode: string,errorMessage: string,key: string, token: string) {
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
        );
        throw errObj;
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
          var request: any = await redis.call('JSON.GET', key);
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
          var getkeys = await this.redisService.getKeys(finalkey[i]);
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
async readAPI(keys: string, source: string, target: string): Promise<any> {
        const keyParts = keys.split(':');
        const catk: string[] = [];
        const afgk: string[] = [];
        const ak: string[] = [];
        const afvk: string[] = [];
        const afsk: string = keyParts[14];
        const ck = keyParts[1];
        const fngk = keyParts[3];
        const fnk = keyParts[5];
        catk.push(keyParts[7]);
        afgk.push(keyParts[9]);
        ak.push(keyParts[11]);
        afvk.push(keyParts[13]);
    
        let readAPIBody: readAPIDTO = {
          SOURCE: source,
          TARGET: target,
          CK: ck,
          FNGK: fngk,
          FNK: fnk,
          CATK: catk,
          AFGK: afgk,
          AFK: ak,
          AFVK: afvk,
          AFSK: afsk,
        };
        return structuredClone(JSON.parse(await this.readKeys(readAPIBody)));
    
        const readKey = await axios.post(
          '/UF/readkey',
          readAPIBody,
        );
    
        return readKey.data;
      }
    
    async postCall(url,body,headers?){ 
      return await axios.post(url,body,headers)
      .then((res) => this.responseData(res.status, res.data).then((res) => res))
      .catch((err) => {throw err});  
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
    async getRuleCodeMapper(currentNode, inputparam,processedKey,fabric  ){
      try {
        var ResultObj = {}
        var rule = currentNode.rule
        var customCode = currentNode.code   
                
      if(rule && Object.keys(rule).length > 0){
        var nodes = rule.nodes     
        if(nodes && nodes.length > 0){
          for(var c=0;c < nodes.length;c++){
            var content = nodes[c].content
            if(content){
              var field = content.inputs[0].field  
              if(!field)
                throw 'Field not found in rule'
            }            
          }
        }
        var gparamreq = {}; 
          if(inputparam && inputparam[field]){
            gparamreq[field] = inputparam[field]
            var goruleres = await this.ruleEngine.goRule(rule, gparamreq) 
            
            if(Object.keys(goruleres.result).length > 0){
              var zenresult = goruleres.result.output
            }else{
              throw `Rule doesn't matched with this value ${inputparam[field]}`
            } 
          }else{
            throw `${field} not found in given request to take decision`                    
          }       
        console.log('ZenResult',zenresult);  
      }   
      //customCode='function test(){ let shama = shama_val,  sum = sum_val,  salary = salary_val; return {shama:shama,sum:sum,salary:salary}}test();'
      if (customCode ) {
        var customcoderesult = await this.codeService.customCode(processedKey, customCode, inputparam,fabric)
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

    async getTPL(key: any, upId: any,mode:string,pfjson:any,status:string,stoken:any,fabric:string,sourceStatus?:string,request?:any,response?:any){
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
        processInfo['mode'] = mode;

        if(status == 'Success'){
          if(request)
            processInfo['request'] = request;         
          if(response)
            processInfo['response'] = response;
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
       let commonerr:any;
       let prcdet:any;
       
        if(optnlParams){
          if(optnlParams.mode){
            prcdet = optnlParams
          }else{
            commonerr = optnlParams
          }
        }
        
       if(key){
        var tenant = await this.splitcommonkey(key,'CK')
        var app = await this.splitcommonkey(key,'AFGK')
        var fabric = await this.splitcommonkey(key,'FNK')
        sessionInfo['accessDetails'] = key;       
       }
       if(stoken){
        // let token:any = this.jwtService.decode(stoken,{ json: true })
        let token = await this.MyAccountForClient(stoken)
        sessionInfo['user'] = token.loginId || 'user'    
        sessionInfo['accessProfile'] = token.accessProfile 
        sessionInfo['client'] = token.client     
        }else{
          sessionInfo = commonerr
        }    

        let errorDetails = await this.errorobj(errdata,error,status)
        let logs = {}
        logs['sessionInfo'] = sessionInfo
        if(key){
          if(fabric == 'PF-PFD' || fabric == 'DF-DFD')
            logs['processInfo'] = prcdet
          }
        logs['errorDetails'] = errorDetails   
        
        if(typeof key != 'string')
        key = 'commonError'
        tenant=tenant || "CT242"
        app=app ||  "TOB002"
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
          const responseFromRedis =
            await this.redisService.getJsonData(userCachekey);
          const userList = JSON.parse(responseFromRedis);
          const reqiredUser = userList.find(
            (user) => user.loginId === payload.loginId,
          );
          delete reqiredUser.password;
          return { ...reqiredUser, client: payload.client };
        }
      } catch (error) {
        throw new BadRequestException(error)
      }
    }



    async getMongoProcessLogs(input,type): Promise<any> {
      try {        
        this.logger.log('MongoProcess started');

        let {tenant, user, FromDate, ToDate, fabric, appgroup, app, searchParam, page, limit } = input;
        if(!tenant) throw 'Invalid Payload'      
        // var fileName = `${tenant}-.*-TPL`   //"account-.*-CO";
        var fileName = `${tenant}-.*${type}`

        let filter = {}
        if(tenant){
          filter['metadata.CK'] = tenant         
        }
        if(user?.length > 0){
          filter['metadata.USER'] = { $in: user }  //{ 'metadata.USER': { $in: ['user'] } }       
        }
        if(fabric?.length > 0){
          filter['metadata.FNK'] = { $in: fabric }             
        }
        if(appgroup && appgroup.code){
          filter['metadata.CATK'] = appgroup.code      
        }
        if(app && app.code){
          filter['metadata.AFGK'] = app.code  
          // fileName = `${tenant}-${app.code}-TPL`   
          fileName = `${tenant}-${app.code}${type}`   
        }

        if (FromDate && ToDate) {
          filter['metadata.DATE'] = { $gte: FromDate, $lte: ToDate }          
        }else if(FromDate){
          filter['metadata.DATE'] = { $gte: FromDate} 
        }else if(ToDate){
          filter['metadata.DATE'] = { $lte:ToDate } 
        }             
        
        if(searchParam){
           var searchpath = {
              $or: [
                { 'metadata.CK': { $regex: searchParam, $options: 'i' } },
                { 'metadata.FNGK': { $regex: searchParam, $options: 'i' } },
                { 'metadata.FNK': { $regex: searchParam, $options: 'i' } },
                { 'metadata.CATK': { $regex: searchParam, $options: 'i' } },
                { 'metadata.AFGK': { $regex: searchParam, $options: 'i' } },
                { 'metadata.AFK': { $regex: searchParam, $options: 'i' } },
                { 'metadata.AFVK': { $regex: searchParam, $options: 'i' } },
                { 'metadata.USER': { $regex: searchParam, $options: 'i' } },
                { 'metadata.DATE': { $regex: searchParam, $options: 'i' } },
                { 'metadata.AFSK': { $regex: searchParam, $options: 'i' } }              
              ],
            }
          filter['$and'] = [searchpath]          
        }
       
        page = page ? page : 1
        limit = limit ? limit : 10
        const start = (page - 1) * limit;
        const end = start + limit;
          
        // console.log('start',start, 'end', end);  
     
        const ciphertext = await this.mongoService.readFileFromGridFsWithFilter('LOGS',fileName,filter,'N')
        // console.log('ciphertext',ciphertext, 'type', typeof ciphertext);
       
        if(Array.isArray(ciphertext) && ciphertext?.length >0){    
          if (page && limit) {
            var finalArr = [];
            for (var i = start; i < end; i++) {
              if (ciphertext[i]) 
                finalArr.push(ciphertext[i]);
            }
          }         
          const totalDocuments = ciphertext.length;
          const totalPages = Math.ceil(totalDocuments / limit);       
          this.logger.log('get MongoProcess completed');   
          return {
             data: finalArr,
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
        console.log('ERROR', error);
        
        if(error.message) error = error.message       
        
        throw new BadRequestException(error)
      }
    }
 
    async prcLog(streamName): Promise<any> {
      try {
        var structuredData = await this.structuredPrcLogs(streamName)
        var insertedId = []
        // return structuredData
        // console.log('structuredData', structuredData);
        if(structuredData?.length >0){
          for(let i = 0; i < structuredData.length; i++){          
            insertedId.push(await this.mongoService.saveFileToGridFS('LOGS',streamName,structuredData[i],'N'))
          }
          return insertedId
        }          
        // return await this.mongoService.saveFileToGridFS('ENC','claims_test',"structuredData",'Y')      
      
      } catch (error) {
        throw error;
      }
    }

      async structuredPrcLogs(streamName) {
      try {
                   
        var msgid = []
        var strmarr = []
        const result = [];       

        console.log('streamName',streamName);
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

    async deleteLog(input){
      try {
        return await this.mongoService.deleteFileFromGridFs('LOGS',input.filename)
      } catch (error) {
        throw error
      }
    }

   
    
}
