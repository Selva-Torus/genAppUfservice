import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Query,Req,NotFoundException} from '@nestjs/common';
import { tob_consentsService } from './tob_consents.service';
import { Prisma } from '@prisma/client';
import { ApiOkResponse, ApiTags,ApiOperation,ApiBody,ApiHeader,ApiQuery,ApiParam } from '@nestjs/swagger';
import { tob_consentsEntity } from './entity/tob_consents.entity';
import { Createtob_consentsDto } from './dto/Createtob_consents.dto';
import { Updatetob_consentsDto } from './dto/Updatetob_consents.dto';
import { Querytob_consentsDto } from './dto/Querytob_consents.dto';

 
@Controller('tob_consents')
@ApiTags('ERD API')
export class tob_consentsController {
  constructor(private readonly tob_consentsService: tob_consentsService) {}

  @Get("/schema")
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: tob_consentsEntity })
  @ApiOperation({
    summary: 'schema validation',
    description: 'Retrive the datatype of the tob_consents table',
  })
  findSchema(@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_consentsService.findSchema(token);
  }

  @Get('/get')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tob_consents"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: tob_consentsEntity, isArray: true })
  @ApiOperation({
    summary: 'Filter the records',
    description: 'Filter all the records from the tob_consents table',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to fetch' })
  findAllmethod(@Query() query: any,@Body() body: any,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    const { limit }:{ limit:number } = query;
    const { selectColumns}:{ selectColumns:any } = body;
    return this.tob_consentsService.findAllmethod(query, +limit, selectColumns, token);
  }

  @Get(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tob_consents"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: tob_consentsEntity })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tob_consents table',
  })
  findOne( @Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_consentsService.findOne(id,token);
  }
 
  @Post("/query")
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tob_consents"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiBody({ type: Querytob_consentsDto })
  @ApiOkResponse({ type: tob_consentsEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tob_consents table',
  })
  findAllwithquery(@Req() req: any,@Body() body: Prisma.tob_consentsWhereInput) {
    const token = req.headers?.authorization?.split(' ')[1];
    const whereClause = body
    return this.tob_consentsService.findAllwithquery(token,whereClause);
  }

  @Get()
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tob_consents"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: tob_consentsEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tob_consents table',
  })
  findAll(@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_consentsService.findAll(token);
  }

  @Post()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiBody({ type: Createtob_consentsDto })
  @ApiOkResponse({ type: tob_consentsEntity })
  @ApiOperation({
    summary: 'Create the record',
    description: 'Create the record for the tob_consents table',
  })
  create(@Body() createtob_consentsDto: Prisma.tob_consentsCreateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_consentsService.create(createtob_consentsDto,token);
  }
 
  @Patch(':id')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'id',type:String})
  @ApiBody({ type: Updatetob_consentsDto })
  @ApiOkResponse({ type: tob_consentsEntity })
  @ApiOperation({
    summary: 'Update the record',
    description: 'Update the record for the tob_consents table',
  })
  update(@Param('id') id: string,@Body() updatetob_consentsDto: Prisma.tob_consentsUpdateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
  return this.tob_consentsService.update(id, updatetob_consentsDto,token);
  }
 
  @Delete(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Delete', subject: "tob_consents"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: tob_consentsEntity })
  @ApiOperation({
    summary: 'Delete the record',
    description: 'Delete the record for the tob_consents table',
  })
  remove(@Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_consentsService.remove(id,token);
  }  
 
}