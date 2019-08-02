'use strict';

const fs = require('fs');
const path = require('path');
const { analyze, isTextFile, errorEntry, collect } = require('./common');
const { analyzeStream } = require('./stream-count');
const { withTimeout } = require('./timeout');
const { mapLimit } = require('./pool');

const { readdir, readFile } = fs.promises;

async function analyzeFile(dir, name, opts) {
  const file = path.join(dir, name);
  const stats = opts.stream ? await analyzeStream(file) : analyze(await readFile(file, 'utf8'));
  return Object.assign({ file: name }, stats);
}

// opts.limit: maximum number of files read at the same time (default: all).
// opts.stream: count lines while streaming instead of reading whole files.
// opts.timeout: milliseconds a single file may take before it is reported as an error.
async function processDir(dir, opts = {}) {
  const names = await readdir(dir);
  const outcomes = await mapLimit(names.filter(isTextFile), opts.limit || Infinity, async name => {
    try {
      const work = analyzeFile(dir, name, opts);
      return { result: opts.timeout ? await withTimeout(work, opts.timeout, name) : await work };
    } catch (err) {
      return { error: errorEntry(name, err) };
    }
  });
  return collect(outcomes);
}

module.exports = { processDir };
