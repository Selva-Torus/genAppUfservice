import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('df')
export class DFITAX_Source_Tran_Dtl_DFDController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('ITAX_Source_Tran_Dtl_DFD_fbf93a67d5b74d25a68084378f2419be_RequestInitatied') 
        async ITAX_Source_Tran_Dtl_DFD_fbf93a67d5b74d25a68084378f2419be_RequestInitatied(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('ITAX_Source_Tran_Dtl_DFD_97b749f629f24175b8b9cda7c0c86128_RequestCompleted') 
        async ITAX_Source_Tran_Dtl_DFD_97b749f629f24175b8b9cda7c0c86128_RequestCompleted(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}