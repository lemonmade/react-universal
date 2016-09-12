// @flow

import fs from 'fs-extra';
import path from 'path';
import pascalcase from 'uppercamelcase';
import loadConfig from '@lemonmade/react-universal-config';

import {correctWhitespace} from './utilities';

export const command = 'component <name>';
export const describe = 'Generate a new component';
export const builder = {};

export async function handler({name}) {
  const {componentDir, sectionDir} = await loadConfig();

  const [sectionName, componentName = sectionName] = name.split('/');
  const component = pascalcase(componentName);
  const section = sectionName === componentName ? null : pascalcase(sectionName);

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
