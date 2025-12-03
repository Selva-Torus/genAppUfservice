import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';








 
export enum usertype_tof_openfinance_billing {
    Retail="Retail",
    SME="SME",
    Corporate="Corporate",
}
export enum purpose_tof_openfinance_billing {
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
export enum identifiertype_tof_request_onbehalfof {
    Other="Other",
}
export enum accounttype_tof_request_consent {
    Retail="Retail",
    SME="SME",
    Corporate="Corporate",
}
export enum accountsubtype_tof_request_consent {
    CurrentAccount="CurrentAccount",
    SavingsAccount="SavingsAccount",
}
export enum permissions_tof_request_consent {
    ReadAccountsDetails="ReadAccountsDetails",
    ReadAccountsBasic="ReadAccountsBasic",
    ReadParty="ReadParty",
    ReadBalances="ReadBalances",
}

export class Createtof_webhookDto{
    @ApiProperty()
    @IsString()
    url: string;
    @ApiProperty() 
    isactive?: boolean;                      
}
export class Createtof_subscriptionDto{
    @ApiProperty({ type:Createtof_webhookDto })
    @ValidateNested()
    @Type(() => Createtof_webhookDto)
    webhook: Createtof_webhookDto;
}
export class Createtof_openfinance_billingDto{
    @ApiProperty({enum :usertype_tof_openfinance_billing,enumName:"usertype",type:"string"}) 
    usertype: usertype_tof_openfinance_billing;

    @ApiProperty({enum :purpose_tof_openfinance_billing,enumName:"purpose",type:"string"}) 
    purpose: purpose_tof_openfinance_billing;

}
export class Createtof_request_onbehalfofDto{
    @ApiProperty()
    @IsString()
    tradingname?: string;
    @ApiProperty()
    @IsString()
    legalname?: string;
    @ApiProperty({enum :identifiertype_tof_request_onbehalfof,enumName:"identifiertype",type:"string"}) 
    identifiertype?: identifiertype_tof_request_onbehalfof;

    @ApiProperty()
    @IsString()
    identifier?: string;
}
export class Createtof_request_consentDto{
    @ApiProperty()
    @IsString()
    baseconsentid?: string;
    @ApiProperty({ type: 'string', format: 'date-time' })
    expirationdatetime: Date;
    @ApiProperty({ type: 'string', format: 'date-time' })
    transactionfromdatetime?: Date;
    @ApiProperty({ type: 'string', format: 'date-time' })
    transactiontodatetime?: Date;
    @ApiProperty({enum :accounttype_tof_request_consent,isArray: true}) 
    accounttype?: accounttype_tof_request_consent[];

    @ApiProperty({enum :accountsubtype_tof_request_consent,isArray: true}) 
    accountsubtype?: accountsubtype_tof_request_consent[];

    @ApiProperty({ type:Createtof_request_onbehalfofDto })
    @ValidateNested()
    @Type(() => Createtof_request_onbehalfofDto)
    onbehalfof?: Createtof_request_onbehalfofDto;
    @ApiProperty()
    @IsString()
    consentid: string;
    @ApiProperty({enum :permissions_tof_request_consent,isArray: true}) 
    permissions: permissions_tof_request_consent[];

    @ApiProperty({ type:Createtof_openfinance_billingDto })
    @ValidateNested()
    @Type(() => Createtof_openfinance_billingDto)
    openfinancebilling: Createtof_openfinance_billingDto;
}
export class Createtof_consent_requestDto{
    @ApiProperty()
    @IsString()
    type: string;
    @ApiProperty({ type:Createtof_request_consentDto })
    @ValidateNested()
    @Type(() => Createtof_request_consentDto)
    consent?: Createtof_request_consentDto;
    @ApiProperty({ type:Createtof_subscriptionDto })
    @ValidateNested()
    @Type(() => Createtof_subscriptionDto)
    subscription?: Createtof_subscriptionDto;
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







