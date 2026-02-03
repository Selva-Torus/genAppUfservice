import { vgph_source_transactions } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';


export enum direction_vgph_source_transactions{
  OUTBOUND="OUTBOUND",
  INBOUND="INBOUND",
}
export enum process_type_vgph_source_transactions{
  OP="OP",
  IR="IR",
  IP="IP",
  OR="OR",
}
export enum tran_category_vgph_source_transactions{
  Financial="Financial",
  Non_Financial="Non_Financial",
}
export enum dr_bank_code_type_vgph_source_transactions{
  IFSC="IFSC",
  BIC="BIC",
  IBAN="IBAN",
}
export enum cr_bank_code_type_vgph_source_transactions{
  IFSC="IFSC",
  BIC="BIC",
  IBAN="IBAN",
}
export enum charge_type_vgph_source_transactions{
  SHA="SHA",
  OUR="OUR",
  BEN="BEN",
}

export class  vgph_source_transactionsEntity implements  vgph_source_transactions {
    @ApiProperty({example:"number"})
    vgphst_id:number;
    @ApiProperty({example:"string"})
    tenant_id:string;
    @ApiProperty({example:"string"})
    parent_vgphst_id:string;
    @ApiProperty({example:"string"})
    product_code:string;
    @ApiProperty({enum :direction_vgph_source_transactions,enumName:"direction",type:"string"}) 
    direction : direction_vgph_source_transactions;
    @ApiProperty({enum :process_type_vgph_source_transactions,enumName:"process_type",type:"string"}) 
    process_type : process_type_vgph_source_transactions;
    @ApiProperty({enum :tran_category_vgph_source_transactions,enumName:"tran_category",type:"string"}) 
    tran_category : tran_category_vgph_source_transactions;
    @ApiProperty({example:"string"})
    message_code:string;
    @ApiProperty({example:"string"})
    channel_name:string;
    @ApiProperty({example:"string"})
    channel_reference:string;
    @Transform(({ value }) => value?.toISOString().split('T')[0])
    @ApiProperty({example:"date"})
    tran_date:Date;
    @ApiProperty({example:"string"})
    tran_reference:string;
    @ApiProperty({example:"string"})
    tran_seq_no:string;
    @Transform(({ value }) => value?.toISOString().split('T')[0])
    @ApiProperty({example:"date"})
    value_date:Date;
    @Transform(({ value }) => value?.toISOString().split('T')[0])
    @ApiProperty({example:"date"})
    settlement_date:Date;
    @ApiProperty({example:"string"})
    dr_account:string;
    @ApiProperty({enum :dr_bank_code_type_vgph_source_transactions,enumName:"dr_bank_code_type",type:"string"}) 
    dr_bank_code_type : dr_bank_code_type_vgph_source_transactions;
    @ApiProperty({example:"string"})
    dr_bank_code:string;
    @ApiProperty({example:"string"})
    dr_name:string;
    @ApiProperty({example:"number"})
    dr_amount:number;
    @ApiProperty({example:"string"})
    dr_currency:string;
    @ApiProperty({example:"string"})
    cr_account:string;
    @ApiProperty({enum :cr_bank_code_type_vgph_source_transactions,enumName:"cr_bank_code_type",type:"string"}) 
    cr_bank_code_type : cr_bank_code_type_vgph_source_transactions;
    @ApiProperty({example:"string"})
    cr_bank_code:string;
    @ApiProperty({example:"string"})
    cr_name:string;
    @ApiProperty({example:"number"})
    cr_amount:number;
    @ApiProperty({example:"string"})
    cr_currency:string;
    @ApiProperty({example:"string"})
    remittance_info:string;
    @ApiProperty({example:"any"})
    product_basic:any;
    @ApiProperty({example:"any"})
    product_additional:any;
    @ApiProperty({enum :charge_type_vgph_source_transactions,enumName:"charge_type",type:"string"}) 
    charge_type : charge_type_vgph_source_transactions;
    @ApiProperty({example:"string"})
    uuid:string;
    @Transform(({ value }) => value?.toISOString())
    @ApiProperty({example:"datetime"})
    trs_created_date: Date;
    @ApiProperty({example:"string"})
    trs_created_by: string;
    @Transform(({ value }) => value?.toISOString())
    @ApiProperty({example:"datetime"})
    trs_modified_date: Date;
    @ApiProperty({example:"string"})
    trs_modified_by: string;
    @ApiProperty({example:"string"})
    trs_status: string;
    @ApiProperty({example:"string"})
    trs_next_status: string;
    @ApiProperty({example:"string"})
    trs_process_id: string;
    @ApiProperty({example:"string"})
    trs_access_profile: string;
    @ApiProperty({example:"string"})
    trs_org_grp_code: string;
    @ApiProperty({example:"string"})
    trs_org_code: string;
    @ApiProperty({example:"string"})
    trs_role_grp_code: string;
    @ApiProperty({example:"string"})
    trs_role_code: string;
    @ApiProperty({example:"string"})
    trs_ps_grp_code: string;
    @ApiProperty({example:"string"})
    trs_ps_code: string;
    @ApiProperty({example:"string"})
    trs_sub_org_code: string;
    @ApiProperty({example:"string"})
    trs_sub_org_grp_code: string;
}
      
