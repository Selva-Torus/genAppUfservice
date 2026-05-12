
import { Prisma } from '@prisma/client';
import { IsEnum,IsOptional } from 'class-validator';
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';


export class  Createvgph_charge_configDto {
        @ApiProperty({
            type: `integer`,
            format: `int32`,
        })
        vgphcc_id: number;
        @ApiPropertyOptional()
        @IsOptional()
        channel_name?: string;
        @ApiPropertyOptional()
        @IsOptional()
        cust_segment?: string;
        @ApiPropertyOptional()
        @IsOptional()
        customer_type?: string;
        @ApiPropertyOptional()
        @IsOptional()
        cif_number?: string;
        @ApiPropertyOptional()
        @IsOptional()
        customer_account_no?: string;
        @ApiPropertyOptional()
        @IsOptional()
        message_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        charge_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        charge_borne_by?: string;
        @ApiPropertyOptional()
        @IsOptional()
        charge_gl_ac_no?: string;
        @ApiPropertyOptional()
        @IsOptional()
        vat_gl_ac_no?: string;
        @ApiProperty({
            type: `string`,
            format: `date-time`,
        })
        start_active_date: Date;
        @ApiProperty({
            type: `string`,
            format: `date-time`,
        })
        end_active_date: Date;
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

