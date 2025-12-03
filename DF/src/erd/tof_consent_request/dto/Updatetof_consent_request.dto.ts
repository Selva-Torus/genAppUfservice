import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';



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


export class  Updatetof_webhookDto {
        @ApiProperty()
        url?: string;
        @ApiProperty()
        isactive?: boolean;

}

export class  Updatetof_subscriptionDto {
        @ApiProperty({type : Updatetof_webhookDto}) 
        @Type(() => Updatetof_webhookDto) 
        webhook? : Updatetof_webhookDto

}

export class  Updatetof_openfinance_billingDto {
        @ApiProperty({enum :usertype_tof_openfinance_billing,enumName:"usertype",type:"string"})  
        usertype? : usertype_tof_openfinance_billing
        @ApiProperty({enum :purpose_tof_openfinance_billing,enumName:"purpose",type:"string"})  
        purpose? : purpose_tof_openfinance_billing

}

export class  Updatetof_request_onbehalfofDto {
        @ApiProperty()
        tradingname?: string;
        @ApiProperty()
        legalname?: string;
        @ApiProperty({enum :identifiertype_tof_request_onbehalfof,enumName:"identifiertype",type:"string"})  
        identifiertype? : identifiertype_tof_request_onbehalfof
        @ApiProperty()
        identifier?: string;

}

export class  Updatetof_request_consentDto {
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
        @ApiProperty({enum :accounttype_tof_request_consent,isArray: true}) 
        accounttype? : accounttype_tof_request_consent
        @ApiProperty({enum :accountsubtype_tof_request_consent,isArray: true}) 
        accountsubtype? : accountsubtype_tof_request_consent
        @ApiProperty({type : Updatetof_request_onbehalfofDto}) 
        @Type(() => Updatetof_request_onbehalfofDto) 
        onbehalfof? : Updatetof_request_onbehalfofDto
        @ApiProperty()
        consentid?: string;
        @ApiProperty({enum :permissions_tof_request_consent,isArray: true}) 
        permissions? : permissions_tof_request_consent
        @ApiProperty({type : Updatetof_openfinance_billingDto}) 
        @Type(() => Updatetof_openfinance_billingDto) 
        openfinancebilling? : Updatetof_openfinance_billingDto

}

export class  Updatetof_consent_requestDto {
        @ApiProperty()
        type?: string;
        @ApiProperty({type : Updatetof_request_consentDto}) 
        @Type(() => Updatetof_request_consentDto) 
        consent? : Updatetof_request_consentDto
        @ApiProperty({type : Updatetof_subscriptionDto}) 
        @Type(() => Updatetof_subscriptionDto) 
        subscription? : Updatetof_subscriptionDto
        @ApiProperty()
        trs_creator_email?: string;
        @ApiProperty({
            type: `string`,
            format: `date-time`,
        })
        trs_created_date?: Date;
        @ApiProperty()
        trs_created_by?: string;
        @ApiProperty({
            type: `string`,
            format: `date-time`,
        })
        trs_modified_date?: Date;
        @ApiProperty()
        trs_modified_by?: string;
        @ApiProperty()
        trs_status?: string;
        @ApiProperty()
        trs_next_status?: string;
        @ApiProperty()
        trs_process_id?: string;
        @ApiProperty()
        trs_access_profile?: string;
        @ApiProperty()
        trs_org_grp_code?: string;
        @ApiProperty()
        trs_org_code?: string;
        @ApiProperty()
        trs_role_grp_code?: string;
        @ApiProperty()
        trs_role_code?: string;
        @ApiProperty()
        trs_ps_grp_code?: string;
        @ApiProperty()
        trs_ps_code?: string;        

}




