import { Module } from "@nestjs/common";
import { TOB_API_Process_LogsService } from "./TOB_API_Process_Logs.service";
import { TOB_API_Process_LogsController } from "./TOB_API_Process_Logs.controller";
import { RedisService } from "src/redisService";
import { CommonService } from "src/common.Service";
import { JwtService } from "@nestjs/jwt";
import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { MongoService } from "src/mongoService";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [],
    controllers: [TOB_API_Process_LogsController],
    providers: [TOB_API_Process_LogsService,RedisService,CommonService,RuleService,CodeService,JwtService,MongoService,ConfigService],
})
export class TOB_API_Process_LogsModule {}
