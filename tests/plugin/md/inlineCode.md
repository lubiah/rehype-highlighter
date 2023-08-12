# Testing the highlighting of inline code blocks.

- Highlights as expected
  The following code blocks below should all be highlighted

`:python: import time from time`

`:javascript: const promise = new Promise((resolve, reject) =>{})`

`:markdown: # hello world, be **bold**`

`:css: a { text-decoration: red }`

- code escaping works

` :python: import time from time`

` :javascript: const promise = new Promise((resolve, reject) =>{})`

` :markdown: # hello world, be **bold**`

` :css: a { text-decoration: red }`
