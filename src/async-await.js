'use strict';

const fs = require('fs');
const path = require('path');
const { isTextFile, fileResult, errorEntry, collect } = require('./common');
const { mapLimit } = require('./pool');

const { readdir, readFile } = fs.promises;

// opts.limit: maximum number of files read at the same time (default: all).
async function processDir(dir, opts = {}) {
  const names = await readdir(dir);
  const outcomes = await mapLimit(names.filter(isTextFile), opts.limit || Infinity, async name => {
    try {
      return { result: fileResult(name, await readFile(path.join(dir, name), 'utf8')) };
    } catch (err) {
      return { error: errorEntry(name, err) };
    }
  });
  return collect(outcomes);
}

module.exports = { processDir };
