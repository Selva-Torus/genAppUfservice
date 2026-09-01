import { ApiProperty , ApiPropertyOptional} from "@nestjs/swagger";
import { IsEnum, IsOptional, IsNotEmpty, IsString, ValidateNested, IsBoolean, IsArray, IsNumber, IsInt, Min, Max, registerDecorator, ValidationOptions } from 'class-validator';
import { join } from 'path';
import { Type } from 'class-transformer';

export const FILE_UPLOADS_DIR = join(process.cwd(), 'uploads');

// filterData/searchFilter/filterDetails are genuinely dynamic: the low-code
// filter UI generates column names it can't know at DTO-authoring time (see
// uf.service.ts#getpagination[withLogicCenter], dynamicFlow.service.ts and
// listener.service.ts, which read them as either an array of per-node
// {nodeId, ...column: value} records, an array of {key,operator,value,
// value2,type} descriptors, or a flat column->value record). Typing them as
// a concrete class would silently drop real fields under whitelist mode.
// Instead of leaving them as bare `object` (any JSON shape, no structural
// check), this validator enforces the one thing every downstream consumer
// (SQL WHERE builders in common.Service.ts/dynamicFlow.service.ts,
// Object.assign-based mapObj merges, applyFilters()) actually relies on:
// a plain object, or array of plain objects, whose values are primitives (or
// arrays of primitives) — never nested objects/functions — and whose keys
// are never __proto__/constructor/prototype. Column-name safety itself is
// still enforced downstream by CommonService.isSafeSqlIdentifier(); this
// only closes the structural gap so malformed/hostile payloads never reach
// that stage in the first place.
const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

function isSafeFilterValue(value: any): boolean {
  if (value === null || value === undefined) return true;
  const t = typeof value;
  if (t === 'string' || t === 'number' || t === 'boolean') return true;
  if (Array.isArray(value)) {
    return value.every(v => v === null || v === undefined || ['string', 'number', 'boolean'].includes(typeof v));
  }
  return false;
}

function isSafeFilterRecord(value: any): boolean {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  if (Object.prototype.toString.call(value) !== '[object Object]') return false;
  return Object.keys(value).every(key => !DANGEROUS_KEYS.has(key) && isSafeFilterValue(value[key]));
}

export function IsSafeFilterShape(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isSafeFilterShape',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (value === undefined || value === null) return true;
          if (Array.isArray(value)) return value.every(isSafeFilterRecord);
          return isSafeFilterRecord(value);
        },
        defaultMessage(args) {
          return `${args.property} must be a plain object, or array of plain objects, with only primitive (or primitive-array) values and no __proto__/constructor/prototype keys`;
        },
      },
    });
  };
}

// Content types safe to render inline in a browser tab on the app's own
// origin. Uploads themselves stay unrestricted (this system stores arbitrary
// case documents by design — see DocumentUploader's file-type list), so the
// control point is here: anything not on this list is downgraded to
// application/octet-stream + Content-Disposition: attachment before being
// sent back, regardless of what was uploaded or what the storage-key
// extension implies. This stops stored XSS via an uploaded/renamed
// text/html, image/svg+xml, or application/javascript file being executed
// in-browser when served back inline.
const INLINE_SAFE_CONTENT_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/bmp',
  'image/x-icon',
  'image/vnd.microsoft.icon',
  'application/pdf',
]);

export function sanitizeForFileResponse(contentType: string | undefined | null): {
  contentType: string;
  disposition: 'inline' | 'attachment';
} {
  const normalized = (contentType || '').toLowerCase().split(';')[0].trim();
  if (INLINE_SAFE_CONTENT_TYPES.has(normalized)) {
    return { contentType: normalized, disposition: 'inline' };
  }
  return { contentType: 'application/octet-stream', disposition: 'attachment' };
}

export class ReadMDdto{
  SOURCE:string
  TARGET:string
  CK: any   
  FNGK: any    
  FNK: any   
  CATK?: String[]    
  AFGK?: String[]    
  AFK?:String[]   
  AFVK?:String[]
  AFSK?:String   
}

export class readAPIDTO {

    @ApiProperty({ description: 'Source', example: 'redis' })
    SOURCE: string;
 
    @ApiProperty({ description: 'Target', example: 'mongo' })
    TARGET: string;
 
    @ApiProperty({ description: 'CK', example: 'TCL' })
    CK: string; 
   
    @ApiProperty({ description: 'FNGK', example: 'AF' })
    FNGK: string;
 
    @ApiProperty({ description: 'FNK', example: 'DF' })
    FNK: string;
 
    @ApiProperty({ description: 'CATK', example: ['FINTECH'] })
    CATK: string[];
 
    @ApiProperty({ description: 'AFGK', example: ['VPHCoreMaster'] })
    AFGK: string[];
 
    @ApiProperty({ description: 'AFK', example: ['bankmaster'] })
    AFK: string[];
 
    @ApiProperty({ description: 'AFVK', example: ['v1'] })
    AFVK: string[];
 
