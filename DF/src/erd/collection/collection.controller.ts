
import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Query,Req,NotFoundException} from '@nestjs/common';
import { collectionService } from './collection.service';
import { Prisma } from '@prisma/client';
import { ApiOkResponse, ApiTags,ApiOperation,ApiBody,
  ApiHeader,ApiQuery,ApiParam,
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
  ApiGatewayTimeoutResponse 
} from '@nestjs/swagger';
import { collectionEntity } from './entity/collection.entity';
import { CreatecollectionDto } from './dto/Createcollection.dto';
import { UpdatecollectionDto } from './dto/Updatecollection.dto';
import { QuerycollectionDto } from './dto/Querycollection.dto';

 
@Controller('collection')
@ApiTags('ERD API')
export class collectionController {
  constructor(private readonly collectionService: collectionService) {}

  @Get("/schema")
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: collectionEntity })
  @ApiOperation({
    summary: 'schema validation',
    description: 'Retrive the datatype of the collection table',
  })
  findSchema(@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.collectionService.findSchema(token);
  }

  @Get('/get')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "collection"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: collectionEntity, isArray: true })
  @ApiOperation({
    summary: 'Filter the records',
    description: 'Filter all the records from the collection table',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to fetch' })
  findAllmethod(@Query() query: any,@Body() body: any,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    const { limit }:{ limit:number } = query;
    const { selectColumns}:{ selectColumns:any } = body;
    return this.collectionService.findAllmethod(query, +limit, selectColumns, token);
  }

  @Get(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "collection"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: collectionEntity })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the collection table',
  })
  
  findOne( @Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.collectionService.findOne(id,token);
  }
 
  @Post("/query")
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "collection"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiBody({ type: QuerycollectionDto })
  @ApiOkResponse({ type: collectionEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the collection table',
  })
  findAllwithquery(@Req() req: any,@Body() body: Prisma.collectionWhereInput) {
    const token = req.headers?.authorization?.split(' ')[1];
    const whereClause = body
    return this.collectionService.findAllwithquery(token,whereClause);
  }

  @Get()
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "collection"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: collectionEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the collection table',
  })
  
  findAll(@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.collectionService.findAll(token);
  }

  @Post()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiBody({ type: CreatecollectionDto })
  @ApiOkResponse({ type: collectionEntity })
  @ApiOperation({
    summary: 'Create the record',
    description: 'Create the record for the collection table',
  })
  
  create(@Body() createcollectionDto: Prisma.collectionCreateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.collectionService.create(createcollectionDto,token);
  }
 
  @Patch(':id')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'id',type:String})
  @ApiBody({ type: UpdatecollectionDto })
  @ApiOkResponse({ type: collectionEntity })
  @ApiOperation({
    summary: 'Update the record',
    description: 'Update the record for the collection table',
  })
  
  update(@Param('id') id: string,@Body() updatecollectionDto: Prisma.collectionUpdateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
  return this.collectionService.update(id, updatecollectionDto,token);
  }
 
  @Delete(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Delete', subject: "collection"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: collectionEntity })
  @ApiOperation({
    summary: 'Delete the record',
    description: 'Delete the record for the collection table',
  })
  
  remove(@Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.collectionService.remove(id,token);
  }  
   @Get('/find/first')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: collectionEntity })
  @ApiOperation({
    summary: 'Fetch the first record',
    description: 'Read first record from the collection table',
  })
  
  findFirst(@Param() params: any, @Req() req: any) {
      const token = req.headers?.authorization?.split(' ')[1];
      const result = this.collectionService.findFirst(token);
      return result;
    }

  @Get('/find/last')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: collectionEntity })
  @ApiOperation({
    summary: 'Fetch the last record',
    description: 'Read last record from the collection table',
  })
  
  findLast(@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    const result = this.collectionService.findLast(token);
    return result;
  }
}