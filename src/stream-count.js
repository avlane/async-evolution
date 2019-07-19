'use strict';

const fs = require('fs');
const readline = require('readline');

// Same numbers as analyze(), computed line by line. Only \n and \r\n are
// expected as line endings.
async function analyzeStream(file) {
  const input = fs.createReadStream(file, { encoding: 'utf8' });
  let chars = 0;
  input.on('data', chunk => { chars += chunk.length; });
  const rl = readline.createInterface({ input, crlfDelay: Infinity });
  let lines = 0;
  let words = 0;
  for await (const line of rl) {
    lines++;
    words += (line.match(/\S+/g) || []).length;
  }
  return { lines, words, chars };
}

module.exports = { analyzeStream };
