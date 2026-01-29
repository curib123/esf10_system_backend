import { db } from '../configs/db.config.js';

export const PermissionService = {
  findAll() {
    return db.permission.findMany({
      orderBy: { code: 'asc' },
    });
  },
};
