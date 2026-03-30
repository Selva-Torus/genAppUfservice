import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('df')
export class DFITAX_Bar_Chart_DFDController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('ITAX_Bar_Chart_DFD_e6ab5a5dfb624c8d95afe7a12bca79f8_RequestInitiated') 
        async ITAX_Bar_Chart_DFD_e6ab5a5dfb624c8d95afe7a12bca79f8_RequestInitiated(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('ITAX_Bar_Chart_DFD_df78e8a0897d45b290ae28c547b838d2_RequestCompleted') 
        async ITAX_Bar_Chart_DFD_df78e8a0897d45b290ae28c547b838d2_RequestCompleted(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}