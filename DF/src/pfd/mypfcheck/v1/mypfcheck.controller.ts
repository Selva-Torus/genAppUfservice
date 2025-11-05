import { Controller } from "@nestjs/common";
import { mypfcheckService } from "./mypfcheck.service";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";

@Controller('pf')
export class mypfcheckController {
    constructor(private readonly mypfcheckService: mypfcheckService){}

        @EventPattern('TT407UFUFWCGFATG4CGFAmyUFv1_9550ff79cd5b43abbea337c902095602_5573e7e9993d417cbe880f4cb621f20e111_save_success') 
        async TT407UFUFWCGFATG4CGFAmyUFv1_9550ff79cd5b43abbea337c902095602_5573e7e9993d417cbe880f4cb621f20e111_save_success(input: PoEvent) { 
           return await this.mypfcheckService.getmypfcheckProcess(input)
        }       
           @EventPattern('TT407PFPFDCGFATG4CGFAmypfcheckv1_10a0dafe50b147078b4663a926b9adc7_c95880473e6e49bab07503179bc4f663_save_called') 
        async TT407PFPFDCGFATG4CGFAmypfcheckv1_10a0dafe50b147078b4663a926b9adc7_c95880473e6e49bab07503179bc4f663_save_called(input: PoEvent) { 
           return await this.mypfcheckService.getmypfcheckProcess(input)
        }       
    
}