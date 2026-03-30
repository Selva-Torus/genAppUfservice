
import { HttpException, Injectable,HttpStatus,InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import * as v from 'valibot';
import { errorObj } from 'src/dto';
import { CommonService } from 'src/common.Service';
import { parsePrismaCreateError } from 'src/prisma-error-handler';
import { itax_source_tran_credit_approvalEntity } from './entity/itax_source_tran_credit_approval.entity';
import { CustomException } from 'src/customException';
@Injectable()
export class itax_source_tran_credit_approvalService {
  constructor(private readonly prismaService: PrismaService,
  private readonly commonService: CommonService) {}
  private encryptedCols: any={
  "itax_source": [
    {
      "column": "itax_source_tran",
      "isRequired": true,
      "dataType": "childtable"
    },
    {
      "column": "itax_source_tran_credit_approval",
      "isRequired": true,
      "dataType": "childtable"
    },
    {
      "column": "itax_source_tran_payment",
      "isRequired": true,
      "dataType": "childtable"
    }
  ],
  "itax_source_tran": [
    {
      "column": "itax_tran_log",
      "isRequired": true,
      "dataType": "childtable"
    },
    {
      "column": "itax_tran_error_log",
      "isRequired": true,
      "dataType": "childtable"
    },
    {
      "column": "itax_source_tran_doc",
      "isRequired": true,
      "dataType": "childtable"
    },
    {
      "column": "itax_source_tran_dtl",
      "isRequired": true,
      "dataType": "childtable"
    }
  ],
  "itax_source_tran_credit_approval": [],
  "itax_source_tran_payment": [],
  "itax_tran_log": [],
  "itax_tran_error_log": [],
  "itax_source_tran_doc": [],
  "itax_source_tran_dtl": [],
  "itax_system_setup": [],
  "itax_check_balance": []
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

  async commonDecimalDatahandle(data:any){
    const plainData = { ...data,
      }
    return plainData
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
      itaxstca_id:"number",
      tran_category:"enum",
      tran_date:"Date",
      tran_reference:"string",
      eslip_no:"string",
      credit_application_id:"string",
      credit_approval_doc_id:"string",
      itaxs_id :"number",      trs_created_date:"Date",
      trs_created_by:"string",
      trs_modified_date:"Date",
      trs_modified_by:"string",
      trs_process_id:"string",
      trs_access_profile:"string",
      trs_org_grp_code:"string",
      trs_org_code:"string",
      trs_role_grp_code:"string",
      trs_role_code:"string",
      trs_ps_grp_code:"string",
      trs_ps_code:"string",
      trs_sub_org_grp_code:"string",
      trs_sub_org_code:"string",
      trs_locked_by : "string",
      trs_locked_time : "Date",
      trs_tenant_id:"string",    
      trs_app_code:"string",         
      trs_product_code:"string",
      trs_event_process_status:"string",         
      trs_event_status:"string",
      trs_prev_process_code:"string",    
      trs_prev_status:"string",         
      trs_prev_process_status:"string",
      trs_process_code:"string",         
      trs_status:"string",               
      trs_process_status:"string",        
      trs_next_process_code:"string",    
      trs_next_status:"string",          
      trs_next_process_status:"string"
    }
    return data;
  }

 async findAllmethod(queryDto: any, limit:number,selectColumns:any,token:any) {
    try {
      let queryCondition:any ={}
      let queryValue:any = {}
      let columns:any = {}
      selectColumns.forEach(element => {
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
      const { itaxstca_id }: {itaxstca_id : number} = queryValue;
      const { tran_category }: {tran_category : Date} = queryValue;
      const { tran_date }: {tran_date : any } = queryValue;
      const { tran_reference }: {tran_reference : string} = queryValue;
      const { eslip_no }: {eslip_no : string} = queryValue;
      const { credit_application_id }: {credit_application_id : string} = queryValue;
      const { credit_approval_doc_id }: {credit_approval_doc_id : string} = queryValue;

      if(itaxstca_id){ 
        query.itaxstca_id = { [queryCondition['itaxstca_id']]: itaxstca_id };
      }
      if(tran_category){ 
        query.tran_category = { [queryCondition['tran_category']]: tran_category };
      }
      if(tran_date){ 
        query.tran_date = { [queryCondition['tran_date']]: tran_date };
      }
      if(tran_reference){ 
        query.tran_reference = { [queryCondition['tran_reference']]: tran_reference };
      }
      if(eslip_no){ 
        query.eslip_no = { [queryCondition['eslip_no']]: eslip_no };
      }
      if(credit_application_id){ 
        query.credit_application_id = { [queryCondition['credit_application_id']]: credit_application_id };
      }
      if(credit_approval_doc_id){ 
        query.credit_approval_doc_id = { [queryCondition['credit_approval_doc_id']]: credit_approval_doc_id };
      }
      const skip = (page - 1) * limit;
      if (Object.keys(query).length > 0) {
        const banks = await this.prismaService.withConnection(() =>
        this.prismaService.itax_source_tran_credit_approval.findMany({
          select:columns,
          where: query,          
        }));
        let decryptedRes: any = [];
        for (const indiviual of banks) {
          const decryptedData = await this.decryptData(indiviual, 'itax_source_tran_credit_approval');
          decryptedRes.push(decryptedData);
        }
        return decryptedRes;
      }

      if(!skip && !limit && Object.keys(query).length == 0){
        const banks = await this.prismaService.withConnection(() =>
        this.prismaService.itax_source_tran_credit_approval.findMany({
          select:columns,
        }));
        let decryptedRes: any = [];
        for (const indiviual of banks) {
          const decryptedData = await this.decryptData(indiviual, 'itax_source_tran_credit_approval');
          decryptedRes.push(decryptedData);
        }
        return decryptedRes;
      }

      const banks = await this.prismaService.withConnection(() =>
      this.prismaService.itax_source_tran_credit_approval.findMany({
        select:columns,
        where: query,
        skip: skip,
        take: limit,
      }));

      const totalItems = await this.prismaService.withConnection(() =>
      this.prismaService.itax_source_tran_credit_approval.count({
        where: query,
      }));

      let decryptedRes: any = [];
      for (const indiviual of banks) {
        const decryptedData = await this.decryptData(indiviual, 'itax_source_tran_credit_approval');
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
        error,
        "CK:CT010:FNGK:AF:FNK:API-ERD:CATK:I001:AFGK:ITAX:AFK:ITAX_Core_Bank:AFVK:v1",
        token
      );
      throw new CustomException(errorMessage, error);
    }
  }

  async findOne(itaxstca_id:number,token : string) {
    try{
      const res = await this.prismaService.withConnection(() =>
      this.prismaService.itax_source_tran_credit_approval.findUnique({ 
      where: {itaxstca_id},
      select: {itaxstca_id:true,tran_category:true,tran_date:true,tran_reference:true,eslip_no:true,credit_application_id:true,credit_approval_doc_id:true,itaxs_id :true,        trs_created_date:true,
        trs_created_by:true,
        trs_modified_date:true,
        trs_modified_by:true,
        trs_process_id:true,
        trs_access_profile:true,
        trs_org_grp_code:true,
        trs_org_code:true,
        trs_role_grp_code:true,
        trs_role_code:true,
        trs_ps_grp_code:true,
        trs_ps_code:true,
        trs_sub_org_code:true,
        trs_sub_org_grp_code:true,
        trs_locked_by:true,
        trs_locked_time:true,
        trs_tenant_id:true,    
        trs_app_code:true,         
        trs_product_code:true,
        trs_event_process_status:true,         
        trs_event_status:true,
        trs_prev_process_code:true,    
        trs_prev_status:true,         
        trs_prev_process_status:true,
        trs_process_code:true,         
        trs_status:true,               
        trs_process_status:true,        
        trs_next_process_code:true,    
        trs_next_status:true,          
        trs_next_process_status:true
        }
    }));
    return await this.decryptData(await this.commonDecimalDatahandle(res), 'itax_source_tran_credit_approval');
  } catch (error) {
    const errorMessage = 'Error in findOne';
      await this.commonService.errorLog(
        "Technical",
        'AK',
        'Fatal',
        "TG024",
        error,
        "CK:CT010:FNGK:AF:FNK:API-ERD:CATK:I001:AFGK:ITAX:AFK:ITAX_Core_Bank:AFVK:v1",
        token
      );
      throw new CustomException(errorMessage, error);
  }
  }

  async findAll(token : string,trs_created_date?: Date,trs_created_by?: string,trs_modified_date?: Date,trs_modified_by?: string,trs_process_id?: string,trs_access_profile?: string,trs_org_grp_code?: string,trs_org_code?: string,trs_role_grp_code?: string,trs_role_code?: string,trs_ps_grp_code?: string,trs_ps_code?: string,trs_sub_org_grp_code?: string,trs_sub_org_code?: string,trs_locked_by?: string,trs_locked_time?: Date,trs_tenant_id?:string,trs_app_code?:string,trs_product_code?:string,trs_event_process_status?:string,trs_event_status?:string,trs_prev_process_code?:string,trs_prev_status?:string,trs_prev_process_status?:string,trs_process_code?:string,trs_status?:string,trs_process_status?:string,trs_next_process_code?:string,trs_next_status?:string,trs_next_process_status?:string) {
    try{
      const whereClause: any = {};
      if (trs_created_date) {
        whereClause.trs_created_date = trs_created_date;
      }
      if (trs_created_by) {
        whereClause.trs_created_by = trs_created_by;
      }
      if (trs_modified_date) {
        whereClause.trs_modified_date = trs_modified_date;
      }
      if (trs_modified_by) {
        whereClause.trs_modified_by = trs_modified_by;
      }
      if (trs_process_id) {
        whereClause.trs_process_id = trs_process_id;
      }
      if (trs_access_profile) {
        whereClause.trs_access_profile = trs_access_profile;
      }
      if (trs_org_grp_code) {
        whereClause.trs_org_grp_code = trs_org_grp_code;
      }
      if (trs_org_code) {
        whereClause.trs_org_code = trs_org_code;
      }
      if (trs_role_grp_code) {
        whereClause.trs_role_grp_code = trs_role_grp_code;
      }
      if (trs_role_code) {
        whereClause.trs_role_code = trs_role_code;
      }
      if (trs_ps_grp_code) {
        whereClause.trs_ps_grp_code = trs_ps_grp_code;
      }
      if (trs_ps_code) {
        whereClause.trs_ps_code = trs_ps_code;
      }
      if (trs_sub_org_grp_code) {
        whereClause.trs_sub_org_grp_code = trs_sub_org_grp_code;
      }
      if (trs_sub_org_code) {
        whereClause.trs_sub_org_code = trs_sub_org_code;
      }
      if (trs_locked_by) {
        whereClause.trs_locked_by = trs_locked_by;
      }
      if (trs_locked_time) {
        whereClause.trs_locked_time = trs_locked_time;
      }
      if (trs_tenant_id) {
        whereClause.trs_tenant_id = trs_tenant_id;
      }
      if (trs_app_code) {
        whereClause.trs_app_code = trs_app_code;
      }
      if (trs_product_code) {
        whereClause.trs_product_code = trs_product_code;
      }
      if (trs_event_process_status) {
        whereClause.trs_event_process_status = trs_event_process_status;
      }
      if (trs_event_status) {
        whereClause.trs_event_status = trs_event_status;
      }
      if (trs_prev_process_code) {
        whereClause.trs_prev_process_code = trs_prev_process_code;
      }
      if (trs_prev_status) {
        whereClause.trs_prev_status = trs_prev_status;
      }
      if (trs_prev_process_status) {
        whereClause.trs_prev_process_status = trs_prev_process_status;
      }
      if (trs_process_code) {
        whereClause.trs_process_code = trs_process_code;
      }
      if (trs_status) {
        whereClause.trs_status = trs_status;
      }
      if (trs_process_status) {
        whereClause.trs_process_status = trs_process_status;
      }
      if (trs_next_process_code) {
        whereClause.trs_next_process_code = trs_next_process_code;
      }
      if (trs_next_status) {
        whereClause.trs_next_status = trs_next_status;
      }
      if (trs_next_process_status) {
        whereClause.trs_next_process_status = trs_next_process_status;
      }
      const res = await this.prismaService.withConnection(() =>
      this.prismaService.itax_source_tran_credit_approval.findMany({ 
      where: whereClause,
      select: {itaxstca_id:true,tran_category:true,tran_date:true,tran_reference:true,eslip_no:true,credit_application_id:true,credit_approval_doc_id:true,          itaxs_id :true,    
        trs_created_date:true,
        trs_created_by:true,
        trs_modified_date:true,
        trs_modified_by:true,
        trs_process_id:true,
        trs_access_profile:true,
        trs_org_grp_code:true,
        trs_org_code:true,
        trs_role_grp_code:true,
        trs_role_code:true,
        trs_ps_grp_code:true,
        trs_ps_code:true,
        trs_sub_org_code:true,
        trs_sub_org_grp_code:true,
        trs_locked_by:true,
        trs_locked_time:true,
        trs_tenant_id:true,    
        trs_app_code:true,         
        trs_product_code:true,
        trs_event_process_status:true,         
        trs_event_status:true,
        trs_prev_process_code:true,    
        trs_prev_status:true,         
        trs_prev_process_status:true,
        trs_process_code:true,         
        trs_status:true,               
        trs_process_status:true,        
        trs_next_process_code:true,    
        trs_next_status:true,          
        trs_next_process_status:true
      }
      }));
      let decryptedRes: any = [];
      for (const indiviual of res) {
        const plain = await this.commonDecimalDatahandle(indiviual)
        const decryptedData = await this.decryptData(plain, 'itax_source_tran_credit_approval');
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
          "CK:CT010:FNGK:AF:FNK:API-ERD:CATK:I001:AFGK:ITAX:AFK:ITAX_Core_Bank:AFVK:v1",
          token
        );
        throw new CustomException(errorMessage, error);
    }
    }
    
  async create(createitax_source_tran_credit_approvalDto: Prisma.itax_source_tran_credit_approvalCreateInput,token:string) {
    try{

      enum tran_category_itax_source_tran_credit_approval{
        Financial="Financial",
        Non_Financial="Non_Financial",
      }
      const dataSchema:any =  v.object({
            tran_category :  v.optional(v.enum(tran_category_itax_source_tran_credit_approval,"Invalid tran_category_itax_source_tran_credit_approval enum")), 
            tran_date :  v.optional(v.pipe(
                  v.string(),
                  v.regex(
                    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|([+-])(\d{2}):(\d{2}))$/,
                    'The date-time is badly formatted.'
                  )  // Full ISO 8601 date-time format
                )), 
            tran_reference :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
            eslip_no :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
            credit_application_id :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
            credit_approval_doc_id :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
        });
        let validate : any = v.safeParse(dataSchema,createitax_source_tran_credit_approvalDto);
        if (!validate.success) {
          let errorObj: errorObj = {
            tname: 'TG',
            errGrp: 'Data',
            fabric: 'DF',
            errType: 'Fatal',
            errCode: 'TG101',
          };
          const errorMessage = validate.issues[0].message;
          await this.commonService.errorLog(
            "Technical",
            'AK',
            'Fatal',
            "TG021",
            errorMessage,
            "CK:CT010:FNGK:AF:FNK:API-ERD:CATK:I001:AFGK:ITAX:AFK:ITAX_Core_Bank:AFVK:v1",
            token
          );
        }
      const encryptedData = await this.encryptData(createitax_source_tran_credit_approvalDto, 'itax_source_tran_credit_approval', 'create');
      const res = await this.prismaService.withConnection(() =>
        this.prismaService.itax_source_tran_credit_approval.create({
          data: encryptedData,
          select:{itaxstca_id:true,tran_category:true,tran_date:true,tran_reference:true,eslip_no:true,credit_application_id:true,credit_approval_doc_id:true,itaxs_id :true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true,trs_sub_org_code:true,trs_sub_org_grp_code:true,trs_locked_by:true,trs_locked_time:true,trs_tenant_id:true,trs_app_code:true,trs_product_code:true,trs_event_process_status:true,trs_event_status:true,trs_prev_process_code:true,trs_prev_status:true,trs_prev_process_status:true,trs_process_code:true,trs_status:true,trs_process_status:true,trs_next_process_code:true,trs_next_status:true,trs_next_process_status:true}          
        })
      );
    return await this.decryptData(await this.commonDecimalDatahandle(res), 'itax_source_tran_credit_approval');
  } catch (error) {
    const errMsg = parsePrismaCreateError(error);
    const errorMessage = 'Create Error';
    await this.commonService.errorLog(
      "Technical",
      'AK',
      'Fatal',
      "TG022",
      errMsg,
      "CK:CT010:FNGK:AF:FNK:API-ERD:CATK:I001:AFGK:ITAX:AFK:ITAX_Core_Bank:AFVK:v1",
      token
    );
    throw new InternalServerErrorException(errMsg);
  }
    
  }

  // =====================================================
  // MAKER-CHECKER METHODS (JSON Parent-Child Process)
  // =====================================================
  //
  // Role-based routing:
  // - MAKER role: Calls request_change() to submit changes for approval
  // - CHECKER role: Calls approve_change() to approve pending requests
  // =====================================================

  /**
   * Create a new customer record through maker-checker approval flow.
   *
   * Role-based behavior:
   * - MAKER: Calls request_change() to submit INSERT request for approval
   * - CHECKER: Calls approve_change() to approve a pending INSERT request
   *
   * @param createcustomersDto - The customer data to create (for MAKER) or approval_id (for CHECKER)
   * @param userInfo - Contains role, username, and remarks
   * @param token - Auth token
   */
  async createMaster(
    createitax_source_tran_credit_approvalDto: Prisma.itax_source_tran_credit_approvalCreateInput,
    userInfo: { role: string; username: string; remarks?: string,approvalStatus?:string, approvalId?: string },
    token: string
  ) {
    try {
      const role = userInfo.role?.toUpperCase();
      const approvalStatus = userInfo.approvalStatus?.toUpperCase();

      // =====================================================
      // CHECKER ROLE: Approve pending INSERT request
      // =====================================================
      if (role === 'CHECKER') {
        const approvalId = userInfo.approvalId;

        if (!approvalId) {
          throw new HttpException('approval_id is required for CHECKER role', HttpStatus.BAD_REQUEST);
        }

        if (approvalStatus === 'APPROVED') {
          // Call approve_change(approval_id, checker_id, checker_remarks)
          
          const result = await this.prismaService.withConnection(() =>
          this.prismaService.$queryRaw<any[]>`
            SELECT ct006_torus202610.approve_change(
              ${+approvalId},
              ${userInfo.username},
              ${userInfo.remarks || null}
            ) AS success
          `);
  
          const success = result[0]?.success;
  
          if (success) {
            return {
              success: true,
              message: 'itax_source_tran_credit_approval creation approved and applied successfully',
              approval_id: approvalId,
              status: 'APPROVED'
            };
          } else {
            return {
              success: false,
              message: 'Approval failed - please check for version conflicts or missing records',
              approval_id: approvalId,
              status: 'FAILED'
            };
          }
                    
        }
        else if (approvalStatus === 'REJECTED') {
          // Call approve_change(approval_id, checker_id, checker_remarks)
          const result = await this.prismaService.withConnection(() =>
          this.prismaService.$queryRaw<any[]>`
            SELECT ct006_torus202610.reject_change(
              ${+approvalId},
              ${userInfo.username},
              ${userInfo.remarks || null}
            ) AS success
          `);
  
          const success = result[0]?.success;
  
          if (success) {
            return {
              success: true,
              message: 'itax_source_tran_credit_approval creation rejected',
              approval_id: approvalId,
              status: 'REJECTED'
            };
          } else {
            return {
              success: false,
              message: 'Approval failed - please check for version conflicts or missing records',
              approval_id: approvalId,
              status: 'FAILED'
            };
          }
                    
        }
      }

      // =====================================================
      // MAKER ROLE: Submit INSERT request for approval
      // =====================================================
      // Validate the input data

      enum tran_category_itax_source_tran_credit_approval{
        Financial="Financial",
        Non_Financial="Non_Financial",
      }
      const dataSchema:any =  v.object({
            tran_category :  v.optional(v.enum(tran_category_itax_source_tran_credit_approval,"Invalid tran_category_itax_source_tran_credit_approval enum")), 
            tran_date :  v.optional(v.pipe(
                  v.string(),
                  v.regex(
                    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|([+-])(\d{2}):(\d{2}))$/,
                    'The date-time is badly formatted.'
                  )  // Full ISO 8601 date-time format
                )), 
            tran_reference :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
            eslip_no :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
            credit_application_id :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
            credit_approval_doc_id :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
        });
        let validate : any = v.safeParse(dataSchema,createitax_source_tran_credit_approvalDto);
        if (!validate.success) {
          let errorObj: errorObj = {
            tname: 'TG',
            errGrp: 'Data',
            fabric: 'DF',
            errType: 'Fatal',
            errCode: 'TG101',
          };
          const errorMessage = validate.issues[0].message;
          await this.commonService.errorLog(
            "Technical",
            'AK',
            'Fatal',
            "TG021",
            errorMessage,
            "CK:CT010:FNGK:AF:FNK:API-ERD:CATK:I001:AFGK:ITAX:AFK:ITAX_Core_Bank:AFVK:v1",
            token
          );
          throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
        }
      
      // Encrypt data if needed
      const encryptedData = await this.encryptData(createitax_source_tran_credit_approvalDto, 'itax_source_tran_credit_approval', 'create');
      encryptedData['trs_modified_date'] = new Date();

      // Convert numeric values to strings for JSONB (as per the documentation pattern)
      //const changes: Record<string, string> = {};
      //for (const [key, value] of Object.entries(encryptedData)) {
      //  if (value !== null && value !== undefined && key !== 'approval_id') {
      //    changes[key] = String(value);
      //  }
      //}
      if(role === 'MAKER')
      {
        
        const result = await this.prismaService.withConnection(() =>
        this.prismaService.$queryRaw<any[]>`
          SELECT ct006_torus202610.request_change(
            p_table_name     := 'itax_source_tran_credit_approval',
            p_operation_type := 'INSERT',
            p_record_id      := NULL,
            p_record_id_column := 'itaxstca_id',
            p_changes        := ${encryptedData}::JSONB,
            p_maker_id       := ${userInfo.username},
            p_maker_remarks  := ${userInfo.remarks || null},
            p_schema    := 'ct010_i001'
          ) AS approval_id
        `);

        const approvalId = result[0]?.approval_id;

        return {
          success: true,
          message: 'itax_source_tran_credit_approval creation request submitted for approval',
          approval_id: approvalId,
          status: 'CREATED'
        };
      }
      // Call request_change() for INSERT
      // For INSERT: p_record_id is NULL, p_changes contains the new data

    } catch (error: any) {
      const errorMessage = 'Error in createMaster';
      await this.commonService.errorLog(
        "Technical",
        'AK',
        'Fatal',
        "TG031",
        error,
        "CK:CT010:FNGK:AF:FNK:API-ERD:CATK:I001:AFGK:ITAX:AFK:ITAX_Core_Bank:AFVK:v1",
        token
      );

      // Handle specific PostgreSQL errors
      if (error.message?.includes('Maker and checker cannot be the same')) {
        throw new HttpException('You cannot approve your own request', HttpStatus.FORBIDDEN);
      }
      if (error.message?.includes('Cannot approve record with status')) {
        throw new HttpException('This request has already been processed', HttpStatus.BAD_REQUEST);
      }
      if (error instanceof HttpException) {
        throw error;
      }
      throw new CustomException(errorMessage, error);
    }
  }

  async update(itaxstca_id:number, updateitax_source_tran_credit_approvalDto: Prisma.itax_source_tran_credit_approvalUpdateInput,token:string) {   
    try{

      enum tran_category_itax_source_tran_credit_approval{
        Financial="Financial",
        Non_Financial="Non_Financial",
      }
      const dataSchema:any =  v.object({
          tran_category :  v.optional(v.enum(tran_category_itax_source_tran_credit_approval,"Invalid tran_category_itax_source_tran_credit_approval enum")), 
          tran_date :  v.optional(v.pipe(
            v.string(),
            v.regex(
              /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|([+-])(\d{2}):(\d{2}))$/,
              'The date-time is badly formatted.'
            )  // Full ISO 8601 date-time format
          )), 
          tran_reference :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
          eslip_no :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
          credit_application_id :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
          credit_approval_doc_id :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
      });
      let validate : any = v.safeParse(dataSchema,updateitax_source_tran_credit_approvalDto);
      if (!validate.success) {
        let errorObj: errorObj = {
          tname: 'TG',
          errGrp: 'Data',
          fabric: 'DF',
          errType: 'Fatal',
          errCode: 'TG101',
        };
        const errorMessage = validate.issues[0].message;
        await this.commonService.errorLog(
          "Technical",
          'AK',
          'Fatal',
          "TG025",
          errorMessage,
          "CK:CT010:FNGK:AF:FNK:API-ERD:CATK:I001:AFGK:ITAX:AFK:ITAX_Core_Bank:AFVK:v1",
          token
        );
      }
      const encryptedData = await this.encryptData(updateitax_source_tran_credit_approvalDto,'itax_source_tran_credit_approval','update');
      const res = await this.prismaService.withConnection(() =>
      this.prismaService.itax_source_tran_credit_approval.update({
      where: {itaxstca_id},
      data: encryptedData,
      select: {itaxstca_id:true,tran_category:true,tran_date:true,tran_reference:true,eslip_no:true,credit_application_id:true,credit_approval_doc_id:true,itaxs_id :true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true,trs_sub_org_code:true,trs_sub_org_grp_code:true,trs_locked_by:true,trs_locked_time:true,trs_tenant_id:true,trs_app_code:true,trs_product_code:true,trs_event_process_status:true,trs_event_status:true,trs_prev_process_code:true,trs_prev_status:true,trs_prev_process_status:true,trs_process_code:true,trs_status:true,trs_process_status:true,trs_next_process_code:true,trs_next_status:true,trs_next_process_status:true}
    }));
    return await this.decryptData(await this.commonDecimalDatahandle(res), 'itax_source_tran_credit_approval');
    } catch (error) {
        const errorMessage = 'update Error';
        await this.commonService.errorLog(
          "Technical",
          'AK',
          'Fatal',
          "TG023",
          error,
          "CK:CT010:FNGK:AF:FNK:API-ERD:CATK:I001:AFGK:ITAX:AFK:ITAX_Core_Bank:AFVK:v1",
          token
        );
        throw new CustomException(errorMessage, error);
    }  
}

/**
   * Update an existing customer record through maker-checker approval flow.
   *
   * Role-based behavior:
   * - MAKER: Calls request_change() to submit UPDATE request for approval
   * - CHECKER: Calls approve_change() to approve a pending UPDATE request
   *
   * @param id - The customer ID to update (for MAKER) or approval_id (for CHECKER with id=0)
   * @param updatecustomersDto - The updated customer data (for MAKER) or approval_id (for CHECKER)
   * @param userInfo - Contains role, username, and remarks
   * @param token - Auth token
   */
  async updateMaster(
itaxstca_id:number,
    updateitax_source_tran_credit_approvalDto: Prisma.itax_source_tran_credit_approvalUpdateInput,
    userInfo: { role: string; username: string; remarks?: string,approvalStatus?:string },
    token:string
  ) {
    try {
      const role = userInfo.role?.toUpperCase();
      const updateMaster_id =itaxstca_id;

      // =====================================================
      // CHECKER ROLE: Approve pending UPDATE request
      // =====================================================
      if (role === 'CHECKER') {

        if (!updateMaster_id) {
          throw new HttpException('id is required for CHECKER role', HttpStatus.BAD_REQUEST);
        }

        // Call approve_change(approval_id, checker_id, checker_remarks)
        // const result = await this.prismaService.withConnection(() =>
        //this.prismaService.$queryRaw<any[]>`
        //   SELECT * FROM approve_change_by_record(
        //     'customers',
        //     ${approvalId},
        //     ${userInfo.username},
        //     ${userInfo.remarks || null}
        //   ) AS success
        // `);
        if (userInfo.approvalStatus === 'APPROVED') {
        const result = await this.prismaService.withConnection(() =>
        this.prismaService.$queryRaw<any[]>`
          SELECT * FROM ct006_torus202610.approve_change_by_record(
              p_table_name      := 'itax_source_tran_credit_approval',
              p_record_id       := ${updateMaster_id.toString()},
              p_checker_id      := ${userInfo.username},
              p_checker_remarks := ${userInfo.remarks || null}
          );
        `);

        const success = result[0]?.success;
        const approvalId = result[0]?.approval_id;

        if (success) {
          return {
            success: true,
            message: 'itax_source_tran_credit_approval update approved and applied successfully',
            approvalId: approvalId,
            record_id: updateMaster_id,
            status: 'APPROVED'
          };
        } else {
          return {
            success: false,
            message: 'Approval failed - please check for version conflicts or missing records',
            approvalId: approvalId,
            record_id: updateMaster_id,
            status: 'FAILED'
          };
        }
        }else if (userInfo.approvalStatus === 'REJECTED') {
          const result = await this.prismaService.withConnection(() =>
          this.prismaService.$queryRaw<any[]>`
            SELECT * FROM ct006_torus202610.reject_change_by_record(
                p_table_name      := 'itax_source_tran_credit_approval',
                p_record_id       := ${updateMaster_id.toString()},
                p_checker_id      := ${userInfo.username},
                p_checker_remarks := ${userInfo.remarks || null}
            );
          `);

          const success = result[0]?.success;
          const approvalId = result[0]?.approval_id;

          if (success) {
            return {
              success: true,
              message: 'itax_source_tran_credit_approval update rejected',
              approvalId: approvalId,
              record_id: updateMaster_id,
              status: 'REJECTED'
            };
          } else {
            return {
              success: false,
              message: 'Approval failed - please check for version conflicts or missing records',
              approvalId: approvalId,
              record_id: updateMaster_id,
              status: 'FAILED'
            };
          }
        }
      }

      // =====================================================
      // MAKER ROLE: Submit UPDATE request for approval
      // =====================================================
      // Validate the input data

      enum tran_category_itax_source_tran_credit_approval{
        Financial="Financial",
        Non_Financial="Non_Financial",
      }
      const dataSchema:any =  v.object({
          tran_category :  v.optional(v.enum(tran_category_itax_source_tran_credit_approval,"Invalid tran_category_itax_source_tran_credit_approval enum")), 
          tran_date :  v.optional(v.pipe(
            v.string(),
            v.regex(
              /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|([+-])(\d{2}):(\d{2}))$/,
              'The date-time is badly formatted.'
            )  // Full ISO 8601 date-time format
          )), 
          tran_reference :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
          eslip_no :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
          credit_application_id :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
          credit_approval_doc_id :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
      });
      let validate : any = v.safeParse(dataSchema,updateitax_source_tran_credit_approvalDto);
      if (!validate.success) {
        const errorMessage = validate.issues[0].message;
        await this.commonService.errorLog(
          "Technical",
          'AK',
          'Fatal',
          "TG025",
          errorMessage,
          "CK:CT010:FNGK:AF:FNK:API-ERD:CATK:I001:AFGK:ITAX:AFK:ITAX_Core_Bank:AFVK:v1",
          token
        );
        throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
      }

      // Verify record exists
      const existingRecord = await this.prismaService.withConnection(() =>
      this.prismaService.itax_source_tran_credit_approval.findUnique({
        where: {itaxstca_id}
      }));

      if (!existingRecord) {
        throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
      }

      // Encrypt data if needed
      const encryptedData = await this.encryptData(updateitax_source_tran_credit_approvalDto, 'itax_source_tran_credit_approval', 'update');

      // Convert values to strings for JSONB (as per the documentation pattern)
      // Only include the fields that are being changed
      //const changes: Record<string, string> = {};
      //for (const [key, value] of Object.entries(encryptedData)) {
      //  if (value !== null && value !== undefined && key !== 'approval_id') {
      //    changes[key] = String(value);
      //  }
      //}

      // Call request_change() for UPDATE
      // For UPDATE: p_record_id is the ID, p_changes contains only changed fields
      const result = await this.prismaService.withConnection(() =>
      this.prismaService.$queryRaw<any[]>`
        SELECT ct006_torus202610.request_change(
          p_table_name     := 'itax_source_tran_credit_approval',
          p_operation_type := 'UPDATE',
          p_record_id      := ${updateMaster_id.toString()},
          p_record_id_column := 'itaxstca_id',
          p_changes        := ${encryptedData}::JSONB,
          p_maker_id       := ${userInfo.username},
          p_maker_remarks  := ${userInfo.remarks || null},
          p_schema    := 'ct010_i001'
        ) AS approval_id
      `);

      const approvalId = result[0]?.approval_id;

      return {
        success: true,
        message: 'itax_source_tran_credit_approval update request submitted for approval',
        approval_id: approvalId,
        record_id: updateMaster_id,
        status: 'CREATED'
      };
    } catch (error: any) {
      const errorMessage = 'Error in updateMaster';
      await this.commonService.errorLog(
        "Technical",
        'AK',
        'Fatal',
        "TG033",
        error,
        "CK:CT010:FNGK:AF:FNK:API-ERD:CATK:I001:AFGK:ITAX:AFK:ITAX_Core_Bank:AFVK:v1",
        token
      );

      // Handle specific PostgreSQL errors
      if (error.message?.includes('Maker and checker cannot be the same')) {
        throw new HttpException('You cannot approve your own request', HttpStatus.FORBIDDEN);
      }
      if (error.message?.includes('Cannot approve record with status')) {
        throw new HttpException('This request has already been processed', HttpStatus.BAD_REQUEST);
      }
      if (error.message?.includes('pending request already exists')) {
        throw new HttpException('A pending request already exists for this record', HttpStatus.CONFLICT);
      }
      if (error instanceof HttpException) {
        throw error;
      }
      throw new CustomException(errorMessage, error);
    }
  }

  async remove(itaxstca_id:number,token : string) {
    try{
      const res = await this.prismaService.withConnection(() =>
      this.prismaService.itax_source_tran_credit_approval.delete({
      where: {itaxstca_id },
      select: {itaxstca_id:true,tran_category:true,tran_date:true,tran_reference:true,eslip_no:true,credit_application_id:true,credit_approval_doc_id:true,itaxs_id :true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true,trs_sub_org_code:true,trs_sub_org_grp_code:true,trs_locked_by:true,trs_locked_time:true,trs_tenant_id:true,trs_app_code:true,trs_product_code:true,trs_event_process_status:true,trs_event_status:true,trs_prev_process_code:true,trs_prev_status:true,trs_prev_process_status:true,trs_process_code:true,trs_status:true,trs_process_status:true,trs_next_process_code:true,trs_next_status:true,trs_next_process_status:true}
    }));
    return await this.decryptData(await this.commonDecimalDatahandle(res), 'itax_source_tran_credit_approval');
  } catch (error) {
    const errorMessage = 'Error in remove Data';
      await this.commonService.errorLog(
        "Technical",
        'AK',
        'Fatal',
        "TG026",
        error,
        "CK:CT010:FNGK:AF:FNK:API-ERD:CATK:I001:AFGK:ITAX:AFK:ITAX_Core_Bank:AFVK:v1",
        token
      );
      throw new CustomException(errorMessage, error);
  }
  }
   /**
   * Delete a customer record through maker-checker approval flow.
   *
   * Role-based behavior:
   * - MAKER: Calls request_change() to submit DELETE request for approval
   * - CHECKER: Calls approve_change() to approve a pending DELETE request
   *
   * @param id - The customer ID to delete (for MAKER) or approval_id (for CHECKER)
   * @param userInfo - Contains role, username, remarks, and optionally approval_id
   * @param token - Auth token
   */
  async deleteMaster(
itaxstca_id:number,
    userInfo: { role: string; username: string; remarks?: string; approvalStatus?:string },
    token: string
  ) {
    try {
      const role = userInfo.role?.toUpperCase();
      const deleteMaster_id =itaxstca_id;

      // =====================================================
      // CHECKER ROLE: Approve pending DELETE request
      // =====================================================
      if (role === 'CHECKER') {

        if (!deleteMaster_id) {
          throw new HttpException('id is required for CHECKER role', HttpStatus.BAD_REQUEST);
        }

        // Call approve_change(approval_id, checker_id, checker_remarks)
        if (userInfo.approvalStatus === 'APPROVED') {
        const result = await this.prismaService.withConnection(() =>
        this.prismaService.$queryRaw<any[]>`
          SELECT * FROM ct006_torus202610.approve_change_by_record(
              p_table_name      := 'itax_source_tran_credit_approval',
              p_record_id       := ${deleteMaster_id.toString()},
              p_checker_id      := ${userInfo.username},
              p_checker_remarks := ${userInfo.remarks || null}
          );
        `);

        const success = result[0]?.success;
        const approvalId = result[0]?.approval_id;

        if (success) {
          return {
            success: true,
            message: 'itax_source_tran_credit_approval deletion approved and applied successfully',
            approval_id: approvalId,
            record_id: deleteMaster_id,
            status: 'APPROVED'
          };
        } else {
          return {
            success: false,
            message: 'Approval failed - please check for version conflicts or missing records',
            approval_id: approvalId,
            record_id: deleteMaster_id,
            status: 'FAILED'
          };
        }
        }else if (userInfo.approvalStatus === 'REJECTED') {
          const result = await this.prismaService.withConnection(() =>
          this.prismaService.$queryRaw<any[]>`
            SELECT * FROM ct006_torus202610.reject_change_by_record(
                p_table_name      := 'itax_source_tran_credit_approval',
                p_record_id       := ${deleteMaster_id.toString()},
                p_checker_id      := ${userInfo.username},
                p_checker_remarks := ${userInfo.remarks || null}
            );
          `);

          const success = result[0]?.success;
          const approvalId = result[0]?.approval_id;

          if (success) {
            return {
              success: true,
              message: 'itax_source_tran_credit_approval deletion rejected',
              approval_id: approvalId,
              record_id: deleteMaster_id,
              status: 'REJECTED'
            };
          } else {
            return {
              success: false,
              message: 'Approval failed - please check for version conflicts or missing records',
              approval_id: approvalId,
              record_id: deleteMaster_id,
              status: 'FAILED'
            };
          }
        }
      }

      // =====================================================
      // MAKER ROLE: Submit DELETE request for approval
      // =====================================================
      // Verify record exists
      const existingRecord = await this.prismaService.withConnection(() =>
      this.prismaService.itax_source_tran_credit_approval.findUnique({
        where: {itaxstca_id  }
      }));

      if (!existingRecord) {
        throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
      }

      // Call request_change() for DELETE
      // For DELETE: p_record_id is the ID, p_changes is empty object
      const result = await this.prismaService.withConnection(() =>
      this.prismaService.$queryRaw<any[]>`
        SELECT ct006_torus202610.request_change(
          p_table_name     := 'itax_source_tran_credit_approval',
          p_operation_type := 'DELETE',
          p_record_id      := ${deleteMaster_id.toString()},
          p_record_id_column := 'itaxstca_id',
          p_changes        := '{}'::JSONB,
          p_maker_id       := ${userInfo.username},
          p_maker_remarks  := ${userInfo.remarks || null},
          p_schema    := 'ct010_i001'
        ) AS approval_id
      `);

      const approvalId = result[0]?.approval_id;

      return {
        success: true,
        message: 'itax_source_tran_credit_approval deletion request submitted for approval',
        approval_id: approvalId,
        record_id: deleteMaster_id,
        status: 'CREATED'
      };
    } catch (error: any) {
      const errorMessage = 'Error in deleteMaster';
      await this.commonService.errorLog(
        "Technical",
        'AK',
        'Fatal',
        "TG034",
        error,
        "CK:CT010:FNGK:AF:FNK:API-ERD:CATK:I001:AFGK:ITAX:AFK:ITAX_Core_Bank:AFVK:v1",
        token
      );

      // Handle specific PostgreSQL errors
      if (error.message?.includes('Maker and checker cannot be the same')) {
        throw new HttpException('You cannot approve your own request', HttpStatus.FORBIDDEN);
      }
      if (error.message?.includes('Cannot approve record with status')) {
        throw new HttpException('This request has already been processed', HttpStatus.BAD_REQUEST);
      }
      if (error.message?.includes('pending request already exists')) {
        throw new HttpException('A pending request already exists for this record', HttpStatus.CONFLICT);
      }
      if (error instanceof HttpException) {
        throw error;
      }
      throw new CustomException(errorMessage, error);
    }
  }
  async findFirst(token : string) {
    try{
      const res = await this.prismaService.withConnection(() =>
      this.prismaService.itax_source_tran_credit_approval.findFirst({ 
        orderBy: { trs_created_date: 'asc' },
      }));
      return await this.decryptData(await this.commonDecimalDatahandle(res), 'itax_source_tran_credit_approval');
    } catch (error) {
      const errorMessage = 'Error in findFirst';
        await this.commonService.errorLog(
          "Technical",
          'AK',
          'Fatal',
          "TG028",
          error,
          "CK:CT010:FNGK:AF:FNK:API-ERD:CATK:I001:AFGK:ITAX:AFK:ITAX_Core_Bank:AFVK:v1",
          token
        );
        throw new CustomException(errorMessage, error);
      }
  }
  async findLast(token : string) {
    try{
      const res = await this.prismaService.withConnection(() =>
      this.prismaService.itax_source_tran_credit_approval.findFirst({ 
        orderBy: { trs_created_date: 'desc' },
      }));
      return await this.decryptData(await this.commonDecimalDatahandle(res), 'itax_source_tran_credit_approval');
    } catch (error) {
      const errorMessage = 'Error in findLast';
        await this.commonService.errorLog(
          "Technical",
          'AK',
          'Fatal',
          "TG028",
          error,
          "CK:CT010:FNGK:AF:FNK:API-ERD:CATK:I001:AFGK:ITAX:AFK:ITAX_Core_Bank:AFVK:v1",
          token
        );
        throw new CustomException(errorMessage, error);
      }
  }

}
