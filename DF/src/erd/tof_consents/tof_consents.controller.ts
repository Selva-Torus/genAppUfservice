
import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Query,Req,NotFoundException,Headers} from '@nestjs/common';
import { tof_consentsService } from './tof_consents.service';
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
import { tof_consentsEntity } from './entity/tof_consents.entity';
import { Createtof_consentsDto } from './dto/Createtof_consents.dto';
import { Updatetof_consentsDto } from './dto/Updatetof_consents.dto';
import { Querytof_consentsDto } from './dto/Querytof_consents.dto';
import { UfService } from 'src/Torus/v2/uf/uf.service';

 
@Controller('tof_consents')
@ApiTags('ERD API')
export class tof_consentsController {
  constructor(
    private readonly tof_consentsService: tof_consentsService,
    private readonly ufservice: UfService
  ) {}

  @Get("/schema")
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: tof_consentsEntity })
  @ApiOperation({
    summary: 'schema validation',
    description: 'Retrive the datatype of the tof_consents table',
  })
  async findSchema(@Headers() authHeader: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tof_consentsService.findSchema(token);
  }

  @Get('/get')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tof_consents"})
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: tof_consentsEntity, isArray: true })
  @ApiOperation({
    summary: 'Filter the records',
    description: 'Filter all the records from the tof_consents table',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to fetch' })
  async findAllmethod(@Headers() authHeader: string,@Query() query: any,@Body() body: any,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const { limit }:{ limit:number } = query;
    const { selectColumns}:{ selectColumns:any } = body;
    return this.tof_consentsService.findAllmethod(query, +limit, selectColumns, token);
  }

  @Get(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tof_consents"})
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: tof_consentsEntity })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tof_consents table',
  })
  
  async findOne(@Headers() authHeader: string,@Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tof_consentsService.findOne(id,token);
  }
 
  @Post("/query")
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tof_consents"})
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: Querytof_consentsDto })
  @ApiOkResponse({ type: tof_consentsEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tof_consents table',
  })
  async findAllwithquery(@Headers() authHeader: string,@Req() req: any,@Body() body: Prisma.tof_consentsWhereInput) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const whereClause = body
    return this.tof_consentsService.findAllwithquery(token,whereClause);
  }

  @Get()
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tof_consents"})
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: tof_consentsEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tof_consents table',
  })
  
  async findAll(@Headers() authHeader: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tof_consentsService.findAll(token);
  }

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: Createtof_consentsDto })
  @ApiOkResponse({ type: tof_consentsEntity })
  @ApiOperation({
    summary: 'Create the record',
    description: 'Create the record for the tof_consents table',
  })
  
  async create(@Headers() authHeader: string,@Body() createtof_consentsDto: Prisma.tof_consentsCreateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tof_consentsService.create(createtof_consentsDto,token);
  }
 
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:String})
  @ApiBody({ type: Updatetof_consentsDto })
  @ApiOkResponse({ type: tof_consentsEntity })
  @ApiOperation({
    summary: 'Update the record',
    description: 'Update the record for the tof_consents table',
  })
    
  async update(@Headers() authHeader: string,@Param('id') id: string,@Body() updatetof_consentsDto: Prisma.tof_consentsUpdateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tof_consentsService.update(id, updatetof_consentsDto,token);
  }
 
  @Delete(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Delete', subject: "tof_consents"})
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: tof_consentsEntity })
  @ApiOperation({
    summary: 'Delete the record',
    description: 'Delete the record for the tof_consents table',
  })
  
  async remove(@Headers() authHeader: string,@Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tof_consentsService.remove(id,token);
  }  
   @Get('/find/first')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: tof_consentsEntity })
  @ApiOperation({
    summary: 'Fetch the first record',
    description: 'Read first record from the tof_consents table',
  })
  
  async findFirst(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.tof_consentsService.findFirst(token);
    return result;
  }

  @Get('/find/last')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: tof_consentsEntity })
  @ApiOperation({
    summary: 'Fetch the last record',
    description: 'Read last record from the tof_consents table',
  })
  
  async findLast(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.tof_consentsService.findLast(token);
    return result;
  }
}