
import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Query,Req,NotFoundException,Headers} from '@nestjs/common';
import { vgph_source_tran_mainService } from './vgph_source_tran_main.service';
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
import { vgph_source_tran_mainEntity } from './entity/vgph_source_tran_main.entity';
//import { CreateVgphSourceTranMainDto } from '../prisma/dto/create-vgphSourceTranMain.dto';
//import { UpdateVgphSourceTranMainDto } from '../prisma/dto/update-vgphSourceTranMain.dto';
import { Createvgph_source_tran_mainDto } from './dto/Createvgph_source_tran_main.dto';
import { Updatevgph_source_tran_mainDto } from './dto/Updatevgph_source_tran_main.dto';
import { plainToInstance } from 'class-transformer';
import { UfService } from 'src/Torus/v1/uf/uf.service';

 
@Controller('vgph_source_tran_main')
@ApiTags('ERD API')
export class vgph_source_tran_mainController {
  constructor(
    private readonly vgph_source_tran_mainService: vgph_source_tran_mainService,
    private readonly ufservice: UfService
  ) {}

  @Get("/schema")
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: vgph_source_tran_mainEntity })
  @ApiOperation({
    summary: 'schema validation',
    description: 'Retrive the datatype of the vgph_source_tran_main table',
  })
  async findSchema(@Headers() authHeader: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.vgph_source_tran_mainService.findSchema(token);
  }

  @Get('/get')
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: vgph_source_tran_mainEntity, isArray: true })
  @ApiOperation({
    summary: 'Filter the records',
    description: 'Filter all the records from the vgph_source_tran_main table',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to fetch' })
  async findAllmethod(@Headers() authHeader: string,@Query() query: any,@Body() body: any,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const { limit }:{ limit:number } = query;
    const { selectColumns}:{ selectColumns:any } = body;
    return this.vgph_source_tran_mainService.findAllmethod(query, +limit,selectColumns,token);
  }

  @Get(':vgphstm_id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'vgphstm_id',type:Number})
  @ApiOkResponse({ type: vgph_source_tran_mainEntity })
  @ApiOperation({
    summary: 'Fetch the only one record',
    description: 'Read only one records from the vgph_source_tran_main table',
  })
  
  async findOne(@Headers() authHeader: string,@Param('vgphstm_id') vgphstm_id:number,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.vgph_source_tran_mainService.findOne(+vgphstm_id,token);
    return plainToInstance(vgph_source_tran_mainEntity, result);
  }
 
  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'vgphstm_id',type:Number})
  @ApiOkResponse({ type: vgph_source_tran_mainEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the vgph_source_tran_main table',
  })
  
  async findAll(@Headers() authHeader: string,@Req() req: any,@Query("trs_created_date") trs_created_date?: Date,@Query("trs_created_by") trs_created_by?: string,@Query("trs_modified_date") trs_modified_date?: Date,@Query("trs_modified_by") trs_modified_by?: string,@Query("trs_next_status") trs_next_status?: string,@Query("trs_status") trs_status?: string,@Query("trs_process_id") trs_process_id?: string,@Query("trs_access_profile") trs_access_profile?: string,@Query("trs_org_grp_code") trs_org_grp_code?: string,@Query("trs_org_code") trs_org_code?: string,@Query("trs_role_grp_code") trs_role_grp_code?: string,@Query("trs_role_code") trs_role_code?: string,@Query("trs_ps_grp_code") trs_ps_grp_code?: string,@Query("trs_ps_code") trs_ps_code?: string,@Query("trs_sub_org_grp_code") trs_sub_org_grp_code?: string,@Query("trs_sub_org_code") trs_sub_org_code?: string,@Query('vgphstm_id') vgphstm_id?:string,@Query() query?: Record<string, any>) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    let presentQueryKeys:any=[
      'vgphstm_id',
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
    const result = this.vgph_source_tran_mainService.findAll(token,trs_created_date,trs_created_by,trs_modified_date,trs_modified_by,trs_next_status,trs_status,trs_process_id,trs_access_profile,trs_org_grp_code,trs_org_code,trs_role_grp_code,trs_role_code,trs_ps_grp_code,trs_ps_code,trs_sub_org_grp_code,trs_sub_org_code,+vgphstm_id);
    return plainToInstance(vgph_source_tran_mainEntity, result);
  } 

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiHeader({ name: 'xCdcaRole', required: false })
  @ApiHeader({ name: 'xCdcaUsername', required: false })
  @ApiHeader({ name: 'xCdcaRemarks', required: false })
  @ApiHeader({ name: 'xCdcaApprovalStatus', required: false })
  @ApiHeader({ name: 'xCdcaApprovalID', required: false })
  @ApiBody({ type: Createvgph_source_tran_mainDto })
  @ApiCreatedResponse({ type: vgph_source_tran_mainEntity })
  @ApiOperation({
    summary: 'Create the record',
    description: 'Create the record for the vgph_source_tran_main table',
  })
  
  async create(
    @Headers('xCdcaRole') mcRole: string,
    @Headers('xCdcaUsername') mcUsername: string,
    @Headers('xCdcaRemarks') mcRemarks: string,
    @Headers('xCdcaApprovalStatus') mcApprovalStatus: string,
    @Headers('xCdcaApprovalID') mcApprovalID: string,
    @Headers() authHeader: string,
    @Body() createvgph_source_tran_mainDto: Prisma.vgph_source_tran_mainCreateInput,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);

    // Flag-driven routing: if maker-checker headers are present, use createMaster
    if (mcRole && mcUsername) {
      const makerInfo = { role: mcRole, username: mcUsername, remarks: mcRemarks, approvalStatus: mcApprovalStatus,approvalId:mcApprovalID };
      const result = await this.vgph_source_tran_mainService.createMaster(createvgph_source_tran_mainDto, makerInfo, token);
      return result;
    }

    const result = this.vgph_source_tran_mainService.create(createvgph_source_tran_mainDto,token);
    return plainToInstance(vgph_source_tran_mainEntity, result);
  }
 
  @Patch(':vgphstm_id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'vgphstm_id',type:Number})
  @ApiHeader({ name: 'xCdcaRole', required: false })
  @ApiHeader({ name: 'xCdcaUsername', required: false })
  @ApiHeader({ name: 'xCdcaRemarks', required: false })
  @ApiHeader({ name: 'xCdcaApprovalStatus', required: false })
  @ApiBody({ type: Updatevgph_source_tran_mainDto })
  @ApiOkResponse({ type: vgph_source_tran_mainEntity })
  @ApiOperation({
    summary: 'Update the record',
    description: 'Update the record for the vgph_source_tran_main table',
  })
    
  async update(
    @Headers('xCdcaRole') mcRole: string,
    @Headers('xCdcaUsername') mcUsername: string,
    @Headers('xCdcaRemarks') mcRemarks: string,
    @Headers('xCdcaApprovalStatus') mcApprovalStatus: string,
    @Headers() authHeader: string,
@Param('vgphstm_id') vgphstm_id:number,
    @Body() updatevgph_source_tran_mainDto: Prisma.vgph_source_tran_mainUpdateInput,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);

    // Flag-driven routing: if maker-checker headers are present, use updateMaster
    if (mcRole && mcUsername) {
      const makerInfo = { role: mcRole, username: mcUsername, remarks: mcRemarks,approvalStatus: mcApprovalStatus };
      const result = await this.vgph_source_tran_mainService.updateMaster(+vgphstm_id,updatevgph_source_tran_mainDto,makerInfo,token);
      return result;
    }

    const result = this.vgph_source_tran_mainService.update(+vgphstm_id,updatevgph_source_tran_mainDto,token);
    return plainToInstance(vgph_source_tran_mainEntity, result);
  }
 
  @Delete(':vgphstm_id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'vgphstm_id',type:Number})
  @ApiHeader({ name: 'xCdcaRole', required: false })
  @ApiHeader({ name: 'xCdcaUsername', required: false })
  @ApiHeader({ name: 'xCdcaRemarks', required: false })
  @ApiHeader({ name: 'xCdcaApprovalStatus', required: false })
  @ApiOkResponse({ type: vgph_source_tran_mainEntity })
  @ApiOperation({
    summary: 'Delete the record',
    description: 'Delete the record for the vgph_source_tran_main table',
  })
  
  async remove(
    @Headers('xCdcaRole') mcRole: string,
    @Headers('xCdcaUsername') mcUsername: string,
    @Headers('xCdcaRemarks') mcRemarks: string,
    @Headers('xCdcaApprovalStatus') mcApprovalStatus: string,
    @Headers() authHeader: string,
@Param('vgphstm_id') vgphstm_id:number,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);

    // Flag-driven routing: if maker-checker headers are present, use deleteMaster
    if (mcRole && mcUsername) {
      const makerInfo = { role: mcRole, username: mcUsername, remarks: mcRemarks,approvalStatus: mcApprovalStatus };
      const result = await this.vgph_source_tran_mainService.deleteMaster(+vgphstm_id,makerInfo,token);
      return result;
    }

    const result =  this.vgph_source_tran_mainService.remove(+vgphstm_id,token);
    return plainToInstance(vgph_source_tran_mainEntity, result);
  }  
 
  @Get('/find/first')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: vgph_source_tran_mainEntity })
  @ApiOperation({
    summary: 'Fetch the first record',
    description: 'Read first record from the vgph_source_tran_main table',
  })
  
  async findFirst(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.vgph_source_tran_mainService.findFirst(token);
    return plainToInstance(vgph_source_tran_mainEntity, result);
  }

  @Get('/find/last')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: vgph_source_tran_mainEntity })
  @ApiOperation({
    summary: 'Fetch the last record',
    description: 'Read last record from the vgph_source_tran_main table',
  })
  
  async findLast(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.vgph_source_tran_mainService.findLast(token);
    return plainToInstance(vgph_source_tran_mainEntity, result);
  }
}