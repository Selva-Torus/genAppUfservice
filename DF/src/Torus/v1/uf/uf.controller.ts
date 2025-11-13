import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseInterceptors,
  UploadedFile,
  ValidationPipe,
  HttpException,
  HttpStatus,
  Headers,
  Patch
} from '@nestjs/common';
import { UfService } from './uf.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  codeExecutionDto,
  codefilterDto,
  elementsFilterDto,
  fetchActionDetailsDto,
  fetchRuleDetailsDto,
  FILE_UPLOADS_DIR,
  fileNameEditor,
  getMapperDetailsDto,
  getPresignedUrlDto,
  ifoDto,
  imageFileFilter,
  InitiatePFDto,
  OrchestrationDto,
  pageDto,
  dataGet,
  paginationDataFilterDto,
  saveHandlerDto,
  securityDto,
  setUpKeyDto,
  signinToTorusDto,
  uploadFileDto,
  uploadFileMobileDto,
  logoutDto,
  uploadHandlerDto,
  myAccountForClientdto,
  introspectDto
} from 'src/dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Response } from 'express';
import { lookup } from 'mime-types';

@ApiTags('TG')
@Controller('UF')
export class UfController {
  constructor(private readonly appService: UfService) {}

  @Post('screenRoute')
  async screenRoute(@Body() keys: any,@Headers() header) {
    const token: string = header.authorization.split(' ')[1];
    const {dpdKey,method} = keys
    let result :any = await this.appService.screenRoute(keys.keys,token,header)
    if(dpdKey && method){
      result["dpdKey"] = dpdKey
      result["method"] = method
    }
    return result;
  }

