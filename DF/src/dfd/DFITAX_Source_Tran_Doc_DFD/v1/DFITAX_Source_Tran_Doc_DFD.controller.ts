import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('df')
export class DFITAX_Source_Tran_Doc_DFDController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('ITAX_Source_Tran_Doc_DFD_f0d05b4ce488470bb06f13748a5c9a1d_RequestInitiated') 
        async ITAX_Source_Tran_Doc_DFD_f0d05b4ce488470bb06f13748a5c9a1d_RequestInitiated(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}