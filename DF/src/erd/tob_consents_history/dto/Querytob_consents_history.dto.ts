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


 

export class Querytob_consents_historyDto{
    @ApiProperty()
    @IsString()
    requesturl?: string;
    @ApiProperty({ type: 'string', format: 'date-time' })
    requesttimestamp?: Date;
    @ApiProperty()
    @IsString()
    method?: string;
    @ApiProperty()
    @IsString()
    baseconsentid?: string;
    @ApiProperty()
    @IsString()
    resourceconsentid?: string;
    @ApiProperty()
    @IsString()
    consentgroupid?: string;
    @ApiProperty()
    @IsString()
    consenttype?: string;
    @ApiProperty()
    requestdata?: Prisma.InputJsonValue;
    @ApiProperty()
    responsedata?: Prisma.InputJsonValue;
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









