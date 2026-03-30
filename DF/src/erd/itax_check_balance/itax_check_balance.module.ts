import { Module } from "@nestjs/common";
import { itax_check_balanceController } from "./itax_check_balance.controller";
import { itax_check_balanceService } from "./itax_check_balance.service";
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
     controllers: [itax_check_balanceController],
     providers: [itax_check_balanceService, PrismaService,JwtServices,RedisService,CommonService,RuleService,CodeService,MongoService,ConfigService,EnvData,UfService]
})
export class itax_check_balanceModule{}

