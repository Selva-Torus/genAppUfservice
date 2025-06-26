import { Controller } from "@nestjs/common";
import { TOB_API_Process_LogsService } from "./TOB_API_Process_Logs.service";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";

@Controller('df')
export class TOB_API_Process_LogsController {
    constructor(private readonly tob_api_process_logsService: TOB_API_Process_LogsService){}

        @EventPattern('TOB_API_Process_Logs_b9138edd3213432bb8037b03319d74a2_APIRequestInitiated') 
        async TOB_API_Process_Logs_b9138edd3213432bb8037b03319d74a2_APIRequestInitiated(input: PoEvent) { 
           return await this.tob_api_process_logsService.getTOB_API_Process_LogsProcess(input)
        }       
           @EventPattern('TOB_API_Process_Logs_ed181b522915447497054bb3f57d4023_APIRequestCompleted') 
        async TOB_API_Process_Logs_ed181b522915447497054bb3f57d4023_APIRequestCompleted(input: PoEvent) { 
           return await this.tob_api_process_logsService.getTOB_API_Process_LogsProcess(input)
        }       
    
}