import { ZodError } from 'zod';

import { createHttpError } from '../utils/http.util.js';

const formatZodIssues = (issues) =>
  issues.map((issue) => ({
    path: issue.path.join('.') || 'root',
    message: issue.message,
  }));

const validateRequest = (source, schema) => (req, _res, next) => {
  try {
    const parsed = schema.parse(req[source]);

    if (source === 'query' && req.query && typeof req.query === 'object') {
      for (const key of Object.keys(req.query)) {
        delete req.query[key];
      }

      Object.assign(req.query, parsed);
    } else {
      req[source] = parsed;
    }

    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return next(
        createHttpError(
          400,
          `Invalid ${source}`,
          'VALIDATION_ERROR',
          formatZodIssues(error.issues),
        )
      );
    }

    return next(error);
  }
};

export const validateBody = (schema) => validateRequest('body', schema);
export const validateQuery = (schema) => validateRequest('query', schema);
export const validateParams = (schema) => validateRequest('params', schema);
