import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';



     
  export class tof_lfi_insuranceEntity {
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
          
  export class tof_lfi_banksEntity {
        @ApiProperty()
        bank_code?: string;
        @ApiProperty()
        bank_name?: string;
        @ApiProperty()
        access_url?: string;
        @ApiProperty()
        status?: string;
      }
          
  export class tof_lfi_bank_insuEntity {
        @ApiProperty({type :() => [tof_lfi_banksEntity]})  
        banks?: tof_lfi_banksEntity[]
        @ApiProperty({type :() => [tof_lfi_insuranceEntity]})  
        insurance?: tof_lfi_insuranceEntity[]
      }
          
  export class tof_lfiEntity {
        @ApiProperty()
        id: string;
        @ApiProperty({type :() => tof_lfi_bank_insuEntity}) 
        lfi?: tof_lfi_bank_insuEntity
        @ApiProperty()
        trs_creator_email: string;
        @ApiProperty()
        trs_created_date: Date;
        @ApiProperty()
        trs_created_by: string;
        @ApiProperty()
        trs_modified_date: Date;
        @ApiProperty()
        trs_modified_by: string;
        @ApiProperty()
        trs_status: string;
        @ApiProperty()
        trs_next_status: string;
        @ApiProperty()
        trs_process_id: string;
        @ApiProperty()
        trs_access_profile: string;
        @ApiProperty()
        trs_org_grp_code: string;
        @ApiProperty()
        trs_org_code: string;
        @ApiProperty()
        trs_role_grp_code: string;
        @ApiProperty()
        trs_role_code: string;
        @ApiProperty()
        trs_ps_grp_code: string;
        @ApiProperty()
        trs_ps_code: string;    
      }
          

  export class  tof_lfi_OnlyParentEntity {
        @ApiProperty()
        id?: string;
        @ApiProperty({type :() => tof_lfi_bank_insuEntity}) 
        lfi : tof_lfi_bank_insuEntity
        @ApiProperty()
        trs_creator_email: string;
        @ApiProperty()
        trs_created_date: Date;
        @ApiProperty()
        trs_created_by: string;
        @ApiProperty()
        trs_modified_date: Date;
        @ApiProperty()
        trs_modified_by: string;
        @ApiProperty()
        trs_status: string;
        @ApiProperty()
        trs_next_status: string;
        @ApiProperty()
        trs_process_id: string;
        @ApiProperty()
        trs_access_profile: string;
        @ApiProperty()
        trs_org_grp_code: string;
        @ApiProperty()
        trs_org_code: string;
        @ApiProperty()
        trs_role_grp_code: string;
        @ApiProperty()
        trs_role_code: string;
        @ApiProperty()
        trs_ps_grp_code: string;
        @ApiProperty()
        trs_ps_code: string;    
      }

    