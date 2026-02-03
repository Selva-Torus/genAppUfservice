
import { Module } from "@nestjs/common";
//import { DFMaster_System_Setup_DFDService } from "./DFMaster_System_Setup_DFD.service";
import { DFMaster_System_Setup_DFDController } from "./DFMaster_System_Setup_DFD.controller";
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
    controllers: [DFMaster_System_Setup_DFDController],
    providers: [RedisService,CommonService,RuleService,CodeService,JwtService,ConfigService, LockService,MongoService],
})
export class DFMaster_System_Setup_DFDModule {}
