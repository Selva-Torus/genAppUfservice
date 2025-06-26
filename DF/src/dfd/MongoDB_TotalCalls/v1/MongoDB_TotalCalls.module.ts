import { Module } from "@nestjs/common";
import { MongoDB_TotalCallsService } from "./MongoDB_TotalCalls.service";
import { MongoDB_TotalCallsController } from "./MongoDB_TotalCalls.controller";
import { RedisService } from "src/redisService";
import { CommonService } from "src/common.Service";
import { JwtService } from "@nestjs/jwt";
import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { MongoService } from "src/mongoService";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [],
    controllers: [MongoDB_TotalCallsController],
    providers: [MongoDB_TotalCallsService,RedisService,CommonService,RuleService,CodeService,JwtService,MongoService,ConfigService],
})
export class MongoDB_TotalCallsModule {}
