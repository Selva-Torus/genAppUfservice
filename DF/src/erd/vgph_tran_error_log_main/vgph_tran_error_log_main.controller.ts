

import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Query,Req,NotFoundException,Headers,UsePipes} from '@nestjs/common';
import { vgph_tran_error_log_mainService } from './vgph_tran_error_log_main.service';
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
import { vgph_tran_error_log_mainEntity } from './entity/vgph_tran_error_log_main.entity';
//import { CreateVgphTranErrorLogMainDto } from '../prisma/dto/create-vgphTranErrorLogMain.dto';
//import { UpdateVgphTranErrorLogMainDto } from '../prisma/dto/update-vgphTranErrorLogMain.dto';
import { Createvgph_tran_error_log_mainDto } from './dto/Createvgph_tran_error_log_main.dto';
import { Updatevgph_tran_error_log_mainDto } from './dto/Updatevgph_tran_error_log_main.dto';
import { plainToInstance } from 'class-transformer';
import { UfService } from 'src/Torus/v1/uf/uf.service';
import { PrismaModelValidationPipe } from 'src/pipes/prisma-model-validation.pipe';

 
@Controller('vgph_tran_error_log_main')
@ApiTags('ERD API')
export class vgph_tran_error_log_mainController {
  constructor(
    private readonly vgph_tran_error_log_mainService: vgph_tran_error_log_mainService,
    private readonly ufservice: UfService
  ) {}

