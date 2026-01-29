import express from 'express';

import { getPermissions } from '../controllers/permission.controller.js';
import {
  authenticate,
  authorizePermission,
  authorizeRole,
} from '../middleware/auth.middleware.js';

const router = express.Router();

/* ============================
   GLOBAL GUARDS
============================ */
const ADMIN_ROLE = process.env.RBAC_ADMIN_ROLE;

if (!ADMIN_ROLE) {
  throw new Error('RBAC_ADMIN_ROLE is not defined in environment variables');
}

router.use(authenticate);
router.use(authorizeRole(ADMIN_ROLE));

/* ============================
   PERMISSION ROUTES
============================ */
router.get('/', authorizePermission('permission.view'), getPermissions);

export default router;
