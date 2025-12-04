import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { from, Observable } from 'rxjs';
//import { map, tap } from 'rxjs/operators';
import { CommonService } from './common.Service';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class EncryptInterceptor implements NestInterceptor {
  constructor(private readonly commonService: CommonService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      mergeMap((data) =>
        from(this.handleEncryption(data))
      ),
    );
  }

  private async handleEncryption(data: any) {
    if (data?.dpdKey && data?.method) {
      let encryptedData: any = await this.commonService.commonEncryption(
        data.dpdKey,
        data.method,
        JSON.stringify(data),
        'ct003_ag001_oprmatrix_v1',
      );

      let authTag: any = '';
      if (data.method === 'AESGCM') {
        authTag = encryptedData.authTag;
        encryptedData = encryptedData.encrypted;
      }

      return {
        ciphertext: encryptedData,
        dpdKey: data.dpdKey,
        method: data.method,
        authTag,
      };
    }

    return data;
  }
}