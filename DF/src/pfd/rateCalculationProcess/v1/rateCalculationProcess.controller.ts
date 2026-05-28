import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('pf')
export class rateCalculationProcessController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('CT005UFUFWGSSRTGSscanSaveProcessUiv1CT005PFPFDGSSRTGSrateCalculationProcessv1_1b27a9f5be194362a56175f876c544a9_0a03463e1db44810a36bb121eba65e0b111_CallRateCode') 
        async CT005UFUFWGSSRTGSscanSaveProcessUiv1CT005PFPFDGSSRTGSrateCalculationProcessv1_1b27a9f5be194362a56175f876c544a9_0a03463e1db44810a36bb121eba65e0b111_CallRateCode(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT005PFPFDGSSRTGSrateCalculationProcessv1_1331fa6766e24446806133e957f62f36_d827r2gcd0tg0088a57g_CallRateCodeSucc') 
        async CT005PFPFDGSSRTGSrateCalculationProcessv1_1331fa6766e24446806133e957f62f36_d827r2gcd0tg0088a57g_CallRateCodeSucc(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT005PFPFDGSSRTGSrateCalculationProcessv1_916cbcdfe76f46dfab5d6c02af1f812c_d82vce9eams000826ejg_CALL_RATE') 
        async CT005PFPFDGSSRTGSrateCalculationProcessv1_916cbcdfe76f46dfab5d6c02af1f812c_d82vce9eams000826ejg_CALL_RATE(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT005PFPFDGSSRTGSrateCalculationProcessv1_dfab736cb69e4824b5e9d8356b82a940_d82vct3eams000826f80_RateCodeDataSucss') 
        async CT005PFPFDGSSRTGSrateCalculationProcessv1_dfab736cb69e4824b5e9d8356b82a940_d82vct3eams000826f80_RateCodeDataSucss(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT005PFPFDGSSRTGSrateCalculationProcessv1_ac9f2b71645e4de68e1b3be3cdd0fcf7_d82wrh2eams000826qcg_SAME_CURRENCY') 
        async CT005PFPFDGSSRTGSrateCalculationProcessv1_ac9f2b71645e4de68e1b3be3cdd0fcf7_d82wrh2eams000826qcg_SAME_CURRENCY(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT005PFPFDGSSRTGSrateCalculationProcessv1_d80a463d3f5b4fa9a1d517b83e156672_d86ngpapgdag008fcgy0_DIFF_CURRENCY') 
        async CT005PFPFDGSSRTGSrateCalculationProcessv1_d80a463d3f5b4fa9a1d517b83e156672_d86ngpapgdag008fcgy0_DIFF_CURRENCY(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT005PFPFDGSSRTGSrateCalculationProcessv1_5ad63aad7c454920974011582e3da8bd_d86rd64pgdag008093d0_NormalExRateApiSuccs') 
        async CT005PFPFDGSSRTGSrateCalculationProcessv1_5ad63aad7c454920974011582e3da8bd_d86rd64pgdag008093d0_NormalExRateApiSuccs(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}