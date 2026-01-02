import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';





export class  Updatescheme_messagetypesDto {
        @ApiProperty()
        sourcemsgname?: string;
        @ApiProperty()
        sourcemsgversion?: string;
        @ApiProperty()
        targetmsgname?: string;
        @ApiProperty()
        targetmsgversion?: string;

}

export class  Updateschemetype_schemesDto {
        @ApiProperty()
        name?: string;
        @ApiProperty({type : [Updatescheme_messagetypesDto]})
        @Type(() => Updatescheme_messagetypesDto)
        messagetypes? : Updatescheme_messagetypesDto[]

}

export class  Updatecountry_schemetypeaDto {
        @ApiProperty()
        type?: string;
        @ApiProperty({type : Updateschemetype_schemesDto}) 
        @Type(() => Updateschemetype_schemesDto) 
        schemes? : Updateschemetype_schemesDto

}

export class  Updatemaster_scheme_setupDto {
        @ApiProperty()
        countrycode?: string;
        @ApiProperty({type : Updatecountry_schemetypeaDto}) 
        @Type(() => Updatecountry_schemetypeaDto) 
        schemetypes? : Updatecountry_schemetypeaDto
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
        @ApiProperty()
        trs_sub_org_grp_code?: string;
        @ApiProperty()
        trs_sub_org_code?: string;  

}




