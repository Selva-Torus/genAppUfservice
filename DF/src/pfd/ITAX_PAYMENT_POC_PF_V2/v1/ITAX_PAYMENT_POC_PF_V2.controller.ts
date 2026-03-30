import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('pf')
export class ITAX_PAYMENT_POC_PF_V2Controller {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('CT010UFUFWI001ITAXITAXPaymentDetailsv1CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_b0c626ac98074d91b0e3d80b3e6debfa_8fea1a0248144f60a0780ab416b3a4e8111_RequestInitiated') 
        async CT010UFUFWI001ITAXITAXPaymentDetailsv1CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_b0c626ac98074d91b0e3d80b3e6debfa_8fea1a0248144f60a0780ab416b3a4e8111_RequestInitiated(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_ec28b48597a44517944a32d07b10535c_d6yk4bsjdtb0008k2b50_RequestCompleted') 
        async CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_ec28b48597a44517944a32d07b10535c_d6yk4bsjdtb0008k2b50_RequestCompleted(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_b63b83e180f948c08d8082281f02fa3f_435c5fb10c1f4460a27a6108419b7220_check_accno_bal_completed') 
        async CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_b63b83e180f948c08d8082281f02fa3f_435c5fb10c1f4460a27a6108419b7220_check_accno_bal_completed(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT010UFUFWI001ITAXITAXCreditFlowScreenv1CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_14f77b90fb664f7da993cee1faef6adb_ec3e88cc91a0483c90db830f757c9c9c1112_Insufficent_Balance') 
        async CT010UFUFWI001ITAXITAXCreditFlowScreenv1CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_14f77b90fb664f7da993cee1faef6adb_ec3e88cc91a0483c90db830f757c9c9c1112_Insufficent_Balance(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_acfbdac43845494ea57900c1c416654f_9364df754f2945a2914a88d731dc6a31_Credit_Flow_Completed') 
        async CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_acfbdac43845494ea57900c1c416654f_9364df754f2945a2914a88d731dc6a31_Credit_Flow_Completed(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_fa3cf9a7c7cc498e92388f1b9a859398_37387745dcc0442291a5c79a956fd494_Credit_Application_Initiated') 
        async CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_fa3cf9a7c7cc498e92388f1b9a859398_37387745dcc0442291a5c79a956fd494_Credit_Application_Initiated(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT010UFUFWI001ITAXITAXCreditApprovalScreenv1CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_ade0d94046c646e2bf1137701e1c82bd_be8d9f77dd1b4a6482b65b0b57f5bd6a111_source_tran_completed') 
        async CT010UFUFWI001ITAXITAXCreditApprovalScreenv1CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_ade0d94046c646e2bf1137701e1c82bd_be8d9f77dd1b4a6482b65b0b57f5bd6a111_source_tran_completed(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT010UFUFWI001ITAXITAXCheckerCreditApprovalScreenv1CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_ade0d94046c646e2bf1137701e1c82bd_0d98a26417b545cc9e6313ea2fb89f9a111_source_tran_completed') 
        async CT010UFUFWI001ITAXITAXCheckerCreditApprovalScreenv1CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_ade0d94046c646e2bf1137701e1c82bd_0d98a26417b545cc9e6313ea2fb89f9a111_source_tran_completed(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_8da2fe5ea65f4dcfa30c6df02d82c2a9_d6x8azb2d3eg0087rhy0_chk_screen_completed') 
        async CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_8da2fe5ea65f4dcfa30c6df02d82c2a9_d6x8azb2d3eg0087rhy0_chk_screen_completed(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_e1f0c24ea05d419b9ff049ac5b370d7d_d6x8azb2d3eg0087rhyg_Credit_Application_Approved') 
        async CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_e1f0c24ea05d419b9ff049ac5b370d7d_d6x8azb2d3eg0087rhyg_Credit_Application_Approved(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_1ca5be60b77f494cacb3d077e1cffcf4_d6x8azb2d3eg0087rhz0_Credit_Application_Rejected') 
        async CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_1ca5be60b77f494cacb3d077e1cffcf4_d6x8azb2d3eg0087rhz0_Credit_Application_Rejected(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_0e84a55ae59f42c98d6d618ed6e59b4c_d6x4b1c72peg008kn6p0_Sufficient_Balance') 
        async CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_0e84a55ae59f42c98d6d618ed6e59b4c_d6x4b1c72peg008kn6p0_Sufficient_Balance(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_332667f183e14a8a8a51073307f1ef66_7be2c63eb33c4676a577e0a0f312196c_Sufficient_Balance') 
        async CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_332667f183e14a8a8a51073307f1ef66_7be2c63eb33c4676a577e0a0f312196c_Sufficient_Balance(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_824ae62f72c9438fadf00f7dc233fb30_6953804e4e774792baf7a1f9c60973fe_Cheque') 
        async CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_824ae62f72c9438fadf00f7dc233fb30_6953804e4e774792baf7a1f9c60973fe_Cheque(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_214f9926e59a4aa9abad277f07b97490_983aac6ce54d48cd80cd37e9c46a080f_Direct_Transfer') 
        async CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_214f9926e59a4aa9abad277f07b97490_983aac6ce54d48cd80cd37e9c46a080f_Direct_Transfer(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_99e159ed06124c47b2485cb00c7eb87a_0f16d1df133f4ace8cc38d13b18dfd10_createTransaction_completed') 
        async CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_99e159ed06124c47b2485cb00c7eb87a_0f16d1df133f4ace8cc38d13b18dfd10_createTransaction_completed(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_bc67bbe461504fa3a8cbc3d146b7f6b9_d6x4m0r2d3eg0087q4tg_Success') 
        async CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_bc67bbe461504fa3a8cbc3d146b7f6b9_d6x4m0r2d3eg0087q4tg_Success(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_89f71e94cec74fd28601d48e582668c4_d6x4kbn2d3eg0087q410_get_system_setup_kra_completed') 
        async CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_89f71e94cec74fd28601d48e582668c4_d6x4kbn2d3eg0087q410_get_system_setup_kra_completed(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_839ffde8ba104ce1b407a514e8e912b1_d70h185gba3g0088zhz0_singleTaxPayment_completed') 
        async CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_839ffde8ba104ce1b407a514e8e912b1_d70h185gba3g0088zhz0_singleTaxPayment_completed(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_7599f6d3826d43f88bd939ef9fba4214_d6x4kbn2d3eg0087q41g_Success') 
        async CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_7599f6d3826d43f88bd939ef9fba4214_d6x4kbn2d3eg0087q41g_Success(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_e8b99445994541cb9b1ac7d513818b9f_d6x4kbn2d3eg0087q40g_Failed') 
        async CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_e8b99445994541cb9b1ac7d513818b9f_d6x4kbn2d3eg0087q40g_Failed(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_4736b738ffb941a6bcb66cb159deddbb_d6x4kbn2d3eg0087q420_Payment_Completed') 
        async CT010PFPFDI001ITAXITAXPAYMENTPOCPFV2v1_4736b738ffb941a6bcb66cb159deddbb_d6x4kbn2d3eg0087q420_Payment_Completed(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}