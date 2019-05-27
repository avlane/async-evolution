#!/usr/bin/env node
'use strict';

const { run, names } = require('../src');
const { formatReport } = require('../src/common');

function usage() {
  console.error(`usage: run.js [--impl ${names.join('|')}] <directory>`);
  process.exit(1);
}

const args = process.argv.slice(2);
let impl = 'callbacks';
const rest = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--impl') impl = args[++i];
  else rest.push(args[i]);
}
if (rest.length !== 1 || !names.includes(impl)) usage();

run(impl, rest[0]).then(outcome => {
  console.log(formatReport(outcome));
}, err => {
  console.error('error: ' + err.message);
  process.exitCode = 1;
});
