
import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Query,Req,NotFoundException,Headers} from '@nestjs/common';
import { tof_tppService } from './tof_tpp.service';
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
import { tof_tppEntity } from './entity/tof_tpp.entity';
import { Createtof_tppDto } from './dto/Createtof_tpp.dto';
import { Updatetof_tppDto } from './dto/Updatetof_tpp.dto';
import { Querytof_tppDto } from './dto/Querytof_tpp.dto';
import { UfService } from 'src/Torus/v2/uf/uf.service';

 
@Controller('tof_tpp')
@ApiTags('ERD API')
export class tof_tppController {
  constructor(
    private readonly tof_tppService: tof_tppService,
    private readonly ufservice: UfService
  ) {}

  @Get("/schema")
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: tof_tppEntity })
  @ApiOperation({
    summary: 'schema validation',
    description: 'Retrive the datatype of the tof_tpp table',
  })
  async findSchema(@Headers() authHeader: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tof_tppService.findSchema(token);
  }

  @Get('/get')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tof_tpp"})
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: tof_tppEntity, isArray: true })
  @ApiOperation({
    summary: 'Filter the records',
    description: 'Filter all the records from the tof_tpp table',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to fetch' })
  async findAllmethod(@Headers() authHeader: string,@Query() query: any,@Body() body: any,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const { limit }:{ limit:number } = query;
    const { selectColumns}:{ selectColumns:any } = body;
    return this.tof_tppService.findAllmethod(query, +limit, selectColumns, token);
  }

  @Get(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tof_tpp"})
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: tof_tppEntity })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tof_tpp table',
  })
  
  async findOne(@Headers() authHeader: string,@Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tof_tppService.findOne(id,token);
  }
 
  @Post("/query")
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tof_tpp"})
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: Querytof_tppDto })
  @ApiOkResponse({ type: tof_tppEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tof_tpp table',
  })
  async findAllwithquery(@Headers() authHeader: string,@Req() req: any,@Body() body: Prisma.tof_tppWhereInput) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const whereClause = body
    return this.tof_tppService.findAllwithquery(token,whereClause);
  }

  @Get()
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tof_tpp"})
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: tof_tppEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tof_tpp table',
  })
  
  async findAll(@Headers() authHeader: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tof_tppService.findAll(token);
  }

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: Createtof_tppDto })
  @ApiOkResponse({ type: tof_tppEntity })
  @ApiOperation({
    summary: 'Create the record',
    description: 'Create the record for the tof_tpp table',
  })
  
  async create(@Headers() authHeader: string,@Body() createtof_tppDto: Prisma.tof_tppCreateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tof_tppService.create(createtof_tppDto,token);
  }
 
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:String})
  @ApiBody({ type: Updatetof_tppDto })
  @ApiOkResponse({ type: tof_tppEntity })
  @ApiOperation({
    summary: 'Update the record',
    description: 'Update the record for the tof_tpp table',
  })
    
  async update(@Headers() authHeader: string,@Param('id') id: string,@Body() updatetof_tppDto: Prisma.tof_tppUpdateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tof_tppService.update(id, updatetof_tppDto,token);
  }
 
  @Delete(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Delete', subject: "tof_tpp"})
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: tof_tppEntity })
  @ApiOperation({
    summary: 'Delete the record',
    description: 'Delete the record for the tof_tpp table',
  })
  
  async remove(@Headers() authHeader: string,@Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tof_tppService.remove(id,token);
  }  
   @Get('/find/first')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: tof_tppEntity })
  @ApiOperation({
    summary: 'Fetch the first record',
    description: 'Read first record from the tof_tpp table',
  })
  
  async findFirst(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.tof_tppService.findFirst(token);
    return result;
  }

  @Get('/find/last')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: tof_tppEntity })
  @ApiOperation({
    summary: 'Fetch the last record',
    description: 'Read last record from the tof_tpp table',
  })
  
  async findLast(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.tof_tppService.findLast(token);
    return result;
  }
}