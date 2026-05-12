
import { vgph_si } from '@prisma/client';
import { IsEnum,IsOptional } from 'class-validator';
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';


export enum direction_vgph_si{
  OUTBOUND="OUTBOUND",
  INBOUND="INBOUND",
}
export enum process_type_vgph_si{
  OP="OP",
  IR="IR",
  IP="IP",
  OR="OR",
}
export enum tran_category_vgph_si{
  Financial="Financial",
  Non_Financial="Non_Financial",
}
export enum dr_bank_code_type_vgph_si{
  IFSC="IFSC",
  BIC="BIC",
  IBAN="IBAN",
}
export enum cr_bank_code_type_vgph_si{
  IFSC="IFSC",
  BIC="BIC",
  IBAN="IBAN",
}

export class  vgph_siEntity implements vgph_si{
    @ApiProperty({example:"bigint"})
    vgphsi_id:bigint;
    @ApiProperty({example:"string"})
    vgphssi_uuid:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    uuid:string;
    @ApiProperty({enum :direction_vgph_si,enumName:"direction",type:"string"}) 
    direction : direction_vgph_si;
    @ApiProperty({enum :process_type_vgph_si,enumName:"process_type",type:"string"}) 
    process_type : process_type_vgph_si;
    @ApiPropertyOptional({enum :tran_category_vgph_si,enumName:"tran_category",type:"string"}) 
    @IsOptional()
    tran_category : tran_category_vgph_si;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    message_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    channel_name:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    channel_reference:string;
    @Transform(({ value }) => value?.toISOString().split('T')[0])
    @ApiPropertyOptional({example:"decimal"})
    @IsOptional()
    tran_date:Date;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    tran_reference:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    tran_seq_no:string;
    @Transform(({ value }) => value?.toISOString().split('T')[0])
    @ApiPropertyOptional({example:"decimal"})
    @IsOptional()
    value_date:Date;
    @Transform(({ value }) => value?.toISOString().split('T')[0])
    @ApiPropertyOptional({example:"decimal"})
    @IsOptional()
    settlement_date:Date;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    dr_account:string;
    @ApiPropertyOptional({enum :dr_bank_code_type_vgph_si,enumName:"dr_bank_code_type",type:"string"}) 
    @IsOptional()
    dr_bank_code_type : dr_bank_code_type_vgph_si;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    dr_bank_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    dr_name:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    dr_currency:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    cr_account:string;
    @ApiPropertyOptional({enum :cr_bank_code_type_vgph_si,enumName:"cr_bank_code_type",type:"string"}) 
    @IsOptional()
    cr_bank_code_type : cr_bank_code_type_vgph_si;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    cr_bank_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    cr_name:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    cr_currency:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    clr_house_type:string;
    @ApiPropertyOptional({example:"number"})
    @IsOptional()
    min_amount:number;
    @ApiPropertyOptional({example:"number"})
    @IsOptional()
    max_amount:number;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    frequency:string;
    @Transform(({ value }) => value?.toISOString().split('T')[0])
    @ApiPropertyOptional({example:"decimal"})
    @IsOptional()
    start_date:Date;
    @Transform(({ value }) => value?.toISOString().split('T')[0])
    @ApiPropertyOptional({example:"decimal"})
    @IsOptional()
    end_date:Date;
    @Transform(({ value }) => value?.toISOString().split('T')[0])
    @ApiPropertyOptional({example:"decimal"})
    @IsOptional()
    next_pull_date:Date;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    is_active:string;
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
      
export class  vgph_si_OnlyParentEntity {
    @ApiProperty({example:"bigint"})
    vgphsi_id:bigint;
    @ApiProperty({example:"string"})
    vgphssi_uuid:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    uuid:string;
    @ApiProperty({enum :direction_vgph_si,enumName:"direction",type:"string"}) 
    direction : direction_vgph_si;
    @ApiProperty({enum :process_type_vgph_si,enumName:"process_type",type:"string"}) 
    process_type : process_type_vgph_si;
    @ApiPropertyOptional({enum :tran_category_vgph_si,enumName:"tran_category",type:"string"}) 
    @IsOptional()
    tran_category : tran_category_vgph_si;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    message_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    channel_name:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    channel_reference:string;
    @Transform(({ value }) => value?.toISOString().split('T')[0])
    @ApiPropertyOptional({example:"date"})
    @IsOptional()
    tran_date:Date;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    tran_reference:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    tran_seq_no:string;
    @Transform(({ value }) => value?.toISOString().split('T')[0])
    @ApiPropertyOptional({example:"date"})
    @IsOptional()
    value_date:Date;
    @Transform(({ value }) => value?.toISOString().split('T')[0])
    @ApiPropertyOptional({example:"date"})
    @IsOptional()
    settlement_date:Date;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    dr_account:string;
    @ApiPropertyOptional({enum :dr_bank_code_type_vgph_si,enumName:"dr_bank_code_type",type:"string"}) 
    @IsOptional()
    dr_bank_code_type : dr_bank_code_type_vgph_si;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    dr_bank_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    dr_name:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    dr_currency:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    cr_account:string;
    @ApiPropertyOptional({enum :cr_bank_code_type_vgph_si,enumName:"cr_bank_code_type",type:"string"}) 
    @IsOptional()
    cr_bank_code_type : cr_bank_code_type_vgph_si;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    cr_bank_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    cr_name:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    cr_currency:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    clr_house_type:string;
    @ApiPropertyOptional({example:"number"})
    @IsOptional()
    min_amount:number;
    @ApiPropertyOptional({example:"number"})
    @IsOptional()
    max_amount:number;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    frequency:string;
    @Transform(({ value }) => value?.toISOString().split('T')[0])
    @ApiPropertyOptional({example:"date"})
    @IsOptional()
    start_date:Date;
    @Transform(({ value }) => value?.toISOString().split('T')[0])
    @ApiPropertyOptional({example:"date"})
    @IsOptional()
    end_date:Date;
    @Transform(({ value }) => value?.toISOString().split('T')[0])
    @ApiPropertyOptional({example:"date"})
    @IsOptional()
    next_pull_date:Date;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    is_active:string;
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


export { vgph_si };