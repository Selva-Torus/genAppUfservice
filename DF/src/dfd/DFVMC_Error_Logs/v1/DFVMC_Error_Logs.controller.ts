import { Controller } from "@nestjs/common";
import { TeService } from "src/Torus/v1/te/te.service";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";

@Controller('df')
export class DFVMC_Error_LogsController {
    constructor(private readonly teService:TeService){}

        @EventPattern('VMC_Error_Logs_917cef7a59ab4ab7b53a188b0c14acd2_RequestInitaited') 
        async VMC_Error_Logs_917cef7a59ab4ab7b53a188b0c14acd2_RequestInitaited(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
           @EventPattern('VMC_Error_Logs_d9b39c335f294fe38262d8207ddea717_RequestCompleted') 
        async VMC_Error_Logs_d9b39c335f294fe38262d8207ddea717_RequestCompleted(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
    
}