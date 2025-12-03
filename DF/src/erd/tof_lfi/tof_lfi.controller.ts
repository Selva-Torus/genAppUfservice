
import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Query,Req,NotFoundException,Headers} from '@nestjs/common';
import { tof_lfiService } from './tof_lfi.service';
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
import { tof_lfiEntity } from './entity/tof_lfi.entity';
import { Createtof_lfiDto } from './dto/Createtof_lfi.dto';
import { Updatetof_lfiDto } from './dto/Updatetof_lfi.dto';
import { Querytof_lfiDto } from './dto/Querytof_lfi.dto';
import { UfService } from 'src/Torus/v2/uf/uf.service';

 
@Controller('tof_lfi')
@ApiTags('ERD API')
export class tof_lfiController {
  constructor(
    private readonly tof_lfiService: tof_lfiService,
    private readonly ufservice: UfService
  ) {}

  @Get("/schema")
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: tof_lfiEntity })
  @ApiOperation({
    summary: 'schema validation',
    description: 'Retrive the datatype of the tof_lfi table',
  })
  async findSchema(@Headers() authHeader: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tof_lfiService.findSchema(token);
  }

  @Get('/get')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tof_lfi"})
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: tof_lfiEntity, isArray: true })
  @ApiOperation({
    summary: 'Filter the records',
    description: 'Filter all the records from the tof_lfi table',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to fetch' })
  async findAllmethod(@Headers() authHeader: string,@Query() query: any,@Body() body: any,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const { limit }:{ limit:number } = query;
    const { selectColumns}:{ selectColumns:any } = body;
    return this.tof_lfiService.findAllmethod(query, +limit, selectColumns, token);
  }

  @Get(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tof_lfi"})
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: tof_lfiEntity })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tof_lfi table',
  })
  
  async findOne(@Headers() authHeader: string,@Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tof_lfiService.findOne(id,token);
  }
 
  @Post("/query")
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tof_lfi"})
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: Querytof_lfiDto })
  @ApiOkResponse({ type: tof_lfiEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tof_lfi table',
  })
  async findAllwithquery(@Headers() authHeader: string,@Req() req: any,@Body() body: Prisma.tof_lfiWhereInput) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const whereClause = body
    return this.tof_lfiService.findAllwithquery(token,whereClause);
  }

  @Get()
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tof_lfi"})
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: tof_lfiEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tof_lfi table',
  })
  
  async findAll(@Headers() authHeader: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tof_lfiService.findAll(token);
  }

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: Createtof_lfiDto })
  @ApiOkResponse({ type: tof_lfiEntity })
  @ApiOperation({
    summary: 'Create the record',
    description: 'Create the record for the tof_lfi table',
  })
  
  async create(@Headers() authHeader: string,@Body() createtof_lfiDto: Prisma.tof_lfiCreateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tof_lfiService.create(createtof_lfiDto,token);
  }
 
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:String})
  @ApiBody({ type: Updatetof_lfiDto })
  @ApiOkResponse({ type: tof_lfiEntity })
  @ApiOperation({
    summary: 'Update the record',
    description: 'Update the record for the tof_lfi table',
  })
    
  async update(@Headers() authHeader: string,@Param('id') id: string,@Body() updatetof_lfiDto: Prisma.tof_lfiUpdateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tof_lfiService.update(id, updatetof_lfiDto,token);
  }
 
  @Delete(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Delete', subject: "tof_lfi"})
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: tof_lfiEntity })
  @ApiOperation({
    summary: 'Delete the record',
    description: 'Delete the record for the tof_lfi table',
  })
  
  async remove(@Headers() authHeader: string,@Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.tof_lfiService.remove(id,token);
  }  
   @Get('/find/first')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: tof_lfiEntity })
  @ApiOperation({
    summary: 'Fetch the first record',
    description: 'Read first record from the tof_lfi table',
  })
  
  async findFirst(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.tof_lfiService.findFirst(token);
    return result;
  }

  @Get('/find/last')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: tof_lfiEntity })
  @ApiOperation({
    summary: 'Fetch the last record',
    description: 'Read last record from the tof_lfi table',
  })
  
  async findLast(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.tof_lfiService.findLast(token);
    return result;
  }
}