import { Injectable, Logger } from '@nestjs/common';

/**
 * Guard-style provider (Nest Injectable, not a route CanActivate guard —
 * this check runs during onModuleInit, before any HTTP request exists,
 * so there is no ExecutionContext to attach a CanActivate to).
 *
 * Verifies LOGINID is configured via .env before AppService is allowed
 * to call createApiCollection.
 */
@Injectable()
export class SwaggerGuard {
  private readonly logger = new Logger(SwaggerGuard.name);
  private readonly loginId = process.env.LOGINID;

  canActivate(): boolean {
    if (!this.loginId || !this.loginId.trim()) {
      this.logger.error(
        'Swagger upload aborted: LoginID is missing or empty.',
      );
      return false;
    }

    return true;
  }
}
