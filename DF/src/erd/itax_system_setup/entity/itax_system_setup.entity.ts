import { itax_system_setup } from '@prisma/client';
import { IsEnum,IsOptional } from 'class-validator';
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';



export class  itax_system_setupEntity implements itax_system_setup{
    @ApiProperty({example:"number"})
    itaxss_id:number;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    setup_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    interface_product:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    category:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    sub_category:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    purpose:string;
    @ApiPropertyOptional({example:"any"})
    @IsOptional()
    setup_value:any;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    parent_setup_code:string;
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
      
export class  itax_system_setup_OnlyParentEntity {
    @ApiProperty({example:"number"})
    itaxss_id:number;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    setup_code:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    interface_product:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    category:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    sub_category:string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    purpose:string;
    @ApiPropertyOptional({example:"any"})
    @IsOptional()
    setup_value:any;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    parent_setup_code:string;
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


export { itax_system_setup };