import { billing } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class  billingEntity implements  billing {
        @ApiProperty( {example:"number"})
        billingid: number;
        @ApiProperty( {example:"string"})
        billingparty: string;
        @ApiProperty( {example:"string"})
        vessels: string;
        @ApiProperty( {example:"string"})
        personcharge: string;
        @ApiProperty( {example:"string"})
        emailparty: string;
        @ApiProperty( {example:"bigint"})
        mobileparty: bigint;
        @ApiProperty( {example:"string"})
        cou_ammount: string;
        @ApiProperty( {example:"number"})
        amount: number;
        @ApiProperty( {example:"number"})
        tax: number;
        @ApiProperty( {example:"number"})
        interest: number;
        @ApiProperty( {example:"string"})
        cou_amount2: string;
        @ApiProperty( {example:"number"})
        amount2: number;
        @ApiProperty( {example:"string"})
        addressline1: string;
        @ApiProperty( {example:"string"})
        country: string;
        @ApiProperty( {example:"string"})
        state: string;
        @ApiProperty( {example:"number"})
        pininput: number;
        @ApiProperty( {example:"string"})
        remark: string;
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
    }
      
export class  billing_OnlyParentEntity {
        @ApiProperty( {example:"number"})
        billingid: number;
        @ApiProperty( {example:"string"})
        billingparty: string;
        @ApiProperty( {example:"string"})
        vessels: string;
        @ApiProperty( {example:"string"})
        personcharge: string;
        @ApiProperty( {example:"string"})
        emailparty: string;
        @ApiProperty( {example:"bigint"})
        mobileparty: bigint;
        @ApiProperty( {example:"string"})
        cou_ammount: string;
        @ApiProperty( {example:"number"})
        amount: number;
        @ApiProperty( {example:"number"})
        tax: number;
        @ApiProperty( {example:"number"})
        interest: number;
        @ApiProperty( {example:"string"})
        cou_amount2: string;
        @ApiProperty( {example:"number"})
        amount2: number;
        @ApiProperty( {example:"string"})
        addressline1: string;
        @ApiProperty( {example:"string"})
        country: string;
        @ApiProperty( {example:"string"})
        state: string;
        @ApiProperty( {example:"number"})
        pininput: number;
        @ApiProperty( {example:"string"})
        remark: string;
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

    }


  export { billing };