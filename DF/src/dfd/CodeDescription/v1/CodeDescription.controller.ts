import { Controller } from "@nestjs/common";
import { CodeDescriptionService } from "./CodeDescription.service";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";

@Controller('df')
export class CodeDescriptionController {
    constructor(private readonly codedescriptionService: CodeDescriptionService){}

        @EventPattern('CodeDescription_d225e4f392134b07b474e5729c41e75f_APIRequestInitiated') 
        async CodeDescription_d225e4f392134b07b474e5729c41e75f_APIRequestInitiated(input: PoEvent) { 
           return await this.codedescriptionService.getCodeDescriptionProcess(input)
        }       
           @EventPattern('CodeDescription_b47995017c1f4ceb9698b6d84446af18_APIRequestCompleted') 
        async CodeDescription_b47995017c1f4ceb9698b6d84446af18_APIRequestCompleted(input: PoEvent) { 
           return await this.codedescriptionService.getCodeDescriptionProcess(input)
        }       
    
}