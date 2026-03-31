import { itax_source_tran_dtl } from '@prisma/client';
import { IsEnum,IsOptional } from 'class-validator';
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';


export enum tran_category_itax_source_tran_dtl{
  Financial="Financial",
  Non_Financial="Non_Financial",
}

export class  itax_source_tran_dtlEntity implements itax_source_tran_dtl{
    @ApiProperty({example:"number"})
    itaxstd_id:number;
    @ApiPropertyOptional({enum :tran_category_itax_source_tran_dtl,enumName:"tran_category",type:"string"}) 
    @IsOptional()
    tran_category : tran_category_itax_source_tran_dtl;
    @Transform(({ value }) => value?.toISOString().split('T')[0])
    @ApiPropertyOptional({example:"decimal"})
    @IsOptional()
    tran_date:Date;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    tran_reference:string;
    @ApiPropertyOptional({example:"any"})
    @IsOptional()
    product_basic:any;
    @ApiProperty({example:"number"})
    itaxst_id: number;
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
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_prev_process_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_prev_status: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_prev_process_status: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_process_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_status: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_process_status: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_next_process_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_next_status: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_next_process_status: string;
}
      
export class  itax_source_tran_dtl_OnlyParentEntity {
    @ApiProperty({example:"number"})
    itaxstd_id:number;
    @ApiPropertyOptional({enum :tran_category_itax_source_tran_dtl,enumName:"tran_category",type:"string"}) 
    @IsOptional()
    tran_category : tran_category_itax_source_tran_dtl;
    @Transform(({ value }) => value?.toISOString().split('T')[0])
    @ApiPropertyOptional({example:"date"})
    @IsOptional()
    tran_date:Date;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    tran_reference:string;
    @ApiPropertyOptional({example:"any"})
    @IsOptional()
    product_basic:any;
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
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_prev_process_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_prev_status: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_prev_process_status: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_process_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_status: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_process_status: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_next_process_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_next_status: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_next_process_status: string;
}


export { itax_source_tran_dtl };