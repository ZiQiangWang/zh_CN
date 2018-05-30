const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'zh_cn.min.js',
    library: "zh_cn",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader:'babel-loader',
        exclude: path.resolve(__dirname, 'node_modules'),
        include: path.resolve(__dirname, 'src'),
      },
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      output: { comments: false },
      compress: { warnings: false }
    })
  ]
};
