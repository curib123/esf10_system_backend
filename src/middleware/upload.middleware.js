import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import multer from 'multer';

import { createHttpError } from '../utils/http.util.js';

const uploadDir = path.join(os.tmpdir(), 'esf10_uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export const optionalSingleFile = (fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError) {
      return next(
        createHttpError(400, error.message, 'UPLOAD_ERROR')
      );
    }

    return next(error);
  });
};
