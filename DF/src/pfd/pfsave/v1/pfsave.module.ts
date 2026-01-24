
import { Module } from "@nestjs/common";
//import { pfsaveService } from "./pfsave.service";
import { pfsaveController } from "./pfsave.controller";
import { RedisService } from "src/redisService";
import { CommonService } from "src/common.Service";
import { JwtService } from "@nestjs/jwt";
import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { MongoService } from "src/mongoService";
import { ConfigService } from '@nestjs/config';
import { LockService } from "src/lock.service";
import { TeModule } from "src/Torus/v1/te/te.module";

@Module({
    imports: [TeModule],
    controllers: [pfsaveController],
    providers: [RedisService,CommonService,RuleService,CodeService,JwtService,ConfigService, LockService,MongoService],
})
export class pfsaveModule {}
