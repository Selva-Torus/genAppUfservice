import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

export interface OptimisticLockOptions {
  /** Primary key column(s) and their values. A plain object supports both single and composite primary keys, e.g. {id: 5} or {tenantId: 'x', code: 'y'}. */
  primaryKey: Record<string, any>;
  /** The version value the client last read (from the request payload), to be compared against the current DB value. */
  currentVersion: string | number | bigint;
  /** Columns to update. The version column is stripped automatically, since the DB trigger owns it. */
  data: Record<string, any>;
  /** Name of the version column. Defaults to 'trs_version'. */
  versionField?: string;
  /** Message returned to the client when the version check fails. */
  conflictMessage?: string;
}

type PrismaLike = Pick<PrismaClient, '$transaction'>;

/**
 * Generic optimistic-locking helper for Prisma models whose version column is
 * maintained by a DB trigger (never written to from the app).
 *
 * The version check and the update happen in one UPDATE statement
 * (WHERE primaryKey AND version = currentVersion) — there is no separate
 * SELECT before the UPDATE, so there is no TOCTOU race window. Prisma's
 * `update()` can't be used here because its `where` is restricted to unique
 * fields, and the version column isn't part of a unique index — hence
 * `updateMany()` + affected-row count, which is the pattern Prisma itself
 * documents for optimistic concurrency control.
 */
@Injectable()
export class OptimisticLockService {
  private static readonly DEFAULT_VERSION_FIELD = 'trs_version';
  private static readonly DEFAULT_CONFLICT_MESSAGE =
    'The record has been modified by another user. Please refresh and try again.';
}
