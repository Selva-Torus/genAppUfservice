import {Inject, Injectable, Logger, forwardRef } from "@nestjs/common";
import { pfDto, PoEvent } from "src/dto";
import { RedisService } from "src/redisService";
import { CommonService } from "src/common.Service";
import { CustomException } from "src/customException";
import { JwtService } from "@nestjs/jwt";
import { LockService } from "src/lock.service";
import axios,{ AxiosRequestConfig } from "axios";
import * as FormData from 'form-data';
import Redis from 'ioredis';
import * as pg from "pg";
import { Readable } from "stream";
import { MongoClient } from "mongodb";
import Ajv from 'ajv';
import { json2xml } from 'xml-js';
import * as csvtojson from 'papaparse';
import { parseStringPromise } from 'xml2js'
import * as XLSX from '@e965/xlsx';
const _ = require("lodash")
import * as crypto from 'crypto';
import { Queue,QueueEvents } from 'bullmq';
import { EventEmitterProcessor } from "./event-emitter.processor";
import { ListenerService } from "./listener.service";
import { CompressionTypes, EachMessagePayload } from 'kafkajs';

type MappingValue = string | { sourcePath: string; arrayMap: Record< string, string> };
type MappingConfig = Record< string, MappingValue>;
interface ArrayMapConfig {
  sourcePath: string;
  arrayMap: Record< string, string>;
}

@Injectable()
export class DynamicFlowService {
    private ajv = new Ajv();  
    private statickeyword = ['get', 'post', 'patch', '200', '201', '202', '204', '400', '401', '403', '404', '500','requestBody', '*/*', 'responses', 'content', 'application/json', 'application/xml', 'text/plain', 'application/jwt', 'application/json; charset=utf-8', 'schema', 'properties', 'allOf', 'oneOf', 'inputschema', 'outputschema',];//"parameters",
    private numberArr: string[] = Array.from({ length: 101 }, (_, i) => i.toString());  

    constructor(
    private readonly redisService:RedisService,
    private readonly listenerService:ListenerService,
    private readonly jwtService:JwtService,  
    private readonly CommonService: CommonService,
    private readonly lockservice: LockService,
    @Inject(forwardRef(() => EventEmitterProcessor)) private readonly processor: EventEmitterProcessor
   ){}
   private readonly logger = new Logger(DynamicFlowService.name)
 

    async DynamicFlowProcess(input: PoEvent) {
        this.logger.log("Torus Consumer Started....")
        try {
            let pfdto = input.pfdto
            let event = input.event
            let pfjson = input.pfs
            let pfo = input.pfo
            let poNode = input.poJson
            let ndp = input.ndp
            let flag = input.flag
            let page = input.page
            let count = input.count
            let filterData = pfdto.filterData
            let lockDetails = pfdto.lock
            let childtable = pfdto.childTable
            let logicCenter = pfdto?.logicCenter
            let params: any = (Object.keys(input))
            let missingKeys = params.filter(item => {
                if (item != 'data') {
                    item => !input[item] || input[item] == null || input[item] == undefined
                }
            });
            if (missingKeys.length > 0) {
                return `${missingKeys.join(', ')} ${missingKeys.length > 1 ? 'are' : 'is'} empty`;
            }
            let currentFabric = await this.CommonService.splitcommonkey(pfdto.key, 'FNK')
            let pfresponse = await this.pfProcessor(pfdto, event, pfjson, pfo, poNode, ndp, currentFabric, flag, page, count, filterData, lockDetails, childtable, logicCenter);
            return pfresponse
        } catch (error) {
            // console.log('TS Error', error);
            return error
        }
    }

