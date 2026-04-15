import '../configs/env.config.js';

import fs from 'fs';

import cloudinary from '../configs/cloudinary.config.js';

const ROOT = process.env.CLOUDINARY_ROOT_FOLDER || 'esf10_system';

/* ======================================================
   Generic Upload Helper
====================================================== */
export const uploadToCloudinary = async (
  file,
  subFolder,
  resourceType = 'image'
) => {
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
