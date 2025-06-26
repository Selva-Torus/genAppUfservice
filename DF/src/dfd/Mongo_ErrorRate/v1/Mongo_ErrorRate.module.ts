import { Module } from "@nestjs/common";
import { Mongo_ErrorRateService } from "./Mongo_ErrorRate.service";
import { Mongo_ErrorRateController } from "./Mongo_ErrorRate.controller";
import { RedisService } from "src/redisService";
import { CommonService } from "src/common.Service";
import { JwtService } from "@nestjs/jwt";
import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { MongoService } from "src/mongoService";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [],
    controllers: [Mongo_ErrorRateController],
    providers: [Mongo_ErrorRateService,RedisService,CommonService,RuleService,CodeService,JwtService,MongoService,ConfigService],
})
export class Mongo_ErrorRateModule {}
