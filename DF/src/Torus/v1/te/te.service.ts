import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { pfDto, PoEvent } from "src/dto";
import { RedisService } from "src/redisService";
import { firstValueFrom } from 'rxjs';
const  Xid = require('xid-js');
import { ClientProxy } from '@nestjs/microservices';
import * as Minio from 'minio';
import { SecurityService } from "src/securityService";
import { CommonService } from "src/common.Service";
import { AxiosRequestConfig } from "axios";
const { convert } = require("json-to-json-schema");

@Injectable()
export class TeService {
    constructor(@Inject('PO') private readonly poClient: ClientProxy,
    private readonly redisService:RedisService,   
    private readonly securityService:SecurityService,
    private readonly teCommonService:CommonService,
   ){}
   private readonly logger = new Logger(TeService.name) 

   
   
    async EventEmitter(pfdto: pfDto,node?){   
    var tenant = await this.teCommonService.splitcommonkey(pfdto.key,'CK')
    var app = await this.teCommonService.splitcommonkey(pfdto.key,'AFGK')
    try {
      this.logger.log("Event Emmiter Started....")        
      var event; 
      let pid;  
      var invalidEventFlg = 0 
      var flg = 0
      var mergearr = []
      var prevres = {}
      var refflag;  
      var ufkey ;
      var keyname;   
      var ufname ; 
 
      var logtype = process.env.LOGTYPE
      var currentFabric = pfdto.key.split('FNK')[1].split(':')[1] 
      var fngkKey = pfdto.key.split('FNGK')[1].split(':')[1]
      if (pfdto.key.includes(fngkKey)) {
        var processedKey = pfdto.key.replace(fngkKey, fngkKey + 'P')
      }

      var artifact = await this.teCommonService.splitcommonkey(pfdto.key,'AFK')
      if(currentFabric == 'PF-PFD'){
        var node = await this.securityService.getSecurityTemplate(pfdto.key+'PO',pfdto.token)
        var pfjson = JSON.parse(await this.redisService.getJsonData(pfdto.key + 'PFS'));
        // var poArtifact = JSON.parse(await this.redisService.getJsonDataWithPath(pfdto.key + 'PO', '.mappedData.artifact'));  
        var poJson = JSON.parse(await this.redisService.getJsonData(pfdto.key + 'PO'));  
     
        var hlrId = (pfdto.sourceId?.split('|')[2])
        if(pfdto.sourceId){
          var hlrId = (pfdto.sourceId?.split('|')[2])
          if(hlrId.includes('/')){
          var sourceId = ((hlrId.split('/'))[hlrId.split('/').length-1]).replaceAll('.','') 
        
          }else{
          var sourceId = hlrId.replaceAll('.','')
          }
        }
      }else{
        if(await this.redisService.exist(pfdto.key + 'DFO')){
          var node = await this.securityService.getSecurityTemplate(pfdto.key+'DO',pfdto.token)    
          var dfo:any = JSON.parse(await this.redisService.getJsonData(pfdto.key + 'DFO')) 
          if(dfo?.length == 0){
            var tslerror = await this.teCommonService.getTSL(pfdto.key,pfdto.token,'DFO was empty',400,mode)
            throw tslerror
          }
        }  
        var pfjson = JSON.parse(await this.redisService.getJsonData(pfdto.key + 'DFS'));
        // var poArtifact = JSON.parse(await this.redisService.getJsonDataWithPath(pfdto.key + 'DO', '.mappedData.artifact'));
        var poJson = JSON.parse(await this.redisService.getJsonData(pfdto.key + 'DO'));  

        var dstkey = processedKey.replace('DF-DFD','DF-DST')
      }
    
      refflag = pfdto.refreshFlag?pfdto.refreshFlag:'N'

      //var poNode = poArtifact.node 
      var poNode = poJson?.mappedData?.artifact?.node
      if(!poNode || poNode.length == 0) throw 'Nodes not found'     
      
      var Ndp = JSON.parse(await this.redisService.getJsonData(pfdto.key + 'NDP'));
      var afi = JSON.parse(await this.redisService.getJsonData(pfdto.key + 'AFI'))
      if (afi != null && afi?.executionMode)
        var mode = afi.executionMode
      else      
        mode = 'E'    
     
      //Rule,code,event in Artifact level
      //var RCMresult:any = await this.teCommonService.getRuleCodeMapper(poArtifact,pfdto.data,currentFabric) 
      // console.log('SEARC',RCMresult);      
      //let zenresult = RCMresult?.rule
     // let customcoderesult = RCMresult?.code 

      let eflg = 0;
      // nodeid validation
      for (var e = 0; e < poNode.length; e++) {        
        if(pfdto.nodeId){
          if(pfdto.nodeId == poNode[e].nodeId){         
              if(poNode[e].events.length>0){
                for(let k=0;k < poNode[e].events.length;k++){
                  if(pfdto.event != poNode[e].events[k].source.status){                 
                    eflg++
                  }
                }
                if(eflg == poNode[e].events.length)
                  throw 'Event and nodeId mismatched'
              }else{
                throw 'events are empty'
              } 
            //} 
          }else{
            flg++
          }        
        }
        if(poNode[e].nodeType != 'startnode' && poNode[e].nodeType != 'endnode'){
          if(currentFabric == 'PF-PFD'){
            if(poNode[e].events.length>0){
              for(let k=0;k < poNode[e].events.length;k++){
                if(!poNode[e].events[k].source.status){ 
                  throw 'Event source status does not exist in '+poNode[e].nodeName
                }}}else{
                   throw 'events are empty'
                }
              }
                else{
                  if(!poNode[e].events.sourceStatus){
                    throw 'Event source status does not exist in '+poNode[e].nodeName
                  }
                }         
        }
      }
      if(flg == poNode.length){
        throw 'Invalid nodeId'
      }

       if(pfdto.upId){
         if(pfdto.nodeId == poNode[1].nodeId){  
              pfdto.upId = null
            }
         pid = pfdto.upId 
         prevres = JSON.parse(await this.redisService.getJsonData(processedKey+pfdto.upId+':previousResponse')) 
      }      
   
      this.logger.log(pfdto.upId)     
      
      for (var i = 0; i < poNode.length; i++) {
        if (!pfdto.nodeId) {
          pfdto.nodeId = poNode[i].nodeId
        }
        // if (!pfdto.nodeName) {
        //   pfdto.nodeName = poNode[i].nodeName
        // }
        if (!pfdto.nodeType) {
          pfdto.nodeType = poNode[i].nodeType
        }

        let srcQueue;        
        var srcStatus;
        var staticQueue = currentFabric == 'PF-PFD'?'TPH':'TDH'       

        if (poNode[i].nodeType == 'startnode') {
          this.logger.log('Start node')   
          if (currentFabric == 'DF-DFD') {
            if (poNode[1].events.sourceStatus) {
              if (!pfdto.upId) pfdto.upId = Xid.next();
              await this.pfPreProcessor(processedKey, pfjson, pfdto.upId,currentFabric);
              srcQueue = poNode[1].events.sourceQueue;
              pfdto.event = poNode[1].events.sourceStatus;
              pfdto.nodeId = null;
              pfdto.nodeType = null;
              if (!srcQueue) srcQueue = staticQueue;
              await this.redisService.setStreamData(srcQueue,'TASK - ' + pfdto.upId,JSON.stringify({PID: pfdto.upId,TID: pfdto.nodeId,EVENT: pfdto.event}));
              await this.teCommonService.getTPL(processedKey,  pfdto.upId,mode,poNode[i],'Success', pfdto.token,'PF');
          
            }
          } else {
            if (poNode[i].nodeType == 'startnode' && pid == undefined) {
              let srcIdFlag = 0
              for (let e = 0; e < poNode[1].events.length; e++) {
                if (poNode[1].events[e].eventType == 'UEH') {
                  ufkey = poNode[1].events[e].sourceId.split('|')[0];
                  keyname = ufkey.split(':')  
                  ufname = ((keyname[1]+keyname[5]+keyname[7]+keyname[9]+ keyname[11]+ keyname[13]).replace(/[-_]/g, '')).replace(/\s+/g, '');
                  var sourceid = poNode[1].events[e].sourceId.split('|')[2];
                  if (sourceid.includes('/')) {
                    var handlerId = sourceid
                      .split('/')
                      [sourceid.split('/').length - 1].replaceAll('.', '');
                  } else {
                    var handlerId = sourceid.replaceAll('.', '');
                  }
                }else{
                  ufkey = pfdto.key
                  keyname = ufkey.split(':')  
                  ufname = ((keyname[1]+keyname[5]+keyname[7]+keyname[9]+ keyname[11]+ keyname[13]).replace(/[-_]/g, '')).replace(/\s+/g, '');
                 sourceId = poNode[i].events[e].id.replaceAll('-','')   
               }
                if(pfdto.event == poNode[1].events[e].source.status.trim() && sourceId == handlerId){
                  var srcStatus = poNode[1].events[e].source.status.trim();
                  srcQueue = poNode[1].events[e].source.queue;
                }else{
                  srcIdFlag++                  
                }
              } 
              if(srcIdFlag == poNode[1].events.length){
                throw 'Event and sourceId mismatched'
              }

              //  if (pfdto.event == poNode[1].events.sourceStatus) {
              if (srcStatus) {
                if (!pfdto.upId) pfdto.upId = Xid.next();
                await this.pfPreProcessor(processedKey, pfjson, pfdto.upId,currentFabric);
              }

              if (!srcQueue) srcQueue = staticQueue;
              await this.redisService.setStreamData(
                srcQueue,
                'TASK - ' + pfdto.upId,
                JSON.stringify({
                  PID: pfdto.upId,
                  TID: pfdto.nodeId,
                  EVENT: pfdto.event,
                }),
              );
              await this.teCommonService.getTPL(processedKey,pfdto.upId,mode,poNode[i],'Success',pfdto.token,'PF');
            }
          }  
        }

        else if (poNode[i].nodeType == 'humantasknode' && poNode[i].nodeId == pfdto.nodeId )  {
          this.logger.log('Human Task node started')
          if(pfdto.upId){
           if(sourceId){ 
            if(poNode[i].events.length > 0) {
              for(let e=0;e < poNode[i].events.length;e++){ 
                if(poNode[i].events[e].eventType == 'UEH')  {  
                   ufkey = (poNode[i].events[e].sourceId).split('|')[0]
                   keyname = ufkey.split(':')  
                   ufname = ((keyname[1]+keyname[5]+keyname[7]+keyname[9]+ keyname[11]+ keyname[13]).replace(/[-_]/g, '')).replace(/\s+/g, '');         
                var sourceid = ((poNode[i].events[e].sourceId).split('|')[2])
                if(sourceid.includes('/')){
                  var handlerId = ((sourceid.split('/'))[sourceid.split('/').length-1]).replaceAll('.','') 
               }else{
                 var handlerId = sourceid.replaceAll('.','')
               }
                }                          
                if(pfdto.event == poNode[i].events[e].source.status.trim() && sourceId == handlerId){
                   var srcstatus = poNode[i].events[e].source.status.trim()
                   break;
                  //var srcQueue = poNode[i].events[e].source.queue
                }
              }
            }else{
              throw 'events key is empty'
            }         
           
           }else{
            srcstatus = poNode[i].events[0].source.status.trim()
           }           
          //Node level security check
          var nodedetails = await this.securityService.getNodeSecurityTemplate(node, poNode[i].nodeName)
          if(nodedetails?.status == '200') {             
            if (pfdto.event == null && event == srcstatus) {            
             
               // for(let x=0;x< pfjson.length;x++){
              //   if(pfjson[x].nodeId == pfdto.nodeId){
              //     var parentID = pfjson[x].T_parentId[0]
              //   }
              //  }
              //   for(let y=0;y< pfjson.length;y++){
              //   if(pfjson[y].nodeId == parentID){
              //     var ndname = pfjson[y].nodeName
              //   }
              //  }
              if(await this.redisService.exist(processedKey + pfdto.upId + ':previousResponse')){
                var npvdata = JSON.parse(await this.redisService.getJsonData(processedKey + pfdto.upId + ':previousResponse')) 
              } 
                npvdata['upId'] = pfdto.upId
                 await this.teCommonService.prcLog(tenant+'-'+app+'-TPL')              
               return { upId: pfdto.upId, message: `Awaiting for: ${poNode[i].nodeName}`,event:event,insertedData:npvdata }
            } 
                      
              if(pfdto.event == srcstatus){
           // if (pfdto.event == poNode[i].events.sourceStatus) {
             
              if (pfdto.data) {
                if (Object.keys(pfdto.data).length == 0) {
                  throw 'Data should not be Empty'
                } else {                  
                  //Setting PIDlogs for accessing Data
                   var npvdata = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + pfdto.upId + ':NPV:'+poNode[i].nodeName+'.PRO','.request')) 
                 
                   
                   if(pfdto.data['childData']){
                    await this.redisService.setJsonData(processedKey + pfdto.upId + ':NPV:'+poNode[i].nodeName+'.PRO', JSON.stringify(pfdto.data['childData']),'response')
                   
                  }
                  else{                  
                    await this.redisService.setJsonData(processedKey + pfdto.upId + ':NPV:'+poNode[i].nodeName+'.PRO', JSON.stringify(pfdto.data),'response')
                  }  
                   if(npvdata && Object.keys(npvdata).length>0){
                    pfdto.data = { ...npvdata, ...pfdto.data }
                    await this.redisService.setJsonData(processedKey + pfdto.upId + ':NPV:'+poNode[i].nodeName+'.PRO', JSON.stringify(pfdto.data),'request')
                   
                  }else{
                    await this.redisService.setJsonData(processedKey + pfdto.upId + ':NPV:'+poNode[i].nodeName+'.PRO', JSON.stringify(pfdto.data),'request')                    
                  }                   

                  //Setting Up Node response          
                  var nodeObjArr = []
                  nodeObjArr.push({
                    nodeName: poNode[i].nodeName,
                    nodeId: pfdto.nodeId,
                    nodeType: pfdto.nodeType,
                    sourceStatus: pfdto.event,
                    timeStamp: new Date().toString(),
                    currentStatus: "Failed"
                  })

                  if (await this.redisService.exist(processedKey + pfdto.upId + ':nodeResponse')) {
                    await this.redisService.AppendJsonArr(processedKey + pfdto.upId + ':nodeResponse', JSON.stringify(nodeObjArr[0]))
                  }
                  else {
                    await this.redisService.setJsonData(processedKey + pfdto.upId + ':nodeResponse', JSON.stringify(nodeObjArr))
                  }

                  // Event Emmiting logic
                
                  var eventResponse = await firstValueFrom(this.poClient.send(
                    ufname+'_'+poNode[i].nodeId+'_'+sourceId+'_'+pfdto.event,
                    new PoEvent(pfdto.key, pfdto.upId, pfdto.event, pfdto.data, pfdto.token, pfdto.nodeId, poNode[i].nodeName, pfdto.nodeType,refflag),
                  ))
                 
                  if(eventResponse == undefined){throw 'Event Response is undefined'}
 
                  if (!eventResponse.status && eventResponse.status != 200) {                                                
                    throw eventResponse
                  }
                  console.log(`${eventResponse.targetStatus} Event emitted successfully by ${poNode[i].nodeName}`);

                  //Change current status to success  
                  var getNodeResponse = JSON.parse(await this.redisService.getJsonData(processedKey + pfdto.upId + ':nodeResponse'))              
                  for (var s = 0; s < getNodeResponse.length; s++) {
                    if (getNodeResponse[s].nodeId == pfdto.nodeId) {
                      await this.redisService.setJsonData(processedKey + pfdto.upId + ':nodeResponse', '"Success"', '[' + s + '].currentStatus')
                    }
                  }
                  //breakPoint logic
                  if (mode == 'D' && Ndp[poNode[i].nodeId].breakPoint == 'Y') {
                    return { key: pfdto.key, processedKey: processedKey + pfdto.upId, upId: pfdto.upId, tId: pfdto.nodeId, nodeName: poNode[i].nodeName, targetStatus: eventResponse.targetStatus }
                  }

                  nodeObjArr = null
                  pfdto.data = null
                  pfdto.event = null
                  pfdto.nodeId = null
                 // pfdto.nodeName = null
                  pfdto.nodeType = null
                  event = eventResponse.targetStatus
                  sourceId = null
                }
              }
            }else{  
              pfdto.nodeId = null
              //pfdto.nodeName = null
              pfdto.nodeType = null            
              invalidEventFlg++
            }
          //}

          } else {
            throw nodedetails
          }
        }else{
          throw 'Process Id not found'
        }
        }

      else if(poNode[i].nodeType == 'datasetnode' && poNode[i].nodeId == pfdto.nodeId ){//&& poNode[i].nodeId == pfdto.nodeId

          var Config: any = JSON.parse(await this.redisService.getJsonDataWithPath(pfdto.key + 'NDP', '.' + poNode[i].nodeId))   
          var srcstatus = poNode[i].events?.sourceStatus
          var schema = Config?.data  
          if(!schema){throw 'Schema is undefined'}       
          
          pfdto.data =  mergearr 

          //Setting Up Node response    
          var nodeObjArr = []
          nodeObjArr.push({
            nodeName: poNode[i].nodeName,
            nodeId: pfdto.nodeId,
            nodeType: pfdto.nodeType,
            sourceStatus: event,
            timeStamp: new Date().toString(),
            currentStatus: "Failed"
          })

          if (await this.redisService.exist(processedKey + pfdto.upId + ':nodeResponse')) {
            await this.redisService.AppendJsonArr(processedKey + pfdto.upId + ':nodeResponse', JSON.stringify(nodeObjArr[0]))
          }
          else {
            await this.redisService.setJsonData(processedKey + pfdto.upId + ':nodeResponse', JSON.stringify(nodeObjArr))
          }

          console.log('event', event);
          console.log('srcstatus', srcstatus);
          
          if (event == srcstatus) {
            var eventResponse = await firstValueFrom(this.poClient.send
              (artifact + '_' + poNode[i].nodeId + '_' + event,
              new PoEvent(pfdto.key,pfdto.upId,event,pfdto.data,pfdto.token,pfdto.nodeId,poNode[i].nodeName,pfdto.nodeType,refflag)));
  
            // return eventResponse
           
            //Change current status to success   
            var getNodeResponse = JSON.parse(await this.redisService.getJsonData(processedKey + pfdto.upId + ':nodeResponse'))
            for (var s = 0; s < getNodeResponse.length; s++) {
              if (getNodeResponse[s].nodeId == pfdto.nodeId) {
                await this.redisService.setJsonData(processedKey + pfdto.upId + ':nodeResponse', '"Success"', '[' + s + '].currentStatus')
              }
            }
            nodeObjArr = null
            pfdto.data = null
            pfdto.event = null
            pfdto.nodeId = null           
            pfdto.nodeType = null
            event = eventResponse.targetStatus
            sourceId = null
          }else{
            pfdto.nodeId = null
            pfdto.nodeType = null
          }
        }

        else {         
          this.logger.log(`${poNode[i].nodeType} started`)
          //Node level security check
          if(pfdto.upId){
          
            if (poNode[i].nodeId == pfdto.nodeId) {
              if (poNode[i].nodeType != 'endnode') {
                var nodedetails = await this.securityService.getNodeSecurityTemplate(node, poNode[i].nodeName)
                if(Array.isArray(poNode[i].events)){
                  if(poNode[i].events.length>0){
                  for(let e=0;e < poNode[i].events.length;e++){                  
                    if(event || pfdto.event == poNode[i].events[e].source.status ){
                      var srcstatus = poNode[i].events[e].source.status  
                      if(poNode[i].events[e].eventType == 'UEH') { 
                      //sourceId = ((poNode[i].events[e].sourceId).split('|')[2]).split('.')[0] 
                       ufkey = (poNode[i].events[e].sourceId).split('|')[0]
                       keyname = ufkey.split(':')  
                       ufname = ((keyname[1]+keyname[5]+keyname[7]+keyname[9]+ keyname[11]+ keyname[13]).replace(/[-_]/g, '')).replace(/\s+/g, '');
                      var handlerid = ((poNode[i].events[e].sourceId).split('|')[2])
                      if(handlerid.includes('/')){
                        sourceId = ((handlerid.split('/'))[handlerid.split('/').length-1]).replaceAll('.','') 
                     }else{
                       sourceId = handlerid.replaceAll('.','')
                     }
                      }
                      else{
                         ufkey = pfdto.key
                         keyname = ufkey.split(':')  
                         ufname = ((keyname[1]+keyname[5]+keyname[7]+keyname[9]+ keyname[11]+ keyname[13]).replace(/[-_]/g, '')).replace(/\s+/g, '');
                        sourceId = poNode[i].events[e].id.replaceAll('-','')   
                      }
                                     
                      srcQueue = poNode[i].events[e].source.queue
                    }}}
                }else{
                  var srcstatus = poNode[i].events?.sourceStatus
                  srcQueue = poNode[i].events.sourceQueue
                }
                
                if(currentFabric == 'DF-DFD'){
                  var Config: any = JSON.parse(await this.redisService.getJsonDataWithPath(pfdto.key + 'NDP', '.' + poNode[1].nodeId))                 
                  var link = Config?.data?.pro?.linkParam
                }
                
                  if (!srcQueue)
                    srcQueue = staticQueue
                  if(currentFabric == 'DF-DFD'){
                  var dfoSchema: any
                  var dfoColumn: any = []
                  for (let item of dfo) {
                    if (item.nodeId == pfjson[i].nodeId) {
                      if (item.schema){
                        dfoSchema = item.schema
                        if(dfoSchema && dfoSchema.length>0){
                          for(let d=0;d < dfoSchema.length;d++){
                            dfoColumn.push(dfoSchema[d].name)
                          }
                        }
                      }
                    }
                  }  
                  var objlevelChk = await this.securityService.getObjectSecurityTemplate(nodedetails?.data,dfoColumn)
             
                  // var ifoarr = await this.getIfoSet(poNode[i],Ndp) 
                }                
              }

              if (nodedetails?.status == '200') {
                //End node returning logic
                if (poNode[i].nodeType == 'endnode') {
                  var getNodeResponse = JSON.parse(await this.redisService.getJsonData(processedKey + pfdto.upId + ':nodeResponse'))
                  if (getNodeResponse != null) {
                    let flg = 0
                    var arr =[]
                    for (var pfs = 0; pfs < pfjson.length; pfs++) {
                      var levelkey = Ndp[pfjson[pfs].nodeId]?.data?.pro?.levelKeyName
                      arr.push(levelkey)
                     
                      if (getNodeResponse[getNodeResponse.length - 1].nodeId == pfjson[pfs].nodeId) {
                        var routeArray = pfjson[pfs].routeArray                       
                        for (var r = 0; r < routeArray.length; r++) {
                          if (routeArray[r].nodeName == 'End') {
                            if (!srcQueue)
                              srcQueue = staticQueue   
                            await this.redisService.setStreamData(srcQueue, 'TASK - ' + pfdto.upId, JSON.stringify({ "PID": pfdto.upId, "TID": pfdto.nodeId, "EVENT": 'ProcessCompleted' }))
                            await this.teCommonService.getTPL(processedKey, pfdto.upId, mode, poNode[i], 'Success', pfdto.token, currentFabric)
                            if (currentFabric == 'PF-PFD'){                              
                              await this.teCommonService.prcLog(tenant+'-'+app+'-TPL') 
                              await this.redisService.deleteKey(tenant+'-'+app+'-TPL') 
                              await this.redisService.deleteKey(tenant+'-'+app+'-TSL')                              
                              return { upId: pfdto.upId, message: 'Success', event: 'ProcessCompleted' }
                            }else{                              
                              var obj = {}
                              if(eventResponse){
                                  var FinalEvent
                                  if(eventResponse.targetStatus){
                                    FinalEvent = eventResponse.targetStatus
                                  }else{
                                    FinalEvent = 'ProcessCompleted'
                                  }
                                  obj['key'] = pfdto.key
                                  if(eventResponse.data){
                                    obj['data'] = eventResponse.data
                                  }else{
                                    obj['data'] = eventResponse
                                  }
                                  await this.redisService.setJsonData(pfdto.key + 'DS_Schema', JSON.stringify(schema))
                                  await this.redisService.setJsonData(dstkey + 'DS_Object', JSON.stringify(obj))
                                  await this.teCommonService.prcLog(tenant+'-'+app+'-TPL') 
                                  await this.redisService.deleteKey(tenant+'-'+app+'-TPL') 
                                  await this.redisService.deleteKey(tenant+'-'+app+'-TSL') 
                                  return { status: 'Success',statusCode:201,processKey:dstkey,upId: pfdto.upId, message: 'Success',event: FinalEvent,dataset: obj }            
                              }
                            }                           
                          
                          } else {
                            flg++
                          }
                        } if (flg == routeArray.length) {
                          throw 'Event Mismatched'
                        }
                      }
                    }
                  } else
                    throw 'Invalid Request'
                }                           
              
                               
                // Reading event source queue
                if (await this.redisService.exist(srcQueue)) {
                  var grpInfo = await this.redisService.getInfoGrp(srcQueue)
                  if (grpInfo.length == 0) {
                    await this.redisService.createConsumerGroup(srcQueue, 'TaskGroup')
                  } else if (!grpInfo[0].includes('TaskGroup')) {
                    await this.redisService.createConsumerGroup(srcQueue, 'TaskGroup')
                  }

                  let streamData: any = await this.redisService.readConsumerGroup(srcQueue, 'TaskGroup', pfdto.event || event);
                  if (streamData != 'No Data available to read') {
                    for (var s = 0; s < streamData.length; s++) {
                      var msgid = streamData[s].msgid;
                      var data = streamData[s].data
                      if (event == JSON.parse(data[1]).EVENT) {
                        event = JSON.parse(data[1]).EVENT
                        await this.redisService.ackMessage(srcQueue, 'TaskGroup', msgid);
                      }
                    }
                  }
                }

                if (!event) {
                  event = pfdto.event
                }
               
                if (event == srcstatus) {
                  //if(currentFabric == 'DF-DFD'){
                  //  var Config: any = JSON.parse(await this.redisService.getJsonDataWithPath(pfdto.key + 'NDP', '.' + poNode[i].nodeId))
                   
                  //  var link = Config?.data?.pro?.linkParam
                  //}
                  if (!pfdto.data) {
                    pfdto.data = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + pfdto.upId + ':NPV:' + poNode[i].nodeName + '.PRO', '.request'))
                  }
                  //Setting Up Node response    
                  var nodeObjArr = []
                  nodeObjArr.push({
                    nodeName: poNode[i].nodeName,
                    nodeId: pfdto.nodeId,
                    nodeType: pfdto.nodeType,
                    sourceStatus: event,
                    timeStamp: new Date().toString(),
                    currentStatus: "Failed"
                  })

                  if (await this.redisService.exist(processedKey + pfdto.upId + ':nodeResponse')) {
                    await this.redisService.AppendJsonArr(processedKey + pfdto.upId + ':nodeResponse', JSON.stringify(nodeObjArr[0]))
                  }
                  else {
                    await this.redisService.setJsonData(processedKey + pfdto.upId + ':nodeResponse', JSON.stringify(nodeObjArr))
                  }

                  // Event Emmiting logic
                 

                  if(mergearr && mergearr.length > 0 && currentFabric == 'DF-DFD'){  
                    for(var m = 0; m < mergearr.length; m++){
                       var Confignode: any = JSON.parse(await this.redisService.getJsonDataWithPath(pfdto.key + 'NDP', '.' + poNode[1].nodeId))
                     if(Confignode.skipNode == 'Y'){
                       if(poNode[i-1].nodeName == poNode[2].nodeName){
                      await this.redisService.setJsonData(processedKey + pfdto.upId + ':NPV:' + poNode[1].nodeName+'.PRO', JSON.stringify(mergearr[m]), 'customResponse')
                    }
                     }else{
                       if(poNode[i-1].nodeName == poNode[1].nodeName){
                      await this.redisService.setJsonData(processedKey + pfdto.upId + ':NPV:' + poNode[1].nodeName+'.PRO', JSON.stringify(mergearr[m]), 'customResponse')
                    }
                     }  
                      pfdto.data = {link:link,data:mergearr[m]}
                      //console.log('mergeEvent', artifact+'_'+poNode[i].nodeId+'_'+event);
                      
                      var eventResponse = await firstValueFrom(this.poClient.send(
                        artifact+'_'+poNode[i].nodeId+'_'+event,
                    new PoEvent(pfdto.key, pfdto.upId, event, pfdto.data, pfdto.token, pfdto.nodeId, poNode[i].nodeName, pfdto.nodeType,refflag),
                  ))
                                     
                    if (eventResponse == undefined) { throw 'Event Response is undefined' }

                    if (!eventResponse.status || eventResponse.status != 200) {
                      throw eventResponse
                    }
                    console.log(`${eventResponse.targetStatus} Event emitted successfully by ${poNode[i].nodeName}`);

                  
                        if(eventResponse) {                      
                          let eventData = eventResponse?.data
                          //console.log('eventData',eventData);
                          
                          if(eventData){                            
                            if(Array.isArray(eventData) && eventData.length>0){
                              Object.assign(mergearr[m], {[poNode[i].nodeName]:eventData}); 
                            }   
                            else if(Object.keys(eventData).length >0){                        
                              Object.assign(mergearr[m], eventData); 
                            }
                          }   
                          
                        }    
                        //console.log('mergearr',mergearr);                 
                                         
                    }     
                    
                    await this.teCommonService.getTPL(processedKey,pfdto.upId,mode,poNode[i],'Success',pfdto.token,currentFabric,event)//apiUrl,dfoSchema
                  }
                  else{
                   
                    if (currentFabric == 'DF-DFD') { 
                      if(skipNodedata){
                        pfdto.data = skipNodedata
                      } 
                       console.log('Event', artifact+'_'+poNode[i].nodeId+'_'+event);
                      var eventResponse = await firstValueFrom(this.poClient.send(
                        artifact+'_'+poNode[i].nodeId+'_'+event,
                        new PoEvent(pfdto.key, pfdto.upId, event, pfdto.data, pfdto.token, pfdto.nodeId, poNode[i].nodeName, pfdto.nodeType,refflag),
                      ))

                      if (eventResponse == undefined) { throw 'Event Response is undefined' }

                      if (!eventResponse.status && eventResponse.status != 200) {
                        throw eventResponse
                      }
                      console.log(`${eventResponse.targetStatus} Event emitted successfully by ${poNode[i].nodeName}`);
                               

                        let eventData = eventResponse?.data 
                        if(eventData && Array.isArray(eventData) && eventData.length>0){                         
                          if(Config.skipNode == 'Y'){                           
                             var skipNodedata = { data: eventData[0]}; 
                          }else{
                          mergearr = eventData 
                          }                    
                        }
                        else if(eventData && Object.keys(eventData).length >0){
                          if(Config?.skipNode == 'Y'){
                            var skipNodedata = { data: eventData}; 
                          }else{
                            mergearr = [eventData]
                          }
                        }   
                      await this.teCommonService.getTPL(processedKey,pfdto.upId,mode,poNode[i],'Success',pfdto.token,currentFabric,event)//apiUrl,dfoSchema
                    }else{                       
                        var eventResponse = await firstValueFrom(this.poClient.send(
                          ufname+'_'+poNode[i].nodeId+'_'+sourceId+'_'+event,
                          new PoEvent(pfdto.key, pfdto.upId, event, pfdto.data, pfdto.token, pfdto.nodeId, poNode[i].nodeName, pfdto.nodeType,refflag),
                        ))
                        if(eventResponse.data && pfdto.nodeType == 'apinode'){
                          prevres[poNode[i].nodeId] = eventResponse.data
                         
                          await this.redisService.setJsonData(processedKey+pfdto.upId+':previousResponse',JSON.stringify(prevres))
                        }
                        if (eventResponse == undefined) { throw 'Event Response is undefined' }

                        if (!eventResponse.status && eventResponse.status != 200) {
                          throw eventResponse
                        }
                        console.log(`${eventResponse.targetStatus} Event emitted successfully by ${poNode[i].nodeName}`);
                    }                    
                                    
                  }               
                                                        
                         
                  //Change current status to success   
                  var getNodeResponse = JSON.parse(await this.redisService.getJsonData(processedKey + pfdto.upId + ':nodeResponse'))
                  for (var s = 0; s < getNodeResponse.length; s++) {
                    if (getNodeResponse[s].nodeId == pfdto.nodeId) {
                      await this.redisService.setJsonData(processedKey + pfdto.upId + ':nodeResponse', '"Success"', '[' + s + '].currentStatus')
                    }
                  }

                  //breakPoint logic
                  if (mode == 'D' && Ndp[poNode[i].nodeId].breakPoint == 'Y') {
                    return { key: pfdto.key, processedKey: processedKey + pfdto.upId, upId: pfdto.upId, tId: pfdto.nodeId, nodeName: poNode[i].nodeName, targetStatus: eventResponse.targetStatus }
                  }
                  nodeObjArr = null
                  pfdto.data = null
                  pfdto.event = null
                  pfdto.nodeId = null
                 // pfdto.nodeName = null
                  pfdto.nodeType = null
                  event = eventResponse.targetStatus
                  sourceId = null
                } else {
                  sourceId = null
                  pfdto.nodeId = null
                  //pfdto.nodeName = null
                  pfdto.nodeType = null
                  invalidEventFlg++
                }
              } else {
                throw nodedetails
              }
            }
          } else{
            throw 'Process Id not found'
          }      
        }
      }    
      
      if(invalidEventFlg == poNode.length-2){
        throw `${event} doesn't matched`
      } 
     
    } catch (error) {           
     console.log('PO ERROR:', error);     
      if(pfdto.upId){
        var nodeInfo 
        if(poNode[i]){
          nodeInfo = poNode[i]
        }else{
          nodeInfo = ''
        }
        var secError = await this.teCommonService.getTPL(processedKey, pfdto.upId,mode,nodeInfo, 'Failed', pfdto.token,currentFabric, '',pfdto.data,error)    
       
        await this.teCommonService.prcLog(tenant+'-'+app+'-TSL')       
        throw new BadRequestException(secError)
      }else{
        
        var tslerror = await this.teCommonService.getTSL(pfdto.key,pfdto.token,error,'')      
        // await this.teCommonService.expLogs(tenant+'-'+app+'-TSL')    
        await this.teCommonService.prcLog(tenant+'-'+app+'-TSL')        
        throw new BadRequestException (tslerror)
      }    
    }
   }

  async TSValidate(key,currentFabric,token){   
        this.logger.log("TS validate")
        var valarr: any = []  
        if(!await this.redisService.exist(key+'AFI')){
          await this.teCommonService.getTSL(key,token,'ArtifactInfo does not exist',400,'') 
          valarr.push({'error':'ArtifactInfo does not exist'})
        }else{
          var afiJson = await this.redisService.getJsonData(key+'AFI')
          if(!afiJson){
            await this.teCommonService.getTSL(key,token,'ArtifactInfo was empty',400,'') 
            valarr.push({'error':'ArtifactInfo was empty'})
          }else{
            var mode = JSON.parse(await this.redisService.getJsonDataWithPath(key+'AFI','.executionMode'))
          }       
        }
        if(!await this.redisService.exist(key+'NDP')){
          await this.teCommonService.getTSL(key,token,'NodeProperty does not exist',400,mode) 
          valarr.push({'error':'NodeProperty does not exist'})
        }else{
          var ndpJson = await this.redisService.getJsonData(key+'NDP')
          if(!ndpJson){
            await this.teCommonService.getTSL(key,token,'NodeProperty was empty',400,mode) 
            valarr.push({'error':'NodeProperty was empty'})
          }
        }
        if(currentFabric == 'DF-DFD'){
          if(!await this.redisService.exist(key+'DFS')){
            await this.teCommonService.getTSL(key,token,'DataFlow does not exist',400,mode) 
            valarr.push({'error':'DataFlow does not exist'})
          }else{
            var dfsJson = await this.redisService.getJsonData(key+'DFS')
            if(!dfsJson){
              await this.teCommonService.getTSL(key,token,'DataFlow was empty',400,mode) 
              valarr.push({'error':'DataFlow was empty'})
            }
          }
          if(!await this.redisService.exist(key+'DO')){
            await this.teCommonService.getTSL(key,token,'DO does not exist',400,mode) 
            valarr.push({'error':'DO does not exist'})
          }else{
            var doJson = await this.redisService.getJsonData(key+'DO')
            if(!doJson){
              await this.teCommonService.getTSL(key,token,'DO was empty',400,mode) 
              valarr.push({'error':'DO was empty'})
            }
          }
          if(!await this.redisService.exist(key+'DFO')){
            await this.teCommonService.getTSL(key,token,'DFO does not exist',400,mode) 
            valarr.push({'error':'DFO does not exist'})
          }else{
            var dfoJson = await this.redisService.getJsonData(key+'DFO')
            if(!dfoJson){
              await this.teCommonService.getTSL(key,token,'DFO was empty',400,mode) 
              valarr.push({'error':'DFO was empty'})
            }
          }
        }
        else if(currentFabric == 'PF-PFD'){
          if(!await this.redisService.exist(key+'PFS')){
            await this.teCommonService.getTSL(key,token,'ProcessFlow does not exist',400,mode) 
            valarr.push({'error':'ProcessFlow does not exist'})
          }else{
            var pfsJson = await this.redisService.getJsonData(key+'PFS')
            if(!pfsJson){
              await this.teCommonService.getTSL(key,token,'ProcessFlow was empty',400,mode) 
              valarr.push({'error':'ProcessFlow was empty'})
            }
          }
          if(!await this.redisService.exist(key+'PO')){
            await this.teCommonService.getTSL(key,token,'PO does not exist',400,mode) 
            valarr.push({'error':'PO does not exist'})
          }else{
            var poJson = await this.redisService.getJsonData(key+'PO')
            if(!poJson){
              await this.teCommonService.getTSL(key,token,'PO was empty',400,mode) 
              valarr.push({'error':'PO was empty'})
            }
          }
          if(!await this.redisService.exist(key+'PFO')){
            await this.teCommonService.getTSL(key,token,'PFO does not exist',400,mode) 
            valarr.push({'error':'PFO does not exist'})
          }else{
            var dfoJson = await this.redisService.getJsonData(key+'PFO')
            if(!dfoJson){
              await this.teCommonService.getTSL(key,token,'PFO was empty',400,mode) 
              valarr.push({'error':'PFO was empty'})
            }
          }
        } 
       
        if (valarr.length == 0) {
          var arrobj = {}
          arrobj['validateresult'] = 'validation completed'         
          return arrobj  
        }
        return valarr    
  }

    // pfPreProcessor
    async pfPreProcessor(processedKey,pfjson, upId,fabric) {
       this.logger.log('Pf PreProcessor started!');
        try {  
           var placeholder
          
          for(var i=0;i < pfjson.length;i++){          
            if (pfjson[i].nodeType != 'startnode' && pfjson[i].nodeType != 'endnode') {
              //set npc, ipc placeholders
              //await this.redisService.setJsonData(processedKey + upId + ':NPV:' + pfjson[i].nodeName + '.PRE', JSON.stringify(placeholder))
              if(fabric == 'DF-DFD'){
                 placeholder = { "request": {}, "response": {}, "exception": {} ,"event":{},"customResponse":{}}
                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + pfjson[i].nodeName+'.PRO', JSON.stringify(placeholder))
              }else{
                placeholder = { "request": {}, "response": {}, "exception": {} ,"event":{}}
                 await this.redisService.setJsonData(processedKey + upId + ':NPV:' + pfjson[i].nodeName+'.PRO', JSON.stringify(placeholder))
              }
              
             //await this.redisService.setJsonData(processedKey + upId + ':NPV:' + pfjson[i].nodeName + '.PST', JSON.stringify(placeholder))
            }  
          } 
          this.logger.log("pf Preprocessor completed")
          return 'Success'
        } catch (error) {
          throw error
        }
    }      

    // Handler

    async savehandler(data,key,event,nodeId,nodeName,nodeType,token,upId,sourceId){           
      try { 
        this.logger.log("SaveHandler service started...")
       
          var formdata
        var teData
        var objdata = {}
         var errdata = {
          tname:'TE',
          errGrp:'Technical',
          fabric:'PF',
          errType:'Fatal',
          errCode:'001'
          }   
       
        
          // if(data.childData && data.parentData){
          //   if(data.parentPrimaryKey){
          //     var primarykey = data.parentPrimaryKey
          //    }else{
          //     throw new BadRequestException('parentPrimaryKey does not exist')
          //    }
          //   var parentkey = Object.keys(data.parentData)
          //   // check primarykey includes in parentdata            
          //   if(parentkey.includes(primarykey)){
          //     var primaryval = data.parentData[primarykey]
          //   }
          //   var childarr = []
          //   if(data.childData.length>0){
          //     for(let t=0;t < data.childData.length;t++){
          //       var obj={}
          //       obj[primarykey]=primaryval
          //       data.childData[t] = Object.assign(data.childData[t],obj) 
          //     }
              
          //   }else{
          //     throw 'child data not found'
          //   }
                     
          //   if(Object.keys(data.parentData).length > 0){
              
          //     if(nodeId && nodeName && nodeType && event){                   
          //       teData =  await this.TEcall(token,key,upId,data,nodeId,nodeName,nodeType,event,sourceId) 
                  
          //     return teData
          //     }
          //   }else{
          //      throw 'parent data not found'
          //   }
          // }
        //   else if(data){
        //          for(let item in data){
        //           if(Array.isArray(data[item])){
        //             let s= {}
        //             s['create'] = data[item]
        //             data[item] = s
        //           }else{
        //             data[item] = data[item]
        //           }
        //   }             
        // }          
            if(data && nodeId && nodeName && nodeType && event){
              var formdata =  await this.TEcall(token,key,upId,data,nodeId,nodeName,nodeType,event,sourceId)                           
              return formdata
            }
                          
        }catch(error) {          
         this.logger.log('Error occurred save handler:', error);  
          if(error.errorCode){         
          throw new BadRequestException(error)
         }         
         var errobj = await this.teCommonService.errorobj(errdata,error,error.status)
         throw new BadRequestException(errobj)
      } 
  }    

  async apicall(url,data,token){
    try{
    const requestConfig: AxiosRequestConfig = {
      headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
      }};
    var insertedData =  await this.teCommonService.postCallwithDB(url,data, requestConfig)
    if(insertedData && insertedData.statusCode == 201)    
    return insertedData 
  else
  throw insertedData
  }catch(error) {
    throw error
  }              
  }

  async TEcall(token,key,upId,data,nodeId,nodeName,nodeType,event,sourceId){
    try{
    var pfdto:any = new pfDto()
    var formdata:any
    const requestConfig: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    };      
        pfdto.key = key
        pfdto.upId = upId
        pfdto.token = token 
        pfdto.data = data
        pfdto.event = event
        pfdto.nodeId = nodeId         
        pfdto.nodeType = nodeType 
        pfdto.sourceId = sourceId          
        formdata =  await this.EventEmitter(pfdto)              
      return formdata
  }catch(err){
    console.log("err",err)
    throw err
  }
  }
   
  async filterdata(data:any){
    var result = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => value)
     );
     return result;
  }

  async updateHandler(data,dfkey,upid,url,tablename,id,token){   
    try {  
      const requestConfig: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        }
       }; 
        if(Array.isArray(data) && Array.isArray(id)){
       if(id.length > 0 && data.length>0){
        if( id.length == 1 && data.length == 1){
          if(Object.keys(data).length > 0){
            var apipath =url+tablename+'/'+id             
            var apires = await this.teCommonService.patchCall(apipath,data[0],requestConfig)
           
          }else{
            throw 'Data was empty'
          }
          
        }else{
          for(var i=0;i< id.length;i++){
            if(id.length == data.length){
              var apipath =url+tablename+'/'+id[i]
              var apires = await this.teCommonService.patchCall(apipath,data[i],requestConfig)  
                       
            }else{
              throw 'Missing data/id'
            }             
          }          
        }
       } else{
        throw 'data/primarykey is empty'
       }        
      }else{
        throw 'data/primarykey should be an array'
      }
      if(dfkey && upid){
        if(apires?.statusCode){
          if(apires.statusCode == 200){
            var pfdto:any = new pfDto()
            pfdto.key = dfkey
            pfdto.upId = upid
            pfdto.token = token 
            pfdto.refreshFlag = 'Y'
           var result = await this.EventEmitter(pfdto)  
           return result         
          } 
         } 
      }
      return await this.teCommonService.responseData(201,apires.result)
        
    } catch (error) {
      throw error
    }        
  }
  
  async pushToRedisHandler(data,key,event,nodeId,nodeName,nodeType,token,upId,sourceId){           
    try { 
      this.logger.log("pushToRedisHandler service started...")
     
        var formdata
       
       var errdata = {
        tname:'TE',
        errGrp:'Technical',
        fabric:'PF',
        errType:'Fatal',
        errCode:'001'
        }   
      
          if(data && nodeId && nodeName && nodeType && event && sourceId){
            var formdata =  await this.TEcall(token,key,upId,data,nodeId,nodeName,nodeType,event,sourceId) 
            return formdata
            }else{
              return 'Data/nodeId/nodeName/nodeType/event/sourceId not found'
            }
                             
      }catch(error) {          
       this.logger.log('Error occurred save handler:', error);  
        if(error.errorCode){         
        throw new BadRequestException(error)
       }         
       var errobj = await this.teCommonService.errorobj(errdata,error,error.status)
       throw new BadRequestException(errobj)
    } 
}
      
}