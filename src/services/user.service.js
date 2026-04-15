import { db } from '../configs/db.config.js';
import { createHttpError } from '../utils/http.util.js';
import { hashPassword } from '../utils/password.util.js';

const ALLOWED_SORT_FIELDS = new Set(['createdAt', 'email', 'fullName', 'isActive']);
const ALLOWED_SORT_ORDERS = new Set(['asc', 'desc']);

const normalizePagination = (page = 1, limit = 10) => {
  const normalizedPage = Number.isInteger(Number(page)) && Number(page) > 0
    ? Number(page)
    : 1;
  const normalizedLimit = Number.isInteger(Number(limit)) && Number(limit) > 0
    ? Math.min(Number(limit), 100)
    : 10;

  return {
    page: normalizedPage,
    limit: normalizedLimit,
    skip: (normalizedPage - 1) * normalizedLimit,
  };
};

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
  const { page: safePage, limit: safeLimit, skip } = normalizePagination(page, limit);
  const safeSortBy = ALLOWED_SORT_FIELDS.has(sortBy) ? sortBy : 'createdAt';
  const safeSortOrder = ALLOWED_SORT_ORDERS.has(String(sortOrder).toLowerCase())
    ? String(sortOrder).toLowerCase()
    : 'desc';

  const where = {
    deletedAt: null,
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
      take: safeLimit,
      orderBy: { [safeSortBy]: safeSortOrder },
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
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
};

/* =========================
   GET SINGLE USER
========================= */
export const getUserById = async (id) => {
  return db.user.findFirst({
    where: {
      id,
      deletedAt: null,
    },
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
   UPDATE USER (INFO + PASSWORD + ROLES)
========================= */
export const updateUser = async (id, data) => {
  return db.$transaction(async (tx) => {
    const existingUser = await tx.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!existingUser) {
      throw createHttpError(404, 'User not found', 'USER_NOT_FOUND');
    }

    const updateData = {};

    if (data.email !== undefined) {
      updateData.email = data.email.trim().toLowerCase();
    }

    if (data.fullName !== undefined) {
      updateData.fullName = data.fullName.trim();
    }

    if (data.isActive !== undefined) {
      updateData.isActive = data.isActive;
    }

    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }

    const user = await tx.user.update({
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

    if (Array.isArray(data.roleIds)) {
      const normalizedRoleIds = [...new Set(data.roleIds.map(Number).filter(Number.isInteger))];
      const roles = normalizedRoleIds.length === 0
        ? []
        : await tx.role.findMany({
            where: {
              id: { in: normalizedRoleIds },
              deletedAt: null,
            },
            select: { id: true },
          });

      if (roles.length !== normalizedRoleIds.length) {
        throw createHttpError(400, 'One or more selected roles do not exist', 'INVALID_ROLE_SELECTION');
      }

      await tx.userRole.deleteMany({ where: { userId: id } });

      if (normalizedRoleIds.length > 0) {
        await tx.userRole.createMany({
          data: normalizedRoleIds.map((roleId) => ({
            userId: id,
            roleId,
          })),
        });
      }
    }

    return user;
  });
};

/* =========================
   DELETE USER (SOFT DELETE)
========================= */
export const deleteUser = async (id) => {
  return db.user.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      isActive: false,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      isActive: true,
      deletedAt: true,
    },
  });
};

/* =========================
   TOGGLE USER ACTIVE STATUS
========================= */
export const toggleUserActive = async (id) => {
  const user = await db.user.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    select: { isActive: true },
  });

  if (!user) {
    throw createHttpError(404, 'User not found', 'USER_NOT_FOUND');
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
