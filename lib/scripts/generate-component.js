'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generateComponent;

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _uppercamelcase = require('uppercamelcase');

var _uppercamelcase2 = _interopRequireDefault(_uppercamelcase);

var _utilities = require('./utilities');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generateComponent(_ref, _ref2) {
  var component = _ref.component;
  var section = _ref.section;
  var componentDir = _ref2.componentDir;
  var sectionDir = _ref2.sectionDir;

  component = (0, _uppercamelcase2.default)(component); // eslint-disable-line no-param-reassign
  section = section && (0, _uppercamelcase2.default)(section); // eslint-disable-line no-param-reassign

  var dir = section == null ? _path2.default.join(componentDir, component) : _path2.default.join(sectionDir, section, 'components', component);

  var testDir = _path2.default.join(dir, 'test');

  _fsExtra2.default.mkdirpSync(dir);
  _fsExtra2.default.mkdirpSync(testDir);

  _fsExtra2.default.writeFileSync(_path2.default.join(dir, component + '.scss'), (0, _utilities.correctWhitespace)('\n    .' + component + ' {\n\n    }\n  '));

  _fsExtra2.default.writeFileSync(_path2.default.join(dir, component + '.js'), (0, _utilities.correctWhitespace)('\n    // @flow\n\n    import React from \'react\';\n    import styles from \'./' + component + '.scss\';\n\n    type Props = {\n      children?: any,\n    };\n\n    export default function ' + component + '({children}: Props) {\n      return (\n        <div className={styles.' + component + '}>\n          {children}\n        </div>\n      );\n    }\n  '));

  _fsExtra2.default.writeFileSync(_path2.default.join(dir, 'index.js'), (0, _utilities.correctWhitespace)('\n    // @flow\n\n    import ' + component + ' from \'./' + component + '\';\n\n    export default ' + component + ';\n  '));

  _fsExtra2.default.writeFileSync(_path2.default.join(testDir, component + '.test.js'), (0, _utilities.correctWhitespace)('\n    // @flow\n\n    import ' + component + ' from \'..\';\n\n    describe(\'' + component + '\', () => {\n      it(\'does something\', () => {\n\n      });\n    });\n  '));

  _fsExtra2.default.writeFileSync(_path2.default.join(testDir, '.eslintrc.js'), (0, _utilities.correctWhitespace)('\n    module.exports = {\n      extends: [\n        \'plugin:shopify/react\',\n        \'plugin:shopify/mocha\',\n      ],\n    };\n  '));
}