// @flow

import path from 'path';
import loadConfig from '@lemonmade/react-universal-config';

import createHotEnv from './hot';

export const command = 'dev';
export const describe = 'Run the hot-reloading development server';
export const builder = {};

export async function handler() {
  const config = await loadConfig();
  const createServer = require(path.join(config.buildDir, 'server', 'main.js')).default;
  const server = createServer(config);

  const env = createHotEnv(server, config);
  await env.start();
}
