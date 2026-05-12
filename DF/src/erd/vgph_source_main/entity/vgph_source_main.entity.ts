
import { vgph_source_main } from '@prisma/client';
import { IsEnum,IsOptional } from 'class-validator';
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';
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

export class  vgph_source_mainEntity implements vgph_source_main{
    @ApiProperty({example:"bigint"})
    vgphsm_id:bigint;
    @ApiProperty({enum :direction_vgph_source_main,enumName:"direction",type:"string"}) 
    direction : direction_vgph_source_main;
    @ApiProperty({enum :process_type_vgph_source_main,enumName:"process_type",type:"string"}) 
    process_type : process_type_vgph_source_main;
    @ApiProperty({example:"string"})
    tran_category:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    source_category:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    source_reference:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    source_name:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    channel_name:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    channel_reference:string;
    @ApiPropertyOptional({example:"any"})
    @IsOptional()
    product_basic:any;
    @ApiPropertyOptional({example:"any"})
    @IsOptional()
    product_additional:any;
    @ApiPropertyOptional({example:"any"})
    @IsOptional()
    request_data:any;
    @ApiPropertyOptional({example:"any"})
    @IsOptional()
    response_data:any;
    @ApiPropertyOptional({example:"number"})
    @IsOptional()
    total_count:number;
    @ApiPropertyOptional({example:"number"})
    @IsOptional()
    total_amount:number;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    currency:string;
    @ApiProperty({example:"string"})
    uuid:string;
    @Transform(({ value }) => value?.toISOString())
    @ApiProperty({example:"datetime"})
    trs_created_date:Date;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_created_by:string;
    @Transform(({ value }) => value?.toISOString())
    @ApiPropertyOptional({example:"datetime"})
    @IsOptional()
    trs_modified_date:Date;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_modified_by:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_process_id:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_access_profile:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_org_grp_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_org_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_role_grp_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_role_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_ps_grp_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_ps_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_sub_org_grp_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_sub_org_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_locked_by:string;
    @Transform(({ value }) => value?.toISOString())
    @ApiPropertyOptional({example:"datetime"})
    @IsOptional()
    trs_locked_time:Date;
    @ApiProperty({example:"string"})
    trs_tenant_id:string;
    @ApiProperty({example:"string"})
    trs_app_code:string;
    @ApiProperty({example:"string"})
    trs_product_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_event_process_status:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_event_status:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_token_id:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_version:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_prev_process_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_prev_status:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_prev_process_status:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_process_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_status:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_process_status:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_next_process_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_next_status:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_next_process_status:string;
}
      
export class  vgph_source_main_OnlyParentEntity {
    @ApiProperty({example:"bigint"})
    vgphsm_id:bigint;
    @ApiProperty({enum :direction_vgph_source_main,enumName:"direction",type:"string"}) 
    direction : direction_vgph_source_main;
    @ApiProperty({enum :process_type_vgph_source_main,enumName:"process_type",type:"string"}) 
    process_type : process_type_vgph_source_main;
    @ApiProperty({example:"string"})
    tran_category:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    source_category:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    source_reference:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    source_name:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    channel_name:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    channel_reference:string;
    @ApiPropertyOptional({example:"any"})
    @IsOptional()
    product_basic:any;
    @ApiPropertyOptional({example:"any"})
    @IsOptional()
    product_additional:any;
    @ApiPropertyOptional({example:"any"})
    @IsOptional()
    request_data:any;
    @ApiPropertyOptional({example:"any"})
    @IsOptional()
    response_data:any;
    @ApiPropertyOptional({example:"number"})
    @IsOptional()
    total_count:number;
    @ApiPropertyOptional({example:"number"})
    @IsOptional()
    total_amount:number;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    currency:string;
    @ApiProperty({example:"string"})
    uuid:string;
    @Transform(({ value }) => value?.toISOString())
    @ApiProperty({example:"datetime"})
    trs_created_date:Date;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_created_by:string;
    @Transform(({ value }) => value?.toISOString())
    @ApiPropertyOptional({example:"datetime"})
    @IsOptional()
    trs_modified_date:Date;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_modified_by:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_process_id:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_access_profile:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_org_grp_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_org_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_role_grp_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_role_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_ps_grp_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_ps_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_sub_org_grp_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_sub_org_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_locked_by:string;
    @Transform(({ value }) => value?.toISOString())
    @ApiPropertyOptional({example:"datetime"})
    @IsOptional()
    trs_locked_time:Date;
    @ApiProperty({example:"string"})
    trs_tenant_id:string;
    @ApiProperty({example:"string"})
    trs_app_code:string;
    @ApiProperty({example:"string"})
    trs_product_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_event_process_status:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_event_status:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_token_id:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_version:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_prev_process_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_prev_status:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_prev_process_status:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_process_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_status:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_process_status:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_next_process_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_next_status:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_next_process_status:string;
}


export { vgph_source_main };