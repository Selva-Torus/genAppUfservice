import { HttpStatus, Module } from '@nestjs/common';
import { itax_sourceModule } from './itax_source/itax_source.module';   
import { itax_source_tranModule } from './itax_source_tran/itax_source_tran.module';   
import { itax_source_tran_credit_approvalModule } from './itax_source_tran_credit_approval/itax_source_tran_credit_approval.module';   
import { itax_source_tran_paymentModule } from './itax_source_tran_payment/itax_source_tran_payment.module';   
import { itax_tran_logModule } from './itax_tran_log/itax_tran_log.module';   
import { itax_tran_error_logModule } from './itax_tran_error_log/itax_tran_error_log.module';   
import { itax_source_tran_docModule } from './itax_source_tran_doc/itax_source_tran_doc.module';   
import { itax_source_tran_dtlModule } from './itax_source_tran_dtl/itax_source_tran_dtl.module';   
import { itax_system_setupModule } from './itax_system_setup/itax_system_setup.module';   
import { itax_check_balanceModule } from './itax_check_balance/itax_check_balance.module';   

import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { RedisService } from "src/redisService";


@Module({
  imports: [itax_sourceModule,itax_source_tranModule,itax_source_tran_credit_approvalModule,itax_source_tran_paymentModule,itax_tran_logModule,itax_tran_error_logModule,itax_source_tran_docModule,itax_source_tran_dtlModule,itax_system_setupModule,itax_check_balanceModule],
  controllers:[],
  providers:[RuleService,CodeService,RedisService]
})
export class ErdModule {}
