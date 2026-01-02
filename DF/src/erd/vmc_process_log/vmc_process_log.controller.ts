
import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Query,Req,NotFoundException,Headers} from '@nestjs/common';
import { vmc_process_logService } from './vmc_process_log.service';
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
import { vmc_process_logEntity } from './entity/vmc_process_log.entity';
import { Createvmc_process_logDto } from './dto/Createvmc_process_log.dto';
import { Updatevmc_process_logDto } from './dto/Updatevmc_process_log.dto';
import { Queryvmc_process_logDto } from './dto/Queryvmc_process_log.dto';
import { UfService } from 'src/Torus/v1/uf/uf.service';

 
@Controller('vmc_process_log')
@ApiTags('ERD API')
export class vmc_process_logController {
  constructor(
    private readonly vmc_process_logService: vmc_process_logService,
    private readonly ufservice: UfService
  ) {}

  @Get("/schema")
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: vmc_process_logEntity })
  @ApiOperation({
    summary: 'schema validation',
    description: 'Retrive the datatype of the vmc_process_log table',
  })
  async findSchema(@Headers() authHeader: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.vmc_process_logService.findSchema(token);
  }

  @Get('/get')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "vmc_process_log"})
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: vmc_process_logEntity, isArray: true })
  @ApiOperation({
    summary: 'Filter the records',
    description: 'Filter all the records from the vmc_process_log table',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to fetch' })
  async findAllmethod(@Headers() authHeader: string,@Query() query: any,@Body() body: any,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const { limit }:{ limit:number } = query;
    const { selectColumns}:{ selectColumns:any } = body;
    return this.vmc_process_logService.findAllmethod(query, +limit, selectColumns, token);
  }

  @Get(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "vmc_process_log"})
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: vmc_process_logEntity })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the vmc_process_log table',
  })
    @ApiInternalServerErrorResponse({
    description: 'Internal Server Error for Process Log'
  })

  async findOne(@Headers() authHeader: string,@Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.vmc_process_logService.findOne(id,token);
  }
 
  @Post("/query")
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "vmc_process_log"})
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: Queryvmc_process_logDto })
  @ApiOkResponse({ type: vmc_process_logEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the vmc_process_log table',
  })
  async findAllwithquery(@Headers() authHeader: string,@Req() req: any,@Body() body: Prisma.vmc_process_logWhereInput) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const whereClause = body
    return this.vmc_process_logService.findAllwithquery(token,whereClause);
  }

  @Get()
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "vmc_process_log"})
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: vmc_process_logEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the vmc_process_log table',
  })
  
  async findAll(@Headers() authHeader: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.vmc_process_logService.findAll(token);
  }

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: Createvmc_process_logDto })
  @ApiOkResponse({ type: vmc_process_logEntity })
  @ApiOperation({
    summary: 'Create the record',
    description: 'Create the record for the vmc_process_log table',
  })
    @ApiBadRequestResponse({
    description: 'Request payload not valid for Process Log'
  })

  async create(@Headers() authHeader: string,@Body() createvmc_process_logDto: Prisma.vmc_process_logCreateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.vmc_process_logService.create(createvmc_process_logDto,token);
  }
 
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:String})
  @ApiBody({ type: Updatevmc_process_logDto })
  @ApiOkResponse({ type: vmc_process_logEntity })
  @ApiOperation({
    summary: 'Update the record',
    description: 'Update the record for the vmc_process_log table',
  })
    
  async update(@Headers() authHeader: string,@Param('id') id: string,@Body() updatevmc_process_logDto: Prisma.vmc_process_logUpdateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.vmc_process_logService.update(id, updatevmc_process_logDto,token);
  }
 
  @Delete(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Delete', subject: "vmc_process_log"})
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: vmc_process_logEntity })
  @ApiOperation({
    summary: 'Delete the record',
    description: 'Delete the record for the vmc_process_log table',
  })
  
  async remove(@Headers() authHeader: string,@Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.vmc_process_logService.remove(id,token);
  }  
   @Get('/find/first')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: vmc_process_logEntity })
  @ApiOperation({
    summary: 'Fetch the first record',
    description: 'Read first record from the vmc_process_log table',
  })
    @ApiInternalServerErrorResponse({
    description: 'Internal Server Error for Process Log'
  })

  async findFirst(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.vmc_process_logService.findFirst(token);
    return result;
  }

  @Get('/find/last')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: vmc_process_logEntity })
  @ApiOperation({
    summary: 'Fetch the last record',
    description: 'Read last record from the vmc_process_log table',
  })
    @ApiInternalServerErrorResponse({
    description: 'Internal Server Error for Process Log'
  })

  async findLast(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.vmc_process_logService.findLast(token);
    return result;
  }
}