     @ApiProperty({ description: 'AFSK', example: 'nodeProperty' })
    AFSK: string;
  }

  export class uploadHandlerDto {
    @ApiProperty({description: 'Key', example: 'TGA:ABKUF:BUILD:ABC:mvp:bank:v2:Events:Grouprow4:ButtonSave:v1'})
    @IsNotEmpty()
    key: string;
  }

  export class saveHandlerDto {
    @ApiProperty({description: 'Key', example: 'TGA:ABKUF:BUILD:ABC:mvp:bank:v2:Events:Grouprow4:ButtonSave:v1'})
    @IsNotEmpty()
    key: string;
  
    @ApiProperty({description: 'value'})
    @IsNotEmpty()
    value: any;
  
    @ApiProperty({description: 'path', example: 'params.request'})
    @IsNotEmpty()
    path: string;
  }

  export class securityDto {
    @ApiProperty({description: 'Key', example: 'TGA:ABKUF:BUILD:ABC:mvp:bank:v2'})
    @IsNotEmpty()
    key: string;

    @ApiProperty({description: 'nodeName', example: 'row1'})
    @IsOptional()
    @IsString()
    nodeName?: string;

    @IsOptional()
    @IsBoolean()
    isTable?:boolean
  }

  export class PoEvent {
    constructor(
     
      public pfdto:pfDto,
      public event: string,
      public pfs : any,     
      public pfo: any,
      public poJson: any,
      public ndp : any,
      public flag : string,
      public page?:number,
      public count?:number,
      public targetQueue?:string,
      public failureQueue?:string,
      public filterData?:object,
      public lock?:Object,
      public childTable?:any,
      public logicCenter?:boolean,
      public schedulerStatus?:string
      ) {}
    }
 
    export class pfDto {
      @IsNotEmpty()
      @IsString()
      key: string
      @IsOptional()
      upId: any
      @IsOptional()
      @IsString()
      event: string
      @IsOptional()
      data: any
      @IsOptional()
      @IsString()
      token:string
      @IsOptional()
      @IsString()
      nodeId: string
      @IsOptional()
      @IsString()
      nodeName:string
      @IsOptional()
      @IsString()
      nodeType:string
      @IsOptional()
      @IsString()
      sourceId:string
      @IsOptional()
      @IsString()
      refreshFlag : string
      @IsOptional()
      @IsString()
      dpdKey ?: string
      @IsOptional()
      @IsString()
      method?:string
      @IsOptional()
      @Type(() => Number)
      @IsInt()
      @Min(1)
      page?:number
      @IsOptional()
      @Type(() => Number)
      @IsInt()
      @Min(1)
      //@Max(10000)
      count?:number
      @IsOptional()
      @IsSafeFilterShape()
      filterData?:object
      @IsOptional()
      lock?:Object
      @IsOptional()
      childTable?:any
      @IsOptional()
      @IsBoolean()
      logicCenter?:boolean
      @IsOptional()
      @IsString()
      schedulerStatus?:string
      @IsOptional()
      @IsString()
      parentUpId?:string
      @IsOptional()
      @IsString()
      ssKey?:string
      @IsOptional()
      @IsString()
      controlName?:string
      @IsOptional()
      @IsString()
      afiflag?:string
      @IsOptional()
      @IsSafeFilterShape()
      searchFilter?:object
      @IsOptional()
      trs_version?:any
      @IsOptional()
      @IsString()
      tableName?:string
    }
  
    export class pageDto {
      @IsNotEmpty()
      @IsString()
      key: string
      @IsOptional()
      @Type(() => Number)
      @IsInt()
      @Min(1)
      page: number
      @IsOptional()
      @Type(() => Number)
      @IsInt()
      @Min(1)
      //@Max(10000)
      count: number
      @IsOptional()
      @IsSafeFilterShape()
      filterDetails?: object
      @IsOptional()
      @IsSafeFilterShape()
      searchFilter?:object
      @IsOptional()
      @IsString()
      dpdKey?:string
      @IsOptional()
      @IsString()
      method?:string
      // NOTE: previously typed @IsString() even though every caller
      // (uf.service.ts#getpagination -> filterData?.find/[0]) treats this as
      // an array of per-node filter records — a plain string would never
      // have passed those calls without throwing. Corrected to match actual
      // usage and validated the same way as pfDto.filterData.
      @IsOptional()
      @IsSafeFilterShape()
      filterData?: object
      @IsOptional()
      @IsSafeFilterShape()
      sortingDetails?: object
  }

    export class ProcessLogEntryDto {
  @ApiProperty({ example: 'make_payment', description: 'Name of the process node' })
  nodeName: string;

  @ApiProperty({ example: 'RequestInitiated', description: 'Event triggered at this node' })
  event: string;

  @ApiProperty({ example: 'Success', description: 'Execution status of the node', enum: ['Success', 'Failed'] })
  status: string;

  @ApiProperty({ example: '2026-03-30 13:31:11:883', description: 'Timestamp when the node was executed' })
  DateAndTime: string;
}

