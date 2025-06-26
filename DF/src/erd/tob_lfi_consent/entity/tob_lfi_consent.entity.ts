import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';



     
  export class tob_lfi_dataEntity {
        @ApiProperty()
        ids: string;
        @ApiProperty()
        parid?: string;
        @ApiProperty()
        rartype?: string;
        @ApiProperty()
        standardversion?: string;
        @ApiProperty()
        consentgroupid?: string;
        @ApiProperty()
        requesturl?: string;
        @ApiProperty()
        consenttype: string;
        @ApiProperty()
        status?: string;
        @ApiProperty()
        consentid?: string;
      }
          
  export class tob_lfi_consentEntity {
        @ApiProperty()
        id: string;
        @ApiProperty({type :() => tob_lfi_dataEntity}) 
        data: tob_lfi_dataEntity
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
          

  export class  tob_lfi_consent_OnlyParentEntity {
        @ApiProperty()
        id?: string;
        @ApiProperty({type :() => tob_lfi_dataEntity}) 
        data : tob_lfi_dataEntity
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

    