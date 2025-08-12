import { Controller } from "@nestjs/common";
import { vesselDFDService } from "./vesselDFD.service";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";

@Controller('df')
export class vesselDFDController {
    constructor(private readonly vesseldfdService: vesselDFDService){}

        @EventPattern('vesselDFD_8596b667298d437f84f55b85fb1be739_RequestInitiated') 
        async vesselDFD_8596b667298d437f84f55b85fb1be739_RequestInitiated(input: PoEvent) { 
           return await this.vesseldfdService.getvesselDFDProcess(input)
        }       
           @EventPattern('vesselDFD_279177efdf6040008fa93b58c074a266_RequestedCompleted') 
        async vesselDFD_279177efdf6040008fa93b58c074a266_RequestedCompleted(input: PoEvent) { 
           return await this.vesseldfdService.getvesselDFDProcess(input)
        }       
    
}