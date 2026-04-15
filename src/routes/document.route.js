import express from 'express';

import {
  createDocument,
  deleteDocument,
  getDocument,
  listDocuments,
} from '../controllers/document.controller.js';
import {
  authenticate,
  authorizePermission,
} from '../middleware/auth.middleware.js';
import { optionalSingleFile } from '../middleware/upload.middleware.js';
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../middleware/validation.middleware.js';
import {
  documentCreateBodySchema,
  documentIdParamSchema,
  documentListQuerySchema,
} from '../validators/request.schemas.js';

const router = express.Router();

router.use(authenticate);

router.get(
  '/',
  authorizePermission('document.view'),
  validateQuery(documentListQuerySchema),
  listDocuments
);

router.get(
  '/:id',
  authorizePermission('document.view'),
  validateParams(documentIdParamSchema),
  getDocument
);

router.post(
  '/',
  authorizePermission('document.upload'),
  optionalSingleFile('file'),
  validateBody(documentCreateBodySchema),
  createDocument
);

router.delete(
  '/:id',
  authorizePermission('document.delete'),
  validateParams(documentIdParamSchema),
  deleteDocument
);

export default router;
