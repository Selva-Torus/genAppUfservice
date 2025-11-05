import { HttpException, Injectable,HttpStatus } from '@nestjs/common';
import * as v from 'valibot';
import { errorObj } from 'src/dto';
import { CommonService } from 'src/common.Service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { usetableEntity } from './entity/usetable.entity';
import { CreateusetableDto } from './dto/Createusetable.dto';
import { UpdateusetableDto } from './dto/Updateusetable.dto';
@Injectable()
export class usetableService {
  constructor(
    @InjectRepository(usetableEntity)
    private readonly usetableRepo: Repository<usetableEntity>,
    private readonly commonService: CommonService
  ) {}
  private encryptedCols: any={
  "usetable": []
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
      id:"number",
      name:"string",
      age:"number",
      address:"string",
      phone:"string",
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
      const { id }: {id : number} = queryValue;
      const { name }: {name : string} = queryValue;
      const { age }: {age : number} = queryValue;
      const { address }: {address : string} = queryValue;
      const { phone }: {phone : string} = queryValue;

      if(id){ 
        query.id = { [queryCondition['id']]: id };
      }
      if(name){ 
        query.name = { [queryCondition['name']]: name };
      }
      if(age){ 
        query.age = { [queryCondition['age']]: age };
      }
      if(address){ 
        query.address = { [queryCondition['address']]: address };
      }
      if(phone){ 
        query.phone = { [queryCondition['phone']]: phone };
      }
      const skip = (page - 1) * limit;
      if (Object.keys(query).length > 0) {
        const banks = await this.usetableRepo.find({
          select:columns,
          where: query,          
        });
        let decryptedRes: any = [];
        for (const indiviual of banks) {
          const decryptedData = await this.decryptData(indiviual, 'usetable');
          decryptedRes.push(decryptedData);
        }
        return decryptedRes;
      }

      if(!skip && !limit && Object.keys(query).length == 0){
        const banks = await this.usetableRepo.find({
          select:columns,
        });
        let decryptedRes: any = [];
        for (const indiviual of banks) {
          const decryptedData = await this.decryptData(indiviual, 'usetable');
          decryptedRes.push(decryptedData);
        }
        return decryptedRes;
      }

      const banks = await this.usetableRepo.find({
        select:columns,
        where: query,
        skip: skip,
        take: limit,
      });

      const totalItems = await this.usetableRepo.count({
        where: query,
      });

      let decryptedRes: any = [];
      for (const indiviual of banks) {
        const decryptedData = await this.decryptData(indiviual, 'usetable');
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
        "CK:TT407:FNGK:AF:FNK:API-ERD:CATK:CGFA:AFGK:TG4CGFA:AFK:oracleData:AFVK:v1",
        token
      );
    }
  }

  async findOne(id:number,token : string): Promise<usetableEntity | null> {
    try{
      const res = await this.usetableRepo.findOne({ 
      where: {id},
      relations:[
      ],
      select: [
"id","name","age","address","phone",

  "trs_creator_email",
  "trs_created_date",
  "trs_created_by",
  "trs_modified_date",
  "trs_modified_by",
  "trs_next_status",
  "trs_status",
  "trs_process_id",
  "trs_access_profile",
  "trs_org_grp_code",
  "trs_org_code",
  "trs_role_grp_code",
  "trs_role_code",
  "trs_ps_grp_code",
  "trs_ps_code"
      ]
    });
    return  await this.decryptData(res, 'usetable');
  } catch (error) {
    const errorMessage = 'Error in findOne';
      await this.commonService.errorLog(
        "Technical",
        'AK',
        'Fatal',
        "TG024",
        error,
        "CK:TT407:FNGK:AF:FNK:API-ERD:CATK:CGFA:AFGK:TG4CGFA:AFK:oracleData:AFVK:v1",
        token
      );
  }
  }

  async findAll(token : string): Promise<usetableEntity | null> {
    try{
      const res = await this.usetableRepo.find({ 
      relations:[
      ],
      select: [
"id","name","age","address","phone",

  "trs_creator_email",
  "trs_created_date",
  "trs_created_by",
  "trs_modified_date",
  "trs_modified_by",
  "trs_next_status",
  "trs_status",
  "trs_process_id",
  "trs_access_profile",
  "trs_org_grp_code",
  "trs_org_code",
  "trs_role_grp_code",
  "trs_role_code",
  "trs_ps_grp_code",
  "trs_ps_code"
      ]
      });
      let decryptedRes: any = [];
      for (const indiviual of res) {
        const decryptedData = await this.decryptData(indiviual, 'usetable');
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
          "CK:TT407:FNGK:AF:FNK:API-ERD:CATK:CGFA:AFGK:TG4CGFA:AFK:oracleData:AFVK:v1",
          token
        );
    }
    }
    
  async create(createusetableDto: CreateusetableDto,token:string) {
    try{
      const dataSchema:any =  v.object({
            name :  v.optional(v.string()), 
            age :  v.optional(v.number()), 
            address :  v.optional(v.string()), 
            phone :  v.optional(v.string()), 
        });
        let validate : any = v.safeParse(dataSchema,createusetableDto);
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
            "CK:TT407:FNGK:AF:FNK:API-ERD:CATK:CGFA:AFGK:TG4CGFA:AFK:oracleData:AFVK:v1",
            token
          );
        }

      const usetable = await this.usetableRepo.create(await this.encryptData(createusetableDto,'usetable','create'));
      const res:any = await this.usetableRepo.save(usetable);
      const selectedusetable = await this.usetableRepo
      .findOne({
        where: { id: res.id },
      relations:[
      ],
        select:[      
"id","name","age","address","phone",

  "trs_creator_email",
  "trs_created_date",
  "trs_created_by",
  "trs_modified_date",
  "trs_modified_by",
  "trs_next_status",
  "trs_status",
  "trs_process_id",
  "trs_access_profile",
  "trs_org_grp_code",
  "trs_org_code",
  "trs_role_grp_code",
  "trs_role_code",
  "trs_ps_grp_code",
  "trs_ps_code"
      ],
      });
    return await this.decryptData(selectedusetable, 'usetable');
  } catch (error) {
    const errorMessage = 'Create Error';
    await this.commonService.errorLog(
      "Technical",
      'AK',
      'Fatal',
      "TG022",
      error,
      "CK:TT407:FNGK:AF:FNK:API-ERD:CATK:CGFA:AFGK:TG4CGFA:AFK:oracleData:AFVK:v1",
      token
    );
  }
    
  }

  async update(id:number, updateusetableDto: UpdateusetableDto,token:string) {   
    try{

      const dataSchema:any =  v.object({
          name :  v.optional(v.string()), 
          age :  v.optional(v.number()), 
          address :  v.optional(v.string()), 
          phone :  v.optional(v.string()), 
      });
      let validate : any = v.safeParse(dataSchema,updateusetableDto);
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
          "CK:TT407:FNGK:AF:FNK:API-ERD:CATK:CGFA:AFGK:TG4CGFA:AFK:oracleData:AFVK:v1",
          token
        );
      }
      const encryptedData = await this.encryptData(updateusetableDto,'usetable','update')
      
      const res = await this.usetableRepo.update(
      {id},
      encryptedData
      );
      
      const updatedusetable = await this.usetableRepo.findOne({ where: {id},
      relations:[
      ],
      select: [
"id","name","age","address","phone",

  "trs_creator_email",
  "trs_created_date",
  "trs_created_by",
  "trs_modified_date",
  "trs_modified_by",
  "trs_next_status",
  "trs_status",
  "trs_process_id",
  "trs_access_profile",
  "trs_org_grp_code",
  "trs_org_code",
  "trs_role_grp_code",
  "trs_role_code",
  "trs_ps_grp_code",
  "trs_ps_code"
      ]
        });

      return await this.decryptData(updatedusetable, 'usetable');
    } catch (error) {
        const errorMessage = 'update Error';
        await this.commonService.errorLog(
          "Technical",
          'AK',
          'Fatal',
          "TG023",
          error,
          "CK:TT407:FNGK:AF:FNK:API-ERD:CATK:CGFA:AFGK:TG4CGFA:AFK:oracleData:AFVK:v1",
          token
        );
    }  
}

  async remove(id:number,token : string): Promise<usetableEntity | null> {
    try{
      const deletedusetable = await this.usetableRepo.findOne({
        where: {id },
        relations:[
        ],        
        select: [
"id","name","age","address","phone",

  "trs_creator_email",
  "trs_created_date",
  "trs_created_by",
  "trs_modified_date",
  "trs_modified_by",
  "trs_next_status",
  "trs_status",
  "trs_process_id",
  "trs_access_profile",
  "trs_org_grp_code",
  "trs_org_code",
  "trs_role_grp_code",
  "trs_role_code",
  "trs_ps_grp_code",
  "trs_ps_code"
        ]
        });
      const res = await this.usetableRepo.delete({
id 
      });
        
      return await this.decryptData(deletedusetable, 'usetable');
  } catch (error) {
    const errorMessage = 'Error in remove Data';
      await this.commonService.errorLog(
        "Technical",
        'AK',
        'Fatal',
        "TG026",
        error,
        "CK:TT407:FNGK:AF:FNK:API-ERD:CATK:CGFA:AFGK:TG4CGFA:AFK:oracleData:AFVK:v1",
        token
      );
  }
  }
  async findFirst(token : string): Promise<usetableEntity | null> {
    try{
      const res = await this.usetableRepo.find({ 
          order: { trs_created_date: 'ASC' },
          take: 1,
      });
      return  await this.decryptData(res[0], 'usetable');
    } catch (error) {
      const errorMessage = 'Error in findFirst';
        await this.commonService.errorLog(
          "Technical",
          'AK',
          'Fatal',
          "TG028",
          error,
          "CK:TT407:FNGK:AF:FNK:API-ERD:CATK:CGFA:AFGK:TG4CGFA:AFK:oracleData:AFVK:v1",
          token
        );
      }
  }
  async findLast(token : string): Promise<usetableEntity | null> {
    try{
      const res = await this.usetableRepo.find({ 
        order: { trs_created_date: 'DESC' },
        take: 1,
      });
      return  await this.decryptData(res[0], 'usetable');
    } catch (error) {
      const errorMessage = 'Error in findLast';
        await this.commonService.errorLog(
          "Technical",
          'AK',
          'Fatal',
          "TG028",
          error,
          "CK:TT407:FNGK:AF:FNK:API-ERD:CATK:CGFA:AFGK:TG4CGFA:AFK:oracleData:AFVK:v1",
          token
        );
      }
  }
}
