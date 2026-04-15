import test from 'node:test';
import assert from 'node:assert/strict';

import bcrypt from 'bcrypt';
import request from 'supertest';

import '../src/configs/env.config.js';
import {
  createIsolatedTestDatabase,
  destroyIsolatedTestDatabase,
} from './helpers/db-test.util.js';

const runDbTests = process.env.RUN_DB_INTEGRATION === '1';
const suite = runDbTests ? test : test.skip;

suite('DB-backed Prisma flows', async (t) => {
  const baseDatabaseUrl = process.env.DATABASE_URL;
  const uniqueSuffix = Date.now().toString(36);

  assert.ok(baseDatabaseUrl, 'DATABASE_URL is required for DB integration tests');

  const dbContext = await createIsolatedTestDatabase(baseDatabaseUrl);
  process.env.DATABASE_URL = dbContext.testDatabaseUrl;

  const [{ default: app }, { disconnectDB }] = await Promise.all([
    import('../src/app.js'),
    import('../src/configs/db.config.js'),
  ]);

  const prisma = dbContext.prisma;

  const seed = async () => {
    const permissions = await Promise.all([
      'user.create',
      'enrollment.create',
      'document.upload',
      'document.view',
      'document.delete',
      'system.view',
      'system.update',
      'audit.view',
      'audit.export',
      'sf10.view',
      'sf10.generate',
      'sf10.export',
    ].map((code) =>
      prisma.permission.upsert({
        where: { code },
        create: {
          code,
          description: code.replaceAll('.', ' '),
        },
        update: {
          description: code.replaceAll('.', ' '),
        },
      })
    ));

    const permissionsByCode = Object.fromEntries(
      permissions.map((permission) => [permission.code, permission])
    );

    const [
      superAdminRole,
      registrarRole,
      teacherRole,
    ] = await Promise.all([
      prisma.role.upsert({
        where: {
          name: 'SUPER_ADMIN',
        },
        create: {
          name: 'SUPER_ADMIN',
          description: 'Full access',
        },
        update: {
          description: 'Full access',
        },
      }),
      prisma.role.upsert({
        where: {
          name: 'REGISTRAR',
        },
        create: {
          name: 'REGISTRAR',
          description: 'Registrar access',
        },
        update: {
          description: 'Registrar access',
        },
      }),
      prisma.role.upsert({
        where: {
          name: 'TEACHER',
        },
        create: {
          name: 'TEACHER',
          description: 'Teacher access',
        },
        update: {
          description: 'Teacher access',
        },
      }),
    ]);

    await prisma.rolePermission.createMany({
      data: Object.values(permissionsByCode).map((permission) => ({
        roleId: superAdminRole.id,
        permissionId: permission.id,
      })),
      skipDuplicates: true,
    });

    const [adminPassword, teacherPassword] = await Promise.all([
      bcrypt.hash('AdminPass123', 10),
      bcrypt.hash('TeacherPass123', 10),
    ]);

    const adminUser = await prisma.user.create({
      data: {
        email: `admin.integration.${uniqueSuffix}@example.com`,
        password: adminPassword,
        fullName: 'Integration Admin',
      },
    });

    const adviserUser = await prisma.user.create({
      data: {
        email: `teacher.integration.${uniqueSuffix}@example.com`,
        password: teacherPassword,
        fullName: 'Integration Adviser',
      },
    });

    await prisma.userRole.createMany({
      data: [
        {
          userId: adminUser.id,
          roleId: superAdminRole.id,
        },
        {
          userId: adviserUser.id,
          roleId: teacherRole.id,
        },
      ],
    });

    const schoolYear = await prisma.schoolYear.create({
      data: {
        year: `2030-2031-${uniqueSuffix}`,
        isActive: true,
      },
    });

    const gradeLevel = await prisma.gradeLevel.create({
      data: {
        code: `G10-IT-${uniqueSuffix}`,
        name: `Grade 10 Integration ${uniqueSuffix}`,
        order: 10,
        isActive: true,
      },
    });

    const curriculum = await prisma.curriculum.create({
      data: {
        name: `Integration Curriculum ${uniqueSuffix}`,
      },
    });

    const curriculumVersion = await prisma.curriculumVersion.create({
      data: {
        curriculumId: curriculum.id,
        name: `Integration Curriculum 2030 ${uniqueSuffix}`,
        effectiveFrom: 2030,
      },
    });

    const section = await prisma.section.create({
      data: {
        name: `Diamond-${uniqueSuffix}`,
        gradeLevelId: gradeLevel.id,
        schoolYearId: schoolYear.id,
        adviserId: adviserUser.id,
      },
    });

    const student = await prisma.student.create({
      data: {
        lrn: `LRN${Date.now()}`,
        firstName: 'Test',
        middleName: 'Flow',
        lastName: 'Student',
        gender: 'Male',
        birthDate: new Date('2010-01-01T00:00:00.000Z'),
        address: 'Integration City',
      },
    });

    const subject = await prisma.subject.create({
      data: {
        curriculumVersionId: curriculumVersion.id,
        gradeLevelId: gradeLevel.id,
        code: `MATH10-${uniqueSuffix}`,
        name: `Mathematics 10 ${uniqueSuffix}`,
        order: 1,
      },
    });

    return {
      adminUser,
      adviserUser,
      registrarRole,
      schoolYear,
      gradeLevel,
      curriculumVersion,
      section,
      student,
      subject,
    };
  };

  const seeded = await seed();

  const loginAndGetToken = async (email, password) => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email, password });

    assert.equal(response.status, 200);
    assert.equal(typeof response.body.data.token, 'string');
    return response.body.data.token;
  };

  let createdEnrollmentId;
  let createdDocumentId;

  await t.test('login flow returns JWT and role metadata from Prisma data', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: seeded.adminUser.email,
        password: 'AdminPass123',
      });

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
    assert.equal(response.body.data.user.email, seeded.adminUser.email);
    assert.deepEqual(response.body.data.user.roles, ['SUPER_ADMIN']);
    assert.ok(response.body.data.user.permissions.includes('user.create'));
    assert.ok(response.body.data.user.permissions.includes('sf10.export'));
    assert.equal(typeof response.body.data.token, 'string');
  });

  await t.test('register flow creates a user, hashes password, and assigns roles', async () => {
    const adminToken = await loginAndGetToken(seeded.adminUser.email, 'AdminPass123');

    const response = await request(app)
      .post('/api/auth/register')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: `new.registrar.${uniqueSuffix}@example.com`,
        password: 'RegistrarPass123',
        fullName: 'New Registrar',
        roleIds: [seeded.registrarRole.id],
      });

    assert.equal(response.status, 201);
    assert.equal(response.body.success, true);
    assert.equal(response.body.data.user.email, `new.registrar.${uniqueSuffix}@example.com`);
    assert.deepEqual(response.body.data.user.roles, ['REGISTRAR']);

    const createdUser = await prisma.user.findUnique({
      where: {
        email: `new.registrar.${uniqueSuffix}@example.com`,
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    assert.ok(createdUser);
    assert.notEqual(createdUser.password, 'RegistrarPass123');
    assert.equal(await bcrypt.compare('RegistrarPass123', createdUser.password), true);
    assert.deepEqual(createdUser.roles.map((entry) => entry.role.name), ['REGISTRAR']);
  });

  await t.test('enrollment creation flow writes an active enrollment through the API', async () => {
    const adminToken = await loginAndGetToken(seeded.adminUser.email, 'AdminPass123');

    const response = await request(app)
      .post('/api/enrollments/create')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        studentId: seeded.student.id,
        schoolYearId: seeded.schoolYear.id,
        curriculumVersionId: seeded.curriculumVersion.id,
        gradeLevelId: seeded.gradeLevel.id,
        sectionId: seeded.section.id,
      });

    assert.equal(response.status, 201);
    assert.equal(response.body.success, true);
    assert.equal(response.body.data.status, 'ACTIVE');

    createdEnrollmentId = response.body.data.id;

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        id: createdEnrollmentId,
      },
    });

    assert.ok(enrollment);
    assert.equal(enrollment.studentId, seeded.student.id);
    assert.equal(enrollment.sectionId, seeded.section.id);
    assert.equal(enrollment.status, 'ACTIVE');
  });

  await t.test('grade upsert flow stores quarters and auto-computes FINAL grade', async () => {
    const adviserToken = await loginAndGetToken(seeded.adviserUser.email, 'TeacherPass123');

    const response = await request(app)
      .post(`/api/grades/enrollment/${createdEnrollmentId}`)
      .set('Authorization', `Bearer ${adviserToken}`)
      .send({
        grades: [
          { subjectId: seeded.subject.id, period: 'Q1', value: 85 },
          { subjectId: seeded.subject.id, period: 'Q2', value: 87 },
          { subjectId: seeded.subject.id, period: 'Q3', value: 89 },
          { subjectId: seeded.subject.id, period: 'Q4', value: 91 },
        ],
      });

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);

    const storedGrades = await prisma.grade.findMany({
      where: {
        enrollmentId: createdEnrollmentId,
        subjectId: seeded.subject.id,
      },
      orderBy: {
        period: 'asc',
      },
    });

    assert.equal(storedGrades.length, 5);

    const finalGrade = storedGrades.find((grade) => grade.period === 'FINAL');
    assert.ok(finalGrade);
    assert.equal(finalGrade.value, 88);
  });

  await t.test('system settings management persists settings through the API', async () => {
    const adminToken = await loginAndGetToken(seeded.adminUser.email, 'AdminPass123');

    const updateResponse = await request(app)
      .put('/api/system-settings/school_name')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        value: 'Integration National High School',
      });

    assert.equal(updateResponse.status, 200);
    assert.equal(updateResponse.body.success, true);
    assert.equal(updateResponse.body.data.key, 'school_name');

    const bulkResponse = await request(app)
      .patch('/api/system-settings')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        settings: [
          { key: 'school_principal', value: 'Principal Integration' },
          { key: 'school_region', value: 'NCR' },
        ],
      });

    assert.equal(bulkResponse.status, 200);
    assert.equal(bulkResponse.body.success, true);
    assert.equal(bulkResponse.body.data.length, 2);

    const listResponse = await request(app)
      .get('/api/system-settings')
      .set('Authorization', `Bearer ${adminToken}`);

    assert.equal(listResponse.status, 200);
    assert.ok(listResponse.body.data.some((setting) => setting.key === 'school_name'));
  });

  await t.test('document lifecycle uploads, lists, fetches, and soft deletes documents', async () => {
    const adminToken = await loginAndGetToken(seeded.adminUser.email, 'AdminPass123');

    const createResponse = await request(app)
      .post('/api/documents')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        studentId: seeded.student.id,
        enrollmentId: createdEnrollmentId,
        type: 'FORM_137',
        fileUrl: `https://example.com/files/${uniqueSuffix}.pdf`,
      });

    assert.equal(createResponse.status, 201);
    assert.equal(createResponse.body.success, true);
    createdDocumentId = createResponse.body.data.id;

    const listResponse = await request(app)
      .get(`/api/documents?studentId=${seeded.student.id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    assert.equal(listResponse.status, 200);
    assert.ok(listResponse.body.data.some((document) => document.id === createdDocumentId));

    const singleResponse = await request(app)
      .get(`/api/documents/${createdDocumentId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    assert.equal(singleResponse.status, 200);
    assert.equal(singleResponse.body.data.type, 'FORM_137');

    const deleteResponse = await request(app)
      .delete(`/api/documents/${createdDocumentId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    assert.equal(deleteResponse.status, 200);
    assert.equal(deleteResponse.body.success, true);

    const deletedDocument = await prisma.document.findUnique({
      where: {
        id: createdDocumentId,
      },
    });

    assert.ok(deletedDocument?.deletedAt);
  });

  await t.test('sf10 view, generate, and export endpoints return the compiled student record', async () => {
    const adminToken = await loginAndGetToken(seeded.adminUser.email, 'AdminPass123');

    const viewResponse = await request(app)
      .get(`/api/sf10/student/${seeded.student.id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    assert.equal(viewResponse.status, 200);
    assert.equal(viewResponse.body.data.student.id, seeded.student.id);
    assert.equal(viewResponse.body.data.academicHistory.length, 1);

    const generateResponse = await request(app)
      .get(`/api/sf10/student/${seeded.student.id}/generate`)
      .set('Authorization', `Bearer ${adminToken}`);

    assert.equal(generateResponse.status, 200);
    assert.equal(generateResponse.body.success, true);
    assert.equal(
      generateResponse.body.data.schoolProfile.school_name,
      'Integration National High School'
    );

    const exportResponse = await request(app)
      .get(`/api/sf10/student/${seeded.student.id}/export`)
      .set('Authorization', `Bearer ${adminToken}`);

    assert.equal(exportResponse.status, 200);
    assert.match(
      exportResponse.headers['content-disposition'],
      /attachment; filename="sf10-/
    );
    assert.match(exportResponse.text, /Integration National High School/);
  });

  await t.test('audit log endpoints expose recorded write and sf10 events', async () => {
    const adminToken = await loginAndGetToken(seeded.adminUser.email, 'AdminPass123');

    const listResponse = await request(app)
      .get('/api/audit-logs?entity=SF10')
      .set('Authorization', `Bearer ${adminToken}`);

    assert.equal(listResponse.status, 200);
    assert.ok(listResponse.body.count >= 2);
    assert.ok(listResponse.body.data.some((log) => log.action === 'GENERATE'));

    const exportResponse = await request(app)
      .get('/api/audit-logs/export?entity=SF10')
      .set('Authorization', `Bearer ${adminToken}`);

    assert.equal(exportResponse.status, 200);
    assert.match(exportResponse.headers['content-disposition'], /audit-logs-/);
    assert.match(exportResponse.text, /GENERATE/);
    assert.match(exportResponse.text, /SF10/);
  });

  t.after(async () => {
    await disconnectDB();
    await destroyIsolatedTestDatabase(dbContext);
  });
});
