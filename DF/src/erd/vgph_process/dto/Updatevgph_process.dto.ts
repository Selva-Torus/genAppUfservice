import { Prisma } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class  Updatevgph_processDto {
        @ApiProperty()
        tenant_id?: string;
        @ApiProperty()
        product_code?: string;
        @ApiProperty()
        category?: string;
        @ApiProperty()
        code?: string;
        @ApiProperty()
        description?: string;
        @ApiProperty()
        type?: string;
        @ApiProperty()
        mode?: string;
        @ApiProperty()
        handler_code?: string;
        @ApiProperty()
        routing_rule?: string;
        @ApiProperty()
        decision_rule?: string;
        @ApiProperty()
        override_rule?: string;
        @ApiProperty()
        failure_process_code?: string;
        @ApiProperty()
        suspicious_process_code?: string;
        @ApiProperty()
        error_process_code?: string;
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

