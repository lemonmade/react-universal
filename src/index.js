// @flow

import server from './server';
import config from './config';

export function createServer(appDetails) {
  return server(appDetails, config);
}
