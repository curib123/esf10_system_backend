import express from 'express';

import {
  exportSf10,
  generateSf10,
  viewSf10,
} from '../controllers/sf10.controller.js';
import {
  authenticate,
  authorizePermission,
} from '../middleware/auth.middleware.js';
import { validateParams } from '../middleware/validation.middleware.js';
import { sf10StudentIdParamSchema } from '../validators/request.schemas.js';

const router = express.Router();

router.use(authenticate);

router.get(
  '/student/:studentId',
  authorizePermission('sf10.view'),
  validateParams(sf10StudentIdParamSchema),
  viewSf10
);

router.get(
  '/student/:studentId/generate',
  authorizePermission('sf10.generate'),
  validateParams(sf10StudentIdParamSchema),
  generateSf10
);

router.get(
  '/student/:studentId/export',
  authorizePermission('sf10.export'),
  validateParams(sf10StudentIdParamSchema),
  exportSf10
);

export default router;
