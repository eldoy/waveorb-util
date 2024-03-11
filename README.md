# Waveorb Util

Frontend utilities for [Waveorb.](https://waveorb.com)

Various Javascript functions needed for web applications. It is included in new Waveorb applications by default.

### Install

```
npm i waveorb-util
```

### Usage

In the `app/hooks/init.js` file, add your global functions like this to make them available server side in your app:

```js
const util = require('waveorb-util')

// Include some
global.globals = ['sleep', 'clearErrors']
for (const fn of globals) {
  global[fn] = util[fn]
}

// Include all
global.globals = Object.keys(util)
for (const fn in util) {
  global[fn] = util[fn]
}
```

To make the available client side, include them in your layout, in the `head` or at the end of `body` tag, depending on your needs:

```js
async function()
<head>
  ...
  <script>
    ${global.globals.map(function(fn) {
      return h`window.${fn} = ${util[fn]}`
    })}
  </script>
</head>
```

See the source code for documentation.

ISC Licensed. Enjoy!
