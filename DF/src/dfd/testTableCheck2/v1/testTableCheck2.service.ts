import { Injectable, Logger } from "@nestjs/common";
import { RedisService } from "src/redisService";
import { pfDto,PoEvent } from "src/dto";
import { CommonService } from "src/common.Service";
import axios,{ AxiosRequestConfig } from "axios";
import * as FormData from 'form-data';
import Redis from 'ioredis';
import * as pg from "pg";
import * as ftp from 'basic-ftp';
import { JwtService } from "@nestjs/jwt";
import { Readable } from "stream";
import { MongoClient } from "mongodb";
const _ = require("lodash")

type MappingValue = string | { sourcePath: string; arrayMap: Record< string, string> };
type MappingConfig = Record< string, MappingValue>;

@Injectable()
export class testTableCheck2Service {
    private ftpClient: ftp.Client;
  private readonly ftpUploadPath: string;
  private readonly ftpOutputPath: string;

    constructor(
      private readonly redisService: RedisService, 
      private readonly CommonService: CommonService,
       private readonly jwtService: JwtService
      ) {
        this.ftpClient = new ftp.Client();
    this.ftpUploadPath = process.env.FILE_PATH;
    this.ftpOutputPath = process.env.FILE_VarnishURL;
      }
    private readonly logger = new Logger(testTableCheck2Service.name);

  async gettestTableCheck2Process(input:PoEvent) {  
    this.logger.log("Torus Consumer Started....")
       try {           
      var key = input.key
      var upId = input.upId
      var event = input.event
      var inputparam:any = input.data
      var token = input.token
      var nodeId = input.nodeId
      var nodeName = input.nodeName
      var nodeType = input.nodeType
      var flag = input.flag
      let page = input.page
      let count = input.count
      let filterData = input.filterData
      var params: any = (Object.keys(input))
      const missingKeys = params.filter(item => {
        if(item != 'data'){
          item => !input[item] || input[item] == null || input[item] == undefined
        }
      });
      // const missingKeys = params.filter(item => !input[item] || input[item] == null || input[item] == undefined);
      if (missingKeys.length > 0) {
        return `${missingKeys.join(', ')} ${missingKeys.length > 1 ? 'are' : 'is'} empty`;
      }
      let currentFabric = await this.CommonService.splitcommonkey(key,'FNK')//key.split('FNK')[1].split(':')[1]  
     
      let fabricMap = {
        'PF-PFD': 'PFS',
        'PF-SFD': 'PFS',
        'DF-DFD': 'DFS',       
      }    
      
      var pfjson = JSON.parse(await this.redisService.getJsonData(key + fabricMap[currentFabric] ,process.env.CLIENTCODE));   

      var pfresponse = await this.pfProcessor(key, upId, event, inputparam, token, nodeId, nodeName, nodeType, pfjson,currentFabric,flag,page,count, filterData);
      return pfresponse
    } catch (error) {  
      console.log('TS Error',error);
      if(error.message){
        return {error:error, message: error.message}
      }else{
        return error
      }
    }
  }  


  async connectClient() {
    try {
     
        await this.ftpClient.access({
          host: process.env.FILE_HOST,
          user: process.env.FILE_USERNAME,
          password:process.env.FILE_PASSWORD,
          port:Number(process.env.FILE_PORT),
          secure: false, 
          
        });
      } catch (error) {
        console.error('FTP connection error:', error);
        throw error;
      }
  }

