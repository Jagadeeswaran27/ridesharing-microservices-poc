import { env } from '@microservices/env-config';
import { getRedisClient } from '@microservices/redis';
import { DriverLocation } from '../types/location';
import { logger } from '@microservices/logger';

export async function findNearbyDrivers(
  lat: number,
  lng: number,
  radius: number
) {
  const redis = getRedisClient(env.REDIS_URL);

  try {
    const nearbyDriverIds = await redis.geoSearch(
      'drivers:locations',
      { longitude: lng, latitude: lat },
      { radius, unit: 'km' }
    );

    const activeDrivers: DriverLocation[] = [];

    for (const driverId of nearbyDriverIds) {
      const locationData = await redis.get(`driver:location:${driverId}`);

      if (locationData) {
        const location: DriverLocation = JSON.parse(locationData);
        activeDrivers.push(location);
      } else {
        await redis.zRem('drivers:locations', driverId);
        logger.info(`Removed driver ${driverId} from active drivers`);
      }
    }

    return activeDrivers;
  } catch (error) {
    logger.error('Error finding nearby drivers:', error);
    throw error;
  }
}
