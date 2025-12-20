import jwt from 'jsonwebtoken';
import fs from 'fs';

const publicKey = fs.readFileSync('public.pem');

export const verifyToken = (token: string) => {
  return jwt.verify(token, publicKey, {
    algorithms: ['RS256'],
    issuer: 'auth-service',
    audience: 'ride-platform',
  });
};
