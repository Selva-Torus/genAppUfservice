import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('df')
export class DFcrBankCodeDropDownDfdController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('crBankCodeDropDownDfd_b3bcefa5100b40a48d55edfe1b6821cf_RequestInitiated') 
        async crBankCodeDropDownDfd_b3bcefa5100b40a48d55edfe1b6821cf_RequestInitiated(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}