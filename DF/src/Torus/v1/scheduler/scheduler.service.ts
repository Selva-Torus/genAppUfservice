import { BadRequestException, Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import * as cronParser from 'cron-parser'; 
import { InjectQueue } from '@nestjs/bullmq'; 
import { Queue, QueueOptions } from 'bullmq'; 
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';
import { JobProcessor } from './processors/job.processor';
import { EnvData } from 'src/envData/envData.service';
const  Xid = require('xid-js');

@Injectable()
export class SchedulerService {
    private readonly logger = new Logger(SchedulerService.name);
    private activeSchedules = new Map<string, CronJob>();
    private queues: Map< string, Queue> = new Map();

    constructor(
        // @InjectQueue(`scheduler`) private readonly queue: Queue,private schedulerRegistry: SchedulerRegistry
        private readonly envData:EnvData,
        @Inject(forwardRef(() => JobProcessor)) private readonly processor: JobProcessor
    ) {} 
   

    async startScheduler(input,token) {          
        let scheduledJobs       
        if(input) {
            if(Array.isArray(input) && input.length > 0){
                scheduledJobs = []
                for(let i=0;i < input.length;i++){
                    scheduledJobs.push(await this.getDataFromTable(token,'GET',"sch_scheduled_job",'',{path:input[i]?.id}))
                }
            }else if(typeof input == "object" && Object.keys(input).length > 0){                
                scheduledJobs = await this.getDataFromTable(token,'GET',"sch_scheduled_job",'',{path:input?.id});
            }
        }       
        //console.log('scheduledJobs',scheduledJobs);      

        if(scheduledJobs) {
            if(Array.isArray(scheduledJobs) && scheduledJobs.length > 0){                
                for (const schedule of scheduledJobs) {
                    await this.checkAndExecute(token,schedule,input.pf_key);
                }
            }else if(typeof scheduledJobs === 'object' && Object.keys(scheduledJobs).length > 0){
                await this.checkAndExecute(token,scheduledJobs,input.pf_key);
            }
        }
    }   

    async checkAndExecute(token,Job,pf_key){
        this.logger.log('checkAndExecute Started');        
       
        let run_category = Job.scheduler_info.run_category;       
        let j_start_date = Job.scheduler_info.job_start_date
        let j_end_date = Job.scheduler_info.job_end_date        
        let isRepeat = false
                        
        if (Job.status == "ACTIVE") {
            if(run_category == "Multiple"){ 
                isRepeat = true
            }
            
            let isCurrentTime = await this.checkWindowAndCurrent("current",j_start_date,j_end_date);
            await this.addBullJob(Job,isRepeat,isCurrentTime.delayMs,token,pf_key);   
            
        }
       
    }  

    async addBullJob(sch_job_data: any,isRepeat,delayMs,token,pf_key) {
        
        console.log(`Executing schedule: ${sch_job_data.name}`);
        let scheduler_info = sch_job_data.scheduler_info
        const opts: any = {
            jobId: sch_job_data.trs_process_id
        };     
        
        if(isRepeat){
            let cronExpression = await this.buildCron(scheduler_info.frequency_type,scheduler_info.frequency);
            opts.repeat = {
                pattern: cronExpression,
                tz: sch_job_data.timezone || 'UTC',
                startDate:new Date(scheduler_info.job_start_date),
                endDate:new Date(scheduler_info.job_end_date)
            };
        }
        if(delayMs){
            opts.delay = delayMs;
        }
        else if(scheduler_info.delay_time && scheduler_info.delay_type){
            opts.delay = await this.delayToMs(scheduler_info.delay_time,scheduler_info.delay_type);
        }
        //console.log('opts',opts); 

        let sch_job_log_res = await this.getDataFromTable(token,'POST',"sch_job_log",{            
            status: "ACTIVE"                      
        }); 

        const queue = this.getQueue(pf_key);
        const bullJob = await queue.add( 
            sch_job_data.name, 
            {               
                schjt_id : sch_job_data.schjt_id, 
                schsj_id : sch_job_data.schsj_id, 
                schjl_id : sch_job_log_res.schjl_id,
                token: token,
                data: sch_job_data.job_data 
            }, 
            opts
        ); 
        sch_job_data.bullmqJobId = bullJob.repeatJobKey;          

        this.logger.log(`Created scheduled job: ${sch_job_data.name} [${sch_job_data.trs_process_id}]`); 
    } 
   
    getQueue(queueName: string): Queue {
        // Check if queue already exists
        if (this.queues.has(queueName)) {
            return this.queues.get(queueName);
        }

        // Create new queue dynamically
        const queueOptions: QueueOptions = {
            connection: {
                host: process.env.HOST,
                port: parseInt(process.env.PORT),
            },
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
                removeOnComplete: 100,
                removeOnFail: false,
            },
        };

        const newQueue = new Queue(queueName, queueOptions);
        this.queues.set(queueName, newQueue);
        this.logger.log(`Created new queue: ${queueName}`);

        // Create worker for this queue
        this.processor.createWorker(queueName);

        return newQueue;
    }

    async delayToMs(delay_time: number, delay_type: string) {
        if (delay_time <= 0) return 0;

        switch (delay_type) {
            case 'SECS':  return delay_time * 1000;
            case 'MINS':  return delay_time * 60 * 1000;
            case 'HOURS': return delay_time * 60 * 60 * 1000;
            case 'DAYS':  return delay_time * 24 * 60 * 60 * 1000;
            default:      return 0;
        }
    }

    async checkWindowAndCurrent(
        Flg: string,
        StartTime: string,
        EndTime: string,
        nows = new Date()
    ) {
        // Ensure now is a Date object
        let now = new Date(nows);
        console.log('now',now);
        console.log("StartTime",StartTime);
        console.log('EndTime',EndTime);
        
        // Default result
        let result = {
            shouldRunNow: false,
            delayMs: 0
        };

        if(!StartTime || !EndTime){return result}

        // ---------------- WINDOW MODE ----------------
        if (Flg === "window") {
            const [startH, startM] = StartTime.split(':').map(Number);
            const [endH, endM] = EndTime.split(':').map(Number);

            const start = startH * 60 + startM;
            const end = endH * 60 + endM;
            const current = now.getUTCHours() * 60 + now.getUTCMinutes(); // UTC-safe

            // Same-day window
            if (start <= end) {
                if (current >= start && current <= end) {
                    return { shouldRunNow: true, delayMs: 0 };
                }

                // Delay until today's start
                if (current < start) {
                    const delayMs = (start - current) * 60 * 1000;
                    return { shouldRunNow: false, delayMs };
                }

                // Delay until next day's start
                const delayMs = ((24 * 60 - current) + start) * 60 * 1000;
                return { shouldRunNow: false, delayMs };
            }

            // Overnight window (e.g. 22:00 → 02:00)
            // return current >= start || current <= end;
        }

        // ---------------- CURRENT MODE ----------------
        if (Flg === "current") {
            if (StartTime && EndTime) {
                const startDate = new Date(StartTime);
                const endDate = new Date(EndTime);

                // Run now if inside the window
                if (now >= startDate && now <= endDate) {
                    return { shouldRunNow: true, delayMs: 0 };
                }

                // Delay until start
                if (now < startDate) {
                    const delayMs = Math.max(0, startDate.getTime() - now.getTime());
                    return { shouldRunNow: false, delayMs };
                }

                // After end → schedule for next day's start
                const nextStart = new Date(startDate);
                nextStart.setUTCDate(nextStart.getUTCDate() + 1); // UTC-safe
                const delayMs = Math.max(0, nextStart.getTime() - now.getTime());
                return { shouldRunNow: false, delayMs };
            }

            // Only StartTime provided
            if (StartTime) {
                const startDate = new Date(StartTime);

                if (now >= startDate) {
                    return { shouldRunNow: true, delayMs: 0 };
                }

                const delayMs = Math.max(0, startDate.getTime() - now.getTime());
                return { shouldRunNow: false, delayMs };
            }
        }

        return result;
    }


    async getDataFromTable(token,method,tableName,data,params?): Promise<any> {
        try {         
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }   
            let response
            // let url = this.APIURL + tableName //"sch_scheduled_job" //sch_job_template;
            let url = this.envData.getBeUrl()+ '/' +tableName//process.env.BE_URL + '/' +tableName 
            if(params?.path){
                url = url + '/' + params.path
            }
            if(method == 'GET'){
                response = await axios.get(url,requestConfig);                   
            }else if(method == 'POST' && data){
                response = await axios.post(url,data,requestConfig);
            }else if(method == 'PATCH' && data){
                response = await axios.patch(url,data,requestConfig);
            }
            if ([200,201].includes(response?.status) && response?.data) {
                return response.data;
            }        
        } catch (error) {
            throw error;
        }    
    }


    async buildCron(frequency_type, frequency) {
        switch (frequency_type) {
            case "SECS":
                return `*/${frequency} * * * * *`;
            case "MINS":
                return `0 */${frequency} * * * *`;
            case "HOURS":
                return `0 0 */${frequency} * * *`;
            case "DAYS":
                return `0 0 0 */${frequency} * *`;
            default:
                throw new Error("Unsupported frequency_type");
        }
    }      

    async stopBullJob(input) {
        const results = { removed: [], failed: [] }; 
        let queueName = input.pf_key
        const queue = this.getQueue(queueName);   
        // const repeatableJobs = await queue.getRepeatableJobs();
        // console.log('repeatableJobs',repeatableJobs);
           
        // Stop by job name (easiest way for repeatable jobs)
        if (input?.name) {
            try {
                const repeatableJobs = await queue.getRepeatableJobs();
                for (const repJob of repeatableJobs) {
                    if (repJob.name === input.name) {
                        await queue.removeRepeatableByKey(repJob.key);
                        results.removed.push({ name: repJob.name, key: repJob.key });
                        this.logger.log(`Removed repeatable job by name: ${repJob.name}`);
                    }
                }
                if (results.removed.length === 0) {
                    results.failed.push({ name: input.name, reason: 'No repeatable job found with this name' });
                }
            } catch (error) {
                results.failed.push({ name: input.name, reason: error.message });
            }
            return results;
        }           

        // Stop ALL BullMQ jobs if no specific identifier provided
        try {
            // Remove all repeatable jobs
            const repeatableJobs = await queue.getRepeatableJobs();          
            
            for (const repJob of repeatableJobs) {
                await queue.removeRepeatableByKey(repJob.key);
                results.removed.push({ name: repJob.name, key: repJob.key });
                // await this.getDataFromTable('PATCH',"sch_job_log",{            
                //     status: "STOPPED",
                //     last_run_at: new Date(), 
                //     // next_run_at: this.getNextRun(scheduledJob),
                // },{path:job_log_res.schjl_id});

                this.logger.log(`Removed repeatable job: ${repJob.name}`);
            }

            // Remove all waiting and delayed jobs
            const pendingJobs = await queue.getJobs(['waiting', 'delayed']);
            for (const job of pendingJobs) {
                await job.remove();
                results.removed.push(job.id);
                this.logger.log(`Removed job: ${job.id}`);
            }
        } catch (error) {
            results.failed.push({ reason: error.message });
        }

        return { message: 'All BullMQ jobs stopped', ...results };
    }

       
}

