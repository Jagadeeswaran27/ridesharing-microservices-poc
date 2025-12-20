import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { authRouter } from './routes/auth.route';
import {
  morganMiddleware,
  requestIdMiddleware,
} from '@microservices-poc/logger';
import {
  errorHandler,
  notFoundHandler,
} from '@microservices-poc/error-handler';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true, limit: '100kb' }));
  app.use(requestIdMiddleware);
  app.use(morganMiddleware);

  app.use('/', authRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  return app;
}
