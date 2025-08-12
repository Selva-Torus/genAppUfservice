import { Controller } from "@nestjs/common";
import { testTableCheck2Service } from "./testTableCheck2.service";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";

@Controller('df')
export class testTableCheck2Controller {
    constructor(private readonly testtablecheck2Service: testTableCheck2Service){}

        @EventPattern('testTableCheck2_127a09c41a0348fc8e93c137b4a4becf_RequestInitiated') 
        async testTableCheck2_127a09c41a0348fc8e93c137b4a4becf_RequestInitiated(input: PoEvent) { 
           return await this.testtablecheck2Service.gettestTableCheck2Process(input)
        }       
           @EventPattern('testTableCheck2_23d20ae929914fd896ef4ef6f33de29a_RequestCompleted') 
        async testTableCheck2_23d20ae929914fd896ef4ef6f33de29a_RequestCompleted(input: PoEvent) { 
           return await this.testtablecheck2Service.gettestTableCheck2Process(input)
        }       
    
}