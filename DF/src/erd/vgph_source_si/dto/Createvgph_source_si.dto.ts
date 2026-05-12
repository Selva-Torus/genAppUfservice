
import { Prisma } from '@prisma/client';
import { IsEnum,IsOptional } from 'class-validator';
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';

export enum direction_vgph_source_si{
  OUTBOUND="OUTBOUND",
  INBOUND="INBOUND",
}
export enum process_type_vgph_source_si{
  OP="OP",
  IR="IR",
  IP="IP",
  OR="OR",
}

export class  Createvgph_source_siDto {
        @ApiProperty({
            type: `integer`,
            format: `int32`,
        })
        vgphssi_id: number;
        @ApiPropertyOptional()
        @IsOptional()
        uuid?: string;
        @ApiProperty({enum:direction_vgph_source_si})
        @IsEnum(direction_vgph_source_si)
        direction: direction_vgph_source_si;
        @ApiProperty({enum:process_type_vgph_source_si})
        @IsEnum(process_type_vgph_source_si)
        process_type: process_type_vgph_source_si;
        @ApiPropertyOptional()
        @IsOptional()
        tran_category?: string;
        @ApiPropertyOptional()
        @IsOptional()
        source_category?: string;
        @ApiPropertyOptional()
        @IsOptional()
        source_reference?: string;
        @ApiPropertyOptional()
        @IsOptional()
        source_name?: string;
        @ApiPropertyOptional()
        @IsOptional()
        channel_name?: string;
        @ApiPropertyOptional()
        @IsOptional()
        channel_reference?: string;
        @ApiPropertyOptional()
        @IsOptional()
        product_basic?: Prisma.InputJsonValue;
        @ApiPropertyOptional()
        @IsOptional()
        product_additional?: Prisma.InputJsonValue;
        @ApiPropertyOptional()
        @IsOptional()
        request_data?: Prisma.InputJsonValue;
        @ApiPropertyOptional()
        @IsOptional()
        response_data?: Prisma.InputJsonValue;
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

