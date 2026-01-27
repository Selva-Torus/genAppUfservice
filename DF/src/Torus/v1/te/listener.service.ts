import {Inject, Injectable, Logger,OnModuleDestroy, OnModuleInit, forwardRef } from "@nestjs/common";
import { pfDto } from "src/dto";
import { RedisService } from "src/redisService";
const  Xid = require('xid-js');
import { CommonService } from "src/common.Service";
import { CustomException } from "src/customException";
import { JwtService } from "@nestjs/jwt";
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Queue, JobsOptions, QueueOptions } from 'bullmq';
import { EventEmitterProcessor } from "./event-emitter.processor";
import { TeService } from "./te.service";
import { AxiosRequestConfig } from "axios";
import Redis from "ioredis";
import { Kafka, Producer, Consumer, CompressionTypes, EachMessagePayload } from 'kafkajs';

@Injectable()
export class ListenerService implements OnModuleInit, OnModuleDestroy{ 
    private isRunning = false;
    private abortController: AbortController;
    private intervals = new Map< string, NodeJS.Timeout>(); 
    private queues: Map< string, Queue> = new Map();
    private intervalJobs: Map< string, NodeJS.Timeout> = new Map();
    private kafka: Kafka;
    private producer: Producer;
    private consumers: Map<string, Consumer> = new Map();

    constructor(
        private readonly redisService:RedisService,    
        private readonly jwtService:JwtService,
        private schedulerRegistry: SchedulerRegistry,
        private readonly CommonService: CommonService,
        private readonly teService: TeService,
        @Inject(forwardRef(() => EventEmitterProcessor)) private readonly processor: EventEmitterProcessor
    ){
       this.kafka = new Kafka({
        clientId: process.env.KAFKA_CLIENT_ID,
        brokers: [process.env.KAFKA_BROKER],
       }); 
    }
    private readonly logger = new Logger(ListenerService.name)    
   

   
  async onModuleInit() {   
  // this.startListening();
  }

  async onModuleDestroy() {
    //await this.stop();
  }

