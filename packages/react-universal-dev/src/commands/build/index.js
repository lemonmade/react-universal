import fs from 'fs-extra';
import path from 'path';
import webpack from 'webpack';
import loadConfig from '@lemonmade/react-universal-config';

import generateBaseFiles from './generate';
import createWebpackConfig from '../../webpack';

export const command = 'build [mode]';
export const describe = 'Build the server and client bundles';
export const builder = {
  mode: {
    alias: 'm',
    choices: ['production', 'development'],
  },
};

export async function handler({mode = 'production'}) {
  const config = await loadConfig();

  generateBaseFiles(config);

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
