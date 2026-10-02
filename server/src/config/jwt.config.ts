import dotenv from 'dotenv';
dotenv.config();

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'mphehli-stars-secret-2026-default',
  expiresIn: '24h',
};