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

function generateSection({ section, subsection }, { sectionDir }) {
  section = (0, _uppercamelcase2.default)(section); // eslint-disable-line no-param-reassign
  subsection = subsection && (0, _uppercamelcase2.default)(subsection); // eslint-disable-line no-param-reassign

  const dir = _path2.default.join(sectionDir, section);
  const file = _path2.default.join(dir, `${ subsection || section }.js`);
  const name = subsection || section;
  const camelSection = (0, _camelcase2.default)(section);

  _fsExtra2.default.mkdirpSync(dir);

  _fsExtra2.default.writeFileSync(file, (0, _utilities.correctWhitespace)(`
    // @flow

    import React from 'react';

    type Props = {};

    export default function ${ name }(props: Props) {
      return (
        <div>
          Welcome to ${ subsection == null ? section : `${ section }/${ subsection }` }!
        </div>
      );
    }
  `));

  if (subsection == null) {
    _fsExtra2.default.writeFileSync(_path2.default.join(dir, 'Routes.js'), (0, _utilities.correctWhitespace)(`
      // @flow

      import React from 'react';
      import Route from 'react-router/lib/Route';

      function resolve${ section }Component(nextState, cb) {
        System
          .import('./${ section }')
          .then((${ camelSection }) => cb(null, ${ camelSection }.default));
      }

      export default (
        <Route
          path="${ camelSection }"
          getComponent={resolve${ section }Component}
        />
      );
    `));
  }
}