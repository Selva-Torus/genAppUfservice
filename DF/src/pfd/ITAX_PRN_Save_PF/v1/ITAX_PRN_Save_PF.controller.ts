import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('pf')
export class ITAX_PRN_Save_PFController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('CT010UFUFWI001ITAXITAXAddPRNv1CT010PFPFDI001ITAXITAXPRNSavePFv1_0b5f42d70b9f4099a5bbc4bd3cfa768a_3acc6a708ad943c9ad6a9757903da692111_RequestInitiated') 
        async CT010UFUFWI001ITAXITAXAddPRNv1CT010PFPFDI001ITAXITAXPRNSavePFv1_0b5f42d70b9f4099a5bbc4bd3cfa768a_3acc6a708ad943c9ad6a9757903da692111_RequestInitiated(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT010PFPFDI001ITAXITAXPRNSavePFv1_88531396fe284213b80297b8d5c11937_d6te7tf2sjy0008t2dj0_RequestCompleted') 
        async CT010PFPFDI001ITAXITAXPRNSavePFv1_88531396fe284213b80297b8d5c11937_d6te7tf2sjy0008t2dj0_RequestCompleted(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT010PFPFDI001ITAXITAXPRNSavePFv1_9e703c0af9864649a0bedc8a39d1bd6b_d6qc09h4hjv0008w7jvg_SaveRequestCompleted') 
        async CT010PFPFDI001ITAXITAXPRNSavePFv1_9e703c0af9864649a0bedc8a39d1bd6b_d6qc09h4hjv0008w7jvg_SaveRequestCompleted(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT010PFPFDI001ITAXITAXPRNSavePFv1_b158429c2b164158b1600e1a35929f2d_d6qcfgp4hjv0008w7pb0_post_Source_RequestCompleted') 
        async CT010PFPFDI001ITAXITAXPRNSavePFv1_b158429c2b164158b1600e1a35929f2d_d6qcfgp4hjv0008w7pb0_post_Source_RequestCompleted(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT010PFPFDI001ITAXITAXPRNSavePFv1_ffffa7a6c43c44bf9a61a7f2fb0087b6_d6s4ha5y0y8g008n1pe0_post_Source_tran_RequestCompleted') 
        async CT010PFPFDI001ITAXITAXPRNSavePFv1_ffffa7a6c43c44bf9a61a7f2fb0087b6_d6s4ha5y0y8g008n1pe0_post_Source_tran_RequestCompleted(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}