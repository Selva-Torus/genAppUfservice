
/* {
  "aKey": "CK:TGA:FNGK:BLDC:FNK:DEV:CATK:CT010:AFGK:I001:AFK:ITAX:AFVK:v1:bldc",
  "deploymentArtifactKey": "CK:CT010:FNGK:AF:FNK:CDF-DPD:CATK:I001:AFGK:ITAX:AFK:ITAX_DPD:AFVK:v1",
  "appGroupDesc": "ITAX",
  "logType": "mongodb",
  "appDesc": "ITAX",
  "appLogo": "torus/9.1/CT010/resources/images/DTB_Resize_logo.png",
  "isOld": true,
  "clientCode": "CT010",
  "loginDetails": {
    "loginId": "Haritha",
    "firstName": "Haritha",
    "lastName": "R",
    "email": "haritha@torus.tech",
    "mobile": "2356895623",
    "2FAFlag": "N",
    "scope": "client_admin",
    "status": "active",
    "accessProfile": [
      "admin"
    ],
    "accessExpires": "",
    "dateAdded": "2026-03-05T07:42:47.028Z",
    "isRestricted": false,
    "userUniqueId": "87cc96dc-ad16-4152-be5e-5c8f528d8ff0",
    "touring": {
      "isneedTouring": false,
      "touringData": {
        "/torus": {
          "stepIndex": 0,
          "isSkipped": true,
          "completed": false,
          "notVisited": []
        }
      }
    },
    "lastActive": "2026-03-31T04:32:10.338Z",
    "client": "CT010"
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
import { EnvData } from './envData/envData.service';
//import { envData as mongoClientEnvData } from './mongoClient';
import { decrypt } from './decrypt';
import { Logger } from '@nestjs/common';
const Redis = require('ioredis');

async function bootstrap() {
  const logger = new Logger('Redis');
  const redis = new Redis({
    host: process.env.HOST,
    port: parseInt(process.env.PORT),
  }).on('error', (err:any) => {
    console.log('Redis Client Error', err);
    throw err;
  });

  let configData = null;
  try {
    const redisResult = await redis.call('JSON.GET', "CK:CT010:FNGK:AF:FNK:CDF-DPD:CATK:I001:AFGK:ITAX:AFK:ITAX_DPD:AFVK:v1:NDP");
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
    bodyLimit: 500 * 1024 * 1024, // 500MB limit
    logger: true,
  });
  if (configData) {
    EnvData.preloadConfig(configData);
    logger.log('✅ Config preloaded into EnvData before bootstrap');
  }
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );

  const envData = app.get(EnvData);

  if (!configData) {
    console.error('❌EndDetails Not Initialized');
    throw new Error('DPD config data is required for application startup');
  }

  envData.setConfig(configData);
  console.log('✅ Config loaded into EndDetails');

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
    .addTag('Scheduler API')
    .addBearerAuth(
    { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 
    'JWT-auth',
    )
    .addServer('https://tgadev.toruslowcode.com/ct010/i001/itax/v1/api','Production Server')
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
