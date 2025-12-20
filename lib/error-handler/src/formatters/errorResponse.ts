import { Request } from 'express';

import { AppError } from '../errors/AppError.js';

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
    requestId?: string;
    timestamp: string;
    path?: string;
    stack?: string;
  };
}

export function formatErrorResponse(
  error: Error | AppError,
  req: Request,
  includeStack = false
): ErrorResponse {
  const isAppError = error instanceof AppError;

  const response: ErrorResponse = {
    success: false,
    error: {
      code: isAppError ? error.code : 'INTERNAL_ERROR',
      message: error.message || 'An unexpected error occurred',
      requestId: (req as any).id,
      timestamp: new Date().toISOString(),
      path: req.path,
    },
  };

  if (isAppError && error.details) {
    response.error.details = error.details;
  }

  if (includeStack && error.stack) {
    response.error.stack = error.stack;
  }

  return response;
}
