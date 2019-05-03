'use strict';

// Count lines, words and characters in a piece of text. A trailing newline
// does not start a new line.
function analyze(text) {
  let lines = 0;
  if (text !== '') {
    lines = text.split('\n').length - (text.endsWith('\n') ? 1 : 0);
  }
  const words = (text.match(/\S+/g) || []).length;
  return { lines, words, chars: text.length };
}

function isTextFile(name) {
  return /\.txt$/i.test(name);
}

module.exports = { analyze, isTextFile };
