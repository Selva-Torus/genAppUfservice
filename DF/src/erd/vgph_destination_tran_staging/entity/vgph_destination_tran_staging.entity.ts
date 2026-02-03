import { vgph_destination_tran_staging } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';


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

export class  vgph_destination_tran_stagingEntity implements  vgph_destination_tran_staging {
    @ApiProperty({example:"number"})
    vgphdts_id:number;
    @ApiProperty({example:"string"})
    tenant_id:string;
    @ApiProperty({example:"string"})
    product_code:string;
    @ApiProperty({enum :direction_vgph_destination_tran_staging,enumName:"direction",type:"string"}) 
    direction : direction_vgph_destination_tran_staging;
    @ApiProperty({enum :process_type_vgph_destination_tran_staging,enumName:"process_type",type:"string"}) 
    process_type : process_type_vgph_destination_tran_staging;
    @ApiProperty({enum :tran_category_vgph_destination_tran_staging,enumName:"tran_category",type:"string"}) 
    tran_category : tran_category_vgph_destination_tran_staging;
    @ApiProperty({example:"string"})
    vgphds_uuid:string;
    @ApiProperty({example:"string"})
    vgphsts_uuid:string;
    @ApiProperty()
    vgphsts_id: number;
    @ApiProperty()
    vgphds_id: number;
    @Transform(({ value }) => value?.toISOString())
    @ApiProperty({example:"datetime"})
    trs_created_date: Date;
    @ApiProperty({example:"string"})
    trs_created_by: string;
    @Transform(({ value }) => value?.toISOString())
    @ApiProperty({example:"datetime"})
    trs_modified_date: Date;
    @ApiProperty({example:"string"})
    trs_modified_by: string;
    @ApiProperty({example:"string"})
    trs_status: string;
    @ApiProperty({example:"string"})
    trs_next_status: string;
    @ApiProperty({example:"string"})
    trs_process_id: string;
    @ApiProperty({example:"string"})
    trs_access_profile: string;
    @ApiProperty({example:"string"})
    trs_org_grp_code: string;
    @ApiProperty({example:"string"})
    trs_org_code: string;
    @ApiProperty({example:"string"})
    trs_role_grp_code: string;
    @ApiProperty({example:"string"})
    trs_role_code: string;
    @ApiProperty({example:"string"})
    trs_ps_grp_code: string;
    @ApiProperty({example:"string"})
    trs_ps_code: string;
    @ApiProperty({example:"string"})
    trs_sub_org_code: string;
    @ApiProperty({example:"string"})
    trs_sub_org_grp_code: string;
}
      
export class  vgph_destination_tran_staging_OnlyParentEntity {
    @ApiProperty({example:"number"})
    vgphdts_id:number;
    @ApiProperty({example:"string"})
    tenant_id:string;
    @ApiProperty({example:"string"})
    product_code:string;
    @ApiProperty({enum :direction_vgph_destination_tran_staging,enumName:"direction",type:"string"}) 
    direction : direction_vgph_destination_tran_staging;
    @ApiProperty({enum :process_type_vgph_destination_tran_staging,enumName:"process_type",type:"string"}) 
    process_type : process_type_vgph_destination_tran_staging;
    @ApiProperty({enum :tran_category_vgph_destination_tran_staging,enumName:"tran_category",type:"string"}) 
    tran_category : tran_category_vgph_destination_tran_staging;
    @ApiProperty({example:"string"})
    vgphds_uuid:string;
    @ApiProperty({example:"string"})
    vgphsts_uuid:string;
    @Transform(({ value }) => value?.toISOString())
    @ApiProperty({example:"datetime"})
    trs_created_date: Date;
    @ApiProperty({example:"string"})
    trs_created_by: string;
    @Transform(({ value }) => value?.toISOString())
    @ApiProperty({example:"datetime"})
    trs_modified_date: Date;
    @ApiProperty({example:"string"})
    trs_modified_by: string;
    @ApiProperty({example:"string"})
    trs_status: string;
    @ApiProperty({example:"string"})
    trs_next_status: string;
    @ApiProperty({example:"string"})
    trs_process_id: string;
    @ApiProperty({example:"string"})
    trs_access_profile: string;
    @ApiProperty({example:"string"})
    trs_org_grp_code: string;
    @ApiProperty({example:"string"})
    trs_org_code: string;
    @ApiProperty({example:"string"})
    trs_role_grp_code: string;
    @ApiProperty({example:"string"})
    trs_role_code: string;
    @ApiProperty({example:"string"})
    trs_ps_grp_code: string;
    @ApiProperty({example:"string"})
    trs_ps_code: string;
    @ApiProperty({example:"string"})
    trs_sub_org_code: string;
    @ApiProperty({example:"string"})
    trs_sub_org_grp_code: string;
}


export { vgph_destination_tran_staging };