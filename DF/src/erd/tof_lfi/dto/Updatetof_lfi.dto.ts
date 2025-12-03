import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';





export class  Updatetof_lfi_insuranceDto {
        @ApiProperty()
        insurance_code?: string;
        @ApiProperty()
        insurance_name?: string;
        @ApiProperty()
        access_url?: string;
        @ApiProperty()
        status?: string;
        @ApiProperty()
        notes?: string;

}

export class  Updatetof_lfi_banksDto {
        @ApiProperty()
        bank_code?: string;
        @ApiProperty()
        bank_name?: string;
        @ApiProperty()
        access_url?: string;
        @ApiProperty()
        status?: string;

}

export class  Updatetof_lfi_bank_insuDto {
        @ApiProperty({type : [Updatetof_lfi_banksDto]})
        @Type(() => Updatetof_lfi_banksDto)
        banks? : Updatetof_lfi_banksDto[]
        @ApiProperty({type : [Updatetof_lfi_insuranceDto]})
        @Type(() => Updatetof_lfi_insuranceDto)
        insurance? : Updatetof_lfi_insuranceDto[]

}

export class  Updatetof_lfiDto {
        @ApiProperty({type : Updatetof_lfi_bank_insuDto}) 
        @Type(() => Updatetof_lfi_bank_insuDto) 
        lfi? : Updatetof_lfi_bank_insuDto
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




