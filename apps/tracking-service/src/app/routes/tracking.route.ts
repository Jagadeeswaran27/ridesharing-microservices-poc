import { Router } from 'express';
import { nearbyDrivers } from '../controllers/location.controller';

export const trackingRouter = Router();

trackingRouter.get('/', (req, res) => {
  res.json({ message: 'Tracking Service is operational' });
});

trackingRouter.get('/nearby-drivers', nearbyDrivers);
