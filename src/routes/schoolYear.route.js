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
router.post('/', authorizePermission('school_year.create'), create);
router.get('/', authorizePermission('school_year.view'), findAll);
router.get('/:id', authorizePermission('school_year.view'), findOne);
router.put('/:id', authorizePermission('school_year.update'), update);

router.patch(
  '/:id/activate',
  authorizePermission('school_year.update'),
  activate
);

router.delete('/:id', authorizePermission('school_year.delete'), remove);

export default router;
