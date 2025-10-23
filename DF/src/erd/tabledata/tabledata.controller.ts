
import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Query,Req,NotFoundException,Headers} from '@nestjs/common';
import { tabledataService } from './tabledata.service';
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
import { tabledataEntity } from './entity/tabledata.entity';
import { CreatetabledataDto } from './dto/Createtabledata.dto';
import { UpdatetabledataDto } from './dto/Updatetabledata.dto';
import { QuerytabledataDto } from './dto/Querytabledata.dto';
import { UfService } from 'src/Torus/v1/uf/uf.service';

 
@Controller('tabledata')
@ApiTags('ERD API')
export class tabledataController {
  constructor(
    private readonly tabledataService: tabledataService,
    private readonly ufservice: UfService
  ) {}

  @Get("/schema")
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: tabledataEntity })
  @ApiOperation({
    summary: 'schema validation',
    description: 'Retrive the datatype of the tabledata table',
  })
  async findSchema(@Headers() authHeader: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tabledataService.findSchema(token);
  }

  @Get('/get')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tabledata"})
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: tabledataEntity, isArray: true })
  @ApiOperation({
    summary: 'Filter the records',
    description: 'Filter all the records from the tabledata table',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to fetch' })
  async findAllmethod(@Headers() authHeader: string,@Query() query: any,@Body() body: any,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const { limit }:{ limit:number } = query;
    const { selectColumns}:{ selectColumns:any } = body;
    return this.tabledataService.findAllmethod(query, +limit, selectColumns, token);
  }

  @Get(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tabledata"})
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: tabledataEntity })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tabledata table',
  })
    @ApiBadRequestResponse({
    description: 'Bad Request (e.g., validation errors)'
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized (missing or invalid token)'
  })

  async findOne(@Headers() authHeader: string,@Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tabledataService.findOne(id,token);
  }
 
  @Post("/query")
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tabledata"})
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: QuerytabledataDto })
  @ApiOkResponse({ type: tabledataEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tabledata table',
  })
  async findAllwithquery(@Headers() authHeader: string,@Req() req: any,@Body() body: Prisma.tabledataWhereInput) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const whereClause = body
    return this.tabledataService.findAllwithquery(token,whereClause);
  }

  @Get()
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tabledata"})
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: tabledataEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tabledata table',
  })
    @ApiForbiddenResponse({
    description: 'Forbidden (access denied)'
  })

  async findAll(@Headers() authHeader: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tabledataService.findAll(token);
  }

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: CreatetabledataDto })
  @ApiOkResponse({ type: tabledataEntity })
  @ApiOperation({
    summary: 'Create the record',
    description: 'Create the record for the tabledata table',
  })
    @ApiConflictResponse({
    description: 'Conflict (e.g., duplicate resource)'
  })

  async create(@Headers() authHeader: string,@Body() createtabledataDto: Prisma.tabledataCreateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tabledataService.create(createtabledataDto,token);
  }
 
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:String})
  @ApiBody({ type: UpdatetabledataDto })
  @ApiOkResponse({ type: tabledataEntity })
  @ApiOperation({
    summary: 'Update the record',
    description: 'Update the record for the tabledata table',
  })
      @ApiNotFoundResponse({
    description: 'Resource not found'
  })

  async update(@Headers() authHeader: string,@Param('id') id: string,@Body() updatetabledataDto: Prisma.tabledataUpdateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tabledataService.update(id, updatetabledataDto,token);
  }
 
  @Delete(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Delete', subject: "tabledata"})
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: tabledataEntity })
  @ApiOperation({
    summary: 'Delete the record',
    description: 'Delete the record for the tabledata table',
  })
    @ApiNotAcceptableResponse({
    description: 'Not Acceptable'
  })

  async remove(@Headers() authHeader: string,@Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tabledataService.remove(id,token);
  }  
   @Get('/find/first')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: tabledataEntity })
  @ApiOperation({
    summary: 'Fetch the first record',
    description: 'Read first record from the tabledata table',
  })
    @ApiBadRequestResponse({
    description: 'Bad Request (e.g., validation errors)'
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized (missing or invalid token)'
  })

  async findFirst(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.tabledataService.findFirst(token);
    return result;
  }

  @Get('/find/last')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: tabledataEntity })
  @ApiOperation({
    summary: 'Fetch the last record',
    description: 'Read last record from the tabledata table',
  })
    @ApiBadRequestResponse({
    description: 'Bad Request (e.g., validation errors)'
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized (missing or invalid token)'
  })

  async findLast(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.tabledataService.findLast(token);
    return result;
  }
}