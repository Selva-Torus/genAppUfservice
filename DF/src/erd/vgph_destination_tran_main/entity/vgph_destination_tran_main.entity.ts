import { vgph_destination_tran_main } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';


export enum direction_vgph_destination_tran_main{
  OUTBOUND="OUTBOUND",
  INBOUND="INBOUND",
}
export enum process_type_vgph_destination_tran_main{
  OP="OP",
  IR="IR",
  IP="IP",
  OR="OR",
}
export enum tran_category_vgph_destination_tran_main{
  Financial="Financial",
  Non_Financial="Non_Financial",
}

export class  vgph_destination_tran_mainEntity implements  vgph_destination_tran_main {
    @ApiProperty({example:"number"})
    vgphdtm_id:number;
    @ApiProperty({example:"string"})
    tenant_id:string;
    @ApiProperty({example:"string"})
    product_code:string;
    @ApiProperty({enum :direction_vgph_destination_tran_main,enumName:"direction",type:"string"}) 
    direction : direction_vgph_destination_tran_main;
    @ApiProperty({enum :process_type_vgph_destination_tran_main,enumName:"process_type",type:"string"}) 
    process_type : process_type_vgph_destination_tran_main;
    @ApiProperty({enum :tran_category_vgph_destination_tran_main,enumName:"tran_category",type:"string"}) 
    tran_category : tran_category_vgph_destination_tran_main;
    @ApiProperty({example:"string"})
    vgphdm_uuid:string;
    @ApiProperty({example:"string"})
    vgphstm_uuid:string;
    @ApiProperty()
    vgphstm_id: number;
    @ApiProperty()
    vgphdm_id: number;
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
      
export class  vgph_destination_tran_main_OnlyParentEntity {
    @ApiProperty({example:"number"})
    vgphdtm_id:number;
    @ApiProperty({example:"string"})
    tenant_id:string;
    @ApiProperty({example:"string"})
    product_code:string;
    @ApiProperty({enum :direction_vgph_destination_tran_main,enumName:"direction",type:"string"}) 
    direction : direction_vgph_destination_tran_main;
    @ApiProperty({enum :process_type_vgph_destination_tran_main,enumName:"process_type",type:"string"}) 
    process_type : process_type_vgph_destination_tran_main;
    @ApiProperty({enum :tran_category_vgph_destination_tran_main,enumName:"tran_category",type:"string"}) 
    tran_category : tran_category_vgph_destination_tran_main;
    @ApiProperty({example:"string"})
    vgphdm_uuid:string;
    @ApiProperty({example:"string"})
    vgphstm_uuid:string;
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


export { vgph_destination_tran_main };