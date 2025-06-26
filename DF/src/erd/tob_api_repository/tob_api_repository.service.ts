

import { HttpException, Injectable,HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CommonService } from 'src/common.Service';



@Injectable()
export class tob_api_repositoryService {
  constructor(private readonly prismaService: PrismaService,
  private readonly commonService: CommonService) {}
  private encryptedCols: any={
  "tob_consent_status": [
    {
      "column": "lfi",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "TOB_CONSENT_LFI"
    }
  ],
  "tob_consents": [],
  "tob_consents_history": [],
  "tob_lfi_consent": [
    {
      "column": "data",
      "isRequired": true,
      "dataType": "Object",
      "interRelation": "TOB_LFI_DATA"
    }
  ],
  "tob_consent_lfi": [
    {
      "column": "onbehalfof",
      "isRequired": false,
      "dataType": "Array",
      "interRelation": "TOB_CONSENT_ONBEHALFOF"
    }
  ],
  "tob_consent_onbehalfof": [
    {
      "column": "consentkey",
      "isRequired": false,
      "dataType": "Array",
      "interRelation": "TOB_CONSENT_CONSENTKEY"
    }
  ],
  "tob_consent_consentkey": [],
  "tob_lfi_data": [],
  "tob_consent_request": [
    {
      "column": "request",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "TOB_CONSENT_REQ"
    },
    {
      "column": "consentbody",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "TOB_CONSENTBODY"
    },
    {
      "column": "tpp",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "TOB_TPP"
    },
    {
      "column": "psuidentifiers",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "TOB_psuidentifiers"
    },
    {
      "column": "tob_api_process_logs",
      "isRequired": true,
      "dataType": "childtable"
    }
  ],
  "tob_api_repository": [
    {
      "column": "tob_api_process_logs",
      "isRequired": true,
      "dataType": "childtable"
    }
  ],
  "tob_api_process_logs": [],
  "tob_subscription_webhook": [],
  "tob_subscription_consentreq": [
    {
      "column": "webhook",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "TOB_SUBSCRIPTION_Webhook"
    }
  ],
  "tob_sub_webhook": [],
  "tob_subscription_consentbody": [
    {
      "column": "webhook",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "TOB_SUB_Webhook"
    }
  ],
  "tob_ctbody_onbehalfof": [],
  "tob_request_consent": [
    {
      "column": "onbehalfof",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "TOB_REQUEST_ONBEHALFOF"
    },
    {
      "column": "openfinancebilling",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "TOB_OPENFINANCE_BILLING"
    }
  ],
  "tob_request_onbehalfof": [],
  "tob_openfinance_billing": [],
  "tob_consentbody": [
    {
      "column": "data",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "TOB_CTBODY_DATA"
    },
    {
      "column": "meta",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "TOB_CONBODY_MultipleAuth"
    },
    {
      "column": "subscription",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "TOB_SUBSCRIPTION_CONSENTBODY"
    }
  ],
  "tob_ctbody_data": [
    {
      "column": "onbehalfof",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "TOB_CTBODY_ONBEHALFOF"
    },
    {
      "column": "openfinancebilling",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "TOB_CTBODY_OPENFINANCEBILLING"
    }
  ],
  "tob_tpp": [
    {
      "column": "decodedssa",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "TOB_DECODEDSSA"
    }
  ],
  "tob_decodedssa": [],
  "tob_conbody_multipleauth": [
    {
      "column": "multipleauthorizers",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "TOB_MULTIAUTH"
    }
  ],
  "tob_multiauth": [
    {
      "column": "authorizations",
      "isRequired": false,
      "dataType": "Array",
      "interRelation": "TOB_MULTIAUTH_TOTALREQ"
    }
  ],
  "tob_multiauth_totalreq": [],
  "tob_consent_req": [
    {
      "column": "consent",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "TOB_REQUEST_CONSENT"
    },
    {
      "column": "subscription",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "TOB_SUBSCRIPTION_CONSENTREQ"
    }
  ],
  "tob_ctbody_openfinancebilling": [],
  "tob_psuidentifiers": []
}

