import { Controller, Get, Body,Post, Delete, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CommonService } from 'src/common.Service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrcLogInputDto, LogOutputDto,ExpLogInputDto, ProcessLogResponseDto, RawProcessLogInputDto  } from './dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private readonly apiService:CommonService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


    @Post('expLog')
    async getExceplogs(@Body() input): Promise<any> {  
      const { dpdKey,method } = input;
      //return await this.apiService.getTenantExceptionlogs(input)
      let result:any =  await this.apiService.getMongoProcessLogs(input,'-TSL')
      if(dpdKey && method){
        result["dpdKey"] = dpdKey
        result["method"] = method        
      }
      return result
    }
  
    @Post('prcLog')
    async getProcessLog(@Body() input): Promise<any> {
      const { dpdKey,method } = input;
      //return await this.apiService.getTenantPrcLogs(input);
      let result:any =  await this.apiService.getMongoProcessLogs(input,'-TPL')
      if(dpdKey && method){
        result["dpdKey"] = dpdKey
        result["method"] = method        
      }
      return result
    }

    @Post('subFlowLog')
    async getSubFlowLog(@Body() input): Promise<any> {
      const { dpdKey,method } = input;
    
      let result:any =  await this.apiService.getSubFlowLog(input.key,input.upId)
      if(dpdKey && method){
        result["dpdKey"] = dpdKey
        result["method"] = method        
      }
      return result
    }

    @Post('dropLog')
    async deleteLog(@Body() input): Promise<any> {
      const { dpdKey,method } = input;
      let result:any =  await this.apiService.deleteLog(input)
      if(dpdKey && method){
        result["dpdKey"] = dpdKey
        result["method"] = method        
      }
      return result
    }
  

     @ApiOperation({
    summary: 'Transform process log',
    description:
      'Accepts the raw AFSK process-log payload and returns a flat array ' +
      'of entries containing only nodeName, event, status, and DateAndTime.',
  })
  @ApiBody({ type: RawProcessLogInputDto })
  @ApiResponse({
    status: 200,
    description: 'Successfully transformed process log entries',
    type: ProcessLogResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Post('logSatus')
  transform(@Body() rawInput: any):  Promise<any> {
    return this.apiService.transform(rawInput);
  }

  @Post('logiccenter')
  async getLogicCenterValue(@Body() input): Promise<any> {      
    return await this.apiService.getLogicCenterValue(input?.key)  
  }

}
