'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generateSection;

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _camelcase = require('camelcase');

var _camelcase2 = _interopRequireDefault(_camelcase);

var _uppercamelcase = require('uppercamelcase');

var _uppercamelcase2 = _interopRequireDefault(_uppercamelcase);

var _utilities = require('./utilities');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generateSection(_ref, _ref2) {
  var section = _ref.section;
  var subsection = _ref.subsection;
  var sectionDir = _ref2.sectionDir;

  section = (0, _uppercamelcase2.default)(section); // eslint-disable-line no-param-reassign
  subsection = subsection && (0, _uppercamelcase2.default)(subsection); // eslint-disable-line no-param-reassign

  var dir = _path2.default.join(sectionDir, section);
  var file = _path2.default.join(dir, (subsection || section) + '.js');
  var name = subsection || section;
  var camelSection = (0, _camelcase2.default)(section);

  _fsExtra2.default.mkdirpSync(dir);

  _fsExtra2.default.writeFileSync(file, (0, _utilities.correctWhitespace)('\n    // @flow\n\n    import React from \'react\';\n\n    type Props = {};\n\n    export default function ' + name + '(props: Props) {\n      return (\n        <div>\n          Welcome to ' + (subsection == null ? section : section + '/' + subsection) + '!\n        </div>\n      );\n    }\n  '));

  if (subsection == null) {
    _fsExtra2.default.writeFileSync(_path2.default.join(dir, 'Routes.js'), (0, _utilities.correctWhitespace)('\n      // @flow\n\n      import React from \'react\';\n      import Route from \'react-router/lib/Route\';\n\n      function resolve' + section + 'Component(nextState, cb) {\n        System\n          .import(\'./' + section + '\')\n          .then((' + camelSection + ') => cb(null, ' + camelSection + '.default));\n      }\n\n      export default (\n        <Route\n          path="' + camelSection + '"\n          getComponent={resolve' + section + 'Component}\n        />\n      );\n    '));
  }
}