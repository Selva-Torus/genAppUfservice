import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { tob_api_process_logs_OnlyParentEntity} from 'src/erd/tob_api_process_logs/entity/tob_api_process_logs.entity';          



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


export class  Updatetob_psuidentifiersDto {
        @ApiProperty()
        userid?: string;
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               

}

export class  Updatetob_ctbody_openfinancebillingDto {
        @ApiProperty()
        islargecorporate?: boolean;
        @ApiProperty({enum :usertype_tob_ctbody_openfinancebilling,enumName:"usertype",type:"string"})  
        usertype? : usertype_tob_ctbody_openfinancebilling
        @ApiProperty({enum :purpose_tob_ctbody_openfinancebilling,enumName:"purpose",type:"string"})  
        purpose? : purpose_tob_ctbody_openfinancebilling
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               

}

export class  Updatetob_multiauth_totalreqDto {
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

export class  Updatetob_multiauthDto {
        @ApiProperty({
            type: `integer`,
            format: `int32`,
        })
        totalrequired?: number;
        @ApiProperty({type : [Updatetob_multiauth_totalreqDto]})
        @Type(() => Updatetob_multiauth_totalreqDto)
        authorizations? : Updatetob_multiauth_totalreqDto[]
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               

}

export class  Updatetob_conbody_multipleauthDto {
        @ApiProperty({type : Updatetob_multiauthDto}) 
        @Type(() => Updatetob_multiauthDto) 
        multipleauthorizers? : Updatetob_multiauthDto
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               

}

export class  Updatetob_decodedssaDto {
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
        sector_identifier_uri?: string;
        @ApiProperty()
        application_type?: string;
        @ApiProperty()
        organisation_id?: string;
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               

}

export class  Updatetob_tppDto {
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
        @ApiProperty({type : Updatetob_decodedssaDto}) 
        @Type(() => Updatetob_decodedssaDto) 
        decodedssa? : Updatetob_decodedssaDto
        @ApiProperty()
        orgid?: string;
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               

}

export class  Updatetob_openfinance_billingDto {
        @ApiProperty({enum :usertype_tob_openfinance_billing,enumName:"usertype",type:"string"})  
        usertype? : usertype_tob_openfinance_billing
        @ApiProperty({enum :purpose_tob_openfinance_billing,enumName:"purpose",type:"string"})  
        purpose? : purpose_tob_openfinance_billing
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               

}

export class  Updatetob_request_onbehalfofDto {
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

export class  Updatetob_request_consentDto {
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
        @ApiProperty({type : Updatetob_request_onbehalfofDto}) 
        @Type(() => Updatetob_request_onbehalfofDto) 
        onbehalfof? : Updatetob_request_onbehalfofDto
        @ApiProperty()
        consentid?: string;
        @ApiProperty({enum :permissions_tob_request_consent,isArray: true}) 
        permissions? : permissions_tob_request_consent
        @ApiProperty({type : Updatetob_openfinance_billingDto}) 
        @Type(() => Updatetob_openfinance_billingDto) 
        openfinancebilling? : Updatetob_openfinance_billingDto
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               

}

export class  Updatetob_ctbody_onbehalfofDto {
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

export class  Updatetob_ctbody_dataDto {
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
        @ApiProperty({type : Updatetob_ctbody_onbehalfofDto}) 
        @Type(() => Updatetob_ctbody_onbehalfofDto) 
        onbehalfof? : Updatetob_ctbody_onbehalfofDto
        @ApiProperty({enum :status_tob_ctbody_data,enumName:"status",type:"string"})  
        status? : status_tob_ctbody_data
        @ApiProperty({enum :purpose_tob_ctbody_data,isArray: true}) 
        purpose? : purpose_tob_ctbody_data
        @ApiProperty({enum :revokedby_tob_ctbody_data,enumName:"revokedby",type:"string"})  
        revokedby? : revokedby_tob_ctbody_data
        @ApiProperty({type : Updatetob_ctbody_openfinancebillingDto}) 
        @Type(() => Updatetob_ctbody_openfinancebillingDto) 
        openfinancebilling? : Updatetob_ctbody_openfinancebillingDto
        @ApiProperty()
        creationdatetime?: string;
        @ApiProperty()
        consentid?: string;
        @ApiProperty({enum :permissions_tob_ctbody_data,isArray: true}) 
        permissions? : permissions_tob_ctbody_data
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               

}

export class  Updatetob_sub_webhookDto {
        @ApiProperty()
        url?: string;
        @ApiProperty()
        isactive?: boolean;
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               

}

export class  Updatetob_subscription_consentbodyDto {
        @ApiProperty({type : Updatetob_sub_webhookDto}) 
        @Type(() => Updatetob_sub_webhookDto) 
        webhook? : Updatetob_sub_webhookDto
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               

}

export class  Updatetob_consentbodyDto {
        @ApiProperty({type : Updatetob_ctbody_dataDto}) 
        @Type(() => Updatetob_ctbody_dataDto) 
        data? : Updatetob_ctbody_dataDto
        @ApiProperty({type : Updatetob_conbody_multipleauthDto}) 
        @Type(() => Updatetob_conbody_multipleauthDto) 
        meta? : Updatetob_conbody_multipleauthDto
        @ApiProperty({type : Updatetob_subscription_consentbodyDto}) 
        @Type(() => Updatetob_subscription_consentbodyDto) 
        subscription? : Updatetob_subscription_consentbodyDto
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               

}

export class  Updatetob_subscription_webhookDto {
        @ApiProperty()
        url?: string;
        @ApiProperty()
        isactive?: boolean;
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               

}

export class  Updatetob_subscription_consentreqDto {
        @ApiProperty({type : Updatetob_subscription_webhookDto}) 
        @Type(() => Updatetob_subscription_webhookDto) 
        webhook? : Updatetob_subscription_webhookDto
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               

}

export class  Updatetob_consent_reqDto {
        @ApiProperty({enum :type_tob_consent_req,enumName:"type",type:"string"})  
        type? : type_tob_consent_req
        @ApiProperty({type : Updatetob_request_consentDto}) 
        @Type(() => Updatetob_request_consentDto) 
        consent? : Updatetob_request_consentDto
        @ApiProperty({type : Updatetob_subscription_consentreqDto}) 
        @Type(() => Updatetob_subscription_consentreqDto) 
        subscription? : Updatetob_subscription_consentreqDto
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               

}

export class  Updatetob_consent_requestDto {
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
        @ApiProperty({type : Updatetob_consent_reqDto}) 
        @Type(() => Updatetob_consent_reqDto) 
        request? : Updatetob_consent_reqDto
        @ApiProperty({type : Updatetob_consentbodyDto}) 
        @Type(() => Updatetob_consentbodyDto) 
        consentbody? : Updatetob_consentbodyDto
        @ApiProperty({enum :authorizationchannel_tob_consent_request,enumName:"authorizationchannel",type:"string"})  
        authorizationchannel? : authorizationchannel_tob_consent_request
        @ApiProperty()
        interactionid?: string;
        @ApiProperty({type : Updatetob_tppDto}) 
        @Type(() => Updatetob_tppDto) 
        tpp? : Updatetob_tppDto
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
        @ApiProperty({type : Updatetob_psuidentifiersDto}) 
        @Type(() => Updatetob_psuidentifiersDto) 
        psuidentifiers? : Updatetob_psuidentifiersDto
        @ApiProperty()
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




