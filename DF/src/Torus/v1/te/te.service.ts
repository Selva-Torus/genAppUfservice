import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { pfDto, PoEvent } from "src/dto";
import { RedisService } from "src/redisService";
import { firstValueFrom } from 'rxjs';
const  Xid = require('xid-js');
import { ClientProxy } from '@nestjs/microservices';
import { SecurityService } from "src/securityService";
import { CommonService } from "src/common.Service";
import { AxiosRequestConfig } from "axios";
import { CustomException } from "src/customException";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TeService {
    constructor(@Inject('PO') private readonly poClient: ClientProxy,
    private readonly redisService:RedisService,   
    private readonly securityService:SecurityService,
    private readonly teCommonService:CommonService,
    private readonly jwtService:JwtService,
   ){}
   private readonly logger = new Logger(TeService.name)       
 
  async EventEmitter(pfdto: pfDto, node?) {    
    const page = pfdto.page;
    const count = pfdto.count;
    let nodeInfo,processedKey,currentFabric;
     try {
       this.logger.log('Event Emmiter Started....');
       let event, pid, refflag, ufkey, keyname, ufname, node, pfjson, poJson, pfo, hlrId, sourceId, dstkey;
       let invalidEventFlg = 0;
       let flg = 0;
       let mergearr = [];
       let prevres = {};      

       currentFabric = await this.teCommonService.splitcommonkey(pfdto.key, 'FNK');
       let fngkKey = await this.teCommonService.splitcommonkey(pfdto.key, 'FNGK');
       if (pfdto.key.includes(fngkKey)) {
         processedKey = pfdto.key.replace(fngkKey, fngkKey + 'P');
       }
       let client = process.env.CLIENTCODE;
       if (!client) throw new CustomException('client not found', 404);
       if (currentFabric == 'PF-PFD') {
         sourceId = pfdto?.sourceId
       }
       let d_Pfs, d_Po, d_Pfo;
       if (currentFabric == 'PF-PFD' || currentFabric == 'PF-SFD') {
         d_Pfs = 'PFS';
         d_Po = 'PO';
         d_Pfo = 'PFO';
       } else if (currentFabric == 'DF-DFD') {
         d_Pfs = 'DFS';
         d_Po = 'DO';
         d_Pfo = 'DFO';
       }
       if (currentFabric != 'DF-DFD' && (!pfdto.data || pfdto.data.length == 0 || Object.keys(pfdto.data).length == 0))
         throw new CustomException('data not found', 404);
       let tokenDecode = this.jwtService.decode(pfdto.token, { json: true })
       if (!tokenDecode || !tokenDecode.loginId)
         throw new CustomException('Invalid token', 401);
       let artifact = await this.teCommonService.splitcommonkey(pfdto.key, 'AFK');
      
       node = await this.securityService.getSecurityTemplate(pfdto.key + d_Po, pfdto.token);
       pfjson = JSON.parse(await this.redisService.getJsonData(pfdto.key + d_Pfs, client));
       poJson = JSON.parse(await this.redisService.getJsonData(pfdto.key + d_Po, client));
       pfo = JSON.parse(await this.redisService.getJsonData(pfdto.key + d_Pfo, client));
       dstkey = processedKey.replace('DF-DFD', 'DF-DST');
       refflag = pfdto.refreshFlag ? pfdto.refreshFlag : 'N';
       let poNode = poJson?.mappedData?.artifact?.node;
       if (!poNode || poNode.length == 0)
         throw new CustomException('Nodes not found', 404);

       let Ndp = JSON.parse(await this.redisService.getJsonData(pfdto.key + 'NDP', client));

       //  Check RollBack enabled
       await this.teCommonService.checkRollBack(Ndp,client,'check'); 
       
       let eflg = 0;
       for (let e = 0; e < poNode.length; e++) {
         if (pfdto.nodeId) {
           if (pfdto.nodeId == poNode[e].nodeId) {
             if (poNode[e].events.length > 0) {
               for (let k = 0; k < poNode[e].events.length; k++) {
                 if (pfdto.event != poNode[e].events[k].source.status) {
                   eflg++;
                 }
               }
               if (eflg == poNode[e].events.length)
                 throw new CustomException('Event and nodeId mismatched', 400);
             } else {
               throw new CustomException('events not found', 404);
             }
           } else {
             flg++;
           }
         }
         if (poNode[e].nodeType != 'startnode' && poNode[e].nodeType != 'endnode') {
           if (currentFabric == 'PF-PFD' || currentFabric == 'PF-SFD') {
             if (poNode[e].events.length > 0) {
               for (let k = 0; k < poNode[e].events.length; k++) {
                 if (!poNode[e].events[k].source.status) {
                   throw new CustomException('Event source status does not exist in ' + poNode[e].nodeName, 404);
                 }
               }
             } else {
               throw new CustomException('events not found', 404);
             }
           } else {
             if (!poNode[e].events.sourceStatus) {
               throw new CustomException('Event source status does not exist in ' + poNode[e].nodeName, 404);
             }
           }
         }
       }
       if (flg == poNode.length) {
         throw new CustomException('Invalid nodeId', 400);
       }
       if (pfdto.upId) {
         if (pfdto.nodeId == poNode[1].nodeId) {
           pfdto.upId = null;
         }
         pid = pfdto.upId;
       }
       this.logger.log(pfdto.upId);
       let eventResponse;
       for (var i = 0; i < poNode.length; i++) {
        nodeInfo = poNode[i];
        pfdto.nodeId = pfdto.nodeId?pfdto.nodeId:poNode[i].nodeId;
        pfdto.nodeType = pfdto.nodeType?pfdto.nodeType:poNode[i].nodeType
        pfdto.nodeName = pfdto.nodeName?pfdto.nodeName:poNode[i].nodeName         

        let srcQueue;
        let srcStatus;
        let staticQueue = currentFabric == 'DF-DFD' ? 'TDH' : 'TPH';

        if (poNode[i].nodeType == 'startnode') {
           this.logger.log('Start node');
           if (currentFabric == 'DF-DFD') {
             if (poNode[1].events.sourceStatus) {
               if (!pfdto.upId || (Array.isArray(pfdto.upId) && pfdto.upId.length > 0 && pfdto.upId[0] == '')) pfdto.upId = Xid.next();
               await this.pfPreProcessor(processedKey, pfjson, pfdto.upId, currentFabric);
               srcQueue = poNode[1].events.sourceQueue;
               pfdto.event = poNode[1].events.sourceStatus;
               if (!srcQueue || srcQueue == ' ') srcQueue = staticQueue;
               srcQueue = client + '_' + srcQueue + '_ProcessStatus'
               await this.redisService.setStreamData(srcQueue, client + 'TASK - ' + pfdto.upId, JSON.stringify({ PID: pfdto.upId, TID: pfdto.nodeId, EVENT: pfdto.event }));
               await this.teCommonService.getTPL(processedKey, pfdto.upId, poNode[i], 'Success', pfdto.token, 'PF');
               pfdto.nodeId = null;
               pfdto.nodeType = null;
               pfdto.nodeName = null;

             }
           } else {
             if (pid == undefined && pfdto.nodeId == poNode[1].nodeId) {
               if (!pfdto.upId) pfdto.upId = Xid.next();
               await this.pfPreProcessor(processedKey, pfjson, pfdto.upId, currentFabric);
               if (!srcQueue || srcQueue == ' ') srcQueue = staticQueue;
               srcQueue = client + '_' + srcQueue + '_ProcessStatus'
               await this.redisService.setStreamData(srcQueue, client + 'TASK - ' + pfdto.upId, JSON.stringify({ PID: pfdto.upId, TID: pfdto.nodeId, EVENT: pfdto.event }));
               await this.teCommonService.getTPL(processedKey, pfdto.upId, poNode[i], 'Success', pfdto.token, 'PF');
               pfdto.nodeId = null;
               pfdto.nodeType = null;
               pfdto.nodeName = null;
             }
           }
        } else if (poNode[i].nodeType == 'humantasknode' && poNode[i].nodeId == pfdto.nodeId) {
          this.logger.log('Human Task node started');
          if (pfdto.upId) {
            let nodedetails = await this.securityService.getNodeSecurityTemplate(node, poNode[i].nodeName);
            if (nodedetails?.status == '200') {
              if (!sourceId) {
                srcStatus = poNode[i].events[0].source.status.trim();
                if (pfdto.event == null && event == srcStatus) {
                  let npvdata;
                  if (await this.redisService.exist(processedKey + pfdto.upId + ':previousResponse', client)) {
                    npvdata = JSON.parse(await this.redisService.getJsonData(processedKey + pfdto.upId + ':previousResponse', client));
                  }
                  return { upId: pfdto.upId, message: `Awaiting for: ${poNode[i].nodeName}`, event: event, insertedData: npvdata };
                } else if (poNode[i].nodeId == poNode[1].nodeId) {
                  throw new CustomException('Sourceid not found', 404)
                }
              }
              if (pfdto.sourceId) {
                hlrId = pfdto.sourceId?.split('|')[2];
                if (hlrId.includes('/')) {
                  sourceId = hlrId.split('/')[hlrId.split('/').length - 1].replaceAll('.', '');
                } else {
                  sourceId = hlrId.replaceAll('.', '');
                }
              } else {
                throw new CustomException('sourceId is empty', 404);
              }
              if (sourceId) {                
                let getEventInfo = await this.getEventandSourceid(pfdto, poNode[i], pfdto.event, sourceId)
                ufname = getEventInfo.ufname
                srcStatus = getEventInfo.srcStatus                
                srcQueue = getEventInfo.srcQueue                  
              }
            
              if (pfdto.event === srcStatus) {                
                if (pfdto.data) {
              
                  await this.redisService.setJsonData(processedKey + pfdto.upId + ':NPV:' + poNode[i].nodeName + '.PRO', JSON.stringify(pfdto.data), client, 'response');                  
                  await this.redisService.setJsonData(processedKey + pfdto.upId + ':NPV:' + poNode[i].nodeName + '.PRO', JSON.stringify(pfdto.data), client, 'request');

                  //Setting Up Node response
                  let nodeObjArr = {
                    nodeName: poNode[i].nodeName,
                    nodeId: poNode[i].nodeId,
                    nodeType: poNode[i].nodeType,
                    sourceStatus: pfdto.event,
                    //timeStamp: new Date().toString(),
                    currentStatus: 'Failed',
                  };
                  if (await this.redisService.exist(processedKey + pfdto.upId + ':nodeResponse', client)) {
                    let getnoderesponse = JSON.parse(await this.redisService.getJsonData(processedKey + pfdto.upId + ':nodeResponse', client));
                    let getnoderesflg = 0
                    for(let g=0;g< getnoderesponse.length;g++){
                      if(getnoderesponse[g].nodeId != poNode[i].nodeId){
                        getnoderesflg++
                      }
                    }
                    if(getnoderesflg == getnoderesponse.length){                      
                      await this.redisService.AppendJsonArr(processedKey + pfdto.upId + ':nodeResponse', JSON.stringify(nodeObjArr), client);
                    }
                  } else {
                    await this.redisService.setJsonData(processedKey + pfdto.upId + ':nodeResponse', JSON.stringify([nodeObjArr]), client);
                  }
                  // Event Emmiting logic
                //  pfdto.data = pfdto.data['childData'] ? pfdto.data : { [poNode[i].nodeName]: pfdto.data }
              
                  // pfdto.data = { [poNode[i].nodeName]: pfdto.data }                
                  eventResponse = await firstValueFrom(this.poClient.send(
                    ufname + '_' + poNode[i].nodeId + '_' + sourceId + '_' + pfdto.event,
                    new PoEvent(pfdto, pfdto.event, pfjson, pfo, poJson, Ndp, refflag, page, count)
                  ))
                  if (!eventResponse.status && eventResponse.status != 200) {
                    throw eventResponse;
                  }
                  console.log(`${eventResponse.targetStatus} Event emitted successfully by ${poNode[i].nodeName}`);
                  //Change current status to success
                  let getNodeResponse = JSON.parse(await this.redisService.getJsonData(processedKey + pfdto.upId + ':nodeResponse', client));
                  if(getNodeResponse.length>0){
                    for (let s = 0; s < getNodeResponse.length; s++) {
                      if (getNodeResponse[s]?.nodeId == pfdto.nodeId) {
                        await this.redisService.setJsonData(processedKey + pfdto.upId + ':nodeResponse', '"Success"', client, '[' + s + '].currentStatus');
                      }
                    }
                  }
                  nodeObjArr = null;
                  // pfdto.data = null;
                  pfdto.data =  eventResponse.data
                  pfdto.event = null;
                  pfdto.nodeId = null;
                  pfdto.nodeType = null;
                  pfdto.nodeName = null;
                  event = eventResponse.targetStatus;
                  sourceId = null;
                }
              } else {
                pfdto.nodeId = null;
                pfdto.nodeType = null;
                pfdto.nodeName = null;
                invalidEventFlg++;
              }
            } else {
              throw nodedetails;
            }
          } else {
            throw new CustomException('Process Id not found', 400);
          }
        } else if (poNode[i].nodeType == 'datasetschemanode' && poNode[i].nodeId == pfdto.nodeId) {
          this.logger.log('Dataset Schema Node');
          if (Array.isArray(poNode[i].events)) {
            if (!event) event = pfdto.event            
            let getEventInfo = await this.getEventandSourceid(pfdto, poNode[i], event, sourceId)
            ufname = getEventInfo.ufname
            srcStatus = getEventInfo.srcStatus             
            srcQueue = getEventInfo.srcQueue
            sourceId = getEventInfo.sourceId 
          } else {            
            srcStatus = poNode[i].events?.sourceStatus
            srcQueue = poNode[i].events.sourceQueue;
            if (!event) event = pfdto.event
          }
          if (currentFabric == 'PF-PFD' || currentFabric == 'PF-SFD') {
            if (!pfdto.data) {
              // pfdto.data = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + pfdto.upId + ':NPV:' + poNode[i].nodeName + '.PRO', '.request', client));
              pfdto.data = eventResponse?.data
            } else {
              await this.redisService.setJsonData(processedKey + pfdto.upId + ':NPV:' + poNode[i].nodeName + '.PRO', JSON.stringify(pfdto.data), client, 'request');
            }
           
          } else {         
            pfdto.data = mergearr;
          }

          let nodeObjArr = {
            nodeName: poNode[i].nodeName,
            nodeId: poNode[i].nodeId,
            nodeType: poNode[i].nodeType,
            sourceStatus: event,
            //timeStamp: new Date().toString(),
            currentStatus: 'Failed',
          }

          if (await this.redisService.exist(processedKey + pfdto.upId + ':nodeResponse', client)) {
            let getnoderesponse = JSON.parse(await this.redisService.getJsonData(processedKey + pfdto.upId + ':nodeResponse', client));
            let getnoderesflg = 0
            for (let g = 0; g < getnoderesponse.length; g++) {
              if (getnoderesponse[g].nodeId != poNode[i].nodeId) {
                getnoderesflg++
              }
            }
            if (getnoderesflg == getnoderesponse.length) {
              await this.redisService.AppendJsonArr(processedKey + pfdto.upId + ':nodeResponse', JSON.stringify(nodeObjArr), client);
            }
          } else {
            await this.redisService.setJsonData(processedKey + pfdto.upId + ':nodeResponse', JSON.stringify([nodeObjArr]), client);
          }
        
          if (event === srcStatus) {
            let msgPattern = currentFabric == 'DF-DFD'?artifact + '_' + poNode[i].nodeId + '_' + event:ufname + '_' + poNode[i].nodeId + '_' + sourceId + '_' + event;
          
            eventResponse = await firstValueFrom(this.poClient.send(
              msgPattern,
              new PoEvent(pfdto, event, pfjson, pfo, poJson, Ndp, refflag, page, count)
            ))           
           

            if (!eventResponse.status && eventResponse.status != 200) {
              throw eventResponse;
            }
            console.log(`${eventResponse.targetStatus} Event emitted successfully by ${poNode[i].nodeName}`);
            //Change current status to success
            let getNodeResponse = JSON.parse(await this.redisService.getJsonData(processedKey + pfdto.upId + ':nodeResponse', client));
            if(getNodeResponse.length>0){
              for (let s = 0; s < getNodeResponse.length; s++) {
                if (getNodeResponse[s]?.nodeId == pfdto.nodeId) {
                  await this.redisService.setJsonData(processedKey + pfdto.upId + ':nodeResponse', '"Success"', client, '[' + s + '].currentStatus',);
                }
              }
            }
            nodeObjArr = null;
            pfdto.data = null;
            pfdto.event = null;
            pfdto.nodeId = null;
            pfdto.nodeType = null;
            pfdto.nodeName = null;
            event = eventResponse.targetStatus;
            sourceId = null;
          } else {
            pfdto.nodeId = null;
            pfdto.nodeType = null;
            pfdto.nodeName = null;
          }
        } else if (poNode[i].nodeType == 'datasetnode') {
          this.logger.log('API Dataset node started')
          if (poNode[i].nodeId == pfdto.nodeId) {
            if (Array.isArray(poNode[i].events)) {
              if (!event) event = pfdto.event            
              let getEventInfo = await this.getEventandSourceid(pfdto, poNode[i], event, sourceId)
                ufname = getEventInfo.ufname
                srcStatus = getEventInfo.srcStatus             
                srcQueue = getEventInfo.srcQueue
                sourceId = getEventInfo.sourceId     
            } else {
              srcStatus = poNode[i].events?.sourceStatus
              srcQueue = poNode[i].events?.sourceQueue
              if (!event) event = pfdto.event
            }
            if (currentFabric == 'PF-PFD' || currentFabric == 'PF-SFD') {
              if (!pfdto.data) {
                // pfdto.data = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + pfdto.upId + ':NPV:' + poNode[i].nodeName + '.PRO', '.request', client))
                pfdto.data = eventResponse?.data
              } else {
                await this.redisService.setJsonData(processedKey + pfdto.upId + ':NPV:' + poNode[i].nodeName + '.PRO', JSON.stringify(pfdto.data), client, 'request')
              }
              
            } else {
              pfdto.data = mergearr
            }
            //Setting Up Node response    
            let nodeObjArr = {
              nodeName: poNode[i].nodeName,
              nodeId: poNode[i].nodeId,
              nodeType: poNode[i].nodeType,
              sourceStatus: event,
              currentStatus: "Failed"
            }
            if (await this.redisService.exist(processedKey + pfdto.upId + ':nodeResponse', client)) {     
              let getnoderesponse = JSON.parse(await this.redisService.getJsonData(processedKey + pfdto.upId + ':nodeResponse', client));
              let getnoderesflg = 0
              for (let g = 0; g < getnoderesponse.length; g++) {
                if (getnoderesponse[g].nodeId != poNode[i].nodeId) {
                  getnoderesflg++
                }
              }
              if (getnoderesflg == getnoderesponse.length) {
                await this.redisService.AppendJsonArr(processedKey + pfdto.upId + ':nodeResponse', JSON.stringify(nodeObjArr), client)
              }      
            }
            else {
              await this.redisService.setJsonData(processedKey + pfdto.upId + ':nodeResponse', JSON.stringify([nodeObjArr]), client)
            }

            if (event === srcStatus) {
              let msgPattern = currentFabric == 'DF-DFD'? artifact + '_' + poNode[i].nodeId + '_' + event:ufname + '_' + poNode[i].nodeId + '_' + sourceId + '_' + event;
             
              eventResponse = await firstValueFrom(this.poClient.send(
                msgPattern,
                new PoEvent(pfdto, event, pfjson, pfo, poJson, Ndp, refflag, page, count)
              ))               

              if (!eventResponse.status && eventResponse.status != 200) {
                throw eventResponse
              }
              console.log(`${eventResponse.targetStatus} Event emitted successfully by ${poNode[i].nodeName}`);
              pfdto.data = eventResponse?.data

              //Change current status to success   
              var getNodeResponse = JSON.parse(await this.redisService.getJsonData(processedKey + pfdto.upId + ':nodeResponse', client))
              for (var s = 0; s < getNodeResponse.length; s++) {
                if (getNodeResponse[s].nodeId == pfdto.nodeId) {
                  await this.redisService.setJsonData(processedKey + pfdto.upId + ':nodeResponse', '"Success"', client, '[' + s + '].currentStatus')
                }
              }

              nodeObjArr = null
              pfdto.event = null
              pfdto.nodeId = null
              pfdto.nodeType = null
              pfdto.nodeName = null;
              sourceId = null
              event = eventResponse.targetStatus
            } else {
              pfdto.nodeId = null
              pfdto.nodeType = null
              pfdto.nodeName = null;
            }
          }
        } else if (poNode[i].nodeType == 'api_inputnode') {
          this.logger.log(`${poNode[i].nodeType} started`)
          if (poNode[i].nodeId == pfdto.nodeId) {
            if (Array.isArray(poNode[i].events)) {
              if (!event) event = pfdto.event            
              let getEventInfo = await this.getEventandSourceid(pfdto, poNode[i], event, sourceId)
                ufname = getEventInfo.ufname
                srcStatus = getEventInfo.srcStatus             
                srcQueue = getEventInfo.srcQueue
                sourceId = getEventInfo.sourceId 
            } else {
              srcStatus = poNode[i].events?.sourceStatus
              srcQueue = poNode[i].events.sourceQueue
            }
            //Setting Up Node response    
            let nodeObjArr = {
              nodeName: poNode[i].nodeName,
              nodeId: poNode[i].nodeId,
              nodeType: poNode[i].nodeType,
              sourceStatus: event,
              currentStatus: "Failed"
            }
            if (await this.redisService.exist(processedKey + pfdto.upId + ':nodeResponse', client)) {   
              let getnoderesponse = JSON.parse(await this.redisService.getJsonData(processedKey + pfdto.upId + ':nodeResponse', client));
              let getnoderesflg = 0
              for (let g = 0; g < getnoderesponse.length; g++) {
                if (getnoderesponse[g].nodeId != poNode[i].nodeId) {
                  getnoderesflg++
                }
              }
              if (getnoderesflg == getnoderesponse.length) {
                await this.redisService.AppendJsonArr(processedKey + pfdto.upId + ':nodeResponse', JSON.stringify(nodeObjArr), client)
              }         
            }
            else {
              await this.redisService.setJsonData(processedKey + pfdto.upId + ':nodeResponse', JSON.stringify([nodeObjArr]), client)
            }

            if (pfdto.data['data']) {
              pfdto.data = pfdto.data['data']
              await this.redisService.setJsonData(processedKey + pfdto.upId + ':NPV:' + poNode[i].nodeName + '.PRO', JSON.stringify(pfdto.data), client, 'request')
            }
           
            if (event === srcStatus) {
              eventResponse = await firstValueFrom(this.poClient.send(
                ufname + '_' + poNode[i].nodeId + '_' + sourceId + '_' + event,
                new PoEvent(pfdto, event, pfjson, pfo, poJson, Ndp, refflag, page, count)
              ))

              if (!eventResponse.status && eventResponse.status != 200) {
                throw eventResponse
              }
              console.log(`${eventResponse.targetStatus} Event emitted successfully by ${poNode[i].nodeName}`);

              //Change current status to success   
              var getNodeResponse = JSON.parse(await this.redisService.getJsonData(processedKey + pfdto.upId + ':nodeResponse', client))
              for (var s = 0; s < getNodeResponse.length; s++) {
                if (getNodeResponse[s].nodeId == pfdto.nodeId) {
                  await this.redisService.setJsonData(processedKey + pfdto.upId + ':nodeResponse', '"Success"', client, '[' + s + '].currentStatus')
                }
              }
             
              
              nodeObjArr = null
              pfdto.event = null
              pfdto.data = null
              pfdto.nodeId = null
              pfdto.nodeType = null
              pfdto.nodeName = null;
              event = eventResponse?.targetStatus
              sourceId = null
            } else {
              pfdto.nodeId = null
              pfdto.data = null
              pfdto.nodeType = null
              pfdto.nodeName = null;
            }

            if(!pfdto.data)
              pfdto.data = eventResponse?.data
          }
        } else if (poNode[i].nodeType == 'api_outputnode') {
          this.logger.log('API output node started')
          if (poNode[i].nodeId == pfdto.nodeId) {
            if (Array.isArray(poNode[i].events)) {
            if (!event) event = pfdto.event            
            let getEventInfo = await this.getEventandSourceid(pfdto, poNode[i], event, sourceId)
              ufname = getEventInfo.ufname
              srcStatus = getEventInfo.srcStatus             
              srcQueue = getEventInfo.srcQueue
              sourceId = getEventInfo.sourceId 
            } else {
              srcStatus = poNode[i].events?.sourceStatus
              srcQueue = poNode[i].events.sourceQueue
            }
           // console.log("eventResponse?.data",eventResponse?.data);
            
            if (!pfdto.data)
              pfdto.data = eventResponse?.data
              // pfdto.data = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + pfdto.upId + ':NPV:' + poNode[i].nodeName + '.PRO', '.request', client))
            
            //Setting Up Node response    
            let nodeObjArr = {
              nodeName: poNode[i].nodeName,
              nodeId: poNode[i].nodeId,
              nodeType: poNode[i].nodeType,
              sourceStatus: event,
              currentStatus: "Failed"
            }

            if (await this.redisService.exist(processedKey + pfdto.upId + ':nodeResponse', client)) { 
              let getnoderesponse = JSON.parse(await this.redisService.getJsonData(processedKey + pfdto.upId + ':nodeResponse', client));
              let getnoderesflg = 0
              for (let g = 0; g < getnoderesponse.length; g++) {
                if (getnoderesponse[g].nodeId != poNode[i].nodeId) {
                  getnoderesflg++
                }
              }
              if (getnoderesflg == getnoderesponse.length) {
                await this.redisService.AppendJsonArr(processedKey + pfdto.upId + ':nodeResponse', JSON.stringify(nodeObjArr), client)
              }      
            }
            else {
              await this.redisService.setJsonData(processedKey + pfdto.upId + ':nodeResponse', JSON.stringify([nodeObjArr]), client)
            }
           
            if (event === srcStatus) {
              eventResponse = await firstValueFrom(this.poClient.send(
                ufname + '_' + poNode[i].nodeId + '_' + sourceId + '_' + event,
                new PoEvent(pfdto, event, pfjson, pfo, poJson, Ndp, refflag, page, count)
              ))

              if (eventResponse == undefined) { throw 'Event Response is undefined' }
              if (!eventResponse.status && eventResponse.status != 200) {
                throw eventResponse
              }
              console.log(`${eventResponse.targetStatus} Event emitted successfully by ${poNode[i].nodeName}`);
              //Change current status to success   
              var getNodeResponse = JSON.parse(await this.redisService.getJsonData(processedKey + pfdto.upId + ':nodeResponse', client))
              for (var s = 0; s < getNodeResponse.length; s++) {
                if (getNodeResponse[s].nodeId == pfdto.nodeId) {
                  await this.redisService.setJsonData(processedKey + pfdto.upId + ':nodeResponse', '"Success"', client, '[' + s + '].currentStatus')
                }
              }
              nodeObjArr = null
              pfdto.data = null
              pfdto.event = null
              pfdto.nodeId = null
              pfdto.nodeType = null
              pfdto.nodeName = null;
              event = eventResponse?.targetStatus
              sourceId = null
            } else {
              pfdto.nodeId = null
              pfdto.nodeType = null
              pfdto.nodeName = null;
            }
          }
        } else {
          this.logger.log(`${poNode[i].nodeType} started`);
          if (pfdto.upId) {           
            let nodedetails = await this.securityService.getNodeSecurityTemplate(node, poNode[i].nodeName);                
            if (nodedetails?.status == '200') {              
            if (poNode[i].nodeId == pfdto.nodeId) {                
              
                if (poNode[i].nodeType != 'endnode') {
                  if (Array.isArray(poNode[i].events)) {
                  if (!event) event = pfdto.event            
                  let getEventInfo = await this.getEventandSourceid(pfdto, poNode[i], event)
                    ufname = getEventInfo.ufname
                    srcStatus = getEventInfo.srcStatus             
                    srcQueue = getEventInfo.srcQueue
                    sourceId = getEventInfo.sourceId                      
                  } else {
                    srcStatus = poNode[i].events?.sourceStatus;
                    srcQueue = poNode[i].events.sourceQueue;
                  }

                  if (!srcQueue) srcQueue = staticQueue;
                }
                //End node returning logic
                if (poNode[i].nodeType == 'endnode') {                 
                  let getNodeResponse = JSON.parse(await this.redisService.getJsonData(processedKey + pfdto.upId + ':nodeResponse', client));
                  if (getNodeResponse != null) {
                    let flg = 0;
                    for (let pfs = 0; pfs < pfjson.length; pfs++) {
                      if (getNodeResponse[getNodeResponse.length - 1].nodeId == pfjson[pfs].nodeId) {
                      
                        let pfresponse = eventResponse;
                        if (!pfresponse)
                          pfresponse = await this.redisService.getJsonDataWithPath(processedKey + pfdto.upId + ':NPV:' + pfjson[pfs].nodeName + '.PRO', '.response', client);

                        let routeArray = pfjson[pfs].routeArray;
                        for (let r = 0; r < routeArray.length; r++) {
                          if (routeArray[r].nodeName == 'End') {
                            if (!srcQueue) srcQueue = staticQueue;
                            await this.redisService.setStreamData(srcQueue, 'TASK - ' + pfdto.upId, JSON.stringify({ PID: pfdto.upId, TID: pfdto.nodeId, EVENT: 'ProcessCompleted' }));
                            await this.teCommonService.getTPL(processedKey, pfdto.upId, poNode[i], 'Success', pfdto.token, currentFabric);
                            if (currentFabric == 'PF-PFD' || currentFabric == 'PF-SFD') {
                              pfresponse = pfresponse.data && pfresponse.data[pfjson[pfs].nodeName] ? pfresponse.data[pfjson[pfs].nodeName] : pfresponse;
                              this.logger.log('Event Emmiter Completed....');
                              return { message: 'Success', key: pfdto.key, upId: pfdto.upId, event: event, data: pfresponse };
                            } else {
                              let obj = {};
                              if (eventResponse) {
                                let FinalEvent;
                                if (eventResponse.targetStatus) {
                                  FinalEvent = eventResponse.targetStatus;
                                } else {
                                  FinalEvent = 'ProcessCompleted';
                                }
                                obj['key'] = pfdto.key;
                                if (eventResponse.data) {
                                  obj['data'] = eventResponse.data;
                                } else {
                                  obj['data'] = eventResponse;
                                }
                                await this.redisService.setJsonData(dstkey + tokenDecode.loginId + '_DS_Object', JSON.stringify(obj), client);
                                return { status: 'Success', statusCode: 201, processKey: dstkey, upId: pfdto.upId, message: 'Success', event: FinalEvent, dataset: obj };
                              }
                            }
                          } else {
                            flg++;
                          }
                        }
                        if (flg == routeArray.length) {
                          throw new CustomException('Event Mismatched', 400);
                        }
                      }
                    }
                  } else throw new CustomException('Invalid Request', 422);
                }

                // Reading event source queue
                if (await this.redisService.exist(srcQueue, client)) {
                  let grpInfo = await this.redisService.getInfoGrp(srcQueue);
                  if (grpInfo.length == 0) {
                    await this.redisService.createConsumerGroup(srcQueue, 'TaskGroup');
                  } else if (!grpInfo[0].includes('TaskGroup')) {
                    await this.redisService.createConsumerGroup(srcQueue, 'TaskGroup');
                  }
                  let streamData: any = await this.redisService.readConsumerGroup(srcQueue, 'TaskGroup', pfdto.event || event);
                  if (streamData != 'No Data available to read') {
                    for (let s = 0; s < streamData.length; s++) {
                      let msgid = streamData[s].msgid;
                      let data = streamData[s].data;
                      if (event == JSON.parse(data[1]).EVENT) {
                        event = JSON.parse(data[1]).EVENT;
                        await this.redisService.ackMessage(srcQueue, 'TaskGroup', msgid);
                      }
                    }
                  }
                }
                if (!event) {
                  event = pfdto.event;
                }
                if (event === srcStatus) {
                  if (!pfdto.data) {
                    // pfdto.data = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + pfdto.upId + ':NPV:' + poNode[i].nodeName + '.PRO', '.request', client));
                    pfdto.data = eventResponse?.data
                  }
                  //Setting Up Node response
                  let nodeObjArr = {
                    nodeName: poNode[i].nodeName,
                    nodeId: poNode[i].nodeId,
                    nodeType: poNode[i].nodeType,
                    sourceStatus: event,
                    //timeStamp: new Date().toString(),
                    currentStatus: 'Failed',
                  }                  

                  if (await this.redisService.exist(processedKey + pfdto.upId + ':nodeResponse', client)) {
                    let getnoderesponse = JSON.parse(await this.redisService.getJsonData(processedKey + pfdto.upId + ':nodeResponse', client));
                    let getnoderesflg = 0
                    for(let g=0;g<getnoderesponse.length;g++){
                      if(getnoderesponse[g].nodeId != poNode[i].nodeId){
                        getnoderesflg++
                      }
                    }
                    if(getnoderesflg == getnoderesponse.length){ 
                      await this.redisService.AppendJsonArr(processedKey + pfdto.upId + ':nodeResponse', JSON.stringify(nodeObjArr), client);
                    }
                  } else {
                    await this.redisService.setJsonData(processedKey + pfdto.upId + ':nodeResponse', JSON.stringify([nodeObjArr]), client);
                  }

                  // Event Emmiting logic
               
                  if (mergearr && mergearr.length > 0 && currentFabric == 'DF-DFD') {
                    for (let m = 0; m < mergearr.length; m++) {                       
                      if (poNode[i - 1].nodeName == poNode[1].nodeName) {
                        await this.redisService.setJsonData(processedKey + pfdto.upId + ':NPV:' + poNode[1].nodeName + '.PRO', JSON.stringify(mergearr[m]), client, 'customResponse');
                      }                      
                      pfdto.data = { data: mergearr[m] };

                      eventResponse = await firstValueFrom(this.poClient.send(
                        artifact + '_' + poNode[i].nodeId + '_' + event,
                        new PoEvent(pfdto, event, pfjson, pfo, poJson, Ndp, refflag, page, count)
                      ))

                      if (!eventResponse.status || eventResponse.status != 200) {
                        throw eventResponse;
                      }
                      console.log(`${eventResponse.targetStatus} Event emitted successfully by ${poNode[i].nodeName}`);
                      if (eventResponse) {
                        let eventData = eventResponse?.data;
                        if (eventData) {
                          if (Array.isArray(eventData) && eventData.length > 0) {
                            Object.assign(mergearr[m], { [poNode[i].nodeName]: eventData, });
                          } else if (Object.keys(eventData).length > 0) {
                            Object.assign(mergearr[m], eventData);
                          }
                        }
                      }
                    }
                    await this.teCommonService.getTPL(processedKey, pfdto.upId, poNode[i], 'Success', pfdto.token, currentFabric, event);
                  } else {  
                    if (currentFabric == 'DF-DFD') {                      
                      eventResponse = await firstValueFrom(this.poClient.send(
                        artifact + '_' + poNode[i].nodeId + '_' + event,
                        new PoEvent(pfdto, event, pfjson, pfo, poJson, Ndp, refflag, page, count)
                      ))
                      if (!eventResponse.status && eventResponse.status != 200) {
                        throw eventResponse;
                      }
                      console.log(`${eventResponse.targetStatus} Event emitted successfully by ${poNode[i].nodeName}`);                       
                      let eventData = eventResponse?.data;
                      if (eventData && Array.isArray(eventData) && eventData.length > 0) {                        
                        mergearr = eventData;                         
                      } else if (eventData && Object.keys(eventData).length > 0) {
                        mergearr = [eventData];
                      }

                    } else {    
                          
                      eventResponse = await firstValueFrom(this.poClient.send(
                        ufname + '_' + poNode[i].nodeId + '_' + sourceId + '_' + event,
                        new PoEvent(pfdto, event, pfjson, pfo, poJson, Ndp, refflag, page, count)
                      ))

                      if (eventResponse.data && pfdto.nodeType == 'apinode') {
                        prevres[poNode[i].nodeId] = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + pfdto.upId + ':NPV:' + poNode[i].nodeName + '.PRO', '.response', client))
                        await this.redisService.setJsonData(processedKey + pfdto.upId + ':previousResponse', JSON.stringify(prevres), client);
                      }
                      if (!eventResponse.status && eventResponse.status != 200) {
                        throw eventResponse;
                      }
                      console.log(`${eventResponse.targetStatus} Event emitted successfully by ${poNode[i].nodeName}`);
                    }
                  }

                  //Change current status to success
                  let getNodeResponse = JSON.parse(await this.redisService.getJsonData(processedKey + pfdto.upId + ':nodeResponse', client,));
                  if(getNodeResponse.length>0){
                    for (let s = 0; s < getNodeResponse.length; s++) {
                      if (getNodeResponse[s]?.nodeId === pfdto.nodeId) {
                        await this.redisService.setJsonData(processedKey + pfdto.upId + ':nodeResponse', '"Success"', client, '[' + s + '].currentStatus');
                      }
                    }
                  }
                  nodeObjArr = null;
                  pfdto.data = null;
                  //pfdto.data =  eventResponse.data
                  pfdto.event = null;
                  pfdto.nodeId = null;
                  pfdto.nodeType = null;
                  pfdto.nodeName = null;
                  event = eventResponse.targetStatus;
                  sourceId = null;
                } else {
                  sourceId = null;
                  pfdto.nodeId = null;
                  pfdto.nodeType = null;
                  pfdto.nodeName = null;
                  invalidEventFlg++;
                }
              }else{
                pfdto.nodeId = null;
                pfdto.nodeType = null;
                pfdto.nodeName = null;
              }
            } else {
              throw nodedetails;
            }
          } else {
            throw new CustomException('Process Id not found', 404);
          }
        }
       }

       if (invalidEventFlg == poNode.length - 2) {
         throw new CustomException(`${event} doesn't matched`, 400);
       }
     } catch (error) {
        // console.log('PO ERROR:', error);
       if (pfdto.upId) {
         if (error.statusCode) {
           await this.teCommonService.getTPL(processedKey, pfdto.upId, nodeInfo, 'Failed',
             pfdto.token, currentFabric, '', pfdto.data, error);
           throw new CustomException(error?.message, error.statusCode);
         }
         else {
           await this.teCommonService.getTPL(processedKey, pfdto.upId, nodeInfo, 'Failed',
             pfdto.token, currentFabric, '', pfdto.data, error);
           throw new CustomException(error.message ? error.message : error.toString(), 500);
         }

       } else {
         if (error.statusCode || error.status) {
           await this.teCommonService.getTSL(pfdto.key, pfdto.token, error, '');
           throw new CustomException(error?.message ? error.message : error.response, error.statusCode ? error.statusCode : error.status);
         }
         else {
           await this.teCommonService.getTSL(pfdto.key, pfdto.token, error, '');
           throw new CustomException(error.message ? error.message : error.toString(), 500);
         }
       }
     }
  } 

  // pfPreProcessor
  async pfPreProcessor(processedKey, pfjson, upId, fabric) {
    this.logger.log('Pf PreProcessor started!');
    try {
      let placeholder;
      let client = process.env.CLIENTCODE;
      for (var i = 0; i < pfjson.length; i++) {
        if ( pfjson[i].nodeType != 'startnode' && pfjson[i].nodeType != 'endnode') {
          //set npc, ipc placeholders         
          if (fabric == 'DF-DFD') {
            placeholder = { request: {},response: {}, exception: {}, event: {}, customResponse: {}};            
          } else {
            placeholder = {request: {}, response: {}, exception: {}, event: {}, ifo: {}, code: {}};
          }          
          await this.redisService.setJsonData(processedKey + upId + ':NPV:' + pfjson[i].nodeName + '.PRO',JSON.stringify(placeholder), client);
        }
      }
      this.logger.log('pf Preprocessor completed');
      return 'Success';
    }  catch (error) {
      throw error;
    }
  }

  async getEventandSourceid(pfdto, poNode, event, hsourceid?) {
    let srcStatus, targetStatus, srcQueue, targetQueue, failureQueue, failureTargetStatus, ufname, sourceId
    if (poNode.events.length > 0) {
      for (let e = 0; e < poNode.events.length; e++) {
        // if (event || pfdto.event == poNode.events[e].source.status) {
        let handlerId
        if (event == poNode.events[e].source.status) {
          if (poNode.events[e].eventType == 'UEH') {
            let ufkey = (poNode.events[e].sourceId).split('|')[0]
            let keyname = ufkey.split(':')
            ufname = ((keyname[1] + keyname[5] + keyname[7] + keyname[9] + keyname[11] + keyname[13]).replace(/[-_]/g, '')).replace(/\s+/g, '');
            let sourceid = ((poNode.events[e].sourceId).split('|')[2])
            if (sourceid.includes('/')) {
              handlerId = ((sourceid.split('/'))[sourceid.split('/').length - 1]).replaceAll('.', '')
            } else {
              handlerId = sourceid.replaceAll('.', '')
            }
          }
          else {
            let keyname = pfdto.key.split(':')
            ufname = ((keyname[1] + keyname[5] + keyname[7] + keyname[9] + keyname[11] + keyname[13]).replace(/[-_]/g, '')).replace(/\s+/g, '');
            sourceId = poNode.events[e].id.replaceAll('-', '')
          }
          if (pfdto.nodeType == 'humantasknode') {
            if (hsourceid) {
              if (pfdto.event == poNode.events[e].source.status.trim() && hsourceid == handlerId) {
                srcStatus = poNode.events[e].source.status
                targetStatus = poNode.events[e].success.status
                srcQueue = poNode.events[e].source.queue
                targetQueue = poNode.events[e].success.queue;
                failureQueue = poNode.events[e].failure.queue
                failureTargetStatus = poNode.events[e].failure.status
                break;
              }
            } else {
              srcStatus = poNode.events[e].source.status
              targetStatus = poNode.events[e].success.status
              srcQueue = poNode.events[e].source.queue
              targetQueue = poNode.events[e].success.queue;
              failureQueue = poNode.events[e].failure.queue
              failureTargetStatus = poNode.events[e].failure.status
            }

          } else {
            srcStatus = poNode.events[e].source.status.trim()
            targetStatus = poNode.events[e].success.status.trim()
            srcQueue = poNode.events[e].source.queue
            targetQueue = poNode.events[e].success.queue;
            failureQueue = poNode.events[e].failure.queue
            failureTargetStatus = poNode.events[e].failure.status
          }

        }
      }
    }
    return { ufname, sourceId, srcStatus, targetStatus, srcQueue, targetQueue, failureQueue, failureTargetStatus }
  }

  // Handler
  async savehandler(data,key,event,nodeId,nodeName,nodeType,token,upId,sourceId, lockDetails,childTable?) {
    try {
      this.logger.log('SaveHandler service started...');
      var formdata;     
      if (data && nodeId && nodeName && nodeType && event) {
        var formdata = await this.TEcall(token, key, upId, data,nodeId, nodeName, nodeType, event, sourceId, lockDetails,childTable);
        return formdata;
      }else{
        throw new CustomException('data/nodeId/nodeName/nodeType/event is not found',404)
      }     
    } catch (error) {
      this.logger.log('Error occurred save handler:', error);
      if(error.response && error.status)
        throw error
      else
      throw new CustomException(error.message?error.message:error.toString(),500);     
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

  async TEcall(token,key,upId,data,nodeId,nodeName,nodeType,event,sourceId, lockDetails, childTable?){
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
        pfdto.lock = lockDetails      
        pfdto.childTable = childTable     
        formdata =  await this.EventEmitter(pfdto)              
      return formdata
  }catch(err){    
    throw err
  }
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
      
}