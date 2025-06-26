import { Module } from "@nestjs/common";
import { tob_consentsController } from "./tob_consents.controller";
import { tob_consentsService } from "./tob_consents.service";
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
     controllers: [tob_consentsController],
     providers: [tob_consentsService, PrismaService,JwtServices,RedisService,CommonService,RuleService,CodeService,MongoService,ConfigService]
})
export class tob_consentsModule{}

