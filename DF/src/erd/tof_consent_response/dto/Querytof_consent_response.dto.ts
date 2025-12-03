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

export class Querytof_multiauth_totalreqDto{
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
export class Querytof_multiauth_totalreqWapperDto {
    @ApiProperty({ type:Querytof_multiauth_totalreqDto })
    @ValidateNested()
    @Type(() => Querytof_multiauth_totalreqDto)
    is: Querytof_multiauth_totalreqDto;
}
export class Querytof_multiauthDto{
    @ApiProperty()
    totalrequired?: number;
    @ApiProperty({ type:Querytof_multiauth_totalreqWapperDto })
    @ValidateNested()
    @Type(() => Querytof_multiauth_totalreqWapperDto)
     authorizations?: Querytof_multiauth_totalreqWapperDto;
}
export class Querytof_multiauthWapperDto {
    @ApiProperty({ type:Querytof_multiauthDto })
    @ValidateNested()
    @Type(() => Querytof_multiauthDto)
    is: Querytof_multiauthDto;
}
export class Querytof_conbody_multipleauthDto{
    @ApiProperty({ type:Querytof_multiauthWapperDto })
    @ValidateNested()
    @Type(() => Querytof_multiauthWapperDto)
     multipleauthorizers: Querytof_multiauthWapperDto;
}
export class Querytof_decodedssaDto{
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
export class Querytof_decodedssaWapperDto {
    @ApiProperty({ type:Querytof_decodedssaDto })
    @ValidateNested()
    @Type(() => Querytof_decodedssaDto)
    is: Querytof_decodedssaDto;
}
export class Querytof_tppDto{
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
    @ApiProperty({ type:Querytof_decodedssaWapperDto })
    @ValidateNested()
    @Type(() => Querytof_decodedssaWapperDto)
     decodedssa?: Querytof_decodedssaWapperDto;
    @ApiProperty()
    @IsString()
    orgid?: string;
}
export class Querytof_response_openfinancebillingDto{
    @ApiProperty({enum :usertype_tof_response_openfinancebilling,enumName:"usertype",type:"string"}) 
    usertype: usertype_tof_response_openfinancebilling;

    @ApiProperty({enum :purpose_tof_response_openfinancebilling,enumName:"purpose",type:"string"}) 
    purpose: purpose_tof_response_openfinancebilling;

}
export class Querytof_response_onbehalfofDto{
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
export class Querytof_response_onbehalfofWapperDto {
    @ApiProperty({ type:Querytof_response_onbehalfofDto })
    @ValidateNested()
    @Type(() => Querytof_response_onbehalfofDto)
    is: Querytof_response_onbehalfofDto;
}
export class Querytof_response_openfinancebillingWapperDto {
    @ApiProperty({ type:Querytof_response_openfinancebillingDto })
    @ValidateNested()
    @Type(() => Querytof_response_openfinancebillingDto)
    is: Querytof_response_openfinancebillingDto;
}
export class Querytof_response_consentDto{
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

    @ApiProperty({ type:Querytof_response_onbehalfofWapperDto })
    @ValidateNested()
    @Type(() => Querytof_response_onbehalfofWapperDto)
     onbehalfof?: Querytof_response_onbehalfofWapperDto;
    @ApiProperty()
    @IsString()
    consentid: string;
    @ApiProperty({enum :permissions_tof_response_consent,isArray: true}) 
    permissions: permissions_tof_response_consent[];

    @ApiProperty({ type:Querytof_response_openfinancebillingWapperDto })
    @ValidateNested()
    @Type(() => Querytof_response_openfinancebillingWapperDto)
     openfinancebilling: Querytof_response_openfinancebillingWapperDto;
}
export class Querytof_ctbody_onbehalfofDto{
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
export class Querytof_response_ctbody_openfinancebillingDto{
    @ApiProperty() 
    islargecorporate?: boolean;                      
    @ApiProperty({enum :usertype_tof_response_ctbody_openfinancebilling,enumName:"usertype",type:"string"}) 
    usertype?: usertype_tof_response_ctbody_openfinancebilling;

