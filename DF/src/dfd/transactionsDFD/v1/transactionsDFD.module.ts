import { Module } from "@nestjs/common";
import { transactionsDFDService } from "./transactionsDFD.service";
import { transactionsDFDController } from "./transactionsDFD.controller";
import { RedisService } from "src/redisService";
import { CommonService } from "src/common.Service";
import { JwtService } from "@nestjs/jwt";
import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { MongoService } from "src/mongoService";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [],
    controllers: [transactionsDFDController],
    providers: [transactionsDFDService,RedisService,CommonService,RuleService,CodeService,JwtService,MongoService,ConfigService],
})
export class transactionsDFDModule {}
