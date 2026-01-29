import { db } from '../configs/db.config.js';
import { hashPassword } from '../utils/password.util.js';

/* =========================
   GET USERS (PAGINATION)
========================= */
export const getUsers = async ({
  page = 1,
  limit = 10,
  search,
  isActive,
  sortBy = 'createdAt',
  sortOrder = 'desc',
}) => {
  const skip = (page - 1) * limit;

  const where = {
    ...(search && {
      OR: [
        { email: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
      ],
    }),
    ...(isActive !== undefined && { isActive: isActive === 'true' }),
  };

  const [data, total] = await Promise.all([
    db.user.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { [sortBy]: sortOrder },
      select: {
        id: true,
        email: true,
        fullName: true,
        isActive: true,
        createdAt: true,
        roles: {
          select: {
            role: { select: { id: true, name: true } },
          },
        },
      },
    }),
    db.user.count({ where }),
  ]);

  return {
    data,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/* =========================
   GET SINGLE USER
========================= */
export const getUserById = async (id) => {
  return db.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      fullName: true,
      isActive: true,
      createdAt: true,
      roles: {
        select: {
          role: true,
        },
      },
    },
  });
};

/* =========================
   UPDATE USER
========================= */
export const updateUser = async (id, data) => {
  const updateData = {};

  if (data.email !== undefined) {
    updateData.email = data.email;
  }

  if (data.fullName !== undefined) {
    updateData.fullName = data.fullName;
  }

  if (data.isActive !== undefined) {
    updateData.isActive = data.isActive;
  }

  // Optional password change
  if (data.password) {
    updateData.password = await hashPassword(data.password);
  }

  return db.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      email: true,
      fullName: true,
      isActive: true,
      createdAt: true,
    },
  });
};


/* =========================
   DELETE USER
========================= */
export const deleteUser = async (id) => {
  return db.user.delete({
    where: { id },
  });
};

/* =========================
   ASSIGN ROLES
========================= */
export const assignRoles = async (userId, roleIds = []) => {
  await db.userRole.deleteMany({ where: { userId } });

  return db.userRole.createMany({
    data: roleIds.map((roleId) => ({
      userId,
      roleId,
    })),
  });
};

/* =========================
   TOGGLE USER ACTIVE STATUS
========================= */
export const toggleUserActive = async (id) => {
  const user = await db.user.findUnique({
    where: { id },
    select: { isActive: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return db.user.update({
    where: { id },
    data: {
      isActive: !user.isActive,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      isActive: true,
    },
  });
};
