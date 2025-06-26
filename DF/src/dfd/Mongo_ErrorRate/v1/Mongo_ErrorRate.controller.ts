import { Controller } from "@nestjs/common";
import { Mongo_ErrorRateService } from "./Mongo_ErrorRate.service";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";

@Controller('df')
export class Mongo_ErrorRateController {
    constructor(private readonly mongo_errorrateService: Mongo_ErrorRateService){}

        @EventPattern('Mongo_ErrorRate_a87f733c1dcc49e1bff6e66f86553beb_APIRequestInitiated') 
        async Mongo_ErrorRate_a87f733c1dcc49e1bff6e66f86553beb_APIRequestInitiated(input: PoEvent) { 
           return await this.mongo_errorrateService.getMongo_ErrorRateProcess(input)
        }       
           @EventPattern('Mongo_ErrorRate_9885849a2e7e49c4b520830346d6dbcf_APIRequestCompleted') 
        async Mongo_ErrorRate_9885849a2e7e49c4b520830346d6dbcf_APIRequestCompleted(input: PoEvent) { 
           return await this.mongo_errorrateService.getMongo_ErrorRateProcess(input)
        }       
    
}