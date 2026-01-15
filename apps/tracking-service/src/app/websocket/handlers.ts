import { WebSocket } from 'ws';

import { DriverLocationMessage } from './types';

import { getRedisClient } from '@microservices/redis';
import { env } from '@microservices/env-config';
import { ValidationError } from '@microservices/error-handler';
import { logger } from '@microservices/logger';
import {
  DriverLocationSchema,
  DriverLocationSchemaRedisGeo,
} from '../types/location';

export async function handleSocketMessage(ws: WebSocket, rawData: Buffer) {
  try {
    const message: DriverLocationMessage = JSON.parse(rawData.toString());

    if (message.type != 'driver:location:update') return;

    const { driverId, lat, lng } = message.payload;

    if (!driverId || typeof lat !== 'number' || typeof lng !== 'number') {
      throw new ValidationError('Invalid location payload');
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw new ValidationError('Invalid coordinate ranges');
    }

    try {
      const redis = getRedisClient(env.REDIS_URL);
      const LOCATION_TTL = 40;

      const driverLocationGeo = DriverLocationSchemaRedisGeo.parse({
        longitude: lng,
        latitude: lat,
        member: driverId,
      });

      await redis.geoAdd('drivers:locations', driverLocationGeo);

      const locationData = DriverLocationSchema.parse({
        driverId,
        lat,
        lng,
        heading: null,
        speed: null,
        timestamp: Date.now(),
        updatedAt: Date.now(),
      });

      await redis.set(
        `driver:location:${driverId}`,
        JSON.stringify(locationData),
        { EX: LOCATION_TTL }
      );

      logger.info(`Stored location for ${driverId}: ${lat}, ${lng}`);
    } catch (error) {
      logger.error(error);
      ws.send(
        JSON.stringify({ type: 'error', message: 'Failed to store location' })
      );
    }
  } catch (error) {
    logger.error(error);
    ws.send(
      JSON.stringify({ type: 'error', message: 'Invalid WebSocket message' })
    );
  }
}
