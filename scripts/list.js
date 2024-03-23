var fs = require('node:fs')

var file = fs.readFileSync(process.cwd() + '/index.js', 'utf8')

var fns = []

file.split('\n').forEach((line) => {
  if (line.startsWith('var')) {
    var name = line.slice(4).split('=')[0].trim()
    fns.push(name)
  }
})

console.log(fns.join(',\n'))