  async encryptData(data: any, tableName: string, method) {
    let encryptedData = { ...data };
    const columns = this.encryptedCols[tableName];
    if (!columns) return encryptedData;
    for (const table of columns) {
      if (table?.column in data && table.dataType === 'String') {
        const encryptedValue = await this.commonService.encrypt(
          data[table.column],table.column
        );
        encryptedData[table.column] = encryptedValue;
      } else if (table?.column in data && table.dataType === 'childtable') {
        if (
          data[table.column][method] &&
          !Array.isArray(data[table.column][method])
        ) {
          encryptedData[table.column][method] = await this.encryptData(
            data[table.column][method],
            table.column,
            method,
          );
        } else if (
          data[table.column][method] &&
          Array.isArray(data[table.column][method])
        ) {
          let tempArray = [];
          for (const chlldArray of data[table.column][method]) {
            tempArray.push(
              await this.encryptData(chlldArray, table.column, method),
            );
          }
          encryptedData[table.column]['create'] = tempArray;
        }
      } else if (
        table?.column in data &&
        table.dataType === 'Object'
      ) {
        let encryptedValue : any;
          if(Object.keys(data[table.column])[0] == "some"){
            encryptedValue = await this.encryptData(
              data[table.column].some,
              table?.interRelation,
              method,
            );
            encryptedData[table.column]["some"] = encryptedValue;
          }else if(Object.keys(data[table.column])[0] == "is"){
            encryptedValue = await this.encryptData(
              data[table.column].is,
              table?.interRelation,
              method,
            );
            encryptedData[table.column]["is"] = encryptedValue;
          }else{
            encryptedValue = await this.encryptData(
              data[table.column],
              table?.interRelation,
              method,
            );
            encryptedData[table.column] = encryptedValue;
          }
      } else if (
        table?.column in data &&
        table.dataType === 'Array' &&
        table?.interRelation != ''
      ) {
        let arrayObject: any = [];
        let check = data[table.column]
        if(!Array.isArray(check)){
          let encryptedValue : any;
          if(Object.keys(check)[0] == "some"){
            encryptedValue = await this.encryptData(
              check.some,
              table?.interRelation,
              method,
            );
            encryptedData[table.column]["some"] = encryptedValue;
          }
          if(Object.keys(check)[0] == "is"){
            encryptedValue = await this.encryptData(
              check.is,
              table?.interRelation,
              method,
            );
            encryptedData[table.column]["is"] = encryptedValue;
          }
        
        }else{
          for (const eachObject of data[table.column]) {
            const encryptedValue = await this.encryptData(
              eachObject,
              table?.interRelation,
              method,
            );
            arrayObject.push(encryptedValue);
          }
          encryptedData[table.column] = arrayObject;
        }
      }
    }
    return encryptedData;
  }

   async decryptData(data: any, tableName: string) {
    if (typeof data == 'string') return data;

    let encryptedData = { ...data };
    const columns = this.encryptedCols[tableName];
    if (!columns) return encryptedData;
    for (const table of columns) {
      if (table?.column in data && table.dataType == 'String') {
        if (
          data[table.column] != null &&
          data[table?.column] != '' &&
          data[table.column].startsWith('vault:')
        ) {
          const encryptedValue = await this.commonService.decrypt(
            data[table.column],
            table.column
          );
          encryptedData[table.column] = encryptedValue;
        }
      }
    }
    for (const key in encryptedData) {
      if (
        typeof encryptedData[key] === 'object' &&
        encryptedData[key] !== null
      ) {
        if (Array.isArray(encryptedData[key])) {
          let arrayDocName: string = '';
          this.encryptedCols[tableName].forEach((element: any) => {
            if (
              element.column == key &&
              element.interRelation != '' &&
              element.dataType == 'Array'
            ) {
              arrayDocName = element.interRelation;
            }
          });
          if (arrayDocName != '') {
            let tempArray = [];
            for (const eachObject of encryptedData[key]) {
              tempArray.push(await this.decryptData(eachObject, arrayDocName));
            }
            encryptedData[key] = tempArray;
          } else {
            let tempArray = [];
            for (const eachObject of encryptedData[key]) {
              tempArray.push(await this.decryptData(eachObject, key));
            }

            encryptedData[key] = tempArray;
          }
        } else if (Object.keys(encryptedData[key]).length > 0) {
          let docName: string = '';
          this.encryptedCols[tableName].forEach((element: any) => {
            if (
              element.column == key &&
              element.interRelation != '' &&
              (element.dataType == 'Object' || element.dataType == 'Array')
            ) {
              docName = element.interRelation;
            }
          });

          if (docName != '') {
            encryptedData[key] = await this.decryptData(
              encryptedData[key],
              docName,
            );
          } else {
            encryptedData[key] = await this.decryptData(
              encryptedData[key],
              key,
            );
          }
        }
      }
    }
    return encryptedData;
  }


