'use strict';

const callbacks = require('./callbacks');
const promises = require('./promises');

function fromCallback(fn) {
  return dir => new Promise((resolve, reject) => {
    fn(dir, (err, outcome) => (err ? reject(err) : resolve(outcome)));
  });
}

// Every implementation is exposed as run(dir, opts) -> Promise<{ results, errors }>.
const implementations = {
  callbacks: fromCallback(callbacks.processDir),
  promises: promises.processDir
};

function run(name, dir, opts) {
  if (!implementations[name]) throw new Error(`unknown implementation: ${name}`);
  return implementations[name](dir, opts || {});
}

module.exports = { implementations, run, names: Object.keys(implementations) };
