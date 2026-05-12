

import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Query,Req,NotFoundException,Headers,UsePipes} from '@nestjs/common';
import { vgph_corporate_relationship_exceptionService } from './vgph_corporate_relationship_exception.service';
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
import { vgph_corporate_relationship_exceptionEntity } from './entity/vgph_corporate_relationship_exception.entity';
//import { CreateVgphCorporateRelationshipExceptionDto } from '../prisma/dto/create-vgphCorporateRelationshipException.dto';
//import { UpdateVgphCorporateRelationshipExceptionDto } from '../prisma/dto/update-vgphCorporateRelationshipException.dto';
import { Createvgph_corporate_relationship_exceptionDto } from './dto/Createvgph_corporate_relationship_exception.dto';
import { Updatevgph_corporate_relationship_exceptionDto } from './dto/Updatevgph_corporate_relationship_exception.dto';
import { plainToInstance } from 'class-transformer';
import { UfService } from 'src/Torus/v1/uf/uf.service';
import { PrismaModelValidationPipe } from 'src/pipes/prisma-model-validation.pipe';

 
@Controller('vgph_corporate_relationship_exception')
@ApiTags('ERD API')
export class vgph_corporate_relationship_exceptionController {
  constructor(
    private readonly vgph_corporate_relationship_exceptionService: vgph_corporate_relationship_exceptionService,
    private readonly ufservice: UfService
  ) {}

