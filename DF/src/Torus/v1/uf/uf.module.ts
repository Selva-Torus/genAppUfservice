import { Module } from '@nestjs/common';
import { UfService } from './uf.service';
import { UfController } from './uf.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtServices } from 'src/jwt.services';
import { RedisService } from 'src/redisService';
import { CommonService } from 'src/common.Service';
import { RuleService } from 'src/ruleService';
import { CodeService } from 'src/codeService';
import { MongoService } from 'src/mongoService';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1d' },
  }),],
  controllers: [UfController],
  providers: [UfService, JwtModule,JwtServices,RedisService,CommonService,RuleService,CodeService,MongoService,ConfigService],
  exports: [UfService]
})
export class UfModule {}
