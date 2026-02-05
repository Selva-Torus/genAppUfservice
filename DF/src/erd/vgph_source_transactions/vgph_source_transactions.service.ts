
import { HttpException, Injectable,HttpStatus,InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import * as v from 'valibot';
import { errorObj } from 'src/dto';
import { CommonService } from 'src/common.Service';
import { parsePrismaCreateError } from 'src/prisma-error-handler';
import { vgph_source_transactionsEntity } from './entity/vgph_source_transactions.entity';
import { CustomException } from 'src/customException';
@Injectable()
export class vgph_source_transactionsService {
  constructor(private readonly prismaService: PrismaService,
  private readonly commonService: CommonService) {}
  private encryptedCols: any={
  "vgph_system_setup": [],
  "vgph_interface": [],
  "vgph_handler": [],
  "vgph_process": [],
  "vgph_flow": [],
  "vgph_step": [],
  "vgph_source_main": [
    {
      "column": "vgph_source_tran_main",
      "isRequired": true,
      "dataType": "childtable"
    }
  ],
  "vgph_source_tran_main": [
    {
      "column": "vgph_destination_tran_main",
      "isRequired": true,
      "dataType": "childtable"
    },
    {
      "column": "vgph_tran_log_main",
      "isRequired": true,
      "dataType": "childtable"
    },
    {
      "column": "vgph_tran_error_log_main",
      "isRequired": true,
      "dataType": "childtable"
    },
    {
      "column": "vgph_tran_dtl_main",
      "isRequired": true,
      "dataType": "childtable"
    }
  ],
  "vgph_tran_dtl_main": [],
  "vgph_tran_log_main": [],
  "vgph_tran_error_log_main": [],
  "vgph_destination_main": [
    {
      "column": "vgph_destination_tran_main",
      "isRequired": true,
      "dataType": "childtable"
    }
  ],
  "vgph_destination_tran_main": [],
  "prc_tokens_main": [
    {
      "column": "vgph_source_tran_main",
      "isRequired": true,
      "dataType": "childtable"
    }
  ],
  "vgph_message_template_main": [],
  "vgph_source_transactions": [],
  "vgph_source_staging": [
    {
      "column": "vgph_source_tran_staging",
      "isRequired": true,
      "dataType": "childtable"
    }
  ],
  "vgph_source_tran_staging": [
    {
      "column": "vgph_destination_tran_staging",
      "isRequired": true,
      "dataType": "childtable"
    },
    {
      "column": "vgph_tran_log_staging",
      "isRequired": true,
      "dataType": "childtable"
    },
    {
      "column": "vgph_tran_dtl_staging",
      "isRequired": true,
      "dataType": "childtable"
    }
  ],
  "vgph_tran_dtl_staging": [],
  "vgph_tran_log_staging": [],
  "vgph_tran_error_log_staging": [],
  "vgph_destination_staging": [
    {
      "column": "vgph_destination_tran_staging",
      "isRequired": true,
      "dataType": "childtable"
    }
  ],
  "vgph_destination_tran_staging": [],
  "prc_tokens_staging": [
    {
      "column": "vgph_source_tran_staging",
      "isRequired": true,
      "dataType": "childtable"
    }
  ],
  "vgph_message_template_staging": []
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
      vgphst_id:"number",
      tenant_id:"string",
      parent_vgphst_id:"string",
      product_code:"string",
      direction:"enum",
      process_type:"enum",
      tran_category:"enum",
      message_code:"string",
      channel_name:"string",
      channel_reference:"string",
      tran_date:"Date",
      tran_reference:"string",
      tran_seq_no:"string",
      value_date:"Date",
      settlement_date:"Date",
      dr_account:"string",
      dr_bank_code_type:"enum",
      dr_bank_code:"string",
      dr_name:"string",
      dr_amount:"float",
      dr_currency:"string",
      cr_account:"string",
      cr_bank_code_type:"enum",
      cr_bank_code:"string",
      cr_name:"string",
      cr_amount:"float",
      cr_currency:"string",
      remittance_info:"string",
      product_basic:"json",
      product_additional:"json",
      charge_type:"enum",
      uuid:"string",
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
      trs_sub_org_grp_code:"string",
      trs_sub_org_code:"string"
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
      const { vgphst_id }: {vgphst_id : number} = queryValue;
      const { tenant_id }: {tenant_id : string} = queryValue;
      const { parent_vgphst_id }: {parent_vgphst_id : string} = queryValue;
      const { product_code }: {product_code : string} = queryValue;
      const { direction }: {direction : Date} = queryValue;
      const { process_type }: {process_type : Date} = queryValue;
      const { tran_category }: {tran_category : Date} = queryValue;
      const { message_code }: {message_code : string} = queryValue;
      const { channel_name }: {channel_name : string} = queryValue;
      const { channel_reference }: {channel_reference : string} = queryValue;
      const { tran_date }: {tran_date : any } = queryValue;
      const { tran_reference }: {tran_reference : string} = queryValue;
      const { tran_seq_no }: {tran_seq_no : string} = queryValue;
      const { value_date }: {value_date : any } = queryValue;
      const { settlement_date }: {settlement_date : any } = queryValue;
      const { dr_account }: {dr_account : string} = queryValue;
      const { dr_bank_code_type }: {dr_bank_code_type : Date} = queryValue;
      const { dr_bank_code }: {dr_bank_code : string} = queryValue;
      const { dr_name }: {dr_name : string} = queryValue;
      const { dr_amount }: {dr_amount : any } = queryValue;
      const { dr_currency }: {dr_currency : string} = queryValue;
      const { cr_account }: {cr_account : string} = queryValue;
      const { cr_bank_code_type }: {cr_bank_code_type : Date} = queryValue;
      const { cr_bank_code }: {cr_bank_code : string} = queryValue;
      const { cr_name }: {cr_name : string} = queryValue;
      const { cr_amount }: {cr_amount : any } = queryValue;
      const { cr_currency }: {cr_currency : string} = queryValue;
      const { remittance_info }: {remittance_info : string} = queryValue;
      const { product_basic }: {product_basic : any } = queryValue;
      const { product_additional }: {product_additional : any } = queryValue;
      const { charge_type }: {charge_type : Date} = queryValue;
      const { uuid }: {uuid : string} = queryValue;

      if(vgphst_id){ 
        query.vgphst_id = { [queryCondition['vgphst_id']]: vgphst_id };
      }
      if(tenant_id){ 
        query.tenant_id = { [queryCondition['tenant_id']]: tenant_id };
      }
      if(parent_vgphst_id){ 
        query.parent_vgphst_id = { [queryCondition['parent_vgphst_id']]: parent_vgphst_id };
      }
      if(product_code){ 
        query.product_code = { [queryCondition['product_code']]: product_code };
      }
      if(direction){ 
        query.direction = { [queryCondition['direction']]: direction };
      }
      if(process_type){ 
        query.process_type = { [queryCondition['process_type']]: process_type };
      }
      if(tran_category){ 
        query.tran_category = { [queryCondition['tran_category']]: tran_category };
      }
      if(message_code){ 
        query.message_code = { [queryCondition['message_code']]: message_code };
      }
      if(channel_name){ 
        query.channel_name = { [queryCondition['channel_name']]: channel_name };
      }
      if(channel_reference){ 
        query.channel_reference = { [queryCondition['channel_reference']]: channel_reference };
      }
      if(tran_date){ 
        query.tran_date = { [queryCondition['tran_date']]: tran_date };
      }
      if(tran_reference){ 
        query.tran_reference = { [queryCondition['tran_reference']]: tran_reference };
      }
      if(tran_seq_no){ 
        query.tran_seq_no = { [queryCondition['tran_seq_no']]: tran_seq_no };
      }
      if(value_date){ 
        query.value_date = { [queryCondition['value_date']]: value_date };
      }
      if(settlement_date){ 
        query.settlement_date = { [queryCondition['settlement_date']]: settlement_date };
      }
      if(dr_account){ 
        query.dr_account = { [queryCondition['dr_account']]: dr_account };
      }
      if(dr_bank_code_type){ 
        query.dr_bank_code_type = { [queryCondition['dr_bank_code_type']]: dr_bank_code_type };
      }
      if(dr_bank_code){ 
        query.dr_bank_code = { [queryCondition['dr_bank_code']]: dr_bank_code };
      }
      if(dr_name){ 
        query.dr_name = { [queryCondition['dr_name']]: dr_name };
      }
      if(dr_amount){ 
        query.dr_amount = { [queryCondition['dr_amount']]: dr_amount };
      }
      if(dr_currency){ 
        query.dr_currency = { [queryCondition['dr_currency']]: dr_currency };
      }
      if(cr_account){ 
        query.cr_account = { [queryCondition['cr_account']]: cr_account };
      }
      if(cr_bank_code_type){ 
        query.cr_bank_code_type = { [queryCondition['cr_bank_code_type']]: cr_bank_code_type };
      }
      if(cr_bank_code){ 
        query.cr_bank_code = { [queryCondition['cr_bank_code']]: cr_bank_code };
      }
      if(cr_name){ 
        query.cr_name = { [queryCondition['cr_name']]: cr_name };
      }
      if(cr_amount){ 
        query.cr_amount = { [queryCondition['cr_amount']]: cr_amount };
      }
      if(cr_currency){ 
        query.cr_currency = { [queryCondition['cr_currency']]: cr_currency };
      }
      if(remittance_info){ 
        query.remittance_info = { [queryCondition['remittance_info']]: remittance_info };
      }
      if(product_basic){ 
        query.product_basic = { [queryCondition['product_basic']]: product_basic };
      }
      if(product_additional){ 
        query.product_additional = { [queryCondition['product_additional']]: product_additional };
      }
      if(charge_type){ 
        query.charge_type = { [queryCondition['charge_type']]: charge_type };
      }
      if(uuid){ 
        query.uuid = { [queryCondition['uuid']]: uuid };
      }
      const skip = (page - 1) * limit;
      if (Object.keys(query).length > 0) {
        const banks = await this.prismaService.vgph_source_transactions.findMany({
          select:columns,
          where: query,          
        });
        let decryptedRes: any = [];
        for (const indiviual of banks) {
          const decryptedData = await this.decryptData(indiviual, 'vgph_source_transactions');
          decryptedRes.push(decryptedData);
        }
        return decryptedRes;
      }

      if(!skip && !limit && Object.keys(query).length == 0){
        const banks = await this.prismaService.vgph_source_transactions.findMany({
          select:columns,
        });
        let decryptedRes: any = [];
        for (const indiviual of banks) {
          const decryptedData = await this.decryptData(indiviual, 'vgph_source_transactions');
          decryptedRes.push(decryptedData);
        }
        return decryptedRes;
      }

      const banks = await this.prismaService.vgph_source_transactions.findMany({
        select:columns,
        where: query,
        skip: skip,
        take: limit,
      });

      const totalItems = await this.prismaService.vgph_source_transactions.count({
        where: query,
      });

      let decryptedRes: any = [];
      for (const indiviual of banks) {
        const decryptedData = await this.decryptData(indiviual, 'vgph_source_transactions');
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
        "CK:CT005:FNGK:AF:FNK:API-ERD:CATK:V001:AFGK:VGPH001:AFK:VGPH_STAGE_ERD:AFVK:v1",
        token
      );
      throw new CustomException(errorMessage, error);
    }
  }

  async findOne(vgphst_id:number,token : string) {
    try{
      const res = await this.prismaService.vgph_source_transactions.findUnique({ 
      where: {vgphst_id},
      select: {vgphst_id:true,tenant_id:true,parent_vgphst_id:true,product_code:true,direction:true,process_type:true,tran_category:true,message_code:true,channel_name:true,channel_reference:true,tran_date:true,tran_reference:true,tran_seq_no:true,value_date:true,settlement_date:true,dr_account:true,dr_bank_code_type:true,dr_bank_code:true,dr_name:true,dr_amount:true,dr_currency:true,cr_account:true,cr_bank_code_type:true,cr_bank_code:true,cr_name:true,cr_amount:true,cr_currency:true,remittance_info:true,product_basic:true,product_additional:true,charge_type:true,uuid:true,        trs_created_date:true,
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
        trs_ps_code:true,
        trs_sub_org_code:true,
        trs_sub_org_grp_code:true
        }
    });
    return  await this.decryptData(res, 'vgph_source_transactions');
  } catch (error) {
    const errorMessage = 'Error in findOne';
      await this.commonService.errorLog(
        "Technical",
        'AK',
        'Fatal',
        "TG024",
        error,
        "CK:CT005:FNGK:AF:FNK:API-ERD:CATK:V001:AFGK:VGPH001:AFK:VGPH_STAGE_ERD:AFVK:v1",
        token
      );
      throw new CustomException(errorMessage, error);
  }
  }

  async findAll(token : string,trs_created_date?: Date,trs_created_by?: string,trs_modified_date?: Date,trs_modified_by?: string,trs_next_status?: string,trs_status?: string,trs_process_id?: string,trs_access_profile?: string,trs_org_grp_code?: string,trs_org_code?: string,trs_role_grp_code?: string,trs_role_code?: string,trs_ps_grp_code?: string,trs_ps_code?: string,trs_sub_org_grp_code?: string,trs_sub_org_code?: string
) {
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
      if (trs_next_status) {
        whereClause.trs_next_status = trs_next_status;
      }
      if (trs_status) {
        whereClause.trs_status = trs_status;
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
      const res = await this.prismaService.vgph_source_transactions.findMany({ 
      where: whereClause,
      select: {vgphst_id:true,tenant_id:true,parent_vgphst_id:true,product_code:true,direction:true,process_type:true,tran_category:true,message_code:true,channel_name:true,channel_reference:true,tran_date:true,tran_reference:true,tran_seq_no:true,value_date:true,settlement_date:true,dr_account:true,dr_bank_code_type:true,dr_bank_code:true,dr_name:true,dr_amount:true,dr_currency:true,cr_account:true,cr_bank_code_type:true,cr_bank_code:true,cr_name:true,cr_amount:true,cr_currency:true,remittance_info:true,product_basic:true,product_additional:true,charge_type:true,uuid:true,        trs_created_date:true,
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
        trs_ps_code:true,
        trs_sub_org_code:true,
        trs_sub_org_grp_code:true
      }
      });
      let decryptedRes: any = [];
      for (const indiviual of res) {
        const decryptedData = await this.decryptData(indiviual, 'vgph_source_transactions');
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
          "CK:CT005:FNGK:AF:FNK:API-ERD:CATK:V001:AFGK:VGPH001:AFK:VGPH_STAGE_ERD:AFVK:v1",
          token
        );
        throw new CustomException(errorMessage, error);
    }
    }
    
  async create(createvgph_source_transactionsDto: Prisma.vgph_source_transactionsCreateInput,token:string) {
    try{

      enum direction_vgph_source_transactions{
        OUTBOUND="OUTBOUND",
        INBOUND="INBOUND",
      }
      enum process_type_vgph_source_transactions{
        OP="OP",
        IR="IR",
        IP="IP",
        OR="OR",
      }
      enum tran_category_vgph_source_transactions{
        Financial="Financial",
        Non_Financial="Non_Financial",
      }
      enum dr_bank_code_type_vgph_source_transactions{
        IFSC="IFSC",
        BIC="BIC",
        IBAN="IBAN",
      }
      enum cr_bank_code_type_vgph_source_transactions{
        IFSC="IFSC",
        BIC="BIC",
        IBAN="IBAN",
      }
      enum charge_type_vgph_source_transactions{
        SHA="SHA",
        OUR="OUR",
        BEN="BEN",
      }
      const dataSchema:any =  v.object({
            tenant_id :  v.optional(v.string()), 
            parent_vgphst_id :  v.optional(v.string()), 
            product_code :  v.optional(v.string()), 
            direction :  v.optional(v.enum(direction_vgph_source_transactions,"Invalid direction_vgph_source_transactions enum")), 
            process_type :  v.optional(v.enum(process_type_vgph_source_transactions,"Invalid process_type_vgph_source_transactions enum")), 
            tran_category :  v.optional(v.enum(tran_category_vgph_source_transactions,"Invalid tran_category_vgph_source_transactions enum")), 
            message_code :  v.optional(v.string()), 
            channel_name :  v.optional(v.string()), 
            channel_reference :  v.optional(v.string()), 
            tran_date :  v.optional(v.pipe(
                  v.string(),
                  v.regex(
                    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|([+-])(\d{2}):(\d{2}))$/,
                    'The date-time is badly formatted.'
                  )  // Full ISO 8601 date-time format
                )), 
            tran_reference :  v.optional(v.string()), 
            tran_seq_no :  v.optional(v.string()), 
            value_date :  v.optional(v.pipe(
                  v.string(),
                  v.regex(
                    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|([+-])(\d{2}):(\d{2}))$/,
                    'The date-time is badly formatted.'
                  )  // Full ISO 8601 date-time format
                )), 
            settlement_date :  v.optional(v.pipe(
                  v.string(),
                  v.regex(
                    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|([+-])(\d{2}):(\d{2}))$/,
                    'The date-time is badly formatted.'
                  )  // Full ISO 8601 date-time format
                )), 
            dr_account :  v.optional(v.string()), 
            dr_bank_code_type :  v.optional(v.enum(dr_bank_code_type_vgph_source_transactions,"Invalid dr_bank_code_type_vgph_source_transactions enum")), 
            dr_bank_code :  v.optional(v.string()), 
            dr_name :  v.optional(v.string()), 
            dr_amount :  v.optional(v.any()), 
            dr_currency :  v.optional(v.string()), 
            cr_account :  v.optional(v.string()), 
            cr_bank_code_type :  v.optional(v.enum(cr_bank_code_type_vgph_source_transactions,"Invalid cr_bank_code_type_vgph_source_transactions enum")), 
            cr_bank_code :  v.optional(v.string()), 
            cr_name :  v.optional(v.string()), 
            cr_amount :  v.optional(v.any()), 
            cr_currency :  v.optional(v.string()), 
            remittance_info :  v.optional(v.string()), 
            product_basic :  v.optional(v.any() ), 
            product_additional :  v.optional(v.any() ), 
            charge_type :  v.optional(v.enum(charge_type_vgph_source_transactions,"Invalid charge_type_vgph_source_transactions enum")), 
            uuid :  v.optional(v.string()), 
        });
        let validate : any = v.safeParse(dataSchema,createvgph_source_transactionsDto);
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
            "CK:CT005:FNGK:AF:FNK:API-ERD:CATK:V001:AFGK:VGPH001:AFK:VGPH_STAGE_ERD:AFVK:v1",
            token
          );
        }
        
      const res = await this.prismaService.vgph_source_transactions.create({ 
      data: await this.encryptData(createvgph_source_transactionsDto,'vgph_source_transactions','create'),
      select:{vgphst_id:true,tenant_id:true,parent_vgphst_id:true,product_code:true,direction:true,process_type:true,tran_category:true,message_code:true,channel_name:true,channel_reference:true,tran_date:true,tran_reference:true,tran_seq_no:true,value_date:true,settlement_date:true,dr_account:true,dr_bank_code_type:true,dr_bank_code:true,dr_name:true,dr_amount:true,dr_currency:true,cr_account:true,cr_bank_code_type:true,cr_bank_code:true,cr_name:true,cr_amount:true,cr_currency:true,remittance_info:true,product_basic:true,product_additional:true,charge_type:true,uuid:true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_next_status:true,trs_status:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true,trs_sub_org_code:true,trs_sub_org_grp_code:true}
          
    })
    return await this.decryptData(res, 'vgph_source_transactions');
  } catch (error) {
    const errMsg = parsePrismaCreateError(error);
    const errorMessage = 'Create Error';
    await this.commonService.errorLog(
      "Technical",
      'AK',
      'Fatal',
      "TG022",
      errMsg,
      "CK:CT005:FNGK:AF:FNK:API-ERD:CATK:V001:AFGK:VGPH001:AFK:VGPH_STAGE_ERD:AFVK:v1",
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
    createvgph_source_transactionsDto: Prisma.vgph_source_transactionsCreateInput,
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
          
          const result = await this.prismaService.$queryRaw<any[]>`
            SELECT ct006_torus202610.approve_change(
              ${+approvalId},
              ${userInfo.username},
              ${userInfo.remarks || null}
            ) AS success
          `;
  
          const success = result[0]?.success;
  
          if (success) {
            return {
              success: true,
              message: 'vgph_source_transactions creation approved and applied successfully',
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
          const result = await this.prismaService.$queryRaw<any[]>`
            SELECT ct006_torus202610.reject_change(
              ${+approvalId},
              ${userInfo.username},
              ${userInfo.remarks || null}
            ) AS success
          `;
  
          const success = result[0]?.success;
  
          if (success) {
            return {
              success: true,
              message: 'vgph_source_transactions creation rejected',
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

      enum direction_vgph_source_transactions{
        OUTBOUND="OUTBOUND",
        INBOUND="INBOUND",
      }
      enum process_type_vgph_source_transactions{
        OP="OP",
        IR="IR",
        IP="IP",
        OR="OR",
      }
      enum tran_category_vgph_source_transactions{
        Financial="Financial",
        Non_Financial="Non_Financial",
      }
      enum dr_bank_code_type_vgph_source_transactions{
        IFSC="IFSC",
        BIC="BIC",
        IBAN="IBAN",
      }
      enum cr_bank_code_type_vgph_source_transactions{
        IFSC="IFSC",
        BIC="BIC",
        IBAN="IBAN",
      }
      enum charge_type_vgph_source_transactions{
        SHA="SHA",
        OUR="OUR",
        BEN="BEN",
      }
      const dataSchema:any =  v.object({
            tenant_id :  v.optional(v.string()), 
            parent_vgphst_id :  v.optional(v.string()), 
            product_code :  v.optional(v.string()), 
            direction :  v.optional(v.enum(direction_vgph_source_transactions,"Invalid direction_vgph_source_transactions enum")), 
            process_type :  v.optional(v.enum(process_type_vgph_source_transactions,"Invalid process_type_vgph_source_transactions enum")), 
            tran_category :  v.optional(v.enum(tran_category_vgph_source_transactions,"Invalid tran_category_vgph_source_transactions enum")), 
            message_code :  v.optional(v.string()), 
            channel_name :  v.optional(v.string()), 
            channel_reference :  v.optional(v.string()), 
            tran_date :  v.optional(v.pipe(
                  v.string(),
                  v.regex(
                    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|([+-])(\d{2}):(\d{2}))$/,
                    'The date-time is badly formatted.'
                  )  // Full ISO 8601 date-time format
                )), 
            tran_reference :  v.optional(v.string()), 
            tran_seq_no :  v.optional(v.string()), 
            value_date :  v.optional(v.pipe(
                  v.string(),
                  v.regex(
                    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|([+-])(\d{2}):(\d{2}))$/,
                    'The date-time is badly formatted.'
                  )  // Full ISO 8601 date-time format
                )), 
            settlement_date :  v.optional(v.pipe(
                  v.string(),
                  v.regex(
                    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|([+-])(\d{2}):(\d{2}))$/,
                    'The date-time is badly formatted.'
                  )  // Full ISO 8601 date-time format
                )), 
            dr_account :  v.optional(v.string()), 
            dr_bank_code_type :  v.optional(v.enum(dr_bank_code_type_vgph_source_transactions,"Invalid dr_bank_code_type_vgph_source_transactions enum")), 
            dr_bank_code :  v.optional(v.string()), 
            dr_name :  v.optional(v.string()), 
            dr_amount :  v.optional(v.any()), 
            dr_currency :  v.optional(v.string()), 
            cr_account :  v.optional(v.string()), 
            cr_bank_code_type :  v.optional(v.enum(cr_bank_code_type_vgph_source_transactions,"Invalid cr_bank_code_type_vgph_source_transactions enum")), 
            cr_bank_code :  v.optional(v.string()), 
            cr_name :  v.optional(v.string()), 
            cr_amount :  v.optional(v.any()), 
            cr_currency :  v.optional(v.string()), 
            remittance_info :  v.optional(v.string()), 
            product_basic :  v.optional(v.any() ), 
            product_additional :  v.optional(v.any() ), 
            charge_type :  v.optional(v.enum(charge_type_vgph_source_transactions,"Invalid charge_type_vgph_source_transactions enum")), 
            uuid :  v.optional(v.string()), 
        });
        let validate : any = v.safeParse(dataSchema,createvgph_source_transactionsDto);
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
            "CK:CT005:FNGK:AF:FNK:API-ERD:CATK:V001:AFGK:VGPH001:AFK:VGPH_STAGE_ERD:AFVK:v1",
            token
          );
          throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
        }
      
      // Encrypt data if needed
      const encryptedData = await this.encryptData(createvgph_source_transactionsDto, 'vgph_source_transactions', 'create');
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
        
        const result = await this.prismaService.$queryRaw<any[]>`
          SELECT ct006_torus202610.request_change(
            p_table_name     := 'vgph_source_transactions',
            p_operation_type := 'INSERT',
            p_record_id      := NULL,
            p_record_id_column := 'vgphst_id',
            p_changes        := ${encryptedData}::JSONB,
            p_maker_id       := ${userInfo.username},
            p_maker_remarks  := ${userInfo.remarks || null},
            p_schema    := 'ct005_vgph001'
          ) AS approval_id
        `;

        const approvalId = result[0]?.approval_id;

        return {
          success: true,
          message: 'vgph_source_transactions creation request submitted for approval',
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
        "CK:CT005:FNGK:AF:FNK:API-ERD:CATK:V001:AFGK:VGPH001:AFK:VGPH_STAGE_ERD:AFVK:v1",
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

  async update(vgphst_id:number, updatevgph_source_transactionsDto: Prisma.vgph_source_transactionsUpdateInput,token:string) {   
    try{

      enum direction_vgph_source_transactions{
        OUTBOUND="OUTBOUND",
        INBOUND="INBOUND",
      }
      enum process_type_vgph_source_transactions{
        OP="OP",
        IR="IR",
        IP="IP",
        OR="OR",
      }
      enum tran_category_vgph_source_transactions{
        Financial="Financial",
        Non_Financial="Non_Financial",
      }
      enum dr_bank_code_type_vgph_source_transactions{
        IFSC="IFSC",
        BIC="BIC",
        IBAN="IBAN",
      }
      enum cr_bank_code_type_vgph_source_transactions{
        IFSC="IFSC",
        BIC="BIC",
        IBAN="IBAN",
      }
      enum charge_type_vgph_source_transactions{
        SHA="SHA",
        OUR="OUR",
        BEN="BEN",
      }
      const dataSchema:any =  v.object({
          tenant_id :  v.optional(v.string()), 
          parent_vgphst_id :  v.optional(v.string()), 
          product_code :  v.optional(v.string()), 
          direction :  v.optional(v.enum(direction_vgph_source_transactions,"Invalid direction_vgph_source_transactions enum")), 
          process_type :  v.optional(v.enum(process_type_vgph_source_transactions,"Invalid process_type_vgph_source_transactions enum")), 
          tran_category :  v.optional(v.enum(tran_category_vgph_source_transactions,"Invalid tran_category_vgph_source_transactions enum")), 
          message_code :  v.optional(v.string()), 
          channel_name :  v.optional(v.string()), 
          channel_reference :  v.optional(v.string()), 
          tran_date :  v.optional(v.pipe(
            v.string(),
            v.regex(
              /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|([+-])(\d{2}):(\d{2}))$/,
              'The date-time is badly formatted.'
            )  // Full ISO 8601 date-time format
          )), 
          tran_reference :  v.optional(v.string()), 
          tran_seq_no :  v.optional(v.string()), 
          value_date :  v.optional(v.pipe(
            v.string(),
            v.regex(
              /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|([+-])(\d{2}):(\d{2}))$/,
              'The date-time is badly formatted.'
            )  // Full ISO 8601 date-time format
          )), 
          settlement_date :  v.optional(v.pipe(
            v.string(),
            v.regex(
              /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|([+-])(\d{2}):(\d{2}))$/,
              'The date-time is badly formatted.'
            )  // Full ISO 8601 date-time format
          )), 
          dr_account :  v.optional(v.string()), 
          dr_bank_code_type :  v.optional(v.enum(dr_bank_code_type_vgph_source_transactions,"Invalid dr_bank_code_type_vgph_source_transactions enum")), 
          dr_bank_code :  v.optional(v.string()), 
          dr_name :  v.optional(v.string()), 
          dr_amount :  v.optional(v.number()), 
          dr_currency :  v.optional(v.string()), 
          cr_account :  v.optional(v.string()), 
          cr_bank_code_type :  v.optional(v.enum(cr_bank_code_type_vgph_source_transactions,"Invalid cr_bank_code_type_vgph_source_transactions enum")), 
          cr_bank_code :  v.optional(v.string()), 
          cr_name :  v.optional(v.string()), 
          cr_amount :  v.optional(v.number()), 
          cr_currency :  v.optional(v.string()), 
          remittance_info :  v.optional(v.string()), 
          product_basic :  v.optional(v.any()), 
          product_additional :  v.optional(v.any()), 
          charge_type :  v.optional(v.enum(charge_type_vgph_source_transactions,"Invalid charge_type_vgph_source_transactions enum")), 
          uuid :  v.optional(v.string()), 
      });
      let validate : any = v.safeParse(dataSchema,updatevgph_source_transactionsDto);
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
          "CK:CT005:FNGK:AF:FNK:API-ERD:CATK:V001:AFGK:VGPH001:AFK:VGPH_STAGE_ERD:AFVK:v1",
          token
        );
      }
      const res = await this.prismaService.vgph_source_transactions.update({
      where: {vgphst_id},
      data: await this.encryptData(updatevgph_source_transactionsDto,'vgph_source_transactions','update'),
      select: {vgphst_id:true,tenant_id:true,parent_vgphst_id:true,product_code:true,direction:true,process_type:true,tran_category:true,message_code:true,channel_name:true,channel_reference:true,tran_date:true,tran_reference:true,tran_seq_no:true,value_date:true,settlement_date:true,dr_account:true,dr_bank_code_type:true,dr_bank_code:true,dr_name:true,dr_amount:true,dr_currency:true,cr_account:true,cr_bank_code_type:true,cr_bank_code:true,cr_name:true,cr_amount:true,cr_currency:true,remittance_info:true,product_basic:true,product_additional:true,charge_type:true,uuid:true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_next_status:true,trs_status:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true,trs_sub_org_code:true,trs_sub_org_grp_code:true}
    });
    return await this.decryptData(res, 'vgph_source_transactions');
    } catch (error) {
        const errorMessage = 'update Error';
        await this.commonService.errorLog(
          "Technical",
          'AK',
          'Fatal',
          "TG023",
          error,
          "CK:CT005:FNGK:AF:FNK:API-ERD:CATK:V001:AFGK:VGPH001:AFK:VGPH_STAGE_ERD:AFVK:v1",
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
vgphst_id:number,
    updatevgph_source_transactionsDto: Prisma.vgph_source_transactionsUpdateInput,
    userInfo: { role: string; username: string; remarks?: string,approvalStatus?:string },
    token:string
  ) {
    try {
      const role = userInfo.role?.toUpperCase();
      const updateMaster_id =vgphst_id;

      // =====================================================
      // CHECKER ROLE: Approve pending UPDATE request
      // =====================================================
      if (role === 'CHECKER') {

        if (!updateMaster_id) {
          throw new HttpException('id is required for CHECKER role', HttpStatus.BAD_REQUEST);
        }

        // Call approve_change(approval_id, checker_id, checker_remarks)
        // const result = await this.prismaService.$queryRaw<any[]>`
        //   SELECT * FROM approve_change_by_record(
        //     'customers',
        //     ${approvalId},
        //     ${userInfo.username},
        //     ${userInfo.remarks || null}
        //   ) AS success
        // `;
        if (userInfo.approvalStatus === 'APPROVED') {
        const result = await this.prismaService.$queryRaw<any[]>`
          SELECT * FROM ct006_torus202610.approve_change_by_record(
              p_table_name      := 'vgph_source_transactions',
              p_record_id       := ${updateMaster_id.toString()},
              p_checker_id      := ${userInfo.username},
              p_checker_remarks := ${userInfo.remarks || null}
          );
        `;

        const success = result[0]?.success;
        const approvalId = result[0]?.approval_id;

        if (success) {
          return {
            success: true,
            message: 'vgph_source_transactions update approved and applied successfully',
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
          const result = await this.prismaService.$queryRaw<any[]>`
            SELECT * FROM ct006_torus202610.reject_change_by_record(
                p_table_name      := 'vgph_source_transactions',
                p_record_id       := ${updateMaster_id.toString()},
                p_checker_id      := ${userInfo.username},
                p_checker_remarks := ${userInfo.remarks || null}
            );
          `;

          const success = result[0]?.success;
          const approvalId = result[0]?.approval_id;

          if (success) {
            return {
              success: true,
              message: 'vgph_source_transactions update rejected',
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

      enum direction_vgph_source_transactions{
        OUTBOUND="OUTBOUND",
        INBOUND="INBOUND",
      }
      enum process_type_vgph_source_transactions{
        OP="OP",
        IR="IR",
        IP="IP",
        OR="OR",
      }
      enum tran_category_vgph_source_transactions{
        Financial="Financial",
        Non_Financial="Non_Financial",
      }
      enum dr_bank_code_type_vgph_source_transactions{
        IFSC="IFSC",
        BIC="BIC",
        IBAN="IBAN",
      }
      enum cr_bank_code_type_vgph_source_transactions{
        IFSC="IFSC",
        BIC="BIC",
        IBAN="IBAN",
      }
      enum charge_type_vgph_source_transactions{
        SHA="SHA",
        OUR="OUR",
        BEN="BEN",
      }
      const dataSchema:any =  v.object({
          tenant_id :  v.optional(v.string()), 
          parent_vgphst_id :  v.optional(v.string()), 
          product_code :  v.optional(v.string()), 
          direction :  v.optional(v.enum(direction_vgph_source_transactions,"Invalid direction_vgph_source_transactions enum")), 
          process_type :  v.optional(v.enum(process_type_vgph_source_transactions,"Invalid process_type_vgph_source_transactions enum")), 
          tran_category :  v.optional(v.enum(tran_category_vgph_source_transactions,"Invalid tran_category_vgph_source_transactions enum")), 
          message_code :  v.optional(v.string()), 
          channel_name :  v.optional(v.string()), 
          channel_reference :  v.optional(v.string()), 
          tran_date :  v.optional(v.pipe(
            v.string(),
            v.regex(
              /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|([+-])(\d{2}):(\d{2}))$/,
              'The date-time is badly formatted.'
            )  // Full ISO 8601 date-time format
          )), 
          tran_reference :  v.optional(v.string()), 
          tran_seq_no :  v.optional(v.string()), 
          value_date :  v.optional(v.pipe(
            v.string(),
            v.regex(
              /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|([+-])(\d{2}):(\d{2}))$/,
              'The date-time is badly formatted.'
            )  // Full ISO 8601 date-time format
          )), 
          settlement_date :  v.optional(v.pipe(
            v.string(),
            v.regex(
              /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|([+-])(\d{2}):(\d{2}))$/,
              'The date-time is badly formatted.'
            )  // Full ISO 8601 date-time format
          )), 
          dr_account :  v.optional(v.string()), 
          dr_bank_code_type :  v.optional(v.enum(dr_bank_code_type_vgph_source_transactions,"Invalid dr_bank_code_type_vgph_source_transactions enum")), 
          dr_bank_code :  v.optional(v.string()), 
          dr_name :  v.optional(v.string()), 
          dr_amount :  v.optional(v.number()), 
          dr_currency :  v.optional(v.string()), 
          cr_account :  v.optional(v.string()), 
          cr_bank_code_type :  v.optional(v.enum(cr_bank_code_type_vgph_source_transactions,"Invalid cr_bank_code_type_vgph_source_transactions enum")), 
          cr_bank_code :  v.optional(v.string()), 
          cr_name :  v.optional(v.string()), 
          cr_amount :  v.optional(v.number()), 
          cr_currency :  v.optional(v.string()), 
          remittance_info :  v.optional(v.string()), 
          product_basic :  v.optional(v.any()), 
          product_additional :  v.optional(v.any()), 
          charge_type :  v.optional(v.enum(charge_type_vgph_source_transactions,"Invalid charge_type_vgph_source_transactions enum")), 
          uuid :  v.optional(v.string()), 
      });
      let validate : any = v.safeParse(dataSchema,updatevgph_source_transactionsDto);
      if (!validate.success) {
        const errorMessage = validate.issues[0].message;
        await this.commonService.errorLog(
          "Technical",
          'AK',
          'Fatal',
          "TG025",
          errorMessage,
          "CK:CT005:FNGK:AF:FNK:API-ERD:CATK:V001:AFGK:VGPH001:AFK:VGPH_STAGE_ERD:AFVK:v1",
          token
        );
        throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
      }

      // Verify record exists
      const existingRecord = await this.prismaService.vgph_source_transactions.findUnique({
        where: {vgphst_id}
      });

      if (!existingRecord) {
        throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
      }

      // Encrypt data if needed
      const encryptedData = await this.encryptData(updatevgph_source_transactionsDto, 'vgph_source_transactions', 'update');

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
      const result = await this.prismaService.$queryRaw<any[]>`
        SELECT ct006_torus202610.request_change(
          p_table_name     := 'vgph_source_transactions',
          p_operation_type := 'UPDATE',
          p_record_id      := ${updateMaster_id.toString()},
          p_record_id_column := 'vgphst_id',
          p_changes        := ${encryptedData}::JSONB,
          p_maker_id       := ${userInfo.username},
          p_maker_remarks  := ${userInfo.remarks || null},
          p_schema    := 'ct005_vgph001'
        ) AS approval_id
      `;

      const approvalId = result[0]?.approval_id;

      return {
        success: true,
        message: 'vgph_source_transactions update request submitted for approval',
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
        "CK:CT005:FNGK:AF:FNK:API-ERD:CATK:V001:AFGK:VGPH001:AFK:VGPH_STAGE_ERD:AFVK:v1",
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

  async remove(vgphst_id:number,token : string) {
    try{
      const res = await this.prismaService.vgph_source_transactions.delete({
      where: {vgphst_id },
      select: {vgphst_id:true,tenant_id:true,parent_vgphst_id:true,product_code:true,direction:true,process_type:true,tran_category:true,message_code:true,channel_name:true,channel_reference:true,tran_date:true,tran_reference:true,tran_seq_no:true,value_date:true,settlement_date:true,dr_account:true,dr_bank_code_type:true,dr_bank_code:true,dr_name:true,dr_amount:true,dr_currency:true,cr_account:true,cr_bank_code_type:true,cr_bank_code:true,cr_name:true,cr_amount:true,cr_currency:true,remittance_info:true,product_basic:true,product_additional:true,charge_type:true,uuid:true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_next_status:true,trs_status:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true,trs_sub_org_code:true,trs_sub_org_grp_code:true}
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
        "CK:CT005:FNGK:AF:FNK:API-ERD:CATK:V001:AFGK:VGPH001:AFK:VGPH_STAGE_ERD:AFVK:v1",
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
vgphst_id:number,
    userInfo: { role: string; username: string; remarks?: string; approvalStatus?:string },
    token: string
  ) {
    try {
      const role = userInfo.role?.toUpperCase();
      const deleteMaster_id =vgphst_id;

      // =====================================================
      // CHECKER ROLE: Approve pending DELETE request
      // =====================================================
      if (role === 'CHECKER') {

        if (!deleteMaster_id) {
          throw new HttpException('id is required for CHECKER role', HttpStatus.BAD_REQUEST);
        }

        // Call approve_change(approval_id, checker_id, checker_remarks)
        if (userInfo.approvalStatus === 'APPROVED') {
        const result = await this.prismaService.$queryRaw<any[]>`
          SELECT * FROM ct006_torus202610.approve_change_by_record(
              p_table_name      := 'vgph_source_transactions',
              p_record_id       := ${deleteMaster_id.toString()},
              p_checker_id      := ${userInfo.username},
              p_checker_remarks := ${userInfo.remarks || null}
          );
        `;

        const success = result[0]?.success;
        const approvalId = result[0]?.approval_id;

        if (success) {
          return {
            success: true,
            message: 'vgph_source_transactions deletion approved and applied successfully',
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
          const result = await this.prismaService.$queryRaw<any[]>`
            SELECT * FROM ct006_torus202610.reject_change_by_record(
                p_table_name      := 'vgph_source_transactions',
                p_record_id       := ${deleteMaster_id.toString()},
                p_checker_id      := ${userInfo.username},
                p_checker_remarks := ${userInfo.remarks || null}
            );
          `;

          const success = result[0]?.success;
          const approvalId = result[0]?.approval_id;

          if (success) {
            return {
              success: true,
              message: 'vgph_source_transactions deletion rejected',
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
      const existingRecord = await this.prismaService.vgph_source_transactions.findUnique({
        where: {vgphst_id  }
      });

      if (!existingRecord) {
        throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
      }

      // Call request_change() for DELETE
      // For DELETE: p_record_id is the ID, p_changes is empty object
      const result = await this.prismaService.$queryRaw<any[]>`
        SELECT ct006_torus202610.request_change(
          p_table_name     := 'vgph_source_transactions',
          p_operation_type := 'DELETE',
          p_record_id      := ${deleteMaster_id.toString()},
          p_record_id_column := 'vgphst_id',
          p_changes        := '{}'::JSONB,
          p_maker_id       := ${userInfo.username},
          p_maker_remarks  := ${userInfo.remarks || null},
          p_schema    := 'ct005_vgph001'
        ) AS approval_id
      `;

      const approvalId = result[0]?.approval_id;

      return {
        success: true,
        message: 'vgph_source_transactions deletion request submitted for approval',
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
        "CK:CT005:FNGK:AF:FNK:API-ERD:CATK:V001:AFGK:VGPH001:AFK:VGPH_STAGE_ERD:AFVK:v1",
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
      const res = await this.prismaService.vgph_source_transactions.findFirst({ 
        orderBy: { trs_created_date: 'asc' },
      });
      return  await this.decryptData(res, 'vgph_source_transactions');
    } catch (error) {
      const errorMessage = 'Error in findFirst';
        await this.commonService.errorLog(
          "Technical",
          'AK',
          'Fatal',
          "TG028",
          error,
          "CK:CT005:FNGK:AF:FNK:API-ERD:CATK:V001:AFGK:VGPH001:AFK:VGPH_STAGE_ERD:AFVK:v1",
          token
        );
        throw new CustomException(errorMessage, error);
      }
  }
  async findLast(token : string) {
    try{
      const res = await this.prismaService.vgph_source_transactions.findFirst({ 
        orderBy: { trs_created_date: 'desc' },
      });
      return  await this.decryptData(res, 'vgph_source_transactions');
    } catch (error) {
      const errorMessage = 'Error in findLast';
        await this.commonService.errorLog(
          "Technical",
          'AK',
          'Fatal',
          "TG028",
          error,
          "CK:CT005:FNGK:AF:FNK:API-ERD:CATK:V001:AFGK:VGPH001:AFK:VGPH_STAGE_ERD:AFVK:v1",
          token
        );
        throw new CustomException(errorMessage, error);
      }
  }

}
