import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('df')
export class DFcomboCurrencySearchController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('comboCurrencySearch_3578be86455b4a7b878df793361a1d91_RequestInitiated') 
        async comboCurrencySearch_3578be86455b4a7b878df793361a1d91_RequestInitiated(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}