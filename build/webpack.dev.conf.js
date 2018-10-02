const baseWebpackConfig = require('./webpack.base.conf');

var conf = baseWebpackConfig;
conf.watch = true;
conf.mode = 'development';

module.exports = baseWebpackConfig;
