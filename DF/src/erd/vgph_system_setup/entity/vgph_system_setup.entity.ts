import { vgph_system_setup } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';



export class  vgph_system_setupEntity implements  vgph_system_setup {
    @ApiProperty({example:"number"})
    vgphssid:number;
    @ApiProperty({example:"string"})
    setup_code:string;
    @ApiProperty({example:"string"})
    product_code:string;
    @ApiProperty({example:"string"})
    interface_product:string;
    @ApiProperty({example:"string"})
    category:string;
    @ApiProperty({example:"string"})
    sub_category:string;
    @ApiProperty({example:"string"})
    purpose:string;
    @ApiProperty({example:"any"})
    setup_value:any;
    @ApiProperty({example:"string"})
    tenant_id:string;
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
      
export class  vgph_system_setup_OnlyParentEntity {
    @ApiProperty({example:"number"})
    vgphssid:number;
    @ApiProperty({example:"string"})
    setup_code:string;
    @ApiProperty({example:"string"})
    product_code:string;
    @ApiProperty({example:"string"})
    interface_product:string;
    @ApiProperty({example:"string"})
    category:string;
    @ApiProperty({example:"string"})
    sub_category:string;
    @ApiProperty({example:"string"})
    purpose:string;
    @ApiProperty({example:"any"})
    setup_value:any;
    @ApiProperty({example:"string"})
    tenant_id:string;
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


export { vgph_system_setup };