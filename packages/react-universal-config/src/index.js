// @flow

import path from 'path';
import cosmiconfig from 'cosmiconfig';

export type ConfigType = {
  projectRoot: string,
  appDir: string,
  dataDir: string,
  buildDir: string,
  componentDir: string,
  sectionDir: string,
  stylesDir: string,
  scriptsDir: string,
  publicPath: string,
  serverPort: number,
  clientDevServerPort: number,
  webpackConfigurator: (config: Object) => Object,
};

export default async function loadConfig(): Promise<ConfigType> {
  let userConfig = {};

  try {
    userConfig = (await cosmiconfig('react-universal')).config;
  } catch (error) {
    // Just keep default config
  }

  const projectRoot = userConfig.projectRoot || process.cwd();
  const appRoot = userConfig.appRoot || path.resolve(projectRoot, 'app');

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
    webpackConfigurator: (config) => config,
    ...userConfig,
  };
}
