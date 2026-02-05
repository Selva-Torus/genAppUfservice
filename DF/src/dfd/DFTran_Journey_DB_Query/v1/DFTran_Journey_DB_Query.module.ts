
import { Module } from "@nestjs/common";
//import { DFTran_Journey_DB_QueryService } from "./DFTran_Journey_DB_Query.service";
import { DFTran_Journey_DB_QueryController } from "./DFTran_Journey_DB_Query.controller";
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
    controllers: [DFTran_Journey_DB_QueryController],
    providers: [RedisService,CommonService,RuleService,CodeService,JwtService,ConfigService, LockService,MongoService],
})
export class DFTran_Journey_DB_QueryModule {}
