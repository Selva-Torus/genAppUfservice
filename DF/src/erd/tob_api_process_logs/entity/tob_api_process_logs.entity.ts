import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';



     
  export class tob_api_process_logsEntity {
        @ApiProperty()
        id: string;
        @ApiProperty()
        apiendpoint?: string;
        @ApiProperty()
        requestdata?: Prisma.InputJsonValue;
        @ApiProperty()
        responsedata?: Prisma.InputJsonValue;
        @ApiProperty()
        apiname?: string;
        @ApiProperty()
        sample?: string;
        @ApiProperty()
        tob_consent_requestid: string;
        @ApiProperty()
        tob_api_repositoryid: string;
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
          

  export class  tob_api_process_logs_OnlyParentEntity {
        @ApiProperty()
        id?: string;
        @ApiProperty()
        apiendpoint?: string;
        @ApiProperty()
        requestdata?: Prisma.InputJsonValue;
        @ApiProperty()
        responsedata?: Prisma.InputJsonValue;
        @ApiProperty()
        apiname?: string;
        @ApiProperty()
        sample?: string;
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

    