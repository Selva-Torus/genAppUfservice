import { billing, Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class  UpdatebillingDto {
        @ApiProperty()
        billingparty?: string;
        @ApiProperty()
        vessels?: string;
        @ApiProperty()
        personcharge?: string;
        @ApiProperty()
        emailparty?: string;
        @ApiProperty({
            type: `integer`,
            format: `int32`,
        })
        mobileparty?: number;
        @ApiProperty()
        cou_ammount?: string;
        @ApiProperty({
            type: `integer`,
            format: `int32`,
        })
        amount?: number;
        @ApiProperty({
            type: `integer`,
            format: `int32`,
        })
        tax?: number;
        @ApiProperty({
            type: `integer`,
            format: `int32`,
        })
        interest?: number;
        @ApiProperty()
        cou_amount2?: string;
        @ApiProperty({
            type: `integer`,
            format: `int32`,
        })
        amount2?: number;
        @ApiProperty()
        addressline1?: string;
        @ApiProperty()
        country?: string;
        @ApiProperty()
        state?: string;
        @ApiProperty({
            type: `integer`,
            format: `int32`,
        })
        pininput?: number;
        @ApiProperty()
        remark?: string;


        @ApiProperty({example:"string"})
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

