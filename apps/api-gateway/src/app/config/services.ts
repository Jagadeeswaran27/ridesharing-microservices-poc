import { env } from './env';

export const services = {
  authService: {
    baseUrl: env.AUTH_SERVICE_URL,
  },
  trackingService: {
    baseUrl: env.TRACKING_SERVICE_URL,
  },
};
