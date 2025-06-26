import { Module } from "@nestjs/common";
import { Mongo_ActiveAPIsService } from "./Mongo_ActiveAPIs.service";
import { Mongo_ActiveAPIsController } from "./Mongo_ActiveAPIs.controller";
import { RedisService } from "src/redisService";
import { CommonService } from "src/common.Service";
import { JwtService } from "@nestjs/jwt";
import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { MongoService } from "src/mongoService";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [],
    controllers: [Mongo_ActiveAPIsController],
    providers: [Mongo_ActiveAPIsService,RedisService,CommonService,RuleService,CodeService,JwtService,MongoService,ConfigService],
})
export class Mongo_ActiveAPIsModule {}
