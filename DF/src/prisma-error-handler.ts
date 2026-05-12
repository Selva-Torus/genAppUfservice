import { Prisma } from '@prisma/client';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export interface parsePrismaCreateError {
  code: string;
  message: string;
  field?: string;
  meta?: Record<string, any>;
}

// ─────────────────────────────────────────────
// Main Parser
// ─────────────────────────────────────────────
export function parsePrismaCreateError(error: any): parsePrismaCreateError {

  // ── 1. PrismaClientKnownRequestError (P2xxx) ──
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return handleKnownRequestError(error);
  }

  // ── 2. PrismaClientValidationError ──
  if (error instanceof Prisma.PrismaClientValidationError) {
    return handleValidationError(error);
  }

  // ── 3. PrismaClientUnknownRequestError ──
  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return {
      code: 'UNKNOWN_REQUEST',
      message: 'An unknown database error occurred.',
    };
  }

  // ── 4. PrismaClientRustPanicError ──
  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return {
      code: 'RUST_PANIC',
      message: 'A critical database engine error occurred. Please try again.',
    };
  }

  // ── 5. PrismaClientInitializationError ──
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return {
      code: 'INIT_ERROR',
      message: 'Database connection could not be established.',
    };
  }

  // ── 6. Fallback ──
  return {
    code: 'UNKNOWN',
    message: error?.message || 'An unexpected error occurred.',
  };
}

// ─────────────────────────────────────────────
// Handler: Known Request Errors (P2xxx codes)
// ─────────────────────────────────────────────
function handleKnownRequestError(
  error: Prisma.PrismaClientKnownRequestError,
): parsePrismaCreateError {
  const { code, meta } = error;

  switch (code) {

    // ── Unique Constraint Violation ──
    case 'P2002': {
      const fields = (meta?.target as string[])?.join(', ') || 'unknown field';
      return {
        code,
        field: fields,
        message: `Duplicate value detected. \`${fields}\` must be unique.`,
        meta,
      };
    }

    // ── Foreign Key Constraint Violation ──
    case 'P2003': {
      const field = (meta?.field_name as string) || 'unknown field';
      return {
        code,
        field,
        message: `Foreign key constraint failed on field \`${field}\`. Referenced record does not exist.`,
        meta,
      };
    }

    // ── Record Not Found ──
    case 'P2001':
    case 'P2025': {
      const cause = (meta?.cause as string) || 'Record not found.';
      return {
        code,
        message: cause,
        meta,
      };
    }

    // ── Required Field Missing / Null Constraint Violation ──
    case 'P2011': {
      const field = (meta?.constraint as string) || 'unknown field';
      return {
        code,
        field,
        message: `Null constraint violation on \`${field}\`. This field is required.`,
        meta,
      };
    }

    // ── Value Too Long for Column ──
    case 'P2000': {
      const field = (meta?.column_name as string) || 'unknown field';
      return {
        code,
        field,
        message: `Value too long for column \`${field}\`.`,
        meta,
      };
    }

    // ── Invalid Field Value / Datatype Mismatch ──
    case 'P2005': {
      const field = (meta?.field_name as string) || 'unknown field';
      const value = (meta?.field_value as string) || 'unknown value';
      return {
        code,
        field,
        message: `Invalid value \`${value}\` for field \`${field}\`.`,
        meta,
      };
    }

    // ── Missing Required Field in Input ──
    case 'P2006': {
      const field = (meta?.field_name as string) || 'unknown field';
      return {
        code,
        field,
        message: `Provided value for \`${field}\` is not valid.`,
        meta,
      };
    }

    // ── Data Validation Error ──
    case 'P2007': {
      return {
        code,
        message: `Data validation error: ${meta?.message || 'Invalid data provided.'}`,
        meta,
      };
    }

    // ── Failed to Parse Query ──
    case 'P2008': {
      return {
        code,
        message: 'Failed to parse the query. Please check your input.',
        meta,
      };
    }

    // ── Failed to Validate Query ──
    case 'P2009': {
      return {
        code,
        message: 'Failed to validate the query. Please check your input fields.',
        meta,
      };
    }

    // ── Raw Query Failed ──
    case 'P2010': {
      return {
        code,
        message: `Raw query failed: ${meta?.message || 'Unknown reason.'}`,
        meta,
      };
    }

    // ── Relation Violation ──
    case 'P2014': {
      const relation = (meta?.relation_name as string) || 'unknown relation';
      return {
        code,
        message: `Relation \`${relation}\` violated. The change would break a required relation.`,
        meta,
      };
    }

    // ── Related Record Not Found ──
    case 'P2015': {
      return {
        code,
        message: 'A related record could not be found.',
        meta,
      };
    }

    // ── Result Count Mismatch ──
    case 'P2017': {
      const relation = (meta?.relation_name as string) || 'unknown';
      return {
        code,
        message: `Records for relation \`${relation}\` are not connected.`,
        meta,
      };
    }

    // ── Missing Required Connected Records ──
    case 'P2018': {
      return {
        code,
        message: 'Required connected records were not found.',
        meta,
      };
    }

    // ── Input Error ──
    case 'P2019': {
      return {
        code,
        message: `Input error: ${meta?.message || 'Invalid input provided.'}`,
        meta,
      };
    }

    // ── Value Out of Range ──
    case 'P2020': {
      const field = (meta?.field_name as string) || 'unknown field';
      return {
        code,
        field,
        message: `Value out of range for field \`${field}\`.`,
        meta,
      };
    }

    // ── Table Does Not Exist ──
    case 'P2021': {
      const table = (meta?.table as string) || 'unknown table';
      return {
        code,
        message: `Table \`${table}\` does not exist in the database.`,
        meta,
      };
    }

    // ── Column Does Not Exist ──
    case 'P2022': {
      const column = (meta?.column as string) || 'unknown column';
      return {
        code,
        message: `Column \`${column}\` does not exist in the database.`,
        meta,
      };
    }

    // ── Inconsistent Column Data ──
    case 'P2023': {
      return {
        code,
        message: `Inconsistent column data: ${meta?.message || 'Please check your input.'}`,
        meta,
      };
    }

    // ── Timeout ──
    case 'P2024': {
      return {
        code,
        message: 'Database operation timed out. Please try again.',
        meta,
      };
    }

    // ── Default fallback for unmapped P2xxx codes ──
    default: {
      return {
        code,
        message: `Database error [${code}]: ${error.message}`,
        meta,
      };
    }
  }
}

