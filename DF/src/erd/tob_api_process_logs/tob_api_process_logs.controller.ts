import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Query,Req,NotFoundException} from '@nestjs/common';
import { tob_api_process_logsService } from './tob_api_process_logs.service';
import { Prisma } from '@prisma/client';
import { ApiOkResponse, ApiTags,ApiOperation,ApiBody,ApiHeader,ApiQuery,ApiParam } from '@nestjs/swagger';
import { tob_api_process_logsEntity } from './entity/tob_api_process_logs.entity';
import { Createtob_api_process_logsDto } from './dto/Createtob_api_process_logs.dto';
import { Updatetob_api_process_logsDto } from './dto/Updatetob_api_process_logs.dto';
import { Querytob_api_process_logsDto } from './dto/Querytob_api_process_logs.dto';

 
@Controller('tob_api_process_logs')
@ApiTags('ERD API')
export class tob_api_process_logsController {
  constructor(private readonly tob_api_process_logsService: tob_api_process_logsService) {}

  @Get("/schema")
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: tob_api_process_logsEntity })
  @ApiOperation({
    summary: 'schema validation',
    description: 'Retrive the datatype of the tob_api_process_logs table',
  })
  findSchema(@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_api_process_logsService.findSchema(token);
  }

  @Get('/get')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tob_api_process_logs"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: tob_api_process_logsEntity, isArray: true })
  @ApiOperation({
    summary: 'Filter the records',
    description: 'Filter all the records from the tob_api_process_logs table',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to fetch' })
  findAllmethod(@Query() query: any,@Body() body: any,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    const { limit }:{ limit:number } = query;
    const { selectColumns}:{ selectColumns:any } = body;
    return this.tob_api_process_logsService.findAllmethod(query, +limit, selectColumns, token);
  }

  @Get(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tob_api_process_logs"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: tob_api_process_logsEntity })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tob_api_process_logs table',
  })
  findOne( @Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_api_process_logsService.findOne(id,token);
  }
 
  @Post("/query")
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tob_api_process_logs"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiBody({ type: Querytob_api_process_logsDto })
  @ApiOkResponse({ type: tob_api_process_logsEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tob_api_process_logs table',
  })
  findAllwithquery(@Req() req: any,@Body() body: Prisma.tob_api_process_logsWhereInput) {
    const token = req.headers?.authorization?.split(' ')[1];
    const whereClause = body
    return this.tob_api_process_logsService.findAllwithquery(token,whereClause);
  }

  @Get()
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tob_api_process_logs"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: tob_api_process_logsEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tob_api_process_logs table',
  })
  findAll(@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_api_process_logsService.findAll(token);
  }

  @Post()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiBody({ type: Createtob_api_process_logsDto })
  @ApiOkResponse({ type: tob_api_process_logsEntity })
  @ApiOperation({
    summary: 'Create the record',
    description: 'Create the record for the tob_api_process_logs table',
  })
  create(@Body() createtob_api_process_logsDto: Prisma.tob_api_process_logsCreateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_api_process_logsService.create(createtob_api_process_logsDto,token);
  }
 
  @Patch(':id')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'id',type:String})
  @ApiBody({ type: Updatetob_api_process_logsDto })
  @ApiOkResponse({ type: tob_api_process_logsEntity })
  @ApiOperation({
    summary: 'Update the record',
    description: 'Update the record for the tob_api_process_logs table',
  })
  update(@Param('id') id: string,@Body() updatetob_api_process_logsDto: Prisma.tob_api_process_logsUpdateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
  return this.tob_api_process_logsService.update(id, updatetob_api_process_logsDto,token);
  }
 
  @Delete(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Delete', subject: "tob_api_process_logs"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: tob_api_process_logsEntity })
  @ApiOperation({
    summary: 'Delete the record',
    description: 'Delete the record for the tob_api_process_logs table',
  })
  remove(@Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_api_process_logsService.remove(id,token);
  }  
 
}