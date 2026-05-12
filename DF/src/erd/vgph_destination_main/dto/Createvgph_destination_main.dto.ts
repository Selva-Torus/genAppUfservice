
import { Prisma } from '@prisma/client';
import { IsEnum,IsOptional } from 'class-validator';
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';

export enum direction_vgph_destination_main{
  OUTBOUND="OUTBOUND",
  INBOUND="INBOUND",
}
export enum process_type_vgph_destination_main{
  OP="OP",
  IR="IR",
  IP="IP",
  OR="OR",
}

export class  Createvgph_destination_mainDto {
        @ApiProperty({
            type: `integer`,
            format: `int32`,
        })
        vgphdm_id: number;
        @ApiProperty({enum:direction_vgph_destination_main})
        @IsEnum(direction_vgph_destination_main)
        direction: direction_vgph_destination_main;
        @ApiProperty({enum:process_type_vgph_destination_main})
        @IsEnum(process_type_vgph_destination_main)
        process_type: process_type_vgph_destination_main;
        @ApiProperty()
        tran_category: string;
        @ApiPropertyOptional()
        @IsOptional()
        message_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        destination_category?: string;
        @ApiPropertyOptional()
        @IsOptional()
        destination_reference?: string;
        @ApiPropertyOptional()
        @IsOptional()
        destination_name?: string;
        @ApiPropertyOptional()
        @IsOptional()
        destination_parent_name?: string;
        @ApiPropertyOptional()
        @IsOptional()
        destionation_status?: string;
        @ApiPropertyOptional()
        @IsOptional()
        uuid?: string;
        @ApiProperty({
            type: `string`,
            format: `date-time`,
        })
        trs_created_date: Date;
        @ApiPropertyOptional()
        @IsOptional()
        trs_created_by?: string;
        @ApiPropertyOptional({
            type: `string`,
            format: `date-time`,
        })
        @IsOptional()
        trs_modified_date?: Date;
        @ApiPropertyOptional()
        @IsOptional()
        trs_modified_by?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_process_id?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_access_profile?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_org_grp_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_org_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_role_grp_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_role_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_ps_grp_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_ps_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_sub_org_grp_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_sub_org_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_locked_by?: string;
        @ApiPropertyOptional({
            type: `string`,
            format: `date-time`,
        })
        @IsOptional()
        trs_locked_time?: Date;
        @ApiProperty()
        trs_tenant_id: string;
        @ApiProperty()
        trs_app_code: string;
        @ApiProperty()
        trs_product_code: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_event_process_status?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_event_status?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_token_id?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_version?: string;

        
}

