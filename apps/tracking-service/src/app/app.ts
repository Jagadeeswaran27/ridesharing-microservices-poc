import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { morganMiddleware, requestIdMiddleware } from '@microservices/logger';
import { errorHandler, notFoundHandler } from '@microservices/error-handler';
import { trackingRouter } from './routes/tracking.route';

import { connectRedis } from '@microservices/redis';
import { env } from '@microservices/env-config';

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
