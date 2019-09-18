# async-evolution

One small job, written three times: read every `.txt` file in a directory
and report its lines, words and characters. First with callbacks, then with
promises, then with `async`/`await`. The point is to see how the same logic
changes shape.

Needs Node 12 or newer, no dependencies.

    node bin/run.js samples
    node bin/run.js --impl callbacks samples
    node bin/run.js --json --limit 4 samples
    npm test
    npm run bench

Options for the runner: `--impl` picks the implementation, `--json` prints the
raw result, `--limit`, `--stream` and `--timeout` are passed to the async
version. The exit status is 0 on success, 2 if some files could not be read
and 1 for usage errors or an unreadable directory.

All three implementations resolve to the same `{ results, errors }` shape and
`test/contract.test.js` runs one suite against each of them.

## What changed between the versions

**Callbacks** (`src/callbacks.js`). Fan out with `forEach` and keep a
`pending` counter to know when the last read finished. Every branch has to
remember to call back exactly once; the empty-directory bug (no files, so no
call) came straight from that.

**Promises** (`src/promises.js`). `Promise.all` replaces the counter and the
shared arrays. `Promise.allSettled` replaces the hand-written wrapper that
turned each rejection into a value, but errors still flow through `.then`
chains.

**async/await** (`src/async-await.js`). Reads like synchronous code. It also
carries the extras that were easy to add once the control flow was linear:
a concurrency limit (`src/pool.js`), a streaming analyzer for big files
(`src/stream-count.js`) and a per-file timeout (`src/timeout.js`). Doing the
same with callbacks would mean hand-writing a queue.
