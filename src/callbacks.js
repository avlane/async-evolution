'use strict';

const fs = require('fs');
const path = require('path');
const { analyze, isTextFile } = require('./common');

// callback(err, results) where results is a list of { file, lines, words, chars }.
function processDir(dir, callback) {
  fs.readdir(dir, (err, names) => {
    if (err) return callback(err);
    const files = names.filter(isTextFile).sort();
    const results = [];
    (function next(i) {
      if (i === files.length) return callback(null, results);
      fs.readFile(path.join(dir, files[i]), 'utf8', (err, text) => {
        if (err) return callback(err);
        results.push(Object.assign({ file: files[i] }, analyze(text)));
        next(i + 1);
      });
    })(0);
  });
}

module.exports = { processDir };
