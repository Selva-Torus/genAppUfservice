import { BadRequestException, Body, Controller, Headers,  Logger,Post,} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TeService } from './te.service';
import { CommonService } from 'src/common.Service';
import { pfDto } from 'src/dto';
import { LockService } from 'src/lock.service';
import { CustomException } from 'src/customException';
import { RedisService } from 'src/redisService';
import { ListenerService } from './listener.service';


//@UseGuards(AuthGuard)
@ApiTags('Torus API')
@Controller('te')
export class TeController {
  constructor (private readonly teService:TeService,private readonly apiService:CommonService,
    private readonly lockservice:LockService,
    private readonly redisService:RedisService,private readonly listenerService:ListenerService,   
  ){}
  private readonly logger = new Logger(TeController.name);

  @Post('eventEmitter')
   async pfEventEmitter(@Body() pfdto: pfDto, @Headers('Authorization') auth: any): Promise<any> {
    pfdto.token = auth.split(' ')[1];
    const { dpdKey, method } = pfdto
    const client = process.env.CLIENTCODE;
    const currentFabric = await this.apiService.splitcommonkey(pfdto.key, 'FNK')

    if (currentFabric == 'DF-DFD') {
      const result: any = await this.teService.EventEmitter(pfdto);
      if (dpdKey && method) {
        result["dpdKey"] = dpdKey
        result["method"] = method
      }
      return result;
    }

    // Fetch flowSummary once
    const flowSummary = JSON.parse(await this.redisService.getJsonData(pfdto.key + 'PFS', client))
    let TimeInterval, milliseconds

    // Parallel processing of scheduler and interval nodes
    if (flowSummary?.length > 0) {
      const schedulerNodes = flowSummary.filter(f => f.nodeType == 'schedulernode' && currentFabric == 'PF-SCDL');
      const intervalNodes = flowSummary.filter(f => f.nodeType == 'intervalnode' && currentFabric == 'PF-SCDL');

      // Parallel fetch of scheduler nodes
      if (schedulerNodes.length > 0) {
        const schedulerPromises = schedulerNodes.map(node =>
          this.redisService.getJsonDataWithPath(pfdto.key + 'NDP', '.' + node.nodeId, client)
        );
        const schedulerResults = await Promise.all(schedulerPromises);

        for (const result of schedulerResults) {
          if (result) {
            const schedulerNode = JSON.parse(result);
            const schInterval = schedulerNode?.data?.pro?.schedulerInfo?.interval;
            if (schInterval) {
              TimeInterval = `${schInterval.seconds} ${schInterval.minutes} ${schInterval.hours} ${schInterval.dayOfmonth} ${schInterval.months} ${schInterval.dayOfweek}`;
              break; // Take first valid interval
            }
          }
        }
      }

      // Parallel fetch of interval nodes
      if (intervalNodes.length > 0 && !TimeInterval) {
        const intervalPromises = intervalNodes.map(node =>
          this.redisService.getJsonDataWithPath(pfdto.key + 'NDP', '.' + node.nodeId, client)
        );
        const intervalResults = await Promise.all(intervalPromises);

        for (const result of intervalResults) {
          if (result) {
            const schedulerNode = JSON.parse(result);
            milliseconds = schedulerNode?.data?.pro?.milliseconds?.value;
            if (milliseconds) break; // Take first valid milliseconds
          }
        }
      }
    }

    // Extract jobname once (reused for both TimeInterval and milliseconds)
    const keyname = pfdto?.key.split(':');
    const jobname = ((keyname[1] + keyname[5] + keyname[7] + keyname[9] + keyname[11] + keyname[13]).replace(/[-_]/g, '')).replace(/\s+/g, '');

    // Handle TimeInterval
    if (TimeInterval) {
      if (pfdto.schedulerStatus == 'active') {
        await this.listenerService.startCronJob(jobname, TimeInterval, pfdto, client, pfdto.token);
        return 'scheduler started';
      } else if (pfdto.schedulerStatus == 'inactive') {
        await this.listenerService.stopCron(jobname);
        return 'scheduler stopped';
      }
    }

    // Handle milliseconds interval
    if (milliseconds) {
      if (pfdto.schedulerStatus == 'active') {
        return await this.listenerService.startInterval(jobname, milliseconds, pfdto, client, pfdto.token);
      } else if (pfdto.schedulerStatus == 'inactive') {
        return await this.listenerService.stopIntervalJob(jobname);
      }
    }

    // Handle regular event emission
    if (!pfdto.upId) {
      const result: any = await this.teService.EventEmitter(pfdto);
      if (dpdKey && method) {
        result["dpdKey"] = dpdKey
        result["method"] = method
      }
      return result;
    }

    // Handle multiple upIds - PARALLEL PROCESSING
    if (pfdto.upId && pfdto.upId.length == 0) {
      throw new CustomException('Process Id is empty', 400)
    }

    const { upId: refupid, key, nodeId, nodeName, nodeType: nodetype, data, event, sourceId } = pfdto;

    if (!refupid?.length || !data?.length) {
      throw new CustomException('Invalid payload', 422)
    }

    // Process all events in parallel
    const eventPromises = refupid.map((upId, k) =>
      this.teService.EventEmitter({
        ...pfdto,
        upId,
        key,
        nodeId,
        nodeName,
        nodeType: nodetype,
        data: data[k],
        event,
        sourceId
      })
    );

    const results = await Promise.all(eventPromises);
    const lastResult = results[results.length - 1];

    const finalres = {
      upId: results.map(res => res?.upId).filter(Boolean),
      message: lastResult?.message,
      event: lastResult?.event
    }

    if (dpdKey && method) {
      finalres["dpdKey"] = dpdKey
      finalres["method"] = method
    }

    return finalres;
  }

