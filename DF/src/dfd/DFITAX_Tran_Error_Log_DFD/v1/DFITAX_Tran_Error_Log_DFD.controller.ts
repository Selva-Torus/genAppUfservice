import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('df')
export class DFITAX_Tran_Error_Log_DFDController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('ITAX_Tran_Error_Log_DFD_7fae4c6332294705abca3fd4aa159dac_RequestInitiation') 
        async ITAX_Tran_Error_Log_DFD_7fae4c6332294705abca3fd4aa159dac_RequestInitiation(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}