import { vgph_process } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';



export class  vgph_processEntity implements  vgph_process {
    @ApiProperty({example:"number"})
    vgphp_id:number;
    @ApiProperty({example:"string"})
    tenant_id:string;
    @ApiProperty({example:"string"})
    product_code:string;
    @ApiProperty({example:"string"})
    category:string;
    @ApiProperty({example:"string"})
    code:string;
    @ApiProperty({example:"string"})
    description:string;
    @ApiProperty({example:"string"})
    type:string;
    @ApiProperty({example:"string"})
    mode:string;
    @ApiProperty({example:"string"})
    handler_code:string;
    @ApiProperty({example:"string"})
    routing_rule:string;
    @ApiProperty({example:"string"})
    decision_rule:string;
    @ApiProperty({example:"string"})
    override_rule:string;
    @ApiProperty({example:"string"})
    failure_process_code:string;
    @ApiProperty({example:"string"})
    suspicious_process_code:string;
    @ApiProperty({example:"string"})
    error_process_code:string;
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
      
export class  vgph_process_OnlyParentEntity {
    @ApiProperty({example:"number"})
    vgphp_id:number;
    @ApiProperty({example:"string"})
    tenant_id:string;
    @ApiProperty({example:"string"})
    product_code:string;
    @ApiProperty({example:"string"})
    category:string;
    @ApiProperty({example:"string"})
    code:string;
    @ApiProperty({example:"string"})
    description:string;
    @ApiProperty({example:"string"})
    type:string;
    @ApiProperty({example:"string"})
    mode:string;
    @ApiProperty({example:"string"})
    handler_code:string;
    @ApiProperty({example:"string"})
    routing_rule:string;
    @ApiProperty({example:"string"})
    decision_rule:string;
    @ApiProperty({example:"string"})
    override_rule:string;
    @ApiProperty({example:"string"})
    failure_process_code:string;
    @ApiProperty({example:"string"})
    suspicious_process_code:string;
    @ApiProperty({example:"string"})
    error_process_code:string;
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


export { vgph_process };