export class ProcessLogResponseDto {
  @ApiProperty({ type: [ProcessLogEntryDto], description: 'Filtered list of process log entries' })
  data: ProcessLogEntryDto[];
}

export class RawProcessLogInputDto {
  @ApiProperty({
    description: 'Raw process log payload from the upstream API (full AFSK structure)',
    example: {
      data: [
        {
          CK: 'CT010',
          AFSK: {
            d757p7ra1bjg008yerhg: [
              {
                sessionInfo: { user: 'Haritha' },
                processInfo: {
                  nodeName: 'make_payment',
                  event: 'RequestInitiated',
                  status: 'Success',
                },
                DateAndTime: '2026-03-30 13:31:11:883',
              },
            ],
          },
        },
      ],
    },
  })
  data: any[];
}

  export class sessionDto { 
    user:string
  }

  export class PrcnestedValue { 
    sessionInfo: sessionDto
    processInfo: object
  }

  export class ExpnestedValue { 
    sessionInfo: sessionDto
    errorDetails: object
  }  

  export class nestedData {
    @ApiProperty({ example: "2026-04-15T08:19:02.651Z" })
    currentDate: Date
    @ApiProperty({ example: "CK:TT001:FNGK:AFP:FNK:PF-PFD:CATK:Torus20261:AFGK:Torus202601:AFK:Stop_Specificscheduler_Flow:AFVK:v1:d7g9g3ghr5pg008bsbqg" })
    field: string
    @ApiProperty({ example: {} })
    value: PrcnestedValue
  }

  export class PrcLogInputDto {
  @ApiProperty({ example: "TT001-T001-TPL" })
  streamname: string;

  @ApiProperty({ 
    type: [nestedData],
    example: 
    [{
      "currentDate": "2026-04-15T08:19:02.651Z",
      "field": "CK:TT001:FNGK:AFP:FNK:PF-PFD:CATK:Torus20261:AFGK:Torus202601:AFK:Stop_Specificscheduler_Flow:AFVK:v1:d7g9g3ghr5pg008bsbqg",
      "value": {
          "sessionInfo": {
              "user": "sri"
          },
          "processInfo": {
              "key": "CK:TT001:FNGK:AFP:FNK:PF-PFD:CATK:Torus20261:AFGK:Torus202601:AFK:Stop_Specificscheduler_Flow:AFVK:v1:",
              "upId": "d7g9g3ghr5pg008bsbqg",
              "status": "Success",
              "nodeName": "Post_Stop_SpecificScheduler",
              "nodeId": "b88ac92eac404d3c919c623925fc6741",
              "nodeType": "apinode",
              "event": "RequestCompleted",
              "queue": "TEH",
              "request": {},
              "response": {}
          }
      }
    }]    
  })
  data: nestedData[];
  
}

export class ExpLogInputDto {
  @ApiProperty({ example: "TT001-T001-TSL" })
  streamname: string;

  @ApiProperty({ 
    type: [nestedData],
    example: 
    [{
      "currentDate": "2026-04-15T08:19:02.651Z",
      "field": "CK:TT001:FNGK:AFP:FNK:PF-PFD:CATK:Torus20261:AFGK:Torus202601:AFK:Stop_Specificscheduler_Flow:AFVK:v1:",
      "value": {
          "sessionInfo": {
              "user": "sri"
          },
          "errorDetails": {
              "T_ErrorSource": "TG",
              "T_ErrorGroup": "Technical",
              "T_ErrorCategory": "AK",
              "T_ErrorType": "Fatal",
              "T_ErrorCode": "TG023",
              "errorCode": 500,
              "errorDetail": {
                  "code": "GenericFailure",
                  "clientVersion": "6.19.3"
              }
          }
      }
    } ]   
  })
  data: nestedData[];
  
}

  export class LogOutputDto {
    @ApiProperty({   
      example: 'success',    
    })
    status: string
  }

  export class dataGet {
    @IsNotEmpty()
    @IsString()
    key: string
    @IsOptional()
    @IsSafeFilterShape()
    filterDetails?: object
    @IsOptional()
    @IsSafeFilterShape()
    searchFilter?:object
    @IsOptional()
    @IsString()
    dpdKey?:string
    @IsOptional()
    @IsString()
    method?:string
  }
  export interface errorObj{
    tname : string,
    errGrp: string,
    fabric: string,
    errType:string,
    errCode:string,
}

export class setUpKeyDto{
  @ApiProperty({example: "CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:TT001:AFK:PROFILE:AFVK:v1:tpc"})
  @IsNotEmpty()
  key:string
  @IsOptional()
  @IsString()
  tag?:string
  @IsOptional()
  @IsString()
  dpdKey?:string
  @IsOptional()
  @IsString()
  method?:string
}

export class uploadFileDto{
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
  @ApiProperty({description: 'key'})
  @IsNotEmpty()
  key:string

  @ApiProperty({description: 'bucketFolderame'})
  bucketFolderame:string

  @ApiProperty({description: 'folderPath'})
  folderPath:string
}

export class uploadFileMobileDto{
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
  @ApiProperty({description: 'key'})
  @IsNotEmpty()
  key:string

