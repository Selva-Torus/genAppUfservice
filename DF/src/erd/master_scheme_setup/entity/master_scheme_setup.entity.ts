import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';



     
  export class scheme_messagetypesEntity {
        @ApiProperty()
        sourcemsgname?: string;
        @ApiProperty()
        sourcemsgversion?: string;
        @ApiProperty()
        targetmsgname?: string;
        @ApiProperty()
        targetmsgversion?: string;
      }
          
  export class schemetype_schemesEntity {
        @ApiProperty()
        name?: string;
        @ApiProperty({type :() => [scheme_messagetypesEntity]})  
        messagetypes?: scheme_messagetypesEntity[]
      }
          
  export class country_schemetypeaEntity {
        @ApiProperty()
        type?: string;
        @ApiProperty({type :() => schemetype_schemesEntity}) 
        schemes?: schemetype_schemesEntity
      }
          
  export class master_scheme_setupEntity {
        @ApiProperty()
        id: string;
        @ApiProperty()
        countrycode?: string;
        @ApiProperty({type :() => country_schemetypeaEntity}) 
        schemetypes?: country_schemetypeaEntity
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
          

  export class  master_scheme_setup_OnlyParentEntity {
        @ApiProperty()
        id?: string;
        @ApiProperty()
        countrycode?: string;
        @ApiProperty({type :() => country_schemetypeaEntity}) 
        schemetypes : country_schemetypeaEntity
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

    