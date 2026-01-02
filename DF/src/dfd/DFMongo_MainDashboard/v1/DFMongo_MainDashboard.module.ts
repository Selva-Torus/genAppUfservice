import { Module } from "@nestjs/common";
//import { DFMongo_MainDashboardService } from "./DFMongo_MainDashboard.service";
import { DFMongo_MainDashboardController } from "./DFMongo_MainDashboard.controller";
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
    controllers: [DFMongo_MainDashboardController],
    providers: [RedisService,CommonService,RuleService,CodeService,JwtService,MongoService,ConfigService, LockService],
})
export class DFMongo_MainDashboardModule {}
