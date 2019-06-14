'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const { isTextFile, fileResult, errorEntry, collect } = require('./common');

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

async function processDir(dir) {
  const names = await readdir(dir);
  const outcomes = await Promise.all(names.filter(isTextFile).map(async name => {
    try {
      return { result: fileResult(name, await readFile(path.join(dir, name), 'utf8')) };
    } catch (err) {
      return { error: errorEntry(name, err) };
    }
  }));
  return collect(outcomes);
}

module.exports = { processDir };
