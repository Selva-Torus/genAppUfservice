import { vgph_source_staging } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';


export enum direction_vgph_source_staging{
  OUTBOUND="OUTBOUND",
  INBOUND="INBOUND",
}
export enum process_type_vgph_source_staging{
  OP="OP",
  IR="IR",
  IP="IP",
  OR="OR",
}
export enum tran_category_vgph_source_staging{
  Financial="Financial",
  Non_Financial="Non_Financial",
}
export enum source_category_vgph_source_staging{
  API="API",
  FILE="FILE",
}

export class  vgph_source_stagingEntity implements  vgph_source_staging {
    @ApiProperty({example:"number"})
    vgphss_id:number;
    @ApiProperty({example:"string"})
    tenant_id:string;
    @ApiProperty({example:"string"})
    product_code:string;
    @ApiProperty({enum :direction_vgph_source_staging,enumName:"direction",type:"string"}) 
    direction : direction_vgph_source_staging;
    @ApiProperty({enum :process_type_vgph_source_staging,enumName:"process_type",type:"string"}) 
    process_type : process_type_vgph_source_staging;
    @ApiProperty({enum :tran_category_vgph_source_staging,enumName:"tran_category",type:"string"}) 
    tran_category : tran_category_vgph_source_staging;
    @ApiProperty({enum :source_category_vgph_source_staging,enumName:"source_category",type:"string"}) 
    source_category : source_category_vgph_source_staging;
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
      
export class  vgph_source_staging_OnlyParentEntity {
    @ApiProperty({example:"number"})
    vgphss_id:number;
    @ApiProperty({example:"string"})
    tenant_id:string;
    @ApiProperty({example:"string"})
    product_code:string;
    @ApiProperty({enum :direction_vgph_source_staging,enumName:"direction",type:"string"}) 
    direction : direction_vgph_source_staging;
    @ApiProperty({enum :process_type_vgph_source_staging,enumName:"process_type",type:"string"}) 
    process_type : process_type_vgph_source_staging;
    @ApiProperty({enum :tran_category_vgph_source_staging,enumName:"tran_category",type:"string"}) 
    tran_category : tran_category_vgph_source_staging;
    @ApiProperty({enum :source_category_vgph_source_staging,enumName:"source_category",type:"string"}) 
    source_category : source_category_vgph_source_staging;
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


export { vgph_source_staging };