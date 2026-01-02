
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonService } from './common.Service';
import { RuleService } from './ruleService';
import { CodeService } from './codeService';
import { RedisService } from './redisService';
import { JwtService } from '@nestjs/jwt';
import { MongoService } from './mongoService';
import { UfModule } from './Torus/v1/uf/uf.module';
import { TeModule } from './Torus/v1/te/te.module';
import { ConfigService } from "@nestjs/config";
import { ScheduleModule } from '@nestjs/schedule';
import { ErdModule } from './erd/erd.module';
import { DFMongo_NavbarModule } from './dfd/DFMongo_Navbar/v1/DFMongo_Navbar.module';    
import { DFMongo_Navbarv2Module } from './dfd/DFMongo_Navbarv2/v1/DFMongo_Navbarv2.module';    
import { DFMongo_Total_CallsModule } from './dfd/DFMongo_Total_Calls/v1/DFMongo_Total_Calls.module';    
import { DFMongo_Api_RepositoryModule } from './dfd/DFMongo_Api_Repository/v1/DFMongo_Api_Repository.module';    
import { DFMongo_Api_Process_LogsModule } from './dfd/DFMongo_Api_Process_Logs/v1/DFMongo_Api_Process_Logs.module';    
import { DFMongo_Line_ChartModule } from './dfd/DFMongo_Line_Chart/v1/DFMongo_Line_Chart.module';    
import { DFMongo_Bar_chartModule } from './dfd/DFMongo_Bar_chart/v1/DFMongo_Bar_chart.module';    
import { DFMongo_MainDashboardModule } from './dfd/DFMongo_MainDashboard/v1/DFMongo_MainDashboard.module';    
import { DFVMC_Error_LogsModule } from './dfd/DFVMC_Error_Logs/v1/DFVMC_Error_Logs.module';    
import { DFMaster_SetupModule } from './dfd/DFMaster_Setup/v1/DFMaster_Setup.module';    
import { Validate_FlowModule } from './pfd/Validate_Flow/v1/Validate_Flow.module';    
import { Update_Master_Setup_FlowModule } from './pfd/Update_Master_Setup_Flow/v1/Update_Master_Setup_Flow.module';    
//import { DecryptPayloadMiddleware } from './decryptPayloadMiddleware';
import { EncryptInterceptor } from './encryptInterceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [ScheduleModule.forRoot(),UfModule,TeModule,DFMongo_NavbarModule,DFMongo_Navbarv2Module,DFMongo_Total_CallsModule,DFMongo_Api_RepositoryModule,DFMongo_Api_Process_LogsModule,DFMongo_Line_ChartModule,DFMongo_Bar_chartModule,DFMongo_MainDashboardModule,DFVMC_Error_LogsModule,DFMaster_SetupModule,Validate_FlowModule,Update_Master_Setup_FlowModule,ErdModule],
  controllers: [AppController],
  providers: [AppService,CommonService,RuleService,CodeService,JwtService,RedisService,MongoService,ConfigService, {
      provide: APP_INTERCEPTOR,
      useClass: EncryptInterceptor,
    }],
})
export class AppModule implements NestModule {
  configure() {}
}
