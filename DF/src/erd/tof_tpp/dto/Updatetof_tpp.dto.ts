import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';





export class  Updatetof_appsDto {
        @ApiProperty()
        app_code?: string;
        @ApiProperty()
        app_name?: string;
        @ApiProperty()
        app_url?: string;
        @ApiProperty()
        app_version?: string;
        @ApiProperty()
        status?: string;

}

export class  Updatetof_tpp_tppDto {
        @ApiProperty()
        tpp_code?: string;
        @ApiProperty()
        tpp_name?: string;
        @ApiProperty()
        server_url?: string;
        @ApiProperty()
        status?: string;
        @ApiProperty({type : [Updatetof_appsDto]})
        @Type(() => Updatetof_appsDto)
        apps? : Updatetof_appsDto[]

}

export class  Updatetof_tppDto {
        @ApiProperty({type : Updatetof_tpp_tppDto}) 
        @Type(() => Updatetof_tpp_tppDto) 
        tpp? : Updatetof_tpp_tppDto
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




