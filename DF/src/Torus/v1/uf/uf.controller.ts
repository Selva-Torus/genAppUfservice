import * as crypto from 'crypto';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  ValidationPipe,
  HttpException,
  HttpStatus,
  Headers,
  Patch,
  BadRequestException,
  UseGuards
} from '@nestjs/common';
import { Public } from 'src/public.decorator';
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
  codefilterDto,
  elementsFilterDto,
  fetchActionDetailsDto,
  fetchRuleDetailsDto,
  FILE_UPLOADS_DIR,
  getMapperDetailsDto,
  getPresignedUrlDto,
  ifoDto,
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
  uploadHandlerDto,
  myAccountForClientdto,
  introspectDto,
  LockRecordBodyDto,
  sanitizeForFileResponse,
} from 'src/dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Response } from 'express';
import { lookup } from 'mime-types';
import { JwtServices } from 'src/jwt.services';
import { CommonService } from 'src/common.Service';
import { safeFetchBuffer ,assertAllowedOutboundHost} from 'src/utils/ssrf.util';

@ApiTags('TG')
@Controller('UF')
export class UfController {
  constructor(
    private readonly appService: UfService,
    private readonly jwtService: JwtServices,
    private readonly commonService: CommonService
  ) {}

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
      result["updatedToken"] = await this.appService.getAccessToken(token, selectedCombination , selectedAccessProfile , dap , ufClientType);
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

  @Post('download')  
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiOperation({
    summary: 'Download file from seaweed direct URL',
    description: 'Download file from the specified path',
  })                                                                                                                                                                                     
  async download(@Body() body: any, @Res() res: FastifyReply) {
    const { id } = body
    // Opt-in allowlist gate (no-op today unless OUTBOUND_HOST_ALLOWLIST is set).
    assertAllowedOutboundHost(id);
    // Mandatory defense-in-depth: resolves DNS itself, rejects private/reserved
    // targets (RFC1918, loopback, link-local/cloud-metadata, IPv6 equivalents,
    // etc.) regardless of allowlist config, and pins the connection to the
    // vetted address so a second DNS resolution can't rebind it — see
    // src/utils/ssrf.util.ts for the full range list and rationale.
    const { body: buffer, finalUrl } = await safeFetchBuffer(id);

    const fileName = decodeURIComponent(finalUrl.split('/').pop() || 'file')

    res
    .header('Content-Type', 'application/octet-stream')
    .header('Content-Disposition', `attachment; filename="${fileName}"`)
    .send(buffer)
  }
  
