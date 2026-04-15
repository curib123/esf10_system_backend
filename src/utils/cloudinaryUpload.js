import '../configs/env.config.js';

import fs from 'fs';

import cloudinary from '../configs/cloudinary.config.js';
import { UPLOAD_DRIVER } from '../configs/env.config.js';
import { storeLocally } from './localUpload.util.js';
import { createHttpError } from './http.util.js';

const ROOT = process.env.CLOUDINARY_ROOT_FOLDER || 'esf10_system';

/* ======================================================
   Generic Upload Helper
====================================================== */
export const uploadFile = async (
  file,
  subFolder,
  resourceType = 'image'
) => {
  if (!file?.path) {
    throw createHttpError(400, 'Uploaded file is missing', 'UPLOAD_ERROR');
  }

  if (UPLOAD_DRIVER === 'local') {
    return storeLocally(file, subFolder);
  }

  if (UPLOAD_DRIVER !== 'cloudinary') {
    throw createHttpError(
      500,
      `Unsupported upload driver: ${UPLOAD_DRIVER}`,
      'INVALID_UPLOAD_DRIVER'
    );
  }

  const folder = `${ROOT}/${subFolder}`;

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: resourceType,
    });

    return result.secure_url;
  } finally {
    if (file?.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  }
};

export const uploadToCloudinary = uploadFile;
