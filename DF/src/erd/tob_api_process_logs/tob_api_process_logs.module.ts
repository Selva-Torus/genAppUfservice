import { Module } from "@nestjs/common";
import { tob_api_process_logsController } from "./tob_api_process_logs.controller";
import { tob_api_process_logsService } from "./tob_api_process_logs.service";
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
     controllers: [tob_api_process_logsController],
     providers: [tob_api_process_logsService, PrismaService,JwtServices,RedisService,CommonService,RuleService,CodeService,MongoService,ConfigService]
})
export class tob_api_process_logsModule{}

