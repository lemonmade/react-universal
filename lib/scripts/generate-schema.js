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

require('babel-core/register');

exports.default = (() => {
  var _ref = _asyncToGenerator(function* ({ dataDir }) {
    const Schema = require(_path2.default.join(dataDir, 'schema')).default;

    const result = yield (0, _graphql.graphql)(Schema, _utilities.introspectionQuery);
    if (result.errors) {
      // eslint-disable-next-line no-console
      console.error('ERROR introspecting schema: ', JSON.stringify(result.errors, null, 2));
      return;
    }

    _fsExtra2.default.writeFileSync(_path2.default.join(dataDir, 'schema.json'), JSON.stringify(result, null, 2));

    _fsExtra2.default.writeFileSync(_path2.default.join(dataDir, 'schema.graphql'), (0, _utilities.printSchema)(Schema));
  });

  function generateSchema(_x) {
    return _ref.apply(this, arguments);
  }

  return generateSchema;
})();