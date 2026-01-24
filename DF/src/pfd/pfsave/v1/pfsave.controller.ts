import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { DynamicFlowService } from "src/Torus/v1/te/dynamicFlow.service";

@Controller('pf')
export class pfsaveController {
   constructor(private readonly dynamicFlowService:DynamicFlowService){}

        @EventPattern('CT309UFUFWAG001A001savescreenv1_a6a598866e644f57989544f4561e4073_437428db823a4960833589a094c8d5a7111_humanstarted') 
        async CT309UFUFWAG001A001savescreenv1_a6a598866e644f57989544f4561e4073_437428db823a4960833589a094c8d5a7111_humanstarted(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT309UFUFWAG001A001savescreenv1_a6a598866e644f57989544f4561e4073_fdd291f18a58470c9592c686698ffc78111_copyhumanstarted') 
        async CT309UFUFWAG001A001savescreenv1_a6a598866e644f57989544f4561e4073_fdd291f18a58470c9592c686698ffc78111_copyhumanstarted(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT309PFPFDAG001A001pfsavev1_f2d07ea99e48489e928210729b0a39d6_d5fktkjn4z5g008zzqng_humansuccess') 
        async CT309PFPFDAG001A001pfsavev1_f2d07ea99e48489e928210729b0a39d6_d5fktkjn4z5g008zzqng_humansuccess(input: PoEvent) { 
           return await this.dynamicFlowService.DynamicFlowProcess(input)
        }       
    
}