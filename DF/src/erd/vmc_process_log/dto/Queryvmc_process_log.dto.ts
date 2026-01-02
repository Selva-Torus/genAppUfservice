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


 

export class Queryvmc_process_logDto{
    @ApiProperty()
    @IsString()
    country_name?: string;
    @ApiProperty()
    @IsString()
    scheme_type?: string;
    @ApiProperty()
    @IsString()
    source_msg_type?: string;
    @ApiProperty()
    @IsString()
    target_msg_type?: string;
    @ApiProperty()
    @IsString()
    source_msg_format?: string;
    @ApiProperty()
    @IsString()
    target_msg_format?: string;
    @ApiProperty()
    @IsString()
    source_content?: string;
    @ApiProperty()
    @IsString()
    target_content?: string;
    @ApiProperty()
    @IsString()
    scheme?: string;
    @ApiProperty()
    @IsString()
    vmc_api_repositorysid: string;
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
    @ApiProperty()
    trs_sub_org_grp_code?: string;
    @ApiProperty()
    trs_sub_org_code?: string;
}









