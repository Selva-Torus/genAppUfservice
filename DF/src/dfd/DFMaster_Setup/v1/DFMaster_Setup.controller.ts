import { Controller } from "@nestjs/common";
import { TeService } from "src/Torus/v1/te/te.service";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";

@Controller('df')
export class DFMaster_SetupController {
    constructor(private readonly teService:TeService){}

        @EventPattern('Master_Setup_db6556781ff7438f96721781d22d4eb3_RequestInitiated') 
        async Master_Setup_db6556781ff7438f96721781d22d4eb3_RequestInitiated(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
           @EventPattern('Master_Setup_1109fe3ad6f0408ab52104c1b333b2a0_RequestCompleted') 
        async Master_Setup_1109fe3ad6f0408ab52104c1b333b2a0_RequestCompleted(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
    
}