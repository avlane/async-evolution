'use strict';

const assert = require('assert');
const { test } = require('./harness');
const { makeDir } = require('./helpers');
const { processDir } = require('../src/promises');

test('promises: analyzes the text files', () => {
  const dir = makeDir({ 'b.txt': 'x y z\n', 'a.txt': 'hello\n', 'skip.md': 'ignored' });
  return processDir(dir).then(({ results, errors }) => {
    assert.deepStrictEqual(results, [
      { file: 'a.txt', lines: 1, words: 1, chars: 6 },
      { file: 'b.txt', lines: 1, words: 3, chars: 6 }
    ]);
    assert.deepStrictEqual(errors, []);
  });
});

test('promises: one unreadable file rejects the run', () => {
  const dir = makeDir({ 'good.txt': 'a b\n', 'broken.txt': null });
  return assert.rejects(processDir(dir), { code: 'EISDIR' });
});
