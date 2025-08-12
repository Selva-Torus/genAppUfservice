import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Query,Req,NotFoundException} from '@nestjs/common';
import { accountsService } from './accounts.service';
import { Prisma } from '@prisma/client';
import { ApiOkResponse, ApiTags,ApiOperation,ApiBody,ApiHeader,ApiQuery,ApiParam } from '@nestjs/swagger';
import { accountsEntity } from './entity/accounts.entity';
//import { CreateAccountsDto } from '../prisma/dto/create-accounts.dto';
//import { UpdateAccountsDto } from '../prisma/dto/update-accounts.dto';
import { CreateaccountsDto } from './dto/Createaccounts.dto';
import { UpdateaccountsDto } from './dto/Updateaccounts.dto';
import { plainToInstance } from 'class-transformer';


 
@Controller('accounts')
@ApiTags('ERD API')
export class accountsController {
  constructor(private readonly accountsService: accountsService) {}

  @Get("/schema")
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: accountsEntity })
  @ApiOperation({
    summary: 'schema validation',
    description: 'Retrive the datatype of the accounts table',
  })
  findSchema(@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    return this.accountsService.findSchema(token);
  }

  @Get('/get')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: accountsEntity, isArray: true })
  @ApiOperation({
    summary: 'Filter the records',
    description: 'Filter all the records from the accounts table',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to fetch' })
  findAllmethod(@Query() query: any,@Body() body: any,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    const { limit }:{ limit:number } = query;
    const { selectColumns}:{ selectColumns:any } = body;
    return this.accountsService.findAllmethod(query, +limit,selectColumns,token);
  }

  @Get(':account_id')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'account_id',type:Number})
  @ApiOkResponse({ type: accountsEntity })
  @ApiOperation({
    summary: 'Fetch the only one record',
    description: 'Read only one records from the accounts table',
  })
findOne(@Param('account_id') account_id:number,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    const result = this.accountsService.findOne(+account_id,token);
    return plainToInstance(accountsEntity, result);
  }
 
  @Get()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOkResponse({ type: accountsEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the accounts table',
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
    const result = this.accountsService.findAll(token,);
    return plainToInstance(accountsEntity, result);
  } 

  @Post()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiBody({ type: CreateaccountsDto })
  @ApiOkResponse({ type: accountsEntity })
  @ApiOperation({
    summary: 'Create the record',
    description: 'Create the record for the accounts table',
  })
  create(@Body() createaccountsDto: Prisma.accountsCreateInput,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    const result = this.accountsService.create(createaccountsDto,token);
    return plainToInstance(accountsEntity, result);
  }
 
  @Patch(':account_id')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'account_id',type:Number})
  @ApiBody({ type: UpdateaccountsDto })
  @ApiOkResponse({ type: accountsEntity })
  @ApiOperation({
    summary: 'Update the record',
    description: 'Update the record for the accounts table',
  })
  update(@Param('account_id') account_id:number,
    @Body() updateaccountsDto: Prisma.accountsUpdateInput,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    const result = this.accountsService.update(+account_id,updateaccountsDto,token);
    return plainToInstance(accountsEntity, result);
  }
 
  @Delete(':account_id')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({name: 'account_id',type:Number})
  @ApiOkResponse({ type: accountsEntity })
  @ApiOperation({
    summary: 'Delete the record',
    description: 'Delete the record for the accounts table',
  })
  remove(@Param('account_id') account_id:number,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    const result =  this.accountsService.remove(+account_id,token);
    return plainToInstance(accountsEntity, result);
  }  
 
}