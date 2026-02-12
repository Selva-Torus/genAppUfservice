import { Controller, Post, Body } from '@nestjs/common';

import { ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ImportClientService } from './import.service';


@Controller('')
export class ImportClientController {
  constructor(private readonly importClientService: ImportClientService) {}
  


   @Post('import_client')
    @ApiOperation({
      summary: 'Import client and tenant keys',
      description: 'Imports client and tenant keys from a backup file to Redis. All config is read from environment variables. Only fileName is required in payload.',
    })
    @ApiOkResponse({
      description: 'Successfully imported client and tenant keys',
    })
    @ApiNotFoundResponse({
      description: 'No tenant exists'
    })
    async importWithReplacement(@Body() body: { fileName: string; dpdKey: string }) {
      const { fileName, dpdKey } = body;

      if (!fileName) {
        return {
          success: false,
          message: 'fileName is required',
        };
      }

      // Read all config from environment variables
      const CK = process.env.TENANT;
     
      const CATK = process.env.APPGROUPCODE;
      const AFGK = process.env.APPCODE;
      const redisHost = process.env.HOST;
      const redisPort = process.env.PORT;
      const dbNumber = process.env.REDIS_DB ? parseInt(process.env.REDIS_DB, 10) : undefined;
      const LOGTYPE = process.env.LOGTYPE as 'mongo' | 'dfs';

      if (!CK) return { success: false, message: 'TENANT env variable is required' };
      
      if (!CATK) return { success: false, message: 'APPGROUPCODE env variable is required' };
      if (!AFGK) return { success: false, message: 'APPCODE env variable is required' };
      if (!redisHost) return { success: false, message: 'HOST env variable is required' };
      if (!redisPort) return { success: false, message: 'PORT env variable is required' };
      const result = await this.importClientService.importToRedisWithReplacement({
        fileName,
        dbNumber,
        CK,
        CATK,
        AFGK,
      }, dpdKey);

      
      return {
        success: true,
        message: `Import completed to ${redisHost}:${redisPort}. Keys transformed with CK=${CK}, CATK=${CATK}, AFGK=${AFGK}. LogType: ${LOGTYPE}`,
        imported: result.imported,
        failed: result.failed,
        totalKeys: result.totalKeys,
        transformedKeysCount: result.replacedKeys.length,
        transformedKeys: result.replacedKeys.slice(0, 10),
      };
    }
 

   
}
