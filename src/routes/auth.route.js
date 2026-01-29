import express from 'express';

import {
  login,
  me,
  register,
} from '../controllers/auth.controller.js';
import {
  authenticate,
  authorizePermission,
  authorizeRole,
} from '../middleware/auth.middleware.js';

const router = express.Router();

/* ============================
   CONSTANTS
============================ */
const ADMIN_ROLE = process.env.RBAC_ADMIN_ROLE;

if (!ADMIN_ROLE) {
  throw new Error('RBAC_ADMIN_ROLE is not defined in environment variables');
}

/* ============================
   PUBLIC ROUTES
============================ */

// Login
router.post('/login', login);

// Get current user
router.get('/me', authenticate, me);

/* ============================
   PROTECTED ROUTES (ADMIN)
============================ */

// Register user (admin-controlled)
router.post(
  '/register',
  authenticate,
  authorizeRole(ADMIN_ROLE),
  authorizePermission('user.create'),
  register
);

export default router;
