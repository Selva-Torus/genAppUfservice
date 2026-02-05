
/* {
  "aKey": "CK:TGA:FNGK:BLDC:FNK:DEV:CATK:CT005:AFGK:V001:AFK:VGPH001:AFVK:v1:bldc",
  "deploymentArtifactKey": "CK:CT005:FNGK:AF:FNK:CDF-DPD:CATK:V001:AFGK:VGPH001:AFK:VGPH_DPD:AFVK:v1",
  "appGroupDesc": "VGPH",
  "logType": "mongodb",
  "appDesc": "VGPH",
  "isOld": true,
  "clientCode": "CT005",
  "loginDetails": {
    "loginId": "guru",
    "firstName": "Guru",
    "lastName": "Krishnan",
    "email": "cgkrishnan@gsstvl.com",
    "mobile": "8190002700",
    "2FAFlag": "N",
    "scope": "client_admin",
    "status": "active",
    "accessProfile": [
      "admin"
    ],
    "accessExpires": "",
    "dateAdded": "2026-01-21T06:18:59.283Z",
    "isRestricted": false,
    "userUniqueId": "60c8940f-8aa1-485d-9b53-dc20e43cc584",
    "touring": {
      "isneedTouring": false,
      "touringData": {
        "/control-center/storage-configuration": {
          "stepIndex": 0,
          "isSkipped": true,
          "completed": false,
          "notVisited": []
        },
        "/home": {
          "stepIndex": 0,
          "isSkipped": true,
          "completed": false,
          "notVisited": []
        },
        "artifactselector": {
          "stepIndex": 0,
          "isSkipped": true,
          "completed": false,
          "notVisited": []
        }
      }
    },
    "lastActive": "2026-02-05T05:42:31.874Z",
    "client": "CT005",
    "users": "guruGuru Krishnan",
    "profile": "",
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
import { BigIntInterceptor } from './bigint.interceptor';


async function bootstrap() {
    const fastifyAdapter = new FastifyAdapter({
    bodyLimit: 500 * 1024 * 1024, // 500MB limit
    logger: true,
  });
  
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );
    // Global interceptor for BigInt serialization
  app.useGlobalInterceptors(new BigIntInterceptor());
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
    .addServer('https://tgadev.toruslowcode.com/ct005/v001/vgph001/v1/api','Production Server')
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
