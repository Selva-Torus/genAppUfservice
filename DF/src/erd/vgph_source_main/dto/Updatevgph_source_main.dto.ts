import { Prisma } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum direction_vgph_source_main{
  OUTBOUND="OUTBOUND",
  INBOUND="INBOUND",
}
export enum process_type_vgph_source_main{
  OP="OP",
  IR="IR",
  IP="IP",
  OR="OR",
}
export enum tran_category_vgph_source_main{
  Financial="Financial",
  Non_Financial="Non_Financial",
}
export enum source_category_vgph_source_main{
  API="API",
  FILE="FILE",
}

export class  Updatevgph_source_mainDto {
        @ApiProperty()
        tenant_id?: string;
        @ApiProperty()
        product_code?: string;
        @ApiProperty({enum:direction_vgph_source_main})
        @IsEnum(direction_vgph_source_main)
        direction?: direction_vgph_source_main;
        @ApiProperty({enum:process_type_vgph_source_main})
        @IsEnum(process_type_vgph_source_main)
        process_type?: process_type_vgph_source_main;
        @ApiProperty({enum:tran_category_vgph_source_main})
        @IsEnum(tran_category_vgph_source_main)
        tran_category?: tran_category_vgph_source_main;
        @ApiProperty({enum:source_category_vgph_source_main})
        @IsEnum(source_category_vgph_source_main)
        source_category?: source_category_vgph_source_main;
        @ApiProperty()
        source_reference?: string;
        @ApiProperty()
        source_name?: string;
        @ApiProperty()
        channel_name?: string;
        @ApiProperty()
        channel_reference?: string;
        @ApiProperty()
        product_basic?: Prisma.InputJsonValue;
        @ApiProperty()
        product_additional?: Prisma.InputJsonValue;
        @ApiProperty()
        request_data?: Prisma.InputJsonValue;
        @ApiProperty()
        response_data?: Prisma.InputJsonValue;
        @ApiProperty({
            type: `integer`,
            format: `int32`,
        })
        total_count?: number;
        @ApiProperty({
            type: `number`,
            format: `float`,
        })
        total_amount?: number;
        @ApiProperty()
        currency?: string;
        @ApiProperty()
        uuid?: string;


























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
        trs_sub_org_code?: string;
        @ApiProperty()
        trs_sub_org_grp_code?: string;

}