  @ApiProperty({description: 'bucketFolderame'})
  bucketFolderame:string

  @ApiProperty({description: 'folderPath'})
  folderPath:string
}

export class OrchestrationDto{
  @ApiProperty({description: 'key'})
  @IsNotEmpty()
  key:string

  @ApiProperty({description: 'componentId'})
  @IsOptional()
  @IsString()
  componentId?:string

  @ApiProperty({description: 'controlId'})
  @IsOptional()
  @IsString()
  controlId?:string

  @ApiProperty({description: 'isTable'})
  @IsOptional()
  @IsBoolean()
  isTable:boolean

  @ApiProperty({description: 'accessProfile'})
  @IsOptional()
  @IsArray()
  accessProfile?:any[]

  @ApiProperty({description: 'dpdKey'})
  @IsOptional()
  @IsString()
  dpdKey?:string

  @ApiProperty({description: 'method'})
  @IsOptional()
  @IsString()
  method?:string
}

export class getPresignedUrlDto{
  @ApiProperty({description: 'key'})
  @IsNotEmpty()
  key:string
}
export class elementsFilterDto{
  @ApiProperty({description: 'key'})
  @IsNotEmpty()
  key:string

  @ApiProperty({description: 'group'})
  @IsOptional()
  @IsString()
  group?:string

  @ApiProperty({description: 'control'})
  @IsOptional()
  @IsString()
  control?:string
}

export class getMapperDetailsDto{
  @ApiProperty({description: 'ufkey'})
  @IsNotEmpty()
  ufkey:string

  @ApiProperty({description: 'componentId'})
  @IsOptional()
  @IsString()
  componentId:string

  @ApiProperty({description: 'category'})
  @IsOptional()
  @IsString()
  category:string

  @ApiProperty({description: 'controlId'})
  @IsOptional()
  @IsString()
  controlId:string

  @ApiProperty({description: 'bindtranValue'})
  @IsOptional()
  bindtranValue?:any

  @ApiProperty({description: 'code'})
  @IsOptional()
  code?:any

  @ApiProperty({description: 'dpdKey'})
  @IsOptional()
  @IsString()
  dpdKey?:string

  @ApiProperty({description: 'method'})
  @IsOptional()
  @IsString()
  method?:string
}

export class codeExecutionDto{
  @ApiProperty({description: 'stringCode'})
  @IsString()
  stringCode:string

  @ApiProperty({description: 'params'})
  @IsString()
  params:string
}

export class codefilterDto{
  @ApiProperty({description: 'key'})
  @IsNotEmpty()
  key:string

  @ApiProperty({description: 'groupId'})
  @IsOptional()
  groupId?:any

  @ApiProperty({description: 'controlId'})
  @IsOptional()
  @IsString()
  controlId?:string

  @ApiProperty({description: 'event'})
  @IsOptional()
  event?:any

  @ApiProperty({description: 'dpdKey'})
  @IsOptional()
  @IsString()
  dpdKey?:string

  @ApiProperty({description: 'method'})
  @IsOptional()
  @IsString()
  method?:string
}

export class paginationDataFilterDto{
  @ApiProperty({description: 'key'})
  @IsNotEmpty()
  key:string
  @IsOptional()
  @IsString()
  dfdType?:string
  @ApiProperty({description: 'data'})
  @IsOptional()
  data?:any
  @ApiProperty({description: 'dpdKey'})
  @IsOptional()
  @IsString()
  dpdKey?:string
  @ApiProperty({description: 'method'})
  @IsOptional()
  @IsString()
  method?:string
  @ApiProperty({description: 'primaryKey'})
  @IsOptional()
  @IsString()
  primaryKey?:string
}

export class InitiatePFDto{
  @ApiProperty({description: 'key'})
  @IsNotEmpty()
  key:string

  @ApiProperty({description: 'sourceId'})
  @IsOptional()
  sourceId:any

  @ApiProperty({description: 'dpdKey'})
  @IsOptional()
  @IsString()
  dpdKey?:string

  @ApiProperty({description: 'method'})
  @IsOptional()
  @IsString()
  method?:string
}

export class fetchActionDetailsDto{
  @ApiProperty({description: 'key'})
  @IsNotEmpty()
  key:string

  @ApiProperty({description: 'groupId'})
  @IsOptional()
  @IsString()
  groupId:string

  @ApiProperty({description: 'controlId'})
  @IsOptional()
  @IsString()
  controlId:string
}

export class fetchRuleDetailsDto{
  @ApiProperty({description: 'key'})
  @IsNotEmpty()
  key:string

  @ApiProperty({description: 'groupId'})
  @IsOptional()
  @IsString()
  groupId:string

  @ApiProperty({description: 'controlId'})
  @IsOptional()
  @IsString()
  controlId:string
}

export class ifoDto{
  @ApiProperty({description: 'formData'})
  @IsOptional()
  formData:any

  @ApiProperty({description: 'key'})
  @IsOptional()
  @IsString()
  key:string

  @ApiProperty({description: 'controlId'})
  @IsOptional()
  @IsString()
  controlId:string

