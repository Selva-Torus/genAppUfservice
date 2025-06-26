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
import { tob_api_process_logs_OnlyParentEntity} from 'src/erd/tob_api_process_logs/entity/tob_api_process_logs.entity';          




















 
export enum usertype_tob_ctbody_openfinancebilling {
    Retail="Retail",
    SME="SME",
    Corporate="Corporate",
}
export enum purpose_tob_ctbody_openfinancebilling {
    AccountAggregation="AccountAggregation",
    RiskAssessment="RiskAssessment",
}
export enum authorizationstatus_tob_multiauth_totalreq {
    Pending="Pending",
    Approved="Approved",
    Rejected="Rejected",
}
export enum usertype_tob_openfinance_billing {
    Retail="Retail",
    SME="SME",
    Corporate="Corporate",
}
export enum purpose_tob_openfinance_billing {
    AccountAggregation="AccountAggregation",
    RiskAssessment="RiskAssessment",
}
export enum identifiertype_tob_request_onbehalfof {
    Other="Other",
}
export enum accounttype_tob_request_consent {
    Retail="Retail",
    SME="SME",
    Corporate="Corporate",
}
export enum accountsubtype_tob_request_consent {
    CurrentAccount="CurrentAccount",
    SavingsAccount="SavingsAccount",
}
export enum permissions_tob_request_consent {
    ReadAccountsBasic="ReadAccountsBasic",
    ReadAccountsDetails="ReadAccountsDetails",
}
export enum identifiertype_tob_ctbody_onbehalfof {
    Other="Other",
}
export enum accounttype_tob_ctbody_data {
    Retail="Retail",
    SME="SME",
    Corporate="Corporate",
}
export enum accountsubtype_tob_ctbody_data {
    Savings="Savings",
    CurrentAccount="CurrentAccount",
}
export enum status_tob_ctbody_data {
    Authorized="Authorized",
    Rejected="Rejected",
    Revoked="Revoked",
    Expired="Expired",
    Consumed="Consumed",
    Suspended="Suspended",
}
export enum purpose_tob_ctbody_data {
    Account_Aggregation="Account_Aggregation",
    Personal_Finance_Manager="Personal_Finance_Manager",
    Other="Other",
}
export enum revokedby_tob_ctbody_data {
    LFI="LFI",
    TPP="TPP",
    LFIInitiatedByUser="LFIInitiatedByUser",
    TPPInitiatedByUser="TPPInitiatedByUser",
}
export enum permissions_tob_ctbody_data {
    ReadAccountsBasic="ReadAccountsBasic",
    ReadAccountsDetail="ReadAccountsDetail",
    ReadBalances="ReadBalances",
}
export enum type_tob_consent_req {
    account_access_consent="account_access_consent",
}
export enum authorizationchannel_tob_consent_request {
    App="App",
    Web="Web",
}

export class Querytob_psuidentifiersDto{
    @ApiProperty()
    @IsString()
    userid?: string;
    @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
    tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
}
export class Querytob_ctbody_openfinancebillingDto{
    @ApiProperty() 
    islargecorporate?: boolean;                      
    @ApiProperty({enum :usertype_tob_ctbody_openfinancebilling,enumName:"usertype",type:"string"}) 
    usertype?: usertype_tob_ctbody_openfinancebilling;

    @ApiProperty({enum :purpose_tob_ctbody_openfinancebilling,enumName:"purpose",type:"string"}) 
    purpose?: purpose_tob_ctbody_openfinancebilling;

    @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
    tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
}
export class Querytob_multiauth_totalreqDto{
    @ApiProperty()
    @IsString()
    authorizerid?: string;
    @ApiProperty()
    @IsString()
    authorizertype?: string;
    @ApiProperty({ type: 'string', format: 'date-time' })
    authorizationdate?: Date;
    @ApiProperty({enum :authorizationstatus_tob_multiauth_totalreq,enumName:"authorizationstatus",type:"string"}) 
    authorizationstatus?: authorizationstatus_tob_multiauth_totalreq;

    @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
    tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
}
export class Querytob_multiauth_totalreqWapperDto {

    @ApiProperty({ type:Querytob_multiauth_totalreqDto })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Querytob_multiauth_totalreqWapperDto)
    some: Querytob_multiauth_totalreqDto;
}
export class Querytob_multiauthDto{
    @ApiProperty()
    totalrequired?: number;

