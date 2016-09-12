// @flow

import path from 'path';

export default function loadConfig() {
  const projectRoot = process.cwd();
  const appRoot = path.resolve(projectRoot, 'app');

  return {
    projectRoot,
    appDir: appRoot,
    dataDir: path.resolve(appRoot, 'data'),
    buildDir: path.resolve(projectRoot, 'build'),
    componentDir: path.resolve(appRoot, 'components'),
    sectionDir: path.resolve(appRoot, 'sections'),
    stylesDir: path.resolve(appRoot, 'styles'),
    scriptsDir: path.resolve(projectRoot, 'scripts'),
    publicPath: '/assets/',
    serverPort: 3000,
    clientDevServerPort: 8060,
  };
}
