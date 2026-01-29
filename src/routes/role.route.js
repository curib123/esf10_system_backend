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
  authorizeRole,
} from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', authorizeRole('role.create'), createRole);
router.get('/', authorizeRole('role.view'), getRoles);
router.put('/:id', authorizeRole('role.update'), updateRole);
router.delete('/:id', authorizeRole('role.delete'), deleteRole);

router.put(
  '/:id/permissions',
  authorizeRole('role.assign-permissions'),
  setRolePermissions
);

export default router;