  @Get("/schema")
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: vgph_tran_error_log_mainEntity })
  @ApiOperation({
    summary: 'schema validation',
    description: 'Retrive the datatype of the vgph_tran_error_log_main table',
  })
  async findSchema(@Headers() authHeader: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.vgph_tran_error_log_mainService.findSchema(token);
  }

  @Get('/get')
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: vgph_tran_error_log_mainEntity, isArray: true })
  @ApiOperation({
    summary: 'Filter the records',
    description: 'Filter all the records from the vgph_tran_error_log_main table',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to fetch' })
  async findAllmethod(@Headers() authHeader: string,@Query() query: any,@Body() body: any,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const { limit }:{ limit:number } = query;
    const { selectColumns}:{ selectColumns:any } = body;
    return this.vgph_tran_error_log_mainService.findAllmethod(query, +limit,selectColumns,token);
  }

  @Get(':vgphtelm_id/:trs_tenant_id/:trs_app_code/:trs_product_code')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'vgphtelm_id',type:Number})
  @ApiParam({name: 'trs_tenant_id',type: String})
  @ApiParam({name: 'trs_app_code',type: String})
  @ApiParam({name: 'trs_product_code',type: String})
  @ApiOkResponse({ type: vgph_tran_error_log_mainEntity, isArray: true })
  @ApiOperation({
    summary: 'Fetch the only one record',
    description: 'Read only one records from the vgph_tran_error_log_main table',
  })
  
  async findOne(@Headers() authHeader: string,@Param('vgphtelm_id') vgphtelm_id:number,@Param('trs_tenant_id') trs_tenant_id: string,@Param('trs_app_code') trs_app_code: string,@Param('trs_product_code') trs_product_code: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.vgph_tran_error_log_mainService.findOne(+vgphtelm_id,trs_tenant_id,trs_app_code,trs_product_code,token);
    return plainToInstance(vgph_tran_error_log_mainEntity, result);
  }
 
  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: vgph_tran_error_log_mainEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the vgph_tran_error_log_main table',
  })
  @ApiQuery({ name: 'vgphtelm_id', required: false})
  
  async findAll(@Headers() authHeader: string,@Req() req: any,@Query('vgphtelm_id') vgphtelm_id?:string,@Query() query?: Record<string, any>) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    let presentQueryKeys:any=[
      'vgphtelm_id',
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
    const result = this.vgph_tran_error_log_mainService.findAll(token,+vgphtelm_id);
    return plainToInstance(vgph_tran_error_log_mainEntity, result);
  } 

  @Post()
  @UsePipes(new PrismaModelValidationPipe('vgph_tran_error_log_main'))
  @ApiBearerAuth('JWT-auth')
  @ApiHeader({ name: 'xCdcaRole', required: false })
  @ApiHeader({ name: 'xCdcaUsername', required: false })
  @ApiHeader({ name: 'xCdcaRemarks', required: false })
  @ApiHeader({ name: 'xCdcaApprovalStatus', required: false })
  @ApiHeader({ name: 'xCdcaApprovalID', required: false })
  @ApiBody({ type: Createvgph_tran_error_log_mainDto })
  @ApiCreatedResponse({ type: vgph_tran_error_log_mainEntity })
  @ApiOperation({
    summary: 'Create the record',
    description: 'Create the record for the vgph_tran_error_log_main table',
  })
  
  async create(
    @Headers('xCdcaRole') mcRole: string,
    @Headers('xCdcaUsername') mcUsername: string,
    @Headers('xCdcaRemarks') mcRemarks: string,
    @Headers('xCdcaApprovalStatus') mcApprovalStatus: string,
    @Headers('xCdcaApprovalID') mcApprovalID: string,
    @Headers() authHeader: string,
    @Body() createvgph_tran_error_log_mainDto: Prisma.vgph_tran_error_log_mainCreateInput,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);

    // Flag-driven routing: if maker-checker headers are present, use createMaster
    if (mcRole && mcUsername) {
      const makerInfo = { role: mcRole, username: mcUsername, remarks: mcRemarks, approvalStatus: mcApprovalStatus,approvalId:mcApprovalID };
      const result = await this.vgph_tran_error_log_mainService.createMaster(createvgph_tran_error_log_mainDto, makerInfo, token);
      return result;
    }

    const result = this.vgph_tran_error_log_mainService.create(createvgph_tran_error_log_mainDto,token);
    return plainToInstance(vgph_tran_error_log_mainEntity, result);
  }
 
  @Patch(':vgphtelm_id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'vgphtelm_id',type:Number})
  @ApiHeader({ name: 'xCdcaRole', required: false })
  @ApiHeader({ name: 'xCdcaUsername', required: false })
  @ApiHeader({ name: 'xCdcaRemarks', required: false })
  @ApiHeader({ name: 'xCdcaApprovalStatus', required: false })
  @ApiBody({ type: Updatevgph_tran_error_log_mainDto })
  @ApiOkResponse({ type: vgph_tran_error_log_mainEntity, isArray: true })
  @ApiOperation({
    summary: 'Update the record',
    description: 'Update the record for the vgph_tran_error_log_main table',
  })
    
  async update(
    @Headers('xCdcaRole') mcRole: string,
    @Headers('xCdcaUsername') mcUsername: string,
    @Headers('xCdcaRemarks') mcRemarks: string,
    @Headers('xCdcaApprovalStatus') mcApprovalStatus: string,
    @Headers() authHeader: string,
@Param('vgphtelm_id') vgphtelm_id:number,
    @Body() updatevgph_tran_error_log_mainDto: Prisma.vgph_tran_error_log_mainUpdateInput,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);

    // Flag-driven routing: if maker-checker headers are present, use updateMaster
    if (mcRole && mcUsername) {
      const makerInfo = { role: mcRole, username: mcUsername, remarks: mcRemarks,approvalStatus: mcApprovalStatus };
      const result = await this.vgph_tran_error_log_mainService.updateMaster(+vgphtelm_id,updatevgph_tran_error_log_mainDto,makerInfo,token);
      return result;
    }

    const result = this.vgph_tran_error_log_mainService.update(+vgphtelm_id,updatevgph_tran_error_log_mainDto,token);
    return plainToInstance(vgph_tran_error_log_mainEntity, result);
  }
 
  @Delete(':vgphtelm_id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'vgphtelm_id',type:Number})
  @ApiHeader({ name: 'xCdcaRole', required: false })
  @ApiHeader({ name: 'xCdcaUsername', required: false })
  @ApiHeader({ name: 'xCdcaRemarks', required: false })
  @ApiHeader({ name: 'xCdcaApprovalStatus', required: false })
  @ApiOkResponse({ type: vgph_tran_error_log_mainEntity, isArray: true })
  @ApiOperation({
    summary: 'Delete the record',
    description: 'Delete the record for the vgph_tran_error_log_main table',
  })
  
  async remove(
    @Headers('xCdcaRole') mcRole: string,
    @Headers('xCdcaUsername') mcUsername: string,
    @Headers('xCdcaRemarks') mcRemarks: string,
    @Headers('xCdcaApprovalStatus') mcApprovalStatus: string,
    @Headers() authHeader: string,
@Param('vgphtelm_id') vgphtelm_id:number,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);

    // Flag-driven routing: if maker-checker headers are present, use deleteMaster
    if (mcRole && mcUsername) {
      const makerInfo = { role: mcRole, username: mcUsername, remarks: mcRemarks,approvalStatus: mcApprovalStatus };
      const result = await this.vgph_tran_error_log_mainService.deleteMaster(+vgphtelm_id,makerInfo,token);
      return result;
    }

    const result =  this.vgph_tran_error_log_mainService.remove(+vgphtelm_id,token);
    return plainToInstance(vgph_tran_error_log_mainEntity, result);
  }  
 
  @Get('/find/first')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: vgph_tran_error_log_mainEntity })
  @ApiOperation({
    summary: 'Fetch the first record',
    description: 'Read first record from the vgph_tran_error_log_main table',
  })
  
  async findFirst(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.vgph_tran_error_log_mainService.findFirst(token);
    return plainToInstance(vgph_tran_error_log_mainEntity, result);
  }

  @Get('/find/last')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: vgph_tran_error_log_mainEntity })
  @ApiOperation({
    summary: 'Fetch the last record',
    description: 'Read last record from the vgph_tran_error_log_main table',
  })
  
  async findLast(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.vgph_tran_error_log_mainService.findLast(token);
    return plainToInstance(vgph_tran_error_log_mainEntity, result);
  }
}