const path = require('path')
const fs = require('fs').promises
const autotile = require('./autotile')

module.exports = async (input, outputDir, size) => {
  const filename = path.basename(input)
  const buffer = await autotile(input, size)
  await fs.writeFile(path.join(outputDir, filename), buffer)
  const keyName = filename.split('.')[0]
  const ruleTmx = await fs.readFile(path.resolve(__dirname, './rule.tmx'), 'utf-8').then(v => {
    return v.replace(/\{FILE_NAME\}/g, filename)
            .replace(/\{TILE_SIZE\}/g, size)
            .replace(/\{LAYER_NAME\}/g, keyName)
            .replace(/\{WIDTH\}/g, size * 8)
            .replace(/\{HEIGHT\}/g, size * 6)
  })
  await fs.writeFile(path.join(outputDir, `${keyName}.tmx`), ruleTmx)
}
