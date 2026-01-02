import { Controller } from "@nestjs/common";
import { TeService } from "src/Torus/v1/te/te.service";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";

@Controller('df')
export class DFMongo_Total_CallsController {
    constructor(private readonly teService:TeService){}

        @EventPattern('Mongo_Total_Calls_a28911cddcac48c996636b2b499c4cec_RequestInitiated') 
        async Mongo_Total_Calls_a28911cddcac48c996636b2b499c4cec_RequestInitiated(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
           @EventPattern('Mongo_Total_Calls_ba6b4560ea424d238b8e2d26fef09784_RequestCompleted') 
        async Mongo_Total_Calls_ba6b4560ea424d238b8e2d26fef09784_RequestCompleted(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
    
}