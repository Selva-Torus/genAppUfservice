import { Prisma } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum direction_vgph_destination_tran_staging{
  OUTBOUND="OUTBOUND",
  INBOUND="INBOUND",
}
export enum process_type_vgph_destination_tran_staging{
  OP="OP",
  IR="IR",
  IP="IP",
  OR="OR",
}
export enum tran_category_vgph_destination_tran_staging{
  Financial="Financial",
  Non_Financial="Non_Financial",
}

export class  Updatevgph_destination_tran_stagingDto {
        @ApiProperty()
        tenant_id?: string;
        @ApiProperty()
        product_code?: string;
        @ApiProperty({enum:direction_vgph_destination_tran_staging})
        @IsEnum(direction_vgph_destination_tran_staging)
        direction?: direction_vgph_destination_tran_staging;
        @ApiProperty({enum:process_type_vgph_destination_tran_staging})
        @IsEnum(process_type_vgph_destination_tran_staging)
        process_type?: process_type_vgph_destination_tran_staging;
        @ApiProperty({enum:tran_category_vgph_destination_tran_staging})
        @IsEnum(tran_category_vgph_destination_tran_staging)
        tran_category?: tran_category_vgph_destination_tran_staging;
        @ApiProperty()
        vgphds_uuid?: string;
        @ApiProperty()
        vgphsts_uuid?: string;


















        @ApiProperty({
            type: `integer`,
            format: `int32`,
        })
        vgphsts_id: number;






        @ApiProperty({
            type: `integer`,
            format: `int32`,
        })
        vgphds_id: number;


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

