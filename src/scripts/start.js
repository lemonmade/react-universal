// @flow

import path from 'path';

import createServer from './create';
import loadConfig from '../config';
import startServer from '../server/start';

export const command = 'start';
export const describe = 'Run the production server';
export const builder = {};

export async function handler() {
  const config = await loadConfig();
  const server = createServer(config);

  startServer(server, config);
}
