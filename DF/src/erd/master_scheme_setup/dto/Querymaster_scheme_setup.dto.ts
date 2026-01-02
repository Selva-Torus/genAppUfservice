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


 

export class Queryscheme_messagetypesDto{
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
}
export class Queryscheme_messagetypesWapperDto {

    @ApiProperty({ type:Queryscheme_messagetypesDto })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Queryscheme_messagetypesWapperDto)
    some: Queryscheme_messagetypesDto;
}
export class Queryschemetype_schemesDto{
    @ApiProperty()
    @IsString()
    name?: string;

    @ApiProperty({ type:Queryscheme_messagetypesWapperDto })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Queryscheme_messagetypesWapperDto)
     messagetypes?: Queryscheme_messagetypesWapperDto[];
}
export class Queryschemetype_schemesWapperDto {
    @ApiProperty({ type:Queryschemetype_schemesDto })
    @ValidateNested()
    @Type(() => Queryschemetype_schemesDto)
    is: Queryschemetype_schemesDto;
}
export class Querycountry_schemetypeaDto{
    @ApiProperty()
    @IsString()
    type?: string;
    @ApiProperty({ type:Queryschemetype_schemesWapperDto })
    @ValidateNested()
    @Type(() => Queryschemetype_schemesWapperDto)
     schemes?: Queryschemetype_schemesWapperDto;
}
export class Querycountry_schemetypeaWapperDto {
    @ApiProperty({ type:Querycountry_schemetypeaDto })
    @ValidateNested()
    @Type(() => Querycountry_schemetypeaDto)
    is: Querycountry_schemetypeaDto;
}
export class Querymaster_scheme_setupDto{
    @ApiProperty()
    @IsString()
    countrycode?: string;
    @ApiProperty({ type:Querycountry_schemetypeaWapperDto })
    @ValidateNested()
    @Type(() => Querycountry_schemetypeaWapperDto)
     schemetypes?: Querycountry_schemetypeaWapperDto;
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