    @ApiProperty({ type:Querytob_multiauth_totalreqWapperDto })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Querytob_multiauth_totalreqWapperDto)
     authorizations?: Querytob_multiauth_totalreqWapperDto[];
    @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
    tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
}
export class Querytob_multiauthWapperDto {
    @ApiProperty({ type:Querytob_multiauthDto })
    @ValidateNested()
    @Type(() => Querytob_multiauthDto)
    is: Querytob_multiauthDto;
}
export class Querytob_conbody_multipleauthDto{
    @ApiProperty({ type:Querytob_multiauthWapperDto })
    @ValidateNested()
    @Type(() => Querytob_multiauthWapperDto)
     multipleauthorizers?: Querytob_multiauthWapperDto;
    @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
    tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
}
export class Querytob_decodedssaDto{
    @ApiProperty() 
    redirect_uris: String[];                      
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
    roles: String[];                      
    @ApiProperty()
    @IsString()
    sector_identifier_uri?: string;
    @ApiProperty()
    @IsString()
    application_type?: string;
    @ApiProperty()
    @IsString()
    organisation_id?: string;
    @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
    tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
}
export class Querytob_decodedssaWapperDto {
    @ApiProperty({ type:Querytob_decodedssaDto })
    @ValidateNested()
    @Type(() => Querytob_decodedssaDto)
    is: Querytob_decodedssaDto;
}
export class Querytob_tppDto{
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
    @IsString()
    softwarestatementid?: string;
    @ApiProperty()
    @IsString()
    directoryrecord?: string;
    @ApiProperty({ type:Querytob_decodedssaWapperDto })
    @ValidateNested()
    @Type(() => Querytob_decodedssaWapperDto)
     decodedssa?: Querytob_decodedssaWapperDto;
    @ApiProperty()
    @IsString()
    orgid?: string;
    @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
    tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
}
export class Querytob_openfinance_billingDto{
    @ApiProperty({enum :usertype_tob_openfinance_billing,enumName:"usertype",type:"string"}) 
    usertype?: usertype_tob_openfinance_billing;

    @ApiProperty({enum :purpose_tob_openfinance_billing,enumName:"purpose",type:"string"}) 
    purpose?: purpose_tob_openfinance_billing;

    @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
    tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
}
export class Querytob_request_onbehalfofDto{
    @ApiProperty()
    @IsString()
    tradingname?: string;
    @ApiProperty()
    @IsString()
    legalname?: string;
    @ApiProperty({enum :identifiertype_tob_request_onbehalfof,enumName:"identifiertype",type:"string"}) 
    identifiertype?: identifiertype_tob_request_onbehalfof;

    @ApiProperty()
    @IsString()
    identifier?: string;
    @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
    tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
}
export class Querytob_request_onbehalfofWapperDto {
    @ApiProperty({ type:Querytob_request_onbehalfofDto })
    @ValidateNested()
    @Type(() => Querytob_request_onbehalfofDto)
    is: Querytob_request_onbehalfofDto;
}
export class Querytob_openfinance_billingWapperDto {
    @ApiProperty({ type:Querytob_openfinance_billingDto })
    @ValidateNested()
    @Type(() => Querytob_openfinance_billingDto)
    is: Querytob_openfinance_billingDto;
}
export class Querytob_request_consentDto{
    @ApiProperty()
    @IsString()
    baseconsentid?: string;
    @ApiProperty({ type: 'string', format: 'date-time' })
    expirationdatetime?: Date;
    @ApiProperty({ type: 'string', format: 'date-time' })
    transactionfromdatetime?: Date;
    @ApiProperty({ type: 'string', format: 'date-time' })
    transactiontodatetime?: Date;
    @ApiProperty({enum :accounttype_tob_request_consent,isArray: true}) 
    accounttype?: accounttype_tob_request_consent[];

    @ApiProperty({enum :accountsubtype_tob_request_consent,isArray: true}) 
    accountsubtype?: accountsubtype_tob_request_consent[];

    @ApiProperty({ type:Querytob_request_onbehalfofWapperDto })
    @ValidateNested()
    @Type(() => Querytob_request_onbehalfofWapperDto)
     onbehalfof?: Querytob_request_onbehalfofWapperDto;
    @ApiProperty()
    @IsString()
    consentid?: string;
    @ApiProperty({enum :permissions_tob_request_consent,isArray: true}) 
    permissions?: permissions_tob_request_consent[];

    @ApiProperty({ type:Querytob_openfinance_billingWapperDto })
    @ValidateNested()
    @Type(() => Querytob_openfinance_billingWapperDto)
     openfinancebilling?: Querytob_openfinance_billingWapperDto;
    @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
    tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
}
export class Querytob_ctbody_onbehalfofDto{
    @ApiProperty()
    @IsString()
    tradingname?: string;
    @ApiProperty()
    @IsString()
    legalname?: string;
    @ApiProperty({enum :identifiertype_tob_ctbody_onbehalfof,enumName:"identifiertype",type:"string"}) 
    identifiertype?: identifiertype_tob_ctbody_onbehalfof;

