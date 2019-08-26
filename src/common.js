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

// Turn [{ result } | { error }] into the shared { results, errors } shape.
function collect(outcomes) {
  return finish(
    outcomes.filter(o => o.result).map(o => o.result),
    outcomes.filter(o => o.error).map(o => o.error)
  );
}

// For Promise.allSettled output: names[i] is the file behind settled[i].
function collectSettled(names, settled) {
  const results = [];
  const errors = [];
  settled.forEach((s, i) => {
    if (s.status === 'fulfilled') results.push(s.value);
    else errors.push(errorEntry(names[i], s.reason));
  });
  return finish(results, errors);
}

function totals(results) {
  return results.reduce((t, r) => ({
    files: t.files + 1,
    lines: t.lines + r.lines,
    words: t.words + r.words,
    chars: t.chars + r.chars
  }), { files: 0, lines: 0, words: 0, chars: 0 });
}

function row(label, r) {
  return `${label.padEnd(20)} ${String(r.lines).padStart(6)} lines ${String(r.words).padStart(7)} words ${String(r.chars).padStart(8)} chars`;
}

function formatReport(outcome) {
  const out = outcome.results.map(r => row(r.file, r));
  out.push(row(`TOTAL (${outcome.results.length} files)`, totals(outcome.results)));
  for (const e of outcome.errors) out.push(`error: ${e.file}: ${e.message}`);
  return out.join('\n');
}

module.exports = { analyze, isTextFile, fileResult, errorEntry, finish, collect, collectSettled, totals, formatReport };
