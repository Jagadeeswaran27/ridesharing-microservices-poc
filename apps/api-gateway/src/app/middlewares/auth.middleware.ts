import { Request, Response, NextFunction } from 'express';

import { AuthenticationError } from '@microservices-poc/error-handler';
import { verifyToken } from '../utils/verify-jwt-token';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new AuthenticationError('Token is required', {
        code: 'TOKEN_REQUIRED',
      });
    }

    const decoded = verifyToken(token);
    req.user = decoded;

    next();
  } catch (error) {
    throw error;
  }
};
