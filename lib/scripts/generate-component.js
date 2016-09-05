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

function generateComponent({ component, section }, { componentDir, sectionDir }) {
  component = (0, _uppercamelcase2.default)(component); // eslint-disable-line no-param-reassign
  section = section && (0, _uppercamelcase2.default)(section); // eslint-disable-line no-param-reassign

  const dir = section == null ? _path2.default.join(componentDir, component) : _path2.default.join(sectionDir, section, 'components', component);

  const testDir = _path2.default.join(dir, 'test');

  _fsExtra2.default.mkdirpSync(dir);
  _fsExtra2.default.mkdirpSync(testDir);

  _fsExtra2.default.writeFileSync(_path2.default.join(dir, `${ component }.scss`), (0, _utilities.correctWhitespace)(`
    .${ component } {

    }
  `));

  _fsExtra2.default.writeFileSync(_path2.default.join(dir, `${ component }.js`), (0, _utilities.correctWhitespace)(`
    // @flow

    import React from 'react';
    import styles from './${ component }.scss';

    type Props = {
      children?: any,
    };

    export default function ${ component }({children}: Props) {
      return (
        <div className={styles.${ component }}>
          {children}
        </div>
      );
    }
  `));

  _fsExtra2.default.writeFileSync(_path2.default.join(dir, 'index.js'), (0, _utilities.correctWhitespace)(`
    // @flow

    import ${ component } from './${ component }';

    export default ${ component };
  `));

  _fsExtra2.default.writeFileSync(_path2.default.join(testDir, `${ component }.test.js`), (0, _utilities.correctWhitespace)(`
    // @flow

    import ${ component } from '..';

    describe('${ component }', () => {
      it('does something', () => {

      });
    });
  `));

  _fsExtra2.default.writeFileSync(_path2.default.join(testDir, '.eslintrc.js'), (0, _utilities.correctWhitespace)(`
    module.exports = {
      extends: [
        'plugin:shopify/react',
        'plugin:shopify/mocha',
      ],
    };
  `));
}