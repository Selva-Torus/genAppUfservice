
import { BadGatewayException, HttpStatus, Injectable } from '@nestjs/common';
import { CommonService } from 'src/common.Service';
import { RedisService } from 'src/redisService';
import * as v from 'valibot';
import { v4 as uuid } from 'uuid';
import {
  BadRequestException,
  NotAcceptableException,
  CustomException,
  ForbiddenException,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from 'src/customException';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import * as nodemailer from 'nodemailer';
import { JwtService } from '@nestjs/jwt';
import { JwtServices } from 'src/jwt.services';
import { RuleService } from 'src/ruleService';
import { MongoService } from 'src/mongoService';
const jsonata = require('jsonata');
import * as fs from 'fs';
import * as path from 'path';
import { table } from 'console';
import axios, { AxiosRequestConfig, Method } from 'axios';
import * as FormData from 'form-data'; // Use this
import { Readable } from 'stream';
//import { v4 as uuidv4 } from 'uuid';
import { FusionAuthApplicatonAssign, FusionAuthUserApplicatonGet, FusionAutRoleCRUDAlongWithApp,FusionAuthUserGet, FusionAuthUserCreation } from 'src/fusionAuth.api';
import { EnvData } from 'src/envData/envData.service';
import { decrypt } from 'src/decrypt';
// import { RuleService } from 'src/ruleService';
const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  auth: {
    user: 'support@torus.tech',
    pass: 'Welcome@100',
  },
});

interface FusionAuthConfig {
  fusionAuthBaseUrl: string;
  fusionAuthApiKey: string;
  authSecret: string;
  authAccessTokenExpiryTime: string;
  authRefreshTokenExpiryTime: string;
  fusionauthRefreshTokenExpiryTimeinMinutes: string
}

// const auth_secret = process.env.AUTH_SECRET;
const tenant = process.env.TENANT;
const ag = process.env.APPGROUPCODE;
const app = process.env.APPCODE;
const appName = process.env.APPNAME;
const version = process.env.VERSION;
const fusionAuthTenantId = process.env.FUSIONAUTH_TENANTID;
const fusionAuthApplicationId = process.env.FUSIONAUTH_APPLICATIONID;
const fusionAuthAppClientSecret = process.env.FUSIONAUTH_APPCLIENTSECRET;
const defaultAuth =  process.env.DEFAULT_AUTHENTICATION;
// const accessTokenExpiryTime = process.env.AUTH_ACCESSTOKEN_EXPIRY_TIME;
// const refreshTokenExpiryTime = process.env.AUTH_REFRESHTOKEN_EXPIRY_TIME;
// const fusionauthRefreshTokenExpiryTimeinMinutes = process.env.FUSIONAUTH_REFRESHTOKEN_EXPIRY_TIME_IN_MINUTES
const torusAppApiBaseUrl = process.env.TOURS_APP_API_BASE_URL

@Injectable()
export class UfService {
  constructor(
    private readonly jwtService: JwtServices,
    private readonly jwt: JwtService,
    private readonly gorule: RuleService,
    private readonly redisService: RedisService,
    private readonly commonService: CommonService,
    private readonly mongoService: MongoService,
    private readonly envData: EnvData
  ) {}

getConfig(): FusionAuthConfig {
  return {
    fusionAuthBaseUrl: this.envData.getFusionAuthBaseUrl(),
    fusionAuthApiKey: this.envData.getFusionAuthApiKey(),
    authSecret: this.envData.getAuthSecret(),
    authAccessTokenExpiryTime: this.envData.getAuthAccessTokenExpiryTime(),
    authRefreshTokenExpiryTime: this.envData.getAuthRefreshTokenExpiryTime(),
    fusionauthRefreshTokenExpiryTimeinMinutes: this.envData.getFusionAuthRefreshTokenExpiryTimeInMinutes()
  };
}

