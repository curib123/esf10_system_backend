import express from 'express';

import {
  createGradeLevel,
  getGradeLevelById,
  getGradeLevels,
  toggleGradeLevelStatus,
  updateGradeLevel,
} from '../controllers/gradeLevel.controller.js';

const router = express.Router();

/* =========================
   GRADE LEVEL ROUTES
========================= */

router.get('/', getGradeLevels);                 // list + search + pagination
router.get('/:id', getGradeLevelById);           // read one
router.post('/create', createGradeLevel);        // create
router.put('/update/:id', updateGradeLevel);     // update
router.patch('/toggle-status/:id', toggleGradeLevelStatus); // activate/deactivate

export default router;
