import { Module } from "@nestjs/common";
import { itax_system_setupController } from "./itax_system_setup.controller";
import { itax_system_setupService } from "./itax_system_setup.service";
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
     controllers: [itax_system_setupController],
     providers: [itax_system_setupService, PrismaService,JwtServices,RedisService,CommonService,RuleService,CodeService,MongoService,ConfigService,EnvData,UfService]
})
export class itax_system_setupModule{}

