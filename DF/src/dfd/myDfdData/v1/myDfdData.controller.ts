import { Controller } from "@nestjs/common";
import { myDfdDataService } from "./myDfdData.service";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";

@Controller('df')
export class myDfdDataController {
    constructor(private readonly mydfddataService: myDfdDataService){}

        @EventPattern('myDfdData_cdc7ec6771a44cd48c7d5f4a8c34fd2f_apistarted') 
        async myDfdData_cdc7ec6771a44cd48c7d5f4a8c34fd2f_apistarted(input: PoEvent) { 
           return await this.mydfddataService.getmyDfdDataProcess(input)
        }       
           @EventPattern('myDfdData_8261569e8bf64e7d8523f01bc79f8e83_apisuccess') 
        async myDfdData_8261569e8bf64e7d8523f01bc79f8e83_apisuccess(input: PoEvent) { 
           return await this.mydfddataService.getmyDfdDataProcess(input)
        }       
    
}