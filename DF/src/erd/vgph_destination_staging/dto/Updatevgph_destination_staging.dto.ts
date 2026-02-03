import { Prisma } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum direction_vgph_destination_staging{
  OUTBOUND="OUTBOUND",
  INBOUND="INBOUND",
}
export enum process_type_vgph_destination_staging{
  OP="OP",
  IR="IR",
  IP="IP",
  OR="OR",
}
export enum tran_category_vgph_destination_staging{
  Financial="Financial",
  Non_Financial="Non_Financial",
}
export enum destination_category_vgph_destination_staging{
  QUEUE="QUEUE",
  API="API",
  FILE="FILE",
}

export class  Updatevgph_destination_stagingDto {
        @ApiProperty()
        tenant_id?: string;
        @ApiProperty()
        product_code?: string;
        @ApiProperty({enum:direction_vgph_destination_staging})
        @IsEnum(direction_vgph_destination_staging)
        direction?: direction_vgph_destination_staging;
        @ApiProperty({enum:process_type_vgph_destination_staging})
        @IsEnum(process_type_vgph_destination_staging)
        process_type?: process_type_vgph_destination_staging;
        @ApiProperty({enum:tran_category_vgph_destination_staging})
        @IsEnum(tran_category_vgph_destination_staging)
        tran_category?: tran_category_vgph_destination_staging;
        @ApiProperty()
        message_code?: string;
        @ApiProperty({enum:destination_category_vgph_destination_staging})
        @IsEnum(destination_category_vgph_destination_staging)
        destination_category?: destination_category_vgph_destination_staging;
        @ApiProperty()
        destination_reference?: string;
        @ApiProperty()
        destination_name?: string;
        @ApiProperty()
        destination_parent_name?: string;
        @ApiProperty()
        destionation_status?: string;
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

