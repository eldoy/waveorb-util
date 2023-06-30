# Waveorb Util

Utility functions for [Waveorb.](https://waveorb.com)

Various Javascript functions needed for web applications. It is included in new Waveorb applications by default.

### Usage

#### Frontend

Copy the `dist/util.js` file to the `app/assets/js/` folder in you application.

Add it to `app/config/assets.yml` for using it with the bundler:

```yml
js:
  # ...
  - util.js
```

#### Backend

Install:
```
npm i waveorb-util
```

Usage:
```js
const { sleep } = require('waveorb-util')
```

To install functions globally server side, use the `init` hook:

```js
const util = require('waveorb-util')
global.sleep = util.sleep
```

See the source code for documentation.

### License

ISC Licensed. Enjoy!
