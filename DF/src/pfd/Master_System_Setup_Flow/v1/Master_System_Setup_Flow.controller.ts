import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('pf')
export class Master_System_Setup_FlowController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('CT005UFUFWV001VGPH001MasterSystemSetupv1CT005PFPFDV001VGPH001MasterSystemSetupFlowv1_5824296c38644a15a4f69443b13625ac_517606443a2e4bb0a946018c1ca3a1b8111_RequestInitiation') 
        async CT005UFUFWV001VGPH001MasterSystemSetupv1CT005PFPFDV001VGPH001MasterSystemSetupFlowv1_5824296c38644a15a4f69443b13625ac_517606443a2e4bb0a946018c1ca3a1b8111_RequestInitiation(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT005PFPFDV001VGPH001MasterSystemSetupFlowv1_f53dcb433d774feab40a58482bd8830a_d5rxyvb87m90008apc70_RequestCompleted') 
        async CT005PFPFDV001VGPH001MasterSystemSetupFlowv1_f53dcb433d774feab40a58482bd8830a_d5rxyvb87m90008apc70_RequestCompleted(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}