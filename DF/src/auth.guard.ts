import { BadRequestException, CanActivate, ExecutionContext,Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { FastifyRequest } from 'fastify';
import { SecurityService } from './securityService';
import { CommonService } from './common.Service';
import { RedisService } from './redisService';


//declare module 'express-session' {
  //interface Session {
    //psArray: Array<any>;
  //}
//}

@Injectable()
export class AuthGuard implements CanActivate {
   private readonly logger = new Logger(AuthGuard.name);
  constructor(
    private readonly securityService: SecurityService,
    private readonly teCommonService: CommonService,
    private readonly redisService: RedisService,
  ) {}
 
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization format. Expected "Bearer <token>"');
    }

    try {
      
      const body = request.body as any; 
      
      if (!body || typeof body.key !== 'string') {
        throw new Error('Invalid request body or key not found');
      }
      const key = body.key;


      let seckey: string;
      if (await this.redisService.exist(key + 'PO', process.env.CLIENTCODE)) {
        seckey = key + 'PO';
      } else if (await this.redisService.exist(key + 'DO', process.env.CLIENTCODE)) {
        seckey = key + 'DO';
      }

      if (!seckey) {
        throw new Error('Security key not found in Redis');
      }

      const sjsoncheck = await this.securityService.getSecurityTemplate(seckey, token);
      if (sjsoncheck && Array.isArray(sjsoncheck) && sjsoncheck.length > 0) {
        this.logger.log("Auth Guard started..");
        
     
        if ((request as any).session) {
          (request as any).session.node = sjsoncheck;
        } else {
          this.logger.error('request.session is not available');
        }
        
        return true;
      } else {
        await this.teCommonService.getTSL(key, token, 'Badrequest in security template', 400);
        throw new BadRequestException('Badrequest in security template');
      }

    } catch (error) {
      const tslerror = await this.teCommonService.getTSL(
        (request.body as any)?.key,
        token,
        error instanceof Error ? error.message : String(error),
        400,
      );
      throw new BadRequestException(tslerror);
    }
  }
}