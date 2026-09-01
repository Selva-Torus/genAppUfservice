import { Injectable, OnModuleInit } from "@nestjs/common";
import { Worker, Job, Queue} from 'bullmq';
import { Pool } from 'pg';
import { Readable } from "stream";
import axios from 'axios';
import * as FormData from 'form-data';
import { EnvData } from "./envData/envData.service";
import { getRedisConnectionOptions } from "./redis.config";

@Injectable()
export class PersistenceService implements OnModuleInit{ 
  private pool:Pool;
  constructor(
    private readonly envData:EnvData
  ){}
 async onModuleInit() {
    this.pool = new Pool({
      connectionString: process.env.PG_URL,
      application_name: 'persistence_service',
      max: Number(process.env.PG_POOL_MAX) || 10, 
      idleTimeoutMillis: 30000,                  
      connectionTimeoutMillis: 5000,           
});

    // ✅ FIX 3: Pool-level error handler prevents unhandled rejections from crashing the process
    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle pg client:', err.message);
      // DO NOT re-throw — pool recovers automatically
    });

    // ✅ FIX 4: Log pool exhaustion warnings so you can tune max connections
    this.pool.on('connect', () => {
      const total = this.pool.totalCount;
      const idle = this.pool.idleCount;
      const waiting = this.pool.waitingCount;
      if (waiting > 0) {
        console.warn(
          `PG Pool pressure — total: ${total}, idle: ${idle}, waiting: ${waiting}`,
        );
      }
    });

    //const client = await this.pool.connect();
    this.createWorker('AFP-PERSISTENCE');
    console.log('PostgreSQL pool connected from persistence_service');
   // client.release();
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
      console.log('PostgreSQL pool closed');
    }
  }

  createWorker(queueName: string) {    
    const worker = new Worker(
      queueName,
      async (job: Job) => {             
          const client = await this.pool.connect(); 
          try {  
            const { value } = job.data;
            let key = job.name
            if (!value) throw new Error(`Redis value not found: ${key}`);

            const DbSchema = process.env.PG_SCHEMANAME;

            let tableName,query
            if(key){
                
              if(key.includes(':FNGK:AFP:'))
              tableName = 'tam_app_process_dtl'              
            }

            const keys = key.split(':');
            if (keys.length <= 14) throw ('Invalid key')

            const values = [
              key,
              keys[1],
              keys[3],
              keys[5],
              keys[7],
              keys[9],
              keys[11],
              keys[13],
              keys[14],
              value
            ]

            let  existquery = `
              SELECT EXISTS (
              SELECT 1
              FROM "${DbSchema}".${tableName}
              WHERE full_key = $1
              ) AS exists
            `;

            let existresult = await client.query(existquery, [key]);

            if(existresult.rows[0].exists){
              query = `
              UPDATE "${DbSchema}".${tableName} SET
              data = $2,
              trs_modified_by = '',
              trs_modified_date = CURRENT_TIMESTAMP where full_key = $1`;

              await client.query(query, [key,value]);

            }else{
              query = `INSERT INTO "${DbSchema}".${tableName}
              (full_key, ck_code, fngk_code, fnk_code, catk_code, afgk_code,
              afk_code, afvk_code, afsk_code, data, trs_created_by, trs_created_date, trs_modified_by, trs_modified_date)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, '', CURRENT_TIMESTAMP, '', CURRENT_TIMESTAMP)
              `
              await client.query(query, values);

            }
            // console.log(`Stored ${key} in PostgreSQL`);
          }catch(error){          
            await client.query('ROLLBACK').catch(() => {});
            // console.log('WORKER ERROR', error);
            throw error; 
          }finally{           
            client.release();
          }
      },
      {
      connection: {
        ...getRedisConnectionOptions(),
        maxRetriesPerRequest: null,
      },
      // Process several jobs in parallel; the pool (max above) caps real
      // DB concurrency, so keep concurrency <= PG_POOL_MAX.
      concurrency: Number(process.env.WORKER_CONCURRENCY) || 5,
      }
    );

    worker.on('completed', (job) => {
      console.log(`Completed job ${job.name}`);
    });

    worker.on('failed', async (job, err) => {
      console.error(`Job ${job?.name} failed`,err.message);
      if (!job) {
        return;
      }
      try {
        let jsonValue = job?.data?.value
        if(typeof jsonValue == 'string') 
          jsonValue = JSON.parse(jsonValue)

        let seaweedRes = await this.seaWeeduploadFile(
          {error: job?.failedReason || err.message, data: jsonValue},
          'AFP-PERSISTENCE',
          'FAILED',
          job?.name,
        );
        if(seaweedRes.status == 201 || seaweedRes.status == 200){
          await job.remove();
        }
      } catch (e) {
        console.error(e);
      } 
    });
    return worker;    
  }

  async seaWeeduploadFile(data: any, bucketName: string,folderPath: string,filename: string) {
    try {

      let seaweedUrl = this.envData.getSeaweedOutputHost() //process.env.SEAWEED_URL
      const fileUrl = `${seaweedUrl}/${bucketName}/${folderPath}/${filename.endsWith('.json') ? filename : `${filename}.json`}`;
     
      const buffer = Buffer.from(JSON.stringify(data, null, 2), 'utf-8');  
     
      const form = new FormData();
      form.append('file', Readable.from(buffer), {
        filename: filename.endsWith('.json') ? filename : `${filename}.json`,
        contentType: 'application/json',
      });
  
      const response = await axios.post(fileUrl, form, {
        headers: {
          ...form.getHeaders(),
        },
         auth: {
          username: this.envData.getSeaweedUsername(),//process.env.SEAWEED_USERNAME,
          password: this.envData.getSeaweedPassword()//process.env.SEAWEED_PASSWORD
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });
  
      return {
        status: response.status,
        fileName: filename
      };
    } catch (error: any) {
      console.error('Upload error:', error?.response?.data || error.message);
      // throw error?.response?.data || error.message || 'some error occured in seaWeeduploadFile';
    }
  }
}