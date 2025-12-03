import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';



        export enum consenttype_tof_consents_consentkey{
            account_access_consent="account_access_consent",
            service_initiation_consent="service_initiation_consent",
            insurance_consent="insurance_consent",
        }
        export enum permissions_tof_consents_consentkey{
            ReadAccountsBasic="ReadAccountsBasic",
            ReadAccountsDetails="ReadAccountsDetails",
            ReadParty="ReadParty",
            ReadBalances="ReadBalances",
        }
     
  export class tof_consents_consentkeyEntity {
        @ApiProperty()
        baseconsentid?: string;
        @ApiProperty()
        resourceconsentid?: string;
        @ApiProperty()
        consentgroup?: string;
        @ApiProperty({enum :consenttype_tof_consents_consentkey,isArray: true}) 
        consenttype? : consenttype_tof_consents_consentkey
        @ApiProperty({enum :permissions_tof_consents_consentkey,isArray: true}) 
        permissions? : permissions_tof_consents_consentkey
        @ApiProperty()
        tpp_code?: string;
        @ApiProperty()
        tpp_name?: string;
        @ApiProperty()
        app_code?: string;
        @ApiProperty()
        app_name?: string;
      }
          
  export class tof_consents_onbelfofEntity {
        @ApiProperty()
        tradingname?: string;
        @ApiProperty()
        legalname?: string;
        @ApiProperty()
        identifiertype?: string;
        @ApiProperty()
        identifier?: string;
        @ApiProperty({type :() => [tof_consents_consentkeyEntity]})  
        consentkey?: tof_consents_consentkeyEntity[]
      }
          
  export class tof_consents_lfiEntity {
        @ApiProperty()
        lfi_code?: string;
        @ApiProperty()
        lfi_name?: string;
        @ApiProperty({type :() => [tof_consents_onbelfofEntity]})  
        onbehalfof?: tof_consents_onbelfofEntity[]
      }
          
  export class tof_consentsEntity {
        @ApiProperty()
        id: string;
        @ApiProperty({type :() => tof_consents_lfiEntity}) 
        lfi?: tof_consents_lfiEntity
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
          

  export class  tof_consents_OnlyParentEntity {
        @ApiProperty()
        id?: string;
        @ApiProperty({type :() => tof_consents_lfiEntity}) 
        lfi : tof_consents_lfiEntity
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

    