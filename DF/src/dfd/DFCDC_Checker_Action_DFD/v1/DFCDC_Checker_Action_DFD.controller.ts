import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('df')
export class DFCDC_Checker_Action_DFDController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('CDC_Checker_Action_DFD_5e7d552230b342c1b62cf5891096ed20_RequestInitiated') 
        async CDC_Checker_Action_DFD_5e7d552230b342c1b62cf5891096ed20_RequestInitiated(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CDC_Checker_Action_DFD_0ffd283841c3428d98777604be56573c_RequestInitiatedCompleted') 
        async CDC_Checker_Action_DFD_0ffd283841c3428d98777604be56573c_RequestInitiatedCompleted(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}