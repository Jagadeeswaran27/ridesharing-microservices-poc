import { StatusCodes } from 'http-status-codes';

import { AppError } from './AppError.js';

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed', { code }: { code?: string }) {
    super(
      message,
      StatusCodes.UNAUTHORIZED,
      code ?? 'AUTHENTICATION_ERROR',
      true
    );
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}
