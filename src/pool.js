'use strict';

// Like Promise.allSettled, but runs at most `limit` calls of fn at a time.
// Outcomes keep the order of the input.
function settleLimit(items, limit, fn) {
  const outcomes = new Array(items.length);
  let next = 0;

  async function worker() {
    while (next < items.length) {
      const i = next++;
      try {
        outcomes[i] = { status: 'fulfilled', value: await fn(items[i], i) };
      } catch (reason) {
        outcomes[i] = { status: 'rejected', reason };
      }
    }
  }

  const workers = [];
  const count = Math.min(limit, items.length);
  for (let w = 0; w < count; w++) workers.push(worker());
  return Promise.all(workers).then(() => outcomes);
}

module.exports = { settleLimit };
