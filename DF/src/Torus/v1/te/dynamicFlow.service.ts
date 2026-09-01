import {Inject, Injectable, Logger, forwardRef } from "@nestjs/common";
import { pfDto, PoEvent } from "src/dto";
import { RedisService } from "src/redisService";
import { CommonService } from "src/common.Service";
import { CustomException } from "src/customException";
import { JwtService } from "@nestjs/jwt";
import { JwtServices } from "src/jwt.services";
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
import { Kafka, Producer, Consumer, CompressionTypes, EachMessagePayload } from 'kafkajs';
import { EnvData } from "src/envData/envData.service";
import { decrypt } from "src/decrypt";
import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import { format } from "date-fns";
import * as nodemailer from 'nodemailer';
import { runInSandbox } from "src/sandbox";
import { Surreal, Table, RecordId } from 'surrealdb';
import { getRedisConnectionOptions } from "src/redis.config";

type MappingValue = string | { sourcePath: string; arrayMap: Record< string, string> };
type MappingConfig = Record< string, MappingValue>;
interface ArrayMapConfig {
  sourcePath: string;
  arrayMap: Record< string, string>;
}

@Injectable()
export class DynamicFlowService {
    private ajv = new Ajv();  
    private transporters = new Map< string, nodemailer.Transporter>();
    private statickeyword = ['get', 'post', 'patch', '200', '201', '202', '204', '400', '401', '403', '404', '500','requestBody', '*/*', 'responses', 'content', 'application/json', 'application/xml', 'text/plain', 'application/jwt', 'application/json; charset=utf-8', 'schema', 'properties', 'allOf', 'oneOf', 'inputschema', 'outputschema',];//"parameters",
    private numberArr: string[] = Array.from({ length: 101 }, (_, i) => i.toString());  
    private kafka: Kafka;
    private producer: Producer;
    private consumers: Map<string, Consumer> = new Map();
    constructor(
    private readonly redisService:RedisService,    
    private readonly jwtService:JwtServices,  
    private readonly CommonService: CommonService,
    private readonly lockservice: LockService,
    private readonly envData:EnvData,    
   ){}
    private getKafkaInstance(): Kafka {
        if (!this.kafka) {
            this.kafka = new Kafka({
                clientId: this.envData.getKafkaClientId(),
                brokers: [this.envData.getKafkaBroker()],
            });
        }
        return this.kafka;
    }
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
            let searchFilter = pfdto?.searchFilter
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
            let pfresponse = await this.pfProcessor(pfdto, event, pfjson, pfo, poNode, ndp, currentFabric, flag, page, count, filterData, lockDetails, childtable, logicCenter,searchFilter);
            return pfresponse
        } catch (error) {
            // This is the single handler behind every @EventPattern-based TCP
            // entry point — unlike the node-level catch blocks elsewhere in
            // this file, it was returning the raw error straight to the
            // caller with no redaction (M21).
            const redactedError = this.CommonService.redactSensitiveFields(error);
            this.logger.error('DynamicFlowProcess failed', redactedError);
            return redactedError
        }
    }

    async pfProcessor(pfdto, event, pfjson, pfo,poJson, ndp, currentFabric, flag, page, count, filterData, lockDetails, childtable, logicCenter,searchFilter) {
        this.logger.log('Pf Processor started!');
        ({ page, count } = this.CommonService.sanitizePagination(page, count));
        let upId = pfdto.upId
        this.logger.log('UPID', upId);
        let key: string = pfdto.key
        let inputparam = pfdto.data
        let token = pfdto.token
        let nodeId = pfdto.nodeId
        let nodeType = pfdto.nodeType
        let nodeName = pfdto.nodeName
        let parentUpId = pfdto.parentUpId
        let sortingDetails = pfdto?.sortingDetails
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
       
        let SessionToken: any;
        try {
          // Verified — this drives trs_created_by/trs_org_code/etc. audit
          // stamping below, so a forged token must not be trusted here.
           SessionToken = await this.jwtService.verifyToken(token);;
        } catch (e) {
          SessionToken = null;
        }
       // let tokenDecode = await this.CommonService.MyAccountForClient(token);
        
        let {sobj,SessionInfo} = await this.CommonService.sessionDecode(token, upId);

        let sourceStatus, srcQueue, targetStatus, targetQueue, failureQueue, failureTargetStatus, suspiciousStatus, suspiciousQueue, errorStatus, errorQueue;
        for (var j = 0; j < poNode.length; j++) {
            if (poNode[j].nodeId == nodeId) {
                if (currentFabric == 'DF-DFD') {
                    sourceStatus = poNode[j]?.events?.sourceStatus;
                    srcQueue = poNode[j]?.events?.sourceQueue;
                    targetStatus = poNode[j]?.events?.pro?.success?.targetStatus;
                    targetQueue = poNode[j]?.events?.pro?.success?.targetQueue;
                    failureQueue = poNode[j]?.events?.pro?.failure?.targetQueue;
                    failureTargetStatus = poNode[j]?.events?.pro?.failure?.targetStatus;
                } else if (currentFabric == 'PF-PFD' || currentFabric == 'PF-SFD' || currentFabric == 'PF-SCDL') {
                    if (Array.isArray(poNode[j].events) && poNode[j]?.events?.length > 0) {
                        for (let e = 0; e < poNode[j]?.events?.length; e++) {
                            if (nodeType == 'humantasknode' ? (event == poNode[j]?.events[e]?.source?.status && pfdto.sourceId == poNode[j]?.events[e]?.sourceId) : event == poNode[j]?.events[e]?.source?.status ){
                                sourceStatus = poNode[j]?.events[e]?.source?.status;
                                srcQueue = poNode[j]?.events[e]?.source?.queue;
                                targetStatus = poNode[j]?.events[e]?.success?.status;
                                targetQueue = poNode[j]?.events[e]?.success?.queue;
                                failureQueue = poNode[j]?.events[e]?.failure?.queue;
                                failureTargetStatus = poNode[j]?.events[e]?.failure?.status;
                                suspiciousStatus = poNode[j]?.events[e]?.suspicious?.status;
                                suspiciousQueue = poNode[j]?.events[e]?.suspicious?.queue;
                                errorStatus = poNode[j]?.events[e]?.error?.status;
                                errorQueue = poNode[j]?.events[e]?.error?.queue;
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
            let RCMresult, zenresult, customcoderesult, codeObj = {}, ifoObj={}

            //HumanTaskNode
            if (nodeType == 'humantasknode' && poNode[j].nodeId == nodeId) {
                try {
                    this.logger.log('HumanTask node Started');                   
                    await this.redisService.setJsonData(processedKey + upId + ':rule',JSON.stringify(Array.isArray(inputparam)?inputparam[0]:inputparam),collectionName,nodeName);
                    RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], {}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName);
                    if (RCMresult) {
                        zenresult = RCMresult.rule
                        customcoderesult = RCMresult.code
                    }                    
                    let nodeIfo = poNode[j].ifo
                    let pfRuleResult = {}
                        if(nodeIfo?.length>0){
                        for (const item of nodeIfo) {
                            if(item.variableType == "ProcessVariable" && item.type == "pfrule"){                              
                                let pfRuleValue
                                let id = (item.path).split('|ifo|')[0] 
                                if(id == pfdto?.sourceId){                                    
                                 pfRuleValue = await this.redisService.getJsonData(item.value+':NDP',process.env.CLIENTCODE)                                
                                if(pfRuleValue){                                   
                                    pfRuleValue = JSON.parse(pfRuleValue)
                                    let rule = (Object.values(pfRuleValue)[0])['rule']

                                    let RCMresult:any = await this.CommonService.PfRuleExtract(rule,SessionInfo,inputparam,pfdto.controlName);
                                    
                                    if (RCMresult) {
                                        if(!inputparam) inputparam = {}
                                                                
                                        inputparam = Object.assign(inputparam,RCMresult) 
                                        pfRuleResult = Object.assign(pfRuleResult,RCMresult)                               
                                    }
                                }
                                }                                   
                            }
                        }  
                        if(Object.keys(pfRuleResult).length>0)                            
                         await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(pfRuleResult), collectionName, 'ifo');
                        
                        }
                    if(zenresult && Object.keys(zenresult).length>0 && zenresult[nodeName])
                    inputparam = await this.codeORifoAndInputparamAssign(zenresult[nodeName], inputparam)
                    ifoObj = await this.ifoAssign(poJson?.internalMappingNodes, poNode[j].nodeId,sobj,zenresult,processedKey + upId,inputparam,pfdto)
                   
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
                       
                    if (inputparam && ifoObj)
                        inputparam = await this.codeORifoAndInputparamAssign(ifoObj, inputparam)

                    ifoObj = Object.assign(ifoObj,pfRuleResult)
                    if(ifoObj){
                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(ifoObj), collectionName, 'ifo',);
                    }
                    inputparam =  Array.isArray(inputparam) && inputparam.length == 1?inputparam[0]:inputparam
                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(inputparam), collectionName, 'response',);
                    //await this.redisService.setStreamData(srcQueue, 'TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: inputparam, response: inputparam } }),);
                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(pfdto.sourceId), collectionName, 'sourceid',);
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
                      
                    RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], {}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName);
                    
                    if (RCMresult) {
                        let ruleRes = RCMresult.rule//.output;
                        if(ruleRes && typeof ruleRes == 'object'){
                            zenresult = Object.values(ruleRes)[0]
                        }else if(ruleRes && typeof ruleRes == 'string'){
                            zenresult = ruleRes
                        } 
                        customcoderesult = RCMresult.code;
                    }
                    if (zenresult) {
                        for (let e = 0; e < poNode[j]?.events?.length; e++) {
                            if (event == poNode[j]?.events[e]?.source?.status) {
                                await this.redisService.setJsonData(key + 'PO', JSON.stringify(zenresult), collectionName, 'mappedData.artifact.node[' + j + '].events[' + e + '].success.status',);
                            }
                        }
                        decisionRes = { zenresult }
                        //await this.redisService.setStreamData(srcQueue, 'TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: zenresult, data: { request: inputparam, response: zenresult } }),);
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
                    await this.redisService.setJsonData(processedKey + upId + ':rule',JSON.stringify(Array.isArray(decisionRes)?decisionRes[0]:decisionRes),collectionName,nodeName);

                    this.logger.log('Decision node completed');
                    return { status: 200, targetStatus: zenresult, data: inputparam };
                } catch (error) {
                    await this.exceptionhandler(failureQueue, suspiciousQueue, errorQueue, error, upId, nodeId, failureTargetStatus, inputparam)
                }
            }

              //Api Node
             if ((nodeType == 'apinode' || nodeType == 'googlefileapinode') && poNode[j].nodeId == nodeId) {
                let lock: any, rollbackConfig, apichildResult: any = [],requestBody
                try {                   
                        this.logger.log(`${poNode[j].nodeName} Api node Started`);
                        // Q19-class remediation: this branch can resolve a
                        // caller-controlled dpdKey into another tenant's
                        // decrypted API credentials (bearer token/API key)
                        // and attach them to an outbound request. Refuse to
                        // run without a verified identity attached by
                        // AuthGuard.canActivateRpc().
                        if (!pfdto?.authContext) {
                            throw new CustomException('Unauthorized: api-node event carries no verified identity', 401);
                        }

                        if (!failureQueue) {
                            failureQueue = srcQueue;
                        }
                        rollbackConfig = ndp[poNode[j].nodeId]
                        let rquery,rapikey
                        let customConfig = ndp[poNode[j]?.nodeId]
                        let referenceKey = customConfig?.apiKey;
                        let customConfigPro = customConfig?.data?.pro.value;
                        let SessionfilterParams = customConfigPro?.filterParams//?.items;
                        let filterParams = customConfigPro?.request?.value?.filterParams?.items;                        
                        let nodeVersion = customConfig?.nodeVersion;
                        let rollback = customConfigPro?.enableRollback?.value
                        if(rollback){
                            rquery = customConfigPro?.enableRollback?.subSelection._true?.manualQuery?.value
                            rapikey = customConfigPro?.enableRollback?.subSelection._true?.apiKey?.value
                        }
                        let rule = customConfig?.rule
                        let tokenization = customConfig?.tokenization
                        let methodName, parameterQuery, parameter, contentType, serverUrl, endPoint, headerParams = {},httpAgentParams = {},httpAgentType,httpAgent, encCredentials, codeObj;
                        if (!referenceKey)
                           throw new CustomException('Reference key not found', 404);

                        await this.CommonService.assertConnectorTenant(referenceKey, pfdto?.authContext?.tenant);
                        let ApiConfig: any = JSON.parse(await this.redisService.getJsonData(referenceKey, collectionName));

                        if (!ApiConfig || Object.keys(ApiConfig).length == 0)
                            throw new CustomException('Reference key value not found', 404);

                        let apiVal = Object.values(ApiConfig)[0];
                        customConfig = apiVal;

                        let oprname: any = customConfig?.data?.method;
                        if (!oprname) throw new CustomException('Method Name not found', 404);
                        methodName = oprname.toLowerCase();
                        parameterQuery = customConfig?.data?.[methodName]?.parameters;
                        parameter = customConfig?.data[methodName];

                        serverUrl = customConfig?.data?.serverUrl 
                        endPoint = customConfig?.data?.endPoint;

                         if (nodeVersion?.toLowerCase() == 'v1') {
                            if (methodName == 'get') {
                                let responsekey = Object.keys(parameter?.responses)[0];
                                contentType = parameter?.responses[responsekey]?.content ? Object.keys(parameter.responses[responsekey]?.content)[0] : '';
                            } else {
                                contentType = parameter?.requestBody?.content ? Object.keys(parameter.requestBody.content)[0] : '';
                            }  
                            
                            let dpdKey = customConfigPro?.apiConfigName?.value;
                            let apiName = customConfigPro?.apiConfigName?.subSelection?.value;
                            //if(!dpdKey || !apiName) throw new CustomException('DPD Key/Api Name not found', 404);
                            if(dpdKey && apiName){
                                await this.CommonService.assertConnectorTenant(dpdKey, pfdto?.authContext?.tenant);
                                let dpdValue:any =  JSON.parse(await this.redisService.getJsonData(dpdKey+'NDP', collectionName));
                                if(!dpdValue) throw new CustomException('DPD value not found', 404); //|| Object.keys(dpdValue).length == 0
                                                               
                                let encDpdData:any = (Object.values(dpdValue))[0]   
                               
                                let dpdData:any = decrypt(encDpdData);
                                dpdData = dpdData?.data
                                
                                let apiSecurityItems = dpdData?.apiConfig?.items
                                if(apiSecurityItems?.length>0){
                                    for(let item of apiSecurityItems){
                                        let api_name = item?.api_name?.value
                                        if(api_name == apiName){
    
                                            //Header Params
                                            let headerItems = item?.headers?.items                          
                                            if(headerItems?.length > 0){
                                                for(let item of headerItems){                                  
                                                    headerParams[item.key?.value] = item.value?.value
                                                }
                                            }
    
                                            //Auth 
                                            let authType = item?.authentication?.value?.type?.value
                                            let authValue = item?.authentication?.value?.type?.subSelection[authType]?.value
                                            if(authType == "Bearer Token")
                                                headerParams['Authorization'] = `Bearer ${authValue}`; 
                                            if(authType == "API Key")
                                                headerParams['Authorization'] = `Bearer ${authValue}`; 
    
                                            //TLS 
                                            let tlsEnabled = item?.tls?.value
                                            let pfxFile,pfxPassphrase,rejectUnauthorized
                                            if(tlsEnabled){
                                                let tlsSubSelection = item?.tls?.subSelection?._true
                                                let host = tlsSubSelection?.host?.value
                                                let port = tlsSubSelection?.port?.value
                                                if(!host || !port) throw new CustomException('Invalid connection details',402)
                                                
                                                httpAgentParams['host']  = host
                                                httpAgentParams['port']  = port
    
                                                pfxFile = tlsSubSelection?.pfxFile?.value                                           
                                                
                                                if(pfxFile.endsWith('.pfx')){
                                                    pfxFile = pfxFile.slice(0,-4)
                                                } 
                                                
                                                 //? pfxFile : pfxFile + '.pfx'                                           
                                                pfxPassphrase = tlsSubSelection?.pfxPassphrase?.value
                                                rejectUnauthorized = tlsSubSelection?.rejectUnauthorized?.value  
    
                                                if(!pfxFile || !pfxPassphrase) throw new CustomException('Invalid tls details',402)   
    
                                                let url = this.envData.getSeaweedOutputHost() //process.env.SEAWEED_OUTPUT_HOST
                                                let userName = this.envData.getSeaweedUsername()//process.env.SEAWEED_USERNAME
                                                let password = this.envData.getSeaweedPassword()//process.env.SEAWEED_PASSWORD
    
                                                const seaWeedConfig = {
                                                    url: url,
                                                    username: userName,
                                                    password: password,
                                                };
                                                
                                                let pfxFileContent = await this.CommonService.setfileKeys(seaWeedConfig, 'read', '', pfxFile, 'pfx');
                                                pfxFileContent = Buffer.from(pfxFileContent);
                                                
                                                if (!Buffer.isBuffer(pfxFileContent)) {
                                                throw new Error("PFX file must be returned as Buffer");
                                                }
    
                                                httpAgentParams['pfx'] =  pfxFileContent //Buffer.from(pfxFileContent, 'base64')//fs.readFileSync(pfxFile)
                                                httpAgentParams['passphrase'] = pfxPassphrase
                                                httpAgentParams['rejectUnauthorized'] = rejectUnauthorized?false:true 
    
                                                httpAgent = new https.Agent(httpAgentParams);
                                            }
                                        }
                                    }
                                }                  
                            }

                        } 

                        let apires: any,headerRole,tokenrule
                        if (customConfig) {                        
                           const rulevar =  async (rulekey,flag?) => {
                            if (!rulekey) throw new CustomException(pfjson[j].nodeName+' rulekey key not found', 404);
                            let ruleConfig: any = JSON.parse(await this.redisService.getJsonData(rulekey, collectionName));                  
                            if (!ruleConfig || Object.keys(ruleConfig).length == 0)
                                throw new CustomException(pfjson[j].nodeName +' Reference key value not found', 404);
                            let rulejson: any = Object.values(ruleConfig)[0];
                            let rulecheck:any
                            if(flag)                 
                            rulecheck = await this.CommonService.getRuleCodeMapper(rulejson,{}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName);
                            else
                            rulecheck= await this.CommonService.ruleCheck(rulejson?.rule,{session:SessionInfo})  
                            return rulecheck;
                           }
                                                
                           if(rule?.approvalProcess){
                            let rulekey = rule?.ruleKey  
                            let flag = true                         
                            let hr = (await rulevar(rulekey,flag))?.rule
                            if(hr)
                            headerRole = Object.values(hr)[0]
                           }
                           //tokenization
                           if(tokenization?.tokenizationprocess){
                            let rulekey = tokenization?.ruleKey                           
                               tokenrule = (await rulevar(rulekey))                               
                             }
                           
                            encCredentials = await this.CommonService.checkEncryption(poNode[j]);
                            
                            if (currentFabric == 'PF-PFD' || currentFabric == 'PF-SFD' || currentFabric == 'PF-SCDL') {
                                RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], {}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName);
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

                            ifoObj = await this.ifoAssign(poJson?.internalMappingNodes, poNode[j].nodeId,sobj,zenresult,processedKey + upId,inputparam,pfdto)

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
                                            let filcol = filterParams[i]?.key?.value;
                                            let filval = filterParams[i]?.value?.value;
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

                                            let dfdheaders = {}
                                             dfdheaders['Authorization'] = `Bearer ${token}`; 
                                               if(tokenrule?.length>0){
                                                //dfdheaders['xDetokenize'] = tokenrule
                                                     dfdheaders = tokenrule.reduce((acc, item) => {
                                                    acc[item.field_name] = item.mask_type;
                                                    return acc;
                                                    }, dfdheaders as Record< string, string>);
                                                }    

                                            const requestConfig: AxiosRequestConfig = {
                                                headers: dfdheaders,
                                                timeout: 300000 
                                            }                                                    
                                            let postres = await this.executeApiCall(methodName, apiUrl, requestConfig)
                                            if (flag != 'N' && postres?.result?.length == 0 && logicCenter) {
                                                //await this.redisService.setStreamData(srcQueue, 'TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: apiUrl, response: postres } }));
                                                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(apiUrl), collectionName, 'request');
                                                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(postres?.result), collectionName, 'response');
                                                return {
                                                    status: 200,
                                                    targetStatus: targetStatus,
                                                    data: postres?.result,
                                                };
                                            } else if (postres?.status != 'Success' || postres?.result?.length == 0 && logicCenter) {
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

                                     if(searchFilter && !Array.isArray(searchFilter) && Object.keys(searchFilter).length>0 && !logicCenter){
                                       apires = apires.filter((item) =>
                                        Object.entries(searchFilter).every(([key, value]) => {
                                        const itemVal = item[key];
                                
                                        if (Array.isArray(value)) {
                                            return value.some(v =>
                                            typeof v === "string" && typeof itemVal === "string"
                                                ? itemVal.toLowerCase().includes(v.toLowerCase())
                                                : v === itemVal
                                            );
                                        }                                
                                        if (typeof value === "string" && typeof itemVal === "string") {
                                            return itemVal.toLowerCase().includes(value.toLowerCase());
                                        }
                                
                                        return itemVal == value;
                                        })
                                    );
                                    }else if(Array.isArray(searchFilter) && searchFilter?.length>0 && !logicCenter){                                                                  
                                        apires = await this.applyFilters(apires, searchFilter)                                
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
                                    
                                    inputparam = await this.assignToInputParam(inputparam, nodeName, apires)
                                    if (!inputparam || inputparam?.length == 0) {                                        
                                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(apires), collectionName, 'customResponse',);
                                        RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], {}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName);
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
                                    //await this.redisService.setStreamData(srcQueue, 'TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: inputparam, response: apires } }),);
                                    if (apires)
                                        await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, apiUrl, apires,);
                                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(apiUrl), collectionName, 'request',);
                                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(apires), collectionName, 'response',);
                                }
                            } else if (currentFabric == 'PF-PFD' || currentFabric == 'PF-SFD' || currentFabric == 'PF-SCDL') {
                                let staticSchedulerArtifact = await this.CommonService.splitcommonkey(referenceKey, 'AFK')
                                let apiUrl = serverUrl + endPoint;
                                let apiResult, DecapiResult, EncapiResult, EncryptedRqst
                                if (childInsertArr?.length > 0) {
                                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(childInsertArr), collectionName, 'request',);
                                    childInsertArr = childInsertArr.filter(item => item !== undefined)
                                    for (let r = 0; r < childInsertArr.length; r++) {
                                        if (childInsertArr[r])
                                            mapObj = childInsertArr[r];
                                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(mapObj), collectionName, 'request',);
                                        if (methodName) {
                                            if (methodName == 'get') {
                                                if (apiUrl) {
                                                    let requestConfig: AxiosRequestConfig
                                                    let params = await this.buildRequestComponents(apiUrl, tempQryVal, mapObj);
                                                    apiUrl = params?.apiUrl;
                                                      if(tokenrule?.length>0){
                                                        //params.headers['xDetokenize'] = tokenrule
                                                         params.headers = tokenrule.reduce((acc, item) => {
                                                        acc[item.field_name] = item.mask_type;
                                                        return acc;
                                                        }, params.headers as Record< string, string>);
                                                    }  
                                                    if(nodeVersion?.toLowerCase() == 'v1'){                                                        
                                                        if(Object.keys(headerParams).length>0 && params.headers && Object.keys(params.headers).length>0){
                                                            headerParams = Object.assign(headerParams,params.headers)
                                                            requestConfig = {
                                                                headers:headerParams,
                                                                timeout: 300000 
                                                            }
                                                        }else{
                                                            params.headers['Authorization'] = `Bearer ${token}`;                                                    
                                                            requestConfig = {
                                                                headers: params.headers,
                                                                timeout: 300000 
                                                            };
                                                        }
                                                        
                                                        if(Object.keys(httpAgentParams).length>0){    
                                                            requestConfig['httpsAgent'] = httpAgent
                                                        }
                                                    }
                                                     requestBody = Object.assign({headers:requestConfig?.headers},{apiUrl})
                                                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(requestBody), collectionName, 'request');
                                                    apiResult = await this.executeApiCall(methodName, apiUrl, requestConfig)

                                                    if (apiResult.statusCode == 201 || apiResult.statusCode == 200 )  {
                                                        if(apiResult?.result && Array.isArray(apiResult?.result) && apiResult?.result.length >0)
                                                          apiResult = apiResult?.result;
                                                        else if(apiResult?.result && Object.keys(apiResult?.result).length >0 )
                                                             apiResult = apiResult?.result;
                                                        else{
                                                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(apiUrl), collectionName, 'request');
                                                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(apiResult), collectionName, 'response');
                                                            return apiResult
                                                        }
                                                    } else {
                                                        throw apiResult;
                                                    }
                                                     RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j],{}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName);
                                                    if (RCMresult) {
                                                        zenresult = RCMresult?.rule;
                                                        customcoderesult = RCMresult?.code;
                                                    }
                                                    if (customcoderesult && customcoderesult != undefined && customcoderesult != null) {
                                                        codeObj = await this.codeAssign(customcoderesult)
                                                        if (codeObj)
                                                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);
                                                    }
                                                    ifoObj = await this.ifoAssign(poJson?.internalMappingNodes, poNode[j].nodeId,sobj,zenresult,processedKey + upId,inputparam,pfdto)
                                                    if (ifoObj && Object.keys(ifoObj).length > 0)
                                                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(ifoObj), collectionName, 'ifo',);
                                                    let assigndata = await this.assign(apiResult, ifoObj, codeObj, inputparam, nodeName, mapObj)
                                                    if(Array.isArray(assigndata.apiResult))
                                                    apichildResult = assigndata.apiResult
                                                    else
                                                    apichildResult.push(assigndata.apiResult)
                                                    inputparam = assigndata.inputparam
                                                } else {
                                                    throw new CustomException('API Endpoint does not exist', 404);
                                                }
                                            } else if (methodName == 'post') { 
                                                if (apiUrl) {
                                                    let params = await this.buildRequestComponents(apiUrl, tempQryVal, mapObj);
                                                    apiUrl = params?.apiUrl;
                                                    let requestConfig: AxiosRequestConfig

                                                    if (nodeVersion?.toLowerCase() == 'v1') {                                                        
                                                        if(contentType) params.headers['Content-Type'] = contentType;
                                                        if(headerRole){
                                                            params.headers['xCdcaRole'] = headerRole;
                                                            params.headers['xCdcaUsername'] = SessionToken?.loginId;
                                                        } 
                                                         if(tokenrule?.length>0){
                                                           // params.headers['xDetokenize'] = tokenrule
                                                            params.headers = tokenrule.reduce((acc, item) => {
                                                            acc[item.field_name] = item.mask_type;
                                                            return acc;
                                                            }, params.headers as Record< string, string>);
                                                        }
                                                        if(Object.keys(headerParams).length>0  && params?.headers && Object.keys(params?.headers).length>0){
                                                            headerParams = Object.assign(headerParams,params?.headers)
                                                            requestConfig = {
                                                                headers:headerParams,
                                                                timeout: 300000 
                                                            }
                                                        }else{
                                                            params.headers['Authorization'] = `Bearer ${token}`;
                                                            requestConfig = {
                                                                headers: params.headers,
                                                                timeout: 300000 
                                                            };
                                                        }
                                                        
                                                        if(Object.keys(httpAgentParams).length>0){
                                                            if(httpAgentType == 'http')
                                                                requestConfig['httpAgent'] = httpAgent
                                                            else if (httpAgentType == 'https')
                                                                requestConfig['httpsAgent'] = httpAgent
                                                        }
                                                        // No explicit TLS/agent config for this node: fall through to
                                                        // axios/Node's default HTTPS agent, which verifies certificates.
                                                        // Previously this branch created an https.Agent with
                                                        // rejectUnauthorized:false, silently disabling TLS verification
                                                        // (and MITM protection) for every outbound call that didn't
                                                        // configure a custom agent.

                                                        if (contentType == 'application/json' && mapObj && Object.keys(mapObj).length > 0) {
                                                            if (referenceKey.includes(':FNK:API-APIPD:')) {
                                                                mapObj['trs_event_process_status'] = sourceStatus;
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
                                                                mapObj['trs_app_code'] = SessionToken?.app                                                             
                                                            }
                                                            
                                                            if([
                                                                'post_scheduler_startAllScheduler','post_scheduler_startSpecificScheduler',
                                                                'post_scheduler_stopAllScheduler','post_scheduler_stopSpecificScheduler'
                                                               ].includes(staticSchedulerArtifact)){
                                                                const keyArr = key.split(':');                                                           
                                                                const jobname = ((keyArr[1] + keyArr[5] + keyArr[7] + keyArr[9]).replace(/[-_]/g, '')).replace(/\s+/g, '');
                                                                mapObj['pf_key'] = jobname;
                                                            }
                                                           
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

                                                            if (tempQryVal?.length > 0) {
                                                                for (let t = 0; t < tempQryVal.length; t++) {
                                                                    if (mapObj[tempQryVal[t]['key']] && (tempQryVal[t]['type'] == 'header' )) {
                                                                        //primaryKey = mapObj[tempQryVal[t]['key']];
                                                                        delete mapObj[tempQryVal[t]['key']];
                                                                    }
                                                                }
                                                            }
                                                                requestBody = Object.assign({headers:requestConfig?.headers},mapObj)
                                                                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(requestBody), collectionName, 'request');
                                                                apiResult = await this.executeApiCall(methodName, apiUrl, requestConfig, mapObj)
                                                                
                                                            }
                                                        } else if (contentType == 'text/plain') {                                                            
                                                            let textdata = textobj.replace(/\\n/g, '\n');
                                                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(textdata), collectionName, 'request');
                                                            apiResult = await this.executeApiCall(methodName, apiUrl, requestConfig, textdata)
    
                                                        } else if (contentType == 'application/xml') {                                                            
                                                            const jsonString = JSON.stringify(textobj);
                                                            const xml = json2xml(jsonString, { compact: true, spaces: 4 });
                                                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(xml), collectionName, 'request');
                                                            apiResult = await this.executeApiCall(methodName, apiUrl, requestConfig, xml)
                                                        }
                                                        
                                                    }
                                                    if (apiResult) {
                                                        if (apiResult.statusCode == 201 || apiResult.statusCode == 200) {
                                                            apiResult = apiResult?.result;
                                                        } else {
                                                            throw apiResult;
                                                        }
                                                        let assigndata = await this.assign(apiResult, ifoObj, codeObj, inputparam, nodeName, mapObj)
                                                        apichildResult.push(assigndata.apiResult)
                                                        inputparam = assigndata.inputparam
                                                    }
                                                }
                                                else {
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
                                                     if(tokenrule?.length>0){
                                                        //params.headers['xDetokenize'] = tokenrule
                                                         params.headers = tokenrule.reduce((acc, item) => {
                                                        acc[item.field_name] = item.mask_type;
                                                        return acc;
                                                        }, params.headers as Record< string, string>);
                                                    }
                                                    apiUrl = params?.apiUrl;
                                                    const requestConfig: AxiosRequestConfig = {
                                                        headers: params.headers,
                                                        timeout: 300000 
                                                    };
                                                    if (mapObj && Object.keys(mapObj).length > 0) {
                                                        if (referenceKey.includes(':FNK:API-APIPD:')) {
                                                            mapObj['trs_event_process_status'] = sourceStatus;
                                                            mapObj['trs_modified_by'] = SessionToken?.loginId;
                                                            mapObj['trs_process_id'] = upId;                                                            
                                                        }
                                                    } else {
                                                        throw 'MappingObject is empty';
                                                    }
                                                    if([
                                                        'post_scheduler_startAllScheduler','post_scheduler_startSpecificScheduler',
                                                        'post_scheduler_stopAllScheduler','post_scheduler_stopSpecificScheduler'
                                                        ].includes(staticSchedulerArtifact)){
                                                        const keyArr = key.split(':');                                                           
                                                        const jobname = ((keyArr[1] + keyArr[5] + keyArr[7] + keyArr[9]).replace(/[-_]/g, '')).replace(/\s+/g, '');
                                                        mapObj['pf_key'] = jobname;
                                                    }

                                                    let tempEndpoint = endPoint.replace(/{(.*?)}/g, (_, key) => mapObj[key] || '',);
                                                    let primaryKey
                                                    if (tempQryVal?.length > 0) {
                                                        for (let t = 0; t < tempQryVal.length; t++) {
                                                            if (mapObj[tempQryVal[t]['key']] && (tempQryVal[t]['type'] == 'path' || tempQryVal[t]['type'] == 'query')) {
                                                                primaryKey = mapObj[tempQryVal[t]['key']];
                                                                delete mapObj[tempQryVal[t]['key']];
                                                            }
                                                        }
                                                    }
                                                    if (!primaryKey) throw 'Primary Key not found'
                                                    let split = endPoint.split('/')
                                                    let tableName = split[1]
                                                     if(tableName == pfdto?.tableName){
                                                         if(pfdto?.trs_version)
                                                            mapObj['trs_version'] = pfdto?.trs_version
                                                    }
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
                                                                if (rollback && rollback == 'true') {
                                                                    let beforeUpdate = await this.executeApiCall(methodName, serverUrl + tempEndpoint, requestConfig)
                                                                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(beforeUpdate), collectionName, 'rollback')
                                                                }
                                                                 requestBody = Object.assign({headers:requestConfig?.headers},mapObj)
                                                                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(requestBody), collectionName, 'request');
                                                                apiResult = await this.executeApiCall(methodName, serverUrl + tempEndpoint, requestConfig, mapObj)
                                                                if (apiResult.statusCode == 201 || apiResult.statusCode == 200) {
                                                                    apiResult = apiResult?.result;
                                                                } else {
                                                                    throw apiResult;
                                                                }                                                               
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
                                                                DecapiResult = await this.CommonService.commondecryption(encCredentials?.selectedDpd, encCredentials?.encryptionMethod, EncapiResult?.result, 'secretkey',);

                                                                apiResult = JSON.parse(DecapiResult);
                                                            } else {
                                                                if (rollback && rollback == 'true') {
                                                                    let beforeUpdate = await this.executeApiCall(methodName, serverUrl + tempEndpoint, requestConfig)
                                                                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j]?.nodeName + '.PRO', JSON.stringify(beforeUpdate), collectionName, 'rollback')
                                                                }
                                                                 requestBody = Object.assign({headers:requestConfig?.headers},mapObj)
                                                                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(requestBody), collectionName, 'request');
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
                                                            }else{
                                                                throw error
                                                            }
                                                        }
                                                    }

                                                    let assigndata = await this.assign(apiResult, ifoObj, codeObj, inputparam, nodeName, mapObj)
                                                    //apichildResult = assigndata.apichildResult
                                                    apichildResult.push(assigndata.apiResult)
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
                                                     if(tokenrule?.length>0){
                                                        //params.headers['xDetokenize'] = tokenrule
                                                         params.headers = tokenrule.reduce((acc, item) => {
                                                        acc[item.field_name] = item.mask_type;
                                                        return acc;
                                                        }, params.headers as Record< string, string>);
                                                     }
                                                    apiUrl = params?.apiUrl;
                                                    const requestConfig: AxiosRequestConfig = {
                                                        headers: params.headers,
                                                        timeout: 300000 
                                                    };
                                                    apiResult = await this.executeApiCall(methodName, apiUrl, requestConfig)
                                                    if (apiResult.statusCode == 201 || apiResult.statusCode == 200) {
                                                        apiResult = apiResult?.result;
                                                    } else {
                                                        throw apiResult;
                                                    }
                                                    let assigndata = await this.assign(apiResult, ifoObj, codeObj, inputparam, nodeName, mapObj)
                                                    apichildResult.push(assigndata.apiResult)
                                                    inputparam = assigndata.inputparam
                                                } else {
                                                    throw new CustomException('API Endpoint does not exist', 404);
                                                }
                                            }
                                        }
                                    }
                                } else if (methodName == 'get') {
                                    if (apiUrl) {
                                        let requestConfig:AxiosRequestConfig

                                        let params = await this.buildRequestComponents(apiUrl, tempQryVal, mapObj);
                                        apiUrl = params?.apiUrl;
                                        if(tokenrule?.length>0){
                                            //params.headers['xDetokenize'] = tokenrule
                                             params.headers = tokenrule.reduce((acc, item) => {
                                                        acc[item.field_name] = item.mask_type;
                                                        return acc;
                                                        }, params.headers as Record< string, string>);
                                         } 
                                        if(nodeVersion?.toLowerCase() == 'v1'){                                                        
                                            if(Object.keys(headerParams).length>0 && params?.headers && Object.keys(params?.headers).length>0){
                                                headerParams = Object.assign(headerParams,params?.headers)
                                                requestConfig = {
                                                    headers:headerParams,
                                                    timeout: 300000 
                                                }
                                            }else{
                                                params.headers['Authorization'] = `Bearer ${token}`;                                                    
                                                requestConfig = {
                                                    headers: params.headers,
                                                    timeout: 300000 
                                                };
                                            }
                                            
                                            if(Object.keys(httpAgentParams).length>0){    
                                                requestConfig['httpsAgent'] = httpAgent
                                            }
                                        }
                                        apiResult = await this.executeApiCall(methodName, apiUrl, requestConfig)
                                        
                                        if (apiResult.statusCode == 201 || apiResult.statusCode == 200) {
                                            apiResult = apiResult?.result;
                                        } else {
                                            throw apiResult;
                                        }
                                        RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j],{}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName);
                                        if (RCMresult) {
                                            zenresult = RCMresult?.rule;
                                            customcoderesult = RCMresult?.code;
                                        }
                                        if (customcoderesult && customcoderesult != undefined && customcoderesult != null) {
                                            codeObj = await this.codeAssign(customcoderesult)
                                            if (codeObj)
                                                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j]?.nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);
                                        }
                                        ifoObj = await this.ifoAssign(poJson?.internalMappingNodes, poNode[j]?.nodeId,sobj,zenresult,processedKey + upId,inputparam,pfdto)
                                        if (ifoObj && Object.keys(ifoObj).length > 0)
                                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j]?.nodeName + '.PRO', JSON.stringify(ifoObj), collectionName, 'ifo',);
                                        let assigndata = await this.assign(apiResult, ifoObj, codeObj, inputparam, nodeName, mapObj)
                                        if(Array.isArray(assigndata?.apiResult))
                                        apichildResult = assigndata?.apiResult
                                        else
                                        apichildResult.push(assigndata.apiResult)
                                        inputparam = assigndata?.inputparam
                                    } else {
                                        throw new CustomException('API Endpoint does not exist', 404);
                                    }
                                } else if (textobj && methodName == 'post') {
                                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j]?.nodeName + '.PRO', JSON.stringify(textobj), collectionName, 'request',);
                                    if (apiUrl) {
                                        let headarr = {}
                                        let params = await this.buildRequestComponents(apiUrl, tempQryVal, mapObj);
                                        apiUrl = params?.apiUrl;
                                        if (contentType == 'text/plain') {
                                            headarr['Content-Type'] = 'text/plain';
                                            const requestConfig: AxiosRequestConfig = {
                                                headers: headarr,
                                                timeout: 300000 
                                            };

                                            let textdata = textobj.replace(/\\n/g, '\n');
                                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j]?.nodeName + '.PRO', JSON.stringify(textdata), collectionName, 'request');
                                            apiResult = await this.executeApiCall(methodName, apiUrl, requestConfig, textdata)

                                        } else if (contentType == 'application/xml') {
                                            headarr['Content-Type'] = 'application/xml';
                                            const requestConfig: AxiosRequestConfig = {
                                                headers: headarr,
                                                timeout: 300000 
                                            };
                                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(textobj), collectionName, 'request');
                                            apiResult = await this.executeApiCall(methodName, apiUrl, requestConfig, textobj)

                                        } else {
                                            throw new CustomException(`Mapping was required in ${poNode[j]?.nodeName}`, 400);
                                        }
                                        if (apiResult) {
                                            if (apiResult.statusCode == 201 || apiResult.statusCode == 200) {
                                                apiResult = apiResult?.result;
                                            } else {
                                                throw apiResult;
                                            }
                                            let assigndata = await this.assign(apiResult, ifoObj, codeObj, inputparam, nodeName, mapObj)
                                            apichildResult.push(assigndata.apiResult)
                                            inputparam = await this.assignToInputParam(inputparam, nodeName, apichildResult)
                                        }
                                    } else {
                                        throw new CustomException('API Endpoint does not exist', 404);
                                    }
                                }
                                if(childInsertArr?.length == 1 && methodName != 'get')
                                    apichildResult = apichildResult[0]
                                //await this.redisService.setStreamData(srcQueue, 'TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: inputparam, response: apichildResult } }));
                                //await this.redisService.setStreamData(targetQueue, 'TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: inputparam, response: apichildResult } }),);
                                if (EncapiResult?.result) {
                                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(EncapiResult?.result), collectionName, 'response',);
                                    await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, EncryptedRqst, EncapiResult?.result,);
                                } else {
                                    if (apichildResult?.length>0 || Object.keys(apichildResult).length>0) {
                                        if(Array.isArray(apichildResult))
                                        apichildResult = apichildResult.flat()
                                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(apichildResult), collectionName, 'response',);
                                        await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, requestBody, apichildResult);
                                        apires = apichildResult;                                        
                                        await this.redisService.setJsonData(processedKey + upId + ':rule',JSON.stringify(Array.isArray(apichildResult)?apichildResult[0]:apichildResult),collectionName,nodeName);
                                    } else if(apiResult && ((Array.isArray(apiResult) && apiResult.length > 0) || (!Array.isArray(apiResult) && typeof apiResult === 'object' && Object.keys(apiResult).length > 0))) {
                                         if(Array.isArray(apiResult))
                                        apiResult = apiResult.flat()
                                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(apiResult), collectionName, 'response',);
                                        await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, requestBody, apiResult,);
                                        apires = apiResult;                                       
                                        await this.redisService.setJsonData(processedKey + upId + ':rule',JSON.stringify(Array.isArray(apiResult)?apiResult[0]:apiResult),collectionName,nodeName);                                       
                                    }else{
                                        if(['patch','put'].includes(methodName))
                                        throw new CustomException('Primary Key/update Failed',404)
                                        else
                                        throw new CustomException('ApiResult not found',404)
                                    }
                                    
                                }
                            }
                        }
                       
                        
                        this.logger.log('Api node completed');
                        if (currentFabric == 'PF-PFD' || currentFabric == 'PF-SFD' || currentFabric == 'PF-SCDL')
                            return { status: 200, targetStatus: targetStatus, data: inputparam,method:methodName};
                        else
                            return { status: 200, targetStatus: targetStatus, data: apires };
                    
                } catch (error) {                     
                    await this.CommonService.checkRollBack(ndp, collectionName, 'rollback', {
                        key: processedKey + upId,
                        nodeid: rollbackConfig?.nodeId,
                        nodename: rollbackConfig?.nodeName,
                        savepoint: rollbackConfig?.savePoint,
                        data: apichildResult,
                        pfs:pfjson
                    }, pfdto?.authContext?.tenant
                    );
                    await this.exceptionhandler(failureQueue, suspiciousQueue, errorQueue, error, upId, nodeId, failureTargetStatus, inputparam)
                }
            }

            //AutomationNode
            if (nodeType == 'automationnode' && poNode[j].nodeId == nodeId) {
                try {
                    this.logger.log('Automation Node Started');
                    
                    RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], {}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName);
                    if (RCMresult) {
                        zenresult = RCMresult?.rule;
                        customcoderesult = RCMresult?.code;
                    }
                    if (customcoderesult && customcoderesult != undefined && customcoderesult != null) {
                        codeObj = await this.codeAssign(customcoderesult)
                        if (codeObj) {
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j]?.nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);
                            if (inputparam)
                                inputparam = await this.codeORifoAndInputparamAssign(codeObj, inputparam)
                        }
                    }

                    let customConfig = ndp[poNode[j]?.nodeId]
                    let streamName = customConfig?.data?.streamName;
                    let res = await this.redisService.setStreamData(streamName, upId, JSON.stringify(inputparam))
                    // await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: streamName, response: inputparam } }));
                    // await this.redisService.setStreamData(targetQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: streamName, response: inputparam } }));
                                       
                    if (inputparam) {
                        res = Object.assign(inputparam, res);
                    }
                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(res), collectionName, 'response');
                    if (res)
                        await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, inputparam, res);
                    await this.redisService.setJsonData(processedKey + upId + ':rule',JSON.stringify(Array.isArray(res)?res[0]:res),collectionName,nodeName);
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
                    // Q19 remediation: same gate as the outputnode branch —
                    // ndp/poNode is caller-supplied with no server-side
                    // validation of its shape, and this branch resolves and
                    // connects to a real database using whichever connector
                    // the caller-controlled dpdkey points at. Refuse to run
                    // without a verified identity attached by
                    // AuthGuard.canActivateRpc().
                    if (!pfdto?.authContext) {
                        throw new CustomException('Unauthorized: db-node event carries no verified identity', 401);
                    }
                    let qryres: any;
                    let customConfig = ndp[poNode[j]?.nodeId]
                    rollbackConfig = ndp[poNode[j]?.nodeId]
                    let client, oprname, manualQuery,rule
                    let dbconfig = await this.CommonService.dbconfig(customConfig, collectionName, pfdto?.authContext?.tenant)
                    client = dbconfig?.client
                    let nodeVersion = customConfig?.nodeVersion;
                    if (nodeVersion?.toLowerCase() == 'v1') {
                        RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j],  {}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName);
                        let queryName
                        let ruleRes = RCMresult?.rule                        
                        if(ruleRes && typeof ruleRes == 'object'){
                            queryName = Object?.values(ruleRes)[0]
                        }else if(ruleRes && typeof ruleRes == 'string'){
                            queryName = ruleRes
                        }    
                        let qryfield = dbconfig?.qrydata
                        if(qryfield?.length>0){
                        for(let item of qryfield){
                        if(queryName){
                        if(item?.value?.queryname?.value == queryName){
                            manualQuery = item?.value?.query?.value
                        }
                        }else if(qryfield.length == 1){
                            manualQuery = item?.value?.query?.value.replace(/\r?\n/g, ' ')   // replace newline with space
                            .replace(/\s+/g, ' ')     // remove extra spaces
                            .trim();
                        }
                        }
                        }         
                    }      
                    
                     let tokenrule;
                    let tokenization = customConfig?.tokenization
                    const rulevar =  async (rulekey) => {
                            if (!rulekey) throw new CustomException(pfjson[j].nodeName+' rulekey key not found', 404);
                            let ruleConfig: any = JSON.parse(await this.redisService.getJsonData(rulekey, collectionName));                  
                            if (!ruleConfig || Object.keys(ruleConfig).length == 0)
                                throw new CustomException(pfjson[j].nodeName +' Reference key value not found', 404);
                            let rulejson: any = Object.values(ruleConfig)[0];
                            //let rulecheck:any = await this.CommonService.getRuleCodeMapper(rulejson, {}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName);
                           let rulecheck:any = await this.CommonService.ruleCheck(rulejson?.rule,{session:SessionInfo})
                            return rulecheck;
                           }                                               
                          
                           //tokenization
                           if(tokenization?.tokenizationprocess){
                            let rulekey = tokenization?.ruleKey                           
                               tokenrule = (await rulevar(rulekey))                               
                             }
                   
                    let qry,cleanedQuery,logqry,mapObj = {};
                    let formKey: any = ``;
                    let removedVal,ufCondition             
                     if(manualQuery)
                       manualQuery = manualQuery.replace(/[;\s]+$/, '');                     

                    let childInsertArr,schema, tempQryVal = []
                    let qryarr =[]
                     if(pfo?.length>0){
                        for(let a=0;a< pfo.length;a++){
                            if(poNode[j]?.nodeId == pfo[a].nodeId){
                                schema = pfo[a]?.schema
                            }
                        }
                    }                   

                    if (internalEdges && internalEdges.hasOwnProperty(poNode[j]?.nodeId)) {
                        let currentNodeEdge = internalEdges[poNode[j]?.nodeId];
                        if (currentFabric == 'DF-DFD') {
                            let DfmappedData = await this.DFDMapEdgeValues(poNode, currentNodeEdge, inputparam, processedKey, upId, collectionName,  '', '', pfo, currentFabric)
                            mapObj = DfmappedData?.mapObj
                            tempQryVal = DfmappedData?.tempQryVal
                        } else {
                            let mappedData = await this.mapEdgeValuesToParams(pfdto, currentNodeEdge, inputparam, processedKey, upId, collectionName,  '', '', pfo)
                            childInsertArr = mappedData?.childInsertArr
                            tempQryVal = mappedData?.tempQryVal
                        }                      
                        
                        if (childInsertArr?.length > 0) {
                            for (let i = 0; i < childInsertArr.length; i++) {
                                mapObj = childInsertArr[i]
                                mapObj = Object.assign(mapObj,sobj)                                
                                let Qry = manualQuery 
                                Qry = await this.replaceQuery(Qry,mapObj)
                                let replaceData = await this.dollarReplace(Qry,mapObj,schema)
                                let replaceQry = replaceData?.manualQuery
                                if(childInsertArr.length ==1)
                                    manualQuery = replaceQry
                                else
                                    qryarr.push(replaceQry)
                            }                      

                        } else {
                             mapObj = sobj
                            if (mapObj && Object.keys(mapObj).length > 0) {                                            
                                manualQuery = await this.replaceQuery(manualQuery,mapObj)                            
                            }
                        }
                    } else{
                        mapObj = sobj
                          if(searchFilter && !Array.isArray(searchFilter) && Object.keys(searchFilter).length>0 && !logicCenter){
                             mapObj = Object.assign(mapObj,searchFilter)                               
                            let replaceData = await this.dollarReplace(manualQuery,searchFilter,schema) 
                            manualQuery = replaceData.manualQuery
                            searchFilter = replaceData.filterObj 
                         }else if(searchFilter && Array.isArray(searchFilter) && searchFilter.length>0 && !logicCenter){
                            let searchArrObj = {}
                            for(let item of searchFilter){
                                searchArrObj[item.key] = item.value
                            }
                            mapObj = Object.assign(mapObj,searchArrObj)                           
                            let replaceData = await this.dollarReplace(manualQuery,searchFilter,schema)  
                            manualQuery = replaceData.manualQuery
                            searchFilter = replaceData.filterObj  

                        }

                        if(filterData && filterData?.length>0){
                            for (let f = 0; f < filterData.length; f++){
                            if (filterData[f].nodeId && filterData[f].nodeId == poNode[j].nodeId){
                                 const { nodeId, ...filterParamsObj } = filterData[f];                                 
                                const filterParamsObjKey = Object.keys(filterParamsObj);
                                const filterParamsObjvalues = Object.values(filterParamsObj);
                                let removedkey,filterObj = {}
                                for (let p = 0; p < filterParamsObjKey.length; p++){
                                    const value = filterParamsObjvalues[p];
                                    const key = filterParamsObjKey[p]
                                     if (key.includes('.')) {
                                        let s_item = key.split('.');
                                        removedkey = s_item.filter((item) => !this.statickeyword.includes(item)).join('.');
                                        if (removedkey.includes('.') && removedkey.startsWith('items.')) {
                                            removedkey = removedkey.replace('items.', '');
                                        }
                                    } else {
                                        removedkey = key
                                    }
                                    filterObj[removedkey] = value
                                }
                                mapObj = Object.assign(mapObj,filterObj)                                                                                     
                              let replaceData =  await this.dollarReplace(manualQuery,filterObj,schema,filterData)
                              manualQuery = replaceData.manualQuery
                              filterData = replaceData.filterData                                                              
                            }
                            }                            
                        }

                        if (mapObj && Object.keys(mapObj).length > 0) {
                            manualQuery = await this.replaceQuery(manualQuery,mapObj)  
                        }                    
                    }    
                     const singleMatches = [...manualQuery.matchAll(/\$\{([^}]+)\}/g)];
                        const singlevariables = singleMatches.map(match => match[1]);
                        singlevariables.forEach((key) => {
                            const regex = new RegExp(
                                `(?:\\([^)]+\\)|\\w+)?\\.\\$\\{${key}\\}|\\$\\{${key}\\}`,
                                'g'
                            );
                            manualQuery = manualQuery.replace(regex, '1=1');                             
                        });
                
                    if(qryarr?.length>0){
                    let resdbarr =[]
                    await client.connect();
                    for(let item of qryarr){
                        try{
                     if (item) qryres = await client.query(item);                                           
                    if (qryres) dbres = qryres.rows; 
                        resdbarr.push(dbres)
                    }catch(err){
                       await client.end()
                        throw err
                    }
                        }
                    await client.end();
                    if(resdbarr?.length>0)
                    dbres = resdbarr                   
                    logqry = qryarr
                    }
                   
                    else if (manualQuery) {
                        qry = manualQuery;
                        const isDML = /^(insert\s+into|update|delete)\b/i.test(qry.trim()); 
                        if (isDML) {
                            oprname = 'insert'
                            if (mapObj && Object.keys(mapObj).length > 0) {
                                Object.keys(mapObj).forEach(key => {
                                    const regex = new RegExp(`\\$\\$${key}`, 'g');
                                    const value = this.CommonService.sqlLiteral(mapObj[key]);
                                    qry = qry.replace(regex, value);
                                });
                            }   
                        //trs_version_no (lock update) 
                        if(pfdto?.tableName && pfdto?.trs_version && qry.toLowerCase().includes('update') && qry.toLowerCase().includes(pfdto?.tableName)){
                            qry =  await this.CommonService.appendWhereClause(qry,`trs_version = ${this.CommonService.sqlLiteral(pfdto?.trs_version)}`)//qry + ` where trs_version_no = ${pfdto?.trs_version_no}`
                        }                  
                        logqry = qry
                        }  else {
                            oprname = 'select'
                            if (qry.endsWith(';')) {
                                qry = qry.slice(0, -1);
                            }

                            let s_order,s_by
                            if(sortingDetails && Object.keys(sortingDetails).length>0){
                                s_order = Object.keys(sortingDetails)[0]
                                s_by = Object.values(sortingDetails)[0]
                                s_by = s_by.toUpperCase()
                                if(!['DESC','ASC'].includes(s_by)) throw new CustomException('Invalid Sorting Type', 404); 
                            }

                            if (page && count) {
                                 cleanedQuery = qry.trim();
                                 let cQuery
                                 if(s_order && s_by)
                                    cQuery = `WITH base AS (${cleanedQuery}) SELECT *, COUNT(*) OVER() AS total_records FROM base ORDER BY ${s_order} ${s_by}`
                                 else
                                    cQuery = `WITH base AS (${cleanedQuery}) SELECT *, COUNT(*) OVER() AS total_records FROM base`

                                if (/limit\s+\d+/i.test(cQuery)) 
                                  qry = cQuery
                                  // throw new Error('LIMIT clause detected. Please do not include it.');                                   
                                else
                                  qry = `${cQuery} LIMIT ${count} OFFSET ${offset}`;
                            }

                           
                            if (filterData && filterData.length) {
                                for (let f = 0; f < filterData.length; f++) {
                                    if (filterData[f].nodeId && filterData[f].nodeId == poNode[j].nodeId) {
                                        const { nodeId, ...filterParamsObj } = filterData[f];
                                        const filterParamsObjKey = Object.keys(filterParamsObj);
                                        const filterParamsObjvalues =
                                            Object.values(filterParamsObj);
                                        for (let p = 0; p < filterParamsObjKey.length; p++) {
                                            const key = filterParamsObjKey[p];
                                            if(key == `${process.env.CLIENTCODE}_condition`){
                                                ufCondition = filterParamsObj[key]
                                                continue
                                            }
                                            if (key.includes('.')) {
                                                let s_item = key.split('.');
                                                removedVal = s_item.filter((item) => !this.statickeyword.includes(item)).join('.');
                                                if (removedVal.includes('.') && removedVal.startsWith('items.')) {
                                                    removedVal = removedVal.replace('items.', '');
                                                }
                                            } else {
                                                removedVal = key
                                            }
                                            // Column names here come from client-supplied filterData and are spliced
                                            // directly into the WHERE fragment; reject anything that isn't a plain
                                            // (optionally dotted) SQL identifier instead of concatenating it.
                                            if (!this.CommonService.isSafeSqlIdentifier(removedVal)) continue;
                                            const value = filterParamsObjvalues[p];
                                             const dateType = this.isDateTimeField(schema, removedVal);                               
                                            if(dateType){                                        
                                                formKey = formKey + ` DATE(${removedVal}) = ${this.CommonService.sqlLiteral(value)} AND`;
                                            }
                                            else if (typeof value == 'number') {
                                                formKey = formKey + ` ${removedVal} = ${value} AND`;
                                            } else if (typeof value == 'string') {
                                                formKey = formKey + ` ${removedVal} = ${this.CommonService.sqlLiteral(value)} AND`;
                                            } else if (Array.isArray(value) && value.length > 0) {
                                                let s = ''
                                                for (let item of value) {
                                                    s = s + `${this.CommonService.sqlLiteral(item)},`
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
                           
                            if(searchFilter && !Array.isArray(searchFilter) && Object.keys(searchFilter).length>0 && !logicCenter){
                                 const searchParamsObjKey = Object.keys(searchFilter);
                                const searchParamsObjvalues =
                                    Object.values(searchFilter);
                                for (let p = 0; p < searchParamsObjKey.length; p++) {
                                    const key = searchParamsObjKey[p];
                                    if (key.includes('.')) {
                                        let s_item = key.split('.');
                                        removedVal = s_item.filter((item) => !this.statickeyword.includes(item)).join('.');
                                        if (removedVal.includes('.') && removedVal.startsWith('items.')) {
                                            removedVal = removedVal.replace('items.', '');
                                        }
                                    } else {
                                        removedVal = key
                                    }
                                    // Column names here come from client-supplied filterData and are spliced
                                    // directly into the WHERE fragment; reject anything that isn't a plain
                                    // (optionally dotted) SQL identifier instead of concatenating it.
                                    if (!this.CommonService.isSafeSqlIdentifier(removedVal)) continue;
                                    const value = searchParamsObjvalues[p];
                                     const dateType = this.isDateTimeField(schema, removedVal);                               
                                    if(dateType){                                        
                                        formKey = formKey + ` DATE(${removedVal}) = ${this.CommonService.sqlLiteral(value)} AND`;
                                    }
                                    else if (typeof value == 'number') {
                                         formKey = formKey + ` ${removedVal}::TEXT LIKE ${this.CommonService.sqlLiteral(value + '%')} AND`;
                                    } else if (typeof value == 'string') {
                                        formKey = formKey + ` ${removedVal} LIKE ${this.CommonService.sqlLiteral(value + '%')} AND`;
                                    } else if (Array.isArray(value) && value.length > 0) {
                                        let s = ''
                                        for (let item of value) {
                                            s = s + `${this.CommonService.sqlLiteral(item + '%')},`
                                        }
                                        if (s.endsWith(',')) {
                                            s = s.slice(0, -1);
                                        }
                                        formKey = formKey + ` ${removedVal} LIKE ANY (ARRAY[${s}]) AND`;
                                    }
                                }

                                 if (formKey.endsWith(' AND')) {
                                    formKey = formKey.slice(0, -4);
                                }
                            }else if(Array.isArray(searchFilter) && searchFilter?.length>0 && !logicCenter){                                
                                for (let p = 0; p < searchFilter.length; p++) {
                                    let key = searchFilter[p].key;
                                    if (key.includes('.')) {
                                        let s_item = key.split('.');
                                        removedVal = s_item.filter((item) => !this.statickeyword.includes(item)).join('.');
                                        if (removedVal.includes('.') && removedVal.startsWith('items.')) {
                                            removedVal = removedVal.replace('items.', '');
                                        }
                                    } else {
                                        removedVal = key
                                    }
                                    // Column names here come from client-supplied filterData and are spliced
                                    // directly into the WHERE fragment; reject anything that isn't a plain
                                    // (optionally dotted) SQL identifier instead of concatenating it.
                                    if (!this.CommonService.isSafeSqlIdentifier(removedVal)) continue;
                                    let value = searchFilter[p].value;
                                    let value2 = searchFilter[p].value2;
                                    let operator = searchFilter[p].operator;
                                    let type = searchFilter[p].type;
                                    
                                    if(key && value && operator){   
                                        if (['=', '!=', '<>', '>=', '<=', '>', '<'].includes(operator)) { 
                                            if (type === 'date') 
                                                formKey = formKey + ` DATE(${removedVal}) ${operator} ${this.CommonService.sqlLiteral(value)} AND`; 
                                            if (typeof value == 'number')
                                                formKey = formKey + ` ${removedVal} ${operator} ${value} AND`;
                                            if(typeof value == 'string')
                                                formKey = formKey + ` ${removedVal} ${operator} ${this.CommonService.sqlLiteral(value)} AND`;                                            
                                        }else if(['LIKE','NOT LIKE','LIKE_START','LIKE_END'].includes(operator)){  
                                            let likeMap = {
                                                LIKE_START: `${value}%`,
                                                LIKE_END: `%${value}`,
                                                LIKE: `%${value}%`
                                            };

                                            const likeVal = likeMap[operator];

                                            if (typeof value == 'string')
                                                formKey = formKey + ` ${removedVal} LIKE ${this.CommonService.sqlLiteral(likeVal)} AND`;                                            
                                            if (typeof value == 'number')
                                                formKey = formKey + ` ${removedVal}::TEXT LIKE ${this.CommonService.sqlLiteral(likeVal)} AND`;
                                        }else if(['BETWEEN','NOT BETWEEN'].includes(operator)){
                                            if (value && value2){
                                                if (type === 'date') 
                                                    formKey = formKey + ` DATE(${removedVal}) ${operator} ${this.CommonService.sqlLiteral(value)} AND ${this.CommonService.sqlLiteral(value2)} AND`;
                                                    else                                                    
                                                    formKey = formKey + ` ${removedVal} ${operator} ${this.CommonService.sqlLiteral(value)} AND ${this.CommonService.sqlLiteral(value2)} AND`;                                                
                                            }
                                        }                                                                          
                                    }                                   

                                }                               

                                if (formKey.endsWith(' AND')) {
                                    formKey = formKey.slice(0, -4);
                                }
                            }

                            if (formKey){
                                if(ufCondition){
                                    formKey = formKey + ` AND ${ufCondition}`
                                }    
                            }else if(ufCondition){
                                formKey = ufCondition
                            }

                             //  if(formKey){
                            //      qry = await this.CommonService.appendWhereClause(qry, formKey);
                            //      logqry = await this.CommonService.appendWhereClause(`${cleanedQuery} LIMIT ${count} OFFSET ${offset}`, formKey);
                            // }
                            if (formKey && (/\$where/i.test(qry) || /\$and/i.test(qry))) {
                                    qry = qry
                                        .replace(/\$where/gi, `WHERE ${formKey}`)
                                        .replace(/\$and/gi, `AND ${formKey}`);

                                    logqry = `${cleanedQuery} LIMIT ${count} OFFSET ${offset}`
                                        .replace(/\$where/gi, `WHERE ${formKey}`)
                                        .replace(/\$and/gi, `AND ${formKey}`);
                                }
                            else{
                                if(currentFabric == 'DF-DFD')
                                logqry = `${cleanedQuery} LIMIT ${count} OFFSET ${offset}`
                                else 
                                logqry = qry
                            }

                             if((/\$where/i.test(qry) || /\$and/i.test(qry))){
                                 qry = qry.replace(/\$where/gi, '').replace(/\$and/gi, '');
                                 logqry = logqry.replace(/\$where/gi, '').replace(/\$and/gi, '');
                             }
                           
                            
                            //str.push(formKey)
                            // if (str.length > 0) { 
                            //     Querystr = str.join('AND');
                            //     qry = await this.CommonService.appendWhereClause(qry, Querystr);
                            // }
                        }
                 
                    qry = qry.replace(/\u2003/g, ' ');  
                    logqry = logqry.replace(/\u2003/g, ' ');
                    // Replace single quotes inside JSON values with double quotes                   
                    qry = qry.replace(
                        /'(\{[\s\S]*?\})'::jsonb/g,
                        (match, json) => {
                            const fixed = json.replace(/:\s*'([^']+)'/g, ': "$1"');
                            return `'${fixed}'::jsonb`;
                        }
                    );
                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(logqry), collectionName, 'request');
                   
                    await client.connect();
                    try{
                    if (qry) qryres = await client.query(qry);                   
                    if (qryres) dbres = qryres.rows;
                    }catch(err){
                        await client.end();
                        throw err;
                    }                     
                    await client.end();
                    }else{
                        throw new CustomException('Query is Required', 404);
                    }  
                                     

                    if (flag != 'N' && dbres?.length == 0 && logicCenter) {
                        // await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: logqry, response: dbres } }));
                        await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, logqry, dbres);
                        return { status: 200, targetStatus: targetStatus, data: dbres };
                    } else if (oprname == 'select' && dbres?.length == 0 && currentFabric == 'DF-DFD' && logicCenter) {
                        throw new CustomException('No Records Found', 404);
                    }else if((currentFabric == 'PF-PFD' || currentFabric == 'PF-SCDL') && dbres?.length == 0){                       
                        let responseData = await this.CommonService.responseData(200,dbres)
                        responseData = Object.assign(responseData,{targetStatus})
                        await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, logqry, dbres);
                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(logqry), collectionName, 'request');
                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(dbres), collectionName, 'response');
                        return responseData
                    } 
                    if(process.env.TIMEZONE && process.env.TIMEZONE != 'UTC'){
                        let dateTimeFields = this.getDateTimeFields(schema);  
                        if (dbres.length > 0) {
                            for (let i = 0; i < dbres.length; i++) {
                                for (const field of dateTimeFields) {
                                    if(dbres[i]?.[field])
                                        dbres[i][field] = this.CommonService.convertTimeZone(dbres[i][field]);
                                }
                            }
                        }
                    }                  
                     if(dbres && currentFabric == 'PF-PFD')
                     await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(dbres), collectionName, 'response');
                    
                     if (inputparam) {
                        inputparam = await this.assignToInputParam(inputparam, nodeName, dbres)                       
                        await this.redisService.setJsonData(processedKey + upId + ':rule',JSON.stringify(Array.isArray(dbres)?dbres[0]:dbres),collectionName,nodeName);
                        RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j],  {}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName);
                    } else {   
                        RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], {}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName);
                    }                    
                    if (RCMresult) {
                        zenresult = RCMresult.rule;
                        customcoderesult = RCMresult.code;
                    }
                    ifoObj = await this.ifoAssign(poJson?.internalMappingNodes, poNode[j].nodeId,sobj,zenresult,processedKey + upId,inputparam,pfdto)
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

                    if (upId) {
                        // await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: logqry, response: dbres } }));
                        await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, logqry, dbres);
                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(logqry), collectionName, 'request');
                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(dbres), collectionName, 'response');
                        
                    }
                        if(tokenrule?.length>0){
                        for(let item=0;item< dbres.length;item++){ 
                        if(dbres[item]?.trs_token_id){
                            let detokenizedata = await this.CommonService.getCall(process.env.TOKENIZATION_BASE_URL+'/get-masked-tokenized-data/'+dbres[item].trs_token_id)
                           if(detokenizedata?.status == 'Success'){                               
                                let obj ={}
                                for(let token of tokenrule){
                                let mask = token['mask_type']
                                let columnName = token['field_name']

                                let valres = detokenizedata?.result[columnName]                              
                                    if(valres?.[mask]){
                                        obj[columnName] = valres[mask]
                                    }                              
                                }                                                    
                                 dbres[item] = Object.assign(dbres[item], obj)
                            }                          
                            else
                                throw new CustomException(detokenizedata,400)                          
                         }
                      }
                    }
                      
                    this.logger.log('DB Node execution completed');
                    if(currentFabric == 'DF-DFD')
                    return { status: 200, targetStatus: targetStatus, data: dbres };
                    else
                    return { status: 200, targetStatus: targetStatus, data:inputparam };                    
                   } catch (error) {                  
                    await this.CommonService.checkRollBack(ndp, collectionName, 'rollback', {
                        key: processedKey + upId,
                        nodeid: rollbackConfig?.nodeId,
                        nodename: rollbackConfig?.nodeName,
                        savepoint: rollbackConfig?.savePoint,
                        data: dbres
                    }, pfdto?.authContext?.tenant
                    );
                    await this.exceptionhandler(failureQueue, suspiciousQueue, errorQueue, error, upId, nodeId, failureTargetStatus, inputparam)
                }
            }

             //surreal db node
            if (nodeType == 'surrealdbnode' && poNode[j].nodeId == nodeId) {
              let db;

              try {
                this.logger.log(
                  `${poNode[j]?.nodeName}, surrealdbnode started`,
                );               

                const namespace = process.env.SURREAL_NAMESPACE!;
                const database = process.env.SURREAL_DATABASE!;

                db = new Surreal();

                await db.connect(process.env.SURREAL_URL!);

                await db.signin({
                  username: process.env.SURREAL_USERNAME!,
                  password: process.env.SURREAL_PASSWORD!,
                });

                await db.use({
                  namespace,
                  database,
                });
                let mapObj = {}
                let schema = []
                let formKey: any = ``;
                let removedVal,ufCondition,tempQryVal,cleanedQuery,childInsertArr=[],surrealdbres
                let customConfig = ndp[poNode[j]?.nodeId];
                let nodeVersion = customConfig?.nodeVersion;
                if (!nodeVersion)
                  throw new CustomException('Node version not found', 404);
                let qrydata, queryName, manualQuery,logqry;
                qrydata = customConfig?.data?.pro?.value?.manualQuery?.items;
                 let qryfield = qrydata;
                if (qryfield?.length > 0) {
                  for (let item of qryfield) {                   
                      manualQuery = item?.value?.query?.value
                        .replace(/\r?\n/g, ' ') // replace newline with space
                        .replace(/\s+/g, ' ') // remove extra spaces
                        .trim();

                  }
                }
                 if(pfo?.length>0){
                        for(let a=0;a< pfo.length;a++){
                            if(poNode[j]?.nodeId == pfo[a].nodeId){
                                schema = pfo[a]?.schema
                            }
                        }
                    }
                 if (internalEdges && internalEdges.hasOwnProperty(poNode[j]?.nodeId)) {
                        let currentNodeEdge = internalEdges[poNode[j]?.nodeId];
                        if (currentFabric == 'DF-DFD') {
                            let DfmappedData = await this.DFDMapEdgeValues(poNode, currentNodeEdge, inputparam, processedKey, upId, collectionName,  '', '', pfo, currentFabric)
                            mapObj = DfmappedData?.mapObj
                            tempQryVal = DfmappedData?.tempQryVal
                        } else {
                            let mappedData = await this.mapEdgeValuesToParams(pfdto, currentNodeEdge, inputparam, processedKey, upId, collectionName,  '', '', pfo)
                            childInsertArr = mappedData?.childInsertArr
                            tempQryVal = mappedData?.tempQryVal
                        }                      

                        if (childInsertArr?.length > 0) {
                            for (let i = 0; i < childInsertArr.length; i++) {
                                mapObj = childInsertArr[i]
                                mapObj = Object.assign(mapObj,sobj)                                
                                let replaceQry = manualQuery 
                                replaceQry = await this.replaceQuery(replaceQry,mapObj)
                               // if(childInsertArr.length ==1)
                                    manualQuery = replaceQry                               
                            }                      

                        } else {
                             mapObj = sobj
                            if (mapObj && Object.keys(mapObj).length > 0) {                                            
                                manualQuery = await this.replaceQuery(manualQuery,mapObj)                            
                            }
                        }
                    } else{
                        mapObj = sobj
                          if(searchFilter && !Array.isArray(searchFilter) && Object.keys(searchFilter).length>0 && !logicCenter){
                             mapObj = Object.assign(mapObj,searchFilter)                               
                            let replaceData = await this.dollarReplace(manualQuery,searchFilter,schema) 
                            manualQuery = replaceData.manualQuery
                            searchFilter = replaceData.filterObj 
                         }else if(searchFilter && Array.isArray(searchFilter) && searchFilter.length>0 && !logicCenter){
                            let searchArrObj = {}
                            for(let item of searchFilter){
                                searchArrObj[item.key] = item.value
                            }
                            mapObj = Object.assign(mapObj,searchArrObj)                           
                            let replaceData = await this.dollarReplace(manualQuery,searchArrObj,schema)  
                            manualQuery = replaceData.manualQuery
                            searchFilter = replaceData.filterObj  

                        }

                        if(filterData && filterData?.length>0){
                            for (let f = 0; f < filterData.length; f++){
                            if (filterData[f].nodeId && filterData[f].nodeId == poNode[j].nodeId){
                                 const { nodeId, ...filterParamsObj } = filterData[f];                                 
                                const filterParamsObjKey = Object.keys(filterParamsObj);
                                const filterParamsObjvalues = Object.values(filterParamsObj);
                                let removedkey,filterObj = {}
                                for (let p = 0; p < filterParamsObjKey.length; p++){
                                    const value = filterParamsObjvalues[p];
                                    const key = filterParamsObjKey[p]
                                     if (key.includes('.')) {
                                        let s_item = key.split('.');
                                        removedkey = s_item.filter((item) => !this.statickeyword.includes(item)).join('.');
                                        if (removedkey.includes('.') && removedkey.startsWith('items.')) {
                                            removedkey = removedkey.replace('items.', '');
                                        }
                                    } else {
                                        removedkey = key
                                    }
                                    filterObj[removedkey] = value
                                }
                                mapObj = Object.assign(mapObj,filterObj)                                                                                     
                              let replaceData =  await this.dollarReplace(manualQuery,filterObj,schema,filterData)
                              manualQuery = replaceData.manualQuery
                              filterData = replaceData.filterData                                                              
                            }
                            }                            
                        }

                        if (mapObj && Object.keys(mapObj).length > 0) {
                            manualQuery = await this.replaceQuery(manualQuery,mapObj)  
                        }                    
                    }    
                     const singleMatches = [...manualQuery.matchAll(/\$\{([^}]+)\}/g)];
                        const singlevariables = singleMatches.map(match => match[1]);
                        singlevariables.forEach((key) => {
                            const regex = new RegExp(
                                `(?:\\([^)]+\\)|\\w+)?\\.\\$\\{${key}\\}|\\$\\{${key}\\}`,
                                'g'
                            );
                            manualQuery = manualQuery.replace(regex, '1=1');                             
                        });

                            if (page && count) {
                                 cleanedQuery = manualQuery.trim();
                                let cQuery = cleanedQuery
                                if (/limit\s+\d+/i.test(cQuery)) 
                                    manualQuery = cQuery
                                  // throw new Error('LIMIT clause detected. Please do not include it.');                                   
                                else
                                manualQuery = `${cQuery} LIMIT ${count} START ${offset}`;
                            }

                            if (filterData && filterData.length) {
                                for (let f = 0; f < filterData.length; f++) {
                                    if (filterData[f].nodeId && filterData[f].nodeId == poNode[j].nodeId) {
                                        const { nodeId, ...filterParamsObj } = filterData[f];
                                        const filterParamsObjKey = Object.keys(filterParamsObj);
                                        const filterParamsObjvalues =
                                            Object.values(filterParamsObj);
                                        for (let p = 0; p < filterParamsObjKey.length; p++) {
                                            const key = filterParamsObjKey[p];
                                            if(key == `${process.env.CLIENTCODE}_condition`){
                                                ufCondition = filterParamsObj[key]
                                                continue
                                            }
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
                                             const dateType = this.isDateTimeField(schema, removedVal);                               
                                            if(dateType){                                        
                                                formKey = formKey + ` DATE(${removedVal}) = '${value}' AND`;
                                            }
                                            else if (typeof value == 'number') {
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

                            if(searchFilter && !Array.isArray(searchFilter) && Object.keys(searchFilter).length>0 && !logicCenter){
                                 const searchParamsObjKey = Object.keys(searchFilter);
                                const searchParamsObjvalues =
                                    Object.values(searchFilter);
                                for (let p = 0; p < searchParamsObjKey.length; p++) {
                                    const key = searchParamsObjKey[p];
                                    if (key.includes('.')) {
                                        let s_item = key.split('.');
                                        removedVal = s_item.filter((item) => !this.statickeyword.includes(item)).join('.');
                                        if (removedVal.includes('.') && removedVal.startsWith('items.')) {
                                            removedVal = removedVal.replace('items.', '');
                                        }
                                    } else {
                                        removedVal = key
                                    }
                                    const value = searchParamsObjvalues[p];
                                     const dateType = this.isDateTimeField(schema, removedVal);                               
                                    if(dateType){                                        
                                        formKey = formKey + ` DATE(${removedVal}) = '${value}' AND`;
                                    }
                                    else if (typeof value == 'number') {
                                         formKey = formKey + ` ${removedVal}::TEXT LIKE '${value}%' AND`;
                                    } else if (typeof value == 'string') {
                                        formKey = formKey + ` ${removedVal} LIKE '${value}%' AND`;
                                    } else if (Array.isArray(value) && value.length > 0) {
                                        let s = ''
                                        for (let item of value) {
                                            s = s + `'${item}%',`
                                        }
                                        if (s.endsWith(',')) {
                                            s = s.slice(0, -1);
                                        }
                                        formKey = formKey + ` ${removedVal} LIKE ANY (ARRAY[${s}]) AND`;
                                    }
                                }

                                 if (formKey.endsWith(' AND')) {
                                    formKey = formKey.slice(0, -4);
                                }
                            }else if(Array.isArray(searchFilter) && searchFilter?.length>0 && !logicCenter){                                
                                for (let p = 0; p < searchFilter.length; p++) {
                                    let key = searchFilter[p].key;
                                    if (key.includes('.')) {
                                        let s_item = key.split('.');
                                        removedVal = s_item.filter((item) => !this.statickeyword.includes(item)).join('.');
                                        if (removedVal.includes('.') && removedVal.startsWith('items.')) {
                                            removedVal = removedVal.replace('items.', '');
                                        }
                                    } else {
                                        removedVal = key
                                    }
                                    let value = searchFilter[p].value;
                                    let value2 = searchFilter[p].value2;
                                    let operator = searchFilter[p].operator;
                                    let type = searchFilter[p].type;

                                    if(key && value && operator){   
                                        if (['=', '!=', '<>', '>=', '<=', '>', '<'].includes(operator)) { 
                                            if (type === 'date') 
                                                formKey = formKey + ` DATE(${removedVal}) ${operator} '${value}' AND`; 
                                            if (typeof value == 'number')
                                                formKey = formKey + ` ${removedVal} ${operator} ${value} AND`;
                                            if(typeof value == 'string')
                                                formKey = formKey + ` ${removedVal} ${operator} '${value}' AND`;                                            
                                        }else if(['LIKE','NOT LIKE','LIKE_START','LIKE_END'].includes(operator)){  
                                            let likeMap = {
                                                LIKE_START: `${value}%`,
                                                LIKE_END: `%${value}`,
                                                LIKE: `%${value}%`
                                            };

                                            const likeVal = likeMap[operator];

                                            if (typeof value == 'string')
                                                formKey = formKey + ` ${removedVal} LIKE '${likeVal}' AND`;                                            
                                            if (typeof value == 'number')
                                                formKey = formKey + ` ${removedVal}::TEXT LIKE '${likeVal}' AND`;
                                        }else if(['BETWEEN','NOT BETWEEN'].includes(operator)){
                                            if (value && value2){
                                                if (type === 'date') 
                                                    formKey = formKey + ` DATE(${removedVal}) ${operator} '${value}' AND '${value2}' AND`;
                                                    else                                                    
                                                    formKey = formKey + ` ${removedVal} ${operator} '${value}' AND '${value2}' AND`;                                                
                                            }
                                        }                                                                          
                                    }                                   

                                }                               

                                if (formKey.endsWith(' AND')) {
                                    formKey = formKey.slice(0, -4);
                                }
                            }

                            if (formKey){
                                if(ufCondition){
                                    formKey = formKey + ` AND ${ufCondition}`
                                }    
                            }else if(ufCondition){
                                formKey = ufCondition
                            }
                            if (formKey && (/\$where/i.test(manualQuery) || /\$and/i.test(manualQuery))) {
                                    manualQuery = manualQuery
                                        .replace(/\$where/gi, `WHERE ${formKey}`)
                                        .replace(/\$and/gi, `AND ${formKey}`);

                                    // logqry = `${cleanedQuery} LIMIT ${count} OFFSET ${offset}`
                                    //     .replace(/\$where/gi, `WHERE ${formKey}`)
                                    //     .replace(/\$and/gi, `AND ${formKey}`);
                                }
                            else{
                                if(currentFabric == 'DF-DFD')
                                logqry = `${cleanedQuery} LIMIT ${count} START ${offset}`
                                else 
                                logqry = manualQuery
                            }

                             if((/\$where/i.test(manualQuery) || /\$and/i.test(manualQuery)))
                            manualQuery = manualQuery.replace(/\$where/gi, '').replace(/\$and/gi, '');

                const result = await db.query(manualQuery);
                surrealdbres = result[0]
                if(surrealdbres?.length>0)
                surrealdbres = surrealdbres?.flat()
                this.logger.log(`SurrealDB record: ${JSON.stringify(result[0])}`);
                if (inputparam) {
                        inputparam = await this.assignToInputParam(inputparam, nodeName, surrealdbres)                        
                        await this.redisService.setJsonData(processedKey + upId + ':rule',JSON.stringify(Array.isArray(surrealdbres)?surrealdbres[0]:surrealdbres),collectionName,nodeName);
                        RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], {}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName);
                    } else {   
                        RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j],  {}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName);
                    }                    
                    if (RCMresult) {
                        zenresult = RCMresult.rule;
                        customcoderesult = RCMresult.code;
                    }
                    ifoObj = await this.ifoAssign(poJson?.internalMappingNodes, poNode[j].nodeId,sobj,zenresult,processedKey + upId,inputparam,pfdto)
                    if (ifoObj && Object.keys(ifoObj).length > 0) {
                        if (currentFabric == 'PF-PFD')
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(ifoObj), collectionName, 'ifo',);
                        surrealdbres = await this.codeORifoAndInputparamAssign(ifoObj, surrealdbres)
                    }

                    if (customcoderesult && customcoderesult != undefined && customcoderesult != null) {
                        codeObj = await this.codeAssign(customcoderesult)
                        if (codeObj) {
                            if (currentFabric == 'PF-PFD')
                                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);
                            if (surrealdbres)
                                surrealdbres = await this.codeORifoAndInputparamAssign(codeObj, surrealdbres)
                        }
                    }

                // console.log('SurrealDB Record:', result);
                if (upId) {
                  // await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: logqry, response: dbres } }));
                  await this.CommonService.getTPL(
                    processedKey,
                    upId,
                    poNode[j],
                    'Success',
                    targetQueue,
                    token,
                    currentFabric,
                    sourceStatus,
                    logqry,
                    surrealdbres,
                  );
                  await this.redisService.setJsonData(
                    processedKey + upId + ':NPV:' + nodeName + '.PRO',
                    JSON.stringify(logqry),
                    collectionName,
                    'request',
                  );
                  await this.redisService.setJsonData(
                    processedKey + upId + ':NPV:' + nodeName + '.PRO',
                    JSON.stringify(surrealdbres),
                    collectionName,
                    'response',
                  );
                }

                this.logger.log('SurrealDB execution completed');
                if (currentFabric == 'DF-DFD')
                  return {
                    status: 200,
                    targetStatus: targetStatus,
                    data: surrealdbres,
                  };
                else
                  return {
                    status: 200,
                    targetStatus: targetStatus,
                    data: inputparam,
                  };
              } catch (error) {
                console.log('Error occurred while querying SurrealDB:', error);
              } finally {
                if (db) { await db.close(); }
              }
            }
            

            //mongo db node
            if (nodeType == 'mongo-dbnode' && poNode[j].nodeId == nodeId) {
                let rollbackConfig, mongoDbarr,mongodbClient
                try {
                    this.logger.log(`${poNode[j]?.nodeName},Mongo DB Node started`);
                    // Q19 remediation: same gate as the outputnode/dbnode
                    // branches — ndp/poNode is caller-supplied with no
                    // server-side validation of its shape, and this branch
                    // resolves and connects to a real database using
                    // whichever connector the caller-controlled dpdkey
                    // points at. Refuse to run without a verified identity
                    // attached by AuthGuard.canActivateRpc().
                    if (!pfdto?.authContext) {
                        throw new CustomException('Unauthorized: mongo-db-node event carries no verified identity', 401);
                    }
                    let customConfig = ndp[poNode[j]?.nodeId]
                    rollbackConfig = ndp[poNode[j]?.nodeId]
                    let collnName, manualQryType, manualQry, sessionfilterParams, mongoQry, mongodbUrl, filterParams;
                    let mongodbconfig = await this.CommonService.mongodbconfig(customConfig, collectionName, pfdto?.authContext?.tenant)
                    mongodbUrl = mongodbconfig?.mongodbUrl
                    manualQry = mongodbconfig?.manualQry
                    manualQryType = mongodbconfig?.manualQryType
                    sessionfilterParams = mongodbconfig?.sessionfilterParams
                    filterParams = mongodbconfig?.filterParams
                    collnName = mongodbconfig?.collnName
                    const mongoOptions = {
                        appName: `${process.env.CLIENTCODE}-${process.env.APPNAME}-${process.env.APPGROUPNAME}-dynamicFlow.service`                    
                    };
                    mongodbClient = new MongoClient(mongodbUrl,mongoOptions);
                    await mongodbClient.connect();
                    const db = mongodbClient.db();
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
                        if (internalEdges && internalEdges.hasOwnProperty(poNode[j]?.nodeId)) {
                            let currentNodeEdge = internalEdges[poNode[j]?.nodeId];
                            if (currentFabric == 'DF-DFD') {
                                let DfmappedData = await this.DFDMapEdgeValues(poNode, currentNodeEdge, inputparam, processedKey, upId, collectionName,  '', '', pfo, currentFabric)
                                mapObj = DfmappedData?.mapObj
                                tempQryVal = DfmappedData?.tempQryVal
                                childInsertArr.push(mapObj)
                            } else {
                                let mappedData = await this.mapEdgeValuesToParams(pfdto, currentNodeEdge, inputparam, processedKey, upId, collectionName,  '', '', pfo)
                                childInsertArr = mappedData?.childInsertArr
                                tempQryVal = mappedData?.tempQryVal
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
                                if (filterData[i].nodeId && (filterData[i]?.nodeId).includes(nodeId)) {
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
                                    // JSON.stringify (not manual `"${value}"` wrapping) so a value
                                    // containing a quote/backslash can't break out of the string
                                    // literal before it reaches the new Function()/sandbox eval below.
                                    manualQry = manualQry.replace(regex, JSON.stringify(value));
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
                        // Evaluated in a vm sandbox (no process/require/fs access) instead of
                        // new Function(), which ran in this module's real global scope.
                        let result = runInSandbox(manualQry, {});
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
                            // await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: manualQry, response: mongoDbarr } }),);
                            await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, mongoQry, mongoDbarr,);
                            return { status: 200, targetStatus: targetStatus, data: mongoDbarr };
                        } else if ((!mongoDbarr || mongoDbarr?.length == 0 || Object.keys(mongoDbarr).length == 0) && currentFabric == 'DF-DFD') {
                            // await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: manualQry, response: mongoDbarr } }));
                            throw new CustomException('No Records Found', 404);
                        }else if(currentFabric == 'PF-PFD' && mongoDbarr?.length == 0){ 
                            let responseData = await this.CommonService.responseData(200,mongoDbarr)
                            responseData = Object.assign(responseData,{targetStatus})
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(manualQry), collectionName, 'request');
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(mongoDbarr), collectionName, 'response');
                            return responseData
                        }
                    }                 
                   
                    await this.redisService.setJsonData(processedKey + upId + ':rule',JSON.stringify(Array.isArray(mongoDbarr)?mongoDbarr[0]:mongoDbarr),collectionName,nodeName);
                    if (inputparam) {
                        
                        inputparam = await this.assignToInputParam(inputparam, nodeName, mongoDbarr)
                        RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], {}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName);
                    } else {
                        
                        RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], {}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName);
                    }
                    if (RCMresult) {
                        zenresult = RCMresult?.rule;
                        customcoderesult = RCMresult?.code;
                    }
                    ifoObj = await this.ifoAssign(poJson?.internalMappingNodes, poNode[j]?.nodeId,sobj,zenresult,processedKey + upId,inputparam,pfdto)
                    if (ifoObj && Object.keys(ifoObj).length > 0) {
                        if (currentFabric == 'PF-PFD')
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j]?.nodeName + '.PRO', JSON.stringify(ifoObj), collectionName, 'ifo',);
                        ifoObj = await this.codeORifoAndInputparamAssign(ifoObj, mongoDbarr)
                    }

                    if (customcoderesult && customcoderesult != undefined && customcoderesult != null) {
                        codeObj = await this.codeAssign(customcoderesult)
                        if (codeObj) {
                            if (currentFabric == 'PF-PFD')
                                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j]?.nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);
                            if (mongoDbarr)
                                mongoDbarr = await this.codeORifoAndInputparamAssign(codeObj, mongoDbarr)
                        }
                    }

                    if (upId) {
                        // await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: manualQry, response: mongoDbarr } }));
                        await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, manualQry, mongoDbarr,);
                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(manualQry), collectionName, 'request');
                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(mongoDbarr), collectionName, 'response',);
                    }
                     
                    this.logger.log('Mongo DB Node execution completed');
                    return { status: 200, targetStatus: targetStatus, data: mongoDbarr };
                } catch (error) {
                    await this.CommonService.checkRollBack(ndp, collectionName, 'rollback', {
                        key: processedKey + upId,
                        nodeid: rollbackConfig?.nodeId,
                        nodename: rollbackConfig?.nodeName,
                        savepoint: rollbackConfig?.savePoint,
                        data: mongoDbarr
                    }, pfdto?.authContext?.tenant
                    );
                    await this.exceptionhandler(failureQueue, suspiciousQueue, errorQueue, error, upId, nodeId, failureTargetStatus, inputparam)
                } finally {
                    if (mongodbClient) { try { await mongodbClient.close(); } catch {} }
                }
            }

             //Stream Node
            if (nodeType == 'streamnode' && poNode[j].nodeId == nodeId) {
                let rollbackConfig, streamArr: any = [];
                try {                   
                        this.logger.log(nodeName + 'Stream node Started');
                        // Q19-class remediation: this branch can resolve a
                        // caller-controlled dpdkey into another tenant's
                        // decrypted stream-connector credentials
                        // (host/port/username/password). Refuse to run
                        // without a verified identity attached by
                        // AuthGuard.canActivateRpc().
                        if (!pfdto?.authContext) {
                            throw new CustomException('Unauthorized: stream-node event carries no verified identity', 401);
                        }
                        let oprname, streamName, fromStreamid, toStreamid, apikey, responseNodeName, fieldName, isStatic, consumerName, consumerGroupName, useAsConsumer, entryId, rollback, sessionfilterParams, startOfToday, endOfToday, storageType, ConsumerBasedOnJob;
                        rollbackConfig = ndp[poNode[j]?.nodeId]
                        let customConfig = ndp[poNode[j]?.nodeId]
                        let sconf = await this.CommonService.streamConfig(customConfig, collectionName, pfdto?.authContext?.tenant)
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
                            let mappedData = await this.mapEdgeValuesToParams(pfdto, currentNodeEdge, inputparam, processedKey, upId, collectionName, '', '', pfo)
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
                            let streaminfo = childInsertArr[0]?.streaminfo
                            if (!streaminfo || Object.keys(streaminfo).length == 0) throw new CustomException('Stream Config Mapping was Required', 404);
                            streamName = streaminfo?.streamName
                            fieldName = streaminfo?.fieldName
                            fromStreamid = streaminfo?.fromStreamid
                            toStreamid = streaminfo?.toStreamid
                            startOfToday = new Date(fromStreamid)?.getTime();
                            endOfToday = new Date(toStreamid)?.getTime();
                        }
                        if (pfjson?.length > 0 && responseNodeName?.length > 0 && !apikey) {
                            for (let p = 0; p < pfjson.length; p++) {
                                if (responseNodeName.includes(pfjson[p]?.nodeId)) {
                                    var connectedNodeName = pfjson[p]?.nodeName;
                                }
                            }
                        }
                        if (connectedNodeName) {
                            let inputData = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + upId + ':NPV:' + connectedNodeName + '.PRO', '.response', collectionName));
                            childInsertArr.push(inputData)
                        }
                        if (!isStatic && childInsertArr?.length > 0 && childInsertArr[0]?.streaminfo)
                            delete childInsertArr[0]?.streaminfo
                        if (storageType?.toLowerCase() == 'externel') {
                            // Every throw below previously skipped redis.disconnect() at
                            // the end of this block, leaking the external stream-connector
                            // connection on any error (missing stream, "No Data available",
                            // etc.) instead of only on the happy path.
                            try {
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
                                                var msgid = streamData[s]?.msgid;
                                                let dataObj = streamData[s]?.data[1]
                                                streamArr.push(JSON.parse(dataObj))
                                                await redis.xack(streamName, consumerGroupName, msgid);
                                            }

                                        } else if(currentFabric == 'DF-DFD') {
                                            throw streamData + '_' + poNode[j].nodeName
                                           
                                        }else{                                            
                                            let responseData = await this.CommonService.responseData(200,streamData)
                                            responseData = Object.assign(responseData,{targetStatus})
                                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(streamName), collectionName, 'request');
                                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(streamData), collectionName, 'response');
                                            return responseData
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

                                if (streamArr?.length == 0 && currentFabric == 'DF-DFD')
                                    throw new CustomException('No Data available to read from Processor', 404)
                                else if(streamArr?.length == 0 && currentFabric == 'PF-PFD'){                                   
                                    let responseData = await this.CommonService.responseData(200,streamArr)
                                    responseData = Object.assign(responseData,{targetStatus})
                                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(streamName), collectionName, 'request');
                                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(streamArr), collectionName, 'response');
                                    return responseData
                                }

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
                            } finally {
                                redis?.disconnect();
                            }
                        } else {
                            if (oprname == 'read') {                               
                                if (!streamName) throw new CustomException('Stream RequestParams were empty', 404);
                                 
                                if (ConsumerBasedOnJob) {
                                    let EntryIdFromHash = await this.redisService.hget(upId, streamName)
                                    this.redisService.deleteKey(upId, collectionName)                                                                          
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

                                        //let streamData: any = await this.redisService.readConsumerGroup(streamName, 'TaskGroup', event);                                        
                                        if (result != 'No Data available to read') {
                                            for (let s = 0; s < result.length; s++) {
                                                let msgid = result[s]?.msgid;
                                                let dataObj = result[s]?.data[1]
                                                streamArr.push(JSON.parse(dataObj))
                                                if (streamArr?.length > 0)
                                                    await this.redisService.ackMessage(streamName, consumerGroupName, msgid)
                                            }
                                        } else if(currentFabric == 'DF-DFD') {
                                            throw result + '_' + poNode[j].nodeName                                           
                                        }else{                                           
                                            let responseData = await this.CommonService.responseData(200,result)
                                            responseData = Object.assign(responseData,{targetStatus})
                                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(streamName), collectionName, 'request');
                                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(result), collectionName, 'response');
                                            return responseData
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

                                 if (streamArr?.length == 0 && currentFabric == 'DF-DFD')
                                    throw new CustomException(`No Data available to read in ${streamName}, ${poNode[j]?.nodeName}`, 404)
                                else if(streamArr?.length == 0 && currentFabric == 'PF-PFD'){                                    
                                    let responseData = await this.CommonService.responseData(200,streamArr)
                                    responseData = Object.assign(responseData,{targetStatus})
                                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(streamName), collectionName, 'request');
                                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(streamArr), collectionName, 'response');
                                    return responseData
                                }

                            } else if (oprname == 'write') { 
                                if (!fieldName)
                                    fieldName = streamName
                                let idarr = []
                                if (childInsertArr?.length > 0 && streamName && !textobj) { 
                                    for (let a = 0; a < childInsertArr.length; a++) {
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
                                if (sessionfilterParams[f]?.value?.includes('session'))
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
                                if (filterData[f]?.nodeId == poNode[j]?.nodeId) {
                                    delete filterData[f]?.nodeId;
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

                        if(Array.isArray(streamArr) && searchFilter?.length>0 && !logicCenter){                                                                  
                            streamArr = await this.applyFilters(streamArr, searchFilter)                                
                        }
                       
                        //this.ruleParams[nodeName] = Array.isArray(streamArr)?streamArr[0]:streamArr
                        await this.redisService.setJsonData(processedKey + upId + ':rule',JSON.stringify(Array.isArray(streamArr)?streamArr[0]:streamArr),collectionName,nodeName);
                        if (inputparam && Object.keys(inputparam).length > 0) {
                                                                                  
                            RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], {}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName);
                        } else {
                            
                            RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], {}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName);
                        }
                        if (RCMresult) {
                            zenresult = RCMresult.rule;
                            customcoderesult = RCMresult.code;
                        }
                        ifoObj = await this.ifoAssign(poJson?.internalMappingNodes, poNode[j].nodeId,sobj,zenresult,processedKey + upId,inputparam,pfdto)
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
                            // await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: streamName, response: streamArr } }));
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
                    
                } catch (error) {
                    await this.CommonService.checkRollBack(ndp, collectionName, 'rollback', {
                        key: processedKey + upId,
                        nodeid: rollbackConfig?.nodeId,
                        nodename: rollbackConfig?.nodeName,
                        savepoint: rollbackConfig?.savePoint,
                        data: streamArr
                    }, pfdto?.authContext?.tenant
                    );
                    await this.exceptionhandler(failureQueue, suspiciousQueue, errorQueue, error, upId, nodeId, failureTargetStatus, inputparam)
                }
            }

            //Kafka Node
            if (nodeType == 'kafka_stream_node' && poNode[j].nodeId == nodeId) {
                try {                
                this.logger.log('Kafka Stream first node Started');
                // Q19-class remediation: this branch can resolve a
                // caller-controlled dpdkey into another tenant's decrypted
                // Kafka-connector credentials (broker host/port). Refuse to
                // run without a verified identity attached by
                // AuthGuard.canActivateRpc().
                if (!pfdto?.authContext) {
                    throw new CustomException('Unauthorized: kafka-stream-node event carries no verified identity', 401);
                }
                let kafkaResultArr: any = [];
                let oprname, topicName, connectorType, storageType, dpdkey, connectorName, isStatic, groupId,autoOffsetReset;
                let childInsertArr, textobj, tempQryVal = [];
                let customConfig = ndp[poNode[j]?.nodeId];
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
                    if (internalMappingNodes[n]?.nodeId == poNode[j]?.nodeId && internalMappingNodes[n]?.ifo?.length > 0) {
                    for (let f = 0; f < internalMappingNodes[n]?.ifo?.length; f++) {
                        if (internalMappingNodes[n].ifo[f].value) {
                        internalMappedObj[internalMappingNodes[n]?.ifo[f]?.key] = internalMappingNodes[n]?.ifo[f]?.value;
                        } else {
                        internalMappedObj[internalMappingNodes[n]?.ifo[f]?.key] = '';
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
                if (internalEdges && internalEdges.hasOwnProperty(poNode[j]?.nodeId)) {
                    let currentNodeEdge = internalEdges[poNode[j]?.nodeId];
                    let mappedData = await this.mapEdgeValuesToParams(pfdto, currentNodeEdge, inputparam, processedKey, upId, collectionName, '', '', pfo);
                    childInsertArr = mappedData?.childInsertArr;
                    tempQryVal = mappedData?.tempQryVal;
                    textobj = mappedData?.textobj;
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
                    topicName = kafkainfo?.topicName || topicName;
                    groupId = kafkainfo?.groupId || groupId;
                    delete childInsertArr[0]?.kafkainfo;
                }

                if (!topicName)
                    throw new CustomException('Kafka topic name not found', 404);

                // Get Kafka broker configuration
                let kafkaBrokers: string[] = [];
                // let kafkaClientId = clientId;

                if (storageType?.toLowerCase() == 'external') {
                    if (!dpdkey) throw new CustomException('DPD key not found', 404);
                    await this.CommonService.assertConnectorTenant(dpdkey, pfdto?.authContext?.tenant);
                    // let extdata = JSON.parse(await this.redisService.getJsonData(dpdkey + 'NDP', collectionName));
                    let extdata:any =  Object.values(JSON.parse(await this.redisService.getJsonData(dpdkey + 'NDP', collectionName)))[0];      
                    let dpdData      
                    dpdData = decrypt(extdata)
                    //let nodedata = Object.keys(extdata)[0];
                    let configConnectors = dpdData.data['externalConnectors-KAFKA']?.items;
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
                    //kafkaBrokers = (process.env.KAFKA_BROKER).split(',');
                     kafkaBrokers = (this.envData.getKafkaBroker()).split(',');
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
                        const producer = await this.getProducer();
                       
                        
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
                    const consumer = await this.getConsumer(groupId);
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
                await this.redisService.setJsonData(processedKey + upId + ':rule',JSON.stringify(Array.isArray(kafkaResultArr)?kafkaResultArr[0]:kafkaResultArr),collectionName,nodeName);
                if (inputparam) {
                    if (Object.keys(inputparam).length > 0) {
                    if (Array.isArray(inputparam) && inputparam.length > 0) {
                        for (let r = 0; r < inputparam.length; r++) {
                        inputparam[r] = Object.assign(inputparam[r], { [poNode[j]?.nodeName]: kafkaResultArr });
                        }
                    } else if (Object.keys(inputparam).length > 0) {
                        Object.assign(inputparam, { [poNode[j]?.nodeName]: kafkaResultArr });
                    }
                    // 
                    } else {
                    inputparam = Object.assign(inputparam, { [poNode[j].nodeName]: kafkaResultArr });
                    }
                    RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], {}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName);
                } else {
                       
                    RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j],  {}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName);
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
                } catch (error) {              
                this.logger.error('Kafka Stream first node Failed', error);
                throw error;
                }
            }

            //File Node
            if (nodeType == 'filenode' && poNode[j].nodeId == nodeId) {
                let rollbackConfig, fileres
                try {
                    this.logger.log(`File node Execution Started ${poNode[j].nodeName}`);
                    // Q19-class remediation: this branch can resolve a
                    // caller-controlled dpdkey into another tenant's
                    // decrypted SeaweedFS connector credentials. Refuse to
                    // run without a verified identity attached by
                    // AuthGuard.canActivateRpc().
                    if (!pfdto?.authContext) {
                        throw new CustomException('Unauthorized: file-node event carries no verified identity', 401);
                    }
                    let customConfig = ndp[poNode[j]?.nodeId]
                    rollbackConfig = ndp[poNode[j]?.nodeId]
                    let oprname, oprkey, fileFolderPath, fileType, fileName, apikey, responseNodeName, seaWeedConfig, rollback, isStatic, sessionfilterParams;
                    let fconf = await this.CommonService.fileConfig(customConfig, collectionName, pfdto?.authContext?.tenant)
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
                    if (internalEdges && internalEdges.hasOwnProperty(poNode[j]?.nodeId)) {
                        let currentNodeEdge = internalEdges[poNode[j]?.nodeId];
                        let mappedData = await this.mapEdgeValuesToParams(pfdto, currentNodeEdge, inputparam, processedKey, upId, collectionName, '', '', pfo)
                        childInsertArr = mappedData?.childInsertArr
                        tempQryVal = mappedData?.tempQryVal
                        textobj = mappedData?.textobj
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
                                if (responseNodeName.includes(pfjson[p]?.nodeId)) {
                                    var connectedNodeName = pfjson[p]?.nodeName;
                                }
                            }
                        }
                        if (connectedNodeName) {
                            let inputData = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + upId + ':NPV:' + connectedNodeName + '.PRO', '.response', collectionName));
                            childInsertArr.push(inputData)
                        }
                        if (childInsertArr?.length > 0 && childInsertArr[0]?.fileinfo)
                            delete childInsertArr[0]?.fileinfo

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
                            }else if(currentFabric == 'PF-PFD' && (!fileres || (Array.isArray(fileres) && fileres.length == 0) || (typeof fileres == 'object' && Object.keys(fileres).length == 0))){                                
                                let responseData = await this.CommonService.responseData(200,fileres)
                                responseData = Object.assign(responseData,{targetStatus})
                                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(fileName), collectionName, 'request');
                                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(fileres), collectionName, 'response');
                                return responseData
                            }
                            // let encCredentials = await this.CommonService.checkEncryption(poNode[j]);                           
                            // if (encCredentials?.selectedDpd && encCredentials?.encryptionMethod) {                     

                            //   var fileResult = await this.CommonService.commondecryption(encCredentials.selectedDpd, encCredentials.encryptionMethod, fileres, 'ct280_v001_vsp001_v1');
                           //   // apiResult = JSON.parse(DecapiResult);
                            // }
                        } else if (oprname === 'write') {
                            if (rollback && rollback == 'true') {
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
                                if (sessionfilterParams[f]?.value?.includes('session'))
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
                                if (filterData[f]?.nodeId == poNode[j]?.nodeId) {
                                    delete filterData[f]?.nodeId;
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
                        if(Array.isArray(fileres) && searchFilter?.length>0 && !logicCenter){                                                                  
                            fileres = await this.applyFilters(fileres, searchFilter)                                
                        }                      
                        
                        await this.redisService.setJsonData(processedKey + upId + ':rule',JSON.stringify(Array.isArray(fileres)?fileres[0]:fileres),collectionName,nodeName);
                        if (inputparam) {    
                                               
                            RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], {}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName);
                        } else {
                           
                            RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], {}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName);
                        }
                        if (RCMresult) {
                            zenresult = RCMresult.rule;
                            customcoderesult = RCMresult.code;
                        }

                        ifoObj = await this.ifoAssign(poJson?.internalMappingNodes, poNode[j].nodeId,sobj,zenresult,processedKey + upId,inputparam,pfdto)
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
                            // await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus }));
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
                    await this.CommonService.checkRollBack(ndp, collectionName, 'rollback', {
                        key: processedKey + upId,
                        nodeid: rollbackConfig?.nodeId,
                        nodename: rollbackConfig?.nodeName,
                        savepoint: rollbackConfig?.savePoint,
                        data: fileres
                    }, pfdto?.authContext?.tenant
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

                        ifoObj = await this.ifoAssign(poJson?.internalMappingNodes, poNode[j]?.nodeId,sobj,zenresult,processedKey + upId,inputparam,pfdto)
                        if (ifoObj && Object.keys(ifoObj).length > 0)
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j]?.nodeName + '.PRO', JSON.stringify(ifoObj), collectionName, 'ifo',);

                        PfdKey = PfdKey.endsWith(':NDP') ? PfdKey.replace(':NDP', '') : PfdKey;
                        let subPo, subnodeid, subnodetype;
                        if (!(await this.redisService.exist(PfdKey + ':PO', process.env.CLIENTCODE,))) throw `${PfdKey} not found`;
                        subPo = JSON.parse(await this.redisService.getJsonDataWithPath(PfdKey + ':PO', '.mappedData.artifact.node', process.env.CLIENTCODE,));
                        if (subPo && subPo.length > 0) {
                            subnodeid = subPo[1]['nodeId'];
                            subnodetype = subPo[1]['nodeType'];
                        }

                        let subflowndp = JSON.parse(await this.redisService.getJsonData(PfdKey + ':NDP', process.env.CLIENTCODE))
                        let apikey = subflowndp[subnodeid]?.apiKey
                        let apiConfig = JSON.parse(await this.redisService.getJsonData(apikey, process.env.CLIENTCODE))
                        let apiValue: any = Object?.values(apiConfig)[0]
                        let methodName = (apiValue?.data?.method).toLowerCase()
                        let parameter = apiValue?.data[methodName]

                        let mapObj = {}, tempQryVal = [];
                        if (internalEdges && internalEdges.hasOwnProperty(poNode[j]?.nodeId)) {
                            let currentNodeEdge = internalEdges[poNode[j]?.nodeId]; 
                            let mappedData = await this.mapEdgeValuesToParams(pfdto, currentNodeEdge, inputparam, processedKey, upId, collectionName,  parameter, '', pfo)
                            mapObj = mappedData.childInsertArr
                            tempQryVal = mappedData.tempQryVal
                        }

                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(ifoObj), collectionName, 'ifo',);
                        let subPoResult, pfExecutedSet, pfExecutedEvent;
                        pfdto = new pfDto();
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
                        // Redacted regardless of field-assignment order below — pfdto.token
                        // happens to be unset at this exact line today, but that's incidental
                        // to statement order, not a deliberate safeguard (M22).
                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(this.CommonService.redactSensitiveFields(pfdto)), collectionName, 'request',);
                        
                      
                            const requestConfig: AxiosRequestConfig = {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },timeout: 300000 
                            };

                            //if (!process.env.BE_URL) throw new CustomException('Server Url not found', 404);
                            if (!this.envData.getBeUrl()) throw new CustomException('Server Url not found', 404);
                            //subPoResult = await this.executeApiCall('post', process.env.BE_URL + '/te/eventEmitter', requestConfig, pfdto)
                            subPoResult = await this.executeApiCall('post', this.envData.getBeUrl() + '/te/eventEmitter', requestConfig, pfdto)
                       

                        if (subPoResult?.statusCode == 201 && subPoResult?.status == 'Success') {
                            if (subPoResult?.result?.message == 'Success') {
                                subPoResult = subPoResult?.result;
                                if (subPoResult?.data?.data)
                                    pfExecutedSet = subPoResult?.data?.data;
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
                                 //this.ruleParams[nodeName] = Array.isArray(pfExecutedSet)?pfExecutedSet[0]:pfExecutedSet
                                 await this.redisService.setJsonData(processedKey + upId + ':rule',JSON.stringify(Array.isArray(pfExecutedSet)?pfExecutedSet[0]:pfExecutedSet),collectionName,nodeName);
                                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(pfExecutedSet), collectionName, 'request',);
                            } else {
                                 //this.ruleParams[nodeName] = Array.isArray(inputparam)?inputparam[0]:inputparam
                                 await this.redisService.setJsonData(processedKey + upId + ':rule',JSON.stringify(Array.isArray(inputparam)?inputparam[0]:inputparam),collectionName,nodeName);
                                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(inputparam), collectionName, 'request',);
                            }

                            if (upId) {
                                //await this.redisService.setStreamData(srcQueue, collectionName + 'TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: pfdto, response: pfExecutedSet }, }),);
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
                    // Q19 remediation: this whole branch's execution graph
                    // (ndp/poNode) is caller-supplied with no server-side
                    // validation of its shape, and it can end in a real
                    // database write (below). AuthGuard.canActivateRpc()
                    // verifies the caller's JWT and attaches the claims as
                    // pfdto.authContext before this handler runs — but until
                    // now nothing in this file ever read it. Refuse to run
                    // this branch at all without that verified identity.
                    if (!pfdto?.authContext) {
                        throw new CustomException('Unauthorized: output-node event carries no verified identity', 401);
                    }
                    let customConfig = ndp[poNode[j]?.nodeId]
                    let nodeVersion = customConfig?.nodeVersion;
                    if (!nodeVersion) {
                        throw new CustomException('nodeVersion not found', 404);
                    }
                    let responseNodeName, output_type;
                    
                    if (nodeVersion.toLowerCase() == 'v1') {
                        let customConfigPro = customConfig.data?.pro?.value                       
                        responseNodeName = customConfig?.outputDataNodes;                       
                        output_type = customConfigPro?.output_type?.value
                    }
                   // if (!dpdkey) throw new CustomException('DPD key not found', 404);
                                      
                    if (responseNodeName?.length == 0) throw new CustomException('outputDataNodes not found', 404);
                    for (let p = 0; p < pfjson.length; p++) {
                        if (responseNodeName.includes(pfjson[p]?.nodeId)) {
                            var connectedNodeName = pfjson[p]?.nodeName;
                        }
                    }
                    let inputData
                    if (connectedNodeName)
                        inputData = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + upId + ':NPV:' + connectedNodeName + '.PRO', '.response', collectionName));
                    if (inputData) {
                        let client, db, redis
                        let logReq;
                        // this.ruleParams[nodeName] = Array.isArray(subPoResult) ? {...this.ruleParams , ...subPoResult[0]} : {...this.ruleParams , ...subPoResult}
                        // if (inputparam) {
                        //     inputparam = await this.assignToInputParam(inputparam, nodeName, inputData)
                        //     RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j],  {}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName);
                        // } else {                            
                            RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j],  {}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName);
                        // }
                        if (RCMresult) {
                            zenresult = RCMresult?.rule;
                            customcoderesult = RCMresult?.code;
                        }
                        if (customcoderesult && customcoderesult != undefined && customcoderesult != null) {
                            codeObj = await this.codeAssign(customcoderesult)
                            if (codeObj) {
                                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);
                                if (inputData)
                                    inputData = await this.codeORifoAndInputparamAssign(codeObj, inputData)
                            }
                        }  

                        if(output_type && output_type == 'array' && !Array.isArray(inputData)){                          
                            inputData = [inputData]
                        }else if(output_type && output_type == 'object' && Array.isArray(inputData)){
                            inputData = inputData[0]
                        }   

                       
                        if (upId) {
                           if(!logReq)
                            logReq = connectedNodeName                            
                            // await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: logReq, response: inputData } }));
                            await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, logReq,inputData);
                           await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(logReq), collectionName, 'request');
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(inputData), collectionName, 'response');
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
                    await this.redisService.setJsonData(processedKey + upId + ':rule',JSON.stringify(Array.isArray(inputparam)?inputparam[0]:inputparam),collectionName,nodeName);
                    RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j],  {}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName)
                    if (RCMresult) {
                        zenresult = RCMresult?.rule
                        customcoderesult = RCMresult?.code
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
                    //await this.redisService.setStreamData(srcQueue, collectionName + 'TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus, data: { request: inputparam, response: inputparam } }))
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
                    // Q19-class remediation: this branch can resolve a
                    // caller-controlled apiKey into another tenant's
                    // decrypted dataset schema/credentials. Refuse to run
                    // without a verified identity attached by
                    // AuthGuard.canActivateRpc().
                    if (!pfdto?.authContext) {
                        throw new CustomException('Unauthorized: datasetschema-node event carries no verified identity', 401);
                    }
                    let schemaRes = {}
                    let customConfig = ndp[poNode[j]?.nodeId]
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
                        RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], {}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName)
                        if (RCMresult) {
                            zenresult = RCMresult?.rule
                            customcoderesult = RCMresult?.code
                        }

                        ifoObj = await this.ifoAssign(poJson?.internalMappingNodes, poNode[j]?.nodeId,sobj,zenresult,processedKey + upId,inputparam,pfdto)
                        if (ifoObj && Object.keys(ifoObj).length > 0) {
                            if (currentFabric == 'PF-PFD')
                                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j]?.nodeName + '.PRO', JSON.stringify(ifoObj), collectionName, 'ifo',);
                            inputparam = await this.codeORifoAndInputparamAssign(ifoObj, inputparam)
                        }

                        if (customcoderesult && customcoderesult != undefined && customcoderesult != null) {
                            codeObj = await this.codeAssign(customcoderesult)
                            if (codeObj) {
                                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);
                                inputparam = await this.codeORifoAndInputparamAssign(codeObj, inputparam)
                            }
                        }

                        await this.CommonService.assertConnectorTenant(referenceKey, pfdto?.authContext?.tenant);
                        let apiConfig = JSON.parse(await this.redisService.getJsonData(referenceKey, collectionName))
                        apiConfig = Object.values(apiConfig)[0]
                        if (internalEdges && internalEdges.hasOwnProperty(poNode[j]?.nodeId)) {
                            let edgesarr = internalEdges[poNode[j]?.nodeId];
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
                                sourcekey.push(edgesarr[j]?.source);
                                let sourceNodeId = edgesarr[j]?.source;
                                for (let c = 0; c < poNode.length; c++) {
                                    if (sourceNodeId != poNode[1]?.nodeId || currentFabric == 'PF-SFD' || currentFabric == 'PF-PFD') {
                                        if (sourceNodeId == poNode[c]?.nodeId) {
                                            srcNodename = poNode[c]?.nodeName;
                                        }
                                    }
                                }

                                let srcHandle = edgesarr[j]?.sourceHandle.split('|');
                                if (srcHandle) {
                                    if (!['PF-SFD', 'PF-PFD'].includes(currentFabric) &&srcHandle.includes('ifo')) {                                      
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
                                            let apiKey = ndp[sourceNodeId]?.apiKey;
                                            let apidata = JSON.parse(await this.redisService.getJsonData(apiKey, collectionName));
                                            let apinodeid = Object.keys(apidata)[0];
                                            let method = apidata[apinodeid]?.data?.method;
                                            let parameter = apidata[apinodeid]?.data[method.toLowerCase()];
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
                           
                             for (const key of Object.keys(inputparam)) {
                                if (
                                    Array.isArray(inputparam[key]) &&
                                    inputparam[key].length === 1
                                ) {
                                    inputparam[key] = inputparam[key][0];
                                }
                            }

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
                            // await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: inputparam, response: finalRes } }));

                            if (finalRes && Array.isArray(finalRes) && finalRes?.length > 0) {
                                inputparam = await this.assignToInputParam(inputparam, nodeName, finalRes)
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
                                await this.redisService.setJsonData(processedKey + upId + ':rule',JSON.stringify(Array.isArray(datasetSchemaRes) && datasetSchemaRes?.length>0 ?datasetSchemaRes[0]:datasetSchemaRes),collectionName,nodeName);
                                return { status: 200, targetStatus: targetStatus, data: datasetSchemaRes };
                            }
                            else
                                return { status: 200, targetStatus: targetStatus, data: inputparam };
                        } else {
                            throw new CustomException(`Data Mapping not found for ${poNode[j].nodeName}`, 404);
                        }
                    }
                } catch (error) {                 
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
                            },timeout: 300000 
                            };
                            if (!(this.envData.getBeUrl())) throw new CustomException('Server Url not found', 404)              
                        DfExecutedResult = await this.executeApiCall('post',this.envData.getBeUrl() + '/te/eventEmitter',requestConfig,{ "key": DfdKey })
                            if (DfExecutedResult?.status == 'Success' && DfExecutedResult?.statusCode == 201) {
                            DfExecutedDataSet = DfExecutedResult?.result?.dataset?.data
                            }
                        } else if (executionMode == 'refer') {
                            let DstKey = DfdKey.replace('AF', 'AFP').replace('DF-DFD', 'DF-DST')
                            // dsObject = JSON.parse(await this.redisService.getJsonData(DstKey + SessionToken.loginId + '_DS_Object', collectionName))
                            let dsObject = await this.redisService.getAllRecordshash(DstKey + SessionToken.loginId+'_DS_Object')
                            DfExecutedDataSet = dsObject
                            if (!DfExecutedDataSet || DfExecutedDataSet.length == 0) throw new CustomException(`Dataset not found ${DstKey + 'DS_Object'}`, 404)
                        }
                        
                        RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], {}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName)
                        if (RCMresult) {
                            zenresult = RCMresult?.rule
                            customcoderesult = RCMresult?.code
                        }
                        if (customcoderesult && customcoderesult != undefined && customcoderesult != null) {
                            codeObj = await this.codeAssign(customcoderesult)
                            if (codeObj) {
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j]?.nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);
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
                            //await this.redisService.setStreamData(srcQueue, collectionName + 'TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus, data: { request: inputparam, response: keyMergedArr } }))
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
                            for (let s = 0; s < edgesarr?.length; s++) {
                            let connectedid = edgesarr[s]?.source;
                            for (let h = 0; h < poNode.length; h++) {
                                if (connectedid == poNode[h]?.nodeId) {
                                let conncectedNodename = poNode[h]?.nodeName;
                                let conncectedNodeType = poNode[h]?.nodeType;
                                afp[connectedid] = JSON.parse(await this.redisService.getJsonData(processedKey + upId + ':NPV:' + conncectedNodename + '.PRO', collectionName));
                                }
                            }
                            }
                            for (let j = 0; j < edgesarr.length; j++) {
                            let b = 0;
                            let srcNodename = null;
                            sourcekey.push(edgesarr[j]?.source);
                            let sourceNodeId = edgesarr[j]?.source;
                            for (let c = 0; c < poNode.length; c++) {
                                if (sourceNodeId != poNode[1]?.nodeId) {
                                if (sourceNodeId == poNode[c]?.nodeId) {
                                    srcNodename = poNode[c]?.nodeName;
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
                                    let method = apidata[apinodeid]?.data?.method;
                                    let parameter = apidata[apinodeid]?.data[method.toLowerCase()];
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
                                    inputparam = inputparam?.flat()
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
                                if (targetpath[m]?.includes(loopingkey[l])) {
                                routearr.push(rootarr[m]);
                                }
                            }
                            }
                            let edges = {};
                            edges['sourcepath'] = sourcepath;
                            edges['targetpath'] = targetpath;

                            if (edges['targetpath']?.length > 0) {
                            for (let k = 0; k < edges['targetpath']?.length; k++) {
                                if (edges['targetpath'][k].startsWith('items.')) {
                                edges['targetpath'][k] = edges['targetpath'][k]?.replace('items.', '');
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
                            // await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: inputparam, response: finalRes } }));

                            if (finalRes && Array.isArray(finalRes) && finalRes?.length > 0) {
                            inputparam = await this.assignToInputParam(inputparam,nodeName,finalRes[0])
                            }else if (finalRes && Object.keys(finalRes).length > 0){
                            inputparam = await this.assignToInputParam(inputparam,nodeName,finalRes)
                            }

                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(rootpatharr ? [finalRes] : finalRes), collectionName, 'response')
                            await this.redisService.setJsonData(processedKey + upId + ':rule',JSON.stringify(Array.isArray(finalRes)?finalRes[0]:finalRes),collectionName,nodeName);
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


                    let customConfig = ndp[poNode[j]?.nodeId]
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
                    
                    let RCMresult: any = await this.CommonService.getRuleCodeMapper(poNode[j], {}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName)
                    let customcoderesult, zenresult
                    if (RCMresult) {
                        zenresult = RCMresult?.rule
                        customcoderesult = RCMresult?.code
                    }

                    let internalMappingNodes = poJson?.internalMappingNodes;
                    let internalMappedObj = {};
                    for (let n = 0; n < internalMappingNodes.length; n++) {
                        if (internalMappingNodes[n]?.nodeId == poNode[j]?.nodeId && internalMappingNodes[n]?.ifo?.length > 0) {
                            for (let f = 0; f < internalMappingNodes[n]?.ifo.length; f++) {
                                if (internalMappingNodes[n]?.ifo[f]?.value) {
                                    internalMappedObj[internalMappingNodes[n]?.ifo[f]?.key] = internalMappingNodes[n]?.ifo[f]?.value;
                                } else {
                                    internalMappedObj[internalMappingNodes[n]?.ifo[f]?.key] = '';
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
                            if (parameters[a].in == 'query' && parameters[a]?.required == true) {
                                queryarr.push(parameters[a].name)
                            } else if (parameters[a].in == 'header' && parameters[a]?.required == true) {
                                headersarr.push(parameters[a].name)
                            } else if (parameters[a].in == 'path' && parameters[a]?.required == true) {
                                patharr.push(parameters[a]?.name)
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
                        // return { status: returnStscode, targetStatus: targetStatus, data: { description: returnDescription || [] } }
                        return { status: 200, targetStatus: targetStatus, data: {data:{ status: returnStscode,description: returnDescription || [] }} }
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
                        let sourceNodeId = edgesarr[j]?.source;
                        for (let c = 0; c < poNode.length; c++) {
                            if (sourceNodeId == poNode[c]?.nodeId) {
                                srcNodename = poNode[c]?.nodeName;
                            }
                        }

                        let srcHandle = (edgesarr[j]?.sourceHandle).split('|')
                        let keyname = ndp[edgesarr[j]?.source].apiKey
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
                                let src = srcHandle[1]?.split('.')
                                src = src.filter(item => !this.numberArr.includes(item));
                                dstVariable = src.filter(item => !this.statickeyword.includes(item)).join('.');
                                if (dstVariable.startsWith('items.')) {
                                    dstVariable = dstVariable?.replaceAll('items.', '')
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
                             this.statickeyword.push('items')
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
                                if (targetpath[m]?.includes(loopingkey[l])) {
                                    targetarr?.push(targetpath[m])
                                    sourcearr?.push(sourcepath[m])
                                    routearr?.push(rootarr[m])
                                }
                            }                           
                            if (targetarr.length > 0) {
                                edges['sourcepath'] = sourcearr
                                edges['targetpath'] = targetarr                               
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
                        //await this.redisService.setStreamData(srcQueue, collectionName + 'TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus, data: { request: inputparam, response: finalobj } }))
                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(inputparam), collectionName, 'request')
                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(finalobj), collectionName, 'response')
                    }                   
                    await this.redisService.setJsonData(processedKey + upId + ':rule',JSON.stringify(Array.isArray(finalobj)?finalobj[0]:finalobj),collectionName,nodeName);
                    this.logger.log(`Api output node Completed`)
                    return { status: returnStscode, targetStatus: targetStatus, data: finalobj || { description: returnDescription } }
                } catch (error) {
                    await this.exceptionhandler(failureQueue, suspiciousQueue, errorQueue, error, upId, nodeId, failureTargetStatus, inputparam)
                }
            }
           

            //jsonparser node
            if (nodeType == 'jsonparsernode' && poNode[j].nodeId == nodeId) {
                try {
                    this.logger.log('jsonparsernode Node Started');
                    // Q19-class remediation: this branch can resolve a
                    // caller-controlled apiKey into another tenant's
                    // decrypted JSON-parser schema/credentials. Refuse to
                    // run without a verified identity attached by
                    // AuthGuard.canActivateRpc().
                    if (!pfdto?.authContext) {
                        throw new CustomException('Unauthorized: jsonparser-node event carries no verified identity', 401);
                    }
                    let customConfig = ndp[poNode[j]?.nodeId]
                    let referenceKey = customConfig?.apiKey;
                    let nodeVersion = customConfig?.nodeVersion;
                    let oprname: any;
                    let jsonschema, mapObj = {}, valid, apiResult
                    if (!referenceKey)
                        throw new CustomException('Reference key not found', 404);
                    let apikeyfabric = await this.CommonService.splitcommonkey(referenceKey, 'FNK')
                    await this.CommonService.assertConnectorTenant(referenceKey, pfdto?.authContext?.tenant);
                    let ApiConfig: any = JSON.parse(await this.redisService.getJsonData(referenceKey, collectionName));

                    if (!ApiConfig || Object.keys(ApiConfig).length == 0)
                        throw new CustomException('Reference key value not found', 404);
                    let apiVal: any = Object.values(ApiConfig)[0];
                    if (apikeyfabric == 'DF-DST')
                        jsonschema = apiVal?.dataset
                    else
                        jsonschema = apiVal?.data

                    if (nodeVersion?.toLowerCase() == 'v1') {
                        oprname = customConfig?.data?.operationName.value;
                    }

                    if (oprname == "parseJson") {
                        if (internalEdges && internalEdges.hasOwnProperty(poNode[j]?.nodeId)) {
                            let currentNodeEdge = internalEdges[poNode[j]?.nodeId];
                            let afp = {};
                            for (let s = 0; s < currentNodeEdge?.length; s++) {
                                let connectedid = currentNodeEdge[s]?.source;
                                for (let h = 0; h < poNode.length; h++) {
                                    if (connectedid == poNode[h]?.nodeId) {
                                        let conncectedNodename = poNode[h]?.nodeName;
                                        let conncectedNodeType = poNode[h]?.nodeType;
                                        afp[connectedid] = JSON.parse(await this.redisService.getJsonData(processedKey + upId + ':NPV:' + conncectedNodename + '.PRO', collectionName));
                                    }
                                }
                            }
                            for (let e = 0; e < currentNodeEdge.length; e++) {
                                let connectedid = currentNodeEdge[e]?.source;
                                let srcHandle = currentNodeEdge[e]?.sourceHandle;
                                let targetHandle = currentNodeEdge[e]?.targetHandle;
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
                                            let method = apidata[apinodeid]?.data?.method;
                                            let parameter = apidata[apinodeid]?.data[method.toLowerCase()];
                                            sourceFilteredVal = _.get(parameter, sourceFilteredVal);
                                        }
                                    } else {
                                        sourceFilteredVal = srcVal;
                                    }

                                    for (let h = 0; h < poNode.length; h++) {
                                        if (connectedid == poNode[h]?.nodeId) {
                                            var conncectedNodeType = poNode[h]?.nodeType;
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
                            //await this.redisService.setStreamData(srcQueue, 'TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: inputparam, response: inputparam } }));
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
                                },timeout: 300000 
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
                    await this.redisService.setJsonData(processedKey + upId + ':rule',JSON.stringify(Array.isArray(mapObj)?mapObj[0]:mapObj),collectionName,nodeName);
                    RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName);
                    if (RCMresult) {
                        zenresult = RCMresult?.rule;
                        customcoderesult = RCMresult?.code;
                    }
                    if (customcoderesult && customcoderesult != undefined && customcoderesult != null) {
                        codeObj = await this.codeAssign(customcoderesult)
                        if (codeObj) {
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);
                        }
                    }
                    await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', token, targetQueue, currentFabric, sourceStatus, inputparam, inputparam);
                    //await this.redisService.setStreamData(srcQueue, 'TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: inputparam, response: inputparam } }));
                    

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
                            let connectedid = currentNodeEdge[s]?.source;
                            for (let h = 0; h < poNode.length; h++) {
                                if (connectedid == poNode[h]?.nodeId) {
                                    let conncectedNodename = poNode[h]?.nodeName;
                                    afp[connectedid] = JSON.parse(await this.redisService.getJsonData(processedKey + upId + ':NPV:' + conncectedNodename + '.PRO', collectionName));
                                }
                            }
                        }
                        for (let e = 0; e < currentNodeEdge?.length; e++) {
                            let srcHandle = currentNodeEdge[e]?.sourceHandle;
                            let connectedid = currentNodeEdge[e]?.source;
                            if (srcHandle) {
                                let srcSplit = srcHandle.split('|');
                                let srcVal = srcSplit.includes('HeaderParams') ? srcSplit[1] : srcSplit[srcSplit.length - 1];
                                let sourceFilteredVal
                                if (srcVal.includes('.')) {
                                    let staticRemove = srcVal.split('.');
                                    sourceFilteredVal = staticRemove.filter((item) => !this.statickeyword.includes(item)).join('.');
                                    if (sourceFilteredVal.includes('.') && sourceFilteredVal.startsWith('parameters.')) {
                                        let apiKey = ndp[connectedid]?.apiKey;
                                        let apidata = JSON.parse(await this.redisService.getJsonData(apiKey, collectionName));
                                        let apinodeid = Object.keys(apidata)[0];
                                        let method = apidata[apinodeid]?.data?.method;
                                        let parameter = apidata[apinodeid]?.data[method.toLowerCase()];

                                        sourceFilteredVal = _.get(parameter, sourceFilteredVal);
                                    }
                                } else {
                                    sourceFilteredVal = srcVal;
                                }
                                for (var h = 0; h < poNode.length; h++) {
                                    if (connectedid == poNode[h]?.nodeId) {
                                        var conncectedNodename = poNode[h]?.nodeName;
                                        var conncectedNodeType = poNode[h]?.nodeType;
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
                   await this.redisService.setJsonData(processedKey + upId + ':rule',JSON.stringify({ json2xmldata: xmlData }),collectionName,nodeName);
                    RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], {}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName);
                    if (RCMresult) {
                        zenresult = RCMresult?.rule;
                        customcoderesult = RCMresult?.code;
                    }
                    if (customcoderesult && customcoderesult != undefined && customcoderesult != null) {
                        codeObj = await this.codeAssign(customcoderesult)
                        if (codeObj)
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);
                    }
                    await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, inputparam, inputparam)
                    //await this.redisService.setStreamData(srcQueue, 'TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus, data: { request: inputparam, response: { json2xmldata: xmlData } } }))
                    
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
                    if (internalEdges && internalEdges.hasOwnProperty(poNode[j]?.nodeId)) {
                        let currentNodeEdge = internalEdges[poNode[j]?.nodeId];
                        let afp = {};
                        for (let s = 0; s < currentNodeEdge.length; s++) {
                            let connectedid = currentNodeEdge[s]?.source;
                            for (let h = 0; h < poNode.length; h++) {
                                if (connectedid == poNode[h]?.nodeId) {
                                    let conncectedNodename = poNode[h]?.nodeName;
                                    afp[connectedid] = JSON.parse(await this.redisService.getJsonData(processedKey + upId + ':NPV:' + conncectedNodename + '.PRO', collectionName));
                                }
                            }
                        }
                        for (let e = 0; e < currentNodeEdge.length; e++) {
                            let srcHandle = currentNodeEdge[e]?.sourceHandle;
                            let connectedid = currentNodeEdge[e]?.source;
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
                                        let method = apidata[apinodeid]?.data?.method;
                                        let parameter = apidata[apinodeid]?.data[method.toLowerCase()];

                                        sourceFilteredVal = _.get(parameter, sourceFilteredVal);
                                    }
                                } else {
                                    sourceFilteredVal = srcVal;
                                }
                                for (var h = 0; h < poNode.length; h++) {
                                    if (connectedid == poNode[h].nodeId) {
                                        var conncectedNodename = poNode[h]?.nodeName;
                                        var conncectedNodeType = poNode[h]?.nodeType;
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
                    // Evaluated in a vm sandbox (no process/require/fs access) instead of
                    // new Function(), which ran in this module's real global scope.
                    let parsedXml = runInSandbox(checkdata, {});
                    let jsonData = await parseStringPromise(parsedXml);
                    inputparam = await this.assignToInputParam(inputparam, nodeName, { xml2jsondata: jsonData })
                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify({ xml2jsondata: jsonData }), collectionName, 'response')
                    await this.redisService.setJsonData(processedKey + upId + ':rule',JSON.stringify({ xml2jsondata: jsonData }),collectionName,nodeName);
                    RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j],  {}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName);
                    if (RCMresult) {
                        zenresult = RCMresult?.rule;
                        customcoderesult = RCMresult?.code;
                    }
                    if (customcoderesult && customcoderesult != undefined && customcoderesult != null) {
                        codeObj = await this.codeAssign(customcoderesult)
                        if (codeObj)
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);
                    }
                    await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, inputparam, inputparam)
                    //await this.redisService.setStreamData(srcQueue, 'TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus, data: { request: inputparam, response: { xml2jsondata: jsonData } } }))
                    

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
                    customConfig = ndp[poNode[j]?.nodeId]
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
                            let source = currentNodeEdge[s]?.source
                            let sourceHandle = currentNodeEdge[s]?.sourceHandle
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
                                existing?.sourceHandle?.push(sourceHandle);
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
                            let connectedid = srcIdArr[s]?.source
                            let connectedHandle = srcIdArr[s]?.sourceHandle
                            for (var h = 0; h < pfo.length; h++) {
                                if (connectedid == pfo[h]?.nodeId) {
                                    let tempArr = []
                                    var conncectedNodename = pfo[h]?.nodeName
                                    var conncectedNodeType = pfo[h]?.nodeType
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
                                        innerpathVal = afpValue?.ifo
                                        if (conncectedNodeType == 'api_inputnode') {
                                            innerpathVal = await this.keysToLowerCaseOnly(innerpathVal)
                                        }
                                        tempArr = await this.combineData(innerpathVal, tempArr)
                                        innerpathVal = afpValue?.code
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
                        for (let m = 0; m < mergedRecords?.length; m++) {
                            mapObj = {};
                            tempQryVal = [];
                            let inputCollection = mergedRecords[m]
                            for (let e = 0; e < currentNodeEdge.length; e++) {
                                let schemaRes = {};
                                let b = 0;
                                let sourceFilteredVal, targetFilteredVal
                                let srcHandle = currentNodeEdge[e]?.sourceHandle;
                                let targetHandle = currentNodeEdge[e]?.targetHandle;
                                let connectedid = currentNodeEdge[e]?.source;
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
                                        let type,body,schema 
                                        if (pfo?.length > 0) {
                                            for (let p = 0; p < pfo.length; p++) {
                                                if (pfo[p].nodeId == connectedid) {
                                                     if(srcVal.includes('responses')){
                                                         body = 'responses'
                                                         let code = Object.keys(pfo[p]?.schema?.[body])[0]
                                                        if (pfo[p]?.schema?.[body]?.[code]['content']?.['application/json']?.['schema']) {
                                                        type = 'application/json'
                                                    } else if (pfo[p]?.schema?.[body]?.[code]['content']?.['application/xml']?.['schema']) {
                                                        type = 'application/xml'
                                                    }
                                                    else if (pfo[p]?.schema?.[body]?.[code]['content']?.['text/plain']?.['schema']) {
                                                        type = 'text/plain'
                                                    } else if (pfo[p]?.schema?.[body]?.[code]['content']?.['*/*']?.['schema']) {
                                                        type = '*/*'
                                                    }
                                                    schema = pfo[p]?.schema?.[body][code]['content'][type]['schema'];
                                                    inputparam = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + upId + ':NPV:' + pfo[p].nodeName + '.PRO', '.response', collectionName))
                                                     }else{
                                                         body = 'requestBody'
                                                        if (pfo[p]?.schema?.[body]?.['content']?.['application/json']?.['schema']) {
                                                        type = 'application/json'
                                                    } else if (pfo[p]?.schema?.[body]?.['content']?.['application/xml']?.['schema']) {
                                                        type = 'application/xml'
                                                    }
                                                    else if (pfo[p]?.schema?.[body]?.['content']?.['text/plain']?.['schema']) {
                                                        type = 'text/plain'
                                                    } else if (pfo[p]?.schema?.[body]?.['content']?.['*/*']?.['schema']) {
                                                        type = '*/*'
                                                    }
                                                    schema = pfo[p]?.schema?.[body]['content'][type]['schema'];
                                                    inputparam = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + upId + ':NPV:' + pfo[p].nodeName + '.PRO', '.request', collectionName))
                                                     } 
                                                    var res = await this.generateMockData(schema);
                                                    let keys = Object.keys(res);
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
                            if (Object.keys(mapObj).length > 0) {
                                childInsertArr.push(mapObj);
                            }
                        }
                    }
                    if (childInsertArr?.length == 0) throw new CustomException(`Mapping was required in ${poNode[j].nodeName}`, 404)
                    inputparam = await this.assignToInputParam(inputparam, nodeName, childInsertArr)
                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(childInsertArr), collectionName, 'response')
                   await this.redisService.setJsonData(processedKey + upId + ':rule',JSON.stringify(Array.isArray(childInsertArr)?childInsertArr[0]:childInsertArr),collectionName,nodeName);
                    RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], {}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName);
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
                    //await this.redisService.setStreamData(srcQueue, 'TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus, data: { request: inputparam, response: childInsertArr } }))
                    

                    this.logger.log('xlparsernode node completed')
                    return { status: 200, targetStatus: targetStatus, data: inputparam }

                } catch (error) {                   
                    await this.exceptionhandler(failureQueue, suspiciousQueue, errorQueue, error, upId, nodeId, failureTargetStatus, inputparam)
                }
            }

            //Procedure Execution node
            if (nodeType == 'procedureexecutionnode' && poNode[j].nodeId == nodeId) {
                let rollbackConfig, status, pgnotice = []
                try {
                    this.logger.log(`${poNode[j]?.nodeName} procedureexecutionnode Started`)
                    // Q19-class remediation: this branch can resolve a
                    // caller-controlled dpdkey into another tenant's
                    // decrypted DB credentials and execute a stored
                    // procedure. Refuse to run without a verified identity
                    // attached by AuthGuard.canActivateRpc().
                    if (!pfdto?.authContext) {
                        throw new CustomException('Unauthorized: procedure-execution-node event carries no verified identity', 401);
                    }
                    let mapobj = {}, params, customConfig, procedurequery, client, executecommand
                    customConfig = ndp[poNode[j]?.nodeId]
                    rollbackConfig = ndp[poNode[j]?.nodeId]
                    let prcConf = await this.CommonService.procedureConfig(customConfig, collectionName, pfdto?.authContext?.tenant)
                    client = prcConf?.client
                    procedurequery = prcConf?.procedurequery
                    params = prcConf?.params
                    executecommand = prcConf?.executecommand
                    let childInsertArr = []
                    if (internalEdges && internalEdges.hasOwnProperty(poNode[j]?.nodeId)) {
                        let currentNodeEdge = internalEdges[poNode[j]?.nodeId];
                        let mappedData = await this.mapEdgeValuesToParams(pfdto, currentNodeEdge, inputparam, processedKey, upId, collectionName, '', '', pfo)
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
                                executecommand = await this.replaceQuery(executecommand,mapobj)
                                procedurequery = await this.replaceQuery(procedurequery,mapobj)                              
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
                            executecommand = await this.replaceQuery(executecommand,mapobj) 
                            procedurequery = await this.replaceQuery(procedurequery,mapobj)   
                        }
                    }
                    executecommand = this.CommonService.applyDollarDollarDollarFilters(executecommand, filterData, poNode[j]?.nodeId, this.statickeyword);
                    let obj ={},result;
                    if (executecommand.includes('$$$') || executecommand.includes('$$'))
                        executecommand = executecommand.replace(/\${2,3}[a-zA-Z0-9_]+/g, 'NULL');
                    await client.connect();
                    client.on('notice', (msg) => {
                        if(msg?.message) pgnotice.push(msg.message)                       
                    });
                    
                    try{
                    await client.query(procedurequery)
                    obj = {executecommand:executecommand}                   
                    
                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(obj), collectionName, 'request')                    
                    result = await client.query(`${executecommand}`);  
                    }catch(err){
                        await client.end();
                        throw err;
                    }               
                    await client.end();
                    
                    if(pgnotice) obj['pgnotice'] = pgnotice
                    
                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(obj), collectionName, 'request')

                    if ((result.rows)?.length > 0) {
                        status = result.rows
                    } else if (result && currentFabric == 'PF-PFD') {
                        status = 'Success'
                    } else {
                        status = result.rows
                    }
                    
                    inputparam = await this.assignToInputParam(inputparam, nodeName, status)
                       
                    RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], {}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName)
                    if (RCMresult) {
                        zenresult = RCMresult.rule
                        customcoderesult = RCMresult.code
                    }

                    ifoObj = await this.ifoAssign(poJson?.internalMappingNodes, poNode[j].nodeId,sobj,zenresult,processedKey + upId,inputparam,pfdto)
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
                    await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, obj, status)
                    //await this.redisService.setStreamData(srcQueue, 'TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus, data: { request: obj, response: status } }))
                   await this.redisService.setJsonData(processedKey + upId + ':rule',JSON.stringify(Array.isArray(status)?status[0]:status),collectionName,nodeName);
                    this.logger.log('procedureExecution node completed')
                    if (currentFabric == 'PF-PFD')
                        return { status: 200, targetStatus: targetStatus, data: inputparam }
                    else
                        return { status: 200, targetStatus: targetStatus, data: status }
                } catch (error) {                   
                    await this.CommonService.checkRollBack(ndp, collectionName, 'rollback', {
                        key: processedKey + upId,
                        nodeid: rollbackConfig?.nodeId,
                        nodename: rollbackConfig?.nodeName,
                        savepoint: rollbackConfig?.savePoint,
                        data: status
                    }, pfdto?.authContext?.tenant
                    );
                    await this.exceptionhandler(failureQueue, suspiciousQueue, errorQueue, error, upId, nodeId, failureTargetStatus, inputparam)
                }
            }

            //changeStatus node
            if (nodeType == 'change_status_node' && poNode[j].nodeId == nodeId) {
                let rollbackConfig, status
                try {
                    this.logger.log(`${poNode[j].nodeName} Change Status node Started`)
                    // Q19-class remediation: this branch can resolve a
                    // caller-controlled dpdkey into another tenant's
                    // decrypted DB credentials and execute a stored
                    // procedure. Refuse to run without a verified identity
                    // attached by AuthGuard.canActivateRpc().
                    if (!pfdto?.authContext) {
                        throw new CustomException('Unauthorized: change-status-node event carries no verified identity', 401);
                    }
                    let mapobj = {}, params, customConfig, procedurequery, client, executecommand
                    customConfig = ndp[poNode[j].nodeId]
                    rollbackConfig = ndp[poNode[j].nodeId]
                    let prcConf = await this.CommonService.procedureConfig(customConfig, collectionName, pfdto?.authContext?.tenant)
                    client = prcConf.client
                    procedurequery = prcConf.procedurequery
                    params = prcConf.params
                    executecommand = prcConf.executecommand
                    let childInsertArr = []
                    if (internalEdges && internalEdges.hasOwnProperty(poNode[j].nodeId)) {
                        let currentNodeEdge = internalEdges[poNode[j].nodeId];
                        let mappedData = await this.mapEdgeValuesToParams(pfdto, currentNodeEdge, inputparam, processedKey, upId, collectionName, '', '', pfo)
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
                                    const value = this.CommonService.sqlLiteral(mapobj[key]);
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
                                const value = this.CommonService.sqlLiteral(mapobj[key]);
                                executecommand = executecommand.replace(regex, value);
                            });
                        }
                    }
                    executecommand = this.CommonService.applyDollarDollarDollarFilters(executecommand, filterData, poNode[j].nodeId, this.statickeyword);
                    if (executecommand.includes('$$$') || executecommand.includes('$$'))
                        executecommand = executecommand.replace(/\${2,3}[a-zA-Z0-9_]+/g, 'NULL');
                    await client.connect();
                    await client.query(procedurequery)                  
                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(executecommand), collectionName, 'request')
                    const result = await client.query(`${executecommand}`);
                    await client.end();
                    if ((result.rows)?.length > 0) {
                        status = result.rows
                    } else if (result && currentFabric == 'PF-PFD') {
                        status = 'Success'
                    } else {
                        status = result.rows
                    }
                    
                    inputparam = await this.assignToInputParam(inputparam, nodeName, status)
                    
                    RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], {}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName)
                    if (RCMresult) {
                        zenresult = RCMresult.rule
                        customcoderesult = RCMresult.code
                    }

                    ifoObj = await this.ifoAssign(poJson?.internalMappingNodes, poNode[j].nodeId,sobj,zenresult,processedKey + upId,inputparam,pfdto)
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
                    //await this.redisService.setStreamData(srcQueue, 'TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus, data: { request: inputparam, response: status } }))

                    this.logger.log('Change Status node completed')
                    if (currentFabric == 'PF-PFD')
                        return { status: 200, targetStatus: targetStatus, data: inputparam }
                    else
                        return { status: 200, targetStatus: targetStatus, data: status }
                } catch (error) {                   
                    await this.CommonService.checkRollBack(ndp, collectionName, 'rollback', {
                        key: processedKey + upId,
                        nodeid: rollbackConfig?.nodeId,
                        nodename: rollbackConfig?.nodeName,
                        savepoint: rollbackConfig?.savePoint,
                        data: status
                    }, pfdto?.authContext?.tenant
                    );
                    await this.exceptionhandler(failureQueue, suspiciousQueue, errorQueue, error, upId, nodeId, failureTargetStatus, inputparam)
                }
            }

            //Function node
            if (nodeType == 'function_node' && poNode[j].nodeId == nodeId) {
                let rollbackConfig, status
                try {
                    this.logger.log(`${poNode[j]?.nodeName} functionnode Started`)
                    // Q19-class remediation: this branch can resolve a
                    // caller-controlled dpdkey into another tenant's
                    // decrypted DB credentials and execute a function.
                    // Refuse to run without a verified identity attached by
                    // AuthGuard.canActivateRpc().
                    if (!pfdto?.authContext) {
                        throw new CustomException('Unauthorized: function-node event carries no verified identity', 401);
                    }
                    let mapobj = {}, params, customConfig, procedurequery, client, dbType, executecommand
                    customConfig = ndp[poNode[j]?.nodeId]
                    rollbackConfig = ndp[poNode[j]?.nodeId]
                    let funConf = await this.CommonService.procedureConfig(customConfig, collectionName, pfdto?.authContext?.tenant)
                    client = funConf?.client
                    procedurequery = funConf?.procedurequery
                    params = funConf?.params
                    executecommand = funConf?.executecommand
                    let childInsertArr = []
                    if (internalEdges && internalEdges.hasOwnProperty(poNode[j]?.nodeId)) {
                        let currentNodeEdge = internalEdges[poNode[j]?.nodeId];
                        let mappedData = await this.mapEdgeValuesToParams(pfdto, currentNodeEdge, inputparam, processedKey, upId, collectionName,  '', '', pfo)
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
                                    const value = this.CommonService.sqlLiteral(mapobj[key]);
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
                                const value = this.CommonService.sqlLiteral(mapobj[key]);
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
                            if (filterObj.nodeId == poNode[j]?.nodeId) {
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

                                    // Column names here come from client-supplied filterData and are spliced
                                    // directly into the WHERE fragment; reject anything that isn't a plain
                                    // (optionally dotted) SQL identifier instead of concatenating it.
                                    if (!this.CommonService.isSafeSqlIdentifier(removedVal)) return;
                                    if (value && typeof value == 'number') {
                                        formKey = formKey + ` ${removedVal} = ${value} AND`;
                                    } else if (value && typeof value == 'string' && value != '') {
                                        formKey = formKey + ` ${removedVal} = ${this.CommonService.sqlLiteral(value)} AND`;
                                    } else if (Array.isArray(value) && value.length > 0) {
                                        let s = ''
                                        for (let item of value) {
                                            s = s + `${this.CommonService.sqlLiteral(item)},`
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
                     let result;
                    await client.connect();
                    try{
                    await client.query(procedurequery)
                    result = await client.query(`${executecommand}`);
                    }catch(err){
                        await client.end();
                        throw err;
                    }  
                    await client.end();
                    if ((result.rows)?.length > 0) {
                        status = result.rows
                    } else if (result && currentFabric == 'PF-PFD') {
                        status = 'Success'
                    } else {
                        status = result.rows
                    }                   
                    
                    // inputparam = await this.assignToInputParam(inputparam,nodeName,status)
                    RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], {}, processedKey + upId, currentFabric, SessionInfo,pfdto.controlName)
                    if (RCMresult) {
                        zenresult = RCMresult.rule
                        customcoderesult = RCMresult.code
                    }

                    ifoObj = await this.ifoAssign(poJson?.internalMappingNodes, poNode[j].nodeId,sobj,zenresult,processedKey + upId,inputparam,pfdto)
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
                    //await this.redisService.setStreamData(srcQueue, 'TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus, data: { request: inputparam, response: status } }))
                   await this.redisService.setJsonData(processedKey + upId + ':rule',JSON.stringify(Array.isArray(status)?status[0]:status),collectionName,nodeName);
                    this.logger.log('functionnode node completed')
                    if (currentFabric == 'PF-PFD' || currentFabric == 'PF-SFD')
                        return { status: 200, targetStatus: targetStatus, data: inputparam }
                    else
                        return { status: 200, targetStatus: targetStatus, data: status }

                } catch (error) {                   
                    await this.CommonService.checkRollBack(ndp, collectionName, 'rollback', {
                        key: processedKey + upId,
                        nodeid: rollbackConfig?.nodeId,
                        nodename: rollbackConfig?.nodeName,
                        savepoint: rollbackConfig?.savePoint,
                        data: status
                    }, pfdto?.authContext?.tenant
                    );
                    await this.exceptionhandler(failureQueue, suspiciousQueue, errorQueue, error, upId, nodeId, failureTargetStatus, inputparam)
                }
            }

               //communication node
            if (nodeType == 'communicationnode' && poNode[j].nodeId == nodeId) {
                try {
                    this.logger.log('communication Node Started');
                    // Q19-class remediation: this branch can resolve a
                    // caller-controlled dpdkey into another tenant's
                    // decrypted communication (email/SMS) credentials and
                    // send messages using them. Refuse to run without a
                    // verified identity attached by
                    // AuthGuard.canActivateRpc().
                    if (!pfdto?.authContext) {
                        throw new CustomException('Unauthorized: communication-node event carries no verified identity', 401);
                    }
                    let customConfig,dpdkey,html,dpdData,templateKey,communicationType,mapobj,emailConfig,subject,to,sendResponse,cc,bcc
                    customConfig = ndp[poNode[j]?.nodeId]
                    dpdkey = customConfig?.data?.pro?.dpdKey?.value
                    if(!dpdkey) throw new CustomException('DPD key not found',404);
                    communicationType = customConfig?.data?.pro?.channels?.value
                    await this.CommonService.assertConnectorTenant(dpdkey, pfdto?.authContext?.tenant);
                    let extdata:any =  Object.values(JSON.parse(await this.redisService.getJsonData(dpdkey, collectionName)))[0];  
                    if(!extdata)  throw new CustomException('DPD value not found',404);                      
                    dpdData = decrypt(extdata)  
                    let communicationConfig = dpdData?.data?.communicationConfig
                    if(communicationType && communicationType == 'email'){
                        templateKey = customConfig?.data?.pro?.channels?.subSelection?.email?.template?.value
                        if(!templateKey) throw new CustomException('templateKey not found',404)
                    }
                    RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], {}, processedKey + upId, currentFabric, SessionInfo);
                    if (RCMresult) {
                        zenresult = RCMresult?.rule;
                        customcoderesult = RCMresult?.code;
                    }
                    if (customcoderesult && customcoderesult != undefined && customcoderesult != null) {
                        codeObj = await this.codeAssign(customcoderesult)
                        if (codeObj) {
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);
                            if (inputparam)
                                inputparam = await this.codeORifoAndInputparamAssign(codeObj, inputparam)
                        }
                    }                      
                    let templateJson = JSON.parse(await this.redisService.getJsonData(templateKey,collectionName))
                      if(!templateJson) throw new CustomException('template value not found',404)
                    let content_info = templateJson?.content_info
                        if(!content_info) throw new CustomException('template content not found',404)
                     let childInsertArr = []
                    if (internalEdges && internalEdges.hasOwnProperty(poNode[j]?.nodeId)) {
                        let currentNodeEdge = internalEdges[poNode[j]?.nodeId];
                        let mappedData = await this.mapEdgeValuesToParams(pfdto, currentNodeEdge, inputparam, processedKey, upId, collectionName,  '', '', pfo)
                        childInsertArr = mappedData.childInsertArr
                    }
                    if(childInsertArr?.length>0){
                    for(let i=0;i< childInsertArr.length;i++){
                        mapobj = childInsertArr[i]  
                        if(inputparam && Object.values(inputparam).length>0)
                          mapobj = Object.values(inputparam).reduce((acc, value) => {
                                            if (Array.isArray(value)) {
                                                value.forEach(item => {
                                                if (item && typeof item === 'object') {
                                                    Object.assign(acc, item);
                                                }
                                                });
                                            } else if (value && typeof value === 'object') {
                                                Object.assign(acc, value);
                                            }

                                            return acc;
                                            }, mapobj);                     
                        if (mapobj && Object.keys(mapobj).length > 0) {
                            Object.keys(mapobj).forEach(key => {
                                const regex = new RegExp(`\\$\\$${key}`, 'g');
                                const value = mapobj[key]//typeof mapobj[key] === 'string' ? `'${mapobj[key]}'` : mapobj[key];
                                content_info = content_info.replace(regex, value);
                            });
                        }                                            
                        if(communicationType == 'email'){
                         to = mapobj?.['to']                      
                         subject = templateJson?.contact_info?.subject
                         cc = mapobj?.['cc']
                         bcc = mapobj?.['bcc']
                        let provider = communicationConfig?.email?.value?.provider?.value                      
                        if(provider == 'smtp'){
                         emailConfig = communicationConfig?.email?.value?.provider?.subSelection?.[provider]?.settings?.value                      
                        //this.transporter = this.getTransport(emailConfig);
                         html = content_info
                        sendResponse = await this.sendEmail(to,subject,html,emailConfig,cc,bcc);
                        }                      
                       
                    }
                    }
                    }          
                    // await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: {from:{name:emailConfig?.fromName?.value,address:emailConfig?.fromAddress?.value},to,subject,html,cc,bcc}, response: inputparam } }));
                    // await this.redisService.setStreamData(targetQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: {from:{name:emailConfig?.fromName?.value,address:emailConfig?.fromAddress?.value},to,subject,html,cc,bcc,}, response: inputparam } }));
                                       
                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify({from:{name:emailConfig?.fromName?.value,address:emailConfig?.fromAddress?.value},to,subject,html,cc,bcc}), collectionName, 'request');
                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(sendResponse?.response), collectionName, 'response');
                    if (sendResponse?.response)
                        await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, inputparam, sendResponse?.response);                          
                        await this.redisService.setJsonData(processedKey + upId + ':rule',JSON.stringify(Array.isArray(sendResponse?.response)?sendResponse?.response[0]:sendResponse?.response),collectionName,nodeName);
                    this.logger.log('communication node completed');
                    return { status: 200, targetStatus: targetStatus };
                } catch (error) {                  
                    await this.exceptionhandler(failureQueue, suspiciousQueue, errorQueue, error, upId, nodeId, failureTargetStatus, inputparam)
                }
            }

        }
    }

      async dollarReplace(
  manualQuery,
  filterObj,
  schema,
  filterData?,
) {
  try {
    const variables = [
      ...manualQuery.matchAll(/\$\$([a-zA-Z0-9_.]+)/g),
    ].map((m) => m[1]);

    const singleVariables = [
      ...manualQuery.matchAll(/\$\{([^}]+)\}/g),
    ].map((m) => m[1]);

    // ============================
    // ARRAY FILTER MODE
    // ============================
    if (Array.isArray(filterObj)) {
      for (const item of filterObj) {
        singleVariables.forEach((key) => {
          if (item.key !== key) {
            return;
          }

          const value = item.value;
          const value2 = item.value2;
          const operator = item.operator;
          const type = item.type;

          if (!key || value === undefined || !operator) {
            return;
          }

          if (!this.CommonService.isSafeSqlIdentifier(key)) {
            return;
          }

          // =, !=, <>, >, >=, <, <=
          if (
            ['=', '!=', '<>', '>=', '<=', '>', '<'].includes(operator)
          ) {
            if (type === 'date') {
              manualQuery = manualQuery.replaceAll(
                `\${${key}}`,
                `DATE(${key}) ${operator} ${this.CommonService.sqlLiteral(value)}`,
              );
            } else if (typeof value === 'number') {
              manualQuery = manualQuery.replaceAll(
                `\${${key}}`,
                `${key} ${operator} ${value}`,
              );
            } else {
              manualQuery = manualQuery.replaceAll(
                `\${${key}}`,
                `${key} ${operator} ${this.CommonService.sqlLiteral(value)}`,
              );
            }
          }

          // LIKE
          else if (
            ['LIKE', 'NOT LIKE', 'LIKE_START', 'LIKE_END'].includes(
              operator,
            )
          ) {
            const likeMap = {
              LIKE_START: `${value}%`,
              LIKE_END: `%${value}`,
              LIKE: `%${value}%`,
              'NOT LIKE': `%${value}%`,
            };

            const likeVal = likeMap[operator];

            manualQuery = manualQuery.replaceAll(
              `\${${key}}`,
              `${key} ${
                operator === 'NOT LIKE' ? 'NOT LIKE' : 'LIKE'
              } ${this.CommonService.sqlLiteral(likeVal)}`,
            );
          }

          // BETWEEN
          else if (
            ['BETWEEN', 'NOT BETWEEN'].includes(operator)
          ) {
            if (value !== undefined && value2 !== undefined) {
              if (type === 'date') {
                manualQuery = manualQuery.replaceAll(
                  `\${${key}}`,
                  `DATE(${key}) ${operator} ${this.CommonService.sqlLiteral(value)} AND ${this.CommonService.sqlLiteral(value2)}`,
                );
              } else {
                manualQuery = manualQuery.replaceAll(
                  `\${${key}}`,
                  `${key} ${operator} ${this.CommonService.sqlLiteral(value)} AND ${this.CommonService.sqlLiteral(value2)}`,
                );
              }
            }
          }
        });
      }
       singleVariables.forEach((key) => {
        filterObj = filterObj.filter(item => item.key !== key);
    });
    }

    // ============================
    // OBJECT FILTER MODE
    // ============================
    else if (
      filterObj &&
      typeof filterObj === 'object' &&
      Object.keys(filterObj).length > 0
    ) {
      // alias.${field}
      manualQuery = manualQuery.replace(
        /(\w+)\.\$\{([^}]+)\}/g,
        (match, alias, key) => {
          const value = filterObj[key];

          if (value === undefined) {
            return match;
          }
          if (!this.CommonService.isSafeSqlIdentifier(alias) || !this.CommonService.isSafeSqlIdentifier(key)) {
            return match;
          }

          const isDate = this.isDateTimeField(schema, key);

          if (isDate) {
            return `DATE(${alias}.${key}) = ${this.CommonService.sqlLiteral(value)}`;
          }

          return typeof value === 'number'
            ? `${alias}.${key} = ${value}`
            : `${alias}.${key} = ${this.CommonService.sqlLiteral(value)}`;
        },
      );

      // standalone ${field}
      manualQuery = manualQuery.replace(
        /\$\{([^}]+)\}/g,
        (match, key) => {
          const value = filterObj[key];

          if (value === undefined) {
            return match;
          }
          if (!this.CommonService.isSafeSqlIdentifier(key)) {
            return match;
          }

          const isDate = this.isDateTimeField(schema, key);

          if (isDate) {
            return `DATE(${key}) = ${this.CommonService.sqlLiteral(value)}`;
          }

          return typeof value === 'number'
            ? `${key} = ${value}`
            : `${key} = ${this.CommonService.sqlLiteral(value)}`;
        },
      );
    }

    // ============================
    // REMOVE USED FILTER KEYS
    // ============================
    const keysToRemove = [
      ...new Set([...variables, ...singleVariables]),
    ];

    const removeKeys = (obj) => {
      Object.keys(obj).forEach((objKey) => {
        if (
          keysToRemove.some(
            (key) =>
              objKey === key ||
              objKey.endsWith(`.${key}`),
          )
        ) {
          delete obj[objKey];
        }
      });
    };

    if (Array.isArray(filterData)) {
      filterData.forEach(removeKeys);
    } else if (
      filterObj &&
      typeof filterObj === 'object' &&
      !Array.isArray(filterObj)
    ) {
      removeKeys(filterObj);
    }

    return {
      manualQuery,
      filterData,
      filterObj,
    };
  } catch (error) {
    throw error;
  }
}

    isDateTimeField(schema: any, key: string) {
    return schema?.properties?.[key]?.format === 'date-time';
    }

    getDateTimeFields(schema: any) {
        let props = schema?.properties
        if(!props) props = {};
        let result = []
        for(let key in props){  
            if(props[key]?.format === 'date-time'){
                result.push(key)
            }     
        }     
        return result;        
       
    }

   async replaceQuery(replaceQry,mapObj){
        try {           
           const matches = [...replaceQry.matchAll(/\$\$([a-zA-Z0-9_.]+)/g)];
            const variables = matches.map(match => match[1]);           
            function getValueByKey(obj, key) {
                if (typeof obj !== 'object' || obj === null) {
                    return undefined;
                }

                // Check current level
                if (key in obj) {
                    return obj[key];
                }

                // Check nested levels
                for (const value of Object.values(obj)) {
                    if (typeof value === 'object') {
                    const result = getValueByKey(value, key);

                    if (result !== undefined) {
                        return result;
                    }
                    }
                }

                return undefined;
            }
            if(variables?.length>0){
                for(let item of variables){
                    let value = getValueByKey(mapObj, item);                   
                    const regex = new RegExp(`\\$\\$${item}`, 'g');
                    if (value === null || value === undefined) {
                        value = 'NULL';
                    }
                      else if (Array.isArray(value) &&(value.every(v => typeof v === 'number') || value.every(v => typeof v === 'string')) ) {                       
                        const isNumberArray = value.every(v => typeof v === 'number');
                        const isStringArray = value.every(v => typeof v === 'string');
                        if (isNumberArray) {
                            value = `ARRAY[${value.join(',')}]`;
                        } else if(isStringArray){
                            value = `ARRAY[${value.map(v => this.CommonService.sqlLiteral(v)).join(',')}]`;
                        }
                    }
                    else if (typeof value === 'object') {
                        value = this.CommonService.sqlLiteral(JSON.stringify(value));
                    }
                    else if (typeof value === 'string') {
                        value = this.CommonService.sqlLiteral(value);
                    }
                    replaceQry = replaceQry.replace(regex, value);
                }
            }
            return replaceQry
        } catch (error) {
            throw error
        }
    }



    async sendEmail(to: string | string[],subject: string, html: string, emailConfig:any,cc?: string | string[],bcc?:string | string[]) {
    const transporter = this.getTransport(emailConfig);
    return transporter.sendMail({
        from: {
        name: emailConfig?.fromName?.value,
        address: emailConfig?.fromAddress?.value,
        },
        replyTo:emailConfig?.fromAddress?.value,
        to,
        cc,
        bcc,
        subject,
        html        
    });
    }

     private createTransport(emailConfig) {
        // TLS verification defaults on (rejectUnauthorized: true) so the SMTP
        // connection — including outgoing OTP email — can't be silently
        // MITM'd. The only opt-out is this explicit, operator-set env var;
        // there is no per-node/per-request way to disable verification.
        const allowInsecureTls = process.env.SMTP_ALLOW_INSECURE_TLS === 'true';
        return nodemailer?.createTransport({
          host: emailConfig?.smtpHost?.value,
           port: emailConfig?.smtpPort?.value,
          secure: false,
          requireTLS: true,
          auth: {
            user: emailConfig?.smtpUser?.value,
            pass: emailConfig?.smtpPassword?.value
          },
           tls: {
          rejectUnauthorized: !allowInsecureTls,
        },
        });
    }

