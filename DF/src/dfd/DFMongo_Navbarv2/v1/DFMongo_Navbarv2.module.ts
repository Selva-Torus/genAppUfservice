import { Module } from "@nestjs/common";
//import { DFMongo_Navbarv2Service } from "./DFMongo_Navbarv2.service";
import { DFMongo_Navbarv2Controller } from "./DFMongo_Navbarv2.controller";
import { RedisService } from "src/redisService";
import { CommonService } from "src/common.Service";
import { JwtService } from "@nestjs/jwt";
import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { MongoService } from "src/mongoService";
import { ConfigService } from "@nestjs/config";
import { LockService } from "src/lock.service";
import { TeModule } from "src/Torus/v1/te/te.module";

@Module({
    imports: [TeModule],
    controllers: [DFMongo_Navbarv2Controller],
    providers: [RedisService,CommonService,RuleService,CodeService,JwtService,MongoService,ConfigService, LockService],
})
export class DFMongo_Navbarv2Module {}
