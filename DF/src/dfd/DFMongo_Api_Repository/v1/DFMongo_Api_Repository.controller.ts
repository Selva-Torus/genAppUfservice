import { Controller } from "@nestjs/common";
import { TeService } from "src/Torus/v1/te/te.service";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";

@Controller('df')
export class DFMongo_Api_RepositoryController {
    constructor(private readonly teService:TeService){}

        @EventPattern('Mongo_Api_Repository_242a7514c22f4777b4c5e1d0bc97973a_RequestInitiated') 
        async Mongo_Api_Repository_242a7514c22f4777b4c5e1d0bc97973a_RequestInitiated(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
           @EventPattern('Mongo_Api_Repository_bfcdbb21028547269c3c5bde0907e7bc_RequestCompleted') 
        async Mongo_Api_Repository_bfcdbb21028547269c3c5bde0907e7bc_RequestCompleted(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
    
}