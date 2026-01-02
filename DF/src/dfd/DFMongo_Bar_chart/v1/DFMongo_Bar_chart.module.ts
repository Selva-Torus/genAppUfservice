import { Module } from "@nestjs/common";
//import { DFMongo_Bar_chartService } from "./DFMongo_Bar_chart.service";
import { DFMongo_Bar_chartController } from "./DFMongo_Bar_chart.controller";
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
    controllers: [DFMongo_Bar_chartController],
    providers: [RedisService,CommonService,RuleService,CodeService,JwtService,MongoService,ConfigService, LockService],
})
export class DFMongo_Bar_chartModule {}
