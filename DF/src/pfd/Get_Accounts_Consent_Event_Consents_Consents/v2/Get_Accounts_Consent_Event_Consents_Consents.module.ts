import { Module } from "@nestjs/common";
import { Get_Accounts_Consent_Event_Consents_ConsentsService } from "./Get_Accounts_Consent_Event_Consents_Consents.service";
import { Get_Accounts_Consent_Event_Consents_ConsentsController } from "./Get_Accounts_Consent_Event_Consents_Consents.controller";
import { RedisService } from "src/redisService";
import { CommonService } from "src/common.Service";
import { JwtService } from "@nestjs/jwt";
import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { MongoService } from "src/mongoService";
import { ConfigService } from '@nestjs/config';
import { LockService } from "src/lock.service";

@Module({
    imports: [],
    controllers: [Get_Accounts_Consent_Event_Consents_ConsentsController],
    providers: [Get_Accounts_Consent_Event_Consents_ConsentsService,RedisService,CommonService,RuleService,CodeService,JwtService,MongoService,ConfigService, LockService],
})
export class Get_Accounts_Consent_Event_Consents_ConsentsModule {}
