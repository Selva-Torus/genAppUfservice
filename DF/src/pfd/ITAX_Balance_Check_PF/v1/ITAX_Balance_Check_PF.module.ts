
import { Module } from "@nestjs/common";
import { ITAX_Balance_Check_PFController } from "./ITAX_Balance_Check_PF.controller";
import { RedisService } from "src/redisService";
import { CommonService } from "src/common.Service";
import { JwtService } from "@nestjs/jwt";
import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { MongoService } from "src/mongoService";
import { ConfigService } from '@nestjs/config';
import { LockService } from "src/lock.service";
import { TeModule } from "src/Torus/v1/te/te.module";
import { EnvData } from 'src/envData/envData.service';


@Module({
    imports: [TeModule],
    controllers: [ITAX_Balance_Check_PFController],
    providers: [RedisService,CommonService,RuleService,CodeService,JwtService,ConfigService, LockService,EnvData,MongoService],
})




export class ITAX_Balance_Check_PFModule {}
