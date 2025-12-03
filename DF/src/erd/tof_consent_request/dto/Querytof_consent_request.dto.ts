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

export class Querytof_webhookDto{
    @ApiProperty()
    @IsString()
    url: string;
    @ApiProperty() 
    isactive?: boolean;                      
}
export class Querytof_webhookWapperDto {
    @ApiProperty({ type:Querytof_webhookDto })
    @ValidateNested()
    @Type(() => Querytof_webhookDto)
    is: Querytof_webhookDto;
}
export class Querytof_subscriptionDto{
    @ApiProperty({ type:Querytof_webhookWapperDto })
    @ValidateNested()
    @Type(() => Querytof_webhookWapperDto)
     webhook: Querytof_webhookWapperDto;
}
export class Querytof_openfinance_billingDto{
    @ApiProperty({enum :usertype_tof_openfinance_billing,enumName:"usertype",type:"string"}) 
    usertype: usertype_tof_openfinance_billing;

    @ApiProperty({enum :purpose_tof_openfinance_billing,enumName:"purpose",type:"string"}) 
    purpose: purpose_tof_openfinance_billing;

}
export class Querytof_request_onbehalfofDto{
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
export class Querytof_request_onbehalfofWapperDto {
    @ApiProperty({ type:Querytof_request_onbehalfofDto })
    @ValidateNested()
    @Type(() => Querytof_request_onbehalfofDto)
    is: Querytof_request_onbehalfofDto;
}
export class Querytof_openfinance_billingWapperDto {
    @ApiProperty({ type:Querytof_openfinance_billingDto })
    @ValidateNested()
    @Type(() => Querytof_openfinance_billingDto)
    is: Querytof_openfinance_billingDto;
}
export class Querytof_request_consentDto{
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

    @ApiProperty({ type:Querytof_request_onbehalfofWapperDto })
    @ValidateNested()
    @Type(() => Querytof_request_onbehalfofWapperDto)
     onbehalfof?: Querytof_request_onbehalfofWapperDto;
    @ApiProperty()
    @IsString()
    consentid: string;
    @ApiProperty({enum :permissions_tof_request_consent,isArray: true}) 
    permissions: permissions_tof_request_consent[];

    @ApiProperty({ type:Querytof_openfinance_billingWapperDto })
    @ValidateNested()
    @Type(() => Querytof_openfinance_billingWapperDto)
     openfinancebilling: Querytof_openfinance_billingWapperDto;
}
export class Querytof_request_consentWapperDto {
    @ApiProperty({ type:Querytof_request_consentDto })
    @ValidateNested()
    @Type(() => Querytof_request_consentDto)
    is: Querytof_request_consentDto;
}
export class Querytof_subscriptionWapperDto {
    @ApiProperty({ type:Querytof_subscriptionDto })
    @ValidateNested()
    @Type(() => Querytof_subscriptionDto)
    is: Querytof_subscriptionDto;
}
export class Querytof_consent_requestDto{
    @ApiProperty()
    @IsString()
    type: string;
    @ApiProperty({ type:Querytof_request_consentWapperDto })
    @ValidateNested()
    @Type(() => Querytof_request_consentWapperDto)
     consent?: Querytof_request_consentWapperDto;
    @ApiProperty({ type:Querytof_subscriptionWapperDto })
    @ValidateNested()
    @Type(() => Querytof_subscriptionWapperDto)
     subscription?: Querytof_subscriptionWapperDto;
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









