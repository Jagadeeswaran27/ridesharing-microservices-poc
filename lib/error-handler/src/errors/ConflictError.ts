import { StatusCodes } from 'http-status-codes';

import { AppError } from './AppError.js';

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, StatusCodes.CONFLICT, 'CONFLICT_ERROR', true);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}
