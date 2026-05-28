import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('df')
export class DFerrorListDfdController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('errorListDfd_e2a1bf0a1d4645618906bff2e32889af_RequestInitiated') 
        async errorListDfd_e2a1bf0a1d4645618906bff2e32889af_RequestInitiated(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}