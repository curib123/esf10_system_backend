import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeError } from '../src/utils/http.util.js';
import {
  getAuthenticatedUserId,
  parsePositiveInt,
} from '../src/utils/request.util.js';

test('parsePositiveInt accepts valid ids', () => {
  assert.equal(parsePositiveInt('42', 'userId'), 42);
});

test('parsePositiveInt rejects invalid ids', () => {
  assert.throws(
    () => parsePositiveInt('abc', 'userId'),
    (error) => error.code === 'INVALID_ID' && error.status === 400,
  );
});

test('getAuthenticatedUserId reads userId from JWT payload', () => {
  assert.equal(getAuthenticatedUserId({ user: { userId: 7 } }), 7);
});

test('normalizeError maps Prisma unique errors', () => {
  const error = normalizeError({ code: 'P2002' });

  assert.equal(error.status, 409);
  assert.equal(error.code, 'UNIQUE_CONSTRAINT');
});
