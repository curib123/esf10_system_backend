import express from 'express';

import {
  bulkUpsertSystemSettings,
  getSystemSetting,
  listSystemSettings,
  upsertSystemSetting,
} from '../controllers/systemSetting.controller.js';
import {
  authenticate,
  authorizePermission,
} from '../middleware/auth.middleware.js';
import {
  validateBody,
  validateParams,
} from '../middleware/validation.middleware.js';
import {
  systemSettingBulkSchema,
  systemSettingKeyParamSchema,
  systemSettingValueSchema,
} from '../validators/request.schemas.js';

const router = express.Router();

router.use(authenticate);

router.get(
  '/',
  authorizePermission('system.view'),
  listSystemSettings
);

router.patch(
  '/',
  authorizePermission('system.update'),
  validateBody(systemSettingBulkSchema),
  bulkUpsertSystemSettings
);

router.get(
  '/:key',
  authorizePermission('system.view'),
  validateParams(systemSettingKeyParamSchema),
  getSystemSetting
);

router.put(
  '/:key',
  authorizePermission('system.update'),
  validateParams(systemSettingKeyParamSchema),
  validateBody(systemSettingValueSchema),
  upsertSystemSetting
);

export default router;
