import express from 'express';

import {
  getAllowedGradingPeriods,
  getGradesByEnrollment,
  upsertGrades,
} from '../controllers/grades.controller.js';
import {
  authenticate,
  authorizePermission,
} from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * GET /api/grades/enrollment/:enrollmentId
 */
router.get(
  '/enrollment/:enrollmentId',
  authenticate,
  authorizePermission('grades.view'),
  getGradesByEnrollment
);

/**
 * POST /api/grades/enrollment/:enrollmentId
 */
router.post(
  '/enrollment/:enrollmentId',
  authenticate,
  authorizePermission('grades.create'),
  upsertGrades
);

router.get(
  '/periods',
  authenticate,
  authorizePermission('grades.view'),
  getAllowedGradingPeriods
);

export default router;
