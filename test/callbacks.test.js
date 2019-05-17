'use strict';

const assert = require('assert');
const { test } = require('./harness');
const { makeDir } = require('./helpers');
const { processDir } = require('../src/callbacks');

function promised(dir) {
  return new Promise((resolve, reject) => {
    processDir(dir, (err, outcome) => (err ? reject(err) : resolve(outcome)));
  });
}

test('callbacks: analyzes the text files', async () => {
  const dir = makeDir({ 'b.txt': 'x y z\n', 'a.txt': 'hello\n', 'skip.md': 'ignored' });
  const { results, errors } = await promised(dir);
  assert.deepStrictEqual(results, [
    { file: 'a.txt', lines: 1, words: 1, chars: 6 },
    { file: 'b.txt', lines: 1, words: 3, chars: 6 }
  ]);
  assert.deepStrictEqual(errors, []);
});

test('callbacks: unreadable files end up in errors', async () => {
  const dir = makeDir({ 'good.txt': 'a b\n', 'broken.txt': null, 'also-broken.txt': null });
  const { results, errors } = await promised(dir);
  assert.deepStrictEqual(results.map(r => r.file), ['good.txt']);
  assert.deepStrictEqual(errors.map(e => e.file), ['also-broken.txt', 'broken.txt']);
  assert.strictEqual(errors[0].message, 'EISDIR');
});

test('callbacks: a missing directory is an error', async () => {
  await assert.rejects(promised('/definitely/not/here'), { code: 'ENOENT' });
});
