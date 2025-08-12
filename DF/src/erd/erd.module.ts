import { HttpStatus, Module } from '@nestjs/common';
import { seacoreModule } from './seacore/seacore.module';   
import { billingModule } from './billing/billing.module';   
import { accountsModule } from './accounts/accounts.module';   
import { transactionsModule } from './transactions/transactions.module';   

import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { RedisService } from "src/redisService";


@Module({
  imports: [seacoreModule,billingModule,accountsModule,transactionsModule],
  controllers:[],
  providers:[RuleService,CodeService,RedisService]
})
export class ErdModule {}
