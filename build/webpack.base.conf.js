const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

const ExtractTextPluginLight = new ExtractTextPlugin('./css/kentik.light.css');
const ExtractTextPluginDark = new ExtractTextPlugin('./css/kentik.dark.css');

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  target: 'node',
  context: resolve('src'),
  entry: {
    './module': './module.ts',
    'datasource/module': './datasource/module.ts',
    'config/module': './config/config.ts',
    'components/add_device': './components/add_device.ts',
    'components/device_details': './components/device_details.ts',
    'components/device_list': './components/device_list.ts',
    'panel/call-to-action/module': './panel/call-to-action/module.ts',
    'panel/device-list/module': './panel/device-list/module.ts',
  },
  output: {
    filename: "[name].js",
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
      { from: '**/plugin.json' },
      { from: '**/*.html' },
      { from: 'components/*' },
      { from: 'dashboards/*' },
      { from: 'img/*' },
    ]),

    ExtractTextPluginLight,
    ExtractTextPluginDark,

    new CleanWebpackPlugin(['dist'], {
      root: resolve('.')
    }),
    new ngAnnotatePlugin()
  ],
  resolve: {
    extensions: [".js", ".ts", ".html", ".scss"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: [
          "ts-loader"
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader'
        }
      },
      {
        test: /\.light\.scss$/,
        use: ExtractTextPluginLight.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /\.dark\.scss$/,
        use: ExtractTextPluginDark.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      }
    ]
  }
}
