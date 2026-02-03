import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('pf')
export class Payment_InitiationController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('CT005UFUFWV001VGPH001AddNewPaymentv1CT005PFPFDV001VGPH001PaymentInitiationv1_1c1bde77b3d74aa5b6935ed6dabc0ff5_3ee248739f0f4d568798d2c4c43b6b99111_RequestInitiated') 
        async CT005UFUFWV001VGPH001AddNewPaymentv1CT005PFPFDV001VGPH001PaymentInitiationv1_1c1bde77b3d74aa5b6935ed6dabc0ff5_3ee248739f0f4d568798d2c4c43b6b99111_RequestInitiated(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT005PFPFDV001VGPH001PaymentInitiationv1_5e878b87e4f44ebd99bc4341f9a10fcb_d5wa39n8s7c0008b3720_RequestCompleted') 
        async CT005PFPFDV001VGPH001PaymentInitiationv1_5e878b87e4f44ebd99bc4341f9a10fcb_d5wa39n8s7c0008b3720_RequestCompleted(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}