import { Controller } from "@nestjs/common";
import { Mongo_TotalRequestService } from "./Mongo_TotalRequest.service";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";

@Controller('df')
export class Mongo_TotalRequestController {
    constructor(private readonly mongo_totalrequestService: Mongo_TotalRequestService){}

        @EventPattern('Mongo_TotalRequest_60da7d77beac496b85c2bbd8257ab29b_APIRequestInitiated') 
        async Mongo_TotalRequest_60da7d77beac496b85c2bbd8257ab29b_APIRequestInitiated(input: PoEvent) { 
           return await this.mongo_totalrequestService.getMongo_TotalRequestProcess(input)
        }       
           @EventPattern('Mongo_TotalRequest_4d4e617b6fa2466883782b6c53d894d3_APIRequestCompleted') 
        async Mongo_TotalRequest_4d4e617b6fa2466883782b6c53d894d3_APIRequestCompleted(input: PoEvent) { 
           return await this.mongo_totalrequestService.getMongo_TotalRequestProcess(input)
        }       
    
}