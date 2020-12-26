const path = require('path')
const fs = require('fs')
const convert = require('./convert')

module.exports = class {
  constructor (settings) {
    this.settings = settings
  }
  apply (compiler) {
    this.projectRoot = compiler.context
    this.inputDir = path.resolve(this.projectRoot, this.settings.input)
    this.outputDir = path.resolve(this.projectRoot, this.settings.output)
    if (this.inputDir === this.outputDir) throw new Error('[Error] Input dir and output dir should not be same.')
    compiler.hooks.afterEnvironment.tap('TileSpriter', () => {
      console.log('TileSpriterWebpackPlugin: Converting all files...')
      const files = fs.readdirSync(this.inputDir).filter(file => file.endsWith('.png'))
      const promises = files.map(file => this.convert(file))
      Promise.all(promises).then(() => {
        if (compiler.options.mode === 'development') this.watch()
      })
    })
  }
  watch () {
    const modifiedFiles = []
    fs.watch(this.inputDir, (_, file) => {
      if (!file.endsWith('.png')) return
      if (modifiedFiles.includes(file)) return
      modifiedFiles.push(file)
    })
    setInterval(() => {
      modifiedFiles.forEach(file => {
        if (!fs.existsSync(path.join(this.inputDir, file))) return
        console.log(`TileSpriterWebpackPlugin: Converting ${file}...`)
        this.convert(file)
      })
      modifiedFiles.splice(0)
    }, 1000)
  }
  convert (file) {
    const size = this.settings.size
    convert(path.join(this.inputDir, file), size).then(buffer => {
      return fs.writeFileSync(path.join(this.outputDir, file), buffer)
    })
    const keyName = file.split('.')[0]
    const ruleTmx = fs.readFileSync(path.resolve(__dirname, './rule.tmx'), 'utf-8')
                      .replace(/\{FILE_NAME\}/g, file)
                      .replace(/\{TILE_SIZE\}/g, size)
                      .replace(/\{LAYER_NAME\}/g, keyName)
                      .replace(/\{WIDTH\}/g, size * 8)
                      .replace(/\{HEIGHT\}/g, size * 6)
    fs.writeFileSync(path.join(this.outputDir, `${keyName}.tmx`), ruleTmx)
  }
}
