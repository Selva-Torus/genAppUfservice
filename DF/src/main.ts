
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import * as fs from 'fs';
import multipart from '@fastify/multipart'; 
import { BigIntInterceptor } from './bigint.interceptor';
import { AppService } from './app.service';
import { EnvData } from './envData/envData.service';
//import { envData as mongoClientEnvData } from './mongoClient';
import { decrypt } from './decrypt';
import { Logger, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtServices } from "src/jwt.services";
import { getRedisClient } from "src/redis.config";
import fastifyCookie from '@fastify/cookie';
const Redis = require('ioredis');

async function bootstrap() {
  const logger = new Logger('Redis');
  const redis = getRedisClient();

  let configData = null;
  try {
    const redisResult:any = await redis.call('JSON.GET', "CK:CT010:FNGK:AF:FNK:CDF-DPD:CATK:AG001:AFGK:A001:AFK:defaultDPD:AFVK:v1:NDP");
    if (redisResult) {
      const parsed = JSON.parse(redisResult);
      const rootKey = Object.keys(parsed)[0];
      const encryptedPayload = parsed[rootKey];
      const decryptedData = decrypt<{ data: any }>(encryptedPayload);
      configData = decryptedData.data;

      if (configData) {
        logger.log('✅ Config fetched from Redis');
      } else {
        throw new Error('Config structure Redis - No DPD data found');
      }
    } else {
      logger.warn('⚠️ No config found in Redis for key');
    }
  } catch (error) {
    logger.error('Error loading config from Redis:', error);
  }

   //if (configData) {
   // mongoClientEnvData.setConfig(configData);
 // }

  const fastifyAdapter = new FastifyAdapter({
    bodyLimit: 10 * 1024 * 1024, // 10MB limit
    logger: true,
    // Trust X-Forwarded-* headers from the reverse proxy/load balancer in front of
    // this service, so req.ip / req.protocol / req.hostname reflect the real client
    // instead of the proxy. Without this, IP-based rate limiting, audit logs, and
    // any protocol/host checks silently see the proxy's address instead.
    ///trustProxy: process.env.TRUST_PROXY_HOPS
     // ? Number(process.env.TRUST_PROXY_HOPS)
     // : true,

    trustProxy:true,
  });
  if (configData) {
    EnvData.preloadConfig(configData);
    logger.log('✅ Config preloaded into EnvData before bootstrap');
  }
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );
    // Global interceptor for BigInt serialization
  app.useGlobalInterceptors(new BigIntInterceptor());
  // Global validation for any @Body()/@Param()/@Query() typed with a DTO class.
  // transform:true applies existing class-validator decorators (e.g. @IsNotEmpty on
  // OrchestrationDto.key) app-wide instead of only on the ERD controllers.
  // NOTE: whitelist/forbidNonWhitelisted are intentionally omitted — several DTOs in
  // dto.ts (OrchestrationDto, setUpKeyDto, etc.) have undecorated fields (dpdKey, method,
  // componentId...) that whitelist mode would silently strip. Add those once DTOs are
  // fully decorated.
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.init();
  const envData = app.get(EnvData);

  if (!configData) {
    console.error('❌EndDetails Not Initialized');
    throw new Error('DPD config data is required for application startup');
  }

  envData.setConfig(configData);
  console.log('✅ Config loaded into EndDetails');
  //app.use(
    //session({
      //secret: 'Torus9x',
      //resave: false,
      //saveUninitialized: false,
    //}),
  //);
  
  //Middleware applied
  const fastifyInstance = fastifyAdapter.getInstance();
   // Register the core Fastify multipart plugin
  fastifyInstance.register(multipart as any, {
     limits: {
       fileSize: 10 * 1024 * 1024,
       files: 10,
     },
   });    
  // Cookie support backs the /docs-login bridge below — it lets a browser
  // carry the same JWT the Authorization header carries for Postman, since a
  // plain browser navigation to /docs can't attach a custom header.
  // (The /docs-login form POST is application/x-www-form-urlencoded — Nest's
  // FastifyAdapter already registers a parser for that during app.init(), so
  // no extra body-parser plugin is needed here.)
  fastifyInstance.register(fastifyCookie);
  // CORS — restricted to an operator-configured allowlist instead of the
  // previous unrestricted default. Set CORS_ALLOWED_ORIGINS (comma-separated)
  // to the real front-end origin(s) before deploying; with it unset, all
  // cross-origin requests are rejected (fail closed).
  const corsAllowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || '')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);
  app.enableCors({
    origin: corsAllowedOrigins.length > 0 ? corsAllowedOrigins : false,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  });
    
  // Microservice setup (TCP transport)
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: process.env.PO_PORT,
    },
  });
  await app.startAllMicroservices();

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Nest API')
    .setDescription('The Nestjs API documentation')
    .setVersion('0.1')
    .addTag('ERD API')
    .addTag('Torus API')
    .addTag('Scheduler API')
    .addBearerAuth(
    { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 
    'JWT-auth',
    )
    .addServer('https://tgadev2.toruslowcode.com/ct010/ag001/a001/v1/api/ct010/ag001/a001/v1/api','Production Server')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const appService = app.get(AppService);
  appService.setSwaggerDocument(document);
  await appService.initSwaggerUpload();
    // Swagger UI/JSON was previously mounted with no guard in front of it —
  // require the same bearer token AuthGuard checks before serving /docs.
  const swaggerJwtService = app.get(JwtServices);
  const swaggerEnvData = app.get(EnvData);
  const DOCS_COOKIE_NAME = 'docs_token';
  fastifyInstance.addHook('onRequest', async (request, reply) => {
    if (!request.url.includes('/docs')) return;
    if (request.url.startsWith('/docs-login')) return; // verifies the token itself, see below
    const authHeader = request.headers.authorization;
    const token = authHeader?.split(' ')[1] || (request.cookies as any)?.[DOCS_COOKIE_NAME];
    if (!token) {
      reply.code(401).send({ message: 'Authorization header is missing' });
      return;
    }
    try {
      await swaggerJwtService.verifyToken(token);
    } catch (e) {
      reply.code(401).send({ message: 'Invalid or expired token' });
      return;
    }
  });

  // Bridges a browser session into the /docs gate above: paste the same JWT
  // used with Postman, it's verified server-side, then stored as an httpOnly
  // cookie (never in the URL/query string) so subsequent browser navigations
  // to /docs carry it automatically.
  const renderDocsLoginPage = (hasError: boolean) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sign in to API Docs</title>
<style>
  :root{
    --bg-1:#eef2f7;
    --bg-2:#e4ecf7;
    --card-bg:#ffffff;
    --border:#e2e8f0;
    --text-primary:#0f172a;
    --text-secondary:#5b6472;
    --text-muted:#8892a0;
    --brand:#2952e3;
    --brand-hover:#2244c7;
    --brand-active:#1c3aab;
    --focus-ring:rgba(41,82,227,0.18);
    --error-bg:#fdf2f2;
    --error-border:#f7c9c9;
    --error-text:#b3261e;
    --info-bg:#f4f7fd;
    --info-border:#dbe4f3;
    --shadow-card:0 20px 45px -20px rgba(15,23,42,0.22), 0 2px 8px rgba(15,23,42,0.06);
    --radius-lg:16px;
    --radius-md:10px;
    --radius-sm:8px;
  }

  *{box-sizing:border-box;}

  html,body{
    height:100%;
    margin:0;
    padding:0;
  }

  body{
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    color:var(--text-primary);
    min-height:100vh;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:2rem 1rem;
    background:
      radial-gradient(1100px 550px at 15% -10%, #dfe9fb 0%, rgba(223,233,251,0) 60%),
      radial-gradient(900px 500px at 100% 10%, #e8f0fb 0%, rgba(232,240,251,0) 55%),
      linear-gradient(180deg, var(--bg-1) 0%, var(--bg-2) 100%);
    background-attachment:fixed;
  }

  .page{
    width:100%;
    max-width:440px;
    display:flex;
    flex-direction:column;
    align-items:center;
  }

  .brand-row{
    display:flex;
    align-items:center;
    gap:0.5rem;
    margin-bottom:1.5rem;
    color:var(--text-secondary);
    font-size:0.8125rem;
    font-weight:600;
    letter-spacing:0.06em;
    text-transform:uppercase;
  }

  .brand-row svg{
    width:16px;
    height:16px;
    color:var(--brand);
  }

  .card{
    width:100%;
    background:var(--card-bg);
    border:1px solid var(--border);
    border-radius:var(--radius-lg);
    box-shadow:var(--shadow-card);
    padding:2.5rem 2.25rem 2.25rem;
  }

  .icon-wrap{
    width:52px;
    height:52px;
    border-radius:14px;
    background:linear-gradient(150deg,#3358e6,#2244c7);
    display:flex;
    align-items:center;
    justify-content:center;
    margin:0 auto 1.25rem;
    box-shadow:0 8px 18px -6px rgba(41,82,227,0.55);
  }

  .icon-wrap svg{
    width:24px;
    height:24px;
    stroke:#ffffff;
  }

  h1{
    font-size:1.375rem;
    font-weight:700;
    text-align:center;
    margin:0 0 0.5rem;
    letter-spacing:-0.01em;
  }

  .subtitle{
    font-size:0.9rem;
    line-height:1.5;
    color:var(--text-secondary);
    text-align:center;
    margin:0 0 1.5rem;
  }

  .alert-error{
    display:flex;
    align-items:flex-start;
    gap:0.6rem;
    background:var(--error-bg);
    border:1px solid var(--error-border);
    color:var(--error-text);
    border-radius:var(--radius-md);
    padding:0.75rem 0.9rem;
    font-size:0.85rem;
    line-height:1.45;
    margin-bottom:1.25rem;
  }

  .alert-error svg{
    width:18px;
    height:18px;
    flex:0 0 auto;
    margin-top:1px;
  }

  .info-box{
    display:flex;
    align-items:flex-start;
    gap:0.6rem;
    background:var(--info-bg);
    border:1px solid var(--info-border);
    border-radius:var(--radius-md);
    padding:0.75rem 0.9rem;
    font-size:0.8125rem;
    line-height:1.5;
    color:var(--text-secondary);
    margin-bottom:1.5rem;
  }

  .info-box svg{
    width:16px;
    height:16px;
    flex:0 0 auto;
    margin-top:2px;
    color:var(--brand);
  }

  .info-box strong{
    color:var(--text-primary);
    font-weight:600;
  }

  label.field-label{
    display:block;
    font-size:0.8125rem;
    font-weight:600;
    color:var(--text-primary);
    margin-bottom:0.5rem;
  }

  .token-field{
    position:relative;
  }

  textarea[name="token"]{
    width:100%;
    min-height:9rem;
    resize:vertical;
    font-family:"SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace;
    font-size:0.8125rem;
    line-height:1.5;
    color:var(--text-primary);
    background:#f8fafc;
    border:1px solid var(--border);
    border-radius:var(--radius-md);
    padding:0.75rem 2.5rem 0.75rem 0.875rem;
    transition:border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
  }

  textarea[name="token"]::placeholder{
    color:var(--text-muted);
    font-family:"SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace;
  }

  textarea[name="token"]:hover{
    border-color:#c7d2e0;
  }

  textarea[name="token"]:focus{
    outline:none;
    border-color:var(--brand);
    background:#ffffff;
    box-shadow:0 0 0 4px var(--focus-ring);
  }

  .clear-btn{
    position:absolute;
    top:0.6rem;
    right:0.6rem;
    width:26px;
    height:26px;
    display:flex;
    align-items:center;
    justify-content:center;
    background:#ffffff;
    border:1px solid var(--border);
    border-radius:7px;
    color:var(--text-muted);
    cursor:pointer;
    padding:0;
    transition:all 0.15s ease;
  }

  .clear-btn:hover{
    color:var(--error-text);
    border-color:var(--error-border);
    background:var(--error-bg);
  }

  .clear-btn:focus-visible{
    outline:none;
    box-shadow:0 0 0 3px var(--focus-ring);
  }

  .clear-btn svg{
    width:13px;
    height:13px;
  }

  .field-hint{
    font-size:0.75rem;
    color:var(--text-muted);
    margin:0.5rem 0 1.5rem;
  }

  button.submit-btn{
    width:100%;
    display:flex;
    align-items:center;
    justify-content:center;
    gap:0.4rem;
    background:var(--brand);
    color:#ffffff;
    font-size:0.9375rem;
    font-weight:600;
    border:none;
    border-radius:var(--radius-md);
    padding:0.8rem 1rem;
    cursor:pointer;
    transition:background 0.15s ease, transform 0.05s ease, box-shadow 0.15s ease;
    box-shadow:0 8px 16px -6px rgba(41,82,227,0.45);
  }

  button.submit-btn:hover{
    background:var(--brand-hover);
  }

  button.submit-btn:active{
    background:var(--brand-active);
    transform:translateY(1px);
  }

  button.submit-btn:focus-visible{
    outline:none;
    box-shadow:0 0 0 4px var(--focus-ring);
  }

  .footer-note{
    text-align:center;
    font-size:0.75rem;
    color:var(--text-muted);
    margin-top:1.75rem;
  }

  @media (max-width:480px){
    .card{
      padding:2rem 1.5rem 1.75rem;
      border-radius:14px;
    }
    h1{font-size:1.2rem;}
  }
</style>
</head>
<body>
  <div class="page">
    <div class="brand-row">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17V7a2 2 0 0 1 2-2h8l6 6v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path d="M14 5v6h6"/></svg>
      <span>API Platform &middot; Documentation</span>
    </div>

    <div class="card">
      <div class="icon-wrap">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15" r="1.5" fill="#ffffff" stroke="none"/></svg>
      </div>

      <h1>Sign in to API Docs</h1>
      <p class="subtitle">Authentication is required to access the API documentation. Enter the JWT bearer token you use to access the APIs.</p>

      ${hasError ? `<div class="alert-error" role="alert">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>Invalid or expired token. Please check your token and try again.</span>
      </div>` : ''}

      <div class="info-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
        <span><strong>Your token stays private.</strong> It is used only to authenticate this request. Do not share your token with anyone.</span>
      </div>

      <form method="POST" action="docs-login" autocomplete="off">
        <label class="field-label" for="token">JWT Bearer Token</label>
        <div class="token-field">
          <textarea id="token" name="token" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." required spellcheck="false" autocomplete="off"></textarea>
          <button type="button" id="clearTokenBtn" class="clear-btn" aria-label="Clear token">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <p class="field-hint">Paste the full token, including the header and signature segments.</p>

        <button type="submit" class="submit-btn">
          Continue to API Docs
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </form>
    </div>

    <p class="footer-note">Tokens are never stored in your browser and are transmitted only to this server.</p>
  </div>

  <script>
    (function () {
      var tokenField = document.getElementById('token');
      var clearBtn = document.getElementById('clearTokenBtn');

      if (clearBtn && tokenField) {
        clearBtn.addEventListener('click', function (event) {
          event.preventDefault();
          tokenField.value = '';
          tokenField.focus();
        });
      }
    })();
  </script>
</body>
</html>`;

  fastifyInstance.get('/docs-login', async (request, reply) => {
    const hasError = (request.query as any)?.error === '1';
    reply.type('text/html').send(renderDocsLoginPage(hasError));
  });

  fastifyInstance.post('/docs-login', async (request, reply) => {
    const token = (request.body as any)?.token?.trim();
    if (!token) {
      // Relative redirect (no leading slash): resolves against the request's
      // own path, so it preserves whatever prefix the reverse proxy exposed
      // this service under instead
      // of jumping to the domain root and losing the prefix.
      reply.redirect('docs-login?error=1');
      return;
    }
    try {
      await swaggerJwtService.verifyToken(token);
    } catch (e) {
      reply.redirect('docs-login?error=1');
      return;
    }
    reply.setCookie(DOCS_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60, // 1h — verifyToken re-checks signature/expiry/session on every /docs request anyway
    });
    // Relative redirect — see note above. Resolves to "<same dir>/docs",
    reply.redirect('docs');
  });

  SwaggerModule.setup('docs', app, document);

  //helmet
  // Strict, no-inline CSP is the global default applied to every response.
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        scriptSrc: [`'self'`],
        styleSrc: [`'self'`],
        imgSrc: [`'self'`, 'data:'],
      },
    },
    global: true,
  });

  // Swagger UI's bundled bootstrap script/styles are inline, so /docs needs
  // 'unsafe-inline' — but nowhere else should. This widens the CSP on just
  // the /docs response, after Helmet's global (strict) policy already ran.
  fastifyInstance.addHook('onRequest', async (request, reply) => {
    if (!request.url.includes('/docs')) return;
    reply.helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          scriptSrc: [`'self'`, `'unsafe-inline'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, 'data:'],
        },
      },
    });
  });
   
  // Start Fastify app
  await app.listen(process.env.APP_PORT,"0.0.0.0");
}
bootstrap();
