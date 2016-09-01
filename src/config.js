// @flow

import path from 'path';
import webpack from './webpack';

const projectRoot = process.cwd();
const config = {
  projectRoot,
  appDir: path.resolve(projectRoot, './app'),
  dataDir: path.resolve(projectRoot, './data'),
  componentDir: path.resolve(projectRoot, './app/components'),
  sectionDir: path.resolve(projectRoot, './app/sections'),
  webpackClientConfig: {},
  webpackServerConfig: {},
  serverPort: 3000,
  clientDevServerPort: 8060,
};

config.webpackClientConfig = webpack({target: 'client', mode: 'production'}, config);
config.webpackServerConfig = webpack({target: 'server', mode: 'production'}, config);

export default config;
