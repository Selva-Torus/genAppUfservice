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


 

export class Querytof_appsDto{
    @ApiProperty()
    @IsString()
    app_code?: string;
    @ApiProperty()
    @IsString()
    app_name?: string;
    @ApiProperty()
    @IsString()
    app_url?: string;
    @ApiProperty()
    @IsString()
    app_version?: string;
    @ApiProperty()
    @IsString()
    status?: string;
}
export class Querytof_appsWapperDto {

    @ApiProperty({ type:Querytof_appsDto })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Querytof_appsWapperDto)
    some: Querytof_appsDto;
}
export class Querytof_tpp_tppDto{
    @ApiProperty()
    @IsString()
    tpp_code?: string;
    @ApiProperty()
    @IsString()
    tpp_name?: string;
    @ApiProperty()
    @IsString()
    server_url?: string;
    @ApiProperty()
    @IsString()
    status?: string;

    @ApiProperty({ type:Querytof_appsWapperDto })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Querytof_appsWapperDto)
     apps?: Querytof_appsWapperDto[];
}
export class Querytof_tpp_tppWapperDto {
    @ApiProperty({ type:Querytof_tpp_tppDto })
    @ValidateNested()
    @Type(() => Querytof_tpp_tppDto)
    is: Querytof_tpp_tppDto;
}
export class Querytof_tppDto{
    @ApiProperty({ type:Querytof_tpp_tppWapperDto })
    @ValidateNested()
    @Type(() => Querytof_tpp_tppWapperDto)
     tpp?: Querytof_tpp_tppWapperDto;
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









