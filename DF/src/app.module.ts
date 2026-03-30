
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
import { DFITAX_Source_Tran_DFDModule } from './dfd/DFITAX_Source_Tran_DFD/v1/DFITAX_Source_Tran_DFD.module';    
import { DFITAX_Source_Tran_Dtl_DFDModule } from './dfd/DFITAX_Source_Tran_Dtl_DFD/v1/DFITAX_Source_Tran_Dtl_DFD.module';    
import { DFITAX_Tran_log_DFDModule } from './dfd/DFITAX_Tran_log_DFD/v1/DFITAX_Tran_log_DFD.module';    
import { DFITAX_Tran_Error_Log_DFDModule } from './dfd/DFITAX_Tran_Error_Log_DFD/v1/DFITAX_Tran_Error_Log_DFD.module';    
import { DFITAX_Source_Tran_Doc_DFDModule } from './dfd/DFITAX_Source_Tran_Doc_DFD/v1/DFITAX_Source_Tran_Doc_DFD.module';    
import { DFITAX_Dashboard_CardsModule } from './dfd/DFITAX_Dashboard_Cards/v1/DFITAX_Dashboard_Cards.module';    
import { DFITAX_Bar_Chart_DFDModule } from './dfd/DFITAX_Bar_Chart_DFD/v1/DFITAX_Bar_Chart_DFD.module';    
import { DFITAX_Pie_Chart_DFDModule } from './dfd/DFITAX_Pie_Chart_DFD/v1/DFITAX_Pie_Chart_DFD.module';    
import { ITAX_PRN_Save_PFModule } from './pfd/ITAX_PRN_Save_PF/v1/ITAX_PRN_Save_PF.module';    
import { ITAX_PRN_Approval_PFModule } from './pfd/ITAX_PRN_Approval_PF/v1/ITAX_PRN_Approval_PF.module';    
import { ITAX_PAYMENT_POC_PF_V2Module } from './pfd/ITAX_PAYMENT_POC_PF_V2/v1/ITAX_PAYMENT_POC_PF_V2.module';    
import { ITAX_Balance_Check_PFModule } from './pfd/ITAX_Balance_Check_PF/v1/ITAX_Balance_Check_PF.module';    
import { ITAX_Credit_Approval_Delete_PFModule } from './pfd/ITAX_Credit_Approval_Delete_PF/v1/ITAX_Credit_Approval_Delete_PF.module';    
//import { DecryptPayloadMiddleware } from './decryptPayloadMiddleware';
import { EncryptInterceptor } from './encryptInterceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { BullModule } from '@nestjs/bullmq';
import { EnvDataModule } from './envData/envData.module';
import { EnvData } from './envData/envData.service';


@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.HOST,
        port: parseInt(process.env.PORT)       
      },
    }),
  CacheModule.register({isGlobal:true}),
  ScheduleModule.forRoot(),UfModule,TeModule,EnvDataModule,DFITAX_Source_Tran_DFDModule,DFITAX_Source_Tran_Dtl_DFDModule,DFITAX_Tran_log_DFDModule,DFITAX_Tran_Error_Log_DFDModule,DFITAX_Source_Tran_Doc_DFDModule,DFITAX_Dashboard_CardsModule,DFITAX_Bar_Chart_DFDModule,DFITAX_Pie_Chart_DFDModule,ITAX_PRN_Save_PFModule,ITAX_PRN_Approval_PFModule,ITAX_PAYMENT_POC_PF_V2Module,ITAX_Balance_Check_PFModule,ITAX_Credit_Approval_Delete_PFModule,ErdModule,], 
  controllers: [AppController],
  providers: [AppService,CommonService,RuleService,CodeService,JwtService,RedisService,ConfigService,EnvData,MongoService,{
      provide: APP_INTERCEPTOR,
      useClass: EncryptInterceptor,
    }],
})
export class AppModule implements NestModule {
  configure() {}
}
