import { Router } from 'express';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { prisma } from '@microservices-poc/prisma';
import { logger } from '@microservices-poc/logger';
import {
  NotFoundError,
  ValidationError,
  asyncHandler,
  mapPrismaError,
} from '@microservices-poc/error-handler';
import { generateAccessToken } from '../utils/jwt';

export const authRouter = Router();

authRouter.post(
  '/signup',
  asyncHandler(async (req: Request, res: Response) => {
    const { email, name, password } = req.body;

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

      return res.status(201).json(user);
    } catch (error) {
      throw mapPrismaError(error);
    }
  })
);

authRouter.post(
  '/login',
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ValidationError('Email and password are required', {
          fields: {
            email: !email ? 'Email is required' : undefined,
            password: !password ? 'Password is required' : undefined,
          },
        });
      }

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      const passwordHash = user.passwordHash;

      const passwordMatch = bcrypt.compare(password, passwordHash);

      if (!passwordMatch) {
        throw new ValidationError('Invalid credentials');
      }

      const token = generateAccessToken(user);

      logger.info('User logged in successfully', user);

      return res
        .status(200)
        .json({ success: true, user, token, message: 'Login Successfull' });
    } catch (error) {
      throw mapPrismaError(error);
    }
  })
);
