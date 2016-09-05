'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

let runCompiler = (() => {
  var _ref2 = _asyncToGenerator(function* (compiler) {
    yield new Promise(function (resolve, reject) {
      compiler.run(function (err, stats) {
        if (err) {
          console.log(stats.toString());
          reject(err);
          return;
        }

        resolve();
      });
    });
  });

  return function runCompiler(_x2) {
    return _ref2.apply(this, arguments);
  };
})();

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpack3 = require('../webpack');

var _webpack4 = _interopRequireDefault(_webpack3);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

exports.default = (() => {
  var _ref = _asyncToGenerator(function* ({ mode = 'production' } = {}) {
    const clientConfig = (0, _webpack4.default)({ target: 'client', mode }, _config2.default);
    const serverConfig = (0, _webpack4.default)({ target: 'server', mode }, _config2.default);

    const clientCompiler = (0, _webpack2.default)(clientConfig);
    const serverCompiler = (0, _webpack2.default)(serverConfig);

    yield runCompiler(clientCompiler);
    yield runCompiler(serverCompiler);
  });

  function build(_x) {
    return _ref.apply(this, arguments);
  }

  return build;
})();