  async findSchema (token) {
    const data = {
      id:"string",
      api_name:"string",
      version:"string",
      release_date:"Date",
      api_category:"string",
      server_url:"string",
      status:"string",
      api_resourcepath:"string",
      trs_created_date:"Date",
      trs_created_by:"string",
      trs_modified_date:"Date",
      trs_modified_by:"string",
      trs_next_status:"string",
      trs_status:"string",
      trs_process_id:"string",
      trs_access_profile:"string",
      trs_org_grp_code:"string",
      trs_org_code:"string",
      trs_role_grp_code:"string",
      trs_role_code:"string",
      trs_ps_grp_code:"string",
      trs_ps_code:"string"      
    }
    return data;
  }

  async findAllmethod(queryDto: any, limit:number,selectColumns:any,token:any) {
    try {
      let queryCondition:any ={}
      let queryValue:any = {}
      let columns:any = {}
      selectColumns?.forEach(element => {
        columns[element] = true
      });
      Object.keys(queryDto).forEach((key) => {
        if (key.includes('-')) {
          queryCondition[key.split('-')[0]] = key.split('-')[1]
          queryValue[key.split('-')[0]] = queryDto[key]
        }
      })      
      const { page }: { page: number } = queryDto;
      let query: any = {}; 
      const { api_name }: {api_name : Date} = queryValue;
      const { version }: {version : Date} = queryValue;
      const { release_date }: {release_date :  Date} = queryValue;
      const { api_category }: {api_category : Date} = queryValue;
      const { server_url }: {server_url : Date} = queryValue;
      const { status }: {status : Date} = queryValue;
      const { api_resourcepath }: {api_resourcepath : Date} = queryValue;

      if(api_name){ 
        query.api_name = { [queryCondition['api_name']]: api_name };
      }
      if(version){ 
        query.version = { [queryCondition['version']]: version };
      }
      if(release_date){ 
        query.release_date = { [queryCondition['release_date']]: release_date };
      }
      if(api_category){ 
        query.api_category = { [queryCondition['api_category']]: api_category };
      }
      if(server_url){ 
        query.server_url = { [queryCondition['server_url']]: server_url };
      }
      if(status){ 
        query.status = { [queryCondition['status']]: status };
      }
      if(api_resourcepath){ 
        query.api_resourcepath = { [queryCondition['api_resourcepath']]: api_resourcepath };
      }
      const skip = (page - 1) * limit;
      if (Object.keys(query).length > 0) {
        const banks = await this.prismaService.tob_api_repository.findMany({
          select:Object.keys(columns).length >0 ?columns: undefined,
          where:Object.keys(query).length >0 ?query: undefined,
        });
        let decryptedRes: any = [];
        for (const indiviual of banks) {
          const decryptedData = await this.decryptData(indiviual, 'tob_api_repository');
          decryptedRes.push(decryptedData);
        }
        return decryptedRes;
      }

      if(!skip && !limit && Object.keys(query).length == 0){

        const banks = await this.prismaService.tob_api_repository.findMany({
           select:Object.keys(columns).length >0 ? columns: undefined,
        });
        let decryptedRes: any = [];
        for (const indiviual of banks) {
          const decryptedData = await this.decryptData(indiviual, 'tob_api_repository');
          decryptedRes.push(decryptedData);
        }
        return decryptedRes;
      }

      const banks = await this.prismaService.tob_api_repository.findMany({
        select:Object.keys(columns).length >0 ? columns: undefined,
        where:Object.keys(query).length >0 ?query: undefined,
        skip: skip || undefined,
        take: limit || undefined,
      });

      const totalItems = await this.prismaService.tob_api_repository.count({
        where:Object.keys(query).length >0 ?query: undefined,
      });

      let decryptedRes: any = [];
      for (const indiviual of banks) {
        const decryptedData = await this.decryptData(indiviual, 'tob_api_repository');
        decryptedRes.push(decryptedData);
      }
      return {
        items: decryptedRes,
        totalPages: Math.ceil(totalItems / limit),
      };
    } catch (error) {
      const errorMessage = 'Error in findAllmethod';
      await this.commonService.errorLog(
        "Technical",
        'AK',
        'Fatal',
        "TG020",
        errorMessage,
        "CK:CT242:FNGK:AF:FNK:API-MSD:CATK:TOB001:AFGK:TOB002:AFK:TOB_LFI_Consents:AFVK:v1",
        token
      );
    }
  }

