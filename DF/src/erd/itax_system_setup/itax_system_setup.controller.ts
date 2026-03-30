
import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Query,Req,NotFoundException,Headers} from '@nestjs/common';
import { itax_system_setupService } from './itax_system_setup.service';
import { Prisma } from '@prisma/client';
import { ApiOkResponse, ApiTags,ApiOperation,ApiBody,
  ApiQuery,ApiParam,
  ApiBadRequestResponse,ApiUnauthorizedResponse,
  ApiForbiddenResponse,ApiNotAcceptableResponse,
  ApiConflictResponse,ApiNotFoundResponse,
  ApiMethodNotAllowedResponse,
  ApiRequestTimeoutResponse,
  ApiGoneResponse,
  ApiUnsupportedMediaTypeResponse,
  ApiUnprocessableEntityResponse,
  ApiInternalServerErrorResponse,
  ApiNotImplementedResponse,
  ApiBadGatewayResponse,
  ApiServiceUnavailableResponse,
  ApiGatewayTimeoutResponse,
  ApiBearerAuth ,
  ApiCreatedResponse,
  ApiHeader
} from '@nestjs/swagger';
import { itax_system_setupEntity } from './entity/itax_system_setup.entity';
//import { CreateItaxSystemSetupDto } from '../prisma/dto/create-itaxSystemSetup.dto';
//import { UpdateItaxSystemSetupDto } from '../prisma/dto/update-itaxSystemSetup.dto';
import { Createitax_system_setupDto } from './dto/Createitax_system_setup.dto';
import { Updateitax_system_setupDto } from './dto/Updateitax_system_setup.dto';
import { plainToInstance } from 'class-transformer';
import { UfService } from 'src/Torus/v1/uf/uf.service';

 
@Controller('itax_system_setup')
@ApiTags('ERD API')
export class itax_system_setupController {
  constructor(
    private readonly itax_system_setupService: itax_system_setupService,
    private readonly ufservice: UfService
  ) {}

