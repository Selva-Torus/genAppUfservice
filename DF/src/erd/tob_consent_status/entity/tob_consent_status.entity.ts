import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';



        export enum accounttype_tob_consent_consentkey{
            Retail="Retail",
            SME="SME",
            Corporate="Corporate",
        }
        export enum accountsubtype_tob_consent_consentkey{
            Current="Current",
            Savings="Savings",
        }
        export enum consenttype_tob_consent_consentkey{
            account_access_consent="account_access_consent",
            service_initiation_consent="service_initiation_consent",
            insurance_consent="insurance_consent",
        }
        export enum permissions_tob_consent_consentkey{
            ReadAccountsBasic="ReadAccountsBasic",
            ReadAccountsDetails="ReadAccountsDetails",
        }
     
  export class tob_consent_consentkeyEntity {
        @ApiProperty()
        accountid?: string;
        @ApiProperty({enum :accounttype_tob_consent_consentkey,enumName:"accounttype",type:"string"}) 
        accounttype? : accounttype_tob_consent_consentkey
        @ApiProperty({enum :accountsubtype_tob_consent_consentkey,enumName:"accountsubtype",type:"string"}) 
        accountsubtype? : accountsubtype_tob_consent_consentkey
        @ApiProperty()
        consentgroup?: string;
        @ApiProperty({enum :consenttype_tob_consent_consentkey,enumName:"consenttype",type:"string"}) 
        consenttype? : consenttype_tob_consent_consentkey
        @ApiProperty({enum :permissions_tob_consent_consentkey,enumName:"permissions",type:"string"}) 
        permissions? : permissions_tob_consent_consentkey
        @ApiProperty()
        lastbaseconsentid?: string;
        @ApiProperty()
        laststatus?: string;
      }
          
  export class tob_consent_onbehalfofEntity {
        @ApiProperty()
        tradingname?: string;
        @ApiProperty()
        legalname?: string;
        @ApiProperty()
        identifiertype?: string;
        @ApiProperty()
        identifier?: string;
        @ApiProperty({type :() => [tob_consent_consentkeyEntity]})  
        consentkey?: tob_consent_consentkeyEntity[]
      }
          
  export class tob_consent_lfiEntity {
        @ApiProperty()
        lfi_code?: string;
        @ApiProperty()
        lfi_name?: string;
        @ApiProperty({type :() => [tob_consent_onbehalfofEntity]})  
        onbehalfof?: tob_consent_onbehalfofEntity[]
      }
          
  export class tob_consent_statusEntity {
        @ApiProperty()
        id: string;
        @ApiProperty({type :() => tob_consent_lfiEntity}) 
        lfi?: tob_consent_lfiEntity
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
          

  export class  tob_consent_status_OnlyParentEntity {
        @ApiProperty()
        id?: string;
        @ApiProperty({type :() => tob_consent_lfiEntity}) 
        lfi : tob_consent_lfiEntity
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

    