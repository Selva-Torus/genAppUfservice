import { Controller } from "@nestjs/common";
import { TeService } from "src/Torus/v1/te/te.service";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";

@Controller('df')
export class DFMongo_Navbarv2Controller {
    constructor(private readonly teService:TeService){}

        @EventPattern('Mongo_Navbarv2_09e5afc8fbad421fa52411797591106d_RequestInitiated') 
        async Mongo_Navbarv2_09e5afc8fbad421fa52411797591106d_RequestInitiated(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
           @EventPattern('Mongo_Navbarv2_9de037377aea45af9dd55eb514c30e82_RequestCompleted') 
        async Mongo_Navbarv2_9de037377aea45af9dd55eb514c30e82_RequestCompleted(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
    
}