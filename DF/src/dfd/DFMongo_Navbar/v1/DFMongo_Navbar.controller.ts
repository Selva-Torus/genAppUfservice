import { Controller } from "@nestjs/common";
import { TeService } from "src/Torus/v1/te/te.service";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";

@Controller('df')
export class DFMongo_NavbarController {
    constructor(private readonly teService:TeService){}

        @EventPattern('Mongo_Navbar_67cb8766f2284a7dae1247460fac763b_RequestInitiated') 
        async Mongo_Navbar_67cb8766f2284a7dae1247460fac763b_RequestInitiated(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
           @EventPattern('Mongo_Navbar_9de037377aea45af9dd55eb514c30e82_RequestCompleted') 
        async Mongo_Navbar_9de037377aea45af9dd55eb514c30e82_RequestCompleted(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
    
}