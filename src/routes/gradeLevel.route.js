import express from 'express';

import {
  createGradeLevel,
  getGradeLevelById,
  getGradeLevels,
  toggleGradeLevelStatus,
  updateGradeLevel,
} from '../controllers/gradeLevel.controller.js';
import {
  authenticate,
  authorizePermission,
} from '../middleware/auth.middleware.js';

const router = express.Router();

/* =========================
   GRADE LEVEL ROUTES
========================= */

// 🔍 list + search + pagination
router.get(
  '/',
  authenticate,
  authorizePermission('grade_level.view'),
  getGradeLevels
);

// 📄 read one
router.get(
  '/:id',
  authenticate,
  authorizePermission('grade_level.view'),
  getGradeLevelById
);

// ➕ create
router.post(
  '/',
  authenticate,
  authorizePermission('grade_level.create'),
  createGradeLevel
);

// ✏️ update
router.put(
  '/:id',
  authenticate,
  authorizePermission('grade_level.update'),
  updateGradeLevel
);

// 🔁 activate / deactivate
router.patch(
  '/toggle-status/:id',
  authenticate,
  authorizePermission('grade_level.update'),
  toggleGradeLevelStatus
);

export default router;
