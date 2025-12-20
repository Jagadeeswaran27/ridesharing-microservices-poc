import { StatusCodes } from 'http-status-codes';

import { AppError } from './AppError.js';

export class AuthorizationError extends AppError {
  constructor(message = 'Access forbidden') {
    super(message, StatusCodes.FORBIDDEN, 'AUTHORIZATION_ERROR', true);
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}
