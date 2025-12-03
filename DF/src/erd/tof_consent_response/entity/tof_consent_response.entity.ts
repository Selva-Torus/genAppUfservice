import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';



        export enum authorizationstatus_tof_multiauth_totalreq{
            Pending="Pending",
            Approved="Approved",
            Rejected="Rejected",
        }
        export enum usertype_tof_response_openfinancebilling{
            Retail="Retail",
            SME="SME",
            Corporate="Corporate",
        }
        export enum purpose_tof_response_openfinancebilling{
            AccountAggregation="AccountAggregation",
            RiskAssessment="RiskAssessment",
            Onboarding="Onboarding",
            Verification="Verification",
            QuoteComparison="QuoteComparison",
            BudgetingAnalysis="BudgetingAnalysis",
            FinancialAdvice="FinancialAdvice",
            AuditReconciliation="AuditReconciliation",
        }
        export enum identifiertype_tof_response_onbehalfof{
            Other="Other",
        }
        export enum accounttype_tof_response_consent{
            Retail="Retail",
            SME="SME",
            Corporate="Corporate",
        }
        export enum accountsubtype_tof_response_consent{
            CurrentAccount="CurrentAccount",
        }
        export enum permissions_tof_response_consent{
            ReadAccountsBasic="ReadAccountsBasic",
            ReadAccountsDetail="ReadAccountsDetail",
            ReadBalances="ReadBalances",
            ReadBeneficiariesBasic="ReadBeneficiariesBasic",
            ReadParty="ReadParty",
        }
        export enum identifiertype_tof_ctbody_onbehalfof{
            Other="Other",
        }
        export enum usertype_tof_response_ctbody_openfinancebilling{
            Retail="Retail",
            SME="SME",
            Corporate="Corporate",
        }
        export enum purpose_tof_response_ctbody_openfinancebilling{
            AccountAggregation="AccountAggregation",
            RiskAssessment="RiskAssessment",
            TaxFiling="TaxFiling",
            Onboarding="Onboarding",
            Verification="Verification",
            QuoteComparison="QuoteComparison",
            BudgetingAnalysis="BudgetingAnalysis",
            FinancialAdvice="FinancialAdvice",
            AuditReconciliation="AuditReconciliation",
        }
        export enum accounttype_tof_ctbody_data{
            Retail="Retail",
            SME="SME",
            Corporate="Corporate",
        }
        export enum accountsubtype_tof_ctbody_data{
            Savings="Savings",
            CurrentAccount="CurrentAccount",
        }
        export enum status_tof_ctbody_data{
            Authorized="Authorized",
            Rejected="Rejected",
            Revoked="Revoked",
            Expired="Expired",
            Consumed="Consumed",
            Suspended="Suspended",
        }
        export enum revokedby_tof_ctbody_data{
            LFI="LFI",
            TPP="TPP",
            LFIInitiatedByUser="LFIInitiatedByUser",
            TPPInitiatedByUser="TPPInitiatedByUser",
        }
        export enum permissions_tof_ctbody_data{
            ReadAccountsBasic="ReadAccountsBasic",
            ReadAccountsDetail="ReadAccountsDetail",
            ReadBalances="ReadBalances",
            ReadBeneficiariesBasic="ReadBeneficiariesBasic",
            ReadParty="ReadParty",
        }
        export enum type_tof_response_request{
            account_access_consent="account_access_consent",
        }
        export enum status_tof_response_data{
            Authorized="Authorized",
            Rejected="Rejected",
            Revoked="Revoked",
            Expired="Expired",
            Consumed="Consumed",
            Suspended="Suspended",
        }
     
  export class tof_multiauth_totalreqEntity {
        @ApiProperty()
        authorizerid?: string;
        @ApiProperty()
        authorizertype?: string;
        @ApiProperty({
          type: `string`,
          format: `date-time`,
        })
        authorizationdate?: Date;
        @ApiProperty({enum :authorizationstatus_tof_multiauth_totalreq,isArray: true}) 
        authorizationstatus? : authorizationstatus_tof_multiauth_totalreq
      }
          
  export class tof_multiauthEntity {
        @ApiProperty({
          type: `integer`,
          format: `int32`,
        })
        totalrequired?: number;
        @ApiProperty({type :() => tof_multiauth_totalreqEntity}) 
        authorizations?: tof_multiauth_totalreqEntity
      }
          
  export class tof_conbody_multipleauthEntity {
        @ApiProperty({type :() => tof_multiauthEntity}) 
        multipleauthorizers: tof_multiauthEntity
      }
          
  export class tof_decodedssaEntity {
        @ApiProperty()
        redirect_uris: string;
        @ApiProperty()
        client_name?: string;
        @ApiProperty()
        client_uri?: string;
        @ApiProperty()
        logo_uri?: string;
        @ApiProperty()
        jwks_uri?: string;
        @ApiProperty()
        client_id?: string;
        @ApiProperty()
        roles?: string;
        @ApiProperty()
        sector_identifier_uri?: string;
        @ApiProperty()
        application_type?: string;
        @ApiProperty()
        organisation_id?: string;
      }
          
  export class tof_tppEntity {
        @ApiProperty()
        clientid?: string;
        @ApiProperty()
        tppid?: string;
        @ApiProperty()
        tppname?: string;
        @ApiProperty({
          type: `integer`,
          format: `int32`,
        })
        softwarestatementid?: number;
        @ApiProperty()
        directoryrecord?: string;
        @ApiProperty({type :() => tof_decodedssaEntity}) 
        decodedssa?: tof_decodedssaEntity
        @ApiProperty()
        orgid?: string;
      }
          
  export class tof_response_openfinancebillingEntity {
        @ApiProperty({enum :usertype_tof_response_openfinancebilling,enumName:"usertype",type:"string"}) 
        usertype? : usertype_tof_response_openfinancebilling
        @ApiProperty({enum :purpose_tof_response_openfinancebilling,enumName:"purpose",type:"string"}) 
        purpose? : purpose_tof_response_openfinancebilling
      }
          
  export class tof_response_onbehalfofEntity {
        @ApiProperty()
        tradingname?: string;
        @ApiProperty()
        legalname?: string;
        @ApiProperty({enum :identifiertype_tof_response_onbehalfof,enumName:"identifiertype",type:"string"}) 
        identifiertype? : identifiertype_tof_response_onbehalfof
        @ApiProperty()
        identifier?: string;
      }
          
  export class tof_response_consentEntity {
        @ApiProperty()
        baseconsentid?: string;
        @ApiProperty()
        expirationdatetime: string;
        @ApiProperty()
        transactionfromdatetime?: string;
        @ApiProperty()
        transactiontodatetime?: string;
        @ApiProperty({enum :accounttype_tof_response_consent,isArray: true}) 
        accounttype? : accounttype_tof_response_consent
        @ApiProperty({enum :accountsubtype_tof_response_consent,isArray: true}) 
        accountsubtype? : accountsubtype_tof_response_consent
        @ApiProperty({type :() => tof_response_onbehalfofEntity}) 
        onbehalfof?: tof_response_onbehalfofEntity
        @ApiProperty()
        consentid: string;
        @ApiProperty({enum :permissions_tof_response_consent,isArray: true}) 
        permissions? : permissions_tof_response_consent
        @ApiProperty({type :() => tof_response_openfinancebillingEntity}) 
        openfinancebilling: tof_response_openfinancebillingEntity
      }
          
  export class tof_ctbody_onbehalfofEntity {
        @ApiProperty()
        tradingname: string;
        @ApiProperty()
        legalname?: string;
        @ApiProperty({enum :identifiertype_tof_ctbody_onbehalfof,enumName:"identifiertype",type:"string"}) 
        identifiertype? : identifiertype_tof_ctbody_onbehalfof
        @ApiProperty()
        identifier?: string;
      }
          
  export class tof_response_ctbody_openfinancebillingEntity {
        @ApiProperty()
        islargecorporate?: boolean;
        @ApiProperty({enum :usertype_tof_response_ctbody_openfinancebilling,enumName:"usertype",type:"string"}) 
        usertype? : usertype_tof_response_ctbody_openfinancebilling
        @ApiProperty({enum :purpose_tof_response_ctbody_openfinancebilling,enumName:"purpose",type:"string"}) 
        purpose? : purpose_tof_response_ctbody_openfinancebilling
      }
          
  export class tof_ctbody_dataEntity {
        @ApiProperty()
        baseconsentid: string;
        @ApiProperty()
        expirationdatetime?: string;
        @ApiProperty()
        transactionfromdatetime?: string;
        @ApiProperty()
        transactiontodatetime?: string;
        @ApiProperty({enum :accounttype_tof_ctbody_data,isArray: true}) 
        accounttype? : accounttype_tof_ctbody_data
        @ApiProperty({enum :accountsubtype_tof_ctbody_data,isArray: true}) 
        accountsubtype? : accountsubtype_tof_ctbody_data
        @ApiProperty({type :() => tof_ctbody_onbehalfofEntity}) 
        onbehalfof?: tof_ctbody_onbehalfofEntity
        @ApiProperty({enum :status_tof_ctbody_data,isArray: true}) 
        status? : status_tof_ctbody_data
        @ApiProperty({enum :revokedby_tof_ctbody_data,isArray: true}) 
        revokedby? : revokedby_tof_ctbody_data
        @ApiProperty()
        creationdatetime?: string;
        @ApiProperty()
        consentid?: string;
        @ApiProperty({enum :permissions_tof_ctbody_data,isArray: true}) 
        permissions? : permissions_tof_ctbody_data
        @ApiProperty({type :() => tof_response_ctbody_openfinancebillingEntity}) 
        openfinancebilling?: tof_response_ctbody_openfinancebillingEntity
      }
          
  export class tof_sub_webhookEntity {
        @ApiProperty()
        url: string;
        @ApiProperty()
        isactive: boolean;
        @ApiProperty()
        sample?: string;
      }
          
  export class tof_subscription_consentbodyEntity {
        @ApiProperty({type :() => tof_sub_webhookEntity}) 
        webhook: tof_sub_webhookEntity
      }
          
  export class tof_consentbodyEntity {
        @ApiProperty({type :() => tof_ctbody_dataEntity}) 
        data: tof_ctbody_dataEntity
        @ApiProperty({type :() => tof_conbody_multipleauthEntity}) 
        meta?: tof_conbody_multipleauthEntity
        @ApiProperty({type :() => tof_subscription_consentbodyEntity}) 
        subscription: tof_subscription_consentbodyEntity
      }
          
  export class tof_reqressub_webhookEntity {
        @ApiProperty()
        url: string;
        @ApiProperty()
        isactive: boolean;
      }
          
  export class tof_reqressub_consentbodyEntity {
        @ApiProperty({type :() => tof_reqressub_webhookEntity}) 
        webhook: tof_reqressub_webhookEntity
      }
          
  export class tof_response_requestEntity {
        @ApiProperty({enum :type_tof_response_request,enumName:"type",type:"string"}) 
        type? : type_tof_response_request
        @ApiProperty({type :() => tof_response_consentEntity}) 
        consent: tof_response_consentEntity
        @ApiProperty({type :() => tof_reqressub_consentbodyEntity}) 
        subscription?: tof_reqressub_consentbodyEntity
      }
          
  export class tof_response_dataEntity {
        @ApiProperty()
        ids: string;
        @ApiProperty()
        parid?: string;
        @ApiProperty()
        rartype?: string;
        @ApiProperty()
        standardversion?: string;
        @ApiProperty()
        consentgroupid?: string;
        @ApiProperty()
        requesturl?: string;
        @ApiProperty()
        consenttype: string;
        @ApiProperty({enum :status_tof_response_data,isArray: true}) 
        status? : status_tof_response_data
        @ApiProperty({type :() => tof_response_requestEntity}) 
        request: tof_response_requestEntity
        @ApiProperty({type :() => tof_consentbodyEntity}) 
        consentbody: tof_consentbodyEntity
        @ApiProperty()
        interactionid?: string;
        @ApiProperty({type :() => tof_tppEntity}) 
        tpp?: tof_tppEntity
        @ApiProperty({
          type: `integer`,
          format: `int32`,
        })
        updatedat?: number;
      }
          
  export class tof_consent_responseEntity {
        @ApiProperty()
        id: string;
        @ApiProperty({type :() => tof_response_dataEntity}) 
        data: tof_response_dataEntity
        @ApiProperty()
        trs_creator_email: string;
        @ApiProperty()
        trs_created_date: Date;
        @ApiProperty()
        trs_created_by: string;
        @ApiProperty()
        trs_modified_date: Date;
        @ApiProperty()
        trs_modified_by: string;
        @ApiProperty()
        trs_status: string;
        @ApiProperty()
        trs_next_status: string;
        @ApiProperty()
        trs_process_id: string;
        @ApiProperty()
        trs_access_profile: string;
        @ApiProperty()
        trs_org_grp_code: string;
        @ApiProperty()
        trs_org_code: string;
        @ApiProperty()
        trs_role_grp_code: string;
        @ApiProperty()
        trs_role_code: string;
        @ApiProperty()
        trs_ps_grp_code: string;
        @ApiProperty()
        trs_ps_code: string;    
      }
          

  export class  tof_consent_response_OnlyParentEntity {
        @ApiProperty()
        id?: string;
        @ApiProperty({type :() => tof_response_dataEntity}) 
        data : tof_response_dataEntity
        @ApiProperty()
        trs_creator_email: string;
        @ApiProperty()
        trs_created_date: Date;
        @ApiProperty()
        trs_created_by: string;
        @ApiProperty()
        trs_modified_date: Date;
        @ApiProperty()
        trs_modified_by: string;
        @ApiProperty()
        trs_status: string;
        @ApiProperty()
        trs_next_status: string;
        @ApiProperty()
        trs_process_id: string;
        @ApiProperty()
        trs_access_profile: string;
        @ApiProperty()
        trs_org_grp_code: string;
        @ApiProperty()
        trs_org_code: string;
        @ApiProperty()
        trs_role_grp_code: string;
        @ApiProperty()
        trs_role_code: string;
        @ApiProperty()
        trs_ps_grp_code: string;
        @ApiProperty()
        trs_ps_code: string;    
      }

    