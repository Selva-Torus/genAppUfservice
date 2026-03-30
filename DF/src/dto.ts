import { ApiProperty , ApiPropertyOptional} from "@nestjs/swagger";
import { IsEnum, IsOptional, IsNotEmpty, IsString, ValidateNested, IsObject, IsBoolean, IsArray, IsNumber} from 'class-validator';
import { Request } from 'express';
import { join } from 'path';
import { Type } from 'class-transformer';

export const FILE_UPLOADS_DIR = join(process.cwd(), 'uploads');

export const fileNameEditor = (
  req: Request,
  file: any,
  callback: (error: any, filename) => void,
) => {
  var ext = req?.headers?.filename ? req?.headers?.filename + '.' + file.originalname.split('.').pop() : file.originalname.split('.').pop();
  callback(null, ext);
};

export const imageFileFilter = (
  req: Request,
  file: any,
  callback: (error: any, valid: boolean) => void,
) => {
  // if (
  //   !file.originalname ||
  //   !file.originalname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/)
  // ) {
  //   return callback(
  //     new BadRequestException('File must be of type jpg|jpeg|png|gif|svg|webp'),
  //     false,
  //   );
  // }
  callback(null, true);
};

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
    nodeName?: string;
  
    isTable?:boolean
  }

  export class PoEvent {
    constructor(
     
      public pfdto:pfDto,
      public event: string,
      public pfs : any,
      public poJson: any,
      public pfo: any,
      public ndp : any,
      public flag : string,
      public page?:number,
      public count?:number,
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
      upId: any    
      event: string      
      data: any
      token:string    
      nodeId: string    
      nodeName:string    
      nodeType:string  
      sourceId:string
      refreshFlag : string
      dpdKey ?: string
      method?:string
      page?:number
      count?:number
      filterData?:object
      lock?:Object
      childTable?:any
      logicCenter?:boolean
      schedulerStatus?:string
      parentUpId?:string
      ssKey?:string
    }
  
    export class pageDto { 
      @IsNotEmpty()
      @IsString()
      key: string 
      //@IsNumber()     
      page: number
      //@IsNumber() 
      count: number   
      filterDetails?: object   
      searchFilter?:object      
      dpdKey?:string
      method?:string
      filterData?:string   
  }
  export class dataGet { 
    @IsNotEmpty()
    @IsString()
    key: string   
    filterDetails?: object   
    searchFilter?:object  
    dpdKey?:string
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
  dpdKey?:string
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
  componentId?:string

  @ApiProperty({description: 'controlId'})
  controlId?:string

  @ApiProperty({description: 'isTable'})
  isTable:boolean

  @ApiProperty({description: 'accessProfile'})
  accessProfile?:any[]
  
  @ApiProperty({description: 'dpdKey'})
  dpdKey?:string

  @ApiProperty({description: 'method'})
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
  group?:string

  @ApiProperty({description: 'control'})
  control?:string
}

export class getMapperDetailsDto{
  @ApiProperty({description: 'ufkey'})
  @IsNotEmpty()
  ufkey:string

  @ApiProperty({description: 'componentId'})
  componentId:string

  @ApiProperty({description: 'category'})
  category:string

  @ApiProperty({description: 'controlId'})
  controlId:string

  @ApiProperty({description: 'bindtranValue'})
  bindtranValue?:any

  @ApiProperty({description: 'code'})
  code?:any

  @ApiProperty({description: 'dpdKey'})
  dpdKey?:string

  @ApiProperty({description: 'method'})
  method?:string
}

export class codeExecutionDto{
  @ApiProperty({description: 'stringCode'})
  stringCode:string

  @ApiProperty({description: 'params'})
  params:string
}

export class codefilterDto{
  @ApiProperty({description: 'key'})
  @IsNotEmpty()
  key:string

  @ApiProperty({description: 'groupId'})
  groupId?:any

  @ApiProperty({description: 'controlId'})
  controlId?:string

  @ApiProperty({description: 'event'})
  event?:any

  @ApiProperty({description: 'dpdKey'})
  dpdKey?:string

  @ApiProperty({description: 'method'})
  method?:string
}

export class paginationDataFilterDto{
  @ApiProperty({description: 'key'})
  @IsNotEmpty()
  key:string
  dfdType?:string
  @ApiProperty({description: 'data'})
  data?:any
  @ApiProperty({description: 'dpdKey'})
  dpdKey?:string
  @ApiProperty({description: 'method'})
  method?:string
  @ApiProperty({description: 'primaryKey'})
  primaryKey?:string
}

export class InitiatePFDto{
  @ApiProperty({description: 'key'})
  @IsNotEmpty()
  key:string

  @ApiProperty({description: 'sourceId'})
  sourceId:any

  @ApiProperty({description: 'dpdKey'})
  dpdKey?:string

  @ApiProperty({description: 'method'})
  method?:string
}

export class fetchActionDetailsDto{
  @ApiProperty({description: 'key'})
  @IsNotEmpty()
  key:string

  @ApiProperty({description: 'groupId'})
  groupId:string

  @ApiProperty({description: 'controlId'})
  controlId:string
}

export class fetchRuleDetailsDto{
  @ApiProperty({description: 'key'})
  @IsNotEmpty()
  key:string

  @ApiProperty({description: 'groupId'})
  groupId:string

  @ApiProperty({description: 'controlId'})
  controlId:string
}

export class ifoDto{
  @ApiProperty({description: 'formData'})
  formData:any

  @ApiProperty({description: 'key'})
  key:string

  @ApiProperty({description: 'controlId'})
  controlId:string

  @ApiProperty({description: 'isTable'})
  isTable?:boolean

  @ApiProperty({description: 'dpdKey'})
  dpdKey?:string

  @ApiProperty({description: 'method'})
  method?:string
}

export class logoutDto{
  @ApiProperty({description: 'key'})
  @IsNotEmpty()
  key:string

  @ApiProperty({description: 'dpdKey'})
  dpdKey?:string

  @ApiProperty({description: 'method'})
  method?:string
}

export class myAccountForClientdto{
  @ApiProperty({description: 'key'})
  @IsNotEmpty()
  key:string

  @ApiProperty({description: 'dpdKey'})
  dpdKey?:string

  @ApiProperty({description: 'method'})
  method?:string
}

export class introspectDto{
  @ApiProperty({description: 'key'})
  @IsNotEmpty()
  key:string

  @ApiProperty({description: 'dpdKey'})
  dpdKey?:string

  @ApiProperty({description: 'method'})
  method?:string
}

export class signinToTorusDto{
  @ApiProperty({description: 'client'})
  client:string

  @ApiProperty({description: 'username'})
  username:string

  @ApiProperty({description: 'password'})
  password:string

  @ApiProperty({description: 'type'})
  type:'t' | 'c' = 't'

  @ApiProperty({description: 'dpdKey'})
  dpdKey?:string

  @ApiProperty({description: 'method'})
  method?:string

  @ApiProperty({description: 'ufClientType'})
  ufClientType?:string
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

