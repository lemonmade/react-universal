'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _graphql = require('graphql');

var _utilities = require('graphql/utilities');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

exports.default = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_ref2) {
    var dataDir = _ref2.dataDir;
    var Schema, result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            Schema = require(_path2.default.join(dataDir, 'schema')).default;
            _context.next = 3;
            return (0, _graphql.graphql)(Schema, _utilities.introspectionQuery);

          case 3:
            result = _context.sent;

            if (!result.errors) {
              _context.next = 7;
              break;
            }

            // eslint-disable-next-line no-console
            console.error('ERROR introspecting schema: ', JSON.stringify(result.errors, null, 2));
            return _context.abrupt('return');

          case 7:

            _fsExtra2.default.writeFileSync(_path2.default.join(dataDir, 'schema.json'), JSON.stringify(result, null, 2));

            _fsExtra2.default.writeFileSync(_path2.default.join(dataDir, 'schema.graphql'), (0, _utilities.printSchema)(Schema));

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function generateSchema(_x) {
    return _ref.apply(this, arguments);
  }

  return generateSchema;
}();