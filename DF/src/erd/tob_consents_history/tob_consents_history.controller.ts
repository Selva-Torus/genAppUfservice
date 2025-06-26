import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Query,Req,NotFoundException} from '@nestjs/common';
import { tob_consents_historyService } from './tob_consents_history.service';
import { Prisma } from '@prisma/client';
import { ApiOkResponse, ApiTags,ApiOperation,ApiBody,ApiHeader,ApiQuery,ApiParam } from '@nestjs/swagger';
import { tob_consents_historyEntity } from './entity/tob_consents_history.entity';
import { Createtob_consents_historyDto } from './dto/Createtob_consents_history.dto';
import { Updatetob_consents_historyDto } from './dto/Updatetob_consents_history.dto';
import { Querytob_consents_historyDto } from './dto/Querytob_consents_history.dto';

 
@Controller('tob_consents_history')
@ApiTags('ERD API')
export class tob_consents_historyController {
  constructor(private readonly tob_consents_historyService: tob_consents_historyService) {}

  @Get("/schema")
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: tob_consents_historyEntity })
  @ApiOperation({
    summary: 'schema validation',
    description: 'Retrive the datatype of the tob_consents_history table',
  })
  findSchema(@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_consents_historyService.findSchema(token);
  }

  @Get('/get')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tob_consents_history"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: tob_consents_historyEntity, isArray: true })
  @ApiOperation({
    summary: 'Filter the records',
    description: 'Filter all the records from the tob_consents_history table',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to fetch' })
  findAllmethod(@Query() query: any,@Body() body: any,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    const { limit }:{ limit:number } = query;
    const { selectColumns}:{ selectColumns:any } = body;
    return this.tob_consents_historyService.findAllmethod(query, +limit, selectColumns, token);
  }

  @Get(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tob_consents_history"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: tob_consents_historyEntity })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tob_consents_history table',
  })
  findOne( @Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_consents_historyService.findOne(id,token);
  }
 
  @Post("/query")
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tob_consents_history"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiBody({ type: Querytob_consents_historyDto })
  @ApiOkResponse({ type: tob_consents_historyEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tob_consents_history table',
  })
  findAllwithquery(@Req() req: any,@Body() body: Prisma.tob_consents_historyWhereInput) {
    const token = req.headers?.authorization?.split(' ')[1];
    const whereClause = body
    return this.tob_consents_historyService.findAllwithquery(token,whereClause);
  }

  @Get()
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tob_consents_history"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: tob_consents_historyEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tob_consents_history table',
  })
  findAll(@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_consents_historyService.findAll(token);
  }

  @Post()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiBody({ type: Createtob_consents_historyDto })
  @ApiOkResponse({ type: tob_consents_historyEntity })
  @ApiOperation({
    summary: 'Create the record',
    description: 'Create the record for the tob_consents_history table',
  })
  create(@Body() createtob_consents_historyDto: Prisma.tob_consents_historyCreateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_consents_historyService.create(createtob_consents_historyDto,token);
  }
 
  @Patch(':id')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'id',type:String})
  @ApiBody({ type: Updatetob_consents_historyDto })
  @ApiOkResponse({ type: tob_consents_historyEntity })
  @ApiOperation({
    summary: 'Update the record',
    description: 'Update the record for the tob_consents_history table',
  })
  update(@Param('id') id: string,@Body() updatetob_consents_historyDto: Prisma.tob_consents_historyUpdateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
  return this.tob_consents_historyService.update(id, updatetob_consents_historyDto,token);
  }
 
  @Delete(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Delete', subject: "tob_consents_history"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: tob_consents_historyEntity })
  @ApiOperation({
    summary: 'Delete the record',
    description: 'Delete the record for the tob_consents_history table',
  })
  remove(@Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_consents_historyService.remove(id,token);
  }  
 
}