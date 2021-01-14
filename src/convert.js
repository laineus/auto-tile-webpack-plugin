const path = require('path')
const fs = require('fs')
const convert = require('./autotile')

module.exports = (input, outputDir, size) => {
  const filename = path.basename(input)
  convert(input, size).then(buffer => {
    return fs.writeFileSync(path.join(outputDir, filename), buffer)
  })
  const keyName = filename.split('.')[0]
  const ruleTmx = fs.readFileSync(path.resolve(__dirname, './rule.tmx'), 'utf-8')
                    .replace(/\{FILE_NAME\}/g, filename)
                    .replace(/\{TILE_SIZE\}/g, size)
                    .replace(/\{LAYER_NAME\}/g, keyName)
                    .replace(/\{WIDTH\}/g, size * 8)
                    .replace(/\{HEIGHT\}/g, size * 6)
  fs.writeFileSync(path.join(outputDir, `${keyName}.tmx`), ruleTmx)
}
