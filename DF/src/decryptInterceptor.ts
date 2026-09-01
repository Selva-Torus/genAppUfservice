import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { FastifyRequest } from 'fastify';
import { CommonService } from './common.Service';

@Injectable()
export class DecryptInterceptor implements NestInterceptor {
  constructor(private readonly commonService: CommonService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Only applies to the HTTP transport. Global interceptors also run for
    // the TCP microservice transport, which never had this decryption step.
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const req = context.switchToHttp().getRequest<FastifyRequest & { body?: any }>();
    if (!req.body || !req.body.ciphertext) {
      return next.handle();
    }

    // Registered as a global Nest interceptor (APP_INTERCEPTOR), so this runs
    // AFTER AuthGuard/ThrottlerGuard — decryption only happens for
    // authenticated, rate-limited requests, unlike the old Fastify preHandler
    // hook which ran before both guards.
    return from(this.decryptBody(req)).pipe(mergeMap(() => next.handle()));
  }

  private async decryptBody(req: FastifyRequest & { body?: any }): Promise<void> {
    const { dpdKey, method } = req.body;
    try {
      let decryptedData: any = await this.commonService.commondecryption(
        dpdKey,
        method,
        req.body,
        'ct010_ag001_a001_v1',
      );
      decryptedData = decryptedData.replace(/[\x00-\x1F\x7F]+/g, '').trim();

      const parsedData = JSON.parse(decryptedData);

      req.body = {
        ...parsedData,
        dpdKey,
        method,
      };
    } catch (error) {
      console.error('Decryption or JSON parse failed:', error);
      throw new BadRequestException('Invalid payload');
    }
  }
}
