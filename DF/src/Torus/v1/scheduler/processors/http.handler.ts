import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';

@Injectable()
export class HttpHandler {

    async execute(scheduledJob, payload){   
        try {            
           
            let apiUrl = scheduledJob.job_config.url
            let apiMethod = scheduledJob.job_config.method
            let apiParams = scheduledJob.job_config.params//headers
            
            payload = payload?.data || payload
            return await this.getDataFromTable(apiParams,apiMethod,apiUrl,payload)    
            // if(apiMethod == 'POST'){
            //     let response = await axios.post(apiUrl,payload); //'http://192.168.2.96:5000/flow/externalApi'
            //     // console.log('response..',response);
            //     return response.data
            // }
        } catch (error) {
            console.log('ERROR',error);
            throw error
        }    
    }

    async getDataFromTable(apiParams,method,url,data): Promise<any> {
        try {   
            let response,axiosParams = {}                    
          
            if(apiParams?.headers?.Authorization){
                axiosParams["headers"] = {
                    "Authorization" : apiParams.headers.Authorization,                    
                }
            }
            if(apiParams?.query){
                axiosParams["params"] = apiParams?.query
            }

            if(apiParams?.path){
                url = url + '/' + apiParams.path
            }

            // console.log('axiosParams',axiosParams);
            
            const requestConfig: AxiosRequestConfig = axiosParams             
           
            if(method == 'GET'){
                response = await axios.get(url,requestConfig);                   
            }else if(method == 'POST' && data){
                response = await axios.post(url,data,requestConfig);
            }else if(method == 'PATCH' && data){
                response = await axios.patch(url,data,requestConfig);
            }
            if ([200,201,204].includes(response?.status) && response?.data) {
                return response?.data;
            }        
        } catch (error) {
            throw error;
        }    
    }
}