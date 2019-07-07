'use strict';

// Map items through an async fn, running at most `limit` calls at a time.
// Results keep the order of the input. Rejects on the first failure.
function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;

  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  }

  const workers = [];
  const count = Math.min(limit, items.length);
  for (let w = 0; w < count; w++) workers.push(worker());
  return Promise.all(workers).then(() => results);
}

module.exports = { mapLimit };