  @ApiProperty({description: 'isTable'})
  @IsOptional()
  @IsBoolean()
  isTable?:boolean

  @ApiProperty({description: 'dpdKey'})
  @IsOptional()
  @IsString()
  dpdKey?:string

  @ApiProperty({description: 'method'})
  @IsOptional()
  @IsString()
  method?:string
}

export class myAccountForClientdto{
  @ApiProperty({description: 'key'})
  @IsNotEmpty()
  key:string

  @ApiProperty({description: 'dpdKey'})
  @IsOptional()
  @IsString()
  dpdKey?:string

  @ApiProperty({description: 'method'})
  @IsOptional()
  @IsString()
  method?:string
}

export class introspectDto{
  @ApiProperty({description: 'key'})
  @IsNotEmpty()
  key:string

  @ApiProperty({description: 'dpdKey'})
  @IsOptional()
  @IsString()
  dpdKey?:string

  @ApiProperty({description: 'method'})
  @IsOptional()
  @IsString()
  method?:string
}

export class signinToTorusDto{
  @ApiPropertyOptional({description: 'client'})
  @IsString()
  @IsOptional()
  client:string

  @ApiProperty({description: 'username'})
  @IsString()
  username:string

  @ApiPropertyOptional({description: 'password'})
  @IsString()
  @IsOptional()
  password:string

  @ApiProperty({description: 'type'})
  @IsOptional()
  @IsEnum({ t: 't', c: 'c' })
  type:'t' | 'c' = 't'

  @ApiProperty({description: 'dpdKey'})
  @IsOptional()
  @IsString()
  dpdKey?:string

  @ApiProperty({description: 'method'})
  @IsOptional()
  @IsString()
  method?:string

  @ApiProperty({description: 'ufClientType'})
  @IsOptional()
  @IsString()
  ufClientType?:string

  @ApiPropertyOptional({description: 'app_tenant'})
  @IsOptional()
  @IsString()
  app_tenant?:string

  @ApiPropertyOptional({description: 'app_tenant_id'})
  @IsOptional()
  @IsNumber()
  app_tenant_id?:number

  @ApiPropertyOptional({description: 'fusionAuthLoginResponse'})
  @IsOptional()
  fusionAuthLoginResponse?:any

  @ApiPropertyOptional({description: 'isOauthUser'})
  @IsOptional()
  @IsBoolean()
  isOauthUser?:boolean
}

export interface errorObj{
  tname : string,
  errGrp: string,
  fabric: string,
  errType:string,
  errCode:string,
}

// ─── LOGTYPE ────────────────────────────────────────────────────────────────────
export enum LogType {
  MONGO = 'mongodb',
  DFS = 'dfs',
}


// ─── API ────────────────────────────────────────────────────────────────────
export class ApiEndpointDto {
  @IsOptional() @IsString() HOST?: string;
  @IsOptional() @IsString() PORT?: string;
}

export class apiConfigDto {
  @IsOptional() @ValidateNested() @Type(() => ApiEndpointDto) debug?: ApiEndpointDto;
  @IsOptional() @ValidateNested() @Type(() => ApiEndpointDto) release?: ApiEndpointDto;
  @IsOptional() @ValidateNested() @Type(() => ApiEndpointDto) scheduler?: ApiEndpointDto;
}

// ─── IAM ────────────────────────────────────────────────────────────────────

 export class OAuthProviderDto {
  @IsOptional() @IsString() clientId?: string;
  @IsOptional() @IsString() clientSecret?: string;
}

export class SsoEnabledDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() _type?: string;
  @IsOptional() @IsBoolean() value?: boolean;
  @IsOptional() @IsBoolean() enabled?: boolean;
  @IsOptional() @IsArray() selectionList?: any[];
}

export class SsoDto {
  @IsOptional() @ValidateNested() @Type(() => OAuthProviderDto) github?: OAuthProviderDto;
  @IsOptional() @ValidateNested() @Type(() => OAuthProviderDto) google?: OAuthProviderDto;
  @IsOptional() @ValidateNested() @Type(() => SsoEnabledDto) ssoEnabled?: SsoEnabledDto;
}

export class FusionAuthDto {
  @IsOptional() @IsString() host?: string;
  @IsOptional() @IsString() apiKey?: string;
}

export class IamDto {
  @IsOptional() @ValidateNested() @Type(() => SsoDto) sso?: SsoDto;
  @IsOptional() @ValidateNested() @Type(() => FusionAuthDto) fusionAuth?: FusionAuthDto;
}


// ─── DFS ────────────────────────────────────────────────────────────────────
export class SeaweedDto {
  @IsOptional() @IsString() HOST?: string;
  @IsOptional() @IsString() PASSWORD?: string;
  @IsOptional() @IsString() USERNAME?: string;
}

export class SeaweedS3Dto {
  @IsOptional() @IsString() HOST?: string;
  @IsOptional() @IsString() ACCESS_KEY?: string;
  @IsOptional() @IsString() SECRET_KEY?: string;
  @IsOptional() @IsString() BUCKET_NAME?: string;
}

