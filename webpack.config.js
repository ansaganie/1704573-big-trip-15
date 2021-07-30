const path = require('path');

const entry = './src/main.js';
const filename = 'bundle.js';
const outputPath = path.resolve(__dirname, 'public');
const port = 3000;

module.exports = {
  entry,
  output: {
    filename,
    path: outputPath
  },
  devtool: 'source-map',
  devServer: {
    contentBase: outputPath,
    watchContentBase: true,
    port
  }
}
