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

export class Createtob_psuidentifiersDto{
    @ApiProperty()
    @IsString()
    userid?: string;
    @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
    tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
}
export class Createtob_ctbody_openfinancebillingDto{
    @ApiProperty() 
    islargecorporate?: boolean;                      
    @ApiProperty({enum :usertype_tob_ctbody_openfinancebilling,enumName:"usertype",type:"string"}) 
    usertype?: usertype_tob_ctbody_openfinancebilling;

    @ApiProperty({enum :purpose_tob_ctbody_openfinancebilling,enumName:"purpose",type:"string"}) 
    purpose?: purpose_tob_ctbody_openfinancebilling;

    @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
    tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
}
export class Createtob_multiauth_totalreqDto{
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
export class Createtob_multiauthDto{
    @ApiProperty()
    totalrequired?: number;

    @ApiProperty({ type:[Createtob_multiauth_totalreqDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Createtob_multiauth_totalreqDto)
    authorizations?: Createtob_multiauth_totalreqDto[];
    @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
    tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
}
export class Createtob_conbody_multipleauthDto{
    @ApiProperty({ type:Createtob_multiauthDto })
    @ValidateNested()
    @Type(() => Createtob_multiauthDto)
    multipleauthorizers?: Createtob_multiauthDto;
    @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
    tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
}
export class Createtob_decodedssaDto{
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
export class Createtob_tppDto{
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
    @ApiProperty({ type:Createtob_decodedssaDto })
    @ValidateNested()
    @Type(() => Createtob_decodedssaDto)
    decodedssa?: Createtob_decodedssaDto;
    @ApiProperty()
    @IsString()
    orgid?: string;
    @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
    tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
}
export class Createtob_openfinance_billingDto{
    @ApiProperty({enum :usertype_tob_openfinance_billing,enumName:"usertype",type:"string"}) 
    usertype?: usertype_tob_openfinance_billing;

    @ApiProperty({enum :purpose_tob_openfinance_billing,enumName:"purpose",type:"string"}) 
    purpose?: purpose_tob_openfinance_billing;

    @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
    tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
}
export class Createtob_request_onbehalfofDto{
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
export class Createtob_request_consentDto{
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

    @ApiProperty({ type:Createtob_request_onbehalfofDto })
    @ValidateNested()
    @Type(() => Createtob_request_onbehalfofDto)
    onbehalfof?: Createtob_request_onbehalfofDto;
    @ApiProperty()
    @IsString()
    consentid?: string;
    @ApiProperty({enum :permissions_tob_request_consent,isArray: true}) 
    permissions?: permissions_tob_request_consent[];

    @ApiProperty({ type:Createtob_openfinance_billingDto })
    @ValidateNested()
    @Type(() => Createtob_openfinance_billingDto)
    openfinancebilling?: Createtob_openfinance_billingDto;
    @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
    tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
}
export class Createtob_ctbody_onbehalfofDto{
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
export class Createtob_ctbody_dataDto{
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

    @ApiProperty({ type:Createtob_ctbody_onbehalfofDto })
    @ValidateNested()
    @Type(() => Createtob_ctbody_onbehalfofDto)
    onbehalfof?: Createtob_ctbody_onbehalfofDto;
    @ApiProperty({enum :status_tob_ctbody_data,enumName:"status",type:"string"}) 
    status?: status_tob_ctbody_data;

    @ApiProperty({enum :purpose_tob_ctbody_data,isArray: true}) 
    purpose?: purpose_tob_ctbody_data[];

    @ApiProperty({enum :revokedby_tob_ctbody_data,enumName:"revokedby",type:"string"}) 
    revokedby?: revokedby_tob_ctbody_data;

    @ApiProperty({ type:Createtob_ctbody_openfinancebillingDto })
    @ValidateNested()
    @Type(() => Createtob_ctbody_openfinancebillingDto)
    openfinancebilling?: Createtob_ctbody_openfinancebillingDto;
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
export class Createtob_sub_webhookDto{
    @ApiProperty()
    @IsString()
    url?: string;
    @ApiProperty() 
    isactive?: boolean;                      
    @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
    tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
}
export class Createtob_subscription_consentbodyDto{
    @ApiProperty({ type:Createtob_sub_webhookDto })
    @ValidateNested()
    @Type(() => Createtob_sub_webhookDto)
    webhook?: Createtob_sub_webhookDto;
    @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
    tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
}
export class Createtob_consentbodyDto{
    @ApiProperty({ type:Createtob_ctbody_dataDto })
    @ValidateNested()
    @Type(() => Createtob_ctbody_dataDto)
    data?: Createtob_ctbody_dataDto;
    @ApiProperty({ type:Createtob_conbody_multipleauthDto })
    @ValidateNested()
    @Type(() => Createtob_conbody_multipleauthDto)
    meta?: Createtob_conbody_multipleauthDto;
    @ApiProperty({ type:Createtob_subscription_consentbodyDto })
    @ValidateNested()
    @Type(() => Createtob_subscription_consentbodyDto)
    subscription?: Createtob_subscription_consentbodyDto;
    @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
    tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
}
export class Createtob_subscription_webhookDto{
    @ApiProperty()
    @IsString()
    url?: string;
    @ApiProperty() 
    isactive?: boolean;                      
    @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
    tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
}
export class Createtob_subscription_consentreqDto{
    @ApiProperty({ type:Createtob_subscription_webhookDto })
    @ValidateNested()
    @Type(() => Createtob_subscription_webhookDto)
    webhook?: Createtob_subscription_webhookDto;
    @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
    tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
}
export class Createtob_consent_reqDto{
    @ApiProperty({enum :type_tob_consent_req,enumName:"type",type:"string"}) 
    type?: type_tob_consent_req;

    @ApiProperty({ type:Createtob_request_consentDto })
    @ValidateNested()
    @Type(() => Createtob_request_consentDto)
    consent?: Createtob_request_consentDto;
    @ApiProperty({ type:Createtob_subscription_consentreqDto })
    @ValidateNested()
    @Type(() => Createtob_subscription_consentreqDto)
    subscription?: Createtob_subscription_consentreqDto;
    @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
    tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
}
export class Createtob_consent_requestDto{
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
    @ApiProperty({ type:Createtob_consent_reqDto })
    @ValidateNested()
    @Type(() => Createtob_consent_reqDto)
    request?: Createtob_consent_reqDto;
    @ApiProperty({ type:Createtob_consentbodyDto })
    @ValidateNested()
    @Type(() => Createtob_consentbodyDto)
    consentbody?: Createtob_consentbodyDto;
    @ApiProperty({enum :authorizationchannel_tob_consent_request,enumName:"authorizationchannel",type:"string"}) 
    authorizationchannel?: authorizationchannel_tob_consent_request;

    @ApiProperty()
    @IsString()
    interactionid?: string;
    @ApiProperty({ type:Createtob_tppDto })
    @ValidateNested()
    @Type(() => Createtob_tppDto)
    tpp?: Createtob_tppDto;
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
    @ApiProperty({ type:Createtob_psuidentifiersDto })
    @ValidateNested()
    @Type(() => Createtob_psuidentifiersDto)
    psuidentifiers?: Createtob_psuidentifiersDto;
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







