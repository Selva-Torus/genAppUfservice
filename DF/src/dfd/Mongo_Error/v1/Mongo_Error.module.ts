import { Module } from "@nestjs/common";
import { Mongo_ErrorService } from "./Mongo_Error.service";
import { Mongo_ErrorController } from "./Mongo_Error.controller";
import { RedisService } from "src/redisService";
import { CommonService } from "src/common.Service";
import { JwtService } from "@nestjs/jwt";
import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { MongoService } from "src/mongoService";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [],
    controllers: [Mongo_ErrorController],
    providers: [Mongo_ErrorService,RedisService,CommonService,RuleService,CodeService,JwtService,MongoService,ConfigService],
})
export class Mongo_ErrorModule {}
