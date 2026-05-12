

import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Query,Req,NotFoundException,Headers,UsePipes} from '@nestjs/common';
import { vgph_tran_dtl_stagingService } from './vgph_tran_dtl_staging.service';
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
import { vgph_tran_dtl_stagingEntity } from './entity/vgph_tran_dtl_staging.entity';
//import { CreateVgphTranDtlStagingDto } from '../prisma/dto/create-vgphTranDtlStaging.dto';
//import { UpdateVgphTranDtlStagingDto } from '../prisma/dto/update-vgphTranDtlStaging.dto';
import { Createvgph_tran_dtl_stagingDto } from './dto/Createvgph_tran_dtl_staging.dto';
import { Updatevgph_tran_dtl_stagingDto } from './dto/Updatevgph_tran_dtl_staging.dto';
import { plainToInstance } from 'class-transformer';
import { UfService } from 'src/Torus/v1/uf/uf.service';
import { PrismaModelValidationPipe } from 'src/pipes/prisma-model-validation.pipe';

 
@Controller('vgph_tran_dtl_staging')
@ApiTags('ERD API')
export class vgph_tran_dtl_stagingController {
  constructor(
    private readonly vgph_tran_dtl_stagingService: vgph_tran_dtl_stagingService,
    private readonly ufservice: UfService
  ) {}

