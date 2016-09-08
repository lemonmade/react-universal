// @flow

import path from 'path';

export default function loadConfig() {
  const projectRoot = process.cwd();
  return {
    projectRoot,
    appDir: projectRoot,
    dataDir: path.resolve(projectRoot, './data'),
    buildDir: path.resolve(projectRoot, './build'),
    componentDir: path.resolve(projectRoot, './components'),
    sectionDir: path.resolve(projectRoot, './sections'),
    stylesDir: path.resolve(projectRoot, './styles'),
    publicPath: '/assets/',
    serverPort: 3000,
    clientDevServerPort: 8060,
  };
}
