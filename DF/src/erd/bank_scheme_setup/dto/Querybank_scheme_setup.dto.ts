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


 

export class Queryscheme_messagetypeDto{
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
export class Queryscheme_messagetypeWapperDto {

    @ApiProperty({ type:Queryscheme_messagetypeDto })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Queryscheme_messagetypeWapperDto)
    some: Queryscheme_messagetypeDto;
}
export class Queryschemetype_schemeDto{
    @ApiProperty()
    @IsString()
    name?: string;

    @ApiProperty({ type:Queryscheme_messagetypeWapperDto })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Queryscheme_messagetypeWapperDto)
     messagetypes?: Queryscheme_messagetypeWapperDto[];
}
export class Queryschemetype_schemeWapperDto {
    @ApiProperty({ type:Queryschemetype_schemeDto })
    @ValidateNested()
    @Type(() => Queryschemetype_schemeDto)
    is: Queryschemetype_schemeDto;
}
export class Querycountry_schemetypeDto{
    @ApiProperty()
    @IsString()
    type?: string;
    @ApiProperty({ type:Queryschemetype_schemeWapperDto })
    @ValidateNested()
    @Type(() => Queryschemetype_schemeWapperDto)
     schemes?: Queryschemetype_schemeWapperDto;
}
export class Querycountry_schemetypeWapperDto {
    @ApiProperty({ type:Querycountry_schemetypeDto })
    @ValidateNested()
    @Type(() => Querycountry_schemetypeDto)
    is: Querycountry_schemetypeDto;
}
export class Querybank_scheme_countryDto{
    @ApiProperty()
    @IsString()
    countrycode?: string;
    @ApiProperty({ type:Querycountry_schemetypeWapperDto })
    @ValidateNested()
    @Type(() => Querycountry_schemetypeWapperDto)
     schemetypes?: Querycountry_schemetypeWapperDto;
}
export class Querybank_scheme_countryWapperDto {
    @ApiProperty({ type:Querybank_scheme_countryDto })
    @ValidateNested()
    @Type(() => Querybank_scheme_countryDto)
    is: Querybank_scheme_countryDto;
}
export class Querybank_scheme_setupDto{
    @ApiProperty()
    @IsString()
    bankcode?: string;
    @ApiProperty({ type:Querybank_scheme_countryWapperDto })
    @ValidateNested()
    @Type(() => Querybank_scheme_countryWapperDto)
     countries?: Querybank_scheme_countryWapperDto;
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









