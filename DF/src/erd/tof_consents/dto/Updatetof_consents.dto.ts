import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';



export enum consenttype_tof_consents_consentkey{
account_access_consent="account_access_consent",
service_initiation_consent="service_initiation_consent",
insurance_consent="insurance_consent",
}
export enum permissions_tof_consents_consentkey{
ReadAccountsBasic="ReadAccountsBasic",
ReadAccountsDetails="ReadAccountsDetails",
ReadParty="ReadParty",
ReadBalances="ReadBalances",
}


export class  Updatetof_consents_consentkeyDto {
        @ApiProperty()
        baseconsentid?: string;
        @ApiProperty()
        resourceconsentid?: string;
        @ApiProperty()
        consentgroup?: string;
        @ApiProperty({enum :consenttype_tof_consents_consentkey,isArray: true}) 
        consenttype? : consenttype_tof_consents_consentkey
        @ApiProperty({enum :permissions_tof_consents_consentkey,isArray: true}) 
        permissions? : permissions_tof_consents_consentkey
        @ApiProperty()
        tpp_code?: string;
        @ApiProperty()
        tpp_name?: string;
        @ApiProperty()
        app_code?: string;
        @ApiProperty()
        app_name?: string;

}

export class  Updatetof_consents_onbelfofDto {
        @ApiProperty()
        tradingname?: string;
        @ApiProperty()
        legalname?: string;
        @ApiProperty()
        identifiertype?: string;
        @ApiProperty()
        identifier?: string;
        @ApiProperty({type : [Updatetof_consents_consentkeyDto]})
        @Type(() => Updatetof_consents_consentkeyDto)
        consentkey? : Updatetof_consents_consentkeyDto[]

}

export class  Updatetof_consents_lfiDto {
        @ApiProperty()
        lfi_code?: string;
        @ApiProperty()
        lfi_name?: string;
        @ApiProperty({type : [Updatetof_consents_onbelfofDto]})
        @Type(() => Updatetof_consents_onbelfofDto)
        onbehalfof? : Updatetof_consents_onbelfofDto[]

}

export class  Updatetof_consentsDto {
        @ApiProperty({type : Updatetof_consents_lfiDto}) 
        @Type(() => Updatetof_consents_lfiDto) 
        lfi? : Updatetof_consents_lfiDto
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




