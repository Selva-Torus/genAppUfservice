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



















 
export enum authorizationstatus_tof_multiauth_totalreq {
    Pending="Pending",
    Approved="Approved",
    Rejected="Rejected",
}
export enum usertype_tof_response_openfinancebilling {
    Retail="Retail",
    SME="SME",
    Corporate="Corporate",
}
export enum purpose_tof_response_openfinancebilling {
    AccountAggregation="AccountAggregation",
    RiskAssessment="RiskAssessment",
    Onboarding="Onboarding",
    Verification="Verification",
    QuoteComparison="QuoteComparison",
    BudgetingAnalysis="BudgetingAnalysis",
    FinancialAdvice="FinancialAdvice",
    AuditReconciliation="AuditReconciliation",
}
export enum identifiertype_tof_response_onbehalfof {
    Other="Other",
}
export enum accounttype_tof_response_consent {
    Retail="Retail",
    SME="SME",
    Corporate="Corporate",
}
export enum accountsubtype_tof_response_consent {
    CurrentAccount="CurrentAccount",
}
export enum permissions_tof_response_consent {
    ReadAccountsBasic="ReadAccountsBasic",
    ReadAccountsDetail="ReadAccountsDetail",
    ReadBalances="ReadBalances",
    ReadBeneficiariesBasic="ReadBeneficiariesBasic",
    ReadParty="ReadParty",
}
export enum identifiertype_tof_ctbody_onbehalfof {
    Other="Other",
}
export enum usertype_tof_response_ctbody_openfinancebilling {
    Retail="Retail",
    SME="SME",
    Corporate="Corporate",
}
export enum purpose_tof_response_ctbody_openfinancebilling {
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
export enum accounttype_tof_ctbody_data {
    Retail="Retail",
    SME="SME",
    Corporate="Corporate",
}
export enum accountsubtype_tof_ctbody_data {
    Savings="Savings",
    CurrentAccount="CurrentAccount",
}
export enum status_tof_ctbody_data {
    Authorized="Authorized",
    Rejected="Rejected",
    Revoked="Revoked",
    Expired="Expired",
    Consumed="Consumed",
    Suspended="Suspended",
}
export enum revokedby_tof_ctbody_data {
    LFI="LFI",
    TPP="TPP",
    LFIInitiatedByUser="LFIInitiatedByUser",
    TPPInitiatedByUser="TPPInitiatedByUser",
}
export enum permissions_tof_ctbody_data {
    ReadAccountsBasic="ReadAccountsBasic",
    ReadAccountsDetail="ReadAccountsDetail",
    ReadBalances="ReadBalances",
    ReadBeneficiariesBasic="ReadBeneficiariesBasic",
    ReadParty="ReadParty",
}
export enum type_tof_response_request {
    account_access_consent="account_access_consent",
}
export enum status_tof_response_data {
    Authorized="Authorized",
    Rejected="Rejected",
    Revoked="Revoked",
    Expired="Expired",
    Consumed="Consumed",
    Suspended="Suspended",
}

export class Createtof_multiauth_totalreqDto{
    @ApiProperty()
    @IsString()
    authorizerid?: string;
    @ApiProperty()
    @IsString()
    authorizertype?: string;
    @ApiProperty({ type: 'string', format: 'date-time' })
    authorizationdate?: Date;
    @ApiProperty({enum :authorizationstatus_tof_multiauth_totalreq,isArray: true}) 
    authorizationstatus?: authorizationstatus_tof_multiauth_totalreq[];

}
export class Createtof_multiauthDto{
    @ApiProperty()
    totalrequired?: number;
    @ApiProperty({ type:Createtof_multiauth_totalreqDto })
    @ValidateNested()
    @Type(() => Createtof_multiauth_totalreqDto)
    authorizations?: Createtof_multiauth_totalreqDto;
}
export class Createtof_conbody_multipleauthDto{
    @ApiProperty({ type:Createtof_multiauthDto })
    @ValidateNested()
    @Type(() => Createtof_multiauthDto)
    multipleauthorizers: Createtof_multiauthDto;
}
export class Createtof_decodedssaDto{
    @ApiProperty()
    @IsString()
    redirect_uris: string;
    @ApiProperty()
    @IsString()
    client_name?: string;
    @ApiProperty()
    @IsString()
    client_uri?: string;
    @ApiProperty()
    @IsString()
    logo_uri?: string;
    @ApiProperty()
    @IsString()
    jwks_uri?: string;
    @ApiProperty()
    @IsString()
    client_id?: string;
    @ApiProperty()
    @IsString()
    roles?: string;
    @ApiProperty()
    @IsString()
    sector_identifier_uri?: string;
    @ApiProperty()
    @IsString()
    application_type?: string;
    @ApiProperty()
    @IsString()
    organisation_id?: string;
}
export class Createtof_tppDto{
    @ApiProperty()
    @IsString()
    clientid?: string;
    @ApiProperty()
    @IsString()
    tppid?: string;
    @ApiProperty()
    @IsString()
    tppname?: string;
    @ApiProperty()
    softwarestatementid?: number;
    @ApiProperty()
    @IsString()
    directoryrecord?: string;
    @ApiProperty({ type:Createtof_decodedssaDto })
    @ValidateNested()
    @Type(() => Createtof_decodedssaDto)
    decodedssa?: Createtof_decodedssaDto;
    @ApiProperty()
    @IsString()
    orgid?: string;
}
export class Createtof_response_openfinancebillingDto{
    @ApiProperty({enum :usertype_tof_response_openfinancebilling,enumName:"usertype",type:"string"}) 
    usertype: usertype_tof_response_openfinancebilling;

