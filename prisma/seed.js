import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

async function main() {
  /* ============================
     ALL PERMISSIONS
  ============================ */

  const permissions = [
    // USER & RBAC
    'user.create',
    'user.update',
    'user.deactivate',
    'user.assign_role',
    'role.create',
    'role.update',
    'role.delete',
    'permission.assign',

    // STUDENT
    'student.create',
    'student.update',
    'student.view',
    'student.search',
    'student.archive',

    // ENROLLMENT
    'enrollment.create',
    'enrollment.update',
    'enrollment.view',
    'enrollment.complete',
    'enrollment.import',

    // CURRICULUM
    'curriculum.create',
    'curriculum.update',
    'curriculum.view',
    'curriculum.lock',

    // CURRICULUM VERSION
    'curriculum_version.create',
    'curriculum_version.update',
    'curriculum_version.view',
    'curriculum_version.lock',

    // SUBJECTS
    'subject.create',
    'subject.update',
    'subject.view',
    'subject.lock',

    // GRADES
    'grades.encode',
    'grades.update',
    'grades.view',
    'grades.import',
    'grades.lock',
    'grades.unlock',

    // DOCUMENTS
    'document.upload',
    'document.view',
    'document.delete',

    // SF10 & REPORTS
    'sf10.generate',
    'sf10.view',
    'sf10.export',
    'report.view',
    'report.export',

    // SYSTEM
    'system.view',
    'system.update',
    'school_year.create',
    'school_year.activate',
    'school_year.close',

    // AUDIT
    'audit.view',
    'audit.export',
  ]

  /* ============================
     UPSERT PERMISSIONS
  ============================ */

  const permissionRecords = []

  for (const code of permissions) {
    const permission = await prisma.permission.upsert({
      where: { code },
      update: {},
      create: {
        code,
        description: code.replace('.', ' ').toUpperCase(),
      },
    })
    permissionRecords.push(permission)
  }

  /* ============================
     ROLES
  ============================ */

  const SUPER_ADMIN = await prisma.role.upsert({
    where: { name: 'SUPER_ADMIN' },
    update: {},
    create: { name: 'SUPER_ADMIN', description: 'Full system access' },
  })

  const REGISTRAR = await prisma.role.upsert({
    where: { name: 'REGISTRAR' },
    update: {},
    create: { name: 'REGISTRAR', description: 'Student, enrollment, and SF10 management' },
  })

  const TEACHER = await prisma.role.upsert({
    where: { name: 'TEACHER' },
    update: {},
    create: { name: 'TEACHER', description: 'Grade encoding only' },
  })

  const VIEWER = await prisma.role.upsert({
    where: { name: 'VIEWER' },
    update: {},
    create: { name: 'VIEWER', description: 'Read-only access' },
  })

  /* ============================
     ROLE → PERMISSION ASSIGNMENT
  ============================ */

  // SUPER ADMIN → ALL
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
    })
  }

  // REGISTRAR
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
  ])

  // TEACHER
  await assignPermissions(TEACHER.id, [
    'grades.encode',
    'grades.update',
    'grades.view',
  ])

  // VIEWER
  await assignPermissions(VIEWER.id, [
    'student.view',
    'student.search',
    'enrollment.view',
    'grades.view',
    'sf10.view',
    'report.view',
  ])

  console.log('✅ RBAC seed completed successfully')
}

/* ============================
   HELPER
============================ */

async function assignPermissions(roleId, codes) {
  const perms = await prisma.permission.findMany({
    where: { code: { in: codes } },
  })

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
    })
  }
}

/* ============================
   RUN
============================ */

main()
  .catch(err => {
    console.error('❌ Seed failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
