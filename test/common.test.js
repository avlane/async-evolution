'use strict';

const assert = require('assert');
const { test } = require('./harness');
const { analyze, isTextFile } = require('../src/common');

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
