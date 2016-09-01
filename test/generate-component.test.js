// @flow

import generateComponent from '../src/scripts/generate-component';

generateComponent(
  {component: 'Foo'},
  {componentDir: 'Components', dataDir: '', sectionDir: 'Sections'}
);
