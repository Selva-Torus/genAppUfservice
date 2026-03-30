import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('pf')
export class ITAX_PRN_Approval_PFController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('CT010UFUFWI001ITAXITAXPRNApprovalDetailsv1CT010PFPFDI001ITAXITAXPRNApprovalPFv1_4a6d98a15d5f4f6b841990ec64d411b0_e38dc9a001114aa0a26f0b31623242e3111_RequestInitiated') 
        async CT010UFUFWI001ITAXITAXPRNApprovalDetailsv1CT010PFPFDI001ITAXITAXPRNApprovalPFv1_4a6d98a15d5f4f6b841990ec64d411b0_e38dc9a001114aa0a26f0b31623242e3111_RequestInitiated(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT010UFUFWI001ITAXITAXPRNApprovalDetailsv1CT010PFPFDI001ITAXITAXPRNApprovalPFv1_4a6d98a15d5f4f6b841990ec64d411b0_23cbd8be0eb44c528c62d75b4dfc3cd0111_RequestInitiated') 
        async CT010UFUFWI001ITAXITAXPRNApprovalDetailsv1CT010PFPFDI001ITAXITAXPRNApprovalPFv1_4a6d98a15d5f4f6b841990ec64d411b0_23cbd8be0eb44c528c62d75b4dfc3cd0111_RequestInitiated(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT010PFPFDI001ITAXITAXPRNApprovalPFv1_97d01fb93ac441f38533c21ab729e42f_18a97ac412634e5e86e6d7eaf53e0376_RequestCompleted') 
        async CT010PFPFDI001ITAXITAXPRNApprovalPFv1_97d01fb93ac441f38533c21ab729e42f_18a97ac412634e5e86e6d7eaf53e0376_RequestCompleted(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT010PFPFDI001ITAXITAXPRNApprovalPFv1_9f85f3e034984fd8a23d7009cc661c53_e6cbb71355494921868dbf383c5595a4_PRN_Approved') 
        async CT010PFPFDI001ITAXITAXPRNApprovalPFv1_9f85f3e034984fd8a23d7009cc661c53_e6cbb71355494921868dbf383c5595a4_PRN_Approved(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT010PFPFDI001ITAXITAXPRNApprovalPFv1_158c8ad575db4cb192ebed44f3c520f4_c4ec5750bc9b43d084e58220bd3b24fe_PRN_Rejected') 
        async CT010PFPFDI001ITAXITAXPRNApprovalPFv1_158c8ad575db4cb192ebed44f3c520f4_c4ec5750bc9b43d084e58220bd3b24fe_PRN_Rejected(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}