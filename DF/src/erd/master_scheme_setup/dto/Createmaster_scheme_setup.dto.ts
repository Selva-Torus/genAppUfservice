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


 

export class Createscheme_messagetypesDto{
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
export class Createschemetype_schemesDto{
    @ApiProperty()
    @IsString()
    name?: string;

    @ApiProperty({ type:[Createscheme_messagetypesDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Createscheme_messagetypesDto)
    messagetypes?: Createscheme_messagetypesDto[];
}
export class Createcountry_schemetypeaDto{
    @ApiProperty()
    @IsString()
    type?: string;
    @ApiProperty({ type:Createschemetype_schemesDto })
    @ValidateNested()
    @Type(() => Createschemetype_schemesDto)
    schemes?: Createschemetype_schemesDto;
}
export class Createmaster_scheme_setupDto{
    @ApiProperty()
    @IsString()
    countrycode?: string;
    @ApiProperty({ type:Createcountry_schemetypeaDto })
    @ValidateNested()
    @Type(() => Createcountry_schemetypeaDto)
    schemetypes?: Createcountry_schemetypeaDto;
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







