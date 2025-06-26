import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { tob_api_process_logs_OnlyParentEntity } from '../../tob_api_process_logs/entity/tob_api_process_logs.entity';            



        export enum usertype_tob_ctbody_openfinancebilling{
            Retail="Retail",
            SME="SME",
            Corporate="Corporate",
        }
        export enum purpose_tob_ctbody_openfinancebilling{
            AccountAggregation="AccountAggregation",
            RiskAssessment="RiskAssessment",
        }
        export enum authorizationstatus_tob_multiauth_totalreq{
            Pending="Pending",
            Approved="Approved",
            Rejected="Rejected",
        }
        export enum usertype_tob_openfinance_billing{
            Retail="Retail",
            SME="SME",
            Corporate="Corporate",
        }
        export enum purpose_tob_openfinance_billing{
            AccountAggregation="AccountAggregation",
            RiskAssessment="RiskAssessment",
        }
        export enum identifiertype_tob_request_onbehalfof{
            Other="Other",
        }
        export enum accounttype_tob_request_consent{
            Retail="Retail",
            SME="SME",
            Corporate="Corporate",
        }
        export enum accountsubtype_tob_request_consent{
            CurrentAccount="CurrentAccount",
            SavingsAccount="SavingsAccount",
        }
        export enum permissions_tob_request_consent{
            ReadAccountsBasic="ReadAccountsBasic",
            ReadAccountsDetails="ReadAccountsDetails",
        }
        export enum identifiertype_tob_ctbody_onbehalfof{
            Other="Other",
        }
        export enum accounttype_tob_ctbody_data{
            Retail="Retail",
            SME="SME",
            Corporate="Corporate",
        }
        export enum accountsubtype_tob_ctbody_data{
            Savings="Savings",
            CurrentAccount="CurrentAccount",
        }
        export enum status_tob_ctbody_data{
            Authorized="Authorized",
            Rejected="Rejected",
            Revoked="Revoked",
            Expired="Expired",
            Consumed="Consumed",
            Suspended="Suspended",
        }
        export enum purpose_tob_ctbody_data{
            Account_Aggregation="Account_Aggregation",
            Personal_Finance_Manager="Personal_Finance_Manager",
            Other="Other",
        }
        export enum revokedby_tob_ctbody_data{
            LFI="LFI",
            TPP="TPP",
            LFIInitiatedByUser="LFIInitiatedByUser",
            TPPInitiatedByUser="TPPInitiatedByUser",
        }
        export enum permissions_tob_ctbody_data{
            ReadAccountsBasic="ReadAccountsBasic",
            ReadAccountsDetail="ReadAccountsDetail",
            ReadBalances="ReadBalances",
        }
        export enum type_tob_consent_req{
            account_access_consent="account_access_consent",
        }
        export enum authorizationchannel_tob_consent_request{
            App="App",
            Web="Web",
        }
     
  export class tob_psuidentifiersEntity {
        @ApiProperty()
        userid?: string;
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
      }
          
  export class tob_ctbody_openfinancebillingEntity {
        @ApiProperty()
        islargecorporate?: boolean;
        @ApiProperty({enum :usertype_tob_ctbody_openfinancebilling,enumName:"usertype",type:"string"}) 
        usertype? : usertype_tob_ctbody_openfinancebilling
        @ApiProperty({enum :purpose_tob_ctbody_openfinancebilling,enumName:"purpose",type:"string"}) 
        purpose? : purpose_tob_ctbody_openfinancebilling
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
      }
          
  export class tob_multiauth_totalreqEntity {
        @ApiProperty()
        authorizerid?: string;
        @ApiProperty()
        authorizertype?: string;
        @ApiProperty({
          type: `string`,
          format: `date-time`,
        })
        authorizationdate?: Date;
        @ApiProperty({enum :authorizationstatus_tob_multiauth_totalreq,enumName:"authorizationstatus",type:"string"}) 
        authorizationstatus? : authorizationstatus_tob_multiauth_totalreq
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
      }
          
  export class tob_multiauthEntity {
        @ApiProperty({
          type: `integer`,
          format: `int32`,
        })
        totalrequired?: number;
        @ApiProperty({type :() => [tob_multiauth_totalreqEntity]})  
        authorizations?: tob_multiauth_totalreqEntity[]
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
      }
          
  export class tob_conbody_multipleauthEntity {
        @ApiProperty({type :() => tob_multiauthEntity}) 
        multipleauthorizers?: tob_multiauthEntity
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
      }
          
  export class tob_decodedssaEntity {
        @ApiProperty({type : [String]})  
        redirect_uris: String[]                  
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
        @ApiProperty({type : [String]})  
        roles: String[]                  
        @ApiProperty()
        sector_identifier_uri?: string;
        @ApiProperty()
        application_type?: string;
        @ApiProperty()
        organisation_id?: string;
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
      }
          
  export class tob_tppEntity {
        @ApiProperty()
        clientid?: string;
        @ApiProperty()
        tppid?: string;
        @ApiProperty()
        tppname?: string;
        @ApiProperty()
        softwarestatementid?: string;
        @ApiProperty()
        directoryrecord?: string;
        @ApiProperty({type :() => tob_decodedssaEntity}) 
        decodedssa?: tob_decodedssaEntity
        @ApiProperty()
        orgid?: string;
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
      }
          
  export class tob_openfinance_billingEntity {
        @ApiProperty({enum :usertype_tob_openfinance_billing,enumName:"usertype",type:"string"}) 
        usertype? : usertype_tob_openfinance_billing
        @ApiProperty({enum :purpose_tob_openfinance_billing,enumName:"purpose",type:"string"}) 
        purpose? : purpose_tob_openfinance_billing
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
      }
          
  export class tob_request_onbehalfofEntity {
        @ApiProperty()
        tradingname?: string;
        @ApiProperty()
        legalname?: string;
        @ApiProperty({enum :identifiertype_tob_request_onbehalfof,enumName:"identifiertype",type:"string"}) 
        identifiertype? : identifiertype_tob_request_onbehalfof
        @ApiProperty()
        identifier?: string;
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
      }
          
  export class tob_request_consentEntity {
        @ApiProperty()
        baseconsentid?: string;
        @ApiProperty({
          type: `string`,
          format: `date-time`,
        })
        expirationdatetime?: Date;
        @ApiProperty({
          type: `string`,
          format: `date-time`,
        })
        transactionfromdatetime?: Date;
        @ApiProperty({
          type: `string`,
          format: `date-time`,
        })
        transactiontodatetime?: Date;
        @ApiProperty({enum :accounttype_tob_request_consent,isArray: true}) 
        accounttype? : accounttype_tob_request_consent
        @ApiProperty({enum :accountsubtype_tob_request_consent,isArray: true}) 
        accountsubtype? : accountsubtype_tob_request_consent
        @ApiProperty({type :() => tob_request_onbehalfofEntity}) 
        onbehalfof?: tob_request_onbehalfofEntity
        @ApiProperty()
        consentid?: string;
        @ApiProperty({enum :permissions_tob_request_consent,isArray: true}) 
        permissions? : permissions_tob_request_consent
        @ApiProperty({type :() => tob_openfinance_billingEntity}) 
        openfinancebilling?: tob_openfinance_billingEntity
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
      }
          
  export class tob_ctbody_onbehalfofEntity {
        @ApiProperty()
        tradingname?: string;
        @ApiProperty()
        legalname?: string;
        @ApiProperty({enum :identifiertype_tob_ctbody_onbehalfof,enumName:"identifiertype",type:"string"}) 
        identifiertype? : identifiertype_tob_ctbody_onbehalfof
        @ApiProperty()
        identifier?: string;
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
      }
          
  export class tob_ctbody_dataEntity {
        @ApiProperty()
        baseconsentid?: string;
        @ApiProperty()
        expirationdatetime?: string;
        @ApiProperty()
        transactionfromdatetime?: string;
        @ApiProperty()
        transactiontodatetime?: string;
        @ApiProperty({enum :accounttype_tob_ctbody_data,isArray: true}) 
        accounttype? : accounttype_tob_ctbody_data
        @ApiProperty({enum :accountsubtype_tob_ctbody_data,isArray: true}) 
        accountsubtype? : accountsubtype_tob_ctbody_data
        @ApiProperty({type :() => tob_ctbody_onbehalfofEntity}) 
        onbehalfof?: tob_ctbody_onbehalfofEntity
        @ApiProperty({enum :status_tob_ctbody_data,enumName:"status",type:"string"}) 
        status? : status_tob_ctbody_data
        @ApiProperty({enum :purpose_tob_ctbody_data,isArray: true}) 
        purpose? : purpose_tob_ctbody_data
        @ApiProperty({enum :revokedby_tob_ctbody_data,enumName:"revokedby",type:"string"}) 
        revokedby? : revokedby_tob_ctbody_data
        @ApiProperty({type :() => tob_ctbody_openfinancebillingEntity}) 
        openfinancebilling?: tob_ctbody_openfinancebillingEntity
        @ApiProperty()
        creationdatetime?: string;
        @ApiProperty()
        consentid?: string;
        @ApiProperty({enum :permissions_tob_ctbody_data,isArray: true}) 
        permissions? : permissions_tob_ctbody_data
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
      }
          
  export class tob_sub_webhookEntity {
        @ApiProperty()
        url?: string;
        @ApiProperty()
        isactive?: boolean;
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
      }
          
  export class tob_subscription_consentbodyEntity {
        @ApiProperty({type :() => tob_sub_webhookEntity}) 
        webhook?: tob_sub_webhookEntity
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
      }
          
  export class tob_consentbodyEntity {
        @ApiProperty({type :() => tob_ctbody_dataEntity}) 
        data?: tob_ctbody_dataEntity
        @ApiProperty({type :() => tob_conbody_multipleauthEntity}) 
        meta?: tob_conbody_multipleauthEntity
        @ApiProperty({type :() => tob_subscription_consentbodyEntity}) 
        subscription?: tob_subscription_consentbodyEntity
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
      }
          
  export class tob_subscription_webhookEntity {
        @ApiProperty()
        url?: string;
        @ApiProperty()
        isactive?: boolean;
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
      }
          
  export class tob_subscription_consentreqEntity {
        @ApiProperty({type :() => tob_subscription_webhookEntity}) 
        webhook?: tob_subscription_webhookEntity
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
      }
          
  export class tob_consent_reqEntity {
        @ApiProperty({enum :type_tob_consent_req,enumName:"type",type:"string"}) 
        type? : type_tob_consent_req
        @ApiProperty({type :() => tob_request_consentEntity}) 
        consent?: tob_request_consentEntity
        @ApiProperty({type :() => tob_subscription_consentreqEntity}) 
        subscription?: tob_subscription_consentreqEntity
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
      }
          
  export class tob_consent_requestEntity {
        @ApiProperty()
        id: string;
        @ApiProperty()
        ids?: string;
        @ApiProperty()
        consentgroupid?: string;
        @ApiProperty()
        requesturl?: string;
        @ApiProperty()
        consenttype?: string;
        @ApiProperty()
        status?: string;
        @ApiProperty({type :() => tob_consent_reqEntity}) 
        request?: tob_consent_reqEntity
        @ApiProperty({type :() => tob_consentbodyEntity}) 
        consentbody?: tob_consentbodyEntity
        @ApiProperty({enum :authorizationchannel_tob_consent_request,enumName:"authorizationchannel",type:"string"}) 
        authorizationchannel? : authorizationchannel_tob_consent_request
        @ApiProperty()
        interactionid?: string;
        @ApiProperty({type :() => tob_tppEntity}) 
        tpp?: tob_tppEntity
        @ApiProperty({
          type: `integer`,
          format: `int32`,
        })
        updatedat?: number;
        @ApiProperty()
        parid?: string;
        @ApiProperty()
        rartype?: string;
        @ApiProperty()
        standardversion?: string;
        @ApiProperty({type :() => tob_psuidentifiersEntity}) 
        psuidentifiers?: tob_psuidentifiersEntity
        @ApiProperty({type : [String]})  
        accountids: String[]                  
        @ApiProperty()
        connecttoken?: string;
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
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
          

  export class  tob_consent_request_OnlyParentEntity {
        @ApiProperty()
        id?: string;
        @ApiProperty()
        ids?: string;
        @ApiProperty()
        consentgroupid?: string;
        @ApiProperty()
        requesturl?: string;
        @ApiProperty()
        consenttype?: string;
        @ApiProperty()
        status?: string;
        @ApiProperty({type :() => tob_consent_reqEntity}) 
        request : tob_consent_reqEntity
        @ApiProperty({type :() => tob_consentbodyEntity}) 
        consentbody : tob_consentbodyEntity
        @ApiProperty({enum :authorizationchannel_tob_consent_request,enumName:"authorizationchannel",type:"string"})
        authorizationchannel? : authorizationchannel_tob_consent_request
        @ApiProperty()
        interactionid?: string;
        @ApiProperty({type :() => tob_tppEntity}) 
        tpp : tob_tppEntity
        @ApiProperty({
          type: `integer`,
          format: `int32`,
        })
        updatedat?: number;
        @ApiProperty()
        parid?: string;
        @ApiProperty()
        rartype?: string;
        @ApiProperty()
        standardversion?: string;
        @ApiProperty({type :() => tob_psuidentifiersEntity}) 
        psuidentifiers : tob_psuidentifiersEntity
        @ApiProperty({type : [String]})  
        accountids : String[]                  
        @ApiProperty()
        connecttoken?: string;
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

    