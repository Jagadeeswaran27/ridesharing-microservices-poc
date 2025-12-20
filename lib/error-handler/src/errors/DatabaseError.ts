import { StatusCodes } from 'http-status-codes';

import { AppError } from './AppError.js';

export class DatabaseError extends AppError {
  constructor(message = 'Database operation failed', details?: unknown) {
    super(
      message,
      StatusCodes.INTERNAL_SERVER_ERROR,
      'DATABASE_ERROR',
      true,
      details
    );
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}
