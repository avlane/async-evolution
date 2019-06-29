'use strict';

const fs = require('fs');
const path = require('path');
const { isTextFile, fileResult, errorEntry, finish } = require('./common');

// callback(err, { results, errors })
function processDir(dir, callback) {
  fs.readdir(dir, (err, names) => {
    if (err) return callback(err);
    const files = names.filter(isTextFile);
    const results = [];
    const errors = [];
    let pending = files.length;
    if (pending === 0) return callback(null, finish(results, errors));
    files.forEach(name => {
      fs.readFile(path.join(dir, name), 'utf8', (err, text) => {
        if (err) errors.push(errorEntry(name, err));
        else results.push(fileResult(name, text));
        pending--;
        if (pending === 0) callback(null, finish(results, errors));
      });
    });
  });
}

module.exports = { processDir };
