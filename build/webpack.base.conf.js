const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  target: 'node',
  context: resolve('src'),
  entry: './datasource/module.js',
  output: {
    filename: "module.js",
    path: resolve('dist'),
    libraryTarget: "amd"
  },
  externals: [
    // remove the line below if you don't want to use buildin versions
    'jquery', 'lodash', 'moment', 'angular',
    function(context, request, callback) {
      var prefix = 'grafana/';
      if (request.indexOf(prefix) === 0) {
        return callback(null, request.substr(prefix.length));
      }
      callback();
    }
  ],
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new CopyWebpackPlugin([
      { from: '../README.md' },
      { from: 'plugin.json' },
      { from: 'img/*' },
      { from: 'components/*' }
    ]),
    new CleanWebpackPlugin(['dist'], {
      root: resolve('.')
    }),
    new ngAnnotatePlugin()
  ],
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: [
          "ts-loader"
        ],
        exclude: /node_modules/,
      }
    ]
  }
}
