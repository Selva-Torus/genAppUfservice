
import { vgph_destination_tran_main } from '@prisma/client';
import { IsEnum,IsOptional } from 'class-validator';
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';
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

export class  vgph_destination_tran_mainEntity implements vgph_destination_tran_main{
    @ApiProperty({example:"bigint"})
    vgphdtm_id:bigint;
    @ApiProperty({enum :direction_vgph_destination_tran_main,enumName:"direction",type:"string"}) 
    direction : direction_vgph_destination_tran_main;
    @ApiProperty({enum :process_type_vgph_destination_tran_main,enumName:"process_type",type:"string"}) 
    process_type : process_type_vgph_destination_tran_main;
    @ApiProperty({example:"string"})
    tran_category:string;
    @ApiProperty({example:"string"})
    vgphdm_uuid:string;
    @ApiProperty({example:"string"})
    vgphstm_uuid:string;
    @ApiPropertyOptional({example:"bigint"})
    @IsOptional()
    vgphstm_id:bigint;
    @ApiPropertyOptional({example:"bigint"})
    @IsOptional()
    vgphdm_id:bigint;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    destination_content:string;
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
}
      
export class  vgph_destination_tran_main_OnlyParentEntity {
    @ApiProperty({example:"bigint"})
    vgphdtm_id:bigint;
    @ApiProperty({enum :direction_vgph_destination_tran_main,enumName:"direction",type:"string"}) 
    direction : direction_vgph_destination_tran_main;
    @ApiProperty({enum :process_type_vgph_destination_tran_main,enumName:"process_type",type:"string"}) 
    process_type : process_type_vgph_destination_tran_main;
    @ApiProperty({example:"string"})
    tran_category:string;
    @ApiProperty({example:"string"})
    vgphdm_uuid:string;
    @ApiProperty({example:"string"})
    vgphstm_uuid:string;
    @ApiPropertyOptional({example:"bigint"})
    @IsOptional()
    vgphstm_id:bigint;
    @ApiPropertyOptional({example:"bigint"})
    @IsOptional()
    vgphdm_id:bigint;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    destination_content:string;
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
}


export { vgph_destination_tran_main };