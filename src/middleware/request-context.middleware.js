import { runWithRequestContext } from '../utils/request-context.util.js';

export const requestContextMiddleware = (req, _res, next) => {
  runWithRequestContext({ req }, next);
};