  @Get("/schema")
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: vgph_corporate_relationship_exceptionEntity })
  @ApiOperation({
    summary: 'schema validation',
    description: 'Retrive the datatype of the vgph_corporate_relationship_exception table',
  })
  async findSchema(@Headers() authHeader: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.vgph_corporate_relationship_exceptionService.findSchema(token);
  }

  @Get('/get')
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: vgph_corporate_relationship_exceptionEntity, isArray: true })
  @ApiOperation({
    summary: 'Filter the records',
    description: 'Filter all the records from the vgph_corporate_relationship_exception table',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to fetch' })
  async findAllmethod(@Headers() authHeader: string,@Query() query: any,@Body() body: any,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const { limit }:{ limit:number } = query;
    const { selectColumns}:{ selectColumns:any } = body;
    return this.vgph_corporate_relationship_exceptionService.findAllmethod(query, +limit,selectColumns,token);
  }

  @Get(':vgphcre_id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'vgphcre_id',type:Number})
  @ApiOkResponse({ type: vgph_corporate_relationship_exceptionEntity, isArray: true })
  @ApiOperation({
    summary: 'Fetch the only one record',
    description: 'Read only one records from the vgph_corporate_relationship_exception table',
  })
  
  async findOne(@Headers() authHeader: string,@Param('vgphcre_id') vgphcre_id:number,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.vgph_corporate_relationship_exceptionService.findOne(+vgphcre_id,token);
    return plainToInstance(vgph_corporate_relationship_exceptionEntity, result);
  }
 
  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: vgph_corporate_relationship_exceptionEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the vgph_corporate_relationship_exception table',
  })
  @ApiQuery({ name: 'vgphcre_id', required: false})
  
  async findAll(@Headers() authHeader: string,@Req() req: any,@Query('vgphcre_id') vgphcre_id?:string,@Query() query?: Record<string, any>) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    let presentQueryKeys:any=[
      'vgphcre_id',
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
    const result = this.vgph_corporate_relationship_exceptionService.findAll(token,+vgphcre_id);
    return plainToInstance(vgph_corporate_relationship_exceptionEntity, result);
  } 

  @Post()
  @UsePipes(new PrismaModelValidationPipe('vgph_corporate_relationship_exception'))
  @ApiBearerAuth('JWT-auth')
  @ApiHeader({ name: 'xCdcaRole', required: false })
  @ApiHeader({ name: 'xCdcaUsername', required: false })
  @ApiHeader({ name: 'xCdcaRemarks', required: false })
  @ApiHeader({ name: 'xCdcaApprovalStatus', required: false })
  @ApiHeader({ name: 'xCdcaApprovalID', required: false })
  @ApiBody({ type: Createvgph_corporate_relationship_exceptionDto })
  @ApiCreatedResponse({ type: vgph_corporate_relationship_exceptionEntity })
  @ApiOperation({
    summary: 'Create the record',
    description: 'Create the record for the vgph_corporate_relationship_exception table',
  })
  
  async create(
    @Headers('xCdcaRole') mcRole: string,
    @Headers('xCdcaUsername') mcUsername: string,
    @Headers('xCdcaRemarks') mcRemarks: string,
    @Headers('xCdcaApprovalStatus') mcApprovalStatus: string,
    @Headers('xCdcaApprovalID') mcApprovalID: string,
    @Headers() authHeader: string,
    @Body() createvgph_corporate_relationship_exceptionDto: Prisma.vgph_corporate_relationship_exceptionCreateInput,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);

    // Flag-driven routing: if maker-checker headers are present, use createMaster
    if (mcRole && mcUsername) {
      const makerInfo = { role: mcRole, username: mcUsername, remarks: mcRemarks, approvalStatus: mcApprovalStatus,approvalId:mcApprovalID };
      const result = await this.vgph_corporate_relationship_exceptionService.createMaster(createvgph_corporate_relationship_exceptionDto, makerInfo, token);
      return result;
    }

    const result = this.vgph_corporate_relationship_exceptionService.create(createvgph_corporate_relationship_exceptionDto,token);
    return plainToInstance(vgph_corporate_relationship_exceptionEntity, result);
  }
 
  @Patch(':vgphcre_id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'vgphcre_id',type:Number})
  @ApiHeader({ name: 'xCdcaRole', required: false })
  @ApiHeader({ name: 'xCdcaUsername', required: false })
  @ApiHeader({ name: 'xCdcaRemarks', required: false })
  @ApiHeader({ name: 'xCdcaApprovalStatus', required: false })
  @ApiBody({ type: Updatevgph_corporate_relationship_exceptionDto })
  @ApiOkResponse({ type: vgph_corporate_relationship_exceptionEntity, isArray: true })
  @ApiOperation({
    summary: 'Update the record',
    description: 'Update the record for the vgph_corporate_relationship_exception table',
  })
    
  async update(
    @Headers('xCdcaRole') mcRole: string,
    @Headers('xCdcaUsername') mcUsername: string,
    @Headers('xCdcaRemarks') mcRemarks: string,
    @Headers('xCdcaApprovalStatus') mcApprovalStatus: string,
    @Headers() authHeader: string,
@Param('vgphcre_id') vgphcre_id:number,
    @Body() updatevgph_corporate_relationship_exceptionDto: Prisma.vgph_corporate_relationship_exceptionUpdateInput,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);

    // Flag-driven routing: if maker-checker headers are present, use updateMaster
    if (mcRole && mcUsername) {
      const makerInfo = { role: mcRole, username: mcUsername, remarks: mcRemarks,approvalStatus: mcApprovalStatus };
      const result = await this.vgph_corporate_relationship_exceptionService.updateMaster(+vgphcre_id,updatevgph_corporate_relationship_exceptionDto,makerInfo,token);
      return result;
    }

    const result = this.vgph_corporate_relationship_exceptionService.update(+vgphcre_id,updatevgph_corporate_relationship_exceptionDto,token);
    return plainToInstance(vgph_corporate_relationship_exceptionEntity, result);
  }
 
  @Delete(':vgphcre_id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'vgphcre_id',type:Number})
  @ApiHeader({ name: 'xCdcaRole', required: false })
  @ApiHeader({ name: 'xCdcaUsername', required: false })
  @ApiHeader({ name: 'xCdcaRemarks', required: false })
  @ApiHeader({ name: 'xCdcaApprovalStatus', required: false })
  @ApiOkResponse({ type: vgph_corporate_relationship_exceptionEntity, isArray: true })
  @ApiOperation({
    summary: 'Delete the record',
    description: 'Delete the record for the vgph_corporate_relationship_exception table',
  })
  
  async remove(
    @Headers('xCdcaRole') mcRole: string,
    @Headers('xCdcaUsername') mcUsername: string,
    @Headers('xCdcaRemarks') mcRemarks: string,
    @Headers('xCdcaApprovalStatus') mcApprovalStatus: string,
    @Headers() authHeader: string,
@Param('vgphcre_id') vgphcre_id:number,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);

    // Flag-driven routing: if maker-checker headers are present, use deleteMaster
    if (mcRole && mcUsername) {
      const makerInfo = { role: mcRole, username: mcUsername, remarks: mcRemarks,approvalStatus: mcApprovalStatus };
      const result = await this.vgph_corporate_relationship_exceptionService.deleteMaster(+vgphcre_id,makerInfo,token);
      return result;
    }

    const result =  this.vgph_corporate_relationship_exceptionService.remove(+vgphcre_id,token);
    return plainToInstance(vgph_corporate_relationship_exceptionEntity, result);
  }  
 
  @Get('/find/first')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: vgph_corporate_relationship_exceptionEntity })
  @ApiOperation({
    summary: 'Fetch the first record',
    description: 'Read first record from the vgph_corporate_relationship_exception table',
  })
  
  async findFirst(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.vgph_corporate_relationship_exceptionService.findFirst(token);
    return plainToInstance(vgph_corporate_relationship_exceptionEntity, result);
  }

  @Get('/find/last')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: vgph_corporate_relationship_exceptionEntity })
  @ApiOperation({
    summary: 'Fetch the last record',
    description: 'Read last record from the vgph_corporate_relationship_exception table',
  })
  
  async findLast(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.vgph_corporate_relationship_exceptionService.findLast(token);
    return plainToInstance(vgph_corporate_relationship_exceptionEntity, result);
  }
}