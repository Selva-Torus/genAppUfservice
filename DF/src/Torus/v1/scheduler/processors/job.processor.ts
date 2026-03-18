import { Injectable, Logger } from '@nestjs/common';
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq'; 
import { Worker,Job,WorkerOptions } from 'bullmq';
import { EventHandler } from './event.handler';
import axios, { AxiosRequestConfig } from 'axios';
import { HttpHandler } from './http.handler';
import { GrpcHandler } from './grpc.handler';
import * as cronParser from 'cron-parser';
import { EnvData } from 'src/envData/envData.service';


 
// @Processor(`scheduler`) 
@Injectable()
export class JobProcessor{   
    private readonly logger = new Logger(JobProcessor.name); 
    private workers: Map<string, Worker> = new Map();
    private readonly workerId = `worker-${process.pid}-${Date.now()}`;
  
    constructor( 
        private readonly httpHandler: HttpHandler, 
        private readonly grpcHandler: GrpcHandler, 
        private readonly eventHandler: EventHandler, 
        private readonly envData:EnvData
    ) {}

    createWorker(queueName: string): Worker {
        // Check if worker already exists
        if (this.workers.has(queueName)) {
            return this.workers.get(queueName);
        }

        const workerOptions: WorkerOptions = {
            connection: {
                host: process.env.HOST,
                port: parseInt(process.env.PORT),
                maxRetriesPerRequest: 3,
            },
            concurrency: 10, //50,
            lockDuration: 120000, //30000,      // Increased to 120 seconds (2 minutes) to handle longer jobs
            lockRenewTime: 30000, //10000,       // Renew lock every 30 seconds
            stalledInterval: 60000, //5000,     // Increased to 60 seconds
            maxStalledCount: 2,         // Allow 2 stalled attempts before failing
            limiter: {
                max: 100,      // Max 100 jobs
                duration: 1000 // per second
            }
        };        

        const worker = new Worker(
            queueName,
            async (job: Job<any>) => {
                this.logger.log({
                    msg: 'Processing job started',
                    jobId: job.id,
                    name: job.name,
                    data: job.data,
                }); 

                let schjl_id
                try {     
                    
                    let { schjt_id,schsj_id, ...payload } = job.data; 
                    schjl_id = job.data.schjl_id
                    const startTime = Date.now();    
                    // job_log_res = await this.getDataFromTable(job.data.token,'POST',"sch_job_log",{            
                    //     status: "ACTIVE",                    
                    // });
                    // console.log('job_log_res',job_log_res);
                    
                    let execution;         
                    try {     
                        let isWithinWindow
                        const JobTemplate = await this.getDataFromTable(job.data.token,'GET',"sch_job_template","",{path:schjt_id});
                        const scheduledJob = await this.getDataFromTable(job.data.token,'GET',"sch_scheduled_job","",{path:schsj_id});
                        const now = new Date();
                
                        if(scheduledJob.scheduler_info.run_category != 'OnDemand'){
                            let isWithinDateRange = this.isWithinDateRange(now,scheduledJob.scheduler_info.job_start_date,scheduledJob.scheduler_info.job_end_date,scheduledJob.scheduler_info.time_zone);
                            
                            // console.log('isWithinDateRange',isWithinDateRange);
                            
                            if (!isWithinDateRange) throw "Job is not within date range";                            

                            if (scheduledJob.scheduler_info.run_category == 'Multiple' && scheduledJob.scheduler_info.window_time?.length>0) {
                                isWithinWindow = this.isWithinWindow(now,scheduledJob.scheduler_info.window_time,scheduledJob.scheduler_info.time_zone);
                                // console.log('isWithinWindow',isWithinWindow);
                                //if(!isWithinWindow) throw "Job is not within Window range";
                            }
                        }                 
                        if(isWithinWindow){
                            execution = await this.getDataFromTable(job.data.token,'POST',"sch_job_thread_log",{ 
                                // jobId, 
                                bullmq_job_id: job.id, 
                                status: "RUNNING", 
                                started_at: new Date(), 
                                attempt_number: job.attemptsMade + 1, 
                                worker_id: this.workerId, 
                                schjl_id:schjl_id
                            });            
                            // console.log('execution',execution);

                            if (!JobTemplate) { 
                                throw new Error(`JobTemplate not found: ${schjt_id}`); 
                            }             
                
                            // Execute based on job type 
                            let result: any; 
                            const jobType = JobTemplate?.job_type || 'HTTP'; 
                        
                            switch (jobType) { 
                                case 'HTTP': 
                                result = await this.httpHandler.execute(scheduledJob, payload); 
                                break; 
                                case 'GRPC': 
                                result = await this.grpcHandler.execute(scheduledJob, payload); 
                                break; 
                                case 'EVENT': 
                                result = await this.eventHandler.execute(scheduledJob, payload); 
                                break; 
                                default: 
                                throw new Error(`Unknown job type: ${jobType}`); 
                            } 
                        
                            // Update execution as completed 
                            const duration = Date.now() - startTime; 
                            console.log('result..',result)
                            await this.getDataFromTable(job.data.token,'PATCH',"sch_job_thread_log",{
                                status: "COMPLETED", 
                                // completedAt: new Date(), 
                                duration_ms: duration, 
                                result, 
                            },{path:execution.schjtl_id}); //execution.schjtl_id
                        
                            //  Update job last run       
                                        
                            // await this.getDataFromTable('PATCH',"sch_job_log",{            
                            //     status: "COMPLETED",
                            //     last_run_at: new Date(), 
                            //     // next_run_at: this.getNextRun(scheduledJob),
                            // },{path:job_log_res.schjl_id});  
                        
                            this.logger.log(`Job completed: ${scheduledJob.name} in ${duration}ms`); 
                            return result; 
                        }
                
                    } catch (error) { 
                        console.log('ERROR',error);
                        const duration = Date.now() - startTime;  
                        await this.getDataFromTable(job.data.token,'PATCH',"sch_job_thread_log",{
                            status: "FAILED",  
                            // completedAt: new Date(), 
                            duration_ms: duration, 
                            error: { message: error.message, stack: error.stack },  
                        },{path:execution.schjtl_id}); //execution.schjtl_id               
                    
                        this.logger.error(`Job failed: ${schjt_id} - ${error.message}`); 
                        throw error; 
                    } 
                    
                } catch (error) {
                    // console.log('ERROR',error);
                    await this.getDataFromTable(job.data.token,'PATCH',"sch_job_log",{
                        status: "FAILED",                                       
                        error_msg: { message: error.message, stack: error.stack },  
                    },{path:schjl_id}); //execution.schjtl_id            
                    throw error
                }
            },
            workerOptions
        );

        // Event listeners
        worker.on('active', (job: Job) => {
        this.logger.log(`Job ${job.id} ${job.name} is now active. Priority: ${job.opts.priority || 'default'}`);
        });

        worker.on('completed', (job: Job, result: any) => {
        this.logger.log(`Job ${job.id} completed successfully`);
        });

        worker.on('failed', (job: Job, error: Error) => {
        this.logger.error(`Job ${job.id} failed after ${job.attemptsMade} attempts`);
        this.logger.error(`Error: ${error.message}`);
        });

        this.workers.set(queueName, worker);
        this.logger.log(`Created new worker for queue: ${queueName}`);

        return worker;
    }

