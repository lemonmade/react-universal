// @flow

import fs from 'fs-extra';
import path from 'path';
import camelcase from 'camelcase';
import pascalcase from 'uppercamelcase';

import {correctWhitespace} from './utilities';
import type {ConfigType} from '../types';

type SectionCreationType = {
  section: string,
  subsection?: ?string,
};

export default function generateSection(
  {section, subsection}: SectionCreationType,
  {sectionDir}: ConfigType
) {
  section = pascalcase(section); // eslint-disable-line no-param-reassign
  subsection = subsection && pascalcase(subsection); // eslint-disable-line no-param-reassign

  const dir = path.join(sectionDir, section);
  const file = path.join(dir, `${subsection || section}.js`);
  const name = subsection || section;
  const camelSection = camelcase(section);

  fs.mkdirpSync(dir);

  fs.writeFileSync(file, correctWhitespace(`
    // @flow

    import React from 'react';

    type Props = {};

    export default function ${name}(props: Props) {
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
