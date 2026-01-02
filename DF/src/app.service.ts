



import { Injectable, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import { UfService } from './Torus/v1/uf/uf.service';

@Injectable()
export class AppService implements OnModuleInit{
  private readonly apiUrl = process.env.API_URL;
  private readonly clientcode = process.env.CLIENTCODE;
  constructor(private readonly ufservice: UfService) {}

  async onModuleInit() {
    console.log('Application started, calling API...');
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnQiOiJDVDI2MSIsImxvZ2luSWQiOiJzcmlyYW0iLCJzaWQiOiJhYzQyNWMwOC1kMmY0LTRjOTctYmM1MC00YWUzNTM0ZTE0OTkiLCJsb2dUeXBlIjoibW9uZ29kYiIsInR5cGUiOiJjIiwiaWF0IjoxNzY3MzMxNjI1LCJleHAiOjE3NjczMzI4MjV9.0cGo43biedV3pzsmKDFlHvacW1BTsNgUgBR76nYcKyU';
    let preParedData:any=await this.dataPrep(JSON.parse(fs.readFileSync('./swagger.json', 'utf-8')))
    if(Object.keys(preParedData).includes('erdWithData'))
      {
      let endPointData : any = {};
      let erdDatas: any = {};
      endPointData.data = preParedData?.erdWithData||{}
      endPointData.type =  "json";
      let res =  await this.ufservice.getEndPoints(endPointData);
      //let res =  await axios.post(this.apiUrl+'/getEndPoints', endPointData,{
      //  headers: {
      //    Authorization: `Bearer ${token}`, 
      //  }
      //});
      erdDatas.endpoint = res;
      erdDatas.tenant =  "CT261";
      erdDatas.domain = "AppGroup";
      erdDatas.collection = "Veracious Message Convertor";
      erdDatas.data = preParedData?.erdWithData||{}
      erdDatas.fabric = 'API-APIPD';
      erdDatas.loginId = "sriram";    
      erdDatas.erdFlag = true;  
      await this.ufservice.createApiCollection(erdDatas,this.clientcode);
      //await axios.post(this.apiUrl+'/createApiCollection', erdDatas,{
      //  headers: {
      //    Authorization: `Bearer ${token}`, 
      //  }
      //});
      }
    if(Object.keys(preParedData).includes('torusApis'))
    {
      let torusData: any = {};
      //let endPointData : any = {};
      //endPointData.data = preParedData?.torusApis||{}
      //endPointData.type =  "json";
      //let res =  await axios.post(this.apiUrl+'/getEndPoints', endPointData);
      //torusData.endpoint = res.data;
      torusData.tenant =  "CT261";
      torusData.domain = "AppGroup"; 
      torusData.collection = "Veracious Message Convertor";
      torusData.fabric = 'API-APIPD-TORUS';
      torusData.data = preParedData?.torusApis||{}
      torusData.loginId = "sriram";    
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
