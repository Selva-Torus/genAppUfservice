import {
  BadGatewayException,
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
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
import { randomBytes, randomInt, scryptSync, timingSafeEqual } from 'crypto';
import * as nodemailer from 'nodemailer';
import { JwtServices } from 'src/jwt.services';
import { RuleService } from 'src/ruleService';
const jsonata = require('jsonata');
import * as fs from 'fs';
import * as path from 'path';
import axios, { AxiosRequestConfig, Method } from 'axios';
import * as FormData from 'form-data'; // Use this
import { Readable } from 'stream';
import { Pool } from 'pg';
//import { v4 as uuidv4 } from 'uuid';
import {
  FusionAuthApplicatonAssign,
  FusionAuthUserApplicatonGet,
  FusionAutRoleCRUDAlongWithApp,
  FusionAuthUserGet,
  FusionAuthUserCreation,
  FusionAuthGetTenantList,
  FusionAuthGetApplicationList,
  handleFusionAuthUserRegistrationForTokenLambda,
} from 'src/fusionAuth.api';
import { EnvData } from 'src/envData/envData.service';
import { decrypt } from 'src/decrypt';
import { format } from 'date-fns';
import { Cron } from '@nestjs/schedule';
//import { connectPG } from 'src/mongoClient';
// import { RuleService } from 'src/ruleService';
import { LockRecordDto } from 'src/dto';

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
  fusionauthRefreshTokenExpiryTimeinMinutes: string;
}

const tenant = process.env.TENANT;
const ag = process.env.APPGROUPCODE;
const app = process.env.APPCODE;
const appName = process.env.APPNAME;
const version = process.env.VERSION;
const schemaName = new URL(process.env.PG_URL).searchParams.get('schema');

