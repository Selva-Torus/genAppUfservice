import { Prisma } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum direction_vgph_source_tran_staging{
  OUTBOUND="OUTBOUND",
  INBOUND="INBOUND",
}
export enum process_type_vgph_source_tran_staging{
  OP="OP",
  IR="IR",
  IP="IP",
  OR="OR",
}
export enum tran_category_vgph_source_tran_staging{
  Financial="Financial",
  Non_Financial="Non_Financial",
}
export enum dr_bank_code_type_vgph_source_tran_staging{
  IFSC="IFSC",
  BIC="BIC",
  IBAN="IBAN",
}
export enum cr_bank_code_type_vgph_source_tran_staging{
  IFSC="IFSC",
  BIC="BIC",
  IBAN="IBAN",
}
export enum charge_type_vgph_source_tran_staging{
  SHA="SHA",
  OUR="OUR",
  BEN="BEN",
}

export class  Createvgph_source_tran_stagingDto {
        @ApiProperty()
        tenant_id: string;
        @ApiProperty()
        parent_vgphsts_uuid?: string;
        @ApiProperty()
        product_code: string;
        @ApiProperty({enum:direction_vgph_source_tran_staging})
        @IsEnum(direction_vgph_source_tran_staging)
        direction: direction_vgph_source_tran_staging;
        @ApiProperty({enum:process_type_vgph_source_tran_staging})
        @IsEnum(process_type_vgph_source_tran_staging)
        process_type: process_type_vgph_source_tran_staging;
        @ApiProperty({enum:tran_category_vgph_source_tran_staging})
        @IsEnum(tran_category_vgph_source_tran_staging)
        tran_category: tran_category_vgph_source_tran_staging;
        @ApiProperty()
        message_code?: string;
        @ApiProperty()
        channel_name?: string;
        @ApiProperty()
        channel_reference?: string;
        @ApiProperty({
            type: `string`,
            format: `date-time`,
        })
        tran_date: Date;
        @ApiProperty()
        tran_reference?: string;
        @ApiProperty()
        tran_seq_no: string;
        @ApiProperty({
            type: `string`,
            format: `date-time`,
        })
        value_date: Date;
        @ApiProperty({
            type: `string`,
            format: `date-time`,
        })
        settlement_date?: Date;
        @ApiProperty()
        dr_account?: string;
        @ApiProperty({enum:dr_bank_code_type_vgph_source_tran_staging})
        @IsEnum(dr_bank_code_type_vgph_source_tran_staging)
        dr_bank_code_type?: dr_bank_code_type_vgph_source_tran_staging;
        @ApiProperty()
        dr_bank_code?: string;
        @ApiProperty()
        dr_name?: string;
        @ApiProperty({
            type: `number`,
            format: `float`,
        })
        dr_amount?: number;
        @ApiProperty()
        dr_currency?: string;
        @ApiProperty()
        cr_account?: string;
        @ApiProperty({enum:cr_bank_code_type_vgph_source_tran_staging})
        @IsEnum(cr_bank_code_type_vgph_source_tran_staging)
        cr_bank_code_type?: cr_bank_code_type_vgph_source_tran_staging;
        @ApiProperty()
        cr_bank_code?: string;
        @ApiProperty()
        cr_name?: string;
        @ApiProperty({
            type: `number`,
            format: `float`,
        })
        cr_amount?: number;
        @ApiProperty()
        cr_currency?: string;
        @ApiProperty()
        remittance_info?: string;
        @ApiProperty()
        product_basic?: Prisma.InputJsonValue;
        @ApiProperty()
        product_additional?: Prisma.InputJsonValue;
        @ApiProperty({enum:charge_type_vgph_source_tran_staging})
        @IsEnum(charge_type_vgph_source_tran_staging)
        charge_type?: charge_type_vgph_source_tran_staging;
        @ApiProperty()
        uuid: string;
        @ApiProperty()
        vgphss_uuid: string;
        @ApiProperty({
            type: `integer`,
            format: `int32`,
        })
        vgphss_id: number;
        @ApiProperty({
            type: `integer`,
            format: `int32`,
        })
        prcts_id: number;
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

