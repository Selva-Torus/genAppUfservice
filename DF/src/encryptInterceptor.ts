import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CommonService } from './common.Service';

@Injectable()
export class EncryptInterceptor implements NestInterceptor {
    constructor(private readonly commonService: CommonService) {}
    intercept(context: ExecutionContext, next: CallHandler) {
      return next.handle().pipe(map(async (data) => {
      if(data?.dpdKey && data?.method){
        let encryptedData:any = await this.commonService.commonEncryption(data.dpdKey,data.method,JSON.stringify(data),'ct003_cg_tg2_v11')
        let authTag:any=""
        if(data.method=="AESGCM"){
          authTag = encryptedData.authTag
          encryptedData = encryptedData.encrypted
        }
        return {
          ciphertext: encryptedData, // original response
          dpdKey:data.dpdKey,
          method:data.method,
          authTag:authTag
        };
      }
      else{
        return data
      }
      }),
    );
  }
}