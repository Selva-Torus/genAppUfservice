import { seacore } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class  seacoreEntity implements  seacore {
        @ApiProperty( {example:"number"})
        clientid: number;
        @ApiProperty( {example:"string"})
        clientname: string;
        @ApiProperty( {example:"number"})
        mobile: number;
        @ApiProperty( {example:"string"})
        weburl: string;
        @ApiProperty( {example:"string"})
        addressline1: string;
        @ApiProperty( {example:"string"})
        country: string;
        @ApiProperty( {example:"string"})
        city: string;
        @ApiProperty( {example:"string"})
        email: string;
        @ApiProperty( {example:"string"})
        person: string;
        @ApiProperty( {example:"string"})
        clienttype: string;
        @ApiProperty( {example:"string"})
        vesseltype: string;
        @Transform(({ value }) => value?.toISOString().split('T')[0])
        @ApiProperty({example:"date"})
        dateonly:Date;
        @Transform(({ value }) => value?.toISOString()?.split('T')[1].split('.')[0]) 
        @ApiProperty({example:"date"})
        timeonly:Date;
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
      
export class  seacore_OnlyParentEntity {
        @ApiProperty( {example:"number"})
        clientid: number;
        @ApiProperty( {example:"string"})
        clientname: string;
        @ApiProperty( {example:"number"})
        mobile: number;
        @ApiProperty( {example:"string"})
        weburl: string;
        @ApiProperty( {example:"string"})
        addressline1: string;
        @ApiProperty( {example:"string"})
        country: string;
        @ApiProperty( {example:"string"})
        city: string;
        @ApiProperty( {example:"string"})
        email: string;
        @ApiProperty( {example:"string"})
        person: string;
        @ApiProperty( {example:"string"})
        clienttype: string;
        @ApiProperty( {example:"string"})
        vesseltype: string;
        @Transform(({ value }) => value?.toISOString().split('T')[0])
        @ApiProperty({example:"date"})
        dateonly:Date;
        @Transform(({ value }) => value?.toISOString()?.split('T')[1].split('.')[0])
        @ApiProperty({example:"date"})
        timeonly:Date;
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


  export { seacore };