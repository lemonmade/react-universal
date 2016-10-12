// @flow

import fs from 'fs-extra';
import webpack from 'webpack';
import type {ConfigType} from '@lemonmade/react-universal-config';

import generateSchema from './schema';
import createWebpackConfig from '../webpack';
import type {BuildModeType} from '../types';

type BuildOptionsType = {
  mode?: BuildModeType,
};

export default async function handler(
  config: ConfigType,
  {mode = 'production'}: BuildOptionsType = {},
) {
  fs.emptyDirSync(config.buildDir);

  await generateSchema(config);

  const clientConfig = createWebpackConfig({target: 'client', mode}, config);
  const serverConfig = createWebpackConfig({target: 'server', mode}, config);

  const clientCompiler = webpack(clientConfig);
  const serverCompiler = webpack(serverConfig);

  await runCompiler(clientCompiler);
  await runCompiler(serverCompiler);
}

async function runCompiler(compiler) {
  await new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        console.log(stats.toString());
        reject(err);
        return;
      }

      resolve();
    });
  });
}