  @Get("/schema")
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: itax_system_setupEntity })
  @ApiOperation({
    summary: 'schema validation',
    description: 'Retrive the datatype of the itax_system_setup table',
  })
  async findSchema(@Headers() authHeader: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.itax_system_setupService.findSchema(token);
  }

  @Get('/get')
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: itax_system_setupEntity, isArray: true })
  @ApiOperation({
    summary: 'Filter the records',
    description: 'Filter all the records from the itax_system_setup table',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to fetch' })
  async findAllmethod(@Headers() authHeader: string,@Query() query: any,@Body() body: any,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const { limit }:{ limit:number } = query;
    const { selectColumns}:{ selectColumns:any } = body;
    return this.itax_system_setupService.findAllmethod(query, +limit,selectColumns,token);
  }

  @Get(':itaxss_id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'itaxss_id',type:Number})
  @ApiOkResponse({ type: itax_system_setupEntity })
  @ApiOperation({
    summary: 'Fetch the only one record',
    description: 'Read only one records from the itax_system_setup table',
  })
  
  async findOne(@Headers() authHeader: string,@Param('itaxss_id') itaxss_id:number,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.itax_system_setupService.findOne(+itaxss_id,token);
    return plainToInstance(itax_system_setupEntity, result);
  }
 
  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: itax_system_setupEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the itax_system_setup table',
  })
  @ApiQuery({ name: 'setup_code', required: false})
  @ApiQuery({ name: 'trs_created_date', required: false })
  @ApiQuery({ name: 'trs_created_by', required: false })
  @ApiQuery({ name: 'trs_modified_date', required: false })
  @ApiQuery({ name: 'trs_modified_by', required: false })
  @ApiQuery({ name: 'trs_process_id', required: false })
  @ApiQuery({ name: 'trs_access_profile', required: false })
  @ApiQuery({ name: 'trs_org_grp_code', required: false })
  @ApiQuery({ name: 'trs_org_code', required: false })
  @ApiQuery({ name: 'trs_role_grp_code', required: false })
  @ApiQuery({ name: 'trs_role_code', required: false })
  @ApiQuery({ name: 'trs_ps_grp_code', required: false })
  @ApiQuery({ name: 'trs_ps_code', required: false })
  @ApiQuery({ name: 'trs_sub_org_grp_code', required: false })
  @ApiQuery({ name: 'trs_sub_org_code', required: false })
  @ApiQuery({ name: 'trs_locked_by', required: false })
  @ApiQuery({ name: 'trs_locked_time', required: false })
  @ApiQuery({ name: 'trs_tenant_id', required: false })
  @ApiQuery({ name: 'trs_app_code', required: false })
  @ApiQuery({ name: 'trs_product_code', required: false })
  @ApiQuery({ name: 'trs_event_process_status', required: false })
  @ApiQuery({ name: 'trs_event_status', required: false })
  @ApiQuery({ name: 'trs_prev_process_code', required: false })
  @ApiQuery({ name: 'trs_prev_status', required: false })
  @ApiQuery({ name: 'trs_prev_process_status', required: false })
  @ApiQuery({ name: 'trs_process_code', required: false })
  @ApiQuery({ name: 'trs_status', required: false })
  @ApiQuery({ name: 'trs_process_status', required: false })
  @ApiQuery({ name: 'trs_next_process_code', required: false })
  @ApiQuery({ name: 'trs_next_status', required: false })
  @ApiQuery({ name: 'trs_next_process_status', required: false })
  
  async findAll(@Headers() authHeader: string,@Req() req: any,@Query("trs_created_date") trs_created_date?: Date,@Query("trs_created_by") trs_created_by?: string,@Query("trs_modified_date") trs_modified_date?: Date,@Query("trs_modified_by") trs_modified_by?: string,@Query("trs_process_id") trs_process_id?: string,@Query("trs_access_profile") trs_access_profile?: string,@Query("trs_org_grp_code") trs_org_grp_code?: string,@Query("trs_org_code") trs_org_code?: string,@Query("trs_role_grp_code") trs_role_grp_code?: string,@Query("trs_role_code") trs_role_code?: string,@Query("trs_ps_grp_code") trs_ps_grp_code?: string,@Query("trs_ps_code") trs_ps_code?: string,@Query("trs_sub_org_grp_code") trs_sub_org_grp_code?: string,@Query("trs_sub_org_code") trs_sub_org_code?: string,@Query("trs_locked_by") trs_locked_by?: string,@Query("trs_locked_time") trs_locked_time?: Date,@Query("trs_tenant_id") trs_tenant_id?: string,@Query("trs_app_code") trs_app_code?: string,@Query("trs_product_code") trs_product_code?: string,@Query("trs_event_process_status") trs_event_process_status?: string,@Query("trs_event_status") trs_event_status?: string,@Query("trs_prev_process_code") trs_prev_process_code?: string,@Query("trs_prev_status") trs_prev_status?: string,@Query("trs_prev_process_status") trs_prev_process_status?: string,@Query("trs_process_code") trs_process_code?: string,@Query("trs_status") trs_status?: string,@Query("trs_process_status") trs_process_status?: string,@Query("trs_next_process_code") trs_next_process_code?: string,@Query("trs_next_status") trs_next_status?: string,@Query("trs_next_process_status") trs_next_process_status?: string,@Query('setup_code') setup_code?:string,@Query() query?: Record<string, any>) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    let presentQueryKeys:any=[
      'setup_code',
      "trs_created_date",
      "trs_created_by",
      "trs_modified_date",
      "trs_modified_by",
      "trs_process_id",
      "trs_access_profile",
      "trs_org_grp_code",
      "trs_org_code",
      "trs_role_grp_code",
      "trs_role_code",
      "trs_ps_grp_code",
      "trs_ps_code",
      "trs_sub_org_grp_code",
      "trs_sub_org_code",
      "trs_locked_by",
      "trs_locked_time",
      "trs_tenant_id",    
      "trs_app_code",         
      "trs_product_code",
      "trs_event_process_status",         
      "trs_event_status",
      "trs_prev_process_code",    
      "trs_prev_status",         
      "trs_prev_process_status",
      "trs_process_code",         
      "trs_status",               
      "trs_process_status",        
      "trs_next_process_code",    
      "trs_next_status",          
      "trs_next_process_status"
    ]
    let comingQueryKeys:any=Object.keys(query)||[]
    let isComingQuerysAreValid=true;
    if(comingQueryKeys.length==0)
      {
        isComingQuerysAreValid = true;
      }
  
      // If arrays have different lengths, they cannot be equal
      if (comingQueryKeys.length > presentQueryKeys.length) {
        isComingQuerysAreValid= false;
      }
      // Compare each element after sorting
      for (let i = 0; i < comingQueryKeys.length; i++) {
        if (!presentQueryKeys.includes(comingQueryKeys[i])) {
          isComingQuerysAreValid=false;
        }
      }
    if (req.originalUrl.includes('?') && req.originalUrl.split('?')[1].includes('/') || isComingQuerysAreValid==false) {
      throw new NotFoundException('Invalid query parameter structure.');
    }
    const result = this.itax_system_setupService.findAll(token,trs_created_date,trs_created_by,trs_modified_date,trs_modified_by,trs_process_id,trs_access_profile,trs_org_grp_code,trs_org_code,trs_role_grp_code,trs_role_code,trs_ps_grp_code,trs_ps_code,trs_sub_org_grp_code,trs_sub_org_code,trs_locked_by,trs_locked_time,trs_tenant_id,trs_app_code,trs_product_code,trs_event_process_status,trs_event_status,trs_prev_process_code,trs_prev_status,trs_prev_process_status,trs_process_code,trs_status,trs_process_status,trs_next_process_code,trs_next_status,trs_next_process_status,setup_code);
    return plainToInstance(itax_system_setupEntity, result);
  } 

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiHeader({ name: 'xCdcaRole', required: false })
  @ApiHeader({ name: 'xCdcaUsername', required: false })
  @ApiHeader({ name: 'xCdcaRemarks', required: false })
  @ApiHeader({ name: 'xCdcaApprovalStatus', required: false })
  @ApiHeader({ name: 'xCdcaApprovalID', required: false })
  @ApiBody({ type: Createitax_system_setupDto })
  @ApiCreatedResponse({ type: itax_system_setupEntity })
  @ApiOperation({
    summary: 'Create the record',
    description: 'Create the record for the itax_system_setup table',
  })
  
  async create(
    @Headers('xCdcaRole') mcRole: string,
    @Headers('xCdcaUsername') mcUsername: string,
    @Headers('xCdcaRemarks') mcRemarks: string,
    @Headers('xCdcaApprovalStatus') mcApprovalStatus: string,
    @Headers('xCdcaApprovalID') mcApprovalID: string,
    @Headers() authHeader: string,
    @Body() createitax_system_setupDto: Prisma.itax_system_setupCreateInput,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);

    // Flag-driven routing: if maker-checker headers are present, use createMaster
    if (mcRole && mcUsername) {
      const makerInfo = { role: mcRole, username: mcUsername, remarks: mcRemarks, approvalStatus: mcApprovalStatus,approvalId:mcApprovalID };
      const result = await this.itax_system_setupService.createMaster(createitax_system_setupDto, makerInfo, token);
      return result;
    }

    const result = this.itax_system_setupService.create(createitax_system_setupDto,token);
    return plainToInstance(itax_system_setupEntity, result);
  }
 
  @Patch(':itaxss_id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'itaxss_id',type:Number})
  @ApiHeader({ name: 'xCdcaRole', required: false })
  @ApiHeader({ name: 'xCdcaUsername', required: false })
  @ApiHeader({ name: 'xCdcaRemarks', required: false })
  @ApiHeader({ name: 'xCdcaApprovalStatus', required: false })
  @ApiBody({ type: Updateitax_system_setupDto })
  @ApiOkResponse({ type: itax_system_setupEntity })
  @ApiOperation({
    summary: 'Update the record',
    description: 'Update the record for the itax_system_setup table',
  })
    
  async update(
    @Headers('xCdcaRole') mcRole: string,
    @Headers('xCdcaUsername') mcUsername: string,
    @Headers('xCdcaRemarks') mcRemarks: string,
    @Headers('xCdcaApprovalStatus') mcApprovalStatus: string,
    @Headers() authHeader: string,
@Param('itaxss_id') itaxss_id:number,
    @Body() updateitax_system_setupDto: Prisma.itax_system_setupUpdateInput,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);

    // Flag-driven routing: if maker-checker headers are present, use updateMaster
    if (mcRole && mcUsername) {
      const makerInfo = { role: mcRole, username: mcUsername, remarks: mcRemarks,approvalStatus: mcApprovalStatus };
      const result = await this.itax_system_setupService.updateMaster(+itaxss_id,updateitax_system_setupDto,makerInfo,token);
      return result;
    }

    const result = this.itax_system_setupService.update(+itaxss_id,updateitax_system_setupDto,token);
    return plainToInstance(itax_system_setupEntity, result);
  }
 
  @Delete(':itaxss_id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'itaxss_id',type:Number})
  @ApiHeader({ name: 'xCdcaRole', required: false })
  @ApiHeader({ name: 'xCdcaUsername', required: false })
  @ApiHeader({ name: 'xCdcaRemarks', required: false })
  @ApiHeader({ name: 'xCdcaApprovalStatus', required: false })
  @ApiOkResponse({ type: itax_system_setupEntity })
  @ApiOperation({
    summary: 'Delete the record',
    description: 'Delete the record for the itax_system_setup table',
  })
  
  async remove(
    @Headers('xCdcaRole') mcRole: string,
    @Headers('xCdcaUsername') mcUsername: string,
    @Headers('xCdcaRemarks') mcRemarks: string,
    @Headers('xCdcaApprovalStatus') mcApprovalStatus: string,
    @Headers() authHeader: string,
@Param('itaxss_id') itaxss_id:number,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);

    // Flag-driven routing: if maker-checker headers are present, use deleteMaster
    if (mcRole && mcUsername) {
      const makerInfo = { role: mcRole, username: mcUsername, remarks: mcRemarks,approvalStatus: mcApprovalStatus };
      const result = await this.itax_system_setupService.deleteMaster(+itaxss_id,makerInfo,token);
      return result;
    }

    const result =  this.itax_system_setupService.remove(+itaxss_id,token);
    return plainToInstance(itax_system_setupEntity, result);
  }  
 
  @Get('/find/first')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: itax_system_setupEntity })
  @ApiOperation({
    summary: 'Fetch the first record',
    description: 'Read first record from the itax_system_setup table',
  })
  
  async findFirst(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.itax_system_setupService.findFirst(token);
    return plainToInstance(itax_system_setupEntity, result);
  }

  @Get('/find/last')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: itax_system_setupEntity })
  @ApiOperation({
    summary: 'Fetch the last record',
    description: 'Read last record from the itax_system_setup table',
  })
  
  async findLast(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.itax_system_setupService.findLast(token);
    return plainToInstance(itax_system_setupEntity, result);
  }
}