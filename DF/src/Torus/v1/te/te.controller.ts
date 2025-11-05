import { BadRequestException, Body, Controller, Headers,  Logger,Post,} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TeService } from './te.service';
import { CommonService } from 'src/common.Service';
import { pfDto } from 'src/dto';
import { LockService } from 'src/lock.service';
import { CustomException } from 'src/customException';


//@UseGuards(AuthGuard)
@ApiTags('Torus API')
@Controller('te')
export class TeController {
  constructor (private readonly teService:TeService,private readonly apiService:CommonService,private readonly lockservice:LockService){}
  private readonly logger = new Logger(TeController.name);


  @Post('eventEmitter')
  async pfEventEmitter(@Body() pfdto: pfDto, @Headers('Authorization') auth: any): Promise<any> {
    pfdto.token = auth.split(' ')[1];
    var upidarr = []
    const eventval = pfdto
    const { dpdKey, method } = pfdto
    let currentFabric = await this.apiService.splitcommonkey(pfdto.key, 'FNK')

    if (currentFabric == 'DF-DFD') {
      let result: any = await this.teService.EventEmitter(pfdto);
      if (dpdKey && method) {
        result["dpdKey"] = dpdKey
        result["method"] = method
      }
      return result;
    } else {     
      if (!pfdto.upId) {
        let result: any = await this.teService.EventEmitter(pfdto);
        if (dpdKey && method) {
          result["dpdKey"] = dpdKey
          result["method"] = method
        }
        return result;
      } else {
        if (pfdto.upId && pfdto.upId.length == 0)
          throw new CustomException('Process Id is empty', 400)
        var refupid = pfdto.upId
        var key = pfdto.key
        var nodeId = pfdto.nodeId
        var nodeName = pfdto.nodeName
        var nodetype = pfdto.nodeType
        var data = pfdto.data
        var event = pfdto.event
        var sourceId = pfdto.sourceId
        if (refupid.length > 0 && data.length > 0) {
          for (var k = 0; k < refupid.length; k++) {
            const upId = refupid[k]
            eventval.upId = upId
            eventval.key = key
            eventval.nodeId = nodeId
            eventval.nodeName = nodeName
            eventval.nodeType = nodetype
            eventval.data = data[k]
            eventval.event = event
            eventval.sourceId = sourceId
            var res: any = await this.teService.EventEmitter(eventval);
            console.log('res', res);
            if (res)
              upidarr.push(res.upId)
          }
          var finalres = {
            upId: upidarr,
            message: res.message,
            event: res.event
          }
          if (dpdKey && method) {
            finalres["dpdKey"] = dpdKey
            finalres["method"] = method
          }
          return finalres
        }
        else {
          throw new CustomException('Invalid payload', 422)
        }
      }            
    }
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
        let result :any = await this.teService.savehandler(input.data, input.key, input.event, input.nodeId, input.nodeName,input.nodeType, token, input.upId,input.sourceId, input.lock,input.childTables)
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


