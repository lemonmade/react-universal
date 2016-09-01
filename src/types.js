// @flow

export type ConfigType = {
  projectRoot: string,
  appDir: string,
  dataDir: string,
  componentDir: string,
  sectionDir: string,
  serverPort: number,
  clientDevServerPort: number,
  webpackClientConfig: Object,
  webpackServerConfig: Object,
};