    async findOne(id:string,token : string) {
    try{
      const res = await this.prismaService.tob_api_repository.findUnique({ 
      where: {id,},
      select: {id:true,api_name:true,version:true,release_date:true,api_category:true,server_url:true,status:true,api_resourcepath:true,tob_api_process_logs:{
              select:{
                id:true,
        apiendpoint:true,        requestdata:true,        responsedata:true,        apiname:true,        sample:true,
        trs_created_date:true,
        trs_created_by:true,
        trs_modified_date:true,
        trs_modified_by:true,
        trs_next_status:true,
        trs_status:true,
        trs_process_id:true,
        trs_access_profile:true,
        trs_org_grp_code:true,
        trs_org_code:true,
        trs_role_grp_code:true,
        trs_role_code:true,
        trs_ps_grp_code:true,
        trs_ps_code:true
              }
            },
trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_next_status:true,trs_status:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true}
    });
    return await this.decryptData(res, 'tob_api_repository');
  } catch (error) {
    const errorMessage = 'find one Error';
        await this.commonService.errorLog(
          "Technical",
          'AK',
          'Fatal',
          "TG023",
          error,
          "CK:CT242:FNGK:AF:FNK:API-MSD:CATK:TOB001:AFGK:TOB002:AFK:TOB_LFI_Consents:AFVK:v1",
          token
        );
  }
  }

  async findAll(token : string) {
    try{
      const res = await this.prismaService.tob_api_repository.findMany({ 
      select: {id:true,api_name:true,version:true,release_date:true,api_category:true,server_url:true,status:true,api_resourcepath:true,tob_api_process_logs:{
              select:{
                id:true,
        apiendpoint:true,        requestdata:true,        responsedata:true,        apiname:true,        sample:true,
        trs_created_date:true,
        trs_created_by:true,
        trs_modified_date:true,
        trs_modified_by:true,
        trs_next_status:true,
        trs_status:true,
        trs_process_id:true,
        trs_access_profile:true,
        trs_org_grp_code:true,
        trs_org_code:true,
        trs_role_grp_code:true,
        trs_role_code:true,
        trs_ps_grp_code:true,
        trs_ps_code:true
              }
            },
trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_next_status:true,trs_status:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true}
      });
      let decryptedRes: any = [];
      for (const indiviual of res) {
        const decryptedData = await this.decryptData(indiviual, 'tob_api_repository');
        decryptedRes.push(decryptedData);
      }
      return decryptedRes;
    } catch (error) {
      const errorMessage = 'find All Error';
        await this.commonService.errorLog(
          "Technical",
          'AK',
          'Fatal',
          "TG023",
          error,
          "CK:CT242:FNGK:AF:FNK:API-MSD:CATK:TOB001:AFGK:TOB002:AFK:TOB_LFI_Consents:AFVK:v1",
          token
        );
    }
    }
    
