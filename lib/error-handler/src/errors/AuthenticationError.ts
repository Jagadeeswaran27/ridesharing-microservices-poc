import { StatusCodes } from 'http-status-codes';

import { AppError } from './AppError.js';

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, StatusCodes.UNAUTHORIZED, 'AUTHENTICATION_ERROR', true);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}
