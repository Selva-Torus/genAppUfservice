
import { HttpException, Injectable,HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import * as v from 'valibot';
import { errorObj } from 'src/dto';
import { CommonService } from 'src/common.Service';
import { seacoreEntity } from './entity/seacore.entity';
@Injectable()
export class seacoreService {
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
      clientid:"number",
      clientname:"string",
      mobile:"number",
      weburl:"string",
      addressline1:"string",
      country:"string",
      city:"string",
      email:"string",
      person:"string",
      clienttype:"string",
      vesseltype:"string",
      dateonly:"Date",
      timeonly:"Time",
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
      const { clientid }: {clientid : number} = queryValue;
      const { clientname }: {clientname : string} = queryValue;
      const { mobile }: {mobile : number} = queryValue;
      const { weburl }: {weburl : string} = queryValue;
      const { addressline1 }: {addressline1 : string} = queryValue;
      const { country }: {country : string} = queryValue;
      const { city }: {city : string} = queryValue;
      const { email }: {email : string} = queryValue;
      const { person }: {person : string} = queryValue;
      const { clienttype }: {clienttype : string} = queryValue;
      const { vesseltype }: {vesseltype : string} = queryValue;
      const { dateonly }: {dateonly : any } = queryValue;
      const { timeonly }: {timeonly : any } = queryValue;

      if(clientid){ 
        query.clientid = { [queryCondition['clientid']]: clientid };
      }
      if(clientname){ 
        query.clientname = { [queryCondition['clientname']]: clientname };
      }
      if(mobile){ 
        query.mobile = { [queryCondition['mobile']]: mobile };
      }
      if(weburl){ 
        query.weburl = { [queryCondition['weburl']]: weburl };
      }
      if(addressline1){ 
        query.addressline1 = { [queryCondition['addressline1']]: addressline1 };
      }
      if(country){ 
        query.country = { [queryCondition['country']]: country };
      }
      if(city){ 
        query.city = { [queryCondition['city']]: city };
      }
      if(email){ 
        query.email = { [queryCondition['email']]: email };
      }
      if(person){ 
        query.person = { [queryCondition['person']]: person };
      }
      if(clienttype){ 
        query.clienttype = { [queryCondition['clienttype']]: clienttype };
      }
      if(vesseltype){ 
        query.vesseltype = { [queryCondition['vesseltype']]: vesseltype };
      }
      if(dateonly){ 
        query.dateonly = { [queryCondition['dateonly']]: dateonly };
      }
      if(timeonly){ 
        query.timeonly = { [queryCondition['timeonly']]: timeonly };
      }
      const skip = (page - 1) * limit;
      if (Object.keys(query).length > 0) {
        const banks = await this.prismaService.seacore.findMany({
          select:columns,
          where: query,          
        });
        let decryptedRes: any = [];
        for (const indiviual of banks) {
          const decryptedData = await this.decryptData(indiviual, 'seacore');
          decryptedRes.push(decryptedData);
        }
        return decryptedRes;
      }

      if(!skip && !limit && Object.keys(query).length == 0){
        const banks = await this.prismaService.seacore.findMany({
          select:columns,
        });
        let decryptedRes: any = [];
        for (const indiviual of banks) {
          const decryptedData = await this.decryptData(indiviual, 'seacore');
          decryptedRes.push(decryptedData);
        }
        return decryptedRes;
      }

      const banks = await this.prismaService.seacore.findMany({
        select:columns,
        where: query,
        skip: skip,
        take: limit,
      });

      const totalItems = await this.prismaService.seacore.count({
        where: query,
      });

      let decryptedRes: any = [];
      for (const indiviual of banks) {
        const decryptedData = await this.decryptData(indiviual, 'seacore');
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

  async findOne(clientid:number,token : string) {
    try{
      const res = await this.prismaService.seacore.findUnique({ 
      where: {clientid},
      select: {clientname:true,mobile:true,weburl:true,addressline1:true,country:true,city:true,email:true,person:true,clienttype:true,vesseltype:true,dateonly:true,timeonly:true,        trs_creator_email:true,
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
    return  await this.decryptData(res, 'seacore');
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

  async findAll(token : string,clientid?:number) {
    try{
      const whereClause: any = {};
      if (clientid) {
        whereClause.clientid = clientid;
      }
      const res = await this.prismaService.seacore.findMany({ 
      where: whereClause,
      select: {clientid:true,clientname:true,mobile:true,weburl:true,addressline1:true,country:true,city:true,email:true,person:true,clienttype:true,vesseltype:true,dateonly:true,timeonly:true,        trs_creator_email:true,
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
        const decryptedData = await this.decryptData(indiviual, 'seacore');
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
    
  async create(createseacoreDto: Prisma.seacoreCreateInput,token:string) {
    try{
      const dataSchema:any =  v.object({
            clientname :  v.optional(v.string() ), 
            mobile :  v.optional(v.number() ), 
            weburl :  v.optional(v.string() ), 
            addressline1 :  v.optional(v.string() ), 
            country :  v.optional(v.string() ), 
            city :  v.optional(v.string() ), 
            email :  v.optional(v.string() ), 
            person :  v.optional(v.string() ), 
            clienttype :  v.optional(v.string() ), 
            vesseltype :  v.optional(v.string() ), 
            dateonly :  v.optional(v.pipe(
                  v.string(),
                  v.regex(
                    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|([+-])(\d{2}):(\d{2}))$/,
                    'The date-time is badly formatted.'
                  )  // Full ISO 8601 date-time format
                )  ), 
            timeonly :  v.optional(v.pipe(
                  v.string(),
                  v.regex(
                    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|([+-])(\d{2}):(\d{2}))$/,
                    'The date-time is badly formatted.'
                  )  // Full ISO 8601 date-time format
                )  ), 
        });
        let validate : any = v.safeParse(dataSchema,createseacoreDto);
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
        
      const res = await this.prismaService.seacore.create({ 
      data: await this.encryptData(createseacoreDto,'seacore','create'),
      select:{clientid:true,clientname:true,mobile:true,weburl:true,addressline1:true,country:true,city:true,email:true,person:true,clienttype:true,vesseltype:true,dateonly:true,timeonly:true,trs_creator_email:true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_next_status:true,trs_status:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true}
          
    })
    return await this.decryptData(res, 'seacore');
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

  async update(clientid:number, updateseacoreDto: Prisma.seacoreUpdateInput,token:string) {   
    try{
      const dataSchema:any =  v.object({
          clientname :  v.optional(v.string()), 
          mobile :  v.optional(v.number()), 
          weburl :  v.optional(v.string()), 
          addressline1 :  v.optional(v.string()), 
          country :  v.optional(v.string()), 
          city :  v.optional(v.string()), 
          email :  v.optional(v.string()), 
          person :  v.optional(v.string()), 
          clienttype :  v.optional(v.string()), 
          vesseltype :  v.optional(v.string()), 
          dateonly :  v.optional(v.pipe(
            v.string(),
            v.regex(
              /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|([+-])(\d{2}):(\d{2}))$/,
              'The date-time is badly formatted.'
            )  // Full ISO 8601 date-time format
          ) ), 
          timeonly :  v.optional(v.pipe(
            v.string(),
            v.regex(
              /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|([+-])(\d{2}):(\d{2}))$/,
              'The date-time is badly formatted.'
            )  // Full ISO 8601 date-time format
          ) ), 
      });
      let validate : any = v.safeParse(dataSchema,updateseacoreDto);
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
      const res = await this.prismaService.seacore.update({
      where: {clientid},
      data: await this.encryptData(updateseacoreDto,'seacore','update'),
      select: {clientid:true,clientname:true,mobile:true,weburl:true,addressline1:true,country:true,city:true,email:true,person:true,clienttype:true,vesseltype:true,dateonly:true,timeonly:true,trs_creator_email:true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_next_status:true,trs_status:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true}
    });
    return await this.decryptData(res, 'seacore');
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

  async remove(clientid:number,token : string) {
    try{
      const res = await this.prismaService.seacore.delete({
      where: {clientid },
      select: {clientid:true,clientname:true,mobile:true,weburl:true,addressline1:true,country:true,city:true,email:true,person:true,clienttype:true,vesseltype:true,dateonly:true,timeonly:true,trs_creator_email:true,trs_created_date:true,trs_created_by:true,trs_modified_date:true,trs_modified_by:true,trs_next_status:true,trs_status:true,trs_process_id:true,trs_access_profile:true,trs_org_grp_code:true,trs_org_code:true,trs_role_grp_code:true,trs_role_code:true,trs_ps_grp_code:true,trs_ps_code:true}
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
