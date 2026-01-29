import bcrypt from 'bcrypt';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting RBAC + User seed...');

  /* ============================
     ALL PERMISSIONS
  ============================ */

  const permissions = [
    /* USER & RBAC */
    'user.create',
    'user.view',
    'user.update',
    'user.delete',
    'user.assign-role',

    /* ROLES */
    'role.create',
    'role.view',
    'role.update',
    'role.delete',
    'role.assign-permissions',

    /* PERMISSIONS */
    'permission.view',

    /* STUDENT */
    'student.create',
    'student.update',
    'student.view',
    'student.search',
    'student.archive',

    /* ENROLLMENT */
    'enrollment.create',
    'enrollment.update',
    'enrollment.view',
    'enrollment.complete',
    'enrollment.import',

    /* CURRICULUM */
    'curriculum.create',
    'curriculum.update',
    'curriculum.view',
    'curriculum.lock',

    /* CURRICULUM VERSION */
    'curriculum_version.create',
    'curriculum_version.update',
    'curriculum_version.view',
    'curriculum_version.lock',

    /* SUBJECTS */
    'subject.create',
    'subject.update',
    'subject.view',
    'subject.lock',

    /* GRADES */
    'grades.encode',
    'grades.update',
    'grades.view',
    'grades.import',
    'grades.lock',
    'grades.unlock',

    /* DOCUMENTS */
    'document.upload',
    'document.view',
    'document.delete',

    /* SF10 & REPORTS */
    'sf10.generate',
    'sf10.view',
    'sf10.export',
    'report.view',
    'report.export',

    /* SYSTEM */
    'system.view',
    'system.update',

    /* SCHOOL YEAR */
    'school-year.create',
    'school-year.view',
    'school-year.update',
    'school-year.delete',

    /* AUDIT */
    'audit.view',
    'audit.export',
  ];

  /* ============================
     UPSERT PERMISSIONS
  ============================ */

  const permissionRecords = [];

  for (const code of permissions) {
    const permission = await prisma.permission.upsert({
      where: { code },
      update: {},
      create: {
        code,
        description: code
          .replace(/[.-]/g, ' ')
          .toUpperCase(),
      },
    });

    permissionRecords.push(permission);
  }

  /* ============================
     ROLES
  ============================ */

  const SUPER_ADMIN = await prisma.role.upsert({
    where: { name: 'SUPER_ADMIN' },
    update: {},
    create: {
      name: 'SUPER_ADMIN',
      description: 'Full system access',
    },
  });

  const REGISTRAR = await prisma.role.upsert({
    where: { name: 'REGISTRAR' },
    update: {},
    create: {
      name: 'REGISTRAR',
      description: 'Student, enrollment, and SF10 management',
    },
  });

  const TEACHER = await prisma.role.upsert({
    where: { name: 'TEACHER' },
    update: {},
    create: {
      name: 'TEACHER',
      description: 'Grade encoding only',
    },
  });

  const VIEWER = await prisma.role.upsert({
    where: { name: 'VIEWER' },
    update: {},
    create: {
      name: 'VIEWER',
      description: 'Read-only access',
    },
  });

  /* ============================
     SUPER ADMIN → ALL PERMISSIONS
  ============================ */

  for (const perm of permissionRecords) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: SUPER_ADMIN.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: SUPER_ADMIN.id,
        permissionId: perm.id,
      },
    });
  }

  /* ============================
     OTHER ROLE PERMISSIONS
  ============================ */

  await assignPermissions(REGISTRAR.id, [
    'student.create',
    'student.update',
    'student.view',
    'student.search',
    'student.archive',
    'enrollment.create',
    'enrollment.update',
    'enrollment.view',
    'enrollment.complete',
    'enrollment.import',
    'document.upload',
    'document.view',
    'sf10.generate',
    'sf10.view',
    'sf10.export',
    'report.view',
    'report.export',
  ]);

  await assignPermissions(TEACHER.id, [
    'grades.encode',
    'grades.update',
    'grades.view',
  ]);

  await assignPermissions(VIEWER.id, [
    'student.view',
    'student.search',
    'enrollment.view',
    'grades.view',
    'sf10.view',
    'report.view',
  ]);

  /* ============================
     SEED USERS
  ============================ */

  const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

  const users = [
    {
      email: 'admin@esf10.local',
      fullName: 'System Admin',
      password: 'admin123',
      role: SUPER_ADMIN,
    },
    {
      email: 'registrar@esf10.local',
      fullName: 'Registrar User',
      password: 'registrar123',
      role: REGISTRAR,
    },
    {
      email: 'teacher@esf10.local',
      fullName: 'Teacher User',
      password: 'teacher123',
      role: TEACHER,
    },
    {
      email: 'viewer@esf10.local',
      fullName: 'Viewer User',
      password: 'viewer123',
      role: VIEWER,
    },
  ];

  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, SALT_ROUNDS);

    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        password: hashed,
        fullName: u.fullName,
        isActive: true,
      },
    });

    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: u.role.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        roleId: u.role.id,
      },
    });
  }

  console.log('✅ RBAC + USERS seed completed successfully');
}

/* ============================
   HELPERS
============================ */

async function assignPermissions(roleId, codes) {
  const perms = await prisma.permission.findMany({
    where: { code: { in: codes } },
  });

  const foundCodes = perms.map(p => p.code);
  const missing = codes.filter(c => !foundCodes.includes(c));

  if (missing.length) {
    console.warn(
      `⚠️ Missing permissions for role ${roleId}:`,
      missing
    );
  }

  for (const perm of perms) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId,
        permissionId: perm.id,
      },
    });
  }
}

/* ============================
   RUN
============================ */

main()
  .catch(err => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