    @ApiProperty({enum :purpose_tof_response_openfinancebilling,enumName:"purpose",type:"string"}) 
    purpose: purpose_tof_response_openfinancebilling;

}
export class Createtof_response_onbehalfofDto{
    @ApiProperty()
    @IsString()
    tradingname?: string;
    @ApiProperty()
    @IsString()
    legalname?: string;
    @ApiProperty({enum :identifiertype_tof_response_onbehalfof,enumName:"identifiertype",type:"string"}) 
    identifiertype?: identifiertype_tof_response_onbehalfof;

    @ApiProperty()
    @IsString()
    identifier?: string;
}
export class Createtof_response_consentDto{
    @ApiProperty()
    @IsString()
    baseconsentid?: string;
    @ApiProperty()
    @IsString()
    expirationdatetime: string;
    @ApiProperty()
    @IsString()
    transactionfromdatetime?: string;
    @ApiProperty()
    @IsString()
    transactiontodatetime?: string;
    @ApiProperty({enum :accounttype_tof_response_consent,isArray: true}) 
    accounttype?: accounttype_tof_response_consent[];

    @ApiProperty({enum :accountsubtype_tof_response_consent,isArray: true}) 
    accountsubtype?: accountsubtype_tof_response_consent[];

    @ApiProperty({ type:Createtof_response_onbehalfofDto })
    @ValidateNested()
    @Type(() => Createtof_response_onbehalfofDto)
    onbehalfof?: Createtof_response_onbehalfofDto;
    @ApiProperty()
    @IsString()
    consentid: string;
    @ApiProperty({enum :permissions_tof_response_consent,isArray: true}) 
    permissions: permissions_tof_response_consent[];

    @ApiProperty({ type:Createtof_response_openfinancebillingDto })
    @ValidateNested()
    @Type(() => Createtof_response_openfinancebillingDto)
    openfinancebilling: Createtof_response_openfinancebillingDto;
}
export class Createtof_ctbody_onbehalfofDto{
    @ApiProperty()
    @IsString()
    tradingname: string;
    @ApiProperty()
    @IsString()
    legalname?: string;
    @ApiProperty({enum :identifiertype_tof_ctbody_onbehalfof,enumName:"identifiertype",type:"string"}) 
    identifiertype?: identifiertype_tof_ctbody_onbehalfof;

    @ApiProperty()
    @IsString()
    identifier?: string;
}
export class Createtof_response_ctbody_openfinancebillingDto{
    @ApiProperty() 
    islargecorporate?: boolean;                      
    @ApiProperty({enum :usertype_tof_response_ctbody_openfinancebilling,enumName:"usertype",type:"string"}) 
    usertype?: usertype_tof_response_ctbody_openfinancebilling;

    @ApiProperty({enum :purpose_tof_response_ctbody_openfinancebilling,enumName:"purpose",type:"string"}) 
    purpose?: purpose_tof_response_ctbody_openfinancebilling;

}
export class Createtof_ctbody_dataDto{
    @ApiProperty()
    @IsString()
    baseconsentid: string;
    @ApiProperty()
    @IsString()
    expirationdatetime?: string;
    @ApiProperty()
    @IsString()
    transactionfromdatetime?: string;
    @ApiProperty()
    @IsString()
    transactiontodatetime?: string;
    @ApiProperty({enum :accounttype_tof_ctbody_data,isArray: true}) 
    accounttype?: accounttype_tof_ctbody_data[];

    @ApiProperty({enum :accountsubtype_tof_ctbody_data,isArray: true}) 
    accountsubtype?: accountsubtype_tof_ctbody_data[];

