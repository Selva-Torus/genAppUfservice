import { Prisma } from '@prisma/client';
import { IsEnum,IsOptional } from 'class-validator';
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';

import { itax_source_tran_OnlyParentEntity} from 'src/erd/itax_source_tran/entity/itax_source_tran.entity';          

import { itax_source_tran_credit_approval_OnlyParentEntity} from 'src/erd/itax_source_tran_credit_approval/entity/itax_source_tran_credit_approval.entity';          

import { itax_source_tran_payment_OnlyParentEntity} from 'src/erd/itax_source_tran_payment/entity/itax_source_tran_payment.entity';          

export enum tran_category_itax_source{
  Financial="Financial",
  Non_Financial="Non_Financial",
}
export enum source_category_itax_source{
  API="API",
  FILE="FILE",
}

export class  Updateitax_sourceDto {
        @ApiPropertyOptional({enum:tran_category_itax_source})
        @IsEnum(tran_category_itax_source)
        @IsOptional()
        tran_category?: tran_category_itax_source;
        @ApiPropertyOptional({enum:source_category_itax_source})
        @IsEnum(source_category_itax_source)
        @IsOptional()
        source_category?: source_category_itax_source;
        @ApiPropertyOptional()
        @IsOptional()
        source_reference?: string;
        @ApiPropertyOptional()
        @IsOptional()
        source_name?: string;
        @ApiPropertyOptional()
        @IsOptional()
        request_data?: Prisma.InputJsonValue;
        @ApiPropertyOptional()
        @IsOptional()
        response_data?: Prisma.InputJsonValue;

        @ApiProperty({ type: [itax_source_tran_OnlyParentEntity], required: false})
        itax_source_tran?: itax_source_tran_OnlyParentEntity[];               


        @ApiProperty({ type: [itax_source_tran_credit_approval_OnlyParentEntity], required: false})
        itax_source_tran_credit_approval?: itax_source_tran_credit_approval_OnlyParentEntity[];               


        @ApiProperty({ type: [itax_source_tran_payment_OnlyParentEntity], required: false})
        itax_source_tran_payment?: itax_source_tran_payment_OnlyParentEntity[];               









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

}

