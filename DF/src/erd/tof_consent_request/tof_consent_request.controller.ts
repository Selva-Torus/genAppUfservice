
import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Query,Req,NotFoundException,Headers} from '@nestjs/common';
import { tof_consent_requestService } from './tof_consent_request.service';
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
import { tof_consent_requestEntity } from './entity/tof_consent_request.entity';
import { Createtof_consent_requestDto } from './dto/Createtof_consent_request.dto';
import { Updatetof_consent_requestDto } from './dto/Updatetof_consent_request.dto';
import { Querytof_consent_requestDto } from './dto/Querytof_consent_request.dto';
import { UfService } from 'src/Torus/v2/uf/uf.service';

 
@Controller('tof_consent_request')
@ApiTags('ERD API')
export class tof_consent_requestController {
  constructor(
    private readonly tof_consent_requestService: tof_consent_requestService,
    private readonly ufservice: UfService
  ) {}

  @Get("/schema")
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: tof_consent_requestEntity })
  @ApiOperation({
    summary: 'schema validation',
    description: 'Retrive the datatype of the tof_consent_request table',
  })
  async findSchema(@Headers() authHeader: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tof_consent_requestService.findSchema(token);
  }

  @Get('/get')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tof_consent_request"})
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: tof_consent_requestEntity, isArray: true })
  @ApiOperation({
    summary: 'Filter the records',
    description: 'Filter all the records from the tof_consent_request table',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to fetch' })
  async findAllmethod(@Headers() authHeader: string,@Query() query: any,@Body() body: any,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const { limit }:{ limit:number } = query;
    const { selectColumns}:{ selectColumns:any } = body;
    return this.tof_consent_requestService.findAllmethod(query, +limit, selectColumns, token);
  }

  @Get(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tof_consent_request"})
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: tof_consent_requestEntity })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tof_consent_request table',
  })
  
  async findOne(@Headers() authHeader: string,@Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tof_consent_requestService.findOne(id,token);
  }
 
  @Post("/query")
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tof_consent_request"})
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: Querytof_consent_requestDto })
  @ApiOkResponse({ type: tof_consent_requestEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tof_consent_request table',
  })
  async findAllwithquery(@Headers() authHeader: string,@Req() req: any,@Body() body: Prisma.tof_consent_requestWhereInput) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const whereClause = body
    return this.tof_consent_requestService.findAllwithquery(token,whereClause);
  }

  @Get()
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tof_consent_request"})
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: tof_consent_requestEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tof_consent_request table',
  })
  
  async findAll(@Headers() authHeader: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tof_consent_requestService.findAll(token);
  }

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: Createtof_consent_requestDto })
  @ApiOkResponse({ type: tof_consent_requestEntity })
  @ApiOperation({
    summary: 'Create the record',
    description: 'Create the record for the tof_consent_request table',
  })
  
  async create(@Headers() authHeader: string,@Body() createtof_consent_requestDto: Prisma.tof_consent_requestCreateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tof_consent_requestService.create(createtof_consent_requestDto,token);
  }
 
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:String})
  @ApiBody({ type: Updatetof_consent_requestDto })
  @ApiOkResponse({ type: tof_consent_requestEntity })
  @ApiOperation({
    summary: 'Update the record',
    description: 'Update the record for the tof_consent_request table',
  })
    
  async update(@Headers() authHeader: string,@Param('id') id: string,@Body() updatetof_consent_requestDto: Prisma.tof_consent_requestUpdateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tof_consent_requestService.update(id, updatetof_consent_requestDto,token);
  }
 
  @Delete(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Delete', subject: "tof_consent_request"})
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: tof_consent_requestEntity })
  @ApiOperation({
    summary: 'Delete the record',
    description: 'Delete the record for the tof_consent_request table',
  })
  
  async remove(@Headers() authHeader: string,@Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tof_consent_requestService.remove(id,token);
  }  
   @Get('/find/first')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: tof_consent_requestEntity })
  @ApiOperation({
    summary: 'Fetch the first record',
    description: 'Read first record from the tof_consent_request table',
  })
  
  async findFirst(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.tof_consent_requestService.findFirst(token);
    return result;
  }

  @Get('/find/last')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: tof_consent_requestEntity })
  @ApiOperation({
    summary: 'Fetch the last record',
    description: 'Read last record from the tof_consent_request table',
  })
  
  async findLast(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.tof_consent_requestService.findLast(token);
    return result;
  }
}