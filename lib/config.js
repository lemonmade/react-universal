'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadConfig;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadConfig() {
  const projectRoot = process.cwd();
  return {
    projectRoot,
    appDir: projectRoot,
    dataDir: _path2.default.resolve(projectRoot, './data'),
    buildDir: _path2.default.resolve(projectRoot, './build'),
    componentDir: _path2.default.resolve(projectRoot, './components'),
    sectionDir: _path2.default.resolve(projectRoot, './sections'),
    stylesDir: _path2.default.resolve(projectRoot, './styles'),
    publicPath: '/assets/',
    serverPort: 3000,
    clientDevServerPort: 8060
  };
}