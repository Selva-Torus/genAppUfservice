import { itax_source } from '@prisma/client';
import { IsEnum,IsOptional } from 'class-validator';
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { itax_source_tran_OnlyParentEntity } from '../../itax_source_tran/entity/itax_source_tran.entity';            
import { itax_source_tran_credit_approval_OnlyParentEntity } from '../../itax_source_tran_credit_approval/entity/itax_source_tran_credit_approval.entity';            
import { itax_source_tran_payment_OnlyParentEntity } from '../../itax_source_tran_payment/entity/itax_source_tran_payment.entity';            


export enum tran_category_itax_source{
  Financial="Financial",
  Non_Financial="Non_Financial",
}
export enum source_category_itax_source{
  API="API",
  FILE="FILE",
}

export class  itax_sourceEntity implements itax_source{
    @ApiProperty({example:"number"})
    itaxs_id:number;
    @ApiPropertyOptional({enum :tran_category_itax_source,enumName:"tran_category",type:"string"}) 
    @IsOptional()
    tran_category : tran_category_itax_source;
    @ApiPropertyOptional({enum :source_category_itax_source,enumName:"source_category",type:"string"}) 
    @IsOptional()
    source_category : source_category_itax_source;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    source_reference:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    source_name:string;
    @ApiPropertyOptional({example:"any"})
    @IsOptional()
    request_data:any;
    @ApiPropertyOptional({example:"any"})
    @IsOptional()
    response_data:any;
    @ApiProperty({ type: [itax_source_tran_OnlyParentEntity], required: false})
    itax_source_tran?: itax_source_tran_OnlyParentEntity[];               
    @ApiProperty({ type: [itax_source_tran_credit_approval_OnlyParentEntity], required: false})
    itax_source_tran_credit_approval?: itax_source_tran_credit_approval_OnlyParentEntity[];               
    @ApiProperty({ type: [itax_source_tran_payment_OnlyParentEntity], required: false})
    itax_source_tran_payment?: itax_source_tran_payment_OnlyParentEntity[];               
    @Transform(({ value }) => value?.toISOString())
    @ApiPropertyOptional({example:"datetime"})
    @IsOptional()
    trs_created_date: Date;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_created_by: string;
    @Transform(({ value }) => value?.toISOString())
    @ApiPropertyOptional({example:"datetime"})
    @IsOptional()
    trs_modified_date: Date;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_modified_by: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_process_id: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_access_profile: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_org_grp_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_org_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_role_grp_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_role_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_ps_grp_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_ps_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_sub_org_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_sub_org_grp_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_locked_by: string;
    @Transform(({ value }) => value?.toISOString())
    @ApiPropertyOptional({example:"datetime"})
    @IsOptional()
    trs_locked_time: Date;
    @ApiProperty({example:"string"})
    trs_tenant_id: string;
    @ApiProperty({example:"string"})
    trs_app_code: string;
    @ApiProperty({example:"string"})
    trs_product_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_event_process_status: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_event_status: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_token_id: string;
}
      
export class  itax_source_OnlyParentEntity {
    @ApiProperty({example:"number"})
    itaxs_id:number;
    @ApiPropertyOptional({enum :tran_category_itax_source,enumName:"tran_category",type:"string"}) 
    @IsOptional()
    tran_category : tran_category_itax_source;
    @ApiPropertyOptional({enum :source_category_itax_source,enumName:"source_category",type:"string"}) 
    @IsOptional()
    source_category : source_category_itax_source;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    source_reference:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    source_name:string;
    @ApiPropertyOptional({example:"any"})
    @IsOptional()
    request_data:any;
    @ApiPropertyOptional({example:"any"})
    @IsOptional()
    response_data:any;
    @Transform(({ value }) => value?.toISOString())
    @ApiPropertyOptional({example:"datetime"})
    @IsOptional()
    trs_created_date: Date;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_created_by: string;
    @Transform(({ value }) => value?.toISOString())
    @ApiPropertyOptional({example:"datetime"})
    @IsOptional()
    trs_modified_date: Date;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_modified_by: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_process_id: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_access_profile: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_org_grp_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_org_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_role_grp_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_role_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_ps_grp_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_ps_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_sub_org_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_sub_org_grp_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_locked_by: string;
    @Transform(({ value }) => value?.toISOString())
    @ApiPropertyOptional({example:"datetime"})
    @IsOptional()
    trs_locked_time: Date;
    @ApiProperty({example:"string"})
    trs_tenant_id: string;
    @ApiProperty({example:"string"})
    trs_app_code: string;
    @ApiProperty({example:"string"})
    trs_product_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_event_process_status: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_event_status: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_token_id: string;
}


export { itax_source };