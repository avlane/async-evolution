'use strict';

// Usage: node bench/compare.js [files] [lines per file]
const fs = require('fs');
const os = require('os');
const path = require('path');
const { run, names } = require('../src');

const FILES = Number(process.argv[2]) || 200;
const LINES = Number(process.argv[3]) || 2000;
const LINE = 'the quick brown fox jumps over the lazy dog\n';

function makeFixtures() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'async-evo-bench-'));
  const body = LINE.repeat(LINES);
  for (let i = 0; i < FILES; i++) fs.writeFileSync(path.join(dir, `file-${i}.txt`), body);
  return dir;
}

function cleanUp(dir) {
  fs.readdirSync(dir).forEach(name => fs.unlinkSync(path.join(dir, name)));
  fs.rmdirSync(dir);
}

async function time(label, fn) {
  await fn(); // warm up the file cache
  const start = process.hrtime.bigint();
  const outcome = await fn();
  const ms = Number(process.hrtime.bigint() - start) / 1e6;
  console.log(`${label.padEnd(16)} ${ms.toFixed(1).padStart(9)} ms   ${outcome.results.length} files`);
}

async function main() {
  const dir = makeFixtures();
  console.log(`${FILES} files x ${LINES} lines`);
  try {
    for (const name of names) await time(name, () => run(name, dir));
    await time('async (stream)', () => run('async', dir, { stream: true }));
    await time('async (limit 8)', () => run('async', dir, { limit: 8 }));
  } finally {
    cleanUp(dir);
  }
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
