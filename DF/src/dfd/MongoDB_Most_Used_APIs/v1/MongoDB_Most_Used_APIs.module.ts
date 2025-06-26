import { Module } from "@nestjs/common";
import { MongoDB_Most_Used_APIsService } from "./MongoDB_Most_Used_APIs.service";
import { MongoDB_Most_Used_APIsController } from "./MongoDB_Most_Used_APIs.controller";
import { RedisService } from "src/redisService";
import { CommonService } from "src/common.Service";
import { JwtService } from "@nestjs/jwt";
import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { MongoService } from "src/mongoService";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [],
    controllers: [MongoDB_Most_Used_APIsController],
    providers: [MongoDB_Most_Used_APIsService,RedisService,CommonService,RuleService,CodeService,JwtService,MongoService,ConfigService],
})
export class MongoDB_Most_Used_APIsModule {}
