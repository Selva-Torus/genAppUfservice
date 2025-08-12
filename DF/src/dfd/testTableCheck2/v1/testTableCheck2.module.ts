import { Module } from "@nestjs/common";
import { testTableCheck2Service } from "./testTableCheck2.service";
import { testTableCheck2Controller } from "./testTableCheck2.controller";
import { RedisService } from "src/redisService";
import { CommonService } from "src/common.Service";
import { JwtService } from "@nestjs/jwt";
import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { MongoService } from "src/mongoService";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [],
    controllers: [testTableCheck2Controller],
    providers: [testTableCheck2Service,RedisService,CommonService,RuleService,CodeService,JwtService,MongoService,ConfigService],
})
export class testTableCheck2Module {}
