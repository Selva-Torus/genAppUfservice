import { Module } from "@nestjs/common";
import { v_billingDFDService } from "./v_billingDFD.service";
import { v_billingDFDController } from "./v_billingDFD.controller";
import { RedisService } from "src/redisService";
import { CommonService } from "src/common.Service";
import { JwtService } from "@nestjs/jwt";
import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { MongoService } from "src/mongoService";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [],
    controllers: [v_billingDFDController],
    providers: [v_billingDFDService,RedisService,CommonService,RuleService,CodeService,JwtService,MongoService,ConfigService],
})
export class v_billingDFDModule {}
