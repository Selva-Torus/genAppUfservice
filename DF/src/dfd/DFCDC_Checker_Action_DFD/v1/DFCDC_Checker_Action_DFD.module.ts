
import { Module } from "@nestjs/common";
//import { DFCDC_Checker_Action_DFDService } from "./DFCDC_Checker_Action_DFD.service";
import { DFCDC_Checker_Action_DFDController } from "./DFCDC_Checker_Action_DFD.controller";
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
    controllers: [DFCDC_Checker_Action_DFDController],
    providers: [RedisService,CommonService,RuleService,CodeService,JwtService,ConfigService, LockService,MongoService],
})
export class DFCDC_Checker_Action_DFDModule {}
