
import { BadRequestException, Body, Req, Controller, Headers,  Logger,Post,UsePipes,ValidationPipe,} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TeService } from './te.service';
import { CommonService } from 'src/common.Service';
import { pfDto, teSaveDto } from 'src/dto';
import { LockService } from 'src/lock.service';
import { CustomException } from 'src/customException';
import { RedisService } from 'src/redisService';



@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags('Torus API')
@Controller('te')
export class TeController {
  constructor (private readonly teService:TeService,private readonly apiService:CommonService,
    private readonly lockservice:LockService,
    private readonly redisService:RedisService,  ){}
  private readonly logger = new Logger(TeController.name);

  @Post('eventEmitter')
   async pfEventEmitter(@Body() pfdto: pfDto, @Req() req:any, @Headers('Authorization') auth: any): Promise<any> {
    pfdto.token = auth.split(' ')[1];
     pfdto['authContext'] = req?.authContext
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


    // Handle regular event emission
      if (!pfdto.upId || pfdto.upId.length == 0 || pfdto.upId.every(id => id == null)) {
      let result:any,resArr = []
      if(Array.isArray(pfdto.data) && pfdto.data.length>0){      
        if(pfdto.data.length == 1){
          pfdto.data = pfdto.data[0]
        result = await this.teService.EventEmitter(pfdto);
        }else{
           for(let item of pfdto.data){
          pfdto.data = item
         result = await this.teService.EventEmitter(pfdto);        
         if(Array.isArray(result?.data))
          resArr.push(...result?.data)
         else
          resArr.push(result?.data)
       }
       result['data'] = resArr
        }      
      }else
       result = await this.teService.EventEmitter(pfdto);
      if (dpdKey && method) {
        result["dpdKey"] = dpdKey
        result["method"] = method
      }
      return result;
    }

    // Handle multiple upIds - PARALLEL PROCESSING
    //if (pfdto.upId && pfdto.upId.length == 0) {
      //throw new CustomException('Process Id is empty', 400)
    //}

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

    let finalres
    if(lastResult?.node == 'outputnode'){
       finalres = {
      upId: results.map(res => res?.upId).filter(Boolean),
      message: lastResult?.message,
      event: lastResult?.event,
      data:lastResult?.data
    }
    }else{
      finalres = {
      upId: results.map(res => res?.upId).filter(Boolean),
      message: lastResult?.message,
      event: lastResult?.event,     
    }
    }

    if (dpdKey && method) {
      finalres["dpdKey"] = dpdKey
      finalres["method"] = method
    }

    return finalres;
  }

   
      
  @Post('save')
  async save(@Body() input: teSaveDto, @Req() req:any, @Headers('Authorization') auth: any): Promise<any> {
    var token = auth.split(' ')[1];   
    input['authContext'] = req?.authContext
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


