
import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Query,Req,NotFoundException,Headers} from '@nestjs/common';
import { tof_consent_responseService } from './tof_consent_response.service';
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
import { tof_consent_responseEntity } from './entity/tof_consent_response.entity';
import { Createtof_consent_responseDto } from './dto/Createtof_consent_response.dto';
import { Updatetof_consent_responseDto } from './dto/Updatetof_consent_response.dto';
import { Querytof_consent_responseDto } from './dto/Querytof_consent_response.dto';
import { UfService } from 'src/Torus/v2/uf/uf.service';

 
@Controller('tof_consent_response')
@ApiTags('ERD API')
export class tof_consent_responseController {
  constructor(
    private readonly tof_consent_responseService: tof_consent_responseService,
    private readonly ufservice: UfService
  ) {}

  @Get("/schema")
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: tof_consent_responseEntity })
  @ApiOperation({
    summary: 'schema validation',
    description: 'Retrive the datatype of the tof_consent_response table',
  })
  async findSchema(@Headers() authHeader: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tof_consent_responseService.findSchema(token);
  }

  @Get('/get')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tof_consent_response"})
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: tof_consent_responseEntity, isArray: true })
  @ApiOperation({
    summary: 'Filter the records',
    description: 'Filter all the records from the tof_consent_response table',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to fetch' })
  async findAllmethod(@Headers() authHeader: string,@Query() query: any,@Body() body: any,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const { limit }:{ limit:number } = query;
    const { selectColumns}:{ selectColumns:any } = body;
    return this.tof_consent_responseService.findAllmethod(query, +limit, selectColumns, token);
  }

  @Get(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tof_consent_response"})
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: tof_consent_responseEntity })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tof_consent_response table',
  })
  
  async findOne(@Headers() authHeader: string,@Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tof_consent_responseService.findOne(id,token);
  }
 
  @Post("/query")
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tof_consent_response"})
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: Querytof_consent_responseDto })
  @ApiOkResponse({ type: tof_consent_responseEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tof_consent_response table',
  })
  async findAllwithquery(@Headers() authHeader: string,@Req() req: any,@Body() body: Prisma.tof_consent_responseWhereInput) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const whereClause = body
    return this.tof_consent_responseService.findAllwithquery(token,whereClause);
  }

  @Get()
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tof_consent_response"})
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: tof_consent_responseEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tof_consent_response table',
  })
  
  async findAll(@Headers() authHeader: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tof_consent_responseService.findAll(token);
  }

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: Createtof_consent_responseDto })
  @ApiOkResponse({ type: tof_consent_responseEntity })
  @ApiOperation({
    summary: 'Create the record',
    description: 'Create the record for the tof_consent_response table',
  })
  
  async create(@Headers() authHeader: string,@Body() createtof_consent_responseDto: Prisma.tof_consent_responseCreateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tof_consent_responseService.create(createtof_consent_responseDto,token);
  }
 
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:String})
  @ApiBody({ type: Updatetof_consent_responseDto })
  @ApiOkResponse({ type: tof_consent_responseEntity })
  @ApiOperation({
    summary: 'Update the record',
    description: 'Update the record for the tof_consent_response table',
  })
    
  async update(@Headers() authHeader: string,@Param('id') id: string,@Body() updatetof_consent_responseDto: Prisma.tof_consent_responseUpdateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tof_consent_responseService.update(id, updatetof_consent_responseDto,token);
  }
 
  @Delete(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Delete', subject: "tof_consent_response"})
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: tof_consent_responseEntity })
  @ApiOperation({
    summary: 'Delete the record',
    description: 'Delete the record for the tof_consent_response table',
  })
  
  async remove(@Headers() authHeader: string,@Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tof_consent_responseService.remove(id,token);
  }  
   @Get('/find/first')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: tof_consent_responseEntity })
  @ApiOperation({
    summary: 'Fetch the first record',
    description: 'Read first record from the tof_consent_response table',
  })
  
  async findFirst(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.tof_consent_responseService.findFirst(token);
    return result;
  }

  @Get('/find/last')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: tof_consent_responseEntity })
  @ApiOperation({
    summary: 'Fetch the last record',
    description: 'Read last record from the tof_consent_response table',
  })
  
  async findLast(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.tof_consent_responseService.findLast(token);
    return result;
  }
}