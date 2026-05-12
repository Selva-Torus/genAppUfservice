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
      let result:any = await this.apiService.getseaWeedExpLogs(input,'-TSL')
      if(dpdKey && method){
        result["dpdKey"] = dpdKey
        result["method"] = method        
      }
      return result
    }
  
    @Post('prcLog')
    async getProcessLog(@Body() input): Promise<any> {     
      const { dpdKey,method } = input;
      let result:any = await this.apiService.getseaWeedProcessLogs(input,'-TPL');
      if(dpdKey && method){
        result["dpdKey"] = dpdKey
        result["method"] = method        
      }
      return result
    }


     @ApiOperation({
      summary: 'Set Process log in DFS',      
    })
    @ApiBody({ type: PrcLogInputDto })
    @ApiResponse({
      status: 200,     
      type: LogOutputDto,
    })    
    @ApiResponse({
      status: 500,
      description: 'Internal server error',
    })
    @Post('setPrcLog')
    async setPrcLog(@Body() input){
      return await this.apiService.SetPrcExpLogs(input.streamname,input.data)
    }


    @ApiOperation({
      summary: 'Set Exception log in DFS',      
    })
    @ApiBody({ type: ExpLogInputDto })
    @ApiResponse({
      status: 200,     
      type: LogOutputDto,
    })    
    @ApiResponse({
      status: 500,
      description: 'Internal server error',
    })
    @Post('setExpLog')
    async setExpLog(@Body() input){
      return await this.apiService.SetPrcExpLogs(input.streamname,input.data)
    }

     @Delete('dropLog')
    async deleteLog(@Query() input): Promise<any> {
      const { dpdKey,method } = input;
      console.log("input",input)
      let result:any
      if(input.fileName.endsWith('-TSL')){
        console.log("fileNaame",input.fileName)
       result = await this.apiService.deleteLog('ExpLog/' + input.fileName + '/');
      }else if(input.fileName.endsWith('-TPL')){
       result = await this.apiService.deleteLog('PrcLog/' + input.fileName);
      }
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
