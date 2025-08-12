
import { Injectable, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';

@Injectable()
export class AppService implements OnModuleInit{
  private readonly apiUrl = process.env.API_URL;

  async onModuleInit() {
    console.log('Application started, calling API...');
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbklkIjoiUGVlckA3ODYiLCJjbGllbnQiOiJDVDAwMyIsInR5cGUiOiJjIiwibG9nVHlwZSI6ImRmcyIsImlhdCI6MTc1NDg4NjE5MCwiZXhwIjoxNzU0OTcyNTkwfQ.OtZeaY3qK5DMruOHkIW8Dbe2JhAID7_41WOJhEaoYZw';
    let preParedData:any=await this.dataPrep(JSON.parse(fs.readFileSync('./swagger.json', 'utf-8')))
    if(Object.keys(preParedData).includes('erdWithData'))
      {
      let endPointData : any = {};
      let erdDatas: any = {};
      endPointData.data = preParedData?.erdWithData||{}
      endPointData.type =  "json";
      let res =  await axios.post(this.apiUrl+'/getEndPoints', endPointData,{
        headers: {
          Authorization: `Bearer ${token}`, 
        }
      });
      erdDatas.endpoint = res.data
      erdDatas.tenant =  "CT003";
      erdDatas.domain = "CG";
      erdDatas.collection = "TG2";
      erdDatas.data = preParedData?.erdWithData||{}
      erdDatas.fabric = 'API-APIPD-INT';
      erdDatas.loginId = "Peer@786";    
      erdDatas.erdFlag = true;  
      await axios.post(this.apiUrl+'/createApiCollection', erdDatas,{
        headers: {
          Authorization: `Bearer ${token}`, 
        }
      });
      }

    if(Object.keys(preParedData).includes('torusApis'))
    {
      let torusData: any = {};
      //let endPointData : any = {};
      //endPointData.data = preParedData?.torusApis||{}
      //endPointData.type =  "json";
      //let res =  await axios.post(this.apiUrl+'/getEndPoints', endPointData);
      //torusData.endpoint = res.data;
      torusData.tenant =  "CT003";
      torusData.domain = "CG"; 
      torusData.collection = "TG2";
      torusData.fabric = 'API-APIPD-TORUS';
      torusData.data = preParedData?.torusApis||{}
      torusData.loginId = "Peer@786";    
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
