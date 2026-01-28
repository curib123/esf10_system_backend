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
  roleId, // 👈 selected from Role table
}) => {
  /* ---------- validation ---------- */
  if (!email || !password || !fullName || !roleId) {
    throw new Error('Email, password, full name, and role are required');
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

  /* ---------- verify role & permissions ---------- */
  const role = await db.role.findUnique({
    where: { id: roleId },
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });

  if (!role) {
    throw new Error('Selected role does not exist');
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

  /* ---------- assign role ---------- */
  await db.userRole.create({
    data: {
      userId: user.id,
      roleId: role.id,
    },
  });

  /* ---------- derive permissions ---------- */
  const permissions = role.permissions.map(
    rp => rp.permission.code
  );

  /* ---------- generate token ---------- */
  const token = generateToken({
    userId: user.id,
    roles: [role.name],
    permissions,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: role.name,
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
