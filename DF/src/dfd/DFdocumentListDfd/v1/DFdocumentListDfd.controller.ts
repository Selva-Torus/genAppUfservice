import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('df')
export class DFdocumentListDfdController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('documentListDfd_73dd53f1be3447e3a58f80f3186b3266_RequestInitiated') 
        async documentListDfd_73dd53f1be3447e3a58f80f3186b3266_RequestInitiated(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}