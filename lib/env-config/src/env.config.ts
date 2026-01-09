import dotenv from 'dotenv';

dotenv.config();

export const env = {
  AUTH_DATABASE_URL: process.env.AUTH_DATABASE_URL || '',
  REDIS_URL: process.env.REDIS_URL || '',
};
