import { HttpStatus, Module } from '@nestjs/common';
import { vgph_source_corporateModule } from './vgph_source_corporate/vgph_source_corporate.module';   
import { vgph_corporateModule } from './vgph_corporate/vgph_corporate.module';   
import { vgph_source_employeeModule } from './vgph_source_employee/vgph_source_employee.module';   
import { vgph_employeeModule } from './vgph_employee/vgph_employee.module';   
import { vgph_source_siModule } from './vgph_source_si/vgph_source_si.module';   
import { vgph_siModule } from './vgph_si/vgph_si.module';   
import { vgph_corporate_relationshipModule } from './vgph_corporate_relationship/vgph_corporate_relationship.module';   
import { vgph_corporate_relationship_exceptionModule } from './vgph_corporate_relationship_exception/vgph_corporate_relationship_exception.module';   
import { vgph_source_mainModule } from './vgph_source_main/vgph_source_main.module';   
import { vgph_source_tran_mainModule } from './vgph_source_tran_main/vgph_source_tran_main.module';   
import { vgph_tran_dtl_mainModule } from './vgph_tran_dtl_main/vgph_tran_dtl_main.module';   
import { vgph_tran_log_mainModule } from './vgph_tran_log_main/vgph_tran_log_main.module';   
import { vgph_tran_error_log_mainModule } from './vgph_tran_error_log_main/vgph_tran_error_log_main.module';   
import { vgph_destination_mainModule } from './vgph_destination_main/vgph_destination_main.module';   
import { vgph_destination_tran_mainModule } from './vgph_destination_tran_main/vgph_destination_tran_main.module';   
import { vgph_source_tran_doc_mainModule } from './vgph_source_tran_doc_main/vgph_source_tran_doc_main.module';   
import { vgph_nf_tran_mainModule } from './vgph_nf_tran_main/vgph_nf_tran_main.module';   
import { vgph_process_exception_mainModule } from './vgph_process_exception_main/vgph_process_exception_main.module';   
import { vgph_temp_mainModule } from './vgph_temp_main/vgph_temp_main.module';   
import { vgph_trn_secure_tokenModule } from './vgph_trn_secure_token/vgph_trn_secure_token.module';   
import { vgph_charge_tranModule } from './vgph_charge_tran/vgph_charge_tran.module';   
import { vgph_participant_bankModule } from './vgph_participant_bank/vgph_participant_bank.module';   
import { vgph_participant_branchModule } from './vgph_participant_branch/vgph_participant_branch.module';   
import { vgph_correspondent_bankModule } from './vgph_correspondent_bank/vgph_correspondent_bank.module';   
import { vgph_correspondent_exceptionModule } from './vgph_correspondent_exception/vgph_correspondent_exception.module';   
import { vgph_correspondent_nostroModule } from './vgph_correspondent_nostro/vgph_correspondent_nostro.module';   
import { vgph_holidayModule } from './vgph_holiday/vgph_holiday.module';   
import { vgph_clearing_holidayModule } from './vgph_clearing_holiday/vgph_clearing_holiday.module';   
import { vgph_clearing_sessionModule } from './vgph_clearing_session/vgph_clearing_session.module';   
import { vgph_participant_bank_statusModule } from './vgph_participant_bank_status/vgph_participant_bank_status.module';   
import { vgph_charge_setupModule } from './vgph_charge_setup/vgph_charge_setup.module';   
import { vgph_charge_configModule } from './vgph_charge_config/vgph_charge_config.module';   
import { vgph_charge_invoiceModule } from './vgph_charge_invoice/vgph_charge_invoice.module';   
import { vgph_beneficiaryModule } from './vgph_beneficiary/vgph_beneficiary.module';   
import { vgph_account_beneficiaryModule } from './vgph_account_beneficiary/vgph_account_beneficiary.module';   
import { vgph_source_stagingModule } from './vgph_source_staging/vgph_source_staging.module';   
import { vgph_source_tran_stagingModule } from './vgph_source_tran_staging/vgph_source_tran_staging.module';   
import { vgph_tran_dtl_stagingModule } from './vgph_tran_dtl_staging/vgph_tran_dtl_staging.module';   
import { vgph_destination_stagingModule } from './vgph_destination_staging/vgph_destination_staging.module';   
import { vgph_destination_tran_stagingModule } from './vgph_destination_tran_staging/vgph_destination_tran_staging.module';   
import { vgph_source_tran_doc_stagingModule } from './vgph_source_tran_doc_staging/vgph_source_tran_doc_staging.module';   
import { vgph_temp_stagingModule } from './vgph_temp_staging/vgph_temp_staging.module';   

import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { RedisService } from "src/redisService";


@Module({
  imports: [vgph_source_corporateModule,vgph_corporateModule,vgph_source_employeeModule,vgph_employeeModule,vgph_source_siModule,vgph_siModule,vgph_corporate_relationshipModule,vgph_corporate_relationship_exceptionModule,vgph_source_mainModule,vgph_source_tran_mainModule,vgph_tran_dtl_mainModule,vgph_tran_log_mainModule,vgph_tran_error_log_mainModule,vgph_destination_mainModule,vgph_destination_tran_mainModule,vgph_source_tran_doc_mainModule,vgph_nf_tran_mainModule,vgph_process_exception_mainModule,vgph_temp_mainModule,vgph_trn_secure_tokenModule,vgph_charge_tranModule,vgph_participant_bankModule,vgph_participant_branchModule,vgph_correspondent_bankModule,vgph_correspondent_exceptionModule,vgph_correspondent_nostroModule,vgph_holidayModule,vgph_clearing_holidayModule,vgph_clearing_sessionModule,vgph_participant_bank_statusModule,vgph_charge_setupModule,vgph_charge_configModule,vgph_charge_invoiceModule,vgph_beneficiaryModule,vgph_account_beneficiaryModule,vgph_source_stagingModule,vgph_source_tran_stagingModule,vgph_tran_dtl_stagingModule,vgph_destination_stagingModule,vgph_destination_tran_stagingModule,vgph_source_tran_doc_stagingModule,vgph_temp_stagingModule],
  controllers:[],
  providers:[RuleService,CodeService,RedisService]
})
export class ErdModule {}
