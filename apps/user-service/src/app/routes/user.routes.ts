import { Router, Request, Response } from 'express';
import { producer } from '@microservices-poc/kafka';

export const userRouter = Router();

userRouter.get('/me', (_req: Request, res: Response) => {
  res.status(200).json({
    id: 'user_123',
    name: 'John Doe',
    email: 'john@example.com',
  });
});

userRouter.post('/login', async (_req: Request, res: Response) => {
  await producer.send({
    topic: 'user-events',
    messages: [
      {
        key: 'USER_LOGGED_IN',
        value: JSON.stringify({
          userId: 'user_123',
          timestamp: Date.now(),
        }),
      },
    ],
  });
  res.status(200).json({
    message: 'Logged in successfully',
  });
});
