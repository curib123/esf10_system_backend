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
   REGISTER
============================ */
export const register = async ({ email, password, fullName }) => {
  /* ---- basic presence validation ---- */
  if (!email || !password || !fullName) {
    throw new Error('Email, password, and full name are required');
  }

  /* ---- normalize ---- */
  email = email.trim().toLowerCase();
  fullName = fullName.trim();

  /* ---- email validation ---- */
  if (!isValidEmail(email)) {
    throw new Error('Invalid email format');
  }

  /* ---- password validation ---- */
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

  const hashedPassword = await hashPassword(password);

  const user = await db.user.create({
    data: {
      email,
      password: hashedPassword,
      fullName,
    },
  });

  /* ---- assign default USER role ---- */
  const role = await db.role.findUnique({
    where: { name: 'USER' },
  });

  if (role) {
    await db.userRole.create({
      data: {
        userId: user.id,
        roleId: role.id,
      },
    });
  }

  const token = generateToken({
    userId: user.id,
    roles: role ? ['USER'] : [],
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
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
          role: true,
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

  const token = generateToken({
    userId: user.id,
    roles,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      roles,
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
          role: true,
        },
      },
    },
  });

  if (!user || !user.isActive) {
    throw new Error('User not found');
  }

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    isActive: user.isActive,
    roles: user.roles.map(r => r.role.name),
    createdAt: user.createdAt,
  };
};
