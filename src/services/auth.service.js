import { db } from '../configs/db.config.js';
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

/* ============================
   REGISTER (RBAC-DRIVEN)
============================ */
export const register = async ({
  email,
  password,
  fullName,
  roleIds, // 👈 array of role IDs
}) => {
  /* ---------- validation ---------- */
  if (!email || !password || !fullName || !Array.isArray(roleIds) || roleIds.length === 0) {
    throw new Error('Email, password, full name, and roles are required');
  }

  email = email.trim().toLowerCase();
  fullName = fullName.trim();

  if (!isValidEmail(email)) {
    throw new Error('Invalid email format');
  }

  if (!isStrongPassword(password)) {
    throw new Error(
      'Password must be at least 8 characters and include uppercase, lowercase, and a number'
    );
  }

  const existing = await db.user.findUnique({
    where: { email },
  });

  if (existing) {
    throw new Error('Email already exists');
  }

  /* ---------- verify roles ---------- */
  const roles = await db.role.findMany({
    where: {
      id: { in: roleIds },
    },
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });

  if (roles.length !== roleIds.length) {
    throw new Error('One or more selected roles do not exist');
  }

  /* ---------- prevent SUPER_ADMIN assignment ---------- */
  if (roles.some(r => r.name === 'SUPER_ADMIN')) {
    throw new Error('SUPER_ADMIN role cannot be assigned via register');
  }

  /* ---------- create user ---------- */
  const hashedPassword = await hashPassword(password);

  const user = await db.user.create({
    data: {
      email,
      password: hashedPassword,
      fullName,
    },
  });

  /* ---------- assign roles ---------- */
  await db.userRole.createMany({
    data: roles.map(role => ({
      userId: user.id,
      roleId: role.id,
    })),
  });

  /* ---------- derive permissions ---------- */
  const permissions = [
    ...new Set(
      roles.flatMap(role =>
        role.permissions.map(rp => rp.permission.code)
      )
    ),
  ];

  /* ---------- generate token ---------- */
  const token = generateToken({
    userId: user.id,
    roles: roles.map(r => r.name),
    permissions,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      roles: roles.map(r => r.name),
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
    throw new Error('Email and password are required');
  }

  email = email.trim().toLowerCase();

  if (!isValidEmail(email)) {
    throw new Error('Invalid email or password');
  }

  const user = await db.user.findUnique({
    where: { email },
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
    throw new Error('Invalid email or password');
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    throw new Error('Invalid email or password');
  }

  const roles = user.roles.map(r => r.role.name);
  const permissions = [
    ...new Set(
      user.roles.flatMap(r =>
        r.role.permissions.map(p => p.permission.code)
      )
    ),
  ];

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
    },
  };
};

/* ============================
   GET CURRENT USER (/me)
============================ */
export const getMe = async (userId) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const user = await db.user.findUnique({
    where: { id: userId },
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
    throw new Error('User not found');
  }

  const roles = user.roles.map(r => r.role.name);
  const permissions = [
    ...new Set(
      user.roles.flatMap(r =>
        r.role.permissions.map(p => p.permission.code)
      )
    ),
  ];

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
