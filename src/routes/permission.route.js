import express from 'express';

import { getPermissions } from '../controllers/permission.controller.js';
import {
  authenticate,
  authorizePermission,
  authorizeRole,
} from '../middleware/auth.middleware.js';
import { ADMIN_ROLE } from '../configs/env.config.js';

const router = express.Router();

router.use(authenticate);
router.use(authorizeRole(ADMIN_ROLE));

/* ============================
   PERMISSION ROUTES
============================ */
router.get('/', authorizePermission('permission.view'), getPermissions);

export default router;
