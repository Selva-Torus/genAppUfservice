/* {
  "aKey": "CK:TGA:FNGK:BLDC:FNK:DEV:CATK:CT003:AFGK:AG001:AFK:oprmatrix:AFVK:v1:bldc",
  "deploymentArtifactKey": "CK:CT003:FNGK:AF:FNK:CDF-DPD:CATK:AG001:AFGK:oprmatrix:AFK:oprmatrixtestdpd:AFVK:v1",
  "appGroupDesc": "appgroup",
  "logType": "dfs",
  "appDesc": "oprmatrix",
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
    "lastActive": "2025-12-09T06:47:02.731Z",
    "profile": "torus/9.1/CT003/resources/images/Peer@786/scott-graham-5fNmWej4tAA-unsplash.jpg",
    "quickLinks": [],
    "client": "CT003",
    "edit": "",
    "noOfProductsService": 0,
    "userUniqueId": "6828417e-5fe0-43bb-8c55-c465ee6581a0",
    "touring": {
      "isneedTouring": true,
      "touringData": {
        "/": {
          "stepIndex": 5,
          "isSkipped": false,
          "completed": true,
          "notVisited": []
        },
        "/logic-center": {
          "stepIndex": 3,
          "isSkipped": false,
          "completed": true,
          "notVisited": []
        },
        "Security": {
          "stepIndex": 1,
          "isSkipped": false,
          "completed": true,
          "notVisited": []
        },
        "artifactselector": {
          "stepIndex": 1,
          "isSkipped": false,
          "completed": true,
          "notVisited": []
        },
        "build": {
          "stepIndex": 0,
          "isSkipped": true,
          "completed": false,
          "notVisited": []
        },
        "/torus": {
          "stepIndex": 0,
          "isSkipped": true,
          "completed": false,
          "notVisited": []
        },
        "/control-center/company-profile": {
          "stepIndex": 0,
          "isSkipped": true,
          "completed": false,
          "notVisited": []
        },
        "/logs_hub": {
          "stepIndex": 1,
          "isSkipped": true,
          "completed": false,
          "notVisited": []
        },
        "/control-center/tenant": {
          "stepIndex": 0,
          "isSkipped": true,
          "completed": false,
          "notVisited": []
        },
        "logs": {
          "stepIndex": 1,
          "isSkipped": true,
          "completed": false,
          "notVisited": [
            0
          ]
        },
        "/control-center/account-profile": {
          "stepIndex": 0,
          "isSkipped": true,
          "completed": false,
          "notVisited": []
        },
        "/control-center/appearance": {
          "stepIndex": 0,
          "isSkipped": true,
          "completed": false,
          "notVisited": []
        },
        "/control-center/user-roles": {
          "stepIndex": 1,
          "isSkipped": false,
          "completed": true,
          "notVisited": []
        },
        "/control-center/storage-configuration": {
          "stepIndex": 0,
          "isSkipped": true,
          "completed": false,
          "notVisited": []
        },
        "/control-center/user-management": {
          "stepIndex": 2,
          "isSkipped": false,
          "completed": true,
          "notVisited": []
        },
        "/tenant-settings": {
          "stepIndex": 0,
          "isSkipped": true,
          "completed": false,
          "notVisited": []
        },
        "/control-center/notifications": {
          "stepIndex": 0,
          "isSkipped": true,
          "completed": false,
          "notVisited": []
        },
        "/control-center/resource-library": {
          "stepIndex": 1,
          "isSkipped": true,
          "completed": false,
          "notVisited": []
        },
        "notification": {
          "stepIndex": 0,
          "isSkipped": false,
          "completed": true,
          "notVisited": []
        },
        "detailNotification": {
          "stepIndex": 1,
          "isSkipped": false,
          "completed": true,
          "notVisited": []
        }
      }
    }
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
    .addServer('https://tgadev.gsstvl.com/ct003/ag001/oprmatrix/v1/api','Production Server')
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
