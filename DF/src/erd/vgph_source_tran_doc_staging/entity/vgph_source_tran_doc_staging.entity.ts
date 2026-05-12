
import { vgph_source_tran_doc_staging } from '@prisma/client';
import { IsEnum,IsOptional } from 'class-validator';
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';


export enum category_vgph_source_tran_doc_staging{
  front="front",
  back="back",
}
export enum doc_type_vgph_source_tran_doc_staging{
  tiff="tiff",
  jpg="jpg",
  uv="uv",
  color="color",
}
export enum doc_group_vgph_source_tran_doc_staging{
  cheque="cheque",
  doc="doc",
  id_proof="id_proof",
  addr_proof="addr_proof",
}

export class  vgph_source_tran_doc_stagingEntity implements vgph_source_tran_doc_staging{
    @ApiProperty({example:"bigint"})
    vgphstds_id:bigint;
    @ApiProperty({example:"string"})
    vgphsts_uuid:string;
    @ApiProperty({enum :category_vgph_source_tran_doc_staging,enumName:"category",type:"string"}) 
    category : category_vgph_source_tran_doc_staging;
    @ApiPropertyOptional({enum :doc_type_vgph_source_tran_doc_staging,enumName:"doc_type",type:"string"}) 
    @IsOptional()
    doc_type : doc_type_vgph_source_tran_doc_staging;
    @ApiPropertyOptional({enum :doc_group_vgph_source_tran_doc_staging,enumName:"doc_group",type:"string"}) 
    @IsOptional()
    doc_group : doc_group_vgph_source_tran_doc_staging;
    @ApiProperty({example:"string"})
    doc_name:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    url:string;
    @ApiPropertyOptional({example:"any"})
    @IsOptional()
    doc_additional:any;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    doc_content_text:string;
    @ApiPropertyOptional({
      type: 'string',
      format: 'binary',
      description: 'Raw byte data',
    })
    @IsOptional()
    doc_content_byte:Uint8Array<ArrayBuffer>;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    doc_size:string;
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
      
export class  vgph_source_tran_doc_staging_OnlyParentEntity {
    @ApiProperty({example:"bigint"})
    vgphstds_id:bigint;
    @ApiProperty({example:"string"})
    vgphsts_uuid:string;
    @ApiProperty({enum :category_vgph_source_tran_doc_staging,enumName:"category",type:"string"}) 
    category : category_vgph_source_tran_doc_staging;
    @ApiPropertyOptional({enum :doc_type_vgph_source_tran_doc_staging,enumName:"doc_type",type:"string"}) 
    @IsOptional()
    doc_type : doc_type_vgph_source_tran_doc_staging;
    @ApiPropertyOptional({enum :doc_group_vgph_source_tran_doc_staging,enumName:"doc_group",type:"string"}) 
    @IsOptional()
    doc_group : doc_group_vgph_source_tran_doc_staging;
    @ApiProperty({example:"string"})
    doc_name:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    url:string;
    @ApiPropertyOptional({example:"any"})
    @IsOptional()
    doc_additional:any;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    doc_content_text:string;
    @ApiPropertyOptional({
      type: 'string',
      format: 'binary',
      description: 'Raw byte data',
    })
    @IsOptional()
    doc_content_byte:Uint8Array<ArrayBuffer>;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    doc_size:string;
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


export { vgph_source_tran_doc_staging };