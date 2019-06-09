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

test('promises: unreadable files end up in errors', () => {
  const dir = makeDir({ 'good.txt': 'a b\n', 'broken.txt': null, 'also-broken.txt': null });
  return processDir(dir).then(({ results, errors }) => {
    assert.deepStrictEqual(results.map(r => r.file), ['good.txt']);
    assert.deepStrictEqual(errors.map(e => e.file), ['also-broken.txt', 'broken.txt']);
  });
});

test('promises: a missing directory rejects', () => {
  return assert.rejects(processDir('/definitely/not/here'), { code: 'ENOENT' });
});
