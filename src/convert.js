const sharp = require('sharp')
const pattern1 = require('./settings/pattern1')
const pattern2 = require('./settings/pattern2')
const getSetting = pattern => {
  switch (pattern) {
    case 'pattern1': return pattern1
    case 'pattern2': return pattern2
    default: throw new Error('Undefined pattern')
  }
}
const indexToPos = (index, numOfHorizontal, size) => {
  const left = (index % numOfHorizontal) * size
  const top = Math.floor(index / numOfHorizontal) * size
  return { left, top }
}
const indexToExtractData = (index, size) => {
  const { left, top } = indexToPos(index, 4, size)
  return { left, top, width: size, height: size }
}
const convert = async (inputPath, size, pattern = 'pattern1') => {
  const original = await sharp(inputPath)
  const bufferData = await Promise.all(getSetting(pattern).map(async indexes => {
    const promises = indexes.map(index => original.extract(indexToExtractData(index, size / 2)).toBuffer())
    return await Promise.all(promises)
  }))
  const compositeOptions = bufferData.reduce((arr, buffers, baseIndex) => {
    const { left, top } = indexToPos(baseIndex, 8, size)
    buffers.forEach((buffer, tileIndex) => {
      const { left: tileLeft, top: tileTop } = indexToPos(tileIndex, 2, size / 2)
      arr.push({
        input: buffer,
        left: left + tileLeft,
        top: top + tileTop
      })
    })
    return arr
  }, [])
  return sharp({
    create: {
      width: 256,
      height: 192,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    }
  }).composite(compositeOptions).png().toBuffer()
}

module.exports = convert
