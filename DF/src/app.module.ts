
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonService } from './common.Service';
import { RuleService } from './ruleService';
import { CodeService } from './codeService';
import { RedisService } from './redisService';
import { JwtService } from '@nestjs/jwt';
import { UfModule } from './Torus/v1/uf/uf.module';
import { TeModule } from './Torus/v1/te/te.module';
import { ConfigService } from "@nestjs/config";
import { ScheduleModule } from '@nestjs/schedule';
import { DFcomboCurrencySearchModule } from './dfd/DFcomboCurrencySearch/v1/DFcomboCurrencySearch.module';    
import { DFtransactionModule } from './dfd/DFtransaction/v1/DFtransaction.module';    
import { DFscanSaveProcessDfdModule } from './dfd/DFscanSaveProcessDfd/v1/DFscanSaveProcessDfd.module';    
import { DFcrBankCodeDropDownDfdModule } from './dfd/DFcrBankCodeDropDownDfd/v1/DFcrBankCodeDropDownDfd.module';    
import { DFforexCurrencyDropDownDfdModule } from './dfd/DFforexCurrencyDropDownDfd/v1/DFforexCurrencyDropDownDfd.module';    
import { DFdocumentListDfdModule } from './dfd/DFdocumentListDfd/v1/DFdocumentListDfd.module';    
import { DFerrorListDfdModule } from './dfd/DFerrorListDfd/v1/DFerrorListDfd.module';    
import { DFtransactionListDfdModule } from './dfd/DFtransactionListDfd/v1/DFtransactionListDfd.module';    
import { DFjourneyModule } from './dfd/DFjourney/v1/DFjourney.module';    
import { scanSaveProcessModule } from './pfd/scanSaveProcess/v1/scanSaveProcess.module';    
import { getAccountInfoDetailsModule } from './pfd/getAccountInfoDetails/v1/getAccountInfoDetails.module';    
import { rateCalculationProcessModule } from './pfd/rateCalculationProcess/v1/rateCalculationProcess.module';    
import { changeStatusTranUpdateLogInsertModule } from './pfd/changeStatusTranUpdateLogInsert/v1/changeStatusTranUpdateLogInsert.module';    
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
  ScheduleModule.forRoot(),UfModule,TeModule,EnvDataModule,DFcomboCurrencySearchModule,DFtransactionModule,DFscanSaveProcessDfdModule,DFcrBankCodeDropDownDfdModule,DFforexCurrencyDropDownDfdModule,DFdocumentListDfdModule,DFerrorListDfdModule,DFtransactionListDfdModule,DFjourneyModule,scanSaveProcessModule,getAccountInfoDetailsModule,rateCalculationProcessModule,changeStatusTranUpdateLogInsertModule,], 
  controllers: [AppController],
  providers: [AppService,CommonService,RuleService,CodeService,JwtService,RedisService,ConfigService,EnvData,{
      provide: APP_INTERCEPTOR,
      useClass: EncryptInterceptor,
    }],
})
export class AppModule implements NestModule {
  configure() {}
}
