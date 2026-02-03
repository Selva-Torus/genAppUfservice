
import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Query,Req,NotFoundException,Headers} from '@nestjs/common';
import { prc_tokens_mainService } from './prc_tokens_main.service';
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
import { prc_tokens_mainEntity } from './entity/prc_tokens_main.entity';
//import { CreatePrcTokensMainDto } from '../prisma/dto/create-prcTokensMain.dto';
//import { UpdatePrcTokensMainDto } from '../prisma/dto/update-prcTokensMain.dto';
import { Createprc_tokens_mainDto } from './dto/Createprc_tokens_main.dto';
import { Updateprc_tokens_mainDto } from './dto/Updateprc_tokens_main.dto';
import { plainToInstance } from 'class-transformer';
import { UfService } from 'src/Torus/v1/uf/uf.service';

 
@Controller('prc_tokens_main')
@ApiTags('ERD API')
export class prc_tokens_mainController {
  constructor(
    private readonly prc_tokens_mainService: prc_tokens_mainService,
    private readonly ufservice: UfService
  ) {}

  @Get("/schema")
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: prc_tokens_mainEntity })
  @ApiOperation({
    summary: 'schema validation',
    description: 'Retrive the datatype of the prc_tokens_main table',
  })
  async findSchema(@Headers() authHeader: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.prc_tokens_mainService.findSchema(token);
  }

  @Get('/get')
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: prc_tokens_mainEntity, isArray: true })
  @ApiOperation({
    summary: 'Filter the records',
    description: 'Filter all the records from the prc_tokens_main table',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to fetch' })
  async findAllmethod(@Headers() authHeader: string,@Query() query: any,@Body() body: any,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const { limit }:{ limit:number } = query;
    const { selectColumns}:{ selectColumns:any } = body;
    return this.prc_tokens_mainService.findAllmethod(query, +limit,selectColumns,token);
  }

  @Get(':prctm_id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'prctm_id',type:Number})
  @ApiOkResponse({ type: prc_tokens_mainEntity })
  @ApiOperation({
    summary: 'Fetch the only one record',
    description: 'Read only one records from the prc_tokens_main table',
  })
  
  async findOne(@Headers() authHeader: string,@Param('prctm_id') prctm_id:number,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.prc_tokens_mainService.findOne(+prctm_id,token);
    return plainToInstance(prc_tokens_mainEntity, result);
  }
 
  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'prctm_id',type:Number})
  @ApiOkResponse({ type: prc_tokens_mainEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the prc_tokens_main table',
  })
  
  async findAll(@Headers() authHeader: string,@Req() req: any,@Query("trs_created_date") trs_created_date?: Date,@Query("trs_created_by") trs_created_by?: string,@Query("trs_modified_date") trs_modified_date?: Date,@Query("trs_modified_by") trs_modified_by?: string,@Query("trs_next_status") trs_next_status?: string,@Query("trs_status") trs_status?: string,@Query("trs_process_id") trs_process_id?: string,@Query("trs_access_profile") trs_access_profile?: string,@Query("trs_org_grp_code") trs_org_grp_code?: string,@Query("trs_org_code") trs_org_code?: string,@Query("trs_role_grp_code") trs_role_grp_code?: string,@Query("trs_role_code") trs_role_code?: string,@Query("trs_ps_grp_code") trs_ps_grp_code?: string,@Query("trs_ps_code") trs_ps_code?: string,@Query("trs_sub_org_grp_code") trs_sub_org_grp_code?: string,@Query("trs_sub_org_code") trs_sub_org_code?: string,@Query('prctm_id') prctm_id?:string,@Query() query?: Record<string, any>) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    let presentQueryKeys:any=[
      'prctm_id',
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
    const result = this.prc_tokens_mainService.findAll(token,trs_created_date,trs_created_by,trs_modified_date,trs_modified_by,trs_next_status,trs_status,trs_process_id,trs_access_profile,trs_org_grp_code,trs_org_code,trs_role_grp_code,trs_role_code,trs_ps_grp_code,trs_ps_code,trs_sub_org_grp_code,trs_sub_org_code,+prctm_id);
    return plainToInstance(prc_tokens_mainEntity, result);
  } 

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiHeader({ name: 'xCdcaRole', required: false })
  @ApiHeader({ name: 'xCdcaUsername', required: false })
  @ApiHeader({ name: 'xCdcaRemarks', required: false })
  @ApiHeader({ name: 'xCdcaApprovalStatus', required: false })
  @ApiHeader({ name: 'xCdcaApprovalID', required: false })
  @ApiBody({ type: Createprc_tokens_mainDto })
  @ApiCreatedResponse({ type: prc_tokens_mainEntity })
  @ApiOperation({
    summary: 'Create the record',
    description: 'Create the record for the prc_tokens_main table',
  })
  
  async create(
    @Headers('xCdcaRole') mcRole: string,
    @Headers('xCdcaUsername') mcUsername: string,
    @Headers('xCdcaRemarks') mcRemarks: string,
    @Headers('xCdcaApprovalStatus') mcApprovalStatus: string,
    @Headers('xCdcaApprovalID') mcApprovalID: string,
    @Headers() authHeader: string,
    @Body() createprc_tokens_mainDto: Prisma.prc_tokens_mainCreateInput,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);

    // Flag-driven routing: if maker-checker headers are present, use createMaster
    if (mcRole && mcUsername) {
      const makerInfo = { role: mcRole, username: mcUsername, remarks: mcRemarks, approvalStatus: mcApprovalStatus,approvalId:mcApprovalID };
      const result = await this.prc_tokens_mainService.createMaster(createprc_tokens_mainDto, makerInfo, token);
      return result;
    }

    const result = this.prc_tokens_mainService.create(createprc_tokens_mainDto,token);
    return plainToInstance(prc_tokens_mainEntity, result);
  }
 
  @Patch(':prctm_id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'prctm_id',type:Number})
  @ApiHeader({ name: 'xCdcaRole', required: false })
  @ApiHeader({ name: 'xCdcaUsername', required: false })
  @ApiHeader({ name: 'xCdcaRemarks', required: false })
  @ApiHeader({ name: 'xCdcaApprovalStatus', required: false })
  @ApiBody({ type: Updateprc_tokens_mainDto })
  @ApiOkResponse({ type: prc_tokens_mainEntity })
  @ApiOperation({
    summary: 'Update the record',
    description: 'Update the record for the prc_tokens_main table',
  })
    
  async update(
    @Headers('xCdcaRole') mcRole: string,
    @Headers('xCdcaUsername') mcUsername: string,
    @Headers('xCdcaRemarks') mcRemarks: string,
    @Headers('xCdcaApprovalStatus') mcApprovalStatus: string,
    @Headers() authHeader: string,
@Param('prctm_id') prctm_id:number,
    @Body() updateprc_tokens_mainDto: Prisma.prc_tokens_mainUpdateInput,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);

    // Flag-driven routing: if maker-checker headers are present, use updateMaster
    if (mcRole && mcUsername) {
      const makerInfo = { role: mcRole, username: mcUsername, remarks: mcRemarks,approvalStatus: mcApprovalStatus };
      const result = await this.prc_tokens_mainService.updateMaster(+prctm_id,updateprc_tokens_mainDto,makerInfo,token);
      return result;
    }

    const result = this.prc_tokens_mainService.update(+prctm_id,updateprc_tokens_mainDto,token);
    return plainToInstance(prc_tokens_mainEntity, result);
  }
 
  @Delete(':prctm_id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'prctm_id',type:Number})
  @ApiHeader({ name: 'xCdcaRole', required: false })
  @ApiHeader({ name: 'xCdcaUsername', required: false })
  @ApiHeader({ name: 'xCdcaRemarks', required: false })
  @ApiHeader({ name: 'xCdcaApprovalStatus', required: false })
  @ApiOkResponse({ type: prc_tokens_mainEntity })
  @ApiOperation({
    summary: 'Delete the record',
    description: 'Delete the record for the prc_tokens_main table',
  })
  
  async remove(
    @Headers('xCdcaRole') mcRole: string,
    @Headers('xCdcaUsername') mcUsername: string,
    @Headers('xCdcaRemarks') mcRemarks: string,
    @Headers('xCdcaApprovalStatus') mcApprovalStatus: string,
    @Headers() authHeader: string,
@Param('prctm_id') prctm_id:number,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);

    // Flag-driven routing: if maker-checker headers are present, use deleteMaster
    if (mcRole && mcUsername) {
      const makerInfo = { role: mcRole, username: mcUsername, remarks: mcRemarks,approvalStatus: mcApprovalStatus };
      const result = await this.prc_tokens_mainService.deleteMaster(+prctm_id,makerInfo,token);
      return result;
    }

    const result =  this.prc_tokens_mainService.remove(+prctm_id,token);
    return plainToInstance(prc_tokens_mainEntity, result);
  }  
 
  @Get('/find/first')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: prc_tokens_mainEntity })
  @ApiOperation({
    summary: 'Fetch the first record',
    description: 'Read first record from the prc_tokens_main table',
  })
  
  async findFirst(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.prc_tokens_mainService.findFirst(token);
    return plainToInstance(prc_tokens_mainEntity, result);
  }

  @Get('/find/last')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: prc_tokens_mainEntity })
  @ApiOperation({
    summary: 'Fetch the last record',
    description: 'Read last record from the prc_tokens_main table',
  })
  
  async findLast(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.prc_tokens_mainService.findLast(token);
    return plainToInstance(prc_tokens_mainEntity, result);
  }
}