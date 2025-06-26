import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Query,Req,NotFoundException} from '@nestjs/common';
import { tob_api_repositoryService } from './tob_api_repository.service';
import { Prisma } from '@prisma/client';
import { ApiOkResponse, ApiTags,ApiOperation,ApiBody,ApiHeader,ApiQuery,ApiParam } from '@nestjs/swagger';
import { tob_api_repositoryEntity } from './entity/tob_api_repository.entity';
import { Createtob_api_repositoryDto } from './dto/Createtob_api_repository.dto';
import { Updatetob_api_repositoryDto } from './dto/Updatetob_api_repository.dto';
import { Querytob_api_repositoryDto } from './dto/Querytob_api_repository.dto';

 
@Controller('tob_api_repository')
@ApiTags('ERD API')
export class tob_api_repositoryController {
  constructor(private readonly tob_api_repositoryService: tob_api_repositoryService) {}

  @Get("/schema")
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: tob_api_repositoryEntity })
  @ApiOperation({
    summary: 'schema validation',
    description: 'Retrive the datatype of the tob_api_repository table',
  })
  findSchema(@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_api_repositoryService.findSchema(token);
  }

  @Get('/get')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tob_api_repository"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: tob_api_repositoryEntity, isArray: true })
  @ApiOperation({
    summary: 'Filter the records',
    description: 'Filter all the records from the tob_api_repository table',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to fetch' })
  findAllmethod(@Query() query: any,@Body() body: any,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    const { limit }:{ limit:number } = query;
    const { selectColumns}:{ selectColumns:any } = body;
    return this.tob_api_repositoryService.findAllmethod(query, +limit, selectColumns, token);
  }

  @Get(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tob_api_repository"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: tob_api_repositoryEntity })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tob_api_repository table',
  })
  findOne( @Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_api_repositoryService.findOne(id,token);
  }
 
  @Post("/query")
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tob_api_repository"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiBody({ type: Querytob_api_repositoryDto })
  @ApiOkResponse({ type: tob_api_repositoryEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tob_api_repository table',
  })
  findAllwithquery(@Req() req: any,@Body() body: Prisma.tob_api_repositoryWhereInput) {
    const token = req.headers?.authorization?.split(' ')[1];
    const whereClause = body
    return this.tob_api_repositoryService.findAllwithquery(token,whereClause);
  }

  @Get()
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tob_api_repository"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: tob_api_repositoryEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tob_api_repository table',
  })
  findAll(@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_api_repositoryService.findAll(token);
  }

  @Post()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiBody({ type: Createtob_api_repositoryDto })
  @ApiOkResponse({ type: tob_api_repositoryEntity })
  @ApiOperation({
    summary: 'Create the record',
    description: 'Create the record for the tob_api_repository table',
  })
  create(@Body() createtob_api_repositoryDto: Prisma.tob_api_repositoryCreateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_api_repositoryService.create(createtob_api_repositoryDto,token);
  }
 
  @Patch(':id')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'id',type:String})
  @ApiBody({ type: Updatetob_api_repositoryDto })
  @ApiOkResponse({ type: tob_api_repositoryEntity })
  @ApiOperation({
    summary: 'Update the record',
    description: 'Update the record for the tob_api_repository table',
  })
  update(@Param('id') id: string,@Body() updatetob_api_repositoryDto: Prisma.tob_api_repositoryUpdateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
  return this.tob_api_repositoryService.update(id, updatetob_api_repositoryDto,token);
  }
 
  @Delete(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Delete', subject: "tob_api_repository"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: tob_api_repositoryEntity })
  @ApiOperation({
    summary: 'Delete the record',
    description: 'Delete the record for the tob_api_repository table',
  })
  remove(@Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_api_repositoryService.remove(id,token);
  }  
 
}