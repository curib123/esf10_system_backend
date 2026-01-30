import express from 'express';

import {
  closeCurriculumVersion,
  createCurriculum,
  createCurriculumVersion,
  getCurricula,
  getCurriculumVersions,
  renameCurriculum,
  renameCurriculumVersion,
} from '../controllers/curriculum.controller.js';
import {
  authenticate,
  authorizePermission,
} from '../middleware/auth.middleware.js';

const router = express.Router();

/* =========================
   CURRICULUM
========================= */

/**
 * Create curriculum
 */
router.post(
  '/',
  authenticate,
  authorizePermission('curriculum.create'),
  createCurriculum
);

/**
 * Get curricula (pagination, search, filters)
 */
router.get(
  '/',
  authenticate,
  authorizePermission('curriculum.view'),
  getCurricula
);

/**
 * Rename curriculum (LABEL ONLY)
 */
router.patch(
  '/:curriculumId',
  authenticate,
  authorizePermission('curriculum.update'),
  renameCurriculum
);

/* =========================
   CURRICULUM VERSION
========================= */

/**
 * Create curriculum version
 */
router.post(
  '/:curriculumId/versions',
  authenticate,
  authorizePermission('curriculum_version.create'),
  createCurriculumVersion
);

/**
 * Get curriculum versions
 */
router.get(
  '/:curriculumId/versions',
  authenticate,
  authorizePermission('curriculum_version.view'),
  getCurriculumVersions
);

/**
 * Rename curriculum version (DISPLAY ONLY)
 */
router.patch(
  '/versions/:versionId',
  authenticate,
  authorizePermission('curriculum_version.update'),
  renameCurriculumVersion
);

/**
 * Close curriculum version
 */
router.patch(
  '/versions/:versionId/close',
  authenticate,
  authorizePermission('curriculum_version.update'),
  closeCurriculumVersion
);

export default router;
