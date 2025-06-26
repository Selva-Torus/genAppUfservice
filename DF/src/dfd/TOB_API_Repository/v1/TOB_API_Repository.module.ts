import { Module } from "@nestjs/common";
import { TOB_API_RepositoryService } from "./TOB_API_Repository.service";
import { TOB_API_RepositoryController } from "./TOB_API_Repository.controller";
import { RedisService } from "src/redisService";
import { CommonService } from "src/common.Service";
import { JwtService } from "@nestjs/jwt";
import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { MongoService } from "src/mongoService";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [],
    controllers: [TOB_API_RepositoryController],
    providers: [TOB_API_RepositoryService,RedisService,CommonService,RuleService,CodeService,JwtService,MongoService,ConfigService],
})
export class TOB_API_RepositoryModule {}
