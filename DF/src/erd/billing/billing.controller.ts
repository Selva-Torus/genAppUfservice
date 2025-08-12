import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Query,Req,NotFoundException} from '@nestjs/common';
import { billingService } from './billing.service';
import { Prisma } from '@prisma/client';
import { ApiOkResponse, ApiTags,ApiOperation,ApiBody,ApiHeader,ApiQuery,ApiParam } from '@nestjs/swagger';
import { billingEntity } from './entity/billing.entity';
//import { CreateBillingDto } from '../prisma/dto/create-billing.dto';
//import { UpdateBillingDto } from '../prisma/dto/update-billing.dto';
import { CreatebillingDto } from './dto/Createbilling.dto';
import { UpdatebillingDto } from './dto/Updatebilling.dto';
import { plainToInstance } from 'class-transformer';


 
@Controller('billing')
@ApiTags('ERD API')
export class billingController {
  constructor(private readonly billingService: billingService) {}

  @Get("/schema")
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: billingEntity })
  @ApiOperation({
    summary: 'schema validation',
    description: 'Retrive the datatype of the billing table',
  })
  findSchema(@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.billingService.findSchema(token);
  }

  @Get('/get')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: billingEntity, isArray: true })
  @ApiOperation({
    summary: 'Filter the records',
    description: 'Filter all the records from the billing table',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to fetch' })
  findAllmethod(@Query() query: any,@Body() body: any,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    const { limit }:{ limit:number } = query;
    const { selectColumns}:{ selectColumns:any } = body;
    return this.billingService.findAllmethod(query, +limit,selectColumns,token);
  }

  @Get(':billingid')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'billingid',type:Number})
  @ApiOkResponse({ type: billingEntity })
  @ApiOperation({
    summary: 'Fetch the only one record',
    description: 'Read only one records from the billing table',
  })
findOne(@Param('billingid') billingid:number,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    const result = this.billingService.findOne(+billingid,token);
    return plainToInstance(billingEntity, result);
  }
 
  @Get()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiQuery({ name: 'billingid', required: false, type: Number})
  @ApiOkResponse({ type: billingEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the billing table',
  })
  findAll(@Req() req: any,@Query('billingid') billingid?:string,@Query() query?: Record<string, any>) {
    const token = req.headers?.authorization?.split(' ')[1];
    let presentQueryKeys:any=[
       'billingid',
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
    const result = this.billingService.findAll(token,+billingid);
    return plainToInstance(billingEntity, result);
  } 

  @Post()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiBody({ type: CreatebillingDto })
  @ApiOkResponse({ type: billingEntity })
  @ApiOperation({
    summary: 'Create the record',
    description: 'Create the record for the billing table',
  })
  create(@Body() createbillingDto: Prisma.billingCreateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    const result = this.billingService.create(createbillingDto,token);
    return plainToInstance(billingEntity, result);
  }
 
  @Patch(':billingid')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'billingid',type:Number})
  @ApiBody({ type: UpdatebillingDto })
  @ApiOkResponse({ type: billingEntity })
  @ApiOperation({
    summary: 'Update the record',
    description: 'Update the record for the billing table',
  })
  update(@Param('billingid') billingid:number,
    @Body() updatebillingDto: Prisma.billingUpdateInput,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    const result = this.billingService.update(+billingid,updatebillingDto,token);
    return plainToInstance(billingEntity, result);
  }
 
  @Delete(':billingid')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'billingid',type:Number})
  @ApiOkResponse({ type: billingEntity })
  @ApiOperation({
    summary: 'Delete the record',
    description: 'Delete the record for the billing table',
  })
  remove(@Param('billingid') billingid:number,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    const result =  this.billingService.remove(+billingid,token);
    return plainToInstance(billingEntity, result);
  }  
 
}