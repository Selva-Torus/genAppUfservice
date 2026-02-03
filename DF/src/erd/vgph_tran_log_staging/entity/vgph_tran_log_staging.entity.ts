import { vgph_tran_log_staging } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';


export enum direction_vgph_tran_log_staging{
  OUTBOUND="OUTBOUND",
  INBOUND="INBOUND",
}
export enum process_type_vgph_tran_log_staging{
  OP="OP",
  IR="IR",
  IP="IP",
  OR="OR",
}
export enum tran_category_vgph_tran_log_staging{
  Financial="Financial",
  Non_Financial="Non_Financial",
}

export class  vgph_tran_log_stagingEntity implements  vgph_tran_log_staging {
    @ApiProperty({example:"number"})
    vgphtls_id:number;
    @ApiProperty({example:"string"})
    tenant_id:string;
    @ApiProperty({example:"string"})
    product_code:string;
    @ApiProperty({enum :direction_vgph_tran_log_staging,enumName:"direction",type:"string"}) 
    direction : direction_vgph_tran_log_staging;
    @ApiProperty({enum :process_type_vgph_tran_log_staging,enumName:"process_type",type:"string"}) 
    process_type : process_type_vgph_tran_log_staging;
    @ApiProperty({enum :tran_category_vgph_tran_log_staging,enumName:"tran_category",type:"string"}) 
    tran_category : tran_category_vgph_tran_log_staging;
    @ApiProperty({example:"string"})
    process_category:string;
    @ApiProperty({example:"string"})
    processing_system:string;
    @ApiProperty({example:"string"})
    message_code:string;
    @ApiProperty({example:"string"})
    process_code:string;
    @ApiProperty({example:"string"})
    previous_process_code:string;
    @ApiProperty({example:"string"})
    next_process_code:string;
    @ApiProperty({example:"string"})
    flow_code:string;
    @ApiProperty({example:"string"})
    step_code:string;
    @Transform(({ value }) => value?.toISOString().split('T')[0])
    @ApiProperty({example:"date"})
    task_start_time:Date;
    @Transform(({ value }) => value?.toISOString().split('T')[0])
    @ApiProperty({example:"date"})
    task_end_time:Date;
    @ApiProperty({example:"any"})
    source_data:any;
    @ApiProperty({example:"any"})
    request_data:any;
    @ApiProperty({example:"any"})
    response_data:any;
    @ApiProperty({example:"any"})
    message_data:any;
    @Transform(({ value }) => value?.toISOString().split('T')[0])
    @ApiProperty({example:"date"})
    process_start_time:Date;
    @Transform(({ value }) => value?.toISOString().split('T')[0])
    @ApiProperty({example:"date"})
    process_end_time:Date;
    @ApiProperty({example:"string"})
    retry_flag:string;
    @ApiProperty({example:"number"})
    retry_count:number;
    @ApiProperty({example:"string"})
    manual_context:string;
    @ApiProperty({example:"string"})
    action_context:string;
    @ApiProperty({example:"string"})
    status:string;
    @ApiProperty({example:"string"})
    action:string;
    @ApiProperty({example:"string"})
    version:string;
    @ApiProperty({example:"string"})
    vgphsts_uuid:string;
    @ApiProperty()
    vgphsts_id: number;
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
      
export class  vgph_tran_log_staging_OnlyParentEntity {
    @ApiProperty({example:"number"})
    vgphtls_id:number;
    @ApiProperty({example:"string"})
    tenant_id:string;
    @ApiProperty({example:"string"})
    product_code:string;
    @ApiProperty({enum :direction_vgph_tran_log_staging,enumName:"direction",type:"string"}) 
    direction : direction_vgph_tran_log_staging;
    @ApiProperty({enum :process_type_vgph_tran_log_staging,enumName:"process_type",type:"string"}) 
    process_type : process_type_vgph_tran_log_staging;
    @ApiProperty({enum :tran_category_vgph_tran_log_staging,enumName:"tran_category",type:"string"}) 
    tran_category : tran_category_vgph_tran_log_staging;
    @ApiProperty({example:"string"})
    process_category:string;
    @ApiProperty({example:"string"})
    processing_system:string;
    @ApiProperty({example:"string"})
    message_code:string;
    @ApiProperty({example:"string"})
    process_code:string;
    @ApiProperty({example:"string"})
    previous_process_code:string;
    @ApiProperty({example:"string"})
    next_process_code:string;
    @ApiProperty({example:"string"})
    flow_code:string;
    @ApiProperty({example:"string"})
    step_code:string;
    @Transform(({ value }) => value?.toISOString().split('T')[0])
    @ApiProperty({example:"date"})
    task_start_time:Date;
    @Transform(({ value }) => value?.toISOString().split('T')[0])
    @ApiProperty({example:"date"})
    task_end_time:Date;
    @ApiProperty({example:"any"})
    source_data:any;
    @ApiProperty({example:"any"})
    request_data:any;
    @ApiProperty({example:"any"})
    response_data:any;
    @ApiProperty({example:"any"})
    message_data:any;
    @Transform(({ value }) => value?.toISOString().split('T')[0])
    @ApiProperty({example:"date"})
    process_start_time:Date;
    @Transform(({ value }) => value?.toISOString().split('T')[0])
    @ApiProperty({example:"date"})
    process_end_time:Date;
    @ApiProperty({example:"string"})
    retry_flag:string;
    @ApiProperty({example:"number"})
    retry_count:number;
    @ApiProperty({example:"string"})
    manual_context:string;
    @ApiProperty({example:"string"})
    action_context:string;
    @ApiProperty({example:"string"})
    status:string;
    @ApiProperty({example:"string"})
    action:string;
    @ApiProperty({example:"string"})
    version:string;
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


export { vgph_tran_log_staging };