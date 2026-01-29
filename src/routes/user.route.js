import express from 'express';

import {
  assignRoles,
  createUser,
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
   USER ROUTES
============================ */

// Get all users (pagination, search, filters)
router.get(
  '/',
  authorizePermission('user.view'),
  getUsers
);

// Get single user
router.get(
  '/:id',
  authorizePermission('user.view'),
  getUser
);

// Create user
router.post(
  '/',
  authorizePermission('user.create'),
  createUser
);

// Update user
router.put(
  '/:id',
  authorizePermission('user.update'),
  updateUser
);

// Toggle active / inactive status
router.patch(
  '/:id/toggle-status',
  authorizePermission('user.update'),
  toggleUserActive
);

// Delete user
router.delete(
  '/:id',
  authorizePermission('user.delete'),
  deleteUser
);

// Assign roles to user
router.put(
  '/:id/roles',
  authorizePermission('user.assign-role'),
  assignRoles
);

export default router;
