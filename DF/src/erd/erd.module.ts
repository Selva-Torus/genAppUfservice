import { HttpStatus, Module } from '@nestjs/common';
    import { tabledataModule } from './tabledata/tabledata.module';   

import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { RedisService } from "src/redisService";


@Module({
  imports: [tabledataModule],
  controllers:[],
  providers:[RuleService,CodeService,RedisService]
})
export class ErdModule {}
