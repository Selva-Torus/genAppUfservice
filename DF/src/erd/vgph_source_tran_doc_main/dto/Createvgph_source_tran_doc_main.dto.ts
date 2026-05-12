
import { Prisma } from '@prisma/client';
import { IsEnum,IsOptional } from 'class-validator';
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';

export enum category_vgph_source_tran_doc_main{
  front="front",
  back="back",
}
export enum doc_type_vgph_source_tran_doc_main{
  tiff="tiff",
  jpg="jpg",
  uv="uv",
  color="color",
}
export enum doc_group_vgph_source_tran_doc_main{
  cheque="cheque",
  doc="doc",
  id_proof="id_proof",
  addr_proof="addr_proof",
}

export class  Createvgph_source_tran_doc_mainDto {
        @ApiProperty({
            type: `integer`,
            format: `int32`,
        })
        vgphstdm_id: number;
        @ApiProperty()
        vgphstm_uuid: string;
        @ApiProperty({enum:category_vgph_source_tran_doc_main})
        @IsEnum(category_vgph_source_tran_doc_main)
        category: category_vgph_source_tran_doc_main;
        @ApiPropertyOptional({enum:doc_type_vgph_source_tran_doc_main})
        @IsEnum(doc_type_vgph_source_tran_doc_main)
        @IsOptional()
        doc_type?: doc_type_vgph_source_tran_doc_main;
        @ApiPropertyOptional({enum:doc_group_vgph_source_tran_doc_main})
        @IsEnum(doc_group_vgph_source_tran_doc_main)
        @IsOptional()
        doc_group?: doc_group_vgph_source_tran_doc_main;
        @ApiProperty()
        doc_name: string;
        @ApiPropertyOptional()
        @IsOptional()
        url?: string;
        @ApiPropertyOptional()
        @IsOptional()
        doc_additional?: Prisma.InputJsonValue;
        @ApiPropertyOptional()
        @IsOptional()
        doc_content_text?: string;
        @ApiPropertyOptional({
          type: 'string',
          format: 'binary',
          description: 'Raw byte data',
        })
        @IsOptional()
        doc_content_byte?: Uint8Array<ArrayBuffer>;
        @ApiPropertyOptional()
        @IsOptional()
        doc_size?: string;
        @ApiProperty({
            type: `string`,
            format: `date-time`,
        })
        trs_created_date: Date;
        @ApiPropertyOptional()
        @IsOptional()
        trs_created_by?: string;
        @ApiPropertyOptional({
            type: `string`,
            format: `date-time`,
        })
        @IsOptional()
        trs_modified_date?: Date;
        @ApiPropertyOptional()
        @IsOptional()
        trs_modified_by?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_process_id?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_access_profile?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_org_grp_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_org_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_role_grp_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_role_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_ps_grp_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_ps_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_sub_org_grp_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_sub_org_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_locked_by?: string;
        @ApiPropertyOptional({
            type: `string`,
            format: `date-time`,
        })
        @IsOptional()
        trs_locked_time?: Date;
        @ApiProperty()
        trs_tenant_id: string;
        @ApiProperty()
        trs_app_code: string;
        @ApiProperty()
        trs_product_code: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_event_process_status?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_event_status?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_token_id?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_version?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_prev_process_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_prev_status?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_prev_process_status?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_process_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_status?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_process_status?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_next_process_code?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_next_status?: string;
        @ApiPropertyOptional()
        @IsOptional()
        trs_next_process_status?: string;

        
}

