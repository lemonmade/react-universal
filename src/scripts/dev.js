import path from 'path';

import createServer from './create';
import loadConfig from '../config';
import createHotEnv from '../server/hot';

export const command = 'dev';
export const describe = 'Run the hot-reloading development server';
export const builder = {};

export async function handler() {
  const config = await loadConfig();
  const server = createServer(config);

  const env = createHotEnv(server, config);
  await env.start();
}