  @Post('update')
  async getUpdate(@Body() input, @Headers('Authorization') auth: any,) {       
      try {
      this.logger.log('update handler started') 
      const { dpdKey,method } = input          
          if (input.primaryKey && input.url && input.tableName && input.data && auth) {
              var token = auth.split(' ')[1];  
              var lock:any         
          
          if (input.lockDetails && input.lockDetails.ttl) {   
            this.logger.log('lock verified')    
              const resource = [`locks:${input.tableName}:${input.primaryKey}`];
              const ttl = input.lockDetails.ttl
              lock = await this.lockservice.acquireLock(resource, ttl);               
              this.logger.log(`Lock acquired for ${input.primaryKey}`);
          }

          var result = await this.teService.updateHandler(input.data, input.key, input.upId, input.url,input.tableName, input.primaryKey, token)
          if(dpdKey && method){
            result["dpdKey"] = dpdKey
            result["method"] = method
          }
          this.logger.log('updated result',result)
          
          if(result != undefined || result != null){     
            if(result.statusCode){   
            if(result.statusCode == 201) {
              if(input.lockDetails && input.lockDetails.ttl){
                // await new Promise((resolve) => setTimeout(resolve, 10000));  
                await this.lockservice.releaseLock(lock);        
                this.logger.log(`Lock released for ${input.primaryKey}`);          
              }
              return result
            }
          }
          }
        } else {
          throw 'primarykey/tablename/data/token not found'
      }
      }
      catch (error) {     
        console.log(error)     
        if(input.lockDetails){         
          if(input.lockDetails.ttl && JSON.stringify(error).includes('quorum')){
            throw new BadRequestException('Resource locked by other user');
          }
          if(lock){
            await this.lockservice.releaseLock(lock);
            this.logger.log(`Lock released for ${input.primaryKey}`);
          }
          
        }      
        throw new BadRequestException(error);
      }  
  }  
      
  @Post('save')
  async save(@Body() input, @Headers('Authorization') auth: any): Promise<any> {
    var token = auth.split(' ')[1];   
    const { dpdKey,method } = input  
      
      if (input.data){
        let result :any = await this.teService.savehandler(input,token)
        if(dpdKey && method){
          result["dpdKey"] = dpdKey
          result["method"] = method
        }
        return result
      }else{
        return 'data is required'
      }
  } 
  
}


