import { HttpStatus, Module } from '@nestjs/common';
    import { collectionModule } from './collection/collection.module';   

import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { RedisService } from "src/redisService";


@Module({
  imports: [collectionModule],
  controllers:[],
  providers:[RuleService,CodeService,RedisService]
})
export class ErdModule {}
