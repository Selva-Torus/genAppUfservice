import { Module } from '@nestjs/common';
import { RedisService } from 'src/redisService';
import { ImportClientController } from './import.controller';
import { ImportClientService } from './import.service';

@Module({
  controllers: [ImportClientController],
  providers: [RedisService, ImportClientService],
  exports: [ImportClientService],
})
export class ImportClientModule {}
