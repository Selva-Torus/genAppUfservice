import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('df')
export class DFTran_Journey_DtlController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('Tran_Journey_Dtl_edee4cfe49a5433090b8b31898bfc568_RequestInitiated') 
        async Tran_Journey_Dtl_edee4cfe49a5433090b8b31898bfc568_RequestInitiated(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('Tran_Journey_Dtl_da1ace38473c469cbbafedc9a4948d58_RequestCompleted') 
        async Tran_Journey_Dtl_da1ace38473c469cbbafedc9a4948d58_RequestCompleted(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}