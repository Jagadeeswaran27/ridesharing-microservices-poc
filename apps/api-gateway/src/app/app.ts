import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

import { rateLimiter } from './middlewares/rateLimit.middleware';
import { healthRouter } from './routes/health.route';
import { errorHandler } from './middlewares/error.middleware';
import { authServiceProxy } from './routes/auth.proxy';
import { env } from './config/env';
import {
  morganMiddleware,
  requestIdMiddleware,
} from '@microservices-poc/logger';
// import { authMiddleware } from './middlewares/auth.middleware';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(helmet());
  app.use(compression());
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true, limit: '100kb' }));
  app.use(rateLimiter);
  app.use(requestIdMiddleware);
  app.use(morganMiddleware);
  // app.use(authMiddleware);

  app.get('/', (req, res) => {
    console.log(env.PORT);
    res.json({
      success: true,
      message: 'Welcome to the API Gateway',
    });
  });

  app.use('/health', healthRouter);
  app.use('/api/v1/auth', authServiceProxy);

  app.use((_req, _res, next) => {
    next(new Error('Route not found'));
  });

  app.use(errorHandler);

  return app;
}
