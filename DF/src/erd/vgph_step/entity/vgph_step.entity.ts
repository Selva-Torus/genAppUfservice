import { vgph_step } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';



export class  vgph_stepEntity implements  vgph_step {
    @ApiProperty({example:"number"})
    vgphs_id:number;
    @ApiProperty({example:"string"})
    tenant_id:string;
    @ApiProperty({example:"string"})
    product_code:string;
    @ApiProperty({example:"string"})
    flow_code:string;
    @ApiProperty({example:"string"})
    code:string;
    @ApiProperty({example:"number"})
    sequence:number;
    @ApiProperty({example:"string"})
    description:string;
    @ApiProperty({example:"string"})
    source_process_code:string;
    @ApiProperty({example:"string"})
    result:string;
    @ApiProperty({example:"string"})
    destination_process_code:string;
    @ApiProperty({example:"string"})
    need_process_log:string;
    @ApiProperty({example:"string"})
    need_exception_log:string;
    @ApiProperty({example:"string"})
    is_final_step:string;
    @ApiProperty({example:"any"})
    param:any;
    @ApiProperty({example:"string"})
    version:string;
    @Transform(({ value }) => value?.toISOString())
    @ApiProperty({example:"datetime"})
    trs_created_date: Date;
    @ApiProperty({example:"string"})
    trs_created_by: string;
    @Transform(({ value }) => value?.toISOString())
    @ApiProperty({example:"datetime"})
    trs_modified_date: Date;
    @ApiProperty({example:"string"})
    trs_modified_by: string;
    @ApiProperty({example:"string"})
    trs_status: string;
    @ApiProperty({example:"string"})
    trs_next_status: string;
    @ApiProperty({example:"string"})
    trs_process_id: string;
    @ApiProperty({example:"string"})
    trs_access_profile: string;
    @ApiProperty({example:"string"})
    trs_org_grp_code: string;
    @ApiProperty({example:"string"})
    trs_org_code: string;
    @ApiProperty({example:"string"})
    trs_role_grp_code: string;
    @ApiProperty({example:"string"})
    trs_role_code: string;
    @ApiProperty({example:"string"})
    trs_ps_grp_code: string;
    @ApiProperty({example:"string"})
    trs_ps_code: string;
    @ApiProperty({example:"string"})
    trs_sub_org_code: string;
    @ApiProperty({example:"string"})
    trs_sub_org_grp_code: string;
}
      
export class  vgph_step_OnlyParentEntity {
    @ApiProperty({example:"number"})
    vgphs_id:number;
    @ApiProperty({example:"string"})
    tenant_id:string;
    @ApiProperty({example:"string"})
    product_code:string;
    @ApiProperty({example:"string"})
    flow_code:string;
    @ApiProperty({example:"string"})
    code:string;
    @ApiProperty({example:"number"})
    sequence:number;
    @ApiProperty({example:"string"})
    description:string;
    @ApiProperty({example:"string"})
    source_process_code:string;
    @ApiProperty({example:"string"})
    result:string;
    @ApiProperty({example:"string"})
    destination_process_code:string;
    @ApiProperty({example:"string"})
    need_process_log:string;
    @ApiProperty({example:"string"})
    need_exception_log:string;
    @ApiProperty({example:"string"})
    is_final_step:string;
    @ApiProperty({example:"any"})
    param:any;
    @ApiProperty({example:"string"})
    version:string;
    @Transform(({ value }) => value?.toISOString())
    @ApiProperty({example:"datetime"})
    trs_created_date: Date;
    @ApiProperty({example:"string"})
    trs_created_by: string;
    @Transform(({ value }) => value?.toISOString())
    @ApiProperty({example:"datetime"})
    trs_modified_date: Date;
    @ApiProperty({example:"string"})
    trs_modified_by: string;
    @ApiProperty({example:"string"})
    trs_status: string;
    @ApiProperty({example:"string"})
    trs_next_status: string;
    @ApiProperty({example:"string"})
    trs_process_id: string;
    @ApiProperty({example:"string"})
    trs_access_profile: string;
    @ApiProperty({example:"string"})
    trs_org_grp_code: string;
    @ApiProperty({example:"string"})
    trs_org_code: string;
    @ApiProperty({example:"string"})
    trs_role_grp_code: string;
    @ApiProperty({example:"string"})
    trs_role_code: string;
    @ApiProperty({example:"string"})
    trs_ps_grp_code: string;
    @ApiProperty({example:"string"})
    trs_ps_code: string;
    @ApiProperty({example:"string"})
    trs_sub_org_code: string;
    @ApiProperty({example:"string"})
    trs_sub_org_grp_code: string;
}


export { vgph_step };