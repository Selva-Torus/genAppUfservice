import { HttpStatus, Module } from '@nestjs/common';
import { userableModule } from './userable/userable.module';   
import { lockdetailsModule } from './lockdetails/lockdetails.module';   

import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { RedisService } from "src/redisService";


@Module({
  imports: [userableModule,lockdetailsModule],
  controllers:[],
  providers:[RuleService,CodeService,RedisService]
})
export class ErdModule {}
