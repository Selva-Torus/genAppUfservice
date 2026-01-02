import { Module } from "@nestjs/common";
//import { DFMongo_Total_CallsService } from "./DFMongo_Total_Calls.service";
import { DFMongo_Total_CallsController } from "./DFMongo_Total_Calls.controller";
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
    controllers: [DFMongo_Total_CallsController],
    providers: [RedisService,CommonService,RuleService,CodeService,JwtService,MongoService,ConfigService, LockService],
})
export class DFMongo_Total_CallsModule {}
