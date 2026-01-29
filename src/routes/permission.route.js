import express from 'express';

import {
  createPermission,
  deletePermission,
  getPermissions,
  updatePermission,
} from '../controllers/permission.controller.js';
import {
  authenticate,
  authorizeRole,
} from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', authorizeRole('permission.create'), createPermission);
router.get('/', authorizeRole('permission.view'), getPermissions);
router.put('/:id', authorizeRole('permission.update'), updatePermission);
router.delete('/:id', authorizeRole('permission.delete'), deletePermission);

export default router;
