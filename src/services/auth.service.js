import { db } from '../configs/db.config.js';
import { generateToken } from '../utils/jwt.util.js';
import {
  comparePassword,
  hashPassword,
} from '../utils/password.util.js';

export const register = async ({ email, password, fullName }) => {
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

  // assign default USER role (optional but recommended)
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

export const login = async ({ email, password }) => {
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
    throw new Error('Invalid credentials');
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    throw new Error('Invalid credentials');
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
