import { Prisma } from '@prisma/client';
import { IsEnum,IsOptional } from 'class-validator';
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';

import { itax_tran_log_OnlyParentEntity} from 'src/erd/itax_tran_log/entity/itax_tran_log.entity';          

import { itax_tran_error_log_OnlyParentEntity} from 'src/erd/itax_tran_error_log/entity/itax_tran_error_log.entity';          

import { itax_source_tran_doc_OnlyParentEntity} from 'src/erd/itax_source_tran_doc/entity/itax_source_tran_doc.entity';          

import { itax_source_tran_dtl_OnlyParentEntity} from 'src/erd/itax_source_tran_dtl/entity/itax_source_tran_dtl.entity';          

export enum tran_category_itax_source_tran{
  Financial="Financial",
  Non_Financial="Non_Financial",
}

export class  Updateitax_source_tranDto {
        @ApiPropertyOptional({enum:tran_category_itax_source_tran})
        @IsEnum(tran_category_itax_source_tran)
        @IsOptional()
        tran_category?: tran_category_itax_source_tran;
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
        product_basic?: Prisma.InputJsonValue;


        @ApiProperty({
            type: `integer`,
            format: `int32`,
        })
        itaxs_id: number;





        @ApiProperty({ type: [itax_tran_log_OnlyParentEntity], required: false})
        itax_tran_log?: itax_tran_log_OnlyParentEntity[];               


        @ApiProperty({ type: [itax_tran_error_log_OnlyParentEntity], required: false})
        itax_tran_error_log?: itax_tran_error_log_OnlyParentEntity[];               


        @ApiProperty({ type: [itax_source_tran_doc_OnlyParentEntity], required: false})
        itax_source_tran_doc?: itax_source_tran_doc_OnlyParentEntity[];               


        @ApiProperty({ type: [itax_source_tran_dtl_OnlyParentEntity], required: false})
        itax_source_tran_dtl?: itax_source_tran_dtl_OnlyParentEntity[];               

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

