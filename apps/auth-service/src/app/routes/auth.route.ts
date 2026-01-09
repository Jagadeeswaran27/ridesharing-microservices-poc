import { Router } from 'express';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { logger } from '@microservices-poc/logger';
import {
  AuthenticationError,
  ValidationError,
  asyncHandler,
  mapPrismaError,
} from '@microservices-poc/error-handler';
import { getAuthDbClient } from '@microservices-poc/auth-db';
import { env } from '@microservices-poc/env-config';

import { generateAccessToken } from '../utils/generate-jwt-token';
import { generateRefreshToken } from '../utils/refresh-token';
import { hashRefreshToken } from '../utils/hash-token';

const prisma = getAuthDbClient(env.AUTH_DATABASE_URL);

export const authRouter = Router();

authRouter.post(
  '/signup',
  asyncHandler(async (request: Request, response: Response) => {
    const { email, name, password } = request.body;

    if (!email || !name || !password) {
      logger.error('Invalid Payload');
      throw new ValidationError('Email, name, and password are required', {
        fields: {
          email: 'Email is required',
          name: 'Name is required',
          password: 'Password is required',
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
        throw new ValidationError('User not found', {
          fields: {
            email: 'User not found',
          },
        });
      }

      const passwordHash = user.passwordHash;

      const isPasswordValid = await bcrypt.compare(password, passwordHash);

      if (!isPasswordValid) {
        throw new ValidationError('Invalid password', {
          fields: {
            password: 'Invalid password',
          },
        });
      }

      const token = generateAccessToken(user);

      const refreshToken = generateRefreshToken();

      const hashedRefreshToken = hashRefreshToken(refreshToken);

      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          tokenHash: hashedRefreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return res.status(200).json({
        success: true,
        accessToken: token,
        refreshToken,
        message: 'User logged in successfully',
      });
    } catch (error) {
      throw mapPrismaError(error);
    }
  })
);

authRouter.post(
  '/refresh-token',
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new ValidationError('Refresh token is required', {
          fields: {
            refreshToken: 'Refresh token is required',
          },
        });
      }

      const hashedRefreshToken = hashRefreshToken(refreshToken);

      const storedRefreshToken = await prisma.refreshToken.findUnique({
        where: {
          tokenHash: hashedRefreshToken,
          expiresAt: {
            gt: new Date(),
          },
        },
        include: {
          user: true,
        },
      });

      if (!storedRefreshToken || !storedRefreshToken.user) {
        throw new AuthenticationError('Invalid refresh token', {
          code: 'REFRESH_TOKEN_INVALID',
        });
      }

      const newRefreshToken = generateRefreshToken();

      const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

      await prisma.$transaction([
        prisma.refreshToken.delete({
          where: {
            id: storedRefreshToken.id,
          },
        }),
        prisma.refreshToken.create({
          data: {
            userId: storedRefreshToken.user.id,
            tokenHash: newRefreshTokenHash,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        }),
      ]);

      const newAccessToken = generateAccessToken(storedRefreshToken.user);

      return res.status(200).json({
        success: true,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        message: 'Refresh token generated successfully',
      });
    } catch (error) {
      throw mapPrismaError(error);
    }
  })
);

authRouter.post(
  '/logout',
  asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new ValidationError('Refresh token is required', {
        fields: {
          refreshToken: 'Refresh token is required',
        },
      });
    }

    const hashedRefreshToken = hashRefreshToken(refreshToken);

    await prisma.refreshToken.deleteMany({
      where: {
        tokenHash: hashedRefreshToken,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'User logged out successfully',
    });
  })
);
