import { Module } from "@nestjs/common";
import { tof_lfiController } from "./tof_lfi.controller";
import { tof_lfiService } from "./tof_lfi.service";
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
import { UfService } from "src/Torus/v2/uf/uf.service";

@Module({
     imports: [AbilityModule,JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1d' },
        })],
     controllers: [tof_lfiController],
     providers: [tof_lfiService, PrismaService,JwtServices,RedisService,CommonService,RuleService,CodeService,MongoService,ConfigService,UfService]
})
export class tof_lfiModule{}

