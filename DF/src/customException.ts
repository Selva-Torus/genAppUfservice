import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(message: string | Record<string, any> | any[], statusCode: HttpStatus) {
    super(message, statusCode);
  }
}

/**
 * Normalizes a caught `error` into a valid HttpStatus for CustomException's
 * second argument. Across the ERD services, `catch (error) { ... throw new
 * CustomException(errorMessage, error) }` passes the raw caught Error/
 * exception object where an HttpStatus number belongs — HttpException
 * stores whatever it's given as `status`, so `exception.getStatus()` later
 * returns that object instead of a number, and Nest's exception filter
 * calling `response.status(status)` on it produces a broken response
 * instead of the intended error.
 *
 * - If the caught value is itself an HttpException (including a
 *   CustomException thrown deeper in the same call chain, e.g. by a
 *   helper this method calls), its real status (400/404/etc.) is kept
 *   instead of being collapsed — so re-wrapping a nested error here
 *   doesn't downgrade or lose its original meaning.
 * - Anything else (a plain Error, a driver/DB exception, ...) maps to the
 *   500 the surrounding catch blocks already imply by logging it as a
 *   'Fatal'/'Technical' error.
 */
export function toHttpStatus(error: unknown): HttpStatus {
  if (error instanceof HttpException) {
    const status = error.getStatus();
    if (typeof status === 'number' && status >= 100 && status < 600) {
      return status;
    }
  }
  return HttpStatus.INTERNAL_SERVER_ERROR;
}

// Specific custom exceptions
export class BadRequestException extends CustomException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class NotFoundException extends CustomException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class UnauthorizedException extends CustomException {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenException extends CustomException {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class ConflictException extends CustomException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}

export class NotAcceptableException extends CustomException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_ACCEPTABLE);
  }
}



// Add more specific exceptions as needed
