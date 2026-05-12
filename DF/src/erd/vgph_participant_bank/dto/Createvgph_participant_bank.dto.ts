
import { Prisma } from '@prisma/client';
import { IsEnum,IsOptional } from 'class-validator';
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';


export class  Createvgph_participant_bankDto {
        @ApiProperty({
            type: `integer`,
            format: `int32`,
        })
        vgphpb_id: number;
        @ApiProperty()
        bank_name: string;
        @ApiPropertyOptional()
        @IsOptional()
        bank_short_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        sort_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        clearing_sort_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        bic_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        iban_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        ifsc?: string;
        @ApiPropertyOptional()
        @IsOptional()
        country_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        address_1?: string;
        @ApiPropertyOptional()
        @IsOptional()
        address_2?: string;
        @ApiPropertyOptional()
        @IsOptional()
        city?: string;
        @ApiPropertyOptional()
        @IsOptional()
        state_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        zip_code?: string;
        @ApiProperty()
        is_active: string;
        @ApiPropertyOptional()
        @IsOptional()
        email_id?: string;
        @ApiPropertyOptional()
        @IsOptional()
        contact_no?: string;
        @ApiProperty()
        is_small_bank: string;
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

