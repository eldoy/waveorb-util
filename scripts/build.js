#!/usr/bin/env node
const fs = require('fs')
const uglify = require('uglify-js')
const util = require('../index.js')

const code = []
for (const fn in util) {
  code.push(`window.${fn} = ${util[fn].toString()}\n`)
}
if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist')
}

fs.writeFileSync('./dist/util.js', code.join('\n'))

const result = uglify.minify(code.join('\n'))
fs.writeFileSync('./dist/util-min.js', result.code)
