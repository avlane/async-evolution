'use strict';

const assert = require('assert');
const { test } = require('./harness');
const { makeDir } = require('./helpers');
const { run } = require('../src');

test('stream: matches the in-memory analysis', async () => {
  const dir = makeDir({
    'plain.txt': 'one two\nthree\n',
    'no-newline.txt': 'one two\nthree',
    'blank-lines.txt': '\n\na\n\n',
    'unicode.txt': 'héllo wörld\n☃ snow\n',
    'crlf.txt': 'a b\r\nc d\r\n',
    'empty.txt': '',
    'big.txt': 'lorem ipsum dolor sit amet\n'.repeat(5000)
  });
  const normal = await run('async', dir);
  const streamed = await run('async', dir, { stream: true });
  assert.deepStrictEqual(streamed, normal);
  assert.strictEqual(streamed.results.length, 7);
});

test('stream: unreadable files are still reported as errors', async () => {
  const dir = makeDir({ 'ok.txt': 'a\n', 'broken.txt': null });
  const { results, errors } = await run('async', dir, { stream: true });
  assert.deepStrictEqual(results.map(r => r.file), ['ok.txt']);
  assert.deepStrictEqual(errors.map(e => e.file), ['broken.txt']);
});