  @Get("/schema")
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: vgph_tran_dtl_stagingEntity })
  @ApiOperation({
    summary: 'schema validation',
    description: 'Retrive the datatype of the vgph_tran_dtl_staging table',
  })
  async findSchema(@Headers() authHeader: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.vgph_tran_dtl_stagingService.findSchema(token);
  }

  @Get('/get')
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: vgph_tran_dtl_stagingEntity, isArray: true })
  @ApiOperation({
    summary: 'Filter the records',
    description: 'Filter all the records from the vgph_tran_dtl_staging table',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to fetch' })
  async findAllmethod(@Headers() authHeader: string,@Query() query: any,@Body() body: any,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const { limit }:{ limit:number } = query;
    const { selectColumns}:{ selectColumns:any } = body;
    return this.vgph_tran_dtl_stagingService.findAllmethod(query, +limit,selectColumns,token);
  }

  @Get(':vgphtds_id/:trs_tenant_id/:trs_app_code/:trs_product_code')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'vgphtds_id',type:Number})
  @ApiParam({name: 'trs_tenant_id',type: String})
  @ApiParam({name: 'trs_app_code',type: String})
  @ApiParam({name: 'trs_product_code',type: String})
  @ApiOkResponse({ type: vgph_tran_dtl_stagingEntity, isArray: true })
  @ApiOperation({
    summary: 'Fetch the only one record',
    description: 'Read only one records from the vgph_tran_dtl_staging table',
  })
  
  async findOne(@Headers() authHeader: string,@Param('vgphtds_id') vgphtds_id:number,@Param('trs_tenant_id') trs_tenant_id: string,@Param('trs_app_code') trs_app_code: string,@Param('trs_product_code') trs_product_code: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.vgph_tran_dtl_stagingService.findOne(+vgphtds_id,trs_tenant_id,trs_app_code,trs_product_code,token);
    return plainToInstance(vgph_tran_dtl_stagingEntity, result);
  }
 
  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: vgph_tran_dtl_stagingEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the vgph_tran_dtl_staging table',
  })
  
  async findAll(@Headers() authHeader: string,@Req() req: any,@Query() query?: Record<string, any>) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    let presentQueryKeys:any=[
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
    const result = this.vgph_tran_dtl_stagingService.findAll(token,);
    return plainToInstance(vgph_tran_dtl_stagingEntity, result);
  } 

  @Post()
  @UsePipes(new PrismaModelValidationPipe('vgph_tran_dtl_staging'))
  @ApiBearerAuth('JWT-auth')
  @ApiHeader({ name: 'xCdcaRole', required: false })
  @ApiHeader({ name: 'xCdcaUsername', required: false })
  @ApiHeader({ name: 'xCdcaRemarks', required: false })
  @ApiHeader({ name: 'xCdcaApprovalStatus', required: false })
  @ApiHeader({ name: 'xCdcaApprovalID', required: false })
  @ApiBody({ type: Createvgph_tran_dtl_stagingDto })
  @ApiCreatedResponse({ type: vgph_tran_dtl_stagingEntity })
  @ApiOperation({
    summary: 'Create the record',
    description: 'Create the record for the vgph_tran_dtl_staging table',
  })
  
  async create(
    @Headers('xCdcaRole') mcRole: string,
    @Headers('xCdcaUsername') mcUsername: string,
    @Headers('xCdcaRemarks') mcRemarks: string,
    @Headers('xCdcaApprovalStatus') mcApprovalStatus: string,
    @Headers('xCdcaApprovalID') mcApprovalID: string,
    @Headers() authHeader: string,
    @Body() createvgph_tran_dtl_stagingDto: Prisma.vgph_tran_dtl_stagingCreateInput,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);

    // Flag-driven routing: if maker-checker headers are present, use createMaster
    if (mcRole && mcUsername) {
      const makerInfo = { role: mcRole, username: mcUsername, remarks: mcRemarks, approvalStatus: mcApprovalStatus,approvalId:mcApprovalID };
      const result = await this.vgph_tran_dtl_stagingService.createMaster(createvgph_tran_dtl_stagingDto, makerInfo, token);
      return result;
    }

    const result = this.vgph_tran_dtl_stagingService.create(createvgph_tran_dtl_stagingDto,token);
    return plainToInstance(vgph_tran_dtl_stagingEntity, result);
  }
 
  @Patch(':vgphtds_id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'vgphtds_id',type:Number})
  @ApiHeader({ name: 'xCdcaRole', required: false })
  @ApiHeader({ name: 'xCdcaUsername', required: false })
  @ApiHeader({ name: 'xCdcaRemarks', required: false })
  @ApiHeader({ name: 'xCdcaApprovalStatus', required: false })
  @ApiBody({ type: Updatevgph_tran_dtl_stagingDto })
  @ApiOkResponse({ type: vgph_tran_dtl_stagingEntity, isArray: true })
  @ApiOperation({
    summary: 'Update the record',
    description: 'Update the record for the vgph_tran_dtl_staging table',
  })
    
  async update(
    @Headers('xCdcaRole') mcRole: string,
    @Headers('xCdcaUsername') mcUsername: string,
    @Headers('xCdcaRemarks') mcRemarks: string,
    @Headers('xCdcaApprovalStatus') mcApprovalStatus: string,
    @Headers() authHeader: string,
@Param('vgphtds_id') vgphtds_id:number,
    @Body() updatevgph_tran_dtl_stagingDto: Prisma.vgph_tran_dtl_stagingUpdateInput,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);

    // Flag-driven routing: if maker-checker headers are present, use updateMaster
    if (mcRole && mcUsername) {
      const makerInfo = { role: mcRole, username: mcUsername, remarks: mcRemarks,approvalStatus: mcApprovalStatus };
      const result = await this.vgph_tran_dtl_stagingService.updateMaster(+vgphtds_id,updatevgph_tran_dtl_stagingDto,makerInfo,token);
      return result;
    }

    const result = this.vgph_tran_dtl_stagingService.update(+vgphtds_id,updatevgph_tran_dtl_stagingDto,token);
    return plainToInstance(vgph_tran_dtl_stagingEntity, result);
  }
 
  @Delete(':vgphtds_id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'vgphtds_id',type:Number})
  @ApiHeader({ name: 'xCdcaRole', required: false })
  @ApiHeader({ name: 'xCdcaUsername', required: false })
  @ApiHeader({ name: 'xCdcaRemarks', required: false })
  @ApiHeader({ name: 'xCdcaApprovalStatus', required: false })
  @ApiOkResponse({ type: vgph_tran_dtl_stagingEntity, isArray: true })
  @ApiOperation({
    summary: 'Delete the record',
    description: 'Delete the record for the vgph_tran_dtl_staging table',
  })
  
  async remove(
    @Headers('xCdcaRole') mcRole: string,
    @Headers('xCdcaUsername') mcUsername: string,
    @Headers('xCdcaRemarks') mcRemarks: string,
    @Headers('xCdcaApprovalStatus') mcApprovalStatus: string,
    @Headers() authHeader: string,
@Param('vgphtds_id') vgphtds_id:number,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);

    // Flag-driven routing: if maker-checker headers are present, use deleteMaster
    if (mcRole && mcUsername) {
      const makerInfo = { role: mcRole, username: mcUsername, remarks: mcRemarks,approvalStatus: mcApprovalStatus };
      const result = await this.vgph_tran_dtl_stagingService.deleteMaster(+vgphtds_id,makerInfo,token);
      return result;
    }

    const result =  this.vgph_tran_dtl_stagingService.remove(+vgphtds_id,token);
    return plainToInstance(vgph_tran_dtl_stagingEntity, result);
  }  
 
  @Get('/find/first')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: vgph_tran_dtl_stagingEntity })
  @ApiOperation({
    summary: 'Fetch the first record',
    description: 'Read first record from the vgph_tran_dtl_staging table',
  })
  
  async findFirst(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.vgph_tran_dtl_stagingService.findFirst(token);
    return plainToInstance(vgph_tran_dtl_stagingEntity, result);
  }

  @Get('/find/last')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: vgph_tran_dtl_stagingEntity })
  @ApiOperation({
    summary: 'Fetch the last record',
    description: 'Read last record from the vgph_tran_dtl_staging table',
  })
  
  async findLast(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.vgph_tran_dtl_stagingService.findLast(token);
    return plainToInstance(vgph_tran_dtl_stagingEntity, result);
  }
}