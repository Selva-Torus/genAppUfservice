import { accounts } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class  accountsEntity implements  accounts {
        @ApiProperty( {example:"number"})
        account_id: number;
        @ApiProperty( {example:"string"})
        customer_name: string;
        @ApiProperty( {example:"bigint"})
        phone_number: bigint;
        @ApiProperty({example:"number"})
        dob:number;
        @ApiProperty( {example:"string"})
        account_type: string;
        @ApiProperty( {example:"string"})
        email: string;
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
      
export class  accounts_OnlyParentEntity {
        @ApiProperty( {example:"number"})
        account_id: number;
        @ApiProperty( {example:"string"})
        customer_name: string;
        @ApiProperty( {example:"bigint"})
        phone_number: bigint;
        @ApiProperty({example:"number"})
        dob:number;
        @ApiProperty( {example:"string"})
        account_type: string;
        @ApiProperty( {example:"string"})
        email: string;
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


  export { accounts };