import { Module } from "@nestjs/common";
import { Mongo_TotalRequestService } from "./Mongo_TotalRequest.service";
import { Mongo_TotalRequestController } from "./Mongo_TotalRequest.controller";
import { RedisService } from "src/redisService";
import { CommonService } from "src/common.Service";
import { JwtService } from "@nestjs/jwt";
import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { MongoService } from "src/mongoService";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [],
    controllers: [Mongo_TotalRequestController],
    providers: [Mongo_TotalRequestService,RedisService,CommonService,RuleService,CodeService,JwtService,MongoService,ConfigService],
})
export class Mongo_TotalRequestModule {}
