import 'dotenv/config';

const isBlank = (value) =>
  value === undefined || value === null || value === '';

export const getEnv = (key, fallback) => {
  const value = process.env[key];

  if (!isBlank(value)) {
    return value;
  }

  if (fallback !== undefined) {
    return fallback;
  }

  const error = new Error(`${key} is not defined in environment variables`);
  error.status = 500;
  error.code = 'MISSING_ENV';
  throw error;
};

export const ADMIN_ROLE = getEnv('RBAC_ADMIN_ROLE', 'SUPER_ADMIN');
export const JWT_SECRET = getEnv('JWT_SECRET', 'development-only-secret');
export const BCRYPT_SALT_ROUNDS = Number(getEnv('BCRYPT_SALT_ROUNDS', '10'));
export const UPLOAD_DRIVER = getEnv('UPLOAD_DRIVER', 'local').toLowerCase();
export const LOCAL_UPLOADS_DIR = getEnv('LOCAL_UPLOADS_DIR', 'uploads');
export const LOCAL_UPLOADS_ROUTE = getEnv('LOCAL_UPLOADS_ROUTE', '/uploads');
