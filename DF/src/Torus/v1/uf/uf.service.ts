import {
  BadGatewayException,
  HttpStatus,
  UnauthorizedException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { CommonService } from 'src/common.Service';
import { redis, RedisService } from 'src/redisService';
import * as v from 'valibot';
import {
  BadRequestException,
  NotAcceptableException,
  CustomException,
  ForbiddenException,
  ConflictException,
} from 'src/customException';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import * as nodemailer from 'nodemailer';
import { JwtService } from '@nestjs/jwt';
import { JwtServices } from 'src/jwt.services';
import { RuleService } from 'src/ruleService';
import { MongoService } from 'src/mongoService';
const jsonata = require('jsonata');
import * as fs from 'fs';
import { table } from 'console';
import axios from 'axios';
import { Readable } from 'stream';
import * as FormData from 'form-data';

// import { RuleService } from 'src/ruleService';

const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  auth: {
    user: 'support@torus.tech',
    pass: 'Welcome@100',
  },
});
const auth_secret =
  'HpZnm7V6YeshFDVbwACyOtx6oa6QSbraZoNyU9fwtGYUL1Rnc6PN5QUosu9BcqVBo5L6QeSs';
const tenant = process.env.TENANT;
const ag = process.env.APPGROUPCODE;
const app = process.env.APPCODE;

@Injectable()
export class UfService {
  constructor(
    private readonly jwtService: JwtServices,
    private readonly jwt: JwtService,
    private readonly gorule: RuleService,
    private readonly redisService: RedisService,
    private readonly commonService: CommonService,
    private readonly mongoService: MongoService,
  ) {}

