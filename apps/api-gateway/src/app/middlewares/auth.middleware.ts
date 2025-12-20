import { Request, Response, NextFunction } from 'express';

import { ValidationError } from '@microservices-poc/error-handler';
import { verifyToken } from '../utils/verifyToken';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new ValidationError('Authorization header is required');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new ValidationError('Token is required');
    }

    const decoded = verifyToken(token);
    req.user = decoded;

    next();
  } catch (error) {
    throw error;
  }
};
