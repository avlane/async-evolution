# async-evolution

One small job, written three times: read every `.txt` file in a directory
and report its lines, words and characters. First with callbacks, then with
promises, then with `async`/`await`. The point is to see how the same logic
changes shape.

Needs Node 12 or newer, no dependencies.

    node bin/run.js samples
