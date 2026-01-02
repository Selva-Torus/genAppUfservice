
import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Query,Req,NotFoundException,Headers} from '@nestjs/common';
import { vmc_api_repositorysService } from './vmc_api_repositorys.service';
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
import { vmc_api_repositorysEntity } from './entity/vmc_api_repositorys.entity';
import { Createvmc_api_repositorysDto } from './dto/Createvmc_api_repositorys.dto';
import { Updatevmc_api_repositorysDto } from './dto/Updatevmc_api_repositorys.dto';
import { Queryvmc_api_repositorysDto } from './dto/Queryvmc_api_repositorys.dto';
import { UfService } from 'src/Torus/v1/uf/uf.service';

 
@Controller('vmc_api_repositorys')
@ApiTags('ERD API')
export class vmc_api_repositorysController {
  constructor(
    private readonly vmc_api_repositorysService: vmc_api_repositorysService,
    private readonly ufservice: UfService
  ) {}

  @Get("/schema")
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: vmc_api_repositorysEntity })
  @ApiOperation({
    summary: 'schema validation',
    description: 'Retrive the datatype of the vmc_api_repositorys table',
  })
  async findSchema(@Headers() authHeader: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.vmc_api_repositorysService.findSchema(token);
  }

  @Get('/get')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "vmc_api_repositorys"})
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: vmc_api_repositorysEntity, isArray: true })
  @ApiOperation({
    summary: 'Filter the records',
    description: 'Filter all the records from the vmc_api_repositorys table',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to fetch' })
  async findAllmethod(@Headers() authHeader: string,@Query() query: any,@Body() body: any,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const { limit }:{ limit:number } = query;
    const { selectColumns}:{ selectColumns:any } = body;
    return this.vmc_api_repositorysService.findAllmethod(query, +limit, selectColumns, token);
  }

  @Get(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "vmc_api_repositorys"})
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: vmc_api_repositorysEntity })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the vmc_api_repositorys table',
  })
  
  async findOne(@Headers() authHeader: string,@Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.vmc_api_repositorysService.findOne(id,token);
  }
 
  @Post("/query")
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "vmc_api_repositorys"})
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: Queryvmc_api_repositorysDto })
  @ApiOkResponse({ type: vmc_api_repositorysEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the vmc_api_repositorys table',
  })
  async findAllwithquery(@Headers() authHeader: string,@Req() req: any,@Body() body: Prisma.vmc_api_repositorysWhereInput) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const whereClause = body
    return this.vmc_api_repositorysService.findAllwithquery(token,whereClause);
  }

  @Get()
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "vmc_api_repositorys"})
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: vmc_api_repositorysEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the vmc_api_repositorys table',
  })
  
  async findAll(@Headers() authHeader: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.vmc_api_repositorysService.findAll(token);
  }

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: Createvmc_api_repositorysDto })
  @ApiOkResponse({ type: vmc_api_repositorysEntity })
  @ApiOperation({
    summary: 'Create the record',
    description: 'Create the record for the vmc_api_repositorys table',
  })
  
  async create(@Headers() authHeader: string,@Body() createvmc_api_repositorysDto: Prisma.vmc_api_repositorysCreateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.vmc_api_repositorysService.create(createvmc_api_repositorysDto,token);
  }
 
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:String})
  @ApiBody({ type: Updatevmc_api_repositorysDto })
  @ApiOkResponse({ type: vmc_api_repositorysEntity })
  @ApiOperation({
    summary: 'Update the record',
    description: 'Update the record for the vmc_api_repositorys table',
  })
    
  async update(@Headers() authHeader: string,@Param('id') id: string,@Body() updatevmc_api_repositorysDto: Prisma.vmc_api_repositorysUpdateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.vmc_api_repositorysService.update(id, updatevmc_api_repositorysDto,token);
  }
 
  @Delete(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Delete', subject: "vmc_api_repositorys"})
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: vmc_api_repositorysEntity })
  @ApiOperation({
    summary: 'Delete the record',
    description: 'Delete the record for the vmc_api_repositorys table',
  })
  
  async remove(@Headers() authHeader: string,@Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.vmc_api_repositorysService.remove(id,token);
  }  
   @Get('/find/first')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: vmc_api_repositorysEntity })
  @ApiOperation({
    summary: 'Fetch the first record',
    description: 'Read first record from the vmc_api_repositorys table',
  })
  
  async findFirst(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.vmc_api_repositorysService.findFirst(token);
    return result;
  }

  @Get('/find/last')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: vmc_api_repositorysEntity })
  @ApiOperation({
    summary: 'Fetch the last record',
    description: 'Read last record from the vmc_api_repositorys table',
  })
  
  async findLast(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.vmc_api_repositorysService.findLast(token);
    return result;
  }
}