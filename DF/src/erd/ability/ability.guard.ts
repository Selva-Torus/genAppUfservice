import {
  CanActivate,
  ExecutionContext,
  Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CHECK_ABILITY, RequiredRule } from './ability.decorator';
import { CommonService } from 'src/common.Service';
import { JwtServices } from 'src/jwt.services';
import { RedisService } from 'src/redisService';


@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtServices,
    private readonly redisService: RedisService,
    private readonly TGCommonService: CommonService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules =
      this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) ||
      [];

    const request: any = context.switchToHttp().getRequest();
    const dfKey:string = 'CK:CT005:FNGK:AF:FNK:API-ERD:CATK:GSS:AFGK:VGPH:AFK:VGPH_STAGE_ERD:AFVK:v1';
    const source: string = 'redis';
    const target: string = 'redis';
    const artifact : string = dfKey.split(':')[11];
    const token: string = request.headers.authorization.split(' ')[1];
    const decodedToken: any = this.jwtService.decodeToken(token);
    decodedToken.template = 'T1';

    const DO: any = await this.TGCommonService.readAPI(dfKey + ':DO',process.env.clientCode,token);
    const securityData: any = DO.security;
    const templateArray: any[] = securityData.templates;

    if(dfKey === securityData.afK){
      for (let i = 0; i < templateArray.length; i++) {
        if (decodedToken.template === templateArray[i].template && artifact === templateArray[i].security.artifact.resource && templateArray[i].security.artifact.SIFlag.selectedValue === 'AA'){
          for(let j = 0; j < templateArray[i].security.artifact.node.length; j++){
            if(rules[0].subject === templateArray[i].security.artifact.node[j].resource){

              let selectedValues: any = [];
              for(let l=0; l < templateArray[i].security.artifact.node.length; l++){
                selectedValues.push(templateArray[i].security.artifact.node[l].SIFlag.selectedValue);
              }
              if (selectedValues.includes('ATO') && templateArray[i].security.artifact.node[j].SIFlag.selectedValue === 'ATO') {
                for(let m=0; m < templateArray[i].security.artifact.node[j].objElements.length; m++){
                  if(rules[0].action === templateArray[i].security.artifact.node[j].objElements[m].resource){
                    if (templateArray[i].security.artifact.node[j].objElements[m].SIFlag.selectedValue !== 'BTO') {
                      return true
                    }else{
                      return false
                    }
                  }
                }
              }

              if(selectedValues.includes('ATO')){
                break;
              }

              if(templateArray[i].security.artifact.node[j].SIFlag.selectedValue === 'AA'){
                for(let k=0; k < templateArray[i].security.artifact.node[j].objElements.length; k++){
                  if(rules[0].action === templateArray[i].security.artifact.node[j].objElements[k].resource){
                    if (templateArray[i].security.artifact.node[j].objElements[k].SIFlag.selectedValue !== 'BTO') {
                      return true
                    }else{
                      return false
                    }
                  } 
                }
              }else if(templateArray[i].security.artifact.node[j].SIFlag.selectedValue === 'BTO'){
                return false
              }
            }
          }
        }
      }
    }
  return false
    
  }
}
