import express from 'express';

import {
  completeEnrollment,
  createEnrollment,
  getEnrollmentById,
  getEnrollments,
  getSubjectsByEnrollment,
  updateEnrollment,
} from '../controllers/enrollment.controller.js';
import {
  authenticate,
  authorizePermission,
} from '../middleware/auth.middleware.js';
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../middleware/validation.middleware.js';
import {
  enrollmentCreateBodySchema,
  enrollmentIdParamSchema,
  enrollmentListQuerySchema,
  enrollmentUpdateBodySchema,
} from '../validators/request.schemas.js';

const router = express.Router();

router.get(
  '/',
  authenticate,
  authorizePermission('enrollment.view'),
  validateQuery(enrollmentListQuerySchema),
  getEnrollments
);

router.get(
  '/:id',
  authenticate,
  authorizePermission('enrollment.view'),
  validateParams(enrollmentIdParamSchema),
  getEnrollmentById
);

router.post(
  '/create',
  authenticate,
  authorizePermission('enrollment.create'),
  validateBody(enrollmentCreateBodySchema),
  createEnrollment
);

router.put(
  '/update/:id',
  authenticate,
  authorizePermission('enrollment.update'),
  validateParams(enrollmentIdParamSchema),
  validateBody(enrollmentUpdateBodySchema),
  updateEnrollment
);

router.patch(
  '/complete/:id',
  authenticate,
  authorizePermission('enrollment.update'),
  validateParams(enrollmentIdParamSchema),
  completeEnrollment
);

router.get(
  '/:id/subjects',
  authenticate,
  validateParams(enrollmentIdParamSchema),
  getSubjectsByEnrollment
);

export default router;
