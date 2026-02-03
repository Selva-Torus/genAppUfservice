import { Prisma } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class  Updatevgph_stepDto {
        @ApiProperty()
        tenant_id?: string;
        @ApiProperty()
        product_code?: string;
        @ApiProperty()
        flow_code?: string;
        @ApiProperty()
        code?: string;
        @ApiProperty({
            type: `number`,
            format: `float`,
        })
        sequence?: number;
        @ApiProperty()
        description?: string;
        @ApiProperty()
        source_process_code?: string;
        @ApiProperty()
        result?: string;
        @ApiProperty()
        destination_process_code?: string;
        @ApiProperty()
        need_process_log?: string;
        @ApiProperty()
        need_exception_log?: string;
        @ApiProperty()
        is_final_step?: string;
        @ApiProperty()
        param?: Prisma.InputJsonValue;
        @ApiProperty()
        version?: string;


























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
        @ApiProperty()
        trs_sub_org_code?: string;
        @ApiProperty()
        trs_sub_org_grp_code?: string;

}

