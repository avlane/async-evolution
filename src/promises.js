'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const { isTextFile, fileResult, errorEntry, collect } = require('./common');

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
    .then(collect);
}

module.exports = { processDir };
