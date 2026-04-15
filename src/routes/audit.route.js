import express from 'express';

import {
  exportAuditLogs,
  listAuditLogs,
} from '../controllers/audit.controller.js';
import {
  authenticate,
  authorizePermission,
} from '../middleware/auth.middleware.js';
import { validateQuery } from '../middleware/validation.middleware.js';
import { auditLogListQuerySchema } from '../validators/request.schemas.js';

const router = express.Router();

router.use(authenticate);

router.get(
  '/export',
  authorizePermission('audit.export'),
  validateQuery(auditLogListQuerySchema),
  exportAuditLogs
);

router.get(
  '/',
  authorizePermission('audit.view'),
  validateQuery(auditLogListQuerySchema),
  listAuditLogs
);

export default router;
