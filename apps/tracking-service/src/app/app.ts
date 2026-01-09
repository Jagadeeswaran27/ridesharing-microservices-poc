import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import {
  morganMiddleware,
  requestIdMiddleware,
} from '@microservices-poc/logger';
import {
  errorHandler,
  notFoundHandler,
} from '@microservices-poc/error-handler';
import { trackingRouter } from './routes/tracking.route';

import { connectRedis } from '@microservices-poc/redis';
import { env } from '@microservices-poc/env-config';

export async function createApp() {
  const app = express();

  await connectRedis(env.REDIS_URL);

  app.use(cors());
  app.use(helmet());
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true, limit: '100kb' }));
  app.use(requestIdMiddleware);
  app.use(morganMiddleware);

  app.use('/', trackingRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  return app;
}
