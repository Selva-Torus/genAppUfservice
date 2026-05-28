import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('pf')
export class getAccountInfoDetailsController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('CT005UFUFWGSSRTGSscanSaveProcessUiv1CT005PFPFDGSSRTGSgetAccountInfoDetailsv1_3571c0435e554236b7e33859cc75cb5f_2bd22037690e4c038e1c310720e27abb111_IntiateApi') 
        async CT005UFUFWGSSRTGSscanSaveProcessUiv1CT005PFPFDGSSRTGSgetAccountInfoDetailsv1_3571c0435e554236b7e33859cc75cb5f_2bd22037690e4c038e1c310720e27abb111_IntiateApi(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT005PFPFDGSSRTGSgetAccountInfoDetailsv1_ddeca52d3c7e4df1a8c951967d7eb309_d7yrhx72hjs0008awmag_ApiCallSucss') 
        async CT005PFPFDGSSRTGSgetAccountInfoDetailsv1_ddeca52d3c7e4df1a8c951967d7eb309_d7yrhx72hjs0008awmag_ApiCallSucss(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT005PFPFDGSSRTGSgetAccountInfoDetailsv1_fd0577d0c12f42608139dfe8e06775da_d8ambbdvxe3g008838pg_CoreBankingSuccs') 
        async CT005PFPFDGSSRTGSgetAccountInfoDetailsv1_fd0577d0c12f42608139dfe8e06775da_d8ambbdvxe3g008838pg_CoreBankingSuccs(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}