import { Module } from "@nestjs/common";
import { tob_consent_statusController } from "./tob_consent_status.controller";
import { tob_consent_statusService } from "./tob_consent_status.service";
import { JwtModule } from "@nestjs/jwt";
import { RedisService } from "src/redisService";
import { JwtServices } from "src/jwt.services";
import { CommonService } from "src/common.Service";
import { PrismaService } from "../prisma.service";
import { AbilityModule } from "../ability/ability.module";
import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { MongoService } from "src/mongoService";
import { ConfigService } from "@nestjs/config";

@Module({
     imports: [AbilityModule,JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1d' },
        })],
     controllers: [tob_consent_statusController],
     providers: [tob_consent_statusService, PrismaService,JwtServices,RedisService,CommonService,RuleService,CodeService,MongoService,ConfigService]
})
export class tob_consent_statusModule{}

