import { Request, Response, Router } from 'express';
import { redisClient } from '../redis/client';

export const locationRouter = Router();

locationRouter.post('/', async (req: Request, res: Response) => {
  console.log('Inside post request!');
  const { userId, lat, lng } = req.body;

  if (!userId || lat == null || lng == null) {
    return res.status(400).json({ message: 'Invalid payload' });
  }

  const key = `location:${userId}`;

  await redisClient.hSet(key, {
    lat: String(lat),
    lng: String(lng),
  });

  await redisClient.expire(key, 30);

  return res.status(200).json({ message: 'Location saved' });
});

locationRouter.get('/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;
  const key = `location:${userId}`;

  const data = await redisClient.hGetAll(key);

  if (!data || Object.keys(data).length === 0) {
    return res.status(404).json({ message: 'Location not found' });
  }

  return res.status(200).json({
    userId,
    lat: Number(data.lat),
    lng: Number(data.lng),
  });
});
