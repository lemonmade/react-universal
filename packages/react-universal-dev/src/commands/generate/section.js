// @flow

import fs from 'fs-extra';
import path from 'path';
import camelcase from 'camelcase';
import pascalcase from 'uppercamelcase';
import loadConfig from '@lemonmade/react-universal-config';

import {correctWhitespace} from './utilities';

type GenerateSectionOptionsType = {
  name: string,
};

export const command = 'section <name>';
export const describe = 'Generate a new section';
export const builder = {};

export async function handler({name}: GenerateSectionOptionsType) {
  const {sectionDir} = await loadConfig();
  const [sectionName, subsectionName] = name.split('/');
  const section = pascalcase(sectionName); // eslint-disable-line no-param-reassign
  const subsection = subsectionName && pascalcase(subsectionName); // eslint-disable-line no-param-reassign

  const dir = path.join(sectionDir, section);
  const file = path.join(dir, `${subsection || section}.js`);
  const camelSection = camelcase(section);

  fs.mkdirpSync(dir);

  fs.writeFileSync(file, correctWhitespace(`
    // @flow

    import React from 'react';

    type Props = {};

    export default function ${subsection || section}(props: Props) {
      return (
        <div>
          Welcome to ${subsection == null ? section : `${section}/${subsection}`}!
        </div>
      );
    }
  `));

  if (subsection == null) {
    fs.writeFileSync(path.join(dir, 'index.js'), correctWhitespace(`
      // @flow

      import React from 'react';
      import Route from 'react-router/lib/Route';

      function resolve${section}Component(nextState, cb) {
        System
          .import('./${section}')
          .then((${camelSection}) => cb(null, ${camelSection}.default));
      }

      export default (
        <Route
          path="${camelSection}"
          getComponent={resolve${section}Component}
        />
      );
    `));
  }
}
