
/* {
  "aKey": "CK:TGA:FNGK:BLDC:FNK:DEV:CATK:CT005:AFGK:GSS:AFK:RTGS:AFVK:v1:bldc",
  "deploymentArtifactKey": "CK:CT005:FNGK:AF:FNK:CDF-DPD:CATK:GSS:AFGK:RTGS:AFK:RTGS_DPD:AFVK:v1",
  "appGroupDesc": "GSS",
  "logType": "dfs",
  "appDesc": "RTGS",
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
    "lastActive": "2026-05-28T12:26:05.715Z",
    "client": "CT005",
    "users": "guruGuru Krishnan",
    "profile": "",
    "edit": "",
    "noOfProductsService": 0
  },
  "setupData": {
    "appInfo": {
      "name": "RTGS",
      "code": "RTGS",
      "encryption": {
        "type": ""
      },
      "applicationUniqueId": "ae093d5d-f44a-444b-afab-9476f31e7dca",
      "deploymentArtifactKey": "CK:CT005:FNGK:AF:FNK:CDF-DPD:CATK:GSS:AFGK:RTGS:AFK:RTGS_DPD:AFVK:v1",
      "appGrpName": "GSS",
      "appGrpCode": "GSS",
      "fusionAuthAppClientSecret": "AKE3Mkrdhezw9vln9mTV-Wnb8WVEivZ3BY0KTxqtmbc"
    },
    "tenantAppearancekey": "CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:CT005:AFK:PROFILE:AFVK:v1:appearance",
    "selectedPresetKey": "default",
    "appBackgroundImage": "torus/9.1/CT005/resources/images/vivid-blurred-colorful-wallpaper-background_58702-3883.avif",
    "direction": "LTR",
    "brandColor": "#0737c9",
    "selectionColor": "#579eff",
    "hoverColor": "#d5eeff",
    "borderRadius": "xl",
    "sidebarStyle": "",
    "navigationStyles": "horizontal",
    "theme": "light",
    "layoutMode": "detached",
    "mobileAppearance": {
      "language": "English",
      "direction": "LTR",
      "theme": "light",
      "brandColors": {
        "primary": "#0025dd",
        "secondary": "#000e51",
        "tertiary": "#000000"
      },
      "accentColors": {
        "accentOne": "#f4f5ff",
        "accentTwo": "#ffffff"
      },
      "utilityColors": {
        "lightMode": {
          "primaryText": "#14181b",
          "secondaryText": "#57636c",
          "primaryBackground": "#f1f4f8",
          "secondaryBackground": "#ffffff"
        },
        "darkMode": {
          "primaryText": "#ffffff",
          "secondaryText": "#95a1ac",
          "primaryBackground": "#1d2428",
          "secondaryBackground": "#14181b"
        }
      },
      "fontSize": {
        "displayLarge": "64",
        "displayMedium": "44",
        "displaySmall": "36",
        "headlineLarge": "32",
        "headlineMedium": "28",
        "headlineSmall": "24",
        "titleLarge": "20",
        "titleMedium": "18",
        "titleSmall": "16",
        "labelLarge": "16",
        "labelMedium": "14",
        "labelSmall": "12",
        "bodyLarge": "16",
        "bodyMedium": "14",
        "bodySmall": "12"
      },
      "fontFamily": "Roboto",
      "navigationStyle": "Bottom Navigation",
      "drawerStyle": ""
    },
    "language": "English",
    "fontFamily": [
      {
        "label": "Inter",
        "fontUrl": "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
      }
    ],
    "text-body-font": "",
    "text-header-font": "",
    "text-display-font": "",
    "name": "default",
    "fontSize": "Small"
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
    const redisResult = await redis.call('JSON.GET', "CK:CT005:FNGK:AF:FNK:CDF-DPD:CATK:GSS:AFGK:RTGS:AFK:RTGS_DPD:AFVK:v1:NDP");
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
    .addServer('https://tgadev2.toruslowcode.com/ct005/gss/rtgs/v1/api','Production Server')
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
