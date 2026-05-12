
import { vgph_source_tran_staging } from '@prisma/client';
import { IsEnum,IsOptional } from 'class-validator';
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';


export enum direction_vgph_source_tran_staging{
  OUTBOUND="OUTBOUND",
  INBOUND="INBOUND",
}
export enum process_type_vgph_source_tran_staging{
  OP="OP",
  IR="IR",
  IP="IP",
  OR="OR",
}

export class  vgph_source_tran_stagingEntity implements vgph_source_tran_staging{
    @ApiProperty({example:"bigint"})
    vgphsts_id:bigint;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    parent_vgphsts_uuid:string;
    @ApiProperty({enum :direction_vgph_source_tran_staging,enumName:"direction",type:"string"}) 
    direction : direction_vgph_source_tran_staging;
    @ApiProperty({enum :process_type_vgph_source_tran_staging,enumName:"process_type",type:"string"}) 
    process_type : process_type_vgph_source_tran_staging;
    @ApiProperty({example:"string"})
    tran_category:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    message_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    channel_name:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    channel_reference:string;
    @Transform(({ value }) => value?.toISOString())
    @ApiProperty({example:"datetime"})
    tran_date:Date;
    @ApiPropertyOptional({example:"any"})
    @IsOptional()
    product_basic:any;
    @ApiPropertyOptional({example:"any"})
    @IsOptional()
    product_additional:any;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    uuid:string;
    @ApiProperty({example:"string"})
    vgphss_uuid:string;
    @ApiPropertyOptional({example:"any"})
    @IsOptional()
    product_common:any;
    @ApiPropertyOptional({example:"bigint"})
    @IsOptional()
    vgphss_id:bigint;
    @ApiPropertyOptional({example:"bigint"})
    @IsOptional()
    prcts_id:bigint;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    source_content:string;
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
      
export class  vgph_source_tran_staging_OnlyParentEntity {
    @ApiProperty({example:"bigint"})
    vgphsts_id:bigint;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    parent_vgphsts_uuid:string;
    @ApiProperty({enum :direction_vgph_source_tran_staging,enumName:"direction",type:"string"}) 
    direction : direction_vgph_source_tran_staging;
    @ApiProperty({enum :process_type_vgph_source_tran_staging,enumName:"process_type",type:"string"}) 
    process_type : process_type_vgph_source_tran_staging;
    @ApiProperty({example:"string"})
    tran_category:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    message_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    channel_name:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    channel_reference:string;
    @Transform(({ value }) => value?.toISOString())
    @ApiProperty({example:"datetime"})
    tran_date:Date;
    @ApiPropertyOptional({example:"any"})
    @IsOptional()
    product_basic:any;
    @ApiPropertyOptional({example:"any"})
    @IsOptional()
    product_additional:any;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    uuid:string;
    @ApiProperty({example:"string"})
    vgphss_uuid:string;
    @ApiPropertyOptional({example:"any"})
    @IsOptional()
    product_common:any;
    @ApiPropertyOptional({example:"bigint"})
    @IsOptional()
    vgphss_id:bigint;
    @ApiPropertyOptional({example:"bigint"})
    @IsOptional()
    prcts_id:bigint;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    source_content:string;
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


export { vgph_source_tran_staging };