    @ApiProperty({enum :purpose_tof_response_ctbody_openfinancebilling,enumName:"purpose",type:"string"}) 
    purpose?: purpose_tof_response_ctbody_openfinancebilling;

}
export class Querytof_ctbody_onbehalfofWapperDto {
    @ApiProperty({ type:Querytof_ctbody_onbehalfofDto })
    @ValidateNested()
    @Type(() => Querytof_ctbody_onbehalfofDto)
    is: Querytof_ctbody_onbehalfofDto;
}
export class Querytof_response_ctbody_openfinancebillingWapperDto {
    @ApiProperty({ type:Querytof_response_ctbody_openfinancebillingDto })
    @ValidateNested()
    @Type(() => Querytof_response_ctbody_openfinancebillingDto)
    is: Querytof_response_ctbody_openfinancebillingDto;
}
export class Querytof_ctbody_dataDto{
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

    @ApiProperty({ type:Querytof_ctbody_onbehalfofWapperDto })
    @ValidateNested()
    @Type(() => Querytof_ctbody_onbehalfofWapperDto)
     onbehalfof?: Querytof_ctbody_onbehalfofWapperDto;
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

    @ApiProperty({ type:Querytof_response_ctbody_openfinancebillingWapperDto })
    @ValidateNested()
    @Type(() => Querytof_response_ctbody_openfinancebillingWapperDto)
     openfinancebilling?: Querytof_response_ctbody_openfinancebillingWapperDto;
}
export class Querytof_sub_webhookDto{
    @ApiProperty()
    @IsString()
    url: string;
    @ApiProperty() 
    isactive: boolean;                      
    @ApiProperty()
    @IsString()
    sample?: string;
}
export class Querytof_sub_webhookWapperDto {
    @ApiProperty({ type:Querytof_sub_webhookDto })
    @ValidateNested()
    @Type(() => Querytof_sub_webhookDto)
    is: Querytof_sub_webhookDto;
}
export class Querytof_subscription_consentbodyDto{
    @ApiProperty({ type:Querytof_sub_webhookWapperDto })
    @ValidateNested()
    @Type(() => Querytof_sub_webhookWapperDto)
     webhook: Querytof_sub_webhookWapperDto;
}
export class Querytof_ctbody_dataWapperDto {
    @ApiProperty({ type:Querytof_ctbody_dataDto })
    @ValidateNested()
    @Type(() => Querytof_ctbody_dataDto)
    is: Querytof_ctbody_dataDto;
}
export class Querytof_conbody_multipleauthWapperDto {
    @ApiProperty({ type:Querytof_conbody_multipleauthDto })
    @ValidateNested()
    @Type(() => Querytof_conbody_multipleauthDto)
    is: Querytof_conbody_multipleauthDto;
}
export class Querytof_subscription_consentbodyWapperDto {
    @ApiProperty({ type:Querytof_subscription_consentbodyDto })
    @ValidateNested()
    @Type(() => Querytof_subscription_consentbodyDto)
    is: Querytof_subscription_consentbodyDto;
}
export class Querytof_consentbodyDto{
    @ApiProperty({ type:Querytof_ctbody_dataWapperDto })
    @ValidateNested()
    @Type(() => Querytof_ctbody_dataWapperDto)
     data: Querytof_ctbody_dataWapperDto;
    @ApiProperty({ type:Querytof_conbody_multipleauthWapperDto })
    @ValidateNested()
    @Type(() => Querytof_conbody_multipleauthWapperDto)
     meta?: Querytof_conbody_multipleauthWapperDto;
    @ApiProperty({ type:Querytof_subscription_consentbodyWapperDto })
    @ValidateNested()
    @Type(() => Querytof_subscription_consentbodyWapperDto)
     subscription: Querytof_subscription_consentbodyWapperDto;
}
export class Querytof_reqressub_webhookDto{
    @ApiProperty()
    @IsString()
    url: string;
    @ApiProperty() 
    isactive: boolean;                      
}
export class Querytof_reqressub_webhookWapperDto {
    @ApiProperty({ type:Querytof_reqressub_webhookDto })
    @ValidateNested()
    @Type(() => Querytof_reqressub_webhookDto)
    is: Querytof_reqressub_webhookDto;
}
export class Querytof_reqressub_consentbodyDto{
    @ApiProperty({ type:Querytof_reqressub_webhookWapperDto })
    @ValidateNested()
    @Type(() => Querytof_reqressub_webhookWapperDto)
     webhook: Querytof_reqressub_webhookWapperDto;
}
export class Querytof_response_consentWapperDto {
    @ApiProperty({ type:Querytof_response_consentDto })
    @ValidateNested()
    @Type(() => Querytof_response_consentDto)
    is: Querytof_response_consentDto;
}
export class Querytof_reqressub_consentbodyWapperDto {
    @ApiProperty({ type:Querytof_reqressub_consentbodyDto })
    @ValidateNested()
    @Type(() => Querytof_reqressub_consentbodyDto)
    is: Querytof_reqressub_consentbodyDto;
}
export class Querytof_response_requestDto{
    @ApiProperty({enum :type_tof_response_request,enumName:"type",type:"string"}) 
    type?: type_tof_response_request;

