import { Controller } from "@nestjs/common";
import { Get_Accounts_Consent_Event_Consents_ConsentsService } from "./Get_Accounts_Consent_Event_Consents_Consents.service";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";

@Controller('pf')
export class Get_Accounts_Consent_Event_Consents_ConsentsController {
    constructor(private readonly get_accounts_consent_event_consents_consentsService: Get_Accounts_Consent_Event_Consents_ConsentsService){}

        @EventPattern('CT242UFUFWTPPTEST001TPPTEST002VOBGetAccountsConsentsv1_5a72f7d18c3b4432a506756ec0f839e6_84e30ebd0abd48698b7d8be0d4a51bce111_RequestInitiated') 
        async CT242UFUFWTPPTEST001TPPTEST002VOBGetAccountsConsentsv1_5a72f7d18c3b4432a506756ec0f839e6_84e30ebd0abd48698b7d8be0d4a51bce111_RequestInitiated(input: PoEvent) { 
           return await this.get_accounts_consent_event_consents_consentsService.getGet_Accounts_Consent_Event_Consents_ConsentsProcess(input)
        }       
           @EventPattern('CT242PFPFDTPPTEST001TPPTEST002GetAccountsConsentEventConsentsConsentsv2_e55aeea34e0c4f47941710d3e694fec4_d18fptbh6vzg008p0mdg_RequestCompleted') 
        async CT242PFPFDTPPTEST001TPPTEST002GetAccountsConsentEventConsentsConsentsv2_e55aeea34e0c4f47941710d3e694fec4_d18fptbh6vzg008p0mdg_RequestCompleted(input: PoEvent) { 
           return await this.get_accounts_consent_event_consents_consentsService.getGet_Accounts_Consent_Event_Consents_ConsentsProcess(input)
        }       
           @EventPattern('CT242PFPFDTPPTEST001TPPTEST002GetAccountsConsentEventConsentsConsentsv2_eb4b4d5cb7794d6a9d3d9a93f022c31e_d24yrrkse9d00081qcd0_TOF_Post_Consents_Completed') 
        async CT242PFPFDTPPTEST001TPPTEST002GetAccountsConsentEventConsentsConsentsv2_eb4b4d5cb7794d6a9d3d9a93f022c31e_d24yrrkse9d00081qcd0_TOF_Post_Consents_Completed(input: PoEvent) { 
           return await this.get_accounts_consent_event_consents_consentsService.getGet_Accounts_Consent_Event_Consents_ConsentsProcess(input)
        }       
           @EventPattern('CT242PFPFDTPPTEST001TPPTEST002GetAccountsConsentEventConsentsConsentsv2_10018cf786d24203bd2f0e61a9093ea9_d1zs1ky4qreg008rr0j0_Output_Dataset_Completed') 
        async CT242PFPFDTPPTEST001TPPTEST002GetAccountsConsentEventConsentsConsentsv2_10018cf786d24203bd2f0e61a9093ea9_d1zs1ky4qreg008rr0j0_Output_Dataset_Completed(input: PoEvent) { 
           return await this.get_accounts_consent_event_consents_consentsService.getGet_Accounts_Consent_Event_Consents_ConsentsProcess(input)
        }       
           @EventPattern('CT242PFPFDTPPTEST001TPPTEST002GetAccountsConsentEventConsentsConsentsv2_524b3daaa95442f685e0d857d4373ddf_d2e3sf5s7smg008rtgz0_Get_TOB_Completed') 
        async CT242PFPFDTPPTEST001TPPTEST002GetAccountsConsentEventConsentsConsentsv2_524b3daaa95442f685e0d857d4373ddf_d2e3sf5s7smg008rtgz0_Get_TOB_Completed(input: PoEvent) { 
           return await this.get_accounts_consent_event_consents_consentsService.getGet_Accounts_Consent_Event_Consents_ConsentsProcess(input)
        }       
           @EventPattern('CT242PFPFDTPPTEST001TPPTEST002GetAccountsConsentEventConsentsConsentsv2_7d659ed1f984403fb17690ec588c583b_d1k11ens1fwg008m9y80_Validation_Success') 
        async CT242PFPFDTPPTEST001TPPTEST002GetAccountsConsentEventConsentsConsentsv2_7d659ed1f984403fb17690ec588c583b_d1k11ens1fwg008m9y80_Validation_Success(input: PoEvent) { 
           return await this.get_accounts_consent_event_consents_consentsService.getGet_Accounts_Consent_Event_Consents_ConsentsProcess(input)
        }       
           @EventPattern('CT242PFPFDTPPTEST001TPPTEST002GetAccountsConsentEventConsentsConsentsv2_148b0a082a8a49b6a2402a73145f5924_d2e40v3s7smg008rtkw0_Validation_Failed') 
        async CT242PFPFDTPPTEST001TPPTEST002GetAccountsConsentEventConsentsConsentsv2_148b0a082a8a49b6a2402a73145f5924_d2e40v3s7smg008rtkw0_Validation_Failed(input: PoEvent) { 
           return await this.get_accounts_consent_event_consents_consentsService.getGet_Accounts_Consent_Event_Consents_ConsentsProcess(input)
        }       
           @EventPattern('CT242PFPFDTPPTEST001TPPTEST002GetAccountsConsentEventConsentsConsentsv2_7f7aaa2324d44e8eae40626b7408d800_d18fptbh6vzg008p0mf0_Get_Accounts') 
        async CT242PFPFDTPPTEST001TPPTEST002GetAccountsConsentEventConsentsConsentsv2_7f7aaa2324d44e8eae40626b7408d800_d18fptbh6vzg008p0mf0_Get_Accounts(input: PoEvent) { 
           return await this.get_accounts_consent_event_consents_consentsService.getGet_Accounts_Consent_Event_Consents_ConsentsProcess(input)
        }       
           @EventPattern('CT242PFPFDTPPTEST001TPPTEST002GetAccountsConsentEventConsentsConsentsv2_67f477cd65404df59c122bf095218072_d1k1b5ws1fwg008m9zs0_Get_Balances') 
        async CT242PFPFDTPPTEST001TPPTEST002GetAccountsConsentEventConsentsConsentsv2_67f477cd65404df59c122bf095218072_d1k1b5ws1fwg008m9zs0_Get_Balances(input: PoEvent) { 
           return await this.get_accounts_consent_event_consents_consentsService.getGet_Accounts_Consent_Event_Consents_ConsentsProcess(input)
        }       
           @EventPattern('CT242PFPFDTPPTEST001TPPTEST002GetAccountsConsentEventConsentsConsentsv2_5ff128e036794287af7234a0c58e0cb1_d1nn8fse5xag008mrz80_Get_Products') 
        async CT242PFPFDTPPTEST001TPPTEST002GetAccountsConsentEventConsentsConsentsv2_5ff128e036794287af7234a0c58e0cb1_d1nn8fse5xag008mrz80_Get_Products(input: PoEvent) { 
           return await this.get_accounts_consent_event_consents_consentsService.getGet_Accounts_Consent_Event_Consents_ConsentsProcess(input)
        }       
           @EventPattern('CT242PFPFDTPPTEST001TPPTEST002GetAccountsConsentEventConsentsConsentsv2_d72262b36a1340178fdf363fbfc82a32_d1txj78hnrs00083g640_Get_Account_Detail') 
        async CT242PFPFDTPPTEST001TPPTEST002GetAccountsConsentEventConsentsConsentsv2_d72262b36a1340178fdf363fbfc82a32_d1txj78hnrs00083g640_Get_Account_Detail(input: PoEvent) { 
           return await this.get_accounts_consent_event_consents_consentsService.getGet_Accounts_Consent_Event_Consents_ConsentsProcess(input)
        }       
           @EventPattern('CT242PFPFDTPPTEST001TPPTEST002GetAccountsConsentEventConsentsConsentsv2_4a443d636a564780811fff9dbf8cf5d1_d2r3f6msdjag008h8690_Get_Account_Direct_Debits') 
        async CT242PFPFDTPPTEST001TPPTEST002GetAccountsConsentEventConsentsConsentsv2_4a443d636a564780811fff9dbf8cf5d1_d2r3f6msdjag008h8690_Get_Account_Direct_Debits(input: PoEvent) { 
           return await this.get_accounts_consent_event_consents_consentsService.getGet_Accounts_Consent_Event_Consents_ConsentsProcess(input)
        }       
           @EventPattern('CT242PFPFDTPPTEST001TPPTEST002GetAccountsConsentEventConsentsConsentsv2_9fc385a3285242abaa2835bfbba0ab9c_d199jyb5crw0008sfscg_Get_Accounts_Completed') 
        async CT242PFPFDTPPTEST001TPPTEST002GetAccountsConsentEventConsentsConsentsv2_9fc385a3285242abaa2835bfbba0ab9c_d199jyb5crw0008sfscg_Get_Accounts_Completed(input: PoEvent) { 
           return await this.get_accounts_consent_event_consents_consentsService.getGet_Accounts_Consent_Event_Consents_ConsentsProcess(input)
        }       
    
}