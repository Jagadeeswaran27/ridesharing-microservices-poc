import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { locationRouter } from './routes/location.route';
import { connectRedis } from './redis/client';

export async function createApp() {
  await connectRedis();
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());

  app.use('/', locationRouter);

  return app;
}
