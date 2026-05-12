
import { Prisma } from '@prisma/client';
import { IsEnum,IsOptional } from 'class-validator';
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';

export enum direction_vgph_clearing_session{
  OUTBOUND="OUTBOUND",
  INBOUND="INBOUND",
}
export enum process_type_vgph_clearing_session{
  OP="OP",
  IR="IR",
  IP="IP",
  OR="OR",
}
export enum processing_day_vgph_clearing_session{
  same_buz_day="same_buz_day",
  next_buz_day="next_buz_day",
}

export class  Createvgph_clearing_sessionDto {
        @ApiProperty({
            type: `integer`,
            format: `int32`,
        })
        vgph_csid: number;
        @ApiPropertyOptional({enum:direction_vgph_clearing_session})
        @IsEnum(direction_vgph_clearing_session)
        @IsOptional()
        direction?: direction_vgph_clearing_session;
        @ApiPropertyOptional({enum:process_type_vgph_clearing_session})
        @IsEnum(process_type_vgph_clearing_session)
        @IsOptional()
        process_type?: process_type_vgph_clearing_session;
        @ApiPropertyOptional()
        @IsOptional()
        name?: string;
        @ApiPropertyOptional()
        @IsOptional()
        currency?: string;
        @ApiProperty({enum:processing_day_vgph_clearing_session})
        @IsEnum(processing_day_vgph_clearing_session)
        processing_day: processing_day_vgph_clearing_session;
        @ApiPropertyOptional()
        @IsOptional()
        session_info?: Prisma.InputJsonValue;
        @ApiPropertyOptional({
            type: `string`,
            format: `date-time`,
        })
        @IsOptional()
        start_date?: Date;
        @ApiPropertyOptional({
            type: `string`,
            format: `date-time`,
        })
        @IsOptional()
        end_date?: Date;
        @ApiPropertyOptional()
        @IsOptional()
        rule_code?: string;
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