@Injectable()
export class UfService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly jwtService: JwtServices,
    private readonly gorule: RuleService,
    private readonly redisService: RedisService,
    private readonly commonService: CommonService,
    private readonly envData: EnvData,
  ) {}
  private pool: Pool;

  async onModuleInit() {
    this.pool = new Pool({
      connectionString: process.env.PG_URL,
      application_name: `${tenant}_${ag}_${app}_ufService`,
      //   // Pool sizing
      max: 10, // max connections in pool
      min: 2, // keep at least 2 alive
      idleTimeoutMillis: 30000, // close idle connections after 30s
      connectionTimeoutMillis: 30000, // fail fast if can't connect in 5s
      allowExitOnIdle: false, // keep pool alive
    });
    // // 🔑 Key: handle pool-level errors so they don't crash the process
    this.pool.on('error', (err, client) => {
      console.error('Unexpected error on idle pg client:', err.message);
      //   // Do NOT re-throw — just log. Pool will recover automatically.
    });

    // Also handle process-level unhandled errors as safety net
    process.on('unhandledRejection', (reason) => {
      console.error('Unhandled Rejection:', reason);
    });

    try {
      const client = await this.pool.connect();
      console.log('PostgreSQL pool connected from uf.service');
      client.release();
    } catch (err: any) {
      console.error('Failed to connect to PostgreSQL:', err.message);
      throw err;
    }
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
      console.log('PostgreSQL pool closed');
    }
  }

  async query<T = any>(text: string, params?: any[]): Promise<T[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result.rows;
    } catch (err: any) {
      console.error('Query error:', err.message);
      throw err;
    } finally {
      client.release(); // always release back to pool
    }
  }

  async updateTable(
    tableName: string,
    data: Record<string, any>,
    primaryKey: string,
    tenantId?: string,
  ) {
    try {
      if (!tableName) throw new Error('Table name missing');

      const columns = Object.keys(data).filter((col) => col !== primaryKey);

      const setClause = columns
        .map((col, i) => `${col} = $${i + 1}`)
        .join(', ');

      const values = columns.map((col) => data[col]);

      const whereValue = data[primaryKey];

      let whereClause = `${primaryKey} = $${columns.length + 1}`;
      let params = [...values, whereValue];

      // 👉 Tenant condition
      if (tenantId) {
        whereClause += ` AND at_id = $${params.length + 1}`;
        params.push(tenantId);
      }

      const query = `
      UPDATE ${schemaName}.${tableName}
      SET ${setClause}
      WHERE ${whereClause}
      RETURNING *;
    `;

      const result = await this.query(query, params);

      return {
        message: `${tableName} updated successfully`,
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  async insertIntoTable(tableName: string, data: Record<string, any>) {
    try {
      if (!tableName) throw new Error('Table or schema missing');

      // Column names
      const columns = Object.keys(data);
      // Values placeholders $1, $2 ...
      const placeholders = columns.map((_, i) => `$${i + 1}`);
      // Values array
      const values = Object.values(data);

      // Final query
      const query = `
      INSERT INTO ${schemaName}.${tableName} (${columns.join(',')})
      VALUES (${placeholders.join(',')})
      RETURNING *;
    `;

      const result = await this.query(query, values);

      return {
        message: `${tableName} inserted successfully`,
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  getConfig(): FusionAuthConfig {
    return {
      fusionAuthBaseUrl: this.envData.getFusionAuthBaseUrl(),
      fusionAuthApiKey: this.envData.getFusionAuthApiKey(),
      authSecret: this.envData.getAuthSecret(),
      authAccessTokenExpiryTime: this.envData.getAuthAccessTokenExpiryTime(),
      authRefreshTokenExpiryTime: this.envData.getAuthRefreshTokenExpiryTime(),
      fusionauthRefreshTokenExpiryTimeinMinutes:
        this.envData.getFusionAuthRefreshTokenExpiryTimeInMinutes(),
    };
  }

  async getTenantAndApplicationFusionAuthIdSecret() {
    try {
      let tenantUniqueId = '';
      const { fusionAuthBaseUrl, fusionAuthApiKey } = this.getConfig();

      const possible_FA_tenant_name = `${tenant}-Tenant`;
      // CHECK EXISTENCE OF THE APPLICATION TENANT IN FUSIONAUTH
      const tenantList = await FusionAuthGetTenantList({
        name: possible_FA_tenant_name,
        fusionAuthBaseUrl: fusionAuthBaseUrl,
        fusionAuthApiKey: fusionAuthApiKey,
      });
      if (tenantList.length > 0) {
        tenantUniqueId = tenantList[0]?.id;
      } else {
        throw new Error('Tenant not registered in FusionAuth');
      }
      // step 2 => check for application existence , create if not exist and return application id
      const possibleApplicationNameInFusionAuth = `${tenant}-defaultApplication`;
      const applicationList = await FusionAuthGetApplicationList(
        tenantUniqueId,
        {
          fusionAuthBaseUrl: fusionAuthBaseUrl,
          fusionAuthApiKey: fusionAuthApiKey,
          name: possibleApplicationNameInFusionAuth,
        },
      );
      const existingApplication = applicationList.find(
        (a) => a.name == possibleApplicationNameInFusionAuth,
      );
      if (!existingApplication) {
        throw new BadRequestException(
          'Application not registered in FusionAuth',
        );
      } else {
        return {
          tenantUniqueId,
          applicationId: existingApplication?.id,
          fusionAuthAppClientSecret:
            existingApplication?.oauthConfiguration?.clientSecret,
        };
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
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

  async insertDocToVgphSourceTranDocMain(
    category: string,
    doc_name: string,
    url: string,
    size?: number,
    doc_group?: string,
  ): Promise<any> {
    try {
      const insertUrl = `${process.env.APP_MANAGER_URL}/ct010/attachments`;
      //const vgphstm_uuid = uuid();
      const currentDate = new Date().toISOString().slice(0, 19) + '+00:00';

      const payload = {
        category: category,
        doc_group: doc_group,
        doc_name: doc_name,
        doc_size: `${Math.ceil((size ?? 0) / 1024)}`,
        url: url,
        trs_created_date: currentDate,
        trs_modified_date: currentDate,
      };

      const response = await axios.post(insertUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data.attachment_id;
    } catch (error) {
      throw error;
    }
  }

  async getUrlByVgphstdmId(vgphstdm_id: any): Promise<string> {
    try {
      const getUrl = `${process.env.APP_MANAGER_URL}/ct010/attachments/${vgphstdm_id}`;

      const response = await axios.get(getUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data.data.url;
    } catch (error) {
      throw error;
    }
  }

  async getDFS(
    fileUrl: string | string[],
    enableEncryption: boolean,
  ): Promise<Buffer | Buffer[]> {
    try {
      // Normalize to array if single URL provided
      const urls = Array.isArray(fileUrl) ? fileUrl : [fileUrl];
      const fullUrls = urls.map(
        (url) => `${this.envData.getFtpOutputHost()}/${url}`,
      );
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
          throw new Error(
            `Failed to fetch file from ${url}: ${response.status}`,
          );
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
    enableEncryption?: string,
    doc_group?: string,
  ): Promise<string> {
    try {
      const SAFE_SEGMENT = /^[a-zA-Z0-9._-]+$/;

      const ALLOWED_EXTENSIONS: Record<string, string[]> = {
        jpg: ['image/jpeg'],
        jpeg: ['image/jpeg'],
        png: ['image/png'],
        gif: ['image/gif'],
        webp: ['image/webp'],
        svg: ['image/svg+xml'],
        pdf: ['application/pdf'],
        doc: ['application/msword'],
        docx: [
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
        xls: ['application/vnd.ms-excel'],
        xlsx: [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ],
        txt: ['text/plain'],
        csv: ['text/csv'],
        mp4: ['video/mp4'],
        mp3: ['audio/mpeg'],
        avi: ['video/x-msvideo'],
        mov: ['video/quicktime'],
        zip: ['application/zip', 'application/x-zip-compressed'],
        rar: ['application/vnd.rar', 'application/x-rar-compressed'],
      };

      const validateBucketFolderName = (value: string): void => {
        if (value.includes('/') || value.includes('\\')) {
          throw new BadRequestException(
            'bucketFoldername contains invalid characters',
          );
        }
        if (value === '.' || value.includes('..')) {
          throw new BadRequestException(
            'bucketFoldername contains path traversal',
          );
        }
        if (!SAFE_SEGMENT.test(value)) {
          throw new BadRequestException(
            'bucketFoldername contains unsafe characters',
          );
        }
      };

      const validateFolderPath = (value: string): void => {
        if (value.includes('\\')) {
          throw new BadRequestException(
            'folderPath contains invalid characters',
          );
        }
        if (value.includes('..')) {
          throw new BadRequestException('folderPath contains path traversal');
        }
        for (const segment of value.split('/')) {
          if (segment === '' || segment === '.') {
            throw new BadRequestException(
              `Invalid folderPath segment: "${segment}"`,
            );
          }
          if (!SAFE_SEGMENT.test(segment)) {
            throw new BadRequestException(
              `folderPath contains unsafe characters in segment: "${segment}"`,
            );
          }
        }
      };

      const validateFilename = (value: string): string => {
        if (!value) {
          throw new BadRequestException('Filename is required');
        }
        if (value.includes('/') || value.includes('\\')) {
          throw new BadRequestException('Filename contains invalid characters');
        }
        if (value === '.' || value.includes('..')) {
          throw new BadRequestException('Filename contains path traversal');
        }
        const dotIndex = value.lastIndexOf('.');
        if (dotIndex <= 0 || dotIndex === value.length - 1) {
          throw new BadRequestException('Filename must have a valid extension');
        }
        const ext = value.substring(dotIndex + 1).toLowerCase();
        if (!ALLOWED_EXTENSIONS[ext]) {
          throw new BadRequestException(
            `File extension ".${ext}" is not allowed`,
          );
        }
        return ext;
      };

      const validateMimeType = (mimetype: string, ext: string): void => {
        const allowedMimes = ALLOWED_EXTENSIONS[ext];
        if (!allowedMimes) {
          throw new BadRequestException(
            `File extension ".${ext}" is not allowed`,
          );
        }
        const normalizedMime = mimetype.split(';')[0].trim().toLowerCase();
        if (!allowedMimes.includes(normalizedMime)) {
          throw new BadRequestException(
            `MIME type "${normalizedMime}" is not allowed for extension ".${ext}"`,
          );
        }
      };

      const bucket = bucketFoldername || '';
      const subFolder = folderPath || '';
      const fileName = filename || file.filename;

      if (bucket) {
        validateBucketFolderName(bucket);
      }
      if (subFolder) {
        validateFolderPath(subFolder);
      }

      const ext = validateFilename(fileName);
      validateMimeType(file.mimetype, ext);

      const shouldEncrypt = enableEncryption === 'true';
      const fileBuffer = shouldEncrypt
        ? await this.commonService.aes256ctrEncrypt(file.buffer)
        : file.buffer;

      const form = new FormData();
      form.append('file', Readable.from(fileBuffer), {
        filename: fileName,
        contentType: file.mimetype || 'application/octet-stream',
      });

      const uploadUrl = `${this.envData
        .getSeaweedOutputHost()
        ?.replace(/\/$/, '')}/buckets/${bucket}/${subFolder}/${fileName}`;
      const uploadResponse = await axios.post(uploadUrl, form, {
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

      if (uploadResponse.status === 201) {
        const storagePath = `${bucket}/${subFolder}/${fileName}`;
        const attachmentId = await this.insertDocToVgphSourceTranDocMain(
          'front',
          fileName,
          storagePath,
          file.size,
          doc_group,
        );
        return `${attachmentId}`;
      } else {
        throw new ConflictException(
          uploadResponse.data || 'Error occurred while uploading file',
        );
      }
    } catch (error: any) {
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

  async setUpKey(key: string, token: string, tag?: string) {
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
            return {
              ...(presetData[sKey?.selectedPresetKey] || {}),
              localization: sKey?.appInfo?.localization || {},
            };
          } else {
            return {
              ...(presetData['default'] || {}),
              localization: sKey?.appInfo?.localization || {},
            };
          }
        } else {
          if (sKey?.tag) {
            return {
              ...(sKey[tag] || {}),
              localization: sKey?.appInfo?.localization || {},
            };
          } else {
            return {
              ...(sKey['default'] || {}),
              localization: sKey?.appInfo?.localization || {},
            };
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
    } catch (error: any) {
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
      var request: any = await this.redisService.getJsonData(
        key,
        process.env.CLIENTCODE,
      );
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

  async getpaginationwithLogicCenter(
    key: any,
    page,
    count,
    filter?,
    searchObj?,
    token?: string,
    filterData?,
    sortingDetails?,
  ) {
    try {
      let filterobj = {};
      let afkey = key.replace(':FNGK:AFP:FNK:DF-DST:', ':FNGK:AF:FNK:DF-DFD:');

      let dbnodeid = Object.keys(
        JSON.parse(
          await this.redisService.getJsonData(
            afkey + 'NDP',
            process.env.CLIENTCODE,
          ),
        ),
      )[0];
      if (filterData && Object.keys(filterData).length > 0) {
        filterobj = filterData?.find((n) => n.nodeId === dbnodeid);
        if (!filterobj) filterobj = {};
      }
      if (
        (filter && Object.keys(filter).length > 0) ||
        (searchObj && Object.keys(searchObj).length > 0)
      ) {
        filterobj['nodeId'] = dbnodeid;
      }

      //if(searchObj) filterobj = Object.assign(filterobj,searchObj)

      if (!page) page = 1;
      let rule: any;
      let start, end;
      if (count) {
        start = (page - 1) * count;
        end = start + count;
      }
      let payload = {
        key: afkey,
        count: count,
        page: page,
        afiflag: 'Y',
        searchFilter: searchObj,
      };
      const requestConfig: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 300000,
      };

      if (filter) {
        var json = JSON.parse(
          await this.redisService.getJsonDataWithPath(
            filter.ufKey,
            '.mappedData.artifact.node',
            process.env.CLIENTCODE,
          ),
        );
        if (json) {
          rule = json.find((f) => f.nodeId === filter.nodeId);
          if (!rule) throw `Node Id not found ${filter.nodeId}`;
          rule = rule.rule;

          let fobj = {};
          if (filterData && Object.keys(filterData).length > 0)
            fobj = Object.assign(fobj, filterData[0]);

          let { sobj, SessionInfo } = await this.commonService.sessionDecode(
            token,
            '',
          );
          fobj = Object.assign(fobj, { session: SessionInfo });
          const result = await this.gorule.goRule(rule, fobj);
          let queryobj;
          if (result?.result) {
            let ruleRes = result.result;
            let query: any = Object.values(ruleRes)[0];
            if (typeof query == 'string') {
              if (query?.includes('$$session.')) {
                Object.keys(sobj).forEach((key) => {
                  const regex = new RegExp(`\\$\\$${key}`, 'g');
                  const value = sobj[key];
                  query = query.replace(regex, value);
                });
              }
              queryobj = { [`${process.env.CLIENTCODE}_condition`]: query };
            } else {
              throw new CustomException('rule value does not exist', 403);
            }
          }
          // let decisionTable = rule.nodes?.find(n => n.type === "decisionTableNode");
          // if (decisionTable) {
          //   let ruleInputs = decisionTable.content?.inputs
          //   let ruleConditions = decisionTable.content?.rules
          //   let ruleobj = {}
          //   let sessionObj = await this.commonService.sessionDecode(token, '')
          //   let sobj = sessionObj?.sobj
          //   for (let rule of ruleConditions) {
          //     let matched = true
          //     // validate session fields for THIS RULE
          //     for (let input of ruleInputs) {
          //         let field = input.field
          //       if (field.includes('session.')) {
          //         let conditionValue = rule[input.id]
          //         if (conditionValue) {
          //           let expectedValue = JSON.parse(conditionValue)
          //           let sessionKey = sobj[field]
          //           if (sessionKey != expectedValue) {
          //             matched = false
          //             break
          //           }
          //         }
          //       }
          //     }
          //     // SKIP ENTIRE RULE
          //     if (!matched) {
          //       continue
          //     }
          //     // ONLY PUSH MATCHED RULE VALUES
          //     for (let input of ruleInputs) {

          //       let ruleField = input.field
          //       let ruleId = input.id
          //       // don't include session fields
          //       if (ruleField.includes('session.')) {
          //         continue
          //       }
          //       if (!rule[input.id]) {
          //         continue
          //       }
          //       let parsedValue = JSON.parse(rule[input.id])
          //        if(parsedValue?.includes('$$session.')){
          //              Object.keys(sobj).forEach(key => {
          //               const regex = new RegExp(`\\$\\$${key}`, 'g');
          //               const value = sobj[key];
          //               console.log("regex",regex);
          //                console.log("value",value);
          //               parsedValue = parsedValue.replace(regex, value);
          //               console.log("conditionValue",parsedValue);

          //           });
          //           }
          //       if (!ruleobj[ruleField]) {
          //         ruleobj[ruleField] = []
          //       }

          //       if (Array.isArray(parsedValue)) {
          //         ruleobj[ruleField].push(...parsedValue)
          //       } else {
          //         ruleobj[ruleField].push(parsedValue)
          //       }
          //     }
          //   }
          //   // remove duplicates
          //   Object.keys(ruleobj).forEach(key => {
          //     ruleobj[key] = [...new Set(ruleobj[key])]
          //   })

          filterobj = Object.assign(filterobj, queryobj);
          // }
        }
      }

      if (Object.keys(filterobj)?.length > 0) {
        payload['filterData'] = [filterobj];
      }

      if (sortingDetails && Object.keys(sortingDetails)?.length > 0) {
        payload['sortingDetails'] = sortingDetails;
      }

      let event_response = await this.commonService.postCall(
        //process.env.BE_URL + '/te/eventEmitter',
        this.envData.getBeUrl() + '/te/eventEmitter',
        payload,
        requestConfig,
      );
      let data = [];
      if (
        event_response?.status == 'Success' &&
        event_response?.statusCode == 201
      ) {
        let upid = event_response?.result?.upId;
        let tokenDecode = await this.jwtService.verifyToken(token);
        if (!tokenDecode?.loginId) throw 'loginId not found';

        data = await this.redisService.getAllRecordshash(
          `${key}${upid}:${tokenDecode.loginId}_DS_Object`,
        );
        let keys = await this.redisService.getKeys(
          `${key}${upid}:${tokenDecode.loginId}_DS_Object`,
          process.env.CLIENTCODE,
        );

        if (keys && keys.length > 0) {
          await Promise.all(
            keys.map((key) =>
              this.redisService.deleteKey(key, process.env.CLIENTCODE),
            ),
          );
        }
      }
      return {
        records: data,
        totalRecords: Number(data?.[0]?.total_records) || data.length,
      };
    } catch (err: any) {
      await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'TG036',
        `Error in pagination:${err.message}`,
        key,
        token,
      );
      throw err?.response?.data ? err?.response?.data : err;
    }
  }

  async applyFilters(data, searchFilter) {
    if (data?.length == 0 || !Array.isArray(data)) return data;
    return data.filter((item) => {
      return searchFilter.every((filter) => {
        const { key, operator, value, value2, type } = filter;

        const fieldValue = item[key];

        const field =
          fieldValue != null ? String(fieldValue).toLowerCase() : '';

        const searchValue = value != null ? String(value).toLowerCase() : '';

        switch (operator) {
          case '=':
            if (type == 'date') {
              return new Date(fieldValue).toISOString().startsWith(value);
            }
            return fieldValue == value;

          case '!=':
          case '<>':
            return fieldValue != value;

          case '>':
            return fieldValue > value;

          case '<':
            return fieldValue < value;

          case '>=':
            return fieldValue >= value;

          case '<=':
            return fieldValue <= value;

          case 'LIKE':
            return field.includes(searchValue);

          case 'LIKE_START':
            return field.startsWith(searchValue);

          case 'LIKE_END':
            return field.endsWith(searchValue);

          case 'BETWEEN':
            if (value == null || value2 == null) {
              return false;
            }
            return fieldValue >= value && fieldValue <= value2;

          case 'IS NULL':
            return fieldValue == null;

          case 'IS NOT NULL':
            return fieldValue != null;

          default:
            return true;
        }
      });
    });
  }

  async getpagination(
    key: any,
    page,
    count,
    filter?,
    searchObj?,
    token?: string,
    filterData?,
    sortingDetails?,
  ) {
    try {
      const tokenDecode = await this.jwtService.verifyToken(token);

      if (!tokenDecode?.selectedAccessProfile)
        throw new Error('Selected Access Profile not found');

      if (!tokenDecode?.loginId) throw new Error('loginId not found');

      // // ✅ Get AFI
      // const afkey = key.replace(':FNGK:AFP:FNK:DF-DST:', ':FNGK:AF:FNK:DF-DFD:');

      const afi = JSON.parse(
        await this.redisService.getJsonData(
          key.replace(':FNGK:AFP:FNK:DF-DST:', ':FNGK:AF:FNK:DF-DFD:') + 'AFI',
          process.env.CLIENTCODE,
        ),
      );

      if (!afi.logicCenter) {
        return await this.getpaginationwithLogicCenter(
          key,
          page,
          count,
          filter,
          searchObj,
          token,
          filterData,
          sortingDetails,
        );
      }

      // ✅ Build session object
      const sobj: any = {
        orgGrpCode: tokenDecode?.orgGrpCode,
        orgCode: tokenDecode?.orgCode,
        roleGrpCode: tokenDecode?.roleGrpCode,
        roleCode: tokenDecode?.roleCode,
        psGrpCode: tokenDecode?.psGrpCode,
        psCode: tokenDecode?.psCode,
        selectedAccessProfile: tokenDecode?.selectedAccessProfile,
        loginId: tokenDecode?.loginId,
        orgGrpName: tokenDecode?.orgGrpName,
        orgName: tokenDecode?.orgName,
        roleGrpName: tokenDecode?.roleGrpName,
        roleName: tokenDecode?.roleName,
        psGrpName: tokenDecode?.psGrpName,
        psName: tokenDecode?.psName,
        userCode: tokenDecode?.userCode,
        subOrgGrpCode: tokenDecode?.subOrgGrpCode,
        subOrgGrpName: tokenDecode?.subOrgGrpName,
        subOrgCode: tokenDecode?.subOrgCode,
        subOrgName: tokenDecode?.subOrgName,
      };

      // ✅ Get dataset
      const dsObject = await this.redisService.getAllRecordshash(
        key + tokenDecode.loginId + '_DS_Object',
      );

      if (!dsObject) {
        throw new Error('DataSet does not exist');
      }

      let data = dsObject;

      // ✅ Pagination calc
      page = page || 1;
      const start = count ? (page - 1) * count : 0;
      const end = count ? start + count : data.length;

      if (sortingDetails && Object.keys(sortingDetails).length > 0)
        data = this.sortRecords(data, sortingDetails);

      let finalData: any[] = [];

      // ================= FILTER =================
      if (filter) {
        const json = JSON.parse(
          await this.redisService.getJsonDataWithPath(
            filter.ufKey,
            '.mappedData.artifact.node',
            process.env.CLIENTCODE,
          ),
        );

        if (!json) throw new Error('Node is empty');

        let rule;
        for (const node of json) {
          if (node.nodeId == filter.nodeId) {
            rule = node.rule;
            break;
          }
        }

        if (!rule?.nodes?.length) throw new Error('Invalid rule');

        for (let j = 0; j < data.length; j++) {
          const record = data[j];
          let gparamreq: any = {};
          let fieldarr: string[] = [];

          // ✅ Extract fields from rule
          for (const node of rule.nodes) {
            const inputs = node?.content?.inputs;
            if (inputs?.length) {
              for (const inp of inputs) {
                fieldarr.push(inp.field);
              }
            }
          }

          if (!fieldarr.length) throw new Error('Field not found in rule');
          let parts, root, nestedPath;
          // ✅ Build gparamreq safely
          for (const fieldPath of fieldarr) {
            if (fieldPath.includes('.')) {
              parts = fieldPath.split('.');
              root = parts.shift();
              nestedPath = parts.join('.');
            } else {
              nestedPath = fieldPath;
            }
            let source;
            if (root === 'session') {
              source = sobj;
            } else {
              source = record;
            }
            const value = await this.commonService.getNestedValue(
              source,
              nestedPath,
            );

            if (value !== undefined) {
              await this.commonService.setNestedValue(
                gparamreq,
                fieldPath,
                value,
              );
            }
          }

          // ✅ Execute rule
          const result = await this.gorule.goRule(rule, gparamreq);

          if (result?.result?.output === true) {
            finalData.push(record);
          }
        }
      } else {
        finalData = data;
      }

      // ================= SEARCH =================
      if (
        searchObj &&
        !Array.isArray(searchObj) &&
        Object.keys(searchObj).length > 0
      ) {
        finalData = finalData.filter((item) =>
          Object.entries(searchObj).every(([key, value]) => {
            const itemVal = item[key];

            if (Array.isArray(value)) {
              return value.some((v) =>
                typeof v === 'string' && typeof itemVal === 'string'
                  ? itemVal.toLowerCase().includes(v.toLowerCase())
                  : v === itemVal,
              );
            }

            if (typeof value === 'string' && typeof itemVal === 'string') {
              return itemVal.toLowerCase().includes(value.toLowerCase());
            }

            return itemVal == value;
          }),
        );
      } else if (Array.isArray(searchObj) && searchObj?.length > 0) {
        finalData = await this.applyFilters(finalData, searchObj);
      }

      // ================= PAGINATION =================
      return await this.filterpagination(start, end, finalData);
    } catch (err: any) {
      await this.commonService.errorLog(
        'Technical',
        'AK',
        'Fatal',
        'TG036',
        `Error in pagination: ${err.message}`,
        key,
        token,
      );
      throw new CustomException(err.message, err.statusCode);
    }
  }

  private sortRecords(
    records: any[],
    sortingDetails: Record<string, 'asc' | 'desc'>,
  ): any[] {
    const sortingColumn = Object.keys(sortingDetails)[0];
    const sortDirection = sortingDetails[sortingColumn];

    if (!sortingColumn || !sortDirection) {
      return records;
    }

    return [...records].sort((a, b) => {
      const valueA = a[sortingColumn];
      const valueB = b[sortingColumn];

      if (valueA == null && valueB == null) {
        return 0;
      }

      if (valueA == null) {
        return sortDirection === 'asc' ? -1 : 1;
      }

      if (valueB == null) {
        return sortDirection === 'asc' ? 1 : -1;
      }

      let result = 0;

      // Number sorting (including numeric strings)
      if (!isNaN(Number(valueA)) && !isNaN(Number(valueB))) {
        result = Number(valueA) - Number(valueB);
      }

      // Date sorting
      else if (!isNaN(Date.parse(valueA)) && !isNaN(Date.parse(valueB))) {
        result = new Date(valueA).getTime() - new Date(valueB).getTime();
      }

      // String sorting
      else {
        result = String(valueA).localeCompare(String(valueB), undefined, {
          sensitivity: 'base',
        });
      }

      return sortDirection === 'desc' ? -result : result;
    });
  }

  async filterpagination(start, end, searcharr) {
    try {
      var filArray = [];
      if (end) {
        for (let i = start; i < end; i++) {
          if (searcharr[i] != null) filArray.push(searcharr[i]);
        }
      } else {
        for (let i = 0; i < searcharr.length; i++) {
          if (searcharr[i] != null) filArray.push(searcharr[i]);
        }
      }

      // return { records: filArray, totalRecords: searcharr.length };
      return { records: filArray, totalRecords: searcharr?.length };
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async getValueByPath(obj, path) {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  }

  async OrchestrationBatch(key: string, token: string, accessProfile: any[]) {
    const UO: any = await this.commonService.readAPI(
      key + ':UO',
      process.env.CLIENTCODE,
      token,
    );

    if (!UO) return 'UO not found';

    const pageData = await this.Orchestration(
      key,
      null,
      null,
      token,
      false,
      accessProfile,
      UO,
    );
    const groupData: Record<string, any> = {};
    const controlData: Record<string, Record<string, any>> = {};
    const [UFSData, NDPData] = await Promise.all([
      this.commonService.readAPI(key + ':UFS', process.env.CLIENTCODE, token),
      this.commonService.readAPI(key + ':NDP', process.env.CLIENTCODE, token),
    ]);

    if (!Array.isArray(UFSData)) {
      throw new Error(
        `Expected UFSData to be an array, got: ${typeof UFSData}`,
      );
    }

    for (const UFS of UFSData) {
      if (UFS.type === 'Canvas') {
        continue;
      }
      if (
        UFS.groupType == 'group' ||
        UFS?.groupType == 'subscreen' ||
        UFS?.groupType == 'artifactgroup' ||
        UFS.type === 'tab_group' ||
        UFS.type === 'stepper_group' ||
        UFS.type === 'stepper_header' ||
        UFS.groupType == 'table' ||
        UFS.type === 'tab_header' ||
        UFS.groupType == 'dynamictable' ||
        UFS.groupType == 'dynamicactions' ||
        UFS.groupType == 'grouparray'
      ) {
        const isTable = UFS.groupType === 'table';
        const result = await this.Orchestration(
          key,
          UFS.id,
          null,
          token,
          isTable,
          accessProfile,
          UO,
          UFSData,
          NDPData,
        );
        groupData[UFS.id] = result;
      } else {
        const result = await this.Orchestration(
          key,
          UFS.T_parentId,
          UFS.id,
          token,
          false,
          accessProfile,
          UO,
          UFSData,
          NDPData,
        );
        controlData[UFS.T_parentId] = {
          ...controlData[UFS.T_parentId],
          [UFS.id]: result,
        };
      }
    }

    return { pageData, groupData, controlData };
  }

  async Orchestration(
    key: string,
    componentId: string,
    controlId: string,
    token: string,
    isTable?: boolean,
    accessProfile?: any[],
    preloadedUO?: any,
    preloadedUFS?: any,
    preloadedNDP?: any,
  ) {
    try {
      const UO: any =
        preloadedUO ??
        (await this.commonService.readAPI(
          key + ':UO',
          process.env.CLIENTCODE,
          token,
        ));
      const screenName: string = key.split(':')[11];
      let mappedData: any = UO.mappedData.artifact.node;
      const securityData: any = UO.securityData;
      let templateArray: any[] = securityData.accessProfile;
      const decodedToken: any = await this.jwtService.verifyToken(token);
      let object: any = {};
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
      let accessProfileCheck: boolean = false;
      if (UO) {
        if (key && !componentId && !controlId) {
          /*---------security start-------------*/
          if (key === securityData.afk) {
            for (let i = 0; i < templateArray.length; i++) {
              if (
                accessProfile.includes(templateArray[i].accessProfile) &&
                screenName === templateArray[i].security.artifact.resource
              ) {
                accessProfileCheck = true;
                security =
                  templateArray[i].security.artifact.SIFlag.selectedValue;
                templateArray[i].security.artifact?.node?.map((nodes: any) => {
                  allowedGroup.push({
                    groupName: nodes?.resource,
                    security: nodes?.SIFlag.selectedValue,
                  });
                });
                break;
              }
            }
            if (!accessProfileCheck) {
              //--------------------------
              mappedData?.map((nodes: any) => {
                allowedGroup.push({
                  groupName: nodes?.nodeName,
                  security: 'AA',
                });
              });
              security = 'AA';
              //--------------------------
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
          let artfactPFRule = {};
          if (
            'rulekey' in UO.mappedData.artifact?.rule &&
            UO.mappedData.artifact?.rule?.rulekey?.length > 0
          ) {
            let RuleKey = UO.mappedData.artifact?.rule?.rulekey[0]?.split(':');
            if (RuleKey?.length == 7) {
              let pfRuleKey = `CK:${RuleKey[0]}:FNGK:${RuleKey[1]}:FNK:${RuleKey[2]}:CATK:${RuleKey[3]}:AFGK:${RuleKey[4]}:AFK:${RuleKey[5]}:AFVK:${RuleKey[6]}`;
              const tempRule: any = await this.commonService.readAPI(
                pfRuleKey + ':NDP',
                process.env.CLIENTCODE,
                token,
              );
              if (tempRule != null && tempRule != undefined) {
                Object.keys(tempRule).map((keys: any) => {
                  if (tempRule[keys]?.rule) {
                    artfactPFRule = tempRule[keys].rule;
                  }
                });
              }
            }
          }

          object = {
            action: UO.mappedData.artifact?.action,
            code: UO.mappedData.artifact?.code,
            artfactPFRule,
            rule: UO.mappedData.artifact?.rule,
            events: UO.mappedData.artifact?.events,
            mapper: UO.mappedData.artifact?.mapper,
            security: security,
            allowedGroup: allowedGroup,
            DFkeys: DFkeys,
          };
          return object;
        } else if (key && componentId && !controlId) {
          let controllerRule: any = {};
          /*---------security start-------------*/
          if (key === securityData.afk) {
            for (let i = 0; i < templateArray.length; i++) {
              for (
                let j = 0;
                j < templateArray[i].security.artifact.node.length;
                j++
              ) {
                if (accessProfile.includes(templateArray[i].accessProfile)) {
                  accessProfileCheck = true;
                  if (
                    screenName ===
                      templateArray[i].security.artifact.resource &&
                    componentId ===
                      templateArray[i].security.artifact.node[j].resourceId
                  ) {
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
                    for (
                      let m = 0;
                      m < templateArray[i].security.artifact.node.length;
                      m++
                    ) {
                      if (selectedValues.includes('ATO')) {
                        if (
                          templateArray[i].security.artifact.node[m].SIFlag
                            .selectedValue === 'ATO'
                        ) {
                          componentNameArray.push(
                            templateArray[i].security.artifact.node[
                              m
                            ].resource.toLowerCase(),
                          );
                          break;
                        }
                      } else {
                        if (
                          templateArray[i].security.artifact.node[m].SIFlag
                            .selectedValue === 'AA'
                        ) {
                          componentNameArray.push(
                            templateArray[i].security.artifact.node[
                              m
                            ].resource.toLowerCase(),
                          );
                        }
                        if (
                          templateArray[i].security.artifact.node[m].SIFlag
                            .selectedValue === 'RA'
                        ) {
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
                    break;
                  }
                }
              }
            }
            if (!accessProfileCheck) {
              //--------------
              for (let m = 1; m < mappedData.length; m++) {
                componentNameArray.push(mappedData[m].nodeName.toLowerCase());
                for (let k = 0; k < mappedData[m].objElements.length; k++) {
                  controlNames.push(
                    mappedData[m].objElements[k].elementName.toLowerCase(),
                  );
                }
              }
              controlNames = controlNames.map((item) => item.toLowerCase());
              //--------------
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
              for (let j = 0; j < mappedData[i].objElements.length; j++) {
                if (mappedData[i].objElements[j].mapper.length > 0) {
                  let mapperDetails: any = {};
                  mapperDetails['elementname'] =
                    mappedData[i].objElements[j].elementName;
                  mapperDetails['sourcekey'] =
                    mappedData[i].objElements[j].mapper[0].sourceKey[0];
                  mapperDetails['targetkey'] =
                    mappedData[i].objElements[j].mapper[0].targetKey;
                  mappedData[i]?.mapper.push(mapperDetails);
                }
                if (componentId == mappedData[i].objElements[j]?.parentId) {
                  let tempRule: any = mappedData[i].objElements[j]?.rule;
                  if ('nodes' in tempRule && 'edges' in tempRule) {
                    controllerRule = {
                      ...controllerRule,
                      [mappedData[i].objElements[j]?.elementName]: tempRule,
                    };
                  }
                }
              }
              object = {
                action: mappedData[i]?.action,
                code: mappedData[i]?.code,
                rule: mappedData[i]?.rule,
                events: { eventSummary: mappedData[i].events?.eventSummary },
                mapper: mappedData[i]?.mapper,
                GoRuleData: controllerRule,
              };
            }
          }
          let mappperNodeId: any = '';
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
                    mappperNodeId =
                      mappedData[i].objElements[
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
                mappperNodeId: mappperNodeId,
              };
            } catch (err) {
              object = {
                ...object,
                security: controlNames,
                allowedGroups: componentNameArray,
                readableControls: readableControls,
                dfKey: dfKey,
                mappperNodeId: mappperNodeId,
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
              mappperNodeId: mappperNodeId,
            };
          }
          // Fallback: if no security entry found for this componentId, return basic object
          if (Object.keys(object).length === 0) {
            object = {
              componentId,
              security: [],
              allowedGroups: [],
              readableControls: [],
              dfKey: '',
              noSecurityEntry: true, // flag to indicate no security config exists for this group
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
                    const UFSData =
                      preloadedUFS ??
                      (await this.commonService.readAPI(
                        key + ':UFS',
                        process.env.CLIENTCODE,
                        token,
                      ));
                    let tempAPIData = {
                      parentId: '',
                      virtualControllerKey: '',
                      apiKey: '',
                    };
                    if (UFSData?.length > 0) {
                      for (let o = 0; o < UFSData?.length; o++) {
                        if (
                          UFSData[o].id == mappedData[i].nodeId &&
                          'virtualControllerKey' in UFSData[o]
                        ) {
                          tempAPIData = {
                            ...tempAPIData,
                            virtualControllerKey:
                              UFSData[o]?.virtualControllerKey,
                            parentId: UFSData[o]?.T_parentId,
                          };
                          break;
                        }
                      }
                      if (
                        tempAPIData?.parentId != '' &&
                        tempAPIData?.virtualControllerKey != ''
                      ) {
                        for (let o = 0; o < UFSData?.length; o++) {
                          if (
                            UFSData[o].id == tempAPIData?.parentId &&
                            'virtualControllerKey' in UFSData[o] &&
                            UFSData[o]?.virtualControllerKey ==
                              tempAPIData?.virtualControllerKey
                          ) {
                            tempAPIData = {
                              ...tempAPIData,
                              apiKey: UFSData[o]?.apiKey,
                            };
                            break;
                          }
                        }
                      }
                      if (
                        tempAPIData?.apiKey != undefined &&
                        tempAPIData?.apiKey != ''
                      ) {
                        let NDPScehemaData = await this.commonService.readAPI(
                          tempAPIData?.apiKey,
                          process.env.CLIENTCODE,
                          token,
                        );
                        if (Object.keys(NDPScehemaData)?.length > 0) {
                          let schema: any = {};
                          Object.keys(NDPScehemaData)?.map((keys: any) => {
                            if (
                              NDPScehemaData[keys]?.nodeType ==
                              'datasetschemanode'
                            ) {
                              if (
                                'properties' in NDPScehemaData[keys]?.dataset
                              ) {
                                schema =
                                  NDPScehemaData[keys]?.dataset?.properties;
                              } else if (
                                'items' in NDPScehemaData[keys]?.dataset
                              ) {
                                schema =
                                  NDPScehemaData[keys]?.dataset?.items
                                    ?.properties;
                              }
                            }
                          });
                          if (Object.keys(schema)?.length > 0) {
                            if (
                              mappedData[i].objElements[j]?.elementName in
                              schema
                            ) {
                              dataType =
                                schema[
                                  mappedData[i].objElements[j]?.elementName
                                ]?.type;
                            }
                          }
                        }
                      }
                    }
                  } else {
                    if (
                      mappedData[i].objElements[j].elementType == 'dropdown'
                    ) {
                      for (
                        let k = 0;
                        k < mappedData[i].objElements[j].mapper.length;
                        k++
                      ) {
                        if (
                          mappedData[i].objElements[j].mapper[k].targetKey
                            .split('|')
                            .at(-1) == 'value'
                        ) {
                          dfKey =
                            mappedData[i].objElements[j].mapper[
                              k
                            ].sourceKey[0].split('|')[0];
                        }
                      }
                    } else {
                      dfKey =
                        mappedData[i].objElements[
                          j
                        ].mapper[0].sourceKey[0].split('|')[0];
                    }
                    let dfdNode: string =
                      mappedData[i].objElements[j].mapper[0].sourceKey[0].split(
                        '|',
                      )[1];
                    let dfdSource: string = mappedData[i].objElements[
                      j
                    ].mapper[0].sourceKey[0]
                      .split('|')[2]
                      .split('.')
                      .at(-1);
                    let dfPath: string =
                      mappedData[i].objElements[j].mapper[0].sourceKey[0].split(
                        '|',
                      )[2];
                    let dfSchemaKey = await this.commonService.readAPI(
                      dfKey + ':DFO',
                      process.env.CLIENTCODE,
                      token,
                    );

                    for (let dfo = 0; dfo < dfSchemaKey.length; dfo++) {
                      if (dfSchemaKey[dfo].nodeId == dfdNode) {
                        dataType = await this.getValueByPath(
                          dfSchemaKey[dfo].schema,
                          dfPath + '.type',
                        );
                        console.log('dataType ==> ', dataType);
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

                  if (
                    mappedData[i].objElements[j]?.elementType ==
                    'dynamicjsonform'
                  ) {
                    let ruleKey: string = '';
                    let pfRuleData: any = {};
                    const NDPData =
                      preloadedNDP ??
                      (await this.commonService.readAPI(
                        key + ':NDP',
                        process.env.CLIENTCODE,
                        token,
                      ));
                    if (controlId in NDPData) {
                      ruleKey = NDPData[controlId]?.apiKey || '';
                      if (ruleKey) {
                        let temp: any = await this.commonService.readAPI(
                          ruleKey,
                          process.env.CLIENTCODE,
                          token,
                        );
                        Object.keys(temp)?.map((eachKey) => {
                          if (temp[eachKey]?.rule) {
                            pfRuleData = temp[eachKey]?.rule;
                          }
                        });
                      }
                    }
                    object = {
                      action: mappedData[i].objElements[j]?.action,
                      code: mappedData[i].objElements[j]?.code,
                      pfRuleData: pfRuleData,
                      rule: mappedData[i].objElements[j]?.rule,
                      events: {
                        eventSummary:
                          mappedData[i].objElements[j]?.events?.eventSummary,
                      },
                      mapper: mappedData[i].objElements[j]?.mapper,
                      // dstData: DS_Object?.data || [],
                      schemaData,
                    };
                  } else {
                    object = {
                      action: mappedData[i].objElements[j]?.action,
                      code: mappedData[i].objElements[j]?.code,
                      rule: mappedData[i].objElements[j]?.rule,
                      events: {
                        eventSummary:
                          mappedData[i].objElements[j]?.events?.eventSummary,
                      },
                      mapper: mappedData[i].objElements[j]?.mapper,
                      dfdKey: dfKey + ':',
                      // dstData: DS_Object?.data || [],
                      schemaData,
                      dataType,
                    };
                  }
                  if (mappedData[i].objElements[j]?.elementType == 'editor') {
                    let editorMapper: any = [];
                    object?.mapper?.map((eachResource: any) => {
                      let temp: any = {
                        sourceKey:
                          eachResource?.sourceKey[0]?.split('/')?.at(-1) || '',
                        targetKey:
                          eachResource?.targetKey?.split('|')?.at(-1) || '',
                      };
                      editorMapper.push(temp);
                    });
                    object.mapper = editorMapper;
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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
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
                        let ifoValue: any =
                          POdata?.mappedData?.artifact?.node[i]?.ifo[j]?.value;
                        if (nodeName in formData) {
                          filterItems[nodeName] = formData[nodeName];
                        } else if (ifoValue != undefined && ifoValue !== '') {
                          if (
                            filterItems[nodeName] == undefined ||
                            filterItems[nodeName] === ''
                          ) {
                            filterItems[nodeName] = ifoValue;
                          }
                        }
                      }
                    }
                    if ('trs_version' in formData) {
                      filterItems['trs_version'] = formData['trs_version'];
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
      } catch (error: any) {
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
                    let groupArraysData: any = {};
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
                        let ifoValue: any =
                          POdata?.mappedData?.artifact?.node[i]?.ifo[j]?.value;
                        if (formData[nodeName] != undefined) {
                          filterItems[nodeName] = formData[nodeName];
                        } else if (ifoValue != undefined && ifoValue !== '') {
                          if (
                            filterItems[nodeName] == undefined ||
                            filterItems[nodeName] === ''
                          ) {
                            filterItems[nodeName] = ifoValue;
                          }
                        } else if (filterItems[nodeName] == undefined) {
                          filterItems[nodeName] = '';
                        }
                      }
                    }
                    if ('trs_version' in formData) {
                      filterItems['trs_version'] = formData['trs_version'];
                    }

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
                        if ('_groupArrays_' in formData) {
                          formData['_groupArrays_'].forEach(
                            (arrayKey: string) => {
                              formData[arrayKey]?.map(
                                (groupArrayItems: any, index: number) => {
                                  let nodeName: string =
                                    POdata.mappedData.artifact.node[i].ifo[
                                      j
                                    ].name.toLocaleLowerCase();
                                  if (groupArrayItems[nodeName] != undefined) {
                                    if (!(arrayKey in groupArraysData)) {
                                      groupArraysData = {
                                        ...groupArraysData,
                                        [arrayKey]: [],
                                      };
                                    }
                                    groupArraysData[arrayKey][index] = {
                                      ...(groupArraysData[arrayKey][index] ||
                                        {}),
                                      [nodeName]: groupArrayItems[nodeName],
                                    };
                                  }
                                },
                              );
                            },
                          );
                        }
                      }
                    }
                    if ('childTables' in formData) {
                      formData.childTables.map((eachTable: any) => {
                        filterItems[eachTable] = formData[eachTable];
                      });
                      return filterItems;
                    } else return { ...filterItems, ...groupArraysData };
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
      } catch (error: any) {
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
    } catch (error: any) {
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
    primaryKey: string,
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
    } catch (error: any) {
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
      const decodedToken: any = await this.jwtService.verifyToken(token);
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

      let payload: any;
      try {
        payload = await this.jwtService.verifyToken(token);
      } catch (e) {
        payload = null;
      }
      if (!payload || !payload.tenant || !payload.type) {
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
      const sessionList =
        sessionListCache && JSON.parse(sessionListCache)
          ? JSON.parse(sessionListCache)
          : [];
      if (!sessionList || !Array.isArray(sessionList) || !sessionList.length) {
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
    } catch (error: any) {
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
    ufClientType: string,
  ) {
    try {
      const config = this.getConfig();

      const accessProfileList = await this.getAccessTemplate(token, true);
      const filteredAccessprofile = accessProfileList.find(
        (t: any) => t?.accessProfile === selectedAccessProfile,
      );
      if (!filteredAccessprofile) {
        throw new NotFoundException('Selected access profile not found');
      }
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
      const payload = await this.jwtService.verifyToken(token);
      const {
        type,
        tenant: tenantFromToken,
        loginId,
        isAppAdmin,
        sid,
        userCode,
        tenantId,
        tid: tenantUniqueId,
        sub: userUniqueId,
        applicationId,
      } = payload;
      const sessionListCacheKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenantFromToken}:AFGK:${ag}:AFK:${app}:AFVK:v1:session`;

      const sessionListResponse = await this.redisService.getJsonData(
        sessionListCacheKey,
        process.env.CLIENTCODE,
      );
      let updatedSessionList = [];
      let updatedToken;
      if (sessionListResponse) {
        const sessionList = JSON.parse(sessionListResponse);
        updatedSessionList = await this.checkSession(sessionList);
        const previousActiveSession = updatedSessionList.find(
          (session: any) => session?.sid === sid,
        );

        if (!previousActiveSession?.refreshToken) {
          throw new BadGatewayException(
            'No active FusionAuth session found for this token',
          );
        }

        let tokenData = {
          type,
          tenant,
          loginId,
          isAppAdmin,
          ag,
          app,
          selectedAccessProfile,
          dap,
          userCode,
          ...accessObj,
          userUniqueId,
          tenantId,
        };

        // add here patch required data to the registration object
        await handleFusionAuthUserRegistrationForTokenLambda(
          tenantUniqueId,
          applicationId,
          config.fusionAuthApiKey,
          config.fusionAuthBaseUrl,
          userUniqueId,
          tokenData,
        );
        const value = await this.fusionAuthVerifyRefreshToken(
          previousActiveSession?.refreshToken,
          tenantId,
        );
        updatedToken = value.access_token;

        updatedSessionList = updatedSessionList
          .filter((s: any) => s?.sid !== sid)
          .concat({
            ...previousActiveSession,
            accessToken: updatedToken,
            updatedOn: new Date().toISOString(),
          });
      } else {
        throw new BadGatewayException('No active session found');
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
    } catch (error: any) {
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

  async getAccessTemplate(
    token: string,
    calledInternally: boolean = false,
    tenantOverride?: string,
  ) {
    try {
      const accountDetails = await this.MyAccountForClient(token, 's', true);
      const { accessProfile } = accountDetails;
      const effectiveTenant = tenantOverride || tenant;
      const accessProfileList = await this.query(
        `select 
        opr_ap_id ,
        access_profile as "accessProfile" ,
        dap ,
        org_grp as "orgGrp" ,
        users_cnt as "no.ofusers" ,
        trs_created_date::text as "createdOn" ,
        role_unique_id as "roleUniqueId" ,
        assigned_keys as "assignedKeys"
        from 
        ${schemaName}.tam_opr_access_profile 
        where 
        tenant_code=$1 and ag_code=$2 and app_code=$3 and trs_tenant_id=$1`,
        [effectiveTenant, ag, app],
      );
      if (
        accessProfileList &&
        Array.isArray(accessProfileList) &&
        accessProfileList.length
      ) {
        const filteredAccessTemplate = accessProfileList.filter(
          (template: any) => accessProfile.includes(template?.accessProfile),
        );
        if (calledInternally) {
          return filteredAccessTemplate;
        }
        return this.transformToCombinations(filteredAccessTemplate);
      } else {
        throw new NotFoundException('Access Template not found');
      }
    } catch (error: any) {
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

  // Maker-checker entitlement check (R2 remediation): the ERD services'
  // approve/reject branches previously trusted the client-supplied
  // xCdcaRole header on its own. This resolves the caller's own
  // access-profile templates (by verified token, not by header) and checks
  // for a capability key of the form "<module>:AUTHORIZE" in
  // tam_opr_access_profile.assigned_keys. Fails closed: any lookup error,
  // missing template, or unrecognized assignedKeys shape returns false.
  async hasCapability(
    token: string,
    capabilityKey: string,
    tenantOverride?: string,
  ): Promise<boolean> {
    try {
      const templates: any[] = await this.getAccessTemplate(
        token,
        true,
        tenantOverride,
      );
      if (!Array.isArray(templates)) return false;
      return templates.some((template: any) => {
        const raw = template?.assignedKeys;
        if (!raw) return false;
        let keys: any[];
        if (Array.isArray(raw)) {
          keys = raw;
        } else if (typeof raw === 'string') {
          try {
            const parsed = JSON.parse(raw);
            keys = Array.isArray(parsed) ? parsed : raw.split(',');
          } catch {
            keys = raw.split(',');
          }
        } else {
          return false;
        }
        return keys.some(
          (k: any) => typeof k === 'string' && k.trim() === capabilityKey,
        );
      });
    } catch {
      return false;
    }
  }

  async fusionAuthVerifyRefreshToken(
    refreshToken: string,
    tenantId?: string,
  ): Promise<any> {
    try {
      const config = this.getConfig();
      const fusionAuthBaseUrl = config.fusionAuthBaseUrl;
      let ApplicationTenantDetails: any;
      const fusionAuthTenantANDAppDetails =
        await this.getTenantAndApplicationFusionAuthIdSecret();

      // prepare the tenant id ,application id and secret from the client tpc
      const url = `${fusionAuthBaseUrl}/oauth2/token`;

      if (tenantId !== tenant) {
        ApplicationTenantDetails =
          await this.getApplicationTenantFusionauthDetails(tenantId);
      }

      const params = new URLSearchParams();
      params.append('grant_type', 'refresh_token');
      params.append('refresh_token', refreshToken);

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            tenantId !== tenant
              ? 'Basic ' +
                btoa(
                  ApplicationTenantDetails.fusionAuthApplicationTenantId +
                    ':' +
                    ApplicationTenantDetails.fusionAuthApplicationTenantClientSecret,
                )
              : 'Basic ' +
                btoa(
                  fusionAuthTenantANDAppDetails.applicationId +
                    ':' +
                    fusionAuthTenantANDAppDetails.fusionAuthAppClientSecret,
                ),
          'X-FusionAuth-TenantId':
            tenantId !== tenant
              ? ApplicationTenantDetails.applicationTenantUniqueId
              : fusionAuthTenantANDAppDetails.tenantUniqueId,
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
      const config = this.getConfig();
      const refreshTokenExpiryTime = config.authRefreshTokenExpiryTime;
      const fusionauthRefreshTokenExpiryTimeinMinutes =
        config.fusionauthRefreshTokenExpiryTimeinMinutes;
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
      return [];
    }
  }

  async MyAccountForClient(token: string, key: string, authorization: any) {
    if (authorization) {
      try {
        let payload: any;
        try {
          payload = await this.jwtService.verifyToken(token);
        } catch (e) {
          payload = null;
        }
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
          const userList = await this.query(
            `SELECT
            au.org_au_id,
            tu.user_unique_id AS "userUniqueId",
            tu.email,
            tu.first_name AS "firstName",
            tu.last_name AS "lastName",
            tu.login_id AS "loginId",
            tu.user_code AS "userCode",
            tu.trs_created_date::text AS "dateAdded",
            tu.status,
            au.is_app_admin as "isAppAdmin",
            au.no_of_products_service AS "noOfProductsService",
            au.access_profile AS "accessProfile",
            au.last_active AS "lastActive"
          FROM ${schemaName}.tam_tenant_user tu
          JOIN ${schemaName}.tam_app_user au
            ON au.org_tu_id = tu.org_tu_id
          WHERE au.tenant_code = $1
            AND au.ag_code     = $2
            and au.trs_tenant_id=$1
            AND au.app_code    = $3 AND (login_id=$4 or email=$4)`,
            [tenant, ag, app, payload.loginId],
          );

          const reqiredUser = userList.find(
            (user) => user.loginId === payload.loginId,
          );
          return { ...reqiredUser, tenant: tenant };
        }
      } catch (error: any) {
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
      let payload: any;
      try {
        payload = await this.jwtService.verifyToken(token);
      } catch (e) {
        payload = null;
      }
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
      const sessionList =
        sessionListCache && JSON.parse(sessionListCache)
          ? JSON.parse(sessionListCache)
          : [];

      if (!sessionList || !Array.isArray(sessionList) || !sessionList.length) {
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

      if (currentSession['refreshTokenId']) {
        const value = await this.fusionAuthVerifyRefreshToken(
          refreshToken,
          payload?.tenantId,
        );
        if (value) {
          currentSession = {
            ...currentSession,
            accessToken: value?.access_token,
            refreshToken: value?.refresh_token,
            refreshTokenId: value?.refresh_token_id,
            updatedOn: new Date().toISOString(),
          };
        } else {
          throw new UnauthorizedException('Session not available');
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
      // return { authenticated: true, updatedToken };
      return {
        authenticated: true,
        updatedToken:
          token == currentSession?.accessToken
            ? undefined
            : currentSession?.accessToken,
      };
    } catch (error: any) {
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
    app_tenant: string | undefined = undefined,
    app_tenant_id: number | undefined = undefined,
    fusionAuthLoginResponse?: any | undefined,
  ) {
    try {
      const config = this.getConfig();

      let query = `
        SELECT
          au.org_au_id,
          tu.user_unique_id AS "userUniqueId",
          tu.email,
          tu.password,
          tu.first_name AS "firstName",
          tu.last_name AS "lastName",
          tu.login_id AS "loginId",
          tu.user_code AS "userCode",
          tu.trs_created_date::text AS "dateAdded",
          tu.status,
          au.is_app_admin as "isAppAdmin",
          au.no_of_products_service AS "noOfProductsService",
          au.access_profile AS "accessProfile",
          au.last_active AS "lastActive"
        FROM ${schemaName}.tam_tenant_user tu
        JOIN ${schemaName}.tam_app_user au
          ON au.org_tu_id = tu.org_tu_id
        WHERE au.tenant_code = $1
          AND au.ag_code     = $2
          AND au.app_code    = $3 
          AND (tu.login_id = $4 OR tu.email = $4)
          AND au.trs_tenant_id = $1
      `;

      let values = [tenant, ag, app, username];

      if (app_tenant_id) {
        query += ` AND tu.at_id = $5`;
        values.push(String(app_tenant_id));
      } else {
        query += ` AND tu.at_id IS NULL`;
      }

      const tenantUser = await this.query(query, values);

      // getApplicationTenantId
      let foundAppTenant: any;
      if (app_tenant) {
        const appTenantList = await this.getAppTenantsLinkedWithApp();
        foundAppTenant = appTenantList.find(
          (item: any) =>
            item.tenant_name == app_tenant || item.tenant_id == app_tenant,
        );
        if (!foundAppTenant)
          throw new BadRequestException(
            `fusionauth configuration details for the tenant ${app_tenant} not found`,
          );
      }

      let tenantId = foundAppTenant?.tenant_id
        ? foundAppTenant?.tenant_id
        : tenant;

      const sessionListCacheKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:session`;

      if (tenantUser?.length > 0) {
        let loggedInUser: any =
          tenantUser.find((user: any) => {
            const isUserMatch =
              user.loginId === username || user.email === username;
            if (!isUserMatch) return false;
            if (isOauthUser) {
              return true;
            } else {
              return user?.password
                ? this.comparePasswords(password, user.password)
                : false;
            }
          }) || null;
        if (!loggedInUser) {
          if (isOauthUser) return false;
          else throw new NotFoundException('User not found');
        }

        if (!loggedInUser) {
          throw new NotFoundException(
            `User did not have access to the application`,
          );
        }
        loggedInUser = {
          ...loggedInUser,
          firstName: loggedInUser?.firstName,
          lastName: loggedInUser?.lastName,
          profile: loggedInUser?.profile,
        };
        const isExpiredUser = this.isUserAccessExpired(loggedInUser);

        if (isExpiredUser) {
          throw new NotAcceptableException(
            'User access expired, Please contact administrator',
          );
        }

        if (isOauthUser && !loggedInUser?.accessProfile?.length) {
          throw new UnauthorizedException(
            `User access pending for ${loggedInUser.loginId ?? loggedInUser?.email} , you'll be notified when approved`,
          );
        } else if (!loggedInUser?.accessProfile?.length) {
          throw new UnauthorizedException(
            `User access pending for ${loggedInUser.loginId ?? loggedInUser?.email} , you'll be notified when approved`,
          );
        }

        await this.query(
          `update ${schemaName}.tam_app_user set last_active=$1 where org_au_id=$2 and trs_tenant_id=$3`,
          [new Date().toISOString(), loggedInUser?.org_au_id, tenant],
        );

        delete loggedInUser.password;

        // ---- FusionAuth is now the single source of tokens; JWT signing removed ----
        if (
          !fusionAuthLoginResponse ||
          !fusionAuthLoginResponse?.refresh_token
        ) {
          // NOTE: previously the JWT fallback silently generated tokens here.
          // Since JWT sync is removed, a FusionAuth login response is now REQUIRED
          // for password-based (non-OAuth) logins too.
          // If your password-login flow does NOT currently call FusionAuth before
          // reaching this function, you must add that call upstream (e.g. FusionAuth
          // /api/login or /oauth2/token) and pass its response in as
          // `fusionAuthLoginResponse` before this function is invoked.
          throw new UnauthorizedException(
            'FusionAuth login response is required to issue tokens',
          );
        }

        let sid: string = fusionAuthLoginResponse?.refresh_token_id;
        let tokenData = {
          loginId: loggedInUser.loginId,
          tenant: tenant,
          type: 't',
          ag,
          app,
          isAppAdmin: loggedInUser?.isAppAdmin ?? undefined,
          userCode: loggedInUser?.userCode ?? undefined,
          tenantId,
        };
        const fusionAuthTenantAndApplicationDetails =
          await this.getFusionAuthCredentials(app_tenant ?? undefined);

        let refreshToken: string = fusionAuthLoginResponse.refresh_token;
        let refreshTokenId: string | undefined =
          fusionAuthLoginResponse.refresh_token_id;
        let token: string;

        // add here patch required data to the registration object
        await handleFusionAuthUserRegistrationForTokenLambda(
          fusionAuthTenantAndApplicationDetails.tenantUniqueId,
          fusionAuthTenantAndApplicationDetails.applicationId,
          config.fusionAuthApiKey,
          config.fusionAuthBaseUrl,
          loggedInUser.userUniqueId,
          tokenData,
        );
        {
          const value = await this.fusionAuthVerifyRefreshToken(
            refreshToken,
            tenantId,
          );
          token = value.access_token;
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
              createdOn: new Date().toISOString(),
            },
            sessionListCacheKey,
          );
          return {
            token,
            authorized: true,
            email: loggedInUser.email,
            redirectToORPSelector: true,
          };
        }
        const accessProfileList = await this.query(
          `select 
          opr_ap_id ,
          access_profile as "accessProfile" ,
          dap ,
          org_grp as "orgGrp" ,
          users_cnt as "no.ofusers" ,
          trs_created_date::text as "createdOn" ,
          role_unique_id as "roleUniqueId" ,
          assigned_keys as "assignedKeys"
          from 
          ${schemaName}.tam_opr_access_profile 
          where 
          tenant_code=$1 and ag_code=$2 and app_code=$3 and trs_tenant_id=$1`,
          [tenant, ag, app],
        );

        if (accessProfileList.length == 0) {
          await this.addSession(
            {
              accessToken: token,
              sid,
              refreshToken,
              refreshTokenId,
              createdOn: new Date().toISOString(),
            },
            sessionListCacheKey,
          );
          return {
            token,
            authorized: true,
            email: loggedInUser.email,
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
                orpAccessObj[key] = combination[0][key];
                orpAccessObj['selectedAccessProfile'] =
                  loggedInUser.accessProfile[0];
                orpAccessObj['dap'] =
                  filteredCombination[0]['dap'] || undefined;
                redirectToORPSelector = false;
              }
              tokenData = {
                loginId: loggedInUser.loginId,
                isAppAdmin: loggedInUser?.isAppAdmin ?? undefined,
                tenant: tenant,
                type: 't',
                ag,
                app,
                userCode: loggedInUser?.userCode ?? undefined,
                ...orpAccessObj,
                tenantId,
              };
              // add here patch required data to the registration object
              await handleFusionAuthUserRegistrationForTokenLambda(
                fusionAuthTenantAndApplicationDetails.tenantUniqueId,
                fusionAuthTenantAndApplicationDetails.applicationId,
                config.fusionAuthApiKey,
                config.fusionAuthBaseUrl,
                loggedInUser.userUniqueId,
                tokenData,
              );
              const value = await this.fusionAuthVerifyRefreshToken(
                refreshToken,
                tenantId,
              );
              token = value.access_token;
            }
          }
        }

        await this.addSession(
          {
            accessToken: token,
            sid,
            refreshToken,
            refreshTokenId,
            createdOn: new Date().toISOString(),
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
        const fusionAuthAccessTokenFromRequest =
          fusionAuthLoginResponse?.access_token;
        if (!fusionAuthAccessTokenFromRequest)
          throw new UnauthorizedException('Invalid Credentials');
        const fusionPayload = await this.jwtService.verifyToken(
          fusionAuthAccessTokenFromRequest,
        );
        if (!fusionPayload)
          throw new UnauthorizedException('Invalid Credentials');
        const authentication_type = fusionPayload?.authenticationType;
        if (!authentication_type || authentication_type != 'OPENID_CONNECT')
          throw new UnauthorizedException('Invalid Credentials');

        // if authentication_type is OPENID_CONNECT , then it's google and github
        const userInfoRes = await fetch(
          `${config.fusionAuthBaseUrl}/oauth2/userinfo`,
          {
            headers: {
              Authorization: `Bearer ${fusionAuthLoginResponse.access_token}`,
            },
          },
        );

        const userInfo = await userInfoRes.json();

        const tam_tenant_user_data = {
          user_unique_id: userInfo.sub,
          email: username,
          password: '',
          first_name: username,
          last_name: username,
          login_id: username,
          user_code: '',
          status: '',
          profile: '',
          tenant_code: tenant,
          trs_created_by: username || 'anonymous',
          trs_modified_date: new Date().toISOString(),
          trs_modified_by: username || 'anonymous',
          trs_access_profile: '',
          trs_org_grp_code: '',
          trs_org_code: '',
          trs_role_grp_code: '',
          trs_role_code: '',
          trs_ps_grp_code: '',
          trs_ps_code: '',
          trs_sub_org_grp_code: '',
          trs_sub_org_code: '',
          trs_tenant_id: tenant,
        };

        const tamTenantUserRes = await this.insertIntoTable(
          'tam_tenant_user',
          tam_tenant_user_data,
        );
        const org_tu_id = tamTenantUserRes.data[0]?.org_tu_id;

        const tam_app_user_data = {
          user_unique_id: userInfo.sub,
          no_of_products_service: '',
          access_profile: [],
          is_app_admin: false,
          last_active: '',
          access_expires: '',
          tenant_code: tenant,
          ag_code: ag,
          app_code: app,
          org_tu_id: org_tu_id,
          trs_created_date: new Date().toISOString(),
          trs_created_by: username || 'anonymous',
          trs_modified_date: new Date().toISOString(),
          trs_modified_by: username || 'anonymous',
          trs_status: '',
          trs_next_status: '',
          trs_process_id: '',
          trs_access_profile: '',
          trs_org_grp_code: '',
          trs_org_code: '',
          trs_role_grp_code: '',
          trs_role_code: '',
          trs_ps_grp_code: '',
          trs_ps_code: '',
          trs_sub_org_grp_code: '',
          trs_sub_org_code: '',
          trs_app_code: '',
          trs_tenant_id: tenant,
        };

        const tamAppUserRes = await this.insertIntoTable(
          'tam_app_user',
          tam_app_user_data,
        );

        throw new UnauthorizedException(
          `User access pending for ${tamTenantUserRes.data[0].login_id ?? tamTenantUserRes.data[0]?.email} , you'll be notified when approved`,
        );
      }
    } catch (error: any) {
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

  async getApplicationTenantFusionauthDetails(
    app_tenant: string | undefined = undefined,
  ) {
    const config = this.getConfig();
    const fusionAuthBaseUrl = config.fusionAuthBaseUrl;
    const fusionAuthApiKey = config.fusionAuthApiKey;
    let applicationTenantUniqueId = '';
    let fusionAuthApplicationTenantId = '';
    let fusionAuthApplicationTenantClientSecret = '';

    const possible_FA_tenant_name = `${tenant}-apptenant-${app_tenant}`;
    // CHECK EXISTENCE OF THE APPLICATION TENANT IN FUSIONAUTH
    const tenantList = await FusionAuthGetTenantList({
      name: possible_FA_tenant_name,
      fusionAuthBaseUrl: fusionAuthBaseUrl,
      fusionAuthApiKey: fusionAuthApiKey,
    });

    const isTenantExist = tenantList.find(
      (a) => a.name == possible_FA_tenant_name,
    );

    if (isTenantExist.id) {
      applicationTenantUniqueId = isTenantExist.id;
    } else {
      return 'Application Tenant does not exist';
    }

    // step 2 => check for application existence , create if not exist and return application id
    const possibleApplicationNameInFusionAuth = `${app_tenant}-defaultApplication`;
    const applicationList = await FusionAuthGetApplicationList(
      applicationTenantUniqueId,
      {
        fusionAuthBaseUrl: fusionAuthBaseUrl,
        fusionAuthApiKey: fusionAuthApiKey,
        name: possibleApplicationNameInFusionAuth,
      },
    );

    const isApplicationExist = applicationList.find(
      (a) => a.name == possibleApplicationNameInFusionAuth,
    );
    if (isApplicationExist.id) {
      fusionAuthApplicationTenantId = isApplicationExist.id;
      fusionAuthApplicationTenantClientSecret =
        isApplicationExist.oauthConfiguration.clientSecret;
    } else {
      return 'Application does not exist';
    }

    return {
      applicationTenantUniqueId,
      fusionAuthApplicationTenantId,
      fusionAuthApplicationTenantClientSecret,
    };
  }

  async signInViaIAM(
    username: string,
    password: string,
    ufClientType: string,
    isOauthUser: boolean = false,
    app_tenant: string | undefined = undefined,
    app_tenant_id: number | undefined = undefined,
  ) {
    try {
      const config = this.getConfig();
      const fusionAuthBaseUrl = config.fusionAuthBaseUrl;
      let ApplicationTenantDetails: any;
      const fusionAuthTenantANDAppDetails =
        await this.getTenantAndApplicationFusionAuthIdSecret();

      if (app_tenant) {
        ApplicationTenantDetails =
          await this.getApplicationTenantFusionauthDetails(app_tenant);
      }

      const url = `${fusionAuthBaseUrl}/oauth2/token`;
      const params = new URLSearchParams();
      params.append('grant_type', 'password');
      params.append('username', username);
      params.append('password', password);
      params.append('scope', 'offline_access');
      params.append(
        'client_id',
        app_tenant
          ? ApplicationTenantDetails.fusionAuthApplicationTenantId
          : fusionAuthTenantANDAppDetails.applicationId,
      );

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: app_tenant
            ? 'Basic ' +
              btoa(
                ApplicationTenantDetails.fusionAuthApplicationTenantId +
                  ':' +
                  ApplicationTenantDetails.fusionAuthApplicationTenantClientSecret,
              )
            : 'Basic ' +
              btoa(
                fusionAuthTenantANDAppDetails.applicationId +
                  ':' +
                  fusionAuthTenantANDAppDetails.fusionAuthAppClientSecret,
              ),
          'X-FusionAuth-TenantId': app_tenant
            ? ApplicationTenantDetails.applicationTenantUniqueId
            : fusionAuthTenantANDAppDetails.tenantUniqueId,
        },
        body: params.toString(),
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new UnauthorizedException(
          JSON.parse(errorData)?.error_description ?? 'invalid credentials',
        );
      }
      const fusionAuthLoginResponse = await res.json();
      const torusSignIn = await this.signIntoTorus(
        username,
        password,
        ufClientType,
        isOauthUser,
        app_tenant,
        app_tenant_id,
        fusionAuthLoginResponse,
      );
      return torusSignIn;
    } catch (error: any) {
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

  async getAppSecurityData() {
    try {
      const actions = [
        {
          code: 'orgMatrix',
          parseFields: ['org'], // 👈 this table stores org as text
          query: `SELECT
            opr_mx_id,
            org_grp_code AS "orgGrpCode",
            org_grp_name AS "orgGrpName",
            org_grp_id AS "orgGrpId",
            src_id AS "srcId",
            org
          FROM ${schemaName}.tam_opr_org_matrix
          WHERE tenant_code = $1
            AND ag_code = $2
            AND app_code = $3 and trs_tenant_id=$1`,
          params: [tenant, ag, app],
        },
        {
          code: 'orgMaster',
          parseFields: ['org'], // 👈 add defensively — no-op if already object
          query: ` SELECT
            opr_om_id,
            org_grp_code AS "orgGrpCode",
            org_grp_name AS "orgGrpName",
            org_grp_id   AS "orgGrpId",
            org
         FROM   ${schemaName}.tam_opr_org_master
         WHERE  tenant_code = $1
           AND  ag_code     = $2
           AND  app_code    = $3 and trs_tenant_id=$1`,
          params: [tenant, ag, app],
        },
        {
          code: 'users',
          parseFields: ['accessProfile'], // 👈 if stored as text[]  or json string
          // here the query give the result without password
          query: `select
            tu.org_tu_id,
            tu.user_unique_id as "userUniqueId",
            tu.email,
            tu.first_name as "firstName",
            tu.last_name as "lastName",
            tu.login_id as "loginId",
            tu.user_code as "userCode",
            tu.trs_created_date::text as "dateAdded",
            tu.status,
            au.org_au_id,
            au.no_of_products_service as "noOfProductsService",
            au.access_profile as "accessProfile",
            au.last_active as "lastActive",
            au.access_expires as "accessExpires",
            au.is_app_admin as "isAppAdmin",
            case
              when au.org_au_id is not null then true
              else false
            end as "isAssigned"
          from
            ${schemaName}.tam_tenant_user tu
          left join ${schemaName}.tam_app_user au
              on
            au.org_tu_id = tu.org_tu_id
            and au.ag_code = $2
            and au.app_code = $3
          where
            tu.tenant_code = $1 and tu.trs_tenant_id=$1`,
          params: [tenant, ag, app],
        },
      ];
      const securityResponse = {};
      for (const action of actions) {
        let rows = (await this.query(action.query, action.params)) ?? [];
        // Parse any string JSON fields after fetching
        if (action.parseFields) {
          rows = rows.map((row) => {
            const parsed = { ...row };
            for (const field of action.parseFields) {
              if (typeof parsed[field] === 'string') {
                try {
                  parsed[field] = JSON.parse(parsed[field]);
                } catch {
                  // leave as-is if not valid JSON
                }
              }
            }
            return parsed;
          });
        }
        securityResponse[action.code] = rows;
      }

      return securityResponse;
    } catch (error: any) {
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
          user: 'anonymous user',
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
    } catch (error: any) {
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

  async getResetPasswordOtp(
    email: string,
    tenantId: string | undefined = undefined,
  ) {
    try {
      if (!email) throw new BadRequestException('email is required');
      const otpResetToken = randomBytes(32).toString('hex');
      const otpCacheKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:otp:${otpResetToken}`;
      let query = `SELECT
            au.org_au_id,
            tu.user_unique_id AS "userUniqueId",
            tu.email,
            tu.first_name AS "firstName",
            tu.last_name AS "lastName",
            tu.login_id AS "loginId",
            tu.user_code AS "userCode",
            tu.trs_created_date::text AS "dateAdded",
            tu.status,
            au.is_app_admin as "isAppAdmin",
            au.no_of_products_service AS "noOfProductsService",
            au.access_profile AS "accessProfile",
            au.last_active AS "lastActive"
          FROM ${schemaName}.tam_tenant_user tu
          JOIN ${schemaName}.tam_app_user au
            ON au.org_tu_id = tu.org_tu_id
          WHERE au.tenant_code = $1
            AND au.ag_code     = $2
            AND au.app_code    = $3 and au.trs_tenant_id=$1`;

      const values = [tenant, ag, app];

      if (tenantId) {
        query += ` AND tu.at_id = $4`;
        values.push(tenantId);
      } else {
        query += ` AND tu.at_id IS NULL`;
      }

      const userList: any[] = await this.query(query, values);
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
      const otp = randomInt(100000, 1000000);
      var otpJson = { email, otp };

      await this.redisService.setJsonData(
        otpCacheKey,
        JSON.stringify(otpJson),
        process.env.CLIENTCODE,
      );
      await this.redisService.expire(otpCacheKey, 60);

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
      return {
        message: 'Email sent to the registered email address',
        id: otpResetToken,
      };
    } catch (error: any) {
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
          users: email.split('@')[0],
        },
      );
      await this.throwCustomException(error);
    }
  }

  async verifyOtp(email: string, otp: string, otpResetToken: string) {
    try {
      if (!email || !otp)
        throw new BadRequestException('email or otp is required');
      const otpCacheKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:otp:${otpResetToken}`;
      const otpJsonFromRedis = await this.redisService.getJsonData(
        otpCacheKey,
        process.env.CLIENTCODE,
      );
      if (!otpJsonFromRedis) throw new NotFoundException('otp not found');
      const otpJson = JSON.parse(otpJsonFromRedis);
      const isCorrectOtp =
        otpJson.email.toLowerCase() === email.toLowerCase() &&
        String(otpJson.otp) === String(otp);
      if (!isCorrectOtp) throw new NotFoundException('invalid otp');
      await this.redisService.deleteKey(otpCacheKey, process.env.CLIENTCODE);

      // Issue a short-lived, single-use reset token bound to this email and
      // hand it back instead of a bare `true`. resetPassword() below now
      // requires this token -- previously it had no way to know verifyOtp
      // had ever run, so knowing someone's email address was enough on its
      // own to change their password.
      const resetToken = randomBytes(32).toString('hex');
      const resetTokenKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:pwdResetToken:${resetToken}`;
      await this.redisService.setJsonData(
        resetTokenKey,
        JSON.stringify({ email }),
        process.env.CLIENTCODE,
      );
      await this.redisService.expire(resetTokenKey, 600); // 10-minute window; also deleted on redemption below

      return { verified: true, resetToken };
    } catch (error: any) {
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
          users: email.split('@')[0],
        },
      );
      await this.throwCustomException(error);
    }
  }

  async resetPassword(
    email: string,
    password: string,
    app_tenant: string | undefined = undefined,
    tenantId: string | undefined = undefined,
    resetToken?: string,
  ) {
    try {
      if (!email || !password) {
        throw new BadRequestException(
          'Please provide valid email and password',
        );
      }

      // resetToken must be the value verifyOtp() returned after a successful
      // OTP check for this same email -- without this, resetPassword had no
      // server-side proof that the OTP step ever happened.
      if (!resetToken) {
        throw new UnauthorizedException(
          'A valid password reset token is required',
        );
      }
      const resetTokenKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:pwdResetToken:${resetToken}`;
      const storedTokenRaw = await this.redisService.getJsonData(
        resetTokenKey,
        process.env.CLIENTCODE,
      );
      if (!storedTokenRaw) {
        throw new UnauthorizedException(
          'Reset token is invalid or has expired',
        );
      }
      // Burn the token immediately so it can't be replayed, even if
      // something below this point fails.
      await this.redisService.del(resetTokenKey);
      const storedToken = JSON.parse(storedTokenRaw);
      if (
        String(storedToken.email).toLowerCase() !== String(email).toLowerCase()
      ) {
        throw new UnauthorizedException(
          'Reset token does not match this email',
        );
      }

      let ApplicationTenantDetails: any;
      const fusionAuthTenantANDAppDetails =
        await this.getTenantAndApplicationFusionAuthIdSecret();

      let query = `SELECT
            *
          FROM ${schemaName}.tam_tenant_user tu
         where tu.email=$1 and trs_tenant_id=$2`;

      const values = [email, tenant];

      if (tenantId) {
        query += ` AND tu.at_id = $2`;
        values.push(tenantId);
      } else {
        query += ` AND tu.at_id IS NULL`;
      }

      const tenantList: any[] = await this.query(query, values);
      const index = tenantList.findIndex(
        (user) => user.email.toLowerCase() === email.toLowerCase(),
      );
      if (index === -1) {
        throw new NotFoundException('User not found');
      }
      const tenantUser = tenantList[index];

      if (this.comparePasswords(password, tenantUser?.password)) {
        throw new NotAcceptableException(
          'New password must be different from your current password.',
        );
      }

      // --- FusionAuth flow ---
      if (app_tenant) {
        ApplicationTenantDetails =
          await this.getApplicationTenantFusionauthDetails(app_tenant);
      }

      const fusionAuthTenantId = app_tenant
        ? ApplicationTenantDetails?.applicationTenantUniqueId
        : fusionAuthTenantANDAppDetails.tenantUniqueId;
      const uniqueId = tenantUser.user_unique_id;

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
      if (value.status !== 200) {
        throw new UnauthorizedException(
          (value as any)?.error ?? 'FusionAuth password update failed',
        );
      }

      // --- Update Redis only after FusionAuth success (or if not fusionauth) ---
      await this.updateTable(
        'tam_tenant_user',
        {
          password: this.hashPassword(password),
          email,
        },
        'email',
        tenantId,
      );

      return 'Password updated successfully';
    } catch (error: any) {
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
          users: email.split('@')[0],
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
      const fusionAuthApiKey = config.fusionAuthApiKey;

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
                      ]?.[nestedSchema[nestedSchema.length - 1]]?.oneOf[0]
                        ?.type;
                  else if (
                    data?.components?.[nestedSchema[nestedSchema.length - 2]]?.[
                      nestedSchema[nestedSchema.length - 1]
                    ]?.allOf?.[0]?.type
                  )
                    dto[responseParameter][propertyArr[i]] =
                      data?.components?.[
                        nestedSchema[nestedSchema.length - 2]
                      ]?.[nestedSchema[nestedSchema.length - 1]]?.allOf[0]
                        ?.type;
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
                      ]?.[nestedSchema[nestedSchema.length - 1]]?.oneOf?.[0]
                        ?.type;
                  else if (
                    data?.components?.[nestedSchema[nestedSchema.length - 2]]?.[
                      nestedSchema[nestedSchema.length - 1]
                    ]?.allOf?.[0]?.type
                  )
                    ResponseDto[propertyArr[i]] =
                      data?.components?.[
                        nestedSchema[nestedSchema.length - 2]
                      ]?.[nestedSchema[nestedSchema.length - 1]]?.allOf?.[0]
                        ?.type;

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

  async notifyUserAccessPending(oauthUser: any, adminList: any[]) {
    try {
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
              process.env.BE_URL.substring(
                0,
                process.env.BE_URL.lastIndexOf('/'),
              ),
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
              process.env.BE_URL.substring(
                0,
                process.env.BE_URL.lastIndexOf('/'),
              ),
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

  async getAccessProfileForArtifact(
    key: string,
    clientCode: string,
    token: string,
  ) {
    try {
      const UO: any = await this.commonService.readAPI(key, clientCode, token);
      let templateArray: any = UO?.securityData?.accessProfile || [];
      let restrictedAccessProfile: any = [];
      templateArray.map((profile: any) => {
        if (profile?.security?.artifact?.SIFlag?.selectedValue == 'BA') {
          restrictedAccessProfile.push(profile?.accessProfile);
        }
      });
      return restrictedAccessProfile;
    } catch (error) {
      return [];
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
        let restrictedAccessProfile: any = [];
        if (screen.UF != 'Logs Screen' && screen.UF != 'User Screen') {
          restrictedAccessProfile = await this.getAccessProfileForArtifact(
            screen.UF + ':UO',
            clientCode,
            token,
          );
        }
        groupObj.screenDetails.push({
          name: screen.screenName,
          label: screen.screenNameLabel,
          key: screen.UF,
          restrictedAccessProfile: restrictedAccessProfile,
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
      key,
      process.env.CLIENTCODE,
      token,
    );
    let screenDetailsForNav: any = await this.screenDetailsData(
      webAssemblerData.webArtifacts,
    );
    let navbarData = await this.navbarDataPreparation(
      screenDetailsForNav,
      clientCode,
      token,
    );
    return navbarData;
  }

  async getAppList(token: string) {
    try {
      const payload = await this.jwtService.verifyToken(token);
      const { tenant: tenant, loginId, ag, app: currentApp } = payload;
      const tenantProfileCacheKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:tpc`;

      const tenantProfileResponse = await this.redisService.getJsonData(
        tenantProfileCacheKey,
        process.env.CLIENTCODE,
      );
      const tenantProfile = tenantProfileResponse
        ? JSON.parse(tenantProfileResponse)
        : {};
      const foundUser = await this.query(
        `select * from ${schemaName}.tam_tenant_user tu where tu.tenant_code=$1 and tu.login_id=$2 and trs_tenant_id=$1`,
        [tenant, loginId],
      );

      const appGroupInfo =
        tenantProfile?.AG?.find((group: any) => group?.code == ag) ?? {};
      const overAllApplicationList =
        appGroupInfo?.APPS?.filter((a) => a?.code != currentApp) || [];
      let accessibleAppList: any[] = [];

      for (const application of overAllApplicationList) {
        let userList = [];
        try {
          userList = await this.query(
            `select
                              *
                            from
                              ${schemaName}.tam_app_user au
                            where
                              au.tenant_code =$1
                              and au.ag_code =$2
                              and au.app_code =$3
                              and au.org_tu_id =$4 and trs_tenant_id=$1`,
            [tenant, ag, application?.code, foundUser?.[0]?.org_tu_id],
          );
        } catch (error) {
          userList = [];
        }
        const isUserExistInApp = userList.find(
          (user: any) => user?.access_profile?.length,
        );
        if (!isUserExistInApp) continue;
        // check the application's build key information along with the accessUrl
        const appBuildKeyCachePrefix = `CK:TGA:FNGK:BLDC:FNK:DEV:CATK:${tenant}:AFGK:${ag}:AFK:${application?.code}:AFVK:*`;
        const appBuildKeyList = await this.redisService.getKeys(
          appBuildKeyCachePrefix,
          process.env.CLIENTCODE,
        );
        let versionInfo = [];
        for (let i = 0; i < appBuildKeyList?.length; i++) {
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
            if (typeof nodeData == 'string') {
              nodeData = decrypt(nodeData);
            }
            const targetAppBaseURL =
              new URL(nodeData?.data?.api?.release?.HOST).origin ?? '';
            const targetAppBasePath =
              `/${tenant}/${ag}/${application?.code}/${buildKey.split(':')[13]}`.toLowerCase();
            const targetAppAccessUrl = `${targetAppBaseURL}${targetAppBasePath}`;

            if (targetAppAccessUrl && targetAppBaseURL) {
              versionInfo.push({
                version: buildKey.split(':')[13],
                accessUrl: targetAppAccessUrl,
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
    } catch (error: any) {
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

  async sso(sourceToken: string, ufClientType: string) {
    try {
      const payload = await this.jwtService.verifyToken(sourceToken);
      const {
        loginId,
        tenant: srcTenant,
        ag: srcAg,
        app: srcApp,
        sid,
        tenantId,
      } = payload;
      const srcAppSessionListCacheKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${srcTenant}:AFGK:${srcAg}:AFK:${srcApp}:AFVK:v1:session`;
      const srcAppSessionList = JSON.parse(
        await this.redisService.getJsonData(
          srcAppSessionListCacheKey,
          process.env.CLIENTCODE,
        ),
      );
      const srcAppUserSession = srcAppSessionList?.find((v) => v.sid == sid);
      if (!srcAppUserSession)
        throw new UnauthorizedException('Invalid session');
      const fusionAUthLoginResponse = await this.fusionAuthVerifyRefreshToken(
        srcAppUserSession?.refreshToken,
        tenantId,
      );
      const loggedInValue = await this.signIntoTorus(
        loginId,
        '',
        ufClientType,
        true,
        undefined,
        undefined,
        fusionAUthLoginResponse,
      );
      if (!loggedInValue)
        throw new UnauthorizedException(
          'Unauthorized access to the application',
        );
      await this.redisService.setJsonData(
        srcAppSessionListCacheKey,
        JSON.stringify(srcAppSessionList.filter((s) => s.sid == sid)),
        process.env.CLIENTCODE,
      );
      return loggedInValue;
    } catch (error: any) {
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

  async getAppTenantsLinkedWithApp() {
    try {
      const result = await this.query(
        `select
              *
            from
              ${schemaName}.tam_tenant at
            join ${schemaName}.tam_tenant_app aat on
              at.at_id = aat.at_id
            where
              aat.tenant_code =$1
              and aat.ag_code =$2
              and aat.app_code =$3 and aat.trs_tenant_id=$1
            `,
        [tenant, ag, app],
      );
      if (result) {
        return JSON.parse(JSON.stringify(result ?? []));
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }

  // `includeSecrets` is granted only to a trusted server-to-server caller (see
  // the controller's internal-service-key check). This endpoint has to stay
  // reachable pre-login so the UF server can build the FusionAuth authorization
  // URL, but that flow only needs the non-secret discovery fields below.
  // The FusionAuth admin API key is never returned at all — no consumer uses it,
  // and handing it out over HTTP would hand over the whole identity provider.
  async getFusionAuthCredentials(
    app_tenant: string | undefined,
    includeSecrets = true,
  ) {
    try {
      const { fusionAuthBaseUrl } = this.getConfig();
      if (!app_tenant) {
        const credentials =
          await this.getTenantAndApplicationFusionAuthIdSecret();
        if (credentials && typeof credentials == 'object') {
          return {
            tenantUniqueId: credentials.tenantUniqueId,
            applicationId: credentials.applicationId,
            ...(includeSecrets
              ? {
                  fusionAuthAppClientSecret:
                    credentials.fusionAuthAppClientSecret,
                }
              : {}),
            fusionAuthBaseUrl,
          };
        } else {
          throw new BadRequestException(
            'fusionauth configuration details not found',
          );
        }
      }
      const appTenantList = await this.getAppTenantsLinkedWithApp();
      const foundAppTenant = appTenantList.find(
        (item: any) =>
          item.tenant_name == app_tenant || item.tenant_id == app_tenant,
      );
      if (!foundAppTenant)
        throw new BadRequestException(
          `fusionauth configuration details for the tenant ${app_tenant} not found`,
        );
      const credentials = await this.getApplicationTenantFusionauthDetails(
        foundAppTenant.tenant_id,
      );
      if (credentials && typeof credentials == 'object') {
        return {
          tenantUniqueId: credentials.applicationTenantUniqueId,
          applicationId: credentials.fusionAuthApplicationTenantId,
          ...(includeSecrets
            ? {
                fusionAuthAppClientSecret:
                  credentials.fusionAuthApplicationTenantClientSecret,
              }
            : {}),
          appTenantId: foundAppTenant.at_id,
          fusionAuthBaseUrl,
        };
      } else {
        throw new BadRequestException(
          'fusionauth configuration details not found',
        );
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  //___________________________LOGS__________________________________________

  @Cron(process.env.MY_CRON)
  async prcLog(): Promise<any> {
    try {
      let structuredData;
      let tplstreamName =
        process.env.TENANT + '-' + process.env.APPCODE + '-TPL';
      let tslstreamName =
        process.env.TENANT + '-' + process.env.APPCODE + '-TSL';
      if (
        await this.redisService.exist(tplstreamName, process.env.CLIENTCODE)
      ) {
        structuredData = await this.structuredPrcLogs(tplstreamName);
      }
      if (
        await this.redisService.exist(tslstreamName, process.env.CLIENTCODE)
      ) {
        structuredData = await this.structuredPrcLogs(tslstreamName);
      }
      return structuredData;
    } catch (error) {
      throw error;
    }
  }

  async structuredPrcLogs(streamName) {
    try {
      const msgid = [];
      const strmarr = [];
      const result = [];
      let groupName;
      let consumerName;
      if (await this.redisService.exist(streamName, process.env.CLIENTCODE)) {
        groupName = streamName + 'ProcessLog_' + process.pid;
        consumerName = streamName;

        await this.redisService.createConsumerGroup(streamName, groupName);
        let streamData: any = await this.redisService.readConsumerGroup(
          streamName,
          groupName,
          consumerName,
        );

        if (!streamData || streamData === 'No Data available to read') {
          return [];
        }

        if (!Array.isArray(streamData)) {
          return [];
        }

        if (streamData.length === 0) {
          return [];
        }

        for (let i = 0; i < streamData.length; i++) {
          const item = streamData[i];

          if (item.msgid && item.data) {
            msgid.push(item.msgid);
            strmarr.push(item.data);
          } else if (Array.isArray(item) && item.length === 2) {
            msgid.push(item[0]);
            strmarr.push(item[1]);
          } else {
            console.log('Unexpected item structure at index', i, ':', item);
          }
        }
        if (msgid?.length > 0) {
          for (let s = 0; s < msgid.length; s++) {
            let user,
              upid = 'logInfo';

            if (streamName.endsWith('-TPL')) {
              const upidsplit = strmarr[s][0].split(':');
              if (upidsplit.length > 14) {
                upid = upidsplit[upidsplit.length - 1];
                // AfskValue = upid;
              }
            }

            const date = new Date(Number(msgid[s].split('-')[0]));
            const utcDate = date.toISOString();
            const entryId = utcDate.split('T')[0]; //format(date, 'yyyy-MM-dd');

            const afskvalue: any = JSON.parse(strmarr[s][1]);
            if (typeof afskvalue == 'object')
              afskvalue['DateAndTime'] = utcDate;

            if (
              afskvalue?.sessionInfo &&
              Object.keys(afskvalue.sessionInfo).length > 0 &&
              afskvalue.sessionInfo.user
            ) {
              user = afskvalue.sessionInfo.user;
            } else {
              user = 'user';
            }

            const CK = await this.commonService.splitcommonkey(
              strmarr[s][0],
              'CK',
            );
            const FNGK = await this.commonService.splitcommonkey(
              strmarr[s][0],
              'FNGK',
            );
            const FNK = await this.commonService.splitcommonkey(
              strmarr[s][0],
              'FNK',
            );
            const CATK = await this.commonService.splitcommonkey(
              strmarr[s][0],
              'CATK',
            );
            const AFGK = await this.commonService.splitcommonkey(
              strmarr[s][0],
              'AFGK',
            );
            const AFK = await this.commonService.splitcommonkey(
              strmarr[s][0],
              'AFK',
            );
            const AFVK = await this.commonService.splitcommonkey(
              strmarr[s][0],
              'AFVK',
            );

            let existingEntry = result.find(
              (item) =>
                item.CK === CK &&
                item.FNGK === FNGK &&
                item.FNK === FNK &&
                item.CATK === CATK &&
                item.AFGK === AFGK &&
                item.AFK === AFK &&
                item.AFVK === AFVK &&
                item.UPID === upid &&
                item.USER === user &&
                item.DATE === entryId,
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
                UPID: upid,
                DATE: entryId,
                DateAndTime: utcDate,
                USER: user,
                AFSK: {},
              };
              result.push(existingEntry);
            }

            if (streamName.endsWith('-TPL')) {
              if (!existingEntry.AFSK[upid]) {
                existingEntry.AFSK[upid] = [];
              }
              existingEntry.AFSK[upid].push(afskvalue);
            } else {
              existingEntry.AFSK = afskvalue;
            }
          }

          result.forEach((entry, idx) => {
            Object.values(entry.AFSK).reduce(
              (sum: number, arr: any[]) => sum + arr.length,
              0,
            );
          });

          if (result && result.length > 0) {
            let upid;
            let bucketName = streamName.endsWith('-TSL') ? 'ExpLog' : 'PrcLog';
            if (streamName.endsWith('-TSL')) {
              upid = 'logInfo';
            }
            for (let i = 0; i < result.length; i++) {
              const {
                USER,
                DATE: date,
                DateAndTime,
                CK,
                FNGK,
                FNK,
                CATK,
                AFGK,
                AFK,
                AFVK,
              } = result[i];
              upid = Object.keys(result[i].AFSK)[0];
              let res;
              if (
                USER &&
                date &&
                CK &&
                FNGK &&
                FNK &&
                CATK &&
                AFGK &&
                AFK &&
                AFVK
              ) {
                const path = `${USER}:${date}:${CK}:${FNGK}:${FNK}:${CATK}:${AFGK}:${AFK}:${AFVK}:${upid}`;

                res = await this.commonService.seaWeeduploadFile(
                  JSON.stringify(result[i]),
                  bucketName,
                  streamName,
                  path,
                );

                if (res?.status == 201) {
                  await this.structuredPrcLogsToPostgres(
                    streamName,
                    path,
                    CK,
                    FNK,
                    CATK,
                    AFGK,
                    upid,
                    USER,
                    DateAndTime,
                  );
                  await this.redisService.ackMessage(
                    streamName,
                    groupName,
                    msgid,
                  );
                  await this.redisService.deleteWithEntryId(streamName, msgid);
                  let isStreamExist =
                    await this.redisService.getStreamRange(streamName);

                  if (!isStreamExist || isStreamExist.length == 0) {
                    await this.redisService.deleteKey(streamName, streamName);
                  }
                }
              }
            }
            return 'success';
          }
        }
        return result;
      }
    } catch (error) {
      throw error;
    }
  }

  async structuredPrcLogsToPostgres(
    tableName: string,
    Key: string,
    tenant: string,
    fabric: string,
    appGrp: string,
    app: string,
    upid: string,
    user: string,
    date,
  ) {
    try {
      tableName = tableName.toLowerCase();
      await this.query(`CREATE SCHEMA IF NOT EXISTS "processlog"`);
      await this.query(
        `CREATE TABLE IF NOT EXISTS "processlog"."${tableName}" (
          id BIGSERIAL PRIMARY KEY,
          key TEXT,
          ck_code varchar(50) NULL,
          fnk_code varchar(100) NULL,
          ag_code varchar(16) NOT NULL,
          app_code varchar(16) NOT NULL,         
          upid TEXT,
          user_name TEXT,
          date_and_time TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "${tableName}_key_idx" ON "processlog"."${tableName}" ("key")
      `,
      );

      let params = [Key, tenant, fabric, appGrp, app, upid, user, date];

      let insertquery = `INSERT INTO "processlog"."${tableName}"(key,ck_code,fnk_code,ag_code,app_code,upid,user_name,date_and_time)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (key) DO NOTHING RETURNING *`;

      const insertRes = await this.query(insertquery, params);
      return insertRes;
    } catch (error) {
      console.error('structuredPrcLogsToPostgres Error =>', error);
      throw error;
    }
  }

  async getseaWeedProcessExpLogs(input, type): Promise<any> {
    try {
      if (!input?.tenant || !input?.app?.code) throw 'Invalid Payload';
      let downloadedFile = [];
      let filename = `${input?.tenant}-${input?.app?.code}${type}`;

      let response = await this.getPostgresProcessLogs(input, type);

      let bucketName = type.endsWith('-TSL') ? 'ExpLog' : 'PrcLog';

      if (response?.data.length > 0) {
        for (let item of response.data) {
          downloadedFile.push(
            await this.commonService.downloadAndParseFile(
              input?.tenant,
              `/${bucketName}/${filename}/${item.key}.json`,
            ),
          );
        }
      }

      downloadedFile = downloadedFile.flat();

      if (downloadedFile.length > 0) {
        const timeZone = process.env.TIMEZONE;

        if (timeZone && timeZone != 'UTC') {
          if (type.endsWith('-TPL')) {
            for (const item of downloadedFile) {
              const utcDate = new Date(item.DateAndTime);
              item.DateAndTime = this.commonService.convertTimeZone(utcDate);

              let upidVal = item.AFSK ? Object.values(item.AFSK)[0] : null;
              if (Array.isArray(upidVal)) {
                for (const upidItem of upidVal) {
                  const upidutcDate = new Date(upidItem.DateAndTime);
                  upidItem.DateAndTime =
                    this.commonService.convertTimeZone(upidutcDate);
                }
              }
            }
          } else if (type.endsWith('-TSL')) {
            for (const item of downloadedFile) {
              const utcDate = new Date(item.DateAndTime);
              item.DateAndTime = this.commonService.convertTimeZone(utcDate);
              if (item?.AFSK?.DateAndTime)
                item.AFSK.DateAndTime = this.commonService.convertTimeZone(
                  item.AFSK.DateAndTime,
                );
            }
          }
        }
      }
      response['data'] = downloadedFile;
      return response;
    } catch (error: any) {
      console.log('ERROR123', error);
      if (error.message) error = error.message;
      throw new BadRequestException(error);
    }
  }

  async getPostgresProcessLogs(input: any, type: string): Promise<any> {
    try {
      const {
        tenant,
        user,
        FromDate,
        ToDate,
        fabric,
        appgroup,
        app,
        searchParam,
        page = 1,
        limit = 10,
        sortOrder,
      } = input;

      const PG_SCHEMANAME = 'processlog';
      const tableName = `${tenant}-${app?.code}${type}`.toLowerCase();

      if (
        !this.commonService.isSafeSqlIdentifier(tenant) ||
        !this.commonService.isSafeSqlIdentifier(app?.code)
      ) {
        throw new BadRequestException('Invalid tenant/app code');
      }

      // console.log('tableName', tableName);
      const params: any[] = [];
      let whereClause = `WHERE ck_code = $1`;
      params.push(tenant);

      // User Filter
      if (user?.length > 0) {
        whereClause += ` AND "user_name" = ANY($${params.length + 1})`;
        params.push(user);
      }

      // Fabric Filter
      if (fabric?.length > 0) {
        whereClause += ` AND "fnk_code" = ANY($${params.length + 1})`;
        params.push(fabric);
      }

      // App Group
      if (appgroup?.code) {
        whereClause += ` AND "ag_code" = $${params.length + 1}`;
        params.push(appgroup.code);
      }

      // App
      if (app?.code) {
        whereClause += ` AND "app_code" = $${params.length + 1}`;
        params.push(app.code);
      }

      // Date Filter
      // if (FromDate) {
      //   whereClause += ` AND "date_and_time" >= $${params.length + 1}`;
      //   params.push(FromDate);
      // }

      // if (ToDate) {
      //   // whereClause += ` AND "date_and_time" <= $${params.length + 1}`;
      //   whereClause += ` AND "date_and_time" < $${params.length + 1} + INTERVAL '1 day'`;
      //   params.push(ToDate);
      // }

      if (FromDate) {
        whereClause += ` AND "date_and_time" >= $${params.length + 1}::date`;
        params.push(FromDate);
      }

      if (ToDate) {
        whereClause += ` AND "date_and_time" < ($${params.length + 1}::date + INTERVAL '1 day')`;
        params.push(ToDate);
      }

      // Global Search
      if (searchParam) {
        whereClause += `
        AND (
          ck_code ILIKE $${params.length + 1}         
          OR "fnk_code" ILIKE $${params.length + 1}
          OR "ag_code" ILIKE $${params.length + 1}        
          OR "app_code" ILIKE $${params.length + 1}         
          OR "user_name" ILIKE $${params.length + 1} 
          OR CAST("date_and_time" AS TEXT) ILIKE $${params.length + 1}
          OR "upid" ILIKE $${params.length + 1}
        )
        `;
        params.push(`%${searchParam}%`);
      }

      const orderBy = sortOrder === 'oldest' ? 'ASC' : 'DESC';

      // Total Count
      const countQuery = `
      SELECT COUNT(*) AS total
      FROM "${PG_SCHEMANAME}"."${tableName}"
      ${whereClause}
      `;

      const countResult = await this.query(countQuery, params);

      const totalDocuments = Number(countResult[0].total);

      // Pagination
      const offset = (page - 1) * limit;

      const dataQuery = `
        SELECT key,upid
        FROM  "${PG_SCHEMANAME}"."${tableName}"
        ${whereClause}
        ORDER BY "date_and_time" ${orderBy}
        LIMIT $${params.length + 1}
        OFFSET $${params.length + 2}
      `;
      //console.log('dataQuery',dataQuery);
      //console.log('params',params);

      const data = await this.query(dataQuery, [...params, limit, offset]);

      return {
        data,
        page,
        limit,
        totalPages: Math.ceil(totalDocuments / limit),
        totalDocuments,
      };
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException(error);
    }
  }

  async acquireLock(dto: LockRecordDto) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      const recordSchema = dto.tableName.startsWith('tam_') ? schemaName : '';

      const rows = await client.query(
        `SELECT trs_locked_by, trs_locked_time FROM ${recordSchema}."${dto.tableName}" WHERE ${dto.key} = $1 FOR UPDATE`,
        [dto.value],
      );

      if (!rows.rows.length) {
        throw new Error('Record not found');
      }

      if (
        rows.rows[0].trs_locked_by &&
        rows.rows[0].trs_locked_by !== dto.userId
      ) {
        throw new HttpException(
          {
            message: `Record locked by ${rows.rows[0].trs_locked_by}`,
            lockedBy: rows.rows[0].trs_locked_by,
            lockedTime: rows.rows[0].trs_locked_time,
          },
          HttpStatus.CONFLICT,
        );
      }

      await client.query(
        `UPDATE ${recordSchema}."${dto.tableName}"
         SET trs_locked_by = $2, trs_locked_time = CURRENT_TIMESTAMP
         WHERE ${dto.key} = $1`,
        [dto.value, dto.userId],
      );

      await client.query(
        `INSERT INTO ct010_tam.tam_transaction_locks
           (table_name, transaction_id, trs_locked_by, trs_locked_on)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
         ON CONFLICT (table_name, transaction_id)
         DO UPDATE
           SET trs_locked_by = EXCLUDED.trs_locked_by,
               trs_locked_on = CURRENT_TIMESTAMP`,
        [dto.tableName, String(dto.value), dto.userId],
      );

      await client.query('COMMIT');

      return {
        success: true,
        message: 'Record locked successfully',
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async releaseLock(dto: LockRecordDto) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      const recordSchema = dto.tableName.startsWith('tam_') ? schemaName : '';

      const rows = await client.query(
        `SELECT trs_locked_by, trs_locked_time FROM ${recordSchema}."${dto.tableName}" WHERE ${dto.key} = $1 FOR UPDATE`,
        [dto.value],
      );

      if (!rows.rows.length) {
        throw new Error('Record not found');
      }

      if (!rows.rows[0].trs_locked_by) {
        throw new HttpException(
          { message: 'Record is already unlocked' },
          HttpStatus.CONFLICT,
        );
      }

      if (rows.rows[0].trs_locked_by !== dto.userId) {
        throw new HttpException(
          {
            message: `Only '${rows.rows[0].trs_locked_by}' can unlock this record.`,
            lockedBy: rows.rows[0].trs_locked_by,
            lockedTime: rows.rows[0].trs_locked_time,
          },
          HttpStatus.CONFLICT,
        );
      }

      await client.query(
        `UPDATE ${recordSchema}."${dto.tableName}"
         SET trs_locked_by = NULL, trs_locked_time = NULL
         WHERE ${dto.key} = $1`,
        [dto.value],
      );

      await client.query(
        `DELETE FROM ct010_tam.tam_transaction_locks
         WHERE table_name = $1
           AND transaction_id = $2
           AND trs_locked_by = $3`,
        [dto.tableName, String(dto.value), dto.userId],
      );

      await client.query('COMMIT');

      return {
        success: true,
        message: 'Record unlocked successfully',
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async releaseAllLocks(userId: string) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      const locks = await client.query(
        `SELECT table_name, transaction_id FROM ct010_tam.tam_transaction_locks
         WHERE trs_locked_by = $1`,
        [userId],
      );

      for (const lock of locks.rows) {
        const recordSchema = lock.table_name.startsWith('tam_')
          ? schemaName
          : '';
        await client.query(
          `UPDATE ${recordSchema}."${lock.table_name}"
           SET trs_locked_by = NULL, trs_locked_time = NULL
           WHERE trs_locked_by = $1`,
          [userId],
        );
      }

      await client.query(
        `DELETE FROM ct010_tam.tam_transaction_locks
         WHERE trs_locked_by = $1`,
        [userId],
      );

      await client.query('COMMIT');

      return {
        success: true,
        message: 'All locks released successfully',
        releasedCount: locks.rows.length,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
