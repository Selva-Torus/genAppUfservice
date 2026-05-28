import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('pf')
export class changeStatusTranUpdateLogInsertController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('CT005UFUFWGSSRTGStransactionProductv1CT005PFPFDGSSRTGSchangeStatusTranUpdateLogInsertv1_314b970eed014fa1b6484a9822a9c300_6ed1f0b74cf24e90856e6bc6c81770f9111_HT_CT_INITIATED') 
        async CT005UFUFWGSSRTGStransactionProductv1CT005PFPFDGSSRTGSchangeStatusTranUpdateLogInsertv1_314b970eed014fa1b6484a9822a9c300_6ed1f0b74cf24e90856e6bc6c81770f9111_HT_CT_INITIATED(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT005PFPFDGSSRTGSchangeStatusTranUpdateLogInsertv1_4a6bbabdfb54414998932214f9775d56_d80ve9scd0tg008dg33g_HT_CT_SUCCESS') 
        async CT005PFPFDGSSRTGSchangeStatusTranUpdateLogInsertv1_4a6bbabdfb54414998932214f9775d56_d80ve9scd0tg008dg33g_HT_CT_SUCCESS(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT005PFPFDGSSRTGSchangeStatusTranUpdateLogInsertv1_db35082651eb42088777561ba0bb1b89_d80ve9scd0tg008dg340_VGPHTLM_API_INSERT_SUCCESS') 
        async CT005PFPFDGSSRTGSchangeStatusTranUpdateLogInsertv1_db35082651eb42088777561ba0bb1b89_d80ve9scd0tg008dg340_VGPHTLM_API_INSERT_SUCCESS(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}