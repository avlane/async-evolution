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

function byFile(a, b) {
  if (a.file < b.file) return -1;
  return a.file > b.file ? 1 : 0;
}

function fileResult(name, text) {
  return Object.assign({ file: name }, analyze(text));
}

function errorEntry(name, err) {
  return { file: name, message: err.code || err.message };
}

// Every implementation resolves to this shape.
function finish(results, errors) {
  return { results: results.slice().sort(byFile), errors: errors.slice().sort(byFile) };
}

module.exports = { analyze, isTextFile, fileResult, errorEntry, finish };
