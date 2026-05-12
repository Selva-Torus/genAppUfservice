
import { vgph_charge_config } from '@prisma/client';
import { IsEnum,IsOptional } from 'class-validator';
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';



export class  vgph_charge_configEntity implements vgph_charge_config{
    @ApiProperty({example:"bigint"})
    vgphcc_id:bigint;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    channel_name:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    cust_segment:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    customer_type:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    cif_number:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    customer_account_no:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    message_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    charge_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    charge_borne_by:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    charge_gl_ac_no:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    vat_gl_ac_no:string;
    @Transform(({ value }) => value?.toISOString())
    @ApiProperty({example:"datetime"})
    start_active_date:Date;
    @Transform(({ value }) => value?.toISOString())
    @ApiProperty({example:"datetime"})
    end_active_date:Date;
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
      
export class  vgph_charge_config_OnlyParentEntity {
    @ApiProperty({example:"bigint"})
    vgphcc_id:bigint;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    channel_name:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    cust_segment:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    customer_type:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    cif_number:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    customer_account_no:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    message_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    charge_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    charge_borne_by:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    charge_gl_ac_no:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    vat_gl_ac_no:string;
    @Transform(({ value }) => value?.toISOString())
    @ApiProperty({example:"datetime"})
    start_active_date:Date;
    @Transform(({ value }) => value?.toISOString())
    @ApiProperty({example:"datetime"})
    end_active_date:Date;
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


export { vgph_charge_config };