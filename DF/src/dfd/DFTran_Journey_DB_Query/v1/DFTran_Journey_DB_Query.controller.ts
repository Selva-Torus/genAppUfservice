import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('df')
export class DFTran_Journey_DB_QueryController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('Tran_Journey_DB_Query_23e8fa4e4d71451c83b1ccbfb7eb3b00_RequestInitiation') 
        async Tran_Journey_DB_Query_23e8fa4e4d71451c83b1ccbfb7eb3b00_RequestInitiation(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('Tran_Journey_DB_Query_82ce9565e2924132b82e88adc26bc17f_RequestCompleted') 
        async Tran_Journey_DB_Query_82ce9565e2924132b82e88adc26bc17f_RequestCompleted(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}