// ─────────────────────────────────────────────
// Handler: Validation Errors (wrong types, missing required)
// ─────────────────────────────────────────────
function handleValidationError(
  error: Prisma.PrismaClientValidationError,
): parsePrismaCreateError {
  const raw = error.message || '';

  // Missing required field
  const missingFieldMatch = raw.match(/Argument `(.+?)` is missing/);
  if (missingFieldMatch) {
    return {
      code: 'VALIDATION_ERROR',
      field: missingFieldMatch[1],
      message: `Field \`${missingFieldMatch[1]}\` is required but missing.`,
    };
  }

  // Invalid value / datatype mismatch
  const invalidValueMatch = raw.match(/Invalid value for argument `(.+?)`/);
  if (invalidValueMatch) {
    return {
      code: 'VALIDATION_ERROR',
      field: invalidValueMatch[1],
      message: `Invalid datatype for argument \`${invalidValueMatch[1]}\`.`,
    };
  }

  // Enum mismatch
  const enumMatch = raw.match(
    /Argument `(.+?)` must be one of the following values: (.+?)(?:\.|$)/,
  );
  if (enumMatch) {
    return {
      code: 'VALIDATION_ERROR',
      field: enumMatch[1],
      message: `Invalid enum value for \`${enumMatch[1]}\`. Allowed: ${enumMatch[2]}.`,
    };
  }

  // Unknown field sent in payload
  const unknownFieldMatch = raw.match(/Unknown argument `(.+?)`/);
  if (unknownFieldMatch) {
    return {
      code: 'VALIDATION_ERROR',
      field: unknownFieldMatch[1],
      message: `Unknown field \`${unknownFieldMatch[1]}\` sent in request.`,
    };
  }

  return {
    code: 'VALIDATION_ERROR',
    message: 'Validation failed. Please check your input fields.',
  };
}