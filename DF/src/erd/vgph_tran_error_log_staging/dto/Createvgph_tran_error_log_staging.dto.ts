import { Prisma } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum direction_vgph_tran_error_log_staging{
  OUTBOUND="OUTBOUND",
  INBOUND="INBOUND",
}
export enum process_type_vgph_tran_error_log_staging{
  OP="OP",
  IR="IR",
  IP="IP",
  OR="OR",
}
export enum tran_category_vgph_tran_error_log_staging{
  Financial="Financial",
  Non_Financial="Non_Financial",
}
export enum error_cateogry_vgph_tran_error_log_staging{
  VALIDATION="VALIDATION",
  CBS="CBS",
  OTHER="OTHER",
}

export class  Createvgph_tran_error_log_stagingDto {
        @ApiProperty()
        tenant_id: string;
        @ApiProperty()
        product_code: string;
        @ApiProperty({enum:direction_vgph_tran_error_log_staging})
        @IsEnum(direction_vgph_tran_error_log_staging)
        direction: direction_vgph_tran_error_log_staging;
        @ApiProperty({enum:process_type_vgph_tran_error_log_staging})
        @IsEnum(process_type_vgph_tran_error_log_staging)
        process_type: process_type_vgph_tran_error_log_staging;
        @ApiProperty({enum:tran_category_vgph_tran_error_log_staging})
        @IsEnum(tran_category_vgph_tran_error_log_staging)
        tran_category: tran_category_vgph_tran_error_log_staging;
        @ApiProperty()
        process_code?: string;
        @ApiProperty({enum:error_cateogry_vgph_tran_error_log_staging})
        @IsEnum(error_cateogry_vgph_tran_error_log_staging)
        error_cateogry?: error_cateogry_vgph_tran_error_log_staging;
        @ApiProperty()
        error_code?: string;
        @ApiProperty()
        error_desc?: string;
        @ApiProperty()
        error_data?: Prisma.InputJsonValue;
        @ApiProperty()
        vgphsts_uuid?: string;
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

