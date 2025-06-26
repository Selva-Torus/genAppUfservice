import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Query,Req,NotFoundException} from '@nestjs/common';
import { tob_consent_requestService } from './tob_consent_request.service';
import { Prisma } from '@prisma/client';
import { ApiOkResponse, ApiTags,ApiOperation,ApiBody,ApiHeader,ApiQuery,ApiParam } from '@nestjs/swagger';
import { tob_consent_requestEntity } from './entity/tob_consent_request.entity';
import { Createtob_consent_requestDto } from './dto/Createtob_consent_request.dto';
import { Updatetob_consent_requestDto } from './dto/Updatetob_consent_request.dto';
import { Querytob_consent_requestDto } from './dto/Querytob_consent_request.dto';

 
@Controller('tob_consent_request')
@ApiTags('ERD API')
export class tob_consent_requestController {
  constructor(private readonly tob_consent_requestService: tob_consent_requestService) {}

  @Get("/schema")
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: tob_consent_requestEntity })
  @ApiOperation({
    summary: 'schema validation',
    description: 'Retrive the datatype of the tob_consent_request table',
  })
  findSchema(@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_consent_requestService.findSchema(token);
  }

  @Get('/get')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tob_consent_request"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: tob_consent_requestEntity, isArray: true })
  @ApiOperation({
    summary: 'Filter the records',
    description: 'Filter all the records from the tob_consent_request table',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to fetch' })
  findAllmethod(@Query() query: any,@Body() body: any,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    const { limit }:{ limit:number } = query;
    const { selectColumns}:{ selectColumns:any } = body;
    return this.tob_consent_requestService.findAllmethod(query, +limit, selectColumns, token);
  }

  @Get(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tob_consent_request"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: tob_consent_requestEntity })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tob_consent_request table',
  })
  findOne( @Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_consent_requestService.findOne(id,token);
  }
 
  @Post("/query")
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tob_consent_request"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiBody({ type: Querytob_consent_requestDto })
  @ApiOkResponse({ type: tob_consent_requestEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tob_consent_request table',
  })
  findAllwithquery(@Req() req: any,@Body() body: Prisma.tob_consent_requestWhereInput) {
    const token = req.headers?.authorization?.split(' ')[1];
    const whereClause = body
    return this.tob_consent_requestService.findAllwithquery(token,whereClause);
  }

  @Get()
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tob_consent_request"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: tob_consent_requestEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tob_consent_request table',
  })
  findAll(@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_consent_requestService.findAll(token);
  }

  @Post()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiBody({ type: Createtob_consent_requestDto })
  @ApiOkResponse({ type: tob_consent_requestEntity })
  @ApiOperation({
    summary: 'Create the record',
    description: 'Create the record for the tob_consent_request table',
  })
  create(@Body() createtob_consent_requestDto: Prisma.tob_consent_requestCreateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_consent_requestService.create(createtob_consent_requestDto,token);
  }
 
  @Patch(':id')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'id',type:String})
  @ApiBody({ type: Updatetob_consent_requestDto })
  @ApiOkResponse({ type: tob_consent_requestEntity })
  @ApiOperation({
    summary: 'Update the record',
    description: 'Update the record for the tob_consent_request table',
  })
  update(@Param('id') id: string,@Body() updatetob_consent_requestDto: Prisma.tob_consent_requestUpdateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
  return this.tob_consent_requestService.update(id, updatetob_consent_requestDto,token);
  }
 
  @Delete(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Delete', subject: "tob_consent_request"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: tob_consent_requestEntity })
  @ApiOperation({
    summary: 'Delete the record',
    description: 'Delete the record for the tob_consent_request table',
  })
  remove(@Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_consent_requestService.remove(id,token);
  }  
 
}