import { Prisma } from '@prisma/client';
import { IsEnum,IsOptional } from 'class-validator';
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';

export enum tran_category_itax_tran_error_log{
  Financial="Financial",
  Non_Financial="Non_Financial",
}
export enum error_cateogry_itax_tran_error_log{
  VALIDATION="VALIDATION",
  CBS="CBS",
  OTHER="OTHER",
}

export class  Updateitax_tran_error_logDto {
        @ApiPropertyOptional({enum:tran_category_itax_tran_error_log})
        @IsEnum(tran_category_itax_tran_error_log)
        @IsOptional()
        tran_category?: tran_category_itax_tran_error_log;
        @ApiPropertyOptional({enum:error_cateogry_itax_tran_error_log})
        @IsEnum(error_cateogry_itax_tran_error_log)
        @IsOptional()
        error_cateogry?: error_cateogry_itax_tran_error_log;
        @ApiPropertyOptional()
        @IsOptional()
        error_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        error_desc?: string;
        @ApiPropertyOptional()
        @IsOptional()
        error_data?: Prisma.InputJsonValue;










        @ApiProperty({
            type: `integer`,
            format: `int32`,
        })
        itaxst_id: number;




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

