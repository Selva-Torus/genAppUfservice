
import { Module } from "@nestjs/common";
//import { CDC_Checker_FlowService } from "./CDC_Checker_Flow.service";
import { CDC_Checker_FlowController } from "./CDC_Checker_Flow.controller";
import { RedisService } from "src/redisService";
import { CommonService } from "src/common.Service";
import { JwtService } from "@nestjs/jwt";
import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { MongoService } from "src/mongoService";
import { ConfigService } from '@nestjs/config';
import { LockService } from "src/lock.service";
import { TeModule } from "src/Torus/v1/te/te.module";

@Module({
    imports: [TeModule],
    controllers: [CDC_Checker_FlowController],
    providers: [RedisService,CommonService,RuleService,CodeService,JwtService,ConfigService, LockService,MongoService],
})
export class CDC_Checker_FlowModule {}
