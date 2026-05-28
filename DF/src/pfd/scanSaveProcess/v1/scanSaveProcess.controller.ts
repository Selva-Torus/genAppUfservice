import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('pf')
export class scanSaveProcessController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('CT005UFUFWGSSRTGSscanSaveProcessUiv1CT005PFPFDGSSRTGSscanSaveProcessv1_189451caeb2b4f2fa02575edf4c00db2_0ac0ff5de1474cdc93561e6622df23901112_APIIntiate') 
        async CT005UFUFWGSSRTGSscanSaveProcessUiv1CT005PFPFDGSSRTGSscanSaveProcessv1_189451caeb2b4f2fa02575edf4c00db2_0ac0ff5de1474cdc93561e6622df23901112_APIIntiate(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT005PFPFDGSSRTGSscanSaveProcessv1_ba9a34ca1c3147b081267f5454d746e8_d7y7c2g2hjs0008aw70g_APIIntiateSucss') 
        async CT005PFPFDGSSRTGSscanSaveProcessv1_ba9a34ca1c3147b081267f5454d746e8_d7y7c2g2hjs0008aw70g_APIIntiateSucss(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT005PFPFDGSSRTGSscanSaveProcessv1_c50c09d66e014d8d91ec267d640071a1_d7y7c2g2hjs0008aw710_IntiateTranSucss') 
        async CT005PFPFDGSSRTGSscanSaveProcessv1_c50c09d66e014d8d91ec267d640071a1_d7y7c2g2hjs0008aw710_IntiateTranSucss(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT005PFPFDGSSRTGSscanSaveProcessv1_f39101d672634c87aa922186ef85615a_d7y7c2g2hjs0008aw71g_ValidatnProcCall') 
        async CT005PFPFDGSSRTGSscanSaveProcessv1_f39101d672634c87aa922186ef85615a_d7y7c2g2hjs0008aw71g_ValidatnProcCall(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT005PFPFDGSSRTGSscanSaveProcessv1_e2b2c8e6640843329e6a7f3c194e6753_d7y7c2g2hjs0008aw720_ListDataSucss') 
        async CT005PFPFDGSSRTGSscanSaveProcessv1_e2b2c8e6640843329e6a7f3c194e6753_d7y7c2g2hjs0008aw720_ListDataSucss(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT005PFPFDGSSRTGSscanSaveProcessv1_aa02f3bf056246c680c6e4fc215e3bfc_d7y7c2g2hjs0008aw72g_ErrorDataSucss') 
        async CT005PFPFDGSSRTGSscanSaveProcessv1_aa02f3bf056246c680c6e4fc215e3bfc_d7y7c2g2hjs0008aw72g_ErrorDataSucss(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT005UFUFWGSSRTGSscanSaveProcessUiv1CT005PFPFDGSSRTGSscanSaveProcessv1_19ffd5e211244c36b8512a95a6620450_f15c003da4df4213bd3f5535607ed7a91112_OutputDataSucss') 
        async CT005UFUFWGSSRTGSscanSaveProcessUiv1CT005PFPFDGSSRTGSscanSaveProcessv1_19ffd5e211244c36b8512a95a6620450_f15c003da4df4213bd3f5535607ed7a91112_OutputDataSucss(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT005PFPFDGSSRTGSscanSaveProcessv1_9556288ba7a844528a1b361a662c7d42_d82q1wfeams0008a8fwg_ClickUpdateSucss') 
        async CT005PFPFDGSSRTGSscanSaveProcessv1_9556288ba7a844528a1b361a662c7d42_d82q1wfeams0008a8fwg_ClickUpdateSucss(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT005PFPFDGSSRTGSscanSaveProcessv1_08d00f037b504392b453630667b0f7eb_d83f3cdeams0008fn9j0_UpdateSucss') 
        async CT005PFPFDGSSRTGSscanSaveProcessv1_08d00f037b504392b453630667b0f7eb_d83f3cdeams0008fn9j0_UpdateSucss(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT005PFPFDGSSRTGSscanSaveProcessv1_f6f5f257a18a4d99bf4fb005b66e41b7_d82q1wfeams0008a8fx0_LogInsertSuccs') 
        async CT005PFPFDGSSRTGSscanSaveProcessv1_f6f5f257a18a4d99bf4fb005b66e41b7_d82q1wfeams0008a8fx0_LogInsertSuccs(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT005PFPFDGSSRTGSscanSaveProcessv1_67327c27920d4e2e8e5de1f10999ae4e_d82q1wfeams0008a8fxg_ValidateSucss') 
        async CT005PFPFDGSSRTGSscanSaveProcessv1_67327c27920d4e2e8e5de1f10999ae4e_d82q1wfeams0008a8fxg_ValidateSucss(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT005PFPFDGSSRTGSscanSaveProcessv1_88183523d5044f4eb84f91e444c52ef5_d82q1wfeams0008a8fy0_ErrorDataSuccs') 
        async CT005PFPFDGSSRTGSscanSaveProcessv1_88183523d5044f4eb84f91e444c52ef5_d82q1wfeams0008a8fy0_ErrorDataSuccs(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}