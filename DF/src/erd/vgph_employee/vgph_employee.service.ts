

import { HttpException, Injectable,HttpStatus,InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import * as v from 'valibot';
import { errorObj } from 'src/dto';
import { CommonService } from 'src/common.Service';
import { parsePrismaCreateError } from 'src/prisma-error-handler';
import { vgph_employeeEntity } from './entity/vgph_employee.entity';
import { CustomException } from 'src/customException';
@Injectable()
export class vgph_employeeService {
  constructor(private readonly prismaService: PrismaService,
  private readonly commonService: CommonService) {}
  private encryptedCols: any={
  "vgph_source_corporate": [],
  "vgph_corporate": [],
  "vgph_source_employee": [],
  "vgph_employee": [],
  "vgph_source_si": [],
  "vgph_si": [],
  "vgph_corporate_relationship": [],
  "vgph_corporate_relationship_exception": [],
  "vgph_source_main": [],
  "vgph_source_tran_main": [],
  "vgph_tran_dtl_main": [],
  "vgph_tran_log_main": [],
  "vgph_tran_error_log_main": [],
  "vgph_destination_main": [],
  "vgph_destination_tran_main": [],
  "vgph_source_tran_doc_main": [],
  "vgph_nf_tran_main": [],
  "vgph_process_exception_main": [],
  "vgph_temp_main": [],
  "vgph_trn_secure_token": [],
  "vgph_charge_tran": [],
  "vgph_participant_bank": [],
  "vgph_participant_branch": [],
  "vgph_correspondent_bank": [],
  "vgph_correspondent_exception": [],
  "vgph_correspondent_nostro": [],
  "vgph_holiday": [],
  "vgph_clearing_holiday": [],
  "vgph_clearing_session": [],
  "vgph_participant_bank_status": [],
  "vgph_charge_setup": [],
  "vgph_charge_config": [],
  "vgph_charge_invoice": [],
  "vgph_beneficiary": [],
  "vgph_account_beneficiary": [],
  "vgph_source_staging": [],
  "vgph_source_tran_staging": [],
  "vgph_tran_dtl_staging": [],
  "vgph_destination_staging": [],
  "vgph_destination_tran_staging": [],
  "vgph_source_tran_doc_staging": [],
  "vgph_temp_staging": []
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
            vgphe_id:"bigint",
            vgphse_uuid:"string",
            vgphsc_uuid:"string",
            uuid:"string",
            name:"string",
            mobile_number:"string",
            address1:"string",
            address2:"string",
            address3:"string",
            address4:"string",
            zip:"string",
            state:"string",
            city:"string",
            dob:"Date",
            gender:"string",
            nationality:"string",
            first_name:"string",
            last_name:"string",
            country:"string",
            email:"string",
            reference_id:"string",
            is_active:"string",
            product_basic:"json",
            product_additional:"json",
            kyc:"json",
            card:"json",
            request_data:"json",
            response_data:"json",
            compliance_data:"json",
            trs_created_date:"Date",
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
            trs_locked_by:"string",
            trs_locked_time:"Date",
            trs_tenant_id:"string",
            trs_app_code:"string",
            trs_product_code:"string",
            trs_event_process_status:"string",
            trs_event_status:"string",
            trs_token_id:"string",
            trs_version:"string",
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
      const { vgphe_id }: {vgphe_id : bigint} = queryValue;
      const { vgphse_uuid }: {vgphse_uuid : string} = queryValue;
      const { vgphsc_uuid }: {vgphsc_uuid : string} = queryValue;
      const { uuid }: {uuid : string} = queryValue;
      const { name }: {name : string} = queryValue;
      const { mobile_number }: {mobile_number : string} = queryValue;
      const { address1 }: {address1 : string} = queryValue;
      const { address2 }: {address2 : string} = queryValue;
      const { address3 }: {address3 : string} = queryValue;
      const { address4 }: {address4 : string} = queryValue;
      const { zip }: {zip : string} = queryValue;
      const { state }: {state : string} = queryValue;
      const { city }: {city : string} = queryValue;
      const { dob }: {dob : any } = queryValue;
      const { gender }: {gender : string} = queryValue;
      const { nationality }: {nationality : string} = queryValue;
      const { first_name }: {first_name : string} = queryValue;
      const { last_name }: {last_name : string} = queryValue;
      const { country }: {country : string} = queryValue;
      const { email }: {email : string} = queryValue;
      const { reference_id }: {reference_id : string} = queryValue;
      const { is_active }: {is_active : string} = queryValue;
      const { product_basic }: {product_basic : any } = queryValue;
      const { product_additional }: {product_additional : any } = queryValue;
      const { kyc }: {kyc : any } = queryValue;
      const { card }: {card : any } = queryValue;
      const { request_data }: {request_data : any } = queryValue;
      const { response_data }: {response_data : any } = queryValue;
      const { compliance_data }: {compliance_data : any } = queryValue;
      const { trs_created_date }: {trs_created_date :  Date} = queryValue;
      const { trs_created_by }: {trs_created_by : string} = queryValue;
      const { trs_modified_date }: {trs_modified_date :  Date} = queryValue;
      const { trs_modified_by }: {trs_modified_by : string} = queryValue;
      const { trs_process_id }: {trs_process_id : string} = queryValue;
      const { trs_access_profile }: {trs_access_profile : string} = queryValue;
      const { trs_org_grp_code }: {trs_org_grp_code : string} = queryValue;
      const { trs_org_code }: {trs_org_code : string} = queryValue;
      const { trs_role_grp_code }: {trs_role_grp_code : string} = queryValue;
      const { trs_role_code }: {trs_role_code : string} = queryValue;
      const { trs_ps_grp_code }: {trs_ps_grp_code : string} = queryValue;
      const { trs_ps_code }: {trs_ps_code : string} = queryValue;
      const { trs_sub_org_grp_code }: {trs_sub_org_grp_code : string} = queryValue;
      const { trs_sub_org_code }: {trs_sub_org_code : string} = queryValue;
      const { trs_locked_by }: {trs_locked_by : string} = queryValue;
      const { trs_locked_time }: {trs_locked_time :  Date} = queryValue;
      const { trs_tenant_id }: {trs_tenant_id : string} = queryValue;
      const { trs_app_code }: {trs_app_code : string} = queryValue;
      const { trs_product_code }: {trs_product_code : string} = queryValue;
      const { trs_event_process_status }: {trs_event_process_status : string} = queryValue;
      const { trs_event_status }: {trs_event_status : string} = queryValue;
      const { trs_token_id }: {trs_token_id : string} = queryValue;
      const { trs_version }: {trs_version : string} = queryValue;

      if(vgphe_id){ 
        query.vgphe_id = { [queryCondition['vgphe_id']]: vgphe_id };
      }
      if(vgphse_uuid){ 
        query.vgphse_uuid = { [queryCondition['vgphse_uuid']]: vgphse_uuid };
      }
      if(vgphsc_uuid){ 
        query.vgphsc_uuid = { [queryCondition['vgphsc_uuid']]: vgphsc_uuid };
      }
      if(uuid){ 
        query.uuid = { [queryCondition['uuid']]: uuid };
      }
      if(name){ 
        query.name = { [queryCondition['name']]: name };
      }
      if(mobile_number){ 
        query.mobile_number = { [queryCondition['mobile_number']]: mobile_number };
      }
      if(address1){ 
        query.address1 = { [queryCondition['address1']]: address1 };
      }
      if(address2){ 
        query.address2 = { [queryCondition['address2']]: address2 };
      }
      if(address3){ 
        query.address3 = { [queryCondition['address3']]: address3 };
      }
      if(address4){ 
        query.address4 = { [queryCondition['address4']]: address4 };
      }
      if(zip){ 
        query.zip = { [queryCondition['zip']]: zip };
      }
      if(state){ 
        query.state = { [queryCondition['state']]: state };
      }
      if(city){ 
        query.city = { [queryCondition['city']]: city };
      }
      if(dob){ 
        query.dob = { [queryCondition['dob']]: dob };
      }
      if(gender){ 
        query.gender = { [queryCondition['gender']]: gender };
      }
      if(nationality){ 
        query.nationality = { [queryCondition['nationality']]: nationality };
      }
      if(first_name){ 
        query.first_name = { [queryCondition['first_name']]: first_name };
      }
      if(last_name){ 
        query.last_name = { [queryCondition['last_name']]: last_name };
      }
      if(country){ 
        query.country = { [queryCondition['country']]: country };
      }
      if(email){ 
        query.email = { [queryCondition['email']]: email };
      }
      if(reference_id){ 
        query.reference_id = { [queryCondition['reference_id']]: reference_id };
      }
      if(is_active){ 
        query.is_active = { [queryCondition['is_active']]: is_active };
      }
      if(product_basic){ 
        query.product_basic = { [queryCondition['product_basic']]: product_basic };
      }
      if(product_additional){ 
        query.product_additional = { [queryCondition['product_additional']]: product_additional };
      }
      if(kyc){ 
        query.kyc = { [queryCondition['kyc']]: kyc };
      }
      if(card){ 
        query.card = { [queryCondition['card']]: card };
      }
      if(request_data){ 
        query.request_data = { [queryCondition['request_data']]: request_data };
      }
      if(response_data){ 
        query.response_data = { [queryCondition['response_data']]: response_data };
      }
      if(compliance_data){ 
        query.compliance_data = { [queryCondition['compliance_data']]: compliance_data };
      }
      if(trs_created_date){ 
        query.trs_created_date = { [queryCondition['trs_created_date']]: trs_created_date };
      }
      if(trs_created_by){ 
        query.trs_created_by = { [queryCondition['trs_created_by']]: trs_created_by };
      }
      if(trs_modified_date){ 
        query.trs_modified_date = { [queryCondition['trs_modified_date']]: trs_modified_date };
      }
      if(trs_modified_by){ 
        query.trs_modified_by = { [queryCondition['trs_modified_by']]: trs_modified_by };
      }
      if(trs_process_id){ 
        query.trs_process_id = { [queryCondition['trs_process_id']]: trs_process_id };
      }
      if(trs_access_profile){ 
        query.trs_access_profile = { [queryCondition['trs_access_profile']]: trs_access_profile };
      }
      if(trs_org_grp_code){ 
        query.trs_org_grp_code = { [queryCondition['trs_org_grp_code']]: trs_org_grp_code };
      }
      if(trs_org_code){ 
        query.trs_org_code = { [queryCondition['trs_org_code']]: trs_org_code };
      }
      if(trs_role_grp_code){ 
        query.trs_role_grp_code = { [queryCondition['trs_role_grp_code']]: trs_role_grp_code };
      }
      if(trs_role_code){ 
        query.trs_role_code = { [queryCondition['trs_role_code']]: trs_role_code };
      }
      if(trs_ps_grp_code){ 
        query.trs_ps_grp_code = { [queryCondition['trs_ps_grp_code']]: trs_ps_grp_code };
      }
      if(trs_ps_code){ 
        query.trs_ps_code = { [queryCondition['trs_ps_code']]: trs_ps_code };
      }
      if(trs_sub_org_grp_code){ 
        query.trs_sub_org_grp_code = { [queryCondition['trs_sub_org_grp_code']]: trs_sub_org_grp_code };
      }
      if(trs_sub_org_code){ 
        query.trs_sub_org_code = { [queryCondition['trs_sub_org_code']]: trs_sub_org_code };
      }
      if(trs_locked_by){ 
        query.trs_locked_by = { [queryCondition['trs_locked_by']]: trs_locked_by };
      }
      if(trs_locked_time){ 
        query.trs_locked_time = { [queryCondition['trs_locked_time']]: trs_locked_time };
      }
      if(trs_tenant_id){ 
        query.trs_tenant_id = { [queryCondition['trs_tenant_id']]: trs_tenant_id };
      }
      if(trs_app_code){ 
        query.trs_app_code = { [queryCondition['trs_app_code']]: trs_app_code };
      }
      if(trs_product_code){ 
        query.trs_product_code = { [queryCondition['trs_product_code']]: trs_product_code };
      }
      if(trs_event_process_status){ 
        query.trs_event_process_status = { [queryCondition['trs_event_process_status']]: trs_event_process_status };
      }
      if(trs_event_status){ 
        query.trs_event_status = { [queryCondition['trs_event_status']]: trs_event_status };
      }
      if(trs_token_id){ 
        query.trs_token_id = { [queryCondition['trs_token_id']]: trs_token_id };
      }
      if(trs_version){ 
        query.trs_version = { [queryCondition['trs_version']]: trs_version };
      }
      const skip = (page - 1) * limit;
      if (Object.keys(query).length > 0) {
        const banks = await this.prismaService.withConnection(() =>
        this.prismaService.vgph_employee.findMany({
          select:columns,
          where: query,          
        }));
        let decryptedRes: any = [];
        for (const indiviual of banks) {
          const decryptedData = await this.decryptData(indiviual, 'vgph_employee');
          decryptedRes.push(decryptedData);
        }
        return decryptedRes;
      }

      if(!skip && !limit && Object.keys(query).length == 0){
        const banks = await this.prismaService.withConnection(() =>
        this.prismaService.vgph_employee.findMany({
          select:columns,
        }));
        let decryptedRes: any = [];
        for (const indiviual of banks) {
          const decryptedData = await this.decryptData(indiviual, 'vgph_employee');
          decryptedRes.push(decryptedData);
        }
        return decryptedRes;
      }

      const banks = await this.prismaService.withConnection(() =>
      this.prismaService.vgph_employee.findMany({
        select:columns,
        where: query,
        skip: skip,
        take: limit,
      }));

      const totalItems = await this.prismaService.withConnection(() =>
      this.prismaService.vgph_employee.count({
        where: query,
      }));

      let decryptedRes: any = [];
      for (const indiviual of banks) {
        const decryptedData = await this.decryptData(indiviual, 'vgph_employee');
        decryptedRes.push(decryptedData);
      }
      return {
        items: decryptedRes,
        totalPages: Math.ceil(totalItems / limit),
      };
    } catch (error:any) {
      const errorMessage = 'Error in findAllmethod';
      await this.commonService.errorLog(
        "Technical",
        'AK',
        'Fatal',
        "TG020",
        error,
        "CK:CT005:FNGK:AF:FNK:API-ERD:CATK:GSS:AFGK:VGPH:AFK:VGPH_STAGE_ERD:AFVK:v1",
        token
      );
      throw new CustomException(errorMessage, error);
    }
  }

  async findOne(vgphe_id:number,token : string) {
    try{
      const res = await this.prismaService.withConnection(() =>
      this.prismaService.vgph_employee.findMany({ 
      where: {vgphe_id},
      select: {vgphe_id:true,vgphse_uuid:true,vgphsc_uuid:true,uuid:true,name:true,mobile_number:true,address1:true,address2:true,address3:true,address4:true,zip:true,state:true,city:true,dob:true,gender:true,nationality:true,first_name:true,last_name:true,country:true,email:true,reference_id:true,is_active:true,product_basic:true,product_additional:true,kyc:true,card:true,request_data:true,response_data:true,compliance_data:true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true,trs_sub_org_grp_code:true,trs_sub_org_code:true,trs_locked_by:true,trs_locked_time:true,trs_tenant_id:true,trs_app_code:true,trs_product_code:true,trs_event_process_status:true,trs_event_status:true,trs_token_id:true,trs_version:true,        }
    }));
    //return await this.decryptData(await this.commonDecimalDatahandle(res), 'vgph_employee');
    let decryptedRes: any = [];
    for (const indiviual of res) {
      const plain = await this.commonDecimalDatahandle(indiviual)
      const decryptedData = await this.decryptData(plain, 'vgph_employee');
      decryptedRes.push(decryptedData);
    }
    return decryptedRes;
  } catch (error:any) {
    const errorMessage = 'Error in findOne';
      await this.commonService.errorLog(
        "Technical",
        'AK',
        'Fatal',
        "TG024",
        error,
        "CK:CT005:FNGK:AF:FNK:API-ERD:CATK:GSS:AFGK:VGPH:AFK:VGPH_STAGE_ERD:AFVK:v1",
        token
      );
      throw new CustomException(errorMessage, error);
  }
  }

  async findAll(token : string
,vgphe_id?:number) {
    try{
      const whereClause: any = {};
      if (vgphe_id) {
        whereClause.vgphe_id = vgphe_id;
      }
      const res = await this.prismaService.withConnection(() =>
      this.prismaService.vgph_employee.findMany({ 
      where: whereClause,
      select: {vgphe_id:true,vgphse_uuid:true,vgphsc_uuid:true,uuid:true,name:true,mobile_number:true,address1:true,address2:true,address3:true,address4:true,zip:true,state:true,city:true,dob:true,gender:true,nationality:true,first_name:true,last_name:true,country:true,email:true,reference_id:true,is_active:true,product_basic:true,product_additional:true,kyc:true,card:true,request_data:true,response_data:true,compliance_data:true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true,trs_sub_org_grp_code:true,trs_sub_org_code:true,trs_locked_by:true,trs_locked_time:true,trs_tenant_id:true,trs_app_code:true,trs_product_code:true,trs_event_process_status:true,trs_event_status:true,trs_token_id:true,trs_version:true,      }
      }));
      let decryptedRes: any = [];
      for (const indiviual of res) {
        const plain = await this.commonDecimalDatahandle(indiviual)
        const decryptedData = await this.decryptData(plain, 'vgph_employee');
        decryptedRes.push(decryptedData);
      }
      return decryptedRes;
    } catch (error:any) {
        const errorMessage = 'find All Error';
        await this.commonService.errorLog(
          "Technical",
          'AK',
          'Fatal',
          "TG023",
          error,
          "CK:CT005:FNGK:AF:FNK:API-ERD:CATK:GSS:AFGK:VGPH:AFK:VGPH_STAGE_ERD:AFVK:v1",
          token
        );
        throw new CustomException(errorMessage, error);
    }
    }
    
  async create(createvgph_employeeDto: Prisma.vgph_employeeCreateInput,token:string) {
    try{

      const dataSchema:any =  v.object({
            vgphe_id :v.pipe(v.number(),v.maxValue(9999999999999999999999999999999999999999999999999999999999999999 )) , 
            vgphse_uuid :v.pipe(v.string(),v.maxLength(64 )) , 
            vgphsc_uuid :v.pipe(v.string(),v.maxLength(64 )) , 
            uuid :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            name :  v.optional(v.pipe(v.string(),v.maxLength(128 ))), 
            mobile_number :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
            address1 :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            address2 :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            address3 :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            address4 :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            zip :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
            state :  v.optional(v.pipe(v.string(),v.maxLength(32 ))), 
            city :  v.optional(v.pipe(v.string(),v.maxLength(32 ))), 
            dob :  v.optional(v.pipe(
                  v.string(),
                  v.regex(
                    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|([+-])(\d{2}):(\d{2}))$/,
                    'The date-time is badly formatted.'
                  )  // Full ISO 8601 date-time format
                )), 
            gender :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
            nationality :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
            first_name :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            last_name :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            country :  v.optional(v.pipe(v.string(),v.maxLength(3 ))), 
            email :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            reference_id :  v.optional(v.pipe(v.string(),v.maxLength(32 ))), 
            is_active :  v.optional(v.pipe(v.string(),v.maxLength(1 ))), 
            product_basic :  v.optional(v.any() ), 
            product_additional :  v.optional(v.any() ), 
            kyc :  v.optional(v.any() ), 
            card :  v.optional(v.any() ), 
            request_data :  v.optional(v.any() ), 
            response_data :  v.optional(v.any() ), 
            compliance_data :  v.optional(v.any() ), 
            trs_created_date :(v.pipe(v.string(),v.isoDate()))  , 
            trs_created_by :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            trs_modified_date :  v.optional((v.any())), 
            trs_modified_by :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            trs_process_id :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            trs_access_profile :  v.optional(v.pipe(v.string(),v.maxLength(32 ))), 
            trs_org_grp_code :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
            trs_org_code :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
            trs_role_grp_code :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            trs_role_code :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            trs_ps_grp_code :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            trs_ps_code :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            trs_sub_org_grp_code :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
            trs_sub_org_code :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
            trs_locked_by :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            trs_locked_time :  v.optional((v.any())), 
            trs_tenant_id :v.pipe(v.string(),v.maxLength(16 )) , 
            trs_app_code :v.pipe(v.string(),v.maxLength(16 )) , 
            trs_product_code :v.pipe(v.string(),v.maxLength(16 )) , 
            trs_event_process_status :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            trs_event_status :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            trs_token_id :  v.optional(v.pipe(v.string(),v.maxLength(32 ))), 
            trs_version :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
        });
        let validate : any = v.safeParse(dataSchema,createvgph_employeeDto);
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
            "CK:CT005:FNGK:AF:FNK:API-ERD:CATK:GSS:AFGK:VGPH:AFK:VGPH_STAGE_ERD:AFVK:v1",
            token
          );
        }
      const encryptedData = await this.encryptData(createvgph_employeeDto, 'vgph_employee', 'create');
      const res = await this.prismaService.withConnection(() =>
        this.prismaService.vgph_employee.create({
          data: encryptedData,
          select:{vgphe_id:true,vgphse_uuid:true,vgphsc_uuid:true,uuid:true,name:true,mobile_number:true,address1:true,address2:true,address3:true,address4:true,zip:true,state:true,city:true,dob:true,gender:true,nationality:true,first_name:true,last_name:true,country:true,email:true,reference_id:true,is_active:true,product_basic:true,product_additional:true,kyc:true,card:true,request_data:true,response_data:true,compliance_data:true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true,trs_sub_org_grp_code:true,trs_sub_org_code:true,trs_locked_by:true,trs_locked_time:true,trs_tenant_id:true,trs_app_code:true,trs_product_code:true,trs_event_process_status:true,trs_event_status:true,trs_token_id:true,trs_version:true,}          
        })
      );
    return await this.decryptData(await this.commonDecimalDatahandle(res), 'vgph_employee');
  } catch (error:any) {
    const errMsg = parsePrismaCreateError(error);
    const errorMessage = 'Create Error';
    await this.commonService.errorLog(
      "Technical",
      'AK',
      'Fatal',
      "TG022",
      errMsg.message,
      "CK:CT005:FNGK:AF:FNK:API-ERD:CATK:GSS:AFGK:VGPH:AFK:VGPH_STAGE_ERD:AFVK:v1",
      token
    );
    throw new InternalServerErrorException(errMsg.message);
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
    createvgph_employeeDto: Prisma.vgph_employeeCreateInput,
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
              message: 'vgph_employee creation approved and applied successfully',
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
              message: 'vgph_employee creation rejected',
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

      const dataSchema:any =  v.object({
            vgphe_id :v.pipe(v.number(),v.maxValue(9999999999999999999999999999999999999999999999999999999999999999 )) , 
            vgphse_uuid :v.pipe(v.string(),v.maxLength(64 )) , 
            vgphsc_uuid :v.pipe(v.string(),v.maxLength(64 )) , 
            uuid :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            name :  v.optional(v.pipe(v.string(),v.maxLength(128 ))), 
            mobile_number :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
            address1 :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            address2 :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            address3 :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            address4 :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            zip :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
            state :  v.optional(v.pipe(v.string(),v.maxLength(32 ))), 
            city :  v.optional(v.pipe(v.string(),v.maxLength(32 ))), 
            dob :  v.optional(v.pipe(
                  v.string(),
                  v.regex(
                    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|([+-])(\d{2}):(\d{2}))$/,
                    'The date-time is badly formatted.'
                  )  // Full ISO 8601 date-time format
                )), 
            gender :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
            nationality :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
            first_name :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            last_name :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            country :  v.optional(v.pipe(v.string(),v.maxLength(3 ))), 
            email :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            reference_id :  v.optional(v.pipe(v.string(),v.maxLength(32 ))), 
            is_active :  v.optional(v.pipe(v.string(),v.maxLength(1 ))), 
            product_basic :  v.optional(v.any() ), 
            product_additional :  v.optional(v.any() ), 
            kyc :  v.optional(v.any() ), 
            card :  v.optional(v.any() ), 
            request_data :  v.optional(v.any() ), 
            response_data :  v.optional(v.any() ), 
            compliance_data :  v.optional(v.any() ), 
            trs_created_date :(v.pipe(v.string(),v.isoDate()))  , 
            trs_created_by :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            trs_modified_date :  v.optional((v.any())), 
            trs_modified_by :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            trs_process_id :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            trs_access_profile :  v.optional(v.pipe(v.string(),v.maxLength(32 ))), 
            trs_org_grp_code :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
            trs_org_code :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
            trs_role_grp_code :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            trs_role_code :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            trs_ps_grp_code :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            trs_ps_code :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            trs_sub_org_grp_code :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
            trs_sub_org_code :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
            trs_locked_by :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            trs_locked_time :  v.optional((v.any())), 
            trs_tenant_id :v.pipe(v.string(),v.maxLength(16 )) , 
            trs_app_code :v.pipe(v.string(),v.maxLength(16 )) , 
            trs_product_code :v.pipe(v.string(),v.maxLength(16 )) , 
            trs_event_process_status :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            trs_event_status :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
            trs_token_id :  v.optional(v.pipe(v.string(),v.maxLength(32 ))), 
            trs_version :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
        });
        let validate : any = v.safeParse(dataSchema,createvgph_employeeDto);
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
            "CK:CT005:FNGK:AF:FNK:API-ERD:CATK:GSS:AFGK:VGPH:AFK:VGPH_STAGE_ERD:AFVK:v1",
            token
          );
          throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
        }
      
      // Encrypt data if needed
      const encryptedData = await this.encryptData(createvgph_employeeDto, 'vgph_employee', 'create');
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
            p_table_name     := 'vgph_employee',
            p_operation_type := 'INSERT',
            p_record_id      := NULL,
            p_record_id_column := 'vgphe_id',
            p_changes        := ${encryptedData}::JSONB,
            p_maker_id       := ${userInfo.username},
            p_maker_remarks  := ${userInfo.remarks || null},
            p_schema    := 'ct005_gss'
          ) AS approval_id
        `);

        const approvalId = result[0]?.approval_id;

        return {
          success: true,
          message: 'vgph_employee creation request submitted for approval',
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
        "CK:CT005:FNGK:AF:FNK:API-ERD:CATK:GSS:AFGK:VGPH:AFK:VGPH_STAGE_ERD:AFVK:v1",
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

  async update(vgphe_id:number, updatevgph_employeeDto: Prisma.vgph_employeeUpdateInput,token:string) {   
    try{

      const dataSchema:any =  v.object({
          vgphse_uuid :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          vgphsc_uuid :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          uuid :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          name :  v.optional(v.pipe(v.string(),v.maxLength(128 ))), 
          mobile_number :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
          address1 :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          address2 :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          address3 :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          address4 :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          zip :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
          state :  v.optional(v.pipe(v.string(),v.maxLength(32 ))), 
          city :  v.optional(v.pipe(v.string(),v.maxLength(32 ))), 
          dob :  v.optional(v.pipe(
            v.string(),
            v.regex(
              /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|([+-])(\d{2}):(\d{2}))$/,
              'The date-time is badly formatted.'
            )  // Full ISO 8601 date-time format
          )), 
          gender :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
          nationality :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
          first_name :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          last_name :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          country :  v.optional(v.pipe(v.string(),v.maxLength(3 ))), 
          email :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          reference_id :  v.optional(v.pipe(v.string(),v.maxLength(32 ))), 
          is_active :  v.optional(v.pipe(v.string(),v.maxLength(1 ))), 
          product_basic :  v.optional(v.any()), 
          product_additional :  v.optional(v.any()), 
          kyc :  v.optional(v.any()), 
          card :  v.optional(v.any()), 
          request_data :  v.optional(v.any()), 
          response_data :  v.optional(v.any()), 
          compliance_data :  v.optional(v.any()), 
          trs_created_date :  v.optional((v.any())), 
          trs_created_by :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          trs_modified_date :  v.optional((v.any())), 
          trs_modified_by :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          trs_process_id :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          trs_access_profile :  v.optional(v.pipe(v.string(),v.maxLength(32 ))), 
          trs_org_grp_code :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
          trs_org_code :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
          trs_role_grp_code :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          trs_role_code :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          trs_ps_grp_code :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          trs_ps_code :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          trs_sub_org_grp_code :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
          trs_sub_org_code :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
          trs_locked_by :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          trs_locked_time :  v.optional((v.any())), 
          trs_tenant_id :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
          trs_app_code :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
          trs_product_code :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
          trs_event_process_status :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          trs_event_status :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          trs_token_id :  v.optional(v.pipe(v.string(),v.maxLength(32 ))), 
          trs_version :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
      });
      let validate : any = v.safeParse(dataSchema,updatevgph_employeeDto);
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
          "CK:CT005:FNGK:AF:FNK:API-ERD:CATK:GSS:AFGK:VGPH:AFK:VGPH_STAGE_ERD:AFVK:v1",
          token
        );
      }
      const encryptedData = await this.encryptData(updatevgph_employeeDto,'vgph_employee','update');
      await this.prismaService.withConnection(() =>
      this.prismaService.vgph_employee.updateMany({
      where: {vgphe_id},
      data: encryptedData
    }));
    const updated = await this.prismaService.withConnection(() =>
      this.prismaService.vgph_employee.findMany({
      where: {vgphe_id},
      select: {vgphe_id:true,vgphse_uuid:true,vgphsc_uuid:true,uuid:true,name:true,mobile_number:true,address1:true,address2:true,address3:true,address4:true,zip:true,state:true,city:true,dob:true,gender:true,nationality:true,first_name:true,last_name:true,country:true,email:true,reference_id:true,is_active:true,product_basic:true,product_additional:true,kyc:true,card:true,request_data:true,response_data:true,compliance_data:true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true,trs_sub_org_grp_code:true,trs_sub_org_code:true,trs_locked_by:true,trs_locked_time:true,trs_tenant_id:true,trs_app_code:true,trs_product_code:true,trs_event_process_status:true,trs_event_status:true,trs_token_id:true,trs_version:true,}
    }));
    // return await this.decryptData(await this.commonDecimalDatahandle(res), 'vgph_employee');
    let decryptedRes: any = [];
    for (const indiviual of updated) {
      const plain = await this.commonDecimalDatahandle(indiviual)
      const decryptedData = await this.decryptData(plain, 'vgph_employee');
      decryptedRes.push(decryptedData);
    }
    return decryptedRes;
    } catch (error:any) {
        const errorMessage = 'update Error';
        await this.commonService.errorLog(
          "Technical",
          'AK',
          'Fatal',
          "TG023",
          error,
          "CK:CT005:FNGK:AF:FNK:API-ERD:CATK:GSS:AFGK:VGPH:AFK:VGPH_STAGE_ERD:AFVK:v1",
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
vgphe_id:number,
    updatevgph_employeeDto: Prisma.vgph_employeeUpdateInput,
    userInfo: { role: string; username: string; remarks?: string,approvalStatus?:string },
    token:string
  ) {
    try {
      const role = userInfo.role?.toUpperCase();
      const updateMaster_id =vgphe_id;

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
              p_table_name      := 'vgph_employee',
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
            message: 'vgph_employee update approved and applied successfully',
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
                p_table_name      := 'vgph_employee',
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
              message: 'vgph_employee update rejected',
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

      const dataSchema:any =  v.object({
          vgphse_uuid :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          vgphsc_uuid :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          uuid :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          name :  v.optional(v.pipe(v.string(),v.maxLength(128 ))), 
          mobile_number :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
          address1 :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          address2 :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          address3 :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          address4 :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          zip :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
          state :  v.optional(v.pipe(v.string(),v.maxLength(32 ))), 
          city :  v.optional(v.pipe(v.string(),v.maxLength(32 ))), 
          dob :  v.optional(v.pipe(
            v.string(),
            v.regex(
              /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|([+-])(\d{2}):(\d{2}))$/,
              'The date-time is badly formatted.'
            )  // Full ISO 8601 date-time format
          )), 
          gender :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
          nationality :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
          first_name :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          last_name :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          country :  v.optional(v.pipe(v.string(),v.maxLength(3 ))), 
          email :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          reference_id :  v.optional(v.pipe(v.string(),v.maxLength(32 ))), 
          is_active :  v.optional(v.pipe(v.string(),v.maxLength(1 ))), 
          product_basic :  v.optional(v.any()), 
          product_additional :  v.optional(v.any()), 
          kyc :  v.optional(v.any()), 
          card :  v.optional(v.any()), 
          request_data :  v.optional(v.any()), 
          response_data :  v.optional(v.any()), 
          compliance_data :  v.optional(v.any()), 
          trs_created_date :  v.optional((v.any())), 
          trs_created_by :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          trs_modified_date :  v.optional((v.any())), 
          trs_modified_by :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          trs_process_id :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          trs_access_profile :  v.optional(v.pipe(v.string(),v.maxLength(32 ))), 
          trs_org_grp_code :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
          trs_org_code :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
          trs_role_grp_code :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          trs_role_code :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          trs_ps_grp_code :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          trs_ps_code :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          trs_sub_org_grp_code :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
          trs_sub_org_code :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
          trs_locked_by :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          trs_locked_time :  v.optional((v.any())), 
          trs_tenant_id :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
          trs_app_code :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
          trs_product_code :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
          trs_event_process_status :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          trs_event_status :  v.optional(v.pipe(v.string(),v.maxLength(64 ))), 
          trs_token_id :  v.optional(v.pipe(v.string(),v.maxLength(32 ))), 
          trs_version :  v.optional(v.pipe(v.string(),v.maxLength(16 ))), 
      });
      let validate : any = v.safeParse(dataSchema,updatevgph_employeeDto);
      if (!validate.success) {
        const errorMessage = validate.issues[0].message;
        await this.commonService.errorLog(
          "Technical",
          'AK',
          'Fatal',
          "TG025",
          errorMessage,
          "CK:CT005:FNGK:AF:FNK:API-ERD:CATK:GSS:AFGK:VGPH:AFK:VGPH_STAGE_ERD:AFVK:v1",
          token
        );
        throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
      }

      // Verify record exists
      const existingRecord = await this.prismaService.withConnection(() =>
      this.prismaService.vgph_employee.findMany({
        where: {vgphe_id}
      }));

      if (!existingRecord) {
        throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
      }

      // Encrypt data if needed
      const encryptedData = await this.encryptData(updatevgph_employeeDto, 'vgph_employee', 'update');

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
          p_table_name     := 'vgph_employee',
          p_operation_type := 'UPDATE',
          p_record_id      := ${updateMaster_id.toString()},
          p_record_id_column := 'vgphe_id',
          p_changes        := ${encryptedData}::JSONB,
          p_maker_id       := ${userInfo.username},
          p_maker_remarks  := ${userInfo.remarks || null},
          p_schema    := 'ct005_gss'
        ) AS approval_id
      `);

      const approvalId = result[0]?.approval_id;

      return {
        success: true,
        message: 'vgph_employee update request submitted for approval',
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
        "CK:CT005:FNGK:AF:FNK:API-ERD:CATK:GSS:AFGK:VGPH:AFK:VGPH_STAGE_ERD:AFVK:v1",
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

  async remove(vgphe_id:number,token : string) {
    try{
    const toDelete = await this.prismaService.withConnection(() =>
      this.prismaService.vgph_employee.findMany({
      where: {vgphe_id},
      select: {vgphe_id:true,vgphse_uuid:true,vgphsc_uuid:true,uuid:true,name:true,mobile_number:true,address1:true,address2:true,address3:true,address4:true,zip:true,state:true,city:true,dob:true,gender:true,nationality:true,first_name:true,last_name:true,country:true,email:true,reference_id:true,is_active:true,product_basic:true,product_additional:true,kyc:true,card:true,request_data:true,response_data:true,compliance_data:true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true,trs_sub_org_grp_code:true,trs_sub_org_code:true,trs_locked_by:true,trs_locked_time:true,trs_tenant_id:true,trs_app_code:true,trs_product_code:true,trs_event_process_status:true,trs_event_status:true,trs_token_id:true,trs_version:true,}
    })); 
    await this.prismaService.withConnection(() =>
      this.prismaService.vgph_employee.deleteMany({
      where: {vgphe_id}
    })); 
    // return await this.decryptData(await this.commonDecimalDatahandle(res), 'vgph_employee');
    let decryptedRes: any = [];
    for (const indiviual of toDelete) {
      const plain = await this.commonDecimalDatahandle(indiviual)
      const decryptedData = await this.decryptData(plain, 'vgph_employee');
      decryptedRes.push(decryptedData);
    }
    return decryptedRes;
  } catch (error:any) {
    const errorMessage = 'Error in remove Data';
      await this.commonService.errorLog(
        "Technical",
        'AK',
        'Fatal',
        "TG026",
        error,
        "CK:CT005:FNGK:AF:FNK:API-ERD:CATK:GSS:AFGK:VGPH:AFK:VGPH_STAGE_ERD:AFVK:v1",
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
vgphe_id:number,
    userInfo: { role: string; username: string; remarks?: string; approvalStatus?:string },
    token: string
  ) {
    try {
      const role = userInfo.role?.toUpperCase();
      const deleteMaster_id =vgphe_id;

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
              p_table_name      := 'vgph_employee',
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
            message: 'vgph_employee deletion approved and applied successfully',
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
                p_table_name      := 'vgph_employee',
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
              message: 'vgph_employee deletion rejected',
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
      this.prismaService.vgph_employee.findMany({
        where: {vgphe_id  }
      }));

      if (!existingRecord) {
        throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
      }

      // Call request_change() for DELETE
      // For DELETE: p_record_id is the ID, p_changes is empty object
      const result = await this.prismaService.withConnection(() =>
      this.prismaService.$queryRaw<any[]>`
        SELECT ct006_torus202610.request_change(
          p_table_name     := 'vgph_employee',
          p_operation_type := 'DELETE',
          p_record_id      := ${deleteMaster_id.toString()},
          p_record_id_column := 'vgphe_id',
          p_changes        := '{}'::JSONB,
          p_maker_id       := ${userInfo.username},
          p_maker_remarks  := ${userInfo.remarks || null},
          p_schema    := 'ct005_gss'
        ) AS approval_id
      `);

      const approvalId = result[0]?.approval_id;

      return {
        success: true,
        message: 'vgph_employee deletion request submitted for approval',
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
        "CK:CT005:FNGK:AF:FNK:API-ERD:CATK:GSS:AFGK:VGPH:AFK:VGPH_STAGE_ERD:AFVK:v1",
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
      this.prismaService.vgph_employee.findFirst({ 
        orderBy: { trs_created_date: 'asc' },
      }));
      return await this.decryptData(await this.commonDecimalDatahandle(res), 'vgph_employee');
    } catch (error:any) {
      const errorMessage = 'Error in findFirst';
        await this.commonService.errorLog(
          "Technical",
          'AK',
          'Fatal',
          "TG028",
          error,
          "CK:CT005:FNGK:AF:FNK:API-ERD:CATK:GSS:AFGK:VGPH:AFK:VGPH_STAGE_ERD:AFVK:v1",
          token
        );
        throw new CustomException(errorMessage, error);
      }
  }
  async findLast(token : string) {
    try{
      const res = await this.prismaService.withConnection(() =>
      this.prismaService.vgph_employee.findFirst({ 
        orderBy: { trs_created_date: 'desc' },
      }));
      return await this.decryptData(await this.commonDecimalDatahandle(res), 'vgph_employee');
    } catch (error:any) {
      const errorMessage = 'Error in findLast';
        await this.commonService.errorLog(
          "Technical",
          'AK',
          'Fatal',
          "TG028",
          error,
          "CK:CT005:FNGK:AF:FNK:API-ERD:CATK:GSS:AFGK:VGPH:AFK:VGPH_STAGE_ERD:AFVK:v1",
          token
        );
        throw new CustomException(errorMessage, error);
      }
  }

}