private getTransport(emailConfig) {
  const key = `${emailConfig?.smtpHost?.value}:${emailConfig?.smtpPort?.value}:${emailConfig?.smtpUser?.value}`;
  let transporter = this.transporters.get(key);
  if (!transporter) {
    transporter = this.createTransport(emailConfig);
    this.transporters.set(key, transporter);
  }
  return transporter;
    }

    async assign(apiResult, ifoObj, codeObj, inputparam, nodeName, mapObj,) {
        try {
            let apichildResult:any            
            if (typeof apiResult == 'string' || typeof apiResult == 'number' || typeof apiResult == 'boolean') {
                //apichildResult = apiResult;
                if (inputparam) {
                        if (Array.isArray(inputparam) && inputparam.length > 0) {
                            for (let i = 0; i < inputparam.length; i++) {
                                inputparam[i] = Object.assign(inputparam[i], { [nodeName]: apiResult });
                            }
                        } else if (typeof inputparam == 'object') {
                            inputparam = Object.assign(inputparam, { [nodeName]: apiResult });
                        }
                    }
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
               // apichildResult = apiResult;
            } else if (apiResult && Object.keys(apiResult).length > 0) {
                apichildResult = []
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
              //  apichildResult.push(apiResult);                
            }
            return { apiResult, inputparam }
        } catch (error) {
            throw error
        }
    }

    async codeORifoAndInputparamAssign(customcoderesult, apires) {
        try {
            if (Array.isArray(customcoderesult) && customcoderesult.length > 0) {
                //for (let a = 0; a < customcoderesult?.length; a++) {
                if (Array.isArray(apires) && apires?.length > 0) {
                    for (let i = 0; i < apires?.length; i++) {
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

      async ifoAssign(internalMappingNodes, nodeId,sobj,zenresult,processedKey,InputParam,pfdto) {
        let internalMappedObj = {};

        const node = internalMappingNodes?.find(n => n.nodeId === nodeId);
        let humantasknodeInfo = internalMappingNodes?.find(n => n.nodeType === "humantasknode")
       
        let humantasknodeName,humantasknodeType,humantasknodeId
        if(humantasknodeInfo){
            humantasknodeName = humantasknodeInfo?.nodeName
            humantasknodeId = humantasknodeInfo?.nodeId
            humantasknodeType = humantasknodeInfo?.nodeType
        }      

        if (!node?.ifo?.length) return internalMappedObj;

        for (const item of node.ifo) {
            let src_ufMainKey = pfdto.sourceId? ((pfdto.sourceId).split('|'))[0]:''
            let con_ufMainKey = ((item.path).split('|'))[0]

            let formedSsKey = []
            if(pfdto?.ssKey){
                let sKeyArr = pfdto.ssKey
                for(let i=0;i< sKeyArr?.length;i++){
                    let subkeyval = (sKeyArr[i]).split(':')
                    if(subkeyval.length == 7)                          
                    formedSsKey.push(`CK:${subkeyval[0]}:FNGK:${subkeyval[1]}:FNK:${subkeyval[2]}:CATK:${subkeyval[3]}:AFGK:${subkeyval[4]}:AFK:${subkeyval[5]}:AFVK:${subkeyval[6]}`)
                }
            }

           if (item.path?.includes('|ifo|') || item.path?.includes('|gifo|') || item.path?.includes('UF_Processvariable')) { 
                //Session Params

                if(item.type == 'session'){   
                    if(sobj[`session.${item.value}`]){
                        internalMappedObj[item?.key?.toLowerCase()] = sobj[`session.${item.value}`]
                    }
                }else if (item.type == 'date'){
                    const formatMap = {
                        "YYYY-MM-DDTHH:mm:ss.sssZ": "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
                        "YYYY-MM-DDTHH:mm:ss": "yyyy-MM-dd'T'HH:mm:ss",
                        "YYYY-MM-DD": "yyyy-MM-dd",
                        "YYYY-MM-DDTHH:mm:ss.sss.": "yyyy-MM-dd'T'HH:mm:ss.SSS.",
                        "YYYY-MM-DDTHH:mm:ss.sss": "yyyy-MM-dd'T'HH:mm:ss.SSS",
                    };

                    item.value = formatMap[item.value] ?? item?.value; 
                    let formatttedDate = format(new Date(), item?.value);
                    internalMappedObj[item?.key?.toLowerCase()] = formatttedDate
                }else if(item.type == 'rule'){
                    if(zenresult?.[item.key]){
                    internalMappedObj[item?.key?.toLowerCase()] = zenresult[item.key]
                    }
                }else if(item.type == 'pfrule' && item?.value){   
                    let nodeId = item?.nodeId  
                    let nodeName = (internalMappingNodes?.find(n => n.nodeId === nodeId)).nodeName;   
                          
                    let ht_afpVal:any = await this.redisService.getJsonDataWithPath(processedKey+':NPV:'+ nodeName + '.PRO', '.ifo',process.env.CLIENTCODE)               
                    if(ht_afpVal){
                        ht_afpVal = JSON.parse(ht_afpVal)
                        internalMappedObj[item?.key?.toLowerCase()] = ht_afpVal[item.key]  
                    }
                }
                else{
                     let requiredKeys = ['CK:',':FNGK:', ':FNK:',':CATK:', ':AFGK:',':AFK:',':AFVK:'];
                    if(humantasknodeType == "humantasknode" && (formedSsKey.includes(item.artifact) || con_ufMainKey == src_ufMainKey)){                       
                    if (requiredKeys.every((key) => item?.key?.includes(key),) && item?.key?.includes('UF_Processvariable')) {
                        let splitkey = item.key.split('|')
                        item.key = splitkey[splitkey.length -1]
                     }
                        if(item.value)
                            internalMappedObj[item?.key?.toLowerCase()] = item.value
                        else if(InputParam?.[item?.key])
                            internalMappedObj[item?.key?.toLowerCase()] = InputParam[item.key]
                        else
                            internalMappedObj[item?.key?.toLowerCase()] = ''
                    }else if(!requiredKeys.every((key) => item?.key?.includes(key))){
                        if(item.value)
                            internalMappedObj[item?.key?.toLowerCase()] = item?.value
                        else if(InputParam?.[item?.key])
                            internalMappedObj[item?.key?.toLowerCase()] = InputParam[item.key]
                        else
                            internalMappedObj[item?.key?.toLowerCase()] = ''
                    }

                }
            }
        }

        return internalMappedObj;
    }

    codeAssign(data: any) {
        if (Array.isArray(data)) {
            return data.map(item => this.codeAssign(item));
        }

         if (data instanceof Date || typeof data === 'string') {
            return data; // keep date unchanged
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
     
        // if (failureQueue)
        //     await this.redisService.setStreamData(failureQueue, 'TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: failureTargetStatus, data: { request: inputparam, response: error } }))
        // if (suspiciousQueue)
        //     await this.redisService.setStreamData(suspiciousQueue, 'TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: failureTargetStatus, data: { request: inputparam, response: error } }))
        // if (errorQueue)
        //     await this.redisService.setStreamData(errorQueue, 'TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: failureTargetStatus, data: { request: inputparam, response: error } }))
        if (error?.response?.data)
            throw { statusCode: error.status, message: error.response.data }
        else if (error?.response && error?.status)
            throw { statusCode: error.status, message: error.response.statusText || error.response};
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
            const sheetName = workbook?.SheetNames[0]; // Get the first sheet
            const worksheet = workbook?.Sheets[sheetName];
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
            const target = edges?.targetpath[index];
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
            const exactMatchIndex = edges?.targetpath?.indexOf(path);
            if (exactMatchIndex !== -1) {
                orderedTargetPaths?.push(edges?.targetpath[exactMatchIndex]);
                orderedSourcePaths?.push(edges?.sourcepath[exactMatchIndex]);
                continue;
            }
            const normalizedPath = path.replace(/\[0\]/g, '');
            const fuzzyMatchIndex = edges?.targetpath?.findIndex(
                p => p.replace(/\[0\]/g, '') === normalizedPath
            );

            if (fuzzyMatchIndex !== -1) {
                orderedTargetPaths.push(edges?.targetpath[fuzzyMatchIndex]);
                orderedSourcePaths.push(edges?.sourcepath[fuzzyMatchIndex]);
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
                        for (let t = 0; t < typeArr?.length; t++) {
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
                            if (Number(Object?.values(singleObj[item])[0]))
                                singleObj[item] = Number(Object?.values(singleObj[item])[0])
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
            const targetPath = edges?.targetpath[index];

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
            let connectedid = currentNodeEdge[s]?.source;
            for (var h = 0; h < poNode?.length; h++) {
                if (connectedid == poNode[h]?.nodeId) {
                    var conncectedNodename = poNode[h]?.nodeName;
                    var conncectedNodeType = poNode[h]?.nodeType;
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
            let srcHandle = currentNodeEdge[e]?.sourceHandle;
            let targetHandle = currentNodeEdge[e]?.targetHandle;
            let connectedid = currentNodeEdge[e]?.source;
            for (var h = 0; h < poNode.length; h++) {
                if (connectedid == poNode[h]?.nodeId) {
                    var conncectedNodeType = poNode[h]?.nodeType;
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
                        if (getdata?.length > 1) {
                            for (let a = 0; a < getdata.length; a++) {
                                sourceFilteredVal = sourceFilteredVal.replace(
                                    '.items.',
                                    '[' + a + ']',
                                );
                            }
                        } else if(sourceFilteredVal?.includes('.items')){
                            sourceFilteredVal = sourceFilteredVal.replace('.items','[0]')
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
                                        let type,body,schema 
                                        if (pfo?.length > 0) {
                                            for (let p = 0; p < pfo.length; p++) {
                                                if (pfo[p].nodeId == connectedid) {
                                                     if(srcVal.includes('responses')){
                                                         body = 'responses'
                                                         let code = Object.keys(pfo[p]?.schema?.[body])[0]
                                                        if (pfo[p]?.schema?.[body]?.[code]['content']?.['application/json']?.['schema']) {
                                                        type = 'application/json'
                                                    } else if (pfo[p]?.schema?.[body]?.[code]['content']?.['application/xml']?.['schema']) {
                                                        type = 'application/xml'
                                                    }
                                                    else if (pfo[p]?.schema?.[body]?.[code]['content']?.['text/plain']?.['schema']) {
                                                        type = 'text/plain'
                                                    } else if (pfo[p]?.schema?.[body]?.[code]['content']?.['*/*']?.['schema']) {
                                                        type = '*/*'
                                                    }
                                                    schema = pfo[p]?.schema?.[body][code]['content'][type]['schema'];
                                                    inputparam = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + upId + ':NPV:' + pfo[p].nodeName + '.PRO', '.response', collectionName))
                                                     }else{
                                                         body = 'requestBody'
                                                        if (pfo[p]?.schema?.[body]?.['content']?.['application/json']?.['schema']) {
                                                        type = 'application/json'
                                                    } else if (pfo[p]?.schema?.[body]?.['content']?.['application/xml']?.['schema']) {
                                                        type = 'application/xml'
                                                    }
                                                    else if (pfo[p]?.schema?.[body]?.['content']?.['text/plain']?.['schema']) {
                                                        type = 'text/plain'
                                                    } else if (pfo[p]?.schema?.[body]?.['content']?.['*/*']?.['schema']) {
                                                        type = '*/*'
                                                    }
                                                    schema = pfo[p]?.schema?.[body]['content'][type]['schema'];
                                                    inputparam = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + upId + ':NPV:' + pfo[p].nodeName + '.PRO', '.request', collectionName))
                                                     } 
                                                    var res = await this.generateMockData(schema);
                                                    let keys = Object.keys(res);
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
    
    ​async mapEdgeValuesToParams(pfdto: any, currentNodeEdge: any, inputparam: any, processedKey: string, upId: string, collectionName: string,  parameter: any, codeObj: any, pfo: any, childtable?): Promise<any> {
        try {
            let childInsertArr = []
            let srcIdArr = []
            let mapObj, tempQryVal, targetVal, staticRemove, textobj
            if(currentNodeEdge?.length>0){    
            for (let s = 0; s < currentNodeEdge?.length; s++) {
                let source = currentNodeEdge[s]?.source
                let sourceHandle = currentNodeEdge[s]?.sourceHandle
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
                    existing?.sourceHandle?.push(sourceHandle);
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
                let connectedid = srcIdArr[s]?.source
                let connectedHandle = srcIdArr[s]?.sourceHandle

                for (var h = 0; h < pfo.length; h++) {
                    if (connectedid == pfo[h]?.nodeId) {
                        let tempArr = []
                        var conncectedNodename = pfo[h]?.nodeName
                        var conncectedNodeType = pfo[h]?.nodeType
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

                            innerpathVal = afpValue?.response
                            if (conncectedNodeType == 'api_inputnode') {
                                innerpathVal = await this.keysToLowerCaseOnly(innerpathVal)
                            }
                            tempArr = await this.combineData(innerpathVal, tempArr)
                        }
                        if (connectedHandle.includes('ifo')) {
                            //innerpathVal = afpValue?.ifo
                             innerpathVal = Object.assign(afpValue?.ifo,afpValue?.response)
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
                currentNodeEdge = await this.getSchemaType(pfo,currentNodeEdge)                
                let formarr = []
                
                for (let e = 0; e < currentNodeEdge.length; e++) {
                    let schemaRes = {}, b = 0, duptarget, childName, sourceFilteredVal, targetFilteredVal,groupArrayName
                    let srcHandle = currentNodeEdge[e]?.sourceHandle;
                    let targetHandle = currentNodeEdge[e]?.targetHandle;
                    let targetType = currentNodeEdge[e]?.targetType
                    let connectedid = currentNodeEdge[e]?.source;                    
                    let connectedType
                    if (pfo?.length > 0) {
                        for (let p = 0; p < pfo.length; p++) {
                            if (connectedid == pfo[p]?.nodeId) {
                                connectedType = pfo[p]?.nodeType                                
                                break;
                            }
                        }
                    }

                    let childid, childnodeType, srcarr = []
                                       
                    if (srcIdArr.includes(connectedid)) {
                        if (srcHandle) {
                            let srcSplit = srcHandle.split('|');                           
                             if(connectedType == 'humantasknode' )//&& srcSplit[0].includes(':FNK:UF-UFWS:')
                             duptarget = await this.checkTarget(currentNodeEdge,staticRemove,parameter)                           
                            if (srcSplit.length > 3 && childtable) {
                                childid = srcSplit[srcSplit.length - 2]
                            }else if(srcSplit.length > 3 && !srcSplit?.includes('gifo') && !srcSplit?.includes('ifo') && !srcSplit?.includes('UF_Processvariable')){
                                if(typeof srcSplit[2] == 'string')
                                groupArrayName = srcSplit[2]
                            }   
                            if (pfo?.length > 0 && childid && childtable) {
                                for (let p = 0; p < pfo.length; p++) {
                                    if (connectedid == pfo[p]?.nodeId) {
                                        childnodeType = pfo[p]?.nodeType
                                        let data = pfo[p].schema[srcSplit[0]][srcSplit[1]]
                                        if (data?.length > 0) {
                                            for (let i = 0; i < data.length; i++) {
                                                if (data[i].id == childid) {
                                                    childName = data[i]?.name
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

                                    if (sourceFilteredVal.includes('.items.')) {
                                      let spilt = sourceFilteredVal.split('.items.');                                                                        
                                      var getdata = _.get(inputCollection[connectedid], spilt[0]);
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
                                targetVal = targetSplit.includes('HeaderParams') ? targetSplit[1] : targetSplit[targetSplit.length - 1];
                                
                                // if (pfdto?.sourceId && connectedType == "humantasknode") {
                                    let srcId = pfdto?.sourceId?.split('|').shift()                                    
                                    let formedSsKey = []
                                    if(pfdto?.ssKey?.length>0){
                                        let sKeyArr = pfdto?.ssKey
                                        for(let i=0;i< sKeyArr.length;i++){
                                            let subkeyval = (sKeyArr[i]).split(':')
                                            if(subkeyval.length == 7)                          
                                            formedSsKey.push(`CK:${subkeyval[0]}:FNGK:${subkeyval[1]}:FNK:${subkeyval[2]}:CATK:${subkeyval[3]}:AFGK:${subkeyval[4]}:AFK:${subkeyval[5]}:AFVK:${subkeyval[6]}`)
                                        }
                                    }     
                                   
                                    let previousHandlerId = JSON.parse(await this.redisService.getJsonData(processedKey + upId + ':NPV:' + conncectedNodename + '.PRO', collectionName))
                                    if(previousHandlerId?.sourceid)
                                        previousHandlerId = previousHandlerId?.sourceid?.split('|').shift() 
                                    
                                     let handlerCheck = true     
                                    if(connectedType == "humantasknode" && !srcHandle.includes('|gifo|'))
                                        handlerCheck = srcId == srcSplit[0] || previousHandlerId == srcSplit[0]
                                   
                                    if (handlerCheck || formedSsKey.includes(srcSplit[0])) {  //|| srcSplit[0].includes(':FNK:UF-UFWS:')     //|| ssKey == srcSplit[0]                                                      
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
                                                targetFilteredVal = targetFilteredVal?.split('.');
                                                targetFilteredVal = targetFilteredVal?.filter((item) => !this.numberArr.includes(item));
                                                targetFilteredVal = targetFilteredVal?.join('.');

                                                if (targetFilteredVal.includes('.items.')) {
                                                    targetFilteredVal = targetFilteredVal?.replace('.items.', '[0]',);
                                                }
                                                if (targetFilteredVal.startsWith('items.')) {
                                                    targetFilteredVal = targetFilteredVal?.replace('items.', '',);
                                                }

                                                if (mapObj) {
                                                    var setdata = _.get(mapObj, targetFilteredVal);
                                                    if (setdata?.length) {
                                                        targetFilteredVal = targetFilteredVal.replace('[0]', '[' + setdata.length + ']');
                                                    }
                                                } 
                                                if (sourceFilteredVal && sourceFilteredVal.length > 0) {
                                                    sourceFilteredVal = sourceFilteredVal?.toLowerCase();
                                                    sourceFilteredVal = sourceFilteredVal?.trim();

                                                    if (getdata?.length > 1) {
                                                            for (let a = 0; a < getdata.length; a++) {
                                                                // Assuming sourceFilteredVal is something like 'loan.repayment_schedule.items.'
                                                                let dynamicPath = sourceFilteredVal.replace('.items', '[' + a + ']');
                                                                srcarr.push(dynamicPath);
                                                            }
                                                            } else if(sourceFilteredVal?.includes('.items')){
                                                                sourceFilteredVal = sourceFilteredVal.replace('.items','[0]')
                                                            } 
                                                    
                                                    if (childnodeType == 'humantasknode' && childName && childid) {
                                                        let childdata = inputCollection[connectedid][childName.toLowerCase()]
                                                        if (childdata?.length > 0) {
                                                            let temptargetFilteredVal = targetFilteredVal
                                                            for (let i = 0; i < childdata.length; i++) {
                                                                if (targetFilteredVal.includes('[0]')) {
                                                                    temptargetFilteredVal = targetFilteredVal.replace('[0]', [i] + '.',);
                                                                    _.set(mapObj, temptargetFilteredVal, _.get(childdata[i], sourceFilteredVal));
                                                                }
                                                            }
                                                        }
                                                    } else if(srcarr?.length>0){                                                        
                                                        let dataarr = []
                                                        for(let a = 0; a < srcarr.length; a++){
                                                            let Obj = {};                                                       
                                                         _.set(Obj, targetFilteredVal, _.get(inputCollection, srcarr[a]));
                                                         dataarr.push(Obj)
                                                        }                                                  
                                                        formarr.push({[targetFilteredVal]:dataarr})                                                  
                                                       childInsertArr = formarr.reduce((acc, curr) => {
                                                        const key = Object.keys(curr)[0];      
                                                        const arr = curr[key]; 
                                                        arr.forEach((item, i) => {
                                                            if (!acc[i]) acc[i] = {};
                                                            acc[i][key] = item[key];
                                                        });
    
                                                        return acc;
                                                        }, []);                                                      
                                                    }else{                                                                        
                                                        if(srcSplit.length == 2 && connectedType == 'humantasknode'){
                                                            let filterinput = await this.checkData(pfo,inputCollection,srcSplit[0],connectedid,srcSplit[1])                                                          
                                                            _.set(mapObj, targetFilteredVal, filterinput);
                                                        } else if(connectedType == 'humantasknode' && groupArrayName){                                                            
                                                            let gruopData = inputCollection[connectedid][groupArrayName]                                                            
                                                            _.set(mapObj, targetFilteredVal, gruopData);
                                                        }
                                                        else{  
                                                            let srcData = _.get(inputCollection, sourceFilteredVal)
                                                            
                                                            let objVal = sourceFilteredVal
                                                            if(sourceFilteredVal.includes('.')){
                                                                let srcFilArr = sourceFilteredVal.split('.')
                                                                objVal = srcFilArr[srcFilArr.length-1]
                                                            }  
                                                            if(srcData || (targetType == 'boolean' && (srcData == true || srcData == false))){
                                                                if ((targetType === 'number' || targetType ==='integer') && typeof srcData === 'string') {
                                                                    let num = Number(srcData)
                                                                    if (!Number.isNaN(num)) {
                                                                        srcData = num
                                                                    }
                                                                } else if (targetType === 'string' && typeof srcData === 'number') {
                                                                    srcData = String(srcData)
                                                                }
    
                                                                if(typeof mapObj[targetFilteredVal] == 'object' && Object.keys(mapObj[targetFilteredVal]).length>0){                                                                
                                                                    let assignData = Object.assign(mapObj[targetFilteredVal],{[objVal]:srcData})
                                                                    _.set(mapObj, targetFilteredVal, assignData);
                                                                }else{                                                                 
                                                                    if(targetType == 'object' && typeof srcData == 'object'){
                                                                        _.set(mapObj, targetFilteredVal, srcData);
                                                                    }
                                                                    else if(targetType == 'object' && ['string','number','boolean','date','integer','array'].includes(typeof srcData)){
                                                                        _.set(mapObj, targetFilteredVal, {[objVal]:srcData});
                                                                    }else if(['string','number','boolean','date','integer','array'].includes(targetType) && (typeof srcData != 'object' || Array.isArray(srcData) && srcData?.length>0)){
                                                                        _.set(mapObj, targetFilteredVal, srcData);
                                                                    }
                                                                    else{
                                                                        throw new CustomException(`Invalid data type for ${srcData}`,400)
                                                                    }                                              
                                                                }     
                                                            }                                                            
                                                        }
                                                    }                                                     
                                                       
                                                } else if (b == 0) {
                                                    // let testdata: any = inputCollection;                                        
                                                    let testdata = _.get(inputCollection, connectedid + '.schema')
                                                    testdata = testdata.replace(/\\n/g, '\n');
                                                    mapObj[targetFilteredVal] = testdata;
                                                }
                                            } else if (sourceFilteredVal && sourceFilteredVal.length > 0) {
                                                sourceFilteredVal = sourceFilteredVal?.toLowerCase();
                                                sourceFilteredVal = sourceFilteredVal?.trim();
                                                textobj = _.get(inputCollection, sourceFilteredVal);
                                            }
                                        } else {
                                            sourceFilteredVal = sourceFilteredVal?.toLowerCase();
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
                                            }else if(srcarr?.length>0){                                                        
                                                let dataarr = []
                                                for(let a = 0; a < srcarr.length; a++){
                                                    let Obj = {};                                                       
                                                    _.set(Obj, targetFilteredVal, _.get(inputCollection, srcarr[a]));
                                                    dataarr.push(Obj)
                                                }                                                  
                                                formarr.push({[targetFilteredVal]:dataarr})                                                  
                                                childInsertArr = formarr.reduce((acc, curr) => {
                                                const key = Object.keys(curr)[0];      
                                                const arr = curr[key]; 
                                                arr.forEach((item, i) => {
                                                    if (!acc[i]) acc[i] = {};
                                                    acc[i][key] = item[key];
                                                });

                                                return acc;
                                                }, []);                                                      
                                            }else{                                                
                                                if(srcSplit.length == 2 && connectedType == 'humantasknode'){ 
                                                    let filterinput = await this.checkData(pfo,inputCollection,srcSplit[0],connectedid,srcSplit[1])                                                    
                                                        _.set(mapObj, targetFilteredVal, filterinput);
                                                } else if(connectedType == 'humantasknode' && groupArrayName){                                                            
                                                    let gruopData = inputCollection[connectedid][groupArrayName]                                                            
                                                    _.set(mapObj, targetFilteredVal, gruopData);
                                                }
                                                else{
                                                    let srcData = _.get(inputCollection, sourceFilteredVal)
                                                    let objVal = sourceFilteredVal
                                                    if(sourceFilteredVal.includes('.')){
                                                        let srcFilArr = sourceFilteredVal.split('.')
                                                        objVal = srcFilArr[srcFilArr.length-1]
                                                    }
                                                    if(srcData || (targetType == 'boolean' && (srcData == true || srcData == false))){
                                                        if ((targetType === 'number' || targetType ==='integer') && typeof srcData === 'string') {
                                                            let num = Number(srcData)
                                                            if (!Number.isNaN(num)) {
                                                                srcData = num
                                                            }
                                                        } else if (targetType === 'string' && typeof srcData === 'number') {
                                                            srcData = String(srcData)
                                                        }
    
                                                        if(typeof mapObj[targetVal] == 'object' && Object.keys(mapObj[targetVal]).length>0){                                                                
                                                            let assignData = Object.assign(mapObj[targetVal],{[objVal]:srcData})
                                                            _.set(mapObj, targetVal, assignData);
                                                        }else{                                                         
                                                            if(targetType == 'object' && typeof srcData == 'object'){
                                                                _.set(mapObj, targetVal, srcData);
                                                            }
                                                            else if(targetType == 'object' && ['string','number','boolean','date','integer','array'].includes(typeof srcData)){
                                                               _.set(mapObj, targetVal, {[objVal]:srcData});
                                                            }else if(['string','number','boolean','date','integer','array'].includes(targetType) && (typeof srcData != 'object' || Array.isArray(srcData) && srcData?.length>0)){
                                                                _.set(mapObj, targetVal, srcData);
                                                            }
                                                            else{
                                                                throw new CustomException(`Invalid data type for ${srcData}`,400)
                                                            }                                                         
                                                        }
                                                    }
                                                }
                                            }
                                                
                                        }
                                        if (b > 0) {
                                        let obj = {};
                                        let type,body,schema 
                                        if (pfo?.length > 0) {
                                            for (let p = 0; p < pfo.length; p++) {
                                                if (pfo[p].nodeId == connectedid) {
                                                     if(srcVal.includes('responses')){
                                                         body = 'responses'
                                                         let code = Object.keys(pfo[p]?.schema?.[body])[0]
                                                        if (pfo[p]?.schema?.[body]?.[code]['content']?.['application/json']?.['schema']) {
                                                        type = 'application/json'
                                                    } else if (pfo[p]?.schema?.[body]?.[code]['content']?.['application/xml']?.['schema']) {
                                                        type = 'application/xml'
                                                    }
                                                    else if (pfo[p]?.schema?.[body]?.[code]['content']?.['text/plain']?.['schema']) {
                                                        type = 'text/plain'
                                                    } else if (pfo[p]?.schema?.[body]?.[code]['content']?.['*/*']?.['schema']) {
                                                        type = '*/*'
                                                    }
                                                    schema = pfo[p]?.schema?.[body][code]['content'][type]['schema'];
                                                    inputparam = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + upId + ':NPV:' + pfo[p].nodeName + '.PRO', '.response', collectionName))
                                                     }else{
                                                         body = 'requestBody'
                                                        if (pfo[p]?.schema?.[body]?.['content']?.['application/json']?.['schema']) {
                                                        type = 'application/json'
                                                    } else if (pfo[p]?.schema?.[body]?.['content']?.['application/xml']?.['schema']) {
                                                        type = 'application/xml'
                                                    }
                                                    else if (pfo[p]?.schema?.[body]?.['content']?.['text/plain']?.['schema']) {
                                                        type = 'text/plain'
                                                    } else if (pfo[p]?.schema?.[body]?.['content']?.['*/*']?.['schema']) {
                                                        type = '*/*'
                                                    }
                                                    schema = pfo[p]?.schema?.[body]['content'][type]['schema'];
                                                    inputparam = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + upId + ':NPV:' + pfo[p].nodeName + '.PRO', '.request', collectionName))
                                                     } 
                                                    var res = await this.generateMockData(schema);
                                                    let keys = Object.keys(res);
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
                                // }
                            }
                        }
                    }
                }                

                if (Object.keys(mapObj).length > 0) {
                    childInsertArr.push(mapObj);
                }
            }
            }
            return { childInsertArr, tempQryVal, textobj }
        } catch (error) {          
            throw error
        }
 }

    async getSchemaType(pfo,currentNodeEdge){
        try {
            if(currentNodeEdge?.length>0){
                let targetNodeArr = {}
                for(let i=0;i< currentNodeEdge.length;i++){
                    let targetId = currentNodeEdge[i]?.target
                    let targetHandle = currentNodeEdge[i]?.targetHandle
                    let targetNode
                    if(targetNodeArr[targetId]){                       
                        targetNode  = targetNode[targetId]
                    }else{   
                        targetNode = pfo.find(f => f.nodeId == targetId)                      
                        targetNodeArr = {srcId:targetNode}
                    }

                    if(targetNode.schema){
                        let schemaField = targetHandle.split('|')
                        if(schemaField.includes('HeaderParams')){
                            schemaField = (schemaField[1]).split('.')
                            schemaField.pop()
                            schemaField.push('schema')
                            schemaField = schemaField.join('.')
                        }
                        else
                            schemaField = schemaField[schemaField.length-1]
                        
                        let key = schemaField.split('.')
                        key = key[key.length-1]   
                         let values:any , keys                    
                        let getValue = _.get(targetNode.schema,schemaField)                       
                         if(getValue && Object.values(getValue).length>0) {
                            values = Object.values(getValue)[0]
                            keys = Object.keys(getValue)[0]
                        } 
                        
                        else throw `${key} does not exist in ${targetNode.nodeName}`;
                        let targetType
                      
                        if(getValue?.type){
                            targetType = getValue?.type
                        }
                        else if(['allOf','oneOf'].includes(keys)){
                            if(values?.length>0){
                                for(let item of values){
                                    if(item['keyName'] == key){
                                        targetType = item['type']
                                    }else{
                                        targetType = item['type']
                                    }
                                }
                            }
                        }

                        currentNodeEdge[i] = Object.assign(currentNodeEdge[i],{targetType})                      
                    }
                }

                return currentNodeEdge
            }else
                return []
            
        } catch (error) {
            throw error
        }
    }
    
        async checkTarget(currentNodeEdge,staticRemove,parameter){
        try {       
            let targetarr = [] 
            let srcarr = [] 
            if(currentNodeEdge?.length>0){
                for (let e = 0; e < currentNodeEdge.length; e++) {                   
                    let targetFilteredVal
                    let srcHandle = currentNodeEdge[e]?.sourceHandle;
                    let targetHandle = currentNodeEdge[e]?.targetHandle;                   
                    let targetVal              
                    if (srcHandle) {  
                        let srcsplit =  srcHandle.split('|')[1]   
                        if (targetHandle) {
                            let targetSplit = targetHandle.split('|');
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
                                            // tempQryVal.push(tempobj);
                                        }
                                        targetFilteredVal = targetFilteredVal?.split('.');
                                        targetFilteredVal = targetFilteredVal?.filter((item) => !this.numberArr.includes(item));
                                        targetFilteredVal = targetFilteredVal?.join('.');

                                        if (targetFilteredVal.includes('.items.')) {
                                            targetFilteredVal = targetFilteredVal.replace('.items.', '[0]',);
                                        }
                                        if (targetFilteredVal.startsWith('items.')) {
                                            targetFilteredVal = targetFilteredVal.replace('items.', '',);
                                        }                                       
                                    } 
                            }else{
                                targetFilteredVal = targetVal
                            }                    
                            targetarr.push(srcsplit+'_'+targetFilteredVal)  
                        }
                    }                  
                }                                  
                return [...new Set(targetarr.filter((item, index) => targetarr.indexOf(item) !== index))];
                
            }
        } catch (error) {
            throw error
        }
    }

    async checkData(pfo, inputCollection, sskey, connectedid,connectedNodeId) {
        try {           
            let inputarr = []
            let filteredData
            if (pfo?.length > 0) {
                for (let a = 0; a < pfo.length; a++) {
                    if (pfo[a].nodeId == connectedid) {
                        // let schema: any = Object.values(pfo[a].schema[sskey])
                       let schema:any = pfo[a]?.schema[sskey][connectedNodeId]
                        schema = Array.isArray(schema) ? schema?.flat():schema                    
                        if (schema?.length > 0) {
                            for (let a = 0; a < schema.length; a++) {
                                if(schema[a]?.name)
                                    inputarr.push((schema[a]?.name).toLowerCase())
                                else{                                   
                                    let dynamicJsonArr:any = (Object.values(schema[a]))[0]                                   
                                    dynamicJsonArr.forEach((item) => {
                                        if (item?.['name'])
                                            inputarr.push((item['name']).toLowerCase())
                                    })
                                }
                            }
                        }
                    }
                }            
               
                // { type: 'ewe', email: 'fds@gmail.com', mobile_number: '9639874563' }
                
                if (inputarr?.length > 0) {
                    filteredData = Object.fromEntries(
                        Object.entries(inputCollection[connectedid]).filter(([key]) => inputarr.includes(key))
                    );
                }
                return filteredData

            }
        } catch (error) {
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
                if(innerObj){
                    const keys = Object.keys(innerObj);
                if (keys.length === 1) {
                    return innerObj[keys[0]];
                }
                }
                
            }
            return value;
        };

        switch (type) {
            case 'object': {
                if (typeof data !== 'object' || Array.isArray(data)) return data[0];

                const result: any = {};
                const props = schema?.properties || {};
                const required = schema?.required || [];

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

    async applyFilters(data, searchFilter) {
        if(data?.length == 0 || !Array.isArray(data)) return data
        return data.filter(item => {

            return searchFilter.every(filter => {

                const {key,operator,value,value2,type} = filter;

                const fieldValue = item[key];

                const field = fieldValue != null? String(fieldValue).toLowerCase(): '';

                const searchValue = value != null? String(value).toLowerCase(): '';

                switch (operator) {

                    case '=':                 
                    if(type == 'date'){
                        return new Date(fieldValue)
                        .toISOString()
                        .startsWith(value);
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
                        return fieldValue >= value &&
                            fieldValue <= value2;
                    

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
    
     async getProducer(): Promise<Producer> {
    if (!this.producer) {
      this.producer = this.getKafkaInstance().producer({
        allowAutoTopicCreation: true,
        maxInFlightRequests: 5,
        idempotent: true, // Changed to true for better reliability
        retry: { 
          retries: 8,
          initialRetryTime: 100,
          maxRetryTime: 30000,
        },
       // connectionTimeout: 10000,
        //requestTimeout: 30000,
      });
      await this.producer.connect();
    }
    return this.producer;
  }

   // Reuse consumers by groupId
  async getConsumer(groupId: string): Promise<Consumer> {
    if (!this.consumers.has(groupId)) {
      const consumer = this.getKafkaInstance().consumer({
        groupId: groupId,
        sessionTimeout: 30000, // Increased from 6000
        heartbeatInterval: 3000, // Increased from 1500
        maxWaitTimeInMs: 5000, // Increased from 100
        retry: { 
          retries: 0
        },
      });
      await consumer.connect();
      this.consumers.set(groupId, consumer);
    }
    return this.consumers.get(groupId);
  }
  
}