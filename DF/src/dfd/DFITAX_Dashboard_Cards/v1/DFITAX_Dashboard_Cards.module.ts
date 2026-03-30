
import { Module } from "@nestjs/common";

import { DFITAX_Dashboard_CardsController } from "./DFITAX_Dashboard_Cards.controller";
import { RedisService } from "src/redisService";
import { CommonService } from "src/common.Service";
import { JwtService } from "@nestjs/jwt";
import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { MongoService } from "src/mongoService";
import { ConfigService } from "@nestjs/config";
import { LockService } from "src/lock.service";
import { TeModule } from "src/Torus/v1/te/te.module";
import { EnvData } from 'src/envData/envData.service';

@Module({
    imports: [TeModule],
    controllers: [DFITAX_Dashboard_CardsController],
    providers: [RedisService,CommonService,RuleService,CodeService,JwtService,ConfigService, LockService,EnvData,MongoService],
})



export class DFITAX_Dashboard_CardsModule {}
