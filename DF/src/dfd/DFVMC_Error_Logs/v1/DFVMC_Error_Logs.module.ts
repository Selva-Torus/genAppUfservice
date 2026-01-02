import { Module } from "@nestjs/common";
//import { DFVMC_Error_LogsService } from "./DFVMC_Error_Logs.service";
import { DFVMC_Error_LogsController } from "./DFVMC_Error_Logs.controller";
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
    controllers: [DFVMC_Error_LogsController],
    providers: [RedisService,CommonService,RuleService,CodeService,JwtService,MongoService,ConfigService, LockService],
})
export class DFVMC_Error_LogsModule {}
