import { Controller, Get, Body,Post, Delete, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CommonService } from 'src/common.Service';

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
  
}
