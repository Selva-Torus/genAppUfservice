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


 

export class Createtof_lfi_insuranceDto{
    @ApiProperty()
    @IsString()
    insurance_code?: string;
    @ApiProperty()
    @IsString()
    insurance_name?: string;
    @ApiProperty()
    @IsString()
    access_url?: string;
    @ApiProperty()
    @IsString()
    status?: string;
    @ApiProperty()
    @IsString()
    notes?: string;
}
export class Createtof_lfi_banksDto{
    @ApiProperty()
    @IsString()
    bank_code?: string;
    @ApiProperty()
    @IsString()
    bank_name?: string;
    @ApiProperty()
    @IsString()
    access_url?: string;
    @ApiProperty()
    @IsString()
    status?: string;
}
export class Createtof_lfi_bank_insuDto{

    @ApiProperty({ type:[Createtof_lfi_banksDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Createtof_lfi_banksDto)
    banks?: Createtof_lfi_banksDto[];

    @ApiProperty({ type:[Createtof_lfi_insuranceDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Createtof_lfi_insuranceDto)
    insurance?: Createtof_lfi_insuranceDto[];
}
export class Createtof_lfiDto{
    @ApiProperty({ type:Createtof_lfi_bank_insuDto })
    @ValidateNested()
    @Type(() => Createtof_lfi_bank_insuDto)
    lfi?: Createtof_lfi_bank_insuDto;
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







