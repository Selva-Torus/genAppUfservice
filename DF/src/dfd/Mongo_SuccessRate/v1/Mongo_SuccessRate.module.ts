import { Module } from "@nestjs/common";
import { Mongo_SuccessRateService } from "./Mongo_SuccessRate.service";
import { Mongo_SuccessRateController } from "./Mongo_SuccessRate.controller";
import { RedisService } from "src/redisService";
import { CommonService } from "src/common.Service";
import { JwtService } from "@nestjs/jwt";
import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { MongoService } from "src/mongoService";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [],
    controllers: [Mongo_SuccessRateController],
    providers: [Mongo_SuccessRateService,RedisService,CommonService,RuleService,CodeService,JwtService,MongoService,ConfigService],
})
export class Mongo_SuccessRateModule {}
