
# AutoTileWebpackPlugin

[![npm](https://img.shields.io/npm/v/auto-tile-webpack-plugin.svg)](https://www.npmjs.com/package/auto-tile-webpack-plugin)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/laineus/auto-tile-webpack-plugin/blob/master/LICENSE)

A Webpack plugin to extrude tilesets automatically with [auto-tiler](https://github.com/sporadic-labs/auto-tiler).

It will be re-extruded automatically when added or modified images while webpack is watching.

# Usage

Install:

```
$ npm install auto-tile-webpack-plugin
```

Define into `webpack.config.js`:

```js
const AutoTileWebpackPlugin = require('auto-tile-webpack-plugin')
// ...
{
  entry: {
    ...
  },
  output: {
    ...
  },
  plugins: [
    new AutoTileWebpackPlugin({
      size: 32,
      input: './public/img/original_tilesets',
      output: './public/img/extruded_tilesets'
    })
  ]
}
```

Options:

|Key|What is|
|---|---|
|size|Tile size.|
|input|Input directory. Original images should be here.|
|output|Output directory. Extruded images will be here.|

# Requirements

- Webpack4 or higher

I'm not sure if this will be working on Webpack3 or less.
Please make an issue or PR if need it.
