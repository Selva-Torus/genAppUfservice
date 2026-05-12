
import { Prisma } from '@prisma/client';
import { IsEnum,IsOptional } from 'class-validator';
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';


export class  Createvgph_employeeDto {
        @ApiProperty({
            type: `integer`,
            format: `int32`,
        })
        vgphe_id: number;
        @ApiProperty()
        vgphse_uuid: string;
        @ApiProperty()
        vgphsc_uuid: string;
        @ApiPropertyOptional()
        @IsOptional()
        uuid?: string;
        @ApiPropertyOptional()
        @IsOptional()
        name?: string;
        @ApiPropertyOptional()
        @IsOptional()
        mobile_number?: string;
        @ApiPropertyOptional()
        @IsOptional()
        address1?: string;
        @ApiPropertyOptional()
        @IsOptional()
        address2?: string;
        @ApiPropertyOptional()
        @IsOptional()
        address3?: string;
        @ApiPropertyOptional()
        @IsOptional()
        address4?: string;
        @ApiPropertyOptional()
        @IsOptional()
        zip?: string;
        @ApiPropertyOptional()
        @IsOptional()
        state?: string;
        @ApiPropertyOptional()
        @IsOptional()
        city?: string;
        @ApiPropertyOptional({
            type: `string`,
            format: `date-time`,
        })
        @IsOptional()
        dob?: Date;
        @ApiPropertyOptional()
        @IsOptional()
        gender?: string;
        @ApiPropertyOptional()
        @IsOptional()
        nationality?: string;
        @ApiPropertyOptional()
        @IsOptional()
        first_name?: string;
        @ApiPropertyOptional()
        @IsOptional()
        last_name?: string;
        @ApiPropertyOptional()
        @IsOptional()
        country?: string;
        @ApiPropertyOptional()
        @IsOptional()
        email?: string;
        @ApiPropertyOptional()
        @IsOptional()
        reference_id?: string;
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
        kyc?: Prisma.InputJsonValue;
        @ApiPropertyOptional()
        @IsOptional()
        card?: Prisma.InputJsonValue;
        @ApiPropertyOptional()
        @IsOptional()
        request_data?: Prisma.InputJsonValue;
        @ApiPropertyOptional()
        @IsOptional()
        response_data?: Prisma.InputJsonValue;
        @ApiPropertyOptional()
        @IsOptional()
        compliance_data?: Prisma.InputJsonValue;
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

