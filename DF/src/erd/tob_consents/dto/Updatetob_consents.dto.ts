import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';





export class  Updatetob_consentsDto {
        @ApiProperty()
        requesturl?: string;
        @ApiProperty({
            type: `string`,
            format: `date-time`,
        })
        requesttimestamp?: Date;
        @ApiProperty()
        method?: string;
        @ApiProperty()
        baseconsentid?: string;
        @ApiProperty()
        resourceconsentid?: string;
        @ApiProperty()
        consentgroupid?: string;
        @ApiProperty()
        consenttype?: string;
        @ApiProperty()
        requestdata?: Prisma.InputJsonValue;
        @ApiProperty()
        responsedata?: Prisma.InputJsonValue;
        @ApiProperty()
        isauthorized?: boolean;
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




