import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';





export class  Updatescheme_messagetypeDto {
        @ApiProperty()
        sourcemsgname?: string;
        @ApiProperty()
        sourcemsgversion?: string;
        @ApiProperty()
        targetmsgname?: string;
        @ApiProperty()
        targetmsgversion?: string;
        @ApiProperty()
        sourcename?: string;
        @ApiProperty()
        sourcevalue?: string;
        @ApiProperty()
        sourceformat?: string;
        @ApiProperty()
        targetname?: string;
        @ApiProperty()
        targetvalue?: string;
        @ApiProperty()
        targetformat?: string;

}

export class  Updateschemetype_schemeDto {
        @ApiProperty()
        name?: string;
        @ApiProperty({type : [Updatescheme_messagetypeDto]})
        @Type(() => Updatescheme_messagetypeDto)
        messagetypes? : Updatescheme_messagetypeDto[]

}

export class  Updatecountry_schemetypeDto {
        @ApiProperty()
        type?: string;
        @ApiProperty({type : Updateschemetype_schemeDto}) 
        @Type(() => Updateschemetype_schemeDto) 
        schemes? : Updateschemetype_schemeDto

}

export class  Updatebank_scheme_countryDto {
        @ApiProperty()
        countrycode?: string;
        @ApiProperty({type : Updatecountry_schemetypeDto}) 
        @Type(() => Updatecountry_schemetypeDto) 
        schemetypes? : Updatecountry_schemetypeDto

}

export class  Updatebank_scheme_setupDto {
        @ApiProperty()
        bankcode?: string;
        @ApiProperty({type : Updatebank_scheme_countryDto}) 
        @Type(() => Updatebank_scheme_countryDto) 
        countries? : Updatebank_scheme_countryDto
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




