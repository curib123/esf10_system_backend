import { db } from '../configs/db.config.js';
import { createHttpError } from '../utils/http.util.js';
import { generateToken } from '../utils/jwt.util.js';
import {
  comparePassword,
  hashPassword,
} from '../utils/password.util.js';

/* ============================
   VALIDATION HELPERS
============================ */

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isStrongPassword = (password) =>
  password.length >= 8 &&
  /[A-Z]/.test(password) &&
  /[a-z]/.test(password) &&
  /[0-9]/.test(password);

const buildPermissions = (roles) => [
  ...new Set(
    roles.flatMap((role) =>
      role.permissions.map((rolePermission) => rolePermission.permission.code)
    )
  ),
];

/* ============================
   REGISTER (RBAC-DRIVEN)
============================ */
export const register = async ({
  email,
  password,
  fullName,
  roleIds,
}) => {
  if (!email || !password || !fullName || !Array.isArray(roleIds) || roleIds.length === 0) {
    throw createHttpError(
      400,
      'Email, password, full name, and roles are required',
      'INVALID_REGISTER_PAYLOAD'
    );
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedFullName = fullName.trim();
  const normalizedRoleIds = [...new Set(roleIds.map(Number).filter(Number.isInteger))];

  if (!isValidEmail(normalizedEmail)) {
    throw createHttpError(400, 'Invalid email format', 'INVALID_EMAIL_FORMAT');
  }

  if (!isStrongPassword(password)) {
    throw createHttpError(
      400,
      'Password must be at least 8 characters and include uppercase, lowercase, and a number',
      'WEAK_PASSWORD'
    );
  }

  if (normalizedRoleIds.length === 0) {
    throw createHttpError(400, 'At least one valid role is required', 'INVALID_ROLE_SELECTION');
  }

  const existingUser = await db.user.findFirst({
    where: {
      email: normalizedEmail,
      deletedAt: null,
    },
    select: { id: true },
  });

  if (existingUser) {
    throw createHttpError(409, 'Email already exists', 'EMAIL_ALREADY_EXISTS');
  }

  const roles = await db.role.findMany({
    where: {
      id: { in: normalizedRoleIds },
      deletedAt: null,
    },
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });

  if (roles.length !== normalizedRoleIds.length) {
    throw createHttpError(400, 'One or more selected roles do not exist', 'INVALID_ROLE_SELECTION');
  }

  if (roles.some((role) => role.name === 'SUPER_ADMIN')) {
    throw createHttpError(403, 'SUPER_ADMIN role cannot be assigned via register', 'FORBIDDEN');
  }

  const hashedPassword = await hashPassword(password);

  const user = await db.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        fullName: normalizedFullName,
      },
    });

    await tx.userRole.createMany({
      data: roles.map((role) => ({
        userId: createdUser.id,
        roleId: role.id,
      })),
    });

    return createdUser;
  });

  const permissions = buildPermissions(roles);
  const roleNames = roles.map((role) => role.name);

  const token = generateToken({
    userId: user.id,
    roles: roleNames,
    permissions,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      roles: roleNames,
      permissions,
      isActive: user.isActive,
    },
  };
};

/* ============================
   LOGIN
============================ */
export const login = async ({ email, password }) => {
  if (!email || !password) {
    throw createHttpError(400, 'Email and password are required', 'INVALID_LOGIN_PAYLOAD');
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!isValidEmail(normalizedEmail)) {
    throw createHttpError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
  }

  const user = await db.user.findFirst({
    where: {
      email: normalizedEmail,
      deletedAt: null,
    },
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user || !user.isActive) {
    throw createHttpError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
  }

  const roles = user.roles.map((userRole) => userRole.role.name);
  const permissions = buildPermissions(user.roles.map((userRole) => userRole.role));

  const token = generateToken({
    userId: user.id,
    roles,
    permissions,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      roles,
      permissions,
      isActive: user.isActive,
    },
  };
};

/* ============================
   GET CURRENT USER (/me)
============================ */
export const getMe = async (userId) => {
  if (!userId) {
    throw createHttpError(401, 'Unauthorized', 'UNAUTHENTICATED');
  }

  const user = await db.user.findFirst({
    where: {
      id: userId,
      deletedAt: null,
    },
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user || !user.isActive) {
    throw createHttpError(404, 'User not found', 'USER_NOT_FOUND');
  }

  const roles = user.roles.map((userRole) => userRole.role.name);
  const permissions = buildPermissions(user.roles.map((userRole) => userRole.role));

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    isActive: user.isActive,
    roles,
    permissions,
    createdAt: user.createdAt,
  };
};