    @ApiProperty({ type:Querytof_response_consentWapperDto })
    @ValidateNested()
    @Type(() => Querytof_response_consentWapperDto)
     consent: Querytof_response_consentWapperDto;
    @ApiProperty({ type:Querytof_reqressub_consentbodyWapperDto })
    @ValidateNested()
    @Type(() => Querytof_reqressub_consentbodyWapperDto)
     subscription?: Querytof_reqressub_consentbodyWapperDto;
}
export class Querytof_response_requestWapperDto {
    @ApiProperty({ type:Querytof_response_requestDto })
    @ValidateNested()
    @Type(() => Querytof_response_requestDto)
    is: Querytof_response_requestDto;
}
export class Querytof_consentbodyWapperDto {
    @ApiProperty({ type:Querytof_consentbodyDto })
    @ValidateNested()
    @Type(() => Querytof_consentbodyDto)
    is: Querytof_consentbodyDto;
}
export class Querytof_tppWapperDto {
    @ApiProperty({ type:Querytof_tppDto })
    @ValidateNested()
    @Type(() => Querytof_tppDto)
    is: Querytof_tppDto;
}
export class Querytof_response_dataDto{
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

    @ApiProperty({ type:Querytof_response_requestWapperDto })
    @ValidateNested()
    @Type(() => Querytof_response_requestWapperDto)
     request: Querytof_response_requestWapperDto;
    @ApiProperty({ type:Querytof_consentbodyWapperDto })
    @ValidateNested()
    @Type(() => Querytof_consentbodyWapperDto)
     consentbody: Querytof_consentbodyWapperDto;
    @ApiProperty()
    @IsString()
    interactionid?: string;
    @ApiProperty({ type:Querytof_tppWapperDto })
    @ValidateNested()
    @Type(() => Querytof_tppWapperDto)
     tpp?: Querytof_tppWapperDto;
    @ApiProperty()
    updatedat?: number;
}
export class Querytof_response_dataWapperDto {
    @ApiProperty({ type:Querytof_response_dataDto })
    @ValidateNested()
    @Type(() => Querytof_response_dataDto)
    is: Querytof_response_dataDto;
}
export class Querytof_consent_responseDto{
    @ApiProperty({ type:Querytof_response_dataWapperDto })
    @ValidateNested()
    @Type(() => Querytof_response_dataWapperDto)
     data: Querytof_response_dataWapperDto;
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









