import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('df')
export class DFITAX_Source_Tran_DFDController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('ITAX_Source_Tran_DFD_ce4128768e3a4356b55ac6f57ec601f2_RequestInitatied') 
        async ITAX_Source_Tran_DFD_ce4128768e3a4356b55ac6f57ec601f2_RequestInitatied(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('ITAX_Source_Tran_DFD_e94f0b0bfd204105bf68851e77eecc7b_RequestCompleted') 
        async ITAX_Source_Tran_DFD_e94f0b0bfd204105bf68851e77eecc7b_RequestCompleted(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}