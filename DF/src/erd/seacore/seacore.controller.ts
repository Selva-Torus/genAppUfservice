import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Query,Req,NotFoundException} from '@nestjs/common';
import { seacoreService } from './seacore.service';
import { Prisma } from '@prisma/client';
import { ApiOkResponse, ApiTags,ApiOperation,ApiBody,ApiHeader,ApiQuery,ApiParam } from '@nestjs/swagger';
import { seacoreEntity } from './entity/seacore.entity';
//import { CreateSeacoreDto } from '../prisma/dto/create-seacore.dto';
//import { UpdateSeacoreDto } from '../prisma/dto/update-seacore.dto';
import { CreateseacoreDto } from './dto/Createseacore.dto';
import { UpdateseacoreDto } from './dto/Updateseacore.dto';
import { plainToInstance } from 'class-transformer';


 
@Controller('seacore')
@ApiTags('ERD API')
export class seacoreController {
  constructor(private readonly seacoreService: seacoreService) {}

  @Get("/schema")
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: seacoreEntity })
  @ApiOperation({
    summary: 'schema validation',
    description: 'Retrive the datatype of the seacore table',
  })
  findSchema(@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.seacoreService.findSchema(token);
  }

  @Get('/get')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: seacoreEntity, isArray: true })
  @ApiOperation({
    summary: 'Filter the records',
    description: 'Filter all the records from the seacore table',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to fetch' })
  findAllmethod(@Query() query: any,@Body() body: any,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    const { limit }:{ limit:number } = query;
    const { selectColumns}:{ selectColumns:any } = body;
    return this.seacoreService.findAllmethod(query, +limit,selectColumns,token);
  }

  @Get(':clientid')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'clientid',type:Number})
  @ApiOkResponse({ type: seacoreEntity })
  @ApiOperation({
    summary: 'Fetch the only one record',
    description: 'Read only one records from the seacore table',
  })
findOne(@Param('clientid') clientid:number,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    const result = this.seacoreService.findOne(+clientid,token);
    return plainToInstance(seacoreEntity, result);
  }
 
  @Get()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiQuery({ name: 'clientid', required: false, type: Number})
  @ApiOkResponse({ type: seacoreEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the seacore table',
  })
  findAll(@Req() req: any,@Query('clientid') clientid?:string,@Query() query?: Record<string, any>) {
    const token = req.headers?.authorization?.split(' ')[1];
    let presentQueryKeys:any=[
       'clientid',
    ]
    let comingQueryKeys:any=Object.keys(query)||[]
    let isComingQuerysAreValid=true;
    if(comingQueryKeys.length==0)
      {
        isComingQuerysAreValid = true;
      }
  
      // If arrays have different lengths, they cannot be equal
      if (comingQueryKeys.length > presentQueryKeys.length) {
        isComingQuerysAreValid= false;
      }
      // Compare each element after sorting
      for (let i = 0; i < comingQueryKeys.length; i++) {
        if (!presentQueryKeys.includes(comingQueryKeys[i])) {
          isComingQuerysAreValid=false;
        }
      }
    if (req.originalUrl.includes('?') && req.originalUrl.split('?')[1].includes('/') || isComingQuerysAreValid==false) {
      throw new NotFoundException('Invalid query parameter structure.');
    }
    const result = this.seacoreService.findAll(token,+clientid);
    return plainToInstance(seacoreEntity, result);
  } 

  @Post()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiBody({ type: CreateseacoreDto })
  @ApiOkResponse({ type: seacoreEntity })
  @ApiOperation({
    summary: 'Create the record',
    description: 'Create the record for the seacore table',
  })
  create(@Body() createseacoreDto: Prisma.seacoreCreateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    const result = this.seacoreService.create(createseacoreDto,token);
    return plainToInstance(seacoreEntity, result);
  }
 
  @Patch(':clientid')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'clientid',type:Number})
  @ApiBody({ type: UpdateseacoreDto })
  @ApiOkResponse({ type: seacoreEntity })
  @ApiOperation({
    summary: 'Update the record',
    description: 'Update the record for the seacore table',
  })
  update(@Param('clientid') clientid:number,
    @Body() updateseacoreDto: Prisma.seacoreUpdateInput,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    const result = this.seacoreService.update(+clientid,updateseacoreDto,token);
    return plainToInstance(seacoreEntity, result);
  }
 
  @Delete(':clientid')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'clientid',type:Number})
  @ApiOkResponse({ type: seacoreEntity })
  @ApiOperation({
    summary: 'Delete the record',
    description: 'Delete the record for the seacore table',
  })
  remove(@Param('clientid') clientid:number,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    const result =  this.seacoreService.remove(+clientid,token);
    return plainToInstance(seacoreEntity, result);
  }  
 
}