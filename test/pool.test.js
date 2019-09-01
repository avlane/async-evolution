'use strict';

const assert = require('assert');
const { test } = require('./harness');
const { settleLimit } = require('../src/pool');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

test('settleLimit: keeps input order', async () => {
  const out = await settleLimit([30, 5, 15, 1], 2, async ms => {
    await sleep(ms);
    return ms * 2;
  });
  assert.deepStrictEqual(out.map(o => o.value), [60, 10, 30, 2]);
  assert.ok(out.every(o => o.status === 'fulfilled'));
});

test('settleLimit: never exceeds the limit', async () => {
  let active = 0;
  let peak = 0;
  await settleLimit(new Array(12).fill(0), 3, async () => {
    active++;
    peak = Math.max(peak, active);
    await sleep(5);
    active--;
  });
  assert.strictEqual(peak, 3);
});

test('settleLimit: empty input and huge limits', async () => {
  assert.deepStrictEqual(await settleLimit([], 4, async x => x), []);
  const out = await settleLimit([1, 2], Infinity, async x => x + 1);
  assert.deepStrictEqual(out.map(o => o.value), [2, 3]);
});

test('settleLimit: failures are recorded, not thrown', async () => {
  const out = await settleLimit([1, 2, 3], 2, async x => {
    if (x === 2) throw new Error('boom');
    return x;
  });
  assert.deepStrictEqual(out.map(o => o.status), ['fulfilled', 'rejected', 'fulfilled']);
  assert.strictEqual(out[1].reason.message, 'boom');
});
