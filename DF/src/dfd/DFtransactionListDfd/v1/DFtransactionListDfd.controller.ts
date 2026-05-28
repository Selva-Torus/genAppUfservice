import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('df')
export class DFtransactionListDfdController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('transactionListDfd_53d25bc41a37484eaad23436c6d3cfe3_RequestInitiated') 
        async transactionListDfd_53d25bc41a37484eaad23436c6d3cfe3_RequestInitiated(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}