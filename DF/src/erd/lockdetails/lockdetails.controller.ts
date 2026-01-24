
import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Query,Req,NotFoundException,Headers} from '@nestjs/common';
import { lockdetailsService } from './lockdetails.service';
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
  ApiBearerAuth 
} from '@nestjs/swagger';
import { lockdetailsEntity } from './entity/lockdetails.entity';
//import { CreateLockdetailsDto } from '../prisma/dto/create-lockdetails.dto';
//import { UpdateLockdetailsDto } from '../prisma/dto/update-lockdetails.dto';
import { CreatelockdetailsDto } from './dto/Createlockdetails.dto';
import { UpdatelockdetailsDto } from './dto/Updatelockdetails.dto';
import { plainToInstance } from 'class-transformer';
import { UfService } from 'src/Torus/v1/uf/uf.service';

 
@Controller('lockdetails')
@ApiTags('ERD API')
export class lockdetailsController {
  constructor(
    private readonly lockdetailsService: lockdetailsService,
    private readonly ufservice: UfService
  ) {}

  @Get("/schema")
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: lockdetailsEntity })
  @ApiOperation({
    summary: 'schema validation',
    description: 'Retrive the datatype of the lockdetails table',
  })
  async findSchema(@Headers() authHeader: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.lockdetailsService.findSchema(token);
  }

  @Get('/get')
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: lockdetailsEntity, isArray: true })
  @ApiOperation({
    summary: 'Filter the records',
    description: 'Filter all the records from the lockdetails table',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to fetch' })
  async findAllmethod(@Headers() authHeader: string,@Query() query: any,@Body() body: any,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const { limit }:{ limit:number } = query;
    const { selectColumns}:{ selectColumns:any } = body;
    return this.lockdetailsService.findAllmethod(query, +limit,selectColumns,token);
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:Number})
  @ApiOkResponse({ type: lockdetailsEntity })
  @ApiOperation({
    summary: 'Fetch the only one record',
    description: 'Read only one records from the lockdetails table',
  })
  
  async findOne(@Headers() authHeader: string,@Param('id') id:number,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.lockdetailsService.findOne(+id,token);
    return plainToInstance(lockdetailsEntity, result);
  }
 
  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiQuery({ name: 'id', required: false, type: Number})
  @ApiOkResponse({ type: lockdetailsEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the lockdetails table',
  })
  
  async findAll(@Headers() authHeader: string,@Req() req: any,@Query("trs_created_date") trs_created_date?: Date,@Query("trs_created_by") trs_created_by?: string,@Query("trs_modified_date") trs_modified_date?: Date,@Query("trs_modified_by") trs_modified_by?: string,@Query("trs_next_status") trs_next_status?: string,@Query("trs_status") trs_status?: string,@Query("trs_process_id") trs_process_id?: string,@Query("trs_access_profile") trs_access_profile?: string,@Query("trs_org_grp_code") trs_org_grp_code?: string,@Query("trs_org_code") trs_org_code?: string,@Query("trs_role_grp_code") trs_role_grp_code?: string,@Query("trs_role_code") trs_role_code?: string,@Query("trs_ps_grp_code") trs_ps_grp_code?: string,@Query("trs_ps_code") trs_ps_code?: string,@Query("trs_sub_org_grp_code") trs_sub_org_grp_code?: string,@Query("trs_sub_org_code") trs_sub_org_code?: string,@Query('id') id?:string,@Query() query?: Record<string, any>) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    let presentQueryKeys:any=[
      'id',
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
    const result = this.lockdetailsService.findAll(token,trs_created_date,trs_created_by,trs_modified_date,trs_modified_by,trs_next_status,trs_status,trs_process_id,trs_access_profile,trs_org_grp_code,trs_org_code,trs_role_grp_code,trs_role_code,trs_ps_grp_code,trs_ps_code,trs_sub_org_grp_code,trs_sub_org_code,+id);
    return plainToInstance(lockdetailsEntity, result);
  } 

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: CreatelockdetailsDto })
  @ApiOkResponse({ type: lockdetailsEntity })
  @ApiOperation({
    summary: 'Create the record',
    description: 'Create the record for the lockdetails table',
  })
  
  async create(
    @Headers('xCdcaRole') mcRole: string,
    @Headers('xCdcaUsername') mcUsername: string,
    @Headers('xCdcaRemarks') mcRemarks: string,
    @Headers('xCdcaApprovalStatus') mcApprovalStatus: string,
    @Headers('xCdcaApprovalID') mcApprovalID: string,
    @Headers() authHeader: string,
    @Body() createlockdetailsDto: Prisma.lockdetailsCreateInput,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);

    // Flag-driven routing: if maker-checker headers are present, use createMaster
    if (mcRole && mcUsername) {
      const makerInfo = { role: mcRole, username: mcUsername, remarks: mcRemarks, approvalStatus: mcApprovalStatus,approvalId:mcApprovalID };
      const result = await this.lockdetailsService.createMaster(createlockdetailsDto, makerInfo, token);
      return result;
    }

    const result = this.lockdetailsService.create(createlockdetailsDto,token);
    return plainToInstance(lockdetailsEntity, result);
  }
 
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:Number})
  @ApiBody({ type: UpdatelockdetailsDto })
  @ApiOkResponse({ type: lockdetailsEntity })
  @ApiOperation({
    summary: 'Update the record',
    description: 'Update the record for the lockdetails table',
  })
    
  async update(
    @Headers('xCdcaRole') mcRole: string,
    @Headers('xCdcaUsername') mcUsername: string,
    @Headers('xCdcaRemarks') mcRemarks: string,
    @Headers('xCdcaApprovalStatus') mcApprovalStatus: string,
    @Headers() authHeader: string,
@Param('id') id:number,
    @Body() updatelockdetailsDto: Prisma.lockdetailsUpdateInput,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);

    // Flag-driven routing: if maker-checker headers are present, use updateMaster
    if (mcRole && mcUsername) {
      const makerInfo = { role: mcRole, username: mcUsername, remarks: mcRemarks,approvalStatus: mcApprovalStatus };
      const result = await this.lockdetailsService.updateMaster(+id,updatelockdetailsDto,makerInfo,token);
      return result;
    }

    const result = this.lockdetailsService.update(+id,updatelockdetailsDto,token);
    return plainToInstance(lockdetailsEntity, result);
  }
 
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:Number})
  @ApiOkResponse({ type: lockdetailsEntity })
  @ApiOperation({
    summary: 'Delete the record',
    description: 'Delete the record for the lockdetails table',
  })
  
  async remove(
    @Headers('xCdcaRole') mcRole: string,
    @Headers('xCdcaUsername') mcUsername: string,
    @Headers('xCdcaRemarks') mcRemarks: string,
    @Headers('xCdcaApprovalStatus') mcApprovalStatus: string,
    @Headers() authHeader: string,
@Param('id') id:number,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);

    // Flag-driven routing: if maker-checker headers are present, use deleteMaster
    if (mcRole && mcUsername) {
      const makerInfo = { role: mcRole, username: mcUsername, remarks: mcRemarks,approvalStatus: mcApprovalStatus };
      const result = await this.lockdetailsService.deleteMaster(+id,makerInfo,token);
      return result;
    }

    const result =  this.lockdetailsService.remove(+id,token);
    return plainToInstance(lockdetailsEntity, result);
  }  
 
  @Get('/find/first')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: lockdetailsEntity })
  @ApiOperation({
    summary: 'Fetch the first record',
    description: 'Read first record from the lockdetails table',
  })
  
  async findFirst(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.lockdetailsService.findFirst(token);
    return plainToInstance(lockdetailsEntity, result);
  }

  @Get('/find/last')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: lockdetailsEntity })
  @ApiOperation({
    summary: 'Fetch the last record',
    description: 'Read last record from the lockdetails table',
  })
  
  async findLast(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.lockdetailsService.findLast(token);
    return plainToInstance(lockdetailsEntity, result);
  }
}