    async pfProcessor(pfdto, event, pfjson, poJson, pfo, ndp, currentFabric, flag, page, count, filterData, lockDetails, childtable, logicCenter) {
        this.logger.log('Pf Processor started!');
        let upId = pfdto.upId
        this.logger.log('UPID', upId);
        let key: string = pfdto.key
        let inputparam = pfdto.data
        let token = pfdto.token
        let nodeId = pfdto.nodeId
        let nodeType = pfdto.nodeType
        let nodeName = pfdto.nodeName
        let parentUpId = pfdto.parentUpId
        let collectionName = process.env.CLIENTCODE;
       
        let offset = (page - 1) * count;
        
        let fngkKey = await this.CommonService.splitcommonkey(pfdto.key, 'FNGK');
        let processedKey
        if (pfdto.key.includes(fngkKey)) {
            processedKey = pfdto.key.replace(fngkKey, fngkKey + 'P');
        }
        let dstkey = processedKey.replace('DF-DFD', 'DF-DST');
        let staticQueue = currentFabric == 'DF-DFD' ? 'TDH' : 'TPH';
        
        let inputCollection: any = {};
        let poNode = poJson?.mappedData?.artifact?.node;
        let internalEdges = poJson?.internalMappingEdges;
       
        let SessionToken = await this.jwtService.decode(token, { json: true });
       // let tokenDecode = await this.CommonService.MyAccountForClient(token);  
        let sobj = {},SessionInfo = {}    
        
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

        let sourceStatus, srcQueue, targetStatus, targetQueue, failureQueue, failureTargetStatus, suspiciousStatus, suspiciousQueue, errorStatus, errorQueue;
        for (var j = 0; j < poNode.length; j++) {
            if (poNode[j].nodeId == nodeId) {
                if (currentFabric == 'DF-DFD') {
                    sourceStatus = poNode[j].events.sourceStatus;
                    srcQueue = poNode[j].events.sourceQueue;
                    targetStatus = poNode[j].events.pro.success.targetStatus;
                    targetQueue = poNode[j].events?.pro?.success?.targetQueue;
                    failureQueue = poNode[j].events.pro.failure.targetQueue;
                    failureTargetStatus = poNode[j].events.pro.failure.targetStatus;
                } else if (currentFabric == 'PF-PFD' || currentFabric == 'PF-SFD' || currentFabric == 'PF-SCDL') {
                    if (Array.isArray(poNode[j].events) && poNode[j].events.length > 0) {
                        for (let e = 0; e < poNode[j].events.length; e++) {
                            if (event == poNode[j].events[e].source.status) {
                                sourceStatus = poNode[j].events[e].source.status;
                                srcQueue = poNode[j].events[e].source.queue;
                                targetStatus = poNode[j].events[e].success.status;
                                targetQueue = poNode[j].events[e].success.queue;
                                failureQueue = poNode[j].events[e].failure.queue;
                                failureTargetStatus = poNode[j].events[e].failure.status;
                                suspiciousStatus = poNode[j].events[e].suspicious.status;
                                suspiciousQueue = poNode[j].events[e].suspicious.queue;
                                errorStatus = poNode[j].events[e].error.status;
                                errorQueue = poNode[j].events[e].error.queue;
                            }
                        }
                    }
                }
            }

            if (!srcQueue || srcQueue == ' ') srcQueue = staticQueue;
            if (!failureQueue || failureQueue == ' ') failureQueue = srcQueue;
            srcQueue = collectionName + '_' + srcQueue + '_ProcessStatus';
            failureQueue = collectionName + '_' + failureQueue + '_ProcessStatus';
            var dfoSchema: any;
            let RCMresult, zenresult, customcoderesult, codeObj, ifoObj

            //HumanTaskNode
            if (nodeType == 'humantasknode' && poNode[j].nodeId == nodeId) {
                try {
                    this.logger.log('HumanTask node Started');
                    RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam, processedKey + upId, currentFabric, SessionInfo);
                    if (RCMresult) {
                        zenresult = RCMresult.rule
                        customcoderesult = RCMresult.code
                    }
                    ifoObj = await this.ifoAssign(poJson?.internalMappingNodes, poNode[j].nodeId)
                   
                    if (customcoderesult && customcoderesult != undefined && customcoderesult != null) {
                        codeObj = await this.codeAssign(customcoderesult)
                        if (codeObj) {
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);
                            if (inputparam)
                                inputparam = await this.codeORifoAndInputparamAssign(codeObj, inputparam)
                        }
                    }

                    if(ifoObj && codeObj){
                        if ( Object.keys(ifoObj).length > 0 && Object.keys(codeObj).length > 0) 
                            ifoObj = Object.assign(ifoObj, codeObj)
                    }
                       
                    
                    if(ifoObj)
                     await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(ifoObj), collectionName, 'ifo',);

                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(inputparam), collectionName, 'response',);
                    await this.redisService.setStreamData(srcQueue, 'TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: inputparam, response: inputparam } }),);
                    await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, inputparam, inputparam,);
                    inputparam = { [nodeName]: inputparam }
                    this.logger.log('HumanTask node completed');
                    return { status: 200, targetStatus: targetStatus, data: inputparam };
                } catch (error) {
                    await this.exceptionhandler(failureQueue, suspiciousQueue, errorQueue, error, upId, nodeId, failureTargetStatus, inputparam)
                }
            }

            //DecisionNode
            if (nodeType == 'decisionnode' && poNode[j].nodeId == nodeId) {
                try {
                    this.logger.log('Decision node Started');
                    if (!poNode[j].rule || Object.values(poNode[j].rule).length == 0) {
                        throw new CustomException('Rule is required for decision node', 404);
                    }
                    let decisionRes
                    RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam, processedKey + upId, currentFabric, SessionInfo);
                    if (RCMresult) {
                        zenresult = RCMresult.rule;
                        customcoderesult = RCMresult.code;
                    }
                    if (zenresult) {
                        for (let e = 0; e < poNode[j].events?.length; e++) {
                            if (event == poNode[j].events[e].source.status) {
                                await this.redisService.setJsonData(key + 'PO', JSON.stringify(zenresult), collectionName, 'mappedData.artifact.node[' + j + '].events[' + e + '].success.status',);
                            }
                        }
                        decisionRes = { zenresult }
                        await this.redisService.setStreamData(srcQueue, 'TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: zenresult, data: { request: inputparam, response: zenresult } }),);
                        await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, inputparam, { zenresult });
                    }
                    if (customcoderesult && customcoderesult != undefined && customcoderesult != null) {
                        codeObj = await this.codeAssign(customcoderesult)
                        if (codeObj) {
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);
                            if (decisionRes)
                                decisionRes = await this.codeORifoAndInputparamAssign(codeObj, decisionRes)
                        }
                    }

                    if (decisionRes) {
                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(decisionRes), collectionName, 'response',);
                    }
                    this.logger.log('Decision node completed');
                    return { status: 200, targetStatus: zenresult, data: inputparam };
                } catch (error) {
                    await this.exceptionhandler(failureQueue, suspiciousQueue, errorQueue, error, upId, nodeId, failureTargetStatus, inputparam)
                }
            }

             //Api Node
            if ((nodeType == 'apinode' || nodeType == 'googlefileapinode') && poNode[j].nodeId == nodeId) {
                let lock: any, rollbackConfig, apichildResult: any = []
                try {
                    if (currentFabric == 'PF-SCDL' && poNode[j].nodeId == poNode[1].nodeId) {
                        let firstnode = await this.listenerService.firstProcessor(pfdto, event, pfjson, poJson, pfo, ndp, currentFabric, flag, page, count, filterData, lockDetails, childtable, logicCenter, true)
                        return { status: firstnode.status, targetStatus: firstnode.targetStatus, data: firstnode.data, }
                    }
                    else {
                        this.logger.log(`${poNode[j].nodeName} Api node Started`);
                        // console.log('inputparam',inputparam);

                        if (!failureQueue) {
                            failureQueue = srcQueue;
                        }
                        rollbackConfig = ndp[poNode[j].nodeId]
                        let customConfig = ndp[poNode[j].nodeId]
                        let referenceKey = customConfig?.apiKey;
                        let SessionfilterParams = customConfig?.data?.pro?.filterParams//?.items;
                        let filterParams = customConfig?.data?.pro?.request?.filterParams?.items;
                        let requestContentType = customConfig?.data?.pro?.request?.content_type?.value;
                        let responseContentType = customConfig?.data?.pro?.response?.content_type?.value;
                        let nodeVersion = customConfig?.nodeVersion;
                        let rollback = customConfig?.rollback
                        let rule = customConfig?.rule

                        if (!referenceKey)
                            throw new CustomException('Reference key not found', 404);

                        let ApiConfig: any = JSON.parse(await this.redisService.getJsonData(referenceKey, collectionName));

                        if (!ApiConfig || Object.keys(ApiConfig).length == 0)
                            throw new CustomException('Reference key value not found', 404);

                        let apiVal = Object.values(ApiConfig)[0];
                        customConfig = apiVal;
                        let methodName, parameterQuery, parameter, contentType, serverUrl, endPoint, encCredentials, codeObj;
                        if (nodeVersion?.toLowerCase() == 'v1') {
                            let oprname: any = customConfig?.data?.method;
                            if (!oprname)
                                throw new CustomException('Method Name not found', 404);
                            methodName = oprname.toLowerCase();
                            parameterQuery = customConfig.data?.[methodName]?.parameters;
                            parameter = customConfig.data[methodName];
                            if (methodName == 'get') {
                                let responsekey = Object.keys(parameter?.responses)[0];
                                contentType = parameter?.responses[responsekey]?.content ? Object.keys(parameter.responses[responsekey]?.content)[0] : '';
                            } else {
                                contentType = parameter?.requestBody?.content ? Object.keys(parameter.requestBody.content)[0] : '';
                            }
                            serverUrl = customConfig.data?.serverUrl //customConfig.data?.apiUrl ? customConfig.data?.apiUrl : customConfig.data?.serverUrl;
                            endPoint = customConfig.data?.endPoint;
                        }

                        let apires: any,headerRole
                        if (customConfig) {  
                           if(rule?.approvalProcess){
                            let rulekey = rule?.ruleKey                           
                            if (!rulekey) throw new CustomException(pfjson[i].nodeName+' rulekey key not found', 404);
                            let ruleConfig: any = JSON.parse(await this.redisService.getJsonData(rulekey, collectionName));                  
                            if (!ruleConfig || Object.keys(ruleConfig).length == 0)
                                throw new CustomException(pfjson[i].nodeName +' Reference key value not found', 404);
                            let rulejson: any = Object.values(ruleConfig)[0]; 
                            let rulecheck:any = await this.CommonService.getRuleCodeMapper(rulejson, inputparam, processedKey + upId, currentFabric, SessionInfo);
                            headerRole = rulecheck?.rule
                           }
                            encCredentials = await this.CommonService.checkEncryption(poNode[j]);
                            ifoObj = await this.ifoAssign(poJson?.internalMappingNodes, poNode[j].nodeId)
                            if (currentFabric == 'PF-PFD' || currentFabric == 'PF-SFD' || currentFabric == 'PF-SCDL') {
                                RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam, processedKey + upId, currentFabric, SessionInfo);
                                if (RCMresult) {
                                    zenresult = RCMresult.rule;
                                    customcoderesult = RCMresult.code;
                                }
                                if (customcoderesult && customcoderesult != undefined && customcoderesult != null) {
                                    codeObj = await this.codeAssign(customcoderesult)
                                    if (codeObj)
                                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);
                                }
                                if (ifoObj && Object.keys(ifoObj).length > 0)
                                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(ifoObj), collectionName, 'ifo',);
                            }
                            let childInsertArr, textobj, mapObj = {}, tempQryVal = []
                            if (internalEdges && internalEdges.hasOwnProperty(poNode[j].nodeId)) {
                                let currentNodeEdge = internalEdges[poNode[j].nodeId];
                                if (currentFabric == 'DF-DFD') {
                                    let DfmappedData = await this.DFDMapEdgeValues(poNode, currentNodeEdge, inputparam, processedKey, upId, collectionName,  parameter, codeObj, pfo, currentFabric)
                                    mapObj = DfmappedData.mapObj
                                    tempQryVal = DfmappedData.tempQryVal
                                } else {
                                    let mappedData = await this.mapEdgeValuesToParams(pfdto, currentNodeEdge, inputparam, processedKey, upId, collectionName,  parameter, codeObj, pfo, childtable)
                                    childInsertArr = mappedData.childInsertArr
                                    tempQryVal = mappedData.tempQryVal
                                    textobj = mappedData.textobj
                                }
                            }
                            
                            if (childInsertArr?.length == 0 && currentFabric == 'PF-SFD') {
                                childInsertArr = inputparam?.mapObj;
                                tempQryVal = inputparam?.tempQryVal
                            }

                            if (currentFabric == 'DF-DFD') {
                                let apiUrl = serverUrl + endPoint;
                                let queryArr = []
                                if (methodName) {
                                    if (SessionfilterParams?.length > 0) {
                                        for (let i = 0; i < SessionfilterParams.length; i++) {
                                            let filcol = SessionfilterParams[i].name;
                                            let filval = SessionfilterParams[i].value;
                                            if (filval) {
                                                if ((Object.keys(sobj)).includes(filval)) {
                                                    let strobj = filcol + '=' + sobj[filval]
                                                    queryArr.push(strobj);
                                                }
                                            }
                                        }
                                    }
                                    if (filterParams?.length > 0) {
                                        for (let i = 0; i < filterParams.length; i++) {
                                            let filcol = filterParams[i].key;
                                            let filval = filterParams[i].value.value;
                                            if (filcol && filval) {
                                                if (endPoint.includes('{') && endPoint.includes('}')) {
                                                    mapObj[filcol] = filval
                                                } else {
                                                    if ((Object.keys(sobj)).includes(filval)) {
                                                        let strobj = filcol + '=' + sobj[filval]
                                                        queryArr.push(strobj);
                                                    } else {
                                                        let strobj = filcol + '=' + filval
                                                        queryArr.push(strobj);
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    if (methodName == 'get') {
                                        if (serverUrl && endPoint) {
                                            let queryParam;
                                            if (tempQryVal && tempQryVal.length > 0) {
                                                for (let t = 0; t < tempQryVal.length; t++) {
                                                    if (mapObj && mapObj[tempQryVal[t]['key']]) {
                                                        queryArr.push(tempQryVal[t]['key'] + '=' + mapObj[tempQryVal[t]['key']],);
                                                    }
                                                }
                                            }
                                            if (queryArr?.length > 0 && Object.keys(queryArr).length > 0)
                                                queryParam = queryArr.join('&');

                                            if (endPoint.includes('{') && endPoint.includes('}')) {
                                                endPoint = endPoint.replace(/{(.*?)}/g, (_, key) => mapObj[key] || '',);
                                                apiUrl = serverUrl + endPoint;
                                            }
                                            // if (queryArr.length > 0) {
                                            //   var queryParam = queryArr.join('&');
                                            // }

                                            if (queryParam) {
                                                apiUrl = apiUrl + '?' + queryParam;
                                            }

                                            const requestConfig: AxiosRequestConfig = {
                                                headers: {
                                                    Authorization: `Bearer ${token}`
                                                }
                                            }
                                            let postres = await this.executeApiCall(methodName, apiUrl, requestConfig)
                                            if (flag != 'N' && postres?.result?.length == 0) {
                                                await this.redisService.setStreamData(srcQueue, 'TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: apiUrl, response: postres } }));
                                                return {
                                                    status: 200,
                                                    targetStatus: targetStatus,
                                                    data: postres?.result,
                                                };
                                            } else if (postres?.status != 'Success' || postres?.result?.length == 0) {
                                                throw new CustomException('Data not found', 404);
                                            } else {
                                                apires = postres.result;
                                            }
                                        } else {
                                            throw new CustomException('Endpoint not found', 404);
                                        }
                                    }

                                    if (filterData && filterData.length > 0) {
                                        let currentFilterData;
                                        for (let f = 0; f < filterData.length; f++) {
                                            if (filterData[f].nodeId == poNode[j].nodeId) {
                                                delete filterData[f].nodeId;
                                                currentFilterData = filterData[f];
                                            }
                                        }
                                        let filterpath = {};
                                        for (let item in currentFilterData) {
                                            let s_item = item.split('.');
                                            let removedVal = s_item.filter((item) => !this.statickeyword.includes(item)).join('.');
                                            if (removedVal.startsWith('items.')) {
                                                removedVal = removedVal.replace('items.', '');
                                            }
                                            filterpath[removedVal] = currentFilterData[item];
                                        }
                                        let currentFilterRes;
                                        if (filterpath && Object.keys(filterpath).length > 0) {
                                            if (Array.isArray(apires) && apires?.length > 0) {
                                                currentFilterRes = [];
                                                for (let a = 0; a < apires.length; a++) {
                                                    let b = 0;
                                                    for (let item in filterpath) {
                                                        const expectedValue = filterpath[item];
                                                        const result = this.findMatchingValuesFlexible(apires[a], item, expectedValue,);
                                                        if (result.length > 0) {
                                                            b++;
                                                        }
                                                        if (b == Object.keys(filterpath).length)
                                                            currentFilterRes.push(apires[a]);
                                                    }
                                                }
                                            } else if (apires && Object.keys(apires).length > 0) {
                                                currentFilterRes = {};
                                                let b = 0;
                                                for (let item in filterpath) {
                                                    const expectedValue = filterpath[item];
                                                    const result = this.findMatchingValuesFlexible(apires, item, expectedValue,);
                                                    if (result.length > 0) {
                                                        b++;
                                                    }
                                                    if (b == Object.keys(filterpath).length)
                                                        currentFilterRes = apires;
                                                }
                                            }
                                            if (currentFilterRes) {
                                                apires = currentFilterRes;
                                            }
                                        }
                                    }

                                    if (Array.isArray(apires) && page && count) {
                                        let start = (page - 1) * count;
                                        let end = start + count;
                                        let fillarr = [];
                                        for (let i = start; i < end; i++) {
                                            if (apires[i] != null) fillarr.push(apires[i]);
                                        }
                                        apires = fillarr;
                                    }

                                    if (!logicCenter && currentFabric == 'DF-DFD') {
                                        let keys = await this.redisService.getKeys(dstkey + SessionToken.loginId + '_DS_Object', collectionName)
                                        if (keys.length > 0) {
                                            for (let a = 0; a < keys.length; a++) {
                                                await this.redisService.deleteKey(keys[a], collectionName)
                                            }
                                        }
                                        this.redisService.sethash(apires, dstkey + SessionToken.loginId + '_DS_Object')
                                        return { data: 'logicCenter' }
                                    }
                                    inputparam = await this.assignToInputParam(inputparam, nodeName, apires)
                                    if (!inputparam || inputparam?.length == 0) {
                                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(apires), collectionName, 'customResponse',);
                                        RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], apires, processedKey + upId, currentFabric, SessionInfo);
                                    }
                                    if (RCMresult) {
                                        zenresult = RCMresult.rule;
                                        customcoderesult = RCMresult.code;
                                    }
                                    if (ifoObj && Object.keys(ifoObj).length > 0)
                                        apires = await this.codeORifoAndInputparamAssign(ifoObj, apires)

                                    if (customcoderesult && customcoderesult != undefined && customcoderesult != null) {
                                        apires = await this.codeORifoAndInputparamAssign(customcoderesult, apires)
                                    }

                                }
                                if (upId) {
                                    await this.redisService.setStreamData(srcQueue, 'TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: inputparam, response: apires } }),);
                                    if (apires)
                                        await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, apiUrl, apires,);
                                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(apiUrl), collectionName, 'request',);
                                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(apires), collectionName, 'response',);
                                }
                            } else if (currentFabric == 'PF-PFD' || currentFabric == 'PF-SFD' || currentFabric == 'PF-SCDL') {
                                let apiUrl = serverUrl + endPoint;
                                let apiResult, DecapiResult, EncapiResult, EncryptedRqst
                                if (childInsertArr?.length > 0) {
                                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(childInsertArr), collectionName, 'request',);
                                    childInsertArr = childInsertArr.filter(item => item !== undefined)
                                    for (let r = 0; r < childInsertArr.length; r++) {
                                        if (childInsertArr[r])
                                            mapObj = childInsertArr[r];
                                        if (methodName) {
                                            if (methodName == 'get') {
                                                if (apiUrl) {
                                                    let params = await this.buildRequestComponents(apiUrl, tempQryVal, mapObj);
                                                    params.headers['Authorization'] = `Bearer ${token}`;                                                    
                                                    apiUrl = params?.apiUrl;
                                                    const requestConfig: AxiosRequestConfig = {
                                                        headers: params.headers,
                                                    };
                                                    apiResult = await this.executeApiCall(methodName, apiUrl, requestConfig)
                                                    if (apiResult.statusCode == 201 || apiResult.statusCode == 200) {
                                                        apiResult = apiResult?.result;
                                                    } else {
                                                        throw apiResult;
                                                    }
                                                    let assigndata = await this.assign(apiResult, ifoObj, codeObj, inputparam, nodeName, mapObj)
                                                    apichildResult = assigndata.apichildResult
                                                    inputparam = assigndata.inputparam
                                                } else {
                                                    throw new CustomException('API Endpoint does not exist', 404);
                                                }
                                            } else if (methodName == 'post') {
                                                if (apiUrl) {
                                                    let params = await this.buildRequestComponents(apiUrl, tempQryVal, mapObj);
                                                    params.headers['Authorization'] = `Bearer ${token}`; 
                                                     if(headerRole){
                                                    params.headers['xCdcaRole'] = headerRole;
                                                    params.headers['xCdcaUsername'] = SessionToken?.loginId;
                                                    }                                                                                                      
                                                    apiUrl = params?.apiUrl;
                                                    if (contentType == 'application/json' && mapObj && Object.keys(mapObj).length > 0) {
                                                        if (referenceKey.includes(':FNK:API-APIPD:')) {
                                                            mapObj['trs_status'] = sourceStatus;
                                                            mapObj['trs_process_id'] = upId;
                                                            mapObj['trs_created_by'] = SessionToken?.loginId;
                                                            mapObj['trs_access_profile'] = SessionToken?.selectedAccessProfile;
                                                            mapObj['trs_org_grp_code'] = SessionToken?.orgGrpCode;
                                                            mapObj['trs_org_code'] = SessionToken?.orgCode;
                                                            mapObj['trs_role_grp_code'] = SessionToken?.roleGrpCode;
                                                            mapObj['trs_role_code'] = SessionToken?.roleCode;
                                                            mapObj['trs_ps_code'] = SessionToken?.psCode;
                                                            mapObj['trs_ps_grp_code'] = SessionToken?.psGrpCode;
                                                           // mapObj['trs_creator_email'] = tokenDecode?.email;
                                                            mapObj['trs_sub_org_grp_code'] = SessionToken?.subOrgGrpCode;
                                                            mapObj['trs_sub_org_code'] = SessionToken?.subOrgCode;
                                                        }
                                                        const requestConfig: AxiosRequestConfig = {
                                                            headers: params.headers,
                                                        };
                                                        if (encCredentials?.selectedDpd && encCredentials?.encryptionMethod) {
                                                            let obj = {}
                                                            if (childtable?.length > 0) {
                                                                for (let i = 0; i < childtable.length; i++) {
                                                                    if (Array.isArray(mapObj[childtable[i]])) {
                                                                        let s = {}
                                                                        s['create'] = mapObj[childtable[i]]
                                                                        obj[childtable[i]] = s
                                                                    } else {
                                                                        obj[childtable[i]] = mapObj[childtable[i]]
                                                                    }
                                                                }
                                                            }
                                                            if (obj && Object.keys(obj).length > 0)
                                                                mapObj = Object.assign(mapObj, obj)
                                                            mapObj = await this.CommonService.commonEncryption(encCredentials.selectedDpd, encCredentials.encryptionMethod, mapObj, 'secretkey',);
                                                            EncryptedRqst = mapObj;
                                                            EncapiResult = await this.executeApiCall(methodName, apiUrl, requestConfig, { data: mapObj })
                                                            DecapiResult = await this.CommonService.commondecryption(encCredentials.selectedDpd, encCredentials.encryptionMethod, EncapiResult.result, 'secretkey',);

                                                            apiResult = JSON.parse(DecapiResult);
                                                        } else {
                                                            let obj = {}
                                                            if (childtable?.length > 0) {
                                                                for (let i = 0; i < childtable.length; i++) {
                                                                    if (Array.isArray(mapObj[childtable[i]])) {
                                                                        let s = {}
                                                                        s['create'] = mapObj[childtable[i]]
                                                                        obj[childtable[i]] = s
                                                                    } else {
                                                                        obj[childtable[i]] = mapObj[childtable[i]]
                                                                    }
                                                                }
                                                            }
                                                            if (obj && Object.keys(obj).length > 0)
                                                                mapObj = Object.assign(mapObj, obj)
                                                            apiResult = await this.executeApiCall(methodName, apiUrl, requestConfig, mapObj)
                                                        }
                                                    } else if (contentType == 'text/plain') {
                                                        const requestConfig: AxiosRequestConfig = {
                                                            headers: {
                                                                'Content-Type': contentType
                                                            }
                                                        };
                                                        let textdata = textobj.replace(/\\n/g, '\n');
                                                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(textdata), collectionName, 'request');
                                                        apiResult = await this.executeApiCall(methodName, apiUrl, requestConfig, textdata)

                                                    } else if (contentType == 'application/xml') {
                                                        const requestConfig: AxiosRequestConfig = {
                                                            headers: {
                                                                'Content-Type': contentType
                                                            }
                                                        };
                                                        const jsonString = JSON.stringify(textobj);
                                                        const xml = json2xml(jsonString, { compact: true, spaces: 4 });
                                                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(xml), collectionName, 'request');
                                                        apiResult = await this.executeApiCall(methodName, apiUrl, requestConfig, xml)
                                                    }
                                                    if (apiResult) {
                                                        if (apiResult.statusCode == 201 || apiResult.statusCode == 200) {
                                                            apiResult = apiResult?.result;
                                                        } else {
                                                            throw apiResult;
                                                        }
                                                        let assigndata = await this.assign(apiResult, ifoObj, codeObj, inputparam, nodeName, mapObj)
                                                        apichildResult = assigndata.apichildResult
                                                        inputparam = assigndata.inputparam
                                                    }
                                                } else {
                                                    throw new CustomException('Method name not found', 404);
                                                }
                                            } else if (methodName == 'patch' || methodName == 'put') {
                                                if (serverUrl && endPoint) {
                                                   let params = await this.buildRequestComponents(apiUrl, tempQryVal, mapObj);
                                                    params.headers['Authorization'] = `Bearer ${token}`;
                                                     if(headerRole){
                                                    params.headers['xCdcaRole'] = headerRole;
                                                    params.headers['xCdcaUsername'] = SessionToken?.loginId;
                                                    } 
                                                    apiUrl = params?.apiUrl;
                                                    const requestConfig: AxiosRequestConfig = {
                                                        headers: params.headers,
                                                    };
                                                    if (mapObj && Object.keys(mapObj).length > 0) {
                                                        if (referenceKey.includes(':FNK:API-APIPD:')) {
                                                            mapObj['trs_status'] = sourceStatus;
                                                            mapObj['trs_modified_by'] = SessionToken?.loginId;
                                                            mapObj['trs_process_id'] = upId;
                                                        }
                                                    } else {
                                                        throw 'MappingObject is empty';
                                                    }
                                                    let tempEndpoint = endPoint.replace(/{(.*?)}/g, (_, key) => mapObj[key] || '',);
                                                    let primaryKey
                                                    if (tempQryVal?.length > 0) {
                                                        for (let t = 0; t < tempQryVal.length; t++) {
                                                            if (mapObj[tempQryVal[t]['key']]) {
                                                                primaryKey = mapObj[tempQryVal[t]['key']];
                                                                delete mapObj[tempQryVal[t]['key']];
                                                            }
                                                        }
                                                    }
                                                    if (!primaryKey) throw 'Primary Key not found'
                                                    let split = endPoint.split('/')
                                                    let tableName = split[1]
                                                    try {
                                                        if (lockDetails && (lockDetails.lockMode).toLowerCase() == 'single' && lockDetails.ttl) {
                                                            let isProcessing
                                                            let obj: any
                                                            const resource = [`locks:${tableName}:${primaryKey}`];
                                                            const ttl = lockDetails.ttl
                                                            lock = await this.lockservice.acquireLock(resource, ttl);
                                                            if (await this.redisService.exist(processedKey + 'lock', collectionName)) {
                                                                isProcessing = JSON.parse(await this.redisService.getJsonData(processedKey + 'lock', collectionName))
                                                                if (isProcessing.tablename == tableName && isProcessing.primarykey == primaryKey && isProcessing.lockflag == true) {
                                                                    await this.lockservice.releaseLock(lock);
                                                                    return ('Another update is in progress. Please try again later.');
                                                                }
                                                                else await this.redisService.setJsonData(processedKey + 'lock', JSON.stringify(true), collectionName, 'lockflag')
                                                            }
                                                            else {
                                                                obj = { 'tablename': tableName, 'primarykey': primaryKey, 'lockflag': true }
                                                                await this.redisService.setJsonData(processedKey + 'lock', JSON.stringify(obj), collectionName)
                                                            }
                                                            try {
                                                                if (rollback) {
                                                                    let beforeUpdate = await this.executeApiCall(methodName, serverUrl + tempEndpoint, requestConfig)
                                                                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(beforeUpdate), collectionName, 'rollback')
                                                                }
                                                                apiResult = await this.executeApiCall(methodName, serverUrl + tempEndpoint, requestConfig, mapObj)
                                                                if (apiResult.statusCode == 201 || apiResult.statusCode == 200) {
                                                                    apiResult = apiResult?.result;
                                                                } else {
                                                                    throw apiResult;
                                                                }
                                                                // console.log(`Updated record with ID: ${primaryKey}`);
                                                                await this.redisService.setJsonData(processedKey + 'lock', JSON.stringify(false), collectionName, 'lockflag')
                                                                // release(); 
                                                                await this.lockservice.releaseLock(lock);
                                                                //  return `Record with ID ${primaryKey} successfully updated.`; 
                                                            } catch (error) {
                                                                await this.redisService.setJsonData(processedKey + 'lock', JSON.stringify(false), collectionName, 'lockflag')
                                                                await this.lockservice.releaseLock(lock);
                                                            }
                                                        }
                                                        else {
                                                            if (encCredentials?.selectedDpd && encCredentials?.encryptionMethod) {
                                                                mapObj = await this.CommonService.commonEncryption(encCredentials.selectedDpd, encCredentials.encryptionMethod, mapObj, 'secretkey',);
                                                                EncryptedRqst = mapObj;
                                                                EncapiResult = await this.executeApiCall(methodName, serverUrl + tempEndpoint, requestConfig, { data: mapObj })
                                                                DecapiResult = await this.CommonService.commondecryption(encCredentials.selectedDpd, encCredentials.encryptionMethod, EncapiResult.result, 'secretkey',);

                                                                apiResult = JSON.parse(DecapiResult);
                                                            } else {
                                                                if (rollback) {
                                                                    let beforeUpdate = await this.executeApiCall(methodName, serverUrl + tempEndpoint, requestConfig)
                                                                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(beforeUpdate), collectionName, 'rollback')
                                                                }
                                                                apiResult = await this.executeApiCall(methodName, serverUrl + tempEndpoint, requestConfig, mapObj)
                                                            }
                                                            if (apiResult.statusCode == 201 || apiResult.statusCode == 200) {
                                                                apiResult = apiResult?.result;
                                                            }
                                                            else {
                                                                throw apiResult;
                                                            }
                                                        }
                                                    } catch (error) {
                                                        if (lockDetails) {
                                                            if (lockDetails.ttl && JSON.stringify(error).includes('quorum')) {
                                                                throw new CustomException('Resource locked by other user', 423);
                                                            }
                                                            if (lock) {
                                                                await this.lockservice.releaseLock(lock);
                                                                this.logger.log(`Lock released for ${primaryKey}`);
                                                            }
                                                        }
                                                    }

                                                    let assigndata = await this.assign(apiResult, ifoObj, codeObj, inputparam, nodeName, mapObj)
                                                    apichildResult = assigndata.apichildResult
                                                    inputparam = assigndata.inputparam

                                                } else {
                                                    throw new CustomException('API Endpoint does not exist', 404);
                                                }
                                            } else if (methodName == 'delete') {
                                                if (apiUrl) {
                                                    let params = await this.buildRequestComponents(apiUrl, tempQryVal, mapObj);
                                                    params.headers['Authorization'] = `Bearer ${token}`;
                                                     if(headerRole){
                                                    params.headers['xCdcaRole'] = headerRole;
                                                    params.headers['xCdcaUsername'] = SessionToken?.loginId;
                                                    } 
                                                    apiUrl = params?.apiUrl;
                                                    const requestConfig: AxiosRequestConfig = {
                                                        headers: params.headers,
                                                    };
                                                    apiResult = await this.executeApiCall(methodName, apiUrl, requestConfig)
                                                    if (apiResult.statusCode == 201 || apiResult.statusCode == 200) {
                                                        apiResult = apiResult?.result;
                                                    } else {
                                                        throw apiResult;
                                                    }
                                                    let assigndata = await this.assign(apiResult, ifoObj, codeObj, inputparam, nodeName, mapObj)
                                                    apichildResult = assigndata.apichildResult
                                                    inputparam = assigndata.inputparam
                                                } else {
                                                    throw new CustomException('API Endpoint does not exist', 404);
                                                }
                                            }
                                        }
                                    }
                                } else if (methodName == 'get') {
                                    if (apiUrl) {
                                        let params = await this.buildRequestComponents(apiUrl, tempQryVal, mapObj);
                                        apiUrl = params?.apiUrl;
                                        params.headers['Authorization'] = `Bearer ${token}`;
                                        const requestConfig: AxiosRequestConfig = {
                                            headers: params.headers,
                                        };
                                        apiResult = await this.executeApiCall(methodName, apiUrl, requestConfig)
                                        if (apiResult.statusCode == 201 || apiResult.statusCode == 200) {
                                            apiResult = apiResult?.result;
                                        } else {
                                            throw apiResult;
                                        }

                                        let assigndata = await this.assign(apiResult, ifoObj, codeObj, inputparam, nodeName, mapObj)
                                        apichildResult = assigndata.apichildResult
                                        inputparam = assigndata.inputparam
                                    } else {
                                        throw new CustomException('API Endpoint does not exist', 404);
                                    }
                                } else if (textobj && methodName == 'post') {
                                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(textobj), collectionName, 'request',);
                                    if (apiUrl) {
                                        let headarr = {}
                                        let params = await this.buildRequestComponents(apiUrl, tempQryVal, mapObj);
                                        apiUrl = params?.apiUrl;
                                        if (contentType == 'text/plain') {
                                            headarr['Content-Type'] = 'text/plain';
                                            const requestConfig: AxiosRequestConfig = {
                                                headers: headarr,
                                            };

                                            let textdata = textobj.replace(/\\n/g, '\n');
                                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(textdata), collectionName, 'request');
                                            apiResult = await this.executeApiCall(methodName, apiUrl, requestConfig, textdata)

                                        } else if (contentType == 'application/xml') {
                                            headarr['Content-Type'] = 'application/xml';
                                            const requestConfig: AxiosRequestConfig = {
                                                headers: headarr,
                                            };
                                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(textobj), collectionName, 'request');
                                            apiResult = await this.executeApiCall(methodName, apiUrl, requestConfig, textobj)

                                        } else {
                                            throw new CustomException(`Mapping was required in ${poNode[j].nodeName}`, 400);
                                        }
                                        if (apiResult) {
                                            if (apiResult.statusCode == 201 || apiResult.statusCode == 200) {
                                                apiResult = apiResult?.result;
                                            } else {
                                                throw apiResult;
                                            }
                                            let assigndata = await this.assign(apiResult, ifoObj, codeObj, inputparam, nodeName, mapObj)
                                            apichildResult.push(assigndata.apichildResult)
                                            inputparam = await this.assignToInputParam(inputparam, nodeName, apichildResult)
                                        }
                                    } else {
                                        throw new CustomException('API Endpoint does not exist', 404);
                                    }
                                }
                                await this.redisService.setStreamData(srcQueue, 'TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: inputparam, response: apichildResult } }));
                                await this.redisService.setStreamData(targetQueue, 'TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: inputparam, response: apichildResult } }),);
                                if (EncapiResult?.result) {
                                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(EncapiResult?.result), collectionName, 'response',);
                                    await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, EncryptedRqst, EncapiResult?.result,);
                                } else {
                                    if (apichildResult) {
                                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(apichildResult), collectionName, 'response',);
                                        await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, inputparam, apichildResult);
                                        apires = apichildResult;
                                    } else {
                                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(apiResult), collectionName, 'response',);
                                        await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, inputparam, apiResult,);
                                        apires = apiResult;
                                    }
                                }
                            }
                        }
                        this.logger.log('Api node completed');
                        if (currentFabric == 'PF-PFD' || currentFabric == 'PF-SFD' || currentFabric == 'PF-SCDL')
                            return { status: 200, targetStatus: targetStatus, data: inputparam, };
                        else
                            return { status: 200, targetStatus: targetStatus, data: apires };
                    }
                } catch (error) {
                    // console.log('API ERROR', error);
                    await this.CommonService.checkRollBack(ndp, collectionName, 'rollback', {
                        key: processedKey + upId,
                        nodeid: rollbackConfig.nodeId,
                        nodename: rollbackConfig.nodeName,
                        savepoint: rollbackConfig.savePoint,
                        data: apichildResult
                    }
                    );
                    await this.exceptionhandler(failureQueue, suspiciousQueue, errorQueue, error, upId, nodeId, failureTargetStatus, inputparam)
                }
            }

            //AutomationNode
            if (nodeType == 'automationnode' && poNode[j].nodeId == nodeId) {
                try {
                    this.logger.log('Automation Node Started');
                    RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam, processedKey + upId, currentFabric, SessionInfo);
                    if (RCMresult) {
                        zenresult = RCMresult.rule;
                        customcoderesult = RCMresult.code;
                    }
                    if (customcoderesult && customcoderesult != undefined && customcoderesult != null) {
                        codeObj = await this.codeAssign(customcoderesult)
                        if (codeObj) {
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);
                            if (inputparam)
                                inputparam = await this.codeORifoAndInputparamAssign(codeObj, inputparam)
                        }
                    }

                    let customConfig = ndp[poNode[j].nodeId]
                    let streamName = customConfig.data.streamName;
                    let res = await this.redisService.setStreamData(streamName, upId, JSON.stringify(inputparam))
                    await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: streamName, response: inputparam } }));
                    await this.redisService.setStreamData(targetQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: streamName, response: inputparam } }));
                                       
                    if (inputparam) {
                        res = Object.assign(inputparam, res);
                    }
                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(res), collectionName, 'response');
                    if (res)
                        await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, inputparam, res);
                    this.logger.log('Automation node completed');
                    return { status: 200, targetStatus: targetStatus };
                } catch (error) {
                    await this.exceptionhandler(failureQueue, suspiciousQueue, errorQueue, error, upId, nodeId, failureTargetStatus, inputparam)
                }
            }

           //DB Node
            if (nodeType == 'dbnode' && poNode[j].nodeId == nodeId) {
                let rollbackConfig, dbres: any
                try {
                    this.logger.log('DB node Started');
                    let qryres: any;
                    let customConfig = ndp[poNode[j].nodeId]
                    rollbackConfig = ndp[poNode[j].nodeId]
                    let client, Querystr, oprname, filterParams, sessionParams, manualQuery,rule
                    let dbconfig = await this.CommonService.dbconfig(customConfig, collectionName)
                    oprname = dbconfig?.oprname
                    client = dbconfig.client
                    filterParams = dbconfig?.filterParams
                    sessionParams = dbconfig?.sessionParams
                    manualQuery = dbconfig?.manualQuery
                    //rule = dbconfig?.rule
                    let qry,headerRole;
                    let str = [];
                    // if(rule?.approvalProcess){
                        // let rulekey = rule?.ruleKey                           
                       // if (!rulekey) throw new CustomException(pfjson[i].nodeName+' rulekey key not found', 404);
                       // let ruleConfig: any = JSON.parse(await this.redisService.getJsonData(rulekey, collectionName));                  
                       // if (!ruleConfig || Object.keys(ruleConfig).length == 0)
                           // throw new CustomException(pfjson[i].nodeName +' rulekey key value not found', 404);
                        //let rulejson: any = Object.values(ruleConfig)[0]; 
                        //let rulecheck:any = await this.CommonService.getRuleCodeMapper(rulejson, inputparam, processedKey + upId, currentFabric, SessionInfo);
                        //headerRole = rulecheck?.rule
                        //str.push({'xCdcaRole':headerRole,'xCdcaUsername':SessionToken?.loginId})
                     //}
                    if (sessionParams?.length > 0) {
                        for (let i = 0; i < sessionParams.length; i++) {
                            var filcol = sessionParams[i].name;
                            var filval = sessionParams[i].value;
                            if (filval) {
                                if ((Object.keys(sobj)).includes(filval)) {
                                    let strobj = ` ${filcol} = '${sobj[filval]}' `
                                    str.push(strobj);
                                }
                            }
                        }
                    }

                    if (filterParams?.length > 0) {
                        for (let i = 0; i < filterParams.length; i++) {
                            var filcol = filterParams[i].key;
                            var filval = filterParams[i].value.value;
                            if (filval && filval.includes('session.') && filcol)
                                str.push(` ${filcol} = '${sobj[filval]}' `);
                            else if (filcol && filval)
                                str.push(` ${filcol} = '${filval}' `);

                        }
                    }
                    let childInsertArr, mapObj = {}, tempQryVal = []
                    if (internalEdges && internalEdges.hasOwnProperty(poNode[j].nodeId)) {
                        let currentNodeEdge = internalEdges[poNode[j].nodeId];
                        if (currentFabric == 'DF-DFD') {
                            let DfmappedData = await this.DFDMapEdgeValues(poNode, currentNodeEdge, inputparam, processedKey, upId, collectionName,  '', '', pfo, currentFabric)
                            mapObj = DfmappedData.mapObj
                            tempQryVal = DfmappedData.tempQryVal
                        } else {
                            let mappedData = await this.mapEdgeValuesToParams(poNode, currentNodeEdge, inputparam, processedKey, upId, collectionName,  '', '', pfo)
                            childInsertArr = mappedData.childInsertArr
                            tempQryVal = mappedData.tempQryVal
                        }

                        if (childInsertArr?.length > 0) {
                            for (let i = 0; i < childInsertArr.length; i++) {
                                mapObj = childInsertArr[i]
                                if (mapObj && Object.keys(mapObj).length > 0) {
                                    let mapcol = Object.keys(mapObj)
                                    let mapval = Object.values(mapObj)
                                    for (let i = 0; i < mapcol.length; i++) {
                                        str.push(` ${mapcol[i]} = '${mapval[i]}' `);
                                    }
                                }
                            }
                        } else {
                            if (mapObj && Object.keys(mapObj).length > 0) {
                                let mapcol = Object.keys(mapObj)
                                let mapval = Object.values(mapObj)
                                for (let i = 0; i < mapcol.length; i++) {
                                    str.push(` ${mapcol[i]} = '${mapval[i]}' `);
                                }
                            }
                        }
                    }

                    if (manualQuery) {
                        qry = manualQuery;
                        if (qry.toLowerCase().includes('insert into')) {
                            oprname = 'insert'
                            if (mapObj && Object.keys(mapObj).length > 0) {
                                Object.keys(mapObj).forEach(key => {
                                    const regex = new RegExp(`\\$\\$${key}`, 'g');
                                    const value = typeof mapObj[key] === 'string' ? `'${mapObj[key]}'` : mapObj[key];
                                    qry = qry.replace(regex, value);
                                });
                            }
                        } else {
                            oprname = 'select'
                            if (qry.endsWith(';')) {
                                qry = qry.slice(0, -1);
                            }
                            if (page && count) {
                                const cleanedQuery = qry.trim();
                                if (/limit\s+\d+/i.test(cleanedQuery)) {
                                    throw new Error('LIMIT clause detected. Please do not include it.');
                                }
                                qry = `${cleanedQuery} LIMIT ${count} OFFSET ${offset}`;
                            }

                            let formKey: any = ``;
                            let removedVal
                            if (filterData && filterData.length) {
                                for (let f = 0; f < filterData.length; f++) {
                                    if (filterData[f].nodeId && filterData[f].nodeId == poNode[j].nodeId) {
                                        const { nodeId, ...filterParamsObj } = filterData[f];
                                        const filterParamsObjKey = Object.keys(filterParamsObj);
                                        const filterParamsObjvalues =
                                            Object.values(filterParamsObj);
                                        for (let p = 0; p < filterParamsObjKey.length; p++) {
                                            const key = filterParamsObjKey[p];
                                            if (key.includes('.')) {
                                                let s_item = key.split('.');
                                                removedVal = s_item.filter((item) => !this.statickeyword.includes(item)).join('.');
                                                if (removedVal.includes('.') && removedVal.startsWith('items.')) {
                                                    removedVal = removedVal.replace('items.', '');
                                                }
                                            } else {
                                                removedVal = key
                                            }
                                            const value = filterParamsObjvalues[p];
                                            if (typeof value == 'number') {
                                                formKey = formKey + ` ${removedVal} = ${value} AND`;
                                            } else if (typeof value == 'string') {
                                                formKey = formKey + ` ${removedVal} = '${value}' AND`;
                                            } else if (Array.isArray(value) && value.length > 0) {
                                                let s = ''
                                                for (let item of value) {
                                                    s = s + `'${item}',`
                                                }
                                                if (s.endsWith(',')) {
                                                    s = s.slice(0, -1);
                                                }
                                                formKey = formKey + ` ${removedVal}  IN (${s}) AND`;
                                            }
                                        }
                                    }

                                }
                                if (formKey.endsWith(' AND')) {
                                    formKey = formKey.slice(0, -4);
                                }
                            }

                            if (formKey) str.push(formKey)
                            if (str.length > 0) {
                                Querystr = str.join('AND');
                                qry = await this.CommonService.appendWhereClause(qry, Querystr);
                            }
                        }
                    }
                    // console.log("qry",qry);

                    await client.connect();
                    if (qry) qryres = await client.query(qry);
                    if (qryres) dbres = qryres.rows;
                    await client.end();
                    if (flag != 'N' && dbres?.length == 0) {
                        await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: qry, response: dbres } }));
                        await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, qry, dfoSchema);
                        return { status: 200, targetStatus: targetStatus, data: dbres };
                    } else if (oprname == 'select' && dbres?.length == 0) {
                        throw new CustomException('No Records Found', 404);
                    }

                    if (!logicCenter && currentFabric == 'DF-DFD') {
                        let keys = await this.redisService.getKeys(dstkey + SessionToken.loginId + '_DS_Object', collectionName)
                        if (keys.length > 0) {
                            for (let a = 0; a < keys.length; a++) {
                                await this.redisService.deleteKey(keys[a], collectionName)
                            }
                        }
                        this.redisService.sethash(dbres, dstkey + SessionToken.loginId + '_DS_Object')
                        return { data: 'logicCenter' }
                    }

                    if (inputparam) {
                        inputparam = await this.assignToInputParam(inputparam, nodeName, dbres)
                        RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam, processedKey + upId, currentFabric, SessionInfo);
                    } else {
                        RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], dbres, processedKey + upId, currentFabric, SessionInfo);
                    }

                    if (RCMresult) {
                        zenresult = RCMresult.rule;
                        customcoderesult = RCMresult.code;
                    }
                    ifoObj = await this.ifoAssign(poJson?.internalMappingNodes, poNode[j].nodeId)
                    if (ifoObj && Object.keys(ifoObj).length > 0) {
                        if (currentFabric == 'PF-PFD')
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(ifoObj), collectionName, 'ifo',);
                        dbres = await this.codeORifoAndInputparamAssign(ifoObj, dbres)
                    }

                    if (customcoderesult && customcoderesult != undefined && customcoderesult != null) {
                        codeObj = await this.codeAssign(customcoderesult)
                        if (codeObj) {
                            if (currentFabric == 'PF-PFD')
                                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);
                            if (dbres)
                                dbres = await this.codeORifoAndInputparamAssign(codeObj, dbres)
                        }
                    }

                    if (upId && currentFabric == 'PF-PFD') {
                        await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: qry, response: dbres } }));
                        await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, qry, dbres);
                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(qry), collectionName, 'request');
                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(dbres), collectionName, 'response');
                    }

                    this.logger.log('DB Node execution completed');
                    return { status: 200, targetStatus: targetStatus, data: dbres };
                   } catch (error) {
                    console.log(error);
                    await this.CommonService.checkRollBack(ndp, collectionName, 'rollback', {
                        key: processedKey + upId,
                        nodeid: rollbackConfig.nodeId,
                        nodename: rollbackConfig.nodeName,
                        savepoint: rollbackConfig.savePoint,
                        data: dbres
                    }
                    );
                    await this.exceptionhandler(failureQueue, suspiciousQueue, errorQueue, error, upId, nodeId, failureTargetStatus, inputparam)
                }
            }

            //mongo db node
            if (nodeType == 'mongo-dbnode' && poNode[j].nodeId == nodeId) {
                let rollbackConfig, mongoDbarr
                try {
                    this.logger.log(`${poNode[j].nodeName},Mongo DB Node started`);
                    let customConfig = ndp[poNode[j].nodeId]
                    rollbackConfig = ndp[poNode[j].nodeId]
                    let collnName, manualQryType, manualQry, sessionfilterParams, mongoQry, mongodbUrl, filterParams;
                    let mongodbconfig = await this.CommonService.mongodbconfig(customConfig, collectionName)
                    mongodbUrl = mongodbconfig.mongodbUrl
                    manualQry = mongodbconfig.manualQry
                    manualQryType = mongodbconfig.manualQryType
                    sessionfilterParams = mongodbconfig.sessionfilterParams
                    filterParams = mongodbconfig.filterParams
                    collnName = mongodbconfig.collnName
                    const client = new MongoClient(mongodbUrl);
                    client.connect()
                        .then(() => {
                            console.log('Connected to the database successfully!');
                        })
                        .catch((err) => {
                            console.error('Error connecting to the database:', err);
                        });

                    let db = client.db();
                    let staticFilter = {};
                    if (filterParams) {
                        for (let item of filterParams) {
                            if (item.key && item?.value?.value && (item.value.value).includes('session.')) {
                                staticFilter[item.key] = sobj[item.value.value]
                            } else if (item.key && item?.value?.value) {
                                staticFilter[item.key] = item?.value?.value
                            }
                        }
                    }
                    this.logger.log('CollectionName', collnName);
                    if (manualQry) {
                        if (!collnName || !manualQryType)
                            throw 'Collection Name/Manual Query Type not found';

                        let childInsertArr = [], mapObj = {}, tempQryVal = []
                        if (internalEdges && internalEdges.hasOwnProperty(poNode[j].nodeId)) {
                            let currentNodeEdge = internalEdges[poNode[j].nodeId];
                            if (currentFabric == 'DF-DFD') {
                                let DfmappedData = await this.DFDMapEdgeValues(poNode, currentNodeEdge, inputparam, processedKey, upId, collectionName,  '', '', pfo, currentFabric)
                                mapObj = DfmappedData.mapObj
                                tempQryVal = DfmappedData.tempQryVal
                                childInsertArr.push(mapObj)
                            } else {
                                let mappedData = await this.mapEdgeValuesToParams(poNode, currentNodeEdge, inputparam, processedKey, upId, collectionName,  '', '', pfo)
                                childInsertArr = mappedData.childInsertArr
                                tempQryVal = mappedData.tempQryVal
                            }

                        } else if (currentFabric != 'DF-DFD' && manualQryType == 'insertOne' || manualQryType == 'insertMany') {
                            throw new CustomException('Mapping was required', 404);
                        }
                        if (!filterData || filterData.length == 0) {
                            filterData = []
                            staticFilter['nodeId'] = nodeId
                            filterData.push(staticFilter)
                            if (childInsertArr.length > 0) {
                                for (let i = 0; i < childInsertArr.length; i++) {
                                    childInsertArr[i]['nodeId'] = nodeId
                                    filterData.push(childInsertArr)
                                }
                            }
                        }
                        if (filterData && Array.isArray(filterData) && filterData.length > 0) {
                            for (let i = 0; i < filterData.length; i++) {
                                if (filterData[i].nodeId && (filterData[i].nodeId).includes(nodeId)) {
                                    filterData[i] = Object.assign(filterData[i], staticFilter);
                                    if (childInsertArr.length > 0) {
                                        for (let c = 0; c < childInsertArr.length; c++) {
                                            filterData[i] = Object.assign(filterData[i], childInsertArr[c]);
                                        }
                                    }
                                }
                            }
                            filterData.forEach((filterObj) => {
                                const entries = Object.entries(filterObj).filter(([key]) => key !== 'nodeId',);
                                entries.forEach(([key, value]) => {
                                    let removedVal;
                                    if (key.includes('.')) {
                                        let s_item = key.split('.');
                                        removedVal = s_item.filter((item) => !this.statickeyword.includes(item)).join('.');
                                        if (removedVal.includes('.') && removedVal.startsWith('items.')) {
                                            removedVal = removedVal.replace('items.', '');
                                        }
                                    } else {
                                        removedVal = key
                                    }
                                    const regex = new RegExp(`"\\$\\$\\$${removedVal}"`, 'g');
                                    manualQry = manualQry.replace(regex, `"${value}"`);
                                });
                            });
                        }

                        let sessionFilter = {}
                        if (sessionfilterParams) {
                            for (let item of sessionfilterParams) {
                                if (item.value) {
                                    sessionFilter[item.name] = sobj[item.value]
                                }
                            }
                        }
                        const FormatFn = new Function(`return ${manualQry}`);
                        let result = FormatFn();
                        manualQry = Array.isArray(result) ? result : [result];
                        if (manualQryType == 'aggregate') {
                            if (!Array.isArray(manualQry))
                                throw new CustomException('Invalid aggregation format', 400);

                            if (Object.keys(sessionFilter).length > 0)
                                manualQry.push({ $match: sessionFilter })

                            if (page && count) {
                                mongoDbarr = await db.collection(collnName).aggregate(manualQry).skip(offset).limit(count).toArray();
                            } else {
                                mongoDbarr = await db.collection(collnName).aggregate(manualQry).toArray();
                            }
                        } else if (manualQryType == 'insertOne' || manualQryType == 'insertMany') {
                            if (childInsertArr.length > 0) {
                                if (manualQryType == 'insertMany') {
                                    manualQry = childInsertArr
                                    if (Object.keys(sessionFilter).length > 0)
                                        manualQry.push(sessionFilter)
                                } else {
                                    manualQry = childInsertArr[0]
                                    if (Object.keys(sessionFilter).length > 0)
                                        manualQry = Object.assign(manualQry, sessionFilter)
                                }
                                var execResponse = await db.collection(collnName)[manualQryType](manualQry);

                                if (execResponse) {
                                    if (page && count) {
                                        mongoDbarr = typeof execResponse.toArray === 'function' ? await execResponse.skip(offset).limit(count).toArray() : execResponse;
                                    } else {
                                        mongoDbarr = typeof execResponse.toArray === 'function' ? await execResponse.toArray() : execResponse;
                                    }
                                }
                            }
                        } else {
                            if (Object.keys(sessionFilter).length > 0)
                                manualQry = Object.assign(manualQry, sessionFilter)
                            var execResponse = await db.collection(collnName)[manualQryType](manualQry);

                            if (execResponse) {
                                if (page && count) {
                                    mongoDbarr = typeof execResponse.toArray === 'function' ? await execResponse.skip(offset).limit(count).toArray() : execResponse;
                                } else {
                                    mongoDbarr = typeof execResponse.toArray === 'function' ? await execResponse.toArray() : execResponse;
                                }
                            }
                        }
                        this.logger.log('QueryResponse', mongoDbarr);
                        if (flag != 'N' && (mongoDbarr?.length == 0 || Object.keys(mongoDbarr).length == 0)) {
                            await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: manualQry, response: mongoDbarr } }),);
                            await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, mongoQry, mongoDbarr,);
                            return { status: 200, targetStatus: targetStatus, data: mongoDbarr };
                        } else if (!mongoDbarr || mongoDbarr?.length == 0 || Object.keys(mongoDbarr).length == 0) {
                            await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: manualQry, response: mongoDbarr } }),
                            );
                            throw new CustomException('No Records Found', 404);
                        }
                    }
                    if (!logicCenter && currentFabric == 'DF-DFD') {
                        let keys = await this.redisService.getKeys(dstkey + SessionToken.loginId + '_DS_Object', collectionName)
                        if (keys.length > 0) {
                            for (let a = 0; a < keys.length; a++) {
                                await this.redisService.deleteKey(keys[a], collectionName)
                            }
                        }
                        this.redisService.sethash(mongoDbarr, dstkey + SessionToken.loginId + '_DS_Object')
                        return { data: 'logicCenter' }
                    }
                    if (inputparam) {
                        inputparam = await this.assignToInputParam(inputparam, nodeName, mongoDbarr)
                        RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam, processedKey + upId, currentFabric, SessionInfo);
                    } else {
                        RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], mongoDbarr, processedKey + upId, currentFabric, SessionInfo);
                    }
                    if (RCMresult) {
                        zenresult = RCMresult.rule;
                        customcoderesult = RCMresult.code;
                    }
                    ifoObj = await this.ifoAssign(poJson?.internalMappingNodes, poNode[j].nodeId)
                    if (ifoObj && Object.keys(ifoObj).length > 0) {
                        if (currentFabric == 'PF-PFD')
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(ifoObj), collectionName, 'ifo',);
                        ifoObj = await this.codeORifoAndInputparamAssign(ifoObj, mongoDbarr)
                    }

                    if (customcoderesult && customcoderesult != undefined && customcoderesult != null) {
                        codeObj = await this.codeAssign(customcoderesult)
                        if (codeObj) {
                            if (currentFabric == 'PF-PFD')
                                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);
                            if (mongoDbarr)
                                mongoDbarr = await this.codeORifoAndInputparamAssign(codeObj, mongoDbarr)
                        }
                    }

                    if (upId) {
                        await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: manualQry, response: mongoDbarr } }));
                        await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, manualQry, mongoDbarr,);
                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(manualQry), collectionName, 'request');
                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(mongoDbarr), collectionName, 'response',);
                    }
                    this.logger.log('Mongo DB Node execution completed');
                    return { status: 200, targetStatus: targetStatus, data: mongoDbarr };
                } catch (error) {
                    await this.CommonService.checkRollBack(ndp, collectionName, 'rollback', {
                        key: processedKey + upId,
                        nodeid: rollbackConfig.nodeId,
                        nodename: rollbackConfig.nodeName,
                        savepoint: rollbackConfig.savePoint,
                        data: mongoDbarr
                    }
                    );
                    await this.exceptionhandler(failureQueue, suspiciousQueue, errorQueue, error, upId, nodeId, failureTargetStatus, inputparam)
                }
            }

            //Stream Node
            if (nodeType == 'streamnode' && poNode[j].nodeId == nodeId) {
                let rollbackConfig, streamArr: any = [];
                try {
                    if (currentFabric == 'PF-SCDL' && poNode[j].nodeId == poNode[1].nodeId) {
                        let firstnode = await this.listenerService.firstProcessor(pfdto, event, pfjson, poJson, pfo, ndp, currentFabric, flag, page, count, filterData, lockDetails, childtable, logicCenter, true)
                        return { status: firstnode.status, targetStatus: firstnode.targetStatus, data: firstnode.data, }
                    } else {
                        this.logger.log(nodeName + 'Stream node Started');
                        let oprname, streamName, fromStreamid, toStreamid, apikey, responseNodeName, fieldName, isStatic, consumerName, consumerGroupName, useAsConsumer, entryId, rollback, sessionfilterParams, startOfToday, endOfToday, storageType, ConsumerBasedOnJob;
                        rollbackConfig = ndp[poNode[j].nodeId]
                        let customConfig = ndp[poNode[j].nodeId]
                        let sconf = await this.CommonService.streamConfig(customConfig, collectionName)
                        isStatic = sconf?.isStatic
                        oprname = sconf?.oprname
                        responseNodeName = sconf?.responseNodeName
                        rollback = sconf?.rollback
                        sessionfilterParams = sconf?.filterParams
                        storageType = sconf?.storageType
                        ConsumerBasedOnJob = sconf?.ConsumerBasedOnJob
                        if (oprname == 'read')
                            useAsConsumer = sconf?.useAsConsumer
                        apikey = sconf?.apikey
                        if (isStatic && oprname == 'read') {
                            streamName = sconf?.streamName
                            consumerGroupName = sconf?.consumerGroupName
                            consumerName = sconf?.consumerName
                            fromStreamid = sconf?.fromStreamid
                            toStreamid = sconf?.toStreamid
                        } else if (isStatic && oprname == 'write') {
                            streamName = sconf?.streamName
                            fieldName = sconf?.fieldName
                        }

                        let redis = sconf?.redisconfig
                        let childInsertArr, textobj, tempQryVal = []
                        if (internalEdges && internalEdges.hasOwnProperty(poNode[j].nodeId)) {
                            let currentNodeEdge = internalEdges[poNode[j].nodeId];
                            let mappedData = await this.mapEdgeValuesToParams(poNode, currentNodeEdge, inputparam, processedKey, upId, collectionName, '', '', pfo)
                            childInsertArr = mappedData.childInsertArr
                            tempQryVal = mappedData.tempQryVal
                            textobj = mappedData.textobj
                        }
                        // if (!isStatic && (!childInsertArr || !textobj)) throw new CustomException('Stream Config Mapping was Required', 404);
                        if (!childInsertArr && !textobj) {
                            if (inputparam && (Object.keys(inputparam).length > 0 || inputparam.length > 0)) {
                                childInsertArr = inputparam
                            }
                            else if (!isStatic) {
                                throw new CustomException('Stream Config Mapping was Required', 404);
                            }
                        }
                        if (!isStatic) {
                            let streaminfo = childInsertArr[0].streaminfo
                            if (!streaminfo || Object.keys(streaminfo).length == 0) throw new CustomException('Stream Config Mapping was Required', 404);
                            streamName = streaminfo.streamName
                            fieldName = streaminfo.fieldName
                            fromStreamid = streaminfo.fromStreamid
                            toStreamid = streaminfo.toStreamid
                            startOfToday = new Date(fromStreamid).getTime();
                            endOfToday = new Date(toStreamid).getTime();
                        }
                        if (pfjson?.length > 0 && responseNodeName?.length > 0 && !apikey) {
                            for (let p = 0; p < pfjson.length; p++) {
                                if (responseNodeName.includes(pfjson[p].nodeId)) {
                                    var connectedNodeName = pfjson[p].nodeName;
                                }
                            }
                        }
                        if (connectedNodeName) {
                            let inputData = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + upId + ':NPV:' + connectedNodeName + '.PRO', '.response', collectionName));
                            childInsertArr.push(inputData)
                        }
                        if (!isStatic && childInsertArr?.length > 0 && childInsertArr[0]?.streaminfo)
                            delete childInsertArr[0].streaminfo
                        if (storageType?.toLowerCase() == 'externel') {
                            if (oprname == 'read') {
                                if (!streamName) {
                                    throw new CustomException('Stream RequestParams were empty', 404);
                                }

                                // startOfToday = new Date(fromStreamid).getTime();
                                // endOfToday = new Date(toStreamid).getTime();

                                if (startOfToday && endOfToday) {
                                    streamArr = await redis.xrevrange(streamName, endOfToday, startOfToday, 'COUNT', count);
                                } else if (useAsConsumer) {
                                    if (await redis.call('EXISTS', streamName)) {
                                        var grpInfo: any = await redis.xinfo('GROUPS', streamName);
                                        if (grpInfo.length == 0) {
                                            await redis.xgroup('CREATE', streamName, consumerGroupName, '0', 'MKSTREAM');

                                        } else if (!grpInfo[0].includes(consumerGroupName)) {
                                            await redis.xgroup('CREATE', streamName, consumerGroupName, '0', 'MKSTREAM');
                                        }
                                        var result: any = await redis.xreadgroup('GROUP', consumerGroupName, consumerName, 'STREAMS', streamName, '>');

                                        let streamData: any = []
                                        if (result) {
                                            result.forEach(([key, message]) => {
                                                message.forEach(([messageId, data]) => {
                                                    var obj = {};
                                                    obj['msgid'] = messageId;
                                                    obj['data'] = data;
                                                    streamData.push(obj);
                                                });
                                            });
                                        }

                                        if (streamData != 'No Data available to read') {
                                            for (var s = 0; s < streamData.length; s++) {
                                                var msgid = streamData[s].msgid;
                                                let dataObj = streamData[s].data[1]
                                                streamArr.push(JSON.parse(dataObj))
                                                await redis.xack(streamName, consumerGroupName, msgid);
                                            }

                                        } else {
                                            throw streamData + '_' + poNode[j].nodeName
                                        }
                                    }
                                } else if (!useAsConsumer && childInsertArr?.length > 0) {
                                    let entryArr = []
                                    for (let a = 0; a < childInsertArr.length; a++) {
                                        if (childInsertArr[a].hasOwnProperty('entryId')) {
                                            entryId = childInsertArr[a]?.entryId
                                            let entryData: any = await redis.xrange(streamName, entryId, entryId);
                                            entryData = entryData.flat()
                                            let res = entryData[1]
                                            entryArr.push(JSON.parse(res[1]))
                                        }
                                    }
                                    streamArr = entryArr
                                }

                                if (streamArr?.length == 0)
                                    throw new CustomException('No Data available to read from Processor', 404)

                            } else if (oprname == 'write') {
                                if (!fieldName)
                                    fieldName = streamName
                                let idarr = []
                                if (childInsertArr?.length > 0 && streamName && !textobj) {
                                    for (let a = 0; a < childInsertArr.length; a++) {
                                        idarr.push(await redis.xadd(streamName, '*', fieldName, JSON.stringify(childInsertArr[a])));
                                    }
                                } else if (textobj && streamName) {
                                    idarr.push(await redis.xadd(streamName, '*', fieldName, JSON.stringify(textobj)));
                                }
                                streamArr = { entryId: idarr }
                            }
                            redis.disconnect();
                        } else {
                            if (oprname == 'read') {                               
                                if (!streamName) throw new CustomException('Stream RequestParams were empty', 404);
                                
                                if(poNode[j].nodeName == "Consume_Channel_Data")
                                    streamName = 'listnerTest'
                                 
                                if (ConsumerBasedOnJob) {
                                    let EntryIdFromHash = await this.redisService.hget(upId, streamName)
                                    this.redisService.deleteKey(upId, collectionName)
                                    // console.log('EntryIdFromHash',EntryIdFromHash, typeof EntryIdFromHash);                                        
                                    startOfToday = EntryIdFromHash
                                    endOfToday = EntryIdFromHash
                                }

                                if (startOfToday && endOfToday) {
                                    // streamArr = await this.redisService.getStreamRevRange(streamName, endOfToday, startOfToday, count);
                                    streamArr = await this.redisService.getStreamRange(streamName, endOfToday, startOfToday);
                                } else if (useAsConsumer) {

                                    if (await this.redisService.exist(streamName, collectionName)) {
                                        var grpInfo: any = await this.redisService.getInfoGrp(streamName);
                                        if (grpInfo.length == 0) {
                                            await this.redisService.createConsumerGroup(streamName, consumerGroupName);

                                        } else if (!grpInfo[0].includes(consumerGroupName)) {
                                            await this.redisService.createConsumerGroup(streamName, consumerGroupName);
                                        }
                                        let result: any = await this.redisService.readConsumerGroup(streamName, consumerGroupName, consumerName);
                                        // let streamData: any = []                     
                                        // if (result) {
                                        //   result.forEach(([key, message]) => {
                                        //     message.forEach(([messageId, data]) => {
                                        //       var obj = {};
                                        //       obj['msgid'] = messageId;
                                        //       obj['data'] = data;
                                        //       streamData.push(obj);
                                        //     });
                                        //   });
                                        // }
                                        // console.log("streamData",streamData);

                                        //let streamData: any = await this.redisService.readConsumerGroup(streamName, 'TaskGroup', event);
                                        // console.log('streamName', streamName);
                                        if (result != 'No Data available to read') {
                                            for (let s = 0; s < result.length; s++) {
                                                let msgid = result[s].msgid;
                                                let dataObj = result[s].data[1]
                                                streamArr.push(JSON.parse(dataObj))
                                                if (streamArr?.length > 0)
                                                    await this.redisService.ackMessage(streamName, consumerGroupName, msgid)
                                            }
                                        } else {
                                            throw result + '_' + poNode[j].nodeName
                                        }
                                    }
                                } else if (!useAsConsumer && childInsertArr?.length > 0) {
                                    let entryArr = []
                                    for (let a = 0; a < childInsertArr.length; a++) {
                                        if (childInsertArr[a].hasOwnProperty('entryId')) {
                                            entryId = childInsertArr[a]?.entryId
                                            let entryData: any = await this.redisService.getStreamRange(streamName, entryId, entryId);
                                            entryData = entryData.flat()
                                            let res = entryData[1]
                                            entryArr.push(JSON.parse(res[1]))
                                        }
                                    }
                                    streamArr = entryArr
                                }

                                if (streamArr?.length == 0)
                                    throw new CustomException(`No Data available to read in ${streamName}, ${poNode[j].nodeName}`, 404)

                            } else if (oprname == 'write') {    
                                if(poNode[j].nodeName == "Generate_and_place_to_Stream")
                                    streamName = 'listnerTest'   
                                                        
                                if (!fieldName)
                                    fieldName = streamName
                                let idarr = []
                                if (childInsertArr?.length > 0 && streamName && !textobj) {
                                    // console.log("childInsertArr",childInsertArr);

                                    for (let a = 0; a < childInsertArr.length; a++) {
                                        // console.log('childInsertArr',childInsertArr);

                                        // idarr.push(await this.redisService.setStreamData(streamName, fieldName, JSON.stringify(childInsertArr[a])));
                                        if (ConsumerBasedOnJob) {
                                            let writeTimeStamp = await this.redisService.setStreamData(streamName, fieldName, JSON.stringify(childInsertArr[a]))
                                            await this.redisService.hset(parentUpId, streamName, writeTimeStamp);
                                            idarr.push(writeTimeStamp)
                                        } else {
                                            idarr.push(await this.redisService.setStreamData(streamName, fieldName, JSON.stringify(childInsertArr[a])));
                                        }
                                    }
                                } else if (textobj && streamName) {
                                    // idarr.push(await this.redisService.setStreamData(streamName, fieldName, JSON.stringify(textobj)));
                                    if (ConsumerBasedOnJob) {
                                        let writeTimeStamp = await this.redisService.setStreamData(streamName, fieldName, JSON.stringify(textobj))
                                        await this.redisService.hset(parentUpId, streamName, writeTimeStamp);
                                        idarr.push(writeTimeStamp)
                                    } else {
                                        idarr.push(await this.redisService.setStreamData(streamName, fieldName, JSON.stringify(textobj)));
                                    }
                                }
                                streamArr = { entryId: idarr }
                            }
                        }

                        let f_obj = {}
                        let farr = []
                        if (sessionfilterParams?.length > 0) {
                            for (let f = 0; f < sessionfilterParams.length; f++) {
                                if (sessionfilterParams[f].value.includes('session'))
                                    f_obj[sessionfilterParams[f].name] = sobj[sessionfilterParams[f].name]
                                farr.push(f_obj)
                            }
                            let currentFilterRes;
                            if (farr?.length > 0) {
                                for (let item1 of farr) {
                                    if (item1 && Object.keys(item1).length > 0) {
                                        if (Array.isArray(streamArr) && streamArr?.length > 0) {
                                            currentFilterRes = [];
                                            for (let a = 0; a < streamArr.length; a++) {
                                                let b = 0;
                                                for (let item in item1) {
                                                    const expectedValue = item1[item];
                                                    const result = this.findMatchingValuesFlexible(streamArr[a], item, expectedValue,);
                                                    if (result.length > 0) {
                                                        b++;
                                                    }
                                                    if (b == Object.keys(item1).length)
                                                        currentFilterRes.push(streamArr[a]);
                                                }
                                            }
                                        } else if (streamArr && Object.keys(streamArr).length > 0) {
                                            currentFilterRes = {};
                                            let b = 0;
                                            for (let item in item1) {
                                                const expectedValue = item1[item];
                                                const result = this.findMatchingValuesFlexible(streamArr, item, expectedValue,);
                                                if (result.length > 0) {
                                                    b++;
                                                }
                                                if (b == Object.keys(item1).length)
                                                    currentFilterRes = streamArr;
                                            }
                                        }
                                        if (currentFilterRes) {
                                            streamArr = currentFilterRes;
                                        }
                                    }
                                }
                            }
                        }

                        if (filterData && filterData.length > 0) {
                            let currentFilterData;
                            for (let f = 0; f < filterData.length; f++) {
                                if (filterData[f].nodeId == poNode[j].nodeId) {
                                    delete filterData[f].nodeId;
                                    currentFilterData = filterData[f];
                                }
                            }
                            let filterpath = {};
                            for (let item in currentFilterData) {
                                let s_item = item.split('.');
                                let removedVal = s_item.filter((item) => !this.statickeyword.includes(item)).join('.');
                                if (removedVal.startsWith('items.')) {
                                    removedVal = removedVal.replace('items.', '');
                                }
                                filterpath[removedVal] = currentFilterData[item];
                            }
                            let currentFilterRes;
                            if (filterpath && Object.keys(filterpath).length > 0) {
                                if (Array.isArray(streamArr) && streamArr?.length > 0) {
                                    currentFilterRes = [];
                                    for (let a = 0; a < streamArr.length; a++) {
                                        let b = 0;
                                        for (let item in filterpath) {
                                            const expectedValue = filterpath[item];
                                            const result = this.findMatchingValuesFlexible(streamArr[a], item, expectedValue,);
                                            if (result.length > 0) {
                                                b++;
                                            }
                                            if (b == Object.keys(filterpath).length)
                                                currentFilterRes.push(streamArr[a]);
                                        }
                                    }
                                } else if (streamArr && Object.keys(streamArr).length > 0) {
                                    currentFilterRes = {};
                                    let b = 0;
                                    for (let item in filterpath) {
                                        const expectedValue = filterpath[item];
                                        const result = this.findMatchingValuesFlexible(streamArr, item, expectedValue,);
                                        if (result.length > 0) {
                                            b++;
                                        }
                                        if (b == Object.keys(filterpath).length)
                                            currentFilterRes = streamArr;
                                    }
                                }
                                if (currentFilterRes) {
                                    streamArr = currentFilterRes;
                                }
                            }
                        }
                        if (!logicCenter && currentFabric == 'DF-DFD') {
                            let keys = await this.redisService.getKeys(dstkey + SessionToken.loginId + '_DS_Object', collectionName)
                            if (keys.length > 0) {
                                for (let a = 0; a < keys.length; a++) {
                                    await this.redisService.deleteKey(keys[a], collectionName)
                                }
                            }
                            this.redisService.sethash(streamArr, dstkey + SessionToken.loginId + '_DS_Object')
                            return { data: 'logicCenter' }
                        }
                        if (inputparam && Object.keys(inputparam).length > 0) {                                                       
                            RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam, processedKey + upId, currentFabric, SessionInfo);
                        } else {
                            RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], streamArr, processedKey + upId, currentFabric, SessionInfo);
                        }
                        if (RCMresult) {
                            zenresult = RCMresult.rule;
                            customcoderesult = RCMresult.code;
                        }
                        ifoObj = await this.ifoAssign(poJson?.internalMappingNodes, poNode[j].nodeId)
                        if (ifoObj && Object.keys(ifoObj).length > 0) {
                            if (currentFabric == 'PF-PFD')
                                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(ifoObj), collectionName, 'ifo',);
                            streamArr = await this.codeORifoAndInputparamAssign(ifoObj, streamArr)
                        }

                        if (customcoderesult && customcoderesult != undefined && customcoderesult != null) {
                            codeObj = await this.codeAssign(customcoderesult)
                            if (codeObj) {
                                if (currentFabric == 'PF-PFD')
                                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);
                                if (streamArr)
                                    streamArr = await this.codeORifoAndInputparamAssign(codeObj, streamArr)
                            }
                        }                     
                      
                        if(inputparam)
                            inputparam = await this.assignToInputParam(inputparam, nodeName, streamArr)

                        if (upId) {
                            await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: streamName, response: streamArr } }));
                            if (Array.isArray(streamArr) && streamArr.length > 0)
                                await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, streamName, streamArr);
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(streamName), collectionName, 'request');
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(streamArr), collectionName, 'response');
                        }
                        this.logger.log('Stream Node execution completed');
                        if(currentFabric == 'PF-SFD' || currentFabric == 'PF-PFD' || currentFabric == 'PF-SCDL')                           
                            return { status: 200, targetStatus: targetStatus, data:inputparam};
                        
                        else
                            return { status: 200, targetStatus: targetStatus, data:streamArr};
                    }
                } catch (error) {
                    await this.CommonService.checkRollBack(ndp, collectionName, 'rollback', {
                        key: processedKey + upId,
                        nodeid: rollbackConfig.nodeId,
                        nodename: rollbackConfig.nodeName,
                        savepoint: rollbackConfig.savePoint,
                        data: streamArr
                    }
                    );
                    await this.exceptionhandler(failureQueue, suspiciousQueue, errorQueue, error, upId, nodeId, failureTargetStatus, inputparam)
                }
            }

            //Kafka Node
            if (nodeType == 'kafka_stream_node' && poNode[j].nodeId == nodeId) {
                try {
                if(currentFabric == 'PF-SCDL' && poNode[j].nodeId == poNode[1].nodeId){
                let firstnode = await this.listenerService.firstProcessor(pfdto, event, pfjson ,poJson,pfo, ndp,currentFabric, flag, page, count, filterData, lockDetails,childtable,logicCenter,true)
                return {status: firstnode.status,targetStatus: firstnode.targetStatus,data: firstnode.data,}
                }
                else{
                this.logger.log('Kafka Stream first node Started');
                let kafkaResultArr: any = [];
                let oprname, topicName, connectorType, storageType, dpdkey, connectorName, isStatic, groupId,autoOffsetReset;
                let childInsertArr, textobj, tempQryVal = [];
                let customConfig = ndp[poNode[j].nodeId];
                let nodeVersion = customConfig?.nodeVersion;
                let clientId
                if (!nodeVersion)
                    throw new CustomException('nodeVersion not found', 404);

                // Extract Kafka configuration from the 'pro' section
                let kafkaConfig = customConfig?.data;
                if (!kafkaConfig)
                    throw new CustomException('Kafka configuration not found', 404);

                

                // Get operation and connector configuration
                if (nodeVersion.toLowerCase() == 'v1') {
                    connectorType = customConfig?.data?.connector?.value;
                    storageType = customConfig?.data?.connector?._selection?.value;
                    dpdkey = customConfig?.data?.connector?.value;
                    connectorName = customConfig?.data?.connector?.subSelection?.value;
                    oprname = customConfig?.data?.operation?.value;

                    // Try to get topic and operation from props if specified
                    if (oprname == 'producer') {
                    isStatic = customConfig?.data?.operation?.subSelection[oprname]?.isStatic?.value;
                    if (isStatic) {
                        topicName = customConfig?.data?.operation?.subSelection[oprname]?.isStatic?.subSelection?._true?.topic?.value;
                        //clientId = customConfig?.data?.operation?.subSelection[oprname]?.isStatic?.subSelection?._true?.clientId?.value 
                    }
                    } else if (oprname == 'consumer') {
                    isStatic = customConfig?.data?.operation?.subSelection[oprname]?.isStatic?.value;
                    if (isStatic) {
                        topicName = customConfig?.data?.operation?.subSelection[oprname]?.isStatic?.subSelection?._true?.topic?.value;
                    // clientId = customConfig?.data?.operation?.subSelection[oprname]?.isStatic?.subSelection?._true?.client_id?.value 
                        groupId = customConfig?.data?.operation?.subSelection[oprname]?.isStatic?.subSelection?._true?.group_id?.value;
                        groupId = groupId+'_'+upId
                        autoOffsetReset = customConfig?.data?.operation?.subSelection[oprname]?.isStatic?.subSelection?._true?.auto_offset_reset?.value;
                    }
                    }
                }


                if (!oprname)
                    throw new CustomException('Operation name not found', 404);

                // Handle internal mappings
                let internalMappingNodes = poJson?.internalMappingNodes;
                let internalMappedObj = {};
                for (let n = 0; n < internalMappingNodes?.length; n++) {
                    if (internalMappingNodes[n].nodeId == poNode[j].nodeId && internalMappingNodes[n].ifo?.length > 0) {
                    for (let f = 0; f < internalMappingNodes[n].ifo.length; f++) {
                        if (internalMappingNodes[n].ifo[f].value) {
                        internalMappedObj[internalMappingNodes[n].ifo[f].key] = internalMappingNodes[n].ifo[f].value;
                        } else {
                        internalMappedObj[internalMappingNodes[n].ifo[f].key] = '';
                        }
                    }
                    }
                }

                // Store IFO in Redis if available
                let ifoObj = {};
                if (internalMappedObj && Object.keys(internalMappedObj).length > 0) {
                    for (let item in internalMappedObj) {
                    ifoObj[item.toLowerCase()] = internalMappedObj[item];
                    }
                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(ifoObj), collectionName, 'ifo');
                }

                // Handle edge mappings for dynamic data
                if (internalEdges && internalEdges.hasOwnProperty(poNode[j].nodeId)) {
                    let currentNodeEdge = internalEdges[poNode[j].nodeId];
                    let mappedData = await this.mapEdgeValuesToParams(poNode, currentNodeEdge, inputparam, processedKey, upId, collectionName, '', '', pfo);
                    childInsertArr = mappedData.childInsertArr;
                    tempQryVal = mappedData.tempQryVal;
                    textobj = mappedData.textobj;
                }

                if (!childInsertArr && !textobj) {
                    if (inputparam && (Object.keys(inputparam).length > 0 || inputparam.length > 0)) {
                    childInsertArr = Array.isArray(inputparam) ? inputparam : [inputparam];
                    } else if (!isStatic && (oprname == 'producer')) {
                    throw new CustomException('Kafka message data mapping is required for produce operation', 404);
                    }
                }

                // Extract dynamic topic/group from mapped data if not static
                if (!isStatic && childInsertArr?.length > 0 && childInsertArr[0]?.kafkainfo) {
                    let kafkainfo = childInsertArr[0].kafkainfo;
                    topicName = kafkainfo.topicName || topicName;
                    groupId = kafkainfo.groupId || groupId;
                    delete childInsertArr[0].kafkainfo;
                }

                if (!topicName)
                    throw new CustomException('Kafka topic name not found', 404);

                // Get Kafka broker configuration
                let kafkaBrokers: string[] = [];
                // let kafkaClientId = clientId;

                if (storageType?.toLowerCase() == 'external') {
                    if (!dpdkey) throw new CustomException('DPD key not found', 404);
                    let extdata = JSON.parse(await this.redisService.getJsonData(dpdkey + 'NDP', collectionName));
                    let nodedata = Object.keys(extdata)[0];
                    let configConnectors = extdata[nodedata].data['externalConnectors-KAFKA']?.items;
                    if (configConnectors?.length > 0) {
                    for (let i = 0; i < configConnectors.length; i++) {
                        if (configConnectors[i].connectorName == connectorName) {
                        let brokerHost = configConnectors[i]?.credentials?.host;
                        let brokerPort = configConnectors[i]?.credentials?.port;
                        if (brokerHost && brokerPort) {
                            kafkaBrokers = [`${brokerHost}:${brokerPort}`];
                        }
                        }
                    }
                    }
                }else{
                    kafkaBrokers = (process.env.KAFKA_BROKER).split(',');
                }

                // Initialize Kafka client
                // const kafka = new Kafka({
                //     clientId:process.env.KAFKA_CLIENT_ID,
                //     brokers: kafkaBrokers,
                //     logLevel: logLevel.ERROR,
                // });

                // PRODUCE OPERATION
                if (oprname === 'producer') {
                    try {
                        const producer = await this.listenerService.getProducer();
                       
                        
                        // Prepare messages
                        let messagesToSend = [];
                        if (childInsertArr?.length > 0) {
                        messagesToSend = childInsertArr.map((item, index) => ({
                            value: JSON.stringify(item),
                            key: item.id || `${Date.now()}-${index}`,
                        }));
                        } else if (textobj) {
                        messagesToSend.push({
                            value: JSON.stringify(textobj),
                            key: textobj.id || Date.now().toString(),
                        });
                        }

                        // Send messages with batch support
                        const result = await producer.send({
                        topic: topicName,
                        messages: messagesToSend,
                        acks: -1,
                        timeout: 30000,
                        compression: CompressionTypes.GZIP,
                        });

                        kafkaResultArr = {
                        operation: 'produce',
                        topic: topicName,
                        messageCount: messagesToSend.length,
                        result: result,
                        };

                    } catch (producerError) {
                        throw new CustomException(
                        `Kafka produce error: ${producerError?.message || producerError}`,
                        500
                        );
                    }
                    }

                // CONSUME OPERATION
                else if (oprname == 'consumer') {
                    if (!groupId)
                    throw new CustomException('Consumer group ID not found', 404);
                    const consumer = await this.listenerService.getConsumer(groupId);
                    // const consumer: Consumer = kafka.consumer({
                    // groupId: groupId,
                    // sessionTimeout:  6000,
                    // heartbeatInterval:1500,
                    // maxWaitTimeInMs: 100,
                    // retry: { retries: 0},
                    // });

                    try {
                    await consumer.connect();                
                    let offsetReset = typeof autoOffsetReset === 'string' ? autoOffsetReset?.toLowerCase() : 0;
                    let fromBeginning = true;
                    if (offsetReset === 'latest' || offsetReset === 'newest') {
                        fromBeginning = false;
                    }

                    await consumer.subscribe({
                        topic: topicName,
                        fromBeginning:fromBeginning,
                    });

                    // Collect messages with timeout
                    const consumedMessages: any[] = [];
                    const maxPollRecords =  100;
                    const consumeTimeout =  500

                    await new Promise<void>((resolve, reject) => {
                        const timeoutId = setTimeout(async () => {
                        await consumer.stop();
                        resolve();
                        }, consumeTimeout);

                        consumer.run({
                        autoCommit:  false,
                        autoCommitInterval: null,
                        eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
                            try {
                            const messageValue = JSON.parse(message.value?.toString());
                            consumedMessages.push(

                                messageValue

                            );

                            // Manual commit if auto-commit is disabled
                            if (groupId) {
                                await consumer.commitOffsets([{
                                topic,
                                partition,
                                offset: (parseInt(message.offset) + 1).toString(),
                                }]);
                            }

                            // Stop if we've reached max poll records
                            if (consumedMessages.length >= maxPollRecords) {
                                clearTimeout(timeoutId);
                                await consumer.stop();
                                resolve();
                            }
                            } catch (msgError) {
                            this.logger.error(`Error processing Kafka message: ${msgError}`);
                            }
                        },
                        }).catch(reject);
                    });

                    await consumer.disconnect();                 
                    kafkaResultArr = consumedMessages.length > 0 ? await this.keysToLowerCaseOnly(consumedMessages) : [];
                    

                    //   if (kafkaResultArr.length === 0) {
                    //     this.logger.log(`No messages available in topic: ${topicName}`);
                    //   }

                    } catch (consumerError) {
                    await consumer.disconnect().catch(() => {});
                    throw new CustomException(`Kafka consume error: ${consumerError?.message || consumerError}`, 500);
                    }
                }
                if (inputparam) {
                    if (Object.keys(inputparam).length > 0) {
                    if (Array.isArray(inputparam) && inputparam.length > 0) {
                        for (let r = 0; r < inputparam.length; r++) {
                        inputparam[r] = Object.assign(inputparam[r], { [poNode[j].nodeName]: kafkaResultArr });
                        }
                    } else if (Object.keys(inputparam).length > 0) {
                        Object.assign(inputparam, { [poNode[j].nodeName]: kafkaResultArr });
                    }
                    // 
                    } else {
                    inputparam = Object.assign(inputparam, { [poNode[j].nodeName]: kafkaResultArr });
                    }
                    RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam, processedKey + upId, currentFabric, SessionInfo);
                } else {
                    RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], kafkaResultArr, processedKey + upId, currentFabric, SessionInfo);
                }
                // Store results in Redis
                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify({ topic: topicName, operation: oprname }), collectionName, 'request');
                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(kafkaResultArr), collectionName, 'response');

                this.logger.log('Kafka Stream first node Completed');
                // if (semarc)
                if (currentFabric == 'PF-PFD' || currentFabric == 'PF-SFD' || currentFabric == 'PF-SCDL')
                    return { status: 200, targetStatus: targetStatus, data: inputparam };
                else
                    return { status: 200, targetStatus: targetStatus, data: kafkaResultArr };
                }} catch (error) {
                console.log('error',error)
                this.logger.error('Kafka Stream first node Failed', error);
                throw error;
                }
            }

            //File Node
            if (nodeType == 'filenode' && poNode[j].nodeId == nodeId) {
                let rollbackConfig, fileres
                try {
                    this.logger.log(`File node Execution Started ${poNode[j].nodeName}`);
                    let customConfig = ndp[poNode[j].nodeId]
                    rollbackConfig = ndp[poNode[j].nodeId]
                    let oprname, oprkey, fileFolderPath, fileType, fileName, apikey, responseNodeName, seaWeedConfig, rollback, isStatic, sessionfilterParams;
                    let fconf = await this.CommonService.fileConfig(customConfig, collectionName)
                    seaWeedConfig = fconf?.seaWeedConfig
                    oprname = fconf?.oprname
                    apikey = fconf?.apikey
                    rollback = fconf?.rollback
                    responseNodeName = fconf?.responseNodeName
                    isStatic = fconf?.isStatic
                    sessionfilterParams = fconf?.filterParams
                    if (isStatic) {
                        fileFolderPath = fconf?.fileFolderPath
                        fileName = fconf?.fileName
                        fileType = fconf?.fileType
                    }

                    let childInsertArr, textobj, tempQryVal = []
                    if (internalEdges && internalEdges.hasOwnProperty(poNode[j].nodeId)) {
                        let currentNodeEdge = internalEdges[poNode[j].nodeId];
                        let mappedData = await this.mapEdgeValuesToParams(poNode, currentNodeEdge, inputparam, processedKey, upId, collectionName, '', '', pfo)
                        childInsertArr = mappedData.childInsertArr
                        tempQryVal = mappedData.tempQryVal
                        textobj = mappedData.textobj
                    }
                    if (!isStatic && (!childInsertArr || !textobj)) throw new CustomException('File Config Mapping was Required', 404);
                    if (oprname && oprkey.includes(oprname)) {
                        let fileinfo = childInsertArr[0].fileinfo
                        if (!isStatic && (!fileinfo || Object.keys(fileinfo).length == 0)) throw new CustomException('File Config Mapping was Required', 404);
                        if (fileinfo) {
                            fileFolderPath = fileinfo?.pathName
                            fileName = fileinfo?.fileName
                            fileType = fileinfo?.fileType
                        }
                        if (pfjson?.length > 0 && responseNodeName?.length > 0 && !apikey) {
                            for (let p = 0; p < pfjson.length; p++) {
                                if (responseNodeName.includes(pfjson[p].nodeId)) {
                                    var connectedNodeName = pfjson[p].nodeName;
                                }
                            }
                        }
                        if (connectedNodeName) {
                            let inputData = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + upId + ':NPV:' + connectedNodeName + '.PRO', '.response', collectionName));
                            childInsertArr.push(inputData)
                        }
                        if (childInsertArr?.length > 0 && childInsertArr[0].fileinfo)
                            delete childInsertArr[0].fileinfo

                        if (!fileName || !oprname)
                            throw new CustomException('Invalid Credentials', 422);
                        let fullPath = fileType ? fileFolderPath + '/' + fileName + '.' + fileType : fileFolderPath + '/' + fileName
                        if (oprname === 'read') {
                            if (fileFolderPath && fileName) {
                                let encCredentials = await this.CommonService.checkEncryption(poNode[j]);
                                if (encCredentials?.selectedDpd && encCredentials?.encryptionMethod) {
                                    let url = seaWeedConfig.url + '/' + fullPath
                                    fileres = await this.CommonService.downloadAndDecryptFile(seaWeedConfig, url);
                                } else {
                                    fileres = await this.CommonService.setfileKeys(seaWeedConfig, oprname, fileFolderPath, fileName, fileType);
                                }
                            }

                            if (!fileres || (Array.isArray(fileres) && fileres.length == 0) || (typeof fileres == 'object' && Object.keys(fileres).length == 0)) {
                                throw new CustomException('Data not found', 404);
                            }
                            // let encCredentials = await this.CommonService.checkEncryption(poNode[j]);
                            // console.log('encCredentials', encCredentials);

                            // if (encCredentials?.selectedDpd && encCredentials?.encryptionMethod) {                     

                            //   var fileResult = await this.CommonService.commondecryption(encCredentials.selectedDpd, encCredentials.encryptionMethod, fileres, 'ct280_v001_vsp001_v1');
                            //   console.log('fileResult', fileResult);

                            //   // apiResult = JSON.parse(DecapiResult);
                            // }
                        } else if (oprname === 'write') {
                            if (rollback) {
                                let existData = await this.CommonService.setfileKeys(seaWeedConfig, 'read', fileFolderPath, fileName, fileType);
                                if (existData) {
                                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(existData), collectionName, 'rollback');
                                }
                            }
                            if (fileName + '.' + fileType && childInsertArr?.length > 0 && !textobj) {
                                for (let a = 0; a < childInsertArr.length; a++) {
                                    fileres = await this.CommonService.setfileKeys(seaWeedConfig, oprname, fileFolderPath, fileName, fileType, childInsertArr[a]);
                                }
                            } else if (textobj && fileName + '.' + fileType) {
                                fileres = await this.CommonService.setfileKeys(seaWeedConfig, oprname, fileFolderPath, fileName, fileType, textobj);
                            }
                            if (!fileres || fileres?.status != 201) {
                                throw new CustomException('write operation failed', 500);
                            }
                        }
                        let s_obj = {}
                        let sarr = []
                        if (sessionfilterParams?.length > 0) {
                            for (let f = 0; f < sessionfilterParams.length; f++) {
                                if (sessionfilterParams[f].value.includes('session'))
                                    s_obj[sessionfilterParams[f].name] = sobj[sessionfilterParams[f].name]
                                sarr.push(s_obj)
                            }
                            let currentFilterRes;
                            if (sarr?.length > 0) {
                                for (let item1 of sarr) {
                                    if (item1 && Object.keys(item1).length > 0) {
                                        if (Array.isArray(fileres) && fileres?.length > 0) {
                                            currentFilterRes = [];
                                            for (let a = 0; a < fileres.length; a++) {
                                                let b = 0;
                                                for (let item in item1) {
                                                    const expectedValue = item1[item];
                                                    const result = this.findMatchingValuesFlexible(fileres[a], item, expectedValue,);
                                                    if (result.length > 0) {
                                                        b++;
                                                    }
                                                    if (b == Object.keys(item1).length)
                                                        currentFilterRes.push(fileres[a]);
                                                }
                                            }
                                        } else if (fileres && Object.keys(fileres).length > 0) {
                                            currentFilterRes = {};
                                            let b = 0;
                                            for (let item in item1) {
                                                const expectedValue = item1[item];
                                                const result = this.findMatchingValuesFlexible(fileres, item, expectedValue,);
                                                if (result.length > 0) {
                                                    b++;
                                                }
                                                if (b == Object.keys(item1).length)
                                                    currentFilterRes = fileres;
                                            }
                                        }
                                        if (currentFilterRes) {
                                            fileres = currentFilterRes;
                                        }
                                    }
                                }
                            }
                        }

                        if (filterData && filterData.length > 0) {
                            let currentFilterData;
                            for (let f = 0; f < filterData.length; f++) {
                                if (filterData[f].nodeId == poNode[j].nodeId) {
                                    delete filterData[f].nodeId;
                                    currentFilterData = filterData[f];
                                }
                            }
                            let filterpath = {};
                            for (let item in currentFilterData) {
                                let s_item = item.split('.');
                                let removedVal = s_item.filter((item) => !this.statickeyword.includes(item)).join('.');
                                if (removedVal.startsWith('items.')) {
                                    removedVal = removedVal.replace('items.', '');
                                }
                                filterpath[removedVal] = currentFilterData[item];
                            }
                            let currentFilterRes;
                            if (filterpath && Object.keys(filterpath).length > 0) {
                                if (Array.isArray(fileres) && fileres?.length > 0) {
                                    currentFilterRes = [];
                                    for (let a = 0; a < fileres.length; a++) {
                                        let b = 0;
                                        for (let item in filterpath) {
                                            const expectedValue = filterpath[item];
                                            const result = this.findMatchingValuesFlexible(fileres[a], item, expectedValue,);
                                            if (result.length > 0) {
                                                b++;
                                            }
                                            if (b == Object.keys(filterpath).length)
                                                currentFilterRes.push(fileres[a]);
                                        }
                                    }
                                } else if (fileres && Object.keys(fileres).length > 0) {
                                    currentFilterRes = {};
                                    let b = 0;
                                    for (let item in filterpath) {
                                        const expectedValue = filterpath[item];
                                        const result = this.findMatchingValuesFlexible(fileres, item, expectedValue,);
                                        if (result.length > 0) {
                                            b++;
                                        }
                                        if (b == Object.keys(filterpath).length)
                                            currentFilterRes = fileres;
                                    }
                                }
                                if (currentFilterRes) {
                                    fileres = currentFilterRes;
                                }
                            }
                        }

                        if (!logicCenter && currentFabric == 'DF-DFD') {
                            let keys = await this.redisService.getKeys(dstkey + SessionToken.loginId + '_DS_Object', collectionName)
                            if (keys.length > 0) {
                                for (let a = 0; a < keys.length; a++) {
                                    await this.redisService.deleteKey(keys[a], collectionName)
                                }
                            }
                            this.redisService.sethash(fileres, dstkey + SessionToken.loginId + '_DS_Object')
                            return { data: 'logicCenter' }
                        }
                        if (inputparam) {                           
                            RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam, processedKey + upId, currentFabric, SessionInfo);
                        } else {
                            RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], fileres, processedKey + upId, currentFabric, SessionInfo);
                        }
                        if (RCMresult) {
                            zenresult = RCMresult.rule;
                            customcoderesult = RCMresult.code;
                        }

                        ifoObj = await this.ifoAssign(poJson?.internalMappingNodes, poNode[j].nodeId)
                        if (ifoObj && Object.keys(ifoObj).length > 0) {
                            if (currentFabric == 'PF-PFD')
                                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(ifoObj), collectionName, 'ifo',);
                            if (fileres)
                                fileres = await this.codeORifoAndInputparamAssign(ifoObj, fileres)
                        }

                        if (customcoderesult && customcoderesult != undefined && customcoderesult != null) {
                            codeObj = await this.codeAssign(customcoderesult)
                            if (codeObj) {
                                if (currentFabric == 'PF-PFD')
                                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);
                                if (fileres)
                                    fileres = await this.codeORifoAndInputparamAssign(codeObj, fileres)
                            }
                        }
                        if(inputparam)
                            inputparam = await this.assignToInputParam(inputparam, nodeName, fileres)

                        if (upId) {
                            await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus }));
                            await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, fullPath, fileres);
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(fullPath), collectionName, 'request');
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(fileres), collectionName, 'response');
                        }
                        this.logger.log('File Node execution completed');
                        if(currentFabric == 'PF-PFD'|| currentFabric == 'PF-SFD' || currentFabric == 'PF-SCDL')
                            return { status: 200, targetStatus: targetStatus, data: inputparam };
                        else
                            return { status: 200, targetStatus: targetStatus, data: fileres };
                    } else {
                        throw new CustomException('Operation name not found', 404);
                    }
                } catch (error) {
                    //console.log('err--',error);    
                    await this.CommonService.checkRollBack(ndp, collectionName, 'rollback', {
                        key: processedKey + upId,
                        nodeid: rollbackConfig.nodeId,
                        nodename: rollbackConfig.nodeName,
                        savepoint: rollbackConfig.savePoint,
                        data: fileres
                    }
                    );
                    await this.exceptionhandler(failureQueue, suspiciousQueue, errorQueue, error, upId, nodeId, failureTargetStatus, inputparam)
                }
            }

            //Sub Flow Node
            if (nodeType == 'subflow_node' && poNode[j].nodeId == nodeId) {
                try {
                    this.logger.log('Sub Flow Node Started');
                    let customConfig = ndp[poNode[j].nodeId]
                    if (customConfig) {
                        let PfdKey = customConfig?.apiKey;
                        let nodeVersion = customConfig?.nodeVersion;

                        if (!nodeVersion)
                            throw new CustomException('Node version not found', 404);
                        if (!PfdKey) throw new CustomException('PFD key not found', 404);

                        ifoObj = await this.ifoAssign(poJson?.internalMappingNodes, poNode[j].nodeId)
                        if (ifoObj && Object.keys(ifoObj).length > 0)
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(ifoObj), collectionName, 'ifo',);

                        PfdKey = PfdKey.endsWith(':NDP') ? PfdKey.replace(':NDP', '') : PfdKey;
                        let subPo, subnodeid, subnodetype;
                        if (!(await this.redisService.exist(PfdKey + ':PO', process.env.CLIENTCODE,))) throw `${PfdKey} not found`;
                        subPo = JSON.parse(await this.redisService.getJsonDataWithPath(PfdKey + ':PO', '.mappedData.artifact.node', process.env.CLIENTCODE,));
                        if (subPo && subPo.length > 0) {
                            subnodeid = subPo[1]['nodeId'];
                            subnodetype = subPo[1]['nodeType'];
                        }

                        let subflowndp = JSON.parse(await this.redisService.getJsonData(PfdKey + ':NDP', process.env.CLIENTCODE))
                        let apikey = subflowndp[subnodeid].apiKey
                        let apiConfig = JSON.parse(await this.redisService.getJsonData(apikey, process.env.CLIENTCODE))
                        let apiValue: any = Object.values(apiConfig)[0]
                        let methodName = (apiValue?.data?.method).toLowerCase()
                        let parameter = apiValue.data[methodName]

                        let mapObj = {}, tempQryVal = [];
                        if (internalEdges && internalEdges.hasOwnProperty(poNode[j].nodeId)) {
                            let currentNodeEdge = internalEdges[poNode[j].nodeId];
                            
                            
                            let mappedData = await this.mapEdgeValuesToParams(poNode, currentNodeEdge, inputparam, processedKey, upId, collectionName,  parameter, '', pfo)
                            // console.log('mappedData',mappedData);
                            
                            mapObj = mappedData.childInsertArr
                            tempQryVal = mappedData.tempQryVal
                        }

                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(ifoObj), collectionName, 'ifo',);
                        let subPoResult, pfExecutedSet, pfExecutedEvent;
                        let pfdto = new pfDto();
                        pfdto.key = PfdKey + ':';
                        pfdto.upId = '';
                        if (tempQryVal && Object.keys(tempQryVal).length > 0)
                            pfdto.data = { mapObj, tempQryVal };
                        else
                            pfdto.data = mapObj
                        pfdto.nodeId = subnodeid;
                        pfdto.nodeType = subnodetype;
                        pfdto.event = event;
                        pfdto.token = token;

                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(pfdto), collectionName, 'request',);

                        if (currentFabric == 'PF-SCDL') {
                            pfdto.parentUpId = upId;
                            let keyParts = key.split(':');
                            let pfdKeyParts = PfdKey.split(':');
                            let parentJobName = 'Parent-Flow'//((keyParts[1] + keyParts[5] + keyParts[7] + keyParts[9] + keyParts[11] + keyParts[13]).replace(/[-_]/g, '')).replace(/\s+/g, '');
                            // let childJobName = `${((pfdKeyParts[1] + pfdKeyParts[5] + pfdKeyParts[7] + pfdKeyParts[9] + pfdKeyParts[11] + pfdKeyParts[13]).replace(/[-_]/g, '')).replace(/\s+/g, '')}-${upId}`; //`ChildFlow-${upId}` 
                            let childJobName = `Child-Flow-${upId}`

                            this.logger.log(`Creating child job in queue: ${childJobName}`);
                            this.logger.log(`Parent job: ${parentJobName}, Parent job ID: ${upId}`);

                            // Get the parent queue first to get the qualified name
                            const parentQueue: Queue = this.listenerService.getQueue(parentJobName);

                            // Get or create the child queue
                            const childQueue: Queue = this.listenerService.getQueue(childJobName);

                            // Create worker for this queue if not already created
                            this.processor.createWorker(childJobName);

                            // Get the parent job to verify it exists and get its qualified queue name
                            const parentJob = await parentQueue.getJob(upId);

                            if (!parentJob) {
                                throw new Error(`Parent job ${upId} not found in queue ${parentJobName}`);
                            }

                            this.logger.log(`Parent job found: ${parentJob.id} in queue ${parentJob.queueQualifiedName}`);

                            // Add child job to the queue with correct parent reference
                            const childJob = await childQueue.add(
                                `${childJobName}`, // Job name
                                pfdto, // Job data
                                {
                                    parent: {
                                        id: parentJob.id, // Use parentJob.id to ensure it's a string
                                        queue: parentJob.queueQualifiedName // CRITICAL: Use queueQualifiedName, not just queue name
                                    },
                                    removeOnComplete: false,
                                    removeOnFail: false,
                                }
                            );

                            this.logger.log(`Created child job ${childJob.id} in queue ${childJobName}`);

                            // Wait for the child job to complete and get the result
                            try {
                                // Create a QueueEvents instance to listen for job completion
                                const queueEvents = new QueueEvents(childJobName, {
                                    connection: {
                                        host: process.env.HOST,
                                        port: parseInt(process.env.PORT),
                                    },
                                });

                                this.logger.log(`Waiting for child job ${childJob.id} to complete...`);

                                // Wait for the job to finish
                                const result = await childJob.waitUntilFinished(queueEvents);
                                // console.log('SubFlowresult', result);

                                this.logger.log(`Child job ${childJob.id} completed with result`);

                                // Clean up
                                await queueEvents.close();

                                // Format the result to match the expected API response structure
                                subPoResult = {
                                    statusCode: 201,
                                    status: 'Success',
                                    result: result
                                };

                            } catch (error) {
                                this.logger.error(`Child job ${childJob.id} failed: ${error.message}`);
                                throw error;
                            }

                        } else {
                            const requestConfig: AxiosRequestConfig = {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            };

                            if (!process.env.BE_URL) throw new CustomException('Server Url not found', 404);
                            subPoResult = await this.executeApiCall('post', process.env.BE_URL + '/te/eventEmitter', requestConfig, pfdto)
                            //subPoResult = await this.CommonService.postCall(process.env.BE_URL + '/te/eventEmitter', pfdto, requestConfig,);
                        }

                        if (subPoResult?.statusCode == 201 && subPoResult?.status == 'Success') {
                            if (subPoResult?.result?.message == 'Success') {
                                subPoResult = subPoResult?.result;
                                if (subPoResult?.data?.data)
                                    pfExecutedSet = subPoResult.data.data;
                                else
                                    pfExecutedSet = subPoResult?.data;

                                pfExecutedEvent = subPoResult?.event;

                                if (targetStatus != pfExecutedEvent) {
                                    throw new CustomException('Event Mismatched in subflow', 400);
                                }
                            }

                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(pfExecutedSet), collectionName, 'response',);

                            if (pfExecutedSet) {
                                if (Array.isArray(pfExecutedSet)) {
                                    inputparam = await this.assignToInputParam(inputparam, nodeName, pfExecutedSet[0])
                                    pfExecutedSet = Object.assign(inputparam, pfExecutedSet[0]);
                                } else if (Object.keys(pfExecutedSet).length > 0) {
                                    inputparam = await this.assignToInputParam(inputparam, nodeName, pfExecutedSet)
                                    pfExecutedSet = Object.assign(inputparam, pfExecutedSet,);
                                }
                                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(pfExecutedSet), collectionName, 'request',);
                            } else {
                                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(inputparam), collectionName, 'request',);
                            }

                            if (upId) {
                                await this.redisService.setStreamData(srcQueue, collectionName + 'TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: pfdto, response: pfExecutedSet }, }),);
                                await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, pfdto, subPoResult);
                                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(pfExecutedSet), collectionName, 'response',);
                            }
                            this.logger.log('Sub Flow Node Completed');
                            return { status: 200, targetStatus: targetStatus, data: inputparam };
                        } else {
                            throw subPoResult;
                        }
                    }
                } catch (error) {
                    await this.exceptionhandler(failureQueue, suspiciousQueue, errorQueue, error, upId, nodeId, failureTargetStatus, inputparam)
                }
            }

            //Output Node
            if (nodeType == 'outputnode' && poNode[j].nodeId == nodeId) {
                try {
                    this.logger.log('Output node Started');
                    let customConfig = ndp[poNode[j].nodeId]
                    let nodeVersion = customConfig?.nodeVersion;
                    if (!nodeVersion) {
                        throw new CustomException('nodeVersion not found', 404);
                    }
                    let connectorType, storageType, dpdkey, conncectorName, responseNodeName, tableName, fileType, fileName, folderPath, streamName, fieldName;
                    if (nodeVersion.toLowerCase() == 'v1') {
                        connectorType = customConfig?.data?.connector?.value;
                        storageType = customConfig?.data?.connector?._selection?._selection?.value;
                        dpdkey = customConfig?.data?.connector?._selection?.value;
                        conncectorName = customConfig?.data?.connector?._selection?.subSelection?.value;
                        responseNodeName = customConfig?.outputDataNodes;
                        tableName = customConfig.data?.pro?.database?.insert?.tableName;
                        fileType = customConfig.data?.pro?.file?.write?.fileType;
                        fileName = customConfig.data?.pro?.file?.write?.fileName;
                        folderPath = customConfig.data?.pro?.file?.write?.pathName;
                        streamName = customConfig.data?.pro?.stream?.write?.streamName;
                        fieldName = customConfig.data?.pro?.stream?.write?.field;
                    }
                    if (!dpdkey) throw new CustomException('DPD key not found', 404);
                    let extdata = JSON.parse(await this.redisService.getJsonData(dpdkey + 'NDP', collectionName));
                    if (!extdata) throw new CustomException('DPD value not found', 404);
                    let nodedata = Object.keys(extdata)[0];
                    let dpdKeyValue = extdata[nodedata].data;
                    if (responseNodeName?.length == 0) throw new CustomException('outputDataNodes not found', 404);
                    for (let p = 0; p < pfjson.length; p++) {
                        if (responseNodeName.includes(pfjson[p].nodeId)) {
                            var connectedNodeName = pfjson[p].nodeName;
                        }
                    }
                    let inputData
                    if (connectedNodeName)
                        inputData = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + upId + ':NPV:' + connectedNodeName + '.PRO', '.response', collectionName));
                    if (inputData) {
                        let client, db, redis
                        let logReq;
                        if (inputparam) {
                            inputparam = await this.assignToInputParam(inputparam, nodeName, inputData)
                            RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam, processedKey + upId, currentFabric, SessionInfo);
                        } else {
                            RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], inputData, processedKey + upId, currentFabric, SessionInfo);
                        }
                        if (RCMresult) {
                            zenresult = RCMresult.rule;
                            customcoderesult = RCMresult.code;
                        }
                        if (customcoderesult && customcoderesult != undefined && customcoderesult != null) {
                            codeObj = await this.codeAssign(customcoderesult)
                            if (codeObj) {
                                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);
                                if (inputData)
                                    inputData = await this.codeORifoAndInputparamAssign(codeObj, inputData)
                            }
                        }

                        if (connectorType == 'database') {
                            let dbconfig;
                            let dbFlg;
                            if (storageType == 'internal') {
                                let specificDbType = dpdKeyValue?.dbType?.dbType?.value;
                                if (!specificDbType)
                                    throw new CustomException('DB type not found', 404);
                                if (specificDbType == 'postgres') {
                                    dbconfig = extdata?.data?.postgres;
                                    if (!dbconfig || !dbconfig.POSTGRES_HOST)
                                        throw new CustomException(`Invalid DB credentials`, 404);
                                    const { Client } = pg;
                                    if (dbconfig.POSTGRES_HOST && dbconfig.POSTGRES_PORT && dbconfig.POSTGRES_USERNAME && dbconfig.POSTGRES_PASSWORD && dbconfig.POSTGRES_DATABASENAME) {
                                        client = new Client({
                                            host: dbconfig.POSTGRES_HOST,
                                            port: dbconfig.POSTGRES_PORT,
                                            user: dbconfig.POSTGRES_USERNAME,
                                            password: dbconfig.POSTGRES_PASSWORD,
                                            database: dbconfig.POSTGRES_DATABASENAME,
                                        });
                                    } else {
                                        client = new Client({
                                            connectionString: dbconfig.POSTGRES_HOST,
                                        });
                                    }
                                    dbFlg = 'pg';
                                } else if (specificDbType == 'mongodb') {
                                    dbconfig = dpdKeyValue?.mongodb;
                                    if (!dbconfig || !dbconfig.MONGODB_HOST) {
                                        throw new CustomException(`Invalid DB credentials`, 422);
                                    }
                                    let mongoDbUrl
                                    if (dbconfig.MONGODB_USERNAME && dbconfig.MONGODB_PASSWORD && dbconfig.MONGODB_HOST && dbconfig.MONGODB_PORT && dbconfig.MONGODB_DATABASENAME)
                                        mongoDbUrl = `mongodb://${dbconfig.MONGODB_USERNAME}:${dbconfig.MONGODB_PASSWORD}@${dbconfig.MONGODB_HOST}:${dbconfig.MONGODB_PORT}/${dbconfig.MONGODB_DATABASENAME}?authSource=admin`;
                                    else
                                        mongoDbUrl = dbconfig.MONGODB_HOST
                                    client = new MongoClient(mongoDbUrl);
                                    client.connect()
                                        .then(() => {
                                            console.log('Connected to the database successfully!');
                                        })
                                        .catch((err) => {
                                            console.error('Error connecting to the database:', err);
                                        });

                                    db = client.db(dbconfig.MONGODB_DATABASENAME);
                                    dbFlg = 'mongo';
                                }
                            } else if (storageType == 'external') {
                                let configConnectors = extdata[nodedata].data['externalConnectors-DB']?.items;
                                if (configConnectors?.length > 0) {
                                    for (let i = 0; i < configConnectors.length; i++) {
                                        if (configConnectors[i].connectorName == conncectorName) {
                                            dbconfig = configConnectors[i]?.credentials;
                                        }
                                    }
                                }

                                if (!dbconfig?.host) {
                                    throw new CustomException(`Invalid DB credentials`, 404);
                                }

                                const { Client } = pg;
                                if (dbconfig.host && dbconfig.port && dbconfig.username && dbconfig.password && dbconfig.database) {
                                    client = new Client({
                                        host: dbconfig.host,
                                        port: dbconfig.port,
                                        user: dbconfig.username,
                                        password: dbconfig.password,
                                        database: dbconfig.database,
                                    });
                                } else {
                                    client = new Client({
                                        connectionString: dbconfig.host,
                                    });
                                }

                            }
                            if (!tableName)
                                throw new CustomException('Table name not found', 404);

                            if (dbFlg == 'pg') {
                                if (Array.isArray(inputData)) {
                                    for (var i = 0; i < inputData.length; i++) {
                                        if (Object.keys(inputData[i]).length > 0) {
                                            const keys = Object.keys(inputData[i]);
                                            const values = Object.values(inputData[i]);
                                            const query = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${values.map((v) => `'${v}'`).join(', ')});`;
                                            await client.connect();
                                            await client.query(query);
                                            await client.end();
                                        }
                                    }
                                }
                                if (Object.keys(inputData).length > 0) {
                                    const keys = Object.keys(inputData);
                                    const values = Object.values(inputData);
                                    const query = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${values.map((v) => `'${v}'`).join(', ')});`;
                                    logReq = query;
                                    await client.connect();
                                    await client.query(query);
                                    await client.end();
                                }
                            } else if ((dbFlg = 'mongo')) {
                                logReq = inputData;
                                if (Array.isArray(inputData))
                                    await db.collection(tableName).insertMany(inputData);
                                else if (Object.keys(inputData).length > 0) {
                                    await db.collection(tableName).insertOne(inputData);
                                }
                            }
                        } else if (connectorType == 'file') {
                            let seaWeedConfig, OPFileRes, conncectorname;
                            if (storageType == 'internal') {
                                if (!process.env.SEAWEED_OUTPUT_HOST || !process.env.SEAWEED_USERNAME || !process.env.SEAWEED_PASSWORD)
                                    throw 'Invalid File Credentials';
                                seaWeedConfig = {
                                    url: process.env.SEAWEED_OUTPUT_HOST,
                                    username: process.env.SEAWEED_USERNAME,
                                    password: process.env.SEAWEED_PASSWORD,
                                };
                            } else if (storageType == 'external') {
                                let nodedata = Object.keys(extdata)[0];
                                let configConnectors = extdata[nodedata].data['externalConnectors-FILE']?.items;
                                let fileConfig
                                if (configConnectors?.length > 0) {
                                    for (let i = 0; i < configConnectors.length; i++) {
                                        if (configConnectors[i].connectorName == conncectorname) {
                                            fileConfig = configConnectors[i]?.credentials;
                                        }
                                    }
                                }
                                if (!fileConfig || !fileConfig.host || !fileConfig.username || !fileConfig.password)
                                    throw 'Invalid File Credentials';
                                seaWeedConfig = {
                                    url: fileConfig.host,
                                    username: fileConfig.username,
                                    password: fileConfig.password,
                                };
                            }
                            logReq = inputData;
                            if (fileName + '.' + fileType && inputData) {
                                OPFileRes = await this.CommonService.setfileKeys(seaWeedConfig, 'write', folderPath, fileName, fileType, inputData);
                                if (!OPFileRes || OPFileRes?.status != 201) {
                                    throw new CustomException('write operation failed ', 500);
                                }
                            }
                        } else if (connectorType == 'stream') {
                            if (storageType == 'internal') {
                                let redisConfig = dpdKeyValue?.amdPersistence?.redis;
                                if (!redisConfig)
                                    throw new CustomException('RedisConfig not found', 422);
                                if (!redisConfig.REDIS_HOST || !parseInt(redisConfig.REDIS_PORT)) {
                                    throw new CustomException('Invalid Redis credentials', 400);
                                }
                                redis = new Redis({
                                    host: redisConfig.REDIS_HOST,
                                    port: parseInt(redisConfig.REDIS_PORT),
                                });
                            } else if (storageType == 'external') {
                                let nodedata = Object.keys(extdata)[0];
                                let configConnectors = extdata[nodedata].data['externalConnectors-STREAM']?.items;
                                let streamConfig
                                if (configConnectors?.length > 0) {
                                    for (let i = 0; i < configConnectors.length; i++) {
                                        if (configConnectors[i].connectorName == conncectorName) {
                                            streamConfig = configConnectors[i]?.credentials;
                                        }
                                    }
                                }
                                if (!streamConfig?.host || !streamConfig?.port) {
                                    throw new CustomException('Invalid stream credentials', 400);
                                }
                                redis = new Redis({
                                    host: streamConfig.host,
                                    port: streamConfig.port,
                                });
                            }
                            logReq = inputData;
                            if (!streamName || !fieldName)
                                throw new CustomException('streamName or fieldName not found', 404);
                            await redis.call('XADD', streamName, '*', fieldName, JSON.stringify(inputData));
                        }
                        if (upId) {
                            await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: streamName, response: inputData } }));
                            await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, logReq);
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(logReq), collectionName, 'request');
                        }
                    } else {
                        throw new CustomException('Data not found', 404);
                    }
                    this.logger.log('Output node Completed');
                    return { status: 200, targetStatus: targetStatus, data: inputData };
                } catch (error) {
                    await this.exceptionhandler(failureQueue, suspiciousQueue, errorQueue, error, upId, nodeId, failureTargetStatus, inputparam)
                }
            }

            //API input Node
            if (nodeType == 'api_inputnode' && poNode[j].nodeId == nodeId) {
                try {
                    this.logger.log('.....api_inputnode Started')
                    RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam, processedKey + upId, currentFabric, SessionInfo)
                    if (RCMresult) {
                        zenresult = RCMresult.rule
                        customcoderesult = RCMresult.code
                    }
                    if (customcoderesult && customcoderesult != undefined && customcoderesult != null) {
                        codeObj = await this.codeAssign(customcoderesult)
                        if (codeObj) {
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);
                            if (inputparam)
                                inputparam = await this.codeORifoAndInputparamAssign(codeObj, inputparam)
                        }
                    }

                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(inputparam), collectionName, 'response')
                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(event), collectionName, 'event')
                    await this.redisService.setStreamData(srcQueue, collectionName + 'TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus, data: { request: inputparam, response: inputparam } }))
                    await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, inputparam, { "PID": upId, "TID": nodeId, "EVENT": targetStatus })
                    inputparam = { [nodeName]: inputparam }
                    this.logger.log('api_inputnode Completed')
                    return { status: 200, targetStatus: targetStatus, data: inputparam }

                } catch (error) {
                    await this.exceptionhandler(failureQueue, suspiciousQueue, errorQueue, error, upId, nodeId, failureTargetStatus, inputparam)
                }
            }

            //DataSet Node
            if (nodeType == 'datasetschemanode' && poNode[j].nodeId == nodeId) {
                try {
                    this.logger.log('DataSetSchema Node Started');
                    let schemaRes = {}
                    let customConfig = ndp[poNode[j].nodeId]
                    let referenceKey = customConfig?.apiKey
                    let nodeVersion = customConfig?.nodeVersion
                    if (!nodeVersion) throw new CustomException('Node version not found', 404)
                    if (!referenceKey) throw new CustomException('API Reference key not found', 404)
                    if (flag != 'N' && inputparam && inputparam.length == 0) {
                        return { status: 200, targetStatus: targetStatus, data: inputparam };
                    } else if (!inputparam || (Array.isArray(inputparam) && inputparam.length == 0) || (inputparam && Object.keys(inputparam).length == 0)) {
                        throw new CustomException('Data not found', 404);
                    }
                    if (customConfig) {
                        RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam, processedKey + upId, currentFabric, SessionInfo)
                        if (RCMresult) {
                            zenresult = RCMresult.rule
                            customcoderesult = RCMresult.code
                        }

                        ifoObj = await this.ifoAssign(poJson?.internalMappingNodes, poNode[j].nodeId)
                        if (ifoObj && Object.keys(ifoObj).length > 0) {
                            if (currentFabric == 'PF-PFD')
                                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(ifoObj), collectionName, 'ifo',);
                            inputparam = await this.codeORifoAndInputparamAssign(ifoObj, inputparam)
                        }

                        if (customcoderesult && customcoderesult != undefined && customcoderesult != null) {
                            codeObj = await this.codeAssign(customcoderesult)
                            if (codeObj) {
                                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);
                                inputparam = await this.codeORifoAndInputparamAssign(codeObj, inputparam)
                            }
                        }

                        let apiConfig = JSON.parse(await this.redisService.getJsonData(referenceKey, collectionName))
                        apiConfig = Object.values(apiConfig)[0]
                        if (internalEdges && internalEdges.hasOwnProperty(poNode[j].nodeId)) {
                            let edgesarr = internalEdges[poNode[j].nodeId];
                            let dstVariable = '';
                            let dtovariable = '';
                            let sourcepath = [];
                            let targetpath = [];
                            let sourcekey = [];
                            let rootarr = [];                            
                            let loopingkey = Object.keys(apiConfig?.dataset);
                            for (let j = 0; j < edgesarr.length; j++) {
                                let b = 0;
                                let srcNodename = null;
                                sourcekey.push(edgesarr[j].source);
                                let sourceNodeId = edgesarr[j].source;
                                for (let c = 0; c < poNode.length; c++) {
                                    if (sourceNodeId != poNode[1].nodeId || currentFabric == 'PF-SFD') {
                                        if (sourceNodeId == poNode[c].nodeId) {
                                            srcNodename = poNode[c].nodeName;
                                        }
                                    }
                                }

                                let srcHandle = edgesarr[j].sourceHandle.split('|');
                                if (srcHandle) {
                                    if (currentFabric != 'PF-SFD' && srcHandle.includes('ifo')) {
                                        srcNodename = null;
                                    }
                                    dstVariable = srcHandle.includes('HeaderParams') ? srcHandle[1] : srcHandle[srcHandle.length - 1];
                                    if (srcHandle.includes('ifo') && currentFabric != 'DF-DFD') {
                                        dstVariable = dstVariable.toLowerCase()
                                    }
                                    if (dstVariable.includes('.')) {
                                        let src = srcHandle[1].split('.');
                                        if (src[src.length - 1] == 'schema') {
                                            b++;
                                        }
                                        let srcvariable = src.filter((item) => !this.statickeyword.includes(item));
                                        dstVariable = srcvariable.join('.');

                                        if (dstVariable.startsWith('items.')) {
                                            dstVariable = dstVariable.replace('items.', '');
                                        }
                                        if (dstVariable.includes('.items.')) {
                                            dstVariable = dstVariable.replaceAll('.items.', '[0].');
                                        }
                                        if (dstVariable.includes('.') && dstVariable.startsWith('parameters.')) {
                                            let apiKey = ndp[sourceNodeId].apiKey;
                                            let apidata = JSON.parse(await this.redisService.getJsonData(apiKey, collectionName));
                                            let apinodeid = Object.keys(apidata)[0];
                                            let method = apidata[apinodeid].data?.method;
                                            let parameter = apidata[apinodeid].data[method.toLowerCase()];
                                            dstVariable = _.get(parameter, dstVariable);
                                        }
                                        if (dstVariable.includes('.')) {
                                            let dst = dstVariable.split('.')
                                            dstVariable = (dst.filter(item => !this.numberArr.includes(item))).join('.');
                                        }
                                        if (srcNodename)
                                            sourcepath.push(srcNodename + '.' + dstVariable);
                                        else sourcepath.push(dstVariable);
                                    } else {
                                        if (srcNodename)
                                            sourcepath.push(srcNodename + '.' + dstVariable);
                                        else sourcepath.push(dstVariable);
                                    }
                                }

                                let targetSplit = edgesarr[j].targetHandle.split('|');
                                let targetHandle = targetSplit.includes('HeaderParams') ? targetSplit[1] : targetSplit[targetSplit.length - 1];
                                if (targetHandle.includes('.')) {
                                    let targetVaribale = targetHandle.split('.');
                                    let staticRemove: any = targetVaribale.filter((item) => !this.statickeyword.includes(item));
                                    rootarr.push(staticRemove.join('.'));

                                    dtovariable = staticRemove.join('.');
                                    if (dtovariable.includes('.items.')) {
                                        dtovariable = dtovariable.replaceAll('.items.', '[0].');
                                    }
                                    targetpath.push(dtovariable);
                                } else {
                                    dtovariable = targetHandle;
                                    targetpath.push(dtovariable);
                                }
                                if (b > 0) {
                                    let obj = {};
                                    let type
                                    if (pfo?.length > 0) {
                                        for (let p = 0; p < pfo.length; p++) {
                                            if (pfo[p].nodeId == sourceNodeId) {
                                                if (pfo[p]?.schema?.['requestBody']?.['content']?.['application/json']?.['schema']) {
                                                    type = 'application/json'
                                                } else if (pfo[p]?.schema?.['requestBody']?.['content']?.['application/xml']?.['schema']) {
                                                    type = 'application/xml'
                                                }
                                                let schema = pfo[p]?.schema?.['requestBody']['content'][type]['schema'];
                                                let res = await this.generateMockData(schema);
                                                let keys = Object.keys(res);
                                                for (let item of keys) {
                                                    if (Array.isArray(inputparam) && inputparam?.length > 0) {
                                                        for (let i = 0; i < inputparam.length; i++) {                              
                                                            if (srcNodename) {
                                                            _.set(obj, item, _.get(inputparam[i], srcNodename + '.' + item));
                                                            }
                                                        else
                                                            _.set(obj, item, _.get(inputparam[i], item));
                                                        }
                                                    } else if (typeof inputparam == 'object') {
                                                    if (srcNodename)
                                                        _.set(obj, item, _.get(inputparam, srcNodename + '.' + item));
                                                    else
                                                        _.set(obj, item, _.get(inputparam, item));
                                                    }
                                                }
                                            }
                                        }
                                        schemaRes[dtovariable] = obj;
                                    }
                                }
                            }
                            sourcekey = sourcekey.filter((item, index) => sourcekey.indexOf(item) === index);
                            for (let l = 0; l < loopingkey.length; l++) {
                                let routearr: any = [];
                                for (let m = 0; m < targetpath.length; m++) {
                                    if (targetpath[m].includes(loopingkey[l])) {
                                        routearr.push(rootarr[m]);
                                    }
                                }
                            }
                            let edges = {};
                            edges['sourcepath'] = sourcepath;
                            edges['targetpath'] = targetpath;
                            if (edges['targetpath']?.length > 0) {
                                for (let k = 0; k < edges['targetpath'].length; k++) {
                                    if (edges['targetpath'][k].startsWith('items.')) {
                                        edges['targetpath'][k] = edges['targetpath'][k].replace(
                                            'items.',
                                            '',
                                        );
                                    }
                                }
                            }

                            let finalRes = {};
                            let datamappingarr = [];
                            let demo
                            let rootpatharr = await this.findCommonRoot(edges['targetpath']);
                            edges['targetpath'] = edges['targetpath'].map((path) => path.startsWith(rootpatharr + '.') ? path.slice(rootpatharr.length + 1) : path);
                            // console.log("inputparam",inputparam);
                            // console.log(JSON.stringify(inputparam[0].TOB_LFI_Header));

                            // console.log("edges", edges);

                            if (Array.isArray(inputparam)) {
                                demo = JSON.parse(await this.transformData(edges, inputparam));
                            } else if (Object.keys(inputparam).length > 0) {
                                demo = JSON.parse(await this.transformData(edges, [inputparam]));
                            }

                            let beforevalidateData:any
                            let rootPathFlg = false
                            if (rootpatharr) {
                                beforevalidateData = {}
                                if (rootpatharr.includes('[0]')) {
                                    rootpatharr = rootpatharr.replaceAll('[0]', '');
                                    beforevalidateData[rootpatharr] = demo;
                                    rootPathFlg = true
                                }else{
                                     beforevalidateData = []
                                    if(Array.isArray(demo)){
                                      for (let item1 of demo) {
                                        beforevalidateData.push({[rootpatharr] : item1})
                                   }  
                                    }else{
                                        beforevalidateData[rootpatharr] = demo;
                                    }
                                }

                                
                            } else {                               
                                beforevalidateData = demo;
                            }                           
                            
                             if (currentFabric == 'DF-DFD') {
                                let dsSchema = JSON.parse(await this.redisService.getJsonData(key + 'DS_Schema', collectionName));
                                if (!dsSchema) throw new CustomException('DS_Schema doesnot exist', 404)
                                if(Array.isArray(beforevalidateData)){
                                    if (beforevalidateData?.length > 0) {
                                    for (let item1 of beforevalidateData) { 
                                        item1 = this.transformBySchema(dsSchema, item1)
                                        datamappingarr.push(item1)
                                   }
                                   finalRes = datamappingarr
                                }
                                }else{
                                finalRes = this.transformBySchema(dsSchema, beforevalidateData)
                                }
                               
                            } else {
                                finalRes = beforevalidateData
                            }

                            if (schemaRes && Object.keys(schemaRes).length > 0) {
                                let schemakey = Object.keys(schemaRes);
                                if (Array.isArray(finalRes)) {
                                    for (let i = 0; i < finalRes.length; i++) {
                                        if (finalRes[i][schemakey[i]] == null) {
                                            finalRes[i][schemakey[i]] = schemaRes[schemakey[i]];
                                        }
                                    }
                                } else if (finalRes && Object.keys(finalRes).length > 0) {
                                    if (finalRes[schemakey[0]] == null) {
                                        finalRes[schemakey[0]] = schemaRes[schemakey[0]];
                                    }
                                }
                            }
                            if (finalRes)
                                await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, inputparam, finalRes);
                            await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: inputparam, response: finalRes } }));

                            if (finalRes && Array.isArray(finalRes) && finalRes?.length > 0) {
                                inputparam = await this.assignToInputParam(inputparam, nodeName, finalRes[0])
                            } else if (finalRes && Object.keys(finalRes).length > 0) {
                                inputparam = await this.assignToInputParam(inputparam, nodeName, finalRes)
                            }

                            this.logger.log('DataSetSchema Node Completed');
                            if (currentFabric == 'DF-DFD') {
                                let datasetSchemaRes = rootpatharr && rootPathFlg ? [finalRes] : finalRes
                                if (filterData && filterData.length > 0) {
                                    let currentFilterData;
                                    for (let f = 0; f < filterData.length; f++) {
                                        if (filterData[f].nodeId == poNode[j].nodeId) {
                                            delete filterData[f].nodeId;
                                            currentFilterData = filterData[f];
                                        }
                                    }
                                    let filterpath = {};
                                    for (let item in currentFilterData) {
                                        let s_item = item.split('.');
                                        let removedVal = s_item.filter((item) => !this.statickeyword.includes(item)).join('.');
                                        if (removedVal.startsWith('items.')) {
                                            removedVal = removedVal.replace('items.', '');
                                        }
                                        filterpath[removedVal] = currentFilterData[item];
                                    }
                                    let currentFilterRes;
                                    if (filterpath && Object.keys(filterpath).length > 0) {
                                        if (Array.isArray(datasetSchemaRes) && datasetSchemaRes?.length > 0) {
                                            currentFilterRes = [];
                                            for (let a = 0; a < datasetSchemaRes.length; a++) {
                                                let b = 0;
                                                for (let item in filterpath) {
                                                    const expectedValue = filterpath[item];
                                                    const result = this.findMatchingValuesFlexible(datasetSchemaRes[a], item, expectedValue,);
                                                    if (result.length > 0) {
                                                        b++;
                                                    }
                                                    if (b == Object.keys(filterpath).length)
                                                        currentFilterRes.push(datasetSchemaRes[a]);
                                                }
                                            }
                                        } else if (datasetSchemaRes && Object.keys(datasetSchemaRes).length > 0) {
                                            currentFilterRes = {};
                                            let b = 0;
                                            for (let item in filterpath) {
                                                const expectedValue = filterpath[item];
                                                const result = this.findMatchingValuesFlexible(datasetSchemaRes, item, expectedValue,);
                                                if (result.length > 0) {
                                                    b++;
                                                }
                                                if (b == Object.keys(filterpath).length)
                                                    currentFilterRes = datasetSchemaRes;
                                            }
                                        }
                                        if (currentFilterRes) {
                                            datasetSchemaRes = currentFilterRes;
                                        }
                                    }
                                }
                                return { status: 200, targetStatus: targetStatus, data: datasetSchemaRes };
                            }
                            else
                                return { status: 200, targetStatus: targetStatus, data: inputparam };
                        } else {
                            throw new CustomException(`Data Mapping not found for ${poNode[j].nodeName}`, 404);
                        }
                    }
                } catch (error) {
                    // console.log(error);

                    await this.exceptionhandler(failureQueue, suspiciousQueue, errorQueue, error, upId, nodeId, failureTargetStatus, inputparam)
                }
            }

            //API Data Set Node
            if (nodeType == 'datasetnode' && poNode[j].nodeId == nodeId) {
                try {
                    this.logger.log('API DataSet Node Started');
                    let customConfig = ndp[poNode[j].nodeId]
                    if (customConfig) {
                        let DfdKey = customConfig?.apiKey
                        let nodeVersion = customConfig?.nodeVersion
                        let executionMode = customConfig?.executionMode
                        let DfdFabric = await this.CommonService.splitcommonkey(DfdKey, 'FNK')
                        if (DfdFabric == 'DF-DFD') {
                        if (!nodeVersion) throw new CustomException('Node version not found', 404)
                        if (!DfdKey) throw new CustomException('DFD key not found', 404)
                        if (!executionMode) throw new CustomException('Execution mode not found', 404)
                        if (DfdKey.endsWith(':DS_Schema')) {
                            DfdKey = DfdKey.replace('DS_Schema', '')
                        }
                        let DfExecutedResult, DfExecutedDataSet
                        if (executionMode == 'refresh') {
                            const requestConfig: AxiosRequestConfig = {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                            };
                            if (!(process.env.BE_URL)) throw new CustomException('Server Url not found', 404)              
                        DfExecutedResult = await this.executeApiCall('post',process.env.BE_URL + '/te/eventEmitter',requestConfig,{ "key": DfdKey })
                            if (DfExecutedResult?.status == 'Success' && DfExecutedResult?.statusCode == 201) {
                            DfExecutedDataSet = DfExecutedResult?.result?.dataset?.data
                            }
                        } else if (executionMode == 'refer') {
                            let DstKey = DfdKey.replace('AF', 'AFP').replace('DF-DFD', 'DF-DST')
                            let dsObject = JSON.parse(await this.redisService.getJsonData(DstKey + SessionToken.loginId + '_DS_Object', collectionName))
                            DfExecutedDataSet = dsObject?.data
                            if (!DfExecutedDataSet || DfExecutedDataSet.length == 0) throw new CustomException(`Dataset not found ${DstKey + 'DS_Object'}`, 404)
                        }
                        RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], DfExecutedDataSet, processedKey, currentFabric, SessionInfo)
                        if (RCMresult) {
                            zenresult = RCMresult.rule
                            customcoderesult = RCMresult.code
                        }
                        if (customcoderesult && customcoderesult != undefined && customcoderesult != null) {
                            codeObj = await this.codeAssign(customcoderesult)
                            if (codeObj) {
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);
                            if (inputparam)
                                inputparam = await this.codeORifoAndInputparamAssign(codeObj, inputparam)
                            }
                        }
                        let keyMergedArr = []
                        let dfdkeyname = DfdKey.split(':')
                        let dfdname = ((dfdkeyname[1] + dfdkeyname[5] + dfdkeyname[7] + dfdkeyname[9] + dfdkeyname[11] + dfdkeyname[13]).replace(/[-_]/g, '')).replace(/\s+/g, '');
                        if (Array.isArray(DfExecutedDataSet) && DfExecutedDataSet?.length > 0) {
                            for (let d = 0; d < DfExecutedDataSet.length; d++) {
                            let dsObj = {}
                            for (let k in DfExecutedDataSet[d]) {
                                dsObj[dfdname + '_' + k] = DfExecutedDataSet[d][k]
                            }
                            keyMergedArr.push(dsObj)
                            }
                        } else if (DfExecutedDataSet && Object.keys(DfExecutedDataSet).length > 0) {
                            let dsObj = {}
                            for (let k in DfExecutedDataSet) {
                            dsObj[dfdname + '_' + k] = DfExecutedDataSet[k]
                            }
                            keyMergedArr.push(dsObj)
                        }
                        if (keyMergedArr.length == 0) throw new CustomException('Dataset not found', 404)
                        if (upId) {
                            await this.redisService.setStreamData(srcQueue, collectionName + 'TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus, data: { request: inputparam, response: keyMergedArr } }))
                            await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success',targetQueue, token, currentFabric, sourceStatus, { "key": DfdKey }, keyMergedArr)
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify({ "key": DfdKey }), collectionName, 'request')
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(keyMergedArr), collectionName, 'response')
                        }
                        keyMergedArr.push({ ['header']: inputparam?.header, ['params']: inputparam?.param, ['query']: inputparam?.query })
                        this.logger.log('API DataSet Node Completed');
                        return { status: 200, targetStatus: targetStatus, data: keyMergedArr };
                        } else if (DfdFabric == 'DF-DST') {
                        if (flag != 'N' && inputparam && inputparam.length == 0) {
                            return { status: 200, targetStatus: targetStatus, data: inputparam };
                        } else if (!inputparam || (Array.isArray(inputparam) && inputparam.length == 0) || (inputparam && Object.keys(inputparam).length == 0)) {
                            throw new CustomException('Data not found', 404);
                        }              
                        let schemaRes = {};
                        if (internalEdges && internalEdges.hasOwnProperty(poNode[j].nodeId)) {
                            let edgesarr = internalEdges[poNode[j].nodeId];
                            let dstVariable = '';
                            let dtovariable = '';
                            let sourcepath = [];
                            let targetpath = [];
                            let sourcekey = [];
                            let rootarr = [];
                            let datamappingarr = []
                            let numberArr: string[] = Array.from({ length: 101 }, (_, i) => (i).toString());
                            let loopingkey = Object.keys(customConfig.data);
                            let afp = {};
                            for (let s = 0; s < edgesarr.length; s++) {
                            let connectedid = edgesarr[s].source;
                            for (let h = 0; h < poNode.length; h++) {
                                if (connectedid == poNode[h].nodeId) {
                                let conncectedNodename = poNode[h].nodeName;
                                let conncectedNodeType = poNode[h].nodeType;
                                afp[connectedid] = JSON.parse(await this.redisService.getJsonData(processedKey + upId + ':NPV:' + conncectedNodename + '.PRO', collectionName));
                                }
                            }
                            }
                            for (let j = 0; j < edgesarr.length; j++) {
                            let b = 0;
                            let srcNodename = null;
                            sourcekey.push(edgesarr[j].source);
                            let sourceNodeId = edgesarr[j].source;
                            for (let c = 0; c < poNode.length; c++) {
                                if (sourceNodeId != poNode[1].nodeId) {
                                if (sourceNodeId == poNode[c].nodeId) {
                                    srcNodename = poNode[c].nodeName;
                                }
                                }
                            }
                            var srcHandle = edgesarr[j].sourceHandle.split('|');
                            if (srcHandle) {
                                dstVariable = srcHandle.includes('HeaderParams') ? srcHandle[1] : srcHandle[srcHandle.length - 1];
                                if (dstVariable.includes('.')) {
                                let src = srcHandle[1].split('.');
                                if (src[src.length - 1] == 'schema') {
                                    b++;
                                }
                                let srcvariable = src.filter((item) => !this.statickeyword.includes(item));
                                dstVariable = srcvariable.join('.');

                                if (dstVariable.startsWith('items.')) {
                                    dstVariable = dstVariable.replace('items.', '');
                                }
                                if (dstVariable.includes('.items.')) {
                                    dstVariable = dstVariable.replaceAll('.items.', '[0].');
                                }

                                if (dstVariable.includes('.') && dstVariable.startsWith('parameters.')) {
                                    let apiKey = ndp[sourceNodeId].apiKey;
                                    let apidata = JSON.parse(await this.redisService.getJsonData(apiKey, collectionName));
                                    let apinodeid = Object.keys(apidata)[0];
                                    let method = apidata[apinodeid].data?.method;
                                    let parameter = apidata[apinodeid].data[method.toLowerCase()];
                                    dstVariable = _.get(parameter, dstVariable);
                                }
                                if (dstVariable.includes('.')) {
                                    let dst = dstVariable.split('.')
                                    dstVariable = (dst.filter(item => !numberArr.includes(item))).join('.');
                                }
                                if (srcHandle.includes('ifo')) {
                                    dstVariable = dstVariable.toLowerCase()
                                }
                                if (srcNodename)
                                    sourcepath.push(srcNodename + '.' + dstVariable);
                                else sourcepath.push(dstVariable);
                                } else {
                                if (srcHandle.includes('ifo')) {
                                    dstVariable = dstVariable.toLowerCase()
                                }
                                if (srcNodename)
                                    sourcepath.push(srcNodename + '.' + dstVariable);
                                else sourcepath.push(dstVariable);
                                }
                            }
                            let targetSplit = edgesarr[j].targetHandle.split('|');
                            let targetHandle = targetSplit.includes('HeaderParams') ? targetSplit[1] : targetSplit[targetSplit.length - 1];
                            if (targetHandle.includes('.')) {
                                let targetVaribale = targetHandle.split('.');
                                let staticRemove: any = targetVaribale.filter((item) => !this.statickeyword.includes(item));
                                rootarr.push(staticRemove.join('.'));
                                dtovariable = staticRemove.join('.');
                                if (dtovariable.includes('.items.')) {
                                dtovariable = dtovariable.replaceAll('.items.', '[0].');
                                }
                                targetpath.push(dtovariable);
                            } else {
                                dtovariable = targetHandle;
                                targetpath.push(dtovariable);
                            }
                            if (b > 0) {
                                let obj = {};
                                if (pfo?.length > 0) {
                                for (let p = 0; p < pfo.length; p++) {
                                    if (pfo[p].nodeId == sourceNodeId) {
                                    let schema = pfo[p]?.schema?.['requestBody']['content']['application/json']['schema'];
                                    let res = this.generateMockData(schema);
                                    inputparam = inputparam.flat()
                                    let keys = Object.keys(res);
                                    for (let item of keys) {
                                        if (Array.isArray(inputparam) && inputparam?.length > 0) {
                                        for (let i = 0; i < inputparam.length; i++) {                               
                                            if (srcNodename) {
                                            _.set(obj, item, _.get(inputparam[i], srcNodename + '.' + item));
                                            }
                                        else
                                            _.set(obj, item, _.get(inputparam[i], item));
                                        }
                                        } else if (typeof inputparam == 'object') {
                                        if (srcNodename)
                                            _.set(obj, item, _.get(inputparam, srcNodename + '.' + item));
                                        else
                                            _.set(obj, item, _.get(inputparam, item));
                                        }
                                    }
                                    }
                                }
                                schemaRes[dtovariable] = obj;
                                }
                            }
                            }
                            sourcekey = sourcekey.filter((item, index) => sourcekey.indexOf(item) === index);
                            for (let l = 0; l < loopingkey.length; l++) {
                            let routearr: any = [];
                            for (let m = 0; m < targetpath.length; m++) {
                                if (targetpath[m].includes(loopingkey[l])) {
                                routearr.push(rootarr[m]);
                                }
                            }
                            }
                            let edges = {};
                            edges['sourcepath'] = sourcepath;
                            edges['targetpath'] = targetpath;

                            if (edges['targetpath']?.length > 0) {
                            for (let k = 0; k < edges['targetpath'].length; k++) {
                                if (edges['targetpath'][k].startsWith('items.')) {
                                edges['targetpath'][k] = edges['targetpath'][k].replace('items.', '');
                                }
                            }
                            }
                            let finalRes = {};
                            let rootpatharr = await this.findCommonRoot(edges['targetpath']);
                            edges['targetpath'] = edges['targetpath'].map((path) => path.startsWith(rootpatharr + '.') ? path.slice(rootpatharr.length + 1) : path);
                            let demo
                            if (Array.isArray(inputparam)) {
                            inputparam = inputparam.flat()
                            demo = JSON.parse(await this.transformData(edges, inputparam));
                            } else if (Object.keys(inputparam).length > 0) {
                            demo = JSON.parse(await this.transformData(edges, [inputparam]));
                            }
                            if (currentFabric == 'DF-DFD') {
                            let dsSchema = JSON.parse(await this.redisService.getJsonData(key + 'DS_Schema', collectionName));
                            if (demo?.length > 0) {
                                for (let item1 of demo) {
                                item1 = this.transformBySchema(dsSchema, item1)
                                datamappingarr.push(item1)
                                }
                            }
                            } else {
                            datamappingarr = demo
                            }
                            if (rootpatharr) {
                            if (rootpatharr.includes('[0]')) {
                                rootpatharr = rootpatharr.replaceAll('[0]', '');
                            }
                            finalRes[rootpatharr] = datamappingarr;
                            } else {
                            finalRes = datamappingarr;
                            }             
                            if (schemaRes && Object.keys(schemaRes).length > 0) {
                            let schemakey = Object.keys(schemaRes);
                            if (Array.isArray(finalRes)) {
                                for (let i = 0; i < finalRes.length; i++) {
                                if (finalRes[i][schemakey[i]] == null) {
                                    finalRes[i][schemakey[i]] = schemaRes[schemakey[i]];
                                }
                                }
                            } else if (finalRes && Object.keys(finalRes).length > 0) {
                                if (finalRes[schemakey[0]] == null) {
                                finalRes[schemakey[0]] = schemaRes[schemakey[0]];
                                }
                            }
                            }             
                            
                            if (finalRes)
                            await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success',targetQueue, token, currentFabric, sourceStatus, inputparam, finalRes);
                            await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: inputparam, response: finalRes } }));

                            if (finalRes && Array.isArray(finalRes) && finalRes?.length > 0) {
                            inputparam = await this.assignToInputParam(inputparam,nodeName,finalRes[0])
                            }else if (finalRes && Object.keys(finalRes).length > 0){
                            inputparam = await this.assignToInputParam(inputparam,nodeName,finalRes)
                            }

                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(rootpatharr ? [finalRes] : finalRes), collectionName, 'response')
                            this.logger.log('DataSet Node Completed');
                            if (currentFabric == 'DF-DFD')
                            return { status: 200, targetStatus: targetStatus, data: rootpatharr ? [finalRes] : finalRes };
                            else
                            return { status: 200, targetStatus: targetStatus, data: inputparam };
                        } else {
                            throw new CustomException(`Data Mapping not found for ${poNode[j].nodeName}`, 404);
                        }
                        }
                    }
                } catch (error) {
                await this.exceptionhandler(failureQueue, suspiciousQueue, errorQueue, error, upId, nodeId, failureTargetStatus, inputparam)
                }
            }

            //API Output Node
            if (nodeType == 'api_outputnode' && poNode[j].nodeId == nodeId) {
                try {
                    this.logger.log(`${poNode[j].nodeName} Api output node Started`)
                    if (!inputparam) throw new CustomException('Input param not found', 404)
                    // let customConfig: any = JSON.parse(await this.redisService.getJsonDataWithPath(key + 'NDP', '.' + poNode[j].nodeId, collectionName))


                    let customConfig = ndp[poNode[j].nodeId]
                    let referenceKey = customConfig?.apiKey
                    let nodeVersion = customConfig?.nodeVersion
                    if (!nodeVersion) throw new CustomException('Node version not found', 404)
                    if (!referenceKey) throw new CustomException('API Reference key not found', 404)
                    let ApiKey, errdata
                    if (referenceKey.endsWith(':NDP'))
                        ApiKey = referenceKey.replace('NDP', '')
                    errdata = {
                        tname: 'TE',
                        errGrp: 'Technical',
                        fabric: 'API',
                        errType: 'Warning',
                        errCode: '001'
                    }
                    let queryarr = [], headersarr = [], patharr = []

                    let edgesarr
                    let RCMresult: any = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam, processedKey + upId, currentFabric, SessionInfo)
                    let customcoderesult, zenresult
                    if (RCMresult) {
                        zenresult = RCMresult.rule
                        customcoderesult = RCMresult.code
                    }

                    let internalMappingNodes = poJson?.internalMappingNodes;
                    let internalMappedObj = {};
                    for (let n = 0; n < internalMappingNodes.length; n++) {
                        if (internalMappingNodes[n].nodeId == poNode[j].nodeId && internalMappingNodes[n].ifo?.length > 0) {
                            for (let f = 0; f < internalMappingNodes[n].ifo.length; f++) {
                                if (internalMappingNodes[n].ifo[f].value) {
                                    internalMappedObj[internalMappingNodes[n].ifo[f].key] = internalMappingNodes[n].ifo[f].value;
                                } else {
                                    internalMappedObj[internalMappingNodes[n].ifo[f].key] = '';
                                }
                            }
                        }
                    }

                    let ifoObj = {};
                    if (internalMappedObj && Object.keys(internalMappedObj).length > 0) {
                        for (let item in internalMappedObj) {
                            ifoObj[item.toLowerCase()] = internalMappedObj[item];
                        }
                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(ifoObj), collectionName, 'ifo',);
                        if (Array.isArray(inputparam) && inputparam?.length > 0) {
                            for (let i = 0; i < inputparam.length; i++) {
                                inputparam[i] = Object.assign(inputparam[i], ifoObj)
                            }
                        } else if (typeof inputparam == 'object') {
                            inputparam = Object.assign(inputparam, ifoObj)
                        }
                    }

                    let codeObj = {}
                    if (customcoderesult != undefined) {
                        if (customcoderesult && Object.keys(customcoderesult).length > 0) {
                            for (let item in customcoderesult) {
                                codeObj[item.toLowerCase()] = customcoderesult[item]
                            }
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);

                            if (Array.isArray(inputparam) && inputparam?.length > 0) {
                                for (let i = 0; i < inputparam.length; i++) {
                                    inputparam[i] = Object.assign(inputparam[i], codeObj)
                                }
                            } else if (typeof inputparam == 'object') {
                                inputparam = Object.assign(inputparam, codeObj)
                            }
                        }
                    }
                    // console.log('inputparam',JSON.stringify(inputparam));

                    
                    
               
                    let nds = JSON.parse(await this.redisService.getJsonData(ApiKey + 'NDS', collectionName))
                    if (!nds) throw new CustomException('nds not found', 404)

                    let nodeid = nds[0].id

                    let data = JSON.parse(await this.redisService.getJsonDataWithPath(ApiKey + 'NDP', nodeid + '.data', collectionName))
                    let methodName = data?.method
                    if (!methodName) throw new CustomException('Method not found', 404)
                    methodName = methodName.toLowerCase()
                    //if (methodName == 'post')
                    //inputparam = await this.keysToLowerCaseOnly(inputparam)
                    let parameterJson = data?.parameterJson
                    let query = inputparam[inputparam.length - 1]?.query
                    let params = inputparam[inputparam.length - 1]?.params
                    let header = inputparam[inputparam.length - 1]?.header
                    if (query && Object.keys(query).length == 0) {
                        query = parameterJson?.query
                    }
                    if (params && Object.keys(params).length == 0) {
                        params = parameterJson?.path
                    }
                    if (header && Object.keys(header).length == 0) {
                        header = parameterJson?.header
                    }
                    let parameters = data[methodName]?.parameters
                    if (parameters?.length > 0) {
                        for (let a = 0; a < parameters.length; a++) {
                            if (parameters[a].in == 'query' && parameters[a].required == true) {
                                queryarr.push(parameters[a].name)
                            } else if (parameters[a].in == 'header' && parameters[a].required == true) {
                                headersarr.push(parameters[a].name)
                            } else if (parameters[a].in == 'path' && parameters[a].required == true) {
                                patharr.push(parameters[a].name)
                            }
                        }
                    }
                    let models = data?.specification?.data?.responsemodels
                    if (!models) {
                        throw new CustomException('Models not found', 404)
                    }
                    let responses = data[methodName]['responses']
                    let statusCodeArr = Object.keys(responses)
                    let returnStscode, returnDescription
                    let orderSchema, schema
                    for (let s = 0; s < statusCodeArr.length; s++) {
                        if (statusCodeArr[s] == '200') {
                            returnStscode = 200
                            returnDescription = data[methodName]['responses']['200'].description
                            let content = data[methodName]['responses']['200']['content']
                            if (content) {
                                orderSchema = data[methodName]['responses']['200']['content'][Object.keys(content)[0]]['schema']
                                if (data[methodName]['responses']['200']?.['content']?.['application/json']?.['schema']?.['properties'])
                                    schema = data[methodName]['responses']['200']['content']['application/json']['schema']['properties']
                            }
                        }
                        else if (statusCodeArr[s] == '201') {
                            returnStscode = 201
                            returnDescription = data[methodName]['responses']['201'].description
                            let content = data[methodName]['responses']['201']['content']
                            if (content) {
                                orderSchema = data[methodName]['responses']['201']['content'][Object.keys(content)[0]]['schema']
                                if (data[methodName]['responses']['201']?.['content']?.['application/json']?.['schema']?.['properties'])
                                    schema = data[methodName]['responses']['201']['content']['application/json']['schema']['properties']
                            }
                        }
                        else if (statusCodeArr[s] == '204') {
                            returnStscode = 204
                            returnDescription = data[methodName]['responses']['204'].description
                            let content = data[methodName]['responses']['204']['content']
                            if (content) {
                                orderSchema = data[methodName]['responses']['204']['content'][Object.keys(content)[0]]['schema']
                                if (data[methodName]['responses']['204']?.['content']?.['application/json']?.['schema']?.['properties'])
                                    schema = data[methodName]['responses']['204']['content']['application/json']['schema']['properties']
                            }
                        }
                    }

                    if (internalEdges && internalEdges.hasOwnProperty(poNode[j].nodeId) && internalEdges[(poNode[j].nodeId)].length > 0) {
                        edgesarr = internalEdges[poNode[j].nodeId];
                    }
                    else if (methodName == 'post' || methodName == 'patch' || methodName == 'put' || methodName == 'delete') {
                        return { status: returnStscode, targetStatus: targetStatus, data: { description: returnDescription || [] } }
                    }
                    else {
                        throw new CustomException(`Edges not found in ${poNode[j].nodeId}`, 404)
                    }
                    let dstVariable = ''
                    let dtovariable = ''
                    let sourcepath = []
                    let targetpath = []
                    let edges = {}
                    let rootarr = []
                    let loopingkey
                    if (schema) {
                        loopingkey = Object.keys(schema)
                    }
                    for (let j = 0; j < edgesarr.length; j++) {
                        let srcNodename = null;
                        let sourceNodeId = edgesarr[j].source;
                        for (let c = 0; c < poNode.length; c++) {
                            if (sourceNodeId == poNode[c].nodeId) {
                                srcNodename = poNode[c].nodeName;
                            }
                        }

                        let srcHandle = (edgesarr[j].sourceHandle).split('|')
                        let keyname = ndp[edgesarr[j].source].apiKey
                        if (keyname.endsWith(':DS_Schema')) {
                            keyname = keyname.replace('DS_Schema', '')
                        }
                        keyname = keyname.split(':')
                        let name = (keyname[1] + keyname[5] + keyname[7] + keyname[9] + keyname[11] + keyname[13]).replace(/[-_]/g, '')
                        if (srcHandle) {
                            if (srcHandle.includes('ifo') && (Object.keys(codeObj).length > 0 || Object.keys(ifoObj).length > 0)) {
                                srcNodename = null;
                            }
                            dstVariable = srcHandle.includes('HeaderParams') ? srcHandle[2] : srcHandle[srcHandle.length - 1]
                            if (dstVariable.includes('.')) {
                                let src = srcHandle[1].split('.')
                                src = src.filter(item => !this.numberArr.includes(item));
                                dstVariable = src.filter(item => !this.statickeyword.includes(item)).join('.');
                                if (dstVariable.startsWith('items.')) {
                                    dstVariable = dstVariable.replaceAll('items.', '')
                                }
                                if (dstVariable.includes('.items.')) {
                                    dstVariable = dstVariable.replaceAll('.items.', '[0].')
                                }
                                if (methodName == 'post' || methodName == 'patch' || methodName == 'put' || methodName == 'delete') {
                                    if (srcHandle.includes('ifo'))
                                        dstVariable = dstVariable.toLowerCase()
                                    if (srcNodename)
                                        sourcepath.push(srcNodename + '.' + dstVariable)
                                    else
                                        sourcepath.push(dstVariable)
                                } else {
                                    if (srcHandle.includes('ifo'))
                                        dstVariable = dstVariable.toLowerCase()
                                    sourcepath.push(name + '_' + dstVariable)
                                }
                            }
                            else {
                                if (methodName == 'post' || methodName == 'patch' || methodName == 'put' || methodName == 'delete') {
                                    if (srcHandle.includes('ifo'))
                                        dstVariable = dstVariable.toLowerCase()

                                    if (srcNodename)
                                        sourcepath.push(srcNodename + '.' + dstVariable)
                                    else
                                        sourcepath.push(dstVariable)
                                } else {
                                    if (srcHandle.includes('ifo'))
                                        dstVariable = dstVariable.toLowerCase()
                                    sourcepath.push(name + '_' + dstVariable)
                                }
                            }
                        }
                        let targetsplit = (edgesarr[j].targetHandle).split('|')
                        let targetHandle = targetsplit.includes('HeaderParams') ? targetsplit[2] : targetsplit[targetsplit.length - 1]
                        if (targetHandle.includes('.')) {
                            let targetVaribale = targetHandle.split('.')
                            let staticRemove: any = targetVaribale.filter(item => !this.statickeyword.includes(item));
                            rootarr.push(staticRemove.join('.'))
                            staticRemove = staticRemove.map((item) => {
                                if (models[item] === 'array') {
                                    return `${item}[0]`;
                                }
                                return item;
                            });
                            dtovariable = staticRemove.filter(item => !this.numberArr.includes(item)).join('.');
                            targetpath.push(dtovariable)
                        }
                        else {
                            targetpath.push(targetHandle)
                        }
                    }

                    let finalobj = {}
                    if (loopingkey?.length > 0) {
                        for (let l = 0; l < loopingkey.length; l++) {
                            let targetarr = [], sourcearr = [], routearr: any = []
                            for (let m = 0; m < targetpath.length; m++) {
                                if (targetpath[m].includes(loopingkey[l])) {
                                    targetarr.push(targetpath[m])
                                    sourcearr.push(sourcepath[m])
                                    routearr.push(rootarr[m])
                                }
                            }
                            //console.log("sourcearr",sourcearr);
                            // console.log("targetarr",targetarr);

                            if (targetarr.length > 0) {
                                edges['sourcepath'] = sourcearr
                                edges['targetpath'] = targetarr
                                // console.log('input',JSON.stringify(inputparam));
                                // console.log('edges',edges);


                                let rootpath
                                if (methodName == 'get')
                                    edges = await this.reorderTargetPaths(edges, orderSchema)

                                if (routearr.length > 1)
                                    rootpath = await this.findCommonRoot(routearr)

                                let rootpatharr = await this.findCommonRoot(edges['targetpath'])
                                edges['targetpath'] = edges['targetpath'].map(path => path.startsWith(rootpatharr + ".") ? path.slice(rootpatharr.length + 1) : path);
                                let datamappingarr = []
                                let orderdata = []
                                let pathdata = []
                                let querydata = []
                                let demo
                                //console.log("inputparam",inputparam);
                                //console.log("edges",edges);

                                if ((currentFabric == 'DF-DFD' || ((currentFabric == 'PF-PFD' || currentFabric == 'PF-SCDL') && (methodName == 'post' || methodName == 'patch' || methodName == 'put' || methodName == 'delete')))) {
                                    if (Array.isArray(inputparam) && inputparam.length > 0) {
                                        demo = JSON.parse(await this.transformData(edges, inputparam, methodName))
                                    } else {
                                        demo = JSON.parse(await this.transformData(edges, [inputparam], methodName))
                                    }
                                } else {
                                    inputparam = inputparam.slice(0, -1);
                                    demo = JSON.parse(await this.APItransformData(edges, [inputparam]))
                                }
                                if (methodName == 'get') {
                                    for (let item1 of demo) {
                                        item1 = await this.validateType(item1, models, errdata, token, ApiKey)
                                        datamappingarr.push(item1)
                                    }
                                    orderdata = datamappingarr
                                } else {
                                    orderdata = demo
                                }
                                if (query && Object.keys(query).length > 0) {
                                    query = Object.fromEntries(Object.entries(query).filter(([_, value]) => value !== '' && value !== null && value !== undefined));
                                    querydata.push(await this.recursiveFilter(query, orderdata))
                                    orderdata = querydata.flat()
                                }

                                if (params && Object.keys(params).length > 0) {
                                    params = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== '' && value !== null && value !== undefined));
                                    pathdata.push(await this.recursiveFilter(params, orderdata))
                                    orderdata = pathdata.flat()
                                }
                                let rootsplit, Aoresult
                                if (rootpath)
                                    rootsplit = rootpath.split('.')
                                if (rootsplit?.length > 0) {
                                    Aoresult = {};
                                    let current = Aoresult;
                                    rootsplit.forEach((key, index) => {
                                        const type = models[key];
                                        if (type === "array") {
                                            current[key] = [];
                                            if (index === rootsplit.length - 1) {
                                                if (Array.isArray(orderdata)) {
                                                    current[key] = orderdata
                                                } else {
                                                    current[key].push(orderdata);
                                                }
                                            } else {
                                                let newItem = {};
                                                current[key].push(newItem);
                                                current = newItem;
                                            }

                                        } else if (type === "object") {
                                            current[key] = {};
                                            if (index === rootsplit.length - 1) {
                                                if (Array.isArray(orderdata)) {
                                                    current[key] = orderdata[0]
                                                } else {
                                                    current[key] = orderdata
                                                }
                                            } else {
                                                current = current[key];
                                            }
                                        }
                                    });
                                }
                                if (Aoresult && Object.keys(Aoresult).length > 0) {
                                    Object.assign(finalobj, Aoresult)
                                } else {
                                    if (Array.isArray(orderdata)) {
                                        Object.assign(finalobj, orderdata[0])
                                    } else {
                                        Object.assign(finalobj, orderdata)
                                    }
                                }
                            }
                        }
                    } else {
                        if (targetpath.length > 0) {
                            edges['sourcepath'] = sourcepath
                            edges['targetpath'] = targetpath
                            let rootpath
                            //if (methodName == 'get')
                            // edges = await this.reorderTargetPaths(edges, orderSchema)
                            if (rootarr.length > 1)
                                rootpath = await this.findCommonRoot(rootarr)

                            let rootpatharr = await this.findCommonRoot(edges['targetpath'])
                            edges['targetpath'] = edges['targetpath'].map(path => path.startsWith(rootpatharr + ".") ? path.slice(rootpatharr.length + 1) : path);
                            let datamappingarr = []
                            let orderdata = []
                            let pathdata = []
                            let querydata = []
                            let demo
                            //console.log("inputparam",inputparam);
                            //console.log("edges",edges);

                            if ((currentFabric == 'DF-DFD' || ((currentFabric == 'PF-PFD' || currentFabric == 'PF-SCDL') && methodName == 'post'))) {
                                if (Array.isArray(inputparam) && inputparam.length > 0) {
                                    demo = JSON.parse(await this.transformData(edges, inputparam, methodName))
                                } else {
                                    demo = JSON.parse(await this.transformData(edges, [inputparam], methodName))
                                }
                            } else {
                                inputparam = inputparam.slice(0, -1);
                                demo = JSON.parse(await this.APItransformData(edges, [inputparam]))
                            }
                            if (methodName == 'get') {
                                for (let item1 of demo) {
                                    item1 = await this.validateType(item1, models, errdata, token, ApiKey)
                                    datamappingarr.push(item1)
                                }
                                orderdata = datamappingarr
                            } else {
                                orderdata = demo
                            }
                            if (query && Object.keys(query).length > 0) {
                                query = Object.fromEntries(Object.entries(query).filter(([_, value]) => value !== '' && value !== null && value !== undefined));
                                querydata.push(await this.recursiveFilter(query, orderdata))
                                orderdata = querydata.flat()
                            }

                            if (params && Object.keys(params).length > 0) {
                                params = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== '' && value !== null && value !== undefined));
                                pathdata.push(await this.recursiveFilter(params, orderdata))
                                orderdata = pathdata.flat()
                            }
                            let rootsplit, Aoresult
                            if (rootpath)
                                rootsplit = rootpath.split('.')
                            if (rootsplit?.length > 0) {
                                Aoresult = {};
                                let current = Aoresult;
                                rootsplit.forEach((key, index) => {
                                    const type = models[key];
                                    if (type === "array") {
                                        current[key] = [];
                                        if (index === rootsplit.length - 1) {
                                            if (Array.isArray(orderdata)) {
                                                current[key] = orderdata
                                            } else {
                                                current[key].push(orderdata);
                                            }
                                        } else {
                                            let newItem = {};
                                            current[key].push(newItem);
                                            current = newItem;
                                        }

                                    } else if (type === "object") {
                                        current[key] = {};
                                        if (index === rootsplit.length - 1) {
                                            if (Array.isArray(orderdata)) {
                                                current[key] = orderdata[0]
                                            } else {
                                                current[key] = orderdata
                                            }
                                        } else {
                                            current = current[key];
                                        }
                                    }
                                });
                            }
                            if (Aoresult && Object.keys(Aoresult).length > 0) {
                                Object.assign(finalobj, Aoresult)
                            } else {
                                let resultarr = []
                                if (Array.isArray(orderdata)) {
                                    for (let i = 0; i < orderdata.length; i++) {
                                        resultarr.push(orderdata[i])
                                    }
                                    finalobj = resultarr
                                } else {
                                    Object.assign(finalobj, orderdata)
                                }
                            }
                        }
                    }

                    if (upId) {
                        await this.redisService.setStreamData(srcQueue, collectionName + 'TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus, data: { request: inputparam, response: finalobj } }))
                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(inputparam), collectionName, 'request')
                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(finalobj), collectionName, 'response')
                    }
                    this.logger.log(`Api output node Completed`)
                    return { status: returnStscode, targetStatus: targetStatus, data: finalobj || { description: returnDescription } }
                } catch (error) {
                    // console.log(error);

                    if (failureQueue)
                        await this.redisService.setStreamData(failureQueue, 'TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: failureTargetStatus, data: { request: inputparam, response: error } }))
                    if (suspiciousQueue)
                        await this.redisService.setStreamData(suspiciousQueue, 'TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: failureTargetStatus, data: { request: inputparam, response: error } }))
                    if (errorQueue)
                        await this.redisService.setStreamData(errorQueue, 'TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: failureTargetStatus, data: { request: inputparam, response: error } }))
                    if (error?.response?.data)
                        throw { statusCode: error.status, message: error.response.data }
                    else if (error?.response && error?.status)
                        throw { statusCode: error.status, message: error.response };
                    else if (error?.message)
                        throw { statusCode: 404, message: error.message };
                    else
                        throw { statusCode: 400, message: error };
                }
            }
           

            //jsonparser node
            if (nodeType == 'jsonparsernode' && poNode[j].nodeId == nodeId) {
                try {
                    this.logger.log('jsonparsernode Node Started');
                    let customConfig = ndp[poNode[j].nodeId]
                    let referenceKey = customConfig?.apiKey;
                    let nodeVersion = customConfig?.nodeVersion;
                    let oprname: any;
                    let jsonschema, mapObj = {}, valid, apiResult
                    if (!referenceKey)
                        throw new CustomException('Reference key not found', 404);
                    let apikeyfabric = await this.CommonService.splitcommonkey(referenceKey, 'FNK')
                    let ApiConfig: any = JSON.parse(await this.redisService.getJsonData(referenceKey, collectionName));

                    if (!ApiConfig || Object.keys(ApiConfig).length == 0)
                        throw new CustomException('Reference key value not found', 404);
                    let apiVal: any = Object.values(ApiConfig)[0];
                    if (apikeyfabric == 'DF-DST')
                        jsonschema = apiVal.dataset
                    else
                        jsonschema = apiVal.data

                    if (nodeVersion?.toLowerCase() == 'v1') {
                        oprname = customConfig?.data?.operationName.value;
                    }

                    if (oprname == "parseJson") {
                        if (internalEdges && internalEdges.hasOwnProperty(poNode[j].nodeId)) {
                            let currentNodeEdge = internalEdges[poNode[j].nodeId];
                            let afp = {};
                            for (let s = 0; s < currentNodeEdge.length; s++) {
                                let connectedid = currentNodeEdge[s].source;
                                for (let h = 0; h < poNode.length; h++) {
                                    if (connectedid == poNode[h].nodeId) {
                                        let conncectedNodename = poNode[h].nodeName;
                                        let conncectedNodeType = poNode[h].nodeType;
                                        afp[connectedid] = JSON.parse(await this.redisService.getJsonData(processedKey + upId + ':NPV:' + conncectedNodename + '.PRO', collectionName));
                                    }
                                }
                            }
                            for (let e = 0; e < currentNodeEdge.length; e++) {
                                let connectedid = currentNodeEdge[e].source;
                                let srcHandle = currentNodeEdge[e].sourceHandle;
                                let targetHandle = currentNodeEdge[e].targetHandle;
                                if (srcHandle) {
                                    let srcSplit = srcHandle.split('|');
                                    let srcVal = srcSplit.includes('HeaderParams') ? srcSplit[1] : srcSplit[srcSplit.length - 1];
                                    let sourceFilteredVal
                                    if (srcVal.includes('.')) {
                                        let staticRemove = srcVal.split('.');
                                        sourceFilteredVal = staticRemove.filter((item) => !this.statickeyword.includes(item));
                                        sourceFilteredVal = sourceFilteredVal.join('.');
                                        if (sourceFilteredVal.includes('.') && sourceFilteredVal.startsWith('parameters.')) {
                                            let apiKey = ndp[connectedid].apiKey;
                                            let apidata = JSON.parse(await this.redisService.getJsonData(apiKey, collectionName));
                                            let apinodeid = Object.keys(apidata)[0];
                                            let method = apidata[apinodeid].data?.method;
                                            let parameter = apidata[apinodeid].data[method.toLowerCase()];
                                            sourceFilteredVal = _.get(parameter, sourceFilteredVal);
                                        }
                                    } else {
                                        sourceFilteredVal = srcVal;
                                    }

                                    for (let h = 0; h < poNode.length; h++) {
                                        if (connectedid == poNode[h].nodeId) {
                                            var conncectedNodeType = poNode[h].nodeType;
                                        }
                                    }

                                    if (srcVal.includes('requestBody') || conncectedNodeType == 'humantasknode' || srcVal.includes('parameters')) {
                                        inputCollection = afp[connectedid]['request'];
                                        let codedata = afp[connectedid]['code'];
                                        if (codedata && Object.keys(codedata).length > 0) {
                                            inputCollection = Object.assign(inputCollection, codedata);
                                        }
                                    } else if (srcVal.includes('responses') || conncectedNodeType == 'jsonparsernode') {
                                        inputCollection = afp[connectedid]['response'];
                                        let codedata = afp[connectedid]['code'];
                                        if (inputCollection && Array.isArray(inputCollection) && inputCollection.length > 0) {
                                            inputCollection = inputCollection[0];
                                        }
                                        if (codedata && Object.keys(codedata).length > 0) {
                                            inputCollection = Object.assign(inputCollection, codedata);
                                        }
                                    } else {
                                        inputCollection = afp[connectedid]['ifo'];
                                        let codedata = afp[connectedid]['code'];
                                        if (codedata && Object.keys(codedata).length > 0) {
                                            inputCollection = Object.assign(inputCollection, codedata);
                                        }
                                    }

                                    if (targetHandle) {
                                        let targetSplit = targetHandle.split('|');
                                        let targetVal = targetSplit.includes('HeaderParams') ? targetSplit[1] : targetSplit[targetSplit.length - 1];
                                        if (sourceFilteredVal.startsWith('items.')) {
                                            sourceFilteredVal = sourceFilteredVal.replace('items.', '');
                                        }
                                        if (sourceFilteredVal.includes('.items.')) {
                                            sourceFilteredVal = sourceFilteredVal.replaceAll('.items.', '[0].');
                                        }
                                        sourceFilteredVal = sourceFilteredVal.toLowerCase();
                                        sourceFilteredVal = sourceFilteredVal.trim();
                                    }
                                    if (typeof inputCollection[sourceFilteredVal] === 'string') {
                                        mapObj[sourceFilteredVal] = JSON.parse(inputCollection[sourceFilteredVal])
                                    } else {
                                        mapObj[sourceFilteredVal] = inputCollection[sourceFilteredVal];
                                    }
                                }
                            }
                        }
                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(mapObj), collectionName, 'request');
                        const validate = this.ajv.compile(jsonschema);
                        valid = validate(mapObj);
                        if (!valid) {
                            throw new CustomException('Payload does not match schema', 400);
                        } else {
                            inputparam = await this.assignToInputParam(inputparam, nodeName, mapObj)
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(mapObj), collectionName, 'response');
                            await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', token, targetQueue, currentFabric, sourceStatus, inputparam, inputparam);
                            await this.redisService.setStreamData(srcQueue, 'TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: inputparam, response: inputparam } }));
                        }

                    } else if (oprname == "flattenJson") {
                        let methodName = (Object.keys(jsonschema)[0]).toLowerCase()
                        let serverUrl = jsonschema?.serverUrl
                        let endPoint = jsonschema?.endPoint
                        let apiurl = serverUrl + endPoint
                        if (methodName == 'get') {
                            const requestConfig: AxiosRequestConfig = {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }
                            apiResult = await this.executeApiCall(methodName, apiurl, requestConfig)
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(apiResult), collectionName, 'request');
                            if (apiResult.statusCode == 201 || apiResult.statusCode == 200) {
                                apiResult = apiResult?.result;
                            } else {
                                throw apiResult;
                            }
                        }
                        mapObj = await this.flattenJson(apiResult)
                    }
                    inputparam = await this.assignToInputParam(inputparam, nodeName, mapObj)
                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(mapObj), collectionName, 'response');
                    RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam, processedKey + upId, currentFabric, SessionInfo);
                    if (RCMresult) {
                        zenresult = RCMresult.rule;
                        customcoderesult = RCMresult.code;
                    }
                    if (customcoderesult && customcoderesult != undefined && customcoderesult != null) {
                        codeObj = await this.codeAssign(customcoderesult)
                        if (codeObj) {
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);
                        }
                    }
                    await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', token, targetQueue, currentFabric, sourceStatus, inputparam, inputparam);
                    await this.redisService.setStreamData(srcQueue, 'TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: inputparam, response: inputparam } }));

                    this.logger.log('jsonparser node completed');
                    if (currentFabric == 'PF-PFD')
                        return { status: 200, targetStatus: targetStatus, data: inputparam };
                    else
                        return { status: 200, targetStatus: targetStatus, data: mapObj };

                } catch (error) {
                    await this.exceptionhandler(failureQueue, suspiciousQueue, errorQueue, error, upId, nodeId, failureTargetStatus, inputparam)
                }
            }

            //json2xmlparser node
            if (nodeType == 'json2xmlnode' && poNode[j].nodeId == nodeId) {
                try {
                    this.logger.log('json2xmlnode Node Started')
                    let checkdata
                    if (internalEdges && internalEdges.hasOwnProperty(poNode[j].nodeId)) {
                        let currentNodeEdge = internalEdges[poNode[j].nodeId];
                        let afp = {};
                        for (let s = 0; s < currentNodeEdge.length; s++) {
                            let connectedid = currentNodeEdge[s].source;
                            for (let h = 0; h < poNode.length; h++) {
                                if (connectedid == poNode[h].nodeId) {
                                    let conncectedNodename = poNode[h].nodeName;
                                    afp[connectedid] = JSON.parse(await this.redisService.getJsonData(processedKey + upId + ':NPV:' + conncectedNodename + '.PRO', collectionName));
                                }
                            }
                        }
                        for (let e = 0; e < currentNodeEdge.length; e++) {
                            let srcHandle = currentNodeEdge[e].sourceHandle;
                            let connectedid = currentNodeEdge[e].source;
                            if (srcHandle) {
                                let srcSplit = srcHandle.split('|');
                                let srcVal = srcSplit.includes('HeaderParams') ? srcSplit[1] : srcSplit[srcSplit.length - 1];
                                let sourceFilteredVal
                                if (srcVal.includes('.')) {
                                    let staticRemove = srcVal.split('.');
                                    sourceFilteredVal = staticRemove.filter((item) => !this.statickeyword.includes(item)).join('.');
                                    if (sourceFilteredVal.includes('.') && sourceFilteredVal.startsWith('parameters.')) {
                                        let apiKey = ndp[connectedid].apiKey;
                                        let apidata = JSON.parse(await this.redisService.getJsonData(apiKey, collectionName));
                                        let apinodeid = Object.keys(apidata)[0];
                                        let method = apidata[apinodeid].data?.method;
                                        let parameter = apidata[apinodeid].data[method.toLowerCase()];

                                        sourceFilteredVal = _.get(parameter, sourceFilteredVal);
                                    }
                                } else {
                                    sourceFilteredVal = srcVal;
                                }
                                for (var h = 0; h < poNode.length; h++) {
                                    if (connectedid == poNode[h].nodeId) {
                                        var conncectedNodename = poNode[h].nodeName;
                                        var conncectedNodeType = poNode[h].nodeType;
                                    }
                                }

                                if (srcVal.includes('requestBody') || conncectedNodeType == 'humantasknode' || srcVal.includes('parameters')) {
                                    inputCollection = afp[connectedid]['request'];
                                    let codedata = afp[connectedid]['code'];
                                    if (codedata && Object.keys(codedata).length > 0) {
                                        inputCollection = Object.assign(inputCollection, codedata);
                                    }
                                } else if (srcVal.includes('responses') || conncectedNodeType == 'xml2jsonnode') {
                                    inputCollection = afp[connectedid]['response'];
                                    let codedata = afp[connectedid]['code'];
                                    if (inputCollection && Array.isArray(inputCollection) && inputCollection.length > 0) {
                                        inputCollection = inputCollection[0];
                                    }
                                    if (codedata && Object.keys(codedata).length > 0) {
                                        inputCollection = Object.assign(inputCollection, codedata);
                                    }
                                } else {
                                    inputCollection = afp[connectedid]['ifo'];
                                    let codedata = afp[connectedid]['code'];
                                    if (codedata && Object.keys(codedata).length > 0) {
                                        inputCollection = Object.assign(inputCollection, codedata);
                                    }
                                }
                                checkdata = _.get(inputCollection, sourceFilteredVal)
                            }
                        }
                    }
                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(checkdata), collectionName, 'request')
                    const jsonString = JSON.stringify(checkdata);
                    const xmlData = json2xml(jsonString, { compact: true, spaces: 4 });
                    inputparam = await this.assignToInputParam(inputparam, nodeName, { json2xmldata: xmlData })
                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify({ json2xmldata: xmlData }), collectionName, 'response')
                    RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam, processedKey + upId, currentFabric, SessionInfo);
                    if (RCMresult) {
                        zenresult = RCMresult.rule;
                        customcoderesult = RCMresult.code;
                    }
                    if (customcoderesult && customcoderesult != undefined && customcoderesult != null) {
                        codeObj = await this.codeAssign(customcoderesult)
                        if (codeObj)
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);
                    }
                    await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, inputparam, inputparam)
                    await this.redisService.setStreamData(srcQueue, 'TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus, data: { request: inputparam, response: { json2xmldata: xmlData } } }))
                    this.logger.log('json2xmlnode node completed')
                    return { status: 200, targetStatus: targetStatus, data: inputparam }
                } catch (error) {
                    await this.exceptionhandler(failureQueue, suspiciousQueue, errorQueue, error, upId, nodeId, failureTargetStatus, inputparam)
                }
            }

            //xml2jsonparser node
            if (nodeType == 'xml2jsonnode' && poNode[j].nodeId == nodeId) {
                try {
                    this.logger.log('xml2jsonnode Node Started')
                    let checkdata
                    if (internalEdges && internalEdges.hasOwnProperty(poNode[j].nodeId)) {
                        let currentNodeEdge = internalEdges[poNode[j].nodeId];
                        let afp = {};
                        for (let s = 0; s < currentNodeEdge.length; s++) {
                            let connectedid = currentNodeEdge[s].source;
                            for (let h = 0; h < poNode.length; h++) {
                                if (connectedid == poNode[h].nodeId) {
                                    let conncectedNodename = poNode[h].nodeName;
                                    afp[connectedid] = JSON.parse(await this.redisService.getJsonData(processedKey + upId + ':NPV:' + conncectedNodename + '.PRO', collectionName));
                                }
                            }
                        }
                        for (let e = 0; e < currentNodeEdge.length; e++) {
                            let srcHandle = currentNodeEdge[e].sourceHandle;
                            let connectedid = currentNodeEdge[e].source;
                            if (srcHandle) {
                                let srcSplit = srcHandle.split('|');
                                let srcVal = srcSplit.includes('HeaderParams') ? srcSplit[1] : srcSplit[srcSplit.length - 1];
                                let sourceFilteredVal
                                if (srcVal.includes('.')) {
                                    let staticRemove = srcVal.split('.');
                                    sourceFilteredVal = staticRemove.filter((item) => !this.statickeyword.includes(item)).join('.');
                                    if (sourceFilteredVal.includes('.') && sourceFilteredVal.startsWith('parameters.')) {
                                        let apiKey = ndp[connectedid].apiKey;
                                        let apidata = JSON.parse(await this.redisService.getJsonData(apiKey, collectionName));
                                        let apinodeid = Object.keys(apidata)[0];
                                        let method = apidata[apinodeid].data?.method;
                                        let parameter = apidata[apinodeid].data[method.toLowerCase()];

                                        sourceFilteredVal = _.get(parameter, sourceFilteredVal);
                                    }
                                } else {
                                    sourceFilteredVal = srcVal;
                                }
                                for (var h = 0; h < poNode.length; h++) {
                                    if (connectedid == poNode[h].nodeId) {
                                        var conncectedNodename = poNode[h].nodeName;
                                        var conncectedNodeType = poNode[h].nodeType;
                                    }
                                }
                                if (srcVal.includes('requestBody') || conncectedNodeType == 'humantasknode' || srcVal.includes('parameters')) {
                                    inputCollection = afp[connectedid]['request'];
                                    let codedata = afp[connectedid]['code'];
                                    if (codedata && Object.keys(codedata).length > 0) {
                                        inputCollection = Object.assign(inputCollection, codedata);
                                    }
                                } else if (srcVal.includes('responses') || conncectedNodeType == 'xml2jsonnode') {
                                    inputCollection = afp[connectedid]['response'];
                                    let codedata = afp[connectedid]['code'];
                                    if (inputCollection && Array.isArray(inputCollection) && inputCollection.length > 0) {
                                        inputCollection = inputCollection[0];
                                    }
                                    if (codedata && Object.keys(codedata).length > 0) {
                                        inputCollection = Object.assign(inputCollection, codedata);
                                    }
                                } else {
                                    inputCollection = afp[connectedid]['ifo'];
                                    let codedata = afp[connectedid]['code'];
                                    if (codedata && Object.keys(codedata).length > 0) {
                                        inputCollection = Object.assign(inputCollection, codedata);
                                    }
                                }
                                checkdata = _.get(inputCollection, sourceFilteredVal)
                            }
                        }
                    }
                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(checkdata), collectionName, 'request')
                    let FormatFn = new Function(`return ${checkdata}`);
                    let parsedXml = FormatFn();
                    let jsonData = await parseStringPromise(parsedXml);
                    inputparam = await this.assignToInputParam(inputparam, nodeName, { xml2jsondata: jsonData })
                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify({ xml2jsondata: jsonData }), collectionName, 'response')
                    RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam, processedKey + upId, currentFabric, SessionInfo);
                    if (RCMresult) {
                        zenresult = RCMresult.rule;
                        customcoderesult = RCMresult.code;
                    }
                    if (customcoderesult && customcoderesult != undefined && customcoderesult != null) {
                        codeObj = await this.codeAssign(customcoderesult)
                        if (codeObj)
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);
                    }
                    await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, inputparam, inputparam)
                    await this.redisService.setStreamData(srcQueue, 'TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus, data: { request: inputparam, response: { xml2jsondata: jsonData } } }))

                    this.logger.log('xml2jsonnode node completed')
                    if (currentFabric == 'PF-PFD')
                        return { status: 200, targetStatus: targetStatus, data: inputparam }
                    else
                        return { status: 200, targetStatus: targetStatus, data: jsonData }
                } catch (error) {
                    await this.exceptionhandler(failureQueue, suspiciousQueue, errorQueue, error, upId, nodeId, failureTargetStatus, inputparam)
                }
            }

            //xlsx2jsonConverternode
            if (nodeType == 'xlsx2jsonconverternode' && poNode[j].nodeId == nodeId) {
                try {
                    this.logger.log('xlsx2jsonconverter Node Started')
                    let fileType, customConfig, nodeVersion, childInsertArr = []
                    customConfig = ndp[poNode[j].nodeId]
                    nodeVersion = customConfig?.nodeVersion;
                    if (!nodeVersion)
                        throw new CustomException('Node version not found', 404);

                    if (nodeVersion.toLowerCase() == 'v1') {
                        fileType = customConfig?.data?.filetype?.value
                    }
                    if (internalEdges && internalEdges.hasOwnProperty(poNode[j].nodeId)) {
                        let currentNodeEdge = internalEdges[poNode[j].nodeId];
                        let srcIdArr = []
                        let mapObj, tempQryVal, targetVal, staticRemove, textobj

                        for (let s = 0; s < currentNodeEdge.length; s++) {
                            let source = currentNodeEdge[s].source
                            let sourceHandle = currentNodeEdge[s].sourceHandle
                            sourceHandle = (sourceHandle.split('|')).find(item => item.startsWith('responses.') || item.startsWith('requestBody.') || item == 'ifo');

                            if (!sourceHandle || sourceHandle.startsWith('responses.')) {
                                sourceHandle = 'responses'
                            } else if (sourceHandle.startsWith('requestBody.')) {
                                sourceHandle = 'requestBody'
                            } else if (sourceHandle == 'ifo') {
                                sourceHandle = 'ifo'
                            }
                            let existing = srcIdArr.find(item => item.source === source);

                            if (existing) {
                                existing.sourceHandle.push(sourceHandle);
                            } else {
                                srcIdArr.push({
                                    source: source,
                                    sourceHandle: [sourceHandle]
                                });
                            }
                        }
                        let nodesArr = []
                        let filteredIds = [];
                        for (let s = 0; s < srcIdArr.length; s++) {
                            let connectedid = srcIdArr[s].source
                            let connectedHandle = srcIdArr[s].sourceHandle
                            for (var h = 0; h < pfo.length; h++) {
                                if (connectedid == pfo[h].nodeId) {
                                    let tempArr = []
                                    var conncectedNodename = pfo[h].nodeName
                                    var conncectedNodeType = pfo[h].nodeType
                                    let innerpathVal
                                    let afpValue = JSON.parse(await this.redisService.getJsonData(processedKey + upId + ':NPV:' + conncectedNodename + '.PRO', collectionName))
                                    if (connectedHandle.includes('requestBody')) {
                                        innerpathVal = afpValue.request
                                        if (conncectedNodeType == 'api_inputnode') {
                                            innerpathVal = await this.keysToLowerCaseOnly(innerpathVal)
                                        }
                                        tempArr = await this.combineData(innerpathVal, tempArr)
                                    }
                                    if (connectedHandle.includes('responses')) {
                                        innerpathVal = afpValue.response
                                        if (conncectedNodeType == 'api_inputnode') {
                                            innerpathVal = await this.keysToLowerCaseOnly(innerpathVal)
                                        }
                                        if (poNode[j].nodeType == 'xlsx2jsonconverternode') {
                                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(innerpathVal), collectionName, 'request')

                                            if (fileType === 'csv') {
                                                innerpathVal = await this.parseCsv(innerpathVal);
                                            } else if (fileType === 'xlsx' || fileType === 'ods') {
                                                let res = await this.parseXlsx(innerpathVal);
                                                let LowerArr = []
                                                for (let i = 0; i < res.length; i++) {
                                                    LowerArr.push(await this.keysToLowerCaseOnly(res[i]))
                                                }
                                                innerpathVal = LowerArr
                                            } else {
                                                throw new CustomException('File type not supported', 404);
                                            }
                                        }
                                        tempArr = await this.combineData(innerpathVal, tempArr)
                                    }
                                    if (connectedHandle.includes('ifo')) {
                                        innerpathVal = afpValue.ifo
                                        if (conncectedNodeType == 'api_inputnode') {
                                            innerpathVal = await this.keysToLowerCaseOnly(innerpathVal)
                                        }
                                        tempArr = await this.combineData(innerpathVal, tempArr)
                                        innerpathVal = afpValue.code
                                        if (conncectedNodeType == 'api_inputnode') {
                                            innerpathVal = await this.keysToLowerCaseOnly(innerpathVal)
                                        }
                                        tempArr = await this.combineData(innerpathVal, tempArr)
                                    }
                                    if (tempArr.length > 0) {
                                        nodesArr.push(tempArr)
                                        filteredIds.push(connectedid)
                                    }
                                }
                            }
                        }
                        srcIdArr = filteredIds;
                        let mergedRecords = await this.getCombinations(srcIdArr, nodesArr)
                        for (let m = 0; m < mergedRecords.length; m++) {
                            mapObj = {};
                            tempQryVal = [];
                            let inputCollection = mergedRecords[m]
                            for (let e = 0; e < currentNodeEdge.length; e++) {
                                let schemaRes = {};
                                let b = 0;
                                let sourceFilteredVal, targetFilteredVal
                                let srcHandle = currentNodeEdge[e].sourceHandle;
                                let targetHandle = currentNodeEdge[e].targetHandle;
                                let connectedid = currentNodeEdge[e].source;
                                if (srcIdArr.includes(connectedid)) {
                                    if (srcHandle) {
                                        let srcSplit = srcHandle.split('|');
                                        let srcVal = srcSplit.includes('HeaderParams') ? srcSplit[1] : srcSplit[srcSplit.length - 1];
                                        if (srcVal.includes('.') && !srcVal.includes('text/plain') && !srcVal.includes('*/*')) {
                                            let src = srcSplit[1].split('.');
                                            if (src[src.length - 1] == 'schema') {
                                                b++;
                                            }
                                        }
                                        if (srcVal.includes('.')) {
                                            let staticRemove = srcVal.split('.');
                                            sourceFilteredVal = staticRemove.filter((item) => !this.statickeyword.includes(item));
                                            if (sourceFilteredVal?.length > 0) {
                                                sourceFilteredVal = sourceFilteredVal.join('.');
                                                if (sourceFilteredVal.startsWith('items.')) {
                                                    sourceFilteredVal = sourceFilteredVal.replace('items.', '',);
                                                }
                                                sourceFilteredVal = sourceFilteredVal.toLowerCase();
                                                if (sourceFilteredVal.includes('.items.')) {
                                                    sourceFilteredVal = sourceFilteredVal.replace('.items.', '[0]',);
                                                }
                                                if (sourceFilteredVal && sourceFilteredVal.includes('.')) {
                                                    let dst = sourceFilteredVal.split('.')
                                                    sourceFilteredVal = (dst.filter(item => !this.numberArr.includes(item))).join('.');
                                                }
                                                sourceFilteredVal = sourceFilteredVal.trim();
                                                sourceFilteredVal = connectedid + '.' + sourceFilteredVal
                                            }
                                        } else {
                                            sourceFilteredVal = srcVal.toLowerCase();
                                            sourceFilteredVal = srcVal.trim();
                                            sourceFilteredVal = connectedid + '.' + sourceFilteredVal
                                        }
                                        if (targetHandle) {
                                            let targetSplit = targetHandle.split('|');
                                            targetVal = targetSplit.includes('HeaderParams') ? targetSplit[1] : targetSplit[targetSplit.length - 1];
                                            if (targetVal.includes('.')) {
                                                staticRemove = targetVal.split('.');
                                                targetFilteredVal = staticRemove.filter((item) => !this.statickeyword.includes(item));
                                                if (targetFilteredVal && targetFilteredVal.length > 0) {
                                                    targetFilteredVal = targetFilteredVal.join('.');
                                                    targetFilteredVal = targetFilteredVal.split('.');
                                                    targetFilteredVal = targetFilteredVal.filter((item) => !this.numberArr.includes(item));
                                                    targetFilteredVal = targetFilteredVal.join('.');
                                                    if (targetFilteredVal.includes('.items.')) {
                                                        targetFilteredVal = targetFilteredVal.replace('.items.', '[0]',);
                                                    }
                                                    if (targetFilteredVal.startsWith('items.')) {
                                                        targetFilteredVal = targetFilteredVal.replace('items.', '',);
                                                    }

                                                    if (mapObj) {
                                                        var setdata = _.get(mapObj, targetFilteredVal);
                                                        if (setdata?.length) {
                                                            targetFilteredVal = targetFilteredVal.replace('[0]', '[' + setdata.length + ']');
                                                        }
                                                    }
                                                    if (sourceFilteredVal && sourceFilteredVal.length > 0) {
                                                        sourceFilteredVal = sourceFilteredVal.toLowerCase();
                                                        sourceFilteredVal = sourceFilteredVal.trim();
                                                        _.set(mapObj, targetFilteredVal, _.get(inputCollection, sourceFilteredVal));
                                                    } else if (b == 0) {
                                                        let testdata = _.get(inputCollection, connectedid + '.schema')
                                                        testdata = testdata.replace(/\\n/g, '\n');
                                                        mapObj[targetFilteredVal] = testdata;
                                                    }
                                                } else if (sourceFilteredVal && sourceFilteredVal.length > 0) {
                                                    sourceFilteredVal = sourceFilteredVal.toLowerCase();
                                                    sourceFilteredVal = sourceFilteredVal.trim();
                                                    textobj = _.get(inputCollection, sourceFilteredVal);
                                                }
                                            } else {
                                                sourceFilteredVal = sourceFilteredVal.toLowerCase();
                                                sourceFilteredVal = sourceFilteredVal.trim();
                                                _.set(mapObj, targetVal, _.get(inputCollection, sourceFilteredVal));
                                            }
                                            if (b > 0) {
                                                let obj = {};
                                                if (pfo?.length > 0) {
                                                    for (let p = 0; p < pfo.length; p++) {
                                                        if (pfo[p].nodeId == connectedid) {
                                                            let schema = pfo[p]?.schema?.['requestBody']['content']['application/json']['schema'];
                                                            var res = await this.generateMockData(schema);
                                                            let keys = Object.keys(res);
                                                            for (let item of keys) {
                                                                if (Array.isArray(inputparam) && inputparam?.length > 0) {
                                                                    let tempobj
                                                                    for (let r = 0; r < inputparam.length; r++) {
                                                                        tempobj = {}
                                                                        _.set(tempobj, item, _.get(inputparam[r], item));
                                                                        obj = Object.assign(obj, tempobj);
                                                                    }
                                                                } else if (typeof inputparam == 'object') {
                                                                    _.set(obj, item, _.get(inputparam, item));
                                                                }
                                                            }
                                                        }
                                                    }
                                                    schemaRes[targetFilteredVal] = obj;
                                                }
                                                if (schemaRes && Object.keys(schemaRes).length > 0) {
                                                    mapObj = Object.assign(mapObj, schemaRes);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            if (Object.keys(mapObj).length > 0) {
                                childInsertArr.push(mapObj);
                            }
                        }
                    }
                    if (childInsertArr?.length == 0) throw new CustomException(`Mapping was required in ${poNode[j].nodeName}`, 404)
                    inputparam = await this.assignToInputParam(inputparam, nodeName, childInsertArr)
                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(childInsertArr), collectionName, 'response')
                    RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam, processedKey + upId, currentFabric, SessionInfo);
                    if (RCMresult) {
                        zenresult = RCMresult.rule;
                        customcoderesult = RCMresult.code;
                    }
                    if (customcoderesult && customcoderesult != undefined && customcoderesult != null) {
                        codeObj = await this.codeAssign(customcoderesult)
                        if (codeObj)
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);
                    }
                    await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, inputparam, childInsertArr)
                    await this.redisService.setStreamData(srcQueue, 'TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus, data: { request: inputparam, response: childInsertArr } }))

                    this.logger.log('xlparsernode node completed')
                    return { status: 200, targetStatus: targetStatus, data: inputparam }

                } catch (error) {
                    //console.log('Error', error);
                    await this.exceptionhandler(failureQueue, suspiciousQueue, errorQueue, error, upId, nodeId, failureTargetStatus, inputparam)
                }
            }

            //Procedure Execution node
            if (nodeType == 'procedureexecutionnode' && poNode[j].nodeId == nodeId) {
                let rollbackConfig, status
                try {
                    this.logger.log(`${poNode[j].nodeName} procedureexecutionnode Started`)
                    let mapobj = {}, params, customConfig, procedurequery, client, executecommand
                    customConfig = ndp[poNode[j].nodeId]
                    rollbackConfig = ndp[poNode[j].nodeId]
                    let prcConf = await this.CommonService.procedureConfig(customConfig, collectionName)
                    client = prcConf.client
                    procedurequery = prcConf.procedurequery
                    params = prcConf.params
                    executecommand = prcConf.executecommand
                    let childInsertArr = []
                    if (internalEdges && internalEdges.hasOwnProperty(poNode[j].nodeId)) {
                        let currentNodeEdge = internalEdges[poNode[j].nodeId];
                        let mappedData = await this.mapEdgeValuesToParams(poNode, currentNodeEdge, inputparam, processedKey, upId, collectionName, '', '', pfo)
                        childInsertArr = mappedData.childInsertArr
                    }
                    if (childInsertArr?.length > 0) {
                        for (let i = 0; i < childInsertArr.length; i++) {
                            mapobj = childInsertArr[i]
                            if (params?.length > 0) {
                                for (let a = 0; a < params.length; a++) {
                                    let key = params[a]?.key?.value
                                    let value = params[a]?.value?.value
                                    if (value?.includes("session.")) {
                                        value = sobj[value]
                                    }
                                    if (key && value)
                                        mapobj[key] = value
                                }
                            }
                            if (mapobj && Object.keys(mapobj).length > 0) {
                                Object.keys(mapobj).forEach(key => {
                                    const regex = new RegExp(`\\$\\$${key}`, 'g');
                                    const value = typeof mapobj[key] === 'string' ? `'${mapobj[key]}'` : mapobj[key];
                                    executecommand = executecommand.replace(regex, value);
                                });
                            } else {
                                throw new CustomException('params was required in ' + nodeName, 400)
                            }
                        }
                    } else {
                        if (params?.length > 0) {
                            for (let a = 0; a < params.length; a++) {
                                let key = params[a]?.key?.value
                                let value = params[a]?.value?.value
                                if (value?.includes("session.")) {
                                    value = sobj[value]
                                }
                                if (key && value)
                                    mapobj[key] = value
                            }
                        }
                        if (mapobj && Object.keys(mapobj).length > 0) {
                            Object.keys(mapobj).forEach(key => {
                                const regex = new RegExp(`\\$\\$${key}`, 'g');
                                const value = typeof mapobj[key] === 'string' ? `'${mapobj[key]}'` : mapobj[key];
                                executecommand = executecommand.replace(regex, value);
                            });
                        }
                    }
                    if (filterData && Array.isArray(filterData) && filterData.length > 0) {
                        filterData.forEach((filterObj) => {
                            if (filterObj.nodeId == poNode[j].nodeId) {
                                const entries = Object.entries(filterObj).filter(([key]) => key !== 'nodeId',);
                                entries.forEach(([key, value]) => {
                                    let removedVal;
                                    if (key.includes('.')) {
                                        let s_item = key.split('.');
                                        removedVal = s_item.filter((item) => !this.statickeyword.includes(item)).join('.');
                                        if (removedVal.includes('.') && removedVal.startsWith('items.')) {
                                            removedVal = removedVal.replace('items.', '');
                                        }
                                    } else {
                                        removedVal = key
                                    }
                                    const regex = new RegExp(`\\$\\$\\$${removedVal}`, 'g');
                                    if (typeof value == 'number')
                                        executecommand = executecommand.replace(regex, `${value}`);
                                    else if (typeof value == 'string')
                                        executecommand = executecommand.replace(regex, `'${value}'`);
                                });
                            }
                        });
                    }
                    if (executecommand.includes('$$$') || executecommand.includes('$$'))
                        executecommand = executecommand.replace(/\${2,3}[a-zA-Z0-9_]+/g, 'NULL');
                    await client.connect();
                    await client.query(procedurequery)
                    const result = await client.query(`${executecommand}`);
                    await client.end();
                    if ((result.rows)?.length > 0) {
                        status = result.rows
                    } else if (result && currentFabric == 'PF-PFD') {
                        status = 'Success'
                    } else {
                        status = result.rows
                    }
                    if (!logicCenter && currentFabric == 'DF-DFD') {
                        let keys = await this.redisService.getKeys(dstkey + SessionToken.loginId + '_DS_Object', collectionName)
                        if (keys.length > 0) {
                            for (let a = 0; a < keys.length; a++) {
                                await this.redisService.deleteKey(keys[a], collectionName)
                            }
                        }
                        this.redisService.sethash(status, dstkey + SessionToken.loginId + '_DS_Object')
                        return { data: 'logicCenter' }
                    }
                    inputparam = await this.assignToInputParam(inputparam, nodeName, status)
                    RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam, processedKey + upId, currentFabric, SessionInfo)
                    if (RCMresult) {
                        zenresult = RCMresult.rule
                        customcoderesult = RCMresult.code
                    }

                    ifoObj = await this.ifoAssign(poJson?.internalMappingNodes, poNode[j].nodeId)
                    if (ifoObj && Object.keys(ifoObj).length > 0) {
                        if (currentFabric == 'PF-PFD')
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(ifoObj), collectionName, 'ifo',);
                        status = await this.codeORifoAndInputparamAssign(ifoObj, status)
                    }

                    if (customcoderesult && customcoderesult != undefined && customcoderesult != null) {
                        codeObj = await this.codeAssign(customcoderesult)
                        if (codeObj) {
                            if (currentFabric == 'PF-PFD')
                                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);
                            status = await this.codeORifoAndInputparamAssign(codeObj, status)
                        }
                    }
                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(status), collectionName, 'response')
                    await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, inputparam, inputparam)
                    await this.redisService.setStreamData(srcQueue, 'TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus, data: { request: inputparam, response: status } }))

                    this.logger.log('procedureExecution node completed')
                    if (currentFabric == 'PF-PFD')
                        return { status: 200, targetStatus: targetStatus, data: inputparam }
                    else
                        return { status: 200, targetStatus: targetStatus, data: status }
                } catch (error) {
                    // console.log("error",error);
                    await this.CommonService.checkRollBack(ndp, collectionName, 'rollback', {
                        key: processedKey + upId,
                        nodeid: rollbackConfig.nodeId,
                        nodename: rollbackConfig.nodeName,
                        savepoint: rollbackConfig.savePoint,
                        data: status
                    }
                    );
                    await this.exceptionhandler(failureQueue, suspiciousQueue, errorQueue, error, upId, nodeId, failureTargetStatus, inputparam)
                }
            }

            //Function node
            if (nodeType == 'function_node' && poNode[j].nodeId == nodeId) {
                let rollbackConfig, status
                try {
                    this.logger.log(`${poNode[j].nodeName} functionnode Started`)
                    let mapobj = {}, params, customConfig, procedurequery, client, dbType, executecommand
                    customConfig = ndp[poNode[j].nodeId]
                    rollbackConfig = ndp[poNode[j].nodeId]
                    let funConf = await this.CommonService.procedureConfig(customConfig, collectionName)
                    client = funConf.client
                    procedurequery = funConf.procedurequery
                    params = funConf.params
                    executecommand = funConf.executecommand
                    let childInsertArr = []
                    if (internalEdges && internalEdges.hasOwnProperty(poNode[j].nodeId)) {
                        let currentNodeEdge = internalEdges[poNode[j].nodeId];
                        let mappedData = await this.mapEdgeValuesToParams(poNode, currentNodeEdge, inputparam, processedKey, upId, collectionName,  '', '', pfo)
                        childInsertArr = mappedData.childInsertArr
                    }
                    if (childInsertArr?.length > 0) {
                        for (let i = 0; i < childInsertArr.length; i++) {
                            mapobj = childInsertArr[i]
                            if (params?.length > 0) {
                                for (let a = 0; a < params.length; a++) {
                                    let key = params[a]?.key?.value
                                    let value = params[a]?.value?.value
                                    if (value?.includes("session.")) {
                                        value = sobj[value]
                                    }
                                    if (key && value)
                                        mapobj[key] = value
                                }
                            }
                            if (mapobj && Object.keys(mapobj).length > 0) {
                                Object.keys(mapobj).forEach(key => {
                                    const regex = new RegExp(`\\$\\$${key}`, 'g');
                                    const value = typeof mapobj[key] === 'string' ? `'${mapobj[key]}'` : mapobj[key];
                                    executecommand = executecommand.replace(regex, value);
                                });
                            } else {
                                throw new CustomException('params was required in ' + nodeName, 400)
                            }
                        }
                    } else {
                        if (params?.length > 0) {
                            for (let a = 0; a < params.length; a++) {
                                let key = params[a]?.key?.value
                                let value = params[a]?.value?.value
                                if (value?.includes("session.")) {
                                    value = sobj[value]
                                }
                                if (key && value)
                                    mapobj[key] = value
                            }
                        }
                        if (mapobj && Object.keys(mapobj).length > 0) {
                            Object.keys(mapobj).forEach(key => {
                                const regex = new RegExp(`\\$\\$${key}`, 'g');
                                const value = typeof mapobj[key] === 'string' ? `'${mapobj[key]}'` : mapobj[key];
                                executecommand = executecommand.replace(regex, value);
                            });
                        }
                    }
                    if (executecommand.endsWith(';')) {
                        executecommand = executecommand.slice(0, -1);
                    }
                    let formKey: any = ``;
                    if (filterData && Array.isArray(filterData) && filterData.length > 0) {
                        filterData.forEach((filterObj) => {
                            if (filterObj.nodeId == poNode[j].nodeId) {
                                const entries = Object.entries(filterObj).filter(([key]) => key !== 'nodeId',);
                                entries.forEach(([key, value]) => {
                                    let removedVal;
                                    if (key.includes('.')) {
                                        let s_item = key.split('.');

                                        removedVal = s_item.filter((item) => !this.statickeyword.includes(item)).join('.');
                                        // console.log("removedVal", removedVal);

                                        if (removedVal.includes('.') && removedVal.startsWith('items.')) {
                                            removedVal = removedVal.replace('items.', '');
                                        }
                                    } else {
                                        removedVal = key
                                    }

                                    if (value && typeof value == 'number') {
                                        formKey = formKey + ` ${removedVal} = ${value} AND`;
                                    } else if (value && typeof value == 'string' && value != '') {
                                        formKey = formKey + ` ${removedVal} = '${value}' AND`;
                                    } else if (Array.isArray(value) && value.length > 0) {
                                        let s = ''
                                        for (let item of value) {
                                            s = s + `'${item}',`
                                        }
                                        if (s.endsWith(',')) {
                                            s = s.slice(0, -1);
                                        }
                                        formKey = formKey + ` ${removedVal}  IN (${s}) AND`;
                                    }

                                });
                            }
                        });
                        if (formKey.endsWith(' AND')) {
                            formKey = formKey.slice(0, -4);
                        }
                        if (formKey)
                            executecommand = await this.CommonService.appendWhereClause(executecommand, formKey);

                    }
                    if (executecommand.includes('$$$') || executecommand.includes('$$'))
                        executecommand = executecommand.replace(/\${2,3}[a-zA-Z0-9_]+/g, 'NULL');
                    await client.connect();
                    await client.query(procedurequery)
                    const result = await client.query(`${executecommand}`);
                    await client.end();
                    if ((result.rows)?.length > 0) {
                        status = result.rows
                    } else if (result && currentFabric == 'PF-PFD') {
                        status = 'Success'
                    } else {
                        status = result.rows
                    }
                    // console.log("status", status);

                    if (!logicCenter && currentFabric == 'DF-DFD') {
                        let keys = await this.redisService.getKeys(dstkey + SessionToken.loginId + '_DS_Object', collectionName)
                        if (keys.length > 0) {
                            for (let a = 0; a < keys.length; a++) {
                                await this.redisService.deleteKey(keys[a], collectionName)
                            }
                        }
                        this.redisService.sethash(status, dstkey + SessionToken.loginId + '_DS_Object')
                        return { data: 'logicCenter' }
                    }
                    // inputparam = await this.assignToInputParam(inputparam,nodeName,status)
                    RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam, processedKey + upId, currentFabric, SessionInfo)
                    if (RCMresult) {
                        zenresult = RCMresult.rule
                        customcoderesult = RCMresult.code
                    }

                    ifoObj = await this.ifoAssign(poJson?.internalMappingNodes, poNode[j].nodeId)
                    if (ifoObj && Object.keys(ifoObj).length > 0) {
                        if (currentFabric == 'PF-PFD')
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(ifoObj), collectionName, 'ifo',);
                        status = await this.codeORifoAndInputparamAssign(ifoObj, status)
                    }

                    if (customcoderesult && customcoderesult != undefined && customcoderesult != null) {
                        codeObj = await this.codeAssign(customcoderesult)
                        if (codeObj) {
                            if (currentFabric == 'PF-PFD')
                                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);
                            status = await this.codeORifoAndInputparamAssign(codeObj, status)
                        }
                    }


                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(status), collectionName, 'response')
                    await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, inputparam, inputparam)
                    await this.redisService.setStreamData(srcQueue, 'TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus, data: { request: inputparam, response: status } }))
                    this.logger.log('functionnode node completed')
                    if (currentFabric == 'PF-PFD' || currentFabric == 'PF-SFD')
                        return { status: 200, targetStatus: targetStatus, data: inputparam }
                    else
                        return { status: 200, targetStatus: targetStatus, data: status }

                } catch (error) {
                    console.log("error", error);
                    await this.CommonService.checkRollBack(ndp, collectionName, 'rollback', {
                        key: processedKey + upId,
                        nodeid: rollbackConfig.nodeId,
                        nodename: rollbackConfig.nodeName,
                        savepoint: rollbackConfig.savePoint,
                        data: status
                    }
                    );
                    await this.exceptionhandler(failureQueue, suspiciousQueue, errorQueue, error, upId, nodeId, failureTargetStatus, inputparam)
                }
            }

        }
    }

    async sessionDecode(token,upId){
    try {
        let sobj = {},SessionInfo = {}
        let SessionToken = await this.jwtService.decode(token, { json: true });
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

        return {sobj,SessionInfo,SessionToken}
    } catch (error) {
    throw error
    }
    }

    async assign(apiResult, ifoObj, codeObj, inputparam, nodeName, mapObj) {
        try {
            let apichildResult:any
            if (typeof apiResult == 'string' || typeof apiResult == 'number' || typeof apiResult == 'boolean') {
                apichildResult = apiResult;
            } else if (apiResult && Array.isArray(apiResult) && apiResult.length > 0) {
                for (let a = 0; a < apiResult.length; a++) {
                    if (codeObj && Object.keys(codeObj).length > 0)
                        apiResult[a] = Object.assign(apiResult[a], codeObj);

                    if (ifoObj && Object.keys(ifoObj).length > 0)
                        apiResult[a] = Object.assign(apiResult[a], ifoObj);

                    let assigndata = Object.assign(mapObj, apiResult[a]);
                    if (inputparam) {
                        if (Array.isArray(inputparam) && inputparam.length > 0) {
                            for (let i = 0; i < inputparam.length; i++) {
                                inputparam[i] = Object.assign(inputparam[i], { [nodeName]: assigndata });
                            }
                        } else if (typeof inputparam == 'object') {
                            inputparam = Object.assign(inputparam, { [nodeName]: assigndata });
                        }
                    }
                }
                apichildResult.push(apiResult);
            } else if (apiResult && Object.keys(apiResult).length > 0) {
                if (codeObj && Object.keys(codeObj).length > 0)
                    apiResult = Object.assign(apiResult, codeObj);

                if (ifoObj && Object.keys(ifoObj).length > 0)
                    apiResult = Object.assign(apiResult, ifoObj);

                apiResult = Object.assign(mapObj, apiResult);
                if (inputparam) {
                    if (Array.isArray(inputparam) && inputparam.length > 0) {
                        for (let i = 0; i < inputparam.length; i++) {
                            inputparam[i] = Object.assign(inputparam[i], { [nodeName]: apiResult });
                        }
                    } else if (typeof inputparam == 'object') {
                        inputparam = Object.assign(inputparam, { [nodeName]: apiResult });
                    }
                }
                apichildResult = apiResult;
            }
            return { apichildResult, inputparam }
        } catch (error) {
            throw error
        }
    }

    async codeORifoAndInputparamAssign(customcoderesult, apires) {
        try {
            if (Array.isArray(customcoderesult) && customcoderesult.length > 0) {
                //for (let a = 0; a < customcoderesult.length; a++) {
                if (Array.isArray(apires) && apires.length > 0) {
                    for (let i = 0; i < apires.length; i++) {
                        Object.assign(apires[i], customcoderesult[i]);
                    }
                } else {
                    Object.assign(apires, customcoderesult[0]);
                }
                // }
            } else if (Object.keys(customcoderesult).length > 0) {
                if (Array.isArray(apires) && apires.length > 0) {
                    for (let i = 0; i < apires.length; i++) {
                        Object.assign(apires[i], customcoderesult);
                    }
                } else {
                    Object.assign(apires, customcoderesult);
                }

            }
            return apires
        } catch (error) {
            throw error
        }
    }

    ifoAssign(internalMappingNodes, nodeId) {
        const internalMappedObj = {};

        const node = internalMappingNodes?.find(n => n.nodeId === nodeId);
        if (!node?.ifo?.length) return internalMappedObj;

        for (const item of node.ifo) {
            if (item.path?.includes('|ifo|')) {
                internalMappedObj[item.key.toLowerCase()] = item.value || '';
            }
        }

        return internalMappedObj;
    }

    codeAssign(data: any) {
        if (Array.isArray(data)) {
            return data.map(item => this.codeAssign(item));
        }
        if (data !== null && typeof data === 'object') {
            return Object.fromEntries(
                Object.entries(data).map(([key, value]) => [
                    key.toLowerCase(),
                    this.codeAssign(value),
                ])
            );
        }
        return data;
    }

    async assignToInputParam(inputparam: any, nodeName: string, data: any) {
        // if (Array.isArray(inputparam) && inputparam.length > 0) {
        //   return inputparam.map(item => Object.assign({}, item, { [nodeName]: data }));
        // } else if (typeof inputparam === 'object' && inputparam !== null) {
        //   return Object.assign({}, inputparam, { [nodeName]: data });
        // }
        if(inputparam){
            if (Array.isArray(inputparam) && inputparam.length > 0) {
                for (let r = 0; r < inputparam.length; r++) {
                    inputparam[r] = Object.assign(inputparam[r], { [nodeName]: data });
                }
            } else if (Object.keys(inputparam).length > 0) {
                Object.assign(inputparam, { [nodeName]: data });
            }
            return inputparam;
        }
    }

    async executeApiCall(methodName: string, apiUrl: string, requestConfig: AxiosRequestConfig, body?: any): Promise<any> {
        let apiResult: any;
        switch (methodName.toLowerCase()) {
            case 'get':
                apiResult = await this.CommonService.getCall(apiUrl, requestConfig);
                break;
            case 'post':
                apiResult = await this.CommonService.postCall(apiUrl, body, requestConfig);
                break;
            case 'patch':
            case 'put':
                apiResult = await this.CommonService.patchCall(apiUrl, body, requestConfig);
                break;
            case 'delete':
                apiResult = await this.CommonService.deleteCall(apiUrl, requestConfig);
                break;
            default:
                throw new CustomException(`Unsupported HTTP method: ${methodName}`, 400);
        }

        if (apiResult.statusCode === 201 || apiResult.statusCode === 200) {
            return apiResult;
        } else {
            throw apiResult;
        }
    }

    async exceptionhandler(failureQueue, suspiciousQueue, errorQueue, error, upId, nodeId, failureTargetStatus, inputparam) {
     
        if (failureQueue)
            await this.redisService.setStreamData(failureQueue, 'TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: failureTargetStatus, data: { request: inputparam, response: error } }))
        if (suspiciousQueue)
            await this.redisService.setStreamData(suspiciousQueue, 'TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: failureTargetStatus, data: { request: inputparam, response: error } }))
        if (errorQueue)
            await this.redisService.setStreamData(errorQueue, 'TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: failureTargetStatus, data: { request: inputparam, response: error } }))
        if (error?.response?.data)
            throw { statusCode: error.status, message: error.response.data }
        else if (error?.response && error?.status)
            throw { statusCode: error.status, message: error.response };
        else if (error?.message)
            throw { statusCode: 404, message: error.message };
        else
            throw { statusCode: 400, message: error };
    }

    convertToKeyValue(data: string[]) {
        const obj: Record<string, any> = {};

        for (let i = 0; i < data.length; i += 2) {
            const key = data[i];
            const value = data[i + 1];
            obj[key] = value;
        }

        return [obj];
    }

    async parseCsv(csvString: string): Promise<any[]> {
        const result = csvtojson.parse(csvString, {
            header: true,
            skipEmptyLines: true,
        });

        if (result.errors.length) {
            throw new Error(`CSV Parsing Error: ${JSON.stringify(result.errors)}`);
        }

        return result.data;
    }


    async parseXlsx(xlsxString: any): Promise<any[]> {
        try {

            const buffer = Buffer.from(xlsxString, 'binary');
            const workbook = XLSX.read(buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0]; // Get the first sheet
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            return jsonData;

            // const buffer = Buffer.from(xlsxString, 'binary');     
            // const workbook = XLSX.read(buffer, { type: 'buffer' }); 
            // const sheetName = workbook.SheetNames[0];
            // const worksheet = workbook.Sheets[sheetName];      
            // return XLSX.utils.sheet_to_json(worksheet);

        } catch (error) {
            throw error
        }
    }

    async flattenJson(data: any): Promise<any[]> {
        if (!Array.isArray(data)) {
            data = [data];
        }
        return data.flatMap((item) => this.flattenObject(item));
    }

    private flattenObject(obj: any, parentKey = '', parentContext = {}): any[] {
        const result: any[] = [];

        const flatPart: Record<string, any> = {};
        const nestedArrays: Record<string, any[]> = {};

        for (const key in obj) {
            const value = obj[key];
            const newKey = parentKey ? `${parentKey}.${key}` : key;

            if (Array.isArray(value)) {
                nestedArrays[newKey] = value;
            } else if (value && typeof value === 'object') {

                const flattenedChildren = this.flattenObject(value, newKey, {
                    ...parentContext,
                    ...flatPart,
                });
                return flattenedChildren;
            } else {
                flatPart[newKey] = value;
            }
        }

        const arrayKeys = Object.keys(nestedArrays);
        if (arrayKeys.length === 0) {
            result.push({ ...parentContext, ...flatPart });
        } else {
            for (const key of arrayKeys) {
                const arr = nestedArrays[key];
                for (const element of arr) {
                    const flattenedChildren = this.flattenObject(element, key, {
                        ...parentContext,
                        ...flatPart,
                    });
                    result.push(...flattenedChildren);
                }
            }
        }
        return result;
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

    async transformData(edges, dataSets, methodName?): Promise<any> {

        let mappingConfig: MappingConfig

        if (methodName && methodName == 'post') {
            mappingConfig = await this.createMappingConfig(edges, dataSets)
        } else {
            const consolidateMappingConfig: MappingConfig = await this.createMappingConfig(edges, dataSets)
            mappingConfig = await this.consolidateArrayMappings(consolidateMappingConfig)
        }


        const stripIndexes = (path: string) => path.replace(/\[\d+\]/g, '');

        const setValueRecursively = (obj: Record<string, any>, path: string, value: any) => {
            const levels = path.split('.');

            if (levels.length === 1) {
                _.set(obj, path, value);
            } else {
                const currentKey = levels[0];
                const remainingPath = levels.slice(1).join('.');
                let currentValue = _.get(obj, currentKey, {});

                if (Array.isArray(currentValue)) {
                    if (remainingPath) {
                        currentValue.forEach((item, idx) => {
                            setValueRecursively(item, remainingPath, value);
                        });
                    } else {
                        currentValue = value;
                    }
                } else if (typeof currentValue === 'object' && currentValue !== null) {
                    setValueRecursively(currentValue, remainingPath, value);
                } else {
                    _.set(obj, path, value);
                }
                _.set(obj, currentKey, currentValue);
            }
        };
        const transformData = (data: any[], mapping: Record<string, any>): any[] => {
            return data.map((item) => {
                const transformedItem: Record<string, any> = {};

                for (const [targetPath, mapEntry] of Object.entries(mapping)) {
                    const cleanTargetPath = stripIndexes(targetPath);

                    if (typeof mapEntry === 'string') {
                        const value = _.get(item, mapEntry, null);
                        setValueRecursively(transformedItem, cleanTargetPath, value);
                    } else if (typeof mapEntry === 'object' && mapEntry.sourcePath) {
                        const arrayData = _.get(item, mapEntry.sourcePath, []);
                        const mappedArray = arrayData.map((entry: any) => {
                            const mappedObj: Record<string, any> = {};
                            for (const [targetKey, sourceKey] of Object.entries(mapEntry.arrayMap)) {
                                const value = _.get(entry, sourceKey, null);
                                _.set(mappedObj, targetKey, value);
                            }
                            return mappedObj;
                        });
                        setValueRecursively(transformedItem, cleanTargetPath, mappedArray);
                    }
                }

                return transformedItem;
            });
        };
        let transformedData = transformData(dataSets, mappingConfig);

        const cleanedData = this.processJson(transformedData);
        return JSON.stringify(cleanedData, null, 2);
    }

    async consolidateArrayMappings(
        mapping: Record<string, string | { sourcePath: string; arrayMap: Record<string, string> }>
    ): Promise<Record<string, any>> {
        const consolidated: Record<string, any> = {};
        const arrayGroups: Record<string, { sourcePath: string; arrayMap: Record<string, string> }> = {};

        for (const [key, value] of Object.entries(mapping)) {
            const isObjectWithArrayMap =
                typeof value === 'object' &&
                value !== null &&
                'sourcePath' in value &&
                'arrayMap' in value;

            const parts = key.split('.');
            const baseKey = parts[0];
            const nestedPrefix = parts.slice(1).join('.');
            if (isObjectWithArrayMap) {
                const { sourcePath, arrayMap } = value as {
                    sourcePath: string;
                    arrayMap: Record<string, string>;
                };

                if (!arrayGroups[baseKey]) {
                    arrayGroups[baseKey] = {
                        sourcePath,
                        arrayMap: {}
                    };
                }

                for (const [subKey, subVal] of Object.entries(arrayMap)) {
                    const finalKey = nestedPrefix ? `${nestedPrefix}.${subKey}` : subKey;
                    arrayGroups[baseKey].arrayMap[finalKey] = subVal;
                }
            } else if (typeof value === 'string' && key.includes('.')) {
                consolidated[key] = value;
            } else if (typeof value === 'string') {
                consolidated[key] = value;
            }
        }
        for (const [key, { sourcePath, arrayMap }] of Object.entries(arrayGroups)) {
            consolidated[key] = { sourcePath, arrayMap };
        }
        return consolidated;
    }


    async createMappingConfig(edges, dataSets) {
        const mappingConfig = {};
        const arrayFields = new Set();
        function traverse(obj, path = "") {
            if (Array.isArray(obj)) {
                const isArrayOfObjects = obj.every(item => typeof item === 'object');

                if (isArrayOfObjects) {
                    arrayFields.add(path);
                    if (obj.length > 0) {
                        traverse(obj[0], path);
                    }
                }
            } else if (typeof obj === "object" && obj !== null) {
                for (const key of Object.keys(obj)) {
                    const newPath = path ? `${path}.${key}` : key;
                    traverse(obj[key], newPath);
                }
            }
        }


        dataSets.forEach((singleDataset) => traverse(singleDataset));

        edges.sourcepath.forEach((source, index) => {
            const target = edges.targetpath[index];
            if (source.includes('.')) {

                const sourceParts = source.split(".");
                const targetParts = target.split(".");
                const arrayKey = targetParts.length > 1 ? targetParts.slice(0, -1).join(".") : targetParts[0];
                if (arrayFields.has(sourceParts[0])) {
                    if (!mappingConfig[arrayKey]) {
                        mappingConfig[arrayKey] = {
                            sourcePath: sourceParts[0],
                            arrayMap: {},
                        };
                    }
                    mappingConfig[arrayKey].arrayMap[targetParts.slice(-1)] = sourceParts.slice(-1)[0];
                } else {
                    mappingConfig[target] = source;
                }
            } else {
                mappingConfig[target] = source;
            }
        });

        return mappingConfig;
    }

    async mergingDataSet(dataSets) {
        var mergedData = [];
        const maxLength = Math.max(
            ...dataSets.map(dataset => dataset.length)
        );
        for (let i = 0; i < maxLength; i++) {
            var mergedItem: any = {};
            dataSets.forEach(dataset => {
                if (dataset[i]) {
                    Object.assign(mergedItem, dataset[i]);
                }
            });
            mergedData.push(mergedItem);
        }
        return mergedData;
    }

    removeNestedArrays(obj: any): any {
        if (Array.isArray(obj)) {
            return obj.flat().map((item) => this.removeNestedArrays(item));
        } else if (typeof obj === 'object' && obj !== null) {
            return Object.fromEntries(
                Object.entries(obj).map(([key, value]) => [key, this.removeNestedArrays(value)]),
            );
        }
        return obj;
    }

    processJson(data: any): any {
        return this.removeNestedArrays(data);
    }

    async findCommonRoot(paths: string[]): Promise<any> {
        if (!paths.length) return '';
        const splitPaths = paths.map(path => path.length > 1 && path.includes('.') ? path.split(".") : '');
        const minLength = Math.min(...splitPaths.map((p) => p.length));
        let commonRoot = [];
        for (let i = 0; i < minLength; i++) {
            const segment = splitPaths[0][i];
            if (splitPaths.every((p) => p[i] === segment)) {
                commonRoot.push(segment);
            } else {
                break;
            }
        }
        return commonRoot.join('.');
    }

    async reorderTargetPaths(edges, schema): Promise<any> {
        const generatedPaths: string[] = [];
        await this.extractPathsFromSchema(schema, '', generatedPaths);

        const orderedTargetPaths: string[] = [];
        const orderedSourcePaths: string[] = [];

        for (const path of generatedPaths) {
            const exactMatchIndex = edges.targetpath.indexOf(path);
            if (exactMatchIndex !== -1) {
                orderedTargetPaths.push(edges.targetpath[exactMatchIndex]);
                orderedSourcePaths.push(edges.sourcepath[exactMatchIndex]);
                continue;
            }
            const normalizedPath = path.replace(/\[0\]/g, '');
            const fuzzyMatchIndex = edges.targetpath.findIndex(
                p => p.replace(/\[0\]/g, '') === normalizedPath
            );

            if (fuzzyMatchIndex !== -1) {
                orderedTargetPaths.push(edges.targetpath[fuzzyMatchIndex]);
                orderedSourcePaths.push(edges.sourcepath[fuzzyMatchIndex]);
            }
        }

        return {
            sourcepath: orderedSourcePaths,
            targetpath: orderedTargetPaths
        };
    }

    async validateType(singleObj, model, errdata, token, ApiKey) {
        try {
            if (typeof singleObj == 'object' && !Array.isArray(singleObj)) {
                for (let item in singleObj) {

                    if (model[item] && model[item].includes(',')) {
                        let typeArr = model[item].split(',')
                        for (let t = 0; t < typeArr.length; t++) {
                            model[item] = typeArr[t]
                            await this.validateType(singleObj[item], model, errdata, token, ApiKey)
                        }
                    }

                    if (model[item] == 'array') {
                        if (Array.isArray(singleObj[item]) && singleObj[item].length > 0) {
                            for (let a = 0; a < singleObj[item].length; a++) {
                                await this.validateType(singleObj[item][a], model, errdata, token, ApiKey)
                            }
                            singleObj[item] = singleObj[item]

                        } else if (!(Array.isArray(singleObj[item])) && typeof singleObj[item] == 'object' && Object.keys(singleObj[item]).length > 0) {
                            await this.validateType(singleObj[item], model, errdata, token, ApiKey)
                            singleObj[item] = [singleObj[item]]
                            //await this.commonService.commonErrorLogs(errdata, token, ApiKey, 'Result expected to be an Array but got an object', 400)
                        } else if (typeof singleObj[item] == 'string' || typeof singleObj[item] == 'number') {
                            singleObj[item] = [singleObj[item]]
                        }
                    }
                    else if (model[item] == 'object') {
                        if (Array.isArray(singleObj[item]) && singleObj[item].length > 0) {
                            for (let a = 0; a < singleObj[item].length; a++) {
                                await this.validateType(singleObj[item][a], model, errdata, token, ApiKey)
                            }
                            singleObj[item] = singleObj[item][0]
                            //if (singleObj[item].length > 1)
                            // await this.commonService.commonErrorLogs(errdata, token, ApiKey, 'Result expected to be an Object but got an array', 400)
                        } else if (!(Array.isArray(singleObj[item])) && typeof singleObj[item] == 'object' && Object.keys(singleObj[item]).length > 0) {
                            await this.validateType(singleObj[item], model, errdata, token, ApiKey)
                            singleObj[item] = singleObj[item]
                        } else {
                            // console.log(333,singleObj[item]);                      
                        }
                    }
                    else if (model[item] == 'string') {
                        if (Array.isArray(singleObj[item])) {
                            // singleObj[item] = (Object.values(singleObj[item])).toString() 
                            singleObj[item] = singleObj[item][0]
                        } else if (singleObj[item] && typeof singleObj[item] == 'object' && Object.keys(singleObj[item]).length > 0) {
                            //if(Object.values(singleObj[item])[0])
                            //singleObj[item] = (Object.values(singleObj[item])[0]).toString()
                            singleObj[item] = singleObj[item]

                        } else if (typeof singleObj[item] == 'number') {
                            singleObj[item] = singleObj[item].toString()
                        }
                    }
                    else if (model[item] == 'number') {
                        if (Array.isArray(singleObj[item])) {
                            singleObj[item] = Number(Object.values(singleObj[item][0])[0])
                        } else if (singleObj[item] && typeof singleObj[item] == 'object' && Object.keys(singleObj[item]).length > 0) {
                            if (Number(Object.values(singleObj[item])[0]))
                                singleObj[item] = Number(Object.values(singleObj[item])[0])
                            else
                                singleObj[item] = singleObj[item]
                        } else if (typeof singleObj[item] == 'string') {
                            singleObj[item] = Number(singleObj[item])
                        }
                    }
                }
            }
            return singleObj

        } catch (error) {
            throw error
        }
    }

    async extractPathsFromSchema(schemaNode: any, currentPath: string, collectedPaths: string[]) {
        if (!schemaNode || typeof schemaNode !== 'object') return;
        if (schemaNode.allOf && Array.isArray(schemaNode.allOf)) {
            for (const subSchema of schemaNode.allOf) {
                this.extractPathsFromSchema(subSchema, currentPath, collectedPaths);
            }
        }
        if (schemaNode.oneOf && Array.isArray(schemaNode.oneOf)) {
            for (const subSchema of schemaNode.oneOf) {
                this.extractPathsFromSchema(subSchema, currentPath, collectedPaths);
            }
        }
        if ((schemaNode.type === 'object' || schemaNode.properties)) {
            const properties = schemaNode.properties || {};
            for (const [key, propSchema] of Object.entries(properties)) {
                const nextPath = currentPath ? `${currentPath}.${key}` : key;
                this.extractPathsFromSchema(propSchema, nextPath, collectedPaths);
            }
        }
        if ((schemaNode.type === 'array' || schemaNode.items)) {
            const arrayPath = `${currentPath}[0]`;
            this.extractPathsFromSchema(schemaNode.items, arrayPath, collectedPaths);
        }
        if (
            !schemaNode.properties &&
            !schemaNode.items &&
            !schemaNode.oneOf &&
            !schemaNode.allOf &&
            currentPath
        ) {
            collectedPaths.push(currentPath);
        }
    }

    async APItransformData(edges, dataSets): Promise<any> {
        const MergedDataset = await this.mergingDataSet(dataSets);
        const mappingConfig: MappingConfig = await this.APIcreateMappingConfig(edges, dataSets);

        const getValueFromPath = (data: any, path: string): any => {
            const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.');
            return parts.reduce((acc, part) => acc?.[part], data);
        };

        const setNestedValue = (obj: any, path: string, value: any) => {
            const parts = path.replace(/\[\d+\]/g, '').split('.');

            let current = obj;
            parts.forEach((part, index) => {
                if (index === parts.length - 1) {
                    current[part] = value;
                } else {
                    if (!current[part]) {
                        current[part] = {};
                    }
                    current = current[part];
                }
            });
        };

        const normalizeToArray = (value: any): any[] => {
            if (Array.isArray(value)) return value;
            if (value === null || value === undefined) return [];
            return [value];
        };

        const transformEntry = (entry: any, mapping: any) => {
            const transformed: any = {};

            for (const [targetPath, mapEntry] of Object.entries(mapping)) {
                if (typeof mapEntry === 'string') {
                    const value = getValueFromPath(entry, mapEntry);
                    setNestedValue(transformed, targetPath, value);
                } else if (
                    typeof mapEntry === 'object' &&
                    'sourcePath' in mapEntry &&
                    'arrayMap' in mapEntry
                ) {
                    const arrayConfig = mapEntry as ArrayMapConfig;
                    const rawSource = getValueFromPath(entry, arrayConfig.sourcePath);
                    const sourceArray = normalizeToArray(rawSource);

                    const mappedArray = sourceArray.map((item) => {
                        const mappedItem: any = {};
                        for (const [targetKey, sourceKey] of Object.entries(arrayConfig.arrayMap)) {
                            const value = getValueFromPath(item, sourceKey);
                            setNestedValue(mappedItem, targetKey, value);
                        }
                        return mappedItem;
                    });

                    setNestedValue(transformed, targetPath, mappedArray);
                }
            }

            return transformed;
        };

        const transformedData = MergedDataset.map((entry) =>
            transformEntry(entry, mappingConfig)
        );

        const cleanedData = await this.processJson(transformedData);
        return JSON.stringify(cleanedData, null, 2);
    }

    async APIcreateMappingConfig(edges: Record<string, string[]>, dataSet: any[]) {
        const mappingConfig: Record<string, any> = {};
        const arrayFields = new Set<string>();
        if (!edges || !Array.isArray(edges.sourcepath) || !Array.isArray(edges.targetpath)) {
            throw new Error("Invalid edges format: 'sourcepath' and 'targetpath' must be arrays");
        }
        function detectArrayPaths(obj: any, currentPath = "") {
            if (Array.isArray(obj)) {
                arrayFields.add(currentPath);
                if (obj.length > 0) detectArrayPaths(obj[0], currentPath);
            } else if (typeof obj === "object" && obj !== null) {
                for (const key in obj) {
                    const nextPath = currentPath ? `${currentPath}.${key}` : key;
                    detectArrayPaths(obj[key], nextPath);
                }
            }
        }
        if (dataSet.length > 0) detectArrayPaths(dataSet[0]);
        edges.sourcepath.forEach((sourcePath, index) => {
            const targetPath = edges.targetpath[index];

            const sourceParts = sourcePath.split(".");
            const targetParts = targetPath.split(".");
            const arrayIndex = targetParts.findIndex(part => /\[\d+\]/.test(part));
            if (arrayIndex !== -1) {
                const arrayKey = targetParts.slice(0, arrayIndex + 1).join(".");
                const cleanArrayKey = arrayKey.replace(/\[\d+\]/g, "");

                const arrayMapField = targetParts.slice(arrayIndex + 1).join(".");
                const arraySource = sourceParts.slice(arrayIndex + 1).join(".");
                const cleanSourcePrefix = sourceParts.slice(0, arrayIndex + 1).join(".").replace(/\[\d+\]/g, "");

                const isArray = [...arrayFields].some(arrayField =>
                    cleanSourcePrefix.startsWith(arrayField)
                );

                if (!mappingConfig[arrayKey]) {
                    mappingConfig[arrayKey] = {
                        sourcePath: isArray ? cleanSourcePrefix : sourcePath,
                        arrayMap: {}
                    };
                }

                if (arrayMapField) {
                    mappingConfig[arrayKey].arrayMap[arrayMapField] = arraySource;
                }

            } else {
                mappingConfig[targetPath] = sourcePath;
            }
        });

        return mappingConfig;
    }

    async recursiveFilter(query: any, orderdata: any[]) {
        if (!query || !orderdata?.length) return orderdata;
        let nestedValue
        return orderdata.filter(item => {
            return Object.entries(query).every(([key, value]) => {
                var data = this.toLowerCaseKeys(item)
                if (item[key]) {
                    nestedValue = key.split('.').reduce((acc, part) => acc?.[part], item)
                    if (typeof nestedValue == 'number')
                        nestedValue = nestedValue.toString()
                    return nestedValue === value;
                }
                else if (data[key.toLowerCase()]) {
                    nestedValue = key.toLowerCase().split('.').reduce((acc, part) => acc?.[part], data)
                    if (typeof nestedValue == 'number')
                        nestedValue = nestedValue.toString()
                    return nestedValue === value;
                } else {
                    return orderdata
                }

            });
        });
    }

    toLowerCaseKeys(obj: any) {
        if (Array.isArray(obj)) {
            return obj.map(this.toLowerCaseKeys);
        } else if (obj !== null && typeof obj === 'object') {
            return Object.fromEntries(
                Object.entries(obj).map(([key, value]) => [
                    key.toLowerCase(),
                    value
                ])
            );
        }
        return obj;
    }

    extractDataWithArrayExpansion(data: any, targetPaths: string[]): any {
        const result = {};
        for (const path of targetPaths) {
            const match = path.match(/(.+)\[0\]\.(.+)/);
            if (match) {
                const arrayPath = match[1];
                const remainingPath = match[2];
                const array = this.getNestedValue(data, arrayPath);
                if (Array.isArray(array)) {
                    for (let i = 0; i < array.length; i++) {
                        const fullPath = `${arrayPath}[${i}].${remainingPath}`;
                        const value = this.getNestedValue(data, fullPath);
                        this.setNestedValue(result, fullPath, value);
                    }
                }
            } else {
                const value = this.getNestedValue(data, path);
                this.setNestedValue(result, path, value);
            }
        }

        return result;
    }

    getNestedValue(obj: any, path: string): any {
        return path.split('.').reduce((acc, part) => {
            const match = part.match(/(\w+)\[(\d+)\]/);
            if (match) {
                const [, key, index] = match;
                return acc?.[key]?.[parseInt(index)];
            }
            return acc?.[part];
        }, obj);
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

    async DFDMapEdgeValues(poNode: any[], currentNodeEdge: any, inputparam: any, processedKey: string, upId: string, collectionName: string,  parameter: any, codeObj: any, pfo: any, fabric: any) {
        var mapObj = {};
        var textobj;
        var tempQryVal = [];
        let afp = {};
        for (let s = 0; s < currentNodeEdge.length; s++) {
            let connectedid = currentNodeEdge[s].source;
            for (var h = 0; h < poNode.length; h++) {
                if (connectedid == poNode[h].nodeId) {
                    var conncectedNodename = poNode[h].nodeName;
                    var conncectedNodeType = poNode[h].nodeType;
                    afp[connectedid] = JSON.parse(
                        await this.redisService.getJsonData(
                            processedKey +
                            upId +
                            ':NPV:' +
                            conncectedNodename +
                            '.PRO',
                            collectionName,
                        ),
                    );
                }
            }
        }

        for (let e = 0; e < currentNodeEdge.length; e++) {
            let inputCollection = {}
            var schemaRes = {};
            let b = 0;
            let srcHandle = currentNodeEdge[e].sourceHandle;
            let targetHandle = currentNodeEdge[e].targetHandle;
            let connectedid = currentNodeEdge[e].source;
            for (var h = 0; h < poNode.length; h++) {
                if (connectedid == poNode[h].nodeId) {
                    var conncectedNodeType = poNode[h].nodeType;
                }
            }
            if (srcHandle) {
                let srcSplit = srcHandle.split('|');
                if (srcSplit.includes('HeaderParams')) {
                    var srcVal = srcSplit[1];
                } else {
                    var srcVal = srcSplit[srcSplit.length - 1];
                }

                if (
                    srcVal.includes('.') &&
                    !srcVal.includes('text/plain') &&
                    !srcVal.includes('*/*')
                ) {
                    var src = srcSplit[1].split('.');
                    if (src[src.length - 1] == 'schema') {
                        b++;
                    }
                }
                if (srcVal.includes('.')) {
                    var staticRemove = srcVal.split('.');
                    var sourceFilteredVal = staticRemove.filter(
                        (item) => !this.statickeyword.includes(item),
                    );
                    if (sourceFilteredVal && sourceFilteredVal.length > 0) {
                        sourceFilteredVal = sourceFilteredVal.join('.');
                        if (
                            sourceFilteredVal.includes('.') &&
                            sourceFilteredVal.startsWith('parameters.')
                        ) {
                            sourceFilteredVal = _.get(
                                parameter,
                                sourceFilteredVal,
                            );
                        }
                        if (sourceFilteredVal.startsWith('items.')) {
                            sourceFilteredVal = sourceFilteredVal.replace(
                                'items.',
                                '',
                            );
                        }
                        sourceFilteredVal = sourceFilteredVal.toLowerCase();
                        if (sourceFilteredVal.includes('.items.')) {
                            var spilt = sourceFilteredVal.split('.items.');
                            var getdata = _.get(inputparam, spilt[0]);
                        }
                        if (getdata?.length > 0) {
                            for (let a = 0; a < getdata.length; a++) {
                                sourceFilteredVal = sourceFilteredVal.replace(
                                    '.items.',
                                    '[' + a + ']',
                                );
                            }
                        }
                        sourceFilteredVal = sourceFilteredVal.trim();
                    }
                } else {
                    var sourceFilteredVal = srcVal;
                    sourceFilteredVal = sourceFilteredVal.toLowerCase();
                    sourceFilteredVal = sourceFilteredVal.trim();
                }

                if (
                    srcVal.includes('requestBody') ||
                    conncectedNodeType == 'humantasknode' ||
                    srcVal.includes('parameters') ||
                    srcVal.includes('inputschema')
                ) {
                    inputCollection = afp[connectedid]['request'];
                    if (conncectedNodeType == 'api_inputnode') {
                        inputCollection = await this.keysToLowerCaseOnly(inputCollection)
                    }
                    let codedata = afp[connectedid]['code'];
                    if (codedata && Object.keys(codedata).length > 0) {
                        inputCollection = Object.assign(
                            inputCollection,
                            codedata,
                        );
                    }
                } else if (
                    srcVal.includes('responses') ||
                    conncectedNodeType == 'jsonparsernode' ||
                    srcVal.includes('outputschema')
                ) {
                    inputCollection = afp[connectedid]['response'];
                    let codedata = afp[connectedid]['code'];
                    if (
                        inputCollection &&
                        Array.isArray(inputCollection) &&
                        inputCollection.length > 0
                    ) {
                        inputCollection = inputCollection[0];
                    }
                    if (codedata && Object.keys(codedata).length > 0) {
                        inputCollection = Object.assign(
                            inputCollection,
                            codedata,
                        );
                    }
                } else {
                    inputCollection = afp[connectedid]['ifo'];
                    let codedata = afp[connectedid]['code'];

                    if (codedata && Object.keys(codedata).length > 0) {
                        inputCollection = Object.assign(
                            inputCollection,
                            codedata,
                        );
                    }
                }

                if (codeObj && Object.keys(codeObj).length > 0) {
                    inputCollection = Object.assign(inputCollection, codeObj)
                }

                if (targetHandle) {
                    let targetSplit = targetHandle.split('|');
                    if (targetSplit.includes('HeaderParams')) {
                        var targetVal = targetSplit[1];
                    } else {
                        var targetVal = targetSplit[targetSplit.length - 1];
                    }

                    if (targetVal.includes('.')) {
                        var staticRemove = targetVal.split('.');
                        var targetFilteredVal = staticRemove.filter(
                            (item) => !this.statickeyword.includes(item),
                        );
                        if (targetFilteredVal && targetFilteredVal.length > 0) {
                            var tempobj = {};
                            targetFilteredVal = targetFilteredVal.join('.');
                            if (
                                targetFilteredVal.includes('.') &&
                                targetFilteredVal.startsWith('parameters.')
                            ) {
                                var parameterPathValue = _.get(
                                    parameter,
                                    targetFilteredVal.replace('.name', '.in'),
                                );
                                tempobj['key'] = _.get(
                                    parameter,
                                    targetFilteredVal,
                                );
                                tempobj['type'] = parameterPathValue;
                                targetFilteredVal = _.get(
                                    parameter,
                                    targetFilteredVal,
                                );

                                tempQryVal.push(tempobj);
                            }
                            targetFilteredVal = targetFilteredVal.split('.');
                            targetFilteredVal = targetFilteredVal.filter(
                                (item) => !this.numberArr.includes(item),
                            );
                            targetFilteredVal = targetFilteredVal.join('.');

                            if (targetFilteredVal.includes('.items.')) {
                                targetFilteredVal = targetFilteredVal.replace(
                                    '.items.',
                                    '[0]',
                                );
                            }
                            if (targetFilteredVal.startsWith('items.')) {
                                targetFilteredVal = targetFilteredVal.replace(
                                    'items.',
                                    '',
                                );
                            }

                            if (mapObj) {
                                var setdata = _.get(mapObj, targetFilteredVal);
                                if (setdata?.length) {
                                    targetFilteredVal = targetFilteredVal.replace(
                                        '[0]',
                                        '[' + setdata.length + ']',
                                    );
                                }
                            }
                            if (fabric == 'DF-DFD')
                                inputCollection = inputparam?.data
                            if (sourceFilteredVal && sourceFilteredVal.includes('.')) {
                                let dst = sourceFilteredVal.split('.')
                                sourceFilteredVal = (dst.filter(item => !this.numberArr.includes(item))).join('.');
                            }
                            if (
                                sourceFilteredVal &&
                                sourceFilteredVal.length > 0
                            ) {
                                let checkdata = _.get(
                                    inputCollection,
                                    sourceFilteredVal,
                                );
                                let codecheck = _.get(codeObj, sourceFilteredVal);
                                if (checkdata != null && checkdata != undefined) {
                                    _.set(
                                        mapObj,
                                        targetFilteredVal,
                                        _.get(inputCollection, sourceFilteredVal),
                                    );
                                } else {
                                    if (codecheck != null && codecheck != undefined)
                                        _.set(
                                            mapObj,
                                            targetFilteredVal,
                                            _.get(codeObj, sourceFilteredVal),
                                        );
                                }
                            } else if (b == 0) {
                                let testdata: any = inputCollection;
                                testdata = testdata.replace(/\\n/g, '\n');
                                mapObj[targetFilteredVal] = testdata;
                            }
                        } else if (
                            sourceFilteredVal &&
                            sourceFilteredVal.length > 0
                        ) {
                            textobj = _.get(inputCollection, sourceFilteredVal);
                        }
                    } else {
                        let checkdata = _.get(
                            inputCollection,
                            sourceFilteredVal,
                        );
                        let codecheck = _.get(codeObj, sourceFilteredVal);
                        if (checkdata != null && checkdata != undefined) {
                            _.set(
                                mapObj,
                                targetVal,
                                _.get(inputCollection, sourceFilteredVal),
                            );
                        } else {
                            if (codecheck != null && codecheck != undefined)
                                _.set(
                                    mapObj,
                                    targetFilteredVal,
                                    _.get(codeObj, sourceFilteredVal),
                                );
                        }
                    }
                    if (b > 0) {
                        let obj = {};
                        let type
                        if (pfo?.length > 0) {
                            for (let p = 0; p < pfo.length; p++) {
                                if (pfo[p].nodeId == connectedid) {
                                    if (pfo[p]?.schema?.['requestBody']?.['content']?.['application/json']?.['schema']) {
                                        type = 'application/json'
                                    } else if (pfo[p]?.schema?.['requestBody']?.['content']?.['application/xml']?.['schema']) {
                                        type = 'application/xml'
                                    } else if (pfo[p]?.schema?.['requestBody']?.['content']?.['text/plain']?.['schema']) {
                                        type = 'text/plain'
                                    }
                                    let schema = pfo[p]?.schema?.['requestBody']['content'][type]['schema'];
                                    var res = await this.generateMockData(schema);
                                    let keys = Object.keys(res);
                                    inputparam = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + upId + ':NPV:' + pfo[p].nodeName + '.PRO', '.request', collectionName))
                                    for (let item of keys) {
                                        if (inputparam) {
                                            if (Array.isArray(inputparam) && inputparam?.length > 0) {
                                                let tempobj
                                                for (let r = 0; r < inputparam.length; r++) {
                                                    tempobj = {}
                                                    _.set(tempobj, item, _.get(inputparam[r], item));
                                                    obj = Object.assign(obj, tempobj);
                                                }
                                            } else if (typeof inputparam == 'object') {
                                                _.set(obj, item, _.get(inputparam, item));
                                            } else if (typeof inputparam == 'string') {
                                                obj = inputparam
                                            }
                                        }
                                    }
                                }
                            }
                            schemaRes[targetFilteredVal] = obj;
                        }
                        if (schemaRes && Object.keys(schemaRes).length > 0) {
                            mapObj = Object.assign(mapObj, schemaRes);
                        }
                    }
                }
            }
        }
        return { mapObj, tempQryVal }
    }

    async mapEdgeValuesToParams(pfdto: any, currentNodeEdge: any, inputparam: any, processedKey: string, upId: string, collectionName: string,  parameter: any, codeObj: any, pfo: any, childtable?): Promise<any> {
        try {
            let childInsertArr = []
            let srcIdArr = []
            let mapObj, tempQryVal, targetVal, staticRemove, textobj

            for (let s = 0; s < currentNodeEdge.length; s++) {
                let source = currentNodeEdge[s].source
                let sourceHandle = currentNodeEdge[s].sourceHandle
                sourceHandle = (sourceHandle.split('|')).find(item => item.startsWith('responses.') || item.startsWith('requestBody.') || item == 'ifo');

                if (!sourceHandle || sourceHandle.startsWith('responses.')) {
                    sourceHandle = 'responses'
                } else if (sourceHandle.startsWith('requestBody.')) {
                    sourceHandle = 'requestBody'
                } else if (sourceHandle == 'ifo') {
                    sourceHandle = 'ifo'
                }
                let existing = srcIdArr.find(item => item.source === source);

                if (existing) {
                    existing.sourceHandle.push(sourceHandle);
                } else {
                    srcIdArr.push({
                        source: source,
                        sourceHandle: [sourceHandle]
                    });
                }
            }
            let nodesArr = []
            let filteredIds = [];
            for (let s = 0; s < srcIdArr.length; s++) {
                let connectedid = srcIdArr[s].source
                let connectedHandle = srcIdArr[s].sourceHandle

                for (var h = 0; h < pfo.length; h++) {
                    if (connectedid == pfo[h].nodeId) {
                        let tempArr = []
                        var conncectedNodename = pfo[h].nodeName
                        var conncectedNodeType = pfo[h].nodeType
                        let innerpathVal

                        let afpValue = JSON.parse(await this.redisService.getJsonData(processedKey + upId + ':NPV:' + conncectedNodename + '.PRO', collectionName))


                        if (connectedHandle.includes('requestBody')) {
                            innerpathVal = afpValue.request
                            if (conncectedNodeType == 'api_inputnode') {
                                innerpathVal = await this.keysToLowerCaseOnly(innerpathVal)
                            }
                            tempArr = await this.combineData(innerpathVal, tempArr)
                        }
                        if (connectedHandle.includes('responses')) {
                            innerpathVal = afpValue.response
                            if (conncectedNodeType == 'api_inputnode') {
                                innerpathVal = await this.keysToLowerCaseOnly(innerpathVal)
                            }
                            tempArr = await this.combineData(innerpathVal, tempArr)
                        }
                        if (connectedHandle.includes('ifo')) {
                            innerpathVal = afpValue.ifo
                            if (conncectedNodeType == 'api_inputnode') {
                                innerpathVal = await this.keysToLowerCaseOnly(innerpathVal)
                            }
                            tempArr = await this.combineData(innerpathVal, tempArr)

                            innerpathVal = afpValue.code
                            if (conncectedNodeType == 'api_inputnode') {
                                innerpathVal = await this.keysToLowerCaseOnly(innerpathVal)
                            }
                            tempArr = await this.combineData(innerpathVal, tempArr)
                        }
                        if (codeObj) {
                            innerpathVal = codeObj
                            if (conncectedNodeType == 'api_inputnode') {
                                innerpathVal = await this.keysToLowerCaseOnly(innerpathVal)
                            }
                            tempArr = await this.combineData(innerpathVal, tempArr)
                        }
                       
                        if (tempArr.length > 0) {
                            nodesArr.push(tempArr)
                            filteredIds.push(connectedid)
                        }
                    }
                }
            }
            srcIdArr = filteredIds;
            let mergedRecords = await this.getCombinations(srcIdArr, nodesArr)

          
            for (let m = 0; m < mergedRecords.length; m++) {
                mapObj = {};
                tempQryVal = [];
                let inputCollection = mergedRecords[m]
                //console.log("inputCollection",inputCollection);

                for (let e = 0; e < currentNodeEdge.length; e++) {
                    let schemaRes = {};
                    let b = 0;
                    let childName
                    let sourceFilteredVal, targetFilteredVal
                    let srcHandle = currentNodeEdge[e].sourceHandle;
                    let targetHandle = currentNodeEdge[e].targetHandle;
                    let connectedid = currentNodeEdge[e].source;
                    let connectedType
                    if (pfo?.length > 0) {
                        for (let p = 0; p < pfo.length; p++) {
                            if (connectedid == pfo[p].nodeId) {
                                connectedType = pfo[p].nodeType
                                break;
                            }
                        }
                    }

                    let childid, childnodeType
                    if (srcIdArr.includes(connectedid)) {
                        if (srcHandle) {
                            let srcSplit = srcHandle.split('|');
                            if (srcSplit.length > 3 && childtable) {
                                childid = srcSplit[srcSplit.length - 2]
                            }

                            if (pfo?.length > 0 && childid && childtable) {
                                for (let p = 0; p < pfo.length; p++) {
                                    if (connectedid == pfo[p].nodeId) {
                                        childnodeType = pfo[p].nodeType
                                        let data = pfo[p].schema[srcSplit[0]][srcSplit[1]]
                                        if (data?.length > 0) {
                                            for (let i = 0; i < data.length; i++) {
                                                if (data[i].id == childid) {
                                                    childName = data[i].name
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            let srcVal = srcSplit.includes('HeaderParams') ? srcSplit[1] : srcSplit[srcSplit.length - 1];
                            // if (srcVal.includes('.') && !srcVal.includes('text/plain') && !srcVal.includes('*/*')) {
                            if (srcVal.includes('.') && !srcVal.includes('*/*')) {
                                let src = srcSplit[1].split('.');
                                if (src[src.length - 1] == 'schema') {
                                    b++;
                                }
                            }
                            if (srcVal.includes('.')) {
                                let staticRemove = srcVal.split('.');
                                sourceFilteredVal = staticRemove.filter((item) => !this.statickeyword.includes(item));
                                if (sourceFilteredVal?.length > 0) {
                                    sourceFilteredVal = sourceFilteredVal.join('.');
                                    if (sourceFilteredVal.includes('.') && sourceFilteredVal.startsWith('parameters.')) {
                                        sourceFilteredVal = _.get(parameter, sourceFilteredVal);
                                    }
                                    if (sourceFilteredVal.startsWith('items.')) {
                                        sourceFilteredVal = sourceFilteredVal.replace('items.', '',);
                                    }
                                    sourceFilteredVal = sourceFilteredVal.toLowerCase();

                                    // if (sourceFilteredVal.includes('.items.')) {
                                    //   let spilt = sourceFilteredVal.split('.items.');
                                    //   var getdata = _.get(inputparam, spilt[0]);
                                    // }
                                    // if (getdata?.length > 0) {
                                    //   for (let a = 0; a < getdata.length; a++) {
                                    //     sourceFilteredVal = sourceFilteredVal.replace('.items.', '[' + a + ']',);
                                    //   }
                                    // }

                                    if (sourceFilteredVal.includes('.items.')) {
                                        sourceFilteredVal = sourceFilteredVal.replace('.items.', '[0]',);
                                    }

                                    if (sourceFilteredVal && sourceFilteredVal.includes('.')) {
                                        let dst = sourceFilteredVal.split('.')
                                        sourceFilteredVal = (dst.filter(item => !this.numberArr.includes(item))).join('.');
                                    }
                                    sourceFilteredVal = sourceFilteredVal.trim();

                                    if (childnodeType != 'humantasknode' && !childName && !childid)
                                        sourceFilteredVal = connectedid + '.' + sourceFilteredVal
                                }
                            } else {
                                sourceFilteredVal = srcVal.toLowerCase();
                                sourceFilteredVal = srcVal.trim();
                                if (childnodeType != 'humantasknode' && !childName && !childid)
                                    sourceFilteredVal = connectedid + '.' + sourceFilteredVal
                            }
                          
                            if (targetHandle) {
                                let targetSplit = targetHandle.split('|');
                                if (pfdto?.sourceId && connectedType == "humantasknode") {
                                    let srcId = pfdto?.sourceId.split('|').shift()
                                    if (srcId == srcSplit[0]) {
                                        // console.log(1234);                        
                                        targetVal = targetSplit.includes('HeaderParams') ? targetSplit[1] : targetSplit[targetSplit.length - 1];
                                        if (targetVal.includes('.')) {
                                            staticRemove = targetVal.split('.');
                                            targetFilteredVal = staticRemove.filter((item) => !this.statickeyword.includes(item));
                                            if (targetFilteredVal && targetFilteredVal.length > 0) {
                                                let tempobj = {};
                                                targetFilteredVal = targetFilteredVal.join('.');
                                                if (targetFilteredVal.includes('.') && targetFilteredVal.startsWith('parameters.')) {
                                                    var parameterPathValue = _.get(parameter, targetFilteredVal.replace('.name', '.in'));
                                                    tempobj['key'] = _.get(parameter, targetFilteredVal);
                                                    tempobj['type'] = parameterPathValue;
                                                    targetFilteredVal = _.get(parameter, targetFilteredVal,);
                                                    tempQryVal.push(tempobj);
                                                }
                                                targetFilteredVal = targetFilteredVal.split('.');
                                                targetFilteredVal = targetFilteredVal.filter((item) => !this.numberArr.includes(item));
                                                targetFilteredVal = targetFilteredVal.join('.');

                                                if (targetFilteredVal.includes('.items.')) {
                                                    targetFilteredVal = targetFilteredVal.replace('.items.', '[0]',);
                                                }
                                                if (targetFilteredVal.startsWith('items.')) {
                                                    targetFilteredVal = targetFilteredVal.replace('items.', '',);
                                                }

                                                if (mapObj) {
                                                    var setdata = _.get(mapObj, targetFilteredVal);
                                                    if (setdata?.length) {
                                                        targetFilteredVal = targetFilteredVal.replace('[0]', '[' + setdata.length + ']');
                                                    }
                                                }
                                                // console.log("sourceFilteredVal",sourceFilteredVal);
                                                // console.log("targetFilteredVal",targetFilteredVal);

                                                if (sourceFilteredVal && sourceFilteredVal.length > 0) {
                                                    sourceFilteredVal = sourceFilteredVal.toLowerCase();
                                                    sourceFilteredVal = sourceFilteredVal.trim();


                                                    if (childnodeType == 'humantasknode' && childName && childid) {
                                                        let childdata = inputCollection[connectedid][childName.toLowerCase()]
                                                        if (childdata?.length > 0) {
                                                            let temptargetFilteredVal = targetFilteredVal
                                                            for (let i = 0; i < childdata.length; i++) {
                                                                if (targetFilteredVal.includes('[0]')) {
                                                                    temptargetFilteredVal = targetFilteredVal.replace('[0]', '.' + [i] + '.',);
                                                                    _.set(mapObj, temptargetFilteredVal, _.get(childdata[i], sourceFilteredVal));
                                                                }
                                                            }
                                                        }
                                                    } else
                                                        _.set(mapObj, targetFilteredVal, _.get(inputCollection, sourceFilteredVal));
                                                } else if (b == 0) {
                                                    // let testdata: any = inputCollection;                                        
                                                    let testdata = _.get(inputCollection, connectedid + '.schema')
                                                    testdata = testdata.replace(/\\n/g, '\n');
                                                    mapObj[targetFilteredVal] = testdata;
                                                }
                                            } else if (sourceFilteredVal && sourceFilteredVal.length > 0) {
                                                sourceFilteredVal = sourceFilteredVal.toLowerCase();
                                                sourceFilteredVal = sourceFilteredVal.trim();
                                                textobj = _.get(inputCollection, sourceFilteredVal);
                                            }
                                        } else {
                                            sourceFilteredVal = sourceFilteredVal.toLowerCase();
                                            sourceFilteredVal = sourceFilteredVal.trim();
                                            if (childnodeType == 'humantasknode' && childName && childid) {
                                                let childdata = inputCollection[connectedid][childName.toLowerCase()]
                                                if (childdata?.length > 0) {
                                                    let temptargetFilteredVal = targetVal
                                                    for (let i = 0; i < childdata.length; i++) {
                                                        if (targetFilteredVal.includes('[0]')) {//&& !(_.get(childdata[i], targetFilteredVal))
                                                            temptargetFilteredVal = targetFilteredVal.replace('[0]', '.' + [i] + '.',);
                                                            _.set(mapObj, temptargetFilteredVal, _.get(childdata[i], sourceFilteredVal));
                                                        }

                                                    }
                                                }
                                            }
                                            else
                                                _.set(mapObj, targetVal, _.get(inputCollection, sourceFilteredVal));
                                        }
                                        if (b > 0) {
                                            let obj = {};
                                            let type
                                            if (pfo?.length > 0) {
                                                for (let p = 0; p < pfo.length; p++) {
                                                    if (pfo[p].nodeId == connectedid) {
                                                        if (pfo[p]?.schema?.['requestBody']?.['content']?.['application/json']?.['schema']) {
                                                            type = 'application/json'
                                                        } else if (pfo[p]?.schema?.['requestBody']?.['content']?.['application/xml']?.['schema']) {
                                                            type = 'application/xml'
                                                        }
                                                        let schema = pfo[p]?.schema?.['requestBody']['content'][type]['schema'];
                                                        var res = await this.generateMockData(schema);
                                                        let keys = Object.keys(res);
                                                        inputparam = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + upId + ':NPV:' + pfo[p].nodeName + '.PRO', '.request', collectionName))
                                                        for (let item of keys) {
                                                            if (inputparam) {
                                                                if (Array.isArray(inputparam) && inputparam?.length > 0) {
                                                                    let tempobj
                                                                    for (let r = 0; r < inputparam.length; r++) {
                                                                        tempobj = {}
                                                                        _.set(tempobj, item, _.get(inputparam[r], item));
                                                                        obj = Object.assign(obj, tempobj);
                                                                    }
                                                                } else if (typeof inputparam == 'object') {
                                                                    _.set(obj, item, _.get(inputparam, item));
                                                                } else if (typeof inputparam == 'string') {
                                                                    obj = inputparam
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                schemaRes[targetFilteredVal] = obj;
                                            }
                                            if (schemaRes && Object.keys(schemaRes).length > 0) {
                                                mapObj = Object.assign(mapObj, schemaRes);
                                            }
                                        }
                                    }
                                } else {
                                    targetVal = targetSplit.includes('HeaderParams') ? targetSplit[1] : targetSplit[targetSplit.length - 1];
                                    // if(targetSplit.includes('HeaderParams')){
                                    //     targetVal = targetSplit[1]
                                    //     if(this.statickeyword.includes('parameters')){
                                    //        this.statickeyword = this.statickeyword.splice(this.statickeyword.indexOf('parameters'), 1);
                                    //     }
                                    // }else{
                                    //     targetVal = targetSplit[targetSplit.length - 1];
                                    // }

                                    if (targetVal.includes('.')) {
                                        staticRemove = targetVal.split('.');
                                        
                                        

                                        targetFilteredVal = staticRemove.filter((item) => !this.statickeyword.includes(item));
                                        if (targetFilteredVal && targetFilteredVal.length > 0) {
                                            let tempobj = {};
                                            targetFilteredVal = targetFilteredVal.join('.');                                                    
                                            if (targetFilteredVal.includes('.') && targetFilteredVal.startsWith('parameters.')) {
                                                var parameterPathValue = _.get(parameter, targetFilteredVal.replace('.name', '.in'));
                                                tempobj['key'] = _.get(parameter, targetFilteredVal);
                                                tempobj['type'] = parameterPathValue;
                                                targetFilteredVal = _.get(parameter, targetFilteredVal,);
                                                tempQryVal.push(tempobj);
                                            }
                                            targetFilteredVal = targetFilteredVal.split('.');
                                            targetFilteredVal = targetFilteredVal.filter((item) => !this.numberArr.includes(item));
                                            targetFilteredVal = targetFilteredVal.join('.');

                                            if (targetFilteredVal.includes('.items.')) {
                                                targetFilteredVal = targetFilteredVal.replace('.items.', '[0]',);
                                            }
                                            if (targetFilteredVal.startsWith('items.')) {
                                                targetFilteredVal = targetFilteredVal.replace('items.', '',);
                                            }

                                            if (mapObj) {
                                                var setdata = _.get(mapObj, targetFilteredVal);
                                                if (setdata?.length) {
                                                    targetFilteredVal = targetFilteredVal.replace('[0]', '[' + setdata.length + ']');
                                                }
                                            }
                                            
                                            if (sourceFilteredVal && sourceFilteredVal.length > 0) {
                                                sourceFilteredVal = sourceFilteredVal.toLowerCase();
                                                sourceFilteredVal = sourceFilteredVal.trim();
                                               
                                                if (childnodeType == 'humantasknode' && childName && childid) {
                                                    let childdata = inputCollection[connectedid][childName.toLowerCase()]
                                                    if (childdata?.length > 0) {
                                                        let temptargetFilteredVal = targetFilteredVal
                                                        for (let i = 0; i < childdata.length; i++) {
                                                            if (targetFilteredVal.includes('[0]')) {
                                                                temptargetFilteredVal = targetFilteredVal.replace('[0]', '.' + [i] + '.',);
                                                                _.set(mapObj, temptargetFilteredVal, _.get(childdata[i], sourceFilteredVal));
                                                            }
                                                        }
                                                    }
                                                } else
                                                    _.set(mapObj, targetFilteredVal, _.get(inputCollection, sourceFilteredVal));
                                            } else if (b == 0) {
                                                // let testdata: any = inputCollection;  
                                               
                                                let testdata = _.get(inputCollection, connectedid + '.schema')
                                                testdata = testdata.replace(/\\n/g, '\n');
                                                mapObj[targetFilteredVal] = testdata;
                                            }
                                        } else if (sourceFilteredVal && sourceFilteredVal.length > 0) {
                                            sourceFilteredVal = sourceFilteredVal.toLowerCase();
                                            sourceFilteredVal = sourceFilteredVal.trim();
                                            textobj = _.get(inputCollection, sourceFilteredVal);
                                        } else {
                                            textobj = _.get(inputCollection, connectedid + '.schema');
                                        }
                                    } else {
                                        sourceFilteredVal = sourceFilteredVal.toLowerCase();
                                        sourceFilteredVal = sourceFilteredVal.trim();
                                        if (childnodeType == 'humantasknode' && childName && childid) {
                                            let childdata = inputCollection[connectedid][childName.toLowerCase()]
                                            if (childdata?.length > 0) {
                                                let temptargetFilteredVal = targetVal
                                                for (let i = 0; i < childdata.length; i++) {
                                                    if (targetFilteredVal.includes('[0]')) {//&& !(_.get(childdata[i], targetFilteredVal))
                                                        temptargetFilteredVal = targetFilteredVal.replace('[0]', '.' + [i] + '.',);
                                                        _.set(mapObj, temptargetFilteredVal, _.get(childdata[i], sourceFilteredVal));
                                                    }

                                                }
                                            }
                                        }
                                        else
                                            _.set(mapObj, targetVal, _.get(inputCollection, sourceFilteredVal));
                                     
                                    }
                                    if (b > 0) {
                                        let obj = {};
                                        let type
                                        if (pfo?.length > 0) {
                                            for (let p = 0; p < pfo.length; p++) {
                                                if (pfo[p].nodeId == connectedid) {
                                                    if (pfo[p]?.schema?.['requestBody']?.['content']?.['application/json']?.['schema']) {
                                                        type = 'application/json'
                                                    } else if (pfo[p]?.schema?.['requestBody']?.['content']?.['application/xml']?.['schema']) {
                                                        type = 'application/xml'
                                                    }
                                                    else if (pfo[p]?.schema?.['requestBody']?.['content']?.['text/plain']?.['schema']) {
                                                        type = 'text/plain'
                                                    } else if (pfo[p]?.schema?.['requestBody']?.['content']?.['*/*']?.['schema']) {
                                                        type = '*/*'
                                                    }
                                                    let schema = pfo[p]?.schema?.['requestBody']['content'][type]['schema'];
                                                    var res = await this.generateMockData(schema);
                                                    let keys = Object.keys(res);
                                                    inputparam = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + upId + ':NPV:' + pfo[p].nodeName + '.PRO', '.request', collectionName))
                                                    for (let item of keys) {
                                                        if (inputparam) {
                                                            if (Array.isArray(inputparam) && inputparam?.length > 0) {
                                                                let tempobj
                                                                for (let r = 0; r < inputparam.length; r++) {
                                                                    tempobj = {}
                                                                    _.set(tempobj, item, _.get(inputparam[r], item));
                                                                    obj = Object.assign(obj, tempobj);
                                                                }
                                                            } else if (typeof inputparam == 'object') {
                                                                _.set(obj, item, _.get(inputparam, item));
                                                            } else if (typeof inputparam == 'string') {
                                                                obj = inputparam
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            schemaRes[targetFilteredVal] = obj;
                                        }
                                        if (schemaRes && Object.keys(schemaRes).length > 0) {
                                            mapObj = Object.assign(mapObj, schemaRes);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                if (Object.keys(mapObj).length > 0) {
                    childInsertArr.push(mapObj);
                }
            }
            return { childInsertArr, tempQryVal, textobj }
        } catch (error) {
            // console.log('Error', error);        
            throw error
        }
    }

    async combineData(innerpathVal, tempArr) {
        if (innerpathVal) {
            if (Array.isArray(innerpathVal) && innerpathVal?.length > 0) {
                if (tempArr.length > 0)
                    tempArr = tempArr.map((obj, index) => ({ ...obj, ...(innerpathVal)[index] }));
                else
                    tempArr = [...tempArr, ...(innerpathVal)]

            } else if (typeof innerpathVal == 'object' && Object.keys(innerpathVal).length > 0) {
                if (tempArr.length > 0)
                    tempArr = tempArr.map((obj) => ({ ...obj, ...(innerpathVal) }));
                else
                    tempArr = [...tempArr, ...[(innerpathVal)]]
            } else if (typeof innerpathVal == 'string' || typeof innerpathVal == 'number' || typeof innerpathVal == 'boolean') {
                if (tempArr.length > 0)
                    tempArr = tempArr.map((obj) => ({ ...obj, ...{ schema: (innerpathVal) } }));
                else
                    tempArr = [...tempArr, ...[{ schema: (innerpathVal) }]]
            }
        }
        return tempArr
    }

    async getCombinations(srcIdArr, nodesArr): Promise<any> {
        function combineArraysWithKeys(arrays, keys) {
            return arrays.reduce((acc, currArray, index) => {
                const key = keys[index];
                const result = [];

                for (const accItem of acc) {
                    for (const currItem of currArray) {
                        result.push({
                            ...accItem,
                            [key]: currItem
                        });
                    }
                }
                return result;
            }, [{}]);
        }

        const result = combineArraysWithKeys(nodesArr, srcIdArr);

        return result;
    }

    async buildRequestComponents(apiUrl: string, tempQryVal: any[], mapObj: Record<string, any>): Promise<any> {

        const headers: Record<string, string> = {};
        const queryParams: string[] = [];

        if (!tempQryVal || tempQryVal.length === 0) {
            return { apiUrl, headers, query: '' };
        }

        for (const param of tempQryVal) {
            const { key, type } = param;
            const value = mapObj[key];

            if (value === undefined) continue;

            switch (type) {
                case 'header':
                    headers[key] = value;
                    break;
                case 'query':
                    queryParams.push(`${key}=${value}`);
                    break;
                case 'path':
                    apiUrl = apiUrl.replace(`{${key}}`, value);
                    break;
            }
        }
        const query = queryParams.join('&');
        if (query) apiUrl += `?${query}`;

        return { apiUrl, headers, query };
    }

    async filterApiResponse(apires: any, filterParams: any[]): Promise<any> {
        if (!filterParams?.length) return apires;

        let filterarr = apires.filter((item: any) =>
            filterParams.every(f => item[f.key] === f.value)
        );
        if (filterarr.length > 0) {
            return filterarr
        } else
            return apires
    }

    async paginateResult(data: any[], page: number, count: number): Promise<any> {
        if (!page || !count || !Array.isArray(data)) return data;
        const start = (page - 1) * count;
        return data.slice(start, start + count);
    }

    generateMockData(schema: any): any {

        if (schema?.allOf && Array.isArray(schema.allOf)) {
            const allOfValues = schema.allOf.map((subSchema: any) => this.generateMockData(subSchema));

            if (allOfValues.every(val => typeof val === 'object' && !Array.isArray(val))) {
                return Object.assign({}, ...allOfValues);
            }
        }


        if (schema?.oneOf && Array.isArray(schema.oneOf)) {
            const allOfValues = schema.oneOf.map((subSchema: any) => this.generateMockData(subSchema));


            if (allOfValues.every(val => typeof val === 'object' && !Array.isArray(val))) {
                return Object.assign({}, ...allOfValues);
            }
        }

        if (schema?.type === 'string') {
            return 'string';
        }


        if (schema?.type === 'array') {
            return [this.generateMockData(schema.items)];
        }
        if (schema?.type === 'object' && schema?.properties) {
            const result: Record<string, any> = {};
            for (const [key, value] of Object.entries(schema.properties)) {
                result[key] = this.generateMockData(value);
            }
            return result;
        }
        if (
            schema &&
            typeof schema === 'object' &&
            !schema.type &&
            !schema.allOf &&
            !schema.items &&
            !schema.oneOf
        ) {
            const keys = Object.keys(schema);
            if (keys.length && keys.every(k => !isNaN(Number(k)))) {
                return keys
                    .sort((a, b) => Number(a) - Number(b))
                    .map(k => schema[k])
                    .join('');
            }

            const result: Record<string, any> = {};
            for (const [key, value] of Object.entries(schema)) {
                result[key] = this.generateMockData(value);
            }
            return result;
        }
        return this.getMockValue(schema?.type);
    }

    getMockValue(type: string): any {
        switch (type) {
            case 'string':
                return 'string';
            case 'number':
                return 0;
            case 'boolean':
                return true;
            case 'array':
                return [];
            case 'object':
                return {};
            default:
                return null;
        }
    }

    findMatchingValuesFlexible(
        jsonData: any,
        path: string,
        expectedValue: any
    ) {
        const pathParts = path.split('.');
        const matches: any[] = [];

        function traverse(obj: any, index: number) {

            if (index >= pathParts.length) {
                if (obj == expectedValue) matches.push(obj);
                return;
            }
            const key = pathParts[index];
            if (key === 'items') {
                if (Array.isArray(obj)) {
                    obj.forEach(el => traverse(el, index + 1));
                }
                return;
            }
            if (obj && typeof obj === 'object' && key in obj) {
                traverse(obj[key], index + 1);
            }
            else if (obj && typeof obj === 'object') {
                Object.values(obj).forEach(val => traverse(val, index));
            }
        }
        traverse(jsonData, 0);
        return matches;
    }

    transformBySchema(schema: any, data: any): any {
        if (!schema || data == null) return undefined;

        const { type } = schema;

        const unwrapSingleValue = (value: any) => {
            if (Array.isArray(value) && value.length === 1 && typeof value[0] === 'object') {
                const innerObj = value[0];
                const keys = Object.keys(innerObj);
                if (keys.length === 1) {
                    return innerObj[keys[0]];
                }
            }
            return value;
        };

        switch (type) {
            case 'object': {
                if (typeof data !== 'object' || Array.isArray(data)) return data[0];

                const result: any = {};
                const props = schema.properties || {};
                const required = schema.required || [];

                for (const key of Object.keys(props)) {
                    let value = data[key];
                    if (value === 'null') value = null;

                    value = unwrapSingleValue(value);

                    const transformed = this.transformBySchema(props[key], value);

                    if (transformed !== undefined && transformed !== null) {
                        result[key] = transformed;
                    }
                    else if (required.includes(key) && key in data) {
                        result[key] = null;
                    }
                }

                return result;
            }

            case 'array': {
                if (!Array.isArray(data)) return data;
                const itemSchema = schema.items;
                return data.map((item) =>
                    this.transformBySchema(itemSchema, unwrapSingleValue(item))
                );
            }

            case 'string': {
                const unwrapped = unwrapSingleValue(data);
                if (typeof unwrapped == 'object') {
                    return unwrapped
                } else {
                    return unwrapped === 'null' ? null : String(unwrapped);
                }
            }

            case 'boolean':
                return typeof data === 'boolean' ? data : Boolean(data);

            case 'number':
                return isNaN(Number(data)) ? undefined : Number(data);

            default:
                return data;
        }
    }
      
}