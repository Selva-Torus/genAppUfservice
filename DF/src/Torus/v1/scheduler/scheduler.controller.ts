import { BadRequestException, Body, Controller, Headers, Post } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { start_all_scheduler, start_specific_scheduler, stop_all_scheduler, stop_specific_scheduler } from './scheduler.dto';


@Controller('scheduler')
@ApiTags('Scheduler API')
export class SchedulerController {
    constructor(private readonly schedulerService: SchedulerService) {}

    @ApiOperation({
        summary: 'Start All Scheduler',
        description: 'Start All Scheduler',
    })
    @ApiBody({ type: start_all_scheduler })
    @ApiCreatedResponse({   
        content: {
        'application/json': {
            schema: {
            type: 'object',
            },
        },
        },
    })
    @Post('startAllScheduler')
    async startAllScheduler(@Body() input:any, @Headers('Authorization') auth: any) {
        
       let token = auth?.split(' ')[1];
       return await this.schedulerService.startScheduler(input,token);
    }

    @ApiOperation({
        summary: 'Start Specific Scheduler',
        description: 'Start Specific Scheduler',
    })
    @ApiBody({ type: start_specific_scheduler })
    @ApiCreatedResponse({       
        content: {
        'application/json': {
            schema: {
            type: 'object',
            },
        },
        },
    })
    @Post('startSpecificScheduler')
    async startSpecificScheduler(@Body() input:any,@Headers('Authorization') auth: any) {       
       if(!(input?.id)) throw new BadRequestException('Please provide id')
        let token = auth?.split(' ')[1];
       return await this.schedulerService.startScheduler(input,token);
    }

    @ApiOperation({
        summary: 'Stop All Scheduler',
        description: 'Stop All Scheduler',
    })
    @ApiBody({ type: stop_all_scheduler })
    @ApiCreatedResponse({       
        content: {
        'application/json': {
            schema: {
            type: 'object',
            },
        },
        },
    })
    @Post('stopAllScheduler')
    async stopAllScheduler(@Body() input:any) {  
       return await this.schedulerService.stopBullJob(input);
    }

    @ApiOperation({
        summary: 'Stop Specific Scheduler',
        description: 'Stop Specific Scheduler',
    })
    @ApiBody({ type: stop_specific_scheduler })
    @ApiCreatedResponse({       
        content: {
        'application/json': {
            schema: {
            type: 'object',
            },
        },
        },
    })
    @Post('stopSpecificScheduler')
    async stopSpecificScheduler(@Body() input:any) { 
    //    if(!(input?.id)) throw new BadRequestException('Please provide id')      
       return await this.schedulerService.stopBullJob(input);
    }
}
