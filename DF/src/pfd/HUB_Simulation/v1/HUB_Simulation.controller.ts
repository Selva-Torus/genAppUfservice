import { Controller } from "@nestjs/common";
import { HUB_SimulationService } from "./HUB_Simulation.service";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";

@Controller('pf')
export class HUB_SimulationController {
    constructor(private readonly hub_simulationService: HUB_SimulationService){}

        @EventPattern('CT242PFSFDTPPTEST001TPPTEST002HUBSimulationv1_63ed9d2ee4cf4d8b95022fea63af1f5f_d24vdqycxz4g008wv5eg_TOF_Post_Consents_Completed') 
        async CT242PFSFDTPPTEST001TPPTEST002HUBSimulationv1_63ed9d2ee4cf4d8b95022fea63af1f5f_d24vdqycxz4g008wv5eg_TOF_Post_Consents_Completed(input: PoEvent) { 
           return await this.hub_simulationService.getHUB_SimulationProcess(input)
        }       
           @EventPattern('CT242PFSFDTPPTEST001TPPTEST002HUBSimulationv1_ec33833c93b64949b02d7d28f5a98c59_d24vh8dcxz4g008wv5vg_Get_TOF_Consents_Completed') 
        async CT242PFSFDTPPTEST001TPPTEST002HUBSimulationv1_ec33833c93b64949b02d7d28f5a98c59_d24vh8dcxz4g008wv5vg_Get_TOF_Consents_Completed(input: PoEvent) { 
           return await this.hub_simulationService.getHUB_SimulationProcess(input)
        }       
           @EventPattern('CT242PFSFDTPPTEST001TPPTEST002HUBSimulationv1_05c90e83fa9b428b88e8b4edf8d62789_d24vh8dcxz4g008wv5w0_TOB_TPP_Header_Completed') 
        async CT242PFSFDTPPTEST001TPPTEST002HUBSimulationv1_05c90e83fa9b428b88e8b4edf8d62789_d24vh8dcxz4g008wv5w0_TOB_TPP_Header_Completed(input: PoEvent) { 
           return await this.hub_simulationService.getHUB_SimulationProcess(input)
        }       
           @EventPattern('CT242PFSFDTPPTEST001TPPTEST002HUBSimulationv1_2b9f981e325b49abbaab955a32732541_d24vh8dcxz4g008wv5wg_TOB_LFI_Header_Completed') 
        async CT242PFSFDTPPTEST001TPPTEST002HUBSimulationv1_2b9f981e325b49abbaab955a32732541_d24vh8dcxz4g008wv5wg_TOB_LFI_Header_Completed(input: PoEvent) { 
           return await this.hub_simulationService.getHUB_SimulationProcess(input)
        }       
           @EventPattern('CT242PFSFDTPPTEST001TPPTEST002HUBSimulationv1_e73e011e905747eb97e3c189d84f9b5f_d2e3jgts7smg008rtdy0_TOB_Post_Consents_Completed') 
        async CT242PFSFDTPPTEST001TPPTEST002HUBSimulationv1_e73e011e905747eb97e3c189d84f9b5f_d2e3jgts7smg008rtdy0_TOB_Post_Consents_Completed(input: PoEvent) { 
           return await this.hub_simulationService.getHUB_SimulationProcess(input)
        }       
           @EventPattern('CT242PFSFDTPPTEST001TPPTEST002HUBSimulationv1_e840b9e1362c47249037a249e779cb42_d2axd044y3hg0080zx2g_TOB_Consent_Validate_Completed') 
        async CT242PFSFDTPPTEST001TPPTEST002HUBSimulationv1_e840b9e1362c47249037a249e779cb42_d2axd044y3hg0080zx2g_TOB_Consent_Validate_Completed(input: PoEvent) { 
           return await this.hub_simulationService.getHUB_SimulationProcess(input)
        }       
    
}