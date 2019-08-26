'use strict';

const fs = require('fs');
const path = require('path');
const { isTextFile, fileResult, collectSettled } = require('./common');

const { readdir, readFile } = fs.promises;

function processDir(dir) {
  return readdir(dir).then(all => {
    const names = all.filter(isTextFile);
    return Promise.allSettled(names.map(name =>
      readFile(path.join(dir, name), 'utf8').then(text => fileResult(name, text))
    )).then(settled => collectSettled(names, settled));
  });
}

module.exports = { processDir };
