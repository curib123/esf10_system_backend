import express from 'express';

import { ADMIN_ROLE } from '../configs/env.config.js';
import {
  deleteUser,
  getUser,
  getUsers,
  toggleUserActive,
  updateUser,
} from '../controllers/user.controller.js';
import {
  authenticate,
  authorizePermission,
  authorizeRole,
} from '../middleware/auth.middleware.js';
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../middleware/validation.middleware.js';
import {
  userIdParamSchema,
  userListQuerySchema,
  userUpdateBodySchema,
} from '../validators/request.schemas.js';

const router = express.Router();

router.use(authenticate);
router.use(authorizeRole(ADMIN_ROLE));

router.get(
  '/',
  authorizePermission('user.view'),
  validateQuery(userListQuerySchema),
  getUsers
);

router.get(
  '/:id',
  authorizePermission('user.view'),
  validateParams(userIdParamSchema),
  getUser
);

router.put(
  '/:id',
  authorizePermission('user.update'),
  validateParams(userIdParamSchema),
  validateBody(userUpdateBodySchema),
  updateUser
);

router.patch(
  '/:id/toggle-status',
  authorizePermission('user.update'),
  validateParams(userIdParamSchema),
  toggleUserActive
);

router.delete(
  '/:id',
  authorizePermission('user.delete'),
  validateParams(userIdParamSchema),
  deleteUser
);

export default router;
