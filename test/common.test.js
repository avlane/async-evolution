'use strict';

const assert = require('assert');
const { test } = require('./harness');
const { analyze, isTextFile, totals, formatReport } = require('../src/common');

test('analyze: empty text', () => {
  assert.deepStrictEqual(analyze(''), { lines: 0, words: 0, chars: 0 });
});

test('analyze: trailing newline does not add a line', () => {
  assert.deepStrictEqual(analyze('one two\nthree\n'), { lines: 2, words: 3, chars: 14 });
});

test('analyze: no trailing newline', () => {
  assert.deepStrictEqual(analyze('one two\nthree'), { lines: 2, words: 3, chars: 13 });
});

test('analyze: blank lines count, extra spaces do not make words', () => {
  assert.deepStrictEqual(analyze('a   b\n\n\nc\n'), { lines: 4, words: 3, chars: 10 });
});

test('isTextFile', () => {
  assert.strictEqual(isTextFile('notes.txt'), true);
  assert.strictEqual(isTextFile('NOTES.TXT'), true);
  assert.strictEqual(isTextFile('notes.txt.bak'), false);
  assert.strictEqual(isTextFile('txt'), false);
});

test('totals: sums every column', () => {
  const t = totals([
    { file: 'a', lines: 1, words: 2, chars: 3 },
    { file: 'b', lines: 10, words: 20, chars: 30 }
  ]);
  assert.deepStrictEqual(t, { files: 2, lines: 11, words: 22, chars: 33 });
});

test('formatReport: rows, total and errors', () => {
  const report = formatReport({
    results: [{ file: 'a.txt', lines: 2, words: 4, chars: 24 }],
    errors: [{ file: 'b.txt', message: 'EISDIR' }]
  });
  const lines = report.split('\n');
  assert.strictEqual(lines.length, 3);
  assert.ok(/^a\.txt\s+2 lines\s+4 words\s+24 chars$/.test(lines[0]), lines[0]);
  assert.ok(/^TOTAL \(1 files\)\s+2 lines/.test(lines[1]), lines[1]);
  assert.strictEqual(lines[2], 'error: b.txt: EISDIR');
});
