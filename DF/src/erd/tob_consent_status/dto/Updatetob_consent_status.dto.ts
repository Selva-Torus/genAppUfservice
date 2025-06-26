import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';



export enum accounttype_tob_consent_consentkey{
Retail="Retail",
SME="SME",
Corporate="Corporate",
}
export enum accountsubtype_tob_consent_consentkey{
Current="Current",
Savings="Savings",
}
export enum consenttype_tob_consent_consentkey{
account_access_consent="account_access_consent",
service_initiation_consent="service_initiation_consent",
insurance_consent="insurance_consent",
}
export enum permissions_tob_consent_consentkey{
ReadAccountsBasic="ReadAccountsBasic",
ReadAccountsDetails="ReadAccountsDetails",
}


export class  Updatetob_consent_consentkeyDto {
        @ApiProperty()
        accountid?: string;
        @ApiProperty({enum :accounttype_tob_consent_consentkey,enumName:"accounttype",type:"string"})  
        accounttype? : accounttype_tob_consent_consentkey
        @ApiProperty({enum :accountsubtype_tob_consent_consentkey,enumName:"accountsubtype",type:"string"})  
        accountsubtype? : accountsubtype_tob_consent_consentkey
        @ApiProperty()
        consentgroup?: string;
        @ApiProperty({enum :consenttype_tob_consent_consentkey,enumName:"consenttype",type:"string"})  
        consenttype? : consenttype_tob_consent_consentkey
        @ApiProperty({enum :permissions_tob_consent_consentkey,enumName:"permissions",type:"string"})  
        permissions? : permissions_tob_consent_consentkey
        @ApiProperty()
        lastbaseconsentid?: string;
        @ApiProperty()
        laststatus?: string;

}

export class  Updatetob_consent_onbehalfofDto {
        @ApiProperty()
        tradingname?: string;
        @ApiProperty()
        legalname?: string;
        @ApiProperty()
        identifiertype?: string;
        @ApiProperty()
        identifier?: string;
        @ApiProperty({type : [Updatetob_consent_consentkeyDto]})
        @Type(() => Updatetob_consent_consentkeyDto)
        consentkey? : Updatetob_consent_consentkeyDto[]

}

export class  Updatetob_consent_lfiDto {
        @ApiProperty()
        lfi_code?: string;
        @ApiProperty()
        lfi_name?: string;
        @ApiProperty({type : [Updatetob_consent_onbehalfofDto]})
        @Type(() => Updatetob_consent_onbehalfofDto)
        onbehalfof? : Updatetob_consent_onbehalfofDto[]

}

export class  Updatetob_consent_statusDto {
        @ApiProperty({type : Updatetob_consent_lfiDto}) 
        @Type(() => Updatetob_consent_lfiDto) 
        lfi? : Updatetob_consent_lfiDto
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




