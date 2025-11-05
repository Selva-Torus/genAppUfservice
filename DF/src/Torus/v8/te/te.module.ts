// import Module from "module";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TeController } from "./te.controller";
import { TeService } from "./te.service";
import { RedisService } from "src/redisService";
import { CommonService } from "src/common.Service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { SecurityService } from "src/securityService";
import { RuleService } from "src/ruleService";
import { JwtService } from "@nestjs/jwt";
import { CodeService } from "src/codeService";
import { LockService } from "src/lock.service";
import { MongoService } from "src/mongoService";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [      
      ClientsModule.register([
        {
          name: 'PO',
          transport: Transport.TCP,
          options: { port: parseInt(process.env.PO_PORT) },
        },
      ]), 
    ],
    controllers: [TeController],
    providers: [TeService, RedisService, CommonService,SecurityService,RuleService,JwtService,CodeService,LockService,MongoService,ConfigService],
})
  export class TeModule implements NestModule 
  {
    configure() {}  
  }