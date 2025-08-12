import { Controller } from "@nestjs/common";
import { v_billingDFDService } from "./v_billingDFD.service";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";

@Controller('df')
export class v_billingDFDController {
    constructor(private readonly v_billingdfdService: v_billingDFDService){}

        @EventPattern('v_billingDFD_444092a85af7498c9280c15c9a1b6d05_RequestInitiated') 
        async v_billingDFD_444092a85af7498c9280c15c9a1b6d05_RequestInitiated(input: PoEvent) { 
           return await this.v_billingdfdService.getv_billingDFDProcess(input)
        }       
           @EventPattern('v_billingDFD_45dc3beaa3d14f2ba4bcf783ecb55fd9_RequestedCompleted') 
        async v_billingDFD_45dc3beaa3d14f2ba4bcf783ecb55fd9_RequestedCompleted(input: PoEvent) { 
           return await this.v_billingdfdService.getv_billingDFDProcess(input)
        }       
    
}