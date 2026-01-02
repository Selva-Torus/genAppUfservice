import { HttpStatus, Module } from '@nestjs/common';
    import { bank_scheme_setupModule } from './bank_scheme_setup/bank_scheme_setup.module';   
    import { master_scheme_setupModule } from './master_scheme_setup/master_scheme_setup.module';   
    import { vmc_process_logModule } from './vmc_process_log/vmc_process_log.module';   
    import { vmc_api_repositorysModule } from './vmc_api_repositorys/vmc_api_repositorys.module';   

import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { RedisService } from "src/redisService";


@Module({
  imports: [bank_scheme_setupModule,master_scheme_setupModule,vmc_process_logModule,vmc_api_repositorysModule,],
  controllers:[],
  providers:[RuleService,CodeService,RedisService]
})
export class ErdModule {}