export class DfsConfigDto {
  @IsOptional() @ValidateNested() @Type(() => SeaweedDto) seaweed?: SeaweedDto;
  @IsOptional() @ValidateNested() @Type(() => SeaweedS3Dto) seaweedS3?: SeaweedS3Dto;
}

// ─── KAFKA ──────────────────────────────────────────────────────────────────
export class KafkaBrokerItemDto {
  @IsOptional() @IsString() host?: string;
  @IsOptional() @IsString() port?: string;
}

export class KafkaBrokersDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() _type?: string;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => KafkaBrokerItemDto) items?: KafkaBrokerItemDto[];
  @IsOptional() @IsString() _label?: string;
}

export class KafkaDto {
  @IsOptional() @ValidateNested() @Type(() => KafkaBrokersDto) brokers?: KafkaBrokersDto;
  @IsOptional() @IsString() client_id?: string;
}

// ─── MYSQL ──────────────────────────────────────────────────────────────────

export class MysqlDto {
  @IsOptional() @IsString() MYSQL_HOST?: string;
  @IsOptional() @IsString() MYSQL_PORT?: string;
  @IsOptional() @IsString() MYSQL_PASSWORD?: string;
  @IsOptional() @IsString() MYSQL_USERNAME?: string;
  @IsOptional() @IsString() MYSQL_SCHEMANAME?: string;
  @IsOptional() @IsString() MYSQL_DATABASENAME?: string;
}

// ─── GITHUB ─────────────────────────────────────────────────────────────────

export class GithubDto {
  @IsOptional() @IsString() GITREPO_URL?: string;
  @IsOptional() @IsString() GITREPO_TOKEN?: string;
  @IsOptional() @IsString() GITREPO_BRANCH?: string;
  @IsOptional() @IsString() GITREPO_AUTHNAME?: string;
  @IsOptional() @IsString() GITREPO_USERNAME?: string;
  @IsOptional() @IsString() GITREPO_AUTHEMAIL?: string;
}

// ─── ORACLE ─────────────────────────────────────────────────────────────────

export class OracleDto {
  @IsOptional() @IsString() ORACLE_HOST?: string;
  @IsOptional() @IsString() ORACLE_PORT?: string;
  @IsOptional() @IsString() ORACLE_PASSWORD?: string;
  @IsOptional() @IsString() ORACLE_USERNAME?: string;
  @IsOptional() @IsString() ORACLE_SERVICENAME?: string;
}

// ─── JENKINS ────────────────────────────────────────────────────────────────

export class JenkinsDto {
  @IsOptional() @IsString() BRANCH?: string;
  @IsOptional() @IsString() JENKINS_URL?: string;
  @IsOptional() @IsString() JENKINS_TOKEN?: string;
  @IsOptional() @IsString() JENKINS_USERNAME?: string;
}

// ─── MONGODB ────────────────────────────────────────────────────────────────

export class MongodbDto {
  @IsOptional() @IsString() MONGODB_HOST?: string;
  @IsOptional() @IsString() MONGODB_PORT?: string;
  @IsOptional() @IsString() MONGODB_PASSWORD?: string;
  @IsOptional() @IsString() MONGODB_USERNAME?: string;
  @IsOptional() @IsString() MONGODB_DATABASENAME?: string;
}

// ─── POSTGRES ───────────────────────────────────────────────────────────────

export class PostgresDto {
  @IsOptional() @IsString() POSTGRES_HOST?: string;
  @IsOptional() @IsString() POSTGRES_PORT?: string;
  @IsOptional() @IsString() POSTGRES_PASSWORD?: string;
  @IsOptional() @IsString() POSTGRES_USERNAME?: string;
  @IsOptional() @IsString() POSTGRES_SCHEMANAME?: string;
  @IsOptional() @IsString() POSTGRES_DATABASENAME?: string;
}

// ─── BUILD TYPE ─────────────────────────────────────────────────────────────

export class BuildTypeDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() _type?: string;
  @IsOptional() @IsString() value?: string;
  @IsOptional() @IsBoolean() enabled?: boolean;
  @IsOptional() @IsArray() selectionList?: any[];
}

// ─── ENCRYPTION ─────────────────────────────────────────────────────────────

export class EncryptionItemDto {
  // Vault / token-based
  @IsOptional() @IsString() key?: string;
  @IsOptional() @IsString() url?: string;
  @IsOptional() @IsString() type?: string;
  @IsOptional() @IsString() token?: string;

  // Symmetric (AES / DES)
  @IsOptional() @IsString() Key?: string;
  @IsOptional() @IsString() mode?: string;
  @IsOptional() @IsString() IVlength?: string;

  // Asymmetric (RSA / EC)
  @IsOptional() @IsString() publicKey?: string;
  @IsOptional() @IsString() privateKey?: string;
}

export class EncryptionInfoDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() _type?: string;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => EncryptionItemDto) items?: EncryptionItemDto[];
  @IsOptional() @IsBoolean() enabled?: boolean;
}

