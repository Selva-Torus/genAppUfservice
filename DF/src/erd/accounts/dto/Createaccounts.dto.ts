import { accounts, Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';


export class  CreateaccountsDto {
        @ApiProperty()
        customer_name?: string;
        @ApiProperty({
            type: `integer`,
            format: `int32`,
        })
        phone_number?: number;
        @ApiProperty({
            type: `integer`,
            format: `int32`,
        })
        dob?: number;
        @ApiProperty()
        account_type?: string;
        @ApiProperty()
        email?: string;


        @ApiProperty()
        trs_creator_email?: string;
        @ApiProperty({
            type: `string`,
            format: `date-time`,
        })
        trs_created_date?: Date;
        @ApiProperty()
        trs_created_by?: string;
        @ApiProperty({
            type: `string`,
            format: `date-time`,
        })
        trs_modified_date?: Date;
        @ApiProperty()
        trs_modified_by?: string;
        @ApiProperty()
        trs_status?: string;
        @ApiProperty()
        trs_next_status?: string;
        @ApiProperty()
        trs_process_id?: string;
        @ApiProperty()
        trs_access_profile?: string;
        @ApiProperty()
        trs_org_grp_code?: string;
        @ApiProperty()
        trs_org_code?: string;
        @ApiProperty()
        trs_role_grp_code?: string;
        @ApiProperty()
        trs_role_code?: string;
        @ApiProperty()
        trs_ps_grp_code?: string;
        @ApiProperty()
        trs_ps_code?: string;

}

