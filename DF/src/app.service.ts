





import { Injectable, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import { UfService } from './Torus/v1/uf/uf.service';
import { CommonService } from './common.Service';

@Injectable()
export class AppService implements OnModuleInit{
  private readonly apiUrl = process.env.API_URL;
  private readonly clientcode = process.env.CLIENTCODE;
  constructor(private readonly ufservice: UfService,
  private readonly commonService: CommonService) {}

  async onModuleInit() {
    console.log('Application started, calling API...');
    console.log('DDL changes update started.');
    console.log('DDL changes update completed.');    
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnQiOiJDSTAwMSIsImxvZ2luSWQiOiJzZWx2YSIsInNpZCI6ImM1MTAzNzQ4LTgzOWMtNDRlNS05M2YzLTdjNjliZDg2ZGI3YyIsImxvZ1R5cGUiOiJtb25nb2RiIiwidHlwZSI6ImMiLCJpYXQiOjE3NzM4MDc5NjksImV4cCI6MTc3MzgwOTE2OX0.kO5puFGtVJmT-op72w3sARnThNJSPk8NjHjMog1Jq4g';
    let preParedData:any=await this.dataPrep(JSON.parse(fs.readFileSync('./swagger.json', 'utf-8')))
    if(Object.keys(preParedData).includes('torusApis'))
    {
      let torusData: any = {};
      //let endPointData : any = {};
      //endPointData.data = preParedData?.torusApis||{}
      //endPointData.type =  "json";
      //let res =  await axios.post(this.apiUrl+'/getEndPoints', endPointData);
      //torusData.endpoint = res.data;
      torusData.tenant =  "CI001";
      torusData.domain = "appgroup"; 
      torusData.collection = "application1";
      torusData.fabric = 'API-APIPD-TORUS';
      torusData.data = preParedData?.torusApis||{}
      torusData.loginId = "selva";    
      //await axios.post(this.apiUrl, torusData);
    }
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
