const sharp = require('sharp')
const TILES = [
  [13, 14, 17, 18],
  [2, 14, 17, 18],
  [13, 3, 17, 18],
  [2, 3, 17, 18],
  [13, 14, 17, 7],
  [2, 14, 17, 7],
  [13, 3, 17, 7],
  [2, 3, 17, 7],
  // ---
  [13, 14, 6, 18],
  [2, 14, 6, 18],
  [13, 3, 6, 18],
  [2, 3, 6, 18],
  [13, 14, 6, 7],
  [2, 14, 6, 7],
  [13, 3, 6, 7],
  [2, 3, 6, 7],
  // ---
  [12, 14, 16, 18],
  [12, 3, 16, 18],
  [12, 14, 16, 7],
  [12, 3, 16, 7],
  [9, 10, 17, 18],
  [9, 10, 17, 7],
  [9, 10, 6, 18],
  [9, 10, 6, 7],
  // ---
  [13, 15, 17, 19],
  [13, 15, 6, 19],
  [2, 15, 17, 19],
  [2, 15, 6, 19],
  [13, 14, 21, 22],
  [2, 14, 21, 22],
  [13, 3, 21, 22],
  [2, 3, 21, 22],
  // ---
  [12, 15, 16, 19],
  [9, 10, 21, 22],
  [8, 9, 12, 13],
  [8, 9, 12, 7],
  [10, 11, 14, 15],
  [10, 11, 6, 15],
  [18, 19, 22, 23],
  [2, 19, 22, 23],
  // ---
  [16, 17, 20, 21],
  [16, 3, 20, 21],
  [8, 11, 12, 15],
  [8, 9, 20, 21],
  [16, 19, 20, 23],
  [10, 11, 22, 23],
  [8, 11, 20, 23],
  [8, 11, 20, 23]
]
const indexToPos = (index, numOfHorizontal, size) => {
  const left = (index % numOfHorizontal) * size
  const top = Math.floor(index / numOfHorizontal) * size
  return { left, top }
}
const indexToExtractData = (index, size) => {
  const { left, top } = indexToPos(index, 4, size)
  return { left, top, width: size, height: size }
}
const convert = async (inputPath, size) => {
  const original = await sharp(inputPath)
  const bufferData = await Promise.all(TILES.map(async indexes => {
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
