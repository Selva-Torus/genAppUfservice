
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
  ScheduleModule.forRoot(),UfModule,TeModule,EnvDataModule,], 
  controllers: [AppController],
  providers: [AppService,CommonService,RuleService,CodeService,JwtService,RedisService,ConfigService,EnvData,MongoService,{
      provide: APP_INTERCEPTOR,
      useClass: EncryptInterceptor,
    }],
})
export class AppModule implements NestModule {
  configure() {}
}
