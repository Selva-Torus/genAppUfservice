import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Query,Req,NotFoundException} from '@nestjs/common';
import { tob_lfi_consentService } from './tob_lfi_consent.service';
import { Prisma } from '@prisma/client';
import { ApiOkResponse, ApiTags,ApiOperation,ApiBody,ApiHeader,ApiQuery,ApiParam } from '@nestjs/swagger';
import { tob_lfi_consentEntity } from './entity/tob_lfi_consent.entity';
import { Createtob_lfi_consentDto } from './dto/Createtob_lfi_consent.dto';
import { Updatetob_lfi_consentDto } from './dto/Updatetob_lfi_consent.dto';
import { Querytob_lfi_consentDto } from './dto/Querytob_lfi_consent.dto';

 
@Controller('tob_lfi_consent')
@ApiTags('ERD API')
export class tob_lfi_consentController {
  constructor(private readonly tob_lfi_consentService: tob_lfi_consentService) {}

  @Get("/schema")
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: tob_lfi_consentEntity })
  @ApiOperation({
    summary: 'schema validation',
    description: 'Retrive the datatype of the tob_lfi_consent table',
  })
  findSchema(@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_lfi_consentService.findSchema(token);
  }

  @Get('/get')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tob_lfi_consent"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: tob_lfi_consentEntity, isArray: true })
  @ApiOperation({
    summary: 'Filter the records',
    description: 'Filter all the records from the tob_lfi_consent table',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to fetch' })
  findAllmethod(@Query() query: any,@Body() body: any,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    const { limit }:{ limit:number } = query;
    const { selectColumns}:{ selectColumns:any } = body;
    return this.tob_lfi_consentService.findAllmethod(query, +limit, selectColumns, token);
  }

  @Get(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tob_lfi_consent"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: tob_lfi_consentEntity })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tob_lfi_consent table',
  })
  findOne( @Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_lfi_consentService.findOne(id,token);
  }
 
  @Post("/query")
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tob_lfi_consent"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiBody({ type: Querytob_lfi_consentDto })
  @ApiOkResponse({ type: tob_lfi_consentEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tob_lfi_consent table',
  })
  findAllwithquery(@Req() req: any,@Body() body: Prisma.tob_lfi_consentWhereInput) {
    const token = req.headers?.authorization?.split(' ')[1];
    const whereClause = body
    return this.tob_lfi_consentService.findAllwithquery(token,whereClause);
  }

  @Get()
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Get', subject: "tob_lfi_consent"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: tob_lfi_consentEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the tob_lfi_consent table',
  })
  findAll(@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_lfi_consentService.findAll(token);
  }

  @Post()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiBody({ type: Createtob_lfi_consentDto })
  @ApiOkResponse({ type: tob_lfi_consentEntity })
  @ApiOperation({
    summary: 'Create the record',
    description: 'Create the record for the tob_lfi_consent table',
  })
  create(@Body() createtob_lfi_consentDto: Prisma.tob_lfi_consentCreateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_lfi_consentService.create(createtob_lfi_consentDto,token);
  }
 
  @Patch(':id')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'id',type:String})
  @ApiBody({ type: Updatetob_lfi_consentDto })
  @ApiOkResponse({ type: tob_lfi_consentEntity })
  @ApiOperation({
    summary: 'Update the record',
    description: 'Update the record for the tob_lfi_consent table',
  })
  update(@Param('id') id: string,@Body() updatetob_lfi_consentDto: Prisma.tob_lfi_consentUpdateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
  return this.tob_lfi_consentService.update(id, updatetob_lfi_consentDto,token);
  }
 
  @Delete(':id')
  //@UseGuards(AbilitiesGuard)
  //@CheckAbilities({ action: 'Delete', subject: "tob_lfi_consent"})
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'id',type:String})
  @ApiOkResponse({ type: tob_lfi_consentEntity })
  @ApiOperation({
    summary: 'Delete the record',
    description: 'Delete the record for the tob_lfi_consent table',
  })
  remove(@Param('id') id: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.tob_lfi_consentService.remove(id,token);
  }  
 
}