import { Module } from "@nestjs/common";
import { vgph_corporate_relationship_exceptionController } from "./vgph_corporate_relationship_exception.controller";
import { vgph_corporate_relationship_exceptionService } from "./vgph_corporate_relationship_exception.service";
import { JwtModule } from "@nestjs/jwt";
import { RedisService } from "src/redisService";
import { JwtServices } from "src/jwt.services";
import { CommonService } from "src/common.Service";
import { PrismaService } from "../prisma.service";
import { AbilityModule } from "../ability/ability.module";
import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { ConfigService } from "@nestjs/config";
import { UfService } from "src/Torus/v1/uf/uf.service";
import { EnvData } from "src/envData/envData.service";

@Module({
     imports: [AbilityModule,JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1d' },
        })],
     controllers: [vgph_corporate_relationship_exceptionController],
     providers: [vgph_corporate_relationship_exceptionService, PrismaService,JwtServices,RedisService,CommonService,RuleService,CodeService,ConfigService,EnvData,UfService]
})
export class vgph_corporate_relationship_exceptionModule{}

