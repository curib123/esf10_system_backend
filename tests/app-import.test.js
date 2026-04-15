import test from 'node:test';
import assert from 'node:assert/strict';

import app from '../src/app.js';

test('app imports successfully', () => {
  assert.equal(typeof app, 'function');
  assert.equal(typeof app.use, 'function');
});
