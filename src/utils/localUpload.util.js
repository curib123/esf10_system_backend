import fs from 'node:fs';
import path from 'node:path';

import { LOCAL_UPLOADS_DIR, LOCAL_UPLOADS_ROUTE } from '../configs/env.config.js';

const sanitizeSegment = (value) =>
  String(value)
    .replace(/[^a-zA-Z0-9-_/.]/g, '_')
    .replace(/\/{2,}/g, '/')
    .replace(/^\/+|\/+$/g, '');

const ensureDirectory = (directoryPath) => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
};

export const getLocalUploadsRoot = () => LOCAL_UPLOADS_DIR;

export const getLocalUploadsRoute = () => LOCAL_UPLOADS_ROUTE;

export const buildLocalUploadUrl = (relativePath) => {
  const normalizedPath = relativePath.replace(/\\/g, '/');
  return `${LOCAL_UPLOADS_ROUTE}/${normalizedPath}`;
};

export const storeLocally = async (file, subFolder) => {
  const safeSubFolder = sanitizeSegment(subFolder);
  const baseDirectory = getLocalUploadsRoot();
  const targetDirectory = path.join(baseDirectory, safeSubFolder);

  ensureDirectory(targetDirectory);

  const originalExtension = path.extname(file.originalname || '');
  const finalFileName = `${file.filename}${originalExtension}`;
  const targetPath = path.join(targetDirectory, finalFileName);

  fs.renameSync(file.path, targetPath);

  return buildLocalUploadUrl(path.join(safeSubFolder, finalFileName));
};
