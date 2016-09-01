'use strict';

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var clientCompiler = (0, _webpack2.default)(_config2.default.webpackClientConfig);
var serverCompiler = (0, _webpack2.default)(_config2.default.webpackServerConfig);

var noop = function noop(err, stats) {
  console.log(stats.hasErrors(), stats.toString({
    chunks: false, // Makes the build much quieter
    colors: true
  }));
};

clientCompiler.run(noop);
serverCompiler.run(noop);