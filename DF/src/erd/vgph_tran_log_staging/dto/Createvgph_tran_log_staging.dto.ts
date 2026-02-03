import { Prisma } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum direction_vgph_tran_log_staging{
  OUTBOUND="OUTBOUND",
  INBOUND="INBOUND",
}
export enum process_type_vgph_tran_log_staging{
  OP="OP",
  IR="IR",
  IP="IP",
  OR="OR",
}
export enum tran_category_vgph_tran_log_staging{
  Financial="Financial",
  Non_Financial="Non_Financial",
}

export class  Createvgph_tran_log_stagingDto {
        @ApiProperty()
        tenant_id: string;
        @ApiProperty()
        product_code: string;
        @ApiProperty({enum:direction_vgph_tran_log_staging})
        @IsEnum(direction_vgph_tran_log_staging)
        direction: direction_vgph_tran_log_staging;
        @ApiProperty({enum:process_type_vgph_tran_log_staging})
        @IsEnum(process_type_vgph_tran_log_staging)
        process_type: process_type_vgph_tran_log_staging;
        @ApiProperty({enum:tran_category_vgph_tran_log_staging})
        @IsEnum(tran_category_vgph_tran_log_staging)
        tran_category: tran_category_vgph_tran_log_staging;
        @ApiProperty()
        process_category: string;
        @ApiProperty()
        processing_system: string;
        @ApiProperty()
        message_code?: string;
        @ApiProperty()
        process_code: string;
        @ApiProperty()
        previous_process_code?: string;
        @ApiProperty()
        next_process_code?: string;
        @ApiProperty()
        flow_code?: string;
        @ApiProperty()
        step_code?: string;
        @ApiProperty({
            type: `string`,
            format: `date-time`,
        })
        task_start_time: Date;
        @ApiProperty({
            type: `string`,
            format: `date-time`,
        })
        task_end_time: Date;
        @ApiProperty()
        source_data?: Prisma.InputJsonValue;
        @ApiProperty()
        request_data?: Prisma.InputJsonValue;
        @ApiProperty()
        response_data?: Prisma.InputJsonValue;
        @ApiProperty()
        message_data?: Prisma.InputJsonValue;
        @ApiProperty({
            type: `string`,
            format: `date-time`,
        })
        process_start_time: Date;
        @ApiProperty({
            type: `string`,
            format: `date-time`,
        })
        process_end_time: Date;
        @ApiProperty()
        retry_flag?: string;
        @ApiProperty({
            type: `integer`,
            format: `int32`,
        })
        retry_count?: number;
        @ApiProperty()
        manual_context?: string;
        @ApiProperty()
        action_context?: string;
        @ApiProperty()
        status?: string;
        @ApiProperty()
        action?: string;
        @ApiProperty()
        version?: string;
        @ApiProperty()
        vgphsts_uuid: string;
        @ApiProperty({
            type: `integer`,
            format: `int32`,
        })
        vgphsts_id: number;
        @ApiProperty({
            type: `string`,
            format: `date-time`,
        })
        trs_created_date?: Date;
        @ApiProperty()
        trs_created_by?: string;
        @ApiProperty({
            type: `string`,
            format: `date-time`,
        })
        trs_modified_date?: Date;
        @ApiProperty()
        trs_modified_by?: string;
        @ApiProperty()
        trs_status?: string;
        @ApiProperty()
        trs_next_status?: string;
        @ApiProperty()
        trs_process_id?: string;
        @ApiProperty()
        trs_access_profile?: string;
        @ApiProperty()
        trs_org_grp_code?: string;
        @ApiProperty()
        trs_org_code?: string;
        @ApiProperty()
        trs_role_grp_code?: string;
        @ApiProperty()
        trs_role_code?: string;
        @ApiProperty()
        trs_ps_grp_code?: string;
        @ApiProperty()
        trs_ps_code?: string;
        @ApiProperty()
        trs_sub_org_grp_code?: string;
        @ApiProperty()
        trs_sub_org_code?: string;

        
}

