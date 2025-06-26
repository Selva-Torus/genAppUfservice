import { Controller } from "@nestjs/common";
import { Mongo_SuccessRateService } from "./Mongo_SuccessRate.service";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";

@Controller('df')
export class Mongo_SuccessRateController {
    constructor(private readonly mongo_successrateService: Mongo_SuccessRateService){}

        @EventPattern('Mongo_SuccessRate_7759b6cc6a5b4812b92e4257fa31de18_APIRequestInitiated') 
        async Mongo_SuccessRate_7759b6cc6a5b4812b92e4257fa31de18_APIRequestInitiated(input: PoEvent) { 
           return await this.mongo_successrateService.getMongo_SuccessRateProcess(input)
        }       
           @EventPattern('Mongo_SuccessRate_0822cc11caab40e695f5efb366df9786_APIRequestCompleted') 
        async Mongo_SuccessRate_0822cc11caab40e695f5efb366df9786_APIRequestCompleted(input: PoEvent) { 
           return await this.mongo_successrateService.getMongo_SuccessRateProcess(input)
        }       
    
}