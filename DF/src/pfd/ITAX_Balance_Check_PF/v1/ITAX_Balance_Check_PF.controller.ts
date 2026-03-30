import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('pf')
export class ITAX_Balance_Check_PFController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('CT010UFUFWI001ITAXITAXPaymentDetailsv1CT010PFPFDI001ITAXITAXBalanceCheckPFv1_019ba9ecca4a4fb1b1c8acf88b73e13b_7b9a3cea26a7418fad707f5519ca9796111_RequestInitiated') 
        async CT010UFUFWI001ITAXITAXPaymentDetailsv1CT010PFPFDI001ITAXITAXBalanceCheckPFv1_019ba9ecca4a4fb1b1c8acf88b73e13b_7b9a3cea26a7418fad707f5519ca9796111_RequestInitiated(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT010UFUFWI001ITAXITAXPaymentDetailsv1CT010PFPFDI001ITAXITAXBalanceCheckPFv1_019ba9ecca4a4fb1b1c8acf88b73e13b_afc643a66da44a60ac4402de18f53afb111_RequestInitiated') 
        async CT010UFUFWI001ITAXITAXPaymentDetailsv1CT010PFPFDI001ITAXITAXBalanceCheckPFv1_019ba9ecca4a4fb1b1c8acf88b73e13b_afc643a66da44a60ac4402de18f53afb111_RequestInitiated(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT010PFPFDI001ITAXITAXBalanceCheckPFv1_63e08d6f2ef0461db7501f2c81e67dcf_d6xz8bhjdtb0008k0hc0_RequestCompleted') 
        async CT010PFPFDI001ITAXITAXBalanceCheckPFv1_63e08d6f2ef0461db7501f2c81e67dcf_d6xz8bhjdtb0008k0hc0_RequestCompleted(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}