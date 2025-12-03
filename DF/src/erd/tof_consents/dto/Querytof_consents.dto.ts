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




 
export enum consenttype_tof_consents_consentkey {
    account_access_consent="account_access_consent",
    service_initiation_consent="service_initiation_consent",
    insurance_consent="insurance_consent",
}
export enum permissions_tof_consents_consentkey {
    ReadAccountsBasic="ReadAccountsBasic",
    ReadAccountsDetails="ReadAccountsDetails",
    ReadParty="ReadParty",
    ReadBalances="ReadBalances",
}

export class Querytof_consents_consentkeyDto{
    @ApiProperty()
    @IsString()
    baseconsentid?: string;
    @ApiProperty()
    @IsString()
    resourceconsentid?: string;
    @ApiProperty()
    @IsString()
    consentgroup?: string;
    @ApiProperty({enum :consenttype_tof_consents_consentkey,isArray: true}) 
    consenttype?: consenttype_tof_consents_consentkey[];

    @ApiProperty({enum :permissions_tof_consents_consentkey,isArray: true}) 
    permissions?: permissions_tof_consents_consentkey[];

    @ApiProperty()
    @IsString()
    tpp_code?: string;
    @ApiProperty()
    @IsString()
    tpp_name?: string;
    @ApiProperty()
    @IsString()
    app_code?: string;
    @ApiProperty()
    @IsString()
    app_name?: string;
}
export class Querytof_consents_consentkeyWapperDto {

    @ApiProperty({ type:Querytof_consents_consentkeyDto })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Querytof_consents_consentkeyWapperDto)
    some: Querytof_consents_consentkeyDto;
}
export class Querytof_consents_onbelfofDto{
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

    @ApiProperty({ type:Querytof_consents_consentkeyWapperDto })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Querytof_consents_consentkeyWapperDto)
     consentkey?: Querytof_consents_consentkeyWapperDto[];
}
export class Querytof_consents_onbelfofWapperDto {

    @ApiProperty({ type:Querytof_consents_onbelfofDto })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Querytof_consents_onbelfofWapperDto)
    some: Querytof_consents_onbelfofDto;
}
export class Querytof_consents_lfiDto{
    @ApiProperty()
    @IsString()
    lfi_code?: string;
    @ApiProperty()
    @IsString()
    lfi_name?: string;

    @ApiProperty({ type:Querytof_consents_onbelfofWapperDto })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Querytof_consents_onbelfofWapperDto)
     onbehalfof?: Querytof_consents_onbelfofWapperDto[];
}
export class Querytof_consents_lfiWapperDto {
    @ApiProperty({ type:Querytof_consents_lfiDto })
    @ValidateNested()
    @Type(() => Querytof_consents_lfiDto)
    is: Querytof_consents_lfiDto;
}
export class Querytof_consentsDto{
    @ApiProperty({ type:Querytof_consents_lfiWapperDto })
    @ValidateNested()
    @Type(() => Querytof_consents_lfiWapperDto)
     lfi?: Querytof_consents_lfiWapperDto;
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









