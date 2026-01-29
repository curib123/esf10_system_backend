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
   AUTH ROUTES
============================ */

// Register user (ADMIN only)
router.post(
  '/register',
  authenticate,
  authorizeRole(process.env.RBAC_ADMIN_ROLE),
  authorizePermission('user.create'),
  register
);

// Login (public)
router.post('/login', login);

// Get current user
router.get('/me', authenticate, me);

export default router;
