import { Controller } from "@nestjs/common";
import { Mongo_ActiveAPIsService } from "./Mongo_ActiveAPIs.service";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";

@Controller('df')
export class Mongo_ActiveAPIsController {
    constructor(private readonly mongo_activeapisService: Mongo_ActiveAPIsService){}

        @EventPattern('Mongo_ActiveAPIs_0caa078921c342a5ade5d2e5b904ec3d_APIRequestInitiated') 
        async Mongo_ActiveAPIs_0caa078921c342a5ade5d2e5b904ec3d_APIRequestInitiated(input: PoEvent) { 
           return await this.mongo_activeapisService.getMongo_ActiveAPIsProcess(input)
        }       
           @EventPattern('Mongo_ActiveAPIs_d1f1648581e9482bab4cc11f5f318ecb_APIRequestCompleted') 
        async Mongo_ActiveAPIs_d1f1648581e9482bab4cc11f5f318ecb_APIRequestCompleted(input: PoEvent) { 
           return await this.mongo_activeapisService.getMongo_ActiveAPIsProcess(input)
        }       
    
}