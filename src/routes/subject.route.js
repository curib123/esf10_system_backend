import express from 'express';

import {
  createSubject,
  getSubjectById,
  getSubjects,
  updateSubject,
} from '../controllers/subject.controller.js';
import {
  authenticate,
  authorizePermission,
} from '../middleware/auth.middleware.js';

const router = express.Router();

/* =========================
   SUBJECT ROUTES
========================= */

router.get(
  '/',
  authenticate,
  authorizePermission('subject.view'),
  getSubjects
);

router.get(
  '/:id',
  authenticate,
  authorizePermission('subject.view'),
  getSubjectById
);

router.post(
  '/',
  authenticate,
  authorizePermission('subject.create'),
  createSubject
);

router.put(
  '/:id',
  authenticate,
  authorizePermission('subject.update'),
  updateSubject
);

export default router;
