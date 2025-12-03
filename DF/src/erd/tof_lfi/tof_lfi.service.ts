
import { HttpException, Injectable,HttpStatus,InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CommonService } from 'src/common.Service';
import { CustomException } from 'src/customException';
import { parsePrismaCreateError } from 'src/prisma-error-handler';



@Injectable()
export class tof_lfiService {
  constructor(private readonly prismaService: PrismaService,
  private readonly commonService: CommonService) {}
  private encryptedCols: any={
  "tof_lfi": [
    {
      "column": "lfi",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "TOF_LFI_Bank_Insu"
    }
  ],
  "tof_tpp": [
    {
      "column": "decodedssa",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "TOF_DECODEDSSA"
    }
  ],
  "tof_consents": [
    {
      "column": "lfi",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "TOF_CONSENTS_LFI"
    }
  ],
  "tof_consent_request": [
    {
      "column": "consent",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "TOF_REQUEST_CONSENT"
    },
    {
      "column": "subscription",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "TOF_SUBSCRIPTION"
    }
  ],
  "tof_consent_response": [
    {
      "column": "data",
      "isRequired": true,
      "dataType": "Object",
      "interRelation": "TOF_RESPONSE_DATA"
    }
  ],
  "tof_reqressub_webhook": [],
  "tof_reqressub_consentbody": [
    {
      "column": "webhook",
      "isRequired": true,
      "dataType": "Object",
      "interRelation": ""
    }
  ],
  "tof_sub_webhook": [],
  "tof_subscription_consentbody": [
    {
      "column": "webhook",
      "isRequired": true,
      "dataType": "Object",
      "interRelation": "TOF_SUB_Webhook"
    }
  ],
  "tof_response_ctbody_openfinancebilling": [],
  "tof_ctbody_onbehalfof": [],
  "tof_lfi_banks": [],
  "tof_lfi_insurance": [],
  "tof_lfi_bank_insu": [
    {
      "column": "banks",
      "isRequired": false,
      "dataType": "Array",
      "interRelation": "TOF_LFI_Banks"
    },
    {
      "column": "insurance",
      "isRequired": false,
      "dataType": "Array",
      "interRelation": "TOF_LFI_Insurance"
    }
  ],
  "tof_tpp_tpp": [
    {
      "column": "apps",
      "isRequired": false,
      "dataType": "Array",
      "interRelation": "TOF_APPS"
    }
  ],
  "tof_apps": [],
  "tof_consents_lfi": [
    {
      "column": "onbehalfof",
      "isRequired": false,
      "dataType": "Array",
      "interRelation": "TOF_CONSENTS_ONBELFOF"
    }
  ],
  "tof_consents_onbelfof": [
    {
      "column": "consentkey",
      "isRequired": false,
      "dataType": "Array",
      "interRelation": "TOF_CONSENTS_consentKey"
    }
  ],
  "tof_consents_consentkey": [],
  "tof_request_consent": [
    {
      "column": "onbehalfof",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "TOF_REQUEST_ONBEHALFOF"
    },
    {
      "column": "openfinancebilling",
      "isRequired": true,
      "dataType": "Object",
      "interRelation": "TOF_OPENFINANCE_BILLING"
    }
  ],
  "tof_request_onbehalfof": [],
  "tof_openfinance_billing": [],
  "tof_subscription": [
    {
      "column": "webhook",
      "isRequired": true,
      "dataType": "Object",
      "interRelation": "TOF_Webhook"
    }
  ],
  "tof_webhook": [],
  "tof_response_data": [
    {
      "column": "request",
      "isRequired": true,
      "dataType": "Object",
      "interRelation": "TOF_RESPONSE_REQUEST"
    },
    {
      "column": "consentbody",
      "isRequired": true,
      "dataType": "Object",
      "interRelation": "TOF_CONSENTBODY"
    },
    {
      "column": "tpp",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "TOF_TPP"
    }
  ],
  "tof_response_request": [
    {
      "column": "consent",
      "isRequired": true,
      "dataType": "Object",
      "interRelation": "TOF_RESPONSE_CONSENT"
    },
    {
      "column": "subscription",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": ""
    }
  ],
  "tof_consentbody": [
    {
      "column": "data",
      "isRequired": true,
      "dataType": "Object",
      "interRelation": "TOF_CTBODY_DATA"
    },
    {
      "column": "meta",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "TOF_CONBODY_MultipleAuth"
    },
    {
      "column": "subscription",
      "isRequired": true,
      "dataType": "Object",
      "interRelation": "TOF_SUBSCRIPTION_CONSENTBODY"
    }
  ],
  "tof_response_consent": [
    {
      "column": "onbehalfof",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "TOF_RESPONSE_ONBEHALFOF"
    },
    {
      "column": "openfinancebilling",
      "isRequired": true,
      "dataType": "Object",
      "interRelation": "TOF_RESPONSE_OPENFINANCEBILLING"
    }
  ],
  "tof_response_onbehalfof": [],
  "tof_response_openfinancebilling": [],
  "tof_ctbody_data": [
    {
      "column": "onbehalfof",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "TOF_CTBODY_ONBEHALFOF"
    },
    {
      "column": "openfinancebilling",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "TOF_RESPONSE_CTBODY_OPENFINANCEBILLING"
    }
  ],
  "tof_decodedssa": [],
  "tof_conbody_multipleauth": [
    {
      "column": "multipleauthorizers",
      "isRequired": true,
      "dataType": "Object",
      "interRelation": "TOF_MULTIAUTH"
    }
  ],
  "tof_multiauth": [
    {
      "column": "authorizations",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "TOF_MULTIAUTH_TOTALREQ"
    }
  ],
  "tof_multiauth_totalreq": []
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
      lfi:{
  "banks": [
    {
      "bank_code": "string",
      "bank_name": "string",
      "access_url": "string",
      "status": "string"
    }
  ],
  "insurance": [
    {
      "insurance_code": "string",
      "insurance_name": "string",
      "access_url": "string",
      "status": "string",
      "notes": "string"
    }
  ]
},
      trs_creator_email:"string",
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
      const { lfi }: {lfi : Date} = queryValue;

      if(lfi){ 
        query.lfi = { [queryCondition['lfi']]: lfi };
      }
      const skip = (page - 1) * limit;
      if (Object.keys(query).length > 0) {
        const banks = await this.prismaService.tof_lfi.findMany({
          select:Object.keys(columns).length >0 ?columns: undefined,
          where:Object.keys(query).length >0 ?query: undefined,
        });
        let decryptedRes: any = [];
        for (const indiviual of banks) {
          const decryptedData = await this.decryptData(indiviual, 'tof_lfi');
          decryptedRes.push(decryptedData);
        }
        return decryptedRes;
      }

      if(!skip && !limit && Object.keys(query).length == 0){

        const banks = await this.prismaService.tof_lfi.findMany({
           select:Object.keys(columns).length >0 ? columns: undefined,
        });
        let decryptedRes: any = [];
        for (const indiviual of banks) {
          const decryptedData = await this.decryptData(indiviual, 'tof_lfi');
          decryptedRes.push(decryptedData);
        }
        return decryptedRes;
      }

      const banks = await this.prismaService.tof_lfi.findMany({
        select:Object.keys(columns).length >0 ? columns: undefined,
        where:Object.keys(query).length >0 ?query: undefined,
        skip: skip || undefined,
        take: limit || undefined,
      });

      const totalItems = await this.prismaService.tof_lfi.count({
        where:Object.keys(query).length >0 ?query: undefined,
      });

      let decryptedRes: any = [];
      for (const indiviual of banks) {
        const decryptedData = await this.decryptData(indiviual, 'tof_lfi');
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
        "CK:CT242:FNGK:AF:FNK:API-MSD:CATK:TPPTEST001:AFGK:TPPTEST002:AFK:TPPTEST:AFVK:v2",
        token
      );
      throw new CustomException(errorMessage, error);
    }
  }

    async findOne(id:string,token : string) {
    try{
      const res = await this.prismaService.tof_lfi.findUnique({ 
      where: {id,},
      select: {id:true,lfi:true,trs_creator_email:true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_next_status:true,trs_status:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true}
    });
    return await this.decryptData(res, 'tof_lfi');
  } catch (error) {
    const errorMessage = 'find one Error';
        await this.commonService.errorLog(
          "Technical",
          'AK',
          'Fatal',
          "TG023",
          error,
          "CK:CT242:FNGK:AF:FNK:API-MSD:CATK:TPPTEST001:AFGK:TPPTEST002:AFK:TPPTEST:AFVK:v2",
          token
        );
        throw new CustomException(errorMessage, error);
  }
  }

  async findAll(token : string) {
    try{
      const res = await this.prismaService.tof_lfi.findMany({ 
      select: {id:true,lfi:true,trs_creator_email:true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_next_status:true,trs_status:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true}
      });
      let decryptedRes: any = [];
      for (const indiviual of res) {
        const decryptedData = await this.decryptData(indiviual, 'tof_lfi');
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
          "CK:CT242:FNGK:AF:FNK:API-MSD:CATK:TPPTEST001:AFGK:TPPTEST002:AFK:TPPTEST:AFVK:v2",
          token
        );
      throw new CustomException(errorMessage, error);
    }
    }
    
  async findAllwithquery(token : string,whereClause : Prisma.tof_lfiWhereInput) {
    try{
      whereClause = await this.encryptData(whereClause,'tof_lfi','getAll')
      const res = await this.prismaService.tof_lfi.findMany({ 
      where: whereClause,
      select: {id:true,lfi:true,trs_creator_email:true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_next_status:true,trs_status:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true}
      });
      let decryptedRes: any = [];
      for (const indiviual of res) {
        const decryptedData = await this.decryptData(indiviual, 'tof_lfi');
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
          "CK:CT242:FNGK:AF:FNK:API-MSD:CATK:TPPTEST001:AFGK:TPPTEST002:AFK:TPPTEST:AFVK:v2",
          token
        );
        throw new CustomException(errorMessage, error);
    }
    }
    
  async create(createtof_lfiDto: Prisma.tof_lfiCreateInput,token:string) {
    try{
      const res = await this.prismaService.tof_lfi.create({ 
      data: await this.encryptData(createtof_lfiDto,'tof_lfi','create'), 
      select:{id:true,lfi:true,trs_creator_email:true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_next_status:true,trs_status:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true}
    })
    return await this.decryptData(res, 'tof_lfi');
  } catch (error) {
    const errMsg = parsePrismaCreateError(error);

    await this.commonService.errorLog(
      "Technical",
      'AK',
      'Fatal',
      "TG022",
      errMsg,
      "CK:CT242:FNGK:AF:FNK:API-MSD:CATK:TPPTEST001:AFGK:TPPTEST002:AFK:TPPTEST:AFVK:v2",
      token

    );
    throw new InternalServerErrorException(errMsg);
  }
    
  }

    async update(id:string,updatetof_lfiDto: Prisma.tof_lfiUpdateInput,token:string) {    
      try{
      const res = await this.prismaService.tof_lfi.update({
      where: {id,},
      data: await this.encryptData(updatetof_lfiDto,'tof_lfi','update'),
      select: {id:true,lfi:true,trs_creator_email:true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_next_status:true,trs_status:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true},
    });
    return await this.decryptData(res, 'tof_lfi');
    } catch (error) {
        const errorMessage = 'update Error';
        await this.commonService.errorLog(
          "Technical",
          'AK',
          'Fatal',
          "TG023",
          error,
          "CK:CT242:FNGK:AF:FNK:API-MSD:CATK:TPPTEST001:AFGK:TPPTEST002:AFK:TPPTEST:AFVK:v2",
          token
        );
        throw new CustomException(errorMessage, error);
    }    
}

    async remove(id:string,token : string) {
    try{
      const res = await this.prismaService.tof_lfi.delete({
      where: {id, },
      select: {id:true,lfi:true,trs_creator_email:true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_next_status:true,trs_status:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true}
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
        "CK:CT242:FNGK:AF:FNK:API-MSD:CATK:TPPTEST001:AFGK:TPPTEST002:AFK:TPPTEST:AFVK:v2",
        token
      );
      throw new CustomException(errorMessage, error);
  }
  }
  async findFirst(token : string) {
    try{
      const res = await this.prismaService.tof_lfi.findFirst({ 
        orderBy: { trs_created_date: 'asc' },
      });
      return  await this.decryptData(res, 'tof_lfi');
    } catch (error) {
      const errorMessage = 'Error in findFirst';
        await this.commonService.errorLog(
          "Technical",
          'AK',
          'Fatal',
          "TG028",
          error,
          "CK:CT242:FNGK:AF:FNK:API-MSD:CATK:TPPTEST001:AFGK:TPPTEST002:AFK:TPPTEST:AFVK:v2",
          token
        );
        throw new CustomException(errorMessage, error);
      }
  }
  async findLast(token : string) {
    try{
      const res = await this.prismaService.tof_lfi.findFirst({ 
        orderBy: { trs_created_date: 'desc' },
      });
      return  await this.decryptData(res, 'tof_lfi');
    } catch (error) {
      const errorMessage = 'Error in findLast';
        await this.commonService.errorLog(
          "Technical",
          'AK',
          'Fatal',
          "TG028",
          error,
          "CK:CT242:FNGK:AF:FNK:API-MSD:CATK:TPPTEST001:AFGK:TPPTEST002:AFK:TPPTEST:AFVK:v2",
          token
        );
        throw new CustomException(errorMessage, error);
      }
  }
}