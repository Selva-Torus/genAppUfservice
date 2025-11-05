import { Module } from "@nestjs/common";
import { mytableController } from "./mytable.controller";
import { mytableService } from "./mytable.service";
import { mytableEntity } from './entity/mytable.entity';    
import { JwtModule } from "@nestjs/jwt";
import { RedisService } from "src/redisService";
import { JwtServices } from "src/jwt.services";
import { CommonService } from "src/common.Service";
import { AbilityModule } from "../ability/ability.module";
import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";
import { MongoService } from "src/mongoService";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from '@nestjs/typeorm';
import { UfService } from "src/Torus/v2/uf/uf.service";

@Module({
     imports: [TypeOrmModule.forFeature([mytableEntity]),AbilityModule,JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1d' },
        })],
     controllers: [mytableController],
     providers: [mytableService,JwtServices,RedisService,CommonService,RuleService,CodeService,MongoService,ConfigService,UfService]
})
export class mytableModule{}