export class EncryptionTypeDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() _type?: string;
  @IsOptional() @IsString() value?: string;
  @IsOptional() @IsBoolean() enabled?: boolean;
  @IsOptional() @IsArray() selectionList?: any[];
}

export class EncryptionDto {
  @IsOptional() @ValidateNested() @Type(() => EncryptionInfoDto) encryptionInfo?: EncryptionInfoDto;
  @IsOptional() @ValidateNested() @Type(() => EncryptionTypeDto) encryptionType?: EncryptionTypeDto;
}

// ─── FILE SERVER ─────────────────────────────────────────────────────────────
export class FileServerDto {
  @IsOptional() @IsString() HOST?: string;
  @IsOptional() @IsString() PATH?: string;
  @IsOptional() @IsString() PORT?: string;
  @IsOptional() @IsString() PASSWORD?: string;
  @IsOptional() @IsString() USERNAME?: string;
  @IsOptional() @IsString() VarnishURL?: string;
}

// ─── AMD PERSISTENCE ────────────────────────────────────────────────────────

export class AmdMongoDto {
  @IsOptional() @IsString() HOST?: string;
  @IsOptional() @IsString() PORT?: string;
  @IsOptional() @IsString() PASSWORD?: string;
  @IsOptional() @IsString() USERNAME?: string;
  @IsOptional() @IsString() DATABASENAME?: string;
}

export class AmdRedisDto {
  @IsOptional() @IsString() REDIS_HOST?: string;
  @IsOptional() @IsString() REDIS_PORT?: string;
  @IsOptional() @IsString() REDIS_PASSWORD?: string;
  @IsOptional() @IsString() REDIS_USERNAME?: string;
}

export class AmdPersistenceDto {
  @IsOptional() @ValidateNested() @Type(() => AmdMongoDto) mongo?: AmdMongoDto;
  @IsOptional() @ValidateNested() @Type(() => AmdRedisDto) redis?: AmdRedisDto;
}

// ─── APPLICATION DB TYPE ─────────────────────────────────────────────────────

export class ApplicationDBTypeDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() _type?: string;
  @IsOptional() @IsString() value?: string;
  @IsOptional() @IsBoolean() enabled?: boolean;
  @IsOptional() @IsArray() selectionList?: any[];
}

// ─── EXTERNAL CONNECTORS — DB ────────────────────────────────────────────────

export class ExternalDbOptionsDto {
  @IsOptional() @IsBoolean() ssl?: boolean;
  @IsOptional() @IsNumber() connectTimeoutMS?: number;
}

export class ExternalDbCredentialsDto {
  @IsOptional() @IsString() host?: string;
  @IsOptional() @IsNumber() port?: number;
  @IsOptional() @IsString() schema?: string;
  @IsOptional() @IsString() database?: string;
  @IsOptional() @IsString() password?: string;
  @IsOptional() @IsString() username?: string;
}

export class ExternalDbItemDto {
  @IsOptional() @IsString() type?: string;
  @IsOptional() @ValidateNested() @Type(() => ExternalDbOptionsDto) options?: ExternalDbOptionsDto;
  @IsOptional() @ValidateNested() @Type(() => ExternalDbCredentialsDto) credentials?: ExternalDbCredentialsDto;
  @IsOptional() @IsString() connectorName?: string;
}

export class ExternalConnectorsDbDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() _type?: string;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => ExternalDbItemDto) items?: ExternalDbItemDto[];
  @IsOptional() @IsBoolean() enabled?: boolean;
}

// ─── EXTERNAL CONNECTORS — FILE ──────────────────────────────────────────────

export class ExternalFileOptionsDto {
  @IsOptional() @IsNumber() port?: number;
  @IsOptional() @IsNumber() timeout?: number;
}

export class ExternalFileCredentialsDto {
  @IsOptional() @IsString() url?: string;
  @IsOptional() @IsString() host?: string;
  @IsOptional() @IsString() port?: string;
  @IsOptional() @IsString() password?: string;
  @IsOptional() @IsString() username?: string;
}

export class ExternalFileItemDto {
  @IsOptional() @IsString() path?: string;
  @IsOptional() @IsString() access?: string;
  @IsOptional() @IsString() method?: string;
  @IsOptional() @ValidateNested() @Type(() => ExternalFileOptionsDto) options?: ExternalFileOptionsDto;
  @IsOptional() @ValidateNested() @Type(() => ExternalFileCredentialsDto) credentials?: ExternalFileCredentialsDto;
  @IsOptional() @IsString() connectorName?: string;
}

export class ExternalConnectorsFileDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() _type?: string;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => ExternalFileItemDto) items?: ExternalFileItemDto[];
  @IsOptional() @IsBoolean() enabled?: boolean;
}

// ─── EXTERNAL CONNECTORS — STREAM ────────────────────────────────────────────

export class ExternalStreamOptionsDto {
  @IsOptional() @IsBoolean() blocking?: boolean;
  @IsOptional() @IsString() readFrom?: string;
  @IsOptional() @IsBoolean() acknowledge?: boolean;
  @IsOptional() @IsNumber() blockTimeout?: number;
}

