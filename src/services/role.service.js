import { db } from '../configs/db.config.js';

export const RoleService = {
  create(data) {
    return db.role.create({ data });
  },

  findAll() {
    return db.role.findMany({
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });
  },

  findById(id) {
    return db.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });
  },

  update(id, data) {
    return db.role.update({
      where: { id },
      data,
    });
  },

  delete(id) {
    return db.role.delete({
      where: { id },
    });
  },

  setPermissions(roleId, permissionIds) {
    return db.$transaction([
      db.rolePermission.deleteMany({ where: { roleId } }),
      db.rolePermission.createMany({
        data: permissionIds.map(pid => ({
          roleId,
          permissionId: pid,
        })),
      }),
    ]);
  },
};
