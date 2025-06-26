
import { Injectable, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';

@Injectable()
export class AppService implements OnModuleInit{
  private readonly apiUrl = process.env.API_URL;

  async onModuleInit() {
    console.log('Application started, calling API...');
    let preParedData:any=await this.dataPrep(JSON.parse(fs.readFileSync('./swagger.json', 'utf-8')))
    if(Object.keys(preParedData).includes('erdWithData'))
      {
      let endPointData : any = {};
      let erdDatas: any = {};
      endPointData.data = preParedData?.erdWithData||{}
      endPointData.type =  "json";
    //  let res =  await axios.post(this.apiUrl+'/getEndPoints', endPointData);
     // erdDatas.endpoint = res.data
    //  erdDatas.tenant =  "CT242";
    //  erdDatas.domain = "TOB001";
    //  erdDatas.collection = "TOB002";
    //  erdDatas.data = preParedData?.erdWithData||{}
    //  erdDatas.fabric = 'API-APIPD-INT';
    //  erdDatas.loginId = "john";    
     // erdDatas.erdFlag = true;  
      //await axios.post(this.apiUrl+'/createApiCollection', erdDatas);
      }

    if(Object.keys(preParedData).includes('torusApis'))
    {
      let torusData: any = {};
      //let endPointData : any = {};
      //endPointData.data = preParedData?.torusApis||{}
      //endPointData.type =  "json";
      //let res =  await axios.post(this.apiUrl+'/getEndPoints', endPointData);
      //torusData.endpoint = res.data;
      torusData.tenant =  "CT242";
      torusData.domain = "TOB001"; 
      torusData.collection = "TOB002";
      torusData.fabric = 'API-APIPD-TORUS';
      torusData.data = preParedData?.torusApis||{}
      torusData.loginId = "john";    
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
