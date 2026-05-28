import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('df')
export class DFforexCurrencyDropDownDfdController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('forexCurrencyDropDownDfd_5550064328cc444a9297f6c7ee1cf577_RequestInitiated') 
        async forexCurrencyDropDownDfd_5550064328cc444a9297f6c7ee1cf577_RequestInitiated(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}