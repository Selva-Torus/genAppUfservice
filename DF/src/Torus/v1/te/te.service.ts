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
    let tenant = await this.teCommonService.splitcommonkey(pfdto.key, 'CK');
    let app = await this.teCommonService.splitcommonkey(pfdto.key, 'AFGK');
    const page = pfdto.page;
    const count = pfdto.count;
    let nodeInfo;
    try {
      this.logger.log('Event Emmiter Started....');

      let event;
      let pid;
      let invalidEventFlg = 0;
      let flg = 0;
      let mergearr = [];
      let prevres = {};
      let refflag;
      let ufkey;
      let keyname;
      let ufname;
      let node;
      let pfjson;
      let poJson;
      let pfo;
      let hlrId;
      let sourceId;
      var processedKey;
      let dstkey;

      var currentFabric = await this.teCommonService.splitcommonkey(
        pfdto.key,
        'FNK',
      ); //pfdto.key.split('FNK')[1].split(':')[1]
      let fngkKey = await this.teCommonService.splitcommonkey(
        pfdto.key,
        'FNGK',
      ); //pfdto.key.split('FNGK')[1].split(':')[1]
      if (pfdto.key.includes(fngkKey)) {
        processedKey = pfdto.key.replace(fngkKey, fngkKey + 'P');
      }
     
      let client = process.env.CLIENTCODE;     
      if (!client) throw new CustomException('client not found', 404);

       if (currentFabric == 'PF-PFD') {
         sourceId = pfdto?.sourceId
      //   if (pfdto.sourceId) {
      //     hlrId = pfdto.sourceId?.split('|')[2];
      //     if (hlrId.includes('/')) {
      //       sourceId = hlrId
      //         .split('/')
      //         [hlrId.split('/').length - 1].replaceAll('.', '');
      //     } else {
      //       sourceId = hlrId.replaceAll('.', '');
      //     }
      //   } else {
      //     throw new CustomException('sourceId is empty', 404);
      //   }
      //   if (!pfdto.data && Object.keys(pfdto.data).length == 0)
      //     throw new CustomException('data not found', 404);
       }

      let d_Pfs, d_Po,d_Pfo;
      if (currentFabric == 'PF-PFD' || currentFabric == 'PF-SFD') {
        d_Pfs = 'PFS';
        d_Po = 'PO';
        d_Pfo = 'PFO';
      } else if (currentFabric == 'DF-DFD') {
        d_Pfs = 'DFS';
        d_Po = 'DO';
        d_Pfo = 'DFO';
      }
      
      if(currentFabric != 'DF-DFD' && (!pfdto.data || pfdto.data.length == 0 || Object.keys(pfdto.data).length == 0))
        throw new CustomException('data not found', 404);
        
      let tokenDecode = this.jwtService.decode(pfdto.token,{ json: true })
      if (!tokenDecode || !tokenDecode.loginId)
        throw new CustomException('Invalid token', 401);

      let artifact = await this.teCommonService.splitcommonkey(
        pfdto.key,
        'AFK',
      );

      node = await this.securityService.getSecurityTemplate(
        pfdto.key + d_Po,
        pfdto.token,
      );
      pfjson = JSON.parse(
        await this.redisService.getJsonData(pfdto.key + d_Pfs, client),
      );
      poJson = JSON.parse(
        await this.redisService.getJsonData(pfdto.key + d_Po, client),
      );
      pfo = JSON.parse(
        await this.redisService.getJsonData(pfdto.key + d_Pfo, client),
      );

      dstkey = processedKey.replace('DF-DFD', 'DF-DST');

      refflag = pfdto.refreshFlag ? pfdto.refreshFlag : 'N';

      //let poNode = poArtifact.node
      var poNode = poJson?.mappedData?.artifact?.node;
      if (!poNode || poNode.length == 0)
        throw new CustomException('Nodes not found', 404);

      let Ndp = JSON.parse(
        await this.redisService.getJsonData(pfdto.key + 'NDP', client),
      );
      let eflg = 0;
      // nodeid validation
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
            //}
          } else {
            flg++;
          }
        }
        if (
          poNode[e].nodeType != 'startnode' &&
          poNode[e].nodeType != 'endnode'
        ) {
          if (currentFabric == 'PF-PFD' || currentFabric == 'PF-SFD') {
            if (poNode[e].events.length > 0) {
              for (let k = 0; k < poNode[e].events.length; k++) {
                if (!poNode[e].events[k].source.status) {
                  throw new CustomException(
                    'Event source status does not exist in ' +poNode[e].nodeName,404
                  );
                }
              }
            } else {
              throw new CustomException('events not found', 404);
            }
          } else {
            if (!poNode[e].events.sourceStatus) {
              throw new CustomException(
                'Event source status does not exist in ' + poNode[e].nodeName,
                404,
              );
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
        if (!pfdto.nodeId) {
          pfdto.nodeId = poNode[i].nodeId;
        }
        if (!pfdto.nodeType) {
          pfdto.nodeType = poNode[i].nodeType;
        }
        if (!pfdto.nodeName) {
          pfdto.nodeName = poNode[i].nodeName;
        }
       

        let srcQueue;
        let srcStatus;
        let handlerId;

        let staticQueue =
          currentFabric == 'PF-PFD' || currentFabric == 'PF-SFD'
            ? 'TPH'
            : 'TDH';

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
              await this.teCommonService.getTPL(processedKey, pfdto.upId,  poNode[i], 'Success', pfdto.token, 'PF');
              pfdto.nodeId = null;
              pfdto.nodeType = null;
              pfdto.nodeName = null;

            }
          } else {
            if (poNode[i].nodeType == 'startnode' && pid == undefined && pfdto.nodeId == poNode[1].nodeId) {

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
      } else if (
          poNode[i].nodeType == 'humantasknode' &&
          poNode[i].nodeId == pfdto.nodeId
        ) {
          this.logger.log('Human Task node started');
          if (pfdto.upId) {
             let nodedetails = await this.securityService.getNodeSecurityTemplate(node,poNode[i].nodeName);
            if (nodedetails?.status == '200') {             
            if(!sourceId){
              srcStatus = poNode[i].events[0].source.status.trim();
               if (pfdto.event == null && event == srcStatus) {
                let npvdata;
                if (await this.redisService.exist(processedKey + pfdto.upId + ':previousResponse',client) ) {
                  npvdata = JSON.parse(await this.redisService.getJsonData(
                      processedKey + pfdto.upId + ':previousResponse',client));
                }              
                return {
                  upId: pfdto.upId,
                  message: `Awaiting for: ${poNode[i].nodeName}`,
                  event: event,
                  insertedData: npvdata,
                };
              }else if(poNode[i].nodeId == poNode[1].nodeId){
                throw new CustomException('Sourceid not found', 404)
              }
            }
               if (pfdto.sourceId) {
              hlrId = pfdto.sourceId?.split('|')[2];
              if (hlrId.includes('/')) {
                sourceId = hlrId
                  .split('/')
                [hlrId.split('/').length - 1].replaceAll('.', '');
              } else {
                sourceId = hlrId.replaceAll('.', '');
              }
            } else {
              throw new CustomException('sourceId is empty', 404);
            }

             if (sourceId) {
              if (poNode[i].events.length > 0) {
                for (let e = 0; e < poNode[i].events.length; e++) {
                  if (poNode[i].events[e].eventType == 'UEH') {
                    ufkey = poNode[i].events[e].sourceId.split('|')[0];
                    keyname = ufkey.split(':');
                    ufname = (
                      keyname[1] +
                      keyname[5] +
                      keyname[7] +
                      keyname[9] +
                      keyname[11] +
                      keyname[13]
                    )
                      .replace(/[-_]/g, '')
                      .replace(/\s+/g, '');
                    let sourceid = poNode[i].events[e].sourceId.split('|')[2];
                    if (sourceid.includes('/')) {
                      handlerId = sourceid
                        .split('/')
                        [sourceid.split('/').length - 1].replaceAll('.', '');
                    } else {
                      handlerId = sourceid.replaceAll('.', '');
                    }
                  }
                  if (
                    pfdto.event == poNode[i].events[e].source.status.trim() &&
                    sourceId == handlerId
                  ) {
                    srcStatus = poNode[i].events[e].source.status.trim();
                    break;
                    //let srcQueue = poNode[i].events[e].source.queue
                  }
                }
              }
            } 
              if (pfdto.event == srcStatus) {
                if (pfdto.data) {  
                  if (pfdto.data['childData']) {
                    await this.redisService.setJsonData(
                      processedKey +
                        pfdto.upId +
                        ':NPV:' +
                        poNode[i].nodeName +
                        '.PRO',
                      JSON.stringify(pfdto.data['childData']),
                      client,
                      'response',
                    );
                  } else {
                    await this.redisService.setJsonData(processedKey +pfdto.upId +':NPV:' + poNode[i].nodeName + '.PRO', JSON.stringify(pfdto.data), client, 'response');
                  }                 
                  await this.redisService.setJsonData(processedKey +pfdto.upId +':NPV:' + poNode[i].nodeName +'.PRO',JSON.stringify(pfdto.data),client,'request');

                  //Setting Up Node response
                  let nodeObjArr = [];
                  nodeObjArr.push({
                    nodeName: poNode[i].nodeName,
                    nodeId: pfdto.nodeId,
                    nodeType: pfdto.nodeType,
                    sourceStatus: pfdto.event,
                    timeStamp: new Date().toString(),
                    currentStatus: 'Failed',
                  });

                  if (
                    await this.redisService.exist(processedKey + pfdto.upId + ':nodeResponse',client)
                  ) {
                    await this.redisService.AppendJsonArr(processedKey + pfdto.upId + ':nodeResponse',JSON.stringify(nodeObjArr[0]),client); //
                  } else {
                    await this.redisService.setJsonData(processedKey + pfdto.upId + ':nodeResponse',JSON.stringify(nodeObjArr),client);
                  }

                  // Event Emmiting logic

                  // console.log('h-event', ufname +
                  //       '_' +
                  //       poNode[i].nodeId +
                  //       '_' +
                  //       sourceId +
                  //       '_' +
                  //       pfdto.event);
                 
                  pfdto.data = pfdto.data['childData']?pfdto.data:{ [poNode[i].nodeName]: pfdto.data }
                  eventResponse = await firstValueFrom(
                    this.poClient.send(ufname +'_' + poNode[i].nodeId + '_' +sourceId +'_' +pfdto.event,
                    new PoEvent(pfdto,pfdto.event,pfjson,pfo, poJson,Ndp ,refflag,page,count)))

                       
                    
                      // new PoEvent(pfdto.key, pfdto.upId,pfdto.event, pfdto.data['childData']?pfdto.data:{ [poNode[i].nodeName]: pfdto.data },
                      //   pfdto.token,pfdto.nodeId, poNode[i].nodeName, pfdto.nodeType, refflag, page,count)));

                  if (!eventResponse.status && eventResponse.status != 200) {
                    throw eventResponse;
                  }
                  console.log(
                    `${eventResponse.targetStatus} Event emitted successfully by ${poNode[i].nodeName}`,
                  );

                  //Change current status to success
                  let getNodeResponse = JSON.parse(await this.redisService.getJsonData(processedKey + pfdto.upId + ':nodeResponse',client));
                  for (let s = 0; s < getNodeResponse.length; s++) {
                    if (getNodeResponse[s].nodeId == pfdto.nodeId) {
                      await this.redisService.setJsonData( processedKey + pfdto.upId + ':nodeResponse','"Success"',client,'[' + s + '].currentStatus');
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
                  // }
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
            throw new CustomException('Process Id not found',400);
          }
        } 
        else if (poNode[i].nodeType == 'datasetschemanode' && poNode[i].nodeId == pfdto.nodeId ) {
          //&& poNode[i].nodeId == pfdto.nodeId
          if (Array.isArray(poNode[i].events)) {
            if (poNode[i].events.length > 0) {
              for (let e = 0; e < poNode[i].events.length; e++) {
                var srcstatus = poNode[i].events[e].source.status;
                sourceId = poNode[i].events[e].id;
                srcQueue = poNode[i].events[e].source.queue;
                if (!event) event = pfdto.event 
                if (event == poNode[i].events[e].source.status) {
                  if (poNode[i].events[e].eventType == 'UEH') {                   
                    ufkey = poNode[i].events[e].sourceId.split('|')[0];
                    keyname = ufkey.split(':');
                    ufname = (
                      keyname[1] +
                      keyname[5] +
                      keyname[7] +
                      keyname[9] +
                      keyname[11] +
                      keyname[13]
                    )
                      .replace(/[-_]/g, '')
                      .replace(/\s+/g, '');
                    var handlerid = poNode[i].events[e].sourceId.split('|')[2];
                    if (handlerid.includes('/')) {
                      sourceId = handlerid
                        .split('/')
                        [handlerid.split('/').length - 1].replaceAll('.', '');
                    } else {
                      sourceId = handlerid.replaceAll('.', '');
                    }
                  } else {
                    ufkey = pfdto.key;
                    keyname = ufkey.split(':');
                    ufname = (
                      keyname[1] +
                      keyname[5] +
                      keyname[7] +
                      keyname[9] +
                      keyname[11] +
                      keyname[13]
                    )
                      .replace(/[-_]/g, '')
                      .replace(/\s+/g, '');
                    sourceId = poNode[i].events[e].id.replaceAll('-', '');
                  }
                  srcQueue = poNode[i].events[e].source.queue;
                }
              }
            }
          } else {
            ufkey = pfdto.key;
                    keyname = ufkey.split(':');
                    ufname = (
                      keyname[1] +
                      keyname[5] +
                      keyname[7] +
                      keyname[9] +
                      keyname[11] +
                      keyname[13]
                    )
                      .replace(/[-_]/g, '')
                      .replace(/\s+/g, '');
                    
            var srcstatus = poNode[i].events?.sourceStatus;
            srcQueue = poNode[i].events.sourceQueue;
            if (!event) event = pfdto.event 
          }

          if (currentFabric == 'PF-PFD' || currentFabric == 'PF-SFD') {
            if (!pfdto.data) {
              pfdto.data = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey +pfdto.upId +':NPV:' +poNode[i].nodeName +'.PRO','.request',client));
            } else {
              await this.redisService.setJsonData(processedKey +pfdto.upId +':NPV:' +poNode[i].nodeName +'.PRO',JSON.stringify(pfdto.data),client,'request');
            }
          } else {
            pfdto.data = mergearr;
          }

          let nodeObjArr = [];
          nodeObjArr.push({
            nodeName: poNode[i].nodeName,
            nodeId: pfdto.nodeId,
            nodeType: pfdto.nodeType,
            sourceStatus: event,
            timeStamp: new Date().toString(),
            currentStatus: 'Failed',
          });

          if (
            await this.redisService.exist(
              processedKey + pfdto.upId + ':nodeResponse',
              client,
            )
          ) {
            await this.redisService.AppendJsonArr(
              processedKey + pfdto.upId + ':nodeResponse',
              JSON.stringify(nodeObjArr[0]),
              client,
            );
          } else {
            await this.redisService.setJsonData(
              processedKey + pfdto.upId + ':nodeResponse',
              JSON.stringify(nodeObjArr),
              client,
            );
          }
          // console.log('ds-event',  ufname +'_' +poNode[i].nodeId +'_' +sourceId +'_' +event);
          
          if (event == srcstatus) {
            if (currentFabric == 'PF-PFD' || currentFabric == 'PF-SFD') {
              eventResponse = await firstValueFrom(
                this.poClient.send(
                  ufname +'_' +poNode[i].nodeId +'_' +sourceId +'_' +event,
                  // new PoEvent(pfdto.key,pfdto.upId,event,pfdto.data,pfdto.token,pfdto.nodeId,poNode[i].nodeName,pfdto.nodeType,refflag),
                      new PoEvent(pfdto,event,pfjson,pfo, poJson,Ndp ,refflag,page,count)))
                
            } else {
              eventResponse = await firstValueFrom(
                this.poClient.send(
                  artifact + '_' + poNode[i].nodeId + '_' + event,
                  // new PoEvent(pfdto.key,pfdto.upId,event,pfdto.data,pfdto.token,pfdto.nodeId,poNode[i].nodeName,pfdto.nodeType,refflag),
                      new PoEvent(pfdto,event,pfjson,pfo, poJson,Ndp ,refflag,page,count)))
               
            }

            if (!eventResponse.status && eventResponse.status != 200) {
              throw eventResponse;
            }
            console.log(`${eventResponse.targetStatus} Event emitted successfully by ${poNode[i].nodeName}`);

            // if (currentFabric == 'PF-PFD' || currentFabric == 'PF-SFD') {
            //   AOMergeArr.push(eventResponse?.data)
            // }

            //Change current status to success
            let getNodeResponse = JSON.parse(await this.redisService.getJsonData(processedKey + pfdto.upId + ':nodeResponse',client));
            for (let s = 0; s < getNodeResponse.length; s++) {
              if (getNodeResponse[s].nodeId == pfdto.nodeId) {
                await this.redisService.setJsonData(processedKey + pfdto.upId + ':nodeResponse','"Success"',client,'[' + s + '].currentStatus',);
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
        } 
        else if (poNode[i].nodeType == 'datasetnode') {// && currentFabric == 'PF-PAFD'
          this.logger.log('API Dataset node started')
          if (poNode[i].nodeId == pfdto.nodeId) {
           
            if (Array.isArray(poNode[i].events)) {
              if (poNode[i].events.length > 0) {
                for (let e = 0; e < poNode[i].events.length; e++) {
                  srcStatus = poNode[i].events[e].source.status
                  sourceId = poNode[i].events[e].id
                  srcQueue = poNode[i].events[e].source.queue
                  if (!event) event = pfdto.event                 

                  if (event == poNode[i].events[e].source.status) {

                    if (poNode[i].events[e].eventType == 'UEH') {
                      //sourceId = ((poNode[i].events[e].sourceId).split('|')[2]).split('.')[0] 
                      ufkey = (poNode[i].events[e].sourceId).split('|')[0]
                      keyname = ufkey.split(':')
                      ufname = ((keyname[1] + keyname[5] + keyname[7] + keyname[9] + keyname[11] + keyname[13]).replace(/[-_]/g, '')).replace(/\s+/g, '');
                      var handlerid = ((poNode[i].events[e].sourceId).split('|')[2])
                      if (handlerid.includes('/')) {
                        sourceId = ((handlerid.split('/'))[handlerid.split('/').length - 1]).replaceAll('.', '')
                      } else {
                        sourceId = handlerid.replaceAll('.', '')
                      }
                    }
                    else {                     
                      ufkey = pfdto.key
                      keyname = ufkey.split(':')
                      ufname = ((keyname[1] + keyname[5] + keyname[7] + keyname[9] + keyname[11] + keyname[13]).replace(/[-_]/g, '')).replace(/\s+/g, '');
                      sourceId = poNode[i].events[e].id.replaceAll('-', '')
                    }
                    srcQueue = poNode[i].events[e].source.queue

                  }
                }
              }
            } else {
              srcStatus = poNode[i].events?.sourceStatus
              srcQueue = poNode[i].events?.sourceQueue
              if (!event) event = pfdto.event      
            }
          
            if (currentFabric == 'PF-PFD' || currentFabric == 'PF-SFD') {
              if (!pfdto.data) {
                pfdto.data = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + pfdto.upId + ':NPV:' + poNode[i].nodeName + '.PRO', '.request', client))
              } else {              
                await this.redisService.setJsonData(processedKey + pfdto.upId + ':NPV:' + poNode[i].nodeName + '.PRO', JSON.stringify(pfdto.data), client, 'request')              
              }             
            } else {
              pfdto.data = mergearr
            }


            //Setting Up Node response    
            var nodeObjArr = []
            nodeObjArr.push({
              nodeName: poNode[i].nodeName,
              nodeId: pfdto.nodeId,
              nodeType: pfdto.nodeType,
              sourceStatus: event,
              currentStatus: "Failed"
            })

            if (await this.redisService.exist(processedKey + pfdto.upId + ':nodeResponse', client)) {
              var position = 0
              var res = JSON.parse(await this.redisService.getJsonData(processedKey + pfdto.upId + ':nodeResponse', client))

              for (var b = 0; b < res.length; b++) {
                if (poNode[i].nodeId == res[b].nodeId) {
                  var position = b
                }
              }
              if (position) {
                res.splice(position)
                res.push(nodeObjArr[0])
                await this.redisService.setJsonData(processedKey + pfdto.upId + ':nodeResponse', JSON.stringify(res), client)

              } else {
                await this.redisService.AppendJsonArr(processedKey + pfdto.upId + ':nodeResponse', JSON.stringify(nodeObjArr[0]), client)
              }
            }
            else {
              await this.redisService.setJsonData(processedKey + pfdto.upId + ':nodeResponse', JSON.stringify(nodeObjArr), client)
            }

            if (event == srcStatus) {
              // console.log('ds-event', ufname + '_' + poNode[i].nodeId + '_' + sourceId + '_' + event);

              if (currentFabric == 'PF-PFD' || currentFabric == 'PF-SFD') {
                eventResponse = await firstValueFrom(this.poClient.send(
                  ufname + '_' + poNode[i].nodeId + '_' + sourceId + '_' + event,
                  // new PoEvent(pfdto.key, pfdto.upId, event, pfdto.data, pfdto.token, pfdto.nodeId, poNode[i].nodeName, pfdto.nodeType, refflag),
                 new PoEvent(pfdto,event,pfjson,pfo, poJson,Ndp ,refflag,page,count)))
                
              } else {
                eventResponse = await firstValueFrom(this.poClient.send
                  (artifact + '_' + poNode[i].nodeId + '_' + event,
                    // new PoEvent(pfdto.key, pfdto.upId, event, pfdto.data, pfdto.token, pfdto.nodeId, poNode[i].nodeName, pfdto.nodeType, refflag)));
                     new PoEvent(pfdto,event,pfjson,pfo, poJson,Ndp ,refflag,page,count)))

              }
             
              if (!eventResponse.status && eventResponse.status != 200) {
                throw eventResponse
              }
              console.log(`${eventResponse.targetStatus} Event emitted successfully by ${poNode[i].nodeName}`);

              // if(currentFabric == 'PF-PFD' || currentFabric == 'PF-SFD'){                
                pfdto.data = eventResponse?.data
              // }

              //Change current status to success   
              var getNodeResponse = JSON.parse(await this.redisService.getJsonData(processedKey + pfdto.upId + ':nodeResponse', client))
              for (var s = 0; s < getNodeResponse.length; s++) {
                if (getNodeResponse[s].nodeId == pfdto.nodeId) {
                  await this.redisService.setJsonData(processedKey + pfdto.upId + ':nodeResponse', '"Success"', client, '[' + s + '].currentStatus')
                }
              }             
             

              nodeObjArr = null
              // pfdto.data = null
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
        }
        else if (poNode[i].nodeType == 'api_inputnode') {
          this.logger.log(`${poNode[i].nodeType} started`)
          if (poNode[i].nodeId == pfdto.nodeId) {
             if (Array.isArray(poNode[i].events)) {              
              if (poNode[i].events.length > 0) {
                for (let e = 0; e < poNode[i].events.length; e++) {
                  srcStatus = poNode[i].events[e].source.status                 
                  sourceId = poNode[i].events[e].id
                  srcQueue = poNode[i].events[e].source.queue
                  if (!event) event = pfdto.event                 
                  
                  if (event == poNode[i].events[e].source.status) {

                    if (poNode[i].events[e].eventType == 'UEH') {
                      //sourceId = ((poNode[i].events[e].sourceId).split('|')[2]).split('.')[0] 
                      ufkey = (poNode[i].events[e].sourceId).split('|')[0]
                      keyname = ufkey.split(':')
                      ufname = ((keyname[1] + keyname[5] + keyname[7] + keyname[9] + keyname[11] + keyname[13]).replace(/[-_]/g, '')).replace(/\s+/g, '');
                      var handlerid = ((poNode[i].events[e].sourceId).split('|')[2])
                      if (handlerid.includes('/')) {
                        sourceId = ((handlerid.split('/'))[handlerid.split('/').length - 1]).replaceAll('.', '')
                      } else {
                        sourceId = handlerid.replaceAll('.', '')
                      }
                    }
                    else {                     
                      ufkey = pfdto.key
                      keyname = ufkey.split(':')
                      ufname = ((keyname[1] + keyname[5] + keyname[7] + keyname[9] + keyname[11] + keyname[13]).replace(/[-_]/g, '')).replace(/\s+/g, '');
                      sourceId = poNode[i].events[e].id.replaceAll('-', '')
                    }
                    srcQueue = poNode[i].events[e].source.queue

                  }
                }
              }
            } else {             
              srcStatus = poNode[i].events?.sourceStatus
              srcQueue = poNode[i].events.sourceQueue
            }

            //Setting Up Node response    
            let nodeObjArr = []
            nodeObjArr.push({
              nodeName: poNode[i].nodeName,
              nodeId: pfdto.nodeId,
              nodeType: pfdto.nodeType,
              sourceStatus: event,
              currentStatus: "Failed"
            })

            if (await this.redisService.exist(processedKey + pfdto.upId + ':nodeResponse', client)) {
              var position = 0
              var res = JSON.parse(await this.redisService.getJsonData(processedKey + pfdto.upId + ':nodeResponse', client))

              for (var b = 0; b < res.length; b++) {
                if (poNode[i].nodeId == res[b].nodeId) {
                  var position = b
                }
              }
              if (position) {
                res.splice(position)
                res.push(nodeObjArr[0])
                await this.redisService.setJsonData(processedKey + pfdto.upId + ':nodeResponse', JSON.stringify(res), client)

              } else {
                await this.redisService.AppendJsonArr(processedKey + pfdto.upId + ':nodeResponse', JSON.stringify(nodeObjArr[0]), client)
              }
            }
            else {
              await this.redisService.setJsonData(processedKey + pfdto.upId + ':nodeResponse', JSON.stringify(nodeObjArr), client)
            }           
         
            if(pfdto.data['data']){
               //pfdto.data = await this.keysToLowerCaseOnly(pfdto.data['data'])
                pfdto.data = pfdto.data['data']

            await this.redisService.setJsonData(processedKey + pfdto.upId + ':NPV:' + poNode[i].nodeName + '.PRO', JSON.stringify( pfdto.data), client, 'request')
            }             
            if(event == srcStatus){           
              eventResponse = await firstValueFrom(this.poClient.send(
                ufname + '_' + poNode[i].nodeId + '_' + sourceId + '_' + event,
                 new PoEvent(pfdto,event,pfjson,pfo, poJson,Ndp ,refflag,page,count)))
              
           
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
            // pfdto.data = null
            pfdto.event = null
            pfdto.nodeId = null
            pfdto.nodeType = null
            pfdto.nodeName = null;
            event = eventResponse?.targetStatus           
            sourceId = null

            // return eventResponse

            }else{
              pfdto.nodeId = null
              pfdto.nodeType = null
              pfdto.nodeName = null;
            }
          }
        }
        else if (poNode[i].nodeType == 'api_outputnode') {
          this.logger.log('API output node started')
          
          if (poNode[i].nodeId == pfdto.nodeId) {         
            
            if (Array.isArray(poNode[i].events)) {              
              if (poNode[i].events.length > 0) {
                for (let e = 0; e < poNode[i].events.length; e++) {
                  srcStatus = poNode[i].events[e].source.status                  
                  
                  sourceId = poNode[i].events[e].id
                  srcQueue = poNode[i].events[e].source.queue
                  if (!event) event = pfdto.event                 

                  if (event == poNode[i].events[e].source.status) {

                    if (poNode[i].events[e].eventType == 'UEH') {
                      //sourceId = ((poNode[i].events[e].sourceId).split('|')[2]).split('.')[0] 
                      ufkey = (poNode[i].events[e].sourceId).split('|')[0]
                      keyname = ufkey.split(':')
                      ufname = ((keyname[1] + keyname[5] + keyname[7] + keyname[9] + keyname[11] + keyname[13]).replace(/[-_]/g, '')).replace(/\s+/g, '');
                      var handlerid = ((poNode[i].events[e].sourceId).split('|')[2])
                      if (handlerid.includes('/')) {
                        sourceId = ((handlerid.split('/'))[handlerid.split('/').length - 1]).replaceAll('.', '')
                      } else {
                        sourceId = handlerid.replaceAll('.', '')
                      }
                    }
                    else {                     
                      ufkey = pfdto.key
                      keyname = ufkey.split(':')
                      ufname = ((keyname[1] + keyname[5] + keyname[7] + keyname[9] + keyname[11] + keyname[13]).replace(/[-_]/g, '')).replace(/\s+/g, '');
                      sourceId = poNode[i].events[e].id.replaceAll('-', '')
                    }
                    srcQueue = poNode[i].events[e].source.queue

                  }
                }
              }
            } else {             
              srcStatus = poNode[i].events?.sourceStatus
              srcQueue = poNode[i].events.sourceQueue
            }
          
            //if (currentFabric == 'PF-CAFD') {
             if (!pfdto.data) 
              pfdto.data = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + pfdto.upId + ':NPV:' + poNode[i].nodeName + '.PRO', '.request', client))

            // } else {
              // pfdto.data = { data: eventResponse}
            // }

            //Setting Up Node response    
            var nodeObjArr = []
            nodeObjArr.push({
              nodeName: poNode[i].nodeName,
              nodeId: pfdto.nodeId,
              nodeType: pfdto.nodeType,
              sourceStatus: event,
              currentStatus: "Failed"
            })

            if (await this.redisService.exist(processedKey + pfdto.upId + ':nodeResponse', client)) {
              var position = 0
              var res = JSON.parse(await this.redisService.getJsonData(processedKey + pfdto.upId + ':nodeResponse', client))

              for (var b = 0; b < res.length; b++) {
                if (poNode[i].nodeId == res[b].nodeId) {
                  var position = b
                }
              }
              if (position) {
                res.splice(position)
                res.push(nodeObjArr[0])
                await this.redisService.setJsonData(processedKey + pfdto.upId + ':nodeResponse', JSON.stringify(res), client)

              } else {
                await this.redisService.AppendJsonArr(processedKey + pfdto.upId + ':nodeResponse', JSON.stringify(nodeObjArr[0]), client)
              }
            }
            else {
              await this.redisService.setJsonData(processedKey + pfdto.upId + ':nodeResponse', JSON.stringify(nodeObjArr), client)
            }  
            if (event == srcStatus) {
              // console.log('op-event',ufname + '_' + poNode[i].nodeId + '_' + sourceId + '_' + event);
             
              eventResponse = await firstValueFrom(this.poClient.send
                (ufname + '_' + poNode[i].nodeId + '_' + sourceId + '_' + event,
                  new PoEvent(pfdto,event,pfjson,pfo, poJson,Ndp ,refflag,page,count)))

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

              // return eventResponse

            } else {
              pfdto.nodeId = null
              pfdto.nodeType = null
              pfdto.nodeName = null;
            }
          }
        } 
        else {
          this.logger.log(`${poNode[i].nodeType} started`);
          //Node level security check
          if (pfdto.upId) {
            let nodedetails =
              await this.securityService.getNodeSecurityTemplate(
                node,
                poNode[i].nodeName,
              );
            let skipNodedata;
            if (nodedetails?.status == '200') {
              // let Config: any = JSON.parse(await this.redisService.getJsonDataWithPath(pfdto.key + 'NDP', '.' + poNode[i].nodeId,client))
              if (poNode[i].nodeId == pfdto.nodeId) {
                if (poNode[i].nodeType != 'endnode') {
                  if (Array.isArray(poNode[i].events)) {
                    if (poNode[i].events.length > 0) {
                      for (let e = 0; e < poNode[i].events.length; e++) {
                        if (
                          event ||
                          pfdto.event == poNode[i].events[e].source.status
                        ) {
                          srcStatus = poNode[i].events[e].source.status;
                          if (poNode[i].events[e].eventType == 'UEH') {
                            ufkey = poNode[i].events[e].sourceId.split('|')[0];
                            keyname = ufkey.split(':');
                            ufname = (
                              keyname[1] +
                              keyname[5] +
                              keyname[7] +
                              keyname[9] +
                              keyname[11] +
                              keyname[13]
                            )
                              .replace(/[-_]/g, '')
                              .replace(/\s+/g, '');
                            let handlerid =
                              poNode[i].events[e].sourceId.split('|')[2];
                            if (handlerid.includes('/')) {
                              sourceId = handlerid
                                .split('/')
                                [
                                  handlerid.split('/').length - 1
                                ].replaceAll('.', '');
                            } else {
                              sourceId = handlerid.replaceAll('.', '');
                            }
                          } else {
                            ufkey = pfdto.key;
                            keyname = ufkey.split(':');
                            ufname = (
                              keyname[1] +
                              keyname[5] +
                              keyname[7] +
                              keyname[9] +
                              keyname[11] +
                              keyname[13]
                            )
                              .replace(/[-_]/g, '')
                              .replace(/\s+/g, '');
                            sourceId = poNode[i].events[e].id.replaceAll(
                              '-',
                              '',
                            );
                          }

                          srcQueue = poNode[i].events[e].source.queue;
                        }
                      }
                    }
                  } else {
                    srcStatus = poNode[i].events?.sourceStatus;
                    srcQueue = poNode[i].events.sourceQueue;
                  }

                  if (!srcQueue) srcQueue = staticQueue;
                }

                //End node returning logic
                if (poNode[i].nodeType == 'endnode') {
                  let getNodeResponse = JSON.parse(
                    await this.redisService.getJsonData(
                      processedKey + pfdto.upId + ':nodeResponse',
                      client,
                    ),
                  );
                  if (getNodeResponse != null) {
                    let flg = 0;
                    let arr = [];
                    for (let pfs = 0; pfs < pfjson.length; pfs++) {
                      let levelkey =Ndp[pfjson[pfs].nodeId]?.data?.pro?.levelKeyName;
                      arr.push(levelkey);
                      // console.log("arr",arr)

                      if (getNodeResponse[getNodeResponse.length - 1].nodeId ==pfjson[pfs].nodeId) {
                        let pfresponse = eventResponse;
                        if (!pfresponse)
                          pfresponse = await this.redisService.getJsonDataWithPath(processedKey + pfdto.upId +':NPV:' + pfjson[pfs].nodeName + '_' + pfjson[pfs].nodeId +'.PRO','.response',client,);
                        

                        let routeArray = pfjson[pfs].routeArray;
                        for (let r = 0; r < routeArray.length; r++) {
                          if (routeArray[r].nodeName == 'End') {
                            if (!srcQueue) srcQueue = staticQueue;
                            await this.redisService.setStreamData(
                              srcQueue,
                              'TASK - ' + pfdto.upId,
                              JSON.stringify({
                                PID: pfdto.upId,
                                TID: pfdto.nodeId,
                                EVENT: 'ProcessCompleted',
                              }),
                            );
                            await this.teCommonService.getTPL(
                              processedKey,
                              pfdto.upId,
                              poNode[i],
                              'Success',
                              pfdto.token,
                              currentFabric,
                            );
                            if (
                              currentFabric == 'PF-PFD' ||
                              currentFabric == 'PF-SFD'
                            ) {
                              //await this.teCommonService.prcLog(tenant+'-'+app+'-TPL')
                              //await this.redisService.deleteKey(tenant+'-'+app+'-TPL',client)
                              //await this.redisService.deleteKey(tenant+'-'+app+'-TSL',client)
                              // return { upId: pfdto.upId, message: 'Success', event: 'ProcessCompleted' }
                              
                              pfresponse = pfresponse.data && pfresponse.data[pfjson[pfs].nodeName]? pfresponse.data[pfjson[pfs].nodeName]:pfresponse;
                            
                              this.logger.log('Event Emmiter Completed....');
                              return {
                                message: 'Success',
                                key: pfdto.key,
                                upId: pfdto.upId,
                                event: event,
                                data: pfresponse,
                              };
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

                                await this.redisService.setJsonData(
                                  dstkey + tokenDecode.loginId + '_DS_Object',
                                  JSON.stringify(obj),
                                  client,
                                );
                                //await this.redisService.setJsonData(dstkey + 'DS_Object', JSON.stringify(obj),client)

                                // await this.teCommonService.prcLog(tenant+'-'+app+'-TPL')

                                // await this.redisService.deleteKey(tenant+'-'+app+'-TPL',client)
                                // await this.redisService.deleteKey(tenant+'-'+app+'-TSL',client)
                                return {
                                  status: 'Success',
                                  statusCode: 201,
                                  processKey: dstkey,
                                  upId: pfdto.upId,
                                  message: 'Success',
                                  event: FinalEvent,
                                  dataset: obj,
                                };
                              }
                            }
                          } else {
                            flg++;
                          }
                        }
                        if (flg == routeArray.length) {
                          throw new CustomException('Event Mismatched',400);
                        }
                      }
                    }
                  } else throw new CustomException('Invalid Request',422);
                }

                // Reading event source queue
                if (await this.redisService.exist(srcQueue, client)) {
                  let grpInfo = await this.redisService.getInfoGrp(srcQueue);
                  if (grpInfo.length == 0) {
                    await this.redisService.createConsumerGroup(
                      srcQueue,
                      'TaskGroup',
                    );
                  } else if (!grpInfo[0].includes('TaskGroup')) {
                    await this.redisService.createConsumerGroup(
                      srcQueue,
                      'TaskGroup',
                    );
                  }

                  let streamData: any =
                    await this.redisService.readConsumerGroup(
                      srcQueue,
                      'TaskGroup',
                      pfdto.event || event,
                    );
                  if (streamData != 'No Data available to read') {
                    for (let s = 0; s < streamData.length; s++) {
                      let msgid = streamData[s].msgid;
                      let data = streamData[s].data;
                      if (event == JSON.parse(data[1]).EVENT) {
                        event = JSON.parse(data[1]).EVENT;
                        await this.redisService.ackMessage(
                          srcQueue,
                          'TaskGroup',
                          msgid,
                        );
                      }
                    }
                  }
                }
            
                if (!event) {
                  event = pfdto.event;
                }
                
                if (event == srcStatus) {
                  if (!pfdto.data) {
                    pfdto.data = JSON.parse(
                      await this.redisService.getJsonDataWithPath(
                        processedKey +
                          pfdto.upId +
                          ':NPV:' +
                          poNode[i].nodeName +
                          '.PRO',
                        '.request',
                        client,
                      ),
                    );
                  }
                  //Setting Up Node response
                  let nodeObjArr = [];
                  nodeObjArr.push({
                    nodeName: poNode[i].nodeName,
                    nodeId: pfdto.nodeId,
                    nodeType: pfdto.nodeType,
                    sourceStatus: event,
                    timeStamp: new Date().toString(),
                    currentStatus: 'Failed',
                  });

                  if (
                    await this.redisService.exist(
                      processedKey + pfdto.upId + ':nodeResponse',
                      client,
                    )
                  ) {
                    await this.redisService.AppendJsonArr(
                      processedKey + pfdto.upId + ':nodeResponse',
                      JSON.stringify(nodeObjArr[0]),
                      client,
                    ); //
                  } else {
                    await this.redisService.setJsonData(
                      processedKey + pfdto.upId + ':nodeResponse',
                      JSON.stringify(nodeObjArr),
                      client,
                    );
                  }

                  // Event Emmiting logic

                  if (
                    mergearr &&
                    mergearr.length > 0 &&
                    currentFabric == 'DF-DFD'
                  ) {
                    for (let m = 0; m < mergearr.length; m++) {
                      let Confignode: any = JSON.parse(
                        await this.redisService.getJsonDataWithPath(
                          pfdto.key + 'NDP',
                          '.' + poNode[1].nodeId,
                          client,
                        ),
                      );
                      if (Confignode.skipNode == 'Y') {
                        if (poNode[i - 1].nodeName == poNode[2].nodeName) {
                          await this.redisService.setJsonData(
                            processedKey +
                              pfdto.upId +
                              ':NPV:' +
                              poNode[1].nodeName +
                              '.PRO',
                            JSON.stringify(mergearr[m]),
                            client,
                            'customResponse',
                          );
                        }
                      } else {
                        if (poNode[i - 1].nodeName == poNode[1].nodeName) {
                          await this.redisService.setJsonData(
                            processedKey +
                              pfdto.upId +
                              ':NPV:' +
                              poNode[1].nodeName +
                              '.PRO',
                            JSON.stringify(mergearr[m]),
                            client,
                            'customResponse',
                          );
                        }
                      }
                      pfdto.data = { data: mergearr[m] };
                      //console.log('mergeEvent', artifact+'_'+poNode[i].nodeId+'_'+event);
                   
                      eventResponse = await firstValueFrom(
                        this.poClient.send(
                          artifact + '_' + poNode[i].nodeId + '_' + event,
                          // new PoEvent(
                          //   pfdto.key,
                          //   pfdto.upId,
                          //   event,
                          //   pfdto.data,
                          //   pfdto.token,
                          //   pfdto.nodeId,
                          //   poNode[i].nodeName,
                          //   pfdto.nodeType,
                          //   refflag,
                          //   page,
                          //   count,
                          //   pfdto.filterData,
                          // ),

                        new PoEvent(pfdto,event,pfjson,pfo, poJson,Ndp ,refflag,page,count)))
                       

                     
                      if (!eventResponse.status || eventResponse.status != 200) {
                        throw eventResponse;
                      }
                      console.log(
                        `${eventResponse.targetStatus} Event emitted successfully by ${poNode[i].nodeName}`,
                      );

                      if (eventResponse) {
                        let eventData = eventResponse?.data;                       
                        if (eventData) {
                          if (
                            Array.isArray(eventData) &&
                            eventData.length > 0
                          ) {
                            Object.assign(mergearr[m], {
                              [poNode[i].nodeName]: eventData,
                            });
                          } else if (Object.keys(eventData).length > 0) {
                            Object.assign(mergearr[m], eventData);
                          }
                        }
                      }                      
                    }

                    await this.teCommonService.getTPL(
                      processedKey,
                      pfdto.upId,
                      poNode[i],
                      'Success',
                      pfdto.token,
                      currentFabric,
                      event,
                    ); //apiUrl,dfoSchema
                  } else {
                    if (currentFabric == 'DF-DFD') {
                      if (skipNodedata) {
                        pfdto.data = skipNodedata;
                      }
                    
                      eventResponse = await firstValueFrom(
                        this.poClient.send(
                          artifact + '_' + poNode[i].nodeId + '_' + event,
                          // new PoEvent(
                          //   pfdto.key,
                          //   pfdto.upId,
                          //   event,
                          //   pfdto.data,
                          //   pfdto.token,
                          //   pfdto.nodeId,
                          //   poNode[i].nodeName,
                          //   pfdto.nodeType,
                          //   refflag,
                          //   page,
                          //   count,
                          //   pfdto.filterData,
                          // ),
                          new PoEvent(pfdto,event,pfjson,pfo, poJson,Ndp ,refflag,page,count)))
                       

                     
                      if (
                        !eventResponse.status &&
                        eventResponse.status != 200
                      ) {
                        throw eventResponse;
                      }
                      console.log(
                        `${eventResponse.targetStatus} Event emitted successfully by ${poNode[i].nodeName}`,
                      );

                      let Config: any = JSON.parse(
                        await this.redisService.getJsonDataWithPath(
                          pfdto.key + 'NDP',
                          '.' + poNode[i].nodeId,
                          client,
                        ),
                      );
                      let eventData = eventResponse?.data;
                      if (
                        eventData &&
                        Array.isArray(eventData) &&
                        eventData.length > 0
                      ) {
                        if (Config.skipNode == 'Y') {
                          skipNodedata = { data: eventData[0] };
                        } else {
                          mergearr = eventData;
                        }
                      } else if (eventData && Object.keys(eventData).length > 0) {                       
                          mergearr = [eventData];                       
                      }
                      
                    } else {
                      // console.log('else-event',ufname +'_' +poNode[i].nodeId + '_' + sourceId +'_' +event);
                  
                      eventResponse = await firstValueFrom(
                        this.poClient.send(ufname +'_' +poNode[i].nodeId + '_' + sourceId +'_' +event,
                          // new PoEvent( pfdto.key, pfdto.upId, event,pfdto.data, pfdto.token, pfdto.nodeId,
                          //   poNode[i].nodeName, pfdto.nodeType, refflag, page,count)
                            new PoEvent(pfdto,event,pfjson,pfo, poJson,Ndp ,refflag,page,count)))
                       
                      if (eventResponse.data && pfdto.nodeType == 'apinode') {
                        //prevres[poNode[i].nodeId] = eventResponse.data;
                        prevres[poNode[i].nodeId] = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + pfdto.upId +':NPV:' + poNode[i].nodeName +'.PRO','.response', client))
                        await this.redisService.setJsonData(
                          processedKey + pfdto.upId + ':previousResponse',
                          JSON.stringify(prevres),
                          client,
                        );
                      }
                     
                      if (
                        !eventResponse.status &&
                        eventResponse.status != 200
                      ) {
                        throw eventResponse;
                      }
                      console.log(
                        `${eventResponse.targetStatus} Event emitted successfully by ${poNode[i].nodeName}`,
                      );
                    }
                  }

                  //Change current status to success
                  let getNodeResponse = JSON.parse(
                    await this.redisService.getJsonData(
                      processedKey + pfdto.upId + ':nodeResponse',
                      client,
                    ),
                  );
                  for (let s = 0; s < getNodeResponse.length; s++) {
                    if (getNodeResponse[s].nodeId == pfdto.nodeId) {                     

                      await this.redisService.setJsonData(
                        processedKey + pfdto.upId + ':nodeResponse',
                        '"Success"',
                        client,
                        '[' + s + '].currentStatus',
                      );
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
                  sourceId = null;
                  pfdto.nodeId = null;
                  pfdto.nodeType = null;
                  pfdto.nodeName = null;
                  invalidEventFlg++;
                }
                
              }
            } else {
              throw nodedetails;
            }
          } else {
            throw new CustomException('Process Id not found',404);
          }
        }
      }

      if (invalidEventFlg == poNode.length - 2) {
        throw new CustomException(`${event} doesn't matched`,400);
      }
    } catch (error) {
    //  console.log('PO ERROR:', error);
      if (pfdto.upId) {
        if (error.statusCode){          
        await this.teCommonService.getTPL(processedKey, pfdto.upId, nodeInfo, 'Failed',
          pfdto.token, currentFabric, '',pfdto.data, error);
           throw new CustomException(error?.message,error.statusCode);
        }
        else {
           
          await this.teCommonService.getTPL(processedKey, pfdto.upId, nodeInfo, 'Failed',
          pfdto.token, currentFabric, '',pfdto.data, error);
          throw new CustomException(error.message?error.message:error.toString(), 500);
        }      
       
      } else {
        if (error.statusCode || error.status) {          
        await this.teCommonService.getTSL(pfdto.key,pfdto.token,error, '');
         throw new CustomException(error?.message?error.message:error.response,error.statusCode?error.statusCode:error.status);
        } 
        else {           
          await this.teCommonService.getTSL(pfdto.key,pfdto.token,error, '');
          throw new CustomException(error.message?error.message:error.toString(), 500);
        }        
      }
    }
  }            

  keysToLowerCaseOnly(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.keysToLowerCaseOnly(item)); // ✅ Use this
    } else if (obj !== null && typeof obj === 'object') {
      return Object.entries(obj).reduce((acc, [key, value]) => {
        acc[key.toLowerCase()] = this.keysToLowerCaseOnly(value); // ✅ Use this
        return acc;
      }, {});
    }
    return obj;
  }

  async TSValidate(key, currentFabric, token, client) {
    this.logger.log('TS validate');
    var valarr: any = [];
    if (!(await this.redisService.exist(key + 'AFI', client))) {
      await this.teCommonService.getTSL(
        key,
        token,
        'ArtifactInfo does not exist',
        400,
        '',
      );
      valarr.push({ error: 'ArtifactInfo does not exist' });
    } else {
      var afiJson = await this.redisService.getJsonData(key + 'AFI', client);
      if (!afiJson) {
        await this.teCommonService.getTSL(
          key,
          token,
          'ArtifactInfo was empty',
          400,
          '',
        );
        valarr.push({ error: 'ArtifactInfo was empty' });
      } else {
        var mode = JSON.parse(
          await this.redisService.getJsonDataWithPath(
            key + 'AFI',
            '.executionMode',
            client,
          ),
        );
      }
    }
    if (!(await this.redisService.exist(key + 'NDP', client))) {
      await this.teCommonService.getTSL(
        key,
        token,
        'NodeProperty does not exist',
        400,
        mode,
      );
      valarr.push({ error: 'NodeProperty does not exist' });
    } else {
      var ndpJson = await this.redisService.getJsonData(key + 'NDP', client);
      if (!ndpJson) {
        await this.teCommonService.getTSL(
          key,
          token,
          'NodeProperty was empty',
          400,
          mode,
        );
        valarr.push({ error: 'NodeProperty was empty' });
      }
    }
    if (currentFabric == 'DF-DFD') {
      if (!(await this.redisService.exist(key + 'DFS', client))) {
        await this.teCommonService.getTSL(
          key,
          token,
          'DataFlow does not exist',
          400,
          mode,
        );
        valarr.push({ error: 'DataFlow does not exist' });
      } else {
        var dfsJson = await this.redisService.getJsonData(key + 'DFS', client);
        if (!dfsJson) {
          await this.teCommonService.getTSL(
            key,
            token,
            'DataFlow was empty',
            400,
            mode,
          );
          valarr.push({ error: 'DataFlow was empty' });
        }
      }
      if (!(await this.redisService.exist(key + 'DO', client))) {
        await this.teCommonService.getTSL(
          key,
          token,
          'DO does not exist',
          400,
          mode,
        );
        valarr.push({ error: 'DO does not exist' });
      } else {
        var doJson = await this.redisService.getJsonData(key + 'DO', client);
        if (!doJson) {
          await this.teCommonService.getTSL(
            key,
            token,
            'DO was empty',
            400,
            mode,
          );
          valarr.push({ error: 'DO was empty' });
        }
      }
      if (!(await this.redisService.exist(key + 'DFO', client))) {
        await this.teCommonService.getTSL(
          key,
          token,
          'DFO does not exist',
          400,
          mode,
        );
        valarr.push({ error: 'DFO does not exist' });
      } else {
        var dfoJson = await this.redisService.getJsonData(key + 'DFO', client);
        if (!dfoJson) {
          await this.teCommonService.getTSL(
            key,
            token,
            'DFO was empty',
            400,
            mode,
          );
          valarr.push({ error: 'DFO was empty' });
        }
      }
    } else if (currentFabric == 'PF-PFD') {
      if (!(await this.redisService.exist(key + 'PFS', client))) {
        await this.teCommonService.getTSL(
          key,
          token,
          'ProcessFlow does not exist',
          400,
          mode,
        );
        valarr.push({ error: 'ProcessFlow does not exist' });
      } else {
        var pfsJson = await this.redisService.getJsonData(key + 'PFS', client);
        if (!pfsJson) {
          await this.teCommonService.getTSL(
            key,
            token,
            'ProcessFlow was empty',
            400,
            mode,
          );
          valarr.push({ error: 'ProcessFlow was empty' });
        }
      }
      if (!(await this.redisService.exist(key + 'PO', client))) {
        await this.teCommonService.getTSL(
          key,
          token,
          'PO does not exist',
          400,
          mode,
        );
        valarr.push({ error: 'PO does not exist' });
      } else {
        var poJson = await this.redisService.getJsonData(key + 'PO', client);
        if (!poJson) {
          await this.teCommonService.getTSL(
            key,
            token,
            'PO was empty',
            400,
            mode,
          );
          valarr.push({ error: 'PO was empty' });
        }
      }
      if (!(await this.redisService.exist(key + 'PFO', client))) {
        await this.teCommonService.getTSL(
          key,
          token,
          'PFO does not exist',
          400,
          mode,
        );
        valarr.push({ error: 'PFO does not exist' });
      } else {
        var dfoJson = await this.redisService.getJsonData(key + 'PFO', client);
        if (!dfoJson) {
          await this.teCommonService.getTSL(
            key,
            token,
            'PFO was empty',
            400,
            mode,
          );
          valarr.push({ error: 'PFO was empty' });
        }
      }
    }

    if (valarr.length == 0) {
      var arrobj = {};
      arrobj['validateresult'] = 'validation completed';
      return arrobj;
    }
    return valarr;
  }

  // pfPreProcessor
  async pfPreProcessor(processedKey, pfjson, upId, fabric) {
    this.logger.log('Pf PreProcessor started!');
    try {
      var placeholder;

      let client = process.env.CLIENTCODE;
      for (var i = 0; i < pfjson.length; i++) {
        if (
          pfjson[i].nodeType != 'startnode' &&
          pfjson[i].nodeType != 'endnode'
        ) {
          //set npc, ipc placeholders
          //await this.redisService.setJsonData(processedKey + upId + ':NPV:' + pfjson[i].nodeName + '.PRE', JSON.stringify(placeholder))
          if (fabric == 'DF-DFD') {
            placeholder = {
              request: {},
              response: {},
              exception: {},
              event: {},
              customResponse: {},
            };
            await this.redisService.setJsonData(
              processedKey + upId + ':NPV:' + pfjson[i].nodeName + '.PRO',
              JSON.stringify(placeholder),
              client,
            );
          } else {
            placeholder = {
              request: {},
              response: {},
              exception: {},
              event: {},
              ifo: {},
              code: {},
            };
            await this.redisService.setJsonData(
              processedKey + upId + ':NPV:' + pfjson[i].nodeName + '.PRO',
              JSON.stringify(placeholder),
              client,
            );
          }

          //await this.redisService.setJsonData(processedKey + upId + ':NPV:' + pfjson[i].nodeName + '.PST', JSON.stringify(placeholder))
        }
      }
      this.logger.log('pf Preprocessor completed');
      return 'Success';
    } catch (error) {
      throw error;
    }
  }

  // Handler

  async savehandler(data,key,event,nodeId,nodeName,nodeType,token,upId,sourceId) {
    try {
      this.logger.log('SaveHandler service started...');

      var formdata;
      var teData;
      var objdata = {};
      // var errdata = {
      //   tname: 'TE',
      //   errGrp: 'Technical',
      //   fabric: 'PF',
      //   errType: 'Fatal',
      //   errCode: '001',
      // };

      
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
      if (data && nodeId && nodeName && nodeType && event) {
        var formdata = await this.TEcall(
          token,
          key,
          upId,
          data,
          nodeId,
          nodeName,
          nodeType,
          event,
          sourceId,
        );
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