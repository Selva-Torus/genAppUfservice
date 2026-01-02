import { Module } from "@nestjs/common";
//import { DFMongo_Api_Process_LogsService } from "./DFMongo_Api_Process_Logs.service";
import { DFMongo_Api_Process_LogsController } from "./DFMongo_Api_Process_Logs.controller";
import { RedisService } from "src/redisService";
import { CommonService } from "src/common.Service";
import { JwtService } from "@nestjs/jwt";
import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { MongoService } from "src/mongoService";
import { ConfigService } from "@nestjs/config";
import { LockService } from "src/lock.service";
import { TeModule } from "src/Torus/v1/te/te.module";

@Module({
    imports: [TeModule],
    controllers: [DFMongo_Api_Process_LogsController],
    providers: [RedisService,CommonService,RuleService,CodeService,JwtService,MongoService,ConfigService, LockService],
})
export class DFMongo_Api_Process_LogsModule {}