    async pfProcessor(key, upId, event, inputparam, token, nodeId, nodeName, nodeType, pfjson,currentFabric,flag,page,count, filterData) {
    this.logger.log('Pf Processor started!');
    this.logger.log('UPID',upId)  
    let collectionName = process.env.CLIENTCODE
    this.logger.log('collectionName',collectionName)
    let offset = (page - 1) * count
    let request = inputparam
    var fngkKey = await this.CommonService.splitcommonkey(key,'FNGK') //key.split('FNGK')[1].split(':')[1]   
    if(key.includes(fngkKey)){
      var processedKey = key.replace(fngkKey, fngkKey+'P')
    } 
      let d_Pfs,d_Po,staticQueue
      if(currentFabric == 'PF-PFD' || currentFabric == 'PF-SFD'){     
        d_Pfs = 'PFS'
        d_Po = 'PO'
        staticQueue = 'TPH'
      }else if(currentFabric == 'DF-DFD'){     
        d_Pfs = 'DFS'
        d_Po = 'DO'
        staticQueue = 'TDH'
        if(await this.redisService.exist(key + 'DFO',collectionName)){
          var dfo:any = JSON.parse(await this.redisService.getJsonData(key + 'DFO',collectionName)) 
        }
      }      
     
     var poJson = JSON.parse(await this.redisService.getJsonData(key + d_Po ,collectionName));                
    

    // var poNode = poArtifact.node
    var poNode = poJson?.mappedData?.artifact?.node
    if(!poNode || poNode.length == 0) throw 'Nodes not found'

    var internalEdges = poJson?.internalMappingEdges 
    let statickeyword = ["get","post","patch","200","requestBody","responses","content","application/json","application/jwt","application/json; charset=utf-8","schema","properties","allOf","oneOf","inputschema","outputschema"]
    let numberArr: string[] = Array.from({ length: 101 }, (_, i) => (i).toString());  
    var ndp = JSON.parse(await this.redisService.getJsonData(key + 'NDP',collectionName))
    var afi = JSON.parse(await this.redisService.getJsonData(key + 'AFI',collectionName))
    if (afi != null && afi.executionMode)
      var mode = afi.executionMode
    else    
      mode='E'
      var levelkeyarr =[]     
      if(currentFabric == 'DF-DFD'){
        var nodekey = Object.keys(ndp)
        for(let i = 0; i < nodekey.length; i++) {
         levelkeyarr.push(ndp[nodekey[i]]?.data?.pro?.levelKeyName)
        }
      }

      for (var j = 0; j < poNode.length; j++) {
        if(poNode[j].nodeId == nodeId ){  
          if(currentFabric == 'DF-DFD'){
            var sourceStatus = poNode[j].events.sourceStatus 
          var srcQueue = poNode[j].events.sourceQueue           
          var targetStatus = poNode[j].events.pro.success.targetStatus
          var targetQueue = poNode[j].events?.pro?.success?.targetQueue
          var failureQueue = poNode[j].events.pro.failure.targetQueue
          var failureTargetStatus = poNode[j].events.pro.failure.targetStatus 
          }else if(currentFabric == 'PF-PFD' || currentFabric == 'PF-SFD'){
            if((Array.isArray(poNode[j].events) && poNode[j].events.length >0)){
              for(let e=0;e < poNode[j].events.length;e++){ 
                if(event == poNode[j].events[e].source.status){
                  var sourceStatus = poNode[j].events[e].source.status
                  var srcQueue = poNode[j].events[e].source.queue
                  var targetStatus = poNode[j].events[e].success.status
                  var targetQueue = poNode[j].events[e].success.queue
                  var failureQueue = poNode[j].events[e].failure.queue
                  var failureTargetStatus = poNode[j].events[e].failure.status
                  var suspiciousStatus = poNode[j].events[e].suspicious.status
                  var suspiciousQueue = poNode[j].events[e].suspicious.queue
                  var errorStatus = poNode[j].events[e].error.status
                  var errorQueue = poNode[j].events[e].error.queue
                } 
              } 
            } else{
              throw 'events is empty'
            }           
          }
          
          var routearr = pfjson[j].routeArray
        }     
        
        if (!srcQueue || srcQueue == ' ') srcQueue = staticQueue;

        srcQueue = collectionName + '_' + srcQueue + '_ProcessStatus'
       
        if(!failureQueue || failureQueue == ' ') failureQueue =  srcQueue

        failureQueue = collectionName + '_' + failureQueue + '_ProcessStatus'        
       
        if(pfjson[j].nodeId == nodeId && currentFabric == 'DF-DFD'){
          var routearr = pfjson[j].routeArray       
          var ifoArr = []
         
          var dfoSchema: any
          var dfoColumn: any = []
          if(dfo){
            for (let item of dfo) {
              if (item.nodeId == poNode[j].nodeId) {
                if (item.schema)
                  dfoSchema = item.schema
                  if(dfoSchema && dfoSchema.length>0){
                    for(let d=0;d < dfoSchema.length;d++){
                      dfoColumn.push(dfoSchema[d].name)
                    }
                  }
              }
            }
          }
        }
        
        //HumanTaskNode
          if(nodeType == 'humantasknode' && poNode[j].nodeId == nodeId){
            try {            
              this.logger.log('HumanTask node Started')
               var RCMresult:any = await this.CommonService.getRuleCodeMapper(poNode[j],inputparam,processedKey + upId,currentFabric )
                 
              let zenresult = RCMresult.rule
              let customcoderesult = RCMresult.code 
              if(customcoderesult != undefined){
                var response = Object.assign(request,customcoderesult)
              }    
              if(response)
              await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(response),collectionName,'response')
              if(routearr.length>0){
                for(var z=0;z < routearr.length;z++){ 
                  if(routearr[z].nodeName != 'End'){                    
                    if(response)              
                      await this.redisService.setJsonData(processedKey + upId + ':NPV:' + routearr[z].nodeName + '.PRO', JSON.stringify(response),collectionName, 'request')
                    else
                      await this.redisService.setJsonData(processedKey + upId + ':NPV:' + routearr[z].nodeName + '.PRO', JSON.stringify(inputparam),collectionName,'request')
                  }
                }
              }
              
              await this.redisService.setStreamData(srcQueue,'TASK - '+upId, JSON.stringify({"PID":upId,"TID":nodeId,"EVENT":targetStatus}))
              
               if(response){
                await this.CommonService.getTPL(processedKey,upId,poNode[j],'Success',token,currentFabric,sourceStatus,inputparam,response)
               }else{
                await this.CommonService.getTPL(processedKey,upId,poNode[j],'Success',token,currentFabric,sourceStatus,inputparam,inputparam)
               }
              this.logger.log('HumanTask node completed')      
              return {status:200, targetStatus: targetStatus}
            } catch (error) {              
             // await this.CommonService.getTPL(processedKey,upId,poNode[j],'Failed',token,currentFabric,sourceStatus,inputparam,error)              
              await this.redisService.setStreamData(failureQueue,'TASK - '+upId,JSON.stringify({"PID":upId,"TID":nodeId,"EVENT":failureTargetStatus}))
              throw error
            }
          
          }

        //DecisionNode
          if(nodeType == 'decisionnode' && poNode[j].nodeId == nodeId){
            try { 
              this.logger.log('Decision node Started')
             // await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(inputparam),collectionName, 'request')
              if(!poNode[j].rule || Object.values(poNode[j].rule).length == 0){
                throw 'Rule is required for decision node'
              }
              var RCMresult:any = await this.CommonService.getRuleCodeMapper(poNode[j],inputparam,processedKey + upId,currentFabric)                
              let zenresult = RCMresult.rule              
              let customcoderesult = RCMresult.code 
              if(customcoderesult != undefined){
                var response = Object.assign(request,customcoderesult)
              } 
             
              if(response){
                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(response),collectionName,'response')
              }else if(zenresult != undefined){
                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify({zenresult}),collectionName,'response')
              }
              
              if(routearr.length>0){
                for(var z=0;z < routearr.length;z++){ 
                  if(routearr[z].nodeName != 'End'){
                    if(response)               
                      await this.redisService.setJsonData(processedKey + upId + ':NPV:' + routearr[z].nodeName + '.PRO', JSON.stringify(response),collectionName, 'request')
                    else{
                      await this.redisService.setJsonData(processedKey + upId + ':NPV:' + routearr[z].nodeName + '.PRO', JSON.stringify(inputparam),collectionName,'request')
                    }                      
                  }  
                }
              } 
              if(zenresult){
                for(let e=0;e < poNode[j].events.length;e++){ 
                  if(event == poNode[j].events[e].source.status){
                    await this.redisService.setJsonData(key+'PO',JSON.stringify(zenresult),collectionName,'mappedData.artifact.node['+j+'].events['+e+'].success.status')
                  }}
               
                await this.redisService.setStreamData(srcQueue,'TASK - '+upId,JSON.stringify({"PID":upId,"TID":nodeId,"EVENT":zenresult}))
                if(zenresult)
                  await this.CommonService.getTPL(processedKey,upId,poNode[j],'Success',token,currentFabric,sourceStatus,inputparam,{zenresult})
              }
              this.logger.log('Decision node completed')  
              return {status:200, targetStatus: zenresult} 
              // return zenresult
            } catch (error) {
             // await this.CommonService.getTPL(processedKey,upId,poNode[j],'Failed',token,currentFabric,sourceStatus,inputparam,error)
              
              await this.redisService.setStreamData(failureQueue,'TASK - '+upId,JSON.stringify({"PID":upId,"TID":nodeId,"EVENT":failureTargetStatus}))
              throw error
            }
          }
          
          //Api Node
           if (nodeType == 'apinode' && poNode[j].nodeId == nodeId) {
                try {
                  this.logger.log(`${poNode[j].nodeName} Api node Started`)
                  if (!failureQueue) {
                    failureQueue = srcQueue
                  }
                  var customConfig: any = JSON.parse(await this.redisService.getJsonDataWithPath(key + 'NDP', '.' + poNode[j].nodeId,collectionName))
                  var referenceKey = customConfig?.apiKey
                  var filterParams = customConfig?.data?.pro?.filterParams?.items
                  let nodeVersion = customConfig?.nodeVersion
    
                  if (!referenceKey) throw 'Reference key not found'
    
                  var ApiConfig: any = JSON.parse(await this.redisService.getJsonData(referenceKey,collectionName))
    
                  if (!ApiConfig || Object.keys(ApiConfig).length == 0) throw 'Reference key value not found'
    
                  var apiVal = Object.values(ApiConfig)[0]
                  customConfig = apiVal
                  if (nodeVersion?.toLowerCase() == 'v1') {
                    var oprname: any = customConfig?.data?.method
                    if (!oprname) throw 'Method Name not found'
                    var methodName = oprname.toLowerCase()
                    var parameterQuery = customConfig.data?.[methodName]?.parameters
                    var parameter = customConfig.data[methodName]
                    var serverUrl = customConfig.data?.apiUrl?customConfig.data?.apiUrl:customConfig.data?.serverUrl
                    var endPoint = customConfig.data?.endPoint
                  } 
                  //else if (nodeVersion?.toLowerCase() == 'v2') {
    
                  //}
                  let apires: any
                  if (customConfig) {
    
                    var encCredentials = await this.checkEncryption(poNode[j])

                      let internalMappingNodes = poJson?.internalMappingNodes
                      let internalMappedObj = {}            
                      for(let n=0; n< internalMappingNodes.length; n++){
                        if(internalMappingNodes[n].nodeId == poNode[j].nodeId && internalMappingNodes[n].ifo?.length>0){                           
                          for(let f=0; f< internalMappingNodes[n].ifo.length;f++){                           
                            if(internalMappingNodes[n].ifo[f].value){                             
                              internalMappedObj[internalMappingNodes[n].ifo[f].key] = internalMappingNodes[n].ifo[f].value
                            }
                          }
                        } 
                      }
    
                    //console.log("APIinputparam",inputparam)
    
                    if (currentFabric == 'PF-PFD' || currentFabric == 'PF-SFD') {
                      var RCMresult: any = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam, processedKey + upId, currentFabric)
    
                      if (RCMresult) {
                        var zenresult = RCMresult.rule
                        var customcoderesult = RCMresult.code
                      }
                      if (customcoderesult != undefined) {
                        if (customcoderesult && Object.keys(customcoderesult).length > 0) {
                          var codeObj = {}
                          for (let item in customcoderesult) {
                            codeObj[item.toLowerCase()] = customcoderesult[item]
                          }
                        }
                        Object.assign(inputparam, codeObj)
                      }
                    }
    
                    if (internalEdges && internalEdges.hasOwnProperty(poNode[j].nodeId)) {
                      var currentNodeEdge = internalEdges[poNode[j].nodeId]
                      var childInsertArr = []
    
                      if (inputparam && inputparam['childData'] && methodName == 'post') {
    
                        var childData: any = inputparam['childData']
    
                        for (let c = 0; c < childData.length; c++) {
    
                          var mapObj = {}
                          var tempQryVal = []
    
                          for (let e = 0; e < currentNodeEdge.length; e++) {
    
                            let srcHandle = currentNodeEdge[e].sourceHandle
                            let targetHandle = currentNodeEdge[e].targetHandle
                            if (srcHandle) {
                              let srcSplit = srcHandle.split('|')
                              if (srcSplit.includes('HeaderParams')) {
                                var srcVal = srcSplit[1]
                              } else {
                                var srcVal = srcSplit[srcSplit.length - 1]
                              }
                              if (srcVal.includes('.')) {
                                var staticRemove = srcVal.split('.')
                                var sourceFilteredVal = (staticRemove.filter(item => !statickeyword.includes(item)))
                                sourceFilteredVal = sourceFilteredVal.join('.')
                                if (sourceFilteredVal.includes('.') && sourceFilteredVal.startsWith('parameters.')) {
                                  sourceFilteredVal = _.get(parameter, sourceFilteredVal)
                                  // console.log("postresponse",sourceFilteredVal);
    
                                }
                              }
                              else {
                                var sourceFilteredVal = srcVal
                              }
                              //console.log("sourceFilteredVal",sourceFilteredVal);               
                              let connectedid = currentNodeEdge[e].source
                              for (var h = 0; h < poNode.length; h++) {
                                if (connectedid == poNode[h].nodeId) {
                                  var conncectedNodename = poNode[h].nodeName
                                }
                              }
    
    
                              if (targetHandle) {
                                let targetSplit = targetHandle.split('|')
                                if (targetSplit.includes('HeaderParams')) {
                                  var targetVal = targetSplit[1]
                                } else {
                                  var targetVal = targetSplit[targetSplit.length - 1]
                                }
    
                                if (sourceFilteredVal.startsWith('items.')) {
                                  sourceFilteredVal = sourceFilteredVal.replace('items.', '')
                                }
                                sourceFilteredVal = sourceFilteredVal.toLowerCase()
                                sourceFilteredVal = sourceFilteredVal.trim()
                                if (!inputparam[sourceFilteredVal]) {
                                  if (targetVal.includes('requestBody') || targetVal) {
                                    inputparam = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + upId + ':NPV:' + conncectedNodename + '.PRO', '.request',collectionName))
    
                                  } else if (targetVal.includes('responses')) {
                                    inputparam = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + upId + ':NPV:' + conncectedNodename + '.PRO', '.response',collectionName))
                                  }
                                }
    
                                if (targetVal.includes('.')) {
                                  var staticRemove = targetVal.split('.')
                                  var targetFilteredVal = (staticRemove.filter(item => !statickeyword.includes(item)));
                                  //console.log("targetFilteredVal",targetFilteredVal)
                                  targetFilteredVal = targetFilteredVal.join('.')
                                  if (targetFilteredVal.includes('.') && targetFilteredVal.startsWith('parameters.')) {
                                    //targetFilteredVal = targetFilteredVal.replaceAll(',','.')
                                    //var parameter = ndp[poNode[j].nodeId].data[methodName]
                                    //var parameter = customConfig.data[methodName]
                                    targetFilteredVal = _.get(parameter, targetFilteredVal)
                                    tempQryVal.push(targetFilteredVal)
                                    // console.log("postresponsetarget",targetFilteredVal);                       
                                  }
                                  if (inputparam[sourceFilteredVal]) {
                                    mapObj[targetFilteredVal] = inputparam[sourceFilteredVal]
                                  } else if (inputparam['childData'][c][sourceFilteredVal]) {
                                    mapObj[targetFilteredVal] = inputparam['childData'][c][sourceFilteredVal]
                                  }
                                }
                                else {
                                  if (inputparam[sourceFilteredVal]) {
                                    mapObj[targetVal] = inputparam[sourceFilteredVal]
                                  } else if (inputparam['childData'][c][sourceFilteredVal]) {
                                    mapObj[targetFilteredVal] = inputparam['childData'][c][sourceFilteredVal]
                                  }
                                }
                              }
    
                            }
                          }
                          childInsertArr.push(mapObj)
                        }
    
                      } else {
                        var mapObj = {}
                        var tempQryVal = []
                        for (let e = 0; e < currentNodeEdge.length; e++) {
    
                          let srcHandle = currentNodeEdge[e].sourceHandle
                          let targetHandle = currentNodeEdge[e].targetHandle
                          if (srcHandle) {
                            let srcSplit = srcHandle.split('|')
                            if (srcSplit.includes('HeaderParams')) {
                              var srcVal = srcSplit[1]
                            } else {
                              var srcVal = srcSplit[srcSplit.length - 1]
                            }
                            if (srcVal.includes('.')) {
                              var staticRemove = srcVal.split('.')
                              var sourceFilteredVal = (staticRemove.filter(item => !statickeyword.includes(item)))
                              sourceFilteredVal = sourceFilteredVal.join('.')
                              if (sourceFilteredVal.includes('.') && sourceFilteredVal.startsWith('parameters.')) {
                                //var parameter = ndp[poNode[j].nodeId].data[methodName]
                                // var parameter = customConfig.data[methodName]
                                sourceFilteredVal = _.get(parameter, sourceFilteredVal)
                                // console.log("postresponse",sourceFilteredVal);
    
                              }
                            }
                            else {
                              var sourceFilteredVal = srcVal
                            }
                            let connectedid = currentNodeEdge[e].source
                            for (var h = 0; h < poNode.length; h++) {
                              if (connectedid == poNode[h].nodeId) {
                                var conncectedNodename = poNode[h].nodeName
                              }
                            }
    
    
                            if (targetHandle) {
                              let targetSplit = targetHandle.split('|')
                              if (targetSplit.includes('HeaderParams')) {
                                var targetVal = targetSplit[1]
                              } else {
                                var targetVal = targetSplit[targetSplit.length - 1]
                              }
    
                              if (sourceFilteredVal.startsWith('items.')) {
                                sourceFilteredVal = sourceFilteredVal.replace('items.', '')
                              }
                              sourceFilteredVal = sourceFilteredVal.toLowerCase()
                              if (sourceFilteredVal.includes('.items.')) {
                                var spilt = sourceFilteredVal.split('.items.')
                                var getdata = _.get(inputparam, spilt[0])
                                // console.log("getdata",getdata);
                              }
                              if (getdata?.length > 0) {
                                for (let a = 0; a < getdata.length; a++) {
                                  sourceFilteredVal = sourceFilteredVal.replace('.items.', '[' + a + ']')
                                }
                              }
                              //console.log("sourceFilteredVal",sourceFilteredVal)
                              sourceFilteredVal = sourceFilteredVal.trim()
                              var rescheck = _.get(inputparam, sourceFilteredVal)
                              if (rescheck || rescheck == null) {
                                var a = 'y'
                              }
                              if (a != 'y') {
                                if (targetVal.includes('requestBody') || targetVal) {
                                  inputparam = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + upId + ':NPV:' + conncectedNodename + '.PRO', '.request',collectionName))
    
                                } else if (targetVal.includes('responses')) {
                                  inputparam = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + upId + ':NPV:' + conncectedNodename + '.PRO', '.response',collectionName))
                                }
                              }
    
                              if (targetVal.includes('.')) {
                                var staticRemove = targetVal.split('.')
                                var targetFilteredVal = (staticRemove.filter(item => !statickeyword.includes(item)))
                                //console.log("targetFilteredVal",targetFilteredVal)
                                var tempobj = {}
                                targetFilteredVal = targetFilteredVal.join('.')
                                if (targetFilteredVal.includes('.') && targetFilteredVal.startsWith('parameters.')) {
                                  var parameterPathValue = _.get(parameter, targetFilteredVal.replace('.name', '.in'))
                                  // var parameter = customConfig.data[methodName]
                                  tempobj['key'] = _.get(parameter, targetFilteredVal)
                                  tempobj['type'] = parameterPathValue
                                  targetFilteredVal = _.get(parameter, targetFilteredVal)
    
                                  tempQryVal.push(tempobj)
                                }
                                targetFilteredVal = targetFilteredVal.split('.')
                                //  if(targetFilteredVal.startsWith('0.')){
                                //   targetFilteredVal = targetFilteredVal.replaceAll('0.','')
                                //  } 
                                //  if(targetFilteredVal.includes('.0.')){
                                //   targetFilteredVal = targetFilteredVal.replaceAll('.0.','')
                                //  }
                                // console.log("targetFilteredValbefore",targetFilteredVal);
    
                                targetFilteredVal = targetFilteredVal.filter(item => !numberArr.includes(item));
                                // console.log("targetFilteredValafter",targetFilteredVal);
                                targetFilteredVal = targetFilteredVal.join('.')
    
                                if (targetFilteredVal.includes('.items.')) {
                                  targetFilteredVal = targetFilteredVal.replace('.items.', '[0]')
                                }
                                if (mapObj) {
                                  var setdata = _.get(mapObj, targetFilteredVal)
                                  if (setdata?.length) {
                                    targetFilteredVal = targetFilteredVal.replace('[0]', '[' + setdata.length + ']')
                                  }
                                }
    
                                var checkdata = _.get(inputparam, sourceFilteredVal)
                                if (checkdata != null && checkdata != undefined) {
                                  _.set(mapObj, targetFilteredVal, _.get(inputparam, sourceFilteredVal))
                                }
                                // else{
                                //   if(inputparam['childData']){                                 
                                //       if(inputparam['childData'][c][sourceFilteredVal]){
                                //         mapObj[targetFilteredVal] = inputparam['childData'][c][sourceFilteredVal]                             
                                //       }                                
                                //   }
                                // }                      
                              } else {
                                // if(inputparam[sourceFilteredVal]){
                                // mapObj[targetVal] = inputparam[sourceFilteredVal]                             
                                //} 
                                if (checkdata != null && checkdata != undefined) {
                                  _.set(mapObj, targetVal, _.get(inputparam, sourceFilteredVal))
                                }
                              }
                            }
    
                          }
                        }
                         //console.log('mapObj',mapObj);
                      }
    
                    }
    
                    //console.log('MappedNodes', internalMappedObj);

                    //if (mapObj && Object.keys(mapObj).length > 0 && Object.keys(internalMappedObj).length > 0){
                      //mapObj = Object.assign(mapObj, internalMappedObj)
                    //}else if(inputparam && Object.keys(inputparam).length > 0){
                      //inputparam = Object.assign(inputparam, internalMappedObj)
                    //}

                    if (mapObj && Object.keys(mapObj).length > 0) {
                      if (internalMappedObj && Object.keys(internalMappedObj).length > 0) {
                        mapObj = Object.assign(mapObj, internalMappedObj)
                      }
                    } else if (inputparam && internalMappedObj && Object.keys(internalMappedObj).length > 0) {
                      mapObj = Object.assign(inputparam, internalMappedObj)
                    } else {
                      mapObj = inputparam
                    }     
                     
                    //console.log('MAP OBJ',mapObj);

                    if (currentFabric == 'DF-DFD') {
                      // var oprname = customConfig.data?.method.toLowerCase()               
    
                      if (methodName) {
                        // var serverUrl = customConfig.data?.serverUrl  
                        // var endPoint = customConfig.data?.endPoint  
                        var apiUrl = serverUrl + endPoint
    
                        if (methodName == 'get') {
                          if (serverUrl && endPoint) {
    
                            var queryArr = []
                            if (tempQryVal && tempQryVal.length > 0) {
                              for (let t = 0; t < tempQryVal.length; t++) {
                                if (mapObj && mapObj[tempQryVal[t]]) {
                                  queryArr.push(tempQryVal[t] + '=' + mapObj[tempQryVal[t]])
                                }
                              }
                              var queryParam = queryArr.join('&')
                            }
    
                            // console.log('queryParam',queryParam);
    
                            if (endPoint.includes('{') && endPoint.includes('}')) {
                              endPoint = endPoint.replace(/{(.*?)}/g, (_, key) => mapObj[key] || '')
                              apiUrl = serverUrl + endPoint
                            }
    
                            if (queryParam) {
                              apiUrl = apiUrl + '?' + queryParam
                            }
    
                            // console.log('apiUrl',apiUrl);
    
                            var postres = await this.CommonService.getCall(apiUrl)
                            //console.log('postres',postres);
    
                            if (flag != 'N' && postres?.result?.length == 0) {
                              await this.redisService.setStreamData(srcQueue, 'TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus }))
                              // await this.apiService.getTPL(processedKey,upId,poNode[j],'Success',token,currentFabric,sourceStatus,apiUrl,dfoSchema)
                              return { status: 200, targetStatus: targetStatus, data: postres?.result }
                            }
                            else if (postres?.status != 'Success' || postres?.result?.length == 0) {
                              throw 'Data not found'
                            } else if (data && postres?.status == 'Success' && postres?.result?.length > 1) {
                              throw 'Array of data received'
                            }
                            else {
                              apires = postres.result
                            }
                          } else {
                            throw 'Endpoint not found'
                          }
                        }

                        if(filterData && filterData.length > 0){
                          let currentFilterData
                          for(let f=0; f < filterData.length;f++){
                            if(filterData[f].nodeId == poNode[j].nodeId){
                              delete filterData[f].nodeId
                              // filterParams = filterData[f]
                              currentFilterData = filterData[f]
                            }
                          }
                          let currentFilterRes
                          if(currentFilterData && Object.keys(currentFilterData).length > 0){
                            if (Array.isArray(apires) && apires?.length > 0) {
                              currentFilterRes = []
                              for (let a = 0; a < apires.length; a++) {                               
                                for(let item in currentFilterData){
                                  if(apires[a].hasOwnProperty(item) && (apires[a][item] == currentFilterData[item])){
                                    currentFilterRes.push(apires[a])
                                  }
                                }
                              }
                            }else if(apires && Object.keys(apires).length > 0){
                              currentFilterRes = {}
                              for(let item in currentFilterData){
                                if(apires.hasOwnProperty(item) && (apires[item] == currentFilterData[item])){                                 
                                  currentFilterRes = apires
                                }
                              }
                            }       
                            if(currentFilterRes)
                              apires = currentFilterRes                     
                          }
                        }
    
                        var apiarr = []
                        if (filterParams?.length > 0) {
                          for (let k = 0; k < filterParams.length; k++) {
                            var key = filterParams[k].key
                            var value = filterParams[k].value
                            if (key && value && apires?.length > 0) {
                              for (let i = 0; i < apires.length; i++) {
                                if (apires[i][key] == value) {
                                  apiarr.push(apires[i])
                                }
                              }
                            } else if (key && value && apires) {
                              if (apires[key] == value) {
                                apiarr.push(apires)
                              }
                            }
                          }
                          if (apiarr?.length > 0) {
                            apires = apiarr
                          }
                        }
    
                         if(Array.isArray(apires) && page && count){
                              var start = (page - 1) * count;
                                  var end = start + count;
                                  let fillarr = []
                                 for (var i = start; i < end; i++) {
                                   if (apires[i] != null) fillarr.push(apires[i]);
                                   }
                                   apires = fillarr
                           }
                           
                        if (inputparam && Object.keys(inputparam).length > 0) {
                          Object.assign(inputparam, { [poNode[j].nodeName]: apires })
                          var RCMresult: any = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam, processedKey + upId, currentFabric)
                        }
                        else {
                          await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(apires),collectionName, 'customResponse')
                          var RCMresult: any = await this.CommonService.getRuleCodeMapper(poNode[j], apires, processedKey + upId, currentFabric)
                        }
                        if (RCMresult) {
                          var zenresult = RCMresult.rule
                          var customcoderesult = RCMresult.code
                        }
                        if (customcoderesult != undefined) {
                          Object.assign(apires, customcoderesult)
                        }
                      }
    
                      if (upId) {
                        await this.redisService.setStreamData(srcQueue, 'TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus }))
                        if (apires)
                          await this.CommonService.getTPL(processedKey, upId,  poNode[j], 'Success', token, currentFabric, sourceStatus, apiUrl, apires)
                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(apiUrl),collectionName, 'request')
                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(apires),collectionName, 'response')
                      }
    
                    } else if (currentFabric == 'PF-PFD' || currentFabric == 'PF-SFD') {                 
                      let tokenDecode = await this.jwtService.decode(token, { json: true })   
                      var emaildecode= await this.CommonService.MyAccountForClient(token)           
                    
                      var apiUrl = serverUrl + endPoint
                      if (methodName) {
                        if (methodName == 'get') {                     
                          if (apiUrl) {
                             let headarr = {},qryarr = [],patharr = []
                            if (tempQryVal && tempQryVal.length > 0) {
                                for (let t = 0; t < tempQryVal.length; t++) {
                                  if (mapObj && mapObj[tempQryVal[t]['key']]) {                               
                                     if(tempQryVal[t]['type'] == 'header'){
                                       headarr[(tempQryVal[t]['key'] )] =  mapObj[tempQryVal[t]['key']]
                                    }
                                    if (tempQryVal[t]['type'] == 'query') {
                                      qryarr.push(tempQryVal[t]['key'] + '=' + mapObj[tempQryVal[t]['key']])
                                    } if (tempQryVal[t]['type'] == 'path') {
                                      patharr.push(mapObj[tempQryVal[t]['key']])
                                    }
                                  }
                                  var queryparam,pathParam
                                  if (tempQryVal[t]['type'] == 'query') {
                                    queryparam = qryarr.join('&')
                                  } if (tempQryVal[t]['type'] == 'path') {
                                    pathParam = mapObj[tempQryVal[t]['key']]
                                  }
                                  
                                  if (pathParam )
                                     apiUrl = apiUrl.replace('{' + tempQryVal[t]['key'] + '}', pathParam) 
                                }
                                
                                  if(queryparam)
                                    apiUrl = apiUrl + '?' + queryparam  
                              }
                              console.log("getapiurl",apiUrl)
                              headarr['Authorization'] = `Bearer ${token}`
                              //console.log("headarr",headarr);
                              
                           const requestConfig: AxiosRequestConfig = {
                              headers: headarr
                            };
                            var apiResult = await this.CommonService.getCall(apiUrl,requestConfig)
                            //console.log("apiResult",apiResult);
                            
                              if(apiResult.statusCode == 201 || apiResult.statusCode == 200){
                                apiResult = apiResult?.result
                              }else{
                                throw apiResult
                              }                      
                           
                          } else {
                            throw 'API Endpoint does not exist'
                          }
                        } else if (methodName == 'post') {
                          if (apiUrl) {
                             let headarr = {},qryarr = [],patharr = []
                             if (tempQryVal && tempQryVal.length > 0) {
                                for (let t = 0; t < tempQryVal.length; t++) {
                                  if (mapObj && mapObj[tempQryVal[t]['key']]) {                               
                                     if(tempQryVal[t]['type'] == 'header'){
                                       headarr[(tempQryVal[t]['key'] )] =  mapObj[tempQryVal[t]['key']]
                                    }
                                    if (tempQryVal[t]['type'] == 'query') {
                                      qryarr.push(tempQryVal[t]['key'] + '=' + mapObj[tempQryVal[t]['key']])
                                    } if (tempQryVal[t]['type'] == 'path') {
                                      patharr.push(mapObj[tempQryVal[t]['key']])
                                    }
                                  }
                                  var queryparam,pathParam
                                  if (tempQryVal[t]['type'] == 'query') {
                                    queryparam = qryarr.join('&')
                                  } if (tempQryVal[t]['type'] == 'path') {
                                    pathParam = mapObj[tempQryVal[t]['key']]
                                  }
                                  
                                  if (pathParam )
                                     apiUrl = apiUrl.replace('{' + tempQryVal[t]['key'] + '}', pathParam) 
                                }
                                
                                  if(queryparam)
                                    apiUrl = apiUrl + '?' + queryparam  
                              }                          
                              headarr['Authorization'] = `Bearer ${token}`                         
                           const requestConfig: AxiosRequestConfig = {
                              headers: headarr
                            };
                            if(mapObj && Object.keys(mapObj).length > 0){                              
                              if (childInsertArr?.length > 0) {
                                var apichildResult: any = []
                                for (let r = 0; r < childInsertArr.length; r++) {
                                  mapObj = childInsertArr[r]
                                  mapObj['trs_status'] = sourceStatus
                                  mapObj['trs_process_id'] = upId
                                  mapObj['trs_created_by'] = tokenDecode?.loginId
                                  mapObj['trs_access_profile'] = tokenDecode?.selectedAccessProfile
                                  mapObj['trs_org_grp_code'] = tokenDecode?.orgGrpCode
                                  mapObj['trs_org_code'] = tokenDecode?.orgCode
                                  mapObj['trs_role_grp_code'] = tokenDecode?.roleGrpCode
                                  mapObj['trs_role_code'] = tokenDecode?.roleCode
                                  mapObj['trs_ps_code'] = tokenDecode?.psCode
                                  mapObj['trs_ps_grp_code'] = tokenDecode?.psGrpCode
                                  mapObj['trs_creator_email'] = emaildecode?.email
                                  //console.log('apiobj',mapObj);
                                  await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(mapObj),collectionName, 'request')
                                  //var apiResult = await this.CommonService.postCall(apiUrl,mapObj,requestConfig)  
                                  if (encCredentials?.selectedDpd && encCredentials?.encryptionMethod) {
      
                                    // encCredentials.selectedDpd = 'CK:CT071:FNGK:AF:FNK:CDF-DPD:CATK:AG001:AFGK:A001:AFK:extDPD:AFVK:v1'
      
                                    mapObj = await this.CommonService.commonEncryption(encCredentials.selectedDpd, encCredentials.encryptionMethod, mapObj, 'secretkey')
      
                                    //console.log('EncryptedData',mapObj);
                                    var EncryptedRqst: any = mapObj
      
                                    var EncapiResult = await this.CommonService.postCall(apiUrl, { data: mapObj }, requestConfig)
                                    //console.log('EncryptedResult',EncapiResult);
      
                                    var DecapiResult = await this.CommonService.commondecryption(encCredentials.selectedDpd, encCredentials.encryptionMethod, EncapiResult.result, 'secretkey')
                                    //console.log('DecryptedResult',JSON.parse(DecapiResult));
      
                                    apiResult = JSON.parse(DecapiResult)
                                  } else {
                                    var apiResult = await this.CommonService.postCall(apiUrl, mapObj, requestConfig)
                                    //console.log('apiResult',apiResult);
                                    apiResult = apiResult.result
                                  }
                                                             
                                  apichildResult.push(apiResult.result)
                                }
                                //apiResult = apichildResult
                                //console.log('postapiResult',JSON.stringify(apiResult));
                              } else {
                                mapObj['trs_status'] = sourceStatus
                                mapObj['trs_process_id'] = upId
                                mapObj['trs_created_by'] = tokenDecode?.loginId
                                mapObj['trs_access_profile'] = tokenDecode?.selectedAccessProfile
                                mapObj['trs_org_grp_code'] = tokenDecode?.orgGrpCode
                                mapObj['trs_org_code'] = tokenDecode?.orgCode
                                mapObj['trs_role_grp_code'] = tokenDecode?.roleGrpCode
                                mapObj['trs_role_code'] = tokenDecode?.roleCode
                                mapObj['trs_ps_code'] = tokenDecode?.psCode
                                mapObj['trs_ps_grp_code'] = tokenDecode?.psGrpCode
                                mapObj['trs_creator_email'] = emaildecode?.email                        
                                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(mapObj),collectionName, 'request')
                                if (encCredentials?.selectedDpd && encCredentials?.encryptionMethod) {
                                  mapObj = await this.CommonService.commonEncryption(encCredentials.selectedDpd, encCredentials.encryptionMethod, mapObj, 'secretkey')                          
                                  var EncryptedRqst: any = mapObj
                                  var EncapiResult = await this.CommonService.postCall(apiUrl, { data: mapObj }, requestConfig)                           
                                  var DecapiResult = await this.CommonService.commondecryption(encCredentials.selectedDpd, encCredentials.encryptionMethod, EncapiResult.result, 'secretkey')
                               
                                  apiResult = JSON.parse(DecapiResult)
                                } else {
                                  var apiResult = await this.CommonService.postCall(apiUrl, mapObj, requestConfig)                           
                                  //apiResult = apiResult.result
                                }                                          
                                if(apiResult.statusCode == 201 || apiResult.statusCode == 200){
                                  apiResult = apiResult?.result
                                }else{
                                  throw apiResult
                                }  
                                                   
                              }
                            }else{
                              throw `Mapping was required in ${poNode[j].nodeName}`
                            }
                          }
                          else {
                            throw 'API Endpoint does not exist'
                          }
                        } else if (methodName == 'patch') {
                          if (serverUrl && endPoint) {
                            const requestConfig: AxiosRequestConfig = {
                              headers: {
                                Authorization: `Bearer ${token}`
                              }
                            };
                            if (mapObj && Object.keys(mapObj).length > 0) {
                              mapObj['trs_status'] = sourceStatus
                              mapObj['trs_modified_by'] = tokenDecode?.loginId
                              mapObj['trs_process_id'] = upId
                            } else {
                              throw 'MappingObject is empty'
                            }
                            await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(mapObj),collectionName, 'request')
                            endPoint = endPoint.replace(/{(.*?)}/g, (_, key) => mapObj[key] || '')
                            if (tempQryVal?.length > 0) {
                              for (let t = 0; t < tempQryVal.length; t++) {                        
                                if (mapObj[tempQryVal[t]['key']]) {
                                  delete mapObj[tempQryVal[t]['key']]
                                }
                              }
                            }
                            
                            if (encCredentials?.selectedDpd && encCredentials?.encryptionMethod) {
                              mapObj = await this.CommonService.commonEncryption(encCredentials.selectedDpd, encCredentials.encryptionMethod, mapObj, 'secretkey')                        
                              var EncryptedRqst: any = mapObj
                              var EncapiResult = await this.CommonService.patchCall(serverUrl + endPoint, { data: mapObj }, requestConfig)                         
                              var DecapiResult = await this.CommonService.commondecryption(encCredentials.selectedDpd, encCredentials.encryptionMethod, EncapiResult.result, 'secretkey')
                            
                              apiResult = JSON.parse(DecapiResult)
                            } else {
                              var apiResult = await this.CommonService.patchCall(serverUrl + endPoint, mapObj, requestConfig)                         
                              apiResult = apiResult.result
                            }                       
                          }
                          else {
                            throw 'API Endpoint does not exist'
                          }
                        }
                      } else {
                        throw 'Method name not found'
                      }
                      await this.redisService.setStreamData(srcQueue, 'TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus }))
                      await this.redisService.setStreamData(targetQueue, 'TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus }))
    
                      //var apiRes = apiResult
                      // var RCMresult: any = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam,processedKey+upId,currentFabric)
                      // if (RCMresult) {
                      //   var zenresult = RCMresult.rule
                      //   var customcoderesult = RCMresult.code
                      // }
                      // if(customcoderesult != undefined){
                      //   Object.assign(apiResult,customcoderesult)
                      // }       
                        
                       let apiResults = apiResult
                      if (routearr.length > 0) {
                        for (var z = 0; z < routearr.length; z++) {
                          if (routearr[z].nodeName != 'End') {
                            if (EncryptedRqst) {
                              await this.redisService.setJsonData(processedKey + upId + ':NPV:' + routearr[z].nodeName + '.PRO', JSON.stringify(EncryptedRqst),collectionName, 'request')
                            }
                            else if (apiResult) {
                              if (Array.isArray(apiResult)) {
                                apiResult = Object.assign(inputparam, apiResult[0])
                              } else if (Object.keys(apiResult).length > 0) {
                                apiResult = Object.assign(inputparam, apiResult)
                              }
                              await this.redisService.setJsonData(processedKey + upId + ':NPV:' + routearr[z].nodeName + '.PRO', JSON.stringify(apiResult),collectionName, 'request')
                            }
                            else
                              await this.redisService.setJsonData(processedKey + upId + ':NPV:' + routearr[z].nodeName + '.PRO', JSON.stringify(inputparam),collectionName, 'request')
                          }
                        }
                      }
                      if (EncapiResult?.result) {
                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(EncapiResult?.result),collectionName, 'response')
                        await this.CommonService.getTPL(processedKey, upId,  poNode[j], 'Success', token, currentFabric, sourceStatus, EncryptedRqst, EncapiResult?.result)
    
                      } else {
                        await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(apiResults),collectionName, 'response')
                        if (apiResult && (Object.keys(apiResult).length > 0 || Array.isArray(apiResult)))
                          await this.CommonService.getTPL(processedKey, upId,  poNode[j], 'Success', token, currentFabric, sourceStatus, inputparam, apiResult)
                      }
    
                      apires = apiResult
                    }
                  }
    
                  this.logger.log('Api node completed')
                  return { status: 200, targetStatus: targetStatus, data: apires }
                  // return targetStatus
                } catch (error) {
                  await this.CommonService.getTPL(processedKey, upId,  poNode[j], 'Failed', token, currentFabric, sourceStatus, inputparam, error)
    
                  await this.redisService.setStreamData(failureQueue, 'TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": failureTargetStatus }))
                  throw error
                }
              }

          //Ext-API Node
          if (nodeType == "external_api_node" && poNode[j].nodeId == nodeId) {
            try {
              this.logger.log('Ext-Api node Started')            
              let extApiConfig: any =JSON.parse(await this.redisService.getJsonDataWithPath(key + 'NDP','.' + poNode[j].nodeId,collectionName));                 
              if(extApiConfig){
                let nodeVersion = extApiConfig?.nodeVersion
                if(!nodeVersion) throw 'Node version not found'
                let ndpPro,extMethod,extUrl,extHeader,extQuery,extBody,extAuth,extToken,extApiKey,addTo,headerObj,queryArr

                if (nodeVersion?.toLowerCase() == 'v1') {
                  ndpPro = extApiConfig?.data?.pro
                  extMethod = ndpPro.method
                  extUrl = ndpPro.url
                  extHeader = ndpPro.header?.headerParams?.items
                  extQuery =  ndpPro.queryParams?.items
                  extBody = ndpPro.body
                  extAuth = ndpPro.header?.Authorization
                  extToken = extAuth?.BearerToken
                  extApiKey = extAuth?.APIKey
                  addTo = extApiKey?.addTo?.value
                  headerObj = {}
                  queryArr = []
                }
                if(!extUrl) throw 'URL not found'
                let extApiResponse
                
                if(extHeader?.length>0){                
                  for(let h=0;h< extHeader.length;h++){
                    headerObj[extHeader[h]['key']] = extHeader[h]['value']
                  }
                }             

                if(extQuery?.length>0){                
                  for(let h=0;h< extQuery.length;h++){
                    queryArr.push([extQuery[h]['key']] + '=' + extQuery[h]['value'])                  
                  }
                }

                if(extToken){
                  headerObj['Authorization'] = `Bearer ${extToken}`
                }else if(extApiKey){
                  if(addTo == "Header"){
                    headerObj[extApiKey['key']] = extApiKey['value']
                  }else {
                    // queryObj[extApiKey['key']] = queryObj['value']
                    queryArr.push([extApiKey['key']] + '=' + extApiKey['value'])  
                  }                
                }
              
                let queryParam =  queryArr.join('&')
                if (queryParam) {
                  extUrl = extUrl + '?' + queryParam
                }             

                let requestConfig: AxiosRequestConfig = {
                  headers: headerObj,
                };                
                              
                if(extMethod.toLowerCase() == 'get'){
                  extApiResponse = await this.CommonService.getCall(extUrl,requestConfig)
                }
                if(extMethod.toLowerCase() == 'post'){
                  let payload = extBody?.raw
                  if(payload){
                    if(extBody?.options?.raw?.language == 'json'){
                      if(typeof payload == 'string')
                        payload = JSON.parse(payload)
                    }
                     extApiResponse = await this.CommonService.postCall(extUrl,requestConfig)
                  }                 
                }
                console.log('extApiResponse',extApiResponse.result);    
                let extres = extApiResponse.result
                if(extres && Array.isArray(extres)){
                  if (flag != 'N' && extres?.length == 0) {
                    await this.redisService.setStreamData(srcQueue, 'TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus }))

                    return { status: 200, targetStatus: targetStatus, data: extres }
                  }
                  else if (extApiResponse?.status != 'Success' || extres?.length == 0) {
                    throw 'Data not found'
                  } else if (data && extApiResponse?.status == 'Success' && extres?.length > 1) {
                    throw 'Array of data received'
                  }                
                }else if(typeof extres == 'object' && Object.keys(extres).length>0){
                  if (flag != 'N' && Object.keys(extres).length == 0) {
                    await this.redisService.setStreamData(srcQueue, 'TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus }))

                    return { status: 200, targetStatus: targetStatus, data: extres }
                  }
                  else if (extApiResponse?.status != 'Success' || Object.keys(extres).length == 0) {
                    throw 'Data not found'
                  }   
                }             

                if (inputparam && Object.keys(inputparam).length > 0) {
                    Object.assign(inputparam, { [poNode[j].nodeName]: extres })
                    var RCMresult: any = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam, processedKey + upId, currentFabric)
                  }
                  else {
                    var RCMresult: any = await this.CommonService.getRuleCodeMapper(poNode[j], extres, processedKey + upId, currentFabric)
                  }

                  if (RCMresult) {
                    var zenresult = RCMresult.rule
                    var customcoderesult = RCMresult.code
                  }
                  if (customcoderesult != undefined) {
                    Object.assign(extres, customcoderesult)
                  }

                  if (upId) {
                    await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus }))
                    await this.CommonService.getTPL(processedKey, upId,  poNode[j], 'Success', token, currentFabric, sourceStatus, extUrl, extres)
                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(extUrl),collectionName, 'request')
                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(extres),collectionName, 'response')
                  }

                this.logger.log('Ext-Api node Completed')
                return { status: 200, targetStatus: targetStatus, data: extres }
              }            

            }catch (error) {
               console.log(error);
              // await this.CommonService.getTPL(processedKey,upId,poNode[j],'Failed',token,currentFabric,sourceStatus,inputparam,error)              
              await this.redisService.setStreamData(failureQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": failureTargetStatus }))
              throw error
            }
          }

        //AutomationNode
          if(nodeType == 'automationnode' && poNode[j].nodeId == nodeId){
            try {                
              this.logger.log('Automation Node Started') 
              var RCMresult:any = await this.CommonService.getRuleCodeMapper(poNode[j],inputparam,processedKey + upId,currentFabric)                
              let zenresult = RCMresult.rule
              let customcoderesult = RCMresult.code 
              if(customcoderesult != undefined){
                var response = Object.assign(request,customcoderesult)
              }  
              
              var data = JSON.parse(await this.redisService.getJsonDataWithPath(key+'NDP','.'+poNode[j].nodeId+'.data',collectionName))   
              var tokenDecode = await this.CommonService.MyAccountForClient(token)
              var streamName = data.streamName 
            // if(tokenDecode?.email){
//               //inputparam = Object.assign(inputparam,{"email":tokenDecode.email})
//              // inputparam['email'] = tokenDecode.email
//             // }else{
//               //throw 'email not found in token'
//              //}
              var res = await this.redisService.setStreamData(streamName,upId,JSON.stringify(inputparam))            
             
              await this.redisService.setStreamData(srcQueue,collectionName + '-TASK - '+upId,JSON.stringify({"PID":upId,"TID":nodeId,"EVENT":targetStatus}))
              await this.redisService.setStreamData(targetQueue,collectionName + '-TASK - '+upId,JSON.stringify({"PID":upId,"TID":nodeId,"EVENT":targetStatus}))
              if(response){
                var res = Object.assign(response,res)
              }
              await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(res),collectionName,'response')
              if(routearr.length>0){
                for(var z=0;z < routearr.length;z++){ 
                  if(routearr[z].nodeName != 'End'){                    
                    if(response)              
                      await this.redisService.setJsonData(processedKey + upId + ':NPV:' + routearr[z].nodeName + '.PRO', JSON.stringify(response),collectionName, 'request')
                    else
                      await this.redisService.setJsonData(processedKey + upId + ':NPV:' + routearr[z].nodeName + '.PRO', JSON.stringify(inputparam),collectionName, 'request')
                  }
                }
              }
              //await this.CommonService.getTPL(processedKey,upId,poNode[j],'Success',token,currentFabric,sourceStatus,inputparam,{"PID":upId,"TID":nodeId,"EVENT":targetStatus})
              if(res)
              await this.CommonService.getTPL(processedKey,upId,poNode[j],'Success',token,currentFabric,sourceStatus,inputparam,res)
              this.logger.log('Api node completed') 
              return {status:200, targetStatus: targetStatus}  
              // return targetStatus
            } catch (error) {
             // await this.CommonService.getTPL(processedKey,upId,poNode[j],'Failed',token,currentFabric,sourceStatus,inputparam,error)
            
              await this.redisService.setStreamData(failureQueue,collectionName + '-TASK - '+upId,JSON.stringify({"PID":upId,"TID":nodeId,"EVENT":failureTargetStatus}))
              throw error
            }
          }

        //DB Node
      if (nodeType == 'dbnode' && poNode[j].nodeId == nodeId) {
          try {
            this.logger.log('DB node Started')

            let dbres: any, qryres: any
            var customConfig: any = JSON.parse(await this.redisService.getJsonDataWithPath(key + 'NDP', '.' + poNode[j].nodeId,collectionName))
            let nodeVersion = customConfig?.nodeVersion
            
            if(!nodeVersion) throw 'Node version not found'

            if (nodeVersion.toLowerCase() == 'v1') {
              var oprname: any = customConfig.data?.pro?.operationName?.value;
              var oprkey = Object.keys(customConfig.data.pro);
              var tablename = customConfig.data?.pro?.tableName;
              if(oprname == 'select'){
                var selcol = customConfig.data?.pro[oprname]?.selectColumns.items;
                var filterParams = customConfig.data?.pro[oprname]?.filterParams?.items;
              }
              var manualQuery = customConfig.data?.pro?.manualQuery
              if(oprname == 'insert'){
                var insertParams = customConfig.data?.pro[oprname]?.insertParams?.items
              }
            } 
            //else if (nodeVersion.toLowerCase() == 'v2') {

            //}
            if (customConfig) {

              var dbUrl = process.env.DATABASE_URL
              if (!dbUrl) throw 'DB url not found'

              const { Client } = pg
              var client = new Client({
                connectionString: dbUrl,
                // host: dbconfig.basic.host,
                // port: dbconfig.basic.port,
                // user: dbconfig.basic.userName,
                // password: dbconfig.basic.password,
                // database: dbconfig.basic.databaseName,
              });
              if (!oprname) {
                oprname = 'select'
              }

              var schemaname = process.env.DATABASE_URL.split('schema=')[1]

              if (oprname && oprkey.includes(oprname)) {

                if (oprname == 'select') {
                  //var filval = customConfig.data?.pro[oprname]?.filterValues.items
                  if (selcol && selcol.length > 0) {
                    var selcolumns = selcol.join(',');
                  }
                  let str = []

                  if (filterParams?.length > 0) {
                    for (let i = 0; i < filterParams.length; i++) {
                      var filcol = filterParams[i].key
                      var filval = filterParams[i].value
                      var operator = filterParams[i].operator
                      //strobj[filcol = filval]
                      str.push(filcol + '=' + filval)
                      if (operator)
                        var Querystr = str.join(operator)
                    }
                  }
                  if (inputparam && Object.keys(inputparam).length > 0) {
                    if (inputparam) {
                      var data = inputparam.data
                    }
                  }


                  var qry
                  if (manualQuery) {
                    qry = manualQuery

                    let SessionToken = await this.jwtService.decode(token, { json: true })
                    var emailDecode = await this.CommonService.MyAccountForClient(token)
                    // console.log('SessionToken',SessionToken); 

                    if (qry.endsWith(';')) {
                      qry = qry.slice(0, -1);
                    }
                     if(page && count){
                      const cleanedQuery = qry.trim();
                      if (/limit\s+\d+/i.test(cleanedQuery)) {
                         throw new Error('LIMIT clause detected. Please do not include it.');
                      }                     
                        qry = `${cleanedQuery} LIMIT ${count} OFFSET ${offset}`;
                      }
                     
                      let formKey:any = ``
                      if(filterData && filterData.length){
                      for (let f = 0; f < filterData.length; f++) {
                      if (filterData[f].nodeId && filterData[f].nodeId==poNode[j].nodeId) {
                       const { nodeId, ...filterParamsObj } = filterData[f]; // ✅ fix here
                       const filterParamsObjKey = Object.keys(filterParamsObj);
                       const filterParamsObjvalues = Object.values(filterParamsObj);
                        for(let p=0; p < filterParamsObjKey.length; p++){
                           const key = filterParamsObjKey[p];
                           const value = filterParamsObjvalues[p];
                            if(typeof value == 'number'){
                              formKey = formKey+` ${key} = ${value} AND` 
                             
                            }
                            else if(typeof value == 'string'){
                              formKey = formKey+` ${key} = '${value}' AND` 
                            }
                          }
                       }}

                    if (formKey.endsWith(' AND')) {
                      formKey = formKey.slice(0, -4); 
                    }}
                  if (SessionToken?.dap && SessionToken?.dap != 'f') {
                  if(formKey){
                      var del = `trs_org_grp_code = '${SessionToken?.orgGrpCode}' AND trs_org_code = '${SessionToken?.orgCode}' AND trs_role_grp_code= '${SessionToken?.roleGrpCode}' AND trs_role_code= '${SessionToken?.roleCode}' AND trs_ps_grp_code= '${SessionToken?.psGrpCode}' AND trs_ps_code= '${SessionToken?.psCode}' AND
                               trs_access_profile= '${SessionToken?.selectedAccessProfile}' AND trs_created_by= '${SessionToken?.loginId}' AND ${formKey}` //
                    qry = await this.appendWhereClause(qry, del);
                  }
                  else{
                      var del = `trs_org_grp_code = '${SessionToken?.orgGrpCode}' AND trs_org_code = '${SessionToken?.orgCode}' AND trs_role_grp_code= '${SessionToken?.roleGrpCode}' AND trs_role_code= '${SessionToken?.roleCode}' AND trs_ps_grp_code= '${SessionToken?.psGrpCode}' AND trs_ps_code= '${SessionToken?.psCode}' AND
                               trs_access_profile= '${SessionToken?.selectedAccessProfile}' AND trs_created_by= '${SessionToken?.loginId}'` //
                    qry = await this.appendWhereClause(qry, del);
                  }
                }
                else{
                  if(formKey){
                   qry = await this.appendWhereClause(qry,formKey)
                  } 
                }

                  } else {

                    if (!schemaname || !tablename) {
                      throw `Schema Name/Table Name not found`
                    }

                    if (selcol && selcol.length == 0)
                         //qry = 'select * from "' + schemaname + '".' + tablename + ' LIMIT '+page +' OFFSET '+offset
                      qry = `select * from "${schemaname}".${tablename} LIMIT ${page} OFFSET ${offset}`
                    else if (Querystr) {
                         qry = 'select ' + selcolumns + ' from "' + schemaname + '".' + tablename + ' where ' + Querystr + ' LIMIT '+page +' OFFSET '+offset
                       }
                       else {
                         qry = 'select ' + selcolumns + ' from "' + schemaname + '".' + tablename+ ' LIMIT '+page +' OFFSET '+offset
                       }

                    if (qry)
                      await this.redisService.setJsonData(key + 'NDP', JSON.stringify(qry),collectionName, poNode[j].nodeId + '.data.pro.autoQuery')
                  }
                } else if (oprname == 'insert') {
                  let insertcolumns = []
                  let insertvalues = []
                  if (insertParams?.length > 0) {
                    for (let j = 0; j < insertParams.length; j++) {
                      var inscol = insertParams[j].key
                      var insval = insertParams[j].value
                      insertcolumns.push(inscol)
                      // insertcolumns= insertcolumns.join(',');
                      insertvalues.push(insval)
                    }
                  }
                  if (insertvalues?.length > 0) {
                    var insertval = insertvalues.join(',')
                  }
                  if (insertcolumns?.length > 0) {
                    var insertcol = insertcolumns.join(',')
                  }
                  qry = 'insert into "' + schemaname + '".' + tablename + ' (' + insertcol + ') values (' + insertval + ')'
                } else {
                  throw 'Invalid Operation Name'
                }

                await client.connect()
                if (qry)
                  qryres = await client.query(qry)
                if (qryres)
                  dbres = qryres.rows

                if (flag != 'N' && dbres?.length == 0) {
                  await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus }))
                  await this.CommonService.getTPL(processedKey, upId,  poNode[j], 'Success', token, currentFabric, sourceStatus, qry, dfoSchema)
                  return { status: 200, targetStatus: targetStatus, data: dbres }
                }
                else if (!dbres || dbres?.length == 0) {
                  throw 'No Records Found'
                }
                await client.end()
                if (inputparam && Object.keys(inputparam).length > 0) {
                  Object.assign(inputparam, { [poNode[j].nodeName]: dbres })
                  var RCMresult: any = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam, processedKey + upId, currentFabric)
                }
                else {
                  var RCMresult: any = await this.CommonService.getRuleCodeMapper(poNode[j], dbres, processedKey + upId, currentFabric)
                }

                if (RCMresult) {
                  var zenresult = RCMresult.rule
                  var customcoderesult = RCMresult.code
                }
                if (customcoderesult != undefined) {
                  Object.assign(dbres, customcoderesult)
                }

                if (upId) {
                  await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus }))
                  await this.CommonService.getTPL(processedKey, upId,  poNode[j], 'Success', token, currentFabric, sourceStatus, qry, dbres)
                  await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(qry),collectionName, 'request')
                  await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(dbres),collectionName, 'response')
                }

                this.logger.log("DB Node execution completed")
                return { status: 200, targetStatus: targetStatus, data: dbres }
              } else {
                throw 'Operation name not found'
              }
            }
          } catch (error) {
            // await this.CommonService.getTPL(processedKey,upId,poNode[j],'Failed',token,currentFabric,sourceStatus,inputparam,error)              
            await this.redisService.setStreamData(failureQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": failureTargetStatus }))
            throw error
          }
        }

        // Mongo DB node
       if (nodeType == 'mongo-dbnode' && poNode[j].nodeId == nodeId) {
          try {
            this.logger.log(`${poNode[j].nodeName},Mongo DB Node started`);

            var customConfig: any = JSON.parse(await this.redisService.getJsonDataWithPath(key + 'NDP', '.' + poNode[j].nodeId,collectionName));
            let collnName, manualQryType, manualQry

            let nodeVersion = customConfig?.nodeVersion
            
            if(!nodeVersion) throw 'Node version not found'

            if (nodeVersion.toLowerCase() == 'v1') {
              collnName = customConfig?.data?.pro?.collectionName
              manualQryType = customConfig?.data?.pro?.manualQueryType?.value
              manualQry = customConfig?.data?.pro?.manualQueryType?.manualQuery             
            } 
            if (customConfig) {
              let mongoQry, mongoDbarr

              if (!process.env.DATABASE_URL) throw 'Mongo DB url not found'

              const client = new MongoClient(process.env.DATABASE_URL);
              client.connect()
                .then(() => {
                  console.log('Connected to the database successfully!');
                })
                .catch((err) => {
                  console.error('Error connecting to the database:', err);
                });

              let db = client.db()

              this.logger.log('CollectionName', collnName)
              this.logger.log('ManualQry', manualQry)

              if (manualQry) {
   
                   if (!collnName || !manualQryType) throw 'Collection Name/Manual Query Type not found'
   
                   if (filterData && Array.isArray(filterData) && filterData.length>0) {
                    filterData.forEach((filterObj) => {
                    
                      const entries = Object.entries(filterObj).filter(([key]) => key !== "nodeId");
                      
                      entries.forEach(([key, value]) => {
                        const regex = new RegExp(`"\\$${key}"`, "g");
                       
                        manualQry = manualQry.replace(regex, `"${value}"`);
                      });
                    });
                  }

                   const FormatFn = new Function(`return ${manualQry}`);
                   let result = FormatFn();
                   manualQry = Array.isArray(result) ? result : [result];
   
                   if (manualQryType == 'aggregate') {
                     if (!Array.isArray(manualQry)) throw "Invalid aggregation format"
                    if(page && count){
                      mongoDbarr = await db.collection(collnName).aggregate(manualQry).skip(offset).limit(count).toArray();
                    }else{
                      mongoDbarr = await db.collection(collnName).aggregate(manualQry).toArray();
                    }
                     
                   } else {
                    
                     var execResponse = await db.collection(collnName)[manualQryType](manualQry)
   
                     if (execResponse) {
                      if(page && count){
                       mongoDbarr = typeof execResponse.toArray === 'function' ? await execResponse.skip(offset).limit(count).toArray() : execResponse;
                      }else{
                        mongoDbarr = typeof execResponse.toArray === 'function' ? await execResponse.toArray() : execResponse;
                      }
                     }
                   }

                      
   
                   this.logger.log('QueryResponse', mongoDbarr)
   
                   if (flag != 'N' && (mongoDbarr?.length == 0 || Object.keys(mongoDbarr).length == 0)) {                 
                     await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus }))
                     await this.CommonService.getTPL(processedKey, upId,  poNode[j], 'Success', token, currentFabric, sourceStatus, mongoQry, mongoDbarr)
                     return { status: 200, targetStatus: targetStatus, data: mongoDbarr }
                   } else if (!mongoDbarr || mongoDbarr?.length == 0 || Object.keys(mongoDbarr).length == 0) {
                     await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus }))
                     // await this.CommonService.getTPL(processedKey, upId,  poNode[j], 'Success', token, currentFabric, sourceStatus, mongoQry, mongoDbarr)
                     throw 'No Records Found'
                   }
                 }

              if (inputparam && Object.keys(inputparam).length > 0) {
                Object.assign(inputparam, { [poNode[j].nodeName]: mongoDbarr })
                var RCMresult: any = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam, processedKey + upId, currentFabric)
              }
              else {
                var RCMresult: any = await this.CommonService.getRuleCodeMapper(poNode[j], mongoDbarr, processedKey + upId, currentFabric)
              }
              if (RCMresult) {
                var zenresult = RCMresult.rule
                var customcoderesult = RCMresult.code
              }
              if (customcoderesult != undefined) {
                Object.assign(mongoDbarr, customcoderesult)
              }
              if (upId) {                                 
                let res = await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus }))
               
                await this.CommonService.getTPL(processedKey, upId,  poNode[j], 'Success', token, currentFabric, sourceStatus, manualQry, mongoDbarr)
                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(manualQry),collectionName, 'request')
                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(mongoDbarr),collectionName, 'response')
              }
              this.logger.log('Mongo DB Node execution completed');
              return { status: 200, targetStatus: targetStatus, data: mongoDbarr }
              //nodeid = dfjson[i].routeArray[0].nodeId;
            }
          } catch (error) {
            console.log("error", error);
            await this.CommonService.getTPL(processedKey, upId,  poNode[j], 'Failed', token, currentFabric, sourceStatus, inputparam, error)
            await this.redisService.setStreamData(failureQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": failureTargetStatus }))
            throw error
          }
        }
          
      //ext-dbNode
         if(nodeType == 'ext-dbnode' && poNode[j].nodeId == nodeId){
            try {
              this.logger.log('EXT-DB node Started')
             
              let dbres: any, qryres: any              
              var customConfig: any = JSON.parse(await this.redisService.getJsonDataWithPath(key + 'NDP', '.' + poNode[j].nodeId,collectionName))
              let nodeVersion = customConfig?.nodeVersion

              if(!nodeVersion) throw 'nodeVersion not found'
              
              if (nodeVersion.toLowerCase() == 'v1') {
                var dpdkey = customConfig?.data?.connector?.value
                var conncectorname = customConfig?.data?.connector?.subSelection?.value
                var oprname: any = customConfig.data?.pro?.operationName?.value
                var oprkey = Object.keys(customConfig.data.pro)
                var tablename = customConfig.data?.pro?.tableName;
                if(oprname == 'select'){
                  var selcol = customConfig.data?.pro[oprname]?.selectColumns.items
                  var filterParams = customConfig.data?.pro[oprname]?.filterParams.items
                }
                var pgManualQuery = customConfig.data?.pro?.manualQuery
              }
              // else if (nodeVersion.toLowerCase() == 'v2') {

              // }
             
              var extdata = JSON.parse(await this.redisService.getJsonData(dpdkey+'NDP',collectionName))
              var nodedata = Object.keys(extdata)[0]
              var configConnectors = extdata[nodedata].data['externalConnectors-DB']?.items
              if(configConnectors?.length>0){
                for(let i=0;i< configConnectors.length;i++){
                  if(configConnectors[i].connectorName == conncectorname){
                    var dbConfig = configConnectors[i]
                  }
                }
              }
              //console.log('dbConfig',dbConfig);
              
               if (dbConfig) {
                       if (
                         !dbConfig.host ||
                         !dbConfig.port ||
                         !dbConfig.username ||
                         !dbConfig.password ||
                         !dbConfig.database ||
                         !dbConfig.schema
                       )
                        {
                         throw `Invalid DB credentials`;
                       }
                    // var dbUrl = process.env.DATABASE_URL
                    // if(!dbUrl) throw 'DB url not found'
                   //postgresql://postgres:Torus@123@192.168.2.180:30032/clt1408_vob_uae_dev?schema=public
                   //var dbUrl = 'postgresql://'+dbConfig.username+':'+dbConfig.password+'@'+dbConfig.host+':'+dbConfig.port+'/'+dbConfig.database
                     const { Client } = pg
                     var client = new Client({
                      // connectionString: dbUrl,
                       host: dbConfig.host,
                       port: dbConfig.port,
                       user: dbConfig.username,
                       password: dbConfig.password,
                       database: dbConfig.database
                     });                 
   
                   
                   if(!oprname){
                     oprname = 'select'
                   }
                  
                   
   
                    let schemaname = dbConfig.schema
   
                   
                   if (oprname && oprkey.includes(oprname)) {
                   
                     if (oprname == 'select') {                    
                      
                       if(selcol && selcol.length>0){
                         var selcolumns = selcol.join(',');
                       }
                         let str=[]   
                         let strobj ={}    
                       if(filterParams?.length>0){
                         for(let i=0;i< filterParams.length;i++){
                             var filcol = filterParams[i].key
                             var filval = filterParams[i].value
                             var operator = filterParams[i].operator
                             //strobj[filcol = filval]
                             str.push(filcol+'='+filval)
                             if(operator)
                               var Querystr = str.join(operator) 
                         }
                       }
                       if(inputparam && Object.keys(inputparam).length > 0){
                         if(inputparam){                     
                           var data = inputparam.data
                         }      
                       } 
                   
                        var qry
                       if (pgManualQuery) {
                          qry = pgManualQuery
   
                           if (qry.endsWith(';')) {
                         qry = qry.slice(0, -1);
                       }
                        if(page && count){
                      const cleanedQuery = qry.trim();
                      if (/limit\s+\d+/i.test(cleanedQuery)) {
                         throw new Error('LIMIT clause detected. Please do not include it.');
                      }                     
                        qry = `${cleanedQuery} LIMIT ${count} OFFSET ${offset}`;
                      }
                          
                       } else {
                        
                         if (!schemaname || !tablename) {
                           throw `Schema Name/Table Name not found`
                         }
                        if (selcol && selcol.length == 0)
                             qry = 'select * from "' + schemaname + '".' + tablename
                           else if(Querystr){
                             qry = 'select ' + selcolumns + ' from "' + schemaname + '".' + tablename + ' where ' + Querystr
                           }
                           else {
                             qry = 'select ' + selcolumns + ' from "' + schemaname + '".' + tablename
                           }
   
   
                         if (qry)
                           await this.redisService.setJsonData(key + 'NDP', JSON.stringify(qry),collectionName, poNode[j].nodeId + '.data.pro.autoQuery')
                       }
                     }
                     else {
                       throw 'Invalid Operation Name'
                     }
                     await client.connect()
                       if(qry)
                       qryres = await client.query(qry)
                       if (qryres)
                         dbres = qryres.rows 
                      
                         if(flag != 'N' && dbres?.length == 0){
                           await this.redisService.setStreamData(srcQueue,'TASK - '+upId,JSON.stringify({"PID":upId,"TID":nodeId,"EVENT":targetStatus}))                
                           await this.CommonService.getTPL(processedKey,upId,poNode[j],'Success',token,currentFabric,sourceStatus,qry,dfoSchema)
                           return {status:200, targetStatus: targetStatus,data: dbres}
                         }
                         else if (!dbres || dbres?.length == 0) {
                         throw 'No Records Found'
                       } 
                       await client.end()
                       
                     if(inputparam && Object.keys(inputparam).length > 0){
                       Object.assign(inputparam, {[poNode[j].nodeName]:dbres})
                       var RCMresult: any = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam, processedKey+upId,currentFabric)
                       }
                       else{
                         var RCMresult: any = await this.CommonService.getRuleCodeMapper(poNode[j], dbres, processedKey+upId,currentFabric)
                       }
                                   
                     if (RCMresult) {
                       var zenresult = RCMresult.rule
                       var customcoderesult = RCMresult.code
                     }
                     if(customcoderesult != undefined){
                       Object.assign(dbres,customcoderesult)
                     } 
                    
                     if (upId) {
                       if(Array.isArray(dbres) && dbres.length > 0)             
                       await this.CommonService.getTPL(processedKey,upId,poNode[j],'Success',token,currentFabric,sourceStatus,qry,dbres)
                       await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(qry),collectionName, 'request')
                       await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(dbres), collectionName,'response')
                     }
                     
                     this.logger.log("EXT-DB Node execution completed")
                     return {status:200, targetStatus: targetStatus,data: dbres}  
                   } else {
                     throw 'Operation name not found'
                   }
                 }
            } catch (error) {
              // await this.CommonService.getTPL(processedKey,upId,poNode[j],'Failed',token,currentFabric,sourceStatus,inputparam,error)              
              await this.redisService.setStreamData(failureQueue,collectionName + '-TASK - '+upId,JSON.stringify({"PID":upId,"TID":nodeId,"EVENT":failureTargetStatus}))
              throw error
            }
          }

        //Stream Node
        if (nodeType == 'streamnode' && poNode[j].nodeId == nodeId) {
          try {
            this.logger.log('Stream node Started')

            var customConfig: any = JSON.parse(await this.redisService.getJsonDataWithPath(key + 'NDP', '.' + poNode[j].nodeId,collectionName))
            let nodeVersion = customConfig?.nodeVersion

            if(!nodeVersion) throw 'nodeVersion not found'

            if (nodeVersion.toLowerCase() == 'v1') {
              var oprname: any = customConfig.data?.pro?.operationName
              var oprkey = Object.keys(customConfig?.data.pro)
              var streamName = customConfig.data?.pro[oprname]?.streamName
              var fromStreamid = customConfig.data?.pro[oprname]?.startTimeZone
              var toStreamid = customConfig.data?.pro[oprname]?.endTimeZone
            } 
            //else if (nodeVersion.toLowerCase() == 'v2') {

            //}
            if (customConfig) {
              // let streamres:any 
              if (!process.env.HOST || !parseInt(process.env.PORT)) {
                throw 'Invalid stream credentials'
              }
              var redis = new Redis({
                host: process.env.HOST,
                port: parseInt(process.env.PORT)
              })



              if (oprname && oprkey.includes(oprname)) {
                if (oprname == 'read') {

                  //console.log("fromStreamid",fromStreamid);
                  //console.log("toStreamid",toStreamid);
                  if (!streamName) {
                    throw 'Stream RequestParams were empty'
                  }

                  var streamArr = [];
                  // var streamvalue: any = await redis.call('XRANGE', streamName, '1734003264169-0','1734003264186-0')
                  if (fromStreamid && toStreamid) {
                    var streamvalue: any = await redis.call('XRANGE', streamName, fromStreamid, toStreamid)
                  } else {
                    await this.redisService.createConsumer(streamName, 'group1', 'consumer1')
                    await this.redisService.createConsumerGroup(streamName, 'group1')
                    var streamvalue: any = await this.redisService.readConsumerGroup(streamName, 'group1', 'consumer1')
                  }
                  if (streamvalue?.length > 0) {
                    streamvalue.forEach(([msgId, data]) => {
                      streamArr.push(JSON.parse(data[1]));
                    });
                  }
                  else {
                    throw 'No New Data available to read';
                  }
                }


                if (inputparam && Object.keys(inputparam).length > 0) {
                  Object.assign(inputparam, { [poNode[j].nodeName]: streamArr })
                  var RCMresult: any = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam, processedKey + upId, currentFabric)
                }
                else {
                  var RCMresult: any = await this.CommonService.getRuleCodeMapper(poNode[j], streamArr, processedKey + upId, currentFabric)
                }

                //Object.assign(streamres,inputparam.data)
                // var RCMresult: any = await this.CommonService.getRuleCodeMapper(poNode[j], data,processedKey+upId,currentFabric)

                if (RCMresult) {
                  var zenresult = RCMresult.rule
                  var customcoderesult = RCMresult.code
                }
                if (customcoderesult != undefined) {
                  streamArr = customcoderesult
                }

                if (upId) {
                  await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus }))
                  if (Array.isArray(streamArr) && streamArr.length > 0)
                    await this.CommonService.getTPL(processedKey, upId,  poNode[j], 'Success', token, currentFabric, sourceStatus, streamName, streamArr)
                  // await this.CommonService.getTPL(processedKey, upId,  poNode[j], 'Success', token, currentFabric, sourceStatus, streamName, dfoSchema)//streamArr
                  await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(streamName),collectionName, 'request')
                  await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(streamArr),collectionName, 'response')
                }
                this.logger.log("Stream Node execution completed")
                return { status: 200, targetStatus: targetStatus, data: streamArr }
              }
            } else {
              throw 'Operation name not found'
            }
          } catch (error) {
            // await this.CommonService.getTPL(processedKey,upId,poNode[j],'Failed',token,currentFabric,sourceStatus,inputparam,error)            
            await this.redisService.setStreamData(failureQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": failureTargetStatus }))
            throw error
          }
        }

          //EXT-Stream Node
          if(nodeType == 'ext-streamnode' && poNode[j].nodeId == nodeId){
            try {
              this.logger.log('EXT-Stream node Started')
               
              var customConfig: any = JSON.parse(await this.redisService.getJsonDataWithPath(key + 'NDP', '.' + poNode[j].nodeId,collectionName))
              let nodeVersion = customConfig?.nodeVersion
              if(!nodeVersion) throw 'nodeVersion not found'
              
              if (nodeVersion.toLowerCase() == 'v1') {              
                var dpdkey = customConfig?.data?.connector?.value
                var conncectorname = customConfig?.data?.connector?.subSelection?.value
                var oprname: any = customConfig.data?.pro?.operationName
                var oprkey = Object.keys(customConfig?.data.pro)
                var streamName = customConfig.data?.pro[oprname]?.streamName
                var fromStreamid = customConfig.data?.pro[oprname]?.startTimeZone 
                var toStreamid = customConfig.data?.pro[oprname]?.endTimeZone      
                     
              }
              // else if (nodeVersion.toLowerCase() == 'v2') {

              // }
              var extdata = JSON.parse(await this.redisService.getJsonData(dpdkey+'NDP',collectionName))
              var nodedata = Object.keys(extdata)[0]
              var configConnectors = extdata[nodedata].data['externalConnectors-STREAM']?.items
              if(configConnectors?.length>0){
                for(let i=0;i< configConnectors.length;i++){
                  if(configConnectors[i].connectorName == conncectorname){
                    var streamConfig = configConnectors[i]?.credentials
                  }
                }
              }
                if (customConfig) {  
                 // let streamres:any 
                    if (! streamConfig.host || !streamConfig.port) {
                      throw 'Invalid stream credentials'
                    }
                    var redis = new Redis({
                      host: streamConfig.host,
                      port: streamConfig.port
                    })
              
                 
                  if (oprname && oprkey.includes(oprname)) {                   
                    if (oprname == 'read') {
                       //console.log("fromStreamid",fromStreamid);
                      //console.log("toStreamid",toStreamid);
                      if (!streamName) {
                        throw 'Stream RequestParams were empty'
                      }
                     
                      var streamArr = [];                     
                     // var streamvalue: any = await redis.call('XRANGE', streamName, '1734003264169-0','1734003264186-0')
                      var streamvalue: any = await redis.call('XRANGE', streamName, fromStreamid,toStreamid)                   
                      if (streamvalue?.length>0) {
                        streamvalue.forEach(([msgId, data]) => {
                          streamArr.push(JSON.parse(data[1]));
                        });
                      }
                      else {
                        throw 'No New Data available to read';
                      }                      
                    }                 
                    
                   
                     if(inputparam && Object.keys(inputparam).length > 0){
                    Object.assign(inputparam, {[poNode[j].nodeName]:streamArr})
                    var RCMresult: any = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam, processedKey+upId,currentFabric)
                    }
                    else{
                      var RCMresult: any = await this.CommonService.getRuleCodeMapper(poNode[j], streamArr, processedKey+upId,currentFabric)
                    }
                      
                    //Object.assign(streamres,inputparam.data)
                   // var RCMresult: any = await this.CommonService.getRuleCodeMapper(poNode[j], data,processedKey+upId,currentFabric)
                                
                    if (RCMresult) {
                      var zenresult = RCMresult.rule
                      var customcoderesult = RCMresult.code
                    }
                    if(customcoderesult != undefined){
                     streamArr = customcoderesult
                    } 
                 
                  if (upId) {
                    await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus }))
                     if(Array.isArray(streamArr) && streamArr.length > 0)
                    await this.CommonService.getTPL(processedKey, upId,  poNode[j], 'Success', token, currentFabric, sourceStatus, streamName, streamArr)
                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(streamName),collectionName, 'request')
                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(streamArr),collectionName, 'response')
                  }
                  this.logger.log("Stream Node execution completed")                 
                  return {status:200, targetStatus: targetStatus,data: streamArr}  
                  }
              } else {
                throw 'Operation name not found'
              }
            } catch (error) {             
             // await this.CommonService.getTPL(processedKey,upId,poNode[j],'Failed',token,currentFabric,sourceStatus,inputparam,error)            
              await this.redisService.setStreamData(failureQueue,collectionName + '-TASK - '+upId,JSON.stringify({"PID":upId,"TID":nodeId,"EVENT":failureTargetStatus}))
              throw error
            }
          }

        //File Node
        if (nodeType == 'filenode' && poNode[j].nodeId == nodeId) {
          try {
            this.logger.log('File node Execution Started')

            var customConfig: any = JSON.parse(await this.redisService.getJsonDataWithPath(key + 'NDP', '.' + poNode[j].nodeId,collectionName))
            let nodeVersion = customConfig?.nodeVersion

            if(!nodeVersion) throw 'nodeVersion not found'           
           
            if (customConfig) {
              let RCMresult,fileres
              if (nodeVersion.toLowerCase() == 'v1') {
                let ndpPro = customConfig.data?.pro
                var oprname: any = ndpPro?.operationName.value
                var oprkey = Object.keys(ndpPro)
                var encryptionFlag = ndpPro?.encryptionFlag
                var fileFolderPath = ndpPro?.[oprname]?.pathName;
                var fileType = ndpPro?.[oprname]?.fileType;
                var fileName = ndpPro?.[oprname]?.fileName
                
              } 
            //else if (nodeVersion.toLowerCase() == 'v2') {

            //}     

            if (!process.env.FTP_OUTPUT_HOST || !process.env.SEAWEED_USERNAME || !process.env.SEAWEED_PASSWORD) throw 'Invalid File Credentials'
              
              let seaWeedConfig = {
                url: process.env.FTP_OUTPUT_HOST,
                username: process.env.SEAWEED_USERNAME,
                password: process.env.SEAWEED_PASSWORD
              }

              if (oprname && oprkey.includes(oprname)) {
      
                if(!fileFolderPath) fileFolderPath = process.env.TENANT

                if(!fileName || !fileType || !oprname) throw 'Invalid Credentials'

                let fullPath = fileFolderPath + '/' + fileName + '.' + fileType

                if (oprname === 'read') {          
                  if(fileFolderPath && fileName+'.'+fileType){
                    fileres = await this.setfileKeys(seaWeedConfig,oprname,fileFolderPath,fileName+'.'+fileType)
                    console.log('fileres',fileres);                    
                  }  

                  if (!fileres || fileres?.status != 201 || (Array.isArray(fileres) && fileres.length == 0) || (typeof fileres == 'object' && Object.keys(fileres).length == 0)) {
                    throw 'Data not found'
                  }  
                }else if (oprname === 'write') {  
                  if(fileName+'.'+fileType && inputparam?.data){
                    fileres = await this.setfileKeys(seaWeedConfig,oprname,fileFolderPath,fileName+'.'+fileType, inputparam.data)
                    console.log('fileres',fileres);
                    if(!fileres || fileres?.status != 201){
                      throw 'Data not inserted'
                    }
                  }        
                }                               

                  if (inputparam && Object.keys(inputparam).length > 0) {
                    Object.assign(inputparam, { [poNode[j].nodeName]: fileres })
                    RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam, processedKey + upId, currentFabric)
                  }
                  else {
                    RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], fileres, processedKey + upId, currentFabric)
                  }
                
                  if (RCMresult) {
                    var zenresult = RCMresult.rule
                    var customcoderesult = RCMresult.code
                  }
                  if (customcoderesult != undefined) {
                    fileres = customcoderesult
                  }

                  if (upId) {
                    await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus }))                   
                    await this.CommonService.getTPL(processedKey, upId,  poNode[j], 'Success', token, currentFabric, sourceStatus, fullPath, fileres)
                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(fullPath),collectionName, 'request')
                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(fileres),collectionName, 'response')
                  }
                //}
                this.logger.log("File Node execution completed")
                return { status: 200, targetStatus: targetStatus, data: fileres }                
              }else {
                throw 'Operation name not found'
              } 
            }

          } catch (error) {
            // await this.CommonService.getTPL(processedKey,upId,poNode[j],'Failed',token,currentFabric,sourceStatus,inputparam,error)              
            await this.redisService.setStreamData(failureQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": failureTargetStatus }))
            throw error
          }
        }

        //EXT-File Node
        if(nodeType == 'ext-filenode' && poNode[j].nodeId == nodeId){
          try {
            this.logger.log('EXT-File node Execution Started') 
            
            var customConfig: any = JSON.parse(await this.redisService.getJsonDataWithPath(key + 'NDP', '.' + poNode[j].nodeId,collectionName))
            let nodeVersion = customConfig?.nodeVersion

            if(!nodeVersion) throw 'nodeVersion not found'
              
              if (customConfig) {            
                let ExtFileres
                if (nodeVersion.toLowerCase() == 'v1') { 
                  let ndpPro = customConfig.data?.pro
                  var dpdkey = customConfig.data?.connector?.value
                  var conncectorname = customConfig.data?.connector?.subSelection?.value
                  var oprname: any = ndpPro?.operationName.value
                  var oprkey = Object.keys(ndpPro)
                  var extFileFolderPath = ndpPro?.[oprname]?.pathName;
                  var extFileType = ndpPro?.[oprname]?.fileType;
                  var extFileName = ndpPro?.[oprname]?.fileName
                }
                // else if (nodeVersion.toLowerCase() == 'v2') { 
                  
                // }

                var extdata = JSON.parse(await this.redisService.getJsonData(dpdkey+'NDP',collectionName))
                var nodedata = Object.keys(extdata)[0]
                var configConnectors = extdata[nodedata].data['externalConnectors-FILE']?.items
                if(configConnectors?.length>0){
                  for(let i=0;i< configConnectors.length;i++){
                    if(configConnectors[i].connectorName == conncectorname){
                      var fileConfig = configConnectors[i]?.credentials
                    }
                  }
                }   

                if (!fileConfig || !fileConfig.host || !fileConfig.username || !fileConfig.password) throw 'Invalid File Credentials'
              
                let seaWeedConfig = {
                  url: fileConfig.host,
                  username: fileConfig.username,
                  password: fileConfig.password
                }
                
                if (oprname && oprkey.includes(oprname)) {

                  if(!extFileFolderPath) extFileFolderPath = process.env.TENANT

                  if(!extFileName || !extFileType || !oprname) throw 'Invalid Credentials'

                  let fullPath = extFileFolderPath + '/' + extFileName + '.' + extFileType

                  if (oprname === 'read') {          
                    if(extFileFolderPath && extFileName+'.'+extFileType){
                      ExtFileres = await this.setfileKeys(seaWeedConfig,oprname,extFileFolderPath,extFileName+'.'+extFileType)
                      console.log('fileres',ExtFileres);                    
                    }  

                    if (!ExtFileres || ExtFileres?.status != 201 || (Array.isArray(ExtFileres) && ExtFileres.length == 0) || (typeof ExtFileres == 'object' && Object.keys(ExtFileres).length == 0)) {
                      throw 'Data not found'
                    }  
                  }else if (oprname === 'write') {  
                    if(extFileName+'.'+extFileType && inputparam?.data){
                      ExtFileres = await this.setfileKeys(seaWeedConfig,oprname,extFileFolderPath,extFileName+'.'+extFileType, inputparam.data)
                      console.log('fileres',ExtFileres);
                      if(!ExtFileres || ExtFileres?.status != 201){
                        throw 'Data not ExtFileres'
                      }
                    }        
                  } 

                    if (inputparam && Object.keys(inputparam).length > 0) {
                      Object.assign(inputparam, { [poNode[j].nodeName]: ExtFileres })
                      var RCMresult: any = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam, processedKey + upId, currentFabric)
                    }
                    else {
                      var RCMresult: any = await this.CommonService.getRuleCodeMapper(poNode[j], ExtFileres, processedKey + upId, currentFabric)
                    }
                    if (RCMresult) {
                      var zenresult = RCMresult.rule
                      var customcoderesult = RCMresult.code
                    }
                    if (customcoderesult != undefined) {
                      ExtFileres = customcoderesult
                    }
                    if (upId) {
                      await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus }))
                      await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', token, currentFabric, sourceStatus, fullPath, ExtFileres)
                      await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(fullPath), collectionName, 'request')
                      await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(ExtFileres), collectionName, 'response')
                    }
                 // }

                  this.logger.log("EXT-File Node execution completed")
                  return { status: 200, targetStatus: targetStatus, data: ExtFileres }

                } else {
                  throw 'Operation name not found'
                } 
              }
          
          } catch (error) {
            // await this.CommonService.getTPL(processedKey,upId,poNode[j],'Failed',token,currentFabric,sourceStatus,inputparam,error)              
            await this.redisService.setStreamData(failureQueue,collectionName + '-TASK - '+upId,JSON.stringify({"PID":upId,"TID":nodeId,"EVENT":failureTargetStatus}))
            throw error
          }
        }

         //Sub Flow Node
        if (nodeType == 'subflow_node' && poNode[j].nodeId == nodeId) {
          try {
            this.logger.log('Sub Flow Node Started');
            var customConfig: any = JSON.parse(await this.redisService.getJsonDataWithPath(key + 'NDP','.' + poNode[j].nodeId,collectionName));
            // console.log('inputParam',inputparam);

            if (customConfig) {
              var PfdKey = customConfig?.apiKey           
              let nodeVersion = customConfig?.nodeVersion
              
              if(!nodeVersion) throw 'Node version not found'
              if (!PfdKey) throw 'PFD key not found'   

              let internalMappingNodes = poJson?.internalMappingNodes
              let internalMappedObj = {}
              for (let n = 0; n < internalMappingNodes.length; n++) {
                if (internalMappingNodes[n].nodeId == poNode[j].nodeId && internalMappingNodes[n].ifo?.length > 0) {
                  for (let f = 0; f < internalMappingNodes[n].ifo.length; f++) {
                    if (internalMappingNodes[n].ifo[f].value)
                      internalMappedObj[internalMappingNodes[n].ifo[f].key] = internalMappingNodes[n].ifo[f].value

                  }
                }
              }       

              if (internalEdges && internalEdges.hasOwnProperty(poNode[j].nodeId)) {
                let currentNodeEdge = internalEdges[poNode[j].nodeId];

                var mapObj = {}
                var tempQryVal = []
                for (let e = 0; e < currentNodeEdge.length; e++) {

                  let srcHandle = currentNodeEdge[e].sourceHandle
                  let targetHandle = currentNodeEdge[e].targetHandle
                  if (srcHandle) {
                    let srcSplit = srcHandle.split('|')
                    let srcVal = srcSplit.includes('HeaderParams') ? srcSplit[1] : srcSplit[srcSplit.length - 1]

                    if (srcVal.includes('.')) {
                      var staticRemove = srcVal.split('.')
                      var sourceFilteredVal = (staticRemove.filter(item => !statickeyword.includes(item)))
                      sourceFilteredVal = sourceFilteredVal.join('.')
                      if (sourceFilteredVal.includes('.') && sourceFilteredVal.startsWith('parameters.')) {
                        sourceFilteredVal = _.get(parameter, sourceFilteredVal)
                      }
                    }
                    else {
                      var sourceFilteredVal = srcVal
                    }


                    if (targetHandle) {
                      let targetSplit = targetHandle.split('|')
                      let targetVal = targetSplit.includes('HeaderParams') ? targetSplit[1] : targetSplit[targetSplit.length - 1]

                      if (sourceFilteredVal.startsWith('items.')) {
                        sourceFilteredVal = sourceFilteredVal.replace('items.', '')
                      }
                      sourceFilteredVal = sourceFilteredVal.toLowerCase()
                      if (sourceFilteredVal.includes('.items.')) {
                        var spilt = sourceFilteredVal.split('.items.')
                        var getdata = _.get(inputparam, spilt[0])
                      }
                      if (getdata?.length > 0) {
                        for (let a = 0; a < getdata.length; a++) {
                          sourceFilteredVal = sourceFilteredVal.replace('.items.', '[' + a + ']')
                        }
                      }

                      sourceFilteredVal = sourceFilteredVal.trim()
                      var rescheck = _.get(inputparam, sourceFilteredVal)
                      if (rescheck || rescheck == null) {
                        var a = 'y'
                      }
                      if (a != 'y') {
                        if (targetVal.includes('requestBody') || targetVal) {
                          inputparam = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + upId + ':NPV:' + conncectedNodename + '.PRO', '.request', collectionName))

                        } else if (targetVal.includes('responses')) {
                          inputparam = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + upId + ':NPV:' + conncectedNodename + '.PRO', '.response', collectionName))
                        }
                      }

                      if (targetVal.includes('.')) {
                        var staticRemove = targetVal.split('.')
                        var targetFilteredVal = (staticRemove.filter(item => !statickeyword.includes(item)))
                        var tempobj = {}
                        targetFilteredVal = targetFilteredVal.join('.')
                        if (targetFilteredVal.includes('.') && targetFilteredVal.startsWith('parameters.')) {
                          var parameterPathValue = _.get(parameter, targetFilteredVal.replace('.name', '.in'))
                          tempobj['key'] = _.get(parameter, targetFilteredVal)
                          tempobj['type'] = parameterPathValue
                          targetFilteredVal = _.get(parameter, targetFilteredVal)

                          tempQryVal.push(tempobj)
                        }
                        targetFilteredVal = targetFilteredVal.split('.')
                        targetFilteredVal = targetFilteredVal.filter(item => !numberArr.includes(item));
                        targetFilteredVal = targetFilteredVal.join('.')

                        if (targetFilteredVal.includes('.items.')) {
                          targetFilteredVal = targetFilteredVal.replace('.items.', '[0]')
                        }
                        if (mapObj) {
                          var setdata = _.get(mapObj, targetFilteredVal)
                          if (setdata?.length) {
                            targetFilteredVal = targetFilteredVal.replace('[0]', '[' + setdata.length + ']')
                          }
                        }

                        var checkdata = _.get(inputparam, sourceFilteredVal)
                        if (checkdata != null && checkdata != undefined) {
                          _.set(mapObj, targetFilteredVal, _.get(inputparam, sourceFilteredVal))
                        }
                      } else {
                        if (checkdata != null && checkdata != undefined) {
                          _.set(mapObj, targetVal, _.get(inputparam, sourceFilteredVal))
                        }
                      }
                    }
                  }
                }

              } 
            
              
                  //if (mapObj && Object.keys(mapObj).length > 0 && Object.keys(internalMappedObj).length > 0){
                    // mapObj = Object.assign(mapObj, internalMappedObj)
                    //inputparam = Object.assign(mapObj, internalMappedObj)
                  //}else if(inputparam && Object.keys(inputparam).length > 0){
                    //inputparam = Object.assign(inputparam, internalMappedObj)
                  //}

                  if (mapObj && Object.keys(mapObj).length > 0) {
                    if (internalMappedObj && Object.keys(internalMappedObj).length > 0) {
                      mapObj = Object.assign(mapObj, internalMappedObj)
                    }
                  } else if (inputparam && internalMappedObj && Object.keys(internalMappedObj).length > 0) {
                    mapObj = Object.assign(inputparam, internalMappedObj)
                  } else {
                    mapObj = inputparam
                  }
                
                  PfdKey = PfdKey.endsWith(':NDP')?PfdKey.replace(':NDP',''):PfdKey

                  let subPo,subnodeid,subnodetype
                  if(!(await this.redisService.exist(PfdKey+':PO',process.env.CLIENTCODE))) throw `${PfdKey} not found`
                  subPo = JSON.parse(await this.redisService.getJsonDataWithPath(PfdKey+':PO','.mappedData.artifact.node',process.env.CLIENTCODE))
                
                  if(subPo && subPo.length > 0){
                    subnodeid = subPo[1]['nodeId'] 
                    subnodetype = subPo[1]['nodeType'] 
                  }

                  let subPoResult,pfExecutedSet,pfExecutedEvent
                  let pfdto = new pfDto()
                  pfdto.key = PfdKey+':'
                  pfdto.upId = ''
                  pfdto.data = mapObj
                  pfdto.nodeId = subnodeid
                  pfdto.nodeType = subnodetype
                  pfdto.event = event
                const requestConfig: AxiosRequestConfig = {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                };
            
              if(!(process.env.BE_URL)) throw 'Server Url not found'           
            
              // process.env.BE_URL = 'http://192.168.2.96:7000' 
              console.log('PFDTO',pfdto);
              
              subPoResult = await this.CommonService.postCall(process.env.BE_URL + '/te/eventEmitter', pfdto, requestConfig)
              console.log('subPoResult',subPoResult);
            
              if(subPoResult?.statusCode == 201 && subPoResult?.status == "Success"){
                if(subPoResult?.result?.message == 'Success'){
                  subPoResult = subPoResult?.result
                  pfExecutedSet = subPoResult?.data
                  pfExecutedEvent= subPoResult?.event                
                  
                  if(targetStatus != pfExecutedEvent){
                    throw 'Event Mismatched in subflow'
                  }
                }          
                            
                  var RCMresult:any = await this.CommonService.getRuleCodeMapper(poNode[j],pfExecutedSet,processedKey,currentFabric) 
                  
                  let zenresult = RCMresult.rule
                  let customcoderesult = RCMresult.code
                  if (customcoderesult != undefined) {
                    var response = Object.assign(request, customcoderesult)
                  }               

                  if (routearr.length > 0) {

                    for (var z = 0; z < routearr.length; z++) {
                      if (routearr[z].nodeName != 'End') {
                      
                        if (pfExecutedSet) {
                          if (Array.isArray(pfExecutedSet)) {
                            pfExecutedSet = Object.assign(inputparam, pfExecutedSet[0])
                          } else if (Object.keys(pfExecutedSet).length > 0) {
                            pfExecutedSet = Object.assign(inputparam, pfExecutedSet)
                          }                        
                          await this.redisService.setJsonData(processedKey + upId + ':NPV:' + routearr[z].nodeName + '.PRO', JSON.stringify(pfExecutedSet), collectionName, 'request')
                        }
                        else
                          await this.redisService.setJsonData(processedKey + upId + ':NPV:' + routearr[z].nodeName + '.PRO', JSON.stringify(inputparam), collectionName, 'request')
                      }
                    }
                  }
                
                  if (upId) {                  
                    await this.redisService.setStreamData(srcQueue, collectionName + 'TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus }))
                  
                    await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', token, currentFabric, sourceStatus, pfdto, subPoResult)
                    
                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(pfdto), collectionName, 'request')
                  
                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(pfExecutedSet), collectionName, 'response')
                  }
                
                  this.logger.log('Sub Flow Node Completed');                
                  return {status: 200,targetStatus: targetStatus,data: pfExecutedSet};
                
              }else{
                throw subPoResult
              }                     
            }
          } catch (error) {
            console.log('SUB_FLOW ERROR ', error);
            if(error?.response?.data) error = error?.response?.data
            
            await this.CommonService.getTPL(
              processedKey,
              upId,           
              poNode[j],
              'Failed',
              token,
              currentFabric,
              sourceStatus,
              inputparam,
              error,
            );

            await this.redisService.setStreamData(
              failureQueue,
              collectionName +'TASK - ' + upId,
              JSON.stringify({
                PID: upId,
                TID: nodeId,
                EVENT: failureTargetStatus,
              }),
            );
            throw error;
          }
        }

       //Output Node
        if(nodeType == 'outputnode' && poNode[j].nodeId == nodeId){
          try {
            this.logger.log('Output node Started')
            var customConfig: any = JSON.parse(await this.redisService.getJsonDataWithPath(key + 'NDP', '.' + poNode[j].nodeId,collectionName))
             let nodeVersion = customConfig?.nodeVersion
              if(!nodeVersion){
                throw 'nodeVersion not found'
              }
              if (nodeVersion.toLowerCase() == 'v1') { 
                var connectorType:any = customConfig?.data?.connector?.value //customConfig?.data?.connector?._selection?._selection?.value
                var storageType = customConfig?.data?.connector?._selection?._selection?.value
                var dpdkey = customConfig?.data?.connector?._selection?.value
                var conncectorName = customConfig?.data?.connector?._selection?.subSelection?.value
                var responseNodeName = customConfig?.outputDataNodes
                var tableName = customConfig.data?.pro?.database?.insert?.tableName
                var fileType = customConfig.data?.pro?.file?.write?.fileType
                var fileName = customConfig.data?.pro?.file?.write?.fileName
                var folderPath = customConfig.data?.pro?.file?.write?.pathName
                var streamName = customConfig.data?.pro?.stream?.write?.streamName
                var fieldName = customConfig.data?.pro?.stream?.write?.field
              }
              // else if (nodeVersion.toLowerCase() == 'v2') { 
                
              // }           
            
          
            if (!dpdkey) throw 'DPD key not found'            
            var extdata = JSON.parse(await this.redisService.getJsonData(dpdkey+'NDP',collectionName))
            var nodedata = Object.keys(extdata)[0]
            var dpdKeyValue = extdata[nodedata].data
           
            
            
            // console.log("responseNodeName",responseNodeName);
            if(responseNodeName?.length == 0) throw 'outputDataNodes not found'
            for(let p=0;p< pfjson.length;p++){
              if(responseNodeName.includes(pfjson[p].nodeId)){
                var connectedNodeName = pfjson[p].nodeName
              }
            }
            if(connectedNodeName) 
              var inputData = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + upId + ':NPV:'+ connectedNodeName +'.PRO','.response',collectionName)) 
           
            if(inputData){
              var logReq 
              if(connectorType == 'database'){
                var dbconfig 
                var dbFlg 
                if(storageType == 'internal'){

                  let specificDbType = dpdKeyValue?.dbType?.dbType?.value //extdata?.data?.dbType?.value
                  if(!specificDbType) throw 'DB type not found'
                  if(specificDbType == 'postgres'){

                    dbconfig = extdata?.data?.postgres
                    if(!dbconfig || !dbconfig.POSTGRES_HOST || !dbconfig.POSTGRES_PORT || !dbconfig.POSTGRES_USERNAME || !dbconfig.POSTGRES_PASSWORD || !dbconfig.POSTGRES_DATABASENAME) throw `Invalid DB credentials`
  
                    const { Client } = pg
                     var client = new Client({
                      host: dbconfig.POSTGRES_HOST,
                      port: dbconfig.POSTGRES_PORT,
                      user: dbconfig.POSTGRES_USERNAME,
                      password: dbconfig.POSTGRES_PASSWORD,
                      database: dbconfig.POSTGRES_DATABASENAME
                    
                    });   
                    dbFlg = 'pg'    
                  }else if(specificDbType == 'mongodb'){
                    dbconfig = dpdKeyValue?.mongodb
                   
                    if (
                      !dbconfig ||
                      !dbconfig.MONGODB_HOST ||
                      !dbconfig.MONGODB_PORT ||
                      !dbconfig.MONGODB_USERNAME ||
                      !dbconfig.MONGODB_PASSWORD ||
                      !dbconfig.MONGODB_DATABASENAME                   
                    ){
                      throw `Invalid DB credentials`;
                    }

                    let mongoDbUrl = `mongodb://${dbconfig.MONGODB_USERNAME}:${dbconfig.MONGODB_PASSWORD}@${dbconfig.MONGODB_HOST}:${dbconfig.MONGODB_PORT}/${dbconfig.MONGODB_DATABASENAME}?authSource=admin`
                    
                    // 'mongodb://admin:Torus%40123@192.168.2.180:32017/Torus9x?authSource=admin'

                    const client = new MongoClient(mongoDbUrl);
                    client.connect()
                      .then(() => {
                        console.log('Connected to the database successfully!');
                      })
                      .catch((err) => {
                        console.error('Error connecting to the database:', err);
                      });
                  
                    var db = client.db(dbconfig.MONGODB_DATABASENAME)
                    dbFlg = 'mongo'                     
                  }

                }else if(storageType == 'external'){                  
                  
                  var configConnectors = extdata[nodedata].data['externalConnectors-DB']?.items
                  if(configConnectors?.length>0){
                    for(let i=0;i< configConnectors.length;i++){
                      if(configConnectors[i].connectorName == conncectorName){
                        dbConfig = configConnectors[i]?.credentials
                      }
                    }
                  }
                 
                  if (!dbConfig?.host ||!dbConfig?.port ||!dbConfig?.username ||!dbConfig?.password ||!dbConfig?.database ||!dbConfig?.schema){
                    throw `Invalid DB credentials`;
                  }              
                  const { Client } = pg
                  var client = new Client({                
                    host: dbConfig.host,
                    port: dbConfig.port,
                    user: dbConfig.username,
                    password: dbConfig.password,
                    database: dbConfig.database
                  });       
                }
                
                if(!tableName) throw 'Table name not found'
               
                if(dbFlg == 'pg'){
                  //INSERT INTO employees (id, name, position, salary) VALUES (1, 'Alice Johnson', 'Software Engineer', 85000);
                  if(Array.isArray(inputData)){
                    for(var i=0;i< inputData.length;i++){
                      if(Object.keys(inputData[i]).length>0){
                        const keys = Object.keys(inputData[i]); 
                        const values = Object.values(inputData[i]);                
                        const query = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${values.map(v => `'${v}'`).join(', ')});`;
  
                        //console.log('query',query);
                        await client.connect()
                        await client.query(query)
                        await client.end()
                      }
                    }
                  }
                  if(Object.keys(inputData).length>0){
                    const keys = Object.keys(inputData); 
                    const values = Object.values(inputData);                
                    const query = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${values.map(v => `'${v}'`).join(', ')});`;
                    logReq = query
                    // console.log('query',query);
                    await client.connect()
                    await client.query(query)
                    await client.end()
                  }
                }else if(dbFlg = 'mongo'){
                  logReq = inputData
                  if(Array.isArray(inputData))
                    await db.collection(tableName).insertMany(inputData)
                  else if(Object.keys(inputData).length>0){
                    await db.collection(tableName).insertOne(inputData)
                  }
                }

              }else if(connectorType == 'file'){
                let seaWeedConfig,OPFileRes
                if(storageType == 'internal'){

                  if (!process.env.FTP_OUTPUT_HOST || !process.env.SEAWEED_USERNAME || !process.env.SEAWEED_PASSWORD) throw 'Invalid File Credentials'
              
                  seaWeedConfig = {
                    url: process.env.FTP_OUTPUT_HOST,
                    username: process.env.SEAWEED_USERNAME,
                    password: process.env.SEAWEED_PASSWORD
                  }
                 
                }else if(storageType == 'external'){
                  var nodedata = Object.keys(extdata)[0]
                  var configConnectors = extdata[nodedata].data['externalConnectors-FILE']?.items
                  if(configConnectors?.length>0){
                    for(let i=0;i< configConnectors.length;i++){
                      if(configConnectors[i].connectorName == conncectorname){
                        var fileConfig = configConnectors[i]?.credentials
                      }
                    }
                  }                  

                  if (!fileConfig || !fileConfig.host || !fileConfig.username || !fileConfig.password) throw 'Invalid File Credentials'
              
                  seaWeedConfig = {
                    url: fileConfig.host,
                    username: fileConfig.username,
                    password: fileConfig.password
                  }
                }

                logReq = inputData
                
                if (fileName + '.' + fileType && inputData) {
                  OPFileRes = await this.setfileKeys(seaWeedConfig, 'write', folderPath, fileName + '.' + fileType, inputData)
                  console.log('fileres', OPFileRes);
                  if (!OPFileRes || OPFileRes?.status != 201) {
                    throw 'Data not inserted'
                  }
                }     

              }else if(connectorType == 'stream'){
              
                if(storageType == 'internal'){    
                  let redisConfig = dpdKeyValue?.redis 
                  if(!redisConfig) throw 'RedisConfig not found'     

                  if (! redisConfig.REDIS_HOST || !parseInt(redisConfig.REDIS_PORT)) {
                    throw 'Invalid Redis credentials'
                 }
                  var redis = new Redis({
                    host: redisConfig.REDIS_HOST,
                    port: parseInt(redisConfig.REDIS_PORT)
                  })
                }else if(storageType == 'external'){
                  var nodedata = Object.keys(extdata)[0]
                  var configConnectors = extdata[nodedata].data['externalConnectors-STREAM']?.items
                  if(configConnectors?.length>0){
                    for(let i=0;i< configConnectors.length;i++){
                      if(configConnectors[i].connectorName == conncectorName){
                        var streamConfig = configConnectors[i]?.credentials
                      }
                    }
                  }
                  if (!streamConfig?.host || !streamConfig?.port) {
                    throw 'Invalid stream credentials'
                  }
                  var redis = new Redis({
                    host: streamConfig.host,
                    port: streamConfig.port
                  })
                }
                logReq = inputData
                
                if(!streamName || !fieldName) throw 'streamName or fieldName not found'
                await redis.call('XADD', streamName, '*', fieldName, JSON.stringify(inputData))                
              }

              if (upId) {
                await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus }))
               
                await this.CommonService.getTPL(processedKey, upId,  poNode[j], 'Success', token, currentFabric, sourceStatus, logReq)
                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(logReq),collectionName, 'request')
                // await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(fileres), 'response')
              }

            }else{
              throw 'Data not found'
            }
            this.logger.log('Output node Started')
            return {status:200, targetStatus: targetStatus,data:inputData}    
          } catch (error) {
            console.log('ERROR',error);
            
             // await this.CommonService.getTPL(processedKey,upId,poNode[j],'Failed',token,currentFabric,sourceStatus,inputparam,error)              
              await this.redisService.setStreamData(failureQueue,collectionName + '-TASK - '+upId,JSON.stringify({"PID":upId,"TID":nodeId,"EVENT":failureTargetStatus}))
              throw error
          }
        }

        //PushToRedis
        if(nodeType == 'pushtoredisnode' && poNode[j].nodeId == nodeId){
          try {
            this.logger.log('PushToRedis node Execution Started') 
            
            var customConfig: any = JSON.parse(await this.redisService.getJsonDataWithPath(key + 'NDP', '.' + poNode[j].nodeId,collectionName))
            
            if (customConfig) {                
              let nodeVersion = customConfig?.nodeVersion
              if(!nodeVersion) throw 'nodeVersion not found'   
              let PTRFileRes
               if (nodeVersion.toLowerCase() == 'v1') {
                  var PTRfolderPath = customConfig.data?.pro?.pathName;
                  var PTRfileType = customConfig?.data?.pro?.fileType; 
                  var PTRfileName = customConfig?.data?.pro?.fileName;                 
               }
               //else if (nodeVersion.toLowerCase() == 'v2') {

               //}    
              
                if (!process.env.FTP_OUTPUT_HOST || !process.env.SEAWEED_USERNAME || !process.env.SEAWEED_PASSWORD) throw 'Invalid File Credentials'
              
                let seaWeedConfig = {
                  url: process.env.FTP_OUTPUT_HOST,
                  username: process.env.SEAWEED_USERNAME,
                  password: process.env.SEAWEED_PASSWORD
                }
  
                
                if(!PTRfolderPath) PTRfolderPath = process.env.TENANT

                if(!PTRfileName || !PTRfileType) throw 'Invalid Credentials'

                let fullPath = PTRfolderPath + '/' + PTRfileName + '.' + PTRfileType

                 if(PTRfileName+'.'+PTRfileType && inputparam?.data){
                    PTRFileRes = await this.setfileKeys(seaWeedConfig,'write',PTRfolderPath,PTRfileName+'.'+PTRfileType, inputparam.data)
                    console.log('PTRFileRes',PTRFileRes);
                    if(!PTRFileRes || PTRFileRes?.status != 201){
                      throw 'Data not inserted'
                    }
                  }   

                  // if (!PTRFileRes || PTRFileRes?.status != 201 || (Array.isArray(PTRFileRes) && PTRFileRes.length == 0) || (typeof PTRFileRes == 'object' && Object.keys(PTRFileRes).length == 0)) {
                  //   throw 'Data not found'
                  // }  

                  if(flag != 'N' && PTRFileRes.length == 0){
                    return {status:200, targetStatus: targetStatus,data: PTRFileRes} 
                  }
                  await this.redisService.setStreamData(srcQueue,collectionName + '-TASK - '+upId,JSON.stringify({"PID":upId,"TID":nodeId,"EVENT":targetStatus}))
                  await this.redisService.setStreamData(targetQueue,collectionName + '-TASK - '+upId,JSON.stringify({"PID":upId,"TID":nodeId,"EVENT":targetStatus}))
                  await this.redisService.setStreamData(streamName,upId,(PTRFileRes))
                  if(routearr.length>0){
                    for(var z=0;z < routearr.length;z++){ 
                      if(routearr[z].nodeName != 'End'){                    
                        if(PTRFileRes)              
                          await this.redisService.setJsonData(processedKey + upId + ':NPV:' + routearr[z].nodeName + '.PRO', JSON.stringify(PTRFileRes),collectionName, 'request')
                        else
                          await this.redisService.setJsonData(processedKey + upId + ':NPV:' + routearr[z].nodeName + '.PRO', JSON.stringify(inputparam), collectionName,'request')
                      }
                    }
                  }
                  await this.CommonService.getTPL(processedKey,upId,poNode[j],'Success',token,currentFabric,sourceStatus,inputparam,{"PID":upId,"TID":nodeId,"EVENT":targetStatus})
                  this.logger.log("PushToRedis Node execution completed")
                  return {status:200, targetStatus: targetStatus,data: PTRFileRes}    

            }
          } catch (error) {
           // await this.CommonService.getTPL(processedKey,upId,poNode[j],'Failed',token,currentFabric,sourceStatus,inputparam,error)
           
            await this.redisService.setStreamData(failureQueue,collectionName + '-TASK - '+upId,JSON.stringify({"PID":upId,"TID":nodeId,"EVENT":failureTargetStatus}))
            throw error
          }
        }

          //Data Set Node
          if(nodeType == 'datasetnode' && poNode[j].nodeId == nodeId){
            try {
              this.logger.log('DataSet Node Started')
              var customConfig: any = JSON.parse(await this.redisService.getJsonDataWithPath(key + 'NDP', '.' + poNode[j].nodeId,collectionName))
             // console.log('inputParam',inputparam);  

              if(flag != 'N' && inputparam && inputparam.length == 0 ){              
                return {status:200, targetStatus: targetStatus,data: inputparam}
              }else if(!inputparam || (Array.isArray(inputparam) && inputparam.length == 0) || (inputparam && Object.keys(inputparam).length == 0)){
                throw 'Data not found'
              }

              if (customConfig) {
                if(internalEdges && internalEdges.hasOwnProperty(poNode[j].nodeId)){
                    var edgesarr = internalEdges[poNode[j].nodeId]
                    var dstVariable = ''
                    var dtovariable = ''
                    var sourcepath = []
                    var targetpath = []
                    var sourcekey = []
                    var rootarr = []
              
                  let statickeyword = ["get","post","patch","200","parameters","requestBody","responses","content","application/json","application/jwt","application/json; charset=utf-8","schema","properties","inputschema","outputschema"]//,"items"
                  
                  var loopingkey = Object.keys(customConfig.data)

                  var checknode = []
                 var doarr = []
                var ndp = JSON.parse(await this.redisService.getJsonData(key + 'NDP',collectionName))
                var nodekey = Object.keys(ndp)
                for(let n=0;n< nodekey.length;n++){
                   var flg = ndp[nodekey[n]].skipNode
                      if(flg == 'Y') {
                        checknode.push(nodekey[n])
                      }
                }
                 for (let c = 0; c < poNode.length; c++) {
                  if(poNode[c].nodeType != 'startnode' && poNode[c].nodeType != 'endnode'){                   
                    for(let b=0;b< checknode.length;b++){
                      if(checknode[b] != poNode[c].nodeId){
                        doarr.push(poNode[c])
                      }
                    }                   
                  }
                }
                
                for (let j = 0; j < edgesarr.length; j++) {
                  var srcNodename = null;
                  sourcekey.push(edgesarr[j].source)
                  var sourceNodeId = edgesarr[j].source

                  if(doarr?.length>0){
                    for (var c = 0; c < doarr.length; c++) {    
                      if(sourceNodeId != doarr[0].nodeId ){  //&& edgesarr[0].source != poNode[c].nodeId 
                        if(sourceNodeId == doarr[c].nodeId){
                          srcNodename = doarr[c].nodeName
                        }
                      }                  
                    }
                  }else{
                    for (let c = 0; c < poNode.length; c++) {    
                      if(sourceNodeId != poNode[1].nodeId ){  //&& edgesarr[0].source != poNode[c].nodeId 
                        if(sourceNodeId == poNode[c].nodeId){
                          srcNodename = poNode[c].nodeName
                        }
                      }                  
                    }
                  }
                  var srcHandle = (edgesarr[j].sourceHandle).split('|') 
                    if (srcHandle) {
                      if(srcHandle.includes('ifo')){
                        srcNodename = null
                      }
                      if(srcHandle.includes('HeaderParams')){
                         dstVariable = srcHandle[1]
                      }else{
                        dstVariable = srcHandle[srcHandle.length - 1]
                      }
                      if (dstVariable.includes('.')) {
                        var src = srcHandle[1].split('.')
                        var srcvariable = src.filter(item => !statickeyword.includes(item));                       
                        dstVariable = srcvariable.join('.')
                        
                        if(dstVariable.includes('items.')){
                          dstVariable = dstVariable.replaceAll('items.','')
                        }
                        if(dstVariable.includes('.items.')){
                          dstVariable = dstVariable.replaceAll('.items.','[0].')
                        }

                        if (
                      dstVariable.includes('.') &&
                      dstVariable.startsWith('parameters.')
                    ) {
                    
                      
                      // var method = Object.keys(ndp[poNode[j].nodeId].data)[0];
                      // var parameter = ndp[poNode[j].nodeId].data[method];
                      var apiKey = ndp[sourceNodeId].apiKey;                    
                      
                      let apidata = JSON.parse(await this.redisService.getJsonData(apiKey ,collectionName));                     
                      let apinodeid = Object.keys(apidata)[0];                     
                      var method = apidata[apinodeid].data?.method;                   
                      var parameter = apidata[apinodeid].data[method.toLowerCase()];

                      dstVariable = _.get(parameter, dstVariable);
                    }
                        // sourcepath.push(dstVariable)
                         if (srcNodename && currentFabric == 'DF-DFD')
                          sourcepath.push(srcNodename+'.'+dstVariable)
                        else
                          sourcepath.push(dstVariable)
                      }          

                      else {
                        // sourcepath.push(dstVariable)
                        if (srcNodename && currentFabric == 'DF-DFD')
                          sourcepath.push(srcNodename+'.'+dstVariable)
                        else
                          sourcepath.push(dstVariable)
                      }
                    }
                  
                   
                   let targetSplit = (edgesarr[j].targetHandle).split('|')
                      if(targetSplit.includes('HeaderParams')){
                          var targetHandle = targetSplit[1]
                      }else{
                          var targetHandle = targetSplit[targetSplit.length-1]
                      }
          
                    if (targetHandle.includes('.')) {
                      var targetVaribale = targetHandle.split('.')
                      var staticRemove: any = targetVaribale.filter(item => !statickeyword.includes(item));
                      rootarr.push(staticRemove.join('.'))
                      
                      // staticRemove = staticRemove.map((item) => {
                      //   if (models[item] === 'array') {
                      //     return `${item}[0]`;
                      //   }
                      //   return item;
                      // });
                      dtovariable = staticRemove.join('.')
                      if(dtovariable.includes('.items.')){
                        dtovariable = dtovariable.replaceAll('.items.','[0].')
                      }  
                      targetpath.push(dtovariable)
                    }
                    else {
                      dtovariable = targetHandle
                      targetpath.push(dtovariable)
                    }
          
                  }       
                  sourcekey = sourcekey.filter((item, index) => sourcekey.indexOf(item) === index)   
                  for (let l = 0; l < loopingkey.length; l++) {
                    var routearr:any = []
                    for (let m = 0; m < targetpath.length; m++) {
                      if (targetpath[m].includes(loopingkey[l])) {                     
                        routearr.push(rootarr[m])
                      }
                    }
                  }
                  
                  let edges = {}
                  edges['sourcepath'] = sourcepath
                  edges['targetpath'] = targetpath       
                  if( edges['targetpath']?.length > 0){
                    for (let k = 0; k < edges['targetpath'].length; k++) {
                     if(edges['targetpath'][k].startsWith('items.')){
                      edges['targetpath'][k] = edges['targetpath'][k].replace('items.','')
                     }
                  }
                }
                 
                  var finalRes = {}
                  var rootpatharr = await this.findCommonRoot(edges['targetpath'])
                  //console.log('rootpatharr',rootpatharr);

                       edges['targetpath'] = edges['targetpath'].map(path =>
                    path.startsWith(rootpatharr + ".") ? path.slice(rootpatharr.length + 1) : path
                  );
                  //console.log('edges',edges);   

                  this.logger.log('edges',edges)

                  var demo = JSON.parse(await this.transformData(edges, inputparam))     
                  //console.log('demo',demo); 
                   if(rootpatharr){
                    if(rootpatharr.includes('[0]')){
                      rootpatharr = rootpatharr.replaceAll('[0]','')                  
                    }  
                    finalRes[rootpatharr] = demo
                  }else{
                    finalRes = demo
                  }
                
                  if(finalRes)
                   await this.CommonService.getTPL(processedKey, upId,  poNode[j], 'Success', token, currentFabric, sourceStatus,inputparam,finalRes) 
                                   
                  await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ "PID": upId, "TID": nodeId, "EVENT": targetStatus }))
                
                  this.logger.log('DataSet Node Completed')  
                  //console.log('finalRes12345',finalRes);
                  
                  // return finalRes  
                  return { status: 200, targetStatus: targetStatus, data: rootpatharr ? [finalRes] : finalRes,}

                }else{
                  throw `Data Mapping not found for ${poNode[j].nodeName}`
                }
              }
            } catch (error) {
              console.log('ERROR',error);
              
              await this.CommonService.getTPL(processedKey,upId,poNode[j],'Failed',token,currentFabric,sourceStatus,inputparam,error)
              //console.log("TID", nodeId);
              await this.redisService.setStreamData(failureQueue,collectionName + '-TASK - '+upId,JSON.stringify({"PID":upId,"TID":nodeId,"EVENT":failureTargetStatus}))
              throw error
            }
          }
      }    
  }

   async setfileKeys(config:any,operationName:string,folderPath: string,fileName:string,insertData?:any){
    try {
      let fileUrl

      if(folderPath) fileUrl = `${config.url}/${folderPath}/${fileName.endsWith('.json') ? fileName : `${fileName}.json`}`;
      else fileUrl = `${config.url}/${fileName.endsWith('.json') ? fileName : `${fileName}.json`}`;
        let auth = {
            username: config.username,
            password: config.password
        }
       console.log('fileUrl',fileUrl);

       if(operationName == 'read'){
         const existing = await axios.get(fileUrl, {auth});
        
         if(existing?.data) return existing?.data
         
       }else if(operationName == 'write' && insertData){
        
        const buffer = Buffer.from(JSON.stringify(insertData, null, 2), 'utf-8');

        // Upload
        const form = new FormData();
        form.append('file', Readable.from(buffer), {
          filename: fileName.endsWith('.json') ? fileName : `${fileName}.json`,
          contentType: 'application/json',
        });

        const response = await axios.post(fileUrl, form, {
          headers: {...form.getHeaders()},
          auth,
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        });
        console.log('seasweed set',response);

        return {
          status: response.status,
          fileName: fileName
        };

       }
       
    
    }catch (error) {
      throw error
    }
  } 

  async appendWhereClause(baseQuery: string,condition: string,) {
    const query = baseQuery.trim();
    const lower = query.toLowerCase();

    // Keywords to look for
    const keywords = [' order by ', ' group by ', ' limit '];

    // Find the first keyword in order of appearance
    let firstKeywordIndex = -1;
    let keywordFound = '';

    for (const keyword of keywords) {
      const index = lower.indexOf(keyword);
      if (index !== -1 && (firstKeywordIndex === -1 || index < firstKeywordIndex)) {
        firstKeywordIndex = index;
        keywordFound = keyword;
      }
    }

    const mainQuery =
      firstKeywordIndex !== -1 ? query.substring(0, firstKeywordIndex) : query;
    const trailingQuery =
      firstKeywordIndex !== -1 ? query.substring(firstKeywordIndex) : '';

    // Append WHERE or AND
    const modifiedQuery = mainQuery.toLowerCase().includes(' where ')
      ? `${mainQuery} AND ${condition}`
      : `${mainQuery} WHERE ${condition}`;

    return `${modifiedQuery}${trailingQuery}`;
  }

  async checkEncryption(nodeInfo){
    try {     
      if(nodeInfo?.action?.encryption){
        let isEncrypted:any = nodeInfo?.action?.encryption
        if(isEncrypted?.isEnabled){
          return {selectedDpd:isEncrypted.selectedDpd,encryptionMethod:isEncrypted.encryptionMethod}
        }
      }
    } catch (error) {
      throw error
    }
  }

  async transformData(edges,dataSets): Promise< any> {
    
    const mappingConfig: MappingConfig = await this.createMappingConfig(edges,dataSets)
    //console.log('mappingConfig',mappingConfig);
    
    const stripIndexes = (path: string) => path.replace(/\[\d+\]/g, '');
  
    const setValueRecursively = (obj: Record<string, any>, path: string, value: any) => {
      const levels = path.split('.');
    
      if (levels.length === 1) {
        // If it's the final level, just set the value
        _.set(obj, path, value);
      } else {
        const currentKey = levels[0];
        const remainingPath = levels.slice(1).join('.');
        let currentValue = _.get(obj, currentKey, {}); // Get current value (object or array)
    
        if (Array.isArray(currentValue)) {
          // If it's an array, handle it like an array, but recursively
          if (remainingPath) {
            currentValue.forEach((item, idx) => {
              setValueRecursively(item, remainingPath, value);
            });
          } else {
            // If there's no remaining path, just set the value at the array level
            currentValue = value;
          }
        } else if (typeof currentValue === 'object' && currentValue !== null) {
          // If it's an object, recurse into it
          setValueRecursively(currentValue, remainingPath, value);
        } else {
          // Otherwise just set the value directly
          _.set(obj, path, value);
        }
    
        // Finally, ensure the object is updated in the parent
        _.set(obj, currentKey, currentValue);
      }
    };
    
    // Function to transform the data based on the mapping configuration
    const transformData = (data: any[], mapping: Record<string, any>): any[] => {
      return data.map((item) => {
        const transformedItem: Record<string, any> = {};
    
        for (const [targetPath, mapEntry] of Object.entries(mapping)) {
          const cleanTargetPath = stripIndexes(targetPath); // Clean the path to remove array indices
    
          if (typeof mapEntry === 'string') {
            // Handle simple mappings
            const value = _.get(item, mapEntry, null);
            setValueRecursively(transformedItem, cleanTargetPath, value);
          } else if (typeof mapEntry === 'object' && mapEntry.sourcePath) {
            // Handle array mappings
            const arrayData = _.get(item, mapEntry.sourcePath, []);
            const mappedArray = arrayData.map((entry: any) => {
              const mappedObj: Record<string, any> = {};
              for (const [targetKey, sourceKey] of Object.entries(mapEntry.arrayMap)) {
                const value = _.get(entry, sourceKey, null);
                _.set(mappedObj, targetKey, value);
              }
              return mappedObj;
            });
    
            // Handle dynamic mapping for arrays, including nested objects/arrays
            setValueRecursively(transformedItem, cleanTargetPath, mappedArray);
          }
        }
    
        return transformedItem;
      });
    };  
      let transformedData = transformData(dataSets, mappingConfig);
      //return JSON.stringify(transformedData, null, 2);
  //console.log("mappingConfig",mappingConfig);

      //const transformedData = dataset.data.map(item => transformData(item, mappingConfig));
      const cleanedData = this.processJson(transformedData);
      return JSON.stringify(cleanedData, null, 2);
    }

       async createMappingConfig(edges, dataSets) {
      const mappingConfig = {};
      const arrayFields = new Set();             
      
      function traverse(obj, path = "") {
        if (Array.isArray(obj)) {        
          const isArrayOfObjects = obj.every(item => typeof item === 'object');
          
          if(isArrayOfObjects){
            arrayFields.add(path);
            if (obj.length > 0) {
              traverse(obj[0], path);
            }
          }
        } else if (typeof obj === "object" && obj !== null) {         
          for (const key of Object.keys(obj)) {
            // console.log('key',key);
            const newPath = path ? `${path}.${key}` : key;
            traverse(obj[key], newPath);
            // console.log('newPath',newPath);
            // edges.targetpath.forEach((target) => {
            //   if(target.includes('.')){
            //     traverse(obj[key], newPath);
            //   }
            // });           
          }
        }
      }

     
      dataSets.forEach((singleDataset) => traverse(singleDataset));
   
      edges.sourcepath.forEach((source, index) => {
        const target = edges.targetpath[index];
        if(source.includes('.')){
          
          const sourceParts = source.split(".");
          const targetParts = target.split(".");
          const arrayKey = targetParts.length>1?targetParts.slice(0, -1).join("."):targetParts[0];
         
            //console.log('arrayKey',arrayKey);
            //console.log('arrayFields',arrayFields);
            //console.log('sourceParts[0]',sourceParts[0]);
            // console.log('mappingConfig..',mappingConfig);    
  
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
        }else {        
          mappingConfig[target] = source;
        }
      });
   
      return mappingConfig;
    }
  
    async mergingDataSet(dataSets){ 
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
        return obj.flat().map((item) => this.removeNestedArrays(item)); // Flatten & process
      } else if (typeof obj === 'object' && obj !== null) {
        return Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [key, this.removeNestedArrays(value)]),
        );
      }
      return obj; // Return primitive values
    }
  
    processJson(data: any): any {
      return this.removeNestedArrays(data);
    }          
    
    async findCommonRoot(paths: string[]): Promise<any> {
      if (!paths.length) return ""; 
      // if(paths.includes('.')){
      let commonRoot = [];
        const splitPaths = paths.map(path => path.length>1 && path.includes('.')?path.split("."):'');
        if(splitPaths){
          const minLength = Math.min(...splitPaths.map(p => p.length));     
        // if(minLength>1){
          for (let i = 0; i < minLength; i++) {
            const segment = splitPaths[0][i];
            if (splitPaths.every(p => p[i] === segment)) {
              commonRoot.push(segment);
            } else {
              break;
            }
          }
        }      
     // }    
      return commonRoot.join(".");
      // }
    }


    reorderTargetPaths(edges, schema): any {
      let NewSrcEdge = []
 
      const generatedSchemaPaths: string[] = [];
      this.extractPathsFromSchema(schema, '', generatedSchemaPaths);
   
      const orderedPaths = generatedSchemaPaths.filter(path => edges.targetpath.includes(path));
   
      for (let j = 0; j < orderedPaths.length; j++) {
        if (edges.targetpath.indexOf(orderedPaths[j]) != -1) {
          NewSrcEdge.push(edges.sourcepath[edges.targetpath.indexOf(orderedPaths[j])])
        }
      }
      return { sourcepath: NewSrcEdge, targetpath: orderedPaths }
    }
         
    private extractPathsFromSchema(schemaNode: any, currentPath: string, collectedPaths: string[]) {
      if (!schemaNode || typeof schemaNode !== 'object') return;
 
      const type = schemaNode.type;
 
      if (type === 'object' && schemaNode.properties) {
        for (const [key, propSchema] of Object.entries(schemaNode.properties)) {
          const nextPath = currentPath ? `${currentPath}.${key}` : key;
          this.extractPathsFromSchema(propSchema, nextPath, collectedPaths);
        }
      } else if (type === 'array' && schemaNode.items) {
        const arrayPath = `${currentPath}[0]`; // insert [0] after arrays
        this.extractPathsFromSchema(schemaNode.items, arrayPath, collectedPaths);
      } else {
        if (currentPath) {
          collectedPaths.push(currentPath);
        }
      }
    }

    extractDataWithArrayExpansion(data: any, targetPaths: string[]): any {
      const result = {};

      for (const path of targetPaths) {
        const match = path.match(/(.+)\[0\]\.(.+)/); // detect array template
        if (match) {
          const arrayPath = match[1]; // e.g. 'Account.AccountIdentifiers'
          const remainingPath = match[2]; // e.g. 'SchemeName'

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
}