    getNextRun(expression: string, timezone = 'UTC'): Date { 
        const interval = cronParser.parseExpression(expression, { 
        tz: timezone, 
        currentDate: new Date(), 
        }); 
        return interval.next().toDate(); 
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
            let url = this.envData.getBeUrl()+ '/' +tableName //process.env.BE_URL + '/' +tableName 
            if(params?.path){
                url = url + '/' + params.path
            }
            //console.log('URL',url);
            
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

    isWithinDateRange(now: Date,start: string,end: string,tz: string): boolean {
        const current = new Date(
            now.toLocaleString('en-US', { timeZone: tz })
        );

        return (
            current >= new Date(start) &&
            current <= new Date(end)
        );
    }

    isWithinWindow(now: Date,windows: { start: string; end: string }[],tz: string): boolean {

        if (!windows || windows.length === 0) return true;

        const formatter = new Intl.DateTimeFormat('en-GB', {
            timeZone: tz,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        const currentTime = formatter.format(now); // Guaranteed HH:mm:ss
        //console.log("currentTime",currentTime);
        
        return windows.some(({ start, end }) => {
            if (start <= end) {
            return currentTime >= start && currentTime <= end;
            }

            // Overnight window (e.g. 22:00 → 02:00)
            return currentTime >= start || currentTime <= end;
        });
    }  
 
}