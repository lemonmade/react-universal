// @flow

import path from 'path';
import loadConfig from '@lemonmade/react-universal-config';

import {start} from '../../server';

export const command = 'start';
export const describe = 'Run the production server';
export const builder = {};

export async function handler() {
  const config = await loadConfig();
  const createServer = require(path.join(config.dataDir, 'server', 'main.js'));
  const server = createServer(config);

  start(server, config);
}
