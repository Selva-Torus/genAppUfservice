import { Logger } from '@nestjs/common';
import type PQueue from 'p-queue';

const logger = new Logger('MongoQueue');

let mongoQueue: PQueue;
let queueInitialized = false;

// Dynamically import p-queue (ESM module)
async function initializeQueue() {
  if (!queueInitialized) {
    const PQueueModule = await import('p-queue');
    const PQueue = PQueueModule.default;

    mongoQueue = new PQueue({
      concurrency: 20,  // Reduced from 40 - too high concurrency slows down MongoDB
      timeout: 60000,   // Increased to 60s - was timing out at 30s
      throwOnTimeout: true,
      autoStart: true
    });   

    queueInitialized = true;
    logger.log('MongoDB Queue initialized successfully');
  }
  return mongoQueue;
}

/**
 * Wraps a MongoDB operation in the queue
 * @param operation The MongoDB operation to execute
 * @param operationName Name for logging purposes
 * @returns Promise with operation result
 */
export async function queueMongoOperation<T>(
  operation: () => Promise<T>,
  operationName: string = 'Unknown'
): Promise<T> {
  const queue = await initializeQueue(); 
  const result = await queue.add(async () => {   
    try {
      const result = await operation();
      return result;
    } catch (error) {     
      logger.error(`[FAIL] ${operationName} - ${error.message}`);
      throw error;
    }
  }, {
    priority: 0  // Can be adjusted based on operation importance
  });

  // Type assertion: p-queue can return void, but our operations always return T
  return result as T;
}
