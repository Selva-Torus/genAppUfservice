import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('df')
export class DFmyDfdDataController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('myDfdData_3e962a03d46f4f08a90ea4ce8b0ac94f_apistart') 
        async myDfdData_3e962a03d46f4f08a90ea4ce8b0ac94f_apistart(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('myDfdData_8261569e8bf64e7d8523f01bc79f8e83_apisuccess') 
        async myDfdData_8261569e8bf64e7d8523f01bc79f8e83_apisuccess(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}