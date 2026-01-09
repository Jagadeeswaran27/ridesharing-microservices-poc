import { Router } from 'express';

export const trackingRouter = Router();

trackingRouter.get('/', (req, res) => {
  res.json({ message: 'Tracking Service is operational' });
});
