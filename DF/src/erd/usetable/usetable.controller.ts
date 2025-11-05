
import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Query,Req,NotFoundException,Headers} from '@nestjs/common';
import { usetableService } from './usetable.service';
import { ApiOkResponse, ApiTags,ApiOperation,ApiBody,
  ApiQuery,ApiParam,
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
  ApiGatewayTimeoutResponse,
  ApiBearerAuth
} from '@nestjs/swagger';
import { usetableEntity } from './entity/usetable.entity';
import { CreateusetableDto } from './dto/Createusetable.dto';
import { UpdateusetableDto } from './dto/Updateusetable.dto';
import { plainToInstance } from 'class-transformer';
import { UfService } from 'src/Torus/v8/uf/uf.service';

 
@Controller('usetable')
@ApiTags('ERD API')
export class usetableController {
  constructor(
    private readonly usetableService: usetableService,
    private readonly ufservice: UfService
  ) {}

  @Get("/schema")
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: usetableEntity })
  @ApiOperation({
    summary: 'schema validation',
    description: 'Retrive the datatype of the usetable table',
  })
  async findSchema(@Headers() authHeader: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.usetableService.findSchema(token);
  }

  @Get('/get')
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: usetableEntity, isArray: true })
  @ApiOperation({
    summary: 'Filter the records',
    description: 'Filter all the records from the usetable table',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to fetch' })
  async findAllmethod(@Headers() authHeader: string,@Query() query: any,@Body() body: any,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const { limit }:{ limit:number } = query;
    const { selectColumns}:{ selectColumns:any } = body;
    return this.usetableService.findAllmethod(query, +limit,selectColumns,token);
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:Number})
  @ApiOkResponse({ type: usetableEntity })
  @ApiOperation({
    summary: 'Fetch the only one record',
    description: 'Read only one records from the usetable table',
  })
  
  async findOne(@Headers() authHeader: string,@Param('id') id:number,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.usetableService.findOne(+id,token);
    return plainToInstance(usetableEntity, result);
  }
 
  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: usetableEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the usetable table',
  })
  
  async findAll(@Headers() authHeader: string,@Req() req: any,@Query() query?: Record<string, any>) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
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
    const result = this.usetableService.findAll(token,);
    return plainToInstance(usetableEntity, result);
  } 

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: CreateusetableDto })
  @ApiOkResponse({ type: usetableEntity })
  @ApiOperation({
    summary: 'Create the record',
    description: 'Create the record for the usetable table',
  })
  
  async create(@Headers() authHeader: string,@Body() createusetableDto: CreateusetableDto,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.usetableService.create(createusetableDto,token);
    return plainToInstance(usetableEntity, result);
  }
 
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:Number})
  @ApiBody({ type: UpdateusetableDto })
  @ApiOkResponse({ type: usetableEntity })
  @ApiOperation({
    summary: 'Update the record',
    description: 'Update the record for the usetable table',
  })
    
  async update(@Headers() authHeader: string,@Param('id') id:number,
    @Body() updateusetableDto: UpdateusetableDto,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.usetableService.update(+id,updateusetableDto,token);
    return plainToInstance(usetableEntity, result);
  }
 
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:Number})
  @ApiOkResponse({ type: usetableEntity })
  @ApiOperation({
    summary: 'Delete the record',
    description: 'Delete the record for the usetable table',
  })
  
  async remove(@Headers() authHeader: string,@Param('id') id:number,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result =  this.usetableService.remove(+id,token);
    return plainToInstance(usetableEntity, result);
  }  
 
  @Get('/find/first')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: usetableEntity })
  @ApiOperation({
    summary: 'Fetch the first record',
    description: 'Read first record from the usetable table',
  })
  
  async findFirst(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.usetableService.findFirst(token);
    return plainToInstance(usetableEntity, result);
  }

  @Get('/find/last')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: usetableEntity })
  @ApiOperation({
    summary: 'Fetch the last record',
    description: 'Read last record from the usetable table',
  })
  
  async findLast(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.usetableService.findLast(token);
    return plainToInstance(usetableEntity, result);
  }
}