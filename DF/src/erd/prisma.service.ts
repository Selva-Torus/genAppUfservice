
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor() {
    const url = new URL(process.env.DATABASE_URL);
    url.searchParams.set('application_name', 'ct005_gss_vgph_v1_df');
    // lazy: true — Prisma will NOT open a connection until the first query
    super({ datasources: { db: { url: url.toString() } } });
  }

  /**
   * Connects, runs the operation, then disconnects.
   * Use this in service methods that need an isolated connection lifecycle.
   */
  async withConnection<T>(operation: () => Promise<T>): Promise<T> {
    await this.$connect();
    try {
      return await operation();
    } finally {
      await this.$disconnect();
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}