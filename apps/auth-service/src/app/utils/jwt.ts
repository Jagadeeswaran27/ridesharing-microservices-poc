import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import fs from 'fs';

const privateKey = fs.readFileSync('private.pem');

export const generateAccessToken = (user: Omit<User, 'passwordHash'>) => {
  return jwt.sign(user, privateKey, {
    algorithm: 'RS256',
    expiresIn: '15m',
    issuer: 'auth-service',
    audience: 'ride-platform',
  });
};
