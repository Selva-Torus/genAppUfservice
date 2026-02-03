
import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Query,Req,NotFoundException,Headers} from '@nestjs/common';
import { vgph_destination_stagingService } from './vgph_destination_staging.service';
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
import { vgph_destination_stagingEntity } from './entity/vgph_destination_staging.entity';
//import { CreateVgphDestinationStagingDto } from '../prisma/dto/create-vgphDestinationStaging.dto';
//import { UpdateVgphDestinationStagingDto } from '../prisma/dto/update-vgphDestinationStaging.dto';
import { Createvgph_destination_stagingDto } from './dto/Createvgph_destination_staging.dto';
import { Updatevgph_destination_stagingDto } from './dto/Updatevgph_destination_staging.dto';
import { plainToInstance } from 'class-transformer';
import { UfService } from 'src/Torus/v1/uf/uf.service';

 
@Controller('vgph_destination_staging')
@ApiTags('ERD API')
export class vgph_destination_stagingController {
  constructor(
    private readonly vgph_destination_stagingService: vgph_destination_stagingService,
    private readonly ufservice: UfService
  ) {}

  @Get("/schema")
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: vgph_destination_stagingEntity })
  @ApiOperation({
    summary: 'schema validation',
    description: 'Retrive the datatype of the vgph_destination_staging table',
  })
  async findSchema(@Headers() authHeader: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.vgph_destination_stagingService.findSchema(token);
  }

  @Get('/get')
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: vgph_destination_stagingEntity, isArray: true })
  @ApiOperation({
    summary: 'Filter the records',
    description: 'Filter all the records from the vgph_destination_staging table',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to fetch' })
  async findAllmethod(@Headers() authHeader: string,@Query() query: any,@Body() body: any,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const { limit }:{ limit:number } = query;
    const { selectColumns}:{ selectColumns:any } = body;
    return this.vgph_destination_stagingService.findAllmethod(query, +limit,selectColumns,token);
  }

  @Get(':vgphds_id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'vgphds_id',type:Number})
  @ApiOkResponse({ type: vgph_destination_stagingEntity })
  @ApiOperation({
    summary: 'Fetch the only one record',
    description: 'Read only one records from the vgph_destination_staging table',
  })
  
  async findOne(@Headers() authHeader: string,@Param('vgphds_id') vgphds_id:number,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.vgph_destination_stagingService.findOne(+vgphds_id,token);
    return plainToInstance(vgph_destination_stagingEntity, result);
  }
 
  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'vgphds_id',type:Number})
  @ApiOkResponse({ type: vgph_destination_stagingEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the vgph_destination_staging table',
  })
  
  async findAll(@Headers() authHeader: string,@Req() req: any,@Query("trs_created_date") trs_created_date?: Date,@Query("trs_created_by") trs_created_by?: string,@Query("trs_modified_date") trs_modified_date?: Date,@Query("trs_modified_by") trs_modified_by?: string,@Query("trs_next_status") trs_next_status?: string,@Query("trs_status") trs_status?: string,@Query("trs_process_id") trs_process_id?: string,@Query("trs_access_profile") trs_access_profile?: string,@Query("trs_org_grp_code") trs_org_grp_code?: string,@Query("trs_org_code") trs_org_code?: string,@Query("trs_role_grp_code") trs_role_grp_code?: string,@Query("trs_role_code") trs_role_code?: string,@Query("trs_ps_grp_code") trs_ps_grp_code?: string,@Query("trs_ps_code") trs_ps_code?: string,@Query("trs_sub_org_grp_code") trs_sub_org_grp_code?: string,@Query("trs_sub_org_code") trs_sub_org_code?: string,@Query('vgphds_id') vgphds_id?:string,@Query() query?: Record<string, any>) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    let presentQueryKeys:any=[
      'vgphds_id',
      "trs_created_date",
      "trs_created_by",
      "trs_modified_date",
      "trs_modified_by",
      "trs_next_status",
      "trs_status",
      "trs_process_id",
      "trs_access_profile",
      "trs_org_grp_code",
      "trs_org_code",
      "trs_role_grp_code",
      "trs_role_code",
      "trs_ps_grp_code",
      "trs_ps_code",
      "trs_sub_org_grp_code",
      "trs_sub_org_code"
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
    const result = this.vgph_destination_stagingService.findAll(token,trs_created_date,trs_created_by,trs_modified_date,trs_modified_by,trs_next_status,trs_status,trs_process_id,trs_access_profile,trs_org_grp_code,trs_org_code,trs_role_grp_code,trs_role_code,trs_ps_grp_code,trs_ps_code,trs_sub_org_grp_code,trs_sub_org_code,+vgphds_id);
    return plainToInstance(vgph_destination_stagingEntity, result);
  } 

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiHeader({ name: 'xCdcaRole', required: false })
  @ApiHeader({ name: 'xCdcaUsername', required: false })
  @ApiHeader({ name: 'xCdcaRemarks', required: false })
  @ApiHeader({ name: 'xCdcaApprovalStatus', required: false })
  @ApiHeader({ name: 'xCdcaApprovalID', required: false })
  @ApiBody({ type: Createvgph_destination_stagingDto })
  @ApiCreatedResponse({ type: vgph_destination_stagingEntity })
  @ApiOperation({
    summary: 'Create the record',
    description: 'Create the record for the vgph_destination_staging table',
  })
  
  async create(
    @Headers('xCdcaRole') mcRole: string,
    @Headers('xCdcaUsername') mcUsername: string,
    @Headers('xCdcaRemarks') mcRemarks: string,
    @Headers('xCdcaApprovalStatus') mcApprovalStatus: string,
    @Headers('xCdcaApprovalID') mcApprovalID: string,
    @Headers() authHeader: string,
    @Body() createvgph_destination_stagingDto: Prisma.vgph_destination_stagingCreateInput,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);

    // Flag-driven routing: if maker-checker headers are present, use createMaster
    if (mcRole && mcUsername) {
      const makerInfo = { role: mcRole, username: mcUsername, remarks: mcRemarks, approvalStatus: mcApprovalStatus,approvalId:mcApprovalID };
      const result = await this.vgph_destination_stagingService.createMaster(createvgph_destination_stagingDto, makerInfo, token);
      return result;
    }

    const result = this.vgph_destination_stagingService.create(createvgph_destination_stagingDto,token);
    return plainToInstance(vgph_destination_stagingEntity, result);
  }
 
  @Patch(':vgphds_id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'vgphds_id',type:Number})
  @ApiHeader({ name: 'xCdcaRole', required: false })
  @ApiHeader({ name: 'xCdcaUsername', required: false })
  @ApiHeader({ name: 'xCdcaRemarks', required: false })
  @ApiHeader({ name: 'xCdcaApprovalStatus', required: false })
  @ApiBody({ type: Updatevgph_destination_stagingDto })
  @ApiOkResponse({ type: vgph_destination_stagingEntity })
  @ApiOperation({
    summary: 'Update the record',
    description: 'Update the record for the vgph_destination_staging table',
  })
    
  async update(
    @Headers('xCdcaRole') mcRole: string,
    @Headers('xCdcaUsername') mcUsername: string,
    @Headers('xCdcaRemarks') mcRemarks: string,
    @Headers('xCdcaApprovalStatus') mcApprovalStatus: string,
    @Headers() authHeader: string,
@Param('vgphds_id') vgphds_id:number,
    @Body() updatevgph_destination_stagingDto: Prisma.vgph_destination_stagingUpdateInput,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);

    // Flag-driven routing: if maker-checker headers are present, use updateMaster
    if (mcRole && mcUsername) {
      const makerInfo = { role: mcRole, username: mcUsername, remarks: mcRemarks,approvalStatus: mcApprovalStatus };
      const result = await this.vgph_destination_stagingService.updateMaster(+vgphds_id,updatevgph_destination_stagingDto,makerInfo,token);
      return result;
    }

    const result = this.vgph_destination_stagingService.update(+vgphds_id,updatevgph_destination_stagingDto,token);
    return plainToInstance(vgph_destination_stagingEntity, result);
  }
 
  @Delete(':vgphds_id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'vgphds_id',type:Number})
  @ApiHeader({ name: 'xCdcaRole', required: false })
  @ApiHeader({ name: 'xCdcaUsername', required: false })
  @ApiHeader({ name: 'xCdcaRemarks', required: false })
  @ApiHeader({ name: 'xCdcaApprovalStatus', required: false })
  @ApiOkResponse({ type: vgph_destination_stagingEntity })
  @ApiOperation({
    summary: 'Delete the record',
    description: 'Delete the record for the vgph_destination_staging table',
  })
  
  async remove(
    @Headers('xCdcaRole') mcRole: string,
    @Headers('xCdcaUsername') mcUsername: string,
    @Headers('xCdcaRemarks') mcRemarks: string,
    @Headers('xCdcaApprovalStatus') mcApprovalStatus: string,
    @Headers() authHeader: string,
@Param('vgphds_id') vgphds_id:number,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);

    // Flag-driven routing: if maker-checker headers are present, use deleteMaster
    if (mcRole && mcUsername) {
      const makerInfo = { role: mcRole, username: mcUsername, remarks: mcRemarks,approvalStatus: mcApprovalStatus };
      const result = await this.vgph_destination_stagingService.deleteMaster(+vgphds_id,makerInfo,token);
      return result;
    }

    const result =  this.vgph_destination_stagingService.remove(+vgphds_id,token);
    return plainToInstance(vgph_destination_stagingEntity, result);
  }  
 
  @Get('/find/first')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: vgph_destination_stagingEntity })
  @ApiOperation({
    summary: 'Fetch the first record',
    description: 'Read first record from the vgph_destination_staging table',
  })
  
  async findFirst(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.vgph_destination_stagingService.findFirst(token);
    return plainToInstance(vgph_destination_stagingEntity, result);
  }

  @Get('/find/last')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: vgph_destination_stagingEntity })
  @ApiOperation({
    summary: 'Fetch the last record',
    description: 'Read last record from the vgph_destination_staging table',
  })
  
  async findLast(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.vgph_destination_stagingService.findLast(token);
    return plainToInstance(vgph_destination_stagingEntity, result);
  }
}