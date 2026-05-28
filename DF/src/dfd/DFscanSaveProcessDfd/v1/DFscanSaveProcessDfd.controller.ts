import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('df')
export class DFscanSaveProcessDfdController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('scanSaveProcessDfd_2e406af65f3a4e38bfad9e92c2647a4c_RequestInitiated') 
        async scanSaveProcessDfd_2e406af65f3a4e38bfad9e92c2647a4c_RequestInitiated(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}