
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
import { DFGet_Transaction_DFDModule } from './dfd/DFGet_Transaction_DFD/v1/DFGet_Transaction_DFD.module';    
import { DFMaster_System_Setup_DFDModule } from './dfd/DFMaster_System_Setup_DFD/v1/DFMaster_System_Setup_DFD.module';    
import { DFCDC_Checker_Action_DFDModule } from './dfd/DFCDC_Checker_Action_DFD/v1/DFCDC_Checker_Action_DFD.module';    
import { Payment_InitiationModule } from './pfd/Payment_Initiation/v1/Payment_Initiation.module';    
import { Master_System_Setup_FlowModule } from './pfd/Master_System_Setup_Flow/v1/Master_System_Setup_Flow.module';    
import { CDC_Checker_FlowModule } from './pfd/CDC_Checker_Flow/v1/CDC_Checker_Flow.module';    
//import { DecryptPayloadMiddleware } from './decryptPayloadMiddleware';
import { EncryptInterceptor } from './encryptInterceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
  CacheModule.register({isGlobal:true}),
  ScheduleModule.forRoot(),UfModule,TeModule,DFGet_Transaction_DFDModule,DFMaster_System_Setup_DFDModule,DFCDC_Checker_Action_DFDModule,Payment_InitiationModule,Master_System_Setup_FlowModule,CDC_Checker_FlowModule,ErdModule], 
  controllers: [AppController],
  providers: [AppService,CommonService,RuleService,CodeService,JwtService,RedisService,ConfigService,MongoService,{
      provide: APP_INTERCEPTOR,
      useClass: EncryptInterceptor,
    }],
})
export class AppModule implements NestModule {
  configure() {}
}
