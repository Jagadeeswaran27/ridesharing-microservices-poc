import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error!',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}
