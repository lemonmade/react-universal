// @flow

import {join} from 'path';
import type {ConfigType} from '@lemonmade/react-universal-config';

export default async function start(config: ConfigType, ...rest: any) {
  // $FlowIgnore: need the dynamic require here.
  const createServer = require(join(config.buildDir, 'server', 'main.js')).default;
  const app = await createServer(config, ...rest);
  const listener = app.listen(config.serverPort);
  return listener;
}
