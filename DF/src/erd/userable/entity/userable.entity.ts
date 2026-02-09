import { userable } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';



export class  userableEntity implements  userable {
    @ApiProperty({example:"number"})
    id:number;
    @ApiProperty({example:"string"})
    name:string;
    @ApiProperty({example:"string"})
    trs_creator_email: string;
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
      
export class  userable_OnlyParentEntity {
    @ApiProperty({example:"number"})
    id:number;
    @ApiProperty({example:"string"})
    name:string;
    @ApiProperty({example:"string"})
    trs_creator_email: string;
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


export { userable };