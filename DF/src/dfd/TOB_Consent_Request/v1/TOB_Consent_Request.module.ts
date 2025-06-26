import { Module } from "@nestjs/common";
import { TOB_Consent_RequestService } from "./TOB_Consent_Request.service";
import { TOB_Consent_RequestController } from "./TOB_Consent_Request.controller";
import { RedisService } from "src/redisService";
import { CommonService } from "src/common.Service";
import { JwtService } from "@nestjs/jwt";
import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { MongoService } from "src/mongoService";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [],
    controllers: [TOB_Consent_RequestController],
    providers: [TOB_Consent_RequestService,RedisService,CommonService,RuleService,CodeService,JwtService,MongoService,ConfigService],
})
export class TOB_Consent_RequestModule {}
