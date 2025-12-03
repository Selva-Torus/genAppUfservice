import { Module } from "@nestjs/common";
import { HUB_SimulationService } from "./HUB_Simulation.service";
import { HUB_SimulationController } from "./HUB_Simulation.controller";
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
    controllers: [HUB_SimulationController],
    providers: [HUB_SimulationService,RedisService,CommonService,RuleService,CodeService,JwtService,MongoService,ConfigService, LockService],
})
export class HUB_SimulationModule {}
