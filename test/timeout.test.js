'use strict';

const assert = require('assert');
const { test } = require('./harness');
const { makeDir } = require('./helpers');
const { withTimeout } = require('../src/timeout');
const { run } = require('../src');

test('withTimeout: passes the value through', async () => {
  assert.strictEqual(await withTimeout(Promise.resolve(42), 1000, 'x'), 42);
});

test('withTimeout: rejects work that never finishes', async () => {
  await assert.rejects(withTimeout(new Promise(() => {}), 20, 'slow.txt'), /slow\.txt timed out after 20ms/);
});

test('withTimeout: keeps the original rejection', async () => {
  await assert.rejects(withTimeout(Promise.reject(new Error('disk on fire')), 1000, 'x'), /disk on fire/);
});

test('async: a generous timeout changes nothing', async () => {
  const dir = makeDir({ 'a.txt': 'one two\n' });
  const outcome = await run('async', dir, { timeout: 5000 });
  assert.deepStrictEqual(outcome.results, [{ file: 'a.txt', lines: 1, words: 2, chars: 8 }]);
});
