
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
import { ErdModule } from './erd/erd.module';
import { TOB_Consent_RequestModule } from './dfd/TOB_Consent_Request/v1/TOB_Consent_Request.module';    
import { TOB_API_RepositoryModule } from './dfd/TOB_API_Repository/v1/TOB_API_Repository.module';    
import { TOB_API_Process_LogsModule } from './dfd/TOB_API_Process_Logs/v1/TOB_API_Process_Logs.module';    
import { MongoDB_TotalCallsModule } from './dfd/MongoDB_TotalCalls/v1/MongoDB_TotalCalls.module';    
import { Mongo_SuccessRateModule } from './dfd/Mongo_SuccessRate/v1/Mongo_SuccessRate.module';    
import { Mongo_ErrorRateModule } from './dfd/Mongo_ErrorRate/v1/Mongo_ErrorRate.module';    
import { Mongo_ActiveAPIsModule } from './dfd/Mongo_ActiveAPIs/v1/Mongo_ActiveAPIs.module';    
import { Mongo_TotalRequestModule } from './dfd/Mongo_TotalRequest/v1/Mongo_TotalRequest.module';    
import { MongoDB_Most_Used_APIsModule } from './dfd/MongoDB_Most_Used_APIs/v1/MongoDB_Most_Used_APIs.module';    
import { Mongo_ErrorModule } from './dfd/Mongo_Error/v1/Mongo_Error.module';    
import { DecryptPayloadMiddleware } from './decryptPayloadMiddleware';
import { EncryptInterceptor } from './encryptInterceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [UfModule,TeModule,TOB_Consent_RequestModule,TOB_API_RepositoryModule,TOB_API_Process_LogsModule,MongoDB_TotalCallsModule,Mongo_SuccessRateModule,Mongo_ErrorRateModule,Mongo_ActiveAPIsModule,Mongo_TotalRequestModule,MongoDB_Most_Used_APIsModule,Mongo_ErrorModule,ErdModule],
  controllers: [AppController],
  providers: [AppService,CommonService,RuleService,CodeService,JwtService,RedisService,MongoService,ConfigService, {
      provide: APP_INTERCEPTOR,
      useClass: EncryptInterceptor,
    }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DecryptPayloadMiddleware)
      .forRoutes('*');
  }
}
