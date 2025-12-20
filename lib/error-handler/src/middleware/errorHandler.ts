import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AppError } from '../errors/AppError.js';
import { formatErrorResponse } from '../formatters/errorResponse.js';

export function errorHandler(
  error: Error | AppError,
  req: Request,
  res: Response
): void {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isAppError = error instanceof AppError;

  const statusCode = isAppError
    ? error.statusCode
    : StatusCodes.INTERNAL_SERVER_ERROR;

  if (typeof (req as any).logger?.error === 'function') {
    (req as any).logger.error('Error occurred:', {
      error: error.message,
      stack: error.stack,
      requestId: (req as any).id,
      path: req.path,
      method: req.method,
      statusCode,
    });
  } else {
    console.error('Error occurred:', {
      error: error.message,
      stack: error.stack,
      requestId: (req as any).id,
      path: req.path,
      method: req.method,
      statusCode,
    });
  }

  const errorResponse = formatErrorResponse(error, req, isDevelopment);

  res.status(statusCode).json(errorResponse);
}
