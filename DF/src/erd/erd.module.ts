import { HttpStatus, Module } from '@nestjs/common';
    import { tof_lfiModule } from './tof_lfi/tof_lfi.module';   
    import { tof_tppModule } from './tof_tpp/tof_tpp.module';   
    import { tof_consentsModule } from './tof_consents/tof_consents.module';   
    import { tof_consent_requestModule } from './tof_consent_request/tof_consent_request.module';   
    import { tof_consent_responseModule } from './tof_consent_response/tof_consent_response.module';   

import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { RedisService } from "src/redisService";


@Module({
  imports: [tof_lfiModule,tof_tppModule,tof_consentsModule,tof_consent_requestModule,tof_consent_responseModule,],
  controllers:[],
  providers:[RuleService,CodeService,RedisService]
})
export class ErdModule {}
