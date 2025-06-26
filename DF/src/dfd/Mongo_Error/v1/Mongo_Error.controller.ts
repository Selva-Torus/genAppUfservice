import { Controller } from "@nestjs/common";
import { Mongo_ErrorService } from "./Mongo_Error.service";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";

@Controller('df')
export class Mongo_ErrorController {
    constructor(private readonly mongo_errorService: Mongo_ErrorService){}

        @EventPattern('Mongo_Error_0a531df99d404cd6a644f1b6ef1e628f_APIRequestInitiated') 
        async Mongo_Error_0a531df99d404cd6a644f1b6ef1e628f_APIRequestInitiated(input: PoEvent) { 
           return await this.mongo_errorService.getMongo_ErrorProcess(input)
        }       
           @EventPattern('Mongo_Error_9af36ceaa8b24a5cab30390d8db99132_APIRequestCompleted') 
        async Mongo_Error_9af36ceaa8b24a5cab30390d8db99132_APIRequestCompleted(input: PoEvent) { 
           return await this.mongo_errorService.getMongo_ErrorProcess(input)
        }       
    
}