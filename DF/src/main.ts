/* {
  "aKey": "CK:TGA:FNGK:BLDC:FNK:DEV:CATK:TT407:AFGK:CGFA:AFK:TG4CGFA:AFVK:v1:bldc",
  "deploymentArtifactKey": "CK:TT407:FNGK:AF:FNK:CDF-DPD:CATK:CGFA:AFGK:TG4CGFA:AFK:forFA:AFVK:v1",
  "appGroupDesc": "CGFA",
  "logType": "mongodb",
  "appDesc": "TG4CGFA",
  "isOld": true,
  "clientCode": "CT003",
  "loginDetails": {
    "firstName": "Peer",
    "lastName": "m",
    "username": "",
    "email": "peerm@torus.tech",
    "mobile": "8124805539",
    "loginId": "Peer@786",
    "dateAdded": "2024-10-11T04:37:31.922Z",
    "status": "active",
    "users": "Peer@786Peer m",
    "accessProfile": [
      "admin"
    ],
    "lastActive": "2025-10-11T05:24:04.889Z",
    "profile": "https://varnishdev.gsstvl.com/files/torus/9.1/CT003/resources/images/Peer@786/pexels-pixabay-33109.jpg",
    "quickLinks": [
      {
        "label": "Company Profile",
        "key": "PersonalcompanyProfile",
        "routes": "/control-center/company-profile"
      },
      {
        "label": "Build Application",
        "key": "build",
        "routes": "/"
      },
      {
        "label": "My Account",
        "key": "PersonalmyAccount",
        "routes": "/control-center/account-profile"
      },
      {
        "label": "Tenant",
        "key": "tenant",
        "routes": "/control-center/tenant"
      }
    ],
    "client": "CT003",
    "edit": "",
    "noOfProductsService": 0
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
    logger: !true,
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
    .addServer('https://tgadev.gsstvl.com/tt407/cgfa/tg4cgfa/v1/api-int','Production Server')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  fs.writeFileSync('./swagger.json', JSON.stringify(document, null, 2));
  SwaggerModule.setup('api', app, document);

  //helmet
  await app.register(helmet,{
  contentSecurityPolicy: false,
  global: true, 
  });

  // Start Fastify app
  await app.listen(process.env.APP_PORT,"0.0.0.0");
}
bootstrap();
