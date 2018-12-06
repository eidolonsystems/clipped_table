var path = require('path');
var webpack = require('webpack');
const MinifyPlugin = require("babel-minify-webpack-plugin");
const PROD = JSON.parse(process.env.PROD_ENV || '0');
const minifyOpts = {};
const minigyPluginOpts = {
  test: /\.js($|\?)/i,
};
module.exports = {
  devtool: PROD ? 'none' : 'source-map',
  entry: './source/index.ts',
  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  },
  mode: PROD ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      }
    ]
  },
  output: {
    filename: 'index.js',
    library: 'clipped_table',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'build'),
    umdNamedDefine: true
  },
  plugins: PROD ? [new MinifyPlugin(minifyOpts, minigyPluginOpts)] : [],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  }
};
