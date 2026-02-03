import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('df')
export class DFMaster_System_Setup_DFDController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('Master_System_Setup_DFD_00c361edb2164b4d887a0bd3ae9e8764_RequestInitiated') 
        async Master_System_Setup_DFD_00c361edb2164b4d887a0bd3ae9e8764_RequestInitiated(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('Master_System_Setup_DFD_ea8268fea07e4f9e991a1536c35c8463_RequestCompleted') 
        async Master_System_Setup_DFD_ea8268fea07e4f9e991a1536c35c8463_RequestCompleted(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}