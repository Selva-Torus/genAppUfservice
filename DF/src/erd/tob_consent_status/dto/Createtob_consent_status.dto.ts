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






 
export enum accounttype_tob_consent_consentkey {
    Retail="Retail",
    SME="SME",
    Corporate="Corporate",
}
export enum accountsubtype_tob_consent_consentkey {
    Current="Current",
    Savings="Savings",
}
export enum consenttype_tob_consent_consentkey {
    account_access_consent="account_access_consent",
    service_initiation_consent="service_initiation_consent",
    insurance_consent="insurance_consent",
}
export enum permissions_tob_consent_consentkey {
    ReadAccountsBasic="ReadAccountsBasic",
    ReadAccountsDetails="ReadAccountsDetails",
}

export class Createtob_consent_consentkeyDto{
    @ApiProperty()
    @IsString()
    accountid?: string;
    @ApiProperty({enum :accounttype_tob_consent_consentkey,enumName:"accounttype",type:"string"}) 
    accounttype?: accounttype_tob_consent_consentkey;

    @ApiProperty({enum :accountsubtype_tob_consent_consentkey,enumName:"accountsubtype",type:"string"}) 
    accountsubtype?: accountsubtype_tob_consent_consentkey;

    @ApiProperty()
    @IsString()
    consentgroup?: string;
    @ApiProperty({enum :consenttype_tob_consent_consentkey,enumName:"consenttype",type:"string"}) 
    consenttype?: consenttype_tob_consent_consentkey;

    @ApiProperty({enum :permissions_tob_consent_consentkey,enumName:"permissions",type:"string"}) 
    permissions?: permissions_tob_consent_consentkey;

    @ApiProperty()
    @IsString()
    lastbaseconsentid?: string;
    @ApiProperty()
    @IsString()
    laststatus?: string;
}
export class Createtob_consent_onbehalfofDto{
    @ApiProperty()
    @IsString()
    tradingname?: string;
    @ApiProperty()
    @IsString()
    legalname?: string;
    @ApiProperty()
    @IsString()
    identifiertype?: string;
    @ApiProperty()
    @IsString()
    identifier?: string;

    @ApiProperty({ type:[Createtob_consent_consentkeyDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Createtob_consent_consentkeyDto)
    consentkey?: Createtob_consent_consentkeyDto[];
}
export class Createtob_consent_lfiDto{
    @ApiProperty()
    @IsString()
    lfi_code?: string;
    @ApiProperty()
    @IsString()
    lfi_name?: string;

    @ApiProperty({ type:[Createtob_consent_onbehalfofDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Createtob_consent_onbehalfofDto)
    onbehalfof?: Createtob_consent_onbehalfofDto[];
}
export class Createtob_consent_statusDto{
    @ApiProperty({ type:Createtob_consent_lfiDto })
    @ValidateNested()
    @Type(() => Createtob_consent_lfiDto)
    lfi?: Createtob_consent_lfiDto;
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







