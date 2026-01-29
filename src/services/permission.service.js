import { db } from '../configs/db.config.js';

export const PermissionService = {
  create(data) {
    return db.permission.create({ data });
  },

  findAll() {
    return db.permission.findMany({
      orderBy: { code: 'asc' },
    });
  },

  findById(id) {
    return db.permission.findUnique({
      where: { id },
    });
  },

  update(id, data) {
    return db.permission.update({
      where: { id },
      data,
    });
  },

  delete(id) {
    return db.permission.delete({
      where: { id },
    });
  },
};
