import { vgph_source_main } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';


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

export class  vgph_source_mainEntity implements  vgph_source_main {
    @ApiProperty({example:"number"})
    vgphsm_id:number;
    @ApiProperty({example:"string"})
    tenant_id:string;
    @ApiProperty({example:"string"})
    product_code:string;
    @ApiProperty({enum :direction_vgph_source_main,enumName:"direction",type:"string"}) 
    direction : direction_vgph_source_main;
    @ApiProperty({enum :process_type_vgph_source_main,enumName:"process_type",type:"string"}) 
    process_type : process_type_vgph_source_main;
    @ApiProperty({enum :tran_category_vgph_source_main,enumName:"tran_category",type:"string"}) 
    tran_category : tran_category_vgph_source_main;
    @ApiProperty({enum :source_category_vgph_source_main,enumName:"source_category",type:"string"}) 
    source_category : source_category_vgph_source_main;
    @ApiProperty({example:"string"})
    source_reference:string;
    @ApiProperty({example:"string"})
    source_name:string;
    @ApiProperty({example:"string"})
    channel_name:string;
    @ApiProperty({example:"string"})
    channel_reference:string;
    @ApiProperty({example:"any"})
    product_basic:any;
    @ApiProperty({example:"any"})
    product_additional:any;
    @ApiProperty({example:"any"})
    request_data:any;
    @ApiProperty({example:"any"})
    response_data:any;
    @ApiProperty({example:"number"})
    total_count:number;
    @ApiProperty({example:"number"})
    total_amount:number;
    @ApiProperty({example:"string"})
    currency:string;
    @ApiProperty({example:"string"})
    uuid:string;
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
      
export class  vgph_source_main_OnlyParentEntity {
    @ApiProperty({example:"number"})
    vgphsm_id:number;
    @ApiProperty({example:"string"})
    tenant_id:string;
    @ApiProperty({example:"string"})
    product_code:string;
    @ApiProperty({enum :direction_vgph_source_main,enumName:"direction",type:"string"}) 
    direction : direction_vgph_source_main;
    @ApiProperty({enum :process_type_vgph_source_main,enumName:"process_type",type:"string"}) 
    process_type : process_type_vgph_source_main;
    @ApiProperty({enum :tran_category_vgph_source_main,enumName:"tran_category",type:"string"}) 
    tran_category : tran_category_vgph_source_main;
    @ApiProperty({enum :source_category_vgph_source_main,enumName:"source_category",type:"string"}) 
    source_category : source_category_vgph_source_main;
    @ApiProperty({example:"string"})
    source_reference:string;
    @ApiProperty({example:"string"})
    source_name:string;
    @ApiProperty({example:"string"})
    channel_name:string;
    @ApiProperty({example:"string"})
    channel_reference:string;
    @ApiProperty({example:"any"})
    product_basic:any;
    @ApiProperty({example:"any"})
    product_additional:any;
    @ApiProperty({example:"any"})
    request_data:any;
    @ApiProperty({example:"any"})
    response_data:any;
    @ApiProperty({example:"number"})
    total_count:number;
    @ApiProperty({example:"number"})
    total_amount:number;
    @ApiProperty({example:"string"})
    currency:string;
    @ApiProperty({example:"string"})
    uuid:string;
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


export { vgph_source_main };