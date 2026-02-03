import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('df')
export class DFGet_Transaction_DFDController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('Get_Transaction_DFD_5f41c7bb355347c689a02f79458a7527_RequestInitiation') 
        async Get_Transaction_DFD_5f41c7bb355347c689a02f79458a7527_RequestInitiation(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('Get_Transaction_DFD_5bc8f410f27248d88fc91b7fe01fb9c0_RequestComlpleted') 
        async Get_Transaction_DFD_5bc8f410f27248d88fc91b7fe01fb9c0_RequestComlpleted(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}