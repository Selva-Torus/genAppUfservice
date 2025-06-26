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


 

export class Querytob_lfi_dataDto{
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
    @ApiProperty()
    @IsString()
    status?: string;
    @ApiProperty()
    @IsString()
    consentid?: string;
}
export class Querytob_lfi_dataWapperDto {
    @ApiProperty({ type:Querytob_lfi_dataDto })
    @ValidateNested()
    @Type(() => Querytob_lfi_dataDto)
    is: Querytob_lfi_dataDto;
}
export class Querytob_lfi_consentDto{
    @ApiProperty({ type:Querytob_lfi_dataWapperDto })
    @ValidateNested()
    @Type(() => Querytob_lfi_dataWapperDto)
     data: Querytob_lfi_dataWapperDto;
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









