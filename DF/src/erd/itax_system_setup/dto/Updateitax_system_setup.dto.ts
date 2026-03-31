import { Prisma } from '@prisma/client';
import { IsEnum,IsOptional } from 'class-validator';
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';


export class  Updateitax_system_setupDto {
        @ApiPropertyOptional()
        @IsOptional()
        setup_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        interface_product?: string;
        @ApiPropertyOptional()
        @IsOptional()
        category?: string;
        @ApiPropertyOptional()
        @IsOptional()
        sub_category?: string;
        @ApiPropertyOptional()
        @IsOptional()
        purpose?: string;
        @ApiPropertyOptional()
        @IsOptional()
        setup_value?: Prisma.InputJsonValue;
        @ApiPropertyOptional()
        @IsOptional()
        parent_setup_code?: string;














        @ApiPropertyOptional({
            type: `string`,
            format: `date-time`,
        })
        @IsOptional()
        trs_created_date?: Date;
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
        trs_sub_org_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_sub_org_grp_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_locked_by?: string;
        @ApiPropertyOptional({
            type: `string`,
            format: `date-time`,
        })
        @IsOptional()
        trs_locked_time?:  Date;
        @ApiPropertyOptional()
        @IsOptional()
        trs_tenant_id?: string;      
        @ApiPropertyOptional()
        @IsOptional()
        trs_app_code?: string;      
        @ApiPropertyOptional()
        @IsOptional()
        trs_product_code?: string;      
        @ApiPropertyOptional()
        @IsOptional()
        trs_event_process_status?: string;      
        @ApiPropertyOptional()
        @IsOptional()
        trs_event_status?: string;
        @ApiPropertyOptional({example:"string"})
        @IsOptional()
        trs_token_id?: string;
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

