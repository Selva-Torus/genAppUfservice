
import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Query,Req,NotFoundException,Headers} from '@nestjs/common';
import { mytableService } from './mytable.service';
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
import { mytableEntity } from './entity/mytable.entity';
import { CreatemytableDto } from './dto/Createmytable.dto';
import { UpdatemytableDto } from './dto/Updatemytable.dto';
import { plainToInstance } from 'class-transformer';
import { UfService } from 'src/Torus/v2/uf/uf.service';

 
@Controller('mytable')
@ApiTags('ERD API')
export class mytableController {
  constructor(
    private readonly mytableService: mytableService,
    private readonly ufservice: UfService
  ) {}

  @Get("/schema")
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: mytableEntity })
  @ApiOperation({
    summary: 'schema validation',
    description: 'Retrive the datatype of the mytable table',
  })
  async findSchema(@Headers() authHeader: string,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    return this.mytableService.findSchema(token);
  }

  @Get('/get')
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: mytableEntity, isArray: true })
  @ApiOperation({
    summary: 'Filter the records',
    description: 'Filter all the records from the mytable table',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to fetch' })
  async findAllmethod(@Headers() authHeader: string,@Query() query: any,@Body() body: any,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const { limit }:{ limit:number } = query;
    const { selectColumns}:{ selectColumns:any } = body;
    return this.mytableService.findAllmethod(query, +limit,selectColumns,token);
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:Number})
  @ApiOkResponse({ type: mytableEntity })
  @ApiOperation({
    summary: 'Fetch the only one record',
    description: 'Read only one records from the mytable table',
  })
  
  async findOne(@Headers() authHeader: string,@Param('id') id:number,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.mytableService.findOne(+id,token);
    return plainToInstance(mytableEntity, result);
  }
 
  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: mytableEntity, isArray: true })
  @ApiOperation({
    summary: 'Read all the records',
    description: 'Read all the records from the mytable table',
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
    const result = this.mytableService.findAll(token,);
    return plainToInstance(mytableEntity, result);
  } 

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: CreatemytableDto })
  @ApiOkResponse({ type: mytableEntity })
  @ApiOperation({
    summary: 'Create the record',
    description: 'Create the record for the mytable table',
  })
  
  async create(@Headers() authHeader: string,@Body() createmytableDto: CreatemytableDto,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.mytableService.create(createmytableDto,token);
    return plainToInstance(mytableEntity, result);
  }
 
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:Number})
  @ApiBody({ type: UpdatemytableDto })
  @ApiOkResponse({ type: mytableEntity })
  @ApiOperation({
    summary: 'Update the record',
    description: 'Update the record for the mytable table',
  })
    
  async update(@Headers() authHeader: string,@Param('id') id:number,
    @Body() updatemytableDto: UpdatemytableDto,
    @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.mytableService.update(+id,updatemytableDto,token);
    return plainToInstance(mytableEntity, result);
  }
 
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'id',type:Number})
  @ApiOkResponse({ type: mytableEntity })
  @ApiOperation({
    summary: 'Delete the record',
    description: 'Delete the record for the mytable table',
  })
  
  async remove(@Headers() authHeader: string,@Param('id') id:number,@Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result =  this.mytableService.remove(+id,token);
    return plainToInstance(mytableEntity, result);
  }  
 
  @Get('/find/first')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: mytableEntity })
  @ApiOperation({
    summary: 'Fetch the first record',
    description: 'Read first record from the mytable table',
  })
  
  async findFirst(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.mytableService.findFirst(token);
    return plainToInstance(mytableEntity, result);
  }

  @Get('/find/last')
  @ApiBearerAuth('JWT-auth')
  //@ApiParam({name: ''})
  @ApiOkResponse({ type: mytableEntity })
  @ApiOperation({
    summary: 'Fetch the last record',
    description: 'Read last record from the mytable table',
  })
  
  async findLast(@Headers() authHeader: string,@Param() params: any, @Req() req: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    //await this.ufservice.introspectToken(authHeader,"",token);
    const result = this.mytableService.findLast(token);
    return plainToInstance(mytableEntity, result);
  }
}