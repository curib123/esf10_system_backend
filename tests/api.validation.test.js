import test from 'node:test';
import assert from 'node:assert/strict';

import request from 'supertest';

import app from '../src/app.js';
import { generateToken } from '../src/utils/jwt.util.js';

const createAuthHeader = ({
  userId = 1,
  roles = ['SUPER_ADMIN'],
  permissions = [],
} = {}) => `Bearer ${generateToken({ userId, roles, permissions })}`;

test('GET / returns the health payload', async () => {
  const response = await request(app)
    .get('/');

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.message, 'ESF10 API is running');
});

test('POST /api/auth/login rejects malformed payloads', async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'not-an-email',
      password: '',
    });

  assert.equal(response.status, 400);
  assert.equal(response.body.code, 'VALIDATION_ERROR');
  assert.equal(response.body.message, 'Invalid body');
  assert.ok(Array.isArray(response.body.details));
});

test('POST /api/auth/register validates admin-created users before hitting services', async () => {
  const response = await request(app)
    .post('/api/auth/register')
    .set('Authorization', createAuthHeader({
      permissions: ['user.create'],
    }))
    .send({
      email: 'teacher@example.com',
      password: 'weak',
      fullName: '',
      roleIds: [],
    });

  assert.equal(response.status, 400);
  assert.equal(response.body.code, 'VALIDATION_ERROR');
  assert.ok(response.body.details.some((detail) => detail.path === 'password'));
});

test('GET /api/users rejects invalid query pagination values', async () => {
  const response = await request(app)
    .get('/api/users?page=0&limit=500')
    .set('Authorization', createAuthHeader({
      permissions: ['user.view'],
    }));

  assert.equal(response.status, 400);
  assert.equal(response.body.code, 'VALIDATION_ERROR');
  assert.ok(response.body.details.some((detail) => detail.path === 'page'));
});

test('PUT /api/users/:id rejects empty update payloads', async () => {
  const response = await request(app)
    .put('/api/users/2')
    .set('Authorization', createAuthHeader({
      permissions: ['user.update'],
    }))
    .send({});

  assert.equal(response.status, 400);
  assert.equal(response.body.code, 'VALIDATION_ERROR');
  assert.ok(response.body.details.some((detail) => detail.path === 'root'));
});

test('POST /api/enrollments/create requires a complete enrollment payload', async () => {
  const response = await request(app)
    .post('/api/enrollments/create')
    .set('Authorization', createAuthHeader({
      permissions: ['enrollment.create'],
    }))
    .send({
      studentId: 10,
      schoolYearId: 1,
      gradeLevelId: 7,
    });

  assert.equal(response.status, 400);
  assert.equal(response.body.code, 'VALIDATION_ERROR');
  assert.ok(response.body.details.some((detail) => detail.path === 'curriculumVersionId'));
});

test('POST /api/grades/enrollment/:id rejects invalid grading payloads', async () => {
  const response = await request(app)
    .post('/api/grades/enrollment/3')
    .set('Authorization', createAuthHeader({
      roles: ['TEACHER'],
      permissions: ['grades.view'],
    }))
    .send({
      grades: [
        {
          subjectId: 99,
          period: 'FINAL',
          value: 150,
        },
      ],
    });

  assert.equal(response.status, 400);
  assert.equal(response.body.code, 'VALIDATION_ERROR');
  assert.ok(response.body.details.some((detail) => detail.path === 'grades.0.period'));
});

test('GET /api/grades/summary validates required query params', async () => {
  const response = await request(app)
    .get('/api/grades/summary?sectionId=1&period=Q1')
    .set('Authorization', createAuthHeader({
      roles: ['TEACHER'],
      permissions: ['grades.view'],
    }));

  assert.equal(response.status, 400);
  assert.equal(response.body.code, 'VALIDATION_ERROR');
  assert.ok(response.body.details.some((detail) => detail.path === 'subjectId'));
});
