const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

const ExtractTextPluginLight = new ExtractTextPlugin('./css/kentik.light.css');
const ExtractTextPluginDark = new ExtractTextPlugin('./css/kentik.dark.css');
const WebpackBeforeBuildPlugin = require('before-build-webpack');
const directoryExists = require('directory-exists');
const clone = require('git-clone');
// puts grafana source under node_modules to skip including it automatically
var grafanaTargetDir = "node_modules/grafana_master";
function resolve(dir) {
  return path.join(__dirname, '..', dir);
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
    new WebpackBeforeBuildPlugin(function(stats, callback) {
      // Do whatever you want...
      var exists = directoryExists.sync(grafanaTargetDir);
      if (exists) {
        console.log("Grafana source present, skipping git clone");
      } else {
        console.log("Cloning grafana source...");
        clone('https://github.com/grafana/grafana.git', grafanaTargetDir, {shallow: true}, function(err) {
          console.log("complete!");
          if (err) {
            console.log(err);
          }
        });
      }
      callback(); // don't call it if you do want to stop compilation
                  // (some events does no have it ('done' for instance)
                  // and calling callback() does nothing and can be ommited)
    }),
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
    extensions: [".js", ".ts", ".html", ".scss"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loaders: [
          "ts-loader"
        ],
      },
      {
        test: /\.html$/,
        exclude: [/node_modules/],
        use: {
          loader: 'html-loader'
        },
      },
      {
        test: /\.light\.scss$/,
        exclude: [/node_modules/],
        use: ExtractTextPluginLight.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        }),
      },
      {
        test: /\.dark\.scss$/,
        exclude: [/node_modules/],
        use: ExtractTextPluginDark.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        }),
      }
    ]
  }
}
