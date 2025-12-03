/* {
  "aKey": "CK:TGA:FNGK:BLDC:FNK:DEV:CATK:CT242:AFGK:TPPTEST001:AFK:TPPTEST002:AFVK:v2:bldc",
  "deploymentArtifactKey": "CK:CT242:FNGK:AF:FNK:CDF-DPD:CATK:TPPTEST001:AFGK:TPPTEST002:AFK:TPPTESTDPD:AFVK:v2",
  "appGroupDesc": "TPPTEST",
  "logType": "mongodb",
  "appDesc": "VOFApp",
  "isOld": true,
  "clientCode": "CT242",
  "loginDetails": {
    "loginId": "mari",
    "firstName": "Mari",
    "lastName": "P",
    "email": "marip@torus.tech",
    "mobile": "6374089676",
    "2FAFlag": "N",
    "scope": "client_admin",
    "status": "active",
    "accessProfile": [
      "admin"
    ],
    "accessExpires": "2025-08-17",
    "dateAdded": "2025-05-19T05:53:42.434Z",
    "isRestricted": false,
    "lastActive": "2025-12-03T08:52:21.589Z",
    "client": "CT242"
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
    .setVersion('0.2')
    .addTag('ERD API')
    .addTag('Torus API')
    .addBearerAuth(
    { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 
    'JWT-auth',
    )
    .addServer('https://tgadev.toruslowcode.com/ct242/tpptest001/tpptest002/v2/api','Production Server')
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
