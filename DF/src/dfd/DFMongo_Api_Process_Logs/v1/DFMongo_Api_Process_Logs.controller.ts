import { Controller } from "@nestjs/common";
import { TeService } from "src/Torus/v1/te/te.service";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";

@Controller('df')
export class DFMongo_Api_Process_LogsController {
    constructor(private readonly teService:TeService){}

        @EventPattern('Mongo_Api_Process_Logs_9de5f6c873bd4d6aa7b335eb9fa30c9f_RequestInitiated') 
        async Mongo_Api_Process_Logs_9de5f6c873bd4d6aa7b335eb9fa30c9f_RequestInitiated(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
           @EventPattern('Mongo_Api_Process_Logs_bfc7017985154a248bb5471e4900de2b_RequestCompleted') 
        async Mongo_Api_Process_Logs_bfc7017985154a248bb5471e4900de2b_RequestCompleted(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
    
}