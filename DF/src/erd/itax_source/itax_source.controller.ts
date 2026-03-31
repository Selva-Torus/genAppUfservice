
import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Query,Req,NotFoundException,Headers} from '@nestjs/common';
import { itax_sourceService } from './itax_source.service';
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
import { itax_sourceEntity } from './entity/itax_source.entity';
//import { CreateItaxSourceDto } from '../prisma/dto/create-itaxSource.dto';
//import { UpdateItaxSourceDto } from '../prisma/dto/update-itaxSource.dto';
import { Createitax_sourceDto } from './dto/Createitax_source.dto';
import { Updateitax_sourceDto } from './dto/Updateitax_source.dto';
import { plainToInstance } from 'class-transformer';
import { UfService } from 'src/Torus/v1/uf/uf.service';

 
@Controller('itax_source')
@ApiTags('ERD API')
export class itax_sourceController {
  constructor(
    private readonly itax_sourceService: itax_sourceService,
    private readonly ufservice: UfService
  ) {}

  @Get("/schema")
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: itax_sourceEntity })
  @ApiOperation({
    summary: 'schema validation',
    description: 'Retrive the datatype of the itax_source table',
  })
  async findSchema(@Headers() authHeader: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.itax_sourceService.findSchema(token);
  }

  @Get('/get')
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: itax_sourceEntity, isArray: true })
  @ApiOperation({
    summary: 'Filter the records',
    description: 'Filter all the records from the itax_source table',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to fetch' })
  async findAllmethod(@Headers() authHeader: string,@Query() query: any,@Body() body: any,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const { limit }:{ limit:number } = query;
    const { selectColumns}:{ selectColumns:any } = body;
    return this.itax_sourceService.findAllmethod(query, +limit,selectColumns,token);
  }

  @Get(':itaxs_id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'itaxs_id',type:Number})
  @ApiOkResponse({ type: itax_sourceEntity })
  @ApiOperation({
    summary: 'Fetch the only one record',
    description: 'Read only one records from the itax_source table',
  })
  
  async findOne(@Headers() authHeader: string,@Param('itaxs_id') itaxs_id:number,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.itax_sourceService.findOne(+itaxs_id,token);
    return plainToInstance(itax_sourceEntity, result);
  }
 
  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: itax_sourceEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the itax_source table',
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
  @ApiQuery({ name: 'trs_token_id', required: false })
  
  async findAll(@Headers() authHeader: string,@Req() req: any,@Query("trs_created_date") trs_created_date?: Date,@Query("trs_created_by") trs_created_by?: string,@Query("trs_modified_date") trs_modified_date?: Date,@Query("trs_modified_by") trs_modified_by?: string,@Query("trs_process_id") trs_process_id?: string,@Query("trs_access_profile") trs_access_profile?: string,@Query("trs_org_grp_code") trs_org_grp_code?: string,@Query("trs_org_code") trs_org_code?: string,@Query("trs_role_grp_code") trs_role_grp_code?: string,@Query("trs_role_code") trs_role_code?: string,@Query("trs_ps_grp_code") trs_ps_grp_code?: string,@Query("trs_ps_code") trs_ps_code?: string,@Query("trs_sub_org_grp_code") trs_sub_org_grp_code?: string,@Query("trs_sub_org_code") trs_sub_org_code?: string,@Query("trs_locked_by") trs_locked_by?: string,@Query("trs_locked_time") trs_locked_time?: Date,@Query("trs_tenant_id") trs_tenant_id?: string,@Query("trs_app_code") trs_app_code?: string,@Query("trs_product_code") trs_product_code?: string,@Query("trs_event_process_status") trs_event_process_status?: string,@Query("trs_event_status") trs_event_status?: string,@Query("trs_token_id") trs_token_id?: string,@Query() query?: Record<string, any>) {
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
      "trs_token_id",
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
    const result = this.itax_sourceService.findAll(token,trs_created_date,trs_created_by,trs_modified_date,trs_modified_by,trs_process_id,trs_access_profile,trs_org_grp_code,trs_org_code,trs_role_grp_code,trs_role_code,trs_ps_grp_code,trs_ps_code,trs_sub_org_grp_code,trs_sub_org_code,trs_locked_by,trs_locked_time,trs_tenant_id,trs_app_code,trs_product_code,trs_event_process_status,trs_event_status,trs_token_id,);
    return plainToInstance(itax_sourceEntity, result);
  } 

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiHeader({ name: 'xCdcaRole', required: false })
  @ApiHeader({ name: 'xCdcaUsername', required: false })
  @ApiHeader({ name: 'xCdcaRemarks', required: false })
  @ApiHeader({ name: 'xCdcaApprovalStatus', required: false })
  @ApiHeader({ name: 'xCdcaApprovalID', required: false })
  @ApiBody({ type: Createitax_sourceDto })
  @ApiCreatedResponse({ type: itax_sourceEntity })
  @ApiOperation({
    summary: 'Create the record',
    description: 'Create the record for the itax_source table',
  })
  
  async create(
    @Headers('xCdcaRole') mcRole: string,
    @Headers('xCdcaUsername') mcUsername: string,
    @Headers('xCdcaRemarks') mcRemarks: string,
    @Headers('xCdcaApprovalStatus') mcApprovalStatus: string,
    @Headers('xCdcaApprovalID') mcApprovalID: string,
    @Headers() authHeader: string,
    @Body() createitax_sourceDto: Prisma.itax_sourceCreateInput,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);

    // Flag-driven routing: if maker-checker headers are present, use createMaster
    if (mcRole && mcUsername) {
      const makerInfo = { role: mcRole, username: mcUsername, remarks: mcRemarks, approvalStatus: mcApprovalStatus,approvalId:mcApprovalID };
      const result = await this.itax_sourceService.createMaster(createitax_sourceDto, makerInfo, token);
      return result;
    }

    const result = this.itax_sourceService.create(createitax_sourceDto,token);
    return plainToInstance(itax_sourceEntity, result);
  }
 
  @Patch(':itaxs_id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'itaxs_id',type:Number})
  @ApiHeader({ name: 'xCdcaRole', required: false })
  @ApiHeader({ name: 'xCdcaUsername', required: false })
  @ApiHeader({ name: 'xCdcaRemarks', required: false })
  @ApiHeader({ name: 'xCdcaApprovalStatus', required: false })
  @ApiBody({ type: Updateitax_sourceDto })
  @ApiOkResponse({ type: itax_sourceEntity })
  @ApiOperation({
    summary: 'Update the record',
    description: 'Update the record for the itax_source table',
  })
    
  async update(
    @Headers('xCdcaRole') mcRole: string,
    @Headers('xCdcaUsername') mcUsername: string,
    @Headers('xCdcaRemarks') mcRemarks: string,
    @Headers('xCdcaApprovalStatus') mcApprovalStatus: string,
    @Headers() authHeader: string,
@Param('itaxs_id') itaxs_id:number,
    @Body() updateitax_sourceDto: Prisma.itax_sourceUpdateInput,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);

    // Flag-driven routing: if maker-checker headers are present, use updateMaster
    if (mcRole && mcUsername) {
      const makerInfo = { role: mcRole, username: mcUsername, remarks: mcRemarks,approvalStatus: mcApprovalStatus };
      const result = await this.itax_sourceService.updateMaster(+itaxs_id,updateitax_sourceDto,makerInfo,token);
      return result;
    }

    const result = this.itax_sourceService.update(+itaxs_id,updateitax_sourceDto,token);
    return plainToInstance(itax_sourceEntity, result);
  }
 
  @Delete(':itaxs_id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'itaxs_id',type:Number})
  @ApiHeader({ name: 'xCdcaRole', required: false })
  @ApiHeader({ name: 'xCdcaUsername', required: false })
  @ApiHeader({ name: 'xCdcaRemarks', required: false })
  @ApiHeader({ name: 'xCdcaApprovalStatus', required: false })
  @ApiOkResponse({ type: itax_sourceEntity })
  @ApiOperation({
    summary: 'Delete the record',
    description: 'Delete the record for the itax_source table',
  })
  
  async remove(
    @Headers('xCdcaRole') mcRole: string,
    @Headers('xCdcaUsername') mcUsername: string,
    @Headers('xCdcaRemarks') mcRemarks: string,
    @Headers('xCdcaApprovalStatus') mcApprovalStatus: string,
    @Headers() authHeader: string,
@Param('itaxs_id') itaxs_id:number,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);

    // Flag-driven routing: if maker-checker headers are present, use deleteMaster
    if (mcRole && mcUsername) {
      const makerInfo = { role: mcRole, username: mcUsername, remarks: mcRemarks,approvalStatus: mcApprovalStatus };
      const result = await this.itax_sourceService.deleteMaster(+itaxs_id,makerInfo,token);
      return result;
    }

    const result =  this.itax_sourceService.remove(+itaxs_id,token);
    return plainToInstance(itax_sourceEntity, result);
  }  
 
  @Get('/find/first')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: itax_sourceEntity })
  @ApiOperation({
    summary: 'Fetch the first record',
    description: 'Read first record from the itax_source table',
  })
  
  async findFirst(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.itax_sourceService.findFirst(token);
    return plainToInstance(itax_sourceEntity, result);
  }

  @Get('/find/last')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: itax_sourceEntity })
  @ApiOperation({
    summary: 'Fetch the last record',
    description: 'Read last record from the itax_source table',
  })
  
  async findLast(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.itax_sourceService.findLast(token);
    return plainToInstance(itax_sourceEntity, result);
  }
}