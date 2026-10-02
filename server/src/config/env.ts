import { z } from 'zod';

export const env = {
  PORT: process.env.PORT || '3000',
  DATABASE_URL: process.env.DATABASE_URL as string,
};

if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in .env');
}

export default env;