export class ExternalStreamCredentialsDto {
  @IsOptional() @IsString() host?: string;
  @IsOptional() @IsString() port?: string;
  @IsOptional() @IsString() password?: string;
  @IsOptional() @IsString() username?: string;
}

export class ExternalStreamItemDto {
  @IsOptional() @IsString() access?: string;
  @IsOptional() @IsString() stream?: string;
  @IsOptional() @ValidateNested() @Type(() => ExternalStreamOptionsDto) options?: ExternalStreamOptionsDto;
  @IsOptional() @IsString() protocol?: string;
  @IsOptional() @ValidateNested() @Type(() => ExternalStreamCredentialsDto) credentials?: ExternalStreamCredentialsDto;
  @IsOptional() @IsString() consumerName?: string;
  @IsOptional() @IsString() connectorName?: string;
  @IsOptional() @IsString() consumerGroup?: string;
}

export class ExternalConnectorsStreamDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() _type?: string;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => ExternalStreamItemDto) items?: ExternalStreamItemDto[];
  @IsOptional() @IsBoolean() enabled?: boolean;
}

export class ImportClientOptions {
 @ApiProperty({ enum: LogType, example: LogType.MONGO })
 @IsEnum(LogType)
 logType: LogType;
 
 @ApiProperty({ description: 'source', example: 'TT001' })
 @IsNotEmpty()
 @IsString()
 source: string;

 @ApiProperty({ description: 'target', example: 'TT002' })
 @IsNotEmpty()
 @IsString()
 target: string;

 @ApiProperty({ description: 'deploymentKeyInfo', example: {} })
 @IsNotEmpty()
 @IsString()
 deploymentKeyInfo: Object;
}

export class SetUpKeyInfoDto {
  @ApiProperty({ example: 'CK:TGA:FNGK:SETUP:FNK:*:CATK:CT005:AFGK:V001:AFK:VGPH001:AFVK:v1' })
  @IsString()
  appprefix: string;

  @ApiProperty({ example: 'CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:CT005:AFK:PROFILE:AFVK:v1' })
  @IsString()
  tenantprefix: string;
}

export class exportdata {
  @ApiProperty({ type: SetUpKeyInfoDto })
  @ValidateNested()
  @Type(() => SetUpKeyInfoDto)
  setUpKeyInfo: SetUpKeyInfoDto;

  @ApiProperty({ example: 'TT001' })
  @IsString()
  tenantCode: string;

  @ApiProperty({ example: 'CK:TGA:FNGK:BLDC:FNK:DEV:CATK:TT001:AFGK:Torus20261:AFK:Torus202601:AFVK:v1:bldc' })
  @IsString()
  bldcKey: string;
}

export class LockDetailsDto {
  @ApiPropertyOptional({ description: 'ttl' })
  @IsOptional()
  @IsNumber()
  ttl?: number;
}

export class teSaveDto {
  @ApiProperty({ description: 'key' })
  @IsNotEmpty()
  @IsString()
  key: string;

  @ApiProperty({ description: 'data' })
  @IsNotEmpty()
  data: any;

  @ApiProperty({ description: 'nodeId' })
  @IsNotEmpty()
  @IsString()
  nodeId: string;

  @ApiProperty({ description: 'nodeName' }) 
  @IsNotEmpty() 
  @IsString()
  nodeName: string;

  @ApiProperty({ description: 'nodeType' })
  @IsNotEmpty()
  @IsString()
  nodeType: string;

  @ApiProperty({ description: 'event' })
  @IsNotEmpty()
  @IsString()
  event: string;

  @ApiPropertyOptional({ description: 'upId' })
  @IsOptional()
  upId?: any;

  @ApiPropertyOptional({ description: 'sourceId' })
  @IsOptional()
  @IsString()
  sourceId?: string;

  @ApiPropertyOptional({ description: 'childTable' })
  @IsOptional()
  childTable?: any;

  @ApiPropertyOptional({ description: 'ssKey' })
  @IsOptional()
  @IsString()
  ssKey?: string;

  @ApiPropertyOptional({ description: 'controlName' })
  @IsOptional()
  @IsString()
  controlName?: string;

  @ApiPropertyOptional({ type: LockDetailsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => LockDetailsDto)
  lockDetails?: LockDetailsDto;

  @ApiPropertyOptional({ description: 'dpdKey' })
  @IsOptional()
  @IsString()
  dpdKey?: string;

  @ApiPropertyOptional({ description: 'method' })
  @IsOptional()
  @IsString()
  method?: string;
}

export class LockRecordDto {
  @IsString()
  @IsNotEmpty()
  tableName: string;

  @IsString()
  @IsNotEmpty()
  key: string;

  @IsNotEmpty()
  value: string | number;

  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class LockRecordBodyDto {
  @IsString()
  @IsNotEmpty()
  tableName: string;

  @IsString()
  @IsNotEmpty()
  key: string;

  @IsNotEmpty()
  value: string | number;

  @IsString()
  @IsOptional()
  userId: string;
}
