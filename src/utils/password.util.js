import '../configs/env.config.js';

import bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from '../configs/env.config.js';

const SALT_ROUNDS = BCRYPT_SALT_ROUNDS;

export const hashPassword = async (password) => {
  if (!password) {
    throw new Error('Password is required');
  }

  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password, hash) => {
  if (!password || !hash) {
    return false;
  }

  return bcrypt.compare(password, hash);
};
