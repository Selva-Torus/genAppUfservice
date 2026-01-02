/* {
  "aKey": "CK:TGA:FNGK:BLDC:FNK:DEV:CATK:CT261:AFGK:AG001:AFK:A001:AFVK:v1:bldc",
  "deploymentArtifactKey": "CK:CT261:FNGK:AF:FNK:CDF-DPD:CATK:AG001:AFGK:A001:AFK:VMCDPD:AFVK:v1",
  "appGroupDesc": "AppGroup",
  "logType": "mongodb",
  "appDesc": "Veracious Message Convertor",
  "appLogo": "https://cdns3dfsdev.toruslowcode.com/torus/9.1/CT261/resources/images/transmx-logo.svg",
  "isOld": true,
  "clientCode": "CT261",
  "loginDetails": {
    "loginId": "sriram",
    "firstName": "sriram",
    "lastName": "s",
    "email": "marip@torus.tech",
    "mobile": "6345435345",
    "2FAFlag": "N",
    "scope": "client_admin",
    "status": "active",
    "accessProfile": [
      "admin"
    ],
    "accessExpires": "2025-11-30",
    "dateAdded": "2025-09-01T11:13:43.262Z",
    "isRestricted": false,
    "lastActive": "2026-01-02T05:00:58.731Z",
    "users": "sriramsriram s",
    "profile": "",
    "edit": "",
    "client": "CT261"
  }
} */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import authPlugin from './auth.middleware';
import { CommonService } from './common.Service';
import * as fs from 'fs';
import DecryptPayloadMiddleware from './decryptPayloadMiddleware';
import multipart from '@fastify/multipart';

async function bootstrap() {
    const fastifyAdapter = new FastifyAdapter({
    bodyLimit: 500 * 1024 * 1024, // 500MB limit
    logger: true,
  });
  
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );
  //app.use(
    //session({
      //secret: 'Torus9x',
      //resave: false,
      //saveUninitialized: false,
    //}),
  //);
  
  //Middleware applied
  const fastifyInstance = fastifyAdapter.getInstance();
  const commonService = app.get(CommonService);
  //await fastifyInstance.register(authPlugin(commonService), { prefix: '/te' });
  await fastifyInstance.register(DecryptPayloadMiddleware(commonService));
   // Register the core Fastify multipart plugin
  fastifyInstance.register(multipart as any);    
  //CORS
  app.enableCors({methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS']});

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
    .addBearerAuth(
    { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 
    'JWT-auth',
    )
    .addServer('https://tgadev.toruslowcode.com/ct261/ag001/a001/v1/api','Production Server')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  fs.writeFileSync('./swagger.json', JSON.stringify(document, null, 2));
  SwaggerModule.setup('docs', app, document);

  //helmet
  await app.register(helmet,{
  contentSecurityPolicy: false,
  global: true, 
  });

  // Start Fastify app
  await app.listen(process.env.APP_PORT,"0.0.0.0");
}
bootstrap();
