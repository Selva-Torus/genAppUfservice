import { Module, NestModule } from "@nestjs/common";
import { SchedulerController } from "./scheduler.controller";
import { SchedulerService } from "./scheduler.service";
import { BullModule } from "@nestjs/bullmq";
import { JobProcessor } from "./processors/job.processor";
import { GrpcHandler } from "./processors/grpc.handler";
import { HttpHandler } from "./processors/http.handler";
import { EventHandler } from "./processors/event.handler";
import { EnvData } from 'src/envData/envData.service';

@Module({
    imports: [],
    controllers: [SchedulerController],
    providers: [SchedulerService,JobProcessor,GrpcHandler,HttpHandler,EventHandler,EnvData],
    exports:[]
})
  export class SchedulerModule{}