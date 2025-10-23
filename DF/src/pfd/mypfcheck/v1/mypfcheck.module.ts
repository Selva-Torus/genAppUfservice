import { Module } from "@nestjs/common";
import { mypfcheckService } from "./mypfcheck.service";
import { mypfcheckController } from "./mypfcheck.controller";
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
    controllers: [mypfcheckController],
    providers: [mypfcheckService,RedisService,CommonService,RuleService,CodeService,JwtService,MongoService,ConfigService, LockService],
})
export class mypfcheckModule {}
