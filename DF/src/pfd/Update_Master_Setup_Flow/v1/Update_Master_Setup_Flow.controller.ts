import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { TeService } from "src/Torus/v1/te/te.service";

@Controller('pf')
export class Update_Master_Setup_FlowController {
    constructor(private readonly teService:TeService){}

        @EventPattern('CT261UFUFWAG001A001AddMasterSetupv1_4d01932d0c3743e8b0ce8afc0361c07f_8e1894cf674746b5a789732faf212a05111_RequestInitaited') 
        async CT261UFUFWAG001A001AddMasterSetupv1_4d01932d0c3743e8b0ce8afc0361c07f_8e1894cf674746b5a789732faf212a05111_RequestInitaited(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT261PFPFDAG001A001UpdateMasterSetupFlowv1_b71afe4d1f7c47c6921856f2948f62ba_d4j2s8d5cevg008gmjdg_RequestCompleted') 
        async CT261PFPFDAG001A001UpdateMasterSetupFlowv1_b71afe4d1f7c47c6921856f2948f62ba_d4j2s8d5cevg008gmjdg_RequestCompleted(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
    
}