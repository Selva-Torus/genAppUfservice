import { Injectable, Logger } from '@nestjs/common';
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq'; 
import { Worker,Job,WorkerOptions } from 'bullmq';
import { EventHandler } from './event.handler';
import axios, { AxiosRequestConfig } from 'axios';
import { HttpHandler } from './http.handler';
import { GrpcHandler } from './grpc.handler';
import * as cronParser from 'cron-parser';


 
@Processor('scheduler') 
export class JobProcessor extends WorkerHost {   
    private readonly logger = new Logger(JobProcessor.name); 
    private readonly workerId = `worker-${process.pid}-${Date.now()}`;
    // private APIURL = "https://tgadev.toruslowcode.com/tt001/Torus20261/Torus202601/v1/api/"
    
    constructor( 
        private readonly httpHandler: HttpHandler, 
        private readonly grpcHandler: GrpcHandler, 
        private readonly eventHandler: EventHandler, 
    ) {super();}

    async process(job: Job): Promise<any> { 
        let schjl_id
        try {     
            this.logger.log({
                msg: 'Processing job started',
                jobId: job.id,
                name: job.name,
                data: job.data,
            });    
            
            let { schjt_id,schsj_id, ...payload } = job.data; 
            schjl_id = job.data.schjl_id
            const startTime = Date.now();    
            // job_log_res = await this.getDataFromTable(job.token,'POST',"sch_job_log",{            
            //     status: "ACTIVE",                    
            // });
            // console.log('job_log_res',job_log_res);
            
            let execution;         
            try {     
              
                const JobTemplate = await this.getDataFromTable(job.token,'GET',"sch_job_template","",{path:schjt_id});
                const scheduledJob = await this.getDataFromTable(job.token,'GET',"sch_scheduled_job","",{path:schsj_id});
                const now = new Date();
          
                if (!this.isWithinDateRange(
                    now,
                    scheduledJob.scheduler_info.job_start_date,
                    scheduledJob.scheduler_info.job_end_date,
                    scheduledJob.scheduler_info.time_zone
                )
                ) {
                    return;
                }

            
                if (scheduledJob.scheduler_info.window_time && !this.isWithinWindow(
                    now,
                    scheduledJob.scheduler_info.window_time,
                    scheduledJob.scheduler_info.time_zone
                )
                ) {
                    return;
                }

                 

                execution = await this.getDataFromTable(job.token,'POST',"sch_job_thread_log",{ 
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
                await this.getDataFromTable(job.token,'PATCH',"sch_job_thread_log",{
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
        
            } catch (error) { 
                console.log('ERROR',error);
                const duration = Date.now() - startTime;  
                await this.getDataFromTable(job.token,'PATCH',"sch_job_thread_log",{
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
            await this.getDataFromTable(job.token,'PATCH',"sch_job_log",{
                status: "FAILED",                                       
                error_msg: { message: error.message, stack: error.stack },  
            },{path:schjl_id}); //execution.schjtl_id            
            throw error
        }
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
            let url = process.env.BE_URL + '/' +tableName 
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

        const currentTime = now.toLocaleTimeString('en-GB', {
            timeZone: tz,
            hour12: false
        });

        return windows.some(({ start, end }) => {
            // Normal window
            if (start <= end) {
            return currentTime >= start && currentTime <= end;
            }

            // Overnight window (e.g. 22:00 → 02:00)
            return currentTime >= start || currentTime <= end;
        });
    }

 
}