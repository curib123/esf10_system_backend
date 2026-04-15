import express from 'express';

import { ADMIN_ROLE } from '../configs/env.config.js';
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
import { validateBody } from '../middleware/validation.middleware.js';
import {
  authLoginSchema,
  authRegisterSchema,
} from '../validators/request.schemas.js';

const router = express.Router();

/* ============================
   PUBLIC ROUTES
============================ */

router.post('/login', validateBody(authLoginSchema), login);
router.get('/me', authenticate, me);

/* ============================
   PROTECTED ROUTES (ADMIN)
============================ */
router.post(
  '/register',
  authenticate,
  authorizeRole(ADMIN_ROLE),
  authorizePermission('user.create'),
  validateBody(authRegisterSchema),
  register
);

export default router;
