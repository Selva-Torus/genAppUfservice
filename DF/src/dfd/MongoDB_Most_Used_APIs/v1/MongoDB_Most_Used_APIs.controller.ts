import { Controller } from "@nestjs/common";
import { MongoDB_Most_Used_APIsService } from "./MongoDB_Most_Used_APIs.service";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";

@Controller('df')
export class MongoDB_Most_Used_APIsController {
    constructor(private readonly mongodb_most_used_apisService: MongoDB_Most_Used_APIsService){}

        @EventPattern('MongoDB_Most_Used_APIs_87e172e26aba47f4b0f841fe6d0c3cf2_APIRequestInitiated') 
        async MongoDB_Most_Used_APIs_87e172e26aba47f4b0f841fe6d0c3cf2_APIRequestInitiated(input: PoEvent) { 
           return await this.mongodb_most_used_apisService.getMongoDB_Most_Used_APIsProcess(input)
        }       
           @EventPattern('MongoDB_Most_Used_APIs_4dcbf791919245c2a9ce5a53ff26a048_APIRequestCompleted') 
        async MongoDB_Most_Used_APIs_4dcbf791919245c2a9ce5a53ff26a048_APIRequestCompleted(input: PoEvent) { 
           return await this.mongodb_most_used_apisService.getMongoDB_Most_Used_APIsProcess(input)
        }       
    
}