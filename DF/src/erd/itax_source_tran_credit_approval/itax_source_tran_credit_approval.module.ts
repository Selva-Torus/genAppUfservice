import { Module } from "@nestjs/common";
import { itax_source_tran_credit_approvalController } from "./itax_source_tran_credit_approval.controller";
import { itax_source_tran_credit_approvalService } from "./itax_source_tran_credit_approval.service";
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
import { UfService } from "src/Torus/v1/uf/uf.service";
import { EnvData } from "src/envData/envData.service";

@Module({
     imports: [AbilityModule,JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1d' },
        })],
     controllers: [itax_source_tran_credit_approvalController],
     providers: [itax_source_tran_credit_approvalService, PrismaService,JwtServices,RedisService,CommonService,RuleService,CodeService,MongoService,ConfigService,EnvData,UfService]
})
export class itax_source_tran_credit_approvalModule{}

