import { Controller } from "@nestjs/common";
import { transactionsDFDService } from "./transactionsDFD.service";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";

@Controller('df')
export class transactionsDFDController {
    constructor(private readonly transactionsdfdService: transactionsDFDService){}

        @EventPattern('transactionsDFD_3376f335efc1462b9a7045e9ce788929_RequestInitiated') 
        async transactionsDFD_3376f335efc1462b9a7045e9ce788929_RequestInitiated(input: PoEvent) { 
           return await this.transactionsdfdService.gettransactionsDFDProcess(input)
        }       
           @EventPattern('transactionsDFD_2887e4804139410da79bf8d06d9682d1_RequestCompleted') 
        async transactionsDFD_2887e4804139410da79bf8d06d9682d1_RequestCompleted(input: PoEvent) { 
           return await this.transactionsdfdService.gettransactionsDFDProcess(input)
        }       
    
}