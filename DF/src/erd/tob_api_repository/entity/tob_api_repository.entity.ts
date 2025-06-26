import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { tob_api_process_logs_OnlyParentEntity } from '../../tob_api_process_logs/entity/tob_api_process_logs.entity';            



     
  export class tob_api_repositoryEntity {
        @ApiProperty()
        id: string;
        @ApiProperty()
        api_name?: string;
        @ApiProperty()
        version?: string;
        @ApiProperty({
          type: `string`,
          format: `date-time`,
        })
        release_date?: Date;
        @ApiProperty()
        api_category?: string;
        @ApiProperty()
        server_url?: string;
        @ApiProperty()
        status?: string;
        @ApiProperty()
        api_resourcepath?: string;
        @ApiProperty({ type: [tob_api_process_logs_OnlyParentEntity], required: false})
        tob_api_process_logs?: tob_api_process_logs_OnlyParentEntity[];               
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
          

  export class  tob_api_repository_OnlyParentEntity {
        @ApiProperty()
        id?: string;
        @ApiProperty()
        api_name?: string;
        @ApiProperty()
        version?: string;
        @ApiProperty({
          type: `string`,
          format: `date-time`,
        })
        release_date?: Date;
        @ApiProperty()
        api_category?: string;
        @ApiProperty()
        server_url?: string;
        @ApiProperty()
        status?: string;
        @ApiProperty()
        api_resourcepath?: string;
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

    