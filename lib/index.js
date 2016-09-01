'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createServer = createServer;

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createServer(appDetails) {
  return (0, _server2.default)(appDetails, _config2.default);
}