  @Post('getAccessToken')
   @ApiOkResponse({
    description: 'Returns updated token with the orps structure',
    content: {
      'application/json': {
        schema: {
          type: 'string',
        },
      },
    },
  })
    @ApiBadRequestResponse({ description: 'Invalid Credentials' })
  async getAccessToken(@Body() body: any, @Req() req: any) {
    const token: string = req.headers.authorization?.split(' ')[1];
    const { selectedCombination , selectedAccessProfile , dap ,dpdKey,method, ufClientType } = body;
    
    if (!token) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    if (!selectedCombination) {
      throw new HttpException(
        'Product/service is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      let result : any = {};
      result["token"] = await this.appService.getAccessToken(token, selectedCombination , selectedAccessProfile , dap , ufClientType);
      if(dpdKey && method){
        result["dpdKey"] = dpdKey
        result["method"] = method
      }
      return result;
    } catch (err) {
      return err;
    }
  }

  @Get('getAccessTemplates')
   @ApiOkResponse({
    description: 'Returns all possible access template of the loggedin user',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  
  @ApiBadRequestResponse({ description: 'Invalid Credentials' })
  async getAccessTemplates(@Req() req: any, @Query() query ) {
    const {dpdKey,method} = query;
    const token: string = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    try {
      let reuslt : any = await this.appService.getAccessTemplate(token);
      if(dpdKey && method){
        reuslt["dpdKey"] = dpdKey
        reuslt["method"] = method
      }
      return reuslt;
    } catch (err) {
      return err;
    }
  }

  @Post('upload')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  // @UseInterceptors(FileInterceptor('file'))

  async uploadFile(@Req() req: FastifyRequest) {
      if (!req.isMultipart()) {
        throw new Error('Request is not multipart');
      }
      const parts = req.parts();
      const fields : any = {};
      let fileBuffer: Buffer;
      let fileMeta: any;

      for await (const part of parts) {
        if (part.type === 'file') {
          // This is a file part
          fileBuffer = await part.toBuffer();
          fileMeta = {
            filename: part.filename,
            mimetype: part.mimetype,
            size: fileBuffer.length,
          };
        } else {
          // This is a regular form field part
          fields[part.fieldname] = part.value;
        }
      }


    let { context,dpdKey,method,enableEncryption } = fields
    const file = {
          ...fileMeta,
          buffer: fileBuffer,
        }
    const result = await this.appService.uploadFile( 
      file,
      context,
      enableEncryption
    );
    let finalresult : any= {file:result}
    if(dpdKey && method){
      finalresult["dpdKey"] = dpdKey;
      finalresult["method"] = method
    }
    return finalresult;
  }

  @Post('downloadFile')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOperation({
    summary: 'Download file from MongoDb GridFSBucket',
    description: 'Download file from the stored MongoDb GridFSBucket on specified path',
  })
  async getFile(@Body() body: any,@Res() res: Response) {
    let { context , id ,enableEncryption } = body
    const file = await this.appService.getFile(id,context,enableEncryption);
    if (!file) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
    res
    .header('Content-Type', file.file?.contentType || 'application/octet-stream')
    .header('Content-Disposition', `inline; filename="${file.file?.filename}"`);

    return res.send(file.res);
  }

  @Post('setUpKey')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiBody({ type: setUpKeyDto })
  @ApiCreatedResponse({
    description: 'Returns a list of all payments made by users.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Retrieve setUpKey properties',
    description:
      'Retrieve properties for achieve branding,laguage,direction and forts',
  })
  @ApiBadRequestResponse({ description: 'Invalid request parameters' })
  @ApiOkResponse({
    description: 'Returns a list of all payments made by users.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async setUpKey(@Body() body: setUpKeyDto, @Req() req: any) {
    const token: string = req?.headers?.authorization?.split(' ')[1];
    const { key,dpdKey,method } = body;
    let result : any = await this.appService.setUpKey(key,token);
    if(dpdKey && method){
      result["dpdKey"] = dpdKey
      result["method"] = method
    }
    return result;
  }

  @Post('Orchestration')
  @ApiResponse({ status: 200, description: 'Common Details Fetched' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiBody({ type: OrchestrationDto })
  @ApiOperation({
    summary:
      'Retrive orchestration properties for a artifacts,components and controls',
    description:
      'Retrived action,code,rule,events,mapper,dstData,schemaData from the orchestration on level of artifacts,components and controls with the specified key',
  })
  @ApiBadRequestResponse({ description: 'Invalid request parameters' })
  @ApiCreatedResponse({
    description: 'Returns a list of all payments made by users.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Returns a list of all payments made by users.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async Orchestration(@Body() body: OrchestrationDto, @Req() req: any) {
    const token: string = req.headers.authorization.split(' ')[1];
    const { key, componentId, controlId, isTable, accessProfile,dpdKey,method } = body;
    let result = await this.appService.Orchestration(
      key,
      componentId,
      controlId,
      token,
      isTable,
      accessProfile,
    );
      if (dpdKey && method) {
        result['dpdKey'] = dpdKey;
        result['method'] = method;
      }
    return result;
  }

   @Post('sendMailOTP')
  @ApiBadRequestResponse({ description: 'Invalid Email' })
  async sendMailOTP(@Body() input: any, @Req() req: any) {
    const token: string = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED); 
    }

    const {email,dpdKey,method} = input;
  
    if (email) {
      try {
        let result : any = await this.appService.sendMailOTP(email);
        if(dpdKey && method){
          result["dpdKey"] = dpdKey
          result["method"] = method
        }
        return result;
      } catch (err) {
        return err;
      }
    } else {
      return 'Email is required';
    }
  } 

  // @Post('elementsFilter')
  // @ApiBody({ type: elementsFilterDto })
  // async elementsFilter(@Body() body: elementsFilterDto,@Req() req: any) {
  //  const token: string = req.headers.authorization.split(' ')[1];	
  //   const { key, group, control } = body;
  //   return await this.appService.elementsFilter(key, group, control,token);
  // }

  @Post('getMapperDetails')
  @ApiResponse({ status: 200, description: 'Get Mapper Details Completed' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  
  @ApiBody({ type: getMapperDetailsDto })
  @ApiOperation({
    summary: 'Retrive dropdown component values',
    description:
      'Retrived dropdown component values from the table with mapped orchestraion',
  })
  @ApiBadRequestResponse({ description: 'Invalid request parameters' })
  @ApiCreatedResponse({
    description: 'Returns a list of all payments made by users.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Returns a list of all payments made by users.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async getMapperDetails(@Body() body: getMapperDetailsDto,@Req() req: any) {
    const token: string = req.headers.authorization.split(' ')[1];	
    const { ufkey, componentId, controlId, category, bindtranValue, code ,dpdKey ,method } = body;
    let result : any = await this.appService.getMapperDetails(ufkey,componentId,controlId,category,bindtranValue,code,token);
    if(dpdKey && method){
      result["dpdKey"] = dpdKey
      result["method"] = method
    }
    return result;
  }

  // @Post('codeExecution')
  // @ApiBody({ type: codeExecutionDto })
  // async codeExecution(@Body() body: codeExecutionDto) {
  //   const { stringCode, params } = body;
  //   return await this.appService.codeExecution(stringCode, params);
  // }

   @Post('code')
   @ApiBody({ type: codefilterDto })
   @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  
   async codefilter(@Body() body: codefilterDto, @Req() req: any) {
    const token: string = req.headers.authorization.split(' ')[1];	
    const { key, groupId, controlId, event, dpdKey ,method } = body;
    let result : any = await this.appService.codefilter(key, groupId, controlId, event, token);
    if(dpdKey && method){
      result["dpdKey"] = dpdKey
      result["method"] = method
    }
    return result;
   }

  @Get('dfKey')
  @ApiResponse({ status: 200, description: 'Get DFKey Completed' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiQuery({ name: 'ufKey', example: 'TGA:ABKUF:BUILD:ABC:mvp:bank:v2' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  
  @ApiOperation({
    summary: 'Fetch the DFD key',
    description:
      'Fetch the DFD key for the specified ufKey and groupId with the mapped orchestration',
  })
  @ApiCreatedResponse({
    description: 'Returns a list of all payments made by users.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Returns a list of all payments made by users.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async getDfkey(
    @Query('ufKey') ufKey: string,
    @Query('groupId') groupId: string,
    @Req() req: any
  ) {
    const token: string = req.headers.authorization.split(' ')[1];	
    const ufkey: string = ufKey;
    const groupid: string = groupId;
    return await this.appService.getDfkey(ufkey, groupid, token);
  }

  @Post('PaginationDataFilter')
  @ApiResponse({
    status: 200,
    description: 'Data PaginationDataFilter Completed',
    isArray: true,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiBody({ type: paginationDataFilterDto })
  @ApiOperation({
    summary: 'Fetch the records for the table component',
    description:
      'Fetch the records for the table component with the specified DST key',
  })
  @ApiBadRequestResponse({ description: 'Invalid request parameters' })
  @ApiCreatedResponse({
    description: 'Returns a list of all payments made by users.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Returns a list of all payments made by users.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async paginationDataFilter(@Body() body: paginationDataFilterDto,@Req() req: any) {
    const token: string = req.headers.authorization.split(' ')[1];	
    const { key, data,dfdType,dpdKey,method,primaryKey } = body;
    let result : any = await this.appService.paginationDataFilter(key, data, token,dfdType,primaryKey);
    if(dpdKey && method){
      result["dpdKey"] = dpdKey
      result["method"] = method
    }
    return result;
  }

  // @Post('AuthorizationCheck')
  // @ApiResponse({ status: 201, description: 'Security Check Completed' })
  // @ApiResponse({ status: 400, description: 'Bad Request' })
  // @ApiResponse({ status: 500, description: 'Internal Server Error' })
  // async SFCheckScreen(@Body() body: securityDto, @Req() req: any) {
  //   const token: string = req.headers.authorization.split(' ')[1];
  //   const {
  //     key,
  //     nodeId,
  //     isTable,
  //   }: { key: string; nodeId?: string; isTable?: boolean } = body;
  //   return await this.appService.SFCheckScreen(key, token, nodeId, isTable);
  // }

  // @Post('setSaveHandlerData')
  // @ApiResponse({ status: 201, description: 'SaveHandlerData Completed' })
  // @ApiResponse({ status: 400, description: 'Bad Request' })
  // @ApiResponse({ status: 500, description: 'Internal Server Error' })
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       key: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //       value: {
  //         type: 'any',
  //         format: 'binary',
  //       },
  //       path: {
  //         type: 'any',
  //         format: 'binary',
  //       }
  //     },
  //   },
  // })
  // // async setSaveHandlerData(@Body() body: saveHandlerDto) {
  // //   const { key, value, path } = body;
  // //   return await this.appService.setSaveHandlerData(key, value, path);
  // // }

  // // @Post('uploadHandlerData')
  // // @ApiResponse({ status: 201, description: 'UploadHandlerData Completed' })
  // // @ApiResponse({ status: 400, description: 'Bad Request' })
  // // @ApiResponse({ status: 500, description: 'Internal Server Error' })
  // // async uploadHandlerData(@Body() body: uploadHandlerDto) {
  // //   const { key } = body;
  // //   return await this.appService.uploadHandlerData(key);
  // // }

  @Post('InitiatePF')
  @ApiBody({ type: InitiatePFDto })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOperation({
    summary: 'Retrive node property and event property from the processflow',
    description:
      'Retrived node property and event property from the specified PFD key',
  })
  @ApiBadRequestResponse({ description: 'Invalid request parameters' })
  @ApiCreatedResponse({
    description: 'Returns a list of all payments made by users.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Returns a list of all payments made by users.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async InitiatePF(@Body() body: InitiatePFDto, @Req() req): Promise<any> {
    const token: string = req.headers.authorization.split(' ')[1];
    const { key, sourceId, dpdKey, method } = body;
    let result : any = await this.appService.InitiatePF(key, sourceId, token);
    if(dpdKey && method){
      result["dpdKey"] = dpdKey
      result["method"] = method
    }
    return result;
  }

  // @Post('getPFDetails')
  // async getPFDetails(@Body() body: any,@Req() req: any): Promise<any> {
  //   const token: string = req.headers.authorization.split(' ')[1];	
  //   const { isTable, key, groupId, controlId } = body;
  //   return await this.appService.getPFDetails(
  //     isTable,
  //     key,
  //     groupId,
  //     controlId,
  //     token
  //   );
  // }

  // @Post('fetchActionDetails')
  // @ApiBody({ type: fetchActionDetailsDto })
  // async fetchActionDetails(@Body() body: fetchActionDetailsDto,@Req() req: any): Promise<any> {
  //   const token: string = req.headers.authorization.split(' ')[1];	
  //   const { key, groupId, controlId } = body;
  //   return await this.appService.fetchActionDetails(key, groupId, controlId,token);
  // }

  // @Post('fetchRuleDetails')
  // @ApiBody({ type: fetchRuleDetailsDto })
  // async fetchRuleDetails(@Body() body: fetchRuleDetailsDto,@Req() req: any): Promise<any> {
  //   const token: string = req.headers.authorization.split(' ')[1];	
  //   const { key, groupId, controlId } = body;
  //   return await this.appService.fetchRuleDetails(key, groupId, controlId,token);
  // }

  @Post('ifo')
  @ApiBody({ type: ifoDto })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOperation({
    summary: 'Table records are mapped or not in the orchestration',
    description:
      'Check the table records are mapped in the orchestration with the specified UF key',
  })
  @ApiBadRequestResponse({ description: 'Invalid request parameters' })
  @ApiCreatedResponse({
    description: 'Returns a list of all payments made by users.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Returns a list of all payments made by users.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async ifo(@Body() body: ifoDto, @Req() req: any): Promise<any> {
    const token: string = req.headers.authorization.split(' ')[1];
    const { formData, key, controlId, isTable, dpdKey ,method } = body;
    let result : any = await this.appService.ifo(formData, key, controlId, isTable, token);
    if(dpdKey && method){
      result["dpdKey"] = dpdKey
      result["method"] = method
    }
    return result;
  }

  @Post('signin')
  @ApiBody({ type: signinToTorusDto })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOperation({
    summary: 'Token generated for the user',
    description:
      'Token generated for the user based on the client, username, password',
  })
  @ApiBadRequestResponse({ description: 'Invalid request parameters' })
  @ApiCreatedResponse({
    description: 'Returns a list of all payments made by users.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Returns a list of all payments made by users.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async signinToTorus(
    @Body(new ValidationPipe({ transform: true })) body: signinToTorusDto,
    @Req() req: any
  ) {
    const { username, password, dpdKey, method, ufClientType } = body;
    const { DEFAULT_AUTHENTICATION , FUSIONAUTH_TENANTID , FUSIONAUTH_APPLICATIONID,FUSIONAUTH_APPCLIENTSECRET } = process.env;
    let result : any;
    if(DEFAULT_AUTHENTICATION == "fusionauth" &&  FUSIONAUTH_TENANTID && FUSIONAUTH_APPLICATIONID && FUSIONAUTH_APPCLIENTSECRET) {
       result = await this.appService.signInViaIAM(username, password, ufClientType);
    }else{
       result = await this.appService.signIntoTorus(username, password, ufClientType);
    }
    if(dpdKey && method){
      result["dpdKey"] = dpdKey
      result["method"] = method
    }
    return result;
  }

  @Get('myAccount-for-client')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOperation({
    summary: 'Provide the template for the user',
    description: 'Provide the template for the user based on the token',
  })
  @ApiCreatedResponse({
    description: 'Returns a list of all payments made by users.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Returns a list of all payments made by users.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async MyAccountForClient(@Req() req: Request,@Query() query ) {
    const {dpdKey,method,key} = query;
    const { authorization }: any = req.headers;   
    const token = authorization.split(' ')[1];
    let result : any = await this.appService.MyAccountForClient(token,key,authorization);
    if(dpdKey && method){
      result["dpdKey"] = dpdKey;
      result["method"] = method;
    }
    return result;  
  }

  @Get('logout')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOperation({
    summary: 'Logout the user',
    description: 'Logout the user from the generated app based on the token',
  })
  @ApiCreatedResponse({
    description: 'Returns a list of all payments made by users.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Returns a list of all payments made by users.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async logout(@Headers() header,@Body() body:logoutDto, @Query() query ) {
    const {key} = body;
    const {dpdKey,method} = query;
    const tokens: string = header.authorization.split(' ')[1];	
    let result : any = await this.appService.logout(header,tokens,key);
    if(dpdKey && method){
      result["dpdKey"] = dpdKey
      result["method"] = method
    }
    return result;
  }

  @Get('introspect')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOperation({
    summary: 'Check the expire time of the token',
    description: 'If the token was expired ,It will return authenticate false',
  })
  @ApiCreatedResponse({
    description: 'Returns a list of all payments made by users.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Returns a list of all payments made by users.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async introspectToken(@Headers() header, @Query() query ) {
    const {dpdKey,method,key} = query;
    const tokens: string = header.authorization.split(' ')[1];
    let result : any = await this.appService.introspectToken(header,key,tokens);
    if(dpdKey && method){
      result["dpdKey"] = dpdKey
      result["method"] = method
    }
    return result;
  }

  @Post('pagination')
  @ApiBadRequestResponse({ description: 'Invalid request parameters' })
  @ApiBody({ type: pageDto })
  @ApiCreatedResponse({
    description: 'Returns a list of all payments made by users.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Returns a list of all payments made by users.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async getpagination(@Body() input: pageDto,@Req() req: any) {
    const token: string = req?.headers?.authorization?.split(' ')[1];
    if(!token) return 'Authorization token not found';
    // const {keys} = input;
    const{dpdKey,method} = input
    if (input.key){
      let result : any = await this.appService.getpagination(
        input.key,
        input.page,
        input.count,
        input.filterDetails,
        input.searchFilter,
        token
      );
      if(dpdKey && method){
      result["dpdKey"] = dpdKey
      result["method"] = method
    }
    return result;
    }else{
      return 'MDKey/count shouldnot be empty';
    }
  }

  @Post('dataget')
  @ApiBadRequestResponse({ description: 'Invalid request parameters' })
  @ApiBody({ type: pageDto })
  @ApiCreatedResponse({
    description: 'Returns a list of all payments made by users.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Returns a list of all payments made by users.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async dataGet(@Body() input: dataGet, @Req() req: any) {
    const token: string = req.headers.authorization.split(' ')[1];
    const {dpdKey,method} = input
    if (input.key) {
      try {
      let allDetails:any=  await this.appService.getpagination(
          input.key,
          1,
          10,
          "",
          "",
          token,
        );
        let result : any = await this.appService.getpagination(
          input.key,
          1,
          allDetails?.totalRecords,
          input.filterDetails,
          input.searchFilter,
          token,
        );
        if(dpdKey && method){
          result["dpdKey"] = dpdKey
          result["method"] = method
        }
        return result;        
      } catch (err) {
        return err;
      }
    } else return 'MDKey/count shouldnot be empty';
  }

    // static screen's apis

  @Get('getAppSecurityData')
  async getAppSecurityData() {
    return this.appService.getAppSecurityData();
  }

  @Get('getAPPSecurityTemplateData')
  async getAPPSecurityTemplateData() {
    return this.appService.getAPPSecurityTemplateData();
  }

  @Get('getAppAccessProfiles')
  async getAppAccessProfiles() {
    return this.appService.getAppAccessProfiles();
  }

  @Post('postAppUserList')
  async postAppUserList(@Body() body) {
    const { data } = body;
    return this.appService.postAppUserList(data);
  }
  @Post('appSecurityTemplateData')
  async appSecurityTemplateData(@Body() body) {
    const {data} = body
    return this.appService.AppSecurityTemplateData(data);
  }

  @Post('setJson')
  async setJson(
    @Query(new ValidationPipe({ transform: true })) query: any,
    @Body(new ValidationPipe({ transform: true })) body: any,
  ): Promise<any> {
    const key = query.key;
    const data = body.data;
    return await this.appService.setJson(key, data);
  }
  @Post('getDFS')
  async getDFS(@Body() body: any, @Res() res: FastifyReply) {
    const { id, enableEncryption } = body
    const decrypted = await this.appService.getDFS(id, enableEncryption)
    const contentType = lookup(id)
    res
      .header('Content-Type', contentType)
      .header(
        'Content-Disposition',
        `inline; filename="${decodeURIComponent(id.split('/').pop() || 'file')}"`,
      )
      .send(decrypted)
  }

  @Post('uploadimg')
   async post_upload(@Req() req: FastifyRequest) {
      if (!req.isMultipart()) {
        throw new Error('Request is not multipart');
      }
      const parts:any = req.parts();
      const fields:any ={}
      let fileBuffer: Buffer;
      let fileMeta: any;
      for await (const part of parts) {
        if (part.type === 'file') {
          // This is a file part
          fileBuffer = await part.toBuffer();
          fileMeta = {
            filename: part.filename,
            mimetype: part.mimetype,
            size: fileBuffer.length,
          };
        } else {
          // This is a regular form field part
          fields[part.fieldname] = part.value;
        }
      }
     const { bucketFolderame, folderPath , enableEncryption, filename ="" } = fields;
     const file = {
          ...fileMeta,
          buffer: fileBuffer,
        }
    const imageUrl = await this.appService.uploadImage(
      file,
      bucketFolderame,
      folderPath,
      filename,
      enableEncryption
    );
    return { imageUrl };
  }

  @Get('readAMDKey')
  async readAMDKey(@Query('key') key: string, @Req() req: any) {
    const token: string = req.headers.authorization?.split(' ')[1];
    return this.appService.readAMDKey(key, token);
  }
  @Get('getResetPasswordOtp')
  async getResetPasswordOtp(@Query() query: any) {
    const { email }  = query;
    return this.appService.getResetPasswordOtp(email);
  }

  @Get('verifyOtp')
  async verifyOtp(@Query() query: any) {
    const { email, otp } = query;
    return this.appService.verifyOtp(email, otp);
  }

  @Patch('resetPassword')
  async resetPassword(@Body() body: any) {
    const { email, password } = body;
    return this.appService.resetPassword(email, password);
  }

  @Post("oauthSignIn")
  async oauthSignIn(@Body() body:any) {
    const { user } = body;
    return this.appService.oauthSignIn(user)
  }

  @Post("getNavbarData")
  async getNavbarData(@Body() body:any, @Req() req: any) {
    const { key } = body;
    const token: string = req.headers.authorization.split(' ')[1];
    const clientCode: string = process.env.CLIENTCODE;
    return this.appService.getNavbarData(key,clientCode,token)
  }
}