
import { Prisma } from '@prisma/client';
import { IsEnum,IsOptional } from 'class-validator';
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';

export enum direction_vgph_si{
  OUTBOUND="OUTBOUND",
  INBOUND="INBOUND",
}
export enum process_type_vgph_si{
  OP="OP",
  IR="IR",
  IP="IP",
  OR="OR",
}
export enum tran_category_vgph_si{
  Financial="Financial",
  Non_Financial="Non_Financial",
}
export enum dr_bank_code_type_vgph_si{
  IFSC="IFSC",
  BIC="BIC",
  IBAN="IBAN",
}
export enum cr_bank_code_type_vgph_si{
  IFSC="IFSC",
  BIC="BIC",
  IBAN="IBAN",
}

export class  Createvgph_siDto {
        @ApiProperty({
            type: `integer`,
            format: `int32`,
        })
        vgphsi_id: number;
        @ApiProperty()
        vgphssi_uuid: string;
        @ApiPropertyOptional()
        @IsOptional()
        uuid?: string;
        @ApiProperty({enum:direction_vgph_si})
        @IsEnum(direction_vgph_si)
        direction: direction_vgph_si;
        @ApiProperty({enum:process_type_vgph_si})
        @IsEnum(process_type_vgph_si)
        process_type: process_type_vgph_si;
        @ApiPropertyOptional({enum:tran_category_vgph_si})
        @IsEnum(tran_category_vgph_si)
        @IsOptional()
        tran_category?: tran_category_vgph_si;
        @ApiPropertyOptional()
        @IsOptional()
        message_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        channel_name?: string;
        @ApiPropertyOptional()
        @IsOptional()
        channel_reference?: string;
        @ApiPropertyOptional({
            type: `string`,
            format: `date-time`,
        })
        @IsOptional()
        tran_date?: Date;
        @ApiPropertyOptional()
        @IsOptional()
        tran_reference?: string;
        @ApiPropertyOptional()
        @IsOptional()
        tran_seq_no?: string;
        @ApiPropertyOptional({
            type: `string`,
            format: `date-time`,
        })
        @IsOptional()
        value_date?: Date;
        @ApiPropertyOptional({
            type: `string`,
            format: `date-time`,
        })
        @IsOptional()
        settlement_date?: Date;
        @ApiPropertyOptional()
        @IsOptional()
        dr_account?: string;
        @ApiPropertyOptional({enum:dr_bank_code_type_vgph_si})
        @IsEnum(dr_bank_code_type_vgph_si)
        @IsOptional()
        dr_bank_code_type?: dr_bank_code_type_vgph_si;
        @ApiPropertyOptional()
        @IsOptional()
        dr_bank_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        dr_name?: string;
        @ApiPropertyOptional()
        @IsOptional()
        dr_currency?: string;
        @ApiPropertyOptional()
        @IsOptional()
        cr_account?: string;
        @ApiPropertyOptional({enum:cr_bank_code_type_vgph_si})
        @IsEnum(cr_bank_code_type_vgph_si)
        @IsOptional()
        cr_bank_code_type?: cr_bank_code_type_vgph_si;
        @ApiPropertyOptional()
        @IsOptional()
        cr_bank_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        cr_name?: string;
        @ApiPropertyOptional()
        @IsOptional()
        cr_currency?: string;
        @ApiPropertyOptional()
        @IsOptional()
        clr_house_type?: string;
        @ApiPropertyOptional({
            type: `number`,
            format: `float`,
        })
        @IsOptional()
        min_amount?: number;
        @ApiPropertyOptional({
            type: `number`,
            format: `float`,
        })
        @IsOptional()
        max_amount?: number;
        @ApiPropertyOptional()
        @IsOptional()
        frequency?: string;
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
        @ApiPropertyOptional({
            type: `string`,
            format: `date-time`,
        })
        @IsOptional()
        next_pull_date?: Date;
        @ApiPropertyOptional()
        @IsOptional()
        is_active?: string;
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

