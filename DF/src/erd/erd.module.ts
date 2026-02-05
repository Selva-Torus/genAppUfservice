import { HttpStatus, Module } from '@nestjs/common';
import { vgph_system_setupModule } from './vgph_system_setup/vgph_system_setup.module';   
import { vgph_interfaceModule } from './vgph_interface/vgph_interface.module';   
import { vgph_handlerModule } from './vgph_handler/vgph_handler.module';   
import { vgph_processModule } from './vgph_process/vgph_process.module';   
import { vgph_flowModule } from './vgph_flow/vgph_flow.module';   
import { vgph_stepModule } from './vgph_step/vgph_step.module';   
import { vgph_source_mainModule } from './vgph_source_main/vgph_source_main.module';   
import { vgph_source_tran_mainModule } from './vgph_source_tran_main/vgph_source_tran_main.module';   
import { vgph_tran_dtl_mainModule } from './vgph_tran_dtl_main/vgph_tran_dtl_main.module';   
import { vgph_tran_log_mainModule } from './vgph_tran_log_main/vgph_tran_log_main.module';   
import { vgph_tran_error_log_mainModule } from './vgph_tran_error_log_main/vgph_tran_error_log_main.module';   
import { vgph_destination_mainModule } from './vgph_destination_main/vgph_destination_main.module';   
import { vgph_destination_tran_mainModule } from './vgph_destination_tran_main/vgph_destination_tran_main.module';   
import { prc_tokens_mainModule } from './prc_tokens_main/prc_tokens_main.module';   
import { vgph_message_template_mainModule } from './vgph_message_template_main/vgph_message_template_main.module';   
import { vgph_source_transactionsModule } from './vgph_source_transactions/vgph_source_transactions.module';   
import { vgph_source_stagingModule } from './vgph_source_staging/vgph_source_staging.module';   
import { vgph_source_tran_stagingModule } from './vgph_source_tran_staging/vgph_source_tran_staging.module';   
import { vgph_tran_dtl_stagingModule } from './vgph_tran_dtl_staging/vgph_tran_dtl_staging.module';   
import { vgph_tran_log_stagingModule } from './vgph_tran_log_staging/vgph_tran_log_staging.module';   
import { vgph_tran_error_log_stagingModule } from './vgph_tran_error_log_staging/vgph_tran_error_log_staging.module';   
import { vgph_destination_stagingModule } from './vgph_destination_staging/vgph_destination_staging.module';   
import { vgph_destination_tran_stagingModule } from './vgph_destination_tran_staging/vgph_destination_tran_staging.module';   
import { prc_tokens_stagingModule } from './prc_tokens_staging/prc_tokens_staging.module';   
import { vgph_message_template_stagingModule } from './vgph_message_template_staging/vgph_message_template_staging.module';   

import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { RedisService } from "src/redisService";


@Module({
  imports: [vgph_system_setupModule,vgph_interfaceModule,vgph_handlerModule,vgph_processModule,vgph_flowModule,vgph_stepModule,vgph_source_mainModule,vgph_source_tran_mainModule,vgph_tran_dtl_mainModule,vgph_tran_log_mainModule,vgph_tran_error_log_mainModule,vgph_destination_mainModule,vgph_destination_tran_mainModule,prc_tokens_mainModule,vgph_message_template_mainModule,vgph_source_transactionsModule,vgph_source_stagingModule,vgph_source_tran_stagingModule,vgph_tran_dtl_stagingModule,vgph_tran_log_stagingModule,vgph_tran_error_log_stagingModule,vgph_destination_stagingModule,vgph_destination_tran_stagingModule,prc_tokens_stagingModule,vgph_message_template_stagingModule],
  controllers:[],
  providers:[RuleService,CodeService,RedisService]
})
export class ErdModule {}
