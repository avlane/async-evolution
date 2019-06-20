'use strict';

const assert = require('assert');
const { test } = require('./harness');
const { makeDir } = require('./helpers');
const { run, names } = require('../src');

const FILES = {
  'b.txt': 'one\n\nthree words here',
  'a.txt': 'hello world\nsecond line\n',
  'empty.txt': '',
  'notes.md': 'not a text file'
};

for (const name of names) {
  test(`${name}: analyzes every .txt file, sorted by name`, async () => {
    const { results, errors } = await run(name, makeDir(FILES));
    assert.deepStrictEqual(results, [
      { file: 'a.txt', lines: 2, words: 4, chars: 24 },
      { file: 'b.txt', lines: 3, words: 4, chars: 21 },
      { file: 'empty.txt', lines: 0, words: 0, chars: 0 }
    ]);
    assert.deepStrictEqual(errors, []);
  });

  test(`${name}: unreadable files end up in errors`, async () => {
    const dir = makeDir({ 'good.txt': 'a b\n', 'broken.txt': null, 'also-broken.txt': null });
    const { results, errors } = await run(name, dir);
    assert.deepStrictEqual(results.map(r => r.file), ['good.txt']);
    assert.deepStrictEqual(errors, [
      { file: 'also-broken.txt', message: 'EISDIR' },
      { file: 'broken.txt', message: 'EISDIR' }
    ]);
  });

  test(`${name}: a missing directory rejects`, async () => {
    await assert.rejects(run(name, '/definitely/not/here'), { code: 'ENOENT' });
  });

  test(`${name}: an unknown file extension is skipped even in upper case`, async () => {
    const { results } = await run(name, makeDir({ 'UP.TXT': 'x\n', 'x.txt.bak': 'y\n' }));
    assert.deepStrictEqual(results.map(r => r.file), ['UP.TXT']);
  });
}
