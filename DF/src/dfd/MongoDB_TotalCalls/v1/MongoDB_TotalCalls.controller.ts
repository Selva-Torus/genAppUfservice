import { Controller } from "@nestjs/common";
import { MongoDB_TotalCallsService } from "./MongoDB_TotalCalls.service";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";

@Controller('df')
export class MongoDB_TotalCallsController {
    constructor(private readonly mongodb_totalcallsService: MongoDB_TotalCallsService){}

        @EventPattern('MongoDB_TotalCalls_40976696744443edb019593ef54f6d64_APIRequestInitiated') 
        async MongoDB_TotalCalls_40976696744443edb019593ef54f6d64_APIRequestInitiated(input: PoEvent) { 
           return await this.mongodb_totalcallsService.getMongoDB_TotalCallsProcess(input)
        }       
           @EventPattern('MongoDB_TotalCalls_30fe3cb176064ac8b7e5c8e696ff8b1a_APIRequestCompleted') 
        async MongoDB_TotalCalls_30fe3cb176064ac8b7e5c8e696ff8b1a_APIRequestCompleted(input: PoEvent) { 
           return await this.mongodb_totalcallsService.getMongoDB_TotalCallsProcess(input)
        }       
    
}