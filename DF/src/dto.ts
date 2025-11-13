import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from 'class-validator';
import { Request } from 'express';
import { join } from 'path';

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
      public childTable?:any
      ) {}
    }
 
    export class pfDto {
      @IsNotEmpty()
      @IsString()
      key: string      
      upId: string    
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