   async getProducer(): Promise<Producer> {
    if (!this.producer) {
      this.producer = this.kafka.producer({
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
      const consumer = this.kafka.consumer({
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

  async startListening(): Promise<void> {   

    let keyarr = []
        
    let artifactToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbklkIjoic2VsdmEiLCJjbGllbnQiOiJDSTAwMSIsInR5cGUiOiJjIiwibG9nVHlwZSI6Im1vbmdvZGIiLCJzaWQiOiJhY2Q4ZDVhNi03YTUyLTRkYTctOTk3NS0xMjYzNzg2ZjllMGMiLCJpYXQiOjE3Njk0ODc5NzMsImV4cCI6MTc2OTQ4OTE3M30.vO78lIoxwGSS5t77XKDfOWEJck5LuImODZ-mmA_yt4Q';  
    for (const key of keyarr) {
      this.listenToKey(key,artifactToken); // fire & forget
    }  

  }

  async listenToKey(key: string,artifactToken): Promise<void> {
    const client = process.env.CLIENTCODE;
    this.isRunning = true;
    while (this.isRunning) {
      try {
        let Ndp = JSON.parse(await this.redisService.getJsonData(key + 'NDP', client));
            let pfs = JSON.parse(await this.redisService.getJsonData(key + 'PFS', client));
            let poJson = JSON.parse(await this.redisService.getJsonData(key + 'PO', client));
            let pfo = JSON.parse(await this.redisService.getJsonData(key + 'PFO', client));

            let currentFabric = await this.CommonService.splitcommonkey(key, 'FNK');
            let fngkKey = await this.CommonService.splitcommonkey(key, 'FNGK');
            let keyname = key.split(':');
            let jobname = ((keyname[1] + keyname[5] + keyname[7] + keyname[9] + keyname[11] + keyname[13]).replace(/[-_]/g, '')).replace(/\s+/g, '');
            let processedKey = key;
            if (key.includes(fngkKey)) {
              processedKey = key.replace(fngkKey, fngkKey + 'P');
            }

            let ponode = poJson?.mappedData?.artifact?.node;
            if (!ponode || ponode.length === 0) {
              throw new CustomException('Nodes not found', 404);
            }

            let sourceStatus = 'N';
            if (ponode[1]?.events?.length > 0) {
              for (let e of ponode[1].events) {
                sourceStatus = e.source.status;
              }
            }

          // let upId = Xid.next();
            let pfdto = new pfDto();

            pfdto.key = key;
            //pfdto.upId = upId;
            pfdto.token = artifactToken;
            pfdto.nodeId = ponode[1].nodeId;
            pfdto.nodeName = ponode[1].nodeName;
            pfdto.event = sourceStatus
            pfdto.nodeType = ponode[1].nodeType;
            pfdto.data = {};

            //await this.pfPreProcessor(processedKey, pfs, upId, currentFabric);
            //let preData = 'Y'
            let pfProcessorResponse: any =
              await this.firstProcessor(
                pfdto,
                sourceStatus,
                pfs,
                poJson,
                pfo,
                Ndp,
                currentFabric,
                'N',
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined ,
                false            
              );

             // console.log('pfProcessorResponse',pfProcessorResponse);
              
            if (!pfProcessorResponse?.status || pfProcessorResponse.status !== 200) {            
              throw pfProcessorResponse;  
                    
            }

            if (pfProcessorResponse?.data) {
              let pfResponseData =
                pfProcessorResponse.data

              if (pfResponseData && Object.keys(pfResponseData).length > 0) {
                pfdto.event = sourceStatus;
                pfdto.nodeId = ponode[1].nodeId;
                pfdto.nodeName = ponode[1].nodeName;
                pfdto.nodeType = ponode[1].nodeType;
                pfdto.data = pfResponseData;                        
                await this.addEventEmitterJob(jobname,pfdto,jobname,processedKey,pfs,currentFabric); 
              }           
            }

      } catch (err) {
        console.error(`Listener error for key ${key}`, err);
        await this.sleep(3000);
      }

    //   🔁 short poll interval PER KEY
      await this.sleep(1000);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    this.abortController?.abort();
    await this.redisService.quit();
    //.logger.log(`Stopped listener for '${this.options.streamName}'`);
  }

  async startCronJob(name: string, interval, pfdto,client,token) {
    this.logger.log(`Interval: ${interval}`); 
    let temp = pfdto       
    const job:any = new CronJob(interval, async () => {
      try {    
        pfdto = temp   
       let artifactKey = pfdto.key
       let artifactToken = token
       let  sourceStatus, refflag, sourceId, currentFabric,processedKey; 
       currentFabric = await this.CommonService.splitcommonkey(pfdto.key, 'FNK');
       let fngkKey = await this.CommonService.splitcommonkey(pfdto.key, 'FNGK');
       if (pfdto.key.includes(fngkKey)) {
         processedKey = pfdto.key.replace(fngkKey, fngkKey + 'P');
       }
       let client = process.env.CLIENTCODE;
       if (!client) throw new CustomException('client not found', 404);
       if (currentFabric == 'PF-PFD' || currentFabric == 'PF-SCDL') {
        sourceId = pfdto?.sourceId
       }      
       
       let tokenDecode = this.jwtService.decode(pfdto.token, { json: true })
       if (!tokenDecode || !tokenDecode.loginId)
         throw new CustomException('Invalid token', 401);
     
      
      
      //if(logicCenter || currentFabric == 'PF-PFD')
      // let afi = JSON.parse(await this.redisService.getJsonData(pfdto.key + 'AFI', client));
      //  node = await this.securityService.getSecurityTemplate(pfdto.key + 'PO', pfdto.token);
      //  pfjson = JSON.parse(await this.redisService.getJsonData(pfdto.key + 'PFS', client));
      //  poJson = JSON.parse(await this.redisService.getJsonData(pfdto.key + 'PO', client));
      //  pfo = JSON.parse(await this.redisService.getJsonData(pfdto.key + 'PFO', client));
      //  Ndp = JSON.parse(await this.redisService.getJsonData(pfdto.key + 'NDP', client));   
       
       let [afi, pfjson, poJson, pfo, Ndp] = await Promise.all([
        this.redisService.getJsonData(pfdto.key + 'AFI', client).then(JSON.parse),        
        this.redisService.getJsonData(pfdto.key + 'PFS', client).then(JSON.parse),
        this.redisService.getJsonData(pfdto.key + 'PO', client).then(JSON.parse),
        this.redisService.getJsonData(pfdto.key + 'PFO', client).then(JSON.parse),
        this.redisService.getJsonData(pfdto.key + 'NDP', client).then(JSON.parse)
      ]);

      let logicCenter
        if (afi && afi.hasOwnProperty('logicCenter')) {
        if(currentFabric == 'DF-DFD')
        logicCenter = afi?.logicCenter
      }else{
        logicCenter = true
      }
      
       refflag =  'N';
       let ponode = poJson?.mappedData?.artifact?.node;      

       if (!ponode || ponode.length == 0)
         throw new CustomException('Nodes not found', 404);

        if(ponode[1].events.length>0){
          for(let a=0;a< ponode[1].events.length;a++){
              sourceStatus = ponode[1].events[a].source.status
          }
        }  

       // let upId =  Xid.next();
        pfdto['key'] = artifactKey
        //pfdto['upId'] = upId
        pfdto['token'] = artifactToken
        pfdto['nodeId'] = ponode[1].nodeId
        pfdto['nodeName'] = ponode[1].nodeName
        pfdto['nodeType'] = ponode[1].nodeType 
        pfdto['event']  = sourceStatus    
        pfdto['data'] = {}    

       // await this.pfPreProcessor(processedKey, pfjson, upId, currentFabric);
       
        let pfProcessorResponse:any = await this.firstProcessor(pfdto, sourceStatus, pfjson ,poJson,pfo, Ndp,currentFabric, refflag, undefined, undefined, undefined, undefined,undefined,logicCenter,false)
       
        
        if (!pfProcessorResponse?.status && pfProcessorResponse?.status != 200 ) {
          throw pfProcessorResponse;
        }
       
        if(pfProcessorResponse?.data){
          let pfResponseData = pfProcessorResponse.data
          
          if(pfResponseData){            
            pfdto = {}
           // for (let p = 0; p < pfResponseData.length; p++) {
              pfdto['key'] = artifactKey
               pfdto['token'] = artifactToken
               pfdto['event'] = sourceStatus
              // pfdto['upId'] = upId
               pfdto['data'] = pfResponseData
              pfdto['nodeId'] = ponode[1].nodeId
              pfdto['nodeName'] = ponode[1].nodeName
              pfdto['nodeType'] = ponode[1].nodeType
              this.logger.log(`Running dynamic job with data: ${JSON.stringify(pfdto)}`);
              // await this.redisService.setJsonData(processedKey + upId + ':NPV:' + ponode[1].nodeName + '.PRO', JSON.stringify(pfResponseData[p]), client, 'response',);
             
              // cronResponse = await this.EventEmitter(pfdto);
                await this.addEventEmitterJob(name,pfdto,name,processedKey,pfjson,currentFabric); 
              //  if (cronResponse?.message === 'Success' && cronResponse?.statusCode === 201) {
              //    pfdto = {}
              //    pfdto['nodeId'] = ponode[2].nodeId
              //    pfdto['nodeName'] = ponode[2].nodeName
              //    pfdto['nodeType'] = ponode[2].nodeType
              //  }
            // }           
          }          
         
            }  
      } catch (error) {
        
        this.logger.error(`Error in cron job '${JSON.stringify(error)}'`);
        //pfdto = {}; 
        let sourceStatus
          let ponode = JSON.parse(await this.redisService.getJsonDataWithPath(pfdto.key + 'PO','.mappedData.artifact.node',client))
          if(ponode[1].events.length>0){
            for(let a=0;a< ponode[1].events.length;a++){
               sourceStatus = ponode[1].events[a].source.status
            }
          }                    
          pfdto['nodeId'] = ponode[1].nodeId
          pfdto['nodeName'] = ponode[1].nodeName
          pfdto['nodeType'] = ponode[1].nodeType
          pfdto['event'] = sourceStatus        
      }
    });   
    await this.schedulerRegistry.addCronJob(name, job);
    job.start();   
    this.logger.log(`Started job: ${name}`); 
  }

  async startInterval(jobname,interval,pfdto,client,token) {
    this.logger.log(`Interval Step`); 
    let temp = pfdto 
    const intervalId = setInterval(async () => {
      try {    
        pfdto = temp   
        let artifactKey = pfdto.key
        let artifactToken = token
        let  sourceStatus, refflag,sourceId, currentFabric,processedKey; 
        currentFabric = await this.CommonService.splitcommonkey(pfdto.key, 'FNK');
        let fngkKey = await this.CommonService.splitcommonkey(pfdto.key, 'FNGK');
        if (pfdto.key.includes(fngkKey)) {
          processedKey = pfdto.key.replace(fngkKey, fngkKey + 'P');
        }
        let client = process.env.CLIENTCODE;
        if (!client) throw new CustomException('client not found', 404);
        if (currentFabric == 'PF-PFD' || currentFabric == 'PF-SCDL') {
          sourceId = pfdto?.sourceId
        }      
        
        let tokenDecode = this.jwtService.decode(pfdto.token, { json: true })
        if (!tokenDecode || !tokenDecode.loginId)
          throw new CustomException('Invalid token', 401);
      
        
        
        //if(logicCenter || currentFabric == 'PF-PFD')
        // let afi = JSON.parse(await this.redisService.getJsonData(pfdto.key + 'AFI', client));
        // node = await this.securityService.getSecurityTemplate(pfdto.key + 'PO', pfdto.token);
        // pfjson = JSON.parse(await this.redisService.getJsonData(pfdto.key + 'PFS', client));
        // poJson = JSON.parse(await this.redisService.getJsonData(pfdto.key + 'PO', client));
        // pfo = JSON.parse(await this.redisService.getJsonData(pfdto.key + 'PFO', client));
        // Ndp = JSON.parse(await this.redisService.getJsonData(pfdto.key + 'NDP', client));   
        
        let [afi, pfjson, poJson, pfo, Ndp] = await Promise.all([
        this.redisService.getJsonData(pfdto.key + 'AFI', client).then(JSON.parse),       
        this.redisService.getJsonData(pfdto.key + 'PFS', client).then(JSON.parse),
        this.redisService.getJsonData(pfdto.key + 'PO', client).then(JSON.parse),
        this.redisService.getJsonData(pfdto.key + 'PFO', client).then(JSON.parse),
        this.redisService.getJsonData(pfdto.key + 'NDP', client).then(JSON.parse)
      ]);

        let logicCenter
        if (afi && afi.hasOwnProperty('logicCenter')) {
          if(currentFabric == 'DF-DFD')
          logicCenter = afi?.logicCenter
        }else{
          logicCenter = true
        }
        refflag =  'N';
        let ponode = poJson?.mappedData?.artifact?.node;      

        if (!ponode || ponode.length == 0)
          throw new CustomException('Nodes not found', 404);

          if(ponode[1].events.length>0){
            for(let a=0;a< ponode[1].events.length;a++){
                sourceStatus = ponode[1].events[a].source.status
            }
          }  

         // let upId =  Xid.next();
          pfdto['key'] = artifactKey
         // pfdto['upId'] = upId
          pfdto['token'] = artifactToken
          pfdto['nodeId'] = ponode[1].nodeId
          pfdto['nodeName'] = ponode[1].nodeName
          pfdto['nodeType'] = ponode[1].nodeType  
          pfdto['event'] = sourceStatus    
          pfdto['data'] = {}    

        // let res = await this.pfPreProcessor(processedKey, pfjson, upId, currentFabric);
         // if(res == 'Success'){
         let preData = 'Y'
            let pfProcessorResponse:any = await this.firstProcessor(pfdto, sourceStatus, pfjson ,poJson,pfo, Ndp,currentFabric, refflag, undefined, undefined, undefined, undefined,undefined,logicCenter,false)
                            
          if (!pfProcessorResponse?.status && pfProcessorResponse?.status != 200 ) {
            throw pfProcessorResponse;
          }
        
          if(pfProcessorResponse?.data){
            let pfResponseData = pfProcessorResponse.data           
            if(pfResponseData && Object.keys(pfResponseData).length>0){              
                pfdto = {}             
                pfdto['key'] = artifactKey
                pfdto['token'] = artifactToken
                pfdto['event'] = sourceStatus               
                pfdto['data'] = pfResponseData
                pfdto['nodeId'] = ponode[1].nodeId
                pfdto['nodeName'] = ponode[1].nodeName
                pfdto['nodeType'] = ponode[1].nodeType               
                await this.addEventEmitterJob(jobname,pfdto,jobname,processedKey,pfjson,currentFabric);             
            }                     
          } 
         // }
          
          
      } catch (error) {        
        this.logger.error(`Error in cron job '${JSON.stringify(error)}'`);
        //pfdto = {}; 
        let sourceStatus
          let ponode = JSON.parse(await this.redisService.getJsonDataWithPath(pfdto.key + 'PO','.mappedData.artifact.node',client))
          if(ponode[1].events.length>0){
            for(let a=0;a< ponode[1].events.length;a++){
              sourceStatus = ponode[1].events[a].source.status
            }
          }                    
          pfdto['nodeId'] = ponode[1].nodeId
          pfdto['nodeName'] = ponode[1].nodeName
          pfdto['nodeType'] = ponode[1].nodeType
          pfdto['event'] = sourceStatus        
      }
    },interval);
    this.intervalJobs.set(jobname, intervalId);
  }

  async addEventEmitterJob(queueName: string, pfdto: pfDto, jobName: string,processedKey,pfs,currentFabric,options?: JobsOptions) {
    try {
      const queue = this.getQueue(queueName);
      if(pfdto && (Object.keys(pfdto.data).length >0 || pfdto.data.length > 0)){
        let tempData = pfdto.data
        if(!Array.isArray(tempData)) tempData = [tempData]
       
        // Step 1: Generate all upIds and prepare preprocessing tasks
        const preprocessingTasks = tempData.map(item => {
          const upId = Xid.next();
          return { upId, item };
        });

        // Step 2: Run all pfPreProcessor calls in parallel      
        await Promise.all(
          preprocessingTasks.map(({ upId }) =>
            this.teService.pfPreProcessor(processedKey, pfs, upId, currentFabric)
          )
        );
        const preprocessEndTime = performance.now();

        // Step 3: Prepare all jobs for bulk addition
        const jobsToAdd = preprocessingTasks.map(({ upId, item }) => ({
          name: jobName,
          data: {
            ...pfdto,
            upId: upId,
            data: item
          },
          opts: {
            jobId: upId,
            ...options,
            attempts: 3,  // ✅ Fixed: Enable retries (was 0)
            backoff: {
              type: 'exponential',
              delay: 1000,  // ✅ Reduced from 2000ms for faster retries
            },
            priority: options?.priority,
            removeOnComplete: false,
            removeOnFail: false,
          }
        }));

        // Step 4: Batch add all jobs in a single Redis call
        if (jobsToAdd.length > 0) {        
          const jobs = await queue.addBulk(jobsToAdd);        
          jobs.forEach(job => {
            this.logger.log(`Job ${job.id} added to queue with priority ${job.opts.priority}`);
          });
        }
      }
    } catch (error) {
      this.logger.error(`Failed to add job to queue: ${error.message}`);
      throw error;
    }
  }

    getQueue(queueName: string): Queue {
        // Check if queue already exists
        if (this.queues.has(queueName)) {
            return this.queues.get(queueName);
        }

        // Create new queue dynamically
        const queueOptions: QueueOptions = {
            connection: {
                host: process.env.HOST,
                port: parseInt(process.env.PORT),
            },
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
                removeOnComplete: 100,
                removeOnFail: false,
            },
        };

        const newQueue = new Queue(queueName, queueOptions);
        this.queues.set(queueName, newQueue);
        this.logger.log(`Created new queue: ${queueName}`);

        // Create worker for this queue
        this.processor.createWorker(queueName);

        return newQueue;
    }

    async stopCron(jobname) {
        const job = await this.schedulerRegistry.deleteCronJob(jobname);
        //job.stop();    
    }

    async stopInterval(jobname) {
        const intervalId = this.intervals.get(jobname);
        if (!intervalId) return 'Not running';
        clearInterval(intervalId);
        this.intervals.delete(jobname);
        //const job = await this.schedulerRegistry.deleteInterval(jobname)    
    }

    stopIntervalJob(jobName: string) {
        const intervalId = this.intervalJobs.get(jobName);
        if (intervalId) {
            clearInterval(intervalId);
            this.intervalJobs.delete(jobName);
            this.logger.log(`Interval job stopped: ${jobName}`);
            return {
                jobName,
                status: 'stopped',
                message: `Interval job stopped successfully`,
            };
        }

        return {
            jobName,
            status: 'not_found',
            message: `No active interval job found with name: ${jobName}`,
        };
    }

    async firstProcessor(pfdto, event, pfjson ,poJson,pfo, ndp,currentFabric, flag, page, count, filterData, lockDetails,childtable,logicCenter,semarc) {
    this.logger.log('firstProcessor started!');
      let upId= pfdto.upId
      // this.logger.log('UPID', upId);
      let key:string = pfdto.key
      let inputparam= pfdto.data
      let token = pfdto.token   
      let nodeId = pfdto.nodeId
      let nodeType = pfdto.nodeType
      let nodeName = pfdto.nodeName
      let collectionName = process.env.CLIENTCODE;
      this.logger.log('collectionName', collectionName);
      let offset = (page - 1) * count;
      // let request = inputparam;
      let fngkKey = await this.CommonService.splitcommonkey(pfdto.key, 'FNGK');
      let processedKey
      if (pfdto.key.includes(fngkKey)) {
        processedKey = pfdto.key.replace(fngkKey, fngkKey + 'P');
      }
      let dstkey = processedKey.replace('DF-DFD', 'DF-DST');
      let staticQueue = currentFabric == 'DF-DFD' ? 'TDH' : 'TPH';   
      //let afi = await this.redisService.getJsonData(key+'AFI',collectionName)
      let inputCollection: any = {};   
      var poNode = poJson?.mappedData?.artifact?.node;
      var internalEdges = poJson?.internalMappingEdges;
      let statickeyword = ['get', 'post', 'patch', '200', '201', '202', '204', '400','401','403','404', '500','requestBody','*/*','responses','content', 'application/json','application/xml','text/plain', 'application/jwt', 'application/json; charset=utf-8','schema','properties','allOf', 'oneOf', 'inputschema','outputschema',];
      let numberArr: string[] = Array.from({ length: 101 }, (_, i) => i.toString());       
      let SessionToken = await this.jwtService.decode(token, {json: true});  
      let tokenDecode  =  await this.CommonService.MyAccountForClient(token);
      let sobj = {}, SessionInfo = {}
      //this.logger.log("SessionToken",SessionToken)
        
        sobj['session.orgGrpCode'] = SessionToken.orgGrpCode || process.env?.ORGGRPCODE
        sobj['session.orgCode'] = SessionToken.orgCode || process.env?.ORGCODE
        sobj['session.roleGrpCode'] = SessionToken.roleGrpCode || process.env?.ROLEGRPCODE
        sobj['session.roleCode'] = SessionToken.roleCode || process.env?.ROLECODE
        sobj['session.psGrpCode'] = SessionToken.psGrpCode || process.env?.PSGRPCODE
        sobj['session.psCode'] =  SessionToken.psCode || process.env?.PSCODE
        sobj['session.selectedAccessProfile']= SessionToken.selectedAccessProfile || process.env?.ACCESSPROFILE
        sobj['session.loginId'] = SessionToken.loginId || process.env?.LOGINID
        sobj['session.orgGrpName'] = SessionToken?.orgGrpName || process.env?.ORGGRPNAME
        sobj['session.orgName'] =  SessionToken?.orgName || process.env?.ORGNAME
        sobj['session.roleGrpName'] = SessionToken?.roleGrpName || process.env?.ROLEGRPNAME
        sobj['session.roleName'] = SessionToken?.roleName || process.env?.ROLENAME
        sobj['session.psGrpName'] = SessionToken?.psGrpName || process.env?.PSGRPNAME
        sobj['session.psName'] =  SessionToken?.psName || process.env?.PSNAME
        sobj['session.trs_process_id'] = upId
        sobj['session.userCode'] = SessionToken?.userCode
        sobj['session.subOrgGrpCode'] = SessionToken?.subOrgGrpCode || process.env?.SUBORGGRPCODE
        sobj['session.subOrgGrpName'] = SessionToken?.subOrgGrpName || process.env?.SUBORGGRPNAME
        sobj['session.subOrgCode'] = SessionToken?.subOrgCode || process.env?.SUBORGCODE
        sobj['session.subOrgName'] = SessionToken?.subOrgName || process.env?.SUBORGNAME
          
        SessionInfo['loginId'] = SessionToken?.loginId || process.env?.LOGINID || '' ;
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
        
        let sourceStatus,srcQueue,targetStatus,targetQueue,failureQueue,failureTargetStatus,suspiciousStatus,suspiciousQueue,errorStatus,errorQueue;
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

          //Api Node
          if (nodeType == 'apinode'  && poNode[j].nodeId == nodeId) {
            let lock: any,rollbackConfig,apichildResult: any = []
            try {
              this.logger.log(`${poNode[j].nodeName} Api first node Started`);
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

              if (!referenceKey)
                throw new CustomException('Reference key not found', 404);

              let ApiConfig: any = JSON.parse(await this.redisService.getJsonData(referenceKey, collectionName));

              if (!ApiConfig || Object.keys(ApiConfig).length == 0)
                throw new CustomException('Reference key value not found', 404);

              let apiVal = Object.values(ApiConfig)[0];
              customConfig = apiVal;
              let methodName,parameterQuery,parameter,contentType,serverUrl,endPoint,encCredentials,codeObj;
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
              
              let apiResult: any;
              if (customConfig ) { 
                //serverUrl = 'http://192.168.2.105:5000'
                let apiUrl = serverUrl + endPoint                
                if (apiUrl && methodName == 'get' && !semarc) {
                    // let params = {}                  
                      // params.headers['Authorization'] = `Bearer ${token}`;
                      // const requestConfig: AxiosRequestConfig = {
                      //   headers: params.headers,
                      // };   
                        const requestConfig: AxiosRequestConfig = {
                          headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${token}` 
                          }}; 
                        apiResult = await this.CommonService.getCall(apiUrl, requestConfig,);
                      if (apiResult.statusCode == 201 || apiResult.statusCode == 200) {
                        apiResult = apiResult?.result;
                      } else {
                        throw apiResult;
                      }                
                } else if(semarc){
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
                let RCMresult, customcoderesult,zenresult,codeObj = {};;
                if (currentFabric == 'PF-SCDL') {
                  RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam, processedKey + upId, currentFabric, SessionInfo);               
                  if (RCMresult) {
                    zenresult = RCMresult.rule;
                    customcoderesult = RCMresult.code;
                  }
                  
                  if (customcoderesult != undefined) {
                    if (customcoderesult && Object.keys(customcoderesult).length > 0) {
                      for (let item in customcoderesult) {
                        codeObj[item.toLowerCase()] = customcoderesult[item];
                      }
                    }
                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);
                  }
                }
                  let ifoObj = {}                             
                if (internalMappedObj && Object.keys(internalMappedObj).length > 0) {
                  for (let item in internalMappedObj) {
                    ifoObj[item.toLowerCase()] = internalMappedObj[item];
                  }
                  if(await this.redisService.exist(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO',collectionName))  
                    await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(ifoObj), collectionName, 'ifo',);
                }               

                  if (Array.isArray(inputparam)) {
                    for (let r = 0; r < inputparam.length; r++) {
                      if (codeObj && Object.keys(codeObj).length > 0)
                        inputparam[r] = Object.assign(inputparam[r], codeObj);

                      if (ifoObj && Object.keys(ifoObj).length > 0)
                        inputparam[r] = Object.assign(inputparam[r], ifoObj);
                    // inputparam[r] = Object.assign(inputparam[r], { [nodeName]:  });
                    }
                  } else if (typeof inputparam == 'object'){
                    if (codeObj && Object.keys(codeObj).length > 0)
                        inputparam = Object.assign(inputparam, codeObj);

                      if (ifoObj && Object.keys(ifoObj).length > 0)
                        inputparam = Object.assign(inputparam, ifoObj);
                  }                  
                }
                else {
                  throw new CustomException('API Endpoint does not exist', 404);
                }
              }

              this.logger.log('Api first node completed'); 
              if(semarc)    
                return { status: 200, targetStatus: targetStatus, data:{[nodeName]:inputparam}};  
              else      
                return { status: 200, targetStatus: targetStatus, data: apiResult };
            } catch (error) {
              console.log(error);
              
              throw error
            }
          } 

          //Stream Node
            if (nodeType == 'streamnode' && poNode[j].nodeId == nodeId) {
              try {
                this.logger.log('Stream first node Started');
                let streamArr:any = [];
                let oprname, entryId, streamName, fromStreamid, toStreamid, connectorType, storageType, dpdkey, conncectorName,apikey,responseNodeName,fieldName,isStatic,useAsConsumer,consumerName,consumerGroupName;
                let childInsertArr,textobj,tempQryVal = [] 
                let customConfig = ndp[poNode[j].nodeId] 
                let nodeVersion = customConfig?.nodeVersion;
                if (!nodeVersion)
                  throw new CustomException('nodeVersion not found', 404);
              
                if (nodeVersion.toLowerCase() == 'v1') {
                  connectorType = customConfig?.data?.props?.connector?.value;
                  storageType = customConfig?.data?.props?.connector?._selection?.value;
                  dpdkey = customConfig?.data?.props?.connector?.value;
                  conncectorName = customConfig?.data?.props?.connector?.subSelection?.value;
                  //oprname = customConfig.data?.pro?.operationName?.value;
                  useAsConsumer = customConfig?.data?.props?.useAsConsumer?.value
                  oprname = customConfig?.data?.props?.operation?.value
                  //oprkey = Object.keys(customConfig?.data.pro);
                  if(oprname == 'read'){
                    isStatic = customConfig?.data?.props?.operation?.subSelection[oprname]?.isStatic.value
                    if (isStatic) {
                      streamName = customConfig?.data?.props?.operation?.subSelection[oprname]?.isStatic?.subSelection?._true?.streamName?.value
                      fromStreamid = customConfig?.data?.props?.operation?.subSelection[oprname]?.isStatic?.subSelection?._true?.startTime?.value
                      toStreamid = customConfig?.data?.props?.operation?.subSelection[oprname]?.isStatic?.subSelection?._true?.endTime?.value
                      if (useAsConsumer) {
                        consumerName = customConfig?.data?.props?.operation?.subSelection[oprname]?.isStatic?.subSelection?._true?.useAsConsumer?.subSelection?._true?.consumerName?.value
                        consumerGroupName = customConfig?.data?.props?.operation?.subSelection[oprname]?.isStatic?.subSelection?._true?.useAsConsumer?.subSelection?._true?.consumerGroupName?.value
                        if (!consumerName || !consumerGroupName)
                          throw new CustomException('consumerName/consumerGroupName not found', 404)
                      }
                    }
                  }else if (oprname == 'write'){
                    isStatic = customConfig?.data?.props?.operation?.subSelection[oprname]?.isStatic.value 
                    if(isStatic){
                    streamName = customConfig?.data?.props?.operation?.subSelection[oprname]?.isStatic?.subSelection?._true?.streamName?.value
                    fieldName = customConfig?.data?.props?.operation?.subSelection[oprname]?.isStatic?.subSelection?._true?.streamName?.value
                    } 
                  }
                // streamName = customConfig.data?.pro[oprname]?.streamName;
                  //fromStreamid = customConfig.data?.pro[oprname]?.startTimeZone;
                  //toStreamid = customConfig.data?.pro[oprname]?.endTimeZone;
                  apikey = customConfig.data?.apiKey
                  responseNodeName = customConfig?.outputDataNodes;
                }    
                //else if (nodeVersion.toLowerCase() == 'v2') {
      
                //}
                if (customConfig) {
                  let streamhost
                  let streamport  
                  if(!oprname)
                  throw new CustomException('Operation name not found', 404); 
                  if(currentFabric == 'PF-SCDL' && !semarc){
                    if (storageType?.toLowerCase() == 'external') {
                    if (!dpdkey) throw new CustomException('DPD key not found', 404);
                    let extdata = JSON.parse(await this.redisService.getJsonData(dpdkey + 'NDP', collectionName));
                    let nodedata = Object.keys(extdata)[0];
                    let configConnectors = extdata[nodedata].data['externalConnectors-STREAM']?.items;
                    if (configConnectors?.length > 0) {
                      for (let i = 0; i < configConnectors.length; i++) {
                        if (configConnectors[i].connectorName == conncectorName) {
                          streamhost = configConnectors[i]?.credentials.host;
                          streamport = parseInt(configConnectors[i]?.credentials.port);
                        }
                      }
                    }
                    if (!streamhost || !streamport) {
                    throw new CustomException('Invalid stream credentials', 422);
                  }
                  
                  const ext_redis = new Redis({
                    host: streamhost,
                    port: streamport,
                  });

                    if (oprname == 'read') {                  
                      if (!streamName) {
                        throw new CustomException('Stream RequestParams were empty', 404);
                      }                 
                  
                      const startOfToday = new Date(fromStreamid).getTime();
                      const endOfToday = new Date(toStreamid).getTime(); 
                    
                      if (startOfToday && endOfToday) {
                      
                        streamArr = await ext_redis.xrevrange(streamName,endOfToday, startOfToday,'COUNT',count);
                      }else if (useAsConsumer) {                       
                        if (await ext_redis.call('EXISTS', streamName)) {
                          var grpInfo:any = await ext_redis.xinfo('GROUPS', streamName);                                          
                          if (grpInfo.length == 0) {                       
                            await ext_redis.xgroup('CREATE', streamName, consumerGroupName, '0', 'MKSTREAM');                      
                            
                          } else if (!grpInfo[0].includes(consumerGroupName)) {                       
                            await ext_redis.xgroup('CREATE', streamName, consumerGroupName, '0', 'MKSTREAM');
                          }
                          var result:any = await ext_redis.xreadgroup('GROUP', consumerGroupName, consumerName, 'STREAMS', streamName, '>');                 
                          
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
                                await ext_redis.xack(streamName, consumerGroupName, msgid);                            
                            }  
                                              
                          } else {
                            throw streamData
                          }
                        }
                      }else if(!useAsConsumer && childInsertArr?.length>0){
                        let entryArr = []
                        for(let a =0;a< childInsertArr.length;a++){
                          if(childInsertArr[a].hasOwnProperty('entryId')){
                            entryId = childInsertArr[a]?.entryId
                            let entryData:any = await ext_redis.xrange(streamName, entryId,entryId); 
                            entryData = entryData.flat()
                            let res = entryData[1]
                            entryArr.push(JSON.parse(res[1]))
                          }
                        }                   
                        streamArr = entryArr
                      }
                    
                      if(streamArr?.length == 0)
                        throw new CustomException('No Data available to read from firstProcessor',404)                  
                    
                    }else if(oprname == 'write'){   
                      if(!fieldName) 
                        fieldName = streamName   
                      let idarr = []               
                      if(childInsertArr?.length>0 && streamName && !textobj){
                        for(let a=0;a< childInsertArr.length;a++){
                        idarr.push(await ext_redis.xadd(streamName, '*', fieldName, JSON.stringify(childInsertArr[a])));
                      }
                      }else if(textobj && streamName){
                        idarr.push(await ext_redis.xadd(streamName, '*', fieldName, JSON.stringify(textobj)));
                      }       
                      streamArr = {entryId:idarr}
                    }
                    ext_redis.disconnect();

                  } else {
                      if (oprname == 'read') {                  
                      if (!streamName) {
                        throw new CustomException('Stream RequestParams were empty', 404);
                      }                 
                  
                      const startOfToday = new Date(fromStreamid).getTime();
                      const endOfToday = new Date(toStreamid).getTime(); 
                      
                      if (startOfToday && endOfToday) {
                        
                        streamArr = await this.redisService.getStreamRevRange(streamName,endOfToday, startOfToday,count);
                      }else if (useAsConsumer) { 
                        
                        if (await this.redisService.exist(streamName,collectionName)) {
                          var grpInfo:any = await this.redisService.getInfoGrp(streamName);                                          
                          if (grpInfo.length == 0) {                       
                            await this.redisService.createConsumerGroup(streamName, consumerGroupName);                      
                            
                          } else if (!grpInfo[0].includes(consumerGroupName)) {                       
                            await this.redisService.createConsumerGroup(streamName, consumerGroupName); 
                          }
                        let result:any = await this.redisService.readConsumerGroup(streamName, consumerGroupName, consumerName); 
                        //console.log('streamName',streamName);
                        
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
                      if (result != 'No Data available to read') {
                        for (let s = 0; s < result.length; s++) {
                          let msgid = result[s].msgid;
                            let dataObj = result[s].data[1]
                            streamArr.push(JSON.parse(dataObj))
                          if(streamArr?.length>0)
                        await this.redisService.ackMessage(streamName,consumerGroupName,msgid)  
                        }                       
                      } else {
                        throw result
                      }
                        }
                      }else if(!useAsConsumer && childInsertArr?.length>0){
                        let entryArr = []
                        for(let a =0;a< childInsertArr.length;a++){
                          if(childInsertArr[a].hasOwnProperty('entryId')){
                            entryId = childInsertArr[a]?.entryId
                            let entryData:any = await this.redisService.getStreamRange(streamName, entryId,entryId); 
                            entryData = entryData.flat()
                            let res = entryData[1]
                            entryArr.push(JSON.parse(res[1]))
                          }
                        }                   
                        streamArr = entryArr
                      }
                    
                      if(streamArr?.length == 0)
                        throw new CustomException('No Data available to read from firstProcessor',404)                  
                    
                    }else if(oprname == 'write'){   
                      if(!fieldName) 
                        fieldName = streamName   
                      let idarr = []               
                      if(childInsertArr?.length>0 && streamName && !textobj){
                      // console.log("childInsertArr",childInsertArr);
                        
                        for(let a=0;a< childInsertArr.length;a++){
                        idarr.push(await this.redisService.setStreamData(streamName, fieldName, JSON.stringify(childInsertArr[a])));
                      }
                      }else if(textobj && streamName){
                        idarr.push(await this.redisService.setStreamData(streamName, fieldName, JSON.stringify(textobj)));
                      }       
                      streamArr = {entryId:idarr}
                    }
                  } 
                  }else if(semarc){
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
                    }   

                    let RCMresult, zenresult, customcoderesult,codeObj = {};
                    if (inputparam){                  
                        RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam, processedKey + upId, currentFabric, SessionInfo);
                    }                 
                    if (RCMresult) {
                      zenresult = RCMresult.rule;
                      customcoderesult = RCMresult.code;
                    }
                    if (customcoderesult != undefined) {
                      if (customcoderesult && Object.keys(customcoderesult).length > 0) {
                        for (let item in customcoderesult) {
                          codeObj[item.toLowerCase()] = customcoderesult[item];
                        }
                      }
                      await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);
                      
                      if (Array.isArray(inputparam) && inputparam?.length > 0) {
                        for (let i = 0; i < inputparam.length; i++) {
                          inputparam[i] = Object.assign(inputparam[i], codeObj)
                        }                       
                      } else if (typeof inputparam == 'object')
                        inputparam = Object.assign(inputparam, codeObj)
                      
                    }
                    // console.log('streamArr',streamArr);
                    
                    if (upId) {
                      await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: streamName, response: inputparam } }));
                      if (Array.isArray(inputparam) && inputparam.length > 0)
                        await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, streamName, inputparam);
                      await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(streamName), collectionName, 'request');
                      await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(inputparam), collectionName, 'response');
                    }
                  }              
                                  
                  this.logger.log('Stream first Node execution completed');
                  if(semarc)                 
                  return { status: 200, targetStatus: targetStatus, data: {[nodeName]:inputparam} };   
                  else
                    return { status: 200, targetStatus: targetStatus, data: streamArr };         
      
                } else {
                  throw new CustomException('Node Data not found', 404);
                }
              } catch (error) {              
              throw error
              }
            }
            
           //kafka_stream_node
           if (nodeType == 'kafka_stream_node' && poNode[j].nodeId == nodeId) {
            try {
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
               if(currentFabric == 'PF-SCDL' && !semarc){
                

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
            //   const kafka = new Kafka({
            //     clientId:process.env.KAFKA_CLIENT_ID,
            //     brokers: kafkaBrokers,
            //     logLevel: logLevel.ERROR,
            //   });
             

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
                else if (oprname === 'consumer') {
                  if (!groupId) {
                    throw new CustomException('Consumer group ID not found', 404);
                  }

                  try {
                     
                    const consumer = await this.getConsumer(groupId);
                    
                    const offsetReset = typeof autoOffsetReset === 'string' 
                      ? autoOffsetReset.toLowerCase() 
                      : 'earliest';
                    const fromBeginning = !['latest', 'newest'].includes(offsetReset);

                    await consumer.subscribe({
                      topic: topicName,
                      fromBeginning: fromBeginning,
                    });

                    // Collect messages with proper timeout
                    const consumedMessages: any[] = [];
                    const maxPollRecords = 100;
                    const consumeTimeout = 10000; // Increased to 10 seconds

                    await new Promise<void>((resolve, reject) => {
                      let timeoutId: NodeJS.Timeout;
                      let isResolved = false;

                      const cleanup = async () => {
                        if (!isResolved) {
                          isResolved = true;
                          clearTimeout(timeoutId);
                          await consumer.stop();
                          resolve();
                        }
                      };

                      timeoutId = setTimeout(cleanup, consumeTimeout);

                      consumer.run({
                        autoCommit: true, // Changed to true for simplicity
                        autoCommitInterval: 5000,
                        eachBatchAutoResolve: true,
                        partitionsConsumedConcurrently: 3,
                        eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
                          try {
                            const messageValue = JSON.parse(message.value?.toString() || '{}');
                            consumedMessages.push(messageValue);

                            // Stop if we've reached max poll records
                            if (consumedMessages.length >= maxPollRecords) {
                              await cleanup();
                            }
                          } catch (msgError) {
                            console.error(`Error processing Kafka message: ${msgError}`);
                          }
                        },
                      }).catch(reject);
                    });

                    kafkaResultArr = consumedMessages.length > 0 
                      ? await this.keysToLowerCaseOnly(consumedMessages) 
                      : [];

                  } catch (consumerError) {
                    throw new CustomException(
                      `Kafka consume error: ${consumerError?.message || consumerError}`,
                      500
                    );
                  }
                }
               }
               else if(semarc){
                
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
              // if (internalEdges && internalEdges.hasOwnProperty(poNode[j].nodeId)) {
              //   let currentNodeEdge = internalEdges[poNode[j].nodeId];
              //   let mappedData = await this.mapEdgeValuesToParams(poNode, currentNodeEdge, inputparam, processedKey, upId, collectionName,statickeyword,numberArr, '', '', pfo);
              //   childInsertArr = mappedData.childInsertArr;
              //   tempQryVal = mappedData.tempQryVal;
              //   textobj = mappedData.textobj;
              // }
              //  if (!childInsertArr && !textobj) {
              //   if (inputparam && (Object.keys(inputparam).length > 0 || inputparam.length > 0)) {
              //     childInsertArr = Array.isArray(inputparam) ? inputparam : [inputparam];
              //   } else if (!isStatic && (oprname == 'producer')) {
              //     throw new CustomException('Kafka message data mapping is required for produce operation', 404);
              //   }
              // }

             
               let RCMresult, zenresult, customcoderesult,codeObj = {};
                    if (inputparam){                  
                        RCMresult = await this.CommonService.getRuleCodeMapper(poNode[j], inputparam, processedKey + upId, currentFabric, SessionInfo);
                    }                 
                    if (RCMresult) {
                      zenresult = RCMresult.rule;
                      customcoderesult = RCMresult.code;
                    }
                    if (customcoderesult != undefined) {
                      if (customcoderesult && Object.keys(customcoderesult).length > 0) {
                        for (let item in customcoderesult) {
                          codeObj[item.toLowerCase()] = customcoderesult[item];
                        }
                      }
                      await this.redisService.setJsonData(processedKey + upId + ':NPV:' + poNode[j].nodeName + '.PRO', JSON.stringify(codeObj), collectionName, 'code',);
                      
                      if (Array.isArray(inputparam) && inputparam?.length > 0) {
                        for (let i = 0; i < inputparam.length; i++) {
                          inputparam[i] = Object.assign(inputparam[i], codeObj)
                        }                       
                      } else if (typeof inputparam == 'object')
                        inputparam = Object.assign(inputparam, codeObj)
                      
                    }
              // Store results in Redis
             
                if (upId) {
                      await this.redisService.setStreamData(srcQueue, collectionName + '-TASK - ' + upId, JSON.stringify({ PID: upId, TID: nodeId, EVENT: targetStatus, data: { request: topicName, response: inputparam } }));
                      if (Array.isArray(inputparam) && inputparam.length > 0)
                        await this.CommonService.getTPL(processedKey, upId, poNode[j], 'Success', targetQueue, token, currentFabric, sourceStatus, topicName, inputparam);
                       await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify({ topic: topicName, operation: oprname }), collectionName, 'request');
                      await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(inputparam), collectionName, 'response');                    
                  }
               }
              // Handle internal mappings
             
              this.logger.log('Kafka Stream first node Completed');
             
              if(semarc)                 
                  return { status: 200, targetStatus: targetStatus, data: {[nodeName]:inputparam} };  
               else
                 return { status: 200, targetStatus: targetStatus, data: kafkaResultArr };
            } catch (error) {
              console.log('error',error)
              this.logger.error('Kafka Stream first node Failed', error);
              throw error;
            }
          }
        
        }
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

}