import { Request, Response } from 'express';

import { asyncHandler, ValidationError } from '@microservices/error-handler';
import { findNearbyDrivers } from '../services/location.service';

export const nearbyDrivers = asyncHandler(
  async (req: Request, res: Response) => {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const radius = Number(req.query.radius);

    if (Number.isNaN(lat) || Number.isNaN(lng) || Number.isNaN(radius)) {
      throw new ValidationError('Invalid parameter types', {
        lat: 'Latitude must be a number',
        lng: 'Longitude must be a number',
        radius: 'Radius must be a number',
      });
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw new ValidationError('Invalid coordinate ranges', {
        lat: 'Latitude must be between -90 and 90',
        lng: 'Longitude must be between -180 and 180',
      });
    }

    if (radius <= 0 || radius > 100) {
      throw new ValidationError('Invalid radius', {
        radius: 'Radius must be between 0 and 100',
      });
    }

    const drivers = await findNearbyDrivers(lat, lng, radius);
    res.json(drivers);
  }
);
