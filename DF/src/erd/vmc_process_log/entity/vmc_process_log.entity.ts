import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';



     
  export class vmc_process_logEntity {
        @ApiProperty()
        id: string;
        @ApiProperty()
        country_name?: string;
        @ApiProperty()
        scheme_type?: string;
        @ApiProperty()
        source_msg_type?: string;
        @ApiProperty()
        target_msg_type?: string;
        @ApiProperty()
        source_msg_format?: string;
        @ApiProperty()
        target_msg_format?: string;
        @ApiProperty()
        source_content?: string;
        @ApiProperty()
        target_content?: string;
        @ApiProperty()
        scheme?: string;
        @ApiProperty()
        vmc_api_repositorysid: string;
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
          

  export class  vmc_process_log_OnlyParentEntity {
        @ApiProperty()
        id?: string;
        @ApiProperty()
        country_name?: string;
        @ApiProperty()
        scheme_type?: string;
        @ApiProperty()
        source_msg_type?: string;
        @ApiProperty()
        target_msg_type?: string;
        @ApiProperty()
        source_msg_format?: string;
        @ApiProperty()
        target_msg_format?: string;
        @ApiProperty()
        source_content?: string;
        @ApiProperty()
        target_content?: string;
        @ApiProperty()
        scheme?: string;
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

    