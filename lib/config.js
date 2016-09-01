'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('./webpack');

var _webpack2 = _interopRequireDefault(_webpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var projectRoot = process.cwd();
var config = {
  projectRoot: projectRoot,
  appDir: _path2.default.resolve(projectRoot, './app'),
  dataDir: _path2.default.resolve(projectRoot, './data'),
  componentDir: _path2.default.resolve(projectRoot, './app/components'),
  sectionDir: _path2.default.resolve(projectRoot, './app/sections'),
  webpackClientConfig: {},
  webpackServerConfig: {},
  serverPort: 3000,
  clientDevServerPort: 8060
};

config.webpackClientConfig = (0, _webpack2.default)({ target: 'client', mode: 'production' }, config);
config.webpackServerConfig = (0, _webpack2.default)({ target: 'server', mode: 'production' }, config);

exports.default = config;