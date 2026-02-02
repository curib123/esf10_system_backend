import { Router } from 'express';

import {
  getAllowedGradingPeriods,
  getFinalGradesByEnrollment,
  getGradesByEnrollment,
  getQuarterSummary,
  getReportCard,
  upsertGrades,
} from '../controllers/grades.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

/* =========================
   PUBLIC (AUTHENTICATED)
========================= */

// Get grading configuration (periods, weights, descriptors)
router.get('/config', authenticate, getAllowedGradingPeriods);

// Alias for backwards compatibility
router.get('/allowed-quarters', authenticate, getAllowedGradingPeriods);

/* =========================
   ADVISER / ADMIN ROUTES
========================= */

// Get all grades for an enrollment
router.get(
  '/enrollment/:enrollmentId',
  authenticate,
  getGradesByEnrollment
);

// Get final grades only
router.get(
  '/enrollment/:enrollmentId/final',
  authenticate,
  getFinalGradesByEnrollment
);

// Get full report card (comprehensive)
router.get(
  '/enrollment/:enrollmentId/report-card',
  authenticate,
  getReportCard
);

// Get quarter summary/stats for a section (adviser only)
router.get(
  '/summary',
  authenticate,
  getQuarterSummary
);

// Create/update grades (adviser only)
router.post(
  '/enrollment/:enrollmentId',
  authenticate,
  upsertGrades
);

// Also support PUT for idempotent updates
router.put(
  '/enrollment/:enrollmentId',
  authenticate,
  upsertGrades
);

export default router;