import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('pf')
export class ITAX_Credit_Approval_Delete_PFController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('CT010UFUFWI001ITAXITAXCreditApprovalScreenv1CT010PFPFDI001ITAXITAXCreditApprovalDeletePFv1_1b776e01baff4a5fa832055ec9ae4811_489b0ce2137e4b09b4fc1407a4e12828111_RequestInitiated') 
        async CT010UFUFWI001ITAXITAXCreditApprovalScreenv1CT010PFPFDI001ITAXITAXCreditApprovalDeletePFv1_1b776e01baff4a5fa832055ec9ae4811_489b0ce2137e4b09b4fc1407a4e12828111_RequestInitiated(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT010PFPFDI001ITAXITAXCreditApprovalDeletePFv1_08e464a08a0940b8b2221da5438cfa91_d70m90mgba3g00890q0g_RequestCompleted') 
        async CT010PFPFDI001ITAXITAXCreditApprovalDeletePFv1_08e464a08a0940b8b2221da5438cfa91_d70m90mgba3g00890q0g_RequestCompleted(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}