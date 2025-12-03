import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';



     
  export class tof_appsEntity {
        @ApiProperty()
        app_code?: string;
        @ApiProperty()
        app_name?: string;
        @ApiProperty()
        app_url?: string;
        @ApiProperty()
        app_version?: string;
        @ApiProperty()
        status?: string;
      }
          
  export class tof_tpp_tppEntity {
        @ApiProperty()
        tpp_code?: string;
        @ApiProperty()
        tpp_name?: string;
        @ApiProperty()
        server_url?: string;
        @ApiProperty()
        status?: string;
        @ApiProperty({type :() => [tof_appsEntity]})  
        apps?: tof_appsEntity[]
      }
          
  export class tof_tppEntity {
        @ApiProperty()
        id: string;
        @ApiProperty({type :() => tof_tpp_tppEntity}) 
        tpp?: tof_tpp_tppEntity
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
          

  export class  tof_tpp_OnlyParentEntity {
        @ApiProperty()
        id?: string;
        @ApiProperty({type :() => tof_tpp_tppEntity}) 
        tpp : tof_tpp_tppEntity
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

    