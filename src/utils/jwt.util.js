import '../configs/env.config.js';

import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../configs/env.config.js';

const JWT_EXPIRES_IN = '1d';

export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
