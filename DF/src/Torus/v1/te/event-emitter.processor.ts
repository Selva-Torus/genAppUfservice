// event-emitter.processor.ts
import { Injectable, Logger, OnModuleInit, Inject, forwardRef } from '@nestjs/common';
import { Worker, Job, WorkerOptions } from 'bullmq';
import { pfDto } from 'src/dto';
import { TeService } from './te.service';

@Injectable()
export class EventEmitterProcessor implements OnModuleInit {
  private readonly logger = new Logger(EventEmitterProcessor.name);
  private workers: Map<string, Worker> = new Map();

  constructor(@Inject(forwardRef(() => TeService)) private readonly teService: TeService) {}

  async onModuleInit() {
    // You can initialize a default worker here if needed
    // this.createWorker('event-emitter-queue');
  }

  createWorker(queueName: string): Worker {
    // Check if worker already exists
    if (this.workers.has(queueName)) {
      return this.workers.get(queueName);
    }

    const workerOptions: WorkerOptions = {
      connection: {
        host: process.env.HOST,
        port: parseInt(process.env.PORT),
        maxRetriesPerRequest: 3,
      },
      concurrency: 20, //50,
      lockDuration: 120000, //30000,      // Increased to 120 seconds (2 minutes) to handle longer jobs
      lockRenewTime: 30000, //10000,       // Renew lock every 30 seconds
      stalledInterval: 60000, //5000,     // Increased to 60 seconds
      maxStalledCount: 2,         // Allow 2 stalled attempts before failing
      limiter: {
        max: 100,      // Max 100 jobs
        duration: 1000 // per second
      }
    };
     

    const worker = new Worker(
      queueName,
      async (job: Job<pfDto>) => {
        this.logger.log(`Processing job ${job.id} from queue ${queueName} - Started`);
        this.logger.log(`Job data: ${JSON.stringify(job.data)}`);

        try {
          // const result = await this.teService.startInterval(job.data, process.env.CLIENTCODE, job.data.token);
            const result = await this.teService.EventEmitter(job.data);
          
         
          this.logger.log(`Job ${job.id} - Completed successfully`);
          return result;
        } catch (error) {
          this.logger.error(`Job ${job.id} - Failed with error: ${error}`);
          // return null;
          throw error;
        }
      },
      workerOptions
    );

    // Event listeners
    worker.on('active', (job: Job) => {
      this.logger.log(`Job ${job.id} ${job.name} is now active. Priority: ${job.opts.priority || 'default'}`);
    });

    worker.on('completed', (job: Job, result: any) => {
      this.logger.log(`Job ${job.id} completed successfully`);
    });

    worker.on('failed', (job: Job, error: Error) => {
      this.logger.error(`Job ${job.id} failed after ${job.attemptsMade} attempts`);
      this.logger.error(`Error: ${error.message}`);
    });

    this.workers.set(queueName, worker);
    this.logger.log(`Created new worker for queue: ${queueName}`);

    return worker;
  }

  getWorker(queueName: string): Worker {
    return this.createWorker(queueName);
  }
}