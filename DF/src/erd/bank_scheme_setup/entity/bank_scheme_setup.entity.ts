import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';



     
  export class scheme_messagetypeEntity {
        @ApiProperty()
        sourcemsgname?: string;
        @ApiProperty()
        sourcemsgversion?: string;
        @ApiProperty()
        targetmsgname?: string;
        @ApiProperty()
        targetmsgversion?: string;
        @ApiProperty()
        sourcename?: string;
        @ApiProperty()
        sourcevalue?: string;
        @ApiProperty()
        sourceformat?: string;
        @ApiProperty()
        targetname?: string;
        @ApiProperty()
        targetvalue?: string;
        @ApiProperty()
        targetformat?: string;
      }
          
  export class schemetype_schemeEntity {
        @ApiProperty()
        name?: string;
        @ApiProperty({type :() => [scheme_messagetypeEntity]})  
        messagetypes?: scheme_messagetypeEntity[]
      }
          
  export class country_schemetypeEntity {
        @ApiProperty()
        type?: string;
        @ApiProperty({type :() => schemetype_schemeEntity}) 
        schemes?: schemetype_schemeEntity
      }
          
  export class bank_scheme_countryEntity {
        @ApiProperty()
        countrycode?: string;
        @ApiProperty({type :() => country_schemetypeEntity}) 
        schemetypes?: country_schemetypeEntity
      }
          
  export class bank_scheme_setupEntity {
        @ApiProperty()
        id: string;
        @ApiProperty()
        bankcode?: string;
        @ApiProperty({type :() => bank_scheme_countryEntity}) 
        countries?: bank_scheme_countryEntity
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
        @ApiProperty()
        trs_sub_org_grp_code?: string;
        @ApiProperty()
        trs_sub_org_code?: string;
      }
          

  export class  bank_scheme_setup_OnlyParentEntity {
        @ApiProperty()
        id?: string;
        @ApiProperty()
        bankcode?: string;
        @ApiProperty({type :() => bank_scheme_countryEntity}) 
        countries : bank_scheme_countryEntity
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
        @ApiProperty()
        trs_sub_org_grp_code?: string;
        @ApiProperty()
        trs_sub_org_code?: string;
      }

    