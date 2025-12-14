import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

import { rateLimiter } from './middlewares/rateLimit.middleware';
import { healthRouter } from './routes/health.route';
import { errorHandler } from './middlewares/error.middleware';
import { userServiceProxy } from './routes/user.proxy';
import { env } from './config/env';
import { locationServiceProxy } from './routes/location.proxy';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(helmet());
  app.use(compression());
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true, limit: '100kb' }));
  app.use(rateLimiter);
  app.use(morgan('combined'));

  app.get('/', (req, res) => {
    console.log(env.PORT);
    res.json({
      success: true,
      message: 'Welcome to the API Gateway',
    });
  });

  app.use('/health', healthRouter);
  app.use('/users', userServiceProxy);
  app.use('/location', locationServiceProxy);

  app.use((_req, _res, next) => {
    next(new Error('Route not found'));
  });

  app.use(errorHandler);

  return app;
}
