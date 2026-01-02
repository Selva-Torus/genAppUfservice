import { Module } from "@nestjs/common";
//import { Update_Master_Setup_FlowService } from "./Update_Master_Setup_Flow.service";
import { Update_Master_Setup_FlowController } from "./Update_Master_Setup_Flow.controller";
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
    controllers: [Update_Master_Setup_FlowController],
    providers: [RedisService,CommonService,RuleService,CodeService,JwtService,MongoService,ConfigService, LockService],
})
export class Update_Master_Setup_FlowModule {}
