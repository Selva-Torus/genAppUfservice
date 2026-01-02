import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/dto";
import { TeService } from "src/Torus/v1/te/te.service";

@Controller('pf')
export class Validate_FlowController {
    constructor(private readonly teService:TeService){}

        @EventPattern('CT261UFUFWAG001A001VMCOperationsv1v1_0ce897b54d614087b358f8b36c07608b_4783034907844206b361bbd6a0f70e2d111_RequestInitiated') 
        async CT261UFUFWAG001A001VMCOperationsv1v1_0ce897b54d614087b358f8b36c07608b_4783034907844206b361bbd6a0f70e2d111_RequestInitiated(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT261PFPFDAG001A001ValidateFlowv1_6a07a3af19694d48b0978ba0a77e6896_d45hpskge840008d4y40_RequestCompleted') 
        async CT261PFPFDAG001A001ValidateFlowv1_6a07a3af19694d48b0978ba0a77e6896_d45hpskge840008d4y40_RequestCompleted(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT261PFPFDAG001A001ValidateFlowv1_fadcafac31e240c48ae46c28e2afbb56_d2wjtykvyy20008tvfeg_Source_TXT') 
        async CT261PFPFDAG001A001ValidateFlowv1_fadcafac31e240c48ae46c28e2afbb56_d2wjtykvyy20008tvfeg_Source_TXT(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT261PFPFDAG001A001ValidateFlowv1_c7ee672c025f48d69e18987a942a5135_d45hpskge840008d4y50_Source_XML') 
        async CT261PFPFDAG001A001ValidateFlowv1_c7ee672c025f48d69e18987a942a5135_d45hpskge840008d4y50_Source_XML(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT261UFUFWAG001A001VMCOperationsv1v1_c09a15a1deb74db79a86b45ad09d5746_868c42f23de04d5b869efdd68daf1fd7111_MT_TO_MX_Completed') 
        async CT261UFUFWAG001A001VMCOperationsv1v1_c09a15a1deb74db79a86b45ad09d5746_868c42f23de04d5b869efdd68daf1fd7111_MT_TO_MX_Completed(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT261PFPFDAG001A001ValidateFlowv1_9ee49217f56b46ec820c6ed3ad103e22_d49c1cn83zfg008w7j80_WriteInitiationCompleted') 
        async CT261PFPFDAG001A001ValidateFlowv1_9ee49217f56b46ec820c6ed3ad103e22_d49c1cn83zfg008w7j80_WriteInitiationCompleted(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT261PFPFDAG001A001ValidateFlowv1_ec6973b0df7e476f8c63d30f5671c5da_d46sx4c4v8hg008we6s0_Get_Target_MessageMT') 
        async CT261PFPFDAG001A001ValidateFlowv1_ec6973b0df7e476f8c63d30f5671c5da_d46sx4c4v8hg008we6s0_Get_Target_MessageMT(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT261PFPFDAG001A001ValidateFlowv1_a7bdedf8ef104d6581e02b9a4db5b427_d49c1cn83zfg008w7j90_Get_Target_Message_Mx') 
        async CT261PFPFDAG001A001ValidateFlowv1_a7bdedf8ef104d6581e02b9a4db5b427_d49c1cn83zfg008w7j90_Get_Target_Message_Mx(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT261PFPFDAG001A001ValidateFlowv1_9fbc64867e374217b3c7a7d2c72a4b81_d32gjna7kndg008eadjg_Get_Target_Message_Completed') 
        async CT261PFPFDAG001A001ValidateFlowv1_9fbc64867e374217b3c7a7d2c72a4b81_d32gjna7kndg008eadjg_Get_Target_Message_Completed(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT261PFPFDAG001A001ValidateFlowv1_7f44f823639a4afe9257e3c9c51458fb_d3d6jrvwmxng0080jkx0_DBWriteCompleted') 
        async CT261PFPFDAG001A001ValidateFlowv1_7f44f823639a4afe9257e3c9c51458fb_d3d6jrvwmxng0080jkx0_DBWriteCompleted(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT261PFPFDAG001A001ValidateFlowv1_460f39df2dbb463382a359dfec426f5d_d4avk2cmgzsg008zyqxg_MX_TO_MT_DB_Write_Completed') 
        async CT261PFPFDAG001A001ValidateFlowv1_460f39df2dbb463382a359dfec426f5d_d4avk2cmgzsg008zyqxg_MX_TO_MT_DB_Write_Completed(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT261PFPFDAG001A001ValidateFlowv1_71bf1ed62f4e45698b7c7adff50a0ee6_d4dg4vk2mxpg0083c1sg_FileWriteCompleted') 
        async CT261PFPFDAG001A001ValidateFlowv1_71bf1ed62f4e45698b7c7adff50a0ee6_d4dg4vk2mxpg0083c1sg_FileWriteCompleted(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT261PFPFDAG001A001ValidateFlowv1_47828b6a789c445e808fc92e31282694_d4dg4vk2mxpg0083c1t0_MX_TO_MT_File_Write_Completed') 
        async CT261PFPFDAG001A001ValidateFlowv1_47828b6a789c445e808fc92e31282694_d4dg4vk2mxpg0083c1t0_MX_TO_MT_File_Write_Completed(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT261PFPFDAG001A001ValidateFlowv1_d97735b4040444029fe4cf74ea5b1c90_d4q8fqehcg9000897zn0_StreamWriteCompleted') 
        async CT261PFPFDAG001A001ValidateFlowv1_d97735b4040444029fe4cf74ea5b1c90_d4q8fqehcg9000897zn0_StreamWriteCompleted(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
           @EventPattern('CT261PFPFDAG001A001ValidateFlowv1_9069716e361643d989b4dc5c10f0977e_d4q8g1rhcg90008980g0_MX_TO_MT_Stream_Write_Completed') 
        async CT261PFPFDAG001A001ValidateFlowv1_9069716e361643d989b4dc5c10f0977e_d4q8g1rhcg90008980g0_MX_TO_MT_Stream_Write_Completed(input: PoEvent) { 
           return await this.teService.DynamicFlowProcess(input)
        }       
    
}