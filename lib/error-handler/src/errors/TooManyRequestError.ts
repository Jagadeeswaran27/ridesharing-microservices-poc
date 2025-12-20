import { StatusCodes } from 'http-status-codes';

import { AppError } from './AppError.js';

export class TooManyRequestsError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, StatusCodes.TOO_MANY_REQUESTS, 'RATE_LIMIT_EXCEEDED', true);
    Object.setPrototypeOf(this, TooManyRequestsError.prototype);
  }
}