    @ApiProperty()
    @IsString()
    identifier?: string;
    @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
    tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
}
export class Querytob_ctbody_onbehalfofWapperDto {
    @ApiProperty({ type:Querytob_ctbody_onbehalfofDto })
    @ValidateNested()
    @Type(() => Querytob_ctbody_onbehalfofDto)
    is: Querytob_ctbody_onbehalfofDto;
}
export class Querytob_ctbody_openfinancebillingWapperDto {
    @ApiProperty({ type:Querytob_ctbody_openfinancebillingDto })
    @ValidateNested()
    @Type(() => Querytob_ctbody_openfinancebillingDto)
    is: Querytob_ctbody_openfinancebillingDto;
}
export class Querytob_ctbody_dataDto{
    @ApiProperty()
    @IsString()
    baseconsentid?: string;
    @ApiProperty()
    @IsString()
    expirationdatetime?: string;
    @ApiProperty()
    @IsString()
    transactionfromdatetime?: string;
    @ApiProperty()
    @IsString()
    transactiontodatetime?: string;
    @ApiProperty({enum :accounttype_tob_ctbody_data,isArray: true}) 
    accounttype?: accounttype_tob_ctbody_data[];

    @ApiProperty({enum :accountsubtype_tob_ctbody_data,isArray: true}) 
    accountsubtype?: accountsubtype_tob_ctbody_data[];

    @ApiProperty({ type:Querytob_ctbody_onbehalfofWapperDto })
    @ValidateNested()
    @Type(() => Querytob_ctbody_onbehalfofWapperDto)
     onbehalfof?: Querytob_ctbody_onbehalfofWapperDto;
    @ApiProperty({enum :status_tob_ctbody_data,enumName:"status",type:"string"}) 
    status?: status_tob_ctbody_data;

    @ApiProperty({enum :purpose_tob_ctbody_data,isArray: true}) 
    purpose?: purpose_tob_ctbody_data[];

    @ApiProperty({enum :revokedby_tob_ctbody_data,enumName:"revokedby",type:"string"}) 
    revokedby?: revokedby_tob_ctbody_data;

    @ApiProperty({ type:Querytob_ctbody_openfinancebillingWapperDto })
    @ValidateNested()
    @Type(() => Querytob_ctbody_openfinancebillingWapperDto)
     openfinancebilling?: Querytob_ctbody_openfinancebillingWapperDto;
    @ApiProperty()
    @IsString()
    creationdatetime?: string;
    @ApiProperty()
    @IsString()
    consentid?: string;
    @ApiProperty({enum :permissions_tob_ctbody_data,isArray: true}) 
    permissions?: permissions_tob_ctbody_data[];

    @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
    tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
}
export class Querytob_sub_webhookDto{
    @ApiProperty()
    @IsString()
    url?: string;
    @ApiProperty() 
    isactive?: boolean;                      
    @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
    tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
}
export class Querytob_sub_webhookWapperDto {
    @ApiProperty({ type:Querytob_sub_webhookDto })
    @ValidateNested()
    @Type(() => Querytob_sub_webhookDto)
    is: Querytob_sub_webhookDto;
}
export class Querytob_subscription_consentbodyDto{
    @ApiProperty({ type:Querytob_sub_webhookWapperDto })
    @ValidateNested()
    @Type(() => Querytob_sub_webhookWapperDto)
     webhook?: Querytob_sub_webhookWapperDto;
    @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
    tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
}
export class Querytob_ctbody_dataWapperDto {
    @ApiProperty({ type:Querytob_ctbody_dataDto })
    @ValidateNested()
    @Type(() => Querytob_ctbody_dataDto)
    is: Querytob_ctbody_dataDto;
}
export class Querytob_conbody_multipleauthWapperDto {
    @ApiProperty({ type:Querytob_conbody_multipleauthDto })
    @ValidateNested()
    @Type(() => Querytob_conbody_multipleauthDto)
    is: Querytob_conbody_multipleauthDto;
}
export class Querytob_subscription_consentbodyWapperDto {
    @ApiProperty({ type:Querytob_subscription_consentbodyDto })
    @ValidateNested()
    @Type(() => Querytob_subscription_consentbodyDto)
    is: Querytob_subscription_consentbodyDto;
}
export class Querytob_consentbodyDto{
    @ApiProperty({ type:Querytob_ctbody_dataWapperDto })
    @ValidateNested()
    @Type(() => Querytob_ctbody_dataWapperDto)
     data?: Querytob_ctbody_dataWapperDto;
    @ApiProperty({ type:Querytob_conbody_multipleauthWapperDto })
    @ValidateNested()
    @Type(() => Querytob_conbody_multipleauthWapperDto)
     meta?: Querytob_conbody_multipleauthWapperDto;
    @ApiProperty({ type:Querytob_subscription_consentbodyWapperDto })
    @ValidateNested()
    @Type(() => Querytob_subscription_consentbodyWapperDto)
     subscription?: Querytob_subscription_consentbodyWapperDto;
    @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
    tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
}
export class Querytob_subscription_webhookDto{
    @ApiProperty()
    @IsString()
    url?: string;
    @ApiProperty() 
    isactive?: boolean;                      
    @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
    tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
}
export class Querytob_subscription_webhookWapperDto {
    @ApiProperty({ type:Querytob_subscription_webhookDto })
    @ValidateNested()
    @Type(() => Querytob_subscription_webhookDto)
    is: Querytob_subscription_webhookDto;
}
export class Querytob_subscription_consentreqDto{
    @ApiProperty({ type:Querytob_subscription_webhookWapperDto })
    @ValidateNested()
    @Type(() => Querytob_subscription_webhookWapperDto)
     webhook?: Querytob_subscription_webhookWapperDto;
    @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
    tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
}
export class Querytob_request_consentWapperDto {
    @ApiProperty({ type:Querytob_request_consentDto })
    @ValidateNested()
    @Type(() => Querytob_request_consentDto)
    is: Querytob_request_consentDto;
}
export class Querytob_subscription_consentreqWapperDto {
    @ApiProperty({ type:Querytob_subscription_consentreqDto })
    @ValidateNested()
    @Type(() => Querytob_subscription_consentreqDto)
    is: Querytob_subscription_consentreqDto;
}
export class Querytob_consent_reqDto{
    @ApiProperty({enum :type_tob_consent_req,enumName:"type",type:"string"}) 
    type?: type_tob_consent_req;

