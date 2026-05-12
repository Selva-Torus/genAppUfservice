import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('df')
export class DFjourneyController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('journey_0f0ab463021546318f4ee4408eea68c4_RequestInitiated') 
        async journey_0f0ab463021546318f4ee4408eea68c4_RequestInitiated(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}