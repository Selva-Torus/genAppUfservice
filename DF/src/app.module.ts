
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonService } from './common.Service';
import { RuleService } from './ruleService';
import { CodeService } from './codeService';
import { RedisService } from './redisService';
import { JwtService } from '@nestjs/jwt';
import { MongoService } from './mongoService';
import { UfModule } from './Torus/v2/uf/uf.module';
import { TeModule } from './Torus/v2/te/te.module';
import { ConfigService } from "@nestjs/config";
import { ScheduleModule } from '@nestjs/schedule';
import { ErdModule } from './erd/erd.module';
import { CodeDescriptionModule } from './dfd/CodeDescription/v1/CodeDescription.module';    
import { Get_Accounts_Consent_Event_Consents_ConsentsModule } from './pfd/Get_Accounts_Consent_Event_Consents_Consents/v2/Get_Accounts_Consent_Event_Consents_Consents.module';    
import { HUB_SimulationModule } from './pfd/HUB_Simulation/v1/HUB_Simulation.module';    
//import { DecryptPayloadMiddleware } from './decryptPayloadMiddleware';
import { EncryptInterceptor } from './encryptInterceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [ScheduleModule.forRoot(),UfModule,TeModule,CodeDescriptionModule,Get_Accounts_Consent_Event_Consents_ConsentsModule,HUB_SimulationModule,ErdModule],
  controllers: [AppController],
  providers: [AppService,CommonService,RuleService,CodeService,JwtService,RedisService,MongoService,ConfigService, {
      provide: APP_INTERCEPTOR,
      useClass: EncryptInterceptor,
    }],
})
export class AppModule implements NestModule {
  configure() {}
}
