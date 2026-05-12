
import { Prisma } from '@prisma/client';
import { IsEnum,IsOptional } from 'class-validator';
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';


export class  Createvgph_charge_tranDto {
        @ApiProperty({
            type: `integer`,
            format: `int32`,
        })
        vgphct_id: number;
        @ApiPropertyOptional()
        @IsOptional()
        charge_group?: string;
        @ApiPropertyOptional()
        @IsOptional()
        charge_description?: string;
        @ApiProperty()
        currency: string;
        @ApiPropertyOptional()
        @IsOptional()
        vgphsm_uuid?: string;
        @ApiPropertyOptional()
        @IsOptional()
        vgphss_uuid?: string;
        @ApiPropertyOptional()
        @IsOptional()
        vgphstm_uuid?: string;
        @ApiPropertyOptional()
        @IsOptional()
        vgphsts_uuid?: string;
        @ApiProperty()
        charge_code: string;
        @ApiProperty({
            type: `number`,
            format: `float`,
        })
        charge_amount: number;
        @ApiPropertyOptional()
        @IsOptional()
        charge_additional?: Prisma.InputJsonValue;
        @ApiPropertyOptional()
        @IsOptional()
        charge_dr_gl_account?: string;
        @ApiPropertyOptional()
        @IsOptional()
        charge_cr_gl_account?: string;
        @ApiPropertyOptional()
        @IsOptional()
        vat_flag?: string;
        @ApiPropertyOptional({
            type: `number`,
            format: `float`,
        })
        @IsOptional()
        vat_amount?: number;
        @ApiPropertyOptional()
        @IsOptional()
        vat_dr_gl_account?: string;
        @ApiPropertyOptional()
        @IsOptional()
        vat_cr_gl_account?: string;
        @ApiPropertyOptional()
        @IsOptional()
        posted_flag?: string;
        @ApiPropertyOptional({
            type: `string`,
            format: `date-time`,
        })
        @IsOptional()
        posted_date?: Date;
        @ApiPropertyOptional()
        @IsOptional()
        invoice_generation_flag?: string;
        @ApiPropertyOptional()
        @IsOptional()
        invoice_id?: string;
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

