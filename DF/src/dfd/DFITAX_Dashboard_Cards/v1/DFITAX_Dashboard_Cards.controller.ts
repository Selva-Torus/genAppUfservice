import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('df')
export class DFITAX_Dashboard_CardsController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('ITAX_Dashboard_Cards_2a94c7541638425b92d2c8b82beaa7c2_RequestInitiated') 
        async ITAX_Dashboard_Cards_2a94c7541638425b92d2c8b82beaa7c2_RequestInitiated(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('ITAX_Dashboard_Cards_0fedfddda18d4d93b138d55a5dc004a9_RequestCompleted') 
        async ITAX_Dashboard_Cards_0fedfddda18d4d93b138d55a5dc004a9_RequestCompleted(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}