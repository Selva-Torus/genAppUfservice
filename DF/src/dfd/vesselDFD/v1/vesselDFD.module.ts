import { Module } from "@nestjs/common";
import { vesselDFDService } from "./vesselDFD.service";
import { vesselDFDController } from "./vesselDFD.controller";
import { RedisService } from "src/redisService";
import { CommonService } from "src/common.Service";
import { JwtService } from "@nestjs/jwt";
import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { MongoService } from "src/mongoService";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [],
    controllers: [vesselDFDController],
    providers: [vesselDFDService,RedisService,CommonService,RuleService,CodeService,JwtService,MongoService,ConfigService],
})
export class vesselDFDModule {}
