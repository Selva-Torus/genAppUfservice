import { Controller } from "@nestjs/common";
import { TOB_API_RepositoryService } from "./TOB_API_Repository.service";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";

@Controller('df')
export class TOB_API_RepositoryController {
    constructor(private readonly tob_api_repositoryService: TOB_API_RepositoryService){}

        @EventPattern('TOB_API_Repository_04bacb279f1040af86c8f8005107de37_APIRequestInitiated') 
        async TOB_API_Repository_04bacb279f1040af86c8f8005107de37_APIRequestInitiated(input: PoEvent) { 
           return await this.tob_api_repositoryService.getTOB_API_RepositoryProcess(input)
        }       
           @EventPattern('TOB_API_Repository_24adcfd1807f406a8a01c83503257ef7_APIRequestCompleted') 
        async TOB_API_Repository_24adcfd1807f406a8a01c83503257ef7_APIRequestCompleted(input: PoEvent) { 
           return await this.tob_api_repositoryService.getTOB_API_RepositoryProcess(input)
        }       
    
}