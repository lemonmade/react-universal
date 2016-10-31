// @flow

import {join} from 'path';
import type {ConfigType} from '@lemonmade/react-universal-config';

export default async function start(config: ConfigType, ...rest: any): Promise<net$Server> {
  // $FlowIgnore: need the dynamic require here.
  const createServer = require(join(config.buildDir, 'server', 'main.js')).default;
  const app = await createServer(config, ...rest);
  return app.listen(config.serverPort);
}
