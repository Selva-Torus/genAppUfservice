import { itax_check_balance } from '@prisma/client';
import { IsEnum,IsOptional } from 'class-validator';
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';



export class  itax_check_balanceEntity implements Omit<itax_check_balance,"balance">{
    @ApiProperty({example:"number"})
    itaxcb_id:number;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    account_number:string;
    @ApiPropertyOptional({example:"decimal"})
    @IsOptional()
    balance: number | null;
    @Transform(({ value }) => value?.toISOString())
    @ApiPropertyOptional({example:"datetime"})
    @IsOptional()
    trs_created_date: Date;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_created_by: string;
    @Transform(({ value }) => value?.toISOString())
    @ApiPropertyOptional({example:"datetime"})
    @IsOptional()
    trs_modified_date: Date;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_modified_by: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_process_id: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_access_profile: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_org_grp_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_org_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_role_grp_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_role_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_ps_grp_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_ps_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_sub_org_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_sub_org_grp_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_locked_by: string;
    @Transform(({ value }) => value?.toISOString())
    @ApiPropertyOptional({example:"datetime"})
    @IsOptional()
    trs_locked_time: Date;
    @ApiProperty({example:"string"})
    trs_tenant_id: string;
    @ApiProperty({example:"string"})
    trs_app_code: string;
    @ApiProperty({example:"string"})
    trs_product_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_event_process_status: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_event_status: string;
}
      
export class  itax_check_balance_OnlyParentEntity {
    @ApiProperty({example:"number"})
    itaxcb_id:number;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    account_number:string;
    @ApiPropertyOptional({example:"decimal"})
    @IsOptional()
    balance: number | null;
    @Transform(({ value }) => value?.toISOString())
    @ApiPropertyOptional({example:"datetime"})
    @IsOptional()
    trs_created_date: Date;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_created_by: string;
    @Transform(({ value }) => value?.toISOString())
    @ApiPropertyOptional({example:"datetime"})
    @IsOptional()
    trs_modified_date: Date;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_modified_by: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_process_id: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_access_profile: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_org_grp_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_org_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_role_grp_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_role_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_ps_grp_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_ps_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_sub_org_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_sub_org_grp_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_locked_by: string;
    @Transform(({ value }) => value?.toISOString())
    @ApiPropertyOptional({example:"datetime"})
    @IsOptional()
    trs_locked_time: Date;
    @ApiProperty({example:"string"})
    trs_tenant_id: string;
    @ApiProperty({example:"string"})
    trs_app_code: string;
    @ApiProperty({example:"string"})
    trs_product_code: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_event_process_status: string;
    @ApiPropertyOptional({example:"string"})
    @IsOptional()
    trs_event_status: string;
}


export { itax_check_balance };