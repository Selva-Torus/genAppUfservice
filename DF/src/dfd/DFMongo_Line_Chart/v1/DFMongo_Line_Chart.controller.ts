import { Controller } from "@nestjs/common";
import { TeService } from "src/Torus/v1/te/te.service";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";

@Controller('df')
export class DFMongo_Line_ChartController {
    constructor(private readonly teService:TeService){}

        @EventPattern('Mongo_Line_Chart_0c39cddcbdaf4b799c7988a4d79f47b5_RequestInitiated') 
        async Mongo_Line_Chart_0c39cddcbdaf4b799c7988a4d79f47b5_RequestInitiated(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
           @EventPattern('Mongo_Line_Chart_e29f6949cad147afba000b1f58910347_RequestCompleted') 
        async Mongo_Line_Chart_e29f6949cad147afba000b1f58910347_RequestCompleted(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
    
}