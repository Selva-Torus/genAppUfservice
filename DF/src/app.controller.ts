import { Controller, Get, Body,Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CommonService } from 'src/common.Service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private readonly apiService:CommonService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  
}
