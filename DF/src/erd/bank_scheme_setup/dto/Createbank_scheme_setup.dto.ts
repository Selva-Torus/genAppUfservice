import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';


 

export class Createscheme_messagetypeDto{
    @ApiProperty()
    @IsString()
    sourcemsgname?: string;
    @ApiProperty()
    @IsString()
    sourcemsgversion?: string;
    @ApiProperty()
    @IsString()
    targetmsgname?: string;
    @ApiProperty()
    @IsString()
    targetmsgversion?: string;
    @ApiProperty()
    @IsString()
    sourcename?: string;
    @ApiProperty()
    @IsString()
    sourcevalue?: string;
    @ApiProperty()
    @IsString()
    sourceformat?: string;
    @ApiProperty()
    @IsString()
    targetname?: string;
    @ApiProperty()
    @IsString()
    targetvalue?: string;
    @ApiProperty()
    @IsString()
    targetformat?: string;
}
export class Createschemetype_schemeDto{
    @ApiProperty()
    @IsString()
    name?: string;

    @ApiProperty({ type:[Createscheme_messagetypeDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Createscheme_messagetypeDto)
    messagetypes?: Createscheme_messagetypeDto[];
}
export class Createcountry_schemetypeDto{
    @ApiProperty()
    @IsString()
    type?: string;
    @ApiProperty({ type:Createschemetype_schemeDto })
    @ValidateNested()
    @Type(() => Createschemetype_schemeDto)
    schemes?: Createschemetype_schemeDto;
}
export class Createbank_scheme_countryDto{
    @ApiProperty()
    @IsString()
    countrycode?: string;
    @ApiProperty({ type:Createcountry_schemetypeDto })
    @ValidateNested()
    @Type(() => Createcountry_schemetypeDto)
    schemetypes?: Createcountry_schemetypeDto;
}
export class Createbank_scheme_setupDto{
    @ApiProperty()
    @IsString()
    bankcode?: string;
    @ApiProperty({ type:Createbank_scheme_countryDto })
    @ValidateNested()
    @Type(() => Createbank_scheme_countryDto)
    countries?: Createbank_scheme_countryDto;
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







