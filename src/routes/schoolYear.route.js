// src/routes/schoolYear.routes.js
import express from 'express';

import {
  activate,
  create,
  findAll,
  findOne,
  remove,
  update,
} from '../controllers/schoolYear.controller.js';
import {
  authenticate,
  authorizePermission,
} from '../middleware/auth.middleware.js';

const router = express.Router();


router.use(authenticate);

/* ============================
   SCHOOL YEAR ROUTES
============================ */
router.post('/', authorizePermission('school-year.create'), create);
router.get('/', authorizePermission('school-year.view'), findAll);
router.get('/:id', authorizePermission('school-year.view'), findOne);
router.put('/:id', authorizePermission('school-year.update'), update);

router.patch(
  '/:id/activate',
  authorizePermission('school-year.update'),
  activate
);

router.delete('/:id', authorizePermission('school-year.delete'), remove);

export default router;
