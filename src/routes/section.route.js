import express from 'express';

import {
  createSection,
  deleteSection,
  getSectionById,
  getSections,
  updateSection,
} from '../controllers/section.controller.js';
import {
  authenticate,
  authorizePermission,
} from '../middleware/auth.middleware.js';

const router = express.Router();

/* =========================
   SECTION ROUTES
========================= */

/**
 * GET /api/sections
 * Query:
 *  - page
 *  - limit
 *  - gradeLevelId
 *  - schoolYearId
 *  - adviserId
 *  - q
 */
router.get(
  '/',
  authenticate,
  authorizePermission('section.view'),
  getSections
);

/**
 * GET /api/sections/:id
 */
router.get(
  '/:id',
  authenticate,
  authorizePermission('section.view'),
  getSectionById
);

/**
 * POST /api/sections/create
 */
router.post(
  '/create',
  authenticate,
  authorizePermission('section.create'),
  createSection
);

/**
 * PUT /api/sections/update/:id
 */
router.put(
  '/update/:id',
  authenticate,
  authorizePermission('section.update'),
  updateSection
);

/**
 * DELETE /api/sections/delete/:id
 */
router.delete(
  '/delete/:id',
  authenticate,
  authorizePermission('section.delete'),
  deleteSection
);

export default router;
