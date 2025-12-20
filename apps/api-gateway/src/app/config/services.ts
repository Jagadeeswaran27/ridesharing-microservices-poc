import { env } from './env';

export const services = {
  authService: {
    baseUrl: env.AUTH_SERVICE_URL,
  },
};
