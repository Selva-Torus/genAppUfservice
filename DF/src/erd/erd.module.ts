import { HttpStatus, Module } from '@nestjs/common';
    import { tob_consent_statusModule } from './tob_consent_status/tob_consent_status.module';   
    import { tob_consentsModule } from './tob_consents/tob_consents.module';   
    import { tob_consents_historyModule } from './tob_consents_history/tob_consents_history.module';   
    import { tob_lfi_consentModule } from './tob_lfi_consent/tob_lfi_consent.module';   
    import { tob_consent_requestModule } from './tob_consent_request/tob_consent_request.module';   
    import { tob_api_repositoryModule } from './tob_api_repository/tob_api_repository.module';   
    import { tob_api_process_logsModule } from './tob_api_process_logs/tob_api_process_logs.module';   

import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { RedisService } from "src/redisService";


@Module({
  imports: [tob_consent_statusModule,tob_consentsModule,tob_consents_historyModule,tob_lfi_consentModule,tob_consent_requestModule,tob_api_repositoryModule,tob_api_process_logsModule,],
  controllers:[],
  providers:[RuleService,CodeService,RedisService]
})
export class ErdModule {}