export class  vgph_source_transactions_OnlyParentEntity {
    @ApiProperty({example:"number"})
    vgphst_id:number;
    @ApiProperty({example:"string"})
    tenant_id:string;
    @ApiProperty({example:"string"})
    parent_vgphst_id:string;
    @ApiProperty({example:"string"})
    product_code:string;
    @ApiProperty({enum :direction_vgph_source_transactions,enumName:"direction",type:"string"}) 
    direction : direction_vgph_source_transactions;
    @ApiProperty({enum :process_type_vgph_source_transactions,enumName:"process_type",type:"string"}) 
    process_type : process_type_vgph_source_transactions;
    @ApiProperty({enum :tran_category_vgph_source_transactions,enumName:"tran_category",type:"string"}) 
    tran_category : tran_category_vgph_source_transactions;
    @ApiProperty({example:"string"})
    message_code:string;
    @ApiProperty({example:"string"})
    channel_name:string;
    @ApiProperty({example:"string"})
    channel_reference:string;
    @Transform(({ value }) => value?.toISOString().split('T')[0])
    @ApiProperty({example:"date"})
    tran_date:Date;
    @ApiProperty({example:"string"})
    tran_reference:string;
    @ApiProperty({example:"string"})
    tran_seq_no:string;
    @Transform(({ value }) => value?.toISOString().split('T')[0])
    @ApiProperty({example:"date"})
    value_date:Date;
    @Transform(({ value }) => value?.toISOString().split('T')[0])
    @ApiProperty({example:"date"})
    settlement_date:Date;
    @ApiProperty({example:"string"})
    dr_account:string;
    @ApiProperty({enum :dr_bank_code_type_vgph_source_transactions,enumName:"dr_bank_code_type",type:"string"}) 
    dr_bank_code_type : dr_bank_code_type_vgph_source_transactions;
    @ApiProperty({example:"string"})
    dr_bank_code:string;
    @ApiProperty({example:"string"})
    dr_name:string;
    @ApiProperty({example:"number"})
    dr_amount:number;
    @ApiProperty({example:"string"})
    dr_currency:string;
    @ApiProperty({example:"string"})
    cr_account:string;
    @ApiProperty({enum :cr_bank_code_type_vgph_source_transactions,enumName:"cr_bank_code_type",type:"string"}) 
    cr_bank_code_type : cr_bank_code_type_vgph_source_transactions;
    @ApiProperty({example:"string"})
    cr_bank_code:string;
    @ApiProperty({example:"string"})
    cr_name:string;
    @ApiProperty({example:"number"})
    cr_amount:number;
    @ApiProperty({example:"string"})
    cr_currency:string;
    @ApiProperty({example:"string"})
    remittance_info:string;
    @ApiProperty({example:"any"})
    product_basic:any;
    @ApiProperty({example:"any"})
    product_additional:any;
    @ApiProperty({enum :charge_type_vgph_source_transactions,enumName:"charge_type",type:"string"}) 
    charge_type : charge_type_vgph_source_transactions;
    @ApiProperty({example:"string"})
    uuid:string;
    @Transform(({ value }) => value?.toISOString())
    @ApiProperty({example:"datetime"})
    trs_created_date: Date;
    @ApiProperty({example:"string"})
    trs_created_by: string;
    @Transform(({ value }) => value?.toISOString())
    @ApiProperty({example:"datetime"})
    trs_modified_date: Date;
    @ApiProperty({example:"string"})
    trs_modified_by: string;
    @ApiProperty({example:"string"})
    trs_status: string;
    @ApiProperty({example:"string"})
    trs_next_status: string;
    @ApiProperty({example:"string"})
    trs_process_id: string;
    @ApiProperty({example:"string"})
    trs_access_profile: string;
    @ApiProperty({example:"string"})
    trs_org_grp_code: string;
    @ApiProperty({example:"string"})
    trs_org_code: string;
    @ApiProperty({example:"string"})
    trs_role_grp_code: string;
    @ApiProperty({example:"string"})
    trs_role_code: string;
    @ApiProperty({example:"string"})
    trs_ps_grp_code: string;
    @ApiProperty({example:"string"})
    trs_ps_code: string;
    @ApiProperty({example:"string"})
    trs_sub_org_code: string;
    @ApiProperty({example:"string"})
    trs_sub_org_grp_code: string;
}


export { vgph_source_transactions };