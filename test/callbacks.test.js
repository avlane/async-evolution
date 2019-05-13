'use strict';

const assert = require('assert');
const { test } = require('./harness');
const { makeDir } = require('./helpers');
const { processDir } = require('../src/callbacks');

test('callbacks: analyzes the text files', () => {
  const dir = makeDir({ 'b.txt': 'x y z\n', 'a.txt': 'hello\n', 'skip.md': 'ignored' });
  return new Promise((resolve, reject) => {
    processDir(dir, (err, results) => {
      if (err) return reject(err);
      try {
        assert.deepStrictEqual(results, [
          { file: 'a.txt', lines: 1, words: 1, chars: 6 },
          { file: 'b.txt', lines: 1, words: 3, chars: 6 }
        ]);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  });
});

test('callbacks: a missing directory is an error', () => {
  return new Promise((resolve, reject) => {
    processDir('/definitely/not/here', err => {
      if (err && err.code === 'ENOENT') resolve();
      else reject(new Error('expected ENOENT, got ' + err));
    });
  });
});
