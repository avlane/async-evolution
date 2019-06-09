'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const { isTextFile, fileResult, errorEntry, finish } = require('./common');

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

function processDir(dir) {
  return readdir(dir)
    .then(names => Promise.all(names.filter(isTextFile).map(name =>
      readFile(path.join(dir, name), 'utf8').then(
        text => ({ result: fileResult(name, text) }),
        err => ({ error: errorEntry(name, err) })
      )
    )))
    .then(outcomes => finish(
      outcomes.filter(o => o.result).map(o => o.result),
      outcomes.filter(o => o.error).map(o => o.error)
    ));
}

module.exports = { processDir };
