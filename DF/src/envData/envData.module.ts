import { Global, Module } from '@nestjs/common';
import { EnvData } from './envData.service';

@Global()
@Module({
  providers: [EnvData],
  exports: [EnvData],
})
export class EnvDataModule {}