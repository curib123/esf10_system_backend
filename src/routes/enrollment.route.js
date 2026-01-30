import express from 'express';

import {
  completeEnrollment,
  createEnrollment,
  getEnrollmentById,
  getEnrollments,
  updateEnrollment,
} from '../controllers/enrollment.controller.js';
import {
  authenticate,
  authorizePermission,
} from '../middleware/auth.middleware.js';

const router = express.Router();

/* =========================
   ENROLLMENT ROUTES
========================= */

/**
 * GET /api/enrollments
 *
 * Query Parameters:
 *  - page            number   (optional, default: 1)
 *  - limit           number   (optional, default: 20, max: 50)
 *  - schoolYearId    number   (optional)
 *  - gradeLevelId    number   (optional)
 *  - status          string   (optional: ACTIVE | COMPLETED | IMPORTED)
 *  - sectionId       number   (optional)
 *  - q               string   (optional: search by LRN, name, or section name)
 */
router.get(
  '/',
  authenticate,
  authorizePermission('enrollment.view'),
  getEnrollments
);

/**
 * GET /api/enrollments/:id
 *
 * Path Parameters:
 *  - id  number (required) Enrollment ID
 */
router.get(
  '/:id',
  authenticate,
  authorizePermission('enrollment.view'),
  getEnrollmentById
);

/**
 * POST /api/enrollments/create
 *
 * Request Body:
 *  - studentId            number (required)
 *  - schoolYearId         number (required, must be active)
 *  - curriculumVersionId number (required, must be active)
 *  - gradeLevelId         number (required, must be active)
 *  - sectionId            number (optional)
 */
router.post(
  '/create',
  authenticate,
  authorizePermission('enrollment.create'),
  createEnrollment
);

/**
 * PUT /api/enrollments/update/:id
 *
 * Path Parameters:
 *  - id  number (required) Enrollment ID
 *
 * Request Body:
 *  - sectionId number (optional)
 *
 * Note:
 *  - Changing gradeLevelId or curriculumVersionId is NOT allowed
 */
router.put(
  '/update/:id',
  authenticate,
  authorizePermission('enrollment.update'),
  updateEnrollment
);

/**
 * PATCH /api/enrollments/complete/:id
 *
 * Path Parameters:
 *  - id number (required) Enrollment ID
 *
 * Action:
 *  - Marks enrollment as COMPLETED
 *
 * Note:
 *  - Completed enrollments are immutable
 */
router.patch(
  '/complete/:id',
  authenticate,
  authorizePermission('enrollment.update'),
  completeEnrollment
);

export default router;
