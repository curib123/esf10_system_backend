import express from 'express';

import { getMyAdvisedStudents } from '../controllers/teacher.controller.js';
import {
  authenticate,
  authorizePermission,
} from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * GET /api/teachers/my-students
 *
 * Description:
 *  - Fetch all ACTIVE enrolled students from sections advised by the logged-in user
 *
 * Authorization:
 *  - Requires authentication
 *  - Requires permission: grades.view
 *
 * Query Parameters (optional):
 *  - page          number   (default: 1)
 *  - limit         number   (default: 20, max: 50)
 *  - schoolYearId  number   (defaults to active school year)
 *  - gradeLevelId  number
 *  - sectionId     number
 *  - status        string   (ACTIVE | COMPLETED | IMPORTED)
 *  - q             string   (search by LRN, student name, or section name)
 */
router.get(
  '/my-students',
  authenticate,
  authorizePermission('grades.view'),
  getMyAdvisedStudents
);

export default router;
