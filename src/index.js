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
      files.forEach(file => this.convert(file))
      if (compiler.options.mode === 'development') this.watch()
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
    convert(path.join(this.inputDir, file), this.outputDir, this.settings.size)
  }
}
