import express from 'express';

import {
  archiveStudent,
  createStudent,
  getStudentById,
  getStudents,
  updateStudent,
} from '../controllers/student.controller.js';
import {
  authenticate,
  authorizePermission,
} from '../middleware/auth.middleware.js';

const router = express.Router();

/* =========================
   STUDENT ROUTES
========================= */

router.get(
  '/',
  authenticate,
  authorizePermission('student.view'),
  getStudents
);

router.get(
  '/:id',
  authenticate,
  authorizePermission('student.view'),
  getStudentById
);

router.post(
  '/create',
  authenticate,
  authorizePermission('student.create'),
  createStudent
);

router.put(
  '/update/:id',
  authenticate,
  authorizePermission('student.update'),
  updateStudent
);

router.patch(
  '/archive/:id',
  authenticate,
  authorizePermission('student.update'),
  archiveStudent
);

export default router;
