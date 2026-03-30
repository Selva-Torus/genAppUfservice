import { Prisma } from '@prisma/client';
import { IsEnum,IsOptional } from 'class-validator';
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';

export enum category_itax_source_tran_doc{
  front="front",
  back="back",
}
export enum doc_type_itax_source_tran_doc{
  tiff="tiff",
  jpg="jpg",
  uv="uv",
  color="color",
}
export enum doc_group_itax_source_tran_doc{
  cheque="cheque",
  credit_application="credit_application",
  credit_approval="credit_approval",
}

export class  Createitax_source_tran_docDto {
        @ApiPropertyOptional({enum:category_itax_source_tran_doc})
        @IsEnum(category_itax_source_tran_doc)
        @IsOptional()
        category?: category_itax_source_tran_doc;
        @ApiPropertyOptional({enum:doc_type_itax_source_tran_doc})
        @IsEnum(doc_type_itax_source_tran_doc)
        @IsOptional()
        doc_type?: doc_type_itax_source_tran_doc;
        @ApiPropertyOptional({enum:doc_group_itax_source_tran_doc})
        @IsEnum(doc_group_itax_source_tran_doc)
        @IsOptional()
        doc_group?: doc_group_itax_source_tran_doc;
        @ApiPropertyOptional()
        @IsOptional()
        doc_name?: string;
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
        @ApiProperty({
            type: `integer`,
            format: `int32`,
        })
        itaxst_id: number;
        @ApiPropertyOptional({
            type: `string`,
            format: `date-time`,
        })
        @IsOptional()
        trs_created_date?: Date;

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
        trs_locked_by?:  string;

        @ApiPropertyOptional({
            type: `string`,
            format: `date-time`,
        })
        @IsOptional()
        trs_locked_time?:  Date;

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

