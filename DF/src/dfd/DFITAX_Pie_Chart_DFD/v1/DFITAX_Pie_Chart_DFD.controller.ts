import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('df')
export class DFITAX_Pie_Chart_DFDController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('ITAX_Pie_Chart_DFD_f9ec2b7d7862450a88173822cff61bd0_RequestInitiated') 
        async ITAX_Pie_Chart_DFD_f9ec2b7d7862450a88173822cff61bd0_RequestInitiated(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('ITAX_Pie_Chart_DFD_81aca317711843879fa8d435ad6dd705_RequestCompleted') 
        async ITAX_Pie_Chart_DFD_81aca317711843879fa8d435ad6dd705_RequestCompleted(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}