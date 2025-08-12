
import { HttpException, Injectable,HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import * as v from 'valibot';
import { errorObj } from 'src/dto';
import { CommonService } from 'src/common.Service';
import { billingEntity } from './entity/billing.entity';
@Injectable()
export class billingService {
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
      billingid:"number",
      billingparty:"string",
      vessels:"string",
      personcharge:"string",
      emailparty:"string",
      mobileparty:"bigint",
      cou_ammount:"string",
      amount:"number",
      tax:"number",
      interest:"number",
      cou_amount2:"string",
      amount2:"number",
      addressline1:"string",
      country:"string",
      state:"string",
      pininput:"number",
      remark:"string",
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
      const { billingid }: {billingid : number} = queryValue;
      const { billingparty }: {billingparty : string} = queryValue;
      const { vessels }: {vessels : string} = queryValue;
      const { personcharge }: {personcharge : string} = queryValue;
      const { emailparty }: {emailparty : string} = queryValue;
      const { mobileparty }: {mobileparty : bigint} = queryValue;
      const { cou_ammount }: {cou_ammount : string} = queryValue;
      const { amount }: {amount : number} = queryValue;
      const { tax }: {tax : number} = queryValue;
      const { interest }: {interest : number} = queryValue;
      const { cou_amount2 }: {cou_amount2 : string} = queryValue;
      const { amount2 }: {amount2 : number} = queryValue;
      const { addressline1 }: {addressline1 : string} = queryValue;
      const { country }: {country : string} = queryValue;
      const { state }: {state : string} = queryValue;
      const { pininput }: {pininput : number} = queryValue;
      const { remark }: {remark : string} = queryValue;

      if(billingid){ 
        query.billingid = { [queryCondition['billingid']]: billingid };
      }
      if(billingparty){ 
        query.billingparty = { [queryCondition['billingparty']]: billingparty };
      }
      if(vessels){ 
        query.vessels = { [queryCondition['vessels']]: vessels };
      }
      if(personcharge){ 
        query.personcharge = { [queryCondition['personcharge']]: personcharge };
      }
      if(emailparty){ 
        query.emailparty = { [queryCondition['emailparty']]: emailparty };
      }
      if(mobileparty){ 
        query.mobileparty = { [queryCondition['mobileparty']]: mobileparty };
      }
      if(cou_ammount){ 
        query.cou_ammount = { [queryCondition['cou_ammount']]: cou_ammount };
      }
      if(amount){ 
        query.amount = { [queryCondition['amount']]: amount };
      }
      if(tax){ 
        query.tax = { [queryCondition['tax']]: tax };
      }
      if(interest){ 
        query.interest = { [queryCondition['interest']]: interest };
      }
      if(cou_amount2){ 
        query.cou_amount2 = { [queryCondition['cou_amount2']]: cou_amount2 };
      }
      if(amount2){ 
        query.amount2 = { [queryCondition['amount2']]: amount2 };
      }
      if(addressline1){ 
        query.addressline1 = { [queryCondition['addressline1']]: addressline1 };
      }
      if(country){ 
        query.country = { [queryCondition['country']]: country };
      }
      if(state){ 
        query.state = { [queryCondition['state']]: state };
      }
      if(pininput){ 
        query.pininput = { [queryCondition['pininput']]: pininput };
      }
      if(remark){ 
        query.remark = { [queryCondition['remark']]: remark };
      }
      const skip = (page - 1) * limit;
      if (Object.keys(query).length > 0) {
        const banks = await this.prismaService.billing.findMany({
          select:columns,
          where: query,          
        });
        let decryptedRes: any = [];
        for (const indiviual of banks) {
          const decryptedData = await this.decryptData(indiviual, 'billing');
          decryptedRes.push(decryptedData);
        }
        return decryptedRes;
      }

      if(!skip && !limit && Object.keys(query).length == 0){
        const banks = await this.prismaService.billing.findMany({
          select:columns,
        });
        let decryptedRes: any = [];
        for (const indiviual of banks) {
          const decryptedData = await this.decryptData(indiviual, 'billing');
          decryptedRes.push(decryptedData);
        }
        return decryptedRes;
      }

      const banks = await this.prismaService.billing.findMany({
        select:columns,
        where: query,
        skip: skip,
        take: limit,
      });

      const totalItems = await this.prismaService.billing.count({
        where: query,
      });

      let decryptedRes: any = [];
      for (const indiviual of banks) {
        const decryptedData = await this.decryptData(indiviual, 'billing');
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

  async findOne(billingid:number,token : string) {
    try{
      const res = await this.prismaService.billing.findUnique({ 
      where: {billingid},
      select: {billingparty:true,vessels:true,personcharge:true,emailparty:true,mobileparty:true,cou_ammount:true,amount:true,tax:true,interest:true,cou_amount2:true,amount2:true,addressline1:true,country:true,state:true,pininput:true,remark:true,        trs_creator_email:true,
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
    return  await this.decryptData(res, 'billing');
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

  async findAll(token : string,billingid?:number) {
    try{
      const whereClause: any = {};
      if (billingid) {
        whereClause.billingid = billingid;
      }
      const res = await this.prismaService.billing.findMany({ 
      where: whereClause,
      select: {billingid:true,billingparty:true,vessels:true,personcharge:true,emailparty:true,mobileparty:true,cou_ammount:true,amount:true,tax:true,interest:true,cou_amount2:true,amount2:true,addressline1:true,country:true,state:true,pininput:true,remark:true,        trs_creator_email:true,
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
        const decryptedData = await this.decryptData(indiviual, 'billing');
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
    
  async create(createbillingDto: Prisma.billingCreateInput,token:string) {
    try{
      const dataSchema:any =  v.object({
            billingparty :  v.optional(v.string() ), 
            vessels :  v.optional(v.string() ), 
            personcharge :  v.optional(v.string() ), 
            emailparty :  v.optional(v.string() ), 
            mobileparty :  v.optional(v.number() ), 
            cou_ammount :  v.optional(v.string() ), 
            amount :  v.optional(v.number() ), 
            tax :  v.optional(v.number() ), 
            interest :  v.optional(v.number() ), 
            cou_amount2 :  v.optional(v.string() ), 
            amount2 :  v.optional(v.number() ), 
            addressline1 :  v.optional(v.string() ), 
            country :  v.optional(v.string() ), 
            state :  v.optional(v.string() ), 
            pininput :  v.optional(v.number() ), 
            remark :  v.optional(v.string() ), 
        });
        let validate : any = v.safeParse(dataSchema,createbillingDto);
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
        
      const res = await this.prismaService.billing.create({ 
      data: await this.encryptData(createbillingDto,'billing','create'),
      select:{billingid:true,billingparty:true,vessels:true,personcharge:true,emailparty:true,mobileparty:true,cou_ammount:true,amount:true,tax:true,interest:true,cou_amount2:true,amount2:true,addressline1:true,country:true,state:true,pininput:true,remark:true,trs_creator_email:true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_next_status:true,trs_status:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true}
          
    })
    return await this.decryptData(res, 'billing');
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

  async update(billingid:number, updatebillingDto: Prisma.billingUpdateInput,token:string) {   
    try{
      const dataSchema:any =  v.object({
          billingparty :  v.optional(v.string()), 
          vessels :  v.optional(v.string()), 
          personcharge :  v.optional(v.string()), 
          emailparty :  v.optional(v.string()), 
          mobileparty :  v.optional(v.number()), 
          cou_ammount :  v.optional(v.string()), 
          amount :  v.optional(v.number()), 
          tax :  v.optional(v.number()), 
          interest :  v.optional(v.number()), 
          cou_amount2 :  v.optional(v.string()), 
          amount2 :  v.optional(v.number()), 
          addressline1 :  v.optional(v.string()), 
          country :  v.optional(v.string()), 
          state :  v.optional(v.string()), 
          pininput :  v.optional(v.number()), 
          remark :  v.optional(v.string()), 
      });
      let validate : any = v.safeParse(dataSchema,updatebillingDto);
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
      const res = await this.prismaService.billing.update({
      where: {billingid},
      data: await this.encryptData(updatebillingDto,'billing','update'),
      select: {billingid:true,billingparty:true,vessels:true,personcharge:true,emailparty:true,mobileparty:true,cou_ammount:true,amount:true,tax:true,interest:true,cou_amount2:true,amount2:true,addressline1:true,country:true,state:true,pininput:true,remark:true,trs_creator_email:true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_next_status:true,trs_status:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true}
    });
    return await this.decryptData(res, 'billing');
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

  async remove(billingid:number,token : string) {
    try{
      const res = await this.prismaService.billing.delete({
      where: {billingid },
      select: {billingid:true,billingparty:true,vessels:true,personcharge:true,emailparty:true,mobileparty:true,cou_ammount:true,amount:true,tax:true,interest:true,cou_amount2:true,amount2:true,addressline1:true,country:true,state:true,pininput:true,remark:true,trs_creator_email:true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_next_status:true,trs_status:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true}
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
