import { Router } from 'express';

import {
  getAllowedGradingPeriods,
  getFinalGradesByEnrollment,
  getGradesByEnrollment,
  getQuarterSummary,
  getReportCard,
  upsertGrades,
} from '../controllers/grades.controller.improved.js';
import { auth } from '../middleware/auth.middleware.js';

const router = Router();

/* =========================
   PUBLIC (AUTHENTICATED)
========================= */

// Get grading configuration (periods, weights, descriptors)
router.get('/config', auth, getAllowedGradingPeriods);

// Alias for backwards compatibility
router.get('/allowed-quarters', auth, getAllowedGradingPeriods);

/* =========================
   ADVISER / ADMIN ROUTES
========================= */

// Get all grades for an enrollment
router.get(
  '/enrollment/:enrollmentId',
  auth,
  getGradesByEnrollment
);

// Get final grades only
router.get(
  '/enrollment/:enrollmentId/final',
  auth,
  getFinalGradesByEnrollment
);

// Get full report card (comprehensive)
router.get(
  '/enrollment/:enrollmentId/report-card',
  auth,
  getReportCard
);

// Get quarter summary/stats for a section (adviser only)
router.get(
  '/summary',
  auth,
  getQuarterSummary
);

// Create/update grades (adviser only)
router.post(
  '/enrollment/:enrollmentId',
  auth,
  upsertGrades
);

// Also support PUT for idempotent updates
router.put(
  '/enrollment/:enrollmentId',
  auth,
  upsertGrades
);

export default router;