import { Module } from "@nestjs/common";
import { myDfdDataService } from "./myDfdData.service";
import { myDfdDataController } from "./myDfdData.controller";
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
    controllers: [myDfdDataController],
    providers: [myDfdDataService,RedisService,CommonService,RuleService,CodeService,JwtService,MongoService,ConfigService, LockService],
})
export class myDfdDataModule {}
