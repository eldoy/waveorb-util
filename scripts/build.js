#!/usr/bin/env node
<<<<<<< HEAD
var fs = require('node:fs')
var uglify = require('uglify-js')
var util = require('../index.js')

var code = []
for (var fn in util) {
=======
const fs = require('fs')
const uglify = require('uglify-js')
const util = require('../index.js')

const code = []
for (const fn in util) {
>>>>>>> a5ff3c44e8791ff61dfe08670558fbfae2ab781a
  code.push(`window.${fn} = ${util[fn].toString()}\n`)
}
if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist')
}

fs.writeFileSync('./dist/util.js', code.join('\n'))

<<<<<<< HEAD
var result = uglify.minify(code.join('\n'))
=======
const result = uglify.minify(code.join('\n'))
>>>>>>> a5ff3c44e8791ff61dfe08670558fbfae2ab781a
fs.writeFileSync('./dist/util-min.js', result.code)
