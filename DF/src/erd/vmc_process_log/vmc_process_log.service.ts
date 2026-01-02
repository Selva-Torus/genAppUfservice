
import { HttpException, Injectable,HttpStatus,InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CommonService } from 'src/common.Service';
import { CustomException } from 'src/customException';
import { parsePrismaCreateError } from 'src/prisma-error-handler';



@Injectable()
export class vmc_process_logService {
  constructor(private readonly prismaService: PrismaService,
  private readonly commonService: CommonService) {}
  private encryptedCols: any={
  "bank_scheme_setup": [
    {
      "column": "countries",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "Bank_scheme_country"
    }
  ],
  "master_scheme_setup": [
    {
      "column": "schemetypes",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "Country_schemetypea"
    }
  ],
  "vmc_process_log": [],
  "vmc_api_repositorys": [
    {
      "column": "vmc_process_log",
      "isRequired": true,
      "dataType": "childtable"
    }
  ],
  "bank_scheme_country": [
    {
      "column": "schemetypes",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "Country_schemetype"
    }
  ],
  "country_schemetype": [
    {
      "column": "schemes",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "schemetype_scheme"
    }
  ],
  "schemetype_scheme": [
    {
      "column": "messagetypes",
      "isRequired": false,
      "dataType": "Array",
      "interRelation": "scheme_messagetype"
    }
  ],
  "scheme_messagetype": [],
  "country_schemetypea": [
    {
      "column": "schemes",
      "isRequired": false,
      "dataType": "Object",
      "interRelation": "schemetype_schemes"
    }
  ],
  "schemetype_schemes": [
    {
      "column": "messagetypes",
      "isRequired": false,
      "dataType": "Array",
      "interRelation": "scheme_messagetypes"
    }
  ],
  "scheme_messagetypes": []
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
      country_name:"string",
      scheme_type:"string",
      source_msg_type:"string",
      target_msg_type:"string",
      source_msg_format:"string",
      target_msg_format:"string",
      source_content:"string",
      target_content:"string",
      scheme:"string",
      vmc_api_repositorysid :"string",      trs_creator_email:"string",
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
      trs_ps_code:"string",
      trs_sub_org_code:"string",
      trs_sub_org_grp_code:"string"      
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
      const { country_name }: {country_name : Date} = queryValue;
      const { scheme_type }: {scheme_type : Date} = queryValue;
      const { source_msg_type }: {source_msg_type : Date} = queryValue;
      const { target_msg_type }: {target_msg_type : Date} = queryValue;
      const { source_msg_format }: {source_msg_format : Date} = queryValue;
      const { target_msg_format }: {target_msg_format : Date} = queryValue;
      const { source_content }: {source_content : Date} = queryValue;
      const { target_content }: {target_content : Date} = queryValue;
      const { scheme }: {scheme : Date} = queryValue;

      if(country_name){ 
        query.country_name = { [queryCondition['country_name']]: country_name };
      }
      if(scheme_type){ 
        query.scheme_type = { [queryCondition['scheme_type']]: scheme_type };
      }
      if(source_msg_type){ 
        query.source_msg_type = { [queryCondition['source_msg_type']]: source_msg_type };
      }
      if(target_msg_type){ 
        query.target_msg_type = { [queryCondition['target_msg_type']]: target_msg_type };
      }
      if(source_msg_format){ 
        query.source_msg_format = { [queryCondition['source_msg_format']]: source_msg_format };
      }
      if(target_msg_format){ 
        query.target_msg_format = { [queryCondition['target_msg_format']]: target_msg_format };
      }
      if(source_content){ 
        query.source_content = { [queryCondition['source_content']]: source_content };
      }
      if(target_content){ 
        query.target_content = { [queryCondition['target_content']]: target_content };
      }
      if(scheme){ 
        query.scheme = { [queryCondition['scheme']]: scheme };
      }
      const skip = (page - 1) * limit;
      if (Object.keys(query).length > 0) {
        const banks = await this.prismaService.vmc_process_log.findMany({
          select:Object.keys(columns).length >0 ?columns: undefined,
          where:Object.keys(query).length >0 ?query: undefined,
        });
        let decryptedRes: any = [];
        for (const indiviual of banks) {
          const decryptedData = await this.decryptData(indiviual, 'vmc_process_log');
          decryptedRes.push(decryptedData);
        }
        return decryptedRes;
      }

      if(!skip && !limit && Object.keys(query).length == 0){

        const banks = await this.prismaService.vmc_process_log.findMany({
           select:Object.keys(columns).length >0 ? columns: undefined,
        });
        let decryptedRes: any = [];
        for (const indiviual of banks) {
          const decryptedData = await this.decryptData(indiviual, 'vmc_process_log');
          decryptedRes.push(decryptedData);
        }
        return decryptedRes;
      }

      const banks = await this.prismaService.vmc_process_log.findMany({
        select:Object.keys(columns).length >0 ? columns: undefined,
        where:Object.keys(query).length >0 ?query: undefined,
        skip: skip || undefined,
        take: limit || undefined,
      });

      const totalItems = await this.prismaService.vmc_process_log.count({
        where:Object.keys(query).length >0 ?query: undefined,
      });

      let decryptedRes: any = [];
      for (const indiviual of banks) {
        const decryptedData = await this.decryptData(indiviual, 'vmc_process_log');
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
        "CK:CT261:FNGK:AF:FNK:API-MSD:CATK:AG001:AFGK:A001:AFK:VMC_SchemeSetupV2:AFVK:v1",
        token
      );
      throw new CustomException(errorMessage, error);
    }
  }

    async findOne(id:string,token : string) {
    try{
      const res = await this.prismaService.vmc_process_log.findUnique({ 
      where: {id,},
      select: {id:true,country_name:true,scheme_type:true,source_msg_type:true,target_msg_type:true,source_msg_format:true,target_msg_format:true,source_content:true,target_content:true,scheme:true,trs_creator_email:true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_next_status:true,trs_status:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true,trs_sub_org_code:true,trs_sub_org_grp_code:true}
    });
    return await this.decryptData(res, 'vmc_process_log');
  } catch (error) {
    const errorMessage = 'find one Error';
        await this.commonService.errorLog(
          "Technical",
          'AK',
          'Fatal',
          "TG023",
          error,
          "CK:CT261:FNGK:AF:FNK:API-MSD:CATK:AG001:AFGK:A001:AFK:VMC_SchemeSetupV2:AFVK:v1",
          token
        );
        throw new CustomException(errorMessage, error);
  }
  }

  async findAll(token : string) {
    try{
      const res = await this.prismaService.vmc_process_log.findMany({ 
      select: {id:true,country_name:true,scheme_type:true,source_msg_type:true,target_msg_type:true,source_msg_format:true,target_msg_format:true,source_content:true,target_content:true,scheme:true,trs_creator_email:true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_next_status:true,trs_status:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true,trs_sub_org_code:true,trs_sub_org_grp_code:true}
      });
      let decryptedRes: any = [];
      for (const indiviual of res) {
        const decryptedData = await this.decryptData(indiviual, 'vmc_process_log');
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
          "CK:CT261:FNGK:AF:FNK:API-MSD:CATK:AG001:AFGK:A001:AFK:VMC_SchemeSetupV2:AFVK:v1",
          token
        );
      throw new CustomException(errorMessage, error);
    }
    }
    
  async findAllwithquery(token : string,whereClause : Prisma.vmc_process_logWhereInput) {
    try{
      whereClause = await this.encryptData(whereClause,'vmc_process_log','getAll')
      const res = await this.prismaService.vmc_process_log.findMany({ 
      where: whereClause,
      select: {id:true,country_name:true,scheme_type:true,source_msg_type:true,target_msg_type:true,source_msg_format:true,target_msg_format:true,source_content:true,target_content:true,scheme:true,trs_creator_email:true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_next_status:true,trs_status:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true,trs_sub_org_code:true,trs_sub_org_grp_code:true}
      });
      let decryptedRes: any = [];
      for (const indiviual of res) {
        const decryptedData = await this.decryptData(indiviual, 'vmc_process_log');
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
          "CK:CT261:FNGK:AF:FNK:API-MSD:CATK:AG001:AFGK:A001:AFK:VMC_SchemeSetupV2:AFVK:v1",
          token
        );
        throw new CustomException(errorMessage, error);
    }
    }
    
  async create(createvmc_process_logDto: Prisma.vmc_process_logCreateInput,token:string) {
    try{
      const res = await this.prismaService.vmc_process_log.create({ 
      data: await this.encryptData(createvmc_process_logDto,'vmc_process_log','create'), 
      select:{id:true,country_name:true,scheme_type:true,source_msg_type:true,target_msg_type:true,source_msg_format:true,target_msg_format:true,source_content:true,target_content:true,scheme:true,trs_creator_email:true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_next_status:true,trs_status:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true,trs_sub_org_code:true,trs_sub_org_grp_code:true},
    })
    return await this.decryptData(res, 'vmc_process_log');
  } catch (error) {
    const errMsg = parsePrismaCreateError(error);

    await this.commonService.errorLog(
      "Technical",
      'AK',
      'Fatal',
      "TG022",
      errMsg,
      "CK:CT261:FNGK:AF:FNK:API-MSD:CATK:AG001:AFGK:A001:AFK:VMC_SchemeSetupV2:AFVK:v1",
      token

    );
    throw new InternalServerErrorException(errMsg);
  }
    
  }

    async update(id:string,updatevmc_process_logDto: Prisma.vmc_process_logUpdateInput,token:string) {    
      try{
      const res = await this.prismaService.vmc_process_log.update({
      where: {id,},
      data: await this.encryptData(updatevmc_process_logDto,'vmc_process_log','update'),
      select: {id:true,country_name:true,scheme_type:true,source_msg_type:true,target_msg_type:true,source_msg_format:true,target_msg_format:true,source_content:true,target_content:true,scheme:true,trs_creator_email:true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_next_status:true,trs_status:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true,trs_sub_org_code:true,trs_sub_org_grp_code:true},
    });
    return await this.decryptData(res, 'vmc_process_log');
    } catch (error) {
        const errorMessage = 'update Error';
        await this.commonService.errorLog(
          "Technical",
          'AK',
          'Fatal',
          "TG023",
          error,
          "CK:CT261:FNGK:AF:FNK:API-MSD:CATK:AG001:AFGK:A001:AFK:VMC_SchemeSetupV2:AFVK:v1",
          token
        );
        throw new CustomException(errorMessage, error);
    }    
}

    async remove(id:string,token : string) {
    try{
      const res = await this.prismaService.vmc_process_log.delete({
      where: {id, },
      select: {id:true,country_name:true,scheme_type:true,source_msg_type:true,target_msg_type:true,source_msg_format:true,target_msg_format:true,source_content:true,target_content:true,scheme:true,trs_creator_email:true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_next_status:true,trs_status:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true,trs_sub_org_code:true,trs_sub_org_grp_code:true}
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
        "CK:CT261:FNGK:AF:FNK:API-MSD:CATK:AG001:AFGK:A001:AFK:VMC_SchemeSetupV2:AFVK:v1",
        token
      );
      throw new CustomException(errorMessage, error);
  }
  }
  async findFirst(token : string) {
    try{
      const res = await this.prismaService.vmc_process_log.findFirst({ 
        orderBy: { trs_created_date: 'asc' },
      });
      return  await this.decryptData(res, 'vmc_process_log');
    } catch (error) {
      const errorMessage = 'Error in findFirst';
        await this.commonService.errorLog(
          "Technical",
          'AK',
          'Fatal',
          "TG028",
          error,
          "CK:CT261:FNGK:AF:FNK:API-MSD:CATK:AG001:AFGK:A001:AFK:VMC_SchemeSetupV2:AFVK:v1",
          token
        );
        throw new CustomException(errorMessage, error);
      }
  }
  async findLast(token : string) {
    try{
      const res = await this.prismaService.vmc_process_log.findFirst({ 
        orderBy: { trs_created_date: 'desc' },
      });
      return  await this.decryptData(res, 'vmc_process_log');
    } catch (error) {
      const errorMessage = 'Error in findLast';
        await this.commonService.errorLog(
          "Technical",
          'AK',
          'Fatal',
          "TG028",
          error,
          "CK:CT261:FNGK:AF:FNK:API-MSD:CATK:AG001:AFGK:A001:AFK:VMC_SchemeSetupV2:AFVK:v1",
          token
        );
        throw new CustomException(errorMessage, error);
      }
  }
}