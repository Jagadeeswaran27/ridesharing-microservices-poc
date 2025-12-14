import { Router, Request, Response } from 'express';

export const userRouter = Router();

userRouter.get('/me', (_req: Request, res: Response) => {
  res.status(200).json({
    id: 'user_123',
    name: 'John Doe',
    email: 'john@example.com',
  });
});

userRouter.post('/login', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Logged in successfully',
  });
});
