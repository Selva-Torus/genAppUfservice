import { Module } from "@nestjs/common";
import { forDFcheckService } from "./forDFcheck.service";
import { forDFcheckController } from "./forDFcheck.controller";
import { RedisService } from "src/redisService";
import { CommonService } from "src/common.Service";
import { JwtService } from "@nestjs/jwt";
import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { MongoService } from "src/mongoService";
import { ConfigService } from "@nestjs/config";
import { LockService } from "src/lock.service";

@Module({
    imports: [],
    controllers: [forDFcheckController],
    providers: [forDFcheckService,RedisService,CommonService,RuleService,CodeService,JwtService,MongoService,ConfigService, LockService],
})
export class forDFcheckModule {}
