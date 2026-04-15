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
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../middleware/validation.middleware.js';
import {
  gradesEnrollmentIdParamSchema,
  gradesSummaryQuerySchema,
  gradesUpsertBodySchema,
} from '../validators/request.schemas.js';

const router = Router();

router.get('/config', authenticate, getAllowedGradingPeriods);
router.get('/allowed-quarters', authenticate, getAllowedGradingPeriods);

router.get(
  '/enrollment/:enrollmentId',
  authenticate,
  validateParams(gradesEnrollmentIdParamSchema),
  getGradesByEnrollment
);

router.get(
  '/enrollment/:enrollmentId/final',
  authenticate,
  validateParams(gradesEnrollmentIdParamSchema),
  getFinalGradesByEnrollment
);

router.get(
  '/enrollment/:enrollmentId/report-card',
  authenticate,
  validateParams(gradesEnrollmentIdParamSchema),
  getReportCard
);

router.get(
  '/summary',
  authenticate,
  validateQuery(gradesSummaryQuerySchema),
  getQuarterSummary
);

router.post(
  '/enrollment/:enrollmentId',
  authenticate,
  validateParams(gradesEnrollmentIdParamSchema),
  validateBody(gradesUpsertBodySchema),
  upsertGrades
);

router.put(
  '/enrollment/:enrollmentId',
  authenticate,
  validateParams(gradesEnrollmentIdParamSchema),
  validateBody(gradesUpsertBodySchema),
  upsertGrades
);

export default router;
