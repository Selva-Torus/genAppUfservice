import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';



export enum authorizationstatus_tof_multiauth_totalreq{
Pending="Pending",
Approved="Approved",
Rejected="Rejected",
}
export enum usertype_tof_response_openfinancebilling{
Retail="Retail",
SME="SME",
Corporate="Corporate",
}
export enum purpose_tof_response_openfinancebilling{
AccountAggregation="AccountAggregation",
RiskAssessment="RiskAssessment",
Onboarding="Onboarding",
Verification="Verification",
QuoteComparison="QuoteComparison",
BudgetingAnalysis="BudgetingAnalysis",
FinancialAdvice="FinancialAdvice",
AuditReconciliation="AuditReconciliation",
}
export enum identifiertype_tof_response_onbehalfof{
Other="Other",
}
export enum accounttype_tof_response_consent{
Retail="Retail",
SME="SME",
Corporate="Corporate",
}
export enum accountsubtype_tof_response_consent{
CurrentAccount="CurrentAccount",
}
export enum permissions_tof_response_consent{
ReadAccountsBasic="ReadAccountsBasic",
ReadAccountsDetail="ReadAccountsDetail",
ReadBalances="ReadBalances",
ReadBeneficiariesBasic="ReadBeneficiariesBasic",
ReadParty="ReadParty",
}
export enum identifiertype_tof_ctbody_onbehalfof{
Other="Other",
}
export enum usertype_tof_response_ctbody_openfinancebilling{
Retail="Retail",
SME="SME",
Corporate="Corporate",
}
export enum purpose_tof_response_ctbody_openfinancebilling{
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
export enum accounttype_tof_ctbody_data{
Retail="Retail",
SME="SME",
Corporate="Corporate",
}
export enum accountsubtype_tof_ctbody_data{
Savings="Savings",
CurrentAccount="CurrentAccount",
}
export enum status_tof_ctbody_data{
Authorized="Authorized",
Rejected="Rejected",
Revoked="Revoked",
Expired="Expired",
Consumed="Consumed",
Suspended="Suspended",
}
export enum revokedby_tof_ctbody_data{
LFI="LFI",
TPP="TPP",
LFIInitiatedByUser="LFIInitiatedByUser",
TPPInitiatedByUser="TPPInitiatedByUser",
}
export enum permissions_tof_ctbody_data{
ReadAccountsBasic="ReadAccountsBasic",
ReadAccountsDetail="ReadAccountsDetail",
ReadBalances="ReadBalances",
ReadBeneficiariesBasic="ReadBeneficiariesBasic",
ReadParty="ReadParty",
}
export enum type_tof_response_request{
account_access_consent="account_access_consent",
}
export enum status_tof_response_data{
Authorized="Authorized",
Rejected="Rejected",
Revoked="Revoked",
Expired="Expired",
Consumed="Consumed",
Suspended="Suspended",
}


export class  Updatetof_multiauth_totalreqDto {
        @ApiProperty()
        authorizerid?: string;
        @ApiProperty()
        authorizertype?: string;
        @ApiProperty({
            type: `string`,
            format: `date-time`,
        })
        authorizationdate?: Date;
        @ApiProperty({enum :authorizationstatus_tof_multiauth_totalreq,isArray: true}) 
        authorizationstatus? : authorizationstatus_tof_multiauth_totalreq

}

export class  Updatetof_multiauthDto {
        @ApiProperty({
            type: `integer`,
            format: `int32`,
        })
        totalrequired?: number;
        @ApiProperty({type : Updatetof_multiauth_totalreqDto}) 
        @Type(() => Updatetof_multiauth_totalreqDto) 
        authorizations? : Updatetof_multiauth_totalreqDto

}

export class  Updatetof_conbody_multipleauthDto {
        @ApiProperty({type : Updatetof_multiauthDto}) 
        @Type(() => Updatetof_multiauthDto) 
        multipleauthorizers? : Updatetof_multiauthDto

}

export class  Updatetof_decodedssaDto {
        @ApiProperty()
        redirect_uris?: string;
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
        roles?: string;
        @ApiProperty()
        sector_identifier_uri?: string;
        @ApiProperty()
        application_type?: string;
        @ApiProperty()
        organisation_id?: string;

}

export class  Updatetof_tppDto {
        @ApiProperty()
        clientid?: string;
        @ApiProperty()
        tppid?: string;
        @ApiProperty()
        tppname?: string;
        @ApiProperty({
            type: `integer`,
            format: `int32`,
        })
        softwarestatementid?: number;
        @ApiProperty()
        directoryrecord?: string;
        @ApiProperty({type : Updatetof_decodedssaDto}) 
        @Type(() => Updatetof_decodedssaDto) 
        decodedssa? : Updatetof_decodedssaDto
        @ApiProperty()
        orgid?: string;

}

export class  Updatetof_response_openfinancebillingDto {
        @ApiProperty({enum :usertype_tof_response_openfinancebilling,enumName:"usertype",type:"string"})  
        usertype? : usertype_tof_response_openfinancebilling
        @ApiProperty({enum :purpose_tof_response_openfinancebilling,enumName:"purpose",type:"string"})  
        purpose? : purpose_tof_response_openfinancebilling

}

export class  Updatetof_response_onbehalfofDto {
        @ApiProperty()
        tradingname?: string;
        @ApiProperty()
        legalname?: string;
        @ApiProperty({enum :identifiertype_tof_response_onbehalfof,enumName:"identifiertype",type:"string"})  
        identifiertype? : identifiertype_tof_response_onbehalfof
        @ApiProperty()
        identifier?: string;

}

export class  Updatetof_response_consentDto {
        @ApiProperty()
        baseconsentid?: string;
        @ApiProperty()
        expirationdatetime?: string;
        @ApiProperty()
        transactionfromdatetime?: string;
        @ApiProperty()
        transactiontodatetime?: string;
        @ApiProperty({enum :accounttype_tof_response_consent,isArray: true}) 
        accounttype? : accounttype_tof_response_consent
        @ApiProperty({enum :accountsubtype_tof_response_consent,isArray: true}) 
        accountsubtype? : accountsubtype_tof_response_consent
        @ApiProperty({type : Updatetof_response_onbehalfofDto}) 
        @Type(() => Updatetof_response_onbehalfofDto) 
        onbehalfof? : Updatetof_response_onbehalfofDto
        @ApiProperty()
        consentid?: string;
        @ApiProperty({enum :permissions_tof_response_consent,isArray: true}) 
        permissions? : permissions_tof_response_consent
        @ApiProperty({type : Updatetof_response_openfinancebillingDto}) 
        @Type(() => Updatetof_response_openfinancebillingDto) 
        openfinancebilling? : Updatetof_response_openfinancebillingDto

}

export class  Updatetof_ctbody_onbehalfofDto {
        @ApiProperty()
        tradingname?: string;
        @ApiProperty()
        legalname?: string;
        @ApiProperty({enum :identifiertype_tof_ctbody_onbehalfof,enumName:"identifiertype",type:"string"})  
        identifiertype? : identifiertype_tof_ctbody_onbehalfof
        @ApiProperty()
        identifier?: string;

}

export class  Updatetof_response_ctbody_openfinancebillingDto {
        @ApiProperty()
        islargecorporate?: boolean;
        @ApiProperty({enum :usertype_tof_response_ctbody_openfinancebilling,enumName:"usertype",type:"string"})  
        usertype? : usertype_tof_response_ctbody_openfinancebilling
        @ApiProperty({enum :purpose_tof_response_ctbody_openfinancebilling,enumName:"purpose",type:"string"})  
        purpose? : purpose_tof_response_ctbody_openfinancebilling

}

export class  Updatetof_ctbody_dataDto {
        @ApiProperty()
        baseconsentid?: string;
        @ApiProperty()
        expirationdatetime?: string;
        @ApiProperty()
        transactionfromdatetime?: string;
        @ApiProperty()
        transactiontodatetime?: string;
        @ApiProperty({enum :accounttype_tof_ctbody_data,isArray: true}) 
        accounttype? : accounttype_tof_ctbody_data
        @ApiProperty({enum :accountsubtype_tof_ctbody_data,isArray: true}) 
        accountsubtype? : accountsubtype_tof_ctbody_data
        @ApiProperty({type : Updatetof_ctbody_onbehalfofDto}) 
        @Type(() => Updatetof_ctbody_onbehalfofDto) 
        onbehalfof? : Updatetof_ctbody_onbehalfofDto
        @ApiProperty({enum :status_tof_ctbody_data,isArray: true}) 
        status? : status_tof_ctbody_data
        @ApiProperty({enum :revokedby_tof_ctbody_data,isArray: true}) 
        revokedby? : revokedby_tof_ctbody_data
        @ApiProperty()
        creationdatetime?: string;
        @ApiProperty()
        consentid?: string;
        @ApiProperty({enum :permissions_tof_ctbody_data,isArray: true}) 
        permissions? : permissions_tof_ctbody_data
        @ApiProperty({type : Updatetof_response_ctbody_openfinancebillingDto}) 
        @Type(() => Updatetof_response_ctbody_openfinancebillingDto) 
        openfinancebilling? : Updatetof_response_ctbody_openfinancebillingDto

}

export class  Updatetof_sub_webhookDto {
        @ApiProperty()
        url?: string;
        @ApiProperty()
        isactive?: boolean;
        @ApiProperty()
        sample?: string;

}

export class  Updatetof_subscription_consentbodyDto {
        @ApiProperty({type : Updatetof_sub_webhookDto}) 
        @Type(() => Updatetof_sub_webhookDto) 
        webhook? : Updatetof_sub_webhookDto

}

export class  Updatetof_consentbodyDto {
        @ApiProperty({type : Updatetof_ctbody_dataDto}) 
        @Type(() => Updatetof_ctbody_dataDto) 
        data? : Updatetof_ctbody_dataDto
        @ApiProperty({type : Updatetof_conbody_multipleauthDto}) 
        @Type(() => Updatetof_conbody_multipleauthDto) 
        meta? : Updatetof_conbody_multipleauthDto
        @ApiProperty({type : Updatetof_subscription_consentbodyDto}) 
        @Type(() => Updatetof_subscription_consentbodyDto) 
        subscription? : Updatetof_subscription_consentbodyDto

}

export class  Updatetof_reqressub_webhookDto {
        @ApiProperty()
        url?: string;
        @ApiProperty()
        isactive?: boolean;

}

export class  Updatetof_reqressub_consentbodyDto {
        @ApiProperty({type : Updatetof_reqressub_webhookDto}) 
        @Type(() => Updatetof_reqressub_webhookDto) 
        webhook? : Updatetof_reqressub_webhookDto

}

export class  Updatetof_response_requestDto {
        @ApiProperty({enum :type_tof_response_request,enumName:"type",type:"string"})  
        type? : type_tof_response_request
        @ApiProperty({type : Updatetof_response_consentDto}) 
        @Type(() => Updatetof_response_consentDto) 
        consent? : Updatetof_response_consentDto
        @ApiProperty({type : Updatetof_reqressub_consentbodyDto}) 
        @Type(() => Updatetof_reqressub_consentbodyDto) 
        subscription? : Updatetof_reqressub_consentbodyDto

}

export class  Updatetof_response_dataDto {
        @ApiProperty()
        ids?: string;
        @ApiProperty()
        parid?: string;
        @ApiProperty()
        rartype?: string;
        @ApiProperty()
        standardversion?: string;
        @ApiProperty()
        consentgroupid?: string;
        @ApiProperty()
        requesturl?: string;
        @ApiProperty()
        consenttype?: string;
        @ApiProperty({enum :status_tof_response_data,isArray: true}) 
        status? : status_tof_response_data
        @ApiProperty({type : Updatetof_response_requestDto}) 
        @Type(() => Updatetof_response_requestDto) 
        request? : Updatetof_response_requestDto
        @ApiProperty({type : Updatetof_consentbodyDto}) 
        @Type(() => Updatetof_consentbodyDto) 
        consentbody? : Updatetof_consentbodyDto
        @ApiProperty()
        interactionid?: string;
        @ApiProperty({type : Updatetof_tppDto}) 
        @Type(() => Updatetof_tppDto) 
        tpp? : Updatetof_tppDto
        @ApiProperty({
            type: `integer`,
            format: `int32`,
        })
        updatedat?: number;

}

export class  Updatetof_consent_responseDto {
        @ApiProperty({type : Updatetof_response_dataDto}) 
        @Type(() => Updatetof_response_dataDto) 
        data? : Updatetof_response_dataDto
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




