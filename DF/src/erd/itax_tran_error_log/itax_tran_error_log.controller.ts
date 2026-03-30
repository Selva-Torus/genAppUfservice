
import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Query,Req,NotFoundException,Headers} from '@nestjs/common';
import { itax_tran_error_logService } from './itax_tran_error_log.service';
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
import { itax_tran_error_logEntity } from './entity/itax_tran_error_log.entity';
//import { CreateItaxTranErrorLogDto } from '../prisma/dto/create-itaxTranErrorLog.dto';
//import { UpdateItaxTranErrorLogDto } from '../prisma/dto/update-itaxTranErrorLog.dto';
import { Createitax_tran_error_logDto } from './dto/Createitax_tran_error_log.dto';
import { Updateitax_tran_error_logDto } from './dto/Updateitax_tran_error_log.dto';
import { plainToInstance } from 'class-transformer';
import { UfService } from 'src/Torus/v1/uf/uf.service';

 
@Controller('itax_tran_error_log')
@ApiTags('ERD API')
export class itax_tran_error_logController {
  constructor(
    private readonly itax_tran_error_logService: itax_tran_error_logService,
    private readonly ufservice: UfService
  ) {}

  @Get("/schema")
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: itax_tran_error_logEntity })
  @ApiOperation({
    summary: 'schema validation',
    description: 'Retrive the datatype of the itax_tran_error_log table',
  })
  async findSchema(@Headers() authHeader: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.itax_tran_error_logService.findSchema(token);
  }

  @Get('/get')
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: itax_tran_error_logEntity, isArray: true })
  @ApiOperation({
    summary: 'Filter the records',
    description: 'Filter all the records from the itax_tran_error_log table',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to fetch' })
  async findAllmethod(@Headers() authHeader: string,@Query() query: any,@Body() body: any,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const { limit }:{ limit:number } = query;
    const { selectColumns}:{ selectColumns:any } = body;
    return this.itax_tran_error_logService.findAllmethod(query, +limit,selectColumns,token);
  }

  @Get(':itaxtel_id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'itaxtel_id',type:Number})
  @ApiOkResponse({ type: itax_tran_error_logEntity })
  @ApiOperation({
    summary: 'Fetch the only one record',
    description: 'Read only one records from the itax_tran_error_log table',
  })
  
  async findOne(@Headers() authHeader: string,@Param('itaxtel_id') itaxtel_id:number,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.itax_tran_error_logService.findOne(+itaxtel_id,token);
    return plainToInstance(itax_tran_error_logEntity, result);
  }
 
  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: itax_tran_error_logEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the itax_tran_error_log table',
  })
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
  
  async findAll(@Headers() authHeader: string,@Req() req: any,@Query("trs_created_date") trs_created_date?: Date,@Query("trs_created_by") trs_created_by?: string,@Query("trs_modified_date") trs_modified_date?: Date,@Query("trs_modified_by") trs_modified_by?: string,@Query("trs_process_id") trs_process_id?: string,@Query("trs_access_profile") trs_access_profile?: string,@Query("trs_org_grp_code") trs_org_grp_code?: string,@Query("trs_org_code") trs_org_code?: string,@Query("trs_role_grp_code") trs_role_grp_code?: string,@Query("trs_role_code") trs_role_code?: string,@Query("trs_ps_grp_code") trs_ps_grp_code?: string,@Query("trs_ps_code") trs_ps_code?: string,@Query("trs_sub_org_grp_code") trs_sub_org_grp_code?: string,@Query("trs_sub_org_code") trs_sub_org_code?: string,@Query("trs_locked_by") trs_locked_by?: string,@Query("trs_locked_time") trs_locked_time?: Date,@Query("trs_tenant_id") trs_tenant_id?: string,@Query("trs_app_code") trs_app_code?: string,@Query("trs_product_code") trs_product_code?: string,@Query("trs_event_process_status") trs_event_process_status?: string,@Query("trs_event_status") trs_event_status?: string,@Query("trs_prev_process_code") trs_prev_process_code?: string,@Query("trs_prev_status") trs_prev_status?: string,@Query("trs_prev_process_status") trs_prev_process_status?: string,@Query("trs_process_code") trs_process_code?: string,@Query("trs_status") trs_status?: string,@Query("trs_process_status") trs_process_status?: string,@Query("trs_next_process_code") trs_next_process_code?: string,@Query("trs_next_status") trs_next_status?: string,@Query("trs_next_process_status") trs_next_process_status?: string,@Query() query?: Record<string, any>) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    let presentQueryKeys:any=[
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
    const result = this.itax_tran_error_logService.findAll(token,trs_created_date,trs_created_by,trs_modified_date,trs_modified_by,trs_process_id,trs_access_profile,trs_org_grp_code,trs_org_code,trs_role_grp_code,trs_role_code,trs_ps_grp_code,trs_ps_code,trs_sub_org_grp_code,trs_sub_org_code,trs_locked_by,trs_locked_time,trs_tenant_id,trs_app_code,trs_product_code,trs_event_process_status,trs_event_status,trs_prev_process_code,trs_prev_status,trs_prev_process_status,trs_process_code,trs_status,trs_process_status,trs_next_process_code,trs_next_status,trs_next_process_status,);
    return plainToInstance(itax_tran_error_logEntity, result);
  } 

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiHeader({ name: 'xCdcaRole', required: false })
  @ApiHeader({ name: 'xCdcaUsername', required: false })
  @ApiHeader({ name: 'xCdcaRemarks', required: false })
  @ApiHeader({ name: 'xCdcaApprovalStatus', required: false })
  @ApiHeader({ name: 'xCdcaApprovalID', required: false })
  @ApiBody({ type: Createitax_tran_error_logDto })
  @ApiCreatedResponse({ type: itax_tran_error_logEntity })
  @ApiOperation({
    summary: 'Create the record',
    description: 'Create the record for the itax_tran_error_log table',
  })
  
  async create(
    @Headers('xCdcaRole') mcRole: string,
    @Headers('xCdcaUsername') mcUsername: string,
    @Headers('xCdcaRemarks') mcRemarks: string,
    @Headers('xCdcaApprovalStatus') mcApprovalStatus: string,
    @Headers('xCdcaApprovalID') mcApprovalID: string,
    @Headers() authHeader: string,
    @Body() createitax_tran_error_logDto: Prisma.itax_tran_error_logCreateInput,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);

    // Flag-driven routing: if maker-checker headers are present, use createMaster
    if (mcRole && mcUsername) {
      const makerInfo = { role: mcRole, username: mcUsername, remarks: mcRemarks, approvalStatus: mcApprovalStatus,approvalId:mcApprovalID };
      const result = await this.itax_tran_error_logService.createMaster(createitax_tran_error_logDto, makerInfo, token);
      return result;
    }

    const result = this.itax_tran_error_logService.create(createitax_tran_error_logDto,token);
    return plainToInstance(itax_tran_error_logEntity, result);
  }
 
  @Patch(':itaxtel_id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'itaxtel_id',type:Number})
  @ApiHeader({ name: 'xCdcaRole', required: false })
  @ApiHeader({ name: 'xCdcaUsername', required: false })
  @ApiHeader({ name: 'xCdcaRemarks', required: false })
  @ApiHeader({ name: 'xCdcaApprovalStatus', required: false })
  @ApiBody({ type: Updateitax_tran_error_logDto })
  @ApiOkResponse({ type: itax_tran_error_logEntity })
  @ApiOperation({
    summary: 'Update the record',
    description: 'Update the record for the itax_tran_error_log table',
  })
    
  async update(
    @Headers('xCdcaRole') mcRole: string,
    @Headers('xCdcaUsername') mcUsername: string,
    @Headers('xCdcaRemarks') mcRemarks: string,
    @Headers('xCdcaApprovalStatus') mcApprovalStatus: string,
    @Headers() authHeader: string,
@Param('itaxtel_id') itaxtel_id:number,
    @Body() updateitax_tran_error_logDto: Prisma.itax_tran_error_logUpdateInput,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);

    // Flag-driven routing: if maker-checker headers are present, use updateMaster
    if (mcRole && mcUsername) {
      const makerInfo = { role: mcRole, username: mcUsername, remarks: mcRemarks,approvalStatus: mcApprovalStatus };
      const result = await this.itax_tran_error_logService.updateMaster(+itaxtel_id,updateitax_tran_error_logDto,makerInfo,token);
      return result;
    }

    const result = this.itax_tran_error_logService.update(+itaxtel_id,updateitax_tran_error_logDto,token);
    return plainToInstance(itax_tran_error_logEntity, result);
  }
 
  @Delete(':itaxtel_id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'itaxtel_id',type:Number})
  @ApiHeader({ name: 'xCdcaRole', required: false })
  @ApiHeader({ name: 'xCdcaUsername', required: false })
  @ApiHeader({ name: 'xCdcaRemarks', required: false })
  @ApiHeader({ name: 'xCdcaApprovalStatus', required: false })
  @ApiOkResponse({ type: itax_tran_error_logEntity })
  @ApiOperation({
    summary: 'Delete the record',
    description: 'Delete the record for the itax_tran_error_log table',
  })
  
  async remove(
    @Headers('xCdcaRole') mcRole: string,
    @Headers('xCdcaUsername') mcUsername: string,
    @Headers('xCdcaRemarks') mcRemarks: string,
    @Headers('xCdcaApprovalStatus') mcApprovalStatus: string,
    @Headers() authHeader: string,
@Param('itaxtel_id') itaxtel_id:number,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);

    // Flag-driven routing: if maker-checker headers are present, use deleteMaster
    if (mcRole && mcUsername) {
      const makerInfo = { role: mcRole, username: mcUsername, remarks: mcRemarks,approvalStatus: mcApprovalStatus };
      const result = await this.itax_tran_error_logService.deleteMaster(+itaxtel_id,makerInfo,token);
      return result;
    }

    const result =  this.itax_tran_error_logService.remove(+itaxtel_id,token);
    return plainToInstance(itax_tran_error_logEntity, result);
  }  
 
  @Get('/find/first')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: itax_tran_error_logEntity })
  @ApiOperation({
    summary: 'Fetch the first record',
    description: 'Read first record from the itax_tran_error_log table',
  })
  
  async findFirst(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.itax_tran_error_logService.findFirst(token);
    return plainToInstance(itax_tran_error_logEntity, result);
  }

  @Get('/find/last')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: itax_tran_error_logEntity })
  @ApiOperation({
    summary: 'Fetch the last record',
    description: 'Read last record from the itax_tran_error_log table',
  })
  
  async findLast(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.itax_tran_error_logService.findLast(token);
    return plainToInstance(itax_tran_error_logEntity, result);
  }
}