  async findAllwithquery(token : string,whereClause : Prisma.tob_api_repositoryWhereInput) {
    try{
      whereClause = await this.encryptData(whereClause,'tob_api_repository','getAll')
      const res = await this.prismaService.tob_api_repository.findMany({ 
      where: whereClause,
      select: {id:true,api_name:true,version:true,release_date:true,api_category:true,server_url:true,status:true,api_resourcepath:true,tob_api_process_logs:{
              select:{
                id:true,
        apiendpoint:true,        requestdata:true,        responsedata:true,        apiname:true,        sample:true,
        trs_created_date:true,
        trs_created_by:true,
        trs_modified_date:true,
        trs_modified_by:true,
        trs_next_status:true,
        trs_status:true,
        trs_process_id:true,
        trs_access_profile:true,
        trs_org_grp_code:true,
        trs_org_code:true,
        trs_role_grp_code:true,
        trs_role_code:true,
        trs_ps_grp_code:true,
        trs_ps_code:true
              }
            },
trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_next_status:true,trs_status:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true}
      });
      let decryptedRes: any = [];
      for (const indiviual of res) {
        const decryptedData = await this.decryptData(indiviual, 'tob_api_repository');
        decryptedRes.push(decryptedData);
      }
      return decryptedRes;
    } catch (error) {
      const errorMessage = 'find All Error';
        await this.commonService.errorLog(
          "Technical",
          'AK',
          'Fatal',
          "TG023",
          error,
          "CK:CT242:FNGK:AF:FNK:API-MSD:CATK:TOB001:AFGK:TOB002:AFK:TOB_LFI_Consents:AFVK:v1",
          token
        );
    }
    }
    
  async create(createtob_api_repositoryDto: Prisma.tob_api_repositoryCreateInput,token:string) {
    try{
      const res = await this.prismaService.tob_api_repository.create({ 
      data: await this.encryptData(createtob_api_repositoryDto,'tob_api_repository','create'), 
      select:{id:true,api_name:true,version:true,release_date:true,api_category:true,server_url:true,status:true,api_resourcepath:true,tob_api_process_logs:true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_next_status:true,trs_status:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true}
    })
    return await this.decryptData(res, 'tob_api_repository');
  } catch (error) {
    const errorMessage = 'Create Error';

    await this.commonService.errorLog(
      "Technical",
      'AK',
      'Fatal',
      "TG022",
      error,
      "CK:CT242:FNGK:AF:FNK:API-MSD:CATK:TOB001:AFGK:TOB002:AFK:TOB_LFI_Consents:AFVK:v1",
      token

    );
  }
    
  }

    async update(id:string,updatetob_api_repositoryDto: Prisma.tob_api_repositoryUpdateInput,token:string) {    
      try{
      const res = await this.prismaService.tob_api_repository.update({
      where: {id,},
      data: await this.encryptData(updatetob_api_repositoryDto,'tob_api_repository','update'),
      select: {id:true,api_name:true,version:true,release_date:true,api_category:true,server_url:true,status:true,api_resourcepath:true,tob_api_process_logs:true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_next_status:true,trs_status:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true},
    });
    return await this.decryptData(res, 'tob_api_repository');
    } catch (error) {
        const errorMessage = 'update Error';
        await this.commonService.errorLog(
          "Technical",
          'AK',
          'Fatal',
          "TG023",
          error,
          "CK:CT242:FNGK:AF:FNK:API-MSD:CATK:TOB001:AFGK:TOB002:AFK:TOB_LFI_Consents:AFVK:v1",
          token
        );
    }    
}

    async remove(id:string,token : string) {
    try{
      const res = await this.prismaService.tob_api_repository.delete({
      where: {id, },
      select: {id:true,api_name:true,version:true,release_date:true,api_category:true,server_url:true,status:true,api_resourcepath:true,tob_api_process_logs:true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_next_status:true,trs_status:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true}
    });
    return res;
  } catch (error) {
    const errorMessage = 'Error in remove Data';
      await this.commonService.errorLog(
        "Technical",
        'AK',
        'Fatal',
        "TG026",
        error,
        "CK:CT242:FNGK:AF:FNK:API-MSD:CATK:TOB001:AFGK:TOB002:AFK:TOB_LFI_Consents:AFVK:v1",
        token
      );
  }
  }
}