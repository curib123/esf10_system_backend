import { createHttpError } from './http.util.js';

export const parsePositiveInt = (value, fieldName = 'id') => {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw createHttpError(400, `${fieldName} must be a positive integer`, 'INVALID_ID');
  }

  return parsed;
};

export const getAuthenticatedUserId = (req) => {
  const userId = Number(req.user?.userId ?? req.user?.id);

  if (!Number.isInteger(userId) || userId <= 0) {
    throw createHttpError(401, 'Unauthorized', 'UNAUTHENTICATED');
  }

  return userId;
};
