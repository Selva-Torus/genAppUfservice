import { Module } from "@nestjs/common";
import { itax_tran_error_logController } from "./itax_tran_error_log.controller";
import { itax_tran_error_logService } from "./itax_tran_error_log.service";
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
     controllers: [itax_tran_error_logController],
     providers: [itax_tran_error_logService, PrismaService,JwtServices,RedisService,CommonService,RuleService,CodeService,MongoService,ConfigService,EnvData,UfService]
})
export class itax_tran_error_logModule{}

