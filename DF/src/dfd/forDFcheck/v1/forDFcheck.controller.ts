import { Controller } from "@nestjs/common";
import { forDFcheckService } from "./forDFcheck.service";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";

@Controller('df')
export class forDFcheckController {
    constructor(private readonly fordfcheckService: forDFcheckService){}

        @EventPattern('forDFcheck_a34797542e734c63a5d3432d5a4cb237_DBR_initiated') 
        async forDFcheck_a34797542e734c63a5d3432d5a4cb237_DBR_initiated(input: PoEvent) { 
           return await this.fordfcheckService.getforDFcheckProcess(input)
        }       
           @EventPattern('forDFcheck_f250a27ce95f46e08f508b2286c68d5d_DBR_success') 
        async forDFcheck_f250a27ce95f46e08f508b2286c68d5d_DBR_success(input: PoEvent) { 
           return await this.fordfcheckService.getforDFcheckProcess(input)
        }       
    
}