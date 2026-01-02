
import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Query,Req,NotFoundException,Headers} from '@nestjs/common';
import { master_scheme_setupService } from './master_scheme_setup.service';
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
import { master_scheme_setupEntity } from './entity/master_scheme_setup.entity';
import { Createmaster_scheme_setupDto } from './dto/Createmaster_scheme_setup.dto';
import { Updatemaster_scheme_setupDto } from './dto/Updatemaster_scheme_setup.dto';
import { Querymaster_scheme_setupDto } from './dto/Querymaster_scheme_setup.dto';
import { UfService } from 'src/Torus/v1/uf/uf.service';

 
@Controller('master_scheme_setup')
@ApiTags('ERD API')
export class master_scheme_setupController {
  constructor(
    private readonly master_scheme_setupService: master_scheme_setupService,
    private readonly ufservice: UfService
  ) {}

  @Get("/schema")
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: master_scheme_setupEntity })
  @ApiOperation({
    summary: 'schema validation',
    description: 'Retrive the datatype of the master_scheme_setup table',
  })
  async findSchema(@Headers() authHeader: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.master_scheme_setupService.findSchema(token);
  }

  @Get('/get')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "master_scheme_setup"})
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: master_scheme_setupEntity, isArray: true })
  @ApiOperation({
    summary: 'Filter the records',
    description: 'Filter all the records from the master_scheme_setup table',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to fetch' })
  async findAllmethod(@Headers() authHeader: string,@Query() query: any,@Body() body: any,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const { limit }:{ limit:number } = query;
    const { selectColumns}:{ selectColumns:any } = body;
    return this.master_scheme_setupService.findAllmethod(query, +limit, selectColumns, token);
  }

  @Get(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "master_scheme_setup"})
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: master_scheme_setupEntity })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the master_scheme_setup table',
  })
  
  async findOne(@Headers() authHeader: string,@Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.master_scheme_setupService.findOne(id,token);
  }
 
  @Post("/query")
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "master_scheme_setup"})
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: Querymaster_scheme_setupDto })
  @ApiOkResponse({ type: master_scheme_setupEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the master_scheme_setup table',
  })
  async findAllwithquery(@Headers() authHeader: string,@Req() req: any,@Body() body: Prisma.master_scheme_setupWhereInput) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const whereClause = body
    return this.master_scheme_setupService.findAllwithquery(token,whereClause);
  }

  @Get()
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "master_scheme_setup"})
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: master_scheme_setupEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the master_scheme_setup table',
  })
  
  async findAll(@Headers() authHeader: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.master_scheme_setupService.findAll(token);
  }

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: Createmaster_scheme_setupDto })
  @ApiOkResponse({ type: master_scheme_setupEntity })
  @ApiOperation({
    summary: 'Create the record',
    description: 'Create the record for the master_scheme_setup table',
  })
  
  async create(@Headers() authHeader: string,@Body() createmaster_scheme_setupDto: Prisma.master_scheme_setupCreateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.master_scheme_setupService.create(createmaster_scheme_setupDto,token);
  }
 
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:String})
  @ApiBody({ type: Updatemaster_scheme_setupDto })
  @ApiOkResponse({ type: master_scheme_setupEntity })
  @ApiOperation({
    summary: 'Update the record',
    description: 'Update the record for the master_scheme_setup table',
  })
    
  async update(@Headers() authHeader: string,@Param('id') id: string,@Body() updatemaster_scheme_setupDto: Prisma.master_scheme_setupUpdateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.master_scheme_setupService.update(id, updatemaster_scheme_setupDto,token);
  }
 
  @Delete(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Delete', subject: "master_scheme_setup"})
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: master_scheme_setupEntity })
  @ApiOperation({
    summary: 'Delete the record',
    description: 'Delete the record for the master_scheme_setup table',
  })
  
  async remove(@Headers() authHeader: string,@Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.master_scheme_setupService.remove(id,token);
  }  
   @Get('/find/first')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: master_scheme_setupEntity })
  @ApiOperation({
    summary: 'Fetch the first record',
    description: 'Read first record from the master_scheme_setup table',
  })
  
  async findFirst(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.master_scheme_setupService.findFirst(token);
    return result;
  }

  @Get('/find/last')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: master_scheme_setupEntity })
  @ApiOperation({
    summary: 'Fetch the last record',
    description: 'Read last record from the master_scheme_setup table',
  })
  
  async findLast(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.master_scheme_setupService.findLast(token);
    return result;
  }
}