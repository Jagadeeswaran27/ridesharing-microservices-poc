import { z } from 'zod';

export const DriverLocationSchemaRedisGeo = z.object({
  longitude: z.number(),
  latitude: z.number(),
  member: z.string(),
});

export const DriverLocationSchema = z.object({
  driverId: z.string(),
  lat: z.number(),
  lng: z.number(),
  heading: z.number().nullable().optional(),
  speed: z.number().nullable().optional(),
  timestamp: z.number().optional(),
  updatedAt: z.number().optional(),
});

export type DriverLocation = z.infer<typeof DriverLocationSchema>;
export type DriverLocationRedisGeo = z.infer<
  typeof DriverLocationSchemaRedisGeo
>;
