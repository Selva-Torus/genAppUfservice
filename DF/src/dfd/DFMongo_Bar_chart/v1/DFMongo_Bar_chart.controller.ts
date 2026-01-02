import { Controller } from "@nestjs/common";
import { TeService } from "src/Torus/v1/te/te.service";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";

@Controller('df')
export class DFMongo_Bar_chartController {
    constructor(private readonly teService:TeService){}

        @EventPattern('Mongo_Bar_chart_0331f2ee9ab444dcb4abbd9470011418_RequestInitiated') 
        async Mongo_Bar_chart_0331f2ee9ab444dcb4abbd9470011418_RequestInitiated(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
           @EventPattern('Mongo_Bar_chart_c6d82590cd7d4c7bb7e5d2276c54c898_RequestCompleted') 
        async Mongo_Bar_chart_c6d82590cd7d4c7bb7e5d2276c54c898_RequestCompleted(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
    
}