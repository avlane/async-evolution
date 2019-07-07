'use strict';

const assert = require('assert');
const { test } = require('./harness');
const { mapLimit } = require('../src/pool');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

test('mapLimit: keeps input order', async () => {
  const out = await mapLimit([30, 5, 15, 1], 2, async ms => {
    await sleep(ms);
    return ms * 2;
  });
  assert.deepStrictEqual(out, [60, 10, 30, 2]);
});

test('mapLimit: never exceeds the limit', async () => {
  let active = 0;
  let peak = 0;
  await mapLimit(new Array(12).fill(0), 3, async () => {
    active++;
    peak = Math.max(peak, active);
    await sleep(5);
    active--;
  });
  assert.strictEqual(peak, 3);
});

test('mapLimit: empty input and huge limits', async () => {
  assert.deepStrictEqual(await mapLimit([], 4, async x => x), []);
  assert.deepStrictEqual(await mapLimit([1, 2], Infinity, async x => x + 1), [2, 3]);
});

test('mapLimit: rejects when a call fails', async () => {
  await assert.rejects(mapLimit([1, 2, 3], 2, async x => {
    if (x === 2) throw new Error('boom');
    return x;
  }), /boom/);
});
