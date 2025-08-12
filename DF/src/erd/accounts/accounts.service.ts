
import { HttpException, Injectable,HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import * as v from 'valibot';
import { errorObj } from 'src/dto';
import { CommonService } from 'src/common.Service';
import { accountsEntity } from './entity/accounts.entity';
@Injectable()
export class accountsService {
  constructor(private readonly prismaService: PrismaService,
  private readonly commonService: CommonService) {}
  private encryptedCols: any={
  "seacore": [],
  "billing": [],
  "accounts": [
    {
      "column": "transactions",
      "isRequired": true,
      "dataType": "childtable"
    }
  ],
  "transactions": []
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
      account_id:"number",
      customer_name:"string",
      phone_number:"bigint",
      dob:"number",
      account_type:"string",
      email:"string",
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
      const { account_id }: {account_id : number} = queryValue;
      const { customer_name }: {customer_name : string} = queryValue;
      const { phone_number }: {phone_number : bigint} = queryValue;
      const { dob }: {dob : number} = queryValue;
      const { account_type }: {account_type : string} = queryValue;
      const { email }: {email : string} = queryValue;

      if(account_id){ 
        query.account_id = { [queryCondition['account_id']]: account_id };
      }
      if(customer_name){ 
        query.customer_name = { [queryCondition['customer_name']]: customer_name };
      }
      if(phone_number){ 
        query.phone_number = { [queryCondition['phone_number']]: phone_number };
      }
      if(dob){ 
        query.dob = { [queryCondition['dob']]: dob };
      }
      if(account_type){ 
        query.account_type = { [queryCondition['account_type']]: account_type };
      }
      if(email){ 
        query.email = { [queryCondition['email']]: email };
      }
      const skip = (page - 1) * limit;
      if (Object.keys(query).length > 0) {
        const banks = await this.prismaService.accounts.findMany({
          select:columns,
          where: query,          
        });
        let decryptedRes: any = [];
        for (const indiviual of banks) {
          const decryptedData = await this.decryptData(indiviual, 'accounts');
          decryptedRes.push(decryptedData);
        }
        return decryptedRes;
      }

      if(!skip && !limit && Object.keys(query).length == 0){
        const banks = await this.prismaService.accounts.findMany({
          select:columns,
        });
        let decryptedRes: any = [];
        for (const indiviual of banks) {
          const decryptedData = await this.decryptData(indiviual, 'accounts');
          decryptedRes.push(decryptedData);
        }
        return decryptedRes;
      }

      const banks = await this.prismaService.accounts.findMany({
        select:columns,
        where: query,
        skip: skip,
        take: limit,
      });

      const totalItems = await this.prismaService.accounts.count({
        where: query,
      });

      let decryptedRes: any = [];
      for (const indiviual of banks) {
        const decryptedData = await this.decryptData(indiviual, 'accounts');
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
        "CK:CT003:FNGK:AF:FNK:API-ERD:CATK:CG:AFGK:TG2:AFK:tableCheck:AFVK:v1",
        token
      );
    }
  }

  async findOne(account_id:number,token : string) {
    try{
      const res = await this.prismaService.accounts.findUnique({ 
      where: {account_id},
      select: {account_id:true,customer_name:true,phone_number:true,dob:true,account_type:true,email:true,            transactions:{
              select:{
              transaction_id:true,              amount:true,              transaction_type:true            ,
          trs_creator_email:true,
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
        trs_creator_email:true,
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
    });
    return  await this.decryptData(res, 'accounts');
  } catch (error) {
    const errorMessage = 'Error in findOne';
      await this.commonService.errorLog(
        "Technical",
        'AK',
        'Fatal',
        "TG024",
        error,
        "CK:CT003:FNGK:AF:FNK:API-ERD:CATK:CG:AFGK:TG2:AFK:tableCheck:AFVK:v1",
        token
      );
  }
  }

  async findAll(token : string) {
    try{
      const whereClause: any = {};
      const res = await this.prismaService.accounts.findMany({ 
      where: whereClause,
      select: {account_id:true,customer_name:true,phone_number:true,dob:true,account_type:true,email:true,          transactions:{
              select:{
              transaction_id:true,              amount:true,              transaction_type:true            ,
          trs_creator_email:true,
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
        trs_creator_email:true,
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
      });
      let decryptedRes: any = [];
      for (const indiviual of res) {
        const decryptedData = await this.decryptData(indiviual, 'accounts');
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
          "CK:CT003:FNGK:AF:FNK:API-ERD:CATK:CG:AFGK:TG2:AFK:tableCheck:AFVK:v1",
          token
        );
    }
    }
    
  async create(createaccountsDto: Prisma.accountsCreateInput,token:string) {
    try{
      const dataSchema:any =  v.object({
            customer_name :  v.optional(v.string() ), 
            phone_number :  v.optional(v.number() ), 
            dob :  v.optional(v.pipe(v.number(),v.maxValue(99999 )) ), 
            account_type :  v.optional(v.string() ), 
            email :  v.optional(v.string() ), 
        });
        let validate : any = v.safeParse(dataSchema,createaccountsDto);
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
            "CK:CT003:FNGK:AF:FNK:API-ERD:CATK:CG:AFGK:TG2:AFK:tableCheck:AFVK:v1",
            token
          );
        }
        
      const res = await this.prismaService.accounts.create({ 
      data: await this.encryptData(createaccountsDto,'accounts','create'),
      select:{account_id:true,customer_name:true,phone_number:true,dob:true,account_type:true,email:true,transactions:true,trs_creator_email:true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_next_status:true,trs_status:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true}
          
    })
    return await this.decryptData(res, 'accounts');
  } catch (error) {
    const errorMessage = 'Create Error';
    await this.commonService.errorLog(
      "Technical",
      'AK',
      'Fatal',
      "TG022",
      error,
      "CK:CT003:FNGK:AF:FNK:API-ERD:CATK:CG:AFGK:TG2:AFK:tableCheck:AFVK:v1",
      token
    );
  }
    
  }

  async update(account_id:number, updateaccountsDto: Prisma.accountsUpdateInput,token:string) {   
    try{
      const dataSchema:any =  v.object({
          customer_name :  v.optional(v.string()), 
          phone_number :  v.optional(v.number()), 
          dob :  v.optional(v.pipe(v.number(),v.maxValue(99999 ))), 
          account_type :  v.optional(v.string()), 
          email :  v.optional(v.string()), 
      });
      let validate : any = v.safeParse(dataSchema,updateaccountsDto);
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
          "CK:CT003:FNGK:AF:FNK:API-ERD:CATK:CG:AFGK:TG2:AFK:tableCheck:AFVK:v1",
          token
        );
      }
      const res = await this.prismaService.accounts.update({
      where: {account_id},
      data: await this.encryptData(updateaccountsDto,'accounts','update'),
      select: {account_id:true,customer_name:true,phone_number:true,dob:true,account_type:true,email:true,transactions:true,trs_creator_email:true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_next_status:true,trs_status:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true}
    });
    return await this.decryptData(res, 'accounts');
    } catch (error) {
        const errorMessage = 'update Error';
        await this.commonService.errorLog(
          "Technical",
          'AK',
          'Fatal',
          "TG023",
          error,
          "CK:CT003:FNGK:AF:FNK:API-ERD:CATK:CG:AFGK:TG2:AFK:tableCheck:AFVK:v1",
          token
        );
    }  
}

  async remove(account_id:number,token : string) {
    try{
      const res = await this.prismaService.accounts.delete({
      where: {account_id },
      select: {account_id:true,customer_name:true,phone_number:true,dob:true,account_type:true,email:true,transactions:true,trs_creator_email:true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_next_status:true,trs_status:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true}
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
        "CK:CT003:FNGK:AF:FNK:API-ERD:CATK:CG:AFGK:TG2:AFK:tableCheck:AFVK:v1",
        token
      );
  }
  }
}