  @Post('setUpKey')
  @Public()
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
    const { key,dpdKey,method,tag } = body;
    let result : any 
    if (tag) {
      result = await this.appService.setUpKey(key,token,tag);      
    }else{
      result = await this.appService.setUpKey(key,token);
    }
    if(dpdKey && method){
      result["dpdKey"] = dpdKey
      result["method"] = method
    }
    return result;
  }
  
  @Post('OrchestrationBatch')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  async OrchestrationBatch(@Body() body: any, @Req() req: any) {
    const token = req.headers.authorization?.split(' ')[1];
    return this.appService.OrchestrationBatch(
      body.key,  token, body.accessProfile
    );
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
  @Public()
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
    const { username, password, dpdKey, method, ufClientType, app_tenant, app_tenant_id, fusionAuthLoginResponse , isOauthUser } = body;
    let result : any;
    // if(ufClientType === 'UFM') {
    //   result = await this.appService.signInViaIAM(username, password, ufClientType, false , app_tenant, app_tenant_id);
    // } else{
      result = await this.appService.signIntoTorus(username, password, ufClientType, isOauthUser , app_tenant, app_tenant_id, fusionAuthLoginResponse);
    //}
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
  async logout(@Headers() header, @Query() query ) {
    const {dpdKey,method} = query;
    const tokens: string = header.authorization.split(' ')[1];	
    let result : any = await this.appService.logout(header,tokens, 'User Screen');
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
   async getpagination(@Body(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })) input: pageDto,@Req() req: any) {
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
        token,
        input.filterData,
        input.sortingDetails
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
    const fileName = decodeURIComponent(id.split('/').pop() || 'Document')
    const { contentType, disposition } = sanitizeForFileResponse(lookup(id) || undefined)
    res
      .header('Content-Type', contentType)
      .header('File-Name', fileName)
      .header('Content-Disposition', `${disposition}; filename="${fileName}"`)
      .header('Access-Control-Expose-Headers', 'File-Name, Content-Disposition')
      .send(decrypted)
  }

  @Post('getUrlByVgphstdmId')
  async getUrlByVgphstdmId(@Body() body: any) {
    const { id } = body;
    return this.appService.getUrlByVgphstdmId(id);
  }
  
  @Post('uploadimg')
  async post_upload(@Req() req: FastifyRequest) {
    try {
      if (!req.isMultipart()) {
        throw new BadRequestException('Request is not multipart');
      }
      const parts: any = req.parts();
      const fields: any = {};
      const files: Array<{
        filename: string;
        mimetype: string;
        size: number;
        buffer: Buffer;
        doc_group: string;
      }> = [];

      for await (const part of parts) {
        if (part.type === 'file') {
          const buffer = await part.toBuffer();
          files.push({
            filename: part.filename,
            mimetype: part.mimetype,
            size: buffer.length,
            buffer,
            doc_group: part?.fields?.doc_group?.value || "",
          });
        } else {
          fields[part.fieldname] = part.value;
        }
      }

      if (files.length === 0) {
        throw new BadRequestException('No files uploaded');
      }

      const { bucketFolderame, folderPath, enableEncryption, filename = '', returnType } = fields;

      const imageUrls: string[] = [];
      for (const file of files) {
        const imageUrl = await this.appService.uploadImage(
          file,
          bucketFolderame,
          folderPath,
          filename || file.filename,
          enableEncryption,
          file?.doc_group || '',
        );
        imageUrls.push(imageUrl);
      }

      return {
        success: true,
        message: 'file saved',
        imageUrl: returnType === 'string[]' ? imageUrls : imageUrls[0],
      };
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error?.message || 'An unexpected error occurred during file upload',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('readAMDKey')
  async readAMDKey(@Query('key') key: string, @Req() req: any) {
    const token: string = req.headers.authorization?.split(' ')[1];
    return this.appService.readAMDKey(key, token);
  }

  @Post('getResetPasswordOtp')
  @Public()
  async getResetPasswordOtp(@Body() body: any) {
    const { email, tenantId }  = body;
    return this.appService.getResetPasswordOtp(email, tenantId);
  }

  @Post('verifyOtp')
  @Public()
  async verifyOtp(@Body() body: any) {
    const { email, otp, id } = body;
    return this.appService.verifyOtp(email, otp, id);
  }

  @Patch('resetPassword')
  @Public()
  async resetPassword(@Body() body: any) {
    const { email, password, app_tenant, tenantId , resetToken } = body;
    return this.appService.resetPassword(email, password, app_tenant, tenantId , resetToken);
  }

  @Post("getNavbarData")
  async getNavbarData(@Body() body:any, @Req() req: any) {
    const { key } = body;
    const token: string = req.headers.authorization.split(' ')[1];
    const clientCode: string = process.env.CLIENTCODE;
    return this.appService.getNavbarData(key,clientCode,token)
  }

  @Get('app-list')
  async getAppList(@Req() req: any) {
    const token: string = req.headers.authorization.split(' ')[1];
    return this.appService.getAppList(token);
  }

  @Post('sso')
  @Public()
  async sso(@Body() body:any) {
    const { token , ufClientType } = body;
    return this.appService.sso(token , ufClientType);
  }

  @Get('app-tenant-app')
  @Public()
  async getAppTenantsLinkedWithApp(@Req() req: any) {
    return this.appService.getAppTenantsLinkedWithApp();
  }

  // Stays @Public() because the UF server must build the FusionAuth authorization
  // URL before any user token exists. The OAuth client secret, however, is only
  // released to a caller presenting the shared internal-service key — previously
  // this route handed both the client secret and the FusionAuth admin API key to
  // any anonymous caller, which is a full identity-provider takeover.
  // Fails closed: with INTERNAL_SERVICE_KEY unset, no secret is ever returned.
  @Get('fusionauth-credentials')
  @Public()
  async getFusionAuthCredentials(@Query() query: any, @Req() req: any ) {
    const { tenant : app_tenant } = query;
    const includeSecrets = this.hasInternalServiceKey(req);
    return this.appService.getFusionAuthCredentials(app_tenant, includeSecrets);
  }

  private hasInternalServiceKey(req: any): boolean {
    const expected = process.env.INTERNAL_SERVICE_KEY;
    if (!expected) return false;
    const provided = req?.headers?.['x-internal-service-key'];
    if (typeof provided !== 'string' || provided.length !== expected.length) return false;
    // constant-time compare so the key can't be recovered byte-by-byte via timing
    return crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
  }
  

  // Allow-list dto.tableName against real Prisma models and dto.key against
  // that model's real columns — this endpoint previously passed both
  // straight into uf.service.ts's raw SQL (`WHERE ${dto.key} = $1`) with no
  // validation at all, letting any authenticated caller inject SQL and/or
  // target an arbitrary table.
  @Post('lock')
  async lock(@Body() dto: LockRecordBodyDto, @Req() req: any) {
    const token: string = req.headers.authorization.split(' ')[1]
    const decodedToken: any = await this.jwtService.verifyToken(token);
    const loginId = decodedToken.loginId;
    dto['userId'] = loginId;
    return this.appService.acquireLock(dto);
  }

  @Post('unlock')
  async unlock(@Body() dto: LockRecordBodyDto, @Req() req: any) {
    const token: string = req.headers.authorization.split(' ')[1]
    const decodedToken: any = await this.jwtService.verifyToken(token);
    const loginId = decodedToken.loginId;
    dto['userId'] = loginId;
    return this.appService.releaseLock(dto);
  }

  @Post('release-all-locks')
  async releaseAllLocks(@Req() req: any) {
    const token: string = req.headers.authorization.split(' ')[1]
    const decodedToken: any = await this.jwtService.verifyToken(token);
    const loginId = decodedToken.loginId;
    return this.appService.releaseAllLocks(loginId);
  }
}