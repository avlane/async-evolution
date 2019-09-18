#!/usr/bin/env node
'use strict';

const { run, names } = require('../src');
const { formatReport } = require('../src/common');

function usage() {
  console.error(`usage: run.js [--impl ${names.join('|')}] [--json] [--limit n] [--stream] [--timeout ms] <directory>`);
  process.exit(1);
}

function positiveInt(value) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) usage();
  return n;
}

const args = process.argv.slice(2);
let impl = 'async';
let json = false;
const opts = {};
const rest = [];
for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '--impl': impl = args[++i]; break;
    case '--json': json = true; break;
    case '--stream': opts.stream = true; break;
    case '--limit': opts.limit = positiveInt(args[++i]); break;
    case '--timeout': opts.timeout = positiveInt(args[++i]); break;
    default: rest.push(args[i]);
  }
}
if (rest.length !== 1 || !names.includes(impl)) usage();

run(impl, rest[0], opts).then(outcome => {
  console.log(json ? JSON.stringify(outcome, null, 2) : formatReport(outcome));
  if (outcome.errors.length > 0) process.exitCode = 2;
}, err => {
  console.error('error: ' + err.message);
  process.exitCode = 1;
});
