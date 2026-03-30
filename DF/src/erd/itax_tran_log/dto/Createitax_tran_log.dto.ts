import { Prisma } from '@prisma/client';
import { IsEnum,IsOptional } from 'class-validator';
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';

export enum tran_category_itax_tran_log{
  Financial="Financial",
  Non_Financial="Non_Financial",
}

export class  Createitax_tran_logDto {
        @ApiPropertyOptional({enum:tran_category_itax_tran_log})
        @IsEnum(tran_category_itax_tran_log)
        @IsOptional()
        tran_category?: tran_category_itax_tran_log;
        @ApiPropertyOptional()
        @IsOptional()
        processing_system?: string;
        @ApiPropertyOptional()
        @IsOptional()
        request_data?: Prisma.InputJsonValue;
        @ApiPropertyOptional()
        @IsOptional()
        response_data?: Prisma.InputJsonValue;
        @ApiPropertyOptional()
        @IsOptional()
        retry_flag?: string;
        @ApiPropertyOptional({
            type: `integer`,
            format: `int32`,
        })
        @IsOptional()
        retry_count?: number;
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
        trs_sub_org_grp_code?: string;

        @ApiPropertyOptional()
        @IsOptional()
        trs_sub_org_code?: string;

        @ApiPropertyOptional()
        @IsOptional()
        trs_locked_by?:  string;

        @ApiPropertyOptional({
            type: `string`,
            format: `date-time`,
        })
        @IsOptional()
        trs_locked_time?:  Date;

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

