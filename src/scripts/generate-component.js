// @flow

import fs from 'fs-extra';
import path from 'path';
import pascalcase from 'uppercamelcase';

import {correctWhitespace} from './utilities';
import type {ConfigType} from '../types';

type ComponentCreationType = {
  component: string,
  section?: ?string,
};

export default function generateComponent(
  {component, section}: ComponentCreationType,
  {componentDir, sectionDir}: ConfigType
) {
  component = pascalcase(component); // eslint-disable-line no-param-reassign
  section = section && pascalcase(section); // eslint-disable-line no-param-reassign

  const dir = section == null
    ? path.join(componentDir, component)
    : path.join(sectionDir, section, 'components', component);

  const testDir = path.join(dir, 'test');

  fs.mkdirpSync(dir);
  fs.mkdirpSync(testDir);

  fs.writeFileSync(path.join(dir, `${component}.scss`), correctWhitespace(`
    .${component} {

    }
  `));

  fs.writeFileSync(path.join(dir, `${component}.js`), correctWhitespace(`
    // @flow

    import React from 'react';
    import styles from './${component}.scss';

    type Props = {
      children?: any,
    };

    export default function ${component}({children}: Props) {
      return (
        <div className={styles.${component}}>
          {children}
        </div>
      );
    }
  `));

  fs.writeFileSync(path.join(dir, 'index.js'), correctWhitespace(`
    // @flow

    import ${component} from './${component}';

    export default ${component};
  `));

  fs.writeFileSync(path.join(testDir, `${component}.test.js`), correctWhitespace(`
    // @flow

    import ${component} from '..';

    describe('${component}', () => {
      it('does something', () => {

      });
    });
  `));

  fs.writeFileSync(path.join(testDir, '.eslintrc.js'), correctWhitespace(`
    module.exports = {
      extends: [
        'plugin:shopify/react',
        'plugin:shopify/mocha',
      ],
    };
  `));
}
