#!/usr/bin/env node
var fs = require('node:fs')
var uglify = require('uglify-js')
var util = require('../index.js')

var code = []
for (var fn in util) {
  code.push(`window.${fn} = ${util[fn].toString()}\n`)
}
if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist')
}

fs.writeFileSync('./dist/util.js', code.join('\n'))

var result = uglify.minify(code.join('\n'))
fs.writeFileSync('./dist/util-min.js', result.code)
