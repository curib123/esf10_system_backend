import express from 'express';

import {
  createRole,
  deleteRole,
  getRoles,
  setRolePermissions,
  updateRole,
} from '../controllers/role.controller.js';
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
   ROLE ROUTES
============================ */
router.post('/', authorizePermission('role.create'), createRole);
router.get('/', authorizePermission('role.view'), getRoles);
router.put('/:id', authorizePermission('role.update'), updateRole);
router.delete('/:id', authorizePermission('role.delete'), deleteRole);

router.put(
  '/:id/permissions',
  authorizePermission('role.assign-permissions'),
  setRolePermissions
);

export default router;