    @ApiProperty({ type:Createtof_ctbody_onbehalfofDto })
    @ValidateNested()
    @Type(() => Createtof_ctbody_onbehalfofDto)
    onbehalfof?: Createtof_ctbody_onbehalfofDto;
    @ApiProperty({enum :status_tof_ctbody_data,isArray: true}) 
    status?: status_tof_ctbody_data[];

    @ApiProperty({enum :revokedby_tof_ctbody_data,isArray: true}) 
    revokedby?: revokedby_tof_ctbody_data[];

    @ApiProperty()
    @IsString()
    creationdatetime?: string;
    @ApiProperty()
    @IsString()
    consentid?: string;
    @ApiProperty({enum :permissions_tof_ctbody_data,isArray: true}) 
    permissions?: permissions_tof_ctbody_data[];

    @ApiProperty({ type:Createtof_response_ctbody_openfinancebillingDto })
    @ValidateNested()
    @Type(() => Createtof_response_ctbody_openfinancebillingDto)
    openfinancebilling?: Createtof_response_ctbody_openfinancebillingDto;
}
export class Createtof_sub_webhookDto{
    @ApiProperty()
    @IsString()
    url: string;
    @ApiProperty() 
    isactive: boolean;                      
    @ApiProperty()
    @IsString()
    sample?: string;
}
export class Createtof_subscription_consentbodyDto{
    @ApiProperty({ type:Createtof_sub_webhookDto })
    @ValidateNested()
    @Type(() => Createtof_sub_webhookDto)
    webhook: Createtof_sub_webhookDto;
}
export class Createtof_consentbodyDto{
    @ApiProperty({ type:Createtof_ctbody_dataDto })
    @ValidateNested()
    @Type(() => Createtof_ctbody_dataDto)
    data: Createtof_ctbody_dataDto;
    @ApiProperty({ type:Createtof_conbody_multipleauthDto })
    @ValidateNested()
    @Type(() => Createtof_conbody_multipleauthDto)
    meta?: Createtof_conbody_multipleauthDto;
    @ApiProperty({ type:Createtof_subscription_consentbodyDto })
    @ValidateNested()
    @Type(() => Createtof_subscription_consentbodyDto)
    subscription: Createtof_subscription_consentbodyDto;
}
export class Createtof_reqressub_webhookDto{
    @ApiProperty()
    @IsString()
    url: string;
    @ApiProperty() 
    isactive: boolean;                      
}
export class Createtof_reqressub_consentbodyDto{
    @ApiProperty({ type:Createtof_reqressub_webhookDto })
    @ValidateNested()
    @Type(() => Createtof_reqressub_webhookDto)
    webhook: Createtof_reqressub_webhookDto;
}
export class Createtof_response_requestDto{
    @ApiProperty({enum :type_tof_response_request,enumName:"type",type:"string"}) 
    type?: type_tof_response_request;

    @ApiProperty({ type:Createtof_response_consentDto })
    @ValidateNested()
    @Type(() => Createtof_response_consentDto)
    consent: Createtof_response_consentDto;
    @ApiProperty({ type:Createtof_reqressub_consentbodyDto })
    @ValidateNested()
    @Type(() => Createtof_reqressub_consentbodyDto)
    subscription?: Createtof_reqressub_consentbodyDto;
}
export class Createtof_response_dataDto{
    @ApiProperty()
    @IsString()
    ids: string;
    @ApiProperty()
    @IsString()
    parid?: string;
    @ApiProperty()
    @IsString()
    rartype?: string;
    @ApiProperty()
    @IsString()
    standardversion?: string;
    @ApiProperty()
    @IsString()
    consentgroupid?: string;
    @ApiProperty()
    @IsString()
    requesturl?: string;
    @ApiProperty()
    @IsString()
    consenttype: string;
    @ApiProperty({enum :status_tof_response_data,isArray: true}) 
    status?: status_tof_response_data[];

    @ApiProperty({ type:Createtof_response_requestDto })
    @ValidateNested()
    @Type(() => Createtof_response_requestDto)
    request: Createtof_response_requestDto;
    @ApiProperty({ type:Createtof_consentbodyDto })
    @ValidateNested()
    @Type(() => Createtof_consentbodyDto)
    consentbody: Createtof_consentbodyDto;
    @ApiProperty()
    @IsString()
    interactionid?: string;
    @ApiProperty({ type:Createtof_tppDto })
    @ValidateNested()
    @Type(() => Createtof_tppDto)
    tpp?: Createtof_tppDto;
    @ApiProperty()
    updatedat?: number;
}
export class Createtof_consent_responseDto{
    @ApiProperty({ type:Createtof_response_dataDto })
    @ValidateNested()
    @Type(() => Createtof_response_dataDto)
    data: Createtof_response_dataDto;
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







