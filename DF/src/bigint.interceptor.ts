import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BigIntInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(data => this.sanitize(data)));
  }

  private sanitize(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(value => this.sanitize(value));
    }
    // Date has no enumerable own/inherited properties — the generic object
    // branch below would silently replace it with {} via the `for...in`
    // loop below. Pass it through untouched; it's not a BigInt.
    if (obj instanceof Date) {
      return obj;
    }
    if (obj && typeof obj === 'object') {
      const newObj: any = {};
      for (const key in obj) {
        const value = obj[key];
        if (typeof value === 'bigint') {
          // Convert to string or number (safe only if < Number.MAX_SAFE_INTEGER)
          newObj[key] = value <= Number.MAX_SAFE_INTEGER ? Number(value) : value.toString();
        } else {
          newObj[key] = this.sanitize(value);
        }
      }
      return newObj;
    }

    return obj;
  }
}
