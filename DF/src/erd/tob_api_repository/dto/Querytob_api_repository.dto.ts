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


 

export class Querytob_api_repositoryDto{
    @ApiProperty()
    @IsString()
    api_name?: string;
    @ApiProperty()
    @IsString()
    version?: string;
    @ApiProperty({ type: 'string', format: 'date-time' })
    release_date?: Date;
    @ApiProperty()
    @IsString()
    api_category?: string;
    @ApiProperty()
    @IsString()
    server_url?: string;
    @ApiProperty()
    @IsString()
    status?: string;
    @ApiProperty()
    @IsString()
    api_resourcepath?: string;
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