  async screenRoute(keys: any[], token: string, header: any) {
    for (let i = 0; i < keys.length; i++) {
      const UO: any = await this.commonService.readAPI(
        keys[i].ufKey + ':UO',
        'redis',
        'redis',
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
  }

  async uploadFile(file: Express.Multer.File, context: string): Promise<any> {
    const res = await this.commonService.uploadFile(file, context);
    return res;
  }

  async getFile(id: string, context: string) {
    const file = await this.commonService.findFileById(id);
    const res = await this.commonService.getFile(id, context);
    return { res, file };
  }

  async setUpKey(key: string, token: string) {
    const sKey: any = await this.commonService.readAPI(key, 'redis', 'redis');
    if (sKey) {
      return sKey;
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
      console.log(tokenDecode);
      if (!tokenDecode?.selectedAccessProfile)
        throw 'Selected Access Profile not found';

      var dsObject = JSON.parse(
        await this.redisService.getJsonData(key + 'DS_Object'),
      );
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

      var data = dsObject?.data;
      if (data && tokenDecode) {
        if (!page) page = 1;
        let rule: any;
        let finalData = [];
        var dataArr = [];
        var searcharr = [];
        var start = (page - 1) * count;
        var end = start + count;
        if (searchObj && Object.keys(searchObj).length > 0) {
          var searchkey = Object.keys(searchObj);
          var searchval = Object.values(searchObj);
        }

        if (filter) {
          var json = JSON.parse(
            await this.redisService.getJsonDataWithPath(
              filter.ufKey,
              '.mappedData.artifact.node',
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
          for (var s = 0; s < json.length; s++) {
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
                if (tokenDecode?.dap == 'f') {
                  finalData.push(data[j]);
                } else if (
                  tokenDecode.orgGrpCode == data[j]['trs_org_grp_code'] &&
                  tokenDecode.orgCode == data[j]['trs_org_code'] &&
                  tokenDecode.roleGrpCode == data[j]['trs_role_grp_code'] &&
                  tokenDecode.roleCode == data[j]['trs_role_code'] &&
                  tokenDecode.psGrpCode == data[j]['trs_ps_grp_code'] &&
                  tokenDecode.psCode == data[j]['trs_ps_code'] &&
                  tokenDecode.selectedAccessProfile ==
                    data[j]['trs_access_profile'] &&
                  tokenDecode.loginId == data[j]['trs_created_by']
                ) {
                  finalData.push(data[j]);
                }
              }
            }

            if (searchObj && Object.keys(searchObj).length > 0) {
              for (var x = 0; x < finalData.length; x++) {
                var s = 0;
                for (var q = 0; q < searchkey.length; q++) {
                  if (finalData[x][searchkey[q]] == searchval[q]) {
                    if (tokenDecode?.dap == 'f') {
                      s++;
                    } else if (
                      tokenDecode.orgGrpCode ==
                        finalData[x]['trs_org_grp_code'] &&
                      tokenDecode.orgCode == finalData[x]['trs_org_code'] &&
                      tokenDecode.roleGrpCode ==
                        finalData[x]['trs_role_grp_code'] &&
                      tokenDecode.roleCode == finalData[x]['trs_role_code'] &&
                      tokenDecode.psGrpCode ==
                        finalData[x]['trs_ps_grp_code'] &&
                      tokenDecode.psCode == finalData[x]['trs_ps_code'] &&
                      tokenDecode.selectedAccessProfile ==
                        finalData[x]['trs_access_profile'] &&
                      tokenDecode.loginId == finalData[x]['trs_created_by']
                    ) {
                      s++;
                    }
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
                if (tokenDecode?.dap == 'f') {
                  s++;
                } else if (
                  tokenDecode.orgGrpCode == data[x]['trs_org_grp_code'] &&
                  tokenDecode.orgCode == data[x]['trs_org_code'] &&
                  tokenDecode.roleGrpCode == data[x]['trs_role_grp_code'] &&
                  tokenDecode.roleCode == data[x]['trs_role_code'] &&
                  tokenDecode.psGrpCode == data[x]['trs_ps_grp_code'] &&
                  tokenDecode.psCode == data[x]['trs_ps_code'] &&
                  tokenDecode.selectedAccessProfile ==
                    data[x]['trs_access_profile'] &&
                  tokenDecode.loginId == data[x]['trs_created_by']
                ) {
                  s++;
                }
              }
            }
            // if(searchset.includes(searchkey.toLowerCase())){ searchkey
            if (s == searchkey.length) searcharr.push(data[x]);
          }
          return await this.filterpagination(start, end, searcharr);
        }

        if (data?.length > 0) {
          for (let i = 0; i < data.length; i++) {
            if (tokenDecode?.dap == 'f') {
              dataArr.push(data[i]);
            } else if (
              tokenDecode.orgGrpCode == data[i]['trs_org_grp_code'] &&
              tokenDecode.orgCode == data[i]['trs_org_code'] &&
              tokenDecode.roleGrpCode == data[i]['trs_role_grp_code'] &&
              tokenDecode.roleCode == data[i]['trs_role_code'] &&
              tokenDecode.psGrpCode == data[i]['trs_ps_grp_code'] &&
              tokenDecode.psCode == data[i]['trs_ps_code'] &&
              tokenDecode.selectedAccessProfile ==
                data[i]['trs_access_profile'] &&
              tokenDecode.loginId == data[i]['trs_created_by']
            ) {
              dataArr.push(data[i]);
            }
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
    var filArray = [];
    for (var i = start; i < end; i++) {
      if (searcharr[i] != null) filArray.push(searcharr[i]);
    }
    return { records: filArray, totalRecords: searcharr.length };
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
        'redis',
        'redis',
      );
      const screenName: string = key.split(':')[11];
      let mappedData: any = UO.mappedData.artifact.node;
      const securityData: any = UO.securityData;
      let templateArray: any[] = securityData.accessProfile;
      const decodedToken: any = await this.jwtService.decodeToken(token);
      let object = {};
      let security: any;
      let allowedGroup: any = [];
      let componentNameArray: string[] = [];
      let controlNames: any = [];
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
            await this.commonService.errorLog(
              'Technical',
              'AK',
              'Fatal',
              'TG086',
              'sourceData not found',
              key,
              token,
            );
          }
          /*---------get dfKey end-------------*/
          object = {
            action: UO.mappedData?.action,
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
          /*---------security start-------------*/
          if (key === securityData.afk) {
            for (let i = 0; i < templateArray.length; i++) {
              for (
                let j = 0;
                j < templateArray[i].security.artifact.node.length;
                j++
              ) {
                if (
                  accessProfile.includes(templateArray[i].accessProfile) &&
                  screenName === templateArray[i].security.artifact.resource &&
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
                  if (
                    selectedValues.includes('ATO') &&
                    templateArray[i].security.artifact.node[j].SIFlag
                      .selectedValue === 'ATO'
                  ) {
                    if (isTable === true) {
                      componentNameArray.push(
                        templateArray[i].security.artifact.node[
                          j
                        ].resource.toLowerCase(),
                      );
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
                      controlNames = componentNameArray.concat(controlNames);
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
                      }
                      controlNames = controlNames.map((item) =>
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
                      .selectedValue === 'AA'
                  ) {
                    if (isTable === true) {
                      componentNameArray.push(
                        templateArray[i].security.artifact.node[
                          j
                        ].resource.toLowerCase(),
                      );
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
                      controlNames = componentNameArray.concat(controlNames);
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
                      }
                      controlNames = controlNames.map((item) =>
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
              object = {
                action: mappedData[i]?.action,
                code: mappedData[i]?.code,
                rule: mappedData[i]?.rule,
                events: mappedData[i]?.events,
                mapper: mappedData[i]?.mapper,
              };
            }
          }
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
              'redis',
              'redis',
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
                schemaData,
                dfKey: dfKey,
                dfdNodeType: nodeType,
              };
            } catch (err) {
              object = {
                ...object,
                security: controlNames,
                dfKey: dfKey,
              };
            }
          } else {
            // ordinary group
            object = {
              ...object,
              security: controlNames,
              dfKey: dfKey,
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

                    let dfSchemaKey = await this.commonService.readAPI(
                      dfdKey + ':DFO',
                      'redis',
                      'redis',
                    );

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

                    let dstKey: string = dfdKey
                      .replace(':AFC:', ':AFCP:')
                      .replace(':AF:', ':AFP:')
                      .replace(':DF-DFD:', ':DF-DST:');
                    DS_Object = await this.commonService.readAPI(
                      dstKey + ':DS_Object',
                      'redis',
                      'redis',
                    );

                    if (DS_Object == null || DS_Object == undefined) {
                      DS_Object['data'] = [];
                    }
                  }
                  object = {
                    action: mappedData[i].objElements[j]?.action,
                    code: mappedData[i].objElements[j]?.code,
                    rule: mappedData[i].objElements[j]?.rule,
                    events: mappedData[i].objElements[j]?.events,
                    mapper: mappedData[i].objElements[j]?.mapper,
                    dstData: DS_Object?.data || [],
                    schemaData,
                  };
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

  async elementsFilter(key: string, groupName?: any, controlName?: string) {
    try {
      let rule: string = '';
      const uoKey: any = await this.commonService.readAPI(
        key + ':UO',
        'redis',
        'redis',
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
      return {
        error: true,
        errorDetails: { message: error },
      };
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
        'redis',
        'redis',
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
                      'redis',
                      'redis',
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
    function runCodeWithObjectParams(codeString, paramsObject) {
      // Create a function with destructured parameters from the object
      const keys = Object.keys(paramsObject);
      const values = Object.values(paramsObject);

      const runCode = new Function(...keys, `${codeString};`);

      // Call the function with the values from the object
      return runCode(...values);
    }
    return runCodeWithObjectParams(stringCode, params);
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
        'redis',
        'redis',
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
            'redis',
            'redis',
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
            'redis',
            'redis',
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
                    // return ff
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

  async fetchActionDetails(key: string, groupId: string, controlName: string) {
    try {
      const uoKey: any = await this.commonService.readAPI(
        key + ':UO',
        'redis',
        'redis',
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
      return {
        error: true,
        errorDetails: { message: error },
      };
    }
  }

  async fetchRuleDetails(key: string, groupId: string, controlId: string) {
    try {
      const uoKey: any = await this.commonService.readAPI(
        key + ':UO',
        'redis',
        'redis',
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
      return {
        error: true,
        errorDetails: { message: error },
      };
    }
  }

  async InitiatePF(key: string, sourceId: string, token: string) {
    try {
      if (key !== '') {
        let spiltedkey: string = key.split('|')[0];
        let findingkey: string = key.split('|')[1];

        const NDSdataKey: any = await this.commonService.readAPI(
          spiltedkey + ':NDS',
          'redis',
          'redis',
        );
        const NDSdata = NDSdataKey;
        const POdataKey: any = await this.commonService.readAPI(
          spiltedkey + ':PO',
          'redis',
          'redis',
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
  ) {
    try {
      let eventProperty: any;
      let eventDetails: any;
      let eventDetailsArray: any;
      const uoKey: any = await this.commonService.readAPI(
        key + ':UO',
        'redis',
        'redis',
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
      return {
        error: true,
        errorDetails: { message: error },
      };
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
        source,
        target,
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
  ) {
    try {
      const source: string = 'redis';
      const target: string = 'redis';
      const mapperPropertiesKey: any = await this.commonService.readAPI(
        ufKey + ':UO',
        source,
        target,
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
            targetKeys.push({
              targetKey:
                mapperData[i].targetKey.split('|')[
                  mapperData[i].targetKey.split('|').length - 1
                ],
              columnKey:
                dfdType == 'apinode'
                  ? mapperData[i].sourceKey[0].split('.').at(-1)
                  : mapperData[i].sourceKey[0].split('|').at(-1),
            });
            nodeName = mapperData[i].sourceKey[0].split('.').at(-1);
          }

          targetKeys.push({
            targetKey: 'trs_next_status',
            columnKey: 'trs_next_status',
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

          //  value = await this.commonService.readAPI(
          // redisKey + ':DS_Object',
          //  source,
          //   target,
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
                        ele[targetKeys[i].columnKey],
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
              source,
              target,
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
                source,
                target,
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
    await this.redisService.setJsonData(key, value, path);
  }

  async uploadHandlerData(key) {
    const flag: any = await this.redisService.getJsonData(key); //await this.commonService.readAPI(key, 'source', 'target');
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
      await this.redisService.setJsonData(key, value);
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
        source,
        target,
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
      return {
        error: true,
        errorDetails: { message: error },
      };
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
      const sessionListCacheKey =
        payload.type == 'c'
          ? `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${payload.client}:AFK:PROFILE:AFVK:v1:session`
          : `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${payload.client}:AFGK:${ag}:AFK:${app}:AFVK:v1:session`;
      const sessionListCache =
        await this.redisService.getJsonData(sessionListCacheKey);
      if (
        !sessionListCache ||
        !JSON.parse(sessionListCache) ||
        !Array.isArray(JSON.parse(sessionListCache)) ||
        !JSON.parse(sessionListCache).length
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
      const sessionList = JSON.parse(sessionListCache);
      const updatedSessionList = await this.checkSession(sessionList);
      if (updatedSessionList.includes(token)) {
        await this.redisService.setJsonData(
          sessionListCacheKey,
          JSON.stringify(updatedSessionList.filter((s: string) => s !== token)),
        );
      } else {
        await this.redisService.setJsonData(
          sessionListCacheKey,
          JSON.stringify(updatedSessionList),
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
    ps: string,
    selectedAccessProfile: string,
    dap: string | undefined,
  ) {
    try {
      const parts = ps.split('-');

      const accessObj = {
        orgGrpCode: parts[0],
        orgCode: parts.slice(0, 2).join('-'),
        roleGrpCode: parts.slice(0, 3).join('-'),
        roleCode: parts.slice(0, 4).join('-'),
        psGrpCode: parts.slice(0, 5).join('-'),
        psCode: parts.slice(0, 6).join('-'),
      };
      const payload = await this.jwt.decode(token);
      const { type, client, loginId } = payload;
      const sessionListCacheKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${client}:AFGK:${ag}:AFK:${app}:AFVK:v1:session`;

      const updatedToken = await this.jwt.signAsync(
        {
          type,
          client,
          loginId,
          ag,
          app,
          selectedAccessProfile,
          dap,
          ...accessObj,
        },
        {
          secret: auth_secret,
          expiresIn: '24h',
        },
      );

      const sessionListResponse =
        await this.redisService.getJsonData(sessionListCacheKey);
      let updatedSessionList = [];
      if (sessionListResponse) {
        const sessionList = JSON.parse(sessionListResponse);
        const currentSessionList = await this.checkSession(sessionList);
        updatedSessionList = currentSessionList.filter(
          (session: any) => session !== token,
        );
        updatedSessionList.push(updatedToken);
      }
      await this.redisService.setJsonData(
        sessionListCacheKey,
        JSON.stringify(updatedSessionList),
      );

      return updatedToken;
    } catch (error) {
      console.log(error);
    }
  }

  transformToCombinations(data: any[]) {
    return data.map((profile) => {
      const combinations: any[] = [];

      profile.orgGrp?.forEach((orgGrp: any) => {
        const { orgGrpCode, orgGrpName } = orgGrp;

        orgGrp.org?.forEach((org: any) => {
          const { orgCode, orgName } = org;

          org.roleGrp?.forEach((roleGrp: any) => {
            const { roleGrpCode, roleGrpName } = roleGrp;

            roleGrp.roles?.forEach((role: any) => {
              const { roleCode, roleName } = role;

              role.psGrp?.forEach((psGrp: any) => {
                const { psGrpCode, psGrpName } = psGrp;

                psGrp.ps?.forEach((ps: any) => {
                  const { psCode, psName } = ps;

                  combinations.push({
                    orgGrpCode,
                    orgGrpName,
                    orgCode,
                    orgName,
                    roleGrpCode,
                    roleGrpName,
                    roleCode,
                    roleName,
                    psGrpCode,
                    psGrpName,
                    psCode,
                    psName,
                  });
                });
              });
            });
          });
        });
      });

      return {
        accessProfile: profile.accessProfile,
        dap: profile?.dap ? profile?.dap : undefined,
        combinations,
      };
    });
  }

  async getAccessTemplate(token: string) {
    try {
      const accountDetails = await this.MyAccountForClient(token, 's', true);
      const { client, accessProfile } = accountDetails;
      const accessTemplateCacheKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${client}:AFGK:${ag}:AFK:${app}:AFVK:v1:securityTemplate`;
      const accessTemplateResponse = await this.redisService.getJsonData(
        accessTemplateCacheKey,
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
      throw this.throwCustomException(error);
      // console.log(error);
    }
  }

  async checkSession(sessionList: string[]) {
    try {
      const updatedSessionList = new Set();
      for (let index = 0; index < sessionList.length; index++) {
        const token = sessionList[index];
        const payload = await this.jwt.decode(token);
        const timeNow = Math.ceil(new Date().getTime() / 1000);
        const timegap = payload.exp - timeNow;
        if (timegap > 0) {
          updatedSessionList.add(token);
        }
      }
      return Array.from(updatedSessionList);
    } catch (error) {
      await this.throwCustomException(error);
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
          let userCachekey;
          if (payload.type === 'c') {
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
      const auth_secret =
        'HpZnm7V6YeshFDVbwACyOtx6oa6QSbraZoNyU9fwtGYUL1Rnc6PN5QUosu9BcqVBo5L6QeSs';
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
      if (!payload || !payload.client || !payload.type) {
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
      const sessionListCacheKey =
        payload.type == 'c'
          ? `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${payload.client}:AFK:PROFILE:AFVK:v1:session`
          : `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${payload.client}:AFGK:${ag}:AFK:${app}:AFVK:v1:session`;
      const sessionListCache =
        await this.redisService.getJsonData(sessionListCacheKey);
      if (
        !sessionListCache ||
        !JSON.parse(sessionListCache) ||
        !Array.isArray(JSON.parse(sessionListCache)) ||
        !JSON.parse(sessionListCache).length
      ) {
        await this.commonService.errorLog(
          'Technical',
          'AK',
          'Fatal',
          'TG076',
          'Invalid access token',
          key,
          tokens,
        );
      }
      const sessionList = JSON.parse(sessionListCache);
      const updatedSessionList = await this.checkSession(sessionList);
      if (!updatedSessionList.includes(token)) {
        await this.redisService.setJsonData(
          sessionListCacheKey,
          JSON.stringify(updatedSessionList),
        );
        await this.commonService.errorLog(
          'Technical',
          'AK',
          'Fatal',
          'TG077',
          'Invalid access token',
          key,
          tokens,
        );
      }
      const timeNow = Math.ceil(new Date().getTime() / 1000);
      const timegap = payload.exp - timeNow;
      if (timegap < 600) {
        const updatedToken = await this.jwt.signAsync(
          {
            client: payload.client,
            loginId: payload.loginId,
            type: payload.type,
            ag,
            app,
          },
          {
            secret: auth_secret,
            expiresIn: '2h',
          },
        );
        await this.redisService.setJsonData(
          sessionListCacheKey,
          JSON.stringify(
            updatedSessionList
              .filter((s: string) => s !== token)
              .concat(updatedToken),
          ),
        );
        return { authenticated: true, updatedToken };
      } else {
        return { authenticated: true };
      }
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
    }
  }

  async signIntoTorus(
    client: string,
    username: string,
    password: string,
    type: 't' | 'c' = 't',
  ) {
    try {
      const userCachekey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${client}:AFGK:${ag}:AFK:${app}:AFVK:v1:users`;

      const sessionListCacheKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${client}:AFGK:${ag}:AFK:${app}:AFVK:v1:session`;

      const userResponse = await this.redisService.getJsonData(userCachekey);

      const userList: any[] = userResponse ? JSON.parse(userResponse) : [];
      const loggedInUser = userList.find(
        (user: any) => user.loginId === username || user.email === username,
      );

      if(!loggedInUser){
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordMatch = this.comparePasswords(
        password,
        loggedInUser.password,
      );

      if (!isPasswordMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isUserAccessExpired = (user: {
        accessExpires?: string | Date | null;
        accessProfile?: string[];
      }): boolean | null => {
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
      };

      const isExpiredUser = isUserAccessExpired(loggedInUser);

      if (isExpiredUser) {
        throw new NotAcceptableException(
          'User access expired, Please contact administrator',
        );
      }

      const userIndex = userList.findIndex(
        (user: any) => user.loginId === username || user.email === username,
      );

      userList.splice(userIndex, 1, {
        ...loggedInUser,
        status: 'active',
        lastActive: new Date(),
      });

      await this.redisService.setJsonData(
        userCachekey,
        JSON.stringify(userList),
      );

      delete loggedInUser.password;
      const auth_secret =
        'HpZnm7V6YeshFDVbwACyOtx6oa6QSbraZoNyU9fwtGYUL1Rnc6PN5QUosu9BcqVBo5L6QeSs';

      let token = await this.jwt.signAsync(
        { loginId: loggedInUser.loginId, client, type, ag, app },
        {
          secret: auth_secret,
          expiresIn: '24h',
        },
      );

      if (
        loggedInUser?.accessProfile &&
        Array.isArray(loggedInUser?.accessProfile) &&
        loggedInUser?.accessProfile?.length >= 2
      ) {
        await this.addSession(token, sessionListCacheKey);
        return {
          token,
          authorized: true,
          email: loggedInUser.email,
          redirectToORPSelector: true,
        };
      }

      const accessProfileCacheKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${client}:AFGK:${ag}:AFK:${app}:AFVK:v1:securityTemplate`;

      const accessProfileCache = await this.redisService.getJsonData(
        accessProfileCacheKey,
      );

      const accessProfileList = accessProfileCache
        ? JSON.parse(accessProfileCache)
        : [];

      if (accessProfileList.length == 0) {
        await this.addSession(token, sessionListCacheKey);
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

        const filteredCombination = this.transformToCombinations(
          filteredAccessprofile,
        );

        if (filteredCombination?.length == 1) {
          const combination = filteredCombination[0].combinations;
          if (combination.length == 1) {
            for (const key in combination[0]) {
              if (key.toLowerCase().includes('code')) {
                orpAccessObj[key] = combination[0][key];
                orpAccessObj['selectedAccessProfile'] =
                  loggedInUser.accessProfile[0];
                orpAccessObj['dap'] =
                  filteredCombination[0]['dap'] || undefined;
                redirectToORPSelector = false;
              }
            }
            token = await this.jwt.signAsync(
              {
                loginId: loggedInUser.loginId,
                client,
                type,
                ag,
                app,
                ...orpAccessObj,
              },
              {
                secret: auth_secret,
                expiresIn: '24h',
              },
            );
          }
        }
      }

      await this.addSession(token, sessionListCacheKey);

      return {
        token,
        authorized: true,
        email: loggedInUser.email,
        redirectToORPSelector,
      };
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async addSession(token: string, sessionListCacheKey: string) {
    try {
      const sessionListResponse =
        await this.redisService.getJsonData(sessionListCacheKey);

      let sessionList = new Set();
      if (sessionListResponse) {
        const updatedSessionList = await this.checkSession(
          JSON.parse(sessionListResponse),
        );
        sessionList = new Set(updatedSessionList);
      }

      await this.redisService.setJsonData(
        sessionListCacheKey,
        JSON.stringify([...Array.from(sessionList), token]),
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  comparePasswords(password: string, storedHash: string): boolean {
    const KEY_LENGTH = 64;
    const [salt, hash] = storedHash.split(':');
    const hashBuffer = Buffer.from(hash, 'hex');
    const testHash = scryptSync(password, salt, KEY_LENGTH);
    return timingSafeEqual(hashBuffer, testHash);
  }

  hashPassword(password: string): string {
    const SALT_LENGTH = 16;
    const KEY_LENGTH = 64;
    const salt = randomBytes(SALT_LENGTH).toString('hex');
    const hash = scryptSync(password, salt, KEY_LENGTH).toString('hex');
    return `${salt}:${hash}`;
  }

  async throwCustomException(error: any) {
    if (error instanceof CustomException) {
      throw error; // Re-throw the specific custom exception
    }
    throw error;
    // throw new CustomException(
    //   'An unexpected error occurred',
    //   HttpStatus.INTERNAL_SERVER_ERROR,
    // );
  }

  // static screen's apis

  async getAppSecurityData() {
    try {
      if (!tenant)
        throw new BadRequestException(
          'Either AppGroup or Application not available',
        );
      const appCachePrefix = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1`;
      const cacheKeyArray = ['orgMatrix', 'users', 'appearance'];
      const securityResponse = {};
      for (let index = 0; index < cacheKeyArray.length; index++) {
        const cacheKey = `${appCachePrefix}:${cacheKeyArray[index]}`;
        const data = await this.redisService.getJsonData(cacheKey);
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

      return securityResponse;
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getAPPSecurityTemplateData() {
    try {
      const responseFromRedis = await this.redisService.getJsonData(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:securityTemplate`,
      );
      const userResponse = await this.redisService.getJsonData(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:users`,
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
      );
      const accessProfileArray = [];
      const accessProfileWithProductAndService = {};
      if (responseFromRedis) {
        const accessProfileData: any[] = JSON.parse(responseFromRedis);
        accessProfileData.forEach((accessProfileObj) => {
          var noOfProdService = 0;
          accessProfileObj['products/Services'].forEach((productGrp: any) => {
            noOfProdService += productGrp['ps'].length;
          });
          accessProfileWithProductAndService[accessProfileObj?.accessProfile] =
            noOfProdService;
          accessProfileArray.push(accessProfileObj?.accessProfile);
        });
      }
      return accessProfileWithProductAndService;
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async postAppUserList(data: any[]) {
    try {
      if (!tenant || !data || !Array.isArray(data)) {
        throw new BadRequestException('Invalid credentials');
      }
      const userCachekey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:users`;

      var userList = [];
      const responseFromRedis =
        await this.redisService.getJsonData(userCachekey);

      if (responseFromRedis) {
        const existingUserList: any[] = JSON.parse(responseFromRedis);
        data.forEach((newUser) => {
          if (newUser.password) {
            userList.push({
              ...newUser,
              password: this.hashPassword(newUser.password),
            });
          } else {
            const existingUserObj = existingUserList.find(
              (existinguser) => existinguser.email == newUser.email,
            );
            userList.push({
              ...existingUserObj,
              ...newUser,
              password: existingUserObj?.password,
            });
          }
        });
      } else {
        userList = data.map((item) => ({
          ...item,
          password: this.hashPassword(item.password),
        }));
      }
      return await this.redisService.setJsonData(
        userCachekey,
        JSON.stringify([...userList]),
      );
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async setJson(key: string, data: any) {
    try {
      return await this.redisService.setJsonData(key, JSON.stringify(data));
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async appUserAddition(data: any) {
    try {
      if (!tenant || !ag || !app || !data) {
        throw new BadRequestException('Invalid input parameters');
      }
      const userCachekey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:users`;
      const clientProfileResourceKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:tpc`;

      const userResponse = await this.redisService.getJsonData(userCachekey);

      const userList: any[] = userResponse ? JSON.parse(userResponse) : [];

      const clientProfile = JSON.parse(
        await this.redisService.getJsonData(clientProfileResourceKey),
      );

      const { email, firstName, lastName, password, loginId } = data;
      const resForClientUserAddition = await this.redisService.getJsonData(
        `CK:TRL:FNGK:AFR:FNK:TEMPLATE:CATK:Portal:AFGK:Email:AFK:clientUserAddition:AFVK:v1:AFI`,
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
        password: this.hashPassword(data.password),
        isRestricted: true,
      });
      await this.redisService.setJsonData(
        userCachekey,
        JSON.stringify(userList),
      );
      const newUserList = structuredClone(userList);

      let result = [];

      for (const user of newUserList) {
        delete user.password;
        result.push(user);
      }

      return result;
    } catch (error) {
      console.log(error, 'error');

      await this.throwCustomException(error);
    }
  }

  async uploadImage(
    file: Express.Multer.File,
    bucketFoldername?: string,
    folderPath?: string,
    filename?: string,
  ): Promise<string> {
    try {
      const fileName = filename || file.originalname;
      const bucket = bucketFoldername || ''; // e.g., 'torus'
      const subFolder = folderPath || ''; // e.g., 'images'

      const actualBuffer = Buffer.isBuffer(file.buffer)
        ? file.buffer
        : Buffer.from((file.buffer as any)?.data || []);

      const form = new FormData();
      form.append('file', Readable.from(actualBuffer), fileName);

      const res = await axios.post(
        `${process.env.FTP_OUTPUT_HOST}/buckets/${bucket}/${subFolder}/${fileName}`,
        form,
        {
          headers: {
            Accept: 'application/json',
            ...form.getHeaders(),
          },
          auth: {
            username: `${process.env.SEAWEED_USERNAME}`,
            password: `${process.env.SEAWEED_PASSWORD}`,
          },
          validateStatus: (status) => status < 500,
        },
      );
      if (res.status == 201) {
        return `${process.env.SEAWEED_OUTPUT_HOST}/${bucket}/${subFolder}/${fileName}`;
      } else {
        throw new ConflictException(
          res.data || 'Error Occured while uploading file',
        );
      }
    } catch (error) {
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
      const userResponse = await this.redisService.getJsonData(userCachekey);
      if (!userResponse) throw new NotFoundException('no data found');
      const userList: any[] = userResponse ? JSON.parse(userResponse) : [];
      const foundedUser = userList.find(
        (user) => user.email.toLowerCase() === email.toLowerCase(),
      );
      if (!foundedUser) throw new NotFoundException('user not found');

      const otpTemplateFromRedis = await this.redisService.getJsonData(
        'CK:TRL:FNGK:AFR:FNK:TEMPLATE:CATK:Portal:AFGK:EMail:AFK:resetPasswordOtp:AFVK:v1:AFI',
      );
      const resetOtpTemplate = otpTemplateFromRedis
        ? JSON.parse(otpTemplateFromRedis)
        : {};

      const capitalizeFirstLetter = (str: string) => {
        if (!str) return str; // If the string is empty or null, return it as is.
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      };
      const otp = Math.floor(100000 + Math.random() * 900000);
      const otpJsonFromRedis = await this.redisService.getJsonData(otpCacheKey);
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
      await this.redisService.setJsonData(otpCacheKey, JSON.stringify(otpJson));

      const updatedTemplateHtml = (resetOtpTemplate.html as string)
        .replace(
          '${name}',
          `${capitalizeFirstLetter(foundedUser.firstName ?? email)} ${capitalizeFirstLetter(foundedUser.lastName ?? '')}`,
        )
        .replace('${otp}', `${otp}`).replaceAll('Torus' , process.env.APPNAME);
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
      return "Email sent to the registered email address"
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async verifyOtp(email:string , otp:string){
    try {
      if(!email || !otp) throw new BadRequestException('email or otp is required');
      const otpCacheKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:otp`;
      const otpJsonFromRedis = await this.redisService.getJsonData(otpCacheKey);
      if(!otpJsonFromRedis) throw new NotFoundException('otp not found');
      const otpJson = JSON.parse(otpJsonFromRedis);
      const existingIndex = otpJson.findIndex((ele) => ele.email == email && ele.otp == otp);
      if (existingIndex == -1) throw new NotFoundException('invalid otp');
      otpJson.splice(existingIndex, 1);
      await this.redisService.setJsonData(otpCacheKey, JSON.stringify(otpJson));
      return true
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async resetPassword(email:string , password:string){
    try {
     if(!email || !password) throw new BadRequestException('Please provide valid email and password');
     const userCachekey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:users`;
     const userResponse = await this.redisService.getJsonData(userCachekey);
     if(!userResponse) throw new NotFoundException('no data found');
     const userList: any[] = JSON.parse(userResponse);
     const foundedUser = userList.find((user) => user.email.toLowerCase() === email.toLowerCase());
     if(!foundedUser) throw new NotFoundException('user not found');
     foundedUser.password = this.hashPassword(password);
     await this.redisService.setJsonData(userCachekey, JSON.stringify(userList));
     return "Password updated successfully"
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

}
