
import { Prisma } from '@prisma/client';
import { IsEnum,IsOptional } from 'class-validator';
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';

export enum direction_vgph_source_tran_main{
  OUTBOUND="OUTBOUND",
  INBOUND="INBOUND",
}
export enum process_type_vgph_source_tran_main{
  OP="OP",
  IR="IR",
  IP="IP",
  OR="OR",
}
export enum charge_type_vgph_source_tran_main{
  SHA="SHA",
  OUR="OUR",
  BEN="BEN",
  SLEV="SLEV",
}

export class  Createvgph_source_tran_mainDto {
        @ApiProperty({
            type: `integer`,
            format: `int32`,
        })
        vgphstm_id: number;
        @ApiPropertyOptional()
        @IsOptional()
        parent_vgphstm_uuid?: string;
        @ApiProperty({enum:direction_vgph_source_tran_main})
        @IsEnum(direction_vgph_source_tran_main)
        direction: direction_vgph_source_tran_main;
        @ApiProperty({enum:process_type_vgph_source_tran_main})
        @IsEnum(process_type_vgph_source_tran_main)
        process_type: process_type_vgph_source_tran_main;
        @ApiProperty()
        tran_category: string;
        @ApiPropertyOptional()
        @IsOptional()
        message_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        channel_name?: string;
        @ApiPropertyOptional()
        @IsOptional()
        channel_reference?: string;
        @ApiProperty({
            type: `string`,
            format: `date-time`,
        })
        tran_date: Date;
        @ApiPropertyOptional()
        @IsOptional()
        tran_reference?: string;
        @ApiProperty()
        tran_seq_no: string;
        @ApiProperty({
            type: `string`,
            format: `date-time`,
        })
        value_date: Date;
        @ApiPropertyOptional({
            type: `string`,
            format: `date-time`,
        })
        @IsOptional()
        settlement_date?: Date;
        @ApiPropertyOptional()
        @IsOptional()
        dr_account?: string;
        @ApiPropertyOptional()
        @IsOptional()
        dr_bank_code_type?: string;
        @ApiPropertyOptional()
        @IsOptional()
        dr_bank_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        dr_name?: string;
        @ApiPropertyOptional({
            type: `number`,
            format: `float`,
        })
        @IsOptional()
        dr_amount?: number;
        @ApiPropertyOptional()
        @IsOptional()
        dr_currency?: string;
        @ApiPropertyOptional()
        @IsOptional()
        cr_account?: string;
        @ApiPropertyOptional()
        @IsOptional()
        cr_bank_code_type?: string;
        @ApiPropertyOptional()
        @IsOptional()
        cr_bank_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        cr_name?: string;
        @ApiPropertyOptional({
            type: `number`,
            format: `float`,
        })
        @IsOptional()
        cr_amount?: number;
        @ApiPropertyOptional()
        @IsOptional()
        cr_currency?: string;
        @ApiPropertyOptional()
        @IsOptional()
        remittance_info?: string;
        @ApiPropertyOptional()
        @IsOptional()
        product_basic?: Prisma.InputJsonValue;
        @ApiPropertyOptional()
        @IsOptional()
        product_additional?: Prisma.InputJsonValue;
        @ApiPropertyOptional({enum:charge_type_vgph_source_tran_main})
        @IsEnum(charge_type_vgph_source_tran_main)
        @IsOptional()
        charge_type?: charge_type_vgph_source_tran_main;
        @ApiProperty()
        uuid: string;
        @ApiProperty()
        vgphsm_uuid: string;
        @ApiPropertyOptional()
        @IsOptional()
        vgphntm_uuid?: string;
        @ApiPropertyOptional({
            type: `integer`,
            format: `int32`,
        })
        @IsOptional()
        vgphsm_id?: number;
        @ApiPropertyOptional({
            type: `integer`,
            format: `int32`,
        })
        @IsOptional()
        prctm_id?: number;
        @ApiPropertyOptional()
        @IsOptional()
        source_content?: string;
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
        @ApiPropertyOptional()
        @IsOptional()
        trs_prev_process_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_prev_status?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_prev_process_status?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_process_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_status?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_process_status?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_next_process_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_next_status?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_next_process_status?: string;

        
}

