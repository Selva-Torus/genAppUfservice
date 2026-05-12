import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('df')
export class DFtransactionController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('transaction_c2a320f6a30140a487ed20c46f1763dd_RequestInitiated') 
        async transaction_c2a320f6a30140a487ed20c46f1763dd_RequestInitiated(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}