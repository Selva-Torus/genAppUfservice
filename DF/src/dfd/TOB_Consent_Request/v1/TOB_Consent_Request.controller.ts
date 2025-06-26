import { Controller } from "@nestjs/common";
import { TOB_Consent_RequestService } from "./TOB_Consent_Request.service";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";

@Controller('df')
export class TOB_Consent_RequestController {
    constructor(private readonly tob_consent_requestService: TOB_Consent_RequestService){}

        @EventPattern('TOB_Consent_Request_87185e23449a4f60ae48a7d305607640_APIRequestInitiated') 
        async TOB_Consent_Request_87185e23449a4f60ae48a7d305607640_APIRequestInitiated(input: PoEvent) { 
           return await this.tob_consent_requestService.getTOB_Consent_RequestProcess(input)
        }       
           @EventPattern('TOB_Consent_Request_a3f26f3518b94c99ad6cdac577dfb2ce_APIRequestCompleted') 
        async TOB_Consent_Request_a3f26f3518b94c99ad6cdac577dfb2ce_APIRequestCompleted(input: PoEvent) { 
           return await this.tob_consent_requestService.getTOB_Consent_RequestProcess(input)
        }       
    
}