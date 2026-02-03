import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('pf')
export class CDC_Checker_FlowController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('CT005UFUFWV001VGPH001CDCCheckerActionScreenv1CT005PFPFDV001VGPH001CDCCheckerFlowv1_43e06cf79f2948a981fb19214b4ca20a_007faf10bb62496abe3a472376820de7111_RequestInitiated') 
        async CT005UFUFWV001VGPH001CDCCheckerActionScreenv1CT005PFPFDV001VGPH001CDCCheckerFlowv1_43e06cf79f2948a981fb19214b4ca20a_007faf10bb62496abe3a472376820de7111_RequestInitiated(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT005PFPFDV001VGPH001CDCCheckerFlowv1_e710894d94a341988ed2077af30f23cb_d5sp50ma1y7g008ezm20_RequestCompleted') 
        async CT005PFPFDV001VGPH001CDCCheckerFlowv1_e710894d94a341988ed2077af30f23cb_d5sp50ma1y7g008ezm20_RequestCompleted(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}