    @ApiProperty({ type:Querytob_request_consentWapperDto })
    @ValidateNested()
    @Type(() => Querytob_request_consentWapperDto)
     consent?: Querytob_request_consentWapperDto;
    @ApiProperty({ type:Querytob_subscription_consentreqWapperDto })
    @ValidateNested()
    @Type(() => Querytob_subscription_consentreqWapperDto)
     subscription?: Querytob_subscription_consentreqWapperDto;
    @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
    tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
}
export class Querytob_consent_reqWapperDto {
    @ApiProperty({ type:Querytob_consent_reqDto })
    @ValidateNested()
    @Type(() => Querytob_consent_reqDto)
    is: Querytob_consent_reqDto;
}
export class Querytob_consentbodyWapperDto {
    @ApiProperty({ type:Querytob_consentbodyDto })
    @ValidateNested()
    @Type(() => Querytob_consentbodyDto)
    is: Querytob_consentbodyDto;
}
export class Querytob_tppWapperDto {
    @ApiProperty({ type:Querytob_tppDto })
    @ValidateNested()
    @Type(() => Querytob_tppDto)
    is: Querytob_tppDto;
}
export class Querytob_psuidentifiersWapperDto {
    @ApiProperty({ type:Querytob_psuidentifiersDto })
    @ValidateNested()
    @Type(() => Querytob_psuidentifiersDto)
    is: Querytob_psuidentifiersDto;
}
export class Querytob_consent_requestDto{
    @ApiProperty()
    @IsString()
    ids?: string;
    @ApiProperty()
    @IsString()
    consentgroupid?: string;
    @ApiProperty()
    @IsString()
    requesturl?: string;
    @ApiProperty()
    @IsString()
    consenttype?: string;
    @ApiProperty()
    @IsString()
    status?: string;
    @ApiProperty({ type:Querytob_consent_reqWapperDto })
    @ValidateNested()
    @Type(() => Querytob_consent_reqWapperDto)
     request?: Querytob_consent_reqWapperDto;
    @ApiProperty({ type:Querytob_consentbodyWapperDto })
    @ValidateNested()
    @Type(() => Querytob_consentbodyWapperDto)
     consentbody?: Querytob_consentbodyWapperDto;
    @ApiProperty({enum :authorizationchannel_tob_consent_request,enumName:"authorizationchannel",type:"string"}) 
    authorizationchannel?: authorizationchannel_tob_consent_request;

    @ApiProperty()
    @IsString()
    interactionid?: string;
    @ApiProperty({ type:Querytob_tppWapperDto })
    @ValidateNested()
    @Type(() => Querytob_tppWapperDto)
     tpp?: Querytob_tppWapperDto;
    @ApiProperty()
    updatedat?: number;
    @ApiProperty()
    @IsString()
    parid?: string;
    @ApiProperty()
    @IsString()
    rartype?: string;
    @ApiProperty()
    @IsString()
    standardversion?: string;
    @ApiProperty({ type:Querytob_psuidentifiersWapperDto })
    @ValidateNested()
    @Type(() => Querytob_psuidentifiersWapperDto)
     psuidentifiers?: Querytob_psuidentifiersWapperDto;
    @ApiProperty() 
    accountids: String[];                      
    @ApiProperty()
    @IsString()
    connecttoken?: string;
    @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
    tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
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









