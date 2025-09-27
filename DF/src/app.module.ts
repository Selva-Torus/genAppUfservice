
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
//import { DecryptPayloadMiddleware } from './decryptPayloadMiddleware';
import { EncryptInterceptor } from './encryptInterceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [ScheduleModule.forRoot(),UfModule,TeModule,ErdModule],
  controllers: [AppController],
  providers: [AppService,CommonService,RuleService,CodeService,JwtService,RedisService,MongoService,ConfigService, {
      provide: APP_INTERCEPTOR,
      useClass: EncryptInterceptor,
    }],
})
export class AppModule implements NestModule {
  configure() {}
}
