import { seacore, Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class  UpdateseacoreDto {
        @ApiProperty()
        clientname?: string;
        @ApiProperty({
            type: `integer`,
            format: `int32`,
        })
        mobile?: number;
        @ApiProperty()
        weburl?: string;
        @ApiProperty()
        addressline1?: string;
        @ApiProperty()
        country?: string;
        @ApiProperty()
        city?: string;
        @ApiProperty()
        email?: string;
        @ApiProperty()
        person?: string;
        @ApiProperty()
        clienttype?: string;
        @ApiProperty()
        vesseltype?: string;
        @ApiProperty({
            type: `string`,
            format: `date-time`,
        })
        dateonly?: Date;
        @ApiProperty({
            type: `string`,
            format: `date-time`,
        })
        timeonly?: Date;


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

