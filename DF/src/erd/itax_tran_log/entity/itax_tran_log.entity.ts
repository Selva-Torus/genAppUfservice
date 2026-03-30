import { itax_tran_log } from '@prisma/client';
import { IsEnum,IsOptional } from 'class-validator';
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';


export enum tran_category_itax_tran_log{
  Financial="Financial",
  Non_Financial="Non_Financial",
}

export class  itax_tran_logEntity implements itax_tran_log{
    @ApiProperty({example:"number"})
    itaxtl_id:number;
    @ApiPropertyOptional({enum :tran_category_itax_tran_log,enumName:"tran_category",type:"string"}) 
    @IsOptional()
    tran_category : tran_category_itax_tran_log;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    processing_system:string;
    @ApiPropertyOptional({example:"any"})
    @IsOptional()
    request_data:any;
    @ApiPropertyOptional({example:"any"})
    @IsOptional()
    response_data:any;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    retry_flag:string;
    @ApiPropertyOptional({example:"number"})
    @IsOptional()
    retry_count:number;
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
      
export class  itax_tran_log_OnlyParentEntity {
    @ApiProperty({example:"number"})
    itaxtl_id:number;
    @ApiPropertyOptional({enum :tran_category_itax_tran_log,enumName:"tran_category",type:"string"}) 
    @IsOptional()
    tran_category : tran_category_itax_tran_log;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    processing_system:string;
    @ApiPropertyOptional({example:"any"})
    @IsOptional()
    request_data:any;
    @ApiPropertyOptional({example:"any"})
    @IsOptional()
    response_data:any;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    retry_flag:string;
    @ApiPropertyOptional({example:"number"})
    @IsOptional()
    retry_count:number;
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


export { itax_tran_log };