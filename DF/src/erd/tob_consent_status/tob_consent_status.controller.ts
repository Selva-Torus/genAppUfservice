import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Query,Req,NotFoundException} from '@nestjs/common';
import { tob_consent_statusService } from './tob_consent_status.service';
import { Prisma } from '@prisma/client';
import { ApiOkResponse, ApiTags,ApiOperation,ApiBody,ApiHeader,ApiQuery,ApiParam } from '@nestjs/swagger';
import { tob_consent_statusEntity } from './entity/tob_consent_status.entity';
import { Createtob_consent_statusDto } from './dto/Createtob_consent_status.dto';
import { Updatetob_consent_statusDto } from './dto/Updatetob_consent_status.dto';
import { Querytob_consent_statusDto } from './dto/Querytob_consent_status.dto';

 
@Controller('tob_consent_status')
@ApiTags('ERD API')
export class tob_consent_statusController {
  constructor(private readonly tob_consent_statusService: tob_consent_statusService) {}

  @Get("/schema")
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: tob_consent_statusEntity })
  @ApiOperation({
    summary: 'schema validation',
    description: 'Retrive the datatype of the tob_consent_status table',
  })
  findSchema(@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_consent_statusService.findSchema(token);
  }

  @Get('/get')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tob_consent_status"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: tob_consent_statusEntity, isArray: true })
  @ApiOperation({
    summary: 'Filter the records',
    description: 'Filter all the records from the tob_consent_status table',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to fetch' })
  findAllmethod(@Query() query: any,@Body() body: any,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    const { limit }:{ limit:number } = query;
    const { selectColumns}:{ selectColumns:any } = body;
    return this.tob_consent_statusService.findAllmethod(query, +limit, selectColumns, token);
  }

  @Get(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tob_consent_status"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: tob_consent_statusEntity })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tob_consent_status table',
  })
  findOne( @Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_consent_statusService.findOne(id,token);
  }
 
  @Post("/query")
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tob_consent_status"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiBody({ type: Querytob_consent_statusDto })
  @ApiOkResponse({ type: tob_consent_statusEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tob_consent_status table',
  })
  findAllwithquery(@Req() req: any,@Body() body: Prisma.tob_consent_statusWhereInput) {
    const token = req.headers?.authorization?.split(' ')[1];
    const whereClause = body
    return this.tob_consent_statusService.findAllwithquery(token,whereClause);
  }

  @Get()
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tob_consent_status"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: tob_consent_statusEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tob_consent_status table',
  })
  findAll(@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_consent_statusService.findAll(token);
  }

  @Post()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiBody({ type: Createtob_consent_statusDto })
  @ApiOkResponse({ type: tob_consent_statusEntity })
  @ApiOperation({
    summary: 'Create the record',
    description: 'Create the record for the tob_consent_status table',
  })
  create(@Body() createtob_consent_statusDto: Prisma.tob_consent_statusCreateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_consent_statusService.create(createtob_consent_statusDto,token);
  }
 
  @Patch(':id')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'id',type:String})
  @ApiBody({ type: Updatetob_consent_statusDto })
  @ApiOkResponse({ type: tob_consent_statusEntity })
  @ApiOperation({
    summary: 'Update the record',
    description: 'Update the record for the tob_consent_status table',
  })
  update(@Param('id') id: string,@Body() updatetob_consent_statusDto: Prisma.tob_consent_statusUpdateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
  return this.tob_consent_statusService.update(id, updatetob_consent_statusDto,token);
  }
 
  @Delete(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Delete', subject: "tob_consent_status"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: tob_consent_statusEntity })
  @ApiOperation({
    summary: 'Delete the record',
    description: 'Delete the record for the tob_consent_status table',
  })
  remove(@Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_consent_statusService.remove(id,token);
  }  
 
}