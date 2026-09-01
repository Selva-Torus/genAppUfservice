


import { Injectable} from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import { UfService } from './Torus/v1/uf/uf.service';
import { CommonService } from './common.Service';
import { SwaggerGuard } from './swagger.guard';
@Injectable()
export class AppService {
  private readonly apiUrl = process.env.API_URL;
  private readonly clientcode = process.env.CLIENTCODE;
  private readonly loginId = process.env.LOGINID;
  private swaggerDocument: any = null;
  constructor(private readonly ufservice: UfService,
  private readonly swaggerGuard: SwaggerGuard,
  private readonly commonService: CommonService  ) {}

  setSwaggerDocument(document: any): void {
    this.swaggerDocument = document;
  }

   async initSwaggerUpload() {
    console.info('Starting Swagger upload to API Fabric...');
    if (!this.swaggerDocument) {
      console.warn('Swagger document not set — skipping Swagger upload to API Fabric.');
      return;
    }
    let preParedData:any=await this.dataPrep(this.swaggerDocument)
  }

  getHello(): string {
    return 'Hello World!';
  }
  
  dataPrep(allBody: any) {
    let appPaths: any = Object.keys(allBody?.paths);
    let erdWithData: any = structuredClone(allBody);
    let torusApis: any = structuredClone(allBody);

    erdWithData['paths'] = {};
    torusApis['paths'] = {};

    let onlyErdKeys = [];
    appPaths.map((keys:any) => {
      if (
        !keys.startsWith('/te/') &&
        !keys.startsWith('/UF/') &&
        !keys.startsWith('/expLog') &&
        !keys.startsWith('/prcLog') &&
        keys != '/'
      ) {
        onlyErdKeys.push(keys);
        erdWithData.paths[keys] = {};
      } else {
        torusApis.paths[keys] = allBody.paths[keys];
      }
    });
    onlyErdKeys.map((key:any) => {
      erdWithData.paths[key] = allBody.paths[key];
    });
    return {
      erdWithData,
      torusApis,
    };
  }
}
