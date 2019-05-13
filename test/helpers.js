'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const made = [];

function removeAll(p) {
  if (fs.lstatSync(p).isDirectory()) {
    fs.readdirSync(p).forEach(name => removeAll(path.join(p, name)));
    fs.rmdirSync(p);
  } else {
    fs.unlinkSync(p);
  }
}

// files: { name: contents }. A null value creates a directory with that name,
// which is a handy way to get a "file" that cannot be read.
function makeDir(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'async-evo-'));
  made.push(dir);
  for (const [name, content] of Object.entries(files)) {
    const p = path.join(dir, name);
    if (content === null) fs.mkdirSync(p);
    else fs.writeFileSync(p, content);
  }
  return dir;
}

process.on('exit', () => made.forEach(removeAll));

module.exports = { makeDir };