  async screenRoute(keys: any[], token: string, header: any) {
    try {      
      for (let i = 0; i < keys.length; i++) {
        const UO: any = await this.commonService.readAPI(
          keys[i].ufKey + ':UO',
          process.env.CLIENTCODE,
          token,
        );
        const securityData: any = UO.securityData;
        const screenName: string = keys[i].ufKey.split(':')[11];
        let templateArray: any[] = securityData.accessProfile;
        const authorization = await this.introspectToken(
          header,
          keys[i].ufKey,
          token,
        );
        const accessProfile = await this.MyAccountForClient(
          token,
          keys[i].ufKey,
          authorization,
        );

        if (keys[i].ufKey === securityData.afk) {
          for (let j = 0; j < templateArray.length; j++) {
            if (
              accessProfile.accessProfile.includes(
                templateArray[j].accessProfile,
              ) &&
              screenName === templateArray[j].security.artifact.resource &&
              templateArray[j].security.artifact.SIFlag.selectedValue === 'AA'
            ) {
              return keys[i].screensName;
            }
          }
        } else {
          await this.commonService.errorLog(
            'Technical',
            'AK',
            'Fatal',
            'TG085',
            'security afk not found',
            keys[i].ufKey,
            token,
          );
        }
      }
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async insertDocToVgphSourceTranDocMain(category: string, doc_name: string, url: string, size?: number): Promise<any> {
    try {
      const insertUrl = 'https://tgadev.toruslowcode.com/ct005/v001/vgph001/v1/api/vgph_source_tran_doc_main';
      const vgphstm_uuid = uuid();
      const currentDate = new Date().toISOString().slice(0, 19) + '+00:00';

      const payload = {
        category: category,
        vgphstm_uuid: vgphstm_uuid,
        doc_name: doc_name,
        doc_size: `${Math.ceil((size ?? 0) / 1024)}`,
        url: url,
        trs_created_date: currentDate,
        trs_modified_date: currentDate
      };

      const response = await axios.post(insertUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data.vgphstdm_id;
    } catch (error) {
      throw error;
    }
  }

  async getUrlByVgphstdmId(vgphstdm_id: any): Promise<string> {
    try {
      const getUrl = `https://tgadev.toruslowcode.com/ct005/v001/vgph001/v1/api/vgph_source_tran_doc_main/${vgphstdm_id}`;

      const response = await axios.get(getUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data.url;
    } catch (error) {
      throw error;
    }
  }

  async uploadFile(file: { buffer: Buffer; filename: string; mimetype: string; size: number }, context: string, enableEncryption: string): Promise<any> {
    try {
      const res = await this.commonService.uploadFile(file, context, enableEncryption);

      // Insert the URL into vgph_source_tran_doc_main
      const vgphstdm_id = await this.insertDocToVgphSourceTranDocMain("front", file.filename, res.fileId,file.size);

      res.fileId = `${vgphstdm_id}`;
      return res;
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async getDFS(fileUrl: string | string[], enableEncryption: boolean): Promise<Buffer | Buffer[]> {
    try {
      // Normalize to array if single URL provided
      const urls = Array.isArray(fileUrl) ? fileUrl : [fileUrl];
      const fullUrls = urls.map(url => `${process.env.FTP_OUTPUT_HOST}/${url}`);
      // console.log("fileUrl ==> ", fullUrls);

      const fileBuffers: Buffer[] = [];

      // Fetch each file
      for (const url of fullUrls) {
        const response = await axios.get(url, {
          responseType: 'arraybuffer',
          auth: {
            username: this.envData.getSeaweedUsername(),
            password: this.envData.getSeaweedPassword(),
          },
          validateStatus: (status) => status < 500,
        });

        if (response.status !== 200) {
          throw new Error(`Failed to fetch file from ${url}: ${response.status}`);
        }

        const ciphertext = Buffer.from(response.data);

        // Decrypt if needed
        const fileBuffer = enableEncryption
          ? await this.commonService.aes256ctrDecrypt(ciphertext)
          : ciphertext;

        fileBuffers.push(fileBuffer);
      }

      // Return single buffer if single URL was provided, otherwise return array
      return Array.isArray(fileUrl) ? fileBuffers : fileBuffers[0];
    } catch (error) {
      console.error('Error fetching file from DFS:', error);
      throw error;
    }
  }

  async uploadImage(
    file: { buffer: Buffer; filename: string; mimetype: string; size: number },
    bucketFoldername?: string,
    folderPath?: string,
    filename?: string,
    enableEncryption?: string
  ): Promise<string> {
    try {
      const fileName = filename || file.filename;
      const bucket = bucketFoldername || ''; // e.g. 'torus'
      const subFolder = folderPath || ''; // e.g. 'images'

      const actualBuffer = Buffer.isBuffer(file.buffer)
        ? file.buffer
        : Buffer.from((file.buffer as any)?.data || []);

      const shouldEncrypt = enableEncryption === 'true';

      const encryptedBuffer = shouldEncrypt
        ? await this.commonService.aes256ctrEncrypt(actualBuffer)
        : actualBuffer;

      const form = new FormData();
      form.append('file', Readable.from(encryptedBuffer), {
        filename: fileName,
        contentType: file.mimetype || 'application/octet-stream',
      });

      const uploadUrl = `${this.envData.getSeaweedOutputHost()?.replace(
        /\/$/,
        ''
      )}/buckets/${bucket}/${subFolder}/${fileName}`;
      const res = await axios.post(uploadUrl, form, {
        headers: {
          Accept: 'application/json',
          ...form.getHeaders(),
        },
        auth: {
          username: `${this.envData.getSeaweedUsername()}`,
          password: `${this.envData.getSeaweedPassword()}`,
        },
        validateStatus: (status) => status < 500,
      });

      if (res.status === 201) {
        const res = `${bucket}/${subFolder}/${fileName}`;
        const responce = await this.insertDocToVgphSourceTranDocMain("front",fileName,res,file.size);
        return `${responce}`;
      } else {
        throw new ConflictException(
          res.data || 'Error occurred while uploading file'
        );
      }
    } catch (error) {
      await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'AUTH014',
        error,
        'UserScreen',
        '',
        {
          artifact: 'UserScreen',
          users: 'anonymous user',
        },
      );
      await this.throwCustomException(error);
    }
  }

  async getFile(id: string | string[], context: string,enableEncryption: Boolean) {
    try {
      const fileMetadata = await this.commonService.findFileById(id);
      const buffer = await this.commonService.getFile(id, context,enableEncryption);

      // Handle single file
      if (!Array.isArray(id)) {
        return {
          res: buffer,
          file: fileMetadata
        };
      }

      // Handle multiple files
      return {
        res: buffer,
        file: fileMetadata,
        isMultiple: true
      };
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async setUpKey(key: string, token: string) {
    try {
      const sKey: any = await this.commonService.readAPI(
        key,
        process.env.CLIENTCODE,
        token,
      );
      if (sKey) {
        if (sKey?.tenantAppearancekey) {
          const presetData: any = await this.commonService.readAPI(
            sKey?.tenantAppearancekey,
            process.env.CLIENTCODE,
            token,
          );
          if (sKey?.selectedPresetKey) {
            return presetData[sKey?.selectedPresetKey] || {};
          } else {
            return presetData['default'] || {};
          }
        }
        return sKey || {};
      } else {
        await this.commonService.errorLog(
          'Technical',
          'AK',
          'Fatal',
          'TG027',
          'setupKey not found',
          key,
          token,
        );
      }
    } catch (error) {
      await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'TG027',
        'setupKey not found',
        key,
        token,
      );
    }
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
    try {
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
        if (Array.isArray(obj))
          return obj.map((item) => removeKeys(item, keys));
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
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async getpagination(
    key: any,
    page,
    count,
    filter?,
    searchObj?,
    token?: string,
  ) {
    try {
      let tokenDecode = await this.jwtService.decodeToken(token);
      if (!tokenDecode?.selectedAccessProfile)
        throw 'Selected Access Profile not found';

      if(!tokenDecode?.loginId) throw 'loginId not found'
      let dsObject,data
      let afkey = key.replace(':FNGK:AFP:FNK:DF-DST:',':FNGK:AF:FNK:DF-DFD:')
       let afi = JSON.parse( await this.redisService.getJsonData(afkey+'AFI', process.env.CLIENTCODE))      
       if(!afi.logicCenter){
        const requestConfig: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${token}`
            },timeout: 300000 
            };
         // if (!(this.envData.getBeUrl())) throw new CustomException('Server Url not found', 404) 
         await this.commonService.postCall(process.env.BE_URL+ '/te/eventEmitter',{ "key": afkey,count:count,page:page },requestConfig)          
       }     
        dsObject = await this.redisService.getAllRecordshash(key + tokenDecode.loginId+'_DS_Object')         
       
      if (!dsObject) {
        await this.commonService.errorLog(
          'Technical',
          'AK',
          'Fatal',
          'TG033',
          'DataSet does not exists',
          key,
          token,
        );
      }
    //if(f == 1)
       data = dsObject
     // else
     // data = dsObject?.data
      if (data && tokenDecode) {
        if (!page) page = 1;
        let rule: any;
        let finalData = [];
        var dataArr = [];
        var searcharr = [];
        let start,end;
        if(count){
          start = (page - 1) * count;
          end = start + count;
        }

        if (searchObj && Object.keys(searchObj).length > 0) {
          var searchkey = Object.keys(searchObj);
          var searchval = Object.values(searchObj);
        }

        if (filter) {
          var json = JSON.parse(
            await this.redisService.getJsonDataWithPath(
              filter.ufKey,
              '.mappedData.artifact.node',
              process.env.CLIENTCODE,
            ),
          );

          if (!json) {
            await this.commonService.errorLog(
              'Technical',
              'AK',
              'Fatal',
              'TG034',
              'node is empty',
              key,
              token,
            );
          }
          for (let s = 0; s < json.length; s++) {
            if (json[s].nodeId == filter.nodeId) {
              rule = json[s].rule;
            }
          }

          if (rule?.nodes?.length && rule?.edges?.length) {
            for (let j = 0; j < data.length; j++) {
              let result: any = await this.gorule.goRule(rule, data[j]);
              if (result?.error) {
                break;
              } else if (result?.result?.output === true) {
                // if (tokenDecode?.dap == 'f') {
                finalData.push(data[j]);
                // } else if (
                //   tokenDecode.orgGrpCode == data[j]['trs_org_grp_code'] &&
                //   tokenDecode.orgCode == data[j]['trs_org_code'] &&
                //   tokenDecode.roleGrpCode == data[j]['trs_role_grp_code'] &&
                //   tokenDecode.roleCode == data[j]['trs_role_code'] &&
                //   tokenDecode.psGrpCode == data[j]['trs_ps_grp_code'] &&
                //   tokenDecode.psCode == data[j]['trs_ps_code'] &&
                //   tokenDecode.selectedAccessProfile ==
                //     data[j]['trs_access_profile'] &&
                //   tokenDecode.loginId == data[j]['trs_created_by']
                // ) {
                //   finalData.push(data[j]);
                // }
              }
            }

            if (searchObj && Object.keys(searchObj).length > 0) {
              for (var x = 0; x < finalData.length; x++) {
                var s = 0;
                for (var q = 0; q < searchkey.length; q++) {
                  if (finalData[x][searchkey[q]] == searchval[q]) {
                    // if (tokenDecode?.dap == 'f') {
                    s++;
                    // } else if (
                    //   tokenDecode.orgGrpCode ==
                    //     finalData[x]['trs_org_grp_code'] &&
                    //   tokenDecode.orgCode == finalData[x]['trs_org_code'] &&
                    //   tokenDecode.roleGrpCode ==
                    //     finalData[x]['trs_role_grp_code'] &&
                    //   tokenDecode.roleCode == finalData[x]['trs_role_code'] &&
                    //   tokenDecode.psGrpCode ==
                    //     finalData[x]['trs_ps_grp_code'] &&
                    //   tokenDecode.psCode == finalData[x]['trs_ps_code'] &&
                    //   tokenDecode.selectedAccessProfile ==
                    //     finalData[x]['trs_access_profile'] &&
                    //   tokenDecode.loginId == finalData[x]['trs_created_by']
                    // ) {
                    //   s++;
                    // }
                  }
                }
                // if(searchset.includes(searchkey.toLowerCase())){
                if (s == searchkey.length) searcharr.push(finalData[x]);
                //  }
              }
              return await this.filterpagination(start, end, searcharr);
            }
            return await this.filterpagination(start, end, finalData);
          } else {
            await this.commonService.errorLog(
              'Technical',
              'AK',
              'Fatal',
              'TG035',
              'Invalid rule',
              key,
              token,
            );
          }
        }

        if (searchObj && Object.keys(searchObj).length > 0) {
          for (var x = 0; x < data.length; x++) {
            var s = 0;
            for (var q = 0; q < searchkey.length; q++) {
              if (data[x][searchkey[q]] == searchval[q]) {
                // if (tokenDecode?.dap == 'f') {
                s++;
                // } else if (
                //   tokenDecode.orgGrpCode == data[x]['trs_org_grp_code'] &&
                //   tokenDecode.orgCode == data[x]['trs_org_code'] &&
                //   tokenDecode.roleGrpCode == data[x]['trs_role_grp_code'] &&
                //   tokenDecode.roleCode == data[x]['trs_role_code'] &&
                //   tokenDecode.psGrpCode == data[x]['trs_ps_grp_code'] &&
                //   tokenDecode.psCode == data[x]['trs_ps_code'] &&
                //   tokenDecode.selectedAccessProfile ==
                //     data[x]['trs_access_profile'] &&
                //   tokenDecode.loginId == data[x]['trs_created_by']
                // ) {
                //   s++;
                // }
              }
            }
            // if(searchset.includes(searchkey.toLowerCase())){ searchkey
            if (s == searchkey.length) searcharr.push(data[x]);
          }
          return await this.filterpagination(start, end, searcharr);
        }

        if (data?.length > 0) {
          for (let i = 0; i < data.length; i++) {
            // if (tokenDecode?.dap == 'f') {
            dataArr.push(data[i]);
            // } else if (
            //   tokenDecode.orgGrpCode == data[i]['trs_org_grp_code'] &&
            //   tokenDecode.orgCode == data[i]['trs_org_code'] &&
            //   tokenDecode.roleGrpCode == data[i]['trs_role_grp_code'] &&
            //   tokenDecode.roleCode == data[i]['trs_role_code'] &&
            //   tokenDecode.psGrpCode == data[i]['trs_ps_grp_code'] &&
            //   tokenDecode.psCode == data[i]['trs_ps_code'] &&
            //   tokenDecode.selectedAccessProfile ==
            //     data[i]['trs_access_profile'] &&
            //   tokenDecode.loginId == data[i]['trs_created_by']
            // ) {
            //   dataArr.push(data[i]);
            // }
          }
        }
        return await this.filterpagination(start, end, dataArr);
      }
    } catch (err) {
      await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'TG036',
        `Error in pagination:${err.message}`,
        key,
        token,
      );
    }
  }

  async filterpagination(start, end, searcharr) {
    try {
      console.log(1,end,2, searcharr)
      var filArray = [];
      if(end){
        for (let i = start; i < end; i++) {
          if (searcharr[i] != null) filArray.push(searcharr[i]);
        }
      }else{       
        for (let i = 0; i < searcharr.length; i++) {
          if (searcharr[i] != null) filArray.push(searcharr[i]);
        }
      }

      return { records: filArray, totalRecords: searcharr.length };
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async getValueByPath(obj, path) {
    return path
      .split(".")
      .reduce((acc, key) => acc?.[key], obj);
  }

  async Orchestration(
    key: string,
    componentId: string,
    controlId: string,
    token: string,
    isTable?: boolean,
    accessProfile?: any[],
  ) {
    try {
      const UO: any = await this.commonService.readAPI(
        key + ':UO',
        process.env.CLIENTCODE,
        token,
      );
      const screenName: string = key.split(':')[11];
      let mappedData: any = UO.mappedData.artifact.node;
      const securityData: any = UO.securityData;
      let templateArray: any[] = securityData.accessProfile;
      const decodedToken: any = await this.jwtService.decodeToken(token);
      let object:any = {};
      let dataType: string;
      let security: any;
      let allowedGroup: any = [];
      let componentNameArray: string[] = [];
      let controlNames: any = [];
      let readableControls: any = [];
      let DFkeys: string[] = [];
      let dfKey: string;
      let sourceData: any[];
      let dfData: any;
      let DS_Object: any = [];
      if (UO) {
        if (key && !componentId && !controlId) {
          /*---------security start-------------*/
          if (key === securityData.afk) {
            for (let i = 0; i < templateArray.length; i++) {
              if (
                accessProfile.includes(templateArray[i].accessProfile) &&
                screenName === templateArray[i].security.artifact.resource
              ) {
                security =
                  templateArray[i].security.artifact.SIFlag.selectedValue;
                templateArray[i].security.artifact?.node?.map((nodes: any) => {
                  allowedGroup.push({
                    groupName: nodes?.resource,
                    security: nodes?.SIFlag.selectedValue,
                  });
                });
              }
            }
          } else {
            await this.commonService.errorLog(
              'Technical',
              'AK',
              'Fatal',
              'TG085',
              'security afk not found',
              key,
              token,
            );
          }
          /*---------security end-------------*/
          /*---------get dfKey start-------------*/
          sourceData = UO.source;
          if (sourceData) {
            for (let i = 0; i < sourceData.length; i++) {
              dfKey = sourceData[i].dfdKey;
              dfKey = dfKey + ':';
              DFkeys.push(dfKey);
            }
          } else {
            /* await this.commonService.errorLog(
              'Technical',
              'AK',
              'Fatal',
              'TG086',
              'sourceData not found',
              key,
              token,
            ); */
          }
          /*---------get dfKey end-------------*/
          object = {
            action: UO.mappedData.artifact?.action,
            code: UO.mappedData.artifact?.code,
            rule: UO.mappedData.artifact?.rule,
            events: UO.mappedData.artifact?.events,
            mapper: UO.mappedData.artifact?.mapper,
            security: security,
            allowedGroup: allowedGroup,
            DFkeys: DFkeys,
          };
          return object;
        } else if (key && componentId && !controlId) {
          let controllerRule:any = {}
          /*---------security start-------------*/
          if (key === securityData.afk) {
            for (let i = 0; i < templateArray.length; i++) {
              for (
                let j = 0;
                j < templateArray[i].security.artifact.node.length;
                j++
              ) {
                  if (
                  accessProfile.includes(templateArray[i].accessProfile)
                ) {
                if(screenName === templateArray[i].security.artifact.resource &&
                    componentId ===
                    templateArray[i].security.artifact.node[j].resourceId){
                    let selectedValues: any = [];
                    for (
                      let l = 0;
                      l < templateArray[i].security.artifact.node.length;
                      l++
                    ) {
                      selectedValues.push(
                        templateArray[i].security.artifact.node[l].SIFlag
                          .selectedValue,
                      );
                    }
                  for(let m = 0;m < templateArray[i].security.artifact.node.length;m++){
                    if(selectedValues.includes('ATO')){
                      if(templateArray[i].security.artifact.node[m].SIFlag
                          .selectedValue === 'ATO'){
                          componentNameArray.push(
                            templateArray[i].security.artifact.node[
                              m
                            ].resource.toLowerCase(),
                          );
                          break;
                        }
                    }else{
                      if(templateArray[i].security.artifact.node[m].SIFlag
                        .selectedValue === 'AA'){
                          componentNameArray.push(
                            templateArray[i].security.artifact.node[
                              m
                            ].resource.toLowerCase(),
                          );
                        }
                      }
                    }
                    if (
                      (selectedValues.includes('ATO') &&
                        templateArray[i].security.artifact.node[j].SIFlag
                          .selectedValue === 'ATO') ||
                      (selectedValues.includes('RTO') &&
                        templateArray[i].security.artifact.node[j].SIFlag
                          .selectedValue === 'RTO')
                    ) {
                      if (isTable === true) {
                        for (
                          let k = 0;
                          k <
                          templateArray[i].security.artifact.node[j].objElements
                            .length;
                          k++
                        ) {
                          if (
                            templateArray[i].security.artifact.node[j]
                              .objElements[k].SIFlag.selectedValue !== 'BTO'
                          ) {
                            controlNames.push(
                              templateArray[i].security.artifact.node[j]
                                .objElements[k].resource,
                            );
                          }
                          if (
                            templateArray[i].security.artifact.node[j]
                              .objElements[k].SIFlag.selectedValue == 'RTO'
                          ) {
                            readableControls.push(
                              templateArray[i].security.artifact.node[j]
                                .objElements[k].resource,
                            );
                          }
                        }
                        controlNames = controlNames.map((item) =>
                          item.toLowerCase(),
                        );
                        readableControls = readableControls.map((item) =>
                          item.toLowerCase(),
                        );
                        // return componentNameArray;
                      } else {
                        for (
                          let k = 0;
                          k <
                          templateArray[i].security.artifact.node[j].objElements
                            .length;
                          k++
                        ) {
                          if (
                            templateArray[i].security.artifact.node[j]
                              .objElements[k].SIFlag.selectedValue !== 'BTO'
                          ) {
                            controlNames.push(
                              templateArray[i].security.artifact.node[j]
                                .objElements[k].resource,
                            );
                          }
                          if (
                            templateArray[i].security.artifact.node[j]
                              .objElements[k].SIFlag.selectedValue == 'RTO'
                          ) {
                            readableControls.push(
                              templateArray[i].security.artifact.node[j]
                                .objElements[k].resource,
                            );
                          }
                        }
                        controlNames = controlNames.map((item) =>
                          item.toLowerCase(),
                        );
                        readableControls = readableControls.map((item) =>
                          item.toLowerCase(),
                        );
                        // return controlNames;
                      }
                    }
                    if (selectedValues.includes('ATO')) {
                      break;
                    }
                    if (
                      templateArray[i].security.artifact.node[j].SIFlag
                        .selectedValue === 'AA' ||
                      templateArray[i].security.artifact.node[j].SIFlag
                        .selectedValue === 'RA'
                    ) {
                      if (isTable === true) {
                        for (
                          let k = 0;
                          k <
                          templateArray[i].security.artifact.node[j].objElements
                            .length;
                          k++
                        ) {
                          if (
                            templateArray[i].security.artifact.node[j]
                              .objElements[k].SIFlag.selectedValue !== 'BTO'
                          ) {
                            controlNames.push(
                              templateArray[i].security.artifact.node[j]
                                .objElements[k].resource,
                            );
                          }
                          if (
                            templateArray[i].security.artifact.node[j]
                              .objElements[k].SIFlag.selectedValue == 'RTO'
                          ) {
                            readableControls.push(
                              templateArray[i].security.artifact.node[j]
                                .objElements[k].resource,
                            );
                          }
                        }
                        controlNames = controlNames.map((item) =>
                          item.toLowerCase(),
                        );

                        readableControls = readableControls.map((item) =>
                          item.toLowerCase(),
                        );

                        // return componentNameArray;
                      } else {
                        for (
                          let k = 0;
                          k <
                          templateArray[i].security.artifact.node[j].objElements
                            .length;
                          k++
                        ) {
                          if (
                            templateArray[i].security.artifact.node[j]
                              .objElements[k].SIFlag.selectedValue !== 'BTO'
                          ) {
                            controlNames.push(
                              templateArray[i].security.artifact.node[j]
                                .objElements[k].resource,
                            );
                          }
                          if (
                            templateArray[i].security.artifact.node[j]
                              .objElements[k].SIFlag.selectedValue == 'RTO'
                          ) {
                            readableControls.push(
                              templateArray[i].security.artifact.node[j]
                                .objElements[k].resource,
                            );
                          }
                        }

                        controlNames = controlNames.map((item) =>
                          item.toLowerCase(),
                        );
                        readableControls = readableControls.map((item) =>
                          item.toLowerCase(),
                        );
                        // return controlNames;
                      }
                    } else if (
                      templateArray[i].security.artifact.node[j].SIFlag
                        .selectedValue === 'BTO' ||
                      templateArray[i].security.artifact.node[j].SIFlag
                        .selectedValue === 'BA'
                    ) {
                      controlNames = controlNames.map((item) =>
                        item.toLowerCase(),
                      );
                      // return controlNames;
                    }
                  }
                }
              }
            }
          } else {
            await this.commonService.errorLog(
              'Technical',
              'AK',
              'Fatal',
              'TG087',
              'security afk not found',
              key,
              token,
            );
          }
          /*---------security end-------------*/
          for (let i = 0; i < mappedData.length; i++) {
            if (componentId === mappedData[i].nodeId) {
              for (let j = 0;j < mappedData[i].objElements.length;j++) {
                if(mappedData[i].objElements[j].mapper.length > 0){
                let mapperDetails:any ={};
                mapperDetails["elementname"] = mappedData[i].objElements[j].elementName;
                mapperDetails["sourcekey"] = mappedData[i].objElements[j].mapper[0].sourceKey[0];
                mapperDetails["targetkey"] = mappedData[i].objElements[j].mapper[0].targetKey;
                  mappedData[i]?.mapper.push(mapperDetails);
                }
                if(componentId==mappedData[i].objElements[j]?.parentId)
                {
                  let tempRule:any=mappedData[i].objElements[j]?.rule
                  if((("nodes" in tempRule)&&("edges" in tempRule))){

                    controllerRule={...controllerRule,[mappedData[i].objElements[j]?.elementName]:tempRule}
                  }

                }
              }
              object = {
                action: mappedData[i]?.action,
                code: mappedData[i]?.code,
                rule: mappedData[i]?.rule,
                events: mappedData[i]?.events,
                mapper: mappedData[i]?.mapper,
                GoRuleData:controllerRule
              };

            }
       
          }
          let mappperNodeId:any=""
          /*---------get dfKey start-------------*/
          if (mappedData) {
            for (let i = 0; i < mappedData.length; i++) {
              if (componentId === mappedData[i].nodeId) {
                for (
                  let node = 0;
                  node < mappedData[i].objElements.length;
                  node++
                ) {
                  if (mappedData[i].objElements[node].mapper.length > 0) {
                    mappperNodeId = mappedData[i].objElements[
                        node
                      ].mapper[0].sourceKey[0].split('|')[1];
                    dfKey =
                      mappedData[i].objElements[
                        node
                      ].mapper[0].sourceKey[0].split('|')[0];
                    dfKey = dfKey + ':';
                  }
                }
              }
            }
          } else {
            await this.commonService.errorLog(
              'Technical',
              'AK',
              'Fatal',
              'TG088',
              'mappedData not found',
              key,
              token,
            );
          }
          /*---------get dfKey end-------------*/
          if (isTable) {
            // for table group
            let dfSchemaKey = await this.commonService.readAPI(
              dfKey + 'DFO',
              process.env.CLIENTCODE,
              token,
            );
            try {
              dfData = dfSchemaKey;
              let schemaData = dfData.filter((item: any) => {
                if (
                  item?.nodeType !== 'startnode' &&
                  item?.nodeType !== 'endnode'
                )
                  return item;
              });

              let nodeType: string = 'apinode';
              schemaData.map((nodes: any) => {
                if (nodes?.nodeType == 'dbnode') {
                  nodeType = 'dbnode';
                }
              });

              // return schemaData
              object = {
                ...object,
                security: controlNames,
                allowedGroups: componentNameArray,
                readableControls: readableControls,
                schemaData,
                dfKey: dfKey,
                dfdNodeType: nodeType,
                mappperNodeId:mappperNodeId
              };
            } catch (err) {
              object = {
                ...object,
                security: controlNames,
                allowedGroups: componentNameArray,
                readableControls: readableControls,
                dfKey: dfKey,
                mappperNodeId:mappperNodeId
              };
            }
          } else {
            // ordinary group
            object = {
              ...object,
              security: controlNames,
              allowedGroups: componentNameArray,
              readableControls: readableControls,
              dfKey: dfKey,
              mappperNodeId:mappperNodeId
            };
          }
          return object;
        } else if (key && componentId && controlId) {
          for (let i = 0; i < mappedData.length; i++) {
            if (componentId === mappedData[i].nodeId) {
              let schemaData: any;
              for (let j = 0; j < mappedData[i].objElements.length; j++) {
                if (controlId === mappedData[i].objElements[j].elementId) {
                  if (mappedData[i].objElements[j].mapper.length == 0) {
                    dfData = [];
                  } else {
                    let dfdKey: string =
                      mappedData[i].objElements[j].mapper[0].sourceKey[0].split(
                        '|',
                      )[0];
                    let dfdNode: string =
                      mappedData[i].objElements[j].mapper[0].sourceKey[0].split(
                        '|',
                      )[1];
                    let dfdSource: string =
                      mappedData[i].objElements[j].mapper[0].sourceKey[0].split(
                        '|',
                      )[2].split('.').at(-1);
                    let dfPath: string =  mappedData[i].objElements[j].mapper[0].sourceKey[0].split(
                        '|',
                      )[2];
                    let dfSchemaKey = await this.commonService.readAPI(
                      dfdKey + ':DFO',
                      process.env.CLIENTCODE,
                      token,
                    );
                    
                    for (let dfo = 0; dfo < dfSchemaKey.length; dfo++) {
                      if (dfSchemaKey[dfo].nodeId == dfdNode) {
                        dataType = await this.getValueByPath(dfSchemaKey[dfo].schema,dfPath+'.type');
                        console.log("dataType ==> ", dataType);

                      }
                      
                    }
                    // return dfSchemaKey
                    try {
                      dfData = dfSchemaKey;
                      schemaData = dfData.filter((item: any) => {
                        if (
                          item?.nodeType == 'apinode' ||
                          item?.nodeType == 'dbnode'
                        )
                          return item;
                      });
                    } catch (err) {
                      schemaData = [];
                    }

                    // let dstKey: string = dfdKey
                    //  .replace(':AFC:', ':AFCP:')
                    //  .replace(':AF:', ':AFP:')
                    //  .replace(':DF-DFD:', ':DF-DST:');
                    // DS_Object = await this.commonService.readAPI(
                    //  dstKey + ':DS_Object',
                    //  process.env.CLIENTCODE,
                    //  token,
                    // );

                    // if (DS_Object == null || DS_Object == undefined) {
                    //   DS_Object['data'] = [];
                    // }
                  }

                  if(mappedData[i].objElements[j]?.elementType == "dynamicjsonform")
                  {
                    let ruleKey:string =''
                    let pfRuleData:any={}
                    let NDPData =await this.commonService.readAPI(
                                  key + ':NDP',
                                  process.env.CLIENTCODE,
                                  token,
                                );
                    if(controlId in NDPData)
                    {
                      ruleKey= NDPData[controlId]?.apiKey || ''
                      if(ruleKey)
                      {
                      let temp:any  =await this.commonService.readAPI(
                                  ruleKey,
                                  process.env.CLIENTCODE,
                                  token,
                                );
                      Object.keys(temp)?.map((eachKey)=>{
                        if(temp[eachKey]?.rule)
                        {
                          pfRuleData = temp[eachKey]?.rule;
                        }
                      })
                      }
                    }
                    object = {
                              action: mappedData[i].objElements[j]?.action,
                              code: mappedData[i].objElements[j]?.code,
                              pfRuleData:pfRuleData,
                              rule: mappedData[i].objElements[j]?.rule,
                              events: mappedData[i].objElements[j]?.events,
                              mapper: mappedData[i].objElements[j]?.mapper,
                              // dstData: DS_Object?.data || [],
                              schemaData,
                            };
                  }
                  else
                  {
                    object = {
                      action: mappedData[i].objElements[j]?.action,
                      code: mappedData[i].objElements[j]?.code,
                      rule: mappedData[i].objElements[j]?.rule,
                      events: mappedData[i].objElements[j]?.events,
                      mapper: mappedData[i].objElements[j]?.mapper,
                      // dstData: DS_Object?.data || [],
                      schemaData,
                      dataType
                    };
                  }
                  if(mappedData[i].objElements[j]?.elementType== "editor")
                  {
                    let editorMapper:any=[]
                    object?.mapper?.map((eachResource:any)=>{
                      let temp:any={
                        sourceKey:eachResource?.sourceKey[0]?.split('/')?.at(-1)|| "",
                        targetKey:eachResource?.targetKey?.split('|')?.at(-1) || ""
                      }
                      editorMapper.push(temp)
                    })
                    object.mapper=editorMapper
                  }
                  return object;
                }
              }
            }
          }
        }
      } else {
        await this.commonService.errorLog(
          'Technical',
          'AK',
          'Fatal',
          'TG089',
          'UO not found',
          key,
          token,
        );
      }
    } catch (error) {
      await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'TG090',
        `Error in Orchestration:${error.message}`,
        key,
        token,
      );
    }
  }

  async elementsFilter(
    key: string,
    groupName?: any,
    controlName?: string,
    token?: string,
  ) {
    try {
      let rule: string = '';
      const uoKey: any = await this.commonService.readAPI(
        key + ':UO',
        process.env.CLIENTCODE,
        token,
      );
      let UO: any = uoKey;
      let elements: any = {};

      let artifact: any = key.split(':')[11];
      elements = {};
      // return elements;
      let mappedData = UO.mappedData;
      if (mappedData) {
        for (let i = 0; i < mappedData.artifact.node.length; i++) {
          let group = mappedData.artifact.node[i];
          elements[group?.nodeName] = {};
          group.objElements.map((controls) => {
            if (controls?.elementName)
              elements[group?.nodeName][controls.elementName] = {};
          });
        }
      } else {
        throw 'UO not found';
      }
      return elements;
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async getMapperDetails(
    key: string,
    componentId: string,
    controlId: string,
    category: string,
    bindtranValue?: any,
    code?: any,
    token?: string,
  ) {
    try {
      let codName: any;
      const uoKey: any = await this.commonService.readAPI(
        key + ':UO',
        process.env.CLIENTCODE,
        token,
      );
      let UO: any = uoKey;
      if (UO) {
        let mappedData: any = UO.mappedData.artifact.node;
        if (mappedData) {
          if (key && !componentId && !controlId) {
            if (UO.mappedData.artifact.mapper.length == 0) return [];
            return UO.mappedData.artifact.mapper;
          } else if (key && componentId && !controlId) {
            for (let i = 0; i < mappedData.length; i++) {
              if (componentId === mappedData[i].nodeId) {
                if (mappedData[i].mapper.length == 0) return [];
                return mappedData[i].mapper;
              }
            }
          } else if (key && componentId && controlId) {
            for (let i = 0; i < mappedData.length; i++) {
              if (componentId === mappedData[i].nodeId) {
                for (let j = 0; j < mappedData[i].objElements.length; j++) {
                  if (controlId === mappedData[i].objElements[j].elementId) {
                    if (mappedData[i].objElements[j].mapper.length == 0)
                      return [];
                    let dfdKey: string =
                      mappedData[i].objElements[j].mapper[0].sourceKey[0].split(
                        '|',
                      )[0];
                    let mapperColumn: string =
                      mappedData[i].objElements[j].mapper[0].sourceKey[0].split(
                        '|',
                      )[2];
                    let dstKey: string = dfdKey
                      .replace(':AFC:', ':AFCP:')
                      .replace(':AF:', ':AFP:')
                      .replace(':DF-DFD:', ':DF-DST:');
                    let dfData: any = await this.commonService.readAPI(
                      dstKey + ':DS_Object',
                      process.env.CLIENTCODE,
                      token,
                    );
                    dfData = dfData;
                    if (
                      key &&
                      componentId &&
                      controlId &&
                      !category &&
                      !bindtranValue &&
                      !code
                    ) {
                      let data = dfData.data;

                      return data;
                    } else if (category && !bindtranValue && !code) {
                      let categoryData: any[] = [];
                      let dropdownData: string[] = [];
                      for (let i = 0; i < dfData.data.length; i++) {
                        Object.keys(dfData.data[i]).map((keyName) => {
                          if (category === dfData.data[i][keyName]) {
                            categoryData.push(dfData.data[i]);
                          }
                        });
                      }
                      for (let i = 0; i < categoryData.length; i++) {
                        Object.keys(categoryData[i]).map((keyName) => {
                          if (mapperColumn === keyName) {
                            dropdownData.push(categoryData[i][keyName]);
                          }
                        });
                      }
                      return dropdownData;
                    } else if (code && bindtranValue) {
                      for (let i = 0; i < dfData.data.length; i++) {
                        Object.keys(dfData.data[i]).map((keyName) => {
                          if (bindtranValue === dfData.data[i][keyName]) {
                            codName = dfData.data[i].code;
                          }
                        });
                      }
                      return codName;
                    } else if (code) {
                      let categoryData: any[] = [];
                      let dropdownData: string[] = [];
                      for (let i = 0; i < dfData.data.length; i++) {
                        Object.keys(dfData.data[i]).map((keyName) => {
                          if (category === dfData.data[i][keyName]) {
                            categoryData.push(dfData.data[i]);
                          }
                        });
                      }
                      for (let j = 0; j < categoryData.length; j++) {
                        Object.keys(categoryData[j]).map((keyName) => {
                          if (
                            categoryData[j].parentCode === code &&
                            mapperColumn === keyName
                          ) {
                            dropdownData.push(categoryData[j][keyName]);
                          }
                        });
                      }
                      return dropdownData;
                    } else if (bindtranValue) {
                      for (let i = 0; i < dfData.data.length; i++) {
                        Object.keys(dfData.data[i]).map((keyName) => {
                          if (bindtranValue === dfData.data[i][keyName]) {
                            codName = dfData.data[i].code;
                          }
                        });
                      }
                      return codName;
                    } else {
                      let dropdownData: string[] = [];
                      for (let i = 0; i < dfData.data.length; i++) {
                        Object.keys(dfData.data[i]).map((keyName) => {
                          if (mapperColumn === keyName) {
                            dropdownData.push(dfData.data[i][keyName]);
                          }
                        });
                      }
                      return dropdownData;
                    }
                  }
                }
              }
            }
          }
        } else {
          await this.commonService.errorLog(
            'Technical',
            'AK',
            'Fatal',
            'TG030',
            'mapper data not found',
            key,
            token,
          );
        }
      } else {
        await this.commonService.errorLog(
          'Technical',
          'AK',
          'Fatal',
          'TG031',
          'UO not found',
          key,
          token,
        );
      }
    } catch (error) {
      await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'TG032',
        `UO api error:${error.message}`,
        key,
        token,
      );
    }
  }

  async codeExecution(stringCode: string, params: any) {
    try {
      function runCodeWithObjectParams(codeString, paramsObject) {
        // Create a function with destructured parameters from the object
        const keys = Object.keys(paramsObject);
        const values = Object.values(paramsObject);

        const runCode = new Function(...keys, `${codeString};`);

        // Call the function with the values from the object
        return runCode(...values);
      }
      return runCodeWithObjectParams(stringCode, params);
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async eventFunction(eventProperty: any) {
    try {
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
              code: item.code,
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
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async codefilter(
    key: string,
    groupId?: any,
    controlId?: string,
    event?: any,
    token?: string,
  ) {
    try {
      let rule: string = '';
      const uoKey: any = await this.commonService.readAPI(
        key + ':UO',
        process.env.CLIENTCODE,
        token,
      );
      let UO: any = uoKey;

      let mappedData = UO.mappedData;
      if (mappedData) {
        if (groupId) {
          if (event) {
            let eventProperty: any;
            for (let i = 0; i < mappedData.artifact.node.length; i++) {
              let group = mappedData.artifact.node[i];
              if (group.nodeId == groupId) {
                eventProperty = group.events.eventSummary;
              }
            }
            let eventDetails: any = await this.eventFunction(eventProperty);
            let eventDetailsArray = eventDetails[0];
            for (let i = 0; i < eventDetailsArray.length; i++) {
              if (eventDetailsArray[i].name === event) {
                return eventDetailsArray[i].code;
              }
            }
          }
          if (controlId) {
            if (event) {
              let eventProperty: any;
              for (let i = 0; i < mappedData.artifact.node.length; i++) {
                let group = mappedData.artifact.node[i];
                if (group.nodeId == groupId) {
                  for (let j = 0; j < group.objElements.length; j++) {
                    let control = group.objElements[j];
                    if (control.elementId == controlId) {
                      eventProperty = control.events.eventSummary;
                    }
                  }
                }
              }
              let eventDetails: any = await this.eventFunction(eventProperty);
              let eventDetailsArray = eventDetails[0];
              for (let i = 0; i < eventDetailsArray.length; i++) {
                if (eventDetailsArray[i].name === event) {
                  return eventDetailsArray[i].code;
                }
              }
            } else {
              for (let i = 0; i < mappedData.artifact.node.length; i++) {
                let group = mappedData.artifact.node[i];
                if (group.node == groupId) {
                  for (let j = 0; j < group.objElements.length; j++) {
                    let control = group.objElements[j];
                    if (control.code != '') return control.code;
                    else
                      await this.commonService.errorLog(
                        'Technical',
                        'AK',
                        'Fatal',
                        'TG037',
                        'there is no rule in control level',
                        key,
                        token,
                      );
                  }
                }
              }
            }
          } else {
            for (let i = 0; i < mappedData.artifact.node.length; i++) {
              let group = mappedData.artifact.node[i];
              if (group.nodeId == groupId) {
                if (group.code != '') return group.code;
                else
                  await this.commonService.errorLog(
                    'Technical',
                    'AK',
                    'Fatal',
                    'TG038',
                    'there is no rule in group level',
                    key,
                    token,
                  );
              }
            }
          }
        } else {
          if (mappedData.artifact.code != '') return mappedData.artifact.code;
          else
            await this.commonService.errorLog(
              'Technical',
              'AK',
              'Fatal',
              'TG039',
              'there is no rule in artifact level',
              key,
              token,
            );
        }
      }
    } catch (error) {
      await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'TG040',
        `Error in codefilter:${error.message}`,
        key,
        token,
      );
    }
  }

  async ifo(
    formData: any,
    key: string,
    controlId: string,
    isTable?: Boolean,
    token?: string,
  ) {
    if (isTable == true) {
      try {
        if (formData == undefined || Object.keys(formData).length === 0)
          await this.commonService.errorLog(
            'Technical',
            'AK',
            'Fatal',
            'TG041',
            'post data is not a valid data',
            key,
            token,
          );
        if (key !== '') {
          let spiltedkey: any[] = key.split('|');
          let findingkey: string = spiltedkey.pop();
          let newKey = structuredClone(spiltedkey);
          const POdataKey: any = await this.commonService.readAPI(
            spiltedkey.join(':') + ':PO',
            process.env.CLIENTCODE,
            token,
          );
          const POdata = POdataKey;

          if (POdata) {
            if (POdata?.mappedData?.artifact?.node?.length) {
              for (let i = 0; i < POdata.mappedData.artifact.node.length; i++) {
                if (POdata.mappedData.artifact.node[i].nodeId == findingkey) {
                  if (POdata.mappedData.artifact.node[i].ifo) {
                    let filterItems: any = {};
                    for (
                      let j = 0;
                      j < POdata.mappedData.artifact.node[i].ifo.length;
                      j++
                    ) {
                      let NodeId: any =
                        POdata.mappedData.artifact.node[i].ifo[j].nodeId.split(
                          '.',
                        )[0];
                      if (NodeId == controlId) {
                        let nodeName: string =
                          POdata.mappedData.artifact.node[i].ifo[j].name;
                        nodeName = nodeName.toLocaleLowerCase();
                        if (nodeName in formData) {
                          filterItems[nodeName] = formData[nodeName];
                        }
                      }
                    }
                    return filterItems;
                  }
                }
              }
              await this.commonService.errorLog(
                'Technical',
                'AK',
                'Fatal',
                'TG042',
                'ifo not found',
                key,
                token,
              );
            }
          } else {
            await this.commonService.errorLog(
              'Technical',
              'AK',
              'Fatal',
              'TG043',
              'key is not a valid key in POdata',
              key,
              token,
            );
          }
        } else {
          await this.commonService.errorLog(
            'Technical',
            'AK',
            'Fatal',
            'TG044',
            'key is not a valid key',
            key,
            token,
          );
        }
      } catch (error) {
        await this.commonService.errorLog(
          'Technical',
          'AK',
          'Fatal',
          'TG045',
          `Error in ifo:${error.message}`,
          key,
          token,
        );
      }
    } else {
      try {
        if (formData == undefined || Object.keys(formData).length === 0)
          await this.commonService.errorLog(
            'Technical',
            'AK',
            'Fatal',
            'TG046',
            'post data is not a valid data',
            key,
            token,
          );
        if (key !== '') {
          let spiltedkey: any[] = key.split('|');
          let findingkey: string = spiltedkey.pop();
          let newKey = structuredClone(spiltedkey);
          // return spiltedkey
          const POdataKey: any = await this.commonService.readAPI(
            spiltedkey.join(':') + ':PO',
            process.env.CLIENTCODE,
            token,
          );
          const POdata = POdataKey;
          // return POdata
          if (POdata) {
            if (POdata?.mappedData?.artifact?.node?.length) {
              for (let i = 0; i < POdata.mappedData.artifact.node.length; i++) {
                if (POdata.mappedData.artifact.node[i].nodeId == findingkey) {
                  if (POdata.mappedData.artifact.node[i].ifo) {
                    let filterItems: any = {};
                    for (
                      let j = 0;
                      j < POdata.mappedData.artifact.node[i].ifo.length;
                      j++
                    ) {
                      let NodeId: any =
                        POdata.mappedData.artifact.node[i].ifo[j].nodeId.split(
                          '.',
                        )[0];
                      if (NodeId == controlId) {
                        let nodeName: string =
                          POdata.mappedData.artifact.node[i].ifo[
                            j
                          ].name.toLocaleLowerCase();
                        if (formData[nodeName] != undefined) {
                          filterItems[nodeName] = formData[nodeName];
                        } else {
                          filterItems[nodeName] = '';
                        }
                      }
                    }
                    if('childTables' in formData)
                    {
                      formData.childTables.map((eachTable:any)=>{
                        filterItems[eachTable]=formData[eachTable]
                      })
                      return filterItems;
                    }else
                      return filterItems;
                  }
                }
              }
              await this.commonService.errorLog(
                'Technical',
                'AK',
                'Fatal',
                'TG047',
                'ifo not found',
                key,
                token,
              );
            }
          } else {
            await this.commonService.errorLog(
              'Technical',
              'AK',
              'Fatal',
              'TG048',
              'key is not a valid key in POdata',
              key,
              token,
            );
          }
        } else {
          await this.commonService.errorLog(
            'Technical',
            'AK',
            'Fatal',
            'TG049',
            'key is not a valid key',
            key,
            token,
          );
        }
      } catch (error) {
        await this.commonService.errorLog(
          'Technical',
          'AK',
          'Fatal',
          'TG050',
          `Error in ifo:${error.message}`,
          key,
          token,
        );
      }
    }
  }

  async fetchActionDetails(
    key: string,
    groupId: string,
    controlName: string,
    token: string,
  ) {
    try {
      const uoKey: any = await this.commonService.readAPI(
        key + ':UO',
        process.env.CLIENTCODE,
        token,
      );
      let UO: any = uoKey;

      // return UO;
      if (UO) {
        let mappedData: any = UO.mappedData.artifact.node;
        if (mappedData) {
          for (let i = 0; i < mappedData.length; i++) {
            if (groupId === mappedData[i].nodeId) {
              let lockMode = mappedData[i].action.lock;
              let paginationMode = mappedData[i].action.pagination;
              return {
                lockDetails: lockMode,
                paginationDetails: paginationMode,
              };
            }
          }
        } else {
          throw 'The process flow is not connected to the screen';
        }
      } else {
        throw 'The process flow is not connected to the screen';
      }
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async fetchRuleDetails(
    key: string,
    groupId: string,
    controlId: string,
    token: string,
  ) {
    try {
      const uoKey: any = await this.commonService.readAPI(
        key + ':UO',
        process.env.CLIENTCODE,
        token,
      );
      let UO: any = uoKey;

      // return UO;
      if (UO) {
        let mappedData: any = UO.mappedData.artifact.node;
        if (mappedData) {
          for (let i = 0; i < mappedData.length; i++) {
            if (groupId === mappedData[i].nodeId) {
              let rule = Object.keys(mappedData[i].rule);
              if (rule.length > 0) {
                return mappedData[i].rule;
              } else {
                return 'Rule is empty';
              }
            }
          }
        } else {
          throw 'The process flow is not connected to the screen';
        }
      } else {
        throw 'The process flow is not connected to the screen';
      }
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async InitiatePF(key: string, sourceId: string, token: string) {
    try {
      if (key !== '') {
        let spiltedkey: string = key.split('|')[0];
        let findingkey: string = key.split('|')[1];

        const NDSdataKey: any = await this.commonService.readAPI(
          spiltedkey + ':NDS',
          process.env.CLIENTCODE,
          token,
        );
        const NDSdata = NDSdataKey;
        const POdataKey: any = await this.commonService.readAPI(
          spiltedkey + ':PO',
          process.env.CLIENTCODE,
          token,
        );
        const POdata = POdataKey;

        let nodeProperty: any = {
          key: spiltedkey,
        };
        if (NDSdata && NDSdata.length) {
          NDSdata.map((nodes) => {
            if (nodes.id === findingkey) {
              nodeProperty = { ...nodeProperty, ...nodes.data.nodeProperty };
            }
          });
          if (Object.keys(nodeProperty).length === 0) {
            await this.commonService.errorLog(
              'Technical',
              'AK',
              'Fatal',
              'TG051',
              'node property not found',
              key,
              token,
            );
          } else {
            delete nodeProperty.data;
            nodeProperty.key = nodeProperty.key + ':';
          }
        } else {
          await this.commonService.errorLog(
            'Technical',
            'AK',
            'Fatal',
            'TG052',
            'node property not found',
            key,
            token,
          );
        }
        let eventProperty: any = {};
        if (POdata) {
          if (POdata?.mappedData?.artifact?.node.length) {
            POdata?.mappedData?.artifact?.node.map((nodes) => {
              if (nodes.nodeId === findingkey && nodes.events.length > 0) {
                for (let i = 0; i < nodes.events.length; i++) {
                  if (
                    nodes.events[i].sourceId.replace(/\//g, '|') === sourceId
                  ) {
                    eventProperty['source'] = nodes.events[i].source;
                    eventProperty['success'] = nodes.events[i].success;
                    eventProperty['failure'] = nodes.events[i].failure;
                    eventProperty['suspicious'] = nodes.events[i].suspicious;
                    eventProperty['error'] = nodes.events[i].error;
                    eventProperty['sourceId'] = nodes.events[i].sourceId;
                  }
                }
              }
            });
            if (Object.keys(eventProperty).length === 0) {
              await this.commonService.errorLog(
                'Technical',
                'AK',
                'Fatal',
                'TG053',
                'event property not found',
                key,
                token,
              );
            }
          } else {
            await this.commonService.errorLog(
              'Technical',
              'AK',
              'Fatal',
              'TG054',
              'event property not found',
              key,
              token,
            );
          }
        } else {
          await this.commonService.errorLog(
            'Technical',
            'AK',
            'Fatal',
            'TG055',
            'event property not found',
            key,
            token,
          );
        }

        return { nodeProperty, eventProperty };
      } else {
        await this.commonService.errorLog(
          'Technical',
          'AK',
          'Fatal',
          'TG056',
          'key not found',
          key,
          token,
        );
      }
    } catch (error) {
      await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'TG057',
        `Error in InitiatePF:${error.message}`,
        key,
        token,
      );
    }
  }

  async getPFDetails(
    isTable: Boolean,
    key: string,
    groupId: string,
    controlId: string,
    token: string,
  ) {
    try {
      let eventProperty: any;
      let eventDetails: any;
      let eventDetailsArray: any;
      const uoKey: any = await this.commonService.readAPI(
        key + ':UO',
        process.env.CLIENTCODE,
        token,
      );
      let UO: any = uoKey;

      // return UO;
      if (UO) {
        let mappedData: any = UO.mappedData.artifact.node;
        if (mappedData) {
          for (let i = 0; i < mappedData.length; i++) {
            if (groupId === mappedData[i].nodeId) {
              if (isTable) {
                if (Object.keys(mappedData[i].events).length > 0) {
                  eventProperty = mappedData[i].events.eventSummary;

                  eventDetails =
                    await this.commonService.eventFunction(eventProperty);
                  eventDetailsArray = eventDetails[0];

                  for (let k = 0; k < eventDetailsArray.length; k++) {
                    if (
                      eventDetailsArray[k].type === 'handlerNode' &&
                      eventDetailsArray[k].name === 'saveHandler'
                    ) {
                      if (
                        eventDetailsArray[k].targetKey &&
                        eventDetailsArray[k].targetKey.length > 0 &&
                        eventDetailsArray[k].url
                      ) {
                        return {
                          key: eventDetailsArray[k].targetKey[0],
                          url: eventDetailsArray[k].url,
                          primaryKey: eventDetailsArray[k].primaryKey,
                        };
                      } else if (!eventDetailsArray[k].targetKey) {
                        return {
                          url: eventDetailsArray[k].url,
                          primaryKey: eventDetailsArray[k].primaryKey,
                        };
                      }
                    } else if (
                      eventDetailsArray[k].type === 'handlerNode' &&
                      eventDetailsArray[k].name === 'updateHandler'
                    ) {
                      if (
                        eventDetailsArray[k].targetKey &&
                        eventDetailsArray[k].targetKey.length > 0
                      ) {
                        return {
                          key: eventDetailsArray[k].targetKey[0],
                          primaryKey: eventDetailsArray[k].primaryKey,
                          tableName: eventDetailsArray[k]?.tableName,
                          status: eventDetailsArray[k]?.status,
                        };
                      } else if (!eventDetailsArray[k].targetKey) {
                        return {
                          primaryKey: eventDetailsArray[k].primaryKey,
                          tableName: eventDetailsArray[k]?.tableName,
                          status: eventDetailsArray[k]?.status,
                        };
                      }
                    }
                  }
                } else {
                  throw 'events are empty';
                }
              } else {
                for (let j = 0; j < mappedData[i].objElements.length; j++) {
                  if (controlId === mappedData[i].objElements[j].elementId) {
                    if (
                      Object.keys(mappedData[i].objElements[j].events).length >
                      0
                    ) {
                      eventProperty =
                        mappedData[i].objElements[j].events.eventSummary;

                      eventDetails =
                        await this.commonService.eventFunction(eventProperty);
                      eventDetailsArray = eventDetails[0];

                      for (let k = 0; k < eventDetailsArray.length; k++) {
                        if (
                          eventDetailsArray[k].type === 'handlerNode' &&
                          eventDetailsArray[k].name === 'saveHandler'
                        ) {
                          if (
                            eventDetailsArray[k].targetKey &&
                            eventDetailsArray[k].targetKey.length > 0 &&
                            eventDetailsArray[k].url
                          ) {
                            return {
                              key: eventDetailsArray[k].targetKey[0],
                              url: eventDetailsArray[k].url,
                              primaryKey: eventDetailsArray[k].primaryKey,
                            };
                          } else if (!eventDetailsArray[k].targetKey) {
                            return {
                              url: eventDetailsArray[k].url,
                              primaryKey: eventDetailsArray[k].primaryKey,
                            };
                          }
                        } else if (
                          eventDetailsArray[k].type === 'handlerNode' &&
                          eventDetailsArray[k].name !== 'saveHandler'
                        ) {
                          if (
                            eventDetailsArray[k].targetKey &&
                            eventDetailsArray[k].targetKey.length > 0
                          ) {
                            return {
                              key: eventDetailsArray[k].targetKey[0],
                              primaryKey: eventDetailsArray[k].primaryKey,
                              tableName: eventDetailsArray[k]?.tableName,
                              status: eventDetailsArray[k]?.status,
                            };
                          } else if (!eventDetailsArray[k].targetKey) {
                            return {
                              primaryKey: eventDetailsArray[k].primaryKey,
                              tableName: eventDetailsArray[k]?.tableName,
                              status: eventDetailsArray[k]?.status,
                            };
                          }
                        }
                      }
                    } else {
                      throw 'events are empty or control does not match';
                    }
                  }
                }
              }
            }
          }
        } else {
          throw 'mapperData not found';
        }
      } else {
        throw 'Uo not found';
      }
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async getDfkey(ufKey: any, groupid?: string, token?: string) {
    try {
      let sourceData: any[];
      const source: string = 'redis';
      const target: string = 'redis';
      let DFkeys: string[] = [];

      const mapperPropertiesKey: any = await this.commonService.readAPI(
        ufKey + ':UO',
        process.env.CLIENTCODE,
        token,
      );
      const mapperProperties: any = mapperPropertiesKey;
      if (mapperProperties) {
        if (groupid) {
          sourceData = mapperProperties.mappedData.artifact.node;
          if (sourceData) {
            for (let i = 0; i < sourceData.length; i++) {
              if (groupid === sourceData[i].nodeId) {
                let dfKey: string;
                for (
                  let node = 0;
                  node < sourceData[i].objElements.length;
                  node++
                ) {
                  if (sourceData[i].objElements[node].mapper.length > 0) {
                    dfKey =
                      sourceData[i].objElements[
                        node
                      ].mapper[0].sourceKey[0].split('|')[0];
                    dfKey = dfKey + ':';
                    return dfKey;
                  }
                }
              }
            }
          } else {
            await this.commonService.errorLog(
              'Technical',
              'AK',
              'Fatal',
              'TG058',
              'sourceData not found',
              ufKey,
              token,
            );
          }
        } else {
          sourceData = mapperProperties.source;
          if (sourceData) {
            for (let i = 0; i < sourceData.length; i++) {
              let dfKey: string = sourceData[i].dfdKey;

              dfKey = dfKey + ':';
              DFkeys.push(dfKey);
            }
            return DFkeys;
          } else {
            await this.commonService.errorLog(
              'Technical',
              'AK',
              'Fatal',
              'TG059',
              'sourceData not found',
              ufKey,
              token,
            );
          }
        }
      } else {
        await this.commonService.errorLog(
          'Technical',
          'AK',
          'Fatal',
          'TG060',
          'mapperProperties not found',
          ufKey,
          token,
        );
      }
    } catch (error: any) {
      await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'TG061',
        `Error in getDfkey:${error.message}`,
        ufKey,
        token,
      );
    }
  }

  /* async zenrule(rule: any, data: any) {
            try {
              var goruleEngine: RuleService = new RuleService();
              let goruleres = await goruleEngine.goRule(data, rule);
              return goruleres;
            } catch (error) {
              // throw error;
              return {
                error: 'cant make rule',
              };
            }
          }*/

  async paginationDataFilter(
    ufKey: any,
    data: any,
    token: string,
    dfdType: string,
    primaryKey: string
  ) {
    try {
      const source: string = 'redis';
      const target: string = 'redis';
      const mapperPropertiesKey: any = await this.commonService.readAPI(
        ufKey + ':UO',
        process.env.CLIENTCODE,
        token,
      );
      const mapperProperties: any = mapperPropertiesKey;
      if (mapperProperties) {
        if (data == undefined || data.length == 0)
          await this.commonService.errorLog(
            'Technical',
            'AK',
            'Fatal',
            'TG062',
            'Record not found',
            ufKey,
            token,
          );
        if (mapperProperties.mappedData) {
          let mapperSourceData: any = {};
          let mapperData: any = [];
          let objectfn: any = [];
          let rule: any = [];

          let mapperSourceDataKeys: any = [];
          mapperSourceDataKeys.push(...Object.keys(mapperSourceData));

          mapperData = [...mapperProperties.mappedData.artifact.mapper];
          // return mapperData
          if (mapperProperties.mappedData.artifact.code != '')
            objectfn = [
              ...objectfn,
              {
                name: mapperProperties.mappedData.artifact.name.toLowerCase(),
                code: mapperProperties.mappedData.artifact.code,
              },
            ];
          // return objectfn
          if (
            Object.keys(mapperProperties.mappedData.artifact.rule).length > 0
          ) {
            rule.push(mapperProperties.mappedData.artifact.rule);
          }

          let IdAndName: any = [];

          mapperProperties.mappedData.artifact.node.forEach((element: any) => {
            // if (element.nodeName === groupName) {
            mapperData = [...mapperData, ...element.mapper];
            if (element.code != '')
              objectfn = [
                ...objectfn,
                { name: element.nodeName.toLowerCase(), code: element.code },
              ];
            if (Object.keys(element.rule).length > 0) {
              rule.push(element.rule);
            }

            element.objElements.forEach((element: any) => {
              IdAndName.push({
                id: element.elementId,
                name: element.elementName,
              });
              mapperData = [...mapperData, ...element.mapper];
              if (element.code != '')
                objectfn = [
                  ...objectfn,
                  {
                    name: element.elementName.toLowerCase(),
                    code: element.code,
                  },
                ];
              if (Object.keys(element.rule).length > 0) {
                rule.push(element.rule);
              }
            });
            // }
          });
          // return rule;
          // return mapperData;
          //----------------------------mapper Start-------------------------
          let targetKeys: any = [];
          let redisKey: any;
          let nodeName: any;
          let value: any;
          for (let i = 0; i < mapperData.length; i++) {
            let temp: string = '';
            if (dfdType == 'apinode') {
              temp = mapperData[i].sourceKey[0].split('.').at(-1);
            } else {
              temp = mapperData[i].sourceKey[0].split('|').at(-1);
            }
            if (temp.includes('.')) {
              temp = temp?.split('.')?.at(-1);
            }
            targetKeys.push({
              targetKey:
                mapperData[i].targetKey.split('|')[
                  mapperData[i].targetKey.split('|').length - 1
                ],
              columnKey: temp,
            });
            nodeName = mapperData[i].sourceKey[0].split('.').at(-1);
          }

          targetKeys.push({
            targetKey: primaryKey,
            columnKey: primaryKey,
          });
          targetKeys.push({ targetKey: 'trs_status', columnKey: 'trs_status' });
          targetKeys.push({
            targetKey: 'trs_process_id',
            columnKey: 'trs_process_id',
          });
          targetKeys.push({
            targetKey: 'trs_access_profile',
            columnKey: 'trs_access_profile',
          });
          targetKeys.push({
            targetKey: 'trs_org_grp_code',
            columnKey: 'trs_org_grp_code',
          });
          targetKeys.push({
            targetKey: 'trs_org_code',
            columnKey: 'trs_org_code',
          });
          targetKeys.push({
            targetKey: 'trs_role_grp_code',
            columnKey: 'trs_role_grp_code',
          });
          targetKeys.push({
            targetKey: 'trs_role_code',
            columnKey: 'trs_role_code',
          });
          targetKeys.push({
            targetKey: 'trs_ps_grp_code',
            columnKey: 'trs_ps_grp_code',
          });
          targetKeys.push({
            targetKey: 'trs_ps_code',
            columnKey: 'trs_ps_code',
          });
          targetKeys.push({
            targetKey: 'trs_app_code',
            columnKey: 'trs_app_code',
          });
          targetKeys.push({
            targetKey: 'trs_locked_by',
            columnKey: 'trs_locked_by',
          });
          targetKeys.push({
            targetKey: 'trs_locked_time',
            columnKey: 'trs_locked_time',
          });
          targetKeys.push({
            targetKey: 'trs_process_status',
            columnKey: 'trs_process_status',
          });
          targetKeys.push({
            targetKey: 'trs_process_status_desc',
            columnKey: 'trs_process_status_desc',
          });
          targetKeys.push({
            targetKey: 'trs_status_desc',
            columnKey: 'trs_status_desc',
          });
          targetKeys.push({
            targetKey: 'trs_process_code',
            columnKey: 'trs_process_code',
          });
          targetKeys.push({
            targetKey: 'trs_previous_process_code',
            columnKey: 'trs_previous_process_code',
          });
          targetKeys.push({
            targetKey: 'trs_next_process_code',
            columnKey: 'trs_next_process_code',
          });

          //  value = await this.commonService.readAPI(
          // redisKey + ':DS_Object',
          //  process.env.CLIENTCODE,
          //  token
          //  );
          // value = JSON.parse(await this.readKeys(value))
          let temp = {};
          for (let i = 0; i < targetKeys.length; i++) {
            for (let j = 0; j < IdAndName.length; j++) {
              if (IdAndName[j].id == targetKeys[i].targetKey)
                targetKeys[i].targetKey = IdAndName[j].name;
            }
          }

          // return targetKeys;
          var newData: any = [];
          if (data) {
            data.map((ele) => {
              Object.keys(ele).map((key) => {
                const keyName = key;
                for (let i = 0; i < targetKeys.length; i++) {
                  if (targetKeys[i].targetKey.toLowerCase() === keyName) {
                    temp = {
                      ...temp,
                      [targetKeys[i].targetKey.toLowerCase()]:
                        ele[targetKeys[i].columnKey?.toLowerCase()],
                    };
                  }
                }
              });
              newData.push(temp);
              temp = {};
            });
          }
          return newData;
          // return objectfn;
          //----------------------------mapper End-------------------------
          //------------------------------function start--------------------------------------------
          if (objectfn.length > 0) {
            for (let l = 0; l < objectfn.length; l++) {
              if (objectfn[l].name != '' && objectfn[l].code != '') {
                for (let i = 0; i < newData.length; i++) {
                  const transformFunction = new Function(
                    'v',
                    `return ${objectfn[l].code};`,
                  )(v);

                  let result = v.safeParse(
                    transformFunction,
                    newData[i][objectfn[l].name],
                  );
                  if (result.success) {
                    newData[i] = {
                      ...newData[i],
                      [objectfn[l].name]: result.output,
                    };
                  }
                }
              }
            }
          }

          //------------------------------function end--------------------------------------------

          return newData;
          //------------------------------------go-rule start------------------------------------

          /*if (rule.length > 0) {
                    let finalData = [];
                    for (let i = 0; i < rule.length; i++) {
                      if (rule[i]?.nodes.length && rule[i]?.edges.length) {
                        if (i == 0) {
                          for (let j = 0; j < newData.length; j++) {
                            let result: any = await this.zenrule(newData[j], rule[i]);
                            if (result?.error) {
                              break;
                            } else if (result?.result?.output === true) {
                              finalData.push(newData[j]);
                            }
                          }
                        } else {
                          let temp = finalData;
                          finalData = [];
                          for (let j = 0; j < temp.length; j++) {
                            let result: any = await this.zenrule(temp[j], rule[i]);
                            if (result?.error) {
                              break;
                            } else if (result.result.output === true) {
                              finalData.push(temp[j]);
                            }
                          }
                        }
                      }
                    }
                    return finalData;
                  } else */
          return newData;

          //---------------------------------------go-rule end------------------------------------
        }
      } else {
        await this.commonService.errorLog(
          'Technical',
          'AK',
          'Fatal',
          'TG063',
          'mapper data not found',
          ufKey,
          token,
        );
      }
    } catch (error) {
      await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'TG064',
        `Error in paginationDataFilter:${error.message}`,
        ufKey,
        token,
      );
    }
  }

  /* async dataOrchestrator(sessionInfo: any, ufKey: any, groupName: any) {
            const source: string = 'redis';
            const target: string = 'redis';
            const mapperProperties: any = await this.commonService.readAPI(
              ufKey + ':UO',
              process.env.CLIENTCODE,
              token
            );
            if (mapperProperties.mappedData) {
              let mapperSourceData: any = {};
        
              let mapperData: any = [];
              let data: any = [];
              let filterData: any;
              let objectfn: any = [];
              let rule: any = [];
        
              let mapperSourceDataKeys: any = [];
              mapperSourceDataKeys.push(...Object.keys(mapperSourceData));
        
              mapperData = [...mapperProperties.mappedData.artifact.mapper];
              if (mapperProperties.mappedData.artifact.code != '')
                objectfn = [
                  ...objectfn,
                  {
                    name: mapperProperties.mappedData.artifact.name.toLowerCase(),
                    code: mapperProperties.mappedData.artifact.code,
                  },
                ];
              if (Object.keys(mapperProperties.mappedData.artifact.rule).length > 0) {
                rule.push(mapperProperties.mappedData.artifact.rule);
              }
        
              mapperProperties.mappedData.artifact.node.forEach((element: any) => {
                // if (element.nodeName === groupName) {
                mapperData = [...mapperData, ...element.mapper];
                if (element.code != '')
                  objectfn = [
                    ...objectfn,
                    { name: element.nodeName.toLowerCase(), code: element.code },
                  ];
                if (Object.keys(element.rule).length > 0) {
                  rule.push(element.rule);
                }
        
                element.objElements.forEach((element: any) => {
                  mapperData = [...mapperData, ...element.mapper];
                  if (element.code != '')
                    objectfn = [
                      ...objectfn,
                      { name: element.elementName.toLowerCase(), code: element.code },
                    ];
                  if (Object.keys(element.rule).length > 0) {
                    rule.push(element.rule);
                  }
                });
                // }
              });
              // return rule;
              // return mapperData;
              //----------------------------mapper Start-------------------------
              let targetKeys: any = [];
              let redisKey: any;
              let nodeName: any;
              let value: any;
              for (let i = 0; i < mapperData.length; i++) {
                targetKeys.push({
                  targetKey:
                    mapperData[i].targetKey.split(':')[
                      mapperData[i].targetKey.split(':').length - 1
                    ],
                  columnKey: mapperData[i].sourceKey[0].split('.')[2],
                });
        
                redisKey = mapperData[i].sourceKey[0].split('.')[0];
                nodeName = mapperData[i].sourceKey[0].split('.')[1];
              }
        
              targetKeys.push({targetKey: 'trs_next_status',columnKey: 'trs_next_status'});
              targetKeys.push({ targetKey: 'trs_status', columnKey: 'trs_status' });
              targetKeys.push({ targetKey: 'trs_process_id', columnKey: 'trs_process_id' });
              targetKeys.push({ targetKey: 'trs_access_profile', columnKey: 'trs_access_profile' });
              targetKeys.push({ targetKey: 'trs_org_grp_code', columnKey: 'trs_org_grp_code' });
              targetKeys.push({ targetKey: 'trs_org_code', columnKey: 'trs_org_code' });
              targetKeys.push({ targetKey: 'trs_role_grp_code', columnKey: 'trs_role_grp_code' });
              targetKeys.push({ targetKey: 'trs_role_code', columnKey: 'trs_role_code' });
              targetKeys.push({ targetKey: 'trs_ps_grp_code', columnKey: 'trs_ps_grp_code' });
              targetKeys.push({ targetKey: 'trs_ps_code', columnKey: 'trs_ps_code' });
              value = await this.commonService.readAPI(
                redisKey + ':DS_Object',
                process.env.CLIENTCODE,
                token   
              );
              let temp = {};
              if (value) {
                value.map((DS_Object) => {
                  if (DS_Object.nodeName == nodeName) {
                    DS_Object.data.map((ele) => {
                      Object.keys(ele).map((key) => {
                        const keyName = key;
                        for (let i = 0; i < targetKeys.length; i++) {
                          if (targetKeys[i].targetKey.toLowerCase() === keyName) {
                            temp = {
                              ...temp,
                              [targetKeys[i].targetKey.toLowerCase()]:
                                ele[targetKeys[i].columnKey],
                            };
                          }
                        }
                      });
                      data.push(temp);
                    });
                  }
                });
              }
              // return data;
              // return objectfn;
              //----------------------------mapper End-------------------------
              //------------------------------function start--------------------------------------------
              if (objectfn.length > 0) {
                for (let l = 0; l < objectfn.length; l++) {
                  if (objectfn[l].name != '' && objectfn[l].code != '') {
                    for (let i = 0; i < data.length; i++) {
                      const transformFunction = new Function(
                        'v',
                        `return ${objectfn[l].code};`,
                      )(v);
        
                      let result = v.safeParse(
                        transformFunction,
                        data[i][objectfn[l].name],
                      );
                      if (result.success) {
                        data[i] = { ...data[i], [objectfn[l].name]: result.output };
                      }
                    }
                  }
                }
              }
        
              //------------------------------function end--------------------------------------------
              
              // return data
              //------------------------------------go-rule start------------------------------------
        
              if (rule.length > 0) {
                let finalData = [];
                for (let i = 0; i < rule.length; i++) {
                  if (rule[i]?.nodes.length && rule[i]?.edges.length) {
                    if (i == 0) {
                      for (let j = 0; j < data.length; j++) {
                        let result: any = await this.zenrule(data[j], rule[i]);
                        if (result?.error) {
                          break;
                        } else if (result?.result?.output === true) {
                          finalData.push(data[j]);
                        }
                      }
                    } else {
                      let temp = finalData;
                      finalData = [];
                      for (let j = 0; j < temp.length; j++) {
                        let result: any = await this.zenrule(temp[j], rule[i]);
                        if (result?.error) {
                          break;
                        } else if (result.result.output === true) {
                          finalData.push(temp[j]);
                        }
                      }
                    }
                  }
                }
                return finalData;
              } else return data;
        
              //---------------------------------------go-rule end------------------------------------
            }
          }*/

  async setSaveHandlerData(key, value, path) {
    try {
      let temp = structuredClone(value);
      let obj = {};
      if (Array.isArray(temp) || typeof temp === 'string') {
        obj = value;
      } else {
        Object.keys(temp).forEach((item) => {
          if (
            temp[item] !== '' &&
            temp[item] !== undefined &&
            temp[item] !== null
          ) {
            obj[item] = temp[item];
          }
        });
      }
      value = JSON.stringify(obj);
      await this.redisService.setJsonData(
        key,
        value,
        process.env.CLIENTCODE,
        path,
      );
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async uploadHandlerData(key) {
    try {
      const flag: any = await this.redisService.getJsonData(
        key,
        process.env.CLIENTCODE,
      ); //await this.commonService.readAPI(key,process.env.CLIENTCODE,token);
      let value: any = {
        params: {
          request: {},
          response: {},
          exception: {},
          urls: {
            apiUrl: 'http://192.168.2.94:3010/expensedetails',
          },
          filters: [{}],
          filterConditions: [{}],
          defaults: {
            created_date: '2024-05-23T12:30:00Z',
            created_by: 'Maker',
            modified_date: '2024-05-23T12:30:00Z',
            modified_by: 'Maker',
          },
        },
        stt: {
          eligibleStatus: 'formValidated',
          eligibleProcessStatus: 'verified',
          finalStatus: 'Created',
          finalProcessStatus: 'TransactionInitiated',
        },
      };
      if (!flag) {
        value = JSON.stringify(value);
        await this.redisService.setJsonData(key, value, process.env.CLIENTCODE);
      }
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async SFCheckScreen(
    ufKey: string,
    token: string,
    nodeId?: string,
    isTable?: boolean,
  ) {
    try {
      const screenName: string = ufKey.split(':')[11];
      const source: string = 'redis';
      const target: string = 'redis';
      const decodedToken: any = await this.jwtService.decodeToken(token);
      const DOKey: any = await this.commonService.readAPI(
        ufKey + ':UO',
        process.env.CLIENTCODE,
        token,
      );
      const DO: any = DOKey;

      if (DO) {
        const securityData: any = DO.securityData;
        const templateArray: any[] = securityData.accessProfile;
        // decodedToken.template = 'T1';

        // const ufKeyArray = ufKey.split(':');
        // ufKeyArray[3] = ufKeyArray[3].replace('AFC', 'AF');
        // ufKey = ufKeyArray.join(':');

        if (ufKey === securityData.afk) {
          if (!nodeId) {
            for (let i = 0; i < templateArray.length; i++) {
              if (
                decodedToken.accessProfile.includes(
                  templateArray[i].accessProfile,
                ) &&
                screenName === templateArray[i].security.artifact.resource
              ) {
                return {
                  result:
                    templateArray[i].security.artifact.SIFlag.selectedValue,
                };
              }
            }
          } else {
            for (let i = 0; i < templateArray.length; i++) {
              for (
                let j = 0;
                j < templateArray[i].security.artifact.node.length;
                j++
              ) {
                if (
                  decodedToken.accessProfile.includes(
                    templateArray[i].accessProfile,
                  ) &&
                  nodeId ===
                    templateArray[i].security.artifact.node[j].resourceId
                ) {
                  let selectedValues: any = [];
                  let controlNames: any = [];
                  for (
                    let l = 0;
                    l < templateArray[i].security.artifact.node.length;
                    l++
                  ) {
                    selectedValues.push(
                      templateArray[i].security.artifact.node[l].SIFlag
                        .selectedValue,
                    );
                  }
                  if (
                    selectedValues.includes('ATO') &&
                    templateArray[i].security.artifact.node[j].SIFlag
                      .selectedValue === 'ATO'
                  ) {
                    if (isTable === true) {
                      for (let i = 0; i < templateArray.length; i++) {
                        if (
                          screenName ===
                          templateArray[i].security.artifact.resource
                        ) {
                          let componentNameArray: string[] = [];
                          for (
                            let j = 0;
                            j < templateArray[i].security.artifact.node.length;
                            j++
                          ) {
                            if (
                              nodeId ===
                              templateArray[i].security.artifact.node[j]
                                .resourceId
                            ) {
                              componentNameArray.push(
                                templateArray[i].security.artifact.node[
                                  j
                                ].resource.toLowerCase(),
                              );
                            }
                          }
                          return componentNameArray;
                        }
                      }
                    } else {
                      for (
                        let k = 0;
                        k <
                        templateArray[i].security.artifact.node[j].objElements
                          .length;
                        k++
                      ) {
                        if (
                          templateArray[i].security.artifact.node[j]
                            .objElements[k].SIFlag.selectedValue !== 'BTO'
                        ) {
                          controlNames.push(
                            templateArray[i].security.artifact.node[j]
                              .objElements[k].resource,
                          );
                        }
                      }
                      controlNames = controlNames.map((item) =>
                        item.toLowerCase(),
                      );
                      return controlNames;
                    }
                  }
                  if (selectedValues.includes('ATO')) {
                    break;
                  }
                  if (
                    templateArray[i].security.artifact.node[j].SIFlag
                      .selectedValue === 'AA'
                  ) {
                    if (isTable === true) {
                      let componentNameArray: string[] = [];
                      for (let i = 0; i < templateArray.length; i++) {
                        if (
                          screenName ===
                          templateArray[i].security.artifact.resource
                        ) {
                          let componentNameArray: string[] = [];
                          for (
                            let j = 0;
                            j < templateArray[i].security.artifact.node.length;
                            j++
                          ) {
                            if (
                              nodeId ===
                              templateArray[i].security.artifact.node[j]
                                .resourceId
                            ) {
                              componentNameArray.push(
                                templateArray[i].security.artifact.node[
                                  j
                                ].resource.toLowerCase(),
                              );
                            }
                          }
                          for (
                            let k = 0;
                            k <
                            templateArray[i].security.artifact.node[j]
                              .objElements.length;
                            k++
                          ) {
                            if (
                              templateArray[i].security.artifact.node[j]
                                .objElements[k].SIFlag.selectedValue !== 'BTO'
                            ) {
                              controlNames.push(
                                templateArray[i].security.artifact.node[j]
                                  .objElements[k].resource,
                              );
                            }
                          }
                          controlNames = controlNames.map((item) =>
                            item.toLowerCase(),
                          );
                          componentNameArray =
                            componentNameArray.concat(controlNames);
                          return componentNameArray;
                        }
                      }
                      for (
                        let k = 0;
                        k <
                        templateArray[i].security.artifact.node[j].objElements
                          .length;
                        k++
                      ) {
                        if (
                          templateArray[i].security.artifact.node[j]
                            .objElements[k].SIFlag.selectedValue !== 'BTO'
                        ) {
                          controlNames.push(
                            templateArray[i].security.artifact.node[j]
                              .objElements[k].resource,
                          );
                        }
                      }
                      controlNames = controlNames.map((item) =>
                        item.toLowerCase(),
                      );
                      componentNameArray =
                        componentNameArray.concat(controlNames);
                      return componentNameArray;
                    } else {
                      for (
                        let k = 0;
                        k <
                        templateArray[i].security.artifact.node[j].objElements
                          .length;
                        k++
                      ) {
                        if (
                          templateArray[i].security.artifact.node[j]
                            .objElements[k].SIFlag.selectedValue !== 'BTO'
                        ) {
                          controlNames.push(
                            templateArray[i].security.artifact.node[j]
                              .objElements[k].resource,
                          );
                        }
                      }
                      controlNames = controlNames.map((item) =>
                        item.toLowerCase(),
                      );
                      return controlNames;
                    }
                  } else if (
                    templateArray[i].security.artifact.node[j].SIFlag
                      .selectedValue === 'BTO'
                  ) {
                    controlNames = controlNames.map((item) =>
                      item.toLowerCase(),
                    );
                    return controlNames;
                  }
                }
              }
            }
          }
        } else {
          throw 'security afk not found';
        }
      } else {
        throw 'UO data not found';
      }
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async logout(headers: any, tokens: string, key: string) {
    try {
      const { authorization } = headers;
      if (!authorization || typeof authorization !== 'string') {
        await this.commonService.errorLog(
          'Technical',
          'AK',
          'Fatal',
          'TG065',
          'Token not found',
          key,
          tokens,
        );
      }
      const token = authorization.split(' ')[1];
      if (!token) {
        await this.commonService.errorLog(
          'Technical',
          'AK',
          'Fatal',
          'TG066',
          'Token not found',
          key,
          tokens,
        );
      }

      const payload: any = await this.jwt.decode(token);
      if (!payload || !payload.client || !payload.type) {
        await this.commonService.errorLog(
          'Technical',
          'AK',
          'Fatal',
          'TG067',
          'Invalid access token',
          key,
          tokens,
        );
      }
      const sessionListCacheKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:session`;
      const sessionListCache = await this.redisService.getJsonData(
        sessionListCacheKey,
        process.env.CLIENTCODE,
      );
      const sessionList = sessionListCache && JSON.parse(sessionListCache) ? JSON.parse(sessionListCache) : [];
      if (
        !sessionList ||
        !Array.isArray(sessionList) ||
        !sessionList.length
      ) {
        await this.commonService.errorLog(
          'Technical',
          'AK',
          'Fatal',
          'TG068',
          'Invalid access token',
          key,
          tokens,
        );
      }

      const updatedSessionList = await this.checkSession(sessionList);
      if (updatedSessionList?.find((item: any) => item?.sid == payload.sid)) {
        await this.redisService.setJsonData(
          sessionListCacheKey,
          JSON.stringify(
            updatedSessionList.filter((s: any) => s?.sid !== payload.sid),
          ),
          process.env.CLIENTCODE,
        );
      } else {
        await this.redisService.setJsonData(
          sessionListCacheKey,
          JSON.stringify(updatedSessionList),
          process.env.CLIENTCODE,
        );
      }
      return 'logout successfully';
    } catch (error) {
      await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'TG069',
        `Error in logout:${error.message}`,
        key,
        tokens,
      );
    }
  }

   async getAccessToken(
    token: string,
    selectedCombination: any,
    selectedAccessProfile: string,
    dap: string | undefined,
    ufClientType: string
  ) {
    try {
      const config = this.getConfig()
      const auth_secret = config.authSecret
      const accessTokenExpiryTime = config.authAccessTokenExpiryTime 

      const accessProfileCacheKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:securityTemplate`;
      const accessProfileCache = await this.redisService.getJsonData(
        accessProfileCacheKey,
        process.env.CLIENTCODE,
      );
      const accessProfileList = accessProfileCache
        ? JSON.parse(accessProfileCache)
        : [];
      const filteredAccessprofile = accessProfileList.find(
        (t: any) => t?.accessProfile === selectedAccessProfile,
      );
      const filteredCombination: any = this.transformToCombinations([
        filteredAccessprofile,
      ]);
      const accessObj = {
        ...filteredCombination[0]?.combinations?.find((c) => {
          return (
            c?.orgGrpCode === selectedCombination?.orgGrpCode &&
            c?.orgCode === selectedCombination?.orgCode &&
            c?.psGrpCode === selectedCombination?.psGrpCode &&
            c?.psCode === selectedCombination?.psCode &&
            c?.roleGrpCode === selectedCombination?.roleGrpCode &&
            c?.roleCode === selectedCombination?.roleCode &&
            c?.subOrgGrpCode === selectedCombination?.subOrgGrpCode &&
            c?.subOrgCode === selectedCombination?.subOrgCode
          );
        }),
        selectedAccessProfile: filteredCombination[0]?.accessProfile,
        dap: filteredCombination[0]?.dap,
      };
      const payload = await this.jwt.decode(token);
      const { type, client, loginId, isAppAdmin, userUniqueId, sid, userCode } = payload;
      const sessionListCacheKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${client}:AFGK:${ag}:AFK:${app}:AFVK:v1:session`;

      const updatedToken = await this.jwt.signAsync(
        {
          type,
          client,
          loginId,
          isAppAdmin,
          ag,
          app,
          selectedAccessProfile,
          dap,
          userCode,
          ...accessObj,
          userUniqueId,
          sid,
        },
        {
          secret: auth_secret,
          expiresIn: accessTokenExpiryTime as any,
        },
      );

      const sessionListResponse = await this.redisService.getJsonData(
        sessionListCacheKey,
        process.env.CLIENTCODE,
      );
      let updatedSessionList = [];
      if (sessionListResponse) {
        const sessionList = JSON.parse(sessionListResponse);
        updatedSessionList = await this.checkSession(sessionList);
        const previousActiveSession = updatedSessionList.find(
          (session: any) => session?.sid === sid,
        );
       updatedSessionList = updatedSessionList.filter((s: any) => s?.sid !== sid).concat({
            ...previousActiveSession,
          accessToken : updatedToken,
          updatedOn : new Date().toISOString(),
          });
      }
      await this.redisService.setJsonData(
        sessionListCacheKey,
        JSON.stringify(updatedSessionList),
        process.env.CLIENTCODE,
      );
      await this.redisService.setJsonData(
        `CK:${tenant}:FNGK:AFP:FNK:${ufClientType}:CATK:${ag}:AFGK:${app}:AFK:session:AFVK:${version}:${loginId}_variables`,
        JSON.stringify(accessObj),
        process.env.CLIENTCODE,
      );
      return updatedToken;
    } catch (error) {
      await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'AUTH006',
        error,
        'getAccessToken',
        token,
        {
          artifact: 'getAccessToken',
        },
      );
      throw new BadGatewayException(error);
    }
  }

  transformToCombinations(data: any[]) {
  try {
    return data.map((profile) => {
      const combinations: any[] = [];

      profile.orgGrp?.forEach((orgGrp: any) => {
        const { orgGrpCode, orgGrpName } = orgGrp;

        orgGrp.org?.forEach((org: any) => {
          const { orgCode, orgName } = org;

          /* ------------------------------
             1️⃣ ORG-LEVEL COMBINATIONS
             org → psGrp → ps → roleGrp → role
          --------------------------------*/
          org.psGrp?.forEach((psGrp: any) => {
            const { psGrpCode, psGrpName } = psGrp;

            psGrp.ps?.forEach((ps: any) => {
              const { psCode, psName } = ps;

              ps.roleGrp?.forEach((roleGrp: any) => {
                const { roleGrpCode, roleGrpName } = roleGrp;

                roleGrp.roles?.forEach((role: any) => {
                  const { roleCode, roleName } = role;

                  combinations.push({
                    orgGrpCode,
                    orgGrpName,
                    orgCode,
                    orgName,

                    subOrgGrpCode: '',
                    subOrgGrpName: '',
                    subOrgCode: '',
                    subOrgName: '',

                    psGrpCode,
                    psGrpName,
                    psCode,
                    psName,

                    roleGrpCode,
                    roleGrpName,
                    roleCode,
                    roleName,
                  });
                });
              });
            });
          });

          /* ------------------------------
             2️⃣ SUB-ORG-LEVEL COMBINATIONS
             org → subOrgGrp → subOrg → psGrp → ps → roleGrp → role
          --------------------------------*/
          org.subOrgGrp?.forEach((subOrgGrp: any) => {
            const { subOrgGrpCode, subOrgGrpName } = subOrgGrp;

            subOrgGrp.subOrg?.forEach((subOrg: any) => {
              const { subOrgCode, subOrgName } = subOrg;

              subOrg.psGrp?.forEach((psGrp: any) => {
                const { psGrpCode, psGrpName } = psGrp;

                psGrp.ps?.forEach((ps: any) => {
                  const { psCode, psName } = ps;

                  ps.roleGrp?.forEach((roleGrp: any) => {
                    const { roleGrpCode, roleGrpName } = roleGrp;

                    roleGrp.roles?.forEach((role: any) => {
                      const { roleCode, roleName } = role;

                      combinations.push({
                        orgGrpCode,
                        orgGrpName,
                        orgCode,
                        orgName,

                        subOrgGrpCode,
                        subOrgGrpName,
                        subOrgCode,
                        subOrgName,

                        psGrpCode,
                        psGrpName,
                        psCode,
                        psName,

                        roleGrpCode,
                        roleGrpName,
                        roleCode,
                        roleName,
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });

        return {
          accessProfile: profile.accessProfile,
          dap: profile?.dap ?? undefined,
          combinations,
          orgGrp: profile.orgGrp,
        };
      });
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async getAccessTemplate(token: string) {
    try {
      const accountDetails = await this.MyAccountForClient(token, 's', true);
      const { client, accessProfile } = accountDetails;
      const accessTemplateCacheKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${client}:AFGK:${ag}:AFK:${app}:AFVK:v1:securityTemplate`;
      const accessTemplateResponse = await this.redisService.getJsonData(
        accessTemplateCacheKey,
        process.env.CLIENTCODE,
      );
      if (accessTemplateResponse) {
        const accessTemplate = JSON.parse(accessTemplateResponse);
        const filteredAccessTemplate = accessTemplate.filter((template: any) =>
          accessProfile.includes(template?.accessProfile),
        );
        return this.transformToCombinations(filteredAccessTemplate);
      } else {
        throw new NotFoundException('Access Template not found');
      }
    } catch (error) {
      await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'AUTH007',
        error,
        'select-context',
        token,
        {
          artifact: 'select-context',
        },
      );
      throw new BadGatewayException(error);
    }
  }

  async fusionAuthVerifyRefreshToken(refreshToken: string): Promise<any> {
    try {
      const config = this.getConfig();
      const fusionAuthBaseUrl = config.fusionAuthBaseUrl;
     
      // prepare the tenant id ,application id and secret from the client tpc
      const url = `${fusionAuthBaseUrl}/oauth2/token`;

      const params = new URLSearchParams();
      params.append('grant_type', 'refresh_token');
      params.append('refresh_token', refreshToken);

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            btoa(fusionAuthApplicationId + ':' + fusionAuthAppClientSecret),
          'X-FusionAuth-TenantId': fusionAuthTenantId,
        },
        body: params.toString(),
      });
      if (!res.ok) {
        throw new UnauthorizedException('Invalid access token');
      }
      const data = await res.json();
      return data;
    } catch (error) {
      return null;
    }
  }

  toMinutes(value: any): number {
    const regex = /^(\d+(?:\.\d+)?)(?:\s*([a-zA-Z]+))?$/;
    const match = value.trim().match(regex);

    if (!match) throw new Error(`Invalid time format: ${value}`);

    const num = parseFloat(match[1]);
    const unit = (match[2] || 'm').toLowerCase();

    const unitMap: Record<string, number> = {
      y: 525600,
      year: 525600,
      years: 525600,
      yr: 525600,
      yrs: 525600,
      w: 10080,
      week: 10080,
      weeks: 10080,
      d: 1440,
      day: 1440,
      days: 1440,
      h: 60,
      hr: 60,
      hrs: 60,
      hour: 60,
      hours: 60,
      m: 1,
      min: 1,
      mins: 1,
      minute: 1,
      minutes: 1,
      s: 1 / 60,
      sec: 1 / 60,
      secs: 1 / 60,
      second: 1 / 60,
      seconds: 1 / 60,
      ms: 1 / 60000,
      msec: 1 / 60000,
      msecs: 1 / 60000,
      millisecond: 1 / 60000,
      milliseconds: 1 / 60000,
    };

    const minutes = unitMap[unit];
    if (minutes === undefined) throw new Error(`Unknown unit: ${unit}`);

    return num * minutes;
  }

  async checkSession(sessionList: any[]) {
    try {
      const config = this.getConfig()
      const refreshTokenExpiryTime = config.authRefreshTokenExpiryTime 
      const fusionauthRefreshTokenExpiryTimeinMinutes = config.fusionauthRefreshTokenExpiryTimeinMinutes
      const timeNow = Math.ceil(new Date().getTime() / 1000);
      const updatedSessionList = new Map();
      for (let index = 0; index < sessionList.length; index++) {
        const session = sessionList[index];

        // if there is no refresh token it will be removed from the session list
        if (!session['refreshToken'] || !session['createdOn']) {
          continue;
        }
        const sessionLastUpdatedTime =
          new Date(session['updatedOn'] || session['createdOn']).getTime() /
          1000;
        const timegap = timeNow - sessionLastUpdatedTime;
        const timegapInMinutes = Math.ceil(timegap / 60);
        const expiryTImeInMinutes = session['refreshTokenId']
          ? parseInt(fusionauthRefreshTokenExpiryTimeinMinutes)
          : this.toMinutes(refreshTokenExpiryTime);
        if (timegapInMinutes <= expiryTImeInMinutes) {
          updatedSessionList.set(session['refreshToken'], session);
        }
      }
      return Array.from(updatedSessionList.values());
    } catch (error) {
      return []
    }
  }

  async MyAccountForClient(token: string, key: string, authorization: any) {
    if (authorization) {
      try {
        const payload: any = this.jwt.decode(token);
        if (!payload) {
          await this.commonService.errorLog(
            'Technical',
            'AK',
            'Fatal',
            'TG070',
            'Please provide valid token',
            key,
            token,
          );
        } else {
     
          const userCachekey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:users`;
          const responseFromRedis = await this.redisService.getJsonData(
            userCachekey,
            process.env.CLIENTCODE,
          );
          const userList = JSON.parse(responseFromRedis);
          const reqiredUser = userList.find(
            (user) => user.loginId === payload.loginId,
          );
          delete reqiredUser.password;
          return { ...reqiredUser, client: tenant };
        }
      } catch (error) {
        await this.commonService.errorLog(
          'Technical',
          'AK',
          'Fatal',
          'TG071',
          `Error in MyAccountForClient:${error.message}`,
          key,
          token,
        );
      }
    } else {
      await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'TG072',
        'Token not found',
        key,
        token,
      );
    }
  }

   async introspectToken(headers: any, key: string, tokens: string) {
    try {
      const config = this.getConfig()
      const auth_secret = config.authSecret
      const accessTokenExpiryTime = config.authAccessTokenExpiryTime 

      const { authorization } = headers;
      if (!authorization || typeof authorization !== 'string') {
        await this.commonService.errorLog(
          'Technical',
          'AK',
          'Fatal',
          'TG073',
          'Token not found',
          key,
          tokens,
        );
      }
      const token = authorization.split(' ')[1];
      if (!token) {
        await this.commonService.errorLog(
          'Technical',
          'AK',
          'Fatal',
          'TG074',
          'Token not found',
          key,
          tokens,
        );
      }
      const payload = await this.jwt.decode(token);
      if (!payload) {
        await this.commonService.errorLog(
          'Technical',
          'AK',
          'Fatal',
          'TG075',
          'Invalid access token',
          key,
          tokens,
        );
      }
      const sessionListCacheKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:session`;
      const sessionListCache = await this.redisService.getJsonData(
        sessionListCacheKey,
        process.env.CLIENTCODE,
      );
      const sessionList = sessionListCache && JSON.parse(sessionListCache) ? JSON.parse(sessionListCache) : [];

      if (
        !sessionList ||
        !Array.isArray(sessionList) ||
        !sessionList.length
      ) {
        await this.commonService.errorLog(
          'Technical',
          'AK',
          'Fatal',
          'TG075',
          'Invalid access token',
          key,
          tokens,
        );
        throw new UnauthorizedException('Invalid access token');
      }
      const updatedSessionList = await this.checkSession(sessionList);
      let currentSession = updatedSessionList.find(
        (item: any) => item?.sid == payload.sid,
      );
      if (!currentSession) {
        await this.redisService.setJsonData(
          sessionListCacheKey,
          JSON.stringify(updatedSessionList),
          process.env.CLIENTCODE,
        );
        await this.commonService.errorLog(
          'Technical',
          'AK',
          'Fatal',
          'TG075',
          'Invalid access token',
          key,
          tokens,
        );
        throw new UnauthorizedException('Invalid access token');
      }
      const refreshToken = currentSession['refreshToken'];
      if (!refreshToken) {
        await this.commonService.errorLog(
          'Technical',
          'AK',
          'Fatal',
          'TG075',
          'Session not available',
          key,
          tokens,
        );
        throw new UnauthorizedException('Session not available');
      }
      // if currentSession has refreshTokenId this token is from fusionAuth and we need to verify with fusionauth
      if(currentSession['refreshTokenId']){
        const value = await this.fusionAuthVerifyRefreshToken(refreshToken);
        if (value) {
          currentSession = {
            ...currentSession,
            refreshToken: value?.refresh_token,
            refreshTokenId: value?.refresh_token_id,
            updatedOn : new Date().toISOString()
          }
        }else{
          await this.commonService.errorLog(
            'Technical',
            'AK',
            'Fatal',
            'TG075',
            'Session not available',
            key,
            tokens,
          );
          throw new UnauthorizedException('Session not available');
        }
      }else{
        try {
         await this.jwt.verifyAsync(
             currentSession['refreshToken'], {
               secret : auth_secret
             }
           )
        } catch (error) {
          await this.commonService.errorLog(
            'Technical',
            'AK',
            'Fatal',
            'TG075',
            'Session not available',
            key,
            tokens,
          );
          throw new UnauthorizedException('Session not available');
        }
      }
      const timeNow = Math.ceil(new Date().getTime() / 1000);
      const timegap = payload.exp - timeNow;
      let updatedToken = undefined;
      if (timegap < 300) {
        updatedToken = await this.jwt.signAsync(
          {
            client: payload.client,
            loginId: payload.loginId,
            type: payload.type,
            isAppAdmin: payload.isAppAdmin,
            userCode: payload?.userCode,
            ag,
            app,
            sid : payload.sid,
          },
          {
            secret: auth_secret,
            expiresIn: accessTokenExpiryTime as any,
          },
        );
        currentSession = {
          ...currentSession,
          accessToken: updatedToken,
          updatedOn : new Date().toISOString()
        }
      } else {
        currentSession = {
          ...currentSession,
          updatedOn : new Date().toISOString()
        }
      }
      await this.redisService.setJsonData(
        sessionListCacheKey,
        JSON.stringify(
          updatedSessionList
            .filter((s: any) => s.sid !== payload.sid)
            .concat(currentSession),
        ),
        process.env.CLIENTCODE,
      );
      return { authenticated: true, updatedToken };
    } catch (error) {
      await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'TG078',
        `Error in introspectToken:${error.message}`,
        key,
        tokens,
      );
      throw new UnauthorizedException('Invalid access token');
    }
  }

  isUserAccessExpired(user: {
    accessExpires?: string | Date | null;
    accessProfile?: string[];
  }) {
    if (!('accessProfile' in user)) {
      throw new NotAcceptableException(
        'Access profile not found, Please contact administrator',
      );
    }
    if (user.accessProfile.includes('admin')) {
      return false;
    }

    if (!user.accessExpires) {
      // If accessExpires is not defined or null, return null
      return null;
    }

    const expiryDate = new Date(user.accessExpires);
    // Check if the date is invalid
    if (isNaN(expiryDate.getTime())) {
      expiryDate.setHours(0, 0, 0, 0);
      return null; // Invalid date, return null
    }
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Check if the current date is past the expiry date
    return currentDate > expiryDate;
  }

    async signIntoTorus(
    username: string,
    password: string,
    ufClientType: string,
    isOauthUser: boolean = false,
    fusionAuthLoginResponse?: any | undefined,
  ) {
    try {
      const config = this.getConfig()
      const auth_secret = config.authSecret
      const accessTokenExpiryTime = config.authAccessTokenExpiryTime 
      const refreshTokenExpiryTime = config.authRefreshTokenExpiryTime 

      let tenantUserKey: string = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:users`;
      const appUserKey: string = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:users`;
      const sessionListCacheKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:session`;

      let tenantUser: any = JSON.parse(
        await this.redisService.getJsonData(
          tenantUserKey,
          process.env.CLIENTCODE,
        ),
      );
      let appUser: any = [];
      // return appUserKey

      if (tenantUser?.length > 0) {
        let loginUser: any =
          tenantUser.find((user: any) => {
            const isUserMatch =
              user.loginId === username || user.email === username;
            if (!isUserMatch) return false;
            if (isOauthUser) {
              return true;
            } else {
              return user?.password?this.comparePasswords(password, user.password):false
            }
          }) || null;
        if (!loginUser){
          if(isOauthUser)
            return false;
          else 
            throw new NotFoundException('User not found');
        }
        appUser = JSON.parse(
            await this.redisService.getJsonData(
              appUserKey,
              process.env.CLIENTCODE,
            ),
          ) || []; // app user are null
        let loggedInUser = appUser.find(
          (user: any) => loginUser?.userUniqueId === user?.userUniqueId,
        );
        if (!loggedInUser) {
          throw new NotFoundException(`User did not have access to the application`);
        }
        loggedInUser={...loggedInUser,firstName:loginUser?.firstName,lastName:loginUser?.lastName,profile:loginUser?.profile}
        const isExpiredUser = this.isUserAccessExpired(loggedInUser);

        if (isExpiredUser) {
          throw new NotAcceptableException(
            'User access expired, Please contact administrator',
          );
        }

        if (isOauthUser && !loggedInUser?.accessProfile?.length) {
          throw new UnauthorizedException(
            `User access pending for ${loggedInUser.loginId ?? loginUser?.email} , you'll be notified when approved`,
          );
        }
        else if (!loggedInUser?.accessProfile?.length) {
          throw new UnauthorizedException(
            `User access pending for ${loggedInUser.loginId ?? loginUser?.email} , you'll be notified when approved`,
          );
        }

        const userIndex = appUser.findIndex(
          (user: any) =>
            user.loginId === username &&
            user.userUniqueId === loggedInUser.userUniqueId,
        );

        appUser.splice(userIndex, 1, {
          ...loggedInUser,
          status: 'active',
          lastActive: new Date(),
        });

        await this.redisService.setJsonData(
          appUserKey,
          JSON.stringify(appUser),
          process.env.CLIENTCODE,
        );

        delete loggedInUser.password;

        let sid: string = uuid();
        let token = await this.jwt.signAsync(
          {
            loginId: loggedInUser.loginId,
            client: tenant,
            type: 't',
            ag,
            app,
            isAppAdmin: loggedInUser?.isAppAdmin ?? undefined,
            userCode: loginUser?.userCode ?? undefined,
            sid: sid,
          },
          {
            secret: auth_secret,
            expiresIn: accessTokenExpiryTime as any,
          },
        );
        let refreshToken: string;
        let refreshTokenId: string | undefined;

        if (fusionAuthLoginResponse && fusionAuthLoginResponse?.refresh_token) {
          refreshToken = fusionAuthLoginResponse?.refresh_token;
          refreshTokenId = fusionAuthLoginResponse?.refresh_token_id;
        } else {
          refreshToken = await this.jwt.signAsync(
            { loginId: loggedInUser.loginId, client: tenant, type: 't' },
            { secret: auth_secret, expiresIn: refreshTokenExpiryTime as any },
          );
        }

        if (
          loggedInUser?.accessProfile &&
          Array.isArray(loggedInUser?.accessProfile) &&
          loggedInUser?.accessProfile?.length >= 2
        ) {
          await this.addSession(
            {
              accessToken: token,
              sid,
              refreshToken,
              refreshTokenId,
              createdOn : new Date().toISOString()
            },
            sessionListCacheKey,
          );
          return {
            token,
            authorized: true,
            email: loginUser.email,
            redirectToORPSelector: true,
          };
        }

        const accessProfileCacheKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:securityTemplate`;

        const accessProfileCache = await this.redisService.getJsonData(
          accessProfileCacheKey,
          process.env.CLIENTCODE,
        );

        const accessProfileList = accessProfileCache
          ? JSON.parse(accessProfileCache)
          : [];

        if (accessProfileList.length == 0) {
          await this.addSession(
            {
              accessToken: token,
              sid,
              refreshToken,
              refreshTokenId,
              createdOn : new Date().toISOString()
            },
            sessionListCacheKey,
          );
          return {
            token,
            authorized: true,
            email: loginUser.email,
            redirectToORPSelector: false,
          };
        }

        let orpAccessObj: any = {};
        let redirectToORPSelector = true;

        if (
          loggedInUser?.accessProfile &&
          Array.isArray(loggedInUser?.accessProfile) &&
          loggedInUser?.accessProfile?.length == 1
        ) {
          const filteredAccessprofile = accessProfileList.filter((t: any) => {
            return loggedInUser.accessProfile.includes(t.accessProfile);
          });

          const filteredCombination = await this.transformToCombinations(
            filteredAccessprofile,
          );

          if (filteredCombination?.length == 1) {
            const combination = filteredCombination[0].combinations;
            if (combination.length == 1) {
              for (const key in combination[0]) {
                // if (key.toLowerCase().includes('code')) {
                orpAccessObj[key] = combination[0][key];
                orpAccessObj['selectedAccessProfile'] =
                  loggedInUser.accessProfile[0];
                orpAccessObj['dap'] =
                  filteredCombination[0]['dap'] || undefined;
                redirectToORPSelector = false;
                // }
              }
              token = await this.jwt.signAsync(
                {
                  loginId: loggedInUser.loginId,
                  isAppAdmin: loggedInUser?.isAppAdmin ?? undefined,
                  client: tenant,
                  type: 't',
                  ag,
                  app,
                  userCode: loginUser?.userCode ?? undefined,
                  ...orpAccessObj,
                 sid:sid,
                },
                {
                  secret: auth_secret,
                  expiresIn: accessTokenExpiryTime as any,
                },
              );
            }
          }
        }

        await this.addSession(
          {
            accessToken: token,
            sid,
            refreshToken,
            refreshTokenId,
            createdOn : new Date().toISOString()
          },
          sessionListCacheKey,
        );
        await this.redisService.setJsonData(
          `CK:${tenant}:FNGK:AFP:FNK:${ufClientType}:CATK:${ag}:AFGK:${app}:AFK:session:AFVK:${version}:${loggedInUser?.loginId}_variables`,
          JSON.stringify(orpAccessObj),
          process.env.CLIENTCODE,
        );
        return {
          token,
          authorized: true,
          email: loggedInUser.email,
          redirectToORPSelector,
        };
      } else {
        if(isOauthUser)
        {
          return false
        }
        await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'AUTH002',
        'Invalid Credentials',
        'LoginScreen',
        '',
        {
          artifact: 'LoginScreen',
          users: username,
        },
      );
        throw new NotFoundException(`Invalid Credentials`);
      }
    } catch (error) {
      await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'AUTH002',
        error,
        'LoginScreen',
        '',
        {
          artifact: 'LoginScreen',
          users: username,
        },
      );
      await this.throwCustomException(error);
    }
  }

  async signInViaIAM(
    username: string,
    password: string,
    ufClientType: string,
    isOauthUser: boolean = false,
  ) {
    try {
      const config = this.getConfig();
      const fusionAuthBaseUrl = config.fusionAuthBaseUrl;

      const url = `${fusionAuthBaseUrl}/oauth2/token`;
      const params = new URLSearchParams();
      params.append('grant_type', 'password');
      params.append('username', username);
      params.append('password', password);
      params.append('scope', 'offline_access');
      params.append('client_id', fusionAuthApplicationId);

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            btoa(fusionAuthApplicationId + ':' + fusionAuthAppClientSecret),
          'X-FusionAuth-TenantId': fusionAuthTenantId,
        },
        body: params.toString(),
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new UnauthorizedException(JSON.parse(errorData)?.error_description ?? 'invalid credentials');
      }
      const fusionAuthLoginResponse = await res.json();
      const torusSignIn = await this.signIntoTorus(
        username,
        password,
        ufClientType,
        isOauthUser,
        fusionAuthLoginResponse,
      );
      return torusSignIn;
    } catch (error) {
      await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'AUTH001',
        error,
        'LoginScreen',
        '',
        {
          artifact: 'LoginScreen',
          users: username,
        },
      );
      await this.throwCustomException(error);
    }
  }

  async addSession(sessionObj: any, sessionListCacheKey: string) {
    try {
      const sessionListResponse = await this.redisService.getJsonData(
        sessionListCacheKey,
        process.env.CLIENTCODE,
      );

      let sessionList = new Set();
      if (sessionListResponse) {
        const updatedSessionList = await this.checkSession(
          JSON.parse(sessionListResponse),
        );
        sessionList = new Set(updatedSessionList);
      }

      await this.redisService.setJsonData(
        sessionListCacheKey,
        JSON.stringify([
          ...Array.from(sessionList).filter(
            (s: any) => s?.sid !== sessionObj?.sid,
          ),
          sessionObj,
        ]),
        process.env.CLIENTCODE,
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  comparePasswords(password: string, storedHash: string): boolean {
    try {
      const KEY_LENGTH = 64;
      const [salt, hash] = storedHash.split(':');
      const hashBuffer = Buffer.from(hash, 'hex');
      const testHash = scryptSync(password, salt, KEY_LENGTH);
      return timingSafeEqual(hashBuffer, testHash);
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async throwCustomException(error: any) {
    if (error instanceof CustomException) {
      throw error; // Re-throw the specific custom exception
    }
    throw new CustomException(
      'An unexpected error occurred',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  hashPassword(password: string): string {
    const SALT_LENGTH = 16;
    const KEY_LENGTH = 64;
    const salt = randomBytes(SALT_LENGTH).toString('hex');
    const hash = scryptSync(password, salt, KEY_LENGTH).toString('hex');
    return `${salt}:${hash}`;
  }

  // static screen's apis
  async getTenantUser(tenantCode: string, client: string) {
    try {
      let key: string = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenantCode}:AFK:PROFILE:AFVK:v1:users`;
      const res = JSON.parse(await this.redisService.getJsonData(key, client));
      return res || [];
    } catch (err: any) {
      throw new UnauthorizedException('Invalid tenant key');
    }
  }

  async getAppUserList(
    tenant: string,
    ag: string,
    app: string,
    client: string,
  ) {
    try {
      if (!tenant || !ag || !app || !client) {
        return [];
      }
      const userCachekey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:users`;
      const responseFromRedis = JSON.parse(
        await this.redisService.getJsonData(userCachekey, client),
      );
      return responseFromRedis || [];
    } catch (error) {
      throw new UnauthorizedException('Please check credentials');
    }
  }

  async getTenantAppUser(tenant, client, ag, app){
    try {
      let setAssignUsers = []

      const tenantUser: any[] = await this.getTenantUser(tenant, client);
      const tenantAppUser: any[] = await this.getAppUserList(tenant, ag, app, client);
      tenantAppUser.filter((appUser: any) =>
        tenantUser.some(
          (tenantUser: any) => {
            if(appUser.userUniqueId === tenantUser.userUniqueId){
              setAssignUsers.push({...appUser,...tenantUser})
          }
          }
        ),
      );
      // return {data:setAssignUsers}
       return setAssignUsers
    }catch (error) {
      throw new UnauthorizedException('Please check credentials');
    }
  }

  async getAppSecurityData() {
    try {
      if (!tenant)
        throw new BadRequestException(
          'Either AppGroup or Application not available',
        );
      const appCachePrefix = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1`;
      const cacheKeyArray = ['orgMatrix', 'appearance', 'orgMaster'];
      const securityResponse = {};
      for (let index = 0; index < cacheKeyArray.length; index++) {
        const cacheKey = `${appCachePrefix}:${cacheKeyArray[index]}`;
        const data = await this.redisService.getJsonData(
          cacheKey,
          process.env.CLIENTCODE,
        );
        if (data) {
          securityResponse[cacheKeyArray[index]] =
            cacheKeyArray[index] == 'users'
              ? JSON.parse(data).filter((user) => {
                  delete user.password;
                  return user;
                })
              : JSON.parse(data);
        } else {
          securityResponse[cacheKeyArray[index]] =
            (data ?? cacheKeyArray[index] == 'appearance') ? {} : [];
        }
      }
      securityResponse['users'] = (await this.getTenantAppUser(tenant, process.env.CLIENTCODE, ag, app)).map(user => {
        delete user.password;
        return user;
      });
      return securityResponse;
    } catch (error) {
      await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'AUTH008',
        error,
        'UserScreen',
        '',
        {
          artifact: 'UserScreen',
          user: "anonymous user",
        },
      );
      await this.throwCustomException(error);
    }
  }

  async getAPPSecurityTemplateData() {
    try {
      const responseFromRedis = await this.redisService.getJsonData(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:securityTemplate`,
        process.env.CLIENTCODE,
      );
      const userResponse = await this.redisService.getJsonData(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:users`,
        process.env.CLIENTCODE,
      );

      let securityTemplateData = [];
      if (responseFromRedis) {
        securityTemplateData = JSON.parse(responseFromRedis);
        securityTemplateData = securityTemplateData.map((data) => ({
          ...data,
          'no.ofusers': 0,
        }));
        if (userResponse) {
          const userlist = JSON.parse(userResponse);
          securityTemplateData = securityTemplateData.map((data) => {
            var noOfUsers = 0;
            userlist.forEach((user) => {
              if (
                user?.accessProfile &&
                user.accessProfile.includes(data.accessProfile)
              ) {
                noOfUsers += 1;
              }
            });

            return { ...data, 'no.ofusers': noOfUsers };
          });
        }
      }
      return securityTemplateData;
    } catch (error) {
      await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'AUTH009',
        error,
        'UserScreen',
        '',
        {
          artifact: 'UserScreen',
          users: 'anonymous user',
        },
      );
      await this.throwCustomException(error);
    }
  }

  async getAppAccessProfiles() {
    try {
      if (!tenant || !ag || !app) {
        throw new BadRequestException(
          'Either AppGroup or Application not available',
        );
      }
      const responseFromRedis = await this.redisService.getJsonData(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:securityTemplate`,
        process.env.CLIENTCODE,
      );
      const accessProfileArray = [];
      const accessProfileWithProductAndService = {};
      if (responseFromRedis) {
        const accessProfileData: any[] = JSON.parse(responseFromRedis);
        accessProfileData.forEach((accessProfileObj) => {
          var noOfProdService = 0;
           accessProfileObj['orgGrp']?.forEach((orgGrp: any) => {
            orgGrp['org']?.forEach((org: any) => {
              org['psGrp']?.forEach((psGrp: any) => {
                noOfProdService += psGrp['ps'].length;
              });
            })
          });
          accessProfileWithProductAndService[accessProfileObj?.accessProfile] =
            noOfProdService;
          accessProfileArray.push(accessProfileObj?.accessProfile);
        });
      }
      return accessProfileWithProductAndService;
    } catch (error) {
      await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'AUTH010',
        error,
        'UserScreen',
        '',
        {
          artifact: 'UserScreen',
          users: 'anonymous user',
        },
      );
      await this.throwCustomException(error);
    }
  }

  async postAppUserList(data: any, token: string) {
    // this data is a single user record at any case
    try {
      const config = this.getConfig();
      const fusionAuthBaseUrl = config.fusionAuthBaseUrl;
      const fusionAuthApiKey = config.fusionAuthApiKey;
      const auth_secret = config.authSecret

      if (
        !tenant ||
        !data ||
        !ag ||
        !app ||
        !process.env.CLIENTCODE ||
        !token
      ) {
        throw new BadRequestException('Invalid credentials');
      }
      const payload = await this.jwt.verifyAsync(token, {
        secret: auth_secret,
      });
      const userCachekey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:users`;
      const responseFromRedis = JSON.parse(
        await this.redisService.getJsonData(
          userCachekey,
          process.env.CLIENTCODE,
        ) ?? [],
      );

      const app_user_data = {
        user_unique_id: data?.userUniqueId ?? '',
        no_of_products_service: String(data?.['noOfProductsService']) ?? '',
        access_profile: data?.['accessProfile'] ?? [],
        is_app_admin:
          typeof data?.['isAppAdmin'] == 'boolean'
            ? data?.['isAppAdmin']
            : false,
        last_active: data?.['lastActive'] ?? '',
        access_expires: new Date(data?.['accessExpires']).toISOString() ?? '',
        tenant_code: tenant,
        ag_code: ag,
        app_code: app,
        // org_tu_id: 0,
        trs_created_date: data?.['dateAdded'] ?? new Date().toISOString(),
        trs_created_by: payload?.loginId ?? 'anonymous',
        trs_modified_date: data?.['dateAdded'] ?? new Date().toISOString(),
        trs_modified_by: payload?.loginId ?? 'anonymous',
        trs_status: '',
        trs_next_status: '',
        trs_process_id: '',
        trs_access_profile: payload?.selectedAccessProfile || '',
        trs_org_grp_code: payload?.orgGrpCode || '',
        trs_org_code: payload?.orgCode || '',
        trs_role_grp_code: payload?.roleGrpCode || '',
        trs_role_code: payload?.roleCode || '',
        trs_ps_grp_code: payload?.psGrpCode || '',
        trs_ps_code: payload?.psCode || '',
        trs_sub_org_grp_code: payload?.subOrgGrpCode || '',
        trs_sub_org_code: payload?.subOrgCode || '',
        trs_app_code: payload?.appCode || '',
      };

      let dataExistOrNot: any = {
        isNotExist: true,
      };

      if (
        defaultAuth === 'fusionauth' &&
        fusionAuthTenantId &&
        data?.userUniqueId &&
        fusionAuthApplicationId
      ) {
        dataExistOrNot = await FusionAuthUserApplicatonGet(
          fusionAuthBaseUrl,
          fusionAuthApiKey,
          fusionAuthTenantId,
          data?.userUniqueId,
          fusionAuthApplicationId,
        );
      }

      let res;
      if (responseFromRedis == null || responseFromRedis?.length == 0) {
        if (
          defaultAuth === 'fusionauth' &&
          fusionAuthTenantId &&
          data?.userUniqueId &&
          fusionAuthApplicationId
        ) {
          if (dataExistOrNot?.isNotExist) {
            await FusionAuthApplicatonAssign(
              fusionAuthBaseUrl,
              fusionAuthApiKey,
              fusionAuthTenantId,
              data?.userUniqueId,
              fusionAuthApplicationId,
              data.firstName,
              data.lastName,
              data.loginId,
              data.email,
              'POST',
              data?.accessProfile || [],
            );
          }
        }
        
        // Torus API OPR Table entry
        const postAppUserResponse = await this.callTorusAPI('app_user', {
          method: 'POST',
          data: app_user_data,
          token: token,
        });
        const org_au_id =
          postAppUserResponse.status == 201
            ? postAppUserResponse.data?.org_au_id
            : undefined;

        res = await this.redisService.setJsonData(
          userCachekey,
          JSON.stringify([{ ...data, org_au_id }]),
          process.env.CLIENTCODE,
        );
      } else {
        let userExist: boolean = false;
        let updateIndex: any = null;

        responseFromRedis.forEach((user: any, index: number) => {
          if (data?.userUniqueId === user?.userUniqueId) {
            userExist = true;
            updateIndex = index;
          }
        });
        if (userExist) {
          if (
            defaultAuth === 'fusionauth' &&
            fusionAuthTenantId &&
            data?.userUniqueId &&
            fusionAuthApplicationId
          ) {
            if (dataExistOrNot?.isNotExist) {
              await FusionAuthApplicatonAssign(
                fusionAuthBaseUrl,
                fusionAuthApiKey,
                fusionAuthTenantId,
                data?.userUniqueId,
                fusionAuthApplicationId,
                data.firstName,
                data.lastName,
                data.loginId,
                data.email,
                'POST',
                data?.accessProfile || [],
              );
            } else if (dataExistOrNot?.registration) {
              await FusionAuthApplicatonAssign(
                fusionAuthBaseUrl,
                fusionAuthApiKey,
                fusionAuthTenantId,
                data?.userUniqueId,
                fusionAuthApplicationId,
                data.firstName,
                data.lastName,
                data.loginId,
                data.email,
                'PUT',
                data?.accessProfile || [],
              );
            }
          }
          
          // Torus API OPR Table entry
          let org_au_id = undefined;
          if (data?.org_au_id) {
            org_au_id = data?.org_au_id;
            // handle patch only if field values gets changed
            const equivalentDataInRedis = responseFromRedis[updateIndex];
            if (
              data?.['noOfProductsService'] !==
                equivalentDataInRedis?.['noOfProductsService'] ||
              data['isAppAdmin'] !== equivalentDataInRedis['isAppAdmin'] ||
              JSON.stringify(data['accessProfile']) !==
                JSON.stringify(equivalentDataInRedis['accessProfile']) ||
              data['lastActive'] !== equivalentDataInRedis['lastActive'] ||
              data['accessExpires'] !== equivalentDataInRedis['accessExpires']
            ) {
              await this.callTorusAPI('app_user', {
                method: 'PATCH',
                data: {
                  no_of_products_service: data?.['noOfProductsService'] ?? '',
                  access_profile: data?.['accessProfile'] ?? [],
                  is_app_admin:
                    typeof data?.['isAppAdmin'] == 'boolean'
                      ? data?.['isAppAdmin']
                      : false,
                  last_active: data?.['lastActive'] ?? '',
                  access_expires: data?.['accessExpires'] ?? '',
                  trs_modified_date: new Date().toISOString(),
                  trs_modified_by: payload?.loginId ?? 'anonymous',
                },
              });
            }
          } else {
            const postAppUserResponse = await this.callTorusAPI('app_user', {
              method: 'POST',
              data: app_user_data,
              token: token,
            });
            org_au_id =
              postAppUserResponse.status == 201
                ? postAppUserResponse.data?.org_au_id
                : undefined;
          }

          responseFromRedis[updateIndex] = { ...data, org_au_id };
          ////////////
          let uniqueData: any[] = responseFromRedis?.filter(
            (obj) => 'userUniqueId' in obj,
          );
          uniqueData = uniqueData.filter(
            (item: any, index: any, self: any) =>
              index ===
              self.findIndex((t: any) => t.userUniqueId === item.userUniqueId),
          );
          ////////////

          res = await this.redisService.setJsonData(
            userCachekey,
            JSON.stringify(uniqueData), // set JSON.stringify(responseFromRedis), this once all app keys have correct object
            process.env.CLIENTCODE,
          );
        } else {
          if (
            defaultAuth === 'fusionauth' &&
            fusionAuthTenantId &&
            data?.userUniqueId &&
            fusionAuthApplicationId
          ) {
            if (dataExistOrNot?.isNotExist) {
              await FusionAuthApplicatonAssign(
                fusionAuthBaseUrl,
                fusionAuthApiKey,
                fusionAuthTenantId,
                data?.userUniqueId,
                fusionAuthApplicationId,
                data.firstName,
                data.lastName,
                data.loginId,
                data.email,
                'POST',
                data?.accessProfile || [],
              );
            }
          }
           // Torus API OPR Table entry
          const postAppUserResponse = await this.callTorusAPI('app_user', {
          method: 'POST',
          data: app_user_data,
          token: token,
        });
        const org_au_id =
          postAppUserResponse.status == 201
            ? postAppUserResponse.data?.org_au_id
            : undefined;
          responseFromRedis.push({...data , org_au_id});
          //////////
          let uniqueData: any[] = responseFromRedis;
          uniqueData = uniqueData.filter(
            (item: any, index: any, self: any) =>
              index ===
              self.findIndex((t: any) => t.userUniqueId === item.userUniqueId),
          );
          ////////////
          res = await this.redisService.setJsonData(
            userCachekey,
            JSON.stringify(uniqueData), // set JSON.stringify(responseFromRedis), this once all app keys have correct object
            process.env.CLIENTCODE,
          );          
        }
      }
      return res;
    } catch (error) {
      await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'AUTH011',
        error,
        'UserScreen',
        '',
        {
          artifact: 'UserScreen',
          users: 'anonymous user',
        },
      );
      await this.throwCustomException(error);
    }
  }

  async setJson(key: string, data: any) {
    try {
      return await this.redisService.setJsonData(
        key,
        JSON.stringify(data),
        process.env.CLIENTCODE,
      );
    } catch (error) {
      await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'AUTH012',
        error,
        key,
        '',
        {
          artifact: 'UserScreen',
          users: 'anonymous user',
        },
      );
      await this.throwCustomException(error);
    }
  }

  async appUserAddition(data: any,isFusionAuth:boolean=false) {
    try {
      if (!tenant || !ag || !app || !data) {
        throw new BadRequestException('Invalid input parameters');
      }
      const userCachekey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:users`;
      const clientProfileResourceKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:tpc`;

      const userResponse = await this.redisService.getJsonData(
        userCachekey,
        process.env.CLIENTCODE,
      );

      const userList: any[] = userResponse ? JSON.parse(userResponse) : [];

      const clientProfile = JSON.parse(
        await this.redisService.getJsonData(
          clientProfileResourceKey,
          process.env.CLIENTCODE,
        ),
      );

      const { email, firstName, lastName, password, loginId } = data;
      const resForClientUserAddition = await this.redisService.getJsonData(
        `CK:TRL:FNGK:AFR:FNK:PORTAL:CATK:EMAILTEMPLATE:AFGK:TORUS:AFK:CLIENTUSERADDITION:AFVK:v1:TPI`,
        process.env.CLIENTCODE,
      );

      const clientUserAddition = JSON.parse(resForClientUserAddition);

      const updatedSubject = (clientUserAddition.subject as string).replaceAll(
        '${clientProfile.clientName}',
        `${clientProfile.Name}`,
      );
      const updateclientUserAdditionHtml = (clientUserAddition.html as string)
        .replaceAll('${clientProfile.clientName}', `${clientProfile.Name}`)
        .replace('${firstName}', `${firstName}`)
        .replace('${lastName}', `${lastName}`)
        .replace('${clientCode}', `${tenant}`)
        .replace('${username}', `${loginId}`)
        .replace('${password}', `${password}`);

      const mailOptions = {
        from: 'support@torus.tech',
        to: email,
        subject: updatedSubject,
        // text: updateclientUserAddition,
        html: updateclientUserAdditionHtml,
      };

      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          throw new ForbiddenException('There is an issue with sending otp');
        } else {
          console.log('Email sent: ' + info.response);
          // return `Email sent`;
        }
      });

      userList.push({
        ...data,
        isRestricted: true,
      });
      await this.redisService.setJsonData(
        userCachekey,
        JSON.stringify(userList),
        process.env.CLIENTCODE,
      );
      const newUserList = structuredClone(userList);

      let result = [];

      for (const user of newUserList) {
        delete user.password;
        result.push(user);
      }

      return result;
    } catch (error) {
      await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'AUTH013',
        error,
        'UserScreen',
        '',
        {
          artifact: 'UserScreen',
          users: 'anonymous user',
        },
      );
      console.log(error, 'error');
      await this.throwCustomException(error);
    }
  }

  async readAMDKey(key: string, token: string) {
    const valueObj: any = await this.commonService.readAPI(
      key,
      'redis',
      'redis',
    );
    if (valueObj) {
      return valueObj;
    } else {
      await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'TG027',
        'setupKey not found',
        key,
        token,
      );
      throw new NotFoundException('data not found');
    }
  }

  async getResetPasswordOtp(email: string) {
    try {
      if (!email) throw new BadRequestException('email is required');
      const userCachekey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:users`;
      const otpCacheKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:otp`;
      const userResponse = await this.redisService.getJsonData(
        userCachekey,
        process.env.CLIENTCODE,
      );
      if (!userResponse) throw new NotFoundException('no data found');
      const userList: any[] = userResponse ? JSON.parse(userResponse) : [];
      const foundedUser = userList.find(
        (user) => user.email.toLowerCase() === email.toLowerCase(),
      );
      if (!foundedUser) throw new NotFoundException('user not found');

      const otpTemplateFromRedis = await this.redisService.getJsonData(
        'CK:TRL:FNGK:AFR:FNK:PORTAL:CATK:EMAILTEMPLATE:AFGK:TORUS:AFK:RESETPASSWORDOTP:AFVK:v1:TPI',
        'TORUS',
      );
      const resetOtpTemplate = otpTemplateFromRedis
        ? JSON.parse(otpTemplateFromRedis)
        : {};

      const capitalizeFirstLetter = (str: string) => {
        if (!str) return str; // If the string is empty or null, return it as is.
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      };
      const otp = Math.floor(100000 + Math.random() * 900000);
      const otpJsonFromRedis = await this.redisService.getJsonData(
        otpCacheKey,
        process.env.CLIENTCODE,
      );
      var otpJson = [];

      if (otpJsonFromRedis) {
        otpJson = JSON.parse(otpJsonFromRedis);
        const existingIndex = otpJson.findIndex((ele) => ele.email == email);
        if (existingIndex != -1) {
          otpJson.splice(existingIndex, 1, { email, otp });
        } else {
          otpJson.push({ email, otp });
        }
      } else {
        otpJson.push({ email, otp });
      }
      await this.redisService.setJsonData(
        otpCacheKey,
        JSON.stringify(otpJson),
        process.env.CLIENTCODE,
      );

      const updatedTemplateHtml = (resetOtpTemplate.html as string)
        .replace(
          '${name}',
          `${capitalizeFirstLetter(foundedUser.firstName ?? email)} ${capitalizeFirstLetter(foundedUser.lastName ?? '')}`,
        )
        .replace('${otp}', `${otp}`)
        .replaceAll('Torus', process.env.APPNAME);
      const mailOptions = {
        from: 'support@torus.tech',
        to: email,
        subject: resetOtpTemplate.subject,
        html: updatedTemplateHtml,
      };
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          throw new ForbiddenException('There is an issue with sending otp');
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      return 'Email sent to the registered email address';
    } catch (error) {
      await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'AUTH003',
        error,
        'ForgotPasswordScreen',
        '',
        {
          artifact: 'ForgotPasswordScreen',
          users: email.split("@")[0],
        },
      );
      await this.throwCustomException(error);
    }
  }

  async verifyOtp(email: string, otp: string) {
    try {
      if (!email || !otp)
        throw new BadRequestException('email or otp is required');
      const otpCacheKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:otp`;
      const otpJsonFromRedis = await this.redisService.getJsonData(
        otpCacheKey,
        process.env.CLIENTCODE,
      );
      if (!otpJsonFromRedis) throw new NotFoundException('otp not found');
      const otpJson = JSON.parse(otpJsonFromRedis);
      const existingIndex = otpJson.findIndex(
        (ele) => ele.email == email && ele.otp == otp,
      );
      if (existingIndex == -1) throw new NotFoundException('invalid otp');
      otpJson.splice(existingIndex, 1);
      await this.redisService.setJsonData(
        otpCacheKey,
        JSON.stringify(otpJson),
        process.env.CLIENTCODE,
      );
      return true;
    } catch (error) {
      await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'AUTH004',
        error,
        'ForgotPasswordScreen',
        '',
        {
          artifact: 'ForgotPasswordScreen',
          users: email.split("@")[0],
        },
      );
      await this.throwCustomException(error);
    }
  }

  async resetPassword(email: string, password: string) {
    try {
      if (!email || !password) {
      throw new BadRequestException('Please provide valid email and password');
      }

      const tenantUserKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:users`;
      const tenantUserResponse = await this.redisService.getJsonData(
        tenantUserKey,
        process.env.CLIENTCODE,
      );
      if (!tenantUserResponse) {
        throw new NotFoundException('No data found');
      }

      const tenantList: any[] = JSON.parse(tenantUserResponse);
      const index = tenantList.findIndex(
        (user) => user.email.toLowerCase() === email.toLowerCase(),
      );
      if (index === -1) {
        throw new NotFoundException('User not found');
      }
      const tenantUser = tenantList[index];

      // --- FusionAuth flow ---
      if (process.env.DEFAULT_AUTHENTICATION === 'fusionauth') {
        const fusionAuthTenantId = process.env.FUSIONAUTH_TENANTID;
        const uniqueId = tenantUser.userUniqueId;

        if (!fusionAuthTenantId || !uniqueId) {
          throw new NotFoundException(
            `Missing FusionAuth tenantId or userUniqueId`,
          );
        }

        const value = await this.handleFusionResetPassWord(
          fusionAuthTenantId,
          password,
          uniqueId,
        );
      console.log("value", value)
        if (value.status !== 200) {
          throw new UnauthorizedException(
            value?.error ?? 'FusionAuth password update failed',
          );
        }
      }

      // --- Update Redis only after FusionAuth success (or if not fusionauth) ---
      tenantUser.password = this.hashPassword(password);
      tenantList.splice(index, 1, tenantUser);
      await this.redisService.setJsonData(
        tenantUserKey,
        JSON.stringify(tenantList),
        process.env.CLIENTCODE,
      );

      return 'Password updated successfully';
    } catch (error) {
      await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'AUTH005',
        error,
        'ForgotPasswordScreen',
        '',
        {
          artifact: 'ForgotPasswordScreen',
          users: email.split("@")[0],
        },
      );
      await this.throwCustomException(error);
    }
  }
  
  async handleFusionResetPassWord(
    fusionAuthTenantId: string,
    password: string,
    uniqueId: string,
  ) {
    try {
      const config = this.getConfig();
      const fusionAuthBaseUrl = config.fusionAuthBaseUrl;
      const fusionAuthApiKey = config.fusionAuthApiKey

      const url = `${fusionAuthBaseUrl}/api/user/${uniqueId}`;
      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: fusionAuthApiKey,
          'Content-Type': 'application/json',
          'X-FusionAuth-TenantId': fusionAuthTenantId,
        },
        body: JSON.stringify({
          user: {
            password: password,
          },
        }),
      });
      if (!res.ok) {
        const error = await res.text();
        throw new UnauthorizedException(
          `FusionAuth password update failed: ${error}`,
        );
      }

      const data = await res.json();
      return {
        status: res.status,
        data: data,
      };
    } catch (error) {
      return {
        error: error,
        status: 500,
      };
    }
  }

  async sendMailOTP(email: string) {
    try {
      if (!email) {
        throw new BadRequestException('Not enough data to continue');
      }
      const otp = Math.floor(100000 + Math.random() * 900000);
      const responseFromRedis = await this.redisService.getJsonData(
        'CK:TRL:FNGK:AFR:FNK:PORTAL:CATK:EMAILTEMPLATE:AFGK:TORUS:AFK:MAILVERIFICATIONOTP:AFVK:v1:TPI',
        process.env.CLIENTCODE,
      );
      const verificationTemplate = JSON.parse(responseFromRedis);
      const updatedTemplate = (verificationTemplate.text as string)
        .replace('${email}', email.split('@')[0])
        .replace('${otp}', `${otp}`);
      const fabricatedUserName = email.split('@')[0];
      const mailOptions = {
        from: 'support@torus.tech',
        to: email,
        subject: verificationTemplate.subject,
        // text: updatedTemplate,
        html: verificationTemplate.html
          .replace(
            '${email}',
            fabricatedUserName.charAt(0).toUpperCase() +
              fabricatedUserName.slice(1),
          )
          .replace('${otp}', `${otp}`),
      };
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.log('Please check email is correct');
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      return { otp: otp, message: `Email sent` };
    } catch (error) {
      console.log(error);
    }
  }

  async getEndPoints(input) {
    try {
      const specData = input.data;
      if (!specData) throw 'Please provide data';

      const typeMap = {
        utf: 'application/json; charset=utf-8',
        json: 'application/json',
        jwt: 'application/jwt',
        xml: 'application/xml',
        url: 'application/x-www-form-urlencoded',
        form: 'multipart/form-data',
        text: 'text/plain',
        html: 'text/html',
        css: 'text/css',
        pdf: 'application/pdf',
        any: '*/*',
      };

      const contentType =
        typeMap[input.type] ||
        (() => {
          throw 'Please provide content type';
        })();

      const paths = specData?.paths;
      if (!paths || Object.keys(paths).length === 0)
        throw 'Endpoints not found';

      let finalResult = [];
      const getContentTypes = (endpointData, statusCode) => {
        const response = endpointData?.responses?.[statusCode]?.content;
        if (response) return Object.keys(response);

        const request = endpointData?.requestBody?.content;
        if (request) return Object.keys(request);

        const ref = endpointData?.responses?.[statusCode]?.$ref;
        if (ref || endpointData?.requestBody?.[statusCode]?.$ref) {
          const refParts = ref.split('/');
          const responseParameter = refParts.pop();
          const pathParameter = refParts[refParts.length - 2];
          const componentContent =
            specData?.components?.[pathParameter]?.[responseParameter]?.content;
          if (componentContent) return Object.keys(componentContent);
        }

        return [];
      };

      const processEndpoint = (endPoint, method, endpointData) => {
        let allContentTypes;
        if (method === 'get') {
          allContentTypes = getContentTypes(endpointData, 200);
        } else {
          allContentTypes = [
            ...getContentTypes(endpointData, 200),
            ...getContentTypes(endpointData, 201),
            ...getContentTypes(endpointData, 204),
          ];
        }

        if (allContentTypes.includes(contentType)) {
          finalResult.push({ endPoint, method, contentType });
        } else if (method == 'delete') {
          finalResult.push({ endPoint, method, contentType: null });
        }
      };

      Object.keys(paths).forEach((endPoint) => {
        const methods = Object.keys(paths[endPoint]);
        methods.forEach((method) => {
          const endpointData = paths[endPoint][method];
          if (Array.isArray(endpointData)) throw 'Please provide valid json';
          processEndpoint(endPoint, method, endpointData);
        });
      });

      if (finalResult.length > 0) {
        return finalResult;
      } else {
        throw 'Type Mismatched';
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async createApiCollection(input, collectionName) {
    try {
      let tenant = input.tenant;
      let domain = input.domain;
      let collection = input.collection;
      let loginId = input.loginId;
      let schema = input.data;
      let endPointCategory = input.endpoint;
      let fabric = input.fabric;
      if (
        !tenant ||
        !domain ||
        !collection ||
        !loginId ||
        !schema ||
        !endPointCategory ||
        !fabric
      )
        throw 'Invalid Payload';

      var successFlg = 0;
      var methodCount = 0;
      if (!schema) throw 'Please provide data';

      //schema = JSON.parse(fs.readFileSync('C:/Users/priyah/Downloads/BankDataSharingAPI.json', 'utf8'));

      //Replacing Reference with value
      let data = await this.replaceRefs(schema);
      if (data?.servers?.length > 0) {
        var serverUrl = data?.servers[0]?.url;
      } else {
        throw 'Server URL not found';
      }

      if (
        data?.paths &&
        typeof data?.paths === 'object' &&
        !Array.isArray(data?.paths)
      ) {
        if (endPointCategory && endPointCategory.length > 0) {
          let typeCheck = 0;
          for (let i = 0; i < endPointCategory.length; i++) {
            let uniqueNodeid = uuid().replace(/-/g, '');
            let endPoint = endPointCategory[i].endPoint;
            let methodName = endPointCategory[i].method;
            var contentType = endPointCategory[i].contentType;

            if (Array.isArray(data?.paths[endPoint])) {
              throw 'Please provide valid json';
            }

            let wholeResponseModel = {};
            methodCount++;
            let artifactName = endPoint.split('/');
            artifactName.shift();

            let endpointData = schema?.paths[endPoint][methodName];
            let ReqContent = endpointData?.requestBody?.content;
            let ResContent, responseRef;

            if (data?.paths[endPoint][methodName]) {
              var contentJson = JSON.parse(
                JSON.stringify(data?.paths[endPoint][methodName]),
              );
              if (endpointData?.requestBody) {
                let oldContent;
                if (contentJson?.requestBody?.content[contentType]) {
                  oldContent = contentJson?.requestBody?.content[contentType];
                } else if (contentJson?.requestBody?.content['*/*']) {
                  oldContent = contentJson?.requestBody?.content['*/*'];
                  contentType = '*/*';
                }
                if (!oldContent) {
                  typeCheck++;
                }
                contentJson.requestBody.content = { [contentType]: oldContent };
              }

              if (endpointData?.responses) {
                let responseArr = endpointData?.responses;

                for (let k = 0; k < Object.keys(responseArr).length; k++) {
                  if (
                    data?.paths[endPoint][methodName]?.responses[
                      Object.keys(responseArr)[k]
                    ]?.content
                  ) {
                    let oldContent;
                    if (
                      contentJson?.responses[Object.keys(responseArr)[k]]
                        ?.content[contentType]
                    ) {
                      oldContent =
                        contentJson?.responses[Object.keys(responseArr)[k]]
                          ?.content[contentType];
                    } else if (
                      contentJson?.responses[Object.keys(responseArr)[k]]
                        ?.content['*/*']
                    ) {
                      oldContent =
                        contentJson?.responses[Object.keys(responseArr)[k]]
                          ?.content['*/*'];
                      contentType = '*/*';
                    }

                    if (!oldContent) {
                      typeCheck++;
                    }
                    contentJson.responses[Object.keys(responseArr)[k]].content =
                      { [contentType]: oldContent };
                  }
                }
              }
            }
            //Setting requestbody
            let requestRef = ReqContent?.[contentType]?.schema?.$ref;

            if (requestRef) {
              let requestParameter = requestRef?.split('/').pop();
              var ModelArr = [];
              await this.getModel(
                schema,
                requestParameter,
                ModelArr,
                contentType,
              );

              var RequestDto = {};
              await this.getReferenceModel(
                schema,
                requestParameter,
                RequestDto,
                contentType,
              );
            }

            //Setting Response
            if (methodName == 'get') {
              if (endpointData?.responses?.[201]?.content) {
                ResContent = endpointData?.responses?.[201]?.content;
              } else if (endpointData?.responses?.[200]?.content) {
                ResContent = endpointData?.responses?.[200]?.content;
              }
              if (ResContent?.[contentType]?.schema?.$ref)
                responseRef = ResContent?.[contentType]?.schema?.$ref;
              else if (endpointData?.responses?.[200]?.$ref)
                responseRef = endpointData?.responses?.[200]?.$ref;
            } else if (methodName == 'post') {
              if (endpointData?.responses?.[201]?.content) {
                ResContent = endpointData?.responses?.[201]?.content;
              } else if (endpointData?.responses?.[200]?.content) {
                ResContent = endpointData?.responses?.[200]?.content;
              }
              if (ResContent?.[contentType]?.schema?.$ref)
                responseRef = ResContent?.[contentType]?.schema?.$ref;
              else if (endpointData?.responses?.[201]?.$ref)
                responseRef = endpointData?.responses?.[201]?.$ref;
            } else if (methodName == 'patch') {
              ResContent = endpointData?.responses?.[204]?.content;
              if (ResContent?.[contentType]?.schema?.$ref)
                responseRef = ResContent?.[contentType]?.schema?.$ref;
              else if (endpointData?.responses?.[204]?.$ref)
                responseRef = endpointData?.responses?.[204]?.$ref;
            }

            if (responseRef) {
              let responseParameter = responseRef?.split('/').pop();
              let pathParameter =
                responseRef?.split('/')[(responseRef?.split('/')).length - 2];

              var ResponseModelArr = [];
              await this.getResponseModel(
                schema,
                pathParameter,
                responseParameter,
                ResponseModelArr,
                contentType,
              );

              var ResponseDto = {};
              await this.getReferenceResponseModel(
                schema,
                pathParameter,
                responseParameter,
                ResponseDto,
                contentType,
              );
            }

            let key;
            let newVersion;

            let afkName = `${artifactName[0] && artifactName[artifactName.length - 1] ? methodName + '_' + artifactName.join('_') : methodName}`;
            if (afkName.includes('{') || afkName.includes('}')) {
              afkName = afkName.replaceAll('{', '').replaceAll('}', '');
            }

            if (afkName.includes('-')) {
              afkName = afkName.replaceAll('-', '_');
            }

            // let apiVersionsArr = await this.apiService.getArtifactVersion(`CK:${tenant}:FNGK:AF:FNK:${fabric}:CATK:${domain}:AFGK:${collection}:AFK:${afkName}`)
            // if(apiVersionsArr?.length>0){
            //   newVersion = Math.max( ...apiVersionsArr.map((item) => parseInt(item.slice(1)))) + 1;
            // }else{
            newVersion = 1;
            //}
            key = `CK:${tenant}:FNGK:AF:FNK:${fabric}:CATK:${domain}:AFGK:${collection}:AFK:${afkName}:AFVK:v${newVersion}`;

            if (ResponseModelArr && ResponseModelArr.length > 0) {
              ResponseModelArr = ResponseModelArr.filter(
                (value, index, self) =>
                  index ===
                  self.findIndex(
                    (t) => JSON.stringify(t) === JSON.stringify(value),
                  ),
              );
            }

            if (ModelArr && ModelArr.length > 0) {
              ModelArr = ModelArr.filter(
                (value, index, self) =>
                  index ===
                  self.findIndex(
                    (t) => JSON.stringify(t) === JSON.stringify(value),
                  ),
              );
            }

            //Setting JSON for Parameter and Request

            var requestSchema =
              data.paths[endPoint][methodName]?.requestBody?.content[
                contentType
              ]?.schema;
            var parameterSchema = data.paths[endPoint][methodName]?.parameters;

            var transformSchema = (requestSchema) => {
              const transformProperties = (properties) => {
                const result = {};
                if (Array.isArray(properties) && properties.length > 0) {
                  for (let i = 0; i < properties.length; i++) {
                    if (!result[properties[i]?.in]) {
                      result[properties[i]?.in] = {};
                    }

                    if (properties[i]?.schema?.type == 'string') {
                      Object.assign(result[properties[i]?.in], {
                        [properties[i]?.name]: '',
                      });
                    } else if (
                      properties[i]?.schema?.type == 'number' ||
                      properties[i]?.schema?.type == 'integer'
                    ) {
                      Object.assign(result[properties[i]?.in], {
                        [properties[i]?.name]: 0,
                      });
                    } else if (properties[i]?.schema?.type == 'boolean') {
                      Object.assign(result[properties[i]?.in], {
                        [properties[i]?.name]: false,
                      });
                    } else if (properties[i]?.schema?.type == 'object') {
                      Object.assign(result[properties[i]?.in], {
                        [properties[i]?.name]: {},
                      });
                    } else if (properties[i]?.schema?.type == 'array') {
                      Object.assign(result[properties[i]?.in], {
                        [properties[i]?.name]: [],
                      });
                    }
                  }
                } else if (typeof properties === 'object') {
                  for (const key in properties) {
                    const prop = properties[key];
                    if (prop.type === 'object') {
                      result[key] = transformProperties(prop?.properties);
                    } else if (prop.type === 'array') {
                      if (prop.items && prop.items.type === 'object') {
                        result[key] = [
                          transformProperties(prop.items?.properties),
                        ];
                      } else {
                        if (prop?.type == 'string') {
                          result[key] = '';
                        } else if (
                          prop?.type == 'number' ||
                          prop?.type == 'integer'
                        ) {
                          result[key] = 0;
                        } else if (prop?.type == 'boolean') {
                          result[key] = false;
                        } else if (prop?.type == 'object') {
                          result[key] = {};
                        } else if (prop?.type == 'array') {
                          result[key] = [];
                        }
                      }
                    } else if (prop.oneOf) {
                      for (let item of prop.oneOf) {
                        if (item.type === 'object') {
                          if (!result[key]) {
                            result[key] = {};
                          }
                          Object.assign(
                            result[key],
                            transformProperties(item?.properties),
                          );
                        }
                      }
                    } else if (prop.allOf) {
                      for (let item of prop.allOf) {
                        if (item.type === 'object') {
                          if (!result[key]) {
                            result[key] = {};
                          }
                          Object.assign(
                            result[key],
                            transformProperties(item?.properties),
                          );
                        }
                      }
                    } else {
                      if (prop?.type == 'string') {
                        result[key] = '';
                      } else if (
                        prop?.type == 'number' ||
                        prop?.type == 'integer'
                      ) {
                        result[key] = 0;
                      } else if (prop?.type == 'boolean') {
                        result[key] = false;
                      } else if (prop?.type == 'object') {
                        result[key] = {};
                      } else if (prop?.type == 'array') {
                        result[key] = [];
                      }
                    }
                  }
                }
                return result;
              };
              if (Array.isArray(requestSchema)) {
                return transformProperties(requestSchema);
              } else if (requestSchema?.properties) {
                return transformProperties(requestSchema.properties);
              }
            };

            var requestJsonFromSchema: any = transformSchema(requestSchema);
            var parameterJsonFromSchema: any = transformSchema(parameterSchema);

            Object.assign(wholeResponseModel, ResponseDto);

            let ndp = await this.redisService.setJsonData(
              key + ':NDP',
              JSON.stringify({
                [uniqueNodeid]: {
                  nodeId: uniqueNodeid,
                  nodeName: `${artifactName.join('_')}`,
                  nodeType: 'endpointnode',
                  version: 'endpointnode:v1',
                  data: {
                    [methodName]: contentJson,
                    requestJson: requestJsonFromSchema,
                    parameterJson: parameterJsonFromSchema,
                    // servers:schema.servers,

                    serverUrl: serverUrl,
                    method: methodName.toUpperCase(),
                    endPoint: endPoint,
                    apiEndpoint: endPoint,
                    specification: {
                      data: {
                        [methodName]: schema?.paths[endPoint][methodName],
                        models: RequestDto,
                        responsemodels: wholeResponseModel,
                      },
                    },
                  },
                  models: ModelArr,
                  responsemodels: ResponseModelArr,
                },
              }),
              collectionName,
            );

            let ndsData = {
              id: uniqueNodeid,
              type: 'endpointnode',
              position: {
                x: 150,
                y: 150,
              },
              T_parentId: [],
              version: 'endpointnode:v1',
              data: {
                label: `${artifactName.join('_')}`,
                nodeColor: '',
                role: 'testing',
                nodeProperty: {
                  nodeId: uniqueNodeid,
                  nodeName: `${artifactName.join('_')}`,
                  nodeType: 'endpointnode',
                  data: {
                    [methodName]: contentJson,
                  },
                },
              },
              property: {
                name: `${artifactName.join('_')}`,
                nodeType: 'endpointnode',
                description: '',
              },
              IPC_flag: 'N',
              width: 45,
              height: 45,
              selected: false,
              dragging: false,
            };

            let nds = await this.redisService.setJsonData(
              key + ':NDS',
              JSON.stringify([ndsData]),
              collectionName,
            );

            let nde = await this.redisService.setJsonData(
              key + ':NDE',
              JSON.stringify([]),
              collectionName,
            );

            let afi = await this.redisService.setJsonData(
              key + ':AFI',
              JSON.stringify({
                executionMode: '',
                createdBy: loginId,
                createdOn: new Date(),
                updatedBy: loginId,
                updatedOn: '',
                isLocked: false,
              }),
              collectionName,
            );

            // if (
            //   methodName.toLowerCase() == 'post' ||
            //   methodName.toLowerCase() == 'patch' ||
            //   methodName.toLowerCase() == 'delete'
            // ) {
            //   let dfdKey = `CK:${tenant}:FNGK:AF:FNK:DF-DFD:CATK:${domain}:AFGK:${collection}:AFK:${afkName}:AFVK:v${newVersion}`;

            //   if (
            //     !(await this.redisService.exist(
            //       dfdKey + ':NDP',
            //       collectionName,
            //     ))
            //   ) {
            //     await this.redisService.setJsonData(
            //       dfdKey + ':NDP',
            //       JSON.stringify({}),
            //       collectionName,
            //     );
            //   }
            // }

            if (
              ndp == 'Value Stored' &&
              nds == 'Value Stored' &&
              nde == 'Value Stored' &&
              afi == 'Value Stored'
            ) {
              successFlg++;
            }
            ModelArr = null;
            ResponseModelArr = null;
            RequestDto = null;
            ResponseDto = null;
          }

          if (typeCheck == methodCount) {
            throw `Provided contentType, ${contentType} is not supported`;
          }

          if (successFlg == methodCount) {
            return { status: 'success', message: 'Artifact created' };
          } else {
            return { status: 'failed', message: 'Artifact creation failed' };
          }
        } else {
          throw 'Endpoint not found';
        }
      } else {
        throw 'Path not found';
      }
    } catch (error) {
      console.log('Reference Error', error);
      await this.throwCustomException(error);
    }
  }

  // async replaceRefs(schema: any) {
  //   // schema = JSON.parse(fs.readFileSync('C:/Users/priyah/Downloads/BankDataSharingAPI.json', 'utf8'));
  //   const components = schema.components || {};

  //   const resolveRefs = (obj: any): any => {
  //     if (Array.isArray(obj)) {
  //       return obj.map(resolveRefs);
  //     } else if (typeof obj === 'object' && obj !== null) {
  //       // delete obj.description;
  //       if (obj.$ref) {
  //         const refPath = obj.$ref.replace(/^#\/components\//, '').split('/');
  //         let refValue: any = components;
  //         for (const path of refPath) {
  //           refValue = refValue?.[path];
  //         }
  //         return resolveRefs(refValue);
  //       }

  //       return Object.fromEntries(
  //         Object.entries(obj).map(([key, value]) => [key, resolveRefs(value)]),
  //       );
  //     }
  //     return obj;
  //   };

  //   return resolveRefs(schema);
  // }

  async replaceRefs(schema: any) {
    const components = schema.components || {};

    const resolveRefs = (obj: any, propName = ''): any => {
      if (Array.isArray(obj)) {
        return obj.map((item) => resolveRefs(item, propName));
      }

      if (typeof obj === 'object' && obj !== null) {
        if (obj.$ref) {
          const refPath = obj.$ref.replace(/^#\/components\//, '').split('/');
          const schemaName = refPath[refPath.length - 1];

          let refValue: any = components;
          for (const path of refPath) {
            refValue = refValue?.[path];
          }

          const resolved = resolveRefs(refValue, propName);
          return {
            ...resolved,
            // Optionally include name here as well
          };
        }

        // Create a shallow copy first to avoid mutating the input
        const newObj: any = { ...obj };

        // Handle oneOf and allOf by resolving and adding names
        if (newObj.oneOf || newObj.allOf) {
          const key = newObj.oneOf ? 'oneOf' : 'allOf';
          newObj[key] = newObj[key].map((item: any) => {
            if (item.$ref) {
              const refPath = item.$ref
                .replace(/^#\/components\//, '')
                .split('/');
              const schemaName = refPath[refPath.length - 1];

              let refValue: any = components;
              for (const path of refPath) {
                refValue = refValue?.[path];
              }

              const resolved = resolveRefs(refValue, propName);
              return {
                keyName: schemaName,
                ...resolved,
              };
            } else {
              return resolveRefs(item, propName);
            }
          });
        }

        // Recursively resolve other keys
        for (const [key, value] of Object.entries(newObj)) {
          newObj[key] = resolveRefs(value, key);
        }

        return newObj;
      }

      return obj;
    };

    return resolveRefs(schema);
  }

  async getModel(data, requestParameter, nestedModelArr, contentType) {
    try {
      const processProperties = async (properties: any, dto) => {
        if (properties) {
          let propArr = Object.keys(properties);
          let propval: any = Object.values(properties);

          if (propArr?.length > 0) {
            for (let i = 0; i < propArr.length; i++) {
              if (
                propval[i]?.properties &&
                Object.keys(propval[i]?.properties).length > 0
              ) {
                await processProperties(propval[i]?.properties, dto);
              } else if (propval[i]?.oneOf) {
                for (let j = 0; j < propval[i].oneOf.length; j++) {
                  if (propval[i].oneOf[j].$ref) {
                    let nestedSchema = propval[i].oneOf[j].$ref.split('/');
                    if (
                      data?.components?.[
                        nestedSchema[nestedSchema.length - 2]
                      ]?.[nestedSchema[nestedSchema.length - 1]]?.type
                    )
                      dto[requestParameter][propArr[i]] =
                        data?.components?.[
                          nestedSchema[nestedSchema.length - 2]
                        ]?.[nestedSchema[nestedSchema.length - 1]]?.type;
                    else dto[requestParameter][propArr[i]] = 'object';

                    await this.getModel(
                      data,
                      nestedSchema[nestedSchema.length - 1],
                      nestedModelArr,
                      contentType,
                    );
                  }
                }
              } else if (propval[i]?.allOf) {
                for (let j = 0; j < propval[i].allOf.length; j++) {
                  if (propval[i].allOf[j].$ref) {
                    let nestedSchema = propval[i].allOf[j].$ref.split('/');
                    if (
                      data?.components?.[
                        nestedSchema[nestedSchema.length - 2]
                      ]?.[nestedSchema[nestedSchema.length - 1]]?.type
                    )
                      dto[requestParameter][propArr[i]] =
                        data?.components?.[
                          nestedSchema[nestedSchema.length - 2]
                        ]?.[nestedSchema[nestedSchema.length - 1]]?.type;
                    else dto[requestParameter][propArr[i]] = 'object';

                    await this.getModel(
                      data,
                      nestedSchema[nestedSchema.length - 1],
                      nestedModelArr,
                      contentType,
                    );
                  }
                }
              } else if (propval[i]?.items?.properties) {
                await processProperties(propval[i]?.items?.properties, dto);
              } else if (propval[i]?.items?.$ref) {
                dto[requestParameter][propArr[i]] = propval[i]?.type;
                let nestedSchema = propval[i]?.items?.$ref.split('/');
                await this.getModel(
                  data,
                  nestedSchema[nestedSchema.length - 1],
                  nestedModelArr,
                  contentType,
                );
              } else if (propval[i]?.$ref) {
                let nestedSchema = propval[i]?.$ref?.split('/');
                if (!propval[i]?.properties && !propval[i]?.items) {
                  if (
                    data?.components?.[nestedSchema[nestedSchema.length - 2]]?.[
                      nestedSchema[nestedSchema.length - 1]
                    ]?.type
                  )
                    dto[requestParameter][propArr[i]] =
                      data?.components?.[
                        nestedSchema[nestedSchema.length - 2]
                      ]?.[nestedSchema[nestedSchema.length - 1]]?.type;
                  else dto[requestParameter][propArr[i]] = 'object';
                }
                await this.getModel(
                  data,
                  nestedSchema[nestedSchema.length - 1],
                  nestedModelArr,
                  contentType,
                );
              }

              if (propval[i].type) {
                dto[requestParameter][propArr[i]] = propval[i].type;
              }
            }
          }
        }
      };

      if (data?.components?.schemas[requestParameter]) {
        if (
          data?.components?.schemas[requestParameter]?.properties ||
          data?.components?.schemas[requestParameter]?.items?.properties
        ) {
          if (data?.components?.schemas[requestParameter]?.properties) {
            var propertyArr = Object.keys(
              data?.components?.schemas[requestParameter]?.properties,
            );
            var type: any = Object.values(
              data?.components?.schemas[requestParameter]?.properties,
            );
          } else if (
            data?.components?.schemas[requestParameter]?.items?.properties
          ) {
            var propertyArr = Object.keys(
              data?.components?.schemas[requestParameter]?.items?.properties,
            );
            var type: any = Object.values(
              data?.components?.schemas[requestParameter]?.items?.properties,
            );
          }

          var dto = { [requestParameter]: {} };
          // var dto = {}
          if (propertyArr?.length > 0) {
            for (let i = 0; i < propertyArr.length; i++) {
              if (type[i]?.properties) {
                await processProperties(type[i]?.properties, dto);
              } else if (type[i]?.items && type[i].items?.$ref) {
                if (typeof dto[requestParameter] == 'object')
                  dto[requestParameter][propertyArr[i]] = type[i]?.type;

                let nestedSchema = type[i].items?.$ref.split('/');
                await this.getModel(
                  data,
                  nestedSchema[nestedSchema.length - 1],
                  nestedModelArr,
                  contentType,
                );
              } else if (type[i].$ref) {
                let nestedSchema = type[i].$ref.split('/');
                if (!type[i]?.properties && !type[i]?.items) {
                  if (typeof dto[requestParameter] == 'object') {
                    if (
                      data?.components?.[
                        nestedSchema[nestedSchema.length - 2]
                      ]?.[nestedSchema[nestedSchema.length - 1]]?.type
                    )
                      dto[requestParameter][propertyArr[i]] =
                        data?.components?.[
                          nestedSchema[nestedSchema.length - 2]
                        ]?.[nestedSchema[nestedSchema.length - 1]]?.type;
                    else dto[requestParameter][propertyArr[i]] = 'object';
                  }
                }

                await this.getModel(
                  data,
                  nestedSchema[nestedSchema.length - 1],
                  nestedModelArr,
                  contentType,
                );
              } else if (type[i].items?.properties) {
                await processProperties(type[i].items?.properties, dto);
              } else if (type[i]?.content?.[contentType]?.schema?.$ref) {
                let nestedSchema =
                  type[i]?.content?.[contentType]?.schema?.$ref.split('/');
                await this.getModel(
                  data,
                  nestedSchema[nestedSchema.length - 1],
                  nestedModelArr,
                  contentType,
                );
              } else if (type[i].allOf) {
                let allOf = type[i].allOf;
                for (let j = 0; j < allOf.length; j++) {
                  var dto = { [requestParameter]: {} };
                  if (allOf[j].$ref) {
                    let nestedSchema = allOf[j]?.$ref.split('/');
                    if (
                      data?.components?.[
                        nestedSchema[nestedSchema.length - 2]
                      ]?.[nestedSchema[nestedSchema.length - 1]]?.type
                    )
                      dto[requestParameter][propertyArr[i]] =
                        data?.components?.[
                          nestedSchema[nestedSchema.length - 2]
                        ]?.[nestedSchema[nestedSchema.length - 1]]?.type;
                    else dto[requestParameter][propertyArr[i]] = 'object';

                    await this.getModel(
                      data,
                      nestedSchema[nestedSchema.length - 1],
                      nestedModelArr,
                      contentType,
                    );
                  } else if (allOf[j]?.properties) {
                    await processProperties(allOf[j].properties, dto);
                  }
                }
              }

              if (type[i].type) {
                dto[requestParameter][propertyArr[i]] = type[i].type;
              }
            }
          }

          nestedModelArr.push(dto);
          return dto;
        } else if (data?.components?.schemas[requestParameter]?.items?.$ref) {
          if (data?.components?.schemas[requestParameter]?.type) {
            var dto = { [requestParameter]: {} };
            dto[requestParameter] =
              data?.components?.schemas[requestParameter]?.type;
            nestedModelArr.push(dto);
          }
          let nestedSchema =
            data?.components?.schemas[requestParameter]?.items.$ref.split('/');
          await this.getModel(
            data,
            nestedSchema[nestedSchema.length - 1],
            nestedModelArr,
            contentType,
          );
        } else if (
          data?.components?.schemas?.[requestParameter]?.items?.properties
        ) {
          await processProperties(
            data?.components?.schemas?.[requestParameter]?.items?.properties,
            dto,
          );
        } else if (
          !data?.components?.schemas[requestParameter]?.properties &&
          !data?.components?.schemas[requestParameter]?.items &&
          data?.components?.schemas[requestParameter]?.type
        ) {
          let dto = {};
          dto[requestParameter] =
            data?.components?.schemas[requestParameter]?.type;
          nestedModelArr.push(dto);
        } else if (data?.components?.schemas?.[requestParameter]?.allOf) {
          let allOf = data?.components?.schemas?.[requestParameter]?.allOf;
          for (let j = 0; j < allOf.length; j++) {
            var dto = { [requestParameter]: {} };
            if (allOf[j].$ref) {
              let nestedSchema = allOf[j]?.$ref.split('/');
              if (
                data?.components?.[nestedSchema[nestedSchema.length - 2]]?.[
                  nestedSchema[nestedSchema.length - 1]
                ]?.type
              )
                dto[requestParameter] =
                  data?.components?.[nestedSchema[nestedSchema.length - 2]]?.[
                    nestedSchema[nestedSchema.length - 1]
                  ]?.type;
              else dto[requestParameter] = 'object';

              await this.getModel(
                data,
                nestedSchema[nestedSchema.length - 1],
                nestedModelArr,
                contentType,
              );
            } else if (allOf[j]?.properties) {
              await processProperties(allOf[j].properties, dto);
            }
          }
        }
      }
    } catch (error) {
      console.log('Reference Error', error);
      await this.throwCustomException(error);
    }
  }

  async getReferenceModel(
    data,
    requestParameter,
    ReferenceResponseDto,
    contentType,
  ) {
    try {
      const processProperties = async (
        properties: any,
        ReferenceResponseDto,
      ) => {
        if (properties) {
          let propArr = Object.keys(properties);
          let propval: any = Object.values(properties);

          if (propArr?.length > 0) {
            for (let i = 0; i < propArr.length; i++) {
              if (
                propval[i]?.properties &&
                Object.keys(propval[i]?.properties).length > 0
              ) {
                await processProperties(
                  propval[i]?.properties,
                  ReferenceResponseDto,
                );
              } else if (propval[i]?.oneOf) {
                for (let j = 0; j < propval[i].oneOf.length; j++) {
                  if (propval[i].oneOf[j].$ref) {
                    let nestedSchema = propval[i].oneOf[j].$ref.split('/');

                    await this.getReferenceModel(
                      data,
                      nestedSchema[nestedSchema.length - 1],
                      ReferenceResponseDto,
                      contentType,
                    );
                  }
                }
              } else if (propval[i]?.allOf) {
                for (let j = 0; j < propval[i].allOf.length; j++) {
                  if (propval[i].allOf[j].$ref) {
                    let nestedSchema = propval[i].allOf[j].$ref.split('/');
                    await this.getReferenceModel(
                      data,
                      nestedSchema[nestedSchema.length - 1],
                      ReferenceResponseDto,
                      contentType,
                    );
                  }
                }
              } else if (propval[i]?.items?.properties) {
                await processProperties(
                  propval[i]?.items?.properties,
                  ReferenceResponseDto,
                );
              } else if (propval[i]?.items?.$ref) {
                ReferenceResponseDto[propArr[i]] = propval[i].type;
                let nestedSchema = propval[i]?.items?.$ref.split('/');
                await this.getReferenceModel(
                  data,
                  nestedSchema[nestedSchema.length - 1],
                  ReferenceResponseDto,
                  contentType,
                );
              } else if (propval[i]?.$ref) {
                let nestedSchema = propval[i]?.$ref.split('/');
                ReferenceResponseDto[propArr[i]] =
                  data?.components?.[nestedSchema[nestedSchema.length - 2]]?.[
                    nestedSchema[nestedSchema.length - 1]
                  ]?.type;
                await this.getReferenceModel(
                  data,
                  nestedSchema[nestedSchema.length - 1],
                  ReferenceResponseDto,
                  contentType,
                );
              }

              if (propval[i].type) {
                ReferenceResponseDto[propArr[i]] = propval[i].type;
              }
            }
          }
        }
      };

      if (data?.components?.schemas[requestParameter]) {
        if (data?.components?.schemas[requestParameter]?.properties) {
          var propertyArr = Object.keys(
            data?.components?.schemas[requestParameter]?.properties,
          );
          var type: any = Object.values(
            data?.components?.schemas[requestParameter]?.properties,
          );

          if (propertyArr?.length > 0) {
            for (let i = 0; i < propertyArr.length; i++) {
              if (type[i]?.properties) {
                await processProperties(
                  type[i]?.properties,
                  ReferenceResponseDto,
                );
              } else if (type[i]?.items && type[i].items?.$ref) {
                ReferenceResponseDto[propertyArr[i]] = type[i].type;
                let nestedSchema = type[i].items?.$ref.split('/');
                await this.getReferenceModel(
                  data,
                  nestedSchema[nestedSchema.length - 1],
                  ReferenceResponseDto,
                  contentType,
                );
              } else if (type[i].$ref) {
                let nestedSchema = type[i].$ref.split('/');
                if (
                  !type[i]?.type &&
                  !type[i]?.properties &&
                  !type[i]?.properties
                ) {
                  ReferenceResponseDto[propertyArr[i]] =
                    data?.components?.[nestedSchema[nestedSchema.length - 2]]?.[
                      nestedSchema[nestedSchema.length - 1]
                    ]?.type;
                  // ReferenceResponseDto[propertyArr[i]] = 'object';
                }

                await this.getReferenceModel(
                  data,
                  nestedSchema[nestedSchema.length - 1],
                  ReferenceResponseDto,
                  contentType,
                );
              } else if (type[i]?.content?.[contentType]?.schema?.$ref) {
                let nestedSchema =
                  type[i]?.content?.[contentType]?.schema?.$ref.split('/');
                await this.getReferenceModel(
                  data,
                  nestedSchema[nestedSchema.length - 1],
                  ReferenceResponseDto,
                  contentType,
                );
              }

              if (type[i].type) {
                ReferenceResponseDto[propertyArr[i]] = type[i].type;
              }
              // else{
              //   ReferenceResponseDto[propertyArr[i]] = 'object'
              // }
            }
          }
          return ReferenceResponseDto;
        } else if (data?.components?.schemas[requestParameter]?.items?.$ref) {
          if (data?.components?.schemas[requestParameter]?.type) {
            ReferenceResponseDto[requestParameter] =
              data?.components?.schemas[requestParameter]?.type;
          }
          let nestedSchema =
            data?.components?.schemas[requestParameter]?.items.$ref.split('/');
          await this.getReferenceModel(
            data,
            nestedSchema[nestedSchema.length - 1],
            ReferenceResponseDto,
            contentType,
          );
        } else if (
          !data?.components?.schemas[requestParameter]?.properties &&
          !data?.components?.schemas[requestParameter]?.items &&
          data?.components?.schemas[requestParameter]?.type
        ) {
          ReferenceResponseDto[requestParameter] =
            data?.components?.schemas[requestParameter]?.type;
        } else if (data?.components?.schemas?.[requestParameter]?.allOf) {
          let allOf = data?.components?.schemas?.[requestParameter]?.allOf;
          for (let j = 0; j < allOf.length; j++) {
            var dto = { [requestParameter]: {} };
            if (allOf[j].$ref) {
              let nestedSchema = allOf[j]?.$ref.split('/');
              if (
                data?.components?.[nestedSchema[nestedSchema.length - 2]]?.[
                  nestedSchema[nestedSchema.length - 1]
                ]?.type
              )
                dto[requestParameter] =
                  data?.components?.[nestedSchema[nestedSchema.length - 2]]?.[
                    nestedSchema[nestedSchema.length - 1]
                  ]?.type;
              else dto[requestParameter] = 'object';

              await this.getReferenceModel(
                data,
                nestedSchema[nestedSchema.length - 1],
                ReferenceResponseDto,
                contentType,
              );
            } else if (allOf[j]?.properties) {
              await processProperties(allOf[j].properties, dto);
            }
          }
        }
      }
    } catch (error) {
      console.log('Reference Error', error);
      await this.throwCustomException(error);
    }
  }

  async getResponseModel(
    data,
    pathParameter,
    responseParameter,
    nestedModelArr,
    contentType,
  ) {
    try {
      const processProperties = async (properties: any, dto) => {
        if (properties) {
          let propArr = Object.keys(properties);
          let propval: any = Object.values(properties);

          if (propArr?.length > 0) {
            for (let i = 0; i < propArr.length; i++) {
              if (
                propval[i]?.properties &&
                Object.keys(propval[i]?.properties).length > 0
              ) {
                await processProperties(propval[i]?.properties, dto);
              } else if (propval[i]?.oneOf) {
                for (let j = 0; j < propval[i].oneOf.length; j++) {
                  if (propval[i].oneOf[j].$ref) {
                    let nestedSchema = propval[i].oneOf[j].$ref.split('/');
                    if (
                      data?.components?.[
                        nestedSchema[nestedSchema.length - 2]
                      ]?.[nestedSchema[nestedSchema.length - 1]]?.type
                    )
                      dto[responseParameter][propArr[i]] =
                        data?.components?.[
                          nestedSchema[nestedSchema.length - 2]
                        ]?.[nestedSchema[nestedSchema.length - 1]]?.type;
                    else dto[responseParameter][propArr[i]] = 'object';

                    await this.getResponseModel(
                      data,
                      nestedSchema[nestedSchema.length - 2],
                      nestedSchema[nestedSchema.length - 1],
                      nestedModelArr,
                      contentType,
                    );
                  }
                }
              } else if (propval[i]?.allOf) {
                for (let j = 0; j < propval[i].allOf.length; j++) {
                  if (propval[i].allOf[j].$ref) {
                    let nestedSchema = propval[i].allOf[j].$ref.split('/');
                    if (
                      data?.components?.[
                        nestedSchema[nestedSchema.length - 2]
                      ]?.[nestedSchema[nestedSchema.length - 1]]?.type
                    )
                      dto[responseParameter][propArr[i]] =
                        data?.components?.[
                          nestedSchema[nestedSchema.length - 2]
                        ]?.[nestedSchema[nestedSchema.length - 1]]?.type;
                    else dto[responseParameter][propArr[i]] = 'object';

                    await this.getResponseModel(
                      data,
                      nestedSchema[nestedSchema.length - 2],
                      nestedSchema[nestedSchema.length - 1],
                      nestedModelArr,
                      contentType,
                    );
                  }
                }
              } else if (propval[i]?.items?.properties) {
                await processProperties(propval[i]?.items?.properties, dto);
              } else if (propval[i]?.items?.$ref) {
                dto[responseParameter][propArr[i]] = propval[i]?.type;
                let nestedSchema = propval[i]?.items?.$ref.split('/');
                await this.getResponseModel(
                  data,
                  nestedSchema[nestedSchema.length - 2],
                  nestedSchema[nestedSchema.length - 1],
                  nestedModelArr,
                  contentType,
                );
              } else if (propval[i]?.$ref) {
                let nestedSchema = propval[i]?.$ref.split('/');
                if (!propval[i]?.properties && !propval[i]?.items) {
                  if (
                    data?.components?.[nestedSchema[nestedSchema.length - 2]]?.[
                      nestedSchema[nestedSchema.length - 1]
                    ]?.type
                  )
                    dto[responseParameter][propArr[i]] =
                      data?.components?.[
                        nestedSchema[nestedSchema.length - 2]
                      ]?.[nestedSchema[nestedSchema.length - 1]]?.type;
                  else dto[responseParameter][propArr[i]] = 'object';
                } else if (propval[i]?.properties) {
                  await processProperties(propval[i]?.properties, dto);
                }
                await this.getResponseModel(
                  data,
                  nestedSchema[nestedSchema.length - 2],
                  nestedSchema[nestedSchema.length - 1],
                  nestedModelArr,
                  contentType,
                );
              }

              if (propval[i].type) {
                dto[responseParameter][propArr[i]] = propval[i].type;
              }
            }
          }
        }
      };

      if (data?.components?.[pathParameter]?.[responseParameter]) {
        if (
          data?.components?.[pathParameter]?.[responseParameter]?.content?.[
            contentType
          ]?.schema?.$ref
        ) {
          let nestedSchema =
            data?.components?.[pathParameter]?.[responseParameter]?.content[
              contentType
            ].schema.$ref.split('/');
          await this.getResponseModel(
            data,
            nestedSchema[nestedSchema.length - 2],
            nestedSchema[nestedSchema.length - 1],
            nestedModelArr,
            contentType,
          );
        } else if (
          data?.components?.[pathParameter]?.[responseParameter]?.properties ||
          data?.components?.[pathParameter]?.[responseParameter]?.items
            ?.properties
        ) {
          if (
            data?.components?.[pathParameter]?.[responseParameter]?.properties
          ) {
            var propertyArr = Object.keys(
              data?.components?.[pathParameter]?.[responseParameter]
                ?.properties,
            );
            var type: any = Object.values(
              data?.components?.[pathParameter]?.[responseParameter]
                ?.properties,
            );
          } else if (
            data?.components?.[pathParameter]?.[responseParameter]?.items
              ?.properties
          ) {
            var propertyArr = Object.keys(
              data?.components?.[pathParameter]?.[responseParameter]?.items
                ?.properties,
            );
            var type: any = Object.values(
              data?.components?.[pathParameter]?.[responseParameter]?.items
                ?.properties,
            );
          }

          var dto = { [responseParameter]: {} };
          if (propertyArr?.length > 0) {
            for (let i = 0; i < propertyArr.length; i++) {
              if (type[i]?.properties) {
                await processProperties(type[i]?.properties, dto);
              } else if (type[i]?.items && type[i].items?.$ref) {
                dto[responseParameter][propertyArr[i]] = type[i]?.type;
                let nestedSchema = type[i].items?.$ref.split('/');
                await this.getResponseModel(
                  data,
                  nestedSchema[nestedSchema.length - 2],
                  nestedSchema[nestedSchema.length - 1],
                  nestedModelArr,
                  contentType,
                );
              } else if (type[i].$ref) {
                let nestedSchema = type[i].$ref.split('/');
                if (!type[i]?.properties && !type[i]?.items) {
                  if (
                    data?.components?.[nestedSchema[nestedSchema.length - 2]]?.[
                      nestedSchema[nestedSchema.length - 1]
                    ]?.type
                  )
                    dto[responseParameter][propertyArr[i]] =
                      data?.components?.[
                        nestedSchema[nestedSchema.length - 2]
                      ]?.[nestedSchema[nestedSchema.length - 1]]?.type;
                  else if (
                    data?.components?.[nestedSchema[nestedSchema.length - 2]]?.[
                      nestedSchema[nestedSchema.length - 1]
                    ]?.oneOf?.[0]?.type
                  )
                    dto[responseParameter][propertyArr[i]] =
                      data?.components?.[
                        nestedSchema[nestedSchema.length - 2]
                      ]?.[
                        nestedSchema[nestedSchema.length - 1]
                      ]?.oneOf[0]?.type;
                  else if (
                    data?.components?.[nestedSchema[nestedSchema.length - 2]]?.[
                      nestedSchema[nestedSchema.length - 1]
                    ]?.allOf?.[0]?.type
                  )
                    dto[responseParameter][propertyArr[i]] =
                      data?.components?.[
                        nestedSchema[nestedSchema.length - 2]
                      ]?.[
                        nestedSchema[nestedSchema.length - 1]
                      ]?.allOf[0]?.type;
                  // else dto[responseParameter][propertyArr[i]] = 'object';
                }

                await this.getResponseModel(
                  data,
                  nestedSchema[nestedSchema.length - 2],
                  nestedSchema[nestedSchema.length - 1],
                  nestedModelArr,
                  contentType,
                );
              } else if (type[i].items?.properties) {
                await processProperties(type[i].items?.properties, dto);
              } else if (type[i]?.content?.[contentType]?.schema?.$ref) {
                let nestedSchema =
                  type[i]?.content?.[contentType]?.schema?.$ref.split('/');
                await this.getResponseModel(
                  data,
                  nestedSchema[nestedSchema.length - 2],
                  nestedSchema[nestedSchema.length - 1],
                  nestedModelArr,
                  contentType,
                );
              }
              if (type[i].type) {
                dto[responseParameter][propertyArr[i]] = type[i].type;
              }
            }
          }
          nestedModelArr.push(dto);
          return dto;
        } else if (
          data?.components?.[pathParameter]?.[responseParameter]?.items?.$ref
        ) {
          if (data?.components?.[pathParameter]?.[responseParameter]?.type) {
            var dto = { [responseParameter]: {} };
            dto[responseParameter] =
              data?.components?.[pathParameter]?.[responseParameter]?.type;
            nestedModelArr.push(dto);
          }
          let nestedSchema =
            data?.components?.[pathParameter]?.[
              responseParameter
            ]?.items.$ref.split('/');
          await this.getResponseModel(
            data,
            nestedSchema[nestedSchema.length - 2],
            nestedSchema[nestedSchema.length - 1],
            nestedModelArr,
            contentType,
          );
        } else if (
          data?.components?.[pathParameter]?.[responseParameter]?.items
            ?.properties
        ) {
          await processProperties(
            data?.components?.[pathParameter]?.[responseParameter]?.items
              ?.properties,
            dto,
          );
        } else if (
          !data?.components?.[pathParameter]?.[responseParameter]?.properties &&
          !data?.components?.[pathParameter]?.[responseParameter]?.items &&
          data?.components?.[pathParameter]?.[responseParameter]?.type
        ) {
          var dto = { [responseParameter]: {} };
          dto[responseParameter] =
            data?.components?.[pathParameter]?.[responseParameter]?.type;
          nestedModelArr.push(dto);
        } else if (
          data?.components?.[pathParameter]?.[responseParameter]?.allOf
        ) {
          let allOf =
            data?.components?.[pathParameter]?.[responseParameter]?.allOf;
          for (let j = 0; j < allOf.length; j++) {
            var dto = { [responseParameter]: {} };
            if (allOf[j].$ref) {
              let nestedSchema = allOf[j]?.$ref.split('/');
              if (
                data?.components?.[nestedSchema[nestedSchema.length - 2]]?.[
                  nestedSchema[nestedSchema.length - 1]
                ]?.type
              )
                dto[responseParameter] =
                  data?.components?.[nestedSchema[nestedSchema.length - 2]]?.[
                    nestedSchema[nestedSchema.length - 1]
                  ]?.type;
              else dto[responseParameter] = 'object';

              await this.getResponseModel(
                data,
                nestedSchema[nestedSchema.length - 2],
                nestedSchema[nestedSchema.length - 1],
                nestedModelArr,
                contentType,
              );
            } else if (allOf[j]?.properties) {
              await processProperties(allOf[j].properties, dto);
            }
          }
        } else if (
          data?.components?.[pathParameter]?.[responseParameter]?.oneOf
        ) {
          let oneOf =
            data?.components?.[pathParameter]?.[responseParameter]?.oneOf;
          for (let j = 0; j < oneOf.length; j++) {
            var dto = { [responseParameter]: {} };
            if (oneOf[j].$ref) {
              let nestedSchema = oneOf[j]?.$ref.split('/');
              if (
                data?.components?.[nestedSchema[nestedSchema.length - 2]]?.[
                  nestedSchema[nestedSchema.length - 1]
                ]?.type
              )
                dto[responseParameter] =
                  data?.components?.[nestedSchema[nestedSchema.length - 2]]?.[
                    nestedSchema[nestedSchema.length - 1]
                  ]?.type;
              else dto[responseParameter] = 'object';

              await this.getResponseModel(
                data,
                nestedSchema[nestedSchema.length - 2],
                nestedSchema[nestedSchema.length - 1],
                nestedModelArr,
                contentType,
              );
            } else if (oneOf[j]?.properties) {
              await processProperties(oneOf[j].properties, dto);
            }
          }
        }
      }
    } catch (error) {
      console.log('Reference Error', error);
      await this.throwCustomException(error);
    }
  }

  async getReferenceResponseModel(
    data,
    pathParameter,
    responseParameter,
    ResponseDto,
    contentType,
  ) {
    try {
      const processProperties = async (properties: any, ResponseDto) => {
        if (properties) {
          let propArr = Object.keys(properties);
          let propval: any = Object.values(properties);

          if (propArr?.length > 0) {
            for (let i = 0; i < propArr.length; i++) {
              if (
                propval[i]?.properties &&
                Object.keys(propval[i]?.properties).length > 0
              ) {
                await processProperties(propval[i]?.properties, ResponseDto);
              } else if (propval[i]?.oneOf) {
                for (let j = 0; j < propval[i].oneOf.length; j++) {
                  if (propval[i].oneOf[j].$ref) {
                    let nestedSchema = propval[i].oneOf[j].$ref.split('/');
                    if (
                      data?.components?.[
                        nestedSchema[nestedSchema.length - 2]
                      ]?.[nestedSchema[nestedSchema.length - 1]]?.type
                    )
                      ResponseDto[responseParameter][propArr[i]] =
                        data?.components?.[
                          nestedSchema[nestedSchema.length - 2]
                        ]?.[nestedSchema[nestedSchema.length - 1]]?.type;
                    else ResponseDto[responseParameter][propArr[i]] = 'object';

                    await this.getReferenceResponseModel(
                      data,
                      nestedSchema[nestedSchema.length - 2],
                      nestedSchema[nestedSchema.length - 1],
                      ResponseDto,
                      contentType,
                    );
                  }
                }
              } else if (propval[i]?.allOf) {
                for (let j = 0; j < propval[i].allOf.length; j++) {
                  if (propval[i].allOf[j].$ref) {
                    let nestedSchema = propval[i].allOf[j].$ref.split('/');
                    if (
                      data?.components?.[
                        nestedSchema[nestedSchema.length - 2]
                      ]?.[nestedSchema[nestedSchema.length - 1]]?.type
                    ) {
                      if (!ResponseDto[responseParameter])
                        ResponseDto[responseParameter] = {};

                      ResponseDto[responseParameter][propArr[i]] =
                        data?.components?.[
                          nestedSchema[nestedSchema.length - 2]
                        ]?.[nestedSchema[nestedSchema.length - 1]]?.type;
                    } else {
                      ResponseDto[responseParameter][propArr[i]] = 'object';
                    }

                    await this.getReferenceResponseModel(
                      data,
                      nestedSchema[nestedSchema.length - 2],
                      nestedSchema[nestedSchema.length - 1],
                      ResponseDto,
                      contentType,
                    );
                  }
                }
              } else if (propval[i]?.items?.properties) {
                await processProperties(
                  propval[i]?.items?.properties,
                  ResponseDto,
                );
              } else if (propval[i]?.items?.$ref) {
                ResponseDto[propArr[i]] = propval[i]?.type;

                let nestedSchema = propval[i]?.items?.$ref.split('/');
                await this.getReferenceResponseModel(
                  data,
                  nestedSchema[nestedSchema.length - 2],
                  nestedSchema[nestedSchema.length - 1],
                  ResponseDto,
                  contentType,
                );
              } else if (propval[i]?.$ref) {
                let nestedSchema = propval[i]?.$ref.split('/');
                if (!propval[i]?.properties && !propval[i]?.items) {
                  if (
                    data?.components?.[nestedSchema[nestedSchema.length - 2]]?.[
                      nestedSchema[nestedSchema.length - 1]
                    ]?.type
                  )
                    ResponseDto[propArr[i]] =
                      data?.components?.[
                        nestedSchema[nestedSchema.length - 2]
                      ]?.[nestedSchema[nestedSchema.length - 1]]?.type;
                  else ResponseDto[propArr[i]] = 'object';
                } else if (propval[i]?.properties) {
                  await processProperties(propval[i]?.properties, ResponseDto);
                }
                await this.getReferenceResponseModel(
                  data,
                  nestedSchema[nestedSchema.length - 2],
                  nestedSchema[nestedSchema.length - 1],
                  ResponseDto,
                  contentType,
                );
              }

              if (propval[i].type) {
                ResponseDto[propArr[i]] = propval[i].type;
              }
            }
          }
        }
      };

      if (data?.components?.[pathParameter]?.[responseParameter]) {
        if (
          data?.components?.[pathParameter]?.[responseParameter]?.content?.[
            contentType
          ]?.schema.$ref
        ) {
          let nestedSchema =
            data?.components?.[pathParameter]?.[responseParameter]?.content[
              contentType
            ].schema.$ref.split('/');
          await this.getReferenceResponseModel(
            data,
            nestedSchema[nestedSchema.length - 2],
            nestedSchema[nestedSchema.length - 1],
            ResponseDto,
            contentType,
          );
        } else if (
          data?.components?.[pathParameter]?.[responseParameter]?.properties ||
          data?.components?.[pathParameter]?.[responseParameter]?.items
            ?.properties
        ) {
          if (
            data?.components?.[pathParameter]?.[responseParameter]?.properties
          ) {
            var propertyArr = Object.keys(
              data?.components?.[pathParameter]?.[responseParameter]
                ?.properties,
            );
            var type: any = Object.values(
              data?.components?.[pathParameter]?.[responseParameter]
                ?.properties,
            );
          } else if (
            data?.components?.[pathParameter]?.[responseParameter]?.items
              ?.properties
          ) {
            var propertyArr = Object.keys(
              data?.components?.[pathParameter]?.[responseParameter]?.items
                ?.properties,
            );
            var type: any = Object.values(
              data?.components?.[pathParameter]?.[responseParameter]?.items
                ?.properties,
            );
          }
          if (propertyArr?.length > 0) {
            for (let i = 0; i < propertyArr.length; i++) {
              if (type[i]?.properties) {
                await processProperties(type[i]?.properties, ResponseDto);
              } else if (type[i]?.items && type[i].items?.$ref) {
                ResponseDto[propertyArr[i]] = type[i]?.type;
                let nestedSchema = type[i].items?.$ref.split('/');
                await this.getReferenceResponseModel(
                  data,
                  nestedSchema[nestedSchema.length - 2],
                  nestedSchema[nestedSchema.length - 1],
                  ResponseDto,
                  contentType,
                );
              } else if (type[i].$ref) {
                let nestedSchema = type[i].$ref.split('/');
                if (!type[i]?.type && !type[i]?.properties && !type[i]?.items) {
                  if (
                    data?.components?.[nestedSchema[nestedSchema.length - 2]]?.[
                      nestedSchema[nestedSchema.length - 1]
                    ]?.type
                  )
                    ResponseDto[propertyArr[i]] =
                      data?.components?.[
                        nestedSchema[nestedSchema.length - 2]
                      ]?.[nestedSchema[nestedSchema.length - 1]]?.type;
                  else if (
                    data?.components?.[nestedSchema[nestedSchema.length - 2]]?.[
                      nestedSchema[nestedSchema.length - 1]
                    ]?.oneOf?.[0]?.type
                  )
                    ResponseDto[propertyArr[i]] =
                      data?.components?.[
                        nestedSchema[nestedSchema.length - 2]
                      ]?.[
                        nestedSchema[nestedSchema.length - 1]
                      ]?.oneOf?.[0]?.type;
                  else if (
                    data?.components?.[nestedSchema[nestedSchema.length - 2]]?.[
                      nestedSchema[nestedSchema.length - 1]
                    ]?.allOf?.[0]?.type
                  )
                    ResponseDto[propertyArr[i]] =
                      data?.components?.[
                        nestedSchema[nestedSchema.length - 2]
                      ]?.[
                        nestedSchema[nestedSchema.length - 1]
                      ]?.allOf?.[0]?.type;

                  //else ResponseDto[propertyArr[i]] = 'object';
                }
                await this.getReferenceResponseModel(
                  data,
                  nestedSchema[nestedSchema.length - 2],
                  nestedSchema[nestedSchema.length - 1],
                  ResponseDto,
                  contentType,
                );
              } else if (type[i]?.content?.[contentType]?.schema?.$ref) {
                let nestedSchema =
                  type[i]?.content?.[contentType]?.schema?.$ref.split('/');
                await this.getReferenceResponseModel(
                  data,
                  nestedSchema[nestedSchema.length - 2],
                  nestedSchema[nestedSchema.length - 1],
                  ResponseDto,
                  contentType,
                );
              } else if (type[i].items?.properties) {
                await processProperties(type[i].items?.properties, ResponseDto);
              }
              if (type[i].type) {
                ResponseDto[propertyArr[i]] = type[i].type;
              }
            }
          }
          return ResponseDto;
        } else if (
          data?.components?.[pathParameter]?.[responseParameter]?.items?.$ref
        ) {
          if (data?.components?.[pathParameter]?.[responseParameter]?.type) {
            ResponseDto[responseParameter] =
              data?.components?.[pathParameter]?.[responseParameter]?.type;
          }
          let nestedSchema =
            data?.components?.[pathParameter]?.[
              responseParameter
            ]?.items?.$ref.split('/');
          await this.getReferenceResponseModel(
            data,
            nestedSchema[nestedSchema.length - 2],
            nestedSchema[nestedSchema.length - 1],
            ResponseDto,
            contentType,
          );
        } else if (
          data?.components?.[pathParameter]?.[responseParameter]?.items
            ?.properties
        ) {
          await processProperties(
            data?.components?.[pathParameter]?.[responseParameter]?.items
              ?.properties,
            ResponseDto,
          );
        } else if (
          !data?.components?.[pathParameter]?.[responseParameter]?.properties &&
          !data?.components?.[pathParameter]?.[responseParameter]?.items &&
          data?.components?.[pathParameter]?.[responseParameter]?.type
        ) {
          ResponseDto[responseParameter] =
            data?.components?.[pathParameter]?.[responseParameter]?.type;
        } else if (
          data?.components?.[pathParameter]?.[responseParameter]?.allOf
        ) {
          let allOf =
            data?.components?.[pathParameter]?.[responseParameter]?.allOf;
          for (let j = 0; j < allOf.length; j++) {
            var dto = { [responseParameter]: {} };
            if (allOf[j].$ref) {
              let nestedSchema = allOf[j]?.$ref.split('/');
              if (
                data?.components?.[nestedSchema[nestedSchema.length - 2]]?.[
                  nestedSchema[nestedSchema.length - 1]
                ]?.type
              )
                dto[responseParameter] =
                  data?.components?.[nestedSchema[nestedSchema.length - 2]]?.[
                    nestedSchema[nestedSchema.length - 1]
                  ]?.type;
              else dto[responseParameter] = 'object';

              await this.getReferenceResponseModel(
                data,
                nestedSchema[nestedSchema.length - 2],
                nestedSchema[nestedSchema.length - 1],
                ResponseDto,
                contentType,
              );
            } else if (allOf[j]?.properties) {
              await processProperties(allOf[j].properties, dto);
            }
          }
        }
      }
    } catch (error) {
      console.log('Reference Error', error);
      await this.throwCustomException(error);
    }
  }

  async notifyUserAccessPending(oauthUser: any, userList: any[]) {
    try {
      const adminList = userList
        ?.filter((user: any) => user?.isAppAdmin === true)
        .map((user: any) => user?.email);
      let mailOptions = {};
      const emailTemplateResponseFromRedis =
        await this.redisService.getJsonData(
          `CK:TRL:FNGK:AFR:FNK:PORTAL:CATK:EMAILTEMPLATE:AFGK:TORUS:AFK:OAUTHUSERACCESSREQUEST:AFVK:v1:TPI`,
          process.env.CLIENTCODE,
        );
      const template = emailTemplateResponseFromRedis
        ? JSON.parse(emailTemplateResponseFromRedis)
        : {};
      if (adminList.length) {
        mailOptions = {
          from: 'support@torus.tech',
          to: adminList,
          subject: template.subject
            .replaceAll('${appName}', appName)
            .replaceAll('${name}', oauthUser?.name)
            .replaceAll('${email}', oauthUser?.email),
          html: template.html
            .replaceAll('${appName}', appName)
            .replaceAll('${name}', oauthUser?.name)
            .replaceAll('${email}', oauthUser?.email)
            .replaceAll(
              '${appUrl}',
              process.env.BE_URL.substring(0, process.env.BE_URL.lastIndexOf("/"))
            ),
        };
      } else {
        mailOptions = {
          from: 'support@torus.tech',
          to: ['support@torus.tech'],
          subject: template.html
            .replaceAll('${appName}', appName)
            .replaceAll('${name}', oauthUser?.name)
            .replaceAll('${email}', oauthUser?.email),
          html: template.html
            .replaceAll('${appName}', appName)
            .replaceAll('${name}', oauthUser?.name)
            .replaceAll('${email}', oauthUser?.email)
            .replaceAll(
              '${appUrl}',
              process.env.BE_URL.substring(0, process.env.BE_URL.lastIndexOf("/")),
            ),
        };
      }

      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      return true;
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async oauthSignIn(user: any) {
    try {
      const config = this.getConfig();
      const fusionAuthBaseUrl = config.fusionAuthBaseUrl;
      const fusionAuthApiKey = config.fusionAuthApiKey;

      if (!user) {
        throw new BadRequestException('Account details not enough to continue');
      }
        if(user?.provider =='fusionauth')
        {
          const fusionauthUser:any  = await FusionAuthUserGet(fusionAuthBaseUrl, fusionAuthApiKey, user?.providerAccountId)
        user['email'] = fusionauthUser.user.email;
      }

      const isExistingUser = await this.signIntoTorus(
        user?.email,
        '',
        user?.ufClientType,
        true,
      );
      if (isExistingUser) {
        return isExistingUser;
      } else {
        let tempId:string = uuid()
        user['userUniqueId']=tempId
        await this.postTenantUser(user)
        const userCachekey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:users`;
        let temp: string = user?.email?.split('@').at(0) || '';
        const userObject = {
          userUniqueId:user?.providerAccountId||user?.userUniqueId,
          users: user?.name || temp,
          email: user?.email ?? '',
          password: '',
          firstName: user?.name || temp,
          lastName: user?.name || temp,
          loginId: user?.name || temp,
          mobile: '',
          accessProfile: [],
          dateAdded: new Date(),
          status: 'active',
          isRestricted: false,
          profile: user?.image ?? '',
          accessExpires: '',
          lastActive: '',
          noOfProductsService: 0,
          isAppAdmin: false,
          originalIndex: '',
        };
        const userListResponse = await this.redisService.getJsonData(
          userCachekey,
          process.env.CLIENTCODE,
        );
        const userList = userListResponse ? JSON.parse(userListResponse) : [];
        await this.redisService.setJsonData(
          userCachekey,
          JSON.stringify([...userList, userObject]),
          process.env.CLIENTCODE,
        );
        await this.notifyUserAccessPending(user, userList);
        return await this.signIntoTorus(
          user?.email,
          '',
          user?.ufClientType,
          true,
        );
      }
    } catch (error) {
      await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'AUTH015',
        error,
        'LoginScreen',
        '',
        {
          artifact: 'LoginScreen',
          users: user,
        },
      );
      await this.throwCustomException(error);
    }
  }
  
  async AppSecurityTemplateData(
    data: any[],
    token: string,
  ) {
    try {
      if (tenant && data) {
        const config = this.getConfig();
        const fusionAuthBaseUrl = config.fusionAuthBaseUrl;
        const fusionAuthApiKey = config.fusionAuthApiKey;
        
        const clientCode = process.env.CLIENTCODE
        let defaultAuthenticationMethod = 'nextAuth';
        let applicationUniqueId = '';
        let setupData: any = JSON.parse(
          await this.redisService.getJsonData(
            `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:tpc`,
            clientCode,
          ),
        );
        let newData: any = [];

        setupData?.AG.map((AppGrp: any) => {
          if (AppGrp?.code == ag) {
            AppGrp?.APPS.map((App: any) => {
              if (App?.code == app) {
                applicationUniqueId = App?.applicationUniqueId;
              }
            });
          }
        });

        let existRoles: any[] =
          JSON.parse(
            await this.redisService.getJsonData(
              `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:securityTemplate`,
              clientCode,
            ),
          ) || [];

        // return deletedRoles
        existRoles.map((existRoleObj: any) => {
          data.map((comingRoleObj: any) => {
            if (
              existRoleObj?.roleUniqueId == comingRoleObj?.roleUniqueId &&
              existRoleObj?.accessProfile != comingRoleObj?.accessProfile
            ) {
              newData.push({ ...comingRoleObj, isForEdit: true });
            }
          });
        });
        if ('defaultAuthentication' in setupData)
          [(defaultAuthenticationMethod = setupData.defaultAuthentication)];

        if (Array.isArray(data)) {
          for (let i = 0; i < data.length; i++) {
            if (!('roleUniqueId' in data[i])) {
              const newId = uuid();
              data[i]['roleUniqueId'] = newId;
              newData.push(data[i]);
            }
          }
        }
        // return newData
        const inputTenantIds = data.map((r) => r.roleUniqueId).filter(Boolean);
        const deletedRoles = existRoles.filter(
          (r) => !inputTenantIds.includes(r.roleUniqueId),
        );
        if (
          defaultAuthenticationMethod == 'fusionauth' &&
          applicationUniqueId
        ) {
          for (const roleObj of deletedRoles) {
            await FusionAutRoleCRUDAlongWithApp(
              fusionAuthBaseUrl,
              fusionAuthApiKey,
              applicationUniqueId,
              roleObj?.roleUniqueId,
              roleObj?.accessProfile,
              'DELETE',
            );
          }

          for (const roleObj of newData) {
            if (roleObj?.isForEdit) {
              await FusionAutRoleCRUDAlongWithApp(
                fusionAuthBaseUrl,
                fusionAuthApiKey,
                applicationUniqueId,
                roleObj?.roleUniqueId,
                roleObj?.accessProfile,
                'DELETE',
              );
              await FusionAutRoleCRUDAlongWithApp(
                fusionAuthBaseUrl,
                fusionAuthApiKey,
                applicationUniqueId,
                roleObj?.roleUniqueId,
                roleObj?.accessProfile,
                'POST',
              );
            } else {
              await FusionAutRoleCRUDAlongWithApp(
                fusionAuthBaseUrl,
                fusionAuthApiKey,
                applicationUniqueId,
                roleObj?.roleUniqueId,
                roleObj?.accessProfile,
                'POST',
              );
            }
          }
        }
        
      const securityTempPrevdataIds = existRoles ? existRoles?.map((item: any) => item?.opr_ap_id).filter((id: any) => id !== undefined) : [];
      const incomingSecurityDataIds = data?.map((item: any) => item?.opr_ap_id).filter((id: any) => id !== undefined) || [];
      const securityDataIdsToDelete = securityTempPrevdataIds.filter((id: any) => !incomingSecurityDataIds.includes(id));

      //Torus API OPR Table entry Start
      let tokenDecode = await this.jwtService.decodeToken(token); 
      for (const secDataObj of data) {
         const security_data = {
            access_profile: secDataObj?.accessProfile,
            dap: secDataObj?.dap,
            org_grp: secDataObj?.orgGrp ?? [],
            users_cnt: secDataObj["no.ofusers"],
            role_unique_id: secDataObj?.roleUniqueId,
            tenant_code: tenant,
            ag_code: ag,
            app_code: app,
            // "opr_mx_id": 0,
            trs_created_date: new Date().toISOString(),
            trs_created_by: tokenDecode?.loginId || 'anonymous',
            trs_modified_date: new Date().toISOString(),
            trs_modified_by: tokenDecode?.loginId || 'anonymous',
            // "trs_status": "string",
            // "trs_next_status": "string",
            // "trs_process_id": "string",
            trs_access_profile: tokenDecode?.selectedAccessProfile,
            trs_org_grp_code: tokenDecode?.orgGrpCode,
            trs_org_code: tokenDecode?.orgCode,
            trs_role_grp_code: tokenDecode?.roleGrpCode,
            trs_role_code: tokenDecode?.roleCode,
            trs_ps_grp_code: tokenDecode?.psGrpCode,
            trs_ps_code: tokenDecode?.psCode,
            trs_sub_org_grp_code: tokenDecode?.subOrgGrpCode ?? "",
            trs_sub_org_code: tokenDecode?.subOrgCode ?? ""
         }

         if (secDataObj?.opr_ap_id) {
          const masterDataItemResponse = await this.callTorusAPI(
            `opr_access_profile/${secDataObj?.opr_ap_id}`,
            {
              method: 'GET',
              token: token,
            },
          );
          if (masterDataItemResponse?.status == 200) {
            const prevData = masterDataItemResponse.data;
            if (
              prevData?.access_profile == security_data.access_profile &&
              JSON.stringify(prevData ?? {}) ==
                JSON.stringify(security_data ?? {})
            ) {
              continue;
            } else {
              // patch this record
              await this.callTorusAPI(
                `opr_access_profile/${secDataObj?.opr_ap_id}`,
                {
                  method: 'PATCH',
                  token: token,
                  data: security_data,
                },
              );
            }
          }
          continue;
        } else {
          const response = await this.callTorusAPI('opr_access_profile', {
            method: 'POST',
            token: token,
            data: security_data,
          });
          if (response?.status == 201) {
            secDataObj['opr_ap_id'] = response.data?.opr_ap_id;
          }
        }
      }

      // delete records from torus which are deleted from incoming data 
      for (const masterId of securityDataIdsToDelete) {
        await this.callTorusAPI(`opr_access_profile/${masterId}`, {
          method: 'DELETE',
          token: token,
        });
      }

      //Torus API OPR Table entry End
  
        return await this.redisService.setJsonData(
          `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:securityTemplate`,
          JSON.stringify(data),
          clientCode,
        );
      } else {
        throw new BadRequestException(
          'Please provide all necessary credentials',
        );
      }
    } catch (error) {
      await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'AUTH016',
        error,
        'UserScreen',
        '',
        {
          artifact: 'UserScreen',
          users: 'anonymous user',
        },
      );
      await this.throwCustomException(error);
    }
  }

  async screenDetailsData(data) {
    const result = [];
    // Traverse through the data and process the webArtifacts key
    data.forEach((group) => {
      // Initialize the group object
      const groupObj = {
        menuGroup: group.title.toLowerCase(),
        menuGroupLabel: group.title,
        screens: [],
        items: [],
        icon: group.icon,
      };

      if (group.items) {
        // Traverse through the items of this group
        group.items.forEach((item) => {
          if (item.type === 'item') {
            // If the item is of type 'item', extract the relevant properties for screens
            groupObj.screens.push({
              screenName: item.title.toLowerCase(),
              screenNameLabel: item.title,
              UF: item.keys?.uf || '',
              PF: '',
              SF: '',
              static: item?.static || false,
              icon: item.icon,
            });
          } else if (item.type === 'group') {
            // If the item is of type 'group', we need to process the nested items as well
            const groupItem = {
              menuGroup: item.title.toLowerCase(),
              menuGroupLabel: item.title,
              screens: [],
              items: [],
              icon: item.icon,
            };

            // Process the items inside the group (of type 'item')
            item.items.forEach((subItem) => {
              groupItem.screens.push({
                screenName: subItem.title.toLowerCase(),
                screenNameLabel: subItem.title,
                UF: subItem.keys?.uf || '',
                PF: '',
                SF: '',
                static: item?.static || false,
                icon: subItem.icon,
              });
            });

            // Add the nested group to the parent group's 'items' array
            groupObj.items.push(groupItem);
          }
        });
      } else {
        if (group.type === 'item') {
          // If the item is of type 'item', extract the relevant properties for screens
          groupObj.screens.push({
            screenName: group.title.toLowerCase(),
            DF: '',
            UF: group.keys?.uf || '',
            PF: '',
            SF: '',
            static: group?.static || false,
            icon: group.icon,
          });
        }
        delete groupObj.menuGroup;
        delete groupObj.items;
      }

      // Add the group to the result array
      result.push(groupObj);
    });

    return result;
  }

  async getAccessProfileForArtifact(key:string, clientCode: string, token: string)
{
    try {
    const UO: any = await this.commonService.readAPI(
      key ,
      clientCode,
      token,
    );
    let templateArray:any = UO?.securityData?.accessProfile||[];
    let allowedAccessProfile:any=[]
    templateArray.map((profile:any)=>{
      if(profile?.security?.artifact?.SIFlag?.selectedValue=='AA'||profile?.security?.artifact?.SIFlag?.selectedValue=='RA' )
      {
          allowedAccessProfile.push(profile?.accessProfile);
        }
    })
    return allowedAccessProfile
    } catch (error) {
    return []
    }
  }

  async navbarDataPreparation(data: any, clientCode: string, token: string) {
    const result = [];

    // Traverse through the data and process each menu group
    for (const group of data) {
      // Initialize the group object
      const groupObj = {
        menuGroup: group.menuGroup,
        menuGroupLabel: group.menuGroupLabel,
        screenDetails: [],
        items: [],
        icon: group.icon,
      };

      // Process the screens and convert to the desired format
      for (const screen of group.screens) {
        let allowedAccessProfile: any = [];
        if (screen.UF != 'Logs Screen' && screen.UF != 'User Screen') {
          allowedAccessProfile = await this.getAccessProfileForArtifact(
            screen.UF + ':UO',
            clientCode,
            token,
          );
        }
        groupObj.screenDetails.push({
          name: screen.screenName,
          label: screen.screenNameLabel,
          key: screen.UF,
          allowedAccessProfile: allowedAccessProfile,
          static: screen?.static || false,
          icon: screen.icon,
        });
      }

      // Process the items and handle nested menuGroups
      if (group.items) {
        for (const item of group.items) {
          const itemObj = {
            menuGroup: item.menuGroup,
            menuGroupLabel: item.menuGroupLabel,
            screenDetails: [],
            items: [], // In case of further nesting
            icon: item.icon,
          };

          // Process the screens of the nested menu group
          for (const screen of item.screens) {
            let allowedAccessProfile: any = [];
            if (screen.UF != 'Logs Screen' && screen.UF != 'User Screen') {
              allowedAccessProfile = await this.getAccessProfileForArtifact(
                screen.UF + ':UO',
                clientCode,
                token,
              );
            }
            itemObj.screenDetails.push({
              name: screen.screenName,
              label: screen.screenNameLabel,
              key: screen.UF,
              allowedAccessProfile: allowedAccessProfile,
              static: screen?.static || false,
              icon: screen.icon,
            });
          }

          // Add the nested item to the parent item's 'items'
          groupObj.items.push(itemObj);
        }
      }

      // Add the formatted group object to the result array
      result.push(groupObj);
    }

    return result;
  }

  async getNavbarData(key: string, clientCode: string, token: string) {
    let webAssemblerData: any = await this.commonService.readAPI(
      key,process.env.CLIENTCODE,token
    )
    let screenDetailsForNav: any =
      await this.screenDetailsData(webAssemblerData.webArtifacts);
    let navbarData = await this.navbarDataPreparation(
      screenDetailsForNav,
      clientCode,
      token,
    );
    return navbarData;
  }
  
  async postTenantUser(userDetail: any) {
    let tenantUserKey: string = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:users`;
    const appUserKey: string = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:users`;
    let tenantUser: any = JSON.parse(
      await this.redisService.getJsonData(
        tenantUserKey,
        process.env.CLIENTCODE,
      ),
    );
    if (tenantUser?.length) {
      const isExists: any = tenantUser.find(
        (allUser: any) => allUser?.email == userDetail?.email,
      );

      if (!isExists) {
        let temp: string = userDetail?.email?.split('@').at(0) || '';
        let postOneUser: any = {
          userUniqueId:userDetail?.providerAccountId||userDetail?.userUniqueId,
          users: '',
          email: userDetail?.email,
          firstName: temp,
          lastName: temp,
          loginId: temp,
          dateAdded: new Date().toISOString(),
          status: 'inactive',
        };
        tenantUser.push(postOneUser);
        await this.redisService.setJsonData(
          tenantUserKey,
          JSON.stringify(tenantUser),
          process.env.CLIENTCODE,
        );
        postOneUser = {
          ...postOneUser,
          noOfProductsService: 0,
          accessProfile: [],
          isAppAdmin: false,
        };
      }
    } else {
      let temp: string = userDetail?.email?.split('@').at(0) || '';
      let postOneUser: any = {
        userUniqueId:userDetail?.providerAccountId||userDetail?.userUniqueId,
        users: '',
        email: userDetail?.email,
        firstName: temp,
        lastName: temp,
        loginId: temp,
        dateAdded: new Date().toISOString(),
        status: 'inactive',
      };
      await this.redisService.setJsonData(
        tenantUserKey,
        JSON.stringify([postOneUser]),
        process.env.CLIENTCODE,
      );

      postOneUser = {
        ...postOneUser,
        noOfProductsService: 0,
        accessProfile: [],
        isAppAdmin: false,
      };;
    }
  }

  async getAppList(token: string) {
    try {
      const config = this.getConfig()
      const auth_secret = config.authSecret

      const payload = await this.jwt.verifyAsync(token, {
        secret: auth_secret,
      });
      const {
        client: tenant,
        loginId,
        ag,
        app: currentApp,
      } = payload;
      const tenantUserCacheKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:users`;
      const tenantProfileCacheKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:tpc`;
      const tenantUserListResponse = await this.redisService.getJsonData(
        tenantUserCacheKey,
        process.env.CLIENTCODE,
      );
      const tenantProfileResponse = await this.redisService.getJsonData(
        tenantProfileCacheKey,
        process.env.CLIENTCODE,
      );
      const tenantProfile = tenantProfileResponse
        ? JSON.parse(tenantProfileResponse)
        : {};
      const tenantUserList = tenantUserListResponse
        ? JSON.parse(tenantUserListResponse)
        : [];
      const foundUser = tenantUserList.find(
        (user: any) => user?.loginId == loginId,
      );
      const appGroupInfo =
        tenantProfile?.AG?.find((group: any) => group?.code == ag) ?? {};
      const overAllApplicationList =
        appGroupInfo?.APPS?.filter((a) => a?.code != currentApp) ||
        [];
      let accessibleAppList: any[] = [];

      for (const application of overAllApplicationList) {
        const userKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${application?.code}:AFVK:v1:users`;
        const userResponse = await this.redisService.getJsonData(
          userKey,
          process.env.CLIENTCODE,
        );
        const userList = userResponse ? JSON.parse(userResponse) : [];
        const isUserExistInApp = userList.find(
          (user: any) =>
            user?.userUniqueId == foundUser?.userUniqueId &&
            user?.accessProfile?.length,
        );
        if (!isUserExistInApp) continue;
        // check the application's build key information along with the accessUrl
        const appBuildKeyCachePrefix = `CK:TGA:FNGK:BLDC:FNK:DEV:CATK:${tenant}:AFGK:${ag}:AFK:${application?.code}:AFVK:*:bldc`;
        const appBuildKeyList = await this.redisService.getKeys(
          appBuildKeyCachePrefix,
          process.env.CLIENTCODE,
        );
        let versionInfo = [];
        for (let i = 0; i < appBuildKeyList.length; i++) {
          const buildKey = appBuildKeyList[i];
          const buildKeyResponse = await this.redisService.getJsonData(
            buildKey,
            process.env.CLIENTCODE,
          );
          const buildKeyData = buildKeyResponse
            ? JSON.parse(buildKeyResponse)
            : {};
          const { deploymentArtifactKey } = buildKeyData;
          if (deploymentArtifactKey) {
            const artifactKeyResponse = await this.redisService.getJsonData(
              `${deploymentArtifactKey}:NDP`,
              process.env.CLIENTCODE,
            );
            const artifactKeyData = artifactKeyResponse
              ? JSON.parse(artifactKeyResponse)
              : {};
            // skip nodeId and get data
            let nodeData: any = Object.values(artifactKeyData)[0];
            // for encryption
            if(typeof nodeData == "string"){
              nodeData = decrypt(nodeData)
            }
            const appAccessUrl = nodeData?.data?.api?.release?.HOST?.replace('/api' , '');
            if (appAccessUrl) {
              versionInfo.push({
                version: buildKey.split(':')[13],
                accessUrl: appAccessUrl,
              });
            }
          }
        }
        if (versionInfo.length > 0) {
          accessibleAppList.push({
            ...application,
            versionInfo: versionInfo,
          });
        }
      }

      return accessibleAppList;
    } catch (error) {
      await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'AUTH017',
        error,
        'AppHub Screen',
        '',
        {
          artifact: 'AppHub Screen',
          users: 'anonymous user',
        },
      );
      await this.throwCustomException(error);
    }
  }

  async sso(sourceToken: string , ufClientType:string) {
    try {
      const payload = await this.jwt.decode(sourceToken);
      const { client:tenant , loginId } = payload;
      const tenantUserCacheKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:users`;
      const tenantUserListResponse = await this.redisService.getJsonData(
        tenantUserCacheKey,
        process.env.CLIENTCODE,
      );
      const tenantUserList = tenantUserListResponse
        ? JSON.parse(tenantUserListResponse) 
        : [];
      const user = tenantUserList.find(
        (user: any) => user?.loginId == loginId,
      );

        return await this.signIntoTorus(
          user?.email,
          '',
          ufClientType,
          true,
        );

    } catch (error) {
      await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'AUTH018',
        error,
        'AppHub Screen',
        '',
        {
          artifact: 'AppHub Screen',
          users: 'anonymous user',
        },
      );
      await this.throwCustomException(error);
    }
  }

  async setTenantUser(content: any, token: string) {
    try {
      const config = this.getConfig();
      const fusionAuthBaseUrl = config.fusionAuthBaseUrl;
      const fusionAuthApiKey = config.fusionAuthApiKey;

      // got from .env file
      let tokenDecode = await this.jwtService.decodeToken(token);
      let tenantCode = tenant;
      let client = process.env.CLIENTCODE
      // got from .env file
      let existUser: any[] = await this.getTenantUser(tenantCode, client);
   
      let res;
      let userUniqueId = uuid();
      if (existUser == null || existUser?.length == 0) {
        let postOneUser: any = {
          ...content,
          password: await this.hashPassword(content?.password),
          userUniqueId: userUniqueId,
        };
        if (defaultAuth === 'fusionauth' && fusionAuthTenantId) {
          await FusionAuthUserCreation(
            fusionAuthBaseUrl,
            fusionAuthApiKey,
            fusionAuthTenantId,
            postOneUser.userUniqueId,
            postOneUser.firstName,
            postOneUser.lastName,
            postOneUser.loginId,
            postOneUser.email,
            content?.password,
            'POST',
            postOneUser?.mobile,
          );
        }
        // delete postOneUser?.accessProfile;
        delete postOneUser?.accessExpires;

        let key: string = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenantCode}:AFK:PROFILE:AFVK:v1:users`;
        res = await this.redisService.setJsonData(
          key,
          JSON.stringify([postOneUser]),
          client,
        );
      } else {
        let postOneUser: any = {
          ...content,
          password: await this.hashPassword(content?.password),
          userUniqueId: userUniqueId,
        };
        delete postOneUser?.accessProfile;
        delete postOneUser?.accessExpires;
        existUser.push(postOneUser);
        if (defaultAuth === 'fusionauth' && fusionAuthTenantId) {
          await FusionAuthUserCreation(
            fusionAuthBaseUrl,
            fusionAuthApiKey,
            fusionAuthTenantId,
            postOneUser.userUniqueId,
            postOneUser.firstName,
            postOneUser.lastName,
            postOneUser.loginId,
            postOneUser.email,
            content?.password,
            'POST',
            postOneUser?.mobile,
          );
        }

        ////////////
        let uniqueData: any[] = existUser?.filter(
          (obj) => 'userUniqueId' in obj,
        );
        
        //Torus API OPR Table entry Start
        for (const user of existUser) {
          if(user.org_tu_id) continue
          const user_data ={
            user_unique_id: user.userUniqueId ?? "",
            email: user.email,
            password: user.password,
            first_name: user.firstName ?? "",
            last_name: user.lastName ?? "",
            login_id: user.loginId,
            user_code: user.userCode ?? "",
            status: user.status ?? "",
            tenant_code: tenant,
            trs_created_date: new Date().toISOString(),
            trs_created_by: tokenDecode?.loginId || 'anonymous',
            trs_modified_date: new Date().toISOString(),
            trs_modified_by: tokenDecode?.loginId || 'anonymous',
            // "trs_status": "string",
            // "trs_next_status": "string",
            // "trs_process_id": "string",
            trs_access_profile: tokenDecode?.selectedAccessProfile,
            trs_org_grp_code: tokenDecode?.orgGrpCode,
            trs_org_code: tokenDecode?.orgCode,
            trs_role_grp_code: tokenDecode?.roleGrpCode,
            trs_role_code: tokenDecode?.roleCode,
            trs_ps_grp_code: tokenDecode?.psGrpCode,
            trs_ps_code: tokenDecode?.psCode,
            trs_sub_org_grp_code: tokenDecode?.subOrgGrpCode ?? "",
            trs_sub_org_code: tokenDecode?.subOrgCode ?? ""
          }
            const response = await this.callTorusAPI('tenant_user', {
            method: 'POST',
            token: token,
            data: user_data,
          });
          if (response?.status == 201) {
            user['org_tu_id'] = response.data?.org_tu_id;
          }
        }

        //Torus API OPR Table entry End
 
        ////////////////
        let key: string = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenantCode}:AFK:PROFILE:AFVK:v1:users`;
        res = await this.redisService.setJsonData(
          key,
          JSON.stringify(uniqueData), // set JSON.stringify(existUser), this once all app keys have correct object
          client,
        );
      }
      const resForTenantUserAddition = await this.redisService.getJsonData(
        `CK:TRL:FNGK:AFR:FNK:PORTAL:CATK:EMAILTEMPLATE:AFGK:TORUS:AFK:CLIENTUSERADDITION:AFVK:v1:TPI`,
        'TORUS',
      );

      const tenantUserAddition = JSON.parse(resForTenantUserAddition);

      const { firstName, lastName, email, loginId, password } = content;

      const updatedSubject = (tenantUserAddition.subject as string).replaceAll(
        '${clientProfile.clientName}',
        `${tenant}`,
      );
      const updateclientUserAdditionHtml = (tenantUserAddition.html as string)
        .replaceAll('${clientProfile.clientName}', `${tenant}`)
        .replace('${firstName}', `${firstName}`)
        .replace('${lastName}', `${lastName}`)
        .replace('${clientCode}', `${tenantCode}`)
        .replace('${username}', `${loginId}`)
        .replace('${password}', `${password}`)
        .replace(`Client`, `Tenant`);

      const mailOptions = {
        from: 'support@torus.tech',
        to: email,
        subject: updatedSubject,
        html: updateclientUserAdditionHtml,
      };

      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          throw new ForbiddenException('There is an issue with sending welcome email to the user');
        } else {
          console.log('Email sent: ' + info.response);
          // return `Email sent`;
        }
      });
      await this.postAppUserList({...content, userUniqueId: userUniqueId , password: undefined} , token);
      const resultUserList =  (await this.getTenantAppUser(tenant, process.env.CLIENTCODE, ag, app))
      return resultUserList.map(user => {
        delete user.password;
        return user;
      });
    } catch (err: any) {
        await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'AUTH016',
        err,
        'UserScreen',
        '',
        {
          artifact: 'UserScreen',
          users: 'anonymous user',
        },
      );
      await this.throwCustomException(err);
    }
  }

  async uploadFromLocalPath(
  localPaths: any[],
  bucketFoldername?: string,
  folderPath?: string,
  enableEncryption?: string,
): Promise<string[]> {
  try {
    const bucket = bucketFoldername || '';
    const subFolder = folderPath || '';
    const shouldEncrypt = enableEncryption === 'true';
    
    // Normalize to array if single path provided
    let paths :string[] = [];
    for(let i=0;i<localPaths.length;i++){
      paths.push(localPaths[i].filepath);
    }
    console.log("localPaths ==> ", paths);

    const uploadedFiles: string[] = [];

    // Process each path
    for (const localPath of paths) {
      const stat = await fs.promises.stat(localPath);

      let files: string[] = [];

      // If directory → upload all files
      if (stat.isDirectory()) {
        const entries = await fs.promises.readdir(localPath);
        files = entries.map((f) => path.join(localPath, f));
      } else {
        files = [localPath];
      }

      // Upload each file
      for (const filePath of files) {
        const buffer = await fs.promises.readFile(filePath);
        const fileName = path.basename(filePath);

        const encryptedBuffer = shouldEncrypt
          ? await this.commonService.aes256ctrEncrypt(buffer)
          : buffer;

        const form = new FormData();
        form.append('file', Readable.from(encryptedBuffer), {
          filename: fileName,
          contentType: 'application/octet-stream',
        });

        const uploadUrl = `${this.envData.getSeaweedOutputHost()?.replace(
          /\/$/,
          '',
        )}/buckets/${bucket}/${subFolder}/${fileName}`;

        const res = await axios.post(uploadUrl, form, {
          headers: {
            Accept: 'application/json',
            ...form.getHeaders(),
          },
          auth: {
            username: this.envData.getSeaweedUsername()!,
            password: this.envData.getSeaweedPassword()!,
          },
          validateStatus: (status) => status < 500,
        });

        if (res.status === 201) {
          uploadedFiles.push(`${bucket}/${subFolder}/${fileName}`);
        } else {
          throw new Error(
            res.data || 'Error occurred while uploading file',
          );
        }
      }
    }

    console.log("uploadedFiles ==> ", uploadedFiles);
    return uploadedFiles;
  } catch (error) {
    throw error;
      }
}

  async callTorusAPI<T = any>(
    apiEndpoint: string,
    options?: {
      method?: Method;
      data?: any;
      token?: string;
      params?: Record<string, any>;
      headers?: Record<string, string>;
    },
  ): Promise<{ status: number; data: T }> {
    const { method = 'GET', data, token, params, headers = {} } = options || {};

    try {
      const response = await axios({
        url: `${torusAppApiBaseUrl}${apiEndpoint}`,
        method,
        data,
        params,
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          ...headers,
        },
        validateStatus: () => true,
      });

      return {
        status: response.status,
        data: response.data,
      };
    } catch (error: any) {
      throw error;
    }
  }

  async postOrgData(incomingMasterData: any, incomingMatrixData: any, token: string) {
    try {
      const config = this.getConfig()
      const auth_secret = config.authSecret

      if (!token) throw new BadRequestException('Token is required');
      const payload = await this.jwt.verifyAsync(token, {
        secret: auth_secret,
      });
      if (!incomingMasterData || !incomingMatrixData)
        throw new BadRequestException(
          'Master data and matrix data are required',
        );
      const orgMasterKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:orgMaster`;
      const orgMatrixKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:orgMatrix`;
      const orgMasterResponse = await this.redisService.getJsonData(
        orgMasterKey,
        process.env.CLIENTCODE,
      );
      const orgMatrixResponse = await this.redisService.getJsonData(
        orgMatrixKey,
        process.env.CLIENTCODE,
      );

      // To delete records which are deleted from incoming data in torus as well as in redis, 
      // we need to get the existing record ids from redis and compare with incoming data ids, 
      // if any id is not present in incoming data then we can delete that record from torus and redis both
      const orgMasterPrevdataIds = orgMasterResponse ? JSON.parse(orgMasterResponse)?.map((item: any) => item?.opr_om_id).filter((id: any) => id !== undefined) : [];
      const orgMatrixPrevdataIds = orgMatrixResponse ? JSON.parse(orgMatrixResponse)?.map((item: any) => item?.opr_mx_id).filter((id: any) => id !== undefined) : [];
      const incomingMasterDataIds = incomingMasterData?.map((item: any) => item?.opr_om_id).filter((id: any) => id !== undefined) || [];
      const incomingMatrixDataIds = incomingMatrixData?.map((item: any) => item?.opr_mx_id).filter((id: any) => id !== undefined) || [];
      const masterDataIdsToDelete = orgMasterPrevdataIds.filter((id: any) => !incomingMasterDataIds.includes(id));
      const matrixDataIdsToDelete = orgMatrixPrevdataIds.filter((id: any) => !incomingMatrixDataIds.includes(id));


      // Torus API OPR Table entry start
      // loop thorugh masterData
      for (const masterDataItem of incomingMasterData) {
        // prepare data for opr_org_master table in torus
        const opr_org_master_data = {
          org_grp_code: masterDataItem?.orgGrpCode,
          org_grp_name: masterDataItem?.orgGrpName,
          org_grp_id: masterDataItem?.orgGrpId,
          org: masterDataItem?.org,
          tenant_code: tenant,
          ag_code: ag,
          app_code: app,
          trs_created_date: new Date().toISOString(),
          trs_created_by: payload?.loginId || 'anonymous',
          trs_modified_date: new Date().toISOString(),
          trs_modified_by: payload?.loginId || 'anonymous',
          trs_status: '',
          trs_next_status: '',
          trs_process_id: '',
          trs_access_profile: payload?.selectedAccessProfile || '',
          trs_org_grp_code: payload?.orgGrpCode || '',
          trs_org_code: payload?.orgCode || '',
          trs_role_grp_code: payload?.roleGrpCode || '',
          trs_role_code: payload?.roleCode || '',
          trs_ps_grp_code: payload?.psGrpCode || '',
          trs_ps_code: payload?.psCode || '',
          trs_sub_org_grp_code: payload?.subOrgGrpCode || '',
          trs_sub_org_code: payload?.subOrgCode || '',
        };
        // if opr_om_id exist then patch else post
        if (masterDataItem?.opr_om_id) {
          const masterDataItemResponse = await this.callTorusAPI(
            `opr_org_master/${masterDataItem?.opr_om_id}`,
            {
              method: 'GET',
              token: token,
            },
          );
          if (masterDataItemResponse?.status == 200) {
            const prevData = masterDataItemResponse.data;
            if (
              prevData?.org_grp_name == opr_org_master_data.org_grp_name &&
              JSON.stringify(prevData?.org ?? {}) ==
                JSON.stringify(opr_org_master_data.org ?? {})
            ) {
              continue;
            } else {
              // patch this record
              await this.callTorusAPI(
                `opr_org_master/${masterDataItem?.opr_om_id}`,
                {
                  method: 'PATCH',
                  token: token,
                  data: {
                    org_grp_name: opr_org_master_data.org_grp_name,
                    org: opr_org_master_data.org,
                    trs_modified_date: new Date().toISOString(),
                    trs_modified_by: payload?.loginId || 'anonymous',
                  },
                },
              );
            }
          }
          continue;
        } else {
          const response = await this.callTorusAPI('opr_org_master', {
            method: 'POST',
            token: token,
            data: opr_org_master_data,
          });
          if (response?.status == 201) {
            masterDataItem['opr_om_id'] = response.data?.opr_om_id;
          }
        }
      }

      // loop thorugh matrixData
      for (const matrixDataItem of incomingMatrixData) {
        // prepare data for opr_org_matrix table in torus
        const opr_org_matrix_data = {
          org_grp_code: matrixDataItem?.orgGrpCode,
          org_grp_name: matrixDataItem?.orgGrpName,
          org_grp_id: matrixDataItem?.orgGrpId,
          src_id: matrixDataItem?.srcId,
          org: matrixDataItem?.org,
          tenant_code: tenant,
          ag_code: ag,
          app_code: app,
          trs_created_date: new Date().toISOString(),
          trs_created_by: payload?.loginId || 'anonymous',
          trs_modified_date: new Date().toISOString(),
          trs_modified_by: payload?.loginId || 'anonymous',
          trs_status: '',
          trs_next_status: '',
          trs_process_id: '',
          trs_access_profile: payload?.selectedAccessProfile || '',
          trs_org_grp_code: payload?.orgGrpCode || '',
          trs_org_code: payload?.orgCode || '',
          trs_role_grp_code: payload?.roleGrpCode || '',
          trs_role_code: payload?.roleCode || '',
          trs_ps_grp_code: payload?.psGrpCode || '',
          trs_ps_code: payload?.psCode || '',
          trs_sub_org_grp_code: payload?.subOrgGrpCode || '',
          trs_sub_org_code: payload?.subOrgCode || '',
        };
        // if opr_mx_id exist then patch else post
        if (matrixDataItem?.opr_mx_id) {
          const matrixDataItemResponse = await this.callTorusAPI(
            `opr_org_matrix/${matrixDataItem?.opr_mx_id}`,
            {
              method: 'GET',
              token: token,
            },
          );
          if (matrixDataItemResponse?.status == 200) {
            const prevData = matrixDataItemResponse.data;
            if (
              prevData?.org_grp_name == opr_org_matrix_data.org_grp_name &&
              JSON.stringify(prevData?.org ?? {}) ==
                JSON.stringify(opr_org_matrix_data.org ?? {})
            ) {
              continue;
            } else {
              // patch this record
              await this.callTorusAPI(
                `opr_org_matrix/${matrixDataItem?.opr_mx_id}`,
                {
                  method: 'PATCH',
                  token: token,
                  data: {
                    org_grp_name: opr_org_matrix_data.org_grp_name,
                    org: opr_org_matrix_data.org,
                    trs_modified_date: new Date().toISOString(),
                    trs_modified_by: payload?.loginId || 'anonymous',
                  },
                },
              );
            }
          }
          continue;
        } else {
          const response = await this.callTorusAPI('opr_org_matrix', {
            method: 'POST',
            token: token,
            data: opr_org_matrix_data,
          });
          if (response.status == 201) {
            matrixDataItem['opr_mx_id'] = response.data?.opr_mx_id;
          }
        }
      }
      // Torus API OPR Table entry end

      // delete records from torus which are deleted from incoming data 
      for (const masterId of masterDataIdsToDelete) {
        await this.callTorusAPI(`opr_org_master/${masterId}`, {
          method: 'DELETE',
          token: token,
        });
      }

      for (const matrixId of matrixDataIdsToDelete) {
        await this.callTorusAPI(`opr_org_matrix/${matrixId}`, {
          method: 'DELETE',
          token: token,
        });
      }
      // delete records from torus which are deleted from incoming data

      await this.redisService.setJsonData(
        orgMasterKey,
        JSON.stringify(incomingMasterData),
        process.env.CLIENTCODE,
      );
      await this.redisService.setJsonData(
        orgMatrixKey,
        JSON.stringify(incomingMatrixData),
        process.env.CLIENTCODE,
      );
      return { message: 'Organization data saved successfully' };
    } catch (error) {
      await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'AUTH019',
        error,
        'User Screen',
        '',
        {
          artifact: 'User Screen',
          users: 'anonymous user',
        },
      );
      await this.throwCustomException(error);
    }
  }
}
