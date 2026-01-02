import { Controller } from "@nestjs/common";
import { TeService } from "src/Torus/v1/te/te.service";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";

@Controller('df')
export class DFMongo_MainDashboardController {
    constructor(private readonly teService:TeService){}

        @EventPattern('Mongo_MainDashboard_7277937c08d14561b91d79e366bf6387_RequestInitiated') 
        async Mongo_MainDashboard_7277937c08d14561b91d79e366bf6387_RequestInitiated(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
           @EventPattern('Mongo_MainDashboard_5e03c31610cc4e7681970d8e1a6e0ad5_RequestCompleted') 
        async Mongo_MainDashboard_5e03c31610cc4e7681970d8e1a6e0ad5_RequestCompleted(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
    
}