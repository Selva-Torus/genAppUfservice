import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Query,Req,NotFoundException} from '@nestjs/common';
import { transactionsService } from './transactions.service';
import { Prisma } from '@prisma/client';
import { ApiOkResponse, ApiTags,ApiOperation,ApiBody,ApiHeader,ApiQuery,ApiParam } from '@nestjs/swagger';
import { transactionsEntity } from './entity/transactions.entity';
//import { CreateTransactionsDto } from '../prisma/dto/create-transactions.dto';
//import { UpdateTransactionsDto } from '../prisma/dto/update-transactions.dto';
import { CreatetransactionsDto } from './dto/Createtransactions.dto';
import { UpdatetransactionsDto } from './dto/Updatetransactions.dto';
import { plainToInstance } from 'class-transformer';


 
@Controller('transactions')
@ApiTags('ERD API')
export class transactionsController {
  constructor(private readonly transactionsService: transactionsService) {}

  @Get("/schema")
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: transactionsEntity })
  @ApiOperation({
    summary: 'schema validation',
    description: 'Retrive the datatype of the transactions table',
  })
  findSchema(@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.transactionsService.findSchema(token);
  }

  @Get('/get')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: transactionsEntity, isArray: true })
  @ApiOperation({
    summary: 'Filter the records',
    description: 'Filter all the records from the transactions table',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to fetch' })
  findAllmethod(@Query() query: any,@Body() body: any,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    const { limit }:{ limit:number } = query;
    const { selectColumns}:{ selectColumns:any } = body;
    return this.transactionsService.findAllmethod(query, +limit,selectColumns,token);
  }

  @Get(':transaction_id')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'transaction_id',type:Number})
  @ApiOkResponse({ type: transactionsEntity })
  @ApiOperation({
    summary: 'Fetch the only one record',
    description: 'Read only one records from the transactions table',
  })
findOne(@Param('transaction_id') transaction_id:number,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    const result = this.transactionsService.findOne(+transaction_id,token);
    return plainToInstance(transactionsEntity, result);
  }
 
  @Get()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: transactionsEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the transactions table',
  })
  findAll(@Req() req: any,@Query() query?: Record<string, any>) {
    const token = req.headers?.authorization?.split(' ')[1];
    let presentQueryKeys:any=[
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
    const result = this.transactionsService.findAll(token,);
    return plainToInstance(transactionsEntity, result);
  } 

  @Post()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiBody({ type: CreatetransactionsDto })
  @ApiOkResponse({ type: transactionsEntity })
  @ApiOperation({
    summary: 'Create the record',
    description: 'Create the record for the transactions table',
  })
  create(@Body() createtransactionsDto: Prisma.transactionsCreateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    const result = this.transactionsService.create(createtransactionsDto,token);
    return plainToInstance(transactionsEntity, result);
  }
 
  @Patch(':transaction_id')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'transaction_id',type:Number})
  @ApiBody({ type: UpdatetransactionsDto })
  @ApiOkResponse({ type: transactionsEntity })
  @ApiOperation({
    summary: 'Update the record',
    description: 'Update the record for the transactions table',
  })
  update(@Param('transaction_id') transaction_id:number,
    @Body() updatetransactionsDto: Prisma.transactionsUpdateInput,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    const result = this.transactionsService.update(+transaction_id,updatetransactionsDto,token);
    return plainToInstance(transactionsEntity, result);
  }
 
  @Delete(':transaction_id')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'transaction_id',type:Number})
  @ApiOkResponse({ type: transactionsEntity })
  @ApiOperation({
    summary: 'Delete the record',
    description: 'Delete the record for the transactions table',
  })
  remove(@Param('transaction_id') transaction_id:number,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    const result =  this.transactionsService.remove(+transaction_id,token);
    return plainToInstance(transactionsEntity, result);
  }  
 
}