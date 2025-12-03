import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';



        export enum usertype_tof_openfinance_billing{
            Retail="Retail",
            SME="SME",
            Corporate="Corporate",
        }
        export enum purpose_tof_openfinance_billing{
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
        export enum identifiertype_tof_request_onbehalfof{
            Other="Other",
        }
        export enum accounttype_tof_request_consent{
            Retail="Retail",
            SME="SME",
            Corporate="Corporate",
        }
        export enum accountsubtype_tof_request_consent{
            CurrentAccount="CurrentAccount",
            SavingsAccount="SavingsAccount",
        }
        export enum permissions_tof_request_consent{
            ReadAccountsDetails="ReadAccountsDetails",
            ReadAccountsBasic="ReadAccountsBasic",
            ReadParty="ReadParty",
            ReadBalances="ReadBalances",
        }
     
  export class tof_webhookEntity {
        @ApiProperty()
        url: string;
        @ApiProperty()
        isactive?: boolean;
      }
          
  export class tof_subscriptionEntity {
        @ApiProperty({type :() => tof_webhookEntity}) 
        webhook: tof_webhookEntity
      }
          
  export class tof_openfinance_billingEntity {
        @ApiProperty({enum :usertype_tof_openfinance_billing,enumName:"usertype",type:"string"}) 
        usertype? : usertype_tof_openfinance_billing
        @ApiProperty({enum :purpose_tof_openfinance_billing,enumName:"purpose",type:"string"}) 
        purpose? : purpose_tof_openfinance_billing
      }
          
  export class tof_request_onbehalfofEntity {
        @ApiProperty()
        tradingname?: string;
        @ApiProperty()
        legalname?: string;
        @ApiProperty({enum :identifiertype_tof_request_onbehalfof,enumName:"identifiertype",type:"string"}) 
        identifiertype? : identifiertype_tof_request_onbehalfof
        @ApiProperty()
        identifier?: string;
      }
          
  export class tof_request_consentEntity {
        @ApiProperty()
        baseconsentid?: string;
        @ApiProperty({
          type: `string`,
          format: `date-time`,
        })
        expirationdatetime: Date;
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
        @ApiProperty({enum :accounttype_tof_request_consent,isArray: true}) 
        accounttype? : accounttype_tof_request_consent
        @ApiProperty({enum :accountsubtype_tof_request_consent,isArray: true}) 
        accountsubtype? : accountsubtype_tof_request_consent
        @ApiProperty({type :() => tof_request_onbehalfofEntity}) 
        onbehalfof?: tof_request_onbehalfofEntity
        @ApiProperty()
        consentid: string;
        @ApiProperty({enum :permissions_tof_request_consent,isArray: true}) 
        permissions? : permissions_tof_request_consent
        @ApiProperty({type :() => tof_openfinance_billingEntity}) 
        openfinancebilling: tof_openfinance_billingEntity
      }
          
  export class tof_consent_requestEntity {
        @ApiProperty()
        id: string;
        @ApiProperty()
        type: string;
        @ApiProperty({type :() => tof_request_consentEntity}) 
        consent?: tof_request_consentEntity
        @ApiProperty({type :() => tof_subscriptionEntity}) 
        subscription?: tof_subscriptionEntity
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
          

  export class  tof_consent_request_OnlyParentEntity {
        @ApiProperty()
        id?: string;
        @ApiProperty()
        type: string;
        @ApiProperty({type :() => tof_request_consentEntity}) 
        consent : tof_request_consentEntity
        @ApiProperty({type :() => tof_subscriptionEntity}) 
        subscription : tof_subscriptionEntity
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

    