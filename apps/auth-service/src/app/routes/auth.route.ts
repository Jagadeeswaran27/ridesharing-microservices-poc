import { Router } from 'express';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { prisma } from '@microservices-poc/prisma';
import { logger } from '@microservices-poc/logger';
import {
  ValidationError,
  asyncHandler,
  mapPrismaError,
} from '@microservices-poc/error-handler';

export const authRouter = Router();

authRouter.post(
  '/signup',
  asyncHandler(async (request: Request, response: Response) => {
    const { email, name, password } = request.body;

    if (!email || !name || !password) {
      logger.error('Invalid Payload');
      throw new ValidationError('Email, name, and password are required', {
        fields: {
          email: !email ? 'Email is required' : undefined,
          name: !name ? 'Name is required' : undefined,
          password: !password ? 'Password is required' : undefined,
        },
      });
    }

    if (password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters long');
    }

    try {
      const passwordHash = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          name,
          passwordHash,
          role: 'RIDER',
        },
      });

      logger.info('User created successfully', user);

      return response.status(201).json(user);
    } catch (error) {
      throw mapPrismaError(error